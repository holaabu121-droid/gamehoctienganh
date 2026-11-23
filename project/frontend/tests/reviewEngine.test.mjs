import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateReviewData } from "../src/features/review/reviewEngine.ts";
import { validateBonusLesson } from "../src/features/bonus/bonusEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/review1.json", import.meta.url), "utf8"));
const bonusRaw = JSON.parse(readFileSync(new URL("../../data/lessons/review1_bonus.json", import.meta.url), "utf8"));

test("Review 1 is a separate six-game branch with ten rounds per game", () => {
  const lesson = validateReviewData(raw);
  assert.deepEqual(Object.keys(lesson.games), ["sounds", "vocabulary", "grammar", "email", "school", "listen_write"]);
  assert.deepEqual(Object.values(lesson.games).map((rounds) => rounds.length), [10, 10, 10, 10, 10, 10]);
});

test("Review 1 preserves visible anchors and labels replacement audio", () => {
  const lesson = validateReviewData(raw);
  assert.equal(lesson.games.sounds[0].answer, "lips");
  assert.equal(lesson.games.grammar[4].answer, "is reading");
  assert.equal(lesson.games.email[0].answer, "lives");
  assert.equal(lesson.games.school[4].answer, "Because it is a good school");
  const audio = lesson.games.listen_write.filter((round) => round.audio_text);
  assert.equal(audio.length, 5);
  assert.ok(audio.every((round) => round.audio_source_status === "ai-generated"));
});

test("Review 1 rejects ambiguous answers, bad counts and image fields", () => {
  const answer = structuredClone(raw); answer.games.sounds[0].answer = "missing";
  assert.throws(() => validateReviewData(answer), /invalid/);
  const count = structuredClone(raw); count.games.email.pop();
  assert.throws(() => validateReviewData(count), /10 unique/);
  const image = structuredClone(raw); image.games.school[0].photo = "page.jpg";
  assert.throws(() => validateReviewData(image), /images/);
});

test("Review Bonus has exactly three AI-created ten-round stages", () => {
  const lesson = validateBonusLesson(bonusRaw);
  assert.equal(lesson.lesson_id, "review1-bonus");
  assert.deepEqual(lesson.selected_variants, ["treasure", "boss", "detective"]);
  assert.deepEqual(lesson.selected_variants.map((id) => lesson.stages[id].rounds.length), [10, 10, 10]);
  assert.ok(!lesson.variant_catalog.flatMap((item) => item.skills).includes("pronunciation"));
});

