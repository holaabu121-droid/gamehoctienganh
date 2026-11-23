import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { MATH_LESSON1_GAME_IDS, validateMathLesson1 } from "../src/features/math6/mathLesson1Engine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_lesson1.json", import.meta.url), "utf8"));
const containsAnchor = (round, anchor) => `${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Math 6 lesson 1 builds six scored games of ten rounds", () => {
  const lesson = validateMathLesson1(raw);
  assert.deepEqual(Object.keys(lesson.rounds), MATH_LESSON1_GAME_IDS);
  assert.ok(Object.values(lesson.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
});

test("Math 6 lesson 1 preserves textbook anchors and labels extensions", () => {
  const lesson = validateMathLesson1(raw);
  assert.equal(lesson.rounds.membership[0].answer, "∈");
  assert.equal(lesson.rounds.membership[1].answer, "∉");
  assert.ok(containsAnchor(lesson.rounds.listing[1], "A = {0; 1; 2; 3; 4}"));
  assert.ok(containsAnchor(lesson.rounds.natural[1], "Không"));
  assert.ok(Object.values(lesson.rounds).flat().some((round) => round.source_status === "ai-generated"));
  assert.ok(Object.values(lesson.rounds).flat().some((round) => round.source_status === "user-provided-reference"));
});

test("Math 6 lesson 1 supplies teaching, hints and feedback for every round", () => {
  const lesson = validateMathLesson1(raw);
  assert.equal(lesson.foundations.length, 5);
  assert.ok(MATH_LESSON1_GAME_IDS.every((id) => lesson.help[id].source_title.includes("trang 5–8")));
  assert.ok(Object.values(lesson.rounds).flat().every((round) => round.context_vi && round.prompt_vi && round.explanation_vi));
});

test("Math 6 lesson 1 is connected to catalog, app and backend", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  assert.equal(math.status, "available");
  assert.deepEqual(math.branch_ids.slice(0, 7), ["math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5", "math6-s1-chapter1-practice", "math6-s1-chapter1-review"]);
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.ok(app.includes("<MathLesson1 />"));
  assert.ok(registry.includes('rendererKey: "math-6-semester-1"'));
  assert.equal(db.match(/"math6-s1-lesson1-(?:identify|membership|notation|listing|natural|describe)": 1000/g)?.length, 6);
});
