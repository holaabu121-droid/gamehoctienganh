import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateStructuredMathLesson } from "../src/features/math6/structuredMathLessonEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_lesson4.json", import.meta.url), "utf8"));
const build = () => validateStructuredMathLesson(raw, { lessonId: "math6-s1-lesson4", lessonNumber: 4, pageLabel: "trang 15–16" });
const containsAnchor = (round, anchor) => `${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Math 6 lesson 4 builds six scored games of ten rounds", () => {
  const lesson = build();
  assert.deepEqual(lesson.gameIds, ["terms", "addition", "smart-sum", "subtraction", "find-x", "word-problem"]);
  assert.ok(Object.values(lesson.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
  assert.ok(lesson.meta.every((game) => game.activityId.startsWith("math6-s1-lesson4-")));
});

test("Math 6 lesson 4 preserves textbook calculations and exercises 1.17 to 1.22", () => {
  const lesson = build();
  assert.equal(lesson.rounds.addition[0].answer, "69");
  assert.equal(lesson.rounds.addition[1].answer, "208");
  for (const [round, anchor] of [[lesson.rounds.subtraction[1], "698 700"], [lesson.rounds.subtraction[2], "820 252"], [lesson.rounds["smart-sum"][0], "800"], [lesson.rounds["smart-sum"][1], "1 100"], [lesson.rounds["smart-sum"][2], "1 040"], [lesson.rounds["find-x"][0], "355"], [lesson.rounds["find-x"][1], "10"], [lesson.rounds["find-x"][2], "60"], [lesson.rounds["word-problem"][2], "97 338 579"], [lesson.rounds["word-problem"][3], "12 810 400"]]) assert.ok(containsAnchor(round, anchor));
});

test("Math 6 lesson 4 teaches terms, properties, natural subtraction and feedback", () => {
  const lesson = build();
  const all = Object.values(lesson.rounds).flat();
  assert.equal(lesson.foundations.length, 5);
  assert.ok(lesson.gameIds.every((id) => lesson.help[id].source_title.includes("trang 15–16") && lesson.help[id].teaching_vi));
  assert.ok(all.every((round) => round.context_vi && round.prompt_vi && round.explanation_vi));
  assert.ok(all.some((round) => containsAnchor(round, "Không thực hiện được trong ℕ")));
  assert.ok(all.some((round) => containsAnchor(round, "a - b = c")));
  assert.ok(all.some((round) => round.source_status === "user-provided-reference"));
  assert.ok(all.some((round) => round.source_status === "ai-generated"));
});

test("Math 6 lesson 4 is connected after lesson 3 with a 6000-point plan", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  assert.deepEqual(math.branch_ids.slice(0, 7), ["math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5", "math6-s1-chapter1-practice", "math6-s1-chapter1-review"]);
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.ok(app.includes("<MathLesson4 />"));
  assert.ok(registry.includes('"math6-s1-lesson4"'));
  assert.equal(db.match(/"math6-s1-lesson4-(?:terms|addition|smart-sum|subtraction|find-x|word-problem)": 1000/g)?.length, 6);
});
