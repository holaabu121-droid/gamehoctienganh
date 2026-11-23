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
const expectedIds = Array.from({ length: 55 }, (_, index) => `science6-l${String(index + 1).padStart(2, "0")}`);

test("gói tích hợp có đủ Bài 1-55 theo đúng thứ tự", () => {
  assert.equal(manifest.status, "integrated");
  assert.equal(manifest.target_lesson_count, 55);
  assert.equal(manifest.completed_lesson_count, 55);
  assert.equal(manifest.content_version, "1.1.0");
  assert.equal(manifest.presentation_templates.length, 18);
  assert.deepEqual(manifest.lessons.map((entry) => entry.lesson_id), expectedIds);
  assert.equal(lessons.length, 55);
  assert.deepEqual(manifest.integration, { catalog_registered: true, renderer_registered: true, activity_plan_registered: true });
});

test("đủ 275 chặng, 550 thẻ, 330 game và 3.300 câu", () => {
  assert.equal(lessons.reduce((sum, lesson) => sum + lesson.foundations.length, 0), 275);
  assert.equal(lessons.flatMap((lesson) => lesson.foundations.flatMap((stage) => stage.cards)).length, 550);
  assert.equal(lessons.flatMap((lesson) => lesson.competencies).length, 330);
  assert.equal(lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds)).length, 3300);
});

test("phân bố độ khó toàn bộ đúng 990-1320-660-330", () => {
  const counts = { basic: 0, understanding: 0, application: 0, challenge: 0 };
  for (const lesson of lessons) for (const game of lesson.competencies) for (const round of game.rounds) counts[round.level] += 1;
  assert.deepEqual(counts, { basic: 990, understanding: 1320, application: 660, challenge: 330 });
});

test("3.300 câu có ID duy nhất, đáp án hợp lệ và 9.900 phản hồi", () => {
  const rounds = lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds));
  assert.equal(new Set(rounds.map((round) => round.id)).size, 3300);
  let feedbackCount = 0;
  for (const round of rounds) {
    assert.equal(round.options.length, 4, round.id);
    assert.equal(new Set(round.options).size, 4, round.id);
    assert.ok(round.options.includes(round.answer), round.id);
    assert.equal(round.grounding.policy, "reviewed-foundation-only-no-external-claim", round.id);
    assert.deepEqual(round.grounding.unsupported_external_claims, [], round.id);
    const wrong = round.options.filter((option) => option !== round.answer);
    assert.equal(wrong.length, 3, round.id);
    assert.equal(new Set(wrong.map((option) => round.wrong_feedback[option]?.diagnostic_tag)).size, 3, round.id);
    for (const option of wrong) {
      const feedback = round.wrong_feedback[option];
      assert.equal(feedback?.option_status, "intentionally-incorrect-distractor", round.id);
      assert.ok(feedback?.error_type_vi && feedback?.why_wrong_vi && feedback?.fix_vi && feedback?.review_card_id, round.id);
      feedbackCount += 1;
    }
  }
  assert.equal(feedbackCount, 9900);
});

test("55 thực hành và 55 mô phỏng đều không chấm điểm, có giám sát", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.practical_application.scored, false, lesson.lesson_id);
    assert.equal(lesson.simulation.scored, false, lesson.lesson_id);
    assert.equal(lesson.scoring_policy.practical_application_points, 0, lesson.lesson_id);
    assert.match(lesson.practical_application.warning_vi, /cho phép/i, lesson.lesson_id);
    assert.ok(["adult", "teacher"].includes(lesson.practical_application.supervision), lesson.lesson_id);
    assert.ok(lesson.practical_application.prohibited_actions.length >= 3, lesson.lesson_id);
  }
});

test("mô phỏng học sinh hoàn thành 3.300 câu và sửa đủ lỗi", () => {
  const result = simulateStudent(lessons);
  assert.equal(result.passed, true);
  assert.equal(result.lessons_completed, 55);
  assert.equal(result.games_completed, 330);
  assert.equal(result.questions_completed, 3300);
  assert.equal(result.diagnostic_feedback_received, 3300);
  assert.equal(result.corrected_answers, 3300);
  assert.equal(result.practical_application_points, 0);
});

test("đánh giá cấu trúc giáo viên đạt đủ 55 bài", () => {
  const result = evaluateAsTeacher(lessons);
  assert.equal(result.automated_structural_score, 5);
  assert.equal(result.lesson_notes.length, 55);
  assert.ok(result.lesson_notes.every((entry) => entry.note_vi));
});

test("đủ 55 báo cáo PASS riêng", async () => {
  for (const lessonId of expectedIds) {
    const report = JSON.parse(await readFile(path.join(PACK_DIR, "reports", "lessons", `${lessonId}.validation.json`), "utf8"));
    assert.equal(report.status, "PASS", lessonId);
    assert.equal(report.lesson_id, lessonId);
    assert.equal(report.counts.questions, 60, lessonId);
  }
});
