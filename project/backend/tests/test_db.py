import sqlite3
import shutil
import unittest
from dataclasses import replace
from datetime import date, timedelta
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from uuid import uuid4

from pydantic import ValidationError

from backend.app.db import DATABASE_SCHEMA_VERSION, STUDENT_BACKUP_FORMAT, UNIT_ACTIVITY_MAXIMA, UNIT_REQUIRED_PRACTICES, InvalidCredentialsError, ProgressRepository, UsernameTakenError, aggregate_course_summaries
from backend.app.curriculum import DEFAULT_COURSE_ID, course_catalog
from backend.app.main import BonusClaim, Credentials, PracticeConfirmation, ProgressUpdate, QuestionCheckpointUpdate, create_app


class DatabaseTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.database_path = Path(__file__).resolve().parent / f".test-{uuid4().hex}.db"
        self.repository = ProgressRepository(self.database_path)
        self.repository.initialize()

    def tearDown(self) -> None:
        self.database_path.unlink(missing_ok=True)
        shutil.rmtree(self.repository.backup_directory, ignore_errors=True)


class LegacyMigrationTests(DatabaseTestCase):
    def test_initialize_is_repeatable_and_preserves_legacy_progress(self) -> None:
        self.repository.save("student-1", "typing-quest", completed=True, score=90, xp=50)
        reopened = ProgressRepository(self.database_path)
        reopened.initialize()
        self.assertEqual(reopened.get("student-1", "typing-quest").score, 90)

    def test_schema_is_versioned_and_second_initialize_does_not_repeat_migration(self) -> None:
        self.assertEqual(self.repository.database_status(), {
            "schema_version": DATABASE_SCHEMA_VERSION,
            "supported_schema_version": DATABASE_SCHEMA_VERSION,
            "integrity": "ok",
        })
        backups_before = list(self.repository.backup_directory.glob("*.db"))
        self.repository.initialize()
        self.assertEqual(list(self.repository.backup_directory.glob("*.db")), backups_before)

    def test_unversioned_database_is_backed_up_before_being_adopted(self) -> None:
        connection = sqlite3.connect(self.database_path)
        connection.execute("PRAGMA user_version=0")
        connection.commit(); connection.close()
        self.repository.initialize()
        self.assertEqual(self.repository.database_status()["schema_version"], DATABASE_SCHEMA_VERSION)
        backups = list(self.repository.backup_directory.glob("english-quest-pre-migration-v0-to-v2-*.db"))
        self.assertEqual(len(backups), 1)
        backup = sqlite3.connect(backups[0])
        try:
            self.assertEqual(backup.execute("PRAGMA quick_check").fetchone()[0], "ok")
        finally:
            backup.close()

    def test_version_one_migrates_question_status_without_losing_rows(self) -> None:
        connection = sqlite3.connect(self.database_path)
        connection.execute("DROP TABLE activity_question_scores")
        connection.execute("""CREATE TABLE activity_question_scores (
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            unit_id TEXT NOT NULL, activity_id TEXT NOT NULL, question_index INTEGER NOT NULL,
            earned_score INTEGER NOT NULL CHECK (earned_score BETWEEN 0 AND 100),
            PRIMARY KEY (user_id, unit_id, activity_id, question_index))""")
        user_id = connection.execute("""INSERT INTO users(username,password_salt,password_hash,password_iterations,created_at)
            VALUES('legacy_student',X'01',X'02',1,'2026-11-01T00:00:00+00:00')""").lastrowid
        connection.execute("INSERT INTO activity_question_scores(user_id,unit_id,activity_id,question_index,earned_score) VALUES(?,?,?,?,?)",
                           (user_id, "unit1", "unit1-getting-dialogue", 0, 75))
        connection.execute("PRAGMA user_version=1")
        connection.commit(); connection.close()

        self.repository.initialize()
        migrated = sqlite3.connect(self.database_path)
        try:
            columns = {row[1] for row in migrated.execute("PRAGMA table_info(activity_question_scores)")}
            row = migrated.execute("SELECT earned_score,status FROM activity_question_scores WHERE user_id=?", (user_id,)).fetchone()
            self.assertIn("status", columns)
            self.assertEqual(row, (75, "scored"))
            self.assertEqual(migrated.execute("PRAGMA user_version").fetchone()[0], DATABASE_SCHEMA_VERSION)
        finally:
            migrated.close()
        self.assertEqual(len(list(self.repository.backup_directory.glob("english-quest-pre-migration-v1-to-v2-*.db"))), 1)

    def test_newer_database_schema_is_rejected(self) -> None:
        connection = sqlite3.connect(self.database_path)
        connection.execute(f"PRAGMA user_version={DATABASE_SCHEMA_VERSION + 1}")
        connection.commit(); connection.close()
        with self.assertRaises(RuntimeError):
            self.repository.initialize()


class StudentBackupTests(DatabaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.source = self.repository.register("source_student", "1234")
        self.target = self.repository.register("target_student", "5678")

    def test_backup_round_trip_merges_progress_without_credentials(self) -> None:
        activity_id = "unit1-getting-dialogue"
        scores = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
        self.repository.save_user_progress(
            self.source.id, "unit1", activity_id,
            earned_score=sum(scores), max_score=1000, completed=True,
            question_scores=scores, question_statuses=["scored"] * 10,
        )
        backup = self.repository.export_user_backup(self.source.id)
        serialized = str(backup).lower()
        self.assertEqual(backup["format"], STUDENT_BACKUP_FORMAT)
        self.assertNotIn("password", serialized)
        self.assertNotIn("session", serialized)

        result = self.repository.restore_user_backup(self.target.id, backup)
        self.assertTrue(result["restored"])
        self.assertTrue(result["snapshot_created"])
        self.assertEqual(result["source_username"], "source_student")
        target_summary = self.repository.unit_summary(self.target.id, "unit1")
        self.assertEqual(target_summary["earned_score"], sum(scores))
        self.assertTrue(target_summary["progress"][0]["completed"])
        self.assertEqual(len(target_summary["progress"][0]["question_scores"]), 10)
        self.assertEqual(len(list(self.repository.backup_directory.glob(f"student-{self.target.id}-pre-restore-*.json"))), 1)

        self.repository.restore_user_backup(self.target.id, backup)
        connection = sqlite3.connect(self.database_path)
        history_count = connection.execute("SELECT COUNT(*) FROM best_score_history WHERE user_id=?", (self.target.id,)).fetchone()[0]
        connection.close()
        self.assertEqual(history_count, 1)

    def test_restore_rejects_tampered_scores_before_writing(self) -> None:
        activity_id = "unit1-getting-dialogue"
        self.repository.save_user_progress(self.source.id, "unit1", activity_id, earned_score=500, max_score=1000, completed=False)
        backup = self.repository.export_user_backup(self.source.id)
        backup["data"]["user_progress"][0]["max_score"] = 999
        with self.assertRaises(ValueError):
            self.repository.restore_user_backup(self.target.id, backup)
        self.assertEqual(self.repository.unit_summary(self.target.id, "unit1")["earned_score"], 0)


class AccountRepositoryTests(DatabaseTestCase):
    def test_password_and_session_token_are_only_stored_as_hashes(self) -> None:
        user = self.repository.register("student_01", "1234")
        logged_in, token = self.repository.login("student_01", "1234")
        self.assertEqual(user.id, logged_in.id)
        self.assertEqual(self.repository.authenticate(token).username, "student_01")
        connection = sqlite3.connect(self.database_path)
        password_hash, salt = connection.execute("SELECT password_hash,password_salt FROM users").fetchone()
        token_hash = connection.execute("SELECT token_hash FROM sessions").fetchone()[0]
        connection.close()
        self.assertNotIn(b"1234", (password_hash, salt, token_hash))
        self.assertNotEqual(token_hash, token.encode())

    def test_duplicate_user_bad_password_and_logout(self) -> None:
        self.repository.register("student_02", "4567")
        with self.assertRaises(UsernameTakenError): self.repository.register("STUDENT_02", "4567")
        with self.assertRaises(InvalidCredentialsError): self.repository.login("student_02", "0000")
        _, token = self.repository.login("student_02", "4567")
        self.assertTrue(self.repository.logout(token))
        self.assertIsNone(self.repository.authenticate(token))

    def test_validates_credentials(self) -> None:
        for username, password in (("short", "1234"), ("bad name", "1234"), ("student_3", "12a4"), ("student_3", "1234567")):
            with self.subTest(username=username, password=password), self.assertRaises(ValueError):
                self.repository.register(username, password)


class ProgressAndStreakTests(DatabaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = self.repository.register("learner_01", "123456")

    def test_unit_summary_uses_planned_maximum_and_upserts(self) -> None:
        activity = "unit3-a-closer-look2-builder"
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=600, max_score=1000, completed=False)
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=800, max_score=1000, completed=True)
        summary = self.repository.unit_summary(self.user.id, "unit3")
        self.assertEqual((summary["earned_score"], summary["max_score"]), (800, 42500))
        self.assertEqual(summary["completion_percent"], 1.88)
        self.assertEqual(len(summary["progress"]), 1)

        replay = self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=700, max_score=1000, completed=True)
        self.assertEqual(replay.earned_score, 800)
        self.assertEqual(self.repository.unit_summary(self.user.id, "unit3")["earned_score"], 800)

    def test_streak_tracks_current_and_best_across_reopen(self) -> None:
        today = date(2026, 11, 6)
        activities = iter(UNIT_ACTIVITY_MAXIMA["unit1"])
        for offset in (5, 4, 3, 1, 0):
            self.repository.save_user_progress(self.user.id, "unit1", next(activities), earned_score=1000, max_score=1000, completed=True, studied_on=today-timedelta(days=offset))
        self.assertEqual(self.repository.streak(self.user.id, today=today), {"current_streak": 2, "best_streak": 3})
        reopened = ProgressRepository(self.database_path); reopened.initialize()
        self.assertEqual(reopened.streak(self.user.id, today=today)["best_streak"], 3)

    def test_rejects_score_above_maximum(self) -> None:
        with self.assertRaises(ValueError):
            self.repository.save_user_progress(self.user.id, "unit3", "game", earned_score=11, max_score=10, completed=True)
        with self.assertRaises(ValueError):
            self.repository.save_user_progress(self.user.id, "unit3", "unit3-a-closer-look2-builder", earned_score=1, max_score=10, completed=True)
        with self.assertRaises(ValueError):
            self.repository.save_user_progress(self.user.id, "unit3", "unknown-game", earned_score=1000, max_score=1000, completed=True)
        with self.assertRaises(ValueError):
            self.repository.save_user_progress(self.user.id, "future-unit", "future-game", earned_score=1000, max_score=1000, completed=True)
        with self.assertRaises(ValueError):
            self.repository.unit_summary(self.user.id, "future-unit")
        with self.assertRaises(ValueError):
            self.repository.bonus_state(self.user.id, "future-unit")

    def _complete_core(self, percent: int) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["unit3"].items():
            self.repository.save_user_progress(self.user.id, "unit3", activity_id, earned_score=maximum*percent//100, max_score=maximum, completed=True)

    def _confirm_practice(self) -> None:
        for activity_id in UNIT_REQUIRED_PRACTICES["unit3"]:
            self.repository.confirm_practice(self.user.id, "unit3", activity_id, elapsed_seconds=60)

    def test_bonus_standard_tier_locks_high_and_halves_low_game_reward(self) -> None:
        self._complete_core(80)
        self._confirm_practice()
        state = self.repository.bonus_state(self.user.id, "unit3")
        self.assertEqual((state["gate"], state["available_tier"], state["tier_locked"]), ("ready", "standard", None))
        state = self.repository.select_standard_bonus(self.user.id, "unit3")
        self.assertTrue(state["high_tier_locked_out"])
        result = self.repository.claim_bonus(self.user.id, "unit3", "treasure", earned_score=650, max_score=1000)
        self.assertIn(result["claim"]["reward_base"], {20000, 30000, 50000})
        self.assertEqual(result["claim"]["reward_awarded"], result["claim"]["reward_base"] // 2)
        with self.assertRaises(ValueError): self.repository.claim_bonus(self.user.id, "unit3", "detective", earned_score=900, max_score=1000)

    def test_bonus_high_tier_and_question_improvement_targets(self) -> None:
        self._complete_core(95)
        self._confirm_practice()
        activity = "unit3-a-closer-look1-context"
        question_scores = [100,45,80,95,100,100,90,90,80,70]
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=sum(question_scores), max_score=1000, completed=True, question_scores=question_scores)
        state = self.repository.bonus_state(self.user.id, "unit3")
        self.assertEqual((state["available_tier"], state["tier_locked"]), ("high", None))
        result = self.repository.claim_bonus(self.user.id, "unit3", "treasure", earned_score=900, max_score=1000)
        self.assertIn(result["claim"]["reward_awarded"], {50000, 100000, 150000})
        target = next(item for item in self.repository.unit_summary(self.user.id, "unit3")["improvement_targets"] if item["activity_id"] == activity)
        self.assertEqual(target["weak_questions"][0], {"question_index": 1, "earned_score": 45})

    def test_question_improvements_recalculate_from_best_score_per_position(self) -> None:
        activity = "unit3-a-closer-look1-context"
        first = [100, 20, 100, 20, 100, 20, 100, 20, 100, 20]
        second = [0, 90, 0, 90, 0, 90, 0, 90, 0, 90]
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=sum(first), max_score=1000, completed=True, question_scores=first)
        replay = self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=sum(second), max_score=1000, completed=True, question_scores=second)
        self.assertEqual(replay.earned_score, 950)
        self.assertEqual(self.repository.unit_summary(self.user.id, "unit3")["earned_score"], 950)

    def test_each_question_checkpoint_survives_reopening_before_activity_completion(self) -> None:
        activity = "unit3-a-closer-look1-context"
        saved = self.repository.save_question_progress(
            self.user.id, "unit3", activity, question_index=0, earned_score=75, question_status="scored")
        self.assertEqual((saved.earned_score, saved.max_score, saved.completed), (75, 1000, False))
        reopened = ProgressRepository(self.database_path); reopened.initialize()
        progress = next(item for item in reopened.unit_summary(self.user.id, "unit3")["progress"] if item["activity_id"] == activity)
        self.assertEqual(progress["question_scores"], [{"question_index": 0, "earned_score": 75, "status": "scored"}])
        self.assertFalse(progress["completed"])

    def test_partial_game_can_skip_or_replay_saved_questions_then_complete(self) -> None:
        activity = "unit3-a-closer-look1-context"
        self.repository.save_question_progress(self.user.id, "unit3", activity, question_index=0, earned_score=0, question_status="skipped")
        with self.assertRaisesRegex(ValueError, "all 10 questions"):
            self.repository.complete_user_activity(self.user.id, "unit3", activity)
        self.repository.save_question_progress(self.user.id, "unit3", activity, question_index=0, earned_score=80, question_status="scored")
        for index in range(1, 10):
            self.repository.save_question_progress(self.user.id, "unit3", activity, question_index=index, earned_score=100, question_status="scored")
        completed = self.repository.complete_user_activity(self.user.id, "unit3", activity)
        self.assertEqual((completed.earned_score, completed.completed), (980, True))
        progress = next(item for item in self.repository.unit_summary(self.user.id, "unit3")["progress"] if item["activity_id"] == activity)
        self.assertEqual(progress["question_scores"][0], {"question_index": 0, "earned_score": 80, "status": "scored"})

    def test_skipped_questions_are_distinct_and_profile_suggests_five_per_activity(self) -> None:
        activity = "unit3-a-closer-look1-context"
        scores = [0, 0, 0, 0, 0, 25, 40, 55, 70, 85]
        statuses = ["skipped"] * 5 + ["scored"] * 5
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=sum(scores),
            max_score=1000, completed=True, question_scores=scores, question_statuses=statuses)
        progress = next(item for item in self.repository.unit_summary(self.user.id, "unit3")["progress"] if item["activity_id"] == activity)
        self.assertEqual([item["status"] for item in progress["question_scores"][:5]], ["skipped"] * 5)
        recommendation = next(item for item in self.repository.score_profile(self.user.id)["recommendations"] if item["activity_id"] == activity)
        self.assertEqual([item["question_index"] for item in recommendation["skipped_questions"]], [0, 1, 2, 3, 4])
        self.assertEqual([item["earned_score"] for item in recommendation["weak_questions"]], [25, 40, 55, 70, 85])

    def test_bonus_requires_both_scored_practices_for_sixty_seconds_and_exact_ninety_is_high(self) -> None:
        self._complete_core(90)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit3")["gate"], "locked_practice")
        first, second = UNIT_REQUIRED_PRACTICES["unit3"]
        with self.assertRaises(ValueError): self.repository.confirm_practice(self.user.id, "unit3", first, elapsed_seconds=59)
        self.repository.confirm_practice(self.user.id, "unit3", first, elapsed_seconds=60)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit3")["gate"], "locked_practice")
        self.repository.confirm_practice(self.user.id, "unit3", second, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit3")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        summary = self.repository.unit_summary(self.user.id, "unit3")
        self.assertEqual(next(item for item in summary["progress"] if item["activity_id"] == first)["earned_score"], 1000)

    def test_score_profile_uses_branch_bests_and_only_records_improvements(self) -> None:
        activity = "unit3-a-closer-look2-builder"
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=400, max_score=1000, completed=True)
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=300, max_score=1000, completed=True)
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=700, max_score=1000, completed=True)
        self.repository.save_user_progress(self.user.id, "review1", "review1-language-grammar", earned_score=800, max_score=1000, completed=True)
        profile = self.repository.score_profile(self.user.id)
        self.assertEqual(profile["course_id"], DEFAULT_COURSE_ID)
        self.assertEqual((profile["course_best"]["earned_score"], profile["course_best"]["max_score"]), (1500, 264500))
        self.assertEqual([item["new_best"] for item in profile["best_history"] if item["activity_id"] == activity], [700, 400])
        self.assertEqual(next(branch for branch in profile["branches"] if branch["unit_id"] == "unit3")["earned_score"], 700)

    def test_course_profiles_filter_existing_progress_without_migrating_sqlite(self) -> None:
        activity = "unit3-a-closer-look2-builder"
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=700, max_score=1000, completed=True)
        current = self.repository.score_profile(self.user.id, "english-6-semester-1")
        semester2 = self.repository.score_profile(self.user.id, "english-6-semester-2")
        self.assertEqual(current["course_best"]["earned_score"], 700)
        self.assertEqual([branch["unit_id"] for branch in current["branches"]], list(course_catalog().course(DEFAULT_COURSE_ID).branch_ids))
        self.assertEqual(semester2["course_id"], "english-6-semester-2")
        self.assertEqual(semester2["course_best"]["earned_score"], 0)
        self.assertEqual([branch["unit_id"] for branch in semester2["branches"]], ["unit7", "unit8", "unit9", "review3", "unit10", "unit11", "unit12", "review4"])

    def test_score_overview_excludes_empty_planned_courses(self) -> None:
        activity = "unit3-a-closer-look2-builder"
        self.repository.save_user_progress(self.user.id, "unit3", activity, earned_score=700, max_score=1000, completed=True)
        overview = self.repository.score_overview(self.user.id)
        self.assertEqual([course["course_id"] for course in overview["courses"]], ["english-6-semester-1", "english-6-semester-2", "math-6-semester-1"])
        self.assertEqual([subject["subject"] for subject in overview["subjects"]], ["english", "math"])
        self.assertEqual(overview["grand_total"]["earned_score"], 700)
        self.assertEqual(overview["grand_total"]["max_score"], 530500)
        self.assertEqual(overview["subjects"][0]["max_score"], 528500)
        self.assertEqual(overview["subjects"][1]["max_score"], 2000)

    def test_score_overview_excludes_planned_course_even_if_it_has_draft_branches(self) -> None:
        current = course_catalog().course(DEFAULT_COURSE_ID)
        draft = replace(current, id="english-6-semester-draft", status="planned", branch_ids=("unit1",))
        with patch("backend.app.db.course_catalog", return_value=SimpleNamespace(courses=(current, draft))):
            overview = self.repository.score_overview(self.user.id)
        self.assertEqual([course["course_id"] for course in overview["courses"]], [DEFAULT_COURSE_ID])
        self.assertEqual(overview["subjects"][0]["course_count"], 1)

    def test_overview_groups_semesters_by_subject_and_keeps_grand_total(self) -> None:
        courses = [
            {"course_id": "english-s1", "subject": "english", "subject_label": "Tiếng Anh", "earned_score": 600, "max_score": 1000, "completed_activities": 6, "total_activities": 10, "bonus_reward_total": 50},
            {"course_id": "english-s2", "subject": "english", "subject_label": "Tiếng Anh", "earned_score": 800, "max_score": 1000, "completed_activities": 8, "total_activities": 10, "bonus_reward_total": 70},
            {"course_id": "math-s1", "subject": "math", "subject_label": "Toán", "earned_score": 900, "max_score": 1000, "completed_activities": 9, "total_activities": 10, "bonus_reward_total": 0},
        ]
        overview = aggregate_course_summaries(courses)
        english = next(subject for subject in overview["subjects"] if subject["subject"] == "english")
        self.assertEqual((english["earned_score"], english["max_score"], english["percent"], english["course_count"]), (1400, 2000, 70.0, 2))
        self.assertEqual((overview["grand_total"]["earned_score"], overview["grand_total"]["max_score"], overview["grand_total"]["bonus_reward_total"]), (2300, 3000, 120))

    def test_unit4_uses_its_own_42000_point_plan_and_sixty_second_practice_gate(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit4"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id in list(activities)[:17]:
            if activity_id in UNIT_REQUIRED_PRACTICES["unit4"]:
                continue
            self.repository.save_user_progress(self.user.id, "unit4", activity_id, earned_score=900, max_score=1000, completed=True)
        first = next(iter(UNIT_REQUIRED_PRACTICES["unit4"]))
        with self.assertRaises(ValueError):
            self.repository.confirm_practice(self.user.id, "unit4", first, elapsed_seconds=59)
        self.repository.confirm_practice(self.user.id, "unit4", first, elapsed_seconds=60)
        summary = self.repository.unit_summary(self.user.id, "unit4")
        self.assertEqual(summary["max_score"], 42000)
        self.assertFalse(summary["core_complete"])
        self.assertEqual(next(item for item in summary["progress"] if item["activity_id"] == first)["earned_score"], 1000)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit4")["gate"], "locked_incomplete")

    def test_unit1_has_a_separate_42000_point_plan_and_sixty_second_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit1"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id in list(activities)[:17]:
            if activity_id in UNIT_REQUIRED_PRACTICES["unit1"]:
                continue
            self.repository.save_user_progress(self.user.id, "unit1", activity_id, earned_score=900, max_score=1000, completed=True)
        first = next(iter(UNIT_REQUIRED_PRACTICES["unit1"]))
        with self.assertRaises(ValueError):
            self.repository.confirm_practice(self.user.id, "unit1", first, elapsed_seconds=59)
        self.repository.confirm_practice(self.user.id, "unit1", first, elapsed_seconds=60)
        summary = self.repository.unit_summary(self.user.id, "unit1")
        self.assertEqual(summary["max_score"], 42000)
        self.assertFalse(summary["core_complete"])
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit1")["gate"], "locked_incomplete")

    def test_unit1_bonus_opens_only_after_all_42_games_and_both_practices(self) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["unit1"].items():
            self.repository.save_user_progress(self.user.id, "unit1", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit1")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit1"]:
            self.repository.confirm_practice(self.user.id, "unit1", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit1")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit1")["progress"]), 42)

    def test_unit2_has_a_separate_42000_point_plan_and_sixty_second_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit2"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id in list(activities)[:17]:
            if activity_id in UNIT_REQUIRED_PRACTICES["unit2"]:
                continue
            self.repository.save_user_progress(self.user.id, "unit2", activity_id, earned_score=900, max_score=1000, completed=True)
        first = next(iter(UNIT_REQUIRED_PRACTICES["unit2"]))
        with self.assertRaises(ValueError):
            self.repository.confirm_practice(self.user.id, "unit2", first, elapsed_seconds=59)
        self.repository.confirm_practice(self.user.id, "unit2", first, elapsed_seconds=60)
        summary = self.repository.unit_summary(self.user.id, "unit2")
        self.assertEqual(summary["max_score"], 42000)
        self.assertFalse(summary["core_complete"])
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit2")["gate"], "locked_incomplete")

    def test_unit2_bonus_opens_only_after_all_42_games_and_both_practices(self) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["unit2"].items():
            self.repository.save_user_progress(self.user.id, "unit2", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit2")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit2"]:
            self.repository.confirm_practice(self.user.id, "unit2", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit2")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit2")["progress"]), 42)

    def test_unit4_bonus_opens_only_after_all_42_games_and_both_practices(self) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["unit4"].items():
            self.repository.save_user_progress(self.user.id, "unit4", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit4")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit4"]:
            self.repository.confirm_practice(self.user.id, "unit4", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit4")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit4")["progress"]), 42)

    def test_unit5_has_a_separate_42000_point_plan_and_sixty_second_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit5"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id in list(activities)[:17]:
            if activity_id in UNIT_REQUIRED_PRACTICES["unit5"]:
                continue
            self.repository.save_user_progress(self.user.id, "unit5", activity_id, earned_score=900, max_score=1000, completed=True)
        first = next(iter(UNIT_REQUIRED_PRACTICES["unit5"]))
        with self.assertRaises(ValueError):
            self.repository.confirm_practice(self.user.id, "unit5", first, elapsed_seconds=59)
        self.repository.confirm_practice(self.user.id, "unit5", first, elapsed_seconds=60)
        summary = self.repository.unit_summary(self.user.id, "unit5")
        self.assertEqual(summary["max_score"], 42000)
        self.assertFalse(summary["core_complete"])
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit5")["gate"], "locked_incomplete")

    def test_unit5_bonus_opens_only_after_all_42_games_and_both_practices(self) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["unit5"].items():
            self.repository.save_user_progress(self.user.id, "unit5", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit5")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit5"]:
            self.repository.confirm_practice(self.user.id, "unit5", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit5")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit5")["progress"]), 42)

    def test_unit6_has_a_separate_42000_point_plan_and_sixty_second_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit6"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id in list(activities)[:17]:
            if activity_id in UNIT_REQUIRED_PRACTICES["unit6"]:
                continue
            self.repository.save_user_progress(self.user.id, "unit6", activity_id, earned_score=900, max_score=1000, completed=True)
        first = next(iter(UNIT_REQUIRED_PRACTICES["unit6"]))
        with self.assertRaises(ValueError):
            self.repository.confirm_practice(self.user.id, "unit6", first, elapsed_seconds=59)
        self.repository.confirm_practice(self.user.id, "unit6", first, elapsed_seconds=60)
        summary = self.repository.unit_summary(self.user.id, "unit6")
        self.assertEqual(summary["max_score"], 42000)
        self.assertFalse(summary["core_complete"])
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit6")["gate"], "locked_incomplete")

    def test_unit6_bonus_opens_only_after_all_42_games_and_both_practices(self) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["unit6"].items():
            self.repository.save_user_progress(self.user.id, "unit6", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit6")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit6"]:
            self.repository.confirm_practice(self.user.id, "unit6", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit6")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit6")["progress"]), 42)

    def test_unit7_has_42000_points_and_bonus_requires_both_sound_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit7"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "unit7", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit7")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit7"]:
            self.repository.confirm_practice(self.user.id, "unit7", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit7")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit7")["progress"]), 42)

    def test_unit8_has_42000_points_and_bonus_requires_both_sound_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit8"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "unit8", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit8")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit8"]:
            self.repository.confirm_practice(self.user.id, "unit8", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit8")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit8")["progress"]), 42)

    def test_unit9_has_42000_points_and_bonus_requires_both_sound_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit9"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "unit9", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit9")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit9"]:
            self.repository.confirm_practice(self.user.id, "unit9", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit9")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))
        self.assertEqual(len(self.repository.unit_summary(self.user.id, "unit9")["progress"]), 42)

    def test_review3_has_separate_score_and_three_stage_bonus(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["review3"]
        self.assertEqual(len(activities), 6)
        self.assertEqual(sum(activities.values()), 6000)
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "review3", activity_id, earned_score=maximum, max_score=maximum, completed=True)
        state = self.repository.bonus_state(self.user.id, "review3")
        self.assertEqual((state["gate"], state["available_tier"], state["required_practice"]["complete"]), ("ready", "high", True))
        self.assertEqual(self.repository.unit_summary(self.user.id, "review3")["max_score"], 6000)

    def test_unit10_has_42000_points_and_bonus_requires_both_stress_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit10"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "unit10", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit10")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit10"]:
            self.repository.confirm_practice(self.user.id, "unit10", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit10")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))

    def test_unit11_has_42000_points_and_bonus_requires_both_rhythm_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit11"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "unit11", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit11")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit11"]:
            self.repository.confirm_practice(self.user.id, "unit11", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit11")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))

    def test_unit12_has_42000_points_and_bonus_requires_both_tone_practices(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["unit12"]
        self.assertEqual((len(activities), sum(activities.values())), (42, 42000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "unit12", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        self.assertEqual(self.repository.bonus_state(self.user.id, "unit12")["gate"], "locked_practice")
        for activity_id in UNIT_REQUIRED_PRACTICES["unit12"]:
            self.repository.confirm_practice(self.user.id, "unit12", activity_id, elapsed_seconds=60)
        state = self.repository.bonus_state(self.user.id, "unit12")
        self.assertEqual((state["gate"], state["available_tier"]), ("ready", "high"))

    def test_review4_has_separate_score_and_three_stage_bonus(self) -> None:
        activities = UNIT_ACTIVITY_MAXIMA["review4"]
        self.assertEqual((len(activities), sum(activities.values())), (6, 6000))
        for activity_id, maximum in activities.items():
            self.repository.save_user_progress(self.user.id, "review4", activity_id, earned_score=maximum, max_score=maximum, completed=True)
        state = self.repository.bonus_state(self.user.id, "review4")
        self.assertEqual((state["gate"], state["available_tier"], state["required_practice"]["complete"]), ("ready", "high", True))


    def test_math_bai1_v054_has_two_independent_1000_point_tests(self) -> None:
        unit_id = "math6-bai1-v054"
        plans = UNIT_ACTIVITY_MAXIMA[unit_id]
        self.assertEqual(plans, {"math6-bai1-v054-kn1": 1000, "math6-bai1-v054-kn2": 1000})
        a = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
        self.repository.save_user_progress(self.user.id, unit_id, "math6-bai1-v054-kn1",
                                           earned_score=sum(a), max_score=1000, completed=True, question_scores=a)
        profile = self.repository.score_profile(self.user.id, "math-6-semester-1")
        self.assertEqual((profile["course_best"]["earned_score"], profile["course_best"]["max_score"]),
                         (sum(a), 2000))
        overview = self.repository.score_overview(self.user.id)
        self.assertEqual(next(s for s in overview["subjects"] if s["subject"] == "math")["earned_score"],sum(a))
        self.assertEqual(next(s for s in overview["subjects"] if s["subject"] == "english")["earned_score"],0)
        # Across randomized quizzes, a new attempt must not inflate the
        # score by merging unrelated question positions.
        self.repository.save_user_progress(self.user.id, unit_id, "math6-bai1-v054-kn2",
                                           earned_score=700, max_score=1000, completed=True)
        self.repository.save_user_progress(self.user.id, unit_id, "math6-bai1-v054-kn2",
                                           earned_score=650, max_score=1000, completed=True)
        math_summary = self.repository.score_profile(self.user.id, "math-6-semester-1")
        self.assertEqual(math_summary["course_best"]["earned_score"], sum(a)+700)

    def test_only_english_branches_are_openable_and_legacy_plans_remain_for_history(self) -> None:
        # Retiring other subjects must not make archived records or their score
        # definitions disappear during a future profile migration/restore.
        self.assertIn("math6-s1-lesson1", UNIT_ACTIVITY_MAXIMA)
        self.assertIn("science6-l01", UNIT_ACTIVITY_MAXIMA)
        self.assertIn("informatics6-s1-lesson1", UNIT_ACTIVITY_MAXIMA)
        self.assertIn("vietnamese6-s1-lesson1", UNIT_ACTIVITY_MAXIMA)
        with self.assertRaises(ValueError):
            self.repository.unit_summary(self.user.id, "math6-s1-lesson1")
        self.assertEqual(self.repository.unit_summary(self.user.id, "unit1")["max_score"], 42000)

    def test_review1_has_separate_score_and_three_stage_bonus_without_practice_gate(self) -> None:
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["review1"].items():
            self.repository.save_user_progress(self.user.id, "review1", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        review = self.repository.unit_summary(self.user.id, "review1")
        unit3 = self.repository.unit_summary(self.user.id, "unit3")
        self.assertEqual((review["earned_score"], review["max_score"], review["completion_percent"]), (5400, 6000, 90))
        self.assertEqual(unit3["earned_score"], 0)
        state = self.repository.bonus_state(self.user.id, "review1")
        self.assertEqual((state["gate"], state["available_tier"], state["required_practice"]["complete"]), ("ready", "high", True))
        for stage_id in ("treasure", "boss", "detective"):
            claim = self.repository.claim_bonus(self.user.id, "review1", stage_id, earned_score=900, max_score=1000)
            self.assertEqual(claim["claim"]["stage_id"], stage_id)
        self.assertIsNone(self.repository.bonus_state(self.user.id, "review1")["next_stage"])

    def test_review2_follows_unit6_with_separate_score_and_bonus(self) -> None:
        self.assertEqual((len(UNIT_ACTIVITY_MAXIMA["review2"]), sum(UNIT_ACTIVITY_MAXIMA["review2"].values())), (6, 6000))
        for activity_id, maximum in UNIT_ACTIVITY_MAXIMA["review2"].items():
            self.repository.save_user_progress(self.user.id, "review2", activity_id, earned_score=maximum * 90 // 100, max_score=maximum, completed=True)
        review = self.repository.unit_summary(self.user.id, "review2")
        unit6 = self.repository.unit_summary(self.user.id, "unit6")
        self.assertEqual((review["earned_score"], review["max_score"], review["completion_percent"]), (5400, 6000, 90))
        self.assertEqual(unit6["earned_score"], 0)
        state = self.repository.bonus_state(self.user.id, "review2")
        self.assertEqual((state["gate"], state["available_tier"], state["required_practice"]["complete"]), ("ready", "high", True))


class SchemaTests(unittest.TestCase):
    def test_strict_credentials_and_progress(self) -> None:
        self.assertEqual(Credentials(username="student_01", password="1234").password, "1234")
        self.assertEqual(ProgressUpdate(earned_score=2, max_score=3, completed=True).earned_score, 2)
        self.assertEqual(BonusClaim(earned_score=700).max_score, 1000)
        self.assertEqual(PracticeConfirmation(elapsed_seconds=60).elapsed_seconds, 60)
        self.assertEqual(QuestionCheckpointUpdate(earned_score=75, status="scored").earned_score, 75)
        for factory in (
            lambda: Credentials(username="short", password="1234"),
            lambda: Credentials(username="student_01", password=1234),
            lambda: ProgressUpdate(earned_score=True, max_score=3, completed=True),
            lambda: ProgressUpdate(earned_score=2, max_score="3", completed=True),
            lambda: ProgressUpdate(earned_score=2, max_score=3, completed="true"),
            lambda: ProgressUpdate(earned_score=2, max_score=3, completed=True, extra=1),
        ):
            with self.assertRaises(ValidationError): factory()


class ApiContractTests(DatabaseTestCase):
    def test_routes_and_local_cors_are_registered(self) -> None:
        app = create_app(self.database_path)
        routes = {(method, route.path) for route in app.routes for method in getattr(route, "methods", set())}
        for expected in (
            ("POST", "/auth/register"), ("POST", "/auth/login"), ("POST", "/auth/logout"),
            ("GET", "/courses"), ("GET", "/auth/me"), ("GET", "/profile/scores"), ("GET", "/profile/overview"),
            ("GET", "/profile/backup"), ("POST", "/profile/backup/restore"),
            ("GET", "/courses/{course_id}/profile"), ("PUT", "/progress/{unit_id}/{activity_id}"),
            ("PUT", "/progress/{unit_id}/{activity_id}/questions/{question_index}"),
            ("POST", "/progress/{unit_id}/{activity_id}/complete"),
            ("GET", "/units/{unit_id}/summary"),
            ("GET", "/bonus/{unit_id}"), ("POST", "/bonus/{unit_id}/select-standard"),
            ("POST", "/bonus/{unit_id}/{stage_id}/claim"),
            ("POST", "/practice/{unit_id}/{activity_id}/confirm"),
        ):
            self.assertIn(expected, routes)
        cors = next(item for item in app.user_middleware if item.cls.__name__ == "CORSMiddleware")
        origins = cors.kwargs["allow_origins"]
        self.assertIn("http://127.0.0.1:5173", origins)
        self.assertIn("http://localhost:4173", origins)
        self.assertNotIn("https://example.com", origins)

    def test_authenticated_routes_resolve_user_as_a_dependency(self) -> None:
        app = create_app(self.database_path)
        protected = {"/auth/me", "/profile/scores", "/profile/overview", "/profile/backup", "/profile/backup/restore", "/courses/{course_id}/profile", "/progress/{unit_id}/{activity_id}", "/progress/{unit_id}/{activity_id}/questions/{question_index}", "/progress/{unit_id}/{activity_id}/complete", "/units/{unit_id}/summary", "/bonus/{unit_id}", "/bonus/{unit_id}/select-standard", "/bonus/{unit_id}/{stage_id}/claim", "/practice/{unit_id}/{activity_id}/confirm"}
        routes = [route for route in app.routes if route.path in protected]
        self.assertEqual({route.path for route in routes}, protected)

        def nested_query_names(dependant) -> set[str]:
            names = {parameter.name for parameter in dependant.query_params}
            for dependency in dependant.dependencies:
                names.update(nested_query_names(dependency))
            return names

        for route in routes:
            self.assertFalse({"user", "token"} & nested_query_names(route.dependant))
            self.assertTrue(any(dependency.name == "user" for dependency in route.dependant.dependencies))

    def test_openapi_schema_is_generated(self) -> None:
        schema = create_app(self.database_path).openapi()
        self.assertIn("/auth/logout", schema["paths"])
        self.assertIn("/progress/{unit_id}/{activity_id}/questions/{question_index}", schema["paths"])
        self.assertIn("/progress/{unit_id}/{activity_id}/complete", schema["paths"])
        self.assertIn("/practice/{unit_id}/{activity_id}/confirm", schema["paths"])
        self.assertIn("/profile/scores", schema["paths"])
        self.assertIn("/profile/overview", schema["paths"])
        self.assertIn("/profile/backup", schema["paths"])
        self.assertIn("/profile/backup/restore", schema["paths"])
        self.assertIn("/courses", schema["paths"])
        self.assertIn("/courses/{course_id}/profile", schema["paths"])


class CourseCatalogTests(unittest.TestCase):
    def test_catalog_contains_only_two_english_semesters(self) -> None:
        catalog = course_catalog()
        self.assertEqual(catalog.default_course_id, "english-6-semester-1")
        self.assertEqual([course.id for course in catalog.courses], [
            "english-6-semester-1", "english-6-semester-2", "math-6-semester-1",
        ])
        self.assertEqual([course.subject for course in catalog.courses], ["english", "english", "math"])
        self.assertTrue(all(course.status == "available" for course in catalog.courses))
        self.assertEqual(catalog.courses[0].branch_ids, ("unit1", "unit2", "unit3", "review1", "unit4", "unit5", "unit6", "review2"))
        self.assertEqual(catalog.courses[1].branch_ids, ("unit7", "unit8", "unit9", "review3", "unit10", "unit11", "unit12", "review4"))
        self.assertEqual(catalog.courses[2].branch_ids, ("math6-bai1-v054",))
        available_branches = {branch for course in catalog.courses for branch in course.branch_ids}
        self.assertTrue(available_branches.issubset(set(UNIT_ACTIVITY_MAXIMA)))
        self.assertFalse({"math6-s1-lesson1", "science6-l01", "informatics6-s1-lesson1", "vietnamese6-s1-lesson1"} & available_branches)


if __name__ == "__main__": unittest.main()
