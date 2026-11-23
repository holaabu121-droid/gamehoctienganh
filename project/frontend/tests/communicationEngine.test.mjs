import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  isBirthdayAnswer,
  isDetectiveAnswer,
  isDialogueAnswer,
  isInterviewAnswer,
  isOpinionAnswer,
  validateCommunicationData,
} from "../src/features/communication/communicationEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_communication.json", import.meta.url), "utf8"));

test("validates the hybrid personal-family Communication lesson without mutation", () => {
  const snapshot = JSON.stringify(raw);
  const lesson = validateCommunicationData(raw);
  assert.equal(lesson.source_status, "user-provided-reference");
  assert.equal(lesson.usage_scope, "personal-family");
  assert.deepEqual([
    lesson.dialogue_lab.length,
    lesson.best_friend_interview.length,
    lesson.student_detective.length,
    lesson.birthday_personality.length,
    lesson.opinion_true_false.length,
  ], [10, 10, 10, 15, 10]);
  assert.equal(JSON.stringify(raw), snapshot);
});

test("enforces exact per-game and aggregate provenance", () => {
  const lesson = validateCommunicationData(raw);
  const collections = [lesson.dialogue_lab, lesson.best_friend_interview, lesson.student_detective, lesson.birthday_personality, lesson.opinion_true_false];
  assert.deepEqual(collections.map((items) => items.filter(({ source_status }) => source_status === "user-provided-reference").length), [4, 2, 2, 12, 3]);
  assert.deepEqual(collections.map((items) => items.filter(({ source_status }) => source_status === "ai-generated").length), [6, 8, 8, 3, 7]);
  assert.deepEqual(lesson.provenance, {
    reference_image_count: 1,
    user_provided_reference_items: 23,
    ai_generated_items: 32,
    ai_generation_note: lesson.provenance.ai_generation_note,
  });
  const aiItems = collections.flat().filter(({ source_status }) => source_status === "ai-generated");
  assert.ok(aiItems.every(({ character_name }) => character_name.trim().split(/\s+/).length === 2));
});

test("preserves the literal source dialogue and interview questions", () => {
  const lesson = validateCommunicationData(raw);
  assert.deepEqual(lesson.source_material.dialogue, [
    { speaker: "Linda", line: "What does your best friend look like?" },
    { speaker: "Mi", line: "She's short with long black hair. She has bright brown eyes." },
    { speaker: "Linda", line: "What's she like?" },
    { speaker: "Mi", line: "She's very kind and creative." },
  ]);
  assert.equal(lesson.best_friend_interview[0].question, "What does your best friend look like?");
  assert.equal(lesson.best_friend_interview[1].question, "What's she like?");
  assert.equal(lesson.best_friend_interview[0].answer, "She's short with long black hair. She has bright brown eyes.");
});

test("preserves both literal profiles and supports one- or two-adjective inference", () => {
  const lesson = validateCommunicationData(raw);
  assert.equal(lesson.source_material.profiles[0].header, "Vinh (Viet Nam, birthday 7/12)");
  assert.ok(lesson.source_material.profiles[0].text.includes("I'm going to an English club now."));
  assert.equal(lesson.source_material.profiles[1].header, "John (England, birthday 26/2)");
  assert.ok(lesson.source_material.profiles[1].text.includes("Now I'm drawing in my garden."));
  assert.equal(isDetectiveAnswer(lesson.student_detective[0], ["active", "confident"]), true);
  assert.equal(isDetectiveAnswer(lesson.student_detective[0], ["confident"]), false);
  assert.equal(isDetectiveAnswer(lesson.student_detective[2], ["creative"]), true);
});

test("keeps all twelve source birthday bands and adds three labelled practice rounds", () => {
  const lesson = validateCommunicationData(raw);
  assert.equal(lesson.source_material.birthday_table.length, 12);
  assert.deepEqual(lesson.source_material.birthday_table[0], { date_range: "21/3 - 19/4", traits: ["confident", "active"] });
  assert.deepEqual(lesson.source_material.birthday_table.at(-1), { date_range: "19/2 - 20/3", traits: ["kind", "creative"] });
  assert.ok(lesson.birthday_personality.slice(0, 12).every(({ source_status }) => source_status === "user-provided-reference"));
  assert.ok(lesson.birthday_personality.slice(12).every(({ source_status, birthday }) => source_status === "ai-generated" && birthday));
  assert.equal(isBirthdayAnswer(lesson.birthday_personality[12], " Confident, Active "), true);
});

test("preserves all three opinion stems and frames the table as non-scientific", () => {
  const lesson = validateCommunicationData(raw);
  assert.deepEqual(lesson.source_material.example_stems, ["My birthday is ...", "It's true that ...", "It isn't true that ..."]);
  assert.match(lesson.intro.birthday_note_vi, /không phải bằng chứng khoa học/i);
  assert.equal(isOpinionAnswer(lesson.opinion_true_false.find(({ id }) => id === "ai-opinion-science"), "Sai"), true);
  assert.equal(isOpinionAnswer(lesson.opinion_true_false.find(({ id }) => id === "ai-opinion-polite"), "Sai"), false);
});

test("provides source-aware help with round counts, completion and feedback", () => {
  const lesson = validateCommunicationData(raw);
  assert.deepEqual(Object.keys(lesson.game_help).sort(), ["birthday", "detective", "dialogue", "interview", "opinion"]);
  for (const [game, help] of Object.entries(lesson.game_help)) {
    assert.ok(help.source_title.trim());
    assert.ok(help.teaching_vi.trim());
    assert.ok(help.steps.length >= 3);
    assert.ok(help.steps.some((step) => step.includes(game === "birthday" ? "15" : "10")));
    assert.ok(help.steps.some((step) => /hoàn thành|Đúng|sai/i.test(step)));
  }
});

test("checks answer helpers using normalized exact matching", () => {
  const lesson = validateCommunicationData(raw);
  assert.equal(isDialogueAnswer(lesson.dialogue_lab[0], " APPEARANCE-QUESTION "), true);
  assert.equal(isDialogueAnswer(lesson.dialogue_lab[0], "personality-question"), false);
  assert.equal(isInterviewAnswer(lesson.best_friend_interview[2], " He's tall and has wavy black hair. "), true);
  assert.equal(isInterviewAnswer(lesson.best_friend_interview[2], "He's confident and active."), false);
});

test("rejects changed source text, invalid counts, provenance and embedded image fields", () => {
  const changedSource = structuredClone(raw);
  changedSource.source_material.dialogue[0].line = "Changed";
  assert.throws(() => validateCommunicationData(changedSource), /Literal dialogue/);

  const wrongCount = structuredClone(raw);
  wrongCount.student_detective.pop();
  assert.throws(() => validateCommunicationData(wrongCount), /exactly 10 rounds/);

  const wrongProvenance = structuredClone(raw);
  wrongProvenance.dialogue_lab[4].source_status = "user-provided-reference";
  assert.throws(() => validateCommunicationData(wrongProvenance), /provenance ratio/);

  const withImage = structuredClone(raw);
  withImage.dialogue_lab[0].image_url = "book-page.png";
  assert.throws(() => validateCommunicationData(withImage), /must not embed image fields/);
});

test("rejects invalid AI names, answers and unsupported birthday claims", () => {
  const badName = structuredClone(raw);
  badName.opinion_true_false[3].character_name = "Mai";
  assert.throws(() => validateCommunicationData(badName), /two words/);

  const missingAnswer = structuredClone(raw);
  missingAnswer.best_friend_interview[2].options = ["Wrong one", "Wrong two"];
  assert.throws(() => validateCommunicationData(missingAnswer), /options containing its answer/);

  const scientificClaim = structuredClone(raw);
  scientificClaim.intro.birthday_note_vi = "Ngày sinh quyết định tính cách.";
  assert.throws(() => validateCommunicationData(scientificClaim), /foundation is incomplete/);
});
