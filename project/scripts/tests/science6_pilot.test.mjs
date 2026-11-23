import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

import { evaluateAsTeacher, simulateStudent } from "../lib/science6PilotAudit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const lessons = await Promise.all(manifest.lessons.map(async (entry) => JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))));

test("gói khoa học hoàn chỉnh đã được đăng ký vào ứng dụng chính", () => {
  assert.equal(manifest.status, "integrated");
  assert.deepEqual(manifest.integration, {
    catalog_registered: true,
    renderer_registered: true,
    activity_plan_registered: true,
  });
  assert.equal(manifest.scoring.practical_application_scored, false);
  assert.equal(lessons.length, manifest.completed_lesson_count);
  assert.ok(lessons.length >= 8);
});

test("mỗi bài có 5 chặng, 10 thẻ và 6 năng lực x 10 câu", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.foundations.length, 5, lesson.lesson_id);
    assert.equal(lesson.foundations.flatMap((stage) => stage.cards).length, 10, lesson.lesson_id);
    assert.equal(lesson.competencies.length, 6, lesson.lesson_id);
    for (const game of lesson.competencies) assert.equal(game.rounds.length, 10, `${lesson.lesson_id}/${game.id}`);
  }
});

test("từng game theo đúng lộ trình 3-4-2-1", () => {
  const expected = ["basic", "basic", "basic", "understanding", "understanding", "understanding", "understanding", "application", "application", "challenge"];
  for (const lesson of lessons) {
    for (const game of lesson.competencies) assert.deepEqual(game.rounds.map((round) => round.level), expected, `${lesson.lesson_id}/${game.id}`);
  }
});

test("mức độ khó có thao tác tư duy tăng dần và representation có payload", () => {
  const steps = { basic: 1, understanding: 2, application: 3, challenge: 4 };
  for (const lesson of lessons) {
    for (const game of lesson.competencies) {
      for (const round of game.rounds) {
        assert.equal(round.difficulty_evidence.required_actions.length, steps[round.level], round.id);
        assert.ok(round.representation.type, round.id);
        assert.ok(round.representation.title_vi, round.id);
        assert.ok(Object.keys(round.representation).length >= 6, round.id);
        if (round.level === "challenge") {
          assert.match(round.prompt_vi, /^Đánh giá/, round.id);
          assert.match(round.answer, /\(1\).*\(2\).*\(3\).*\(4\)/, round.id);
        }
        if (round.level === "application") assert.match(round.prompt_vi, /^Vận dụng/, round.id);
        if (round.representation.type === "classification-grid") {
          assert.ok(round.representation.criterion_vi, round.id);
          assert.ok(round.representation.target_group_vi, round.id);
          assert.ok(round.representation.rule_vi, round.id);
        }
      }
    }
  }
});

test("mỗi đáp án sai có phản hồi chẩn đoán riêng", () => {
  for (const lesson of lessons) {
    for (const game of lesson.competencies) {
      for (const round of game.rounds) {
        const wrong = round.options.filter((option) => option !== round.answer);
        assert.equal(wrong.length, 3, round.id);
        for (const option of wrong) {
          const feedback = round.wrong_feedback[option];
          assert.ok(feedback?.error_type_vi, round.id);
          assert.ok(feedback?.why_wrong_vi, round.id);
          assert.ok(feedback?.fix_vi, round.id);
          assert.ok(feedback?.review_card_id, round.id);
          assert.ok(feedback?.diagnostic_tag, round.id);
        }
        assert.equal(new Set(wrong.map((option) => round.wrong_feedback[option].diagnostic_tag)).size, 3, round.id);
      }
    }
  }
});

test("ứng dụng thực tế không chấm điểm và luôn có cảnh báo giám sát", () => {
  for (const lesson of lessons) {
    const practical = lesson.practical_application;
    assert.equal(practical.scored, false, lesson.lesson_id);
    assert.equal(lesson.scoring_policy.practical_application_points, 0, lesson.lesson_id);
    assert.ok(["adult", "teacher"].includes(practical.supervision), lesson.lesson_id);
    assert.match(practical.warning_vi, /cho phép/i, lesson.lesson_id);
    assert.ok(practical.prohibited_actions.length >= 3, lesson.lesson_id);
  }
});

test("lượt học sinh mô phỏng hoàn thành mọi câu và nhận đủ phản hồi", () => {
  const result = simulateStudent(lessons);
  const lessonCount = lessons.length;
  assert.equal(result.passed, true);
  assert.equal(result.lessons_completed, lessonCount);
  assert.equal(result.games_completed, lessonCount * 6);
  assert.equal(result.questions_completed, lessonCount * 60);
  assert.equal(result.intentional_wrong_attempts, lessonCount * 60);
  assert.equal(result.diagnostic_feedback_received, lessonCount * 60);
  assert.equal(result.corrected_answers, lessonCount * 60);
  assert.deepEqual(result.level_counts, { basic: lessonCount * 18, understanding: lessonCount * 24, application: lessonCount * 12, challenge: lessonCount * 6 });
  assert.equal(result.practical_application_points, 0);
});

test("đánh giá vai trò giáo viên chỉ chấm cấu trúc và ghi rõ chưa có nghiệm thu thật", () => {
  const result = evaluateAsTeacher(lessons);
  assert.equal(result.automated_structural_score, 5);
  assert.match(result.review_status, /not-human-teacher-validation/);
  assert.ok(result.limitations.some((item) => item.toLowerCase().includes("mô phỏng")));
  assert.equal(result.lesson_notes.length, lessons.length);
  assert.ok(result.lesson_notes.every((item) => item.note_vi));
});
