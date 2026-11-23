import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateStructuredMathLesson } from "../src/features/math6/structuredMathLessonEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_lesson3.json", import.meta.url), "utf8"));
const build = () => validateStructuredMathLesson(raw, { lessonId: "math6-s1-lesson3", lessonNumber: 3, pageLabel: "trang 13–14" });
const containsAnchor = (round, anchor) => `${round.context} ${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Math 6 lesson 3 builds six scored games of ten rounds", () => {
  const lesson = build();
  assert.deepEqual(lesson.gameIds, ["number-line", "compare", "neighbors", "order-chain", "inequality", "conditional-set"]);
  assert.ok(Object.values(lesson.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
  assert.ok(lesson.meta.every((game) => game.activityId.startsWith("math6-s1-lesson3-")));
});

test("Math 6 lesson 3 preserves exercises 1.13 to 1.16", () => {
  const lesson = build();
  assert.ok(containsAnchor(lesson.rounds.neighbors[0], "3 531 và 3 533"));
  assert.ok(containsAnchor(lesson.rounds["order-chain"][0], "3 528; 3 529; 3 530; 3 531; 3 532; 3 533"));
  assert.ok(containsAnchor(lesson.rounds["order-chain"][1], "a < b < c"));
  assert.ok(containsAnchor(lesson.rounds["conditional-set"][0], "{10; 11; 12; 13; 14}"));
  assert.ok(containsAnchor(lesson.rounds["conditional-set"][1], "{1; 2; 3}"));
  assert.ok(containsAnchor(lesson.rounds["conditional-set"][2], "{0; 1; 2; 3}"));
  assert.ok(containsAnchor(lesson.rounds["order-chain"][3], "Cường; An; Bắc"));
});

test("Math 6 lesson 3 covers all ordering rules with provenance and teaching", () => {
  const lesson = build();
  const all = Object.values(lesson.rounds).flat();
  assert.equal(lesson.foundations.length, 5);
  assert.ok(lesson.gameIds.every((id) => lesson.help[id].source_title.includes("trang 13–14") && lesson.help[id].teaching_vi));
  assert.ok(all.every((round) => round.context_vi && round.prompt_vi && round.explanation_vi));
  assert.ok(all.some((round) => round.source_status === "user-provided-reference"));
  assert.ok(all.some((round) => round.source_status === "ai-generated"));
  assert.ok(all.some((round) => round.context.includes("0") && containsAnchor(round, "Không có")));
});

test("Math 6 lesson 3 is connected after lesson 2 with a 6000-point plan", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  assert.deepEqual(math.branch_ids.slice(0, 7), ["math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5", "math6-s1-chapter1-practice", "math6-s1-chapter1-review"]);
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.ok(app.includes("<MathLesson3 />"));
  assert.ok(registry.includes('"math6-s1-lesson3"'));
  assert.equal(db.match(/"math6-s1-lesson3-(?:number-line|compare|neighbors|order-chain|inequality|conditional-set)": 1000/g)?.length, 6);
});
