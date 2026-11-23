import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateStructuredMathLesson } from "../src/features/math6/structuredMathLessonEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_lesson2.json", import.meta.url), "utf8"));
const build = () => validateStructuredMathLesson(raw, { lessonId: "math6-s1-lesson2", lessonNumber: 2, pageLabel: "trang 9–12" });
const containsAnchor = (round, anchor) => `${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Math 6 lesson 2 builds six scored games of ten rounds", () => {
  const lesson = build();
  assert.deepEqual(lesson.gameIds, ["place-value", "expanded", "read-write", "roman-read", "roman-write", "mixed"]);
  assert.ok(Object.values(lesson.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
  assert.ok(lesson.meta.every((game) => game.activityId.startsWith("math6-s1-lesson2-")));
});

test("Math 6 lesson 2 preserves textbook anchors and labels added practice", () => {
  const lesson = build();
  assert.equal(lesson.rounds["place-value"][0].answer, "2 000");
  assert.ok(containsAnchor(lesson.rounds["roman-read"][0], "14"));
  assert.ok(containsAnchor(lesson.rounds["roman-write"][1], "XXVII"));
  assert.ok(containsAnchor(lesson.rounds.mixed[3], "9 990"));
  assert.ok(Object.values(lesson.rounds).flat().some((round) => round.source_status === "ai-generated"));
  assert.ok(Object.values(lesson.rounds).flat().some((round) => round.source_status === "user-provided-reference"));
});

test("Math 6 lesson 2 supplies teaching, hints and feedback for every round", () => {
  const lesson = build();
  assert.equal(lesson.foundations.length, 5);
  assert.ok(lesson.gameIds.every((id) => lesson.help[id].source_title.includes("trang 9–12") && lesson.help[id].teaching_vi));
  assert.ok(Object.values(lesson.rounds).flat().every((round) => round.context_vi && round.prompt_vi && round.explanation_vi));
  assert.match(lesson.lesson.extension, /không tính điểm bắt buộc/);
});

test("Math 6 lesson 2 is connected to catalog, app and backend", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  assert.deepEqual(math.branch_ids.slice(0, 7), ["math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5", "math6-s1-chapter1-practice", "math6-s1-chapter1-review"]);
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.ok(app.includes("<MathLesson2 />"));
  assert.ok(registry.includes('"math6-s1-lesson2"'));
  assert.equal(db.match(/"math6-s1-lesson2-(?:place-value|expanded|read-write|roman-read|roman-write|mixed)": 1000/g)?.length, 6);
});
