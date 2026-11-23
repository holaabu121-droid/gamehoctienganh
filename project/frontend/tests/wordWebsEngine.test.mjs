import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildWordWebs,
  buildWordWebQuestions,
  getDescriptionTranslation,
  getNetworkReplayPhrases,
  getWordWebProgress,
  makeDescriptionPhrase,
} from "../src/features/word-webs/wordWebsEngine.ts";

const source = JSON.parse(readFileSync(new URL("../../data/raw/getting_started_unit3.json", import.meta.url), "utf8"));

test("expands raw data to five webs and nineteen unique relations without mutation", () => {
  const snapshot = JSON.stringify(source.part4_word_webs);
  const webs = buildWordWebs(source.part4_word_webs);
  const relations = webs.flatMap(({ relations }) => relations);

  assert.equal(webs.length, 5);
  assert.equal(relations.length, 19);
  assert.equal(new Set(relations.map(({ id }) => id)).size, 19);
  assert.equal(JSON.stringify(source.part4_word_webs), snapshot);
});

test("splits arms and legs into independent ids and phrases", () => {
  const webs = buildWordWebs(source.part4_word_webs);
  const arms = webs.find(({ target }) => target === "arms");
  const legs = webs.find(({ target }) => target === "legs");

  assert.notEqual(arms.id, legs.id);
  assert.deepEqual(arms.relations.map(({ phrase }) => phrase), ["long arms", "short arms"]);
  assert.deepEqual(legs.relations.map(({ phrase }) => phrase), ["long legs", "short legs"]);
  assert.ok(webs.flatMap(({ relations }) => relations).every(({ phrase }) => !phrase.includes("arms and legs")));
  assert.equal(makeDescriptionPhrase("hair", "curly"), "curly hair");
});

test("provides a non-empty Vietnamese translation for every relationship", () => {
  const relations = buildWordWebs(source.part4_word_webs).flatMap(({ relations }) => relations);
  assert.equal(relations.length, 19);
  assert.ok(relations.every(({ translation }) => translation.trim().length > 0));
  assert.equal(getDescriptionTranslation("hair", "blonde"), "tóc vàng");
  assert.equal(getDescriptionTranslation("eyes", "big"), "đôi mắt to");
  assert.equal(getDescriptionTranslation("nose", "flat"), "mũi tẹt");
  assert.equal(getDescriptionTranslation("arms", "long"), "cánh tay dài");
  assert.equal(getDescriptionTranslation("legs", "short"), "chân ngắn");
});

test("progress counts valid discovered relations and completes at 19", () => {
  const webs = buildWordWebs(source.part4_word_webs);
  const allIds = new Set(webs.flatMap(({ relations }) => relations.map(({ id }) => id)));

  assert.deepEqual(getWordWebProgress(webs, new Set()), { discovered: 0, total: 19, complete: false });
  allIds.add("unrelated-id");
  assert.deepEqual(getWordWebProgress(webs, allIds), { discovered: 19, total: 19, complete: true });
});

test("replays arms and legs as separate networks", () => {
  const webs = buildWordWebs(source.part4_word_webs);
  const arms = webs.find(({ target }) => target === "arms");
  const legs = webs.find(({ target }) => target === "legs");
  assert.deepEqual(getNetworkReplayPhrases(arms), ["arms", "long arms", "short arms"]);
  assert.deepEqual(getNetworkReplayPhrases(legs), ["legs", "long legs", "short legs"]);
});

test("builds exactly ten deterministic scored questions from nineteen relations", () => {
  const webs = buildWordWebs(source.part4_word_webs);
  const questions = buildWordWebQuestions(webs);
  assert.equal(questions.length, 10);
  assert.deepEqual(buildWordWebQuestions(webs), questions);
  assert.equal(new Set(questions.map(({ relation }) => relation.id)).size, 10);
  assert.ok(questions.every(({ relation, options }) => options.length === 4 && new Set(options.map(({ id }) => id)).size === 4 && options.some(({ id }) => id === relation.id)));
});
