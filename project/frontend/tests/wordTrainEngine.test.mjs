import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createWordTrainRounds,
  evaluateWordTrain,
  shuffleTokens,
  tokenizeSentence,
} from "../src/features/word-train/wordTrainEngine.ts";

const rawPath = new URL("../../data/raw/getting_started_unit3.json", import.meta.url);
const source = JSON.parse(readFileSync(rawPath, "utf8"));
const practice = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_part2_practice.json", import.meta.url), "utf8"));
const allQuestions = [...source.part2_blanks, ...practice.questions];

test("builds five completed rounds without mutating raw Part 2 data", () => {
  const snapshot = JSON.stringify(source.part2_blanks);
  const rounds = createWordTrainRounds(source.part2_blanks);
  assert.equal(rounds.length, 5);
  assert.equal(rounds[2].completedSentence, "Phong and Nam see Mai and Chau.");
  assert.equal(rounds[3].completedSentence, "Chau has glasses and long black hair.");
  assert.equal(JSON.stringify(source.part2_blanks), snapshot);
});

test("keeps apostrophes and visible punctuation while stripping punctuation from speech", () => {
  const tokens = tokenizeSentence("4Teen is Phong's favourite magazine.", "sample");
  assert.deepEqual(tokens.map(({ text }) => text), ["4Teen", "is", "Phong's", "favourite", "magazine."]);
  assert.equal(tokens[2].spokenText, "Phong's");
  assert.equal(tokens[4].spokenText, "magazine");
});

test("uses unique token ids and a deterministic non-identity shuffle with duplicate words", () => {
  const tokens = tokenizeSentence("Phong and Nam see Mai and Chau.", "duplicate");
  const shuffled = shuffleTokens(tokens);
  assert.equal(new Set(tokens.map(({ id }) => id)).size, tokens.length);
  assert.equal(tokens.filter(({ text }) => text === "and").length, 2);
  assert.deepEqual(shuffleTokens(tokens), shuffled);
  assert.notDeepEqual(shuffled.map(({ id }) => id), tokens.map(({ id }) => id));
  assert.deepEqual(new Set(shuffled.map(({ id }) => id)), new Set(tokens.map(({ id }) => id)));
});

test("speaks the completed sentence only for exact correct token order", () => {
  const round = createWordTrainRounds(source.part2_blanks)[0];
  assert.deepEqual(evaluateWordTrain(round, round.tokens), {
    correct: true,
    completedSpeech: round.completedSentence,
  });
  assert.deepEqual(evaluateWordTrain(round, round.shuffledTokens), {
    correct: false,
    completedSpeech: null,
  });
});

test("accepts identical and tokens in either matching sentence position", () => {
  const round = createWordTrainRounds(source.part2_blanks)[2];
  const andIndexes = round.tokens
    .map((token, index) => token.text === "and" ? index : -1)
    .filter((index) => index >= 0);
  assert.deepEqual(andIndexes, [1, 5]);
  const swapped = [...round.tokens];
  [swapped[andIndexes[0]], swapped[andIndexes[1]]] = [
    swapped[andIndexes[1]],
    swapped[andIndexes[0]],
  ];
  assert.notEqual(swapped[1].id, round.tokens[1].id);
  assert.deepEqual(evaluateWordTrain(round, swapped), {
    correct: true,
    completedSpeech: round.completedSentence,
  });
});

test("builds the same ten reference-plus-AI rounds used by Word Magnet", () => {
  const rounds = createWordTrainRounds(allQuestions);
  assert.equal(rounds.length, 10);
  assert.equal(rounds[0].completedSentence, "Phong and Nam are having a picnic.");
  assert.equal(rounds[9].completedSentence, "Gia Huy and Bao An are going to the bookshop.");
});
