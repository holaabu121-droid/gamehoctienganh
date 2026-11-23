import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  isBuilderAnswer,
  isGuessingAnswer,
  isQuestionAnswer,
  isReporterAnswer,
  isTenseAnswer,
  validateCloserLook2Data,
} from "../src/features/a-closer-look-2/closerLook2Engine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_a_closer_look2.json", import.meta.url), "utf8"));

test("validates the hybrid personal-use lesson without mutating it", () => {
  const snapshot = JSON.stringify(raw);
  const lesson = validateCloserLook2Data(raw);
  assert.equal(lesson.source_status, "user-provided-reference");
  assert.equal(lesson.usage_scope, "personal-family");
  assert.ok(lesson.source_note.includes("Hybrid personal-family"));
  assert.deepEqual(lesson.provenance, {
    reference_image_count: 2,
    user_provided_reference_items: 22,
    ai_generated_items: 28,
    ai_generation_note: lesson.provenance.ai_generation_note,
  });
  assert.deepEqual([
    lesson.be_builder.length,
    lesson.action_reporter.length,
    lesson.question_switch.length,
    lesson.time_detective.length,
    lesson.action_guessing.length,
  ], [10, 10, 10, 10, 10]);
  assert.equal(JSON.stringify(raw), snapshot);
});

test("teaches four present-continuous forms and an explicit tense contrast", () => {
  const lesson = validateCloserLook2Data(raw);
  assert.deepEqual(lesson.intro.present_continuous.patterns.map(({ id }) => id).sort(), ["negative", "positive", "question", "short-answer"]);
  assert.ok(lesson.intro.present_continuous.time_markers.length >= 3);
  assert.ok(lesson.intro.tense_choice.simple_vi.includes("thường xuyên"));
  assert.ok(lesson.intro.tense_choice.continuous_vi.includes("đang"));
  assert.ok(lesson.intro.tense_choice.decision_tip_vi.length > 40);
});

test("translates every source exercise title into Vietnamese teaching help", () => {
  const lesson = validateCloserLook2Data(raw);
  assert.deepEqual(Object.keys(lesson.game_help).sort(), ["builder", "detective", "guessing", "questions", "reporter"]);
  assert.ok(Object.values(lesson.game_help).every(({ source_title, teaching_vi, steps }) => source_title.trim() && teaching_vi.trim() && steps.length >= 3 && steps.every((step) => step.trim())));
  assert.ok(lesson.game_help.builder.teaching_vi.includes("động từ trong ngoặc"));
  assert.ok(lesson.game_help.guessing.teaching_vi.includes("diễn tả hành động"));
});

test("keeps source character labels and embeds no textbook images", () => {
  const lesson = validateCloserLook2Data(raw);
  assert.ok(lesson.be_builder.some(({ character_name }) => character_name === "Nam"));
  assert.ok(lesson.action_reporter.some(({ character_name }) => character_name === "Ha"));
  assert.equal(JSON.stringify(lesson).includes('"image"'), false);
});

test("enforces exact reference and AI provenance ratios for every game", () => {
  const lesson = validateCloserLook2Data(raw);
  const games = [lesson.be_builder, lesson.action_reporter, lesson.question_switch, lesson.time_detective, lesson.action_guessing];
  const referenceCounts = games.map((items) => items.filter(({ source_status }) => source_status === "user-provided-reference").length);
  const aiCounts = games.map((items) => items.filter(({ source_status }) => source_status === "ai-generated").length);
  assert.deepEqual(referenceCounts, [5, 5, 5, 5, 2]);
  assert.deepEqual(aiCounts, [5, 5, 5, 5, 8]);
  assert.ok(games.flat().filter(({ source_status }) => source_status === "ai-generated").every(({ character_name }) => character_name.trim().split(/\s+/).length === 2));
});

test("checks both grammar pieces in Be Builder", () => {
  const round = validateCloserLook2Data(raw).be_builder[0];
  assert.equal(isBuilderAnswer(round, round.be, round.verb_ing), true);
  assert.equal(isBuilderAnswer(round, round.be_options.find((option) => option !== round.be), round.verb_ing), false);
  assert.equal(isBuilderAnswer(round, round.be, round.verb), false);
});

test("checks reporter sentences and complete question-answer pairs", () => {
  const lesson = validateCloserLook2Data(raw);
  const report = lesson.action_reporter[0];
  assert.equal(isReporterAnswer(report, report.answer), true);
  assert.equal(isReporterAnswer(report, report.options.find((option) => option !== report.answer)), false);
  const question = lesson.question_switch[0];
  assert.equal(isQuestionAnswer(question, question.question, question.short_answer), true);
  assert.equal(isQuestionAnswer(question, question.question_options.find((option) => option !== question.question), question.short_answer), false);
  assert.equal(isQuestionAnswer(question, question.question, question.answer_options.find((option) => option !== question.short_answer)), false);
});

test("distinguishes tense meaning and action-guessing questions", () => {
  const lesson = validateCloserLook2Data(raw);
  const routine = lesson.time_detective.find(({ answer_tense }) => answer_tense === "simple");
  const current = lesson.time_detective.find(({ answer_tense }) => answer_tense === "continuous");
  assert.equal(isTenseAnswer(routine, "simple"), true);
  assert.equal(isTenseAnswer(routine, "continuous"), false);
  assert.equal(isTenseAnswer(current, "continuous"), true);
  const guessing = lesson.action_guessing[0];
  assert.equal(isGuessingAnswer(guessing, guessing.question), true);
  assert.equal(isGuessingAnswer(guessing, guessing.options.find((option) => option !== guessing.question)), false);
});

test("retains visible source sentences and appends AI practice", () => {
  const lesson = validateCloserLook2Data(raw);
  assert.equal(lesson.be_builder.length, 10);
  assert.equal(lesson.action_reporter.length, 10);
  assert.equal(lesson.question_switch.length, 10);
  assert.equal(lesson.time_detective.length, 10);
  assert.equal(lesson.action_guessing.length, 10);
  assert.equal(lesson.be_builder[0].sentence, "Nam is reading a book now.");
  assert.equal(lesson.time_detective[3].completed_sentence, "I am writing an email to my friend now.");
  assert.deepEqual(lesson.action_guessing.slice(0, 2).map(({ question }) => question), ["Are you dancing?", "Are you looking for something?"]);
  assert.equal(lesson.be_builder[5].source_status, "ai-generated");
  assert.equal(lesson.action_guessing[9].source_status, "ai-generated");
});
