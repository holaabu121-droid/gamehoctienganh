import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createAudioPlan,
  evaluateSlotSelection,
  fillSentence,
  normalizeQuestions,
  splitAnswerIntoSlots,
} from "../src/features/word-magnet/wordMagnetEngine.ts";

const rawPath = new URL("../../data/raw/getting_started_unit3.json", import.meta.url);
const source = JSON.parse(readFileSync(rawPath, "utf8"));
const practice = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_part2_practice.json", import.meta.url), "utf8"));
const allQuestions = [...source.part2_blanks, ...practice.questions];

test("normalizes all raw Word Magnet questions without mutating source", () => {
  const snapshot = JSON.stringify(source.part2_blanks);
  const questions = normalizeQuestions(source.part2_blanks);

  assert.equal(questions.length, 5);
  assert.equal(JSON.stringify(source.part2_blanks), snapshot);
  assert.ok(questions.every((question) => !question.completedSentence.includes("[BLANK]")));
});

test("maps both blanks in the Mai and Chau sentence", () => {
  const question = normalizeQuestions(source.part2_blanks).find(({ id }) => id === 3);

  assert.deepEqual(question.slotAnswers, ["Mai", "Chau"]);
  assert.equal(question.completedSentence, "Phong and Nam see Mai and Chau.");
  assert.equal(question.slotOrderFlexible, true);
  assert.deepEqual(evaluateSlotSelection(question, ["Mai", "Chau"]), {
    correct: true,
    completedSentence: "Phong and Nam see Mai and Chau.",
  });
  assert.deepEqual(evaluateSlotSelection(question, ["Chau", "Mai"]), {
    correct: true,
    completedSentence: "Phong and Nam see Chau and Mai.",
  });
});

test("keeps the adjective phrase together in the second two-blank sentence", () => {
  const question = normalizeQuestions(source.part2_blanks).find(({ id }) => id === 4);

  assert.deepEqual(question.slotAnswers, ["glasses", "long black hair"]);
  assert.equal(question.completedSentence, "Chau has glasses and long black hair.");
  assert.deepEqual(evaluateSlotSelection(question, ["long black hair", "glasses"]), {
    correct: true,
    completedSentence: "Chau has long black hair and glasses.",
  });
  assert.equal(evaluateSlotSelection(question, ["glasses", "big eyes"]).correct, false);
});

test("builds separate selectable magnets for every two-slot option", () => {
  const question = normalizeQuestions(source.part2_blanks).find(({ id }) => id === 3);
  assert.equal(question.slotChoices.length, 8);
  assert.equal(new Set(question.slotChoices.map(({ id }) => id)).size, 8);
  assert.deepEqual(question.slotChoices.slice(0, 2).map(({ text }) => text), ["Mai", "Chau"]);
});

test("audio plan always speaks selection and only speaks sentence after a correct answer", () => {
  const question = normalizeQuestions(source.part2_blanks)[0];
  const wrong = createAudioPlan(question, "party");
  const correct = createAudioPlan(question, "picnic");

  assert.deepEqual(wrong, {
    correct: false,
    selectedSpeech: "party",
    completedSpeech: null,
  });
  assert.deepEqual(correct, {
    correct: true,
    selectedSpeech: "picnic",
    completedSpeech: "Phong and Nam are having a picnic.",
  });
});

test("rejects ambiguous source data instead of silently filling wrong slots", () => {
  assert.throws(() => splitAnswerIntoSlots("one answer", 2), /Cannot map answer/);
  assert.throws(() => fillSentence("[BLANK] and [BLANK]", ["one"]), /Not enough answers/);
});

test("combines five reference and five clearly labelled AI practice questions", () => {
  const questions = normalizeQuestions(allQuestions);
  assert.equal(questions.length, 10);
  assert.equal(questions.filter(({ source_status }) => source_status === "user-provided-reference").length, 5);
  assert.equal(questions.filter(({ source_status }) => source_status === "ai-generated").length, 5);
  assert.ok(questions.every(({ options, answer }) => options.length === 4 && options.includes(answer)));
  assert.equal(practice.source_status, "hybrid-personal-use");
  assert.ok(practice.questions.every(({ source_status }) => source_status === "ai-generated"));
  assert.match(practice.source_note, /not transcribed textbook items/i);
});

test("uses two-word Vietnamese names in every AI-designed Part 2 item", () => {
  const names = ["Minh Anh", "Gia Huy", "Thu Ha", "Minh Khoa", "Bao An"];
  assert.ok(practice.questions.every(({ sentence }) => names.some((name) => sentence.includes(name))));
});

test("rejects a non-standard item provenance label", () => {
  assert.throws(() => normalizeQuestions([{ ...practice.questions[0], source_status: "designed-ai" }]), /invalid source_status/);
});
