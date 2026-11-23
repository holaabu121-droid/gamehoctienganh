import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BODY_PART_POINTS, createBodyLabQuestions } from "../src/features/body-lab/bodyLabEngine.ts";

const rawPath = new URL("../../data/raw/getting_started_unit3.json", import.meta.url);
const source = JSON.parse(readFileSync(rawPath, "utf8"));

test("covers every raw body part exactly once without mutating source", () => {
  const snapshot = JSON.stringify(source.part3_body_parts);
  const questions = createBodyLabQuestions(source.part3_body_parts);
  assert.equal(questions.length, 10);
  assert.deepEqual(questions.map(({ answer }) => answer), source.part3_body_parts);
  assert.equal(new Set(questions.map(({ answer }) => answer)).size, 10);
  assert.equal(JSON.stringify(source.part3_body_parts), snapshot);
});

test("creates four unique deterministic options containing each answer", () => {
  const first = createBodyLabQuestions(source.part3_body_parts);
  const second = createBodyLabQuestions(source.part3_body_parts);
  assert.deepEqual(first, second);
  for (const question of first) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.options.includes(question.answer));
  }
});

test("maps every raw word to a visible point inside the SVG", () => {
  for (const question of createBodyLabQuestions(source.part3_body_parts)) {
    assert.equal(question.point, BODY_PART_POINTS[question.answer]);
    assert.ok(question.point.x >= 0 && question.point.x <= 320);
    assert.ok(question.point.y >= 0 && question.point.y <= 530);
  }
});

test("rejects missing position metadata, duplicates, and too little content", () => {
  assert.throws(() => createBodyLabQuestions(["eye", "nose", "hand"]), /at least four/);
  assert.throws(() => createBodyLabQuestions(["eye", "eye", "nose", "hand"]), /must be unique/);
  assert.throws(() => createBodyLabQuestions(["eye", "nose", "hand", "wing"]), /Missing body positions: wing/);
});
