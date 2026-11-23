import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  advanceHint,
  applyChallengeKey,
  buildCorrectAudioPlan,
  buildTypingQuestions,
  buildVocabularyItems,
  classifyTypingError,
  compareAttempt,
  completeGapSentence,
  isAnswerCorrect,
  renderGapParts,
  scoreQuestion,
  summarizeSession,
} from "../src/features/typing-quest/typingQuestEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/raw/unit3_game_data.json", import.meta.url), "utf8"));

test("builds 21 unique items with explicit provenance without mutating raw", () => {
  const snapshot = JSON.stringify(raw);
  const items = buildVocabularyItems(raw);
  assert.equal(items.length, 21);
  assert.equal(new Set(items.map(({ id }) => id)).size, 21);
  assert.equal(items.filter(({ sourceStatus }) => sourceStatus === "reference-only").length, 20);
  assert.equal(items.find(({ en }) => en === "hard-working").sourceStatus, "designed");
  assert.ok(items.every(({ sentenceVi }) => sentenceVi.trim().length > 0));
  assert.equal(items.find(({ en }) => en === "caring").sentenceVi, "Mẹ tôi rất chu đáo và biết quan tâm. Mẹ luôn chăm sóc chúng tôi.");
  assert.equal(JSON.stringify(raw), snapshot);
});

test("keeps plural suffix outside the gap and completes with the lemma", () => {
  const sentence = "She has rosy [BLANK]s.";
  assert.deepEqual(renderGapParts(sentence), { before: "She has rosy ", after: "s." });
  assert.equal(completeGapSentence(sentence, "cheek"), "She has rosy cheeks.");
  assert.throws(() => renderGapParts("No gap"), /exactly one/);
});

test("builds deterministic non-repeating question sets for every mode", () => {
  const items = buildVocabularyItems(raw);
  const fill = buildTypingQuestions(items, { mode: "fill_gap", difficulty: "learning", count: 10, seed: 8 });
  const translation = buildTypingQuestions(items, { mode: "translation_typing", difficulty: "learning", count: 10, seed: 8 });
  const mixed = buildTypingQuestions(items, { mode: "mixed", difficulty: "learning", count: 10, seed: 8 });
  assert.equal(fill.length, 10);
  assert.equal(translation.length, 10);
  assert.equal(mixed.length, 10);
  assert.equal(new Set(mixed.map(({ vocabId }) => vocabId)).size, 10);
  assert.deepEqual(mixed, buildTypingQuestions(items, { mode: "mixed", difficulty: "learning", count: 10, seed: 8 }));
  assert.deepEqual(new Set(mixed.map(({ mode }) => mode)), new Set(["fill_gap", "translation_typing"]));
});

test("uses the reviewed hard-working sentence in Fill the Gap", () => {
  const items = buildVocabularyItems(raw);
  const hardWorking = items.find(({ en }) => en === "hard-working");
  assert.equal(hardWorking.fillGapApproved, true);
  assert.equal(hardWorking.sentence, "Mina is very [BLANK]. She always studies hard and finishes her homework on time.");
  assert.equal(hardWorking.sentenceVi, "Mina rất chăm chỉ. Bạn ấy luôn học tập nghiêm túc và hoàn thành bài tập đúng giờ.");
  const fill = buildTypingQuestions([hardWorking], { mode: "fill_gap", difficulty: "learning", count: 10 });
  assert.equal(fill.length, 1);
  assert.ok(fill.some(({ answer, completedSentence, sentenceApproved }) => answer === "hard-working" && sentenceApproved
    && completedSentence === "Mina is very hard-working. She always studies hard and finishes her homework on time."));
});

test("compares correct, incorrect, pending and extra characters", () => {
  assert.deepEqual(compareAttempt("friendly", "frie").map(({ status }) => status), [
    "correct", "correct", "correct", "correct", "pending", "pending", "pending", "pending",
  ]);
  assert.deepEqual(compareAttempt("eye", "aye!").map(({ status }) => status), ["incorrect", "correct", "correct", "extra"]);
  assert.equal(isAnswerCorrect("Friendly", " friendly "), true);
  assert.equal(isAnswerCorrect("hard-working", "hardworking"), false);
});

test("Challenge Mode accepts correct keys, supports Backspace and resets on a wrong key", () => {
  let state = { answer: "kind", attempt: "", mistakeCount: 0, combo: 2 };
  state = applyChallengeKey(state, "k");
  state = applyChallengeKey(state, "i");
  assert.equal(state.attempt, "ki");
  state = applyChallengeKey(state, "Backspace");
  assert.equal(state.attempt, "k");
  const reset = applyChallengeKey(state, "x");
  assert.equal(reset.attempt, "");
  assert.equal(reset.mistakeCount, 1);
  assert.equal(reset.combo, 0);
  assert.equal(reset.reset, true);
});

test("Challenge Mode requires the hyphen and increments combo only on a clean completion", () => {
  let state = { answer: "hard-working", attempt: "hard", mistakeCount: 0, combo: 3 };
  const missingHyphen = applyChallengeKey(state, "w");
  assert.equal(missingHyphen.reset, true);
  state = { answer: "eye", attempt: "ey", mistakeCount: 0, combo: 3 };
  const complete = applyChallengeKey(state, "e");
  assert.equal(complete.complete, true);
  assert.equal(complete.combo, 4);
});

test("classifies spelling errors without AI", () => {
  assert.equal(classifyTypingError("friendly", "friendly"), "none");
  assert.equal(classifyTypingError("hard-working", "hardworking"), "hyphen_error");
  assert.equal(classifyTypingError("friendly", "frindly"), "missing_character");
  assert.equal(classifyTypingError("friendly", "friendlly"), "extra_character");
  assert.equal(classifyTypingError("friendly", "freindly"), "transposition");
  assert.equal(classifyTypingError("kind", "kang"), "substitution");
  assert.equal(classifyTypingError("kind", "creative"), "wrong_word");
});

test("advances hints and applies XP caps 10/7/5/3/0", () => {
  const first = advanceHint("friendly", 0);
  const second = advanceHint("friendly", first.level);
  const third = advanceHint("friendly", second.level);
  const answer = advanceHint("friendly", third.level);
  assert.deepEqual(first.revealed, [{ index: 0, character: "f" }]);
  assert.equal(second.length, 8);
  assert.deepEqual(second.revealed.map(({ character }) => character), ["f", "r"]);
  assert.equal(third.playAudio, true);
  assert.equal(answer.showAnswer, true);
  assert.deepEqual([0, 1, 2, 3, 4].map((level) => scoreQuestion(level)), [10, 7, 5, 3, 0]);
});

test("builds ordered correct-answer audio for reviewed sentences", () => {
  const items = buildVocabularyItems(raw);
  const audioItems = items.filter(({ en }) => en === "friendly" || en === "hard-working");
  const friendly = buildTypingQuestions(audioItems, { mode: "translation_typing", difficulty: "learning", count: 10 })
    .find(({ answer }) => answer === "friendly");
  assert.equal(friendly.sentenceVi, "Nam thân thiện. Cậu ấy thích giúp đỡ bạn bè.");
  assert.deepEqual(buildCorrectAudioPlan(friendly, { speakWord: true, speakMeaning: true, speakSentence: true }).map(({ kind }) => kind), [
    "word", "meaning", "sentence",
  ]);
  const hardWorking = buildTypingQuestions(audioItems, { mode: "translation_typing", difficulty: "learning", count: 10 })
    .find(({ answer }) => answer === "hard-working");
  assert.deepEqual(buildCorrectAudioPlan(hardWorking, { speakWord: true, speakMeaning: true, speakSentence: true }).map(({ kind }) => kind), [
    "word", "meaning", "sentence",
  ]);
});

test("summarizes XP, first tries, hints, common errors and review words", () => {
  const attempts = [
    { questionId: "q1", vocabId: "u3-kind", mode: "translation_typing", difficulty: "learning", correct: true, firstTryCorrect: true, hintLevel: 0, xp: 10, errorType: "none", mistakeCount: 0, durationMs: 800 },
    { questionId: "q2", vocabId: "u3-friendly", mode: "fill_gap", difficulty: "challenge", correct: true, firstTryCorrect: false, hintLevel: 2, xp: 5, errorType: "transposition", mistakeCount: 1, durationMs: 1400 },
    { questionId: "q3", vocabId: "u3-eye", mode: "fill_gap", difficulty: "learning", correct: false, firstTryCorrect: false, hintLevel: 1, xp: 0, errorType: "transposition", mistakeCount: 1, durationMs: 1700 },
  ];
  assert.deepEqual(summarizeSession(attempts), {
    totalQuestions: 3,
    correctCount: 2,
    totalXp: 15,
    firstTryCorrectCount: 1,
    hintUses: 3,
    commonError: "transposition",
    reviewVocabIds: ["u3-friendly", "u3-eye"],
  });
});
