import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createVocabularyPairs,
  createWordBridgeRounds,
  getAnswerText,
  getPromptText,
  isCorrectMatch,
  scoreForAttempt,
} from "../src/features/word-bridge/wordBridgeEngine.ts";

const lessonPath = new URL("../../data/raw/getting_started_unit3.json", import.meta.url);
const vocabularyPath = new URL("../../data/raw/unit3_game_data.json", import.meta.url);
const lesson = JSON.parse(readFileSync(lessonPath, "utf8"));
const vocabulary = JSON.parse(readFileSync(vocabularyPath, "utf8"));

test("joins exactly ten body parts to reviewed Vietnamese meanings without mutation", () => {
  const lessonSnapshot = JSON.stringify(lesson.part3_body_parts);
  const vocabularySnapshot = JSON.stringify(vocabulary);
  const pairs = createVocabularyPairs(lesson.part3_body_parts, vocabulary);
  assert.equal(pairs.length, 10);
  assert.deepEqual(pairs.map(({ en }) => en), lesson.part3_body_parts);
  assert.deepEqual(pairs.find(({ en }) => en === "arm"), {
    id: "body-pair-3", en: "arm", vi: "cánh tay",
  });
  assert.equal(JSON.stringify(lesson.part3_body_parts), lessonSnapshot);
  assert.equal(JSON.stringify(vocabulary), vocabularySnapshot);
});

test("creates one deterministic ten-pair round with a shuffled answer bank", () => {
  const pairs = createVocabularyPairs(lesson.part3_body_parts, vocabulary);
  const rounds = createWordBridgeRounds(pairs);
  assert.equal(rounds.length, 1);
  assert.ok(rounds.every(({ prompts, answerBank }) => prompts.length === 10 && answerBank.length === 10));
  assert.deepEqual(createWordBridgeRounds(pairs), rounds);
  for (const round of rounds) {
    assert.notDeepEqual(round.answerBank.map(({ id }) => id), round.prompts.map(({ id }) => id));
    assert.deepEqual(new Set(round.answerBank.map(({ id }) => id)), new Set(round.prompts.map(({ id }) => id)));
  }
});

test("supports both display directions and exact pair matching", () => {
  const [eye, hand] = createVocabularyPairs(lesson.part3_body_parts, vocabulary).slice(1, 3);
  assert.equal(getPromptText(eye, "en-to-vi"), "eye");
  assert.equal(getAnswerText(eye, "en-to-vi"), "mắt");
  assert.equal(getPromptText(eye, "vi-to-en"), "mắt");
  assert.equal(getAnswerText(eye, "vi-to-en"), "eye");
  assert.equal(isCorrectMatch(eye, eye), true);
  assert.equal(isCorrectMatch(eye, hand), false);
  assert.deepEqual([scoreForAttempt(0), scoreForAttempt(1), scoreForAttempt(2)], [100, 70, 40]);
});

test("rejects duplicate parts, missing meanings, and uneven rounds", () => {
  assert.throws(() => createVocabularyPairs(["eye", "eye"], vocabulary), /must be unique/);
  assert.throws(() => createVocabularyPairs(["wing"], vocabulary), /Missing Vietnamese meaning/);
  const pairs = createVocabularyPairs(lesson.part3_body_parts, vocabulary);
  assert.throws(() => createWordBridgeRounds(pairs, 4), /equal rounds/);
});
