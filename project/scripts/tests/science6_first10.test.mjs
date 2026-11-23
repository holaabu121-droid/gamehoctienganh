import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

import { evaluateAsTeacher, simulateStudent } from "../lib/science6PilotAudit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const expectedIds = Array.from({ length: 10 }, (_, index) => `science6-l${String(index + 1).padStart(2, "0")}`);
const expectedLevels = ["basic", "basic", "basic", "understanding", "understanding", "understanding", "understanding", "application", "application", "challenge"];
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const firstTenEntries = manifest.lessons.filter((entry) => entry.lesson_number <= 10);
const lessons = await Promise.all(firstTenEntries.map(async (entry) => JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))));

test("Bài 1-10 có đủ và đúng thứ tự", () => {
  assert.equal(manifest.status, "integrated");
  assert.deepEqual(firstTenEntries.map((entry) => entry.lesson_id), expectedIds);
  assert.deepEqual(firstTenEntries.map((entry) => entry.lesson_number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(lessons.length, 10);
});

test("mỗi bài đạt 5 chặng, 10 thẻ, 6 năng lực và 60 câu", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.foundations.length, 5, lesson.lesson_id);
    assert.equal(lesson.foundations.flatMap((stage) => stage.cards).length, 10, lesson.lesson_id);
    assert.equal(lesson.competencies.length, 6, lesson.lesson_id);
    assert.equal(lesson.competencies.flatMap((game) => game.rounds).length, 60, lesson.lesson_id);
  }
});

test("tất cả 60 game đi đúng lộ trình 3-4-2-1", () => {
  for (const lesson of lessons) {
    for (const game of lesson.competencies) {
      assert.deepEqual(game.rounds.map((round) => round.level), expectedLevels, `${lesson.lesson_id}/${game.id}`);
    }
  }
});

test("600 câu có đáp án hợp lệ và 1.800 phản hồi chẩn đoán", () => {
  const rounds = lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds));
  assert.equal(rounds.length, 600);
  assert.equal(new Set(rounds.map((round) => round.id)).size, 600);
  let feedbackCount = 0;
  for (const round of rounds) {
    assert.equal(round.options.length, 4, round.id);
    assert.equal(new Set(round.options).size, 4, round.id);
    assert.ok(round.options.includes(round.answer), round.id);
    const wrongOptions = round.options.filter((option) => option !== round.answer);
    assert.equal(wrongOptions.length, 3, round.id);
    for (const option of wrongOptions) {
      const feedback = round.wrong_feedback[option];
      assert.ok(feedback?.why_wrong_vi && feedback?.fix_vi && feedback?.review_card_id && feedback?.diagnostic_tag, round.id);
      feedbackCount += 1;
    }
  }
  assert.equal(feedbackCount, 1800);
});

test("thực hành và mô phỏng của 10 bài đều không tạo điểm", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.practical_application.scored, false, lesson.lesson_id);
    assert.equal(lesson.simulation.scored, false, lesson.lesson_id);
    assert.equal(lesson.scoring_policy.practical_application_points, 0, lesson.lesson_id);
    assert.match(lesson.practical_application.warning_vi, /cho phép/i, lesson.lesson_id);
    assert.ok(["adult", "teacher"].includes(lesson.practical_application.supervision), lesson.lesson_id);
  }
});

test("mô phỏng học sinh hoàn thành trọn bộ Bài 1-10", () => {
  const result = simulateStudent(lessons);
  assert.equal(result.passed, true);
  assert.equal(result.lessons_completed, 10);
  assert.equal(result.games_completed, 60);
  assert.equal(result.questions_completed, 600);
  assert.equal(result.diagnostic_feedback_received, 600);
  assert.equal(result.corrected_answers, 600);
  assert.deepEqual(result.level_counts, { basic: 180, understanding: 240, application: 120, challenge: 60 });
  assert.equal(result.practical_application_points, 0);
});

test("đánh giá cấu trúc giáo viên đạt và có ghi chú cho đủ 10 bài", () => {
  const result = evaluateAsTeacher(lessons);
  assert.equal(result.automated_structural_score, 5);
  assert.equal(result.lesson_notes.length, 10);
  assert.ok(result.lesson_notes.every((item) => item.note_vi));
  assert.match(result.review_status, /not-human-teacher-validation/);
});

test("mỗi bài có báo cáo kiểm thử PASS riêng", async () => {
  for (const lessonId of expectedIds) {
    const report = JSON.parse(await readFile(path.join(PACK_DIR, "reports", "lessons", `${lessonId}.validation.json`), "utf8"));
    assert.equal(report.status, "PASS", lessonId);
    assert.equal(report.lesson_id, lessonId);
    assert.equal(report.counts.questions, 60, lessonId);
    assert.equal(report.practical_application_scored, false, lessonId);
  }
});
