import assert from "node:assert/strict";
import test from "node:test";
import { getScoreRank, scoreActivity, scoreQuestion } from "../src/progress/scoringEngine.ts";

const perfect = { elapsedMs: 0, helpUses: 0, wrongAnswers: 0, longestWrongStreak: 0 };

test("awards at most 100 points to one quick first-try question", () => {
  assert.deepEqual(scoreQuestion({ ...perfect, elapsedMs: 8_000 }), { earned: 100, max: 100, percent: 100, rank: "excellent", rankLabel: "Xuất sắc", skipped: false });
});

test("subtracts deterministic time, help, wrong-answer and streak penalties per question", () => {
  const result = scoreQuestion({ elapsedMs: 20_000, helpUses: 1, wrongAnswers: 2, longestWrongStreak: 2 });
  assert.equal(result.earned, 61);
  assert.equal(result.rank, "passed");
});

test("caps penalties and normalizes invalid counters", () => {
  assert.equal(scoreQuestion({ elapsedMs: 999_000, helpUses: 99, wrongAnswers: 99, longestWrongStreak: 99 }).earned, 1);
  assert.equal(scoreQuestion({ elapsedMs: -1, helpUses: -4, wrongAnswers: Number.NaN, longestWrongStreak: -2 }).earned, 100);
});

test("assigns zero to skipped questions when a review starts at a weak question", () => {
  assert.deepEqual(scoreQuestion({ ...perfect, skipped: true }), { earned: 0, max: 100, percent: 0, rank: "practice", rankLabel: "Cần luyện thêm", skipped: true });
});

test("uses stable Vietnamese assessment bands at their boundaries", () => {
  assert.deepEqual([90, 89, 75, 74, 60, 59].map((value) => getScoreRank(value).rank), ["excellent", "good", "good", "passed", "passed", "practice"]);
});

test("aggregates question scores with a maximum of 100 per question", () => {
  const questions = Array.from({ length: 10 }, (_, index) => ({ ...perfect, wrongAnswers: index < 2 ? 1 : 0, longestWrongStreak: index < 2 ? 1 : 0 }));
  const result = scoreActivity(questions);
  assert.equal(result.earned, 984);
  assert.equal(result.max, 1_000);
  assert.equal(result.percent, 98);
  assert.equal(result.questionScores.length, 10);
});

test("accepts only supported 10, 15 or 20 question sessions", () => {
  assert.equal(scoreActivity(Array(15).fill(perfect)).max, 1_500);
  assert.equal(scoreActivity(Array(20).fill(perfect)).max, 2_000);
  assert.throws(() => scoreActivity(Array(5).fill(perfect)), /10, 15 or 20/);
});
