export type RawVocabularyItem = {
  en: string;
  vi: string;
};

export type VocabularyPair = {
  id: string;
  en: string;
  vi: string;
};

export type MatchDirection = "en-to-vi" | "vi-to-en";

export type WordBridgeRound = {
  id: number;
  prompts: VocabularyPair[];
  answerBank: VocabularyPair[];
};

export function createVocabularyPairs(
  rawParts: readonly string[],
  vocabulary: readonly RawVocabularyItem[],
): VocabularyPair[] {
  if (new Set(rawParts).size !== rawParts.length) {
    throw new Error("Word Bridge body parts must be unique");
  }
  const duplicateVocabulary = vocabulary
    .map(({ en }) => en)
    .filter((en, index, all) => all.indexOf(en) !== index);
  if (duplicateVocabulary.length > 0) {
    throw new Error(`Duplicate vocabulary entries: ${[...new Set(duplicateVocabulary)].join(", ")}`);
  }
  return rawParts.map((en, index) => {
    const item = vocabulary.find((entry) => entry.en === en);
    if (!item?.vi.trim()) throw new Error(`Missing Vietnamese meaning for: ${en}`);
    return { id: `body-pair-${index}`, en, vi: item.vi.trim() };
  });
}

export function shufflePairs(pairs: readonly VocabularyPair[]): VocabularyPair[] {
  if (pairs.length < 2) throw new Error("Word Bridge round needs at least two pairs");
  return [
    ...pairs.filter((_, index) => index % 2 === 1),
    ...pairs.filter((_, index) => index % 2 === 0),
  ];
}

export function createWordBridgeRounds(
  pairs: readonly VocabularyPair[],
  roundSize = 10,
): WordBridgeRound[] {
  if (roundSize < 2 || pairs.length === 0 || pairs.length % roundSize !== 0) {
    throw new Error("Word Bridge pairs must split into equal rounds");
  }
  const rounds: WordBridgeRound[] = [];
  for (let start = 0; start < pairs.length; start += roundSize) {
    const prompts = pairs.slice(start, start + roundSize);
    rounds.push({
      id: rounds.length + 1,
      prompts,
      answerBank: shufflePairs(prompts),
    });
  }
  return rounds;
}

export function getPromptText(pair: VocabularyPair, direction: MatchDirection): string {
  return direction === "en-to-vi" ? pair.en : pair.vi;
}

export function getAnswerText(pair: VocabularyPair, direction: MatchDirection): string {
  return direction === "en-to-vi" ? pair.vi : pair.en;
}

export function isCorrectMatch(prompt: VocabularyPair, answer: VocabularyPair): boolean {
  return prompt.id === answer.id;
}

export function scoreForAttempt(previousMistakes: number): number {
  if (previousMistakes === 0) return 100;
  if (previousMistakes === 1) return 70;
  return 40;
}
