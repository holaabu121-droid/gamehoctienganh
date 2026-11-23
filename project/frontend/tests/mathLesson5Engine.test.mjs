import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateStructuredMathLesson } from "../src/features/math6/structuredMathLessonEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_lesson5.json", import.meta.url), "utf8"));
const build = () => validateStructuredMathLesson(raw, { lessonId: "math6-s1-lesson5", lessonNumber: 5, pageLabel: "trang 17–19" });
const containsAnchor = (round, anchor) => `${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Math 6 lesson 5 builds six scored games of ten rounds", () => {
  const lesson = build();
  assert.deepEqual(lesson.gameIds, ["terms", "multiplication", "smart-product", "division", "remainder", "word-problem"]);
  assert.ok(Object.values(lesson.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
  assert.ok(lesson.meta.every((game) => game.activityId.startsWith("math6-s1-lesson5-")));
});

test("Math 6 lesson 5 preserves calculations and exercises 1.23 to 1.30", () => {
  const lesson = build();
  assert.deepEqual(lesson.rounds.multiplication.slice(1, 5).map((item) => item.answer), ["21 873", "12 831", "213 785", "169 500"]);
  for (const [round, anchor] of [[lesson.rounds["smart-product"][0], "600"], [lesson.rounds["smart-product"][1], "8 001 000"], [lesson.rounds["smart-product"][4], "12 625"], [lesson.rounds.division[0], "37"], [lesson.rounds.division[1], "21"], ...lesson.rounds.remainder.slice(0, 4).map((round, index) => [round, ["35 dư 85", "61 dư 10", "121 dư 2", "10 dư 37"][index]]), ...lesson.rounds["word-problem"].slice(2, 7).map((round, index) => [round, ["2 200", "3 640 128", "200", "29", "11"][index]])]) assert.ok(containsAnchor(round, anchor));
});

test("Math 6 lesson 5 teaches multiplication, division and valid remainders", () => {
  const lesson = build();
  const all = Object.values(lesson.rounds).flat();
  assert.equal(lesson.foundations.length, 5);
  assert.ok(lesson.gameIds.every((id) => lesson.help[id].source_title.includes("trang 17–19") && lesson.help[id].teaching_vi));
  assert.ok(all.every((round) => round.context_vi && round.prompt_vi && round.explanation_vi));
  assert.ok(all.some((round) => containsAnchor(round, "0 ≤ r < b")));
  assert.ok(all.some((round) => round.answer === "b ≠ 0"));
  assert.ok(all.some((round) => round.source_status === "user-provided-reference"));
  assert.ok(all.some((round) => round.source_status === "ai-generated"));
});

test("Math 6 lesson 5 is connected after lesson 4 with a 6000-point plan", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  assert.deepEqual(math.branch_ids.slice(0, 7), ["math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5", "math6-s1-chapter1-practice", "math6-s1-chapter1-review"]);
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.ok(app.includes("<MathLesson5 />"));
  assert.ok(registry.includes('"math6-s1-lesson5"'));
  assert.equal(db.match(/"math6-s1-lesson5-(?:terms|multiplication|smart-product|division|remainder|word-problem)": 1000/g)?.length, 6);
});
