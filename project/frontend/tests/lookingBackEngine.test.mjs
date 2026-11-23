import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isLookingBackAnswer, validateLookingBackData } from "../src/features/looking-back/lookingBackEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_looking_back.json", import.meta.url), "utf8"));

test("Looking Back has five scored games of ten rounds without mutating data", () => {
  const snapshot = JSON.stringify(raw);
  const lesson = validateLookingBackData(raw);
  assert.deepEqual(Object.values(lesson.games).map((rounds) => rounds.length), [10, 10, 10, 10, 10]);
  assert.equal(Object.values(lesson.games).flat().length, 50);
  assert.equal(JSON.stringify(raw), snapshot);
});

test("preserves literal answers and exact provenance ratios", () => {
  const lesson = validateLookingBackData(raw);
  assert.deepEqual(lesson.source_material.personality_answers, ["funny", "hard-working", "kind", "caring", "active"]);
  assert.deepEqual(lesson.source_material.continuous_answers, ["are running", "are talking", "aren't talking", "are drawing", "isn't teaching"]);
  assert.deepEqual(lesson.source_material.tense_answers, ["are you doing", "am writing", "cycles", "don't cycle", "walk", "Is he doing", "is reading"]);
  assert.deepEqual(Object.values(lesson.games).map((rounds) => rounds.filter(({ source_status }) => source_status === "user-provided-reference").length), [5, 0, 5, 7, 0]);
});

test("uses only deterministic fictional profiles for appearance questions", () => {
  const lesson = validateLookingBackData(raw);
  assert.ok(lesson.games.appearance.every(({ source_status, character_name }) => source_status === "ai-generated" && character_name.trim().split(/\s+/).length === 2));
  assert.match(lesson.intro.privacy_note_vi, /hư cấu/i);
  assert.equal(isLookingBackAnswer(lesson.games.appearance[0], " lan anh "), true);
});

test("checks normalized answers for vocabulary and grammar", () => {
  const lesson = validateLookingBackData(raw);
  assert.equal(isLookingBackAnswer(lesson.games.personality[0], " FUNNY "), true);
  assert.equal(isLookingBackAnswer(lesson.games.continuous[0], "are running"), true);
  assert.equal(isLookingBackAnswer(lesson.games.tenses[2], "cycles"), true);
  assert.equal(isLookingBackAnswer(lesson.games.tenses[2], "is cycling"), false);
});

test("provides source-aware help with completion and feedback", () => {
  const lesson = validateLookingBackData(raw);
  for (const help of Object.values(lesson.game_help)) {
    assert.ok(help.source_title.trim());
    assert.ok(help.teaching_vi.trim());
    assert.ok(help.steps.some((step) => step.includes("10")));
    assert.ok(help.steps.some((step) => /đúng|sai|phản hồi/i.test(step)));
  }
});

test("rejects bad counts, answers, provenance, names and image fields", () => {
  const count = structuredClone(raw); count.games.review.pop();
  assert.throws(() => validateLookingBackData(count), /exactly 10/);
  const answer = structuredClone(raw); answer.games.personality[0].answer = "missing";
  assert.throws(() => validateLookingBackData(answer), /invalid/);
  const provenance = structuredClone(raw); provenance.games.appearance[0].source_status = "user-provided-reference";
  assert.throws(() => validateLookingBackData(provenance), /provenance ratio/);
  const name = structuredClone(raw); name.games.review[0].character_name = "An";
  assert.throws(() => validateLookingBackData(name), /two-word/);
  const image = structuredClone(raw); image.games.continuous[0].image = "page.jpg";
  assert.throws(() => validateLookingBackData(image), /image fields/);
});
