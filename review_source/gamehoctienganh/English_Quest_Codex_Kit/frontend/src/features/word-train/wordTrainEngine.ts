import {
  normalizeQuestions,
  type RawWordMagnetQuestion,
} from "../word-magnet/wordMagnetEngine.ts";

export type WordToken = {
  id: string;
  text: string;
  spokenText: string;
  originalIndex: number;
};

export type WordTrainRound = {
  id: number;
  completedSentence: string;
  tokens: WordToken[];
  shuffledTokens: WordToken[];
};

export type WordTrainEvaluation = {
  correct: boolean;
  completedSpeech: string | null;
};

export function tokenizeSentence(sentence: string, idPrefix = "token"): WordToken[] {
  const words = sentence.trim().split(/\s+/u).filter(Boolean);
  if (words.length < 2) throw new Error("Word Train sentence needs at least two words");
  return words.map((text, originalIndex) => ({
    id: `${idPrefix}-${originalIndex}`,
    text,
    spokenText: text.replace(/[.,!?;:]+$/u, ""),
    originalIndex,
  }));
}

export function shuffleTokens(tokens: readonly WordToken[]): WordToken[] {
  if (tokens.length < 2) throw new Error("Word Train needs at least two tokens");
  const odd = tokens.filter((_, index) => index % 2 === 1);
  const even = tokens.filter((_, index) => index % 2 === 0);
  return [...odd, ...even];
}

export function createWordTrainRounds(
  rawQuestions: readonly RawWordMagnetQuestion[],
): WordTrainRound[] {
  return normalizeQuestions(rawQuestions).map((question) => {
    const tokens = tokenizeSentence(question.completedSentence, `round-${question.id}`);
    return {
      id: question.id,
      completedSentence: question.completedSentence,
      tokens,
      shuffledTokens: shuffleTokens(tokens),
    };
  });
}

export function evaluateWordTrain(
  round: WordTrainRound,
  selectedTokens: readonly WordToken[],
): WordTrainEvaluation {
  const correct =
    selectedTokens.length === round.tokens.length &&
    selectedTokens.every((token, index) => token.text === round.tokens[index].text);
  return {
    correct,
    completedSpeech: correct ? round.completedSentence : null,
  };
}
