import type {
  ChallengeKeyResult,
  ChallengeState,
  CharacterComparison,
  GapParts,
  HintLevel,
  HintState,
  RawVocabularyItem,
  TypingAttempt,
  TypingAudioSettings,
  TypingAudioStep,
  TypingConfig,
  TypingErrorType,
  TypingQuestion,
  TypingQuestionMode,
  TypingSummary,
  VocabularyItem,
} from "./typingQuestTypes";

const XP_BY_HINT_LEVEL: Record<HintLevel, number> = { 0: 10, 1: 7, 2: 5, 3: 3, 4: 0 };
const REVIEWED_SENTENCE_BY_WORD: Record<string, string> = {
  "hard-working": "Mina is very [BLANK]. She always studies hard and finishes her homework on time.",
};
const VIETNAMESE_SENTENCE_BY_WORD: Record<string, string> = {
  cheek: "Cô ấy có khuôn mặt tròn với đôi má hồng.",
  eye: "Bạn thân nhất của tôi có đôi mắt nâu to.",
  hand: "Cậu ấy viết bằng tay trái.",
  arm: "Con khỉ có đôi cánh tay dài.",
  mouth: "Hãy mở miệng và nói 'A'.",
  leg: "Cậu ấy chạy rất nhanh vì có đôi chân dài.",
  nose: "Cô ấy có chiếc mũi nhỏ và thẳng.",
  hair: "Châu có mái tóc đen dài.",
  shoulder: "Cậu ấy đeo chiếc túi trên vai.",
  foot: "Bàn chân tôi đau sau khi đi bộ quá nhiều.",
  "hard-working": "Mina rất chăm chỉ. Bạn ấy luôn học tập nghiêm túc và hoàn thành bài tập đúng giờ.",
  confident: "Cậu ấy là một cậu bé tự tin. Cậu ấy không nhút nhát trước nhiều người.",
  funny: "Nick rất hài hước. Cậu ấy làm mọi người bật cười!",
  caring: "Mẹ tôi rất chu đáo và biết quan tâm. Mẹ luôn chăm sóc chúng tôi.",
  active: "Lan năng động và thích chơi thể thao.",
  careful: "Kim rất cẩn thận. Bạn ấy chú ý đến việc mình đang làm.",
  clever: "Mai thông minh. Bạn ấy học mọi thứ nhanh chóng và dễ dàng.",
  shy: "Đừng ngại, hãy đến và chào mọi người.",
  kind: "Cậu ấy là người tốt bụng. Cậu ấy quan tâm đến mọi người.",
  creative: "Mina rất sáng tạo. Bạn ấy thích vẽ tranh.",
  friendly: "Nam thân thiện. Cậu ấy thích giúp đỡ bạn bè.",
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function slug(value: string): string {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  const random = seededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function buildVocabularyItems(rawItems: readonly RawVocabularyItem[]): VocabularyItem[] {
  const seen = new Set<string>();
  return rawItems.map((raw) => {
    const en = raw.en.trim();
    const normalized = normalize(en);
    const sentence = REVIEWED_SENTENCE_BY_WORD[normalized] ?? raw.sentence;
    if (!en || !raw.vi.trim() || !raw.type.trim() || !sentence.includes("[BLANK]")) {
      throw new Error(`Invalid Typing Quest vocabulary item: ${en || "<empty>"}`);
    }
    if (seen.has(normalized)) throw new Error(`Duplicate Typing Quest word: ${en}`);
    const sentenceVi = VIETNAMESE_SENTENCE_BY_WORD[normalized];
    if (!sentenceVi) throw new Error(`Missing Vietnamese example translation: ${en}`);
    seen.add(normalized);
    return {
      id: `u3-${slug(en)}`,
      unit: 3,
      en,
      type: raw.type.trim(),
      vi: raw.vi.trim(),
      sentence,
      sentenceVi,
      options: [...(raw.options ?? [])],
      fillGapApproved: true,
      sourceStatus: REVIEWED_SENTENCE_BY_WORD[normalized] ? "designed" : "reference-only",
    };
  });
}

export function renderGapParts(sentence: string): GapParts {
  const pieces = sentence.split("[BLANK]");
  if (pieces.length !== 2) throw new Error("Typing Quest sentence must contain exactly one [BLANK]");
  return { before: pieces[0], after: pieces[1] };
}

export function completeGapSentence(sentence: string, answer: string): string {
  const { before, after } = renderGapParts(sentence);
  return `${before}${answer}${after}`;
}

function createQuestion(item: VocabularyItem, mode: TypingQuestionMode): TypingQuestion {
  const sentenceApproved = item.fillGapApproved;
  const completedSentence = sentenceApproved ? completeGapSentence(item.sentence, item.en) : undefined;
  if (mode === "fill_gap") {
    if (!sentenceApproved) throw new Error(`Fill the Gap is not approved for ${item.en}`);
    return {
      id: `typing-fill-${item.id}`,
      vocabId: item.id,
      mode,
      prompt: item.sentence,
      answer: item.en,
      vi: item.vi,
      type: item.type,
      gapParts: renderGapParts(item.sentence),
      completedSentence,
      sentenceVi: item.sentenceVi,
      sentenceApproved,
      sourceStatus: item.sourceStatus,
    };
  }
  return {
    id: `typing-translation-${item.id}`,
    vocabId: item.id,
    mode,
    prompt: item.vi,
    answer: item.en,
    vi: item.vi,
    type: item.type,
    completedSentence,
    sentenceVi: item.sentenceVi,
    sentenceApproved,
    sourceStatus: item.sourceStatus,
  };
}

function requestedCount(config: TypingConfig, available: number): number {
  return Math.min(config.count, available);
}

export function buildTypingQuestions(
  items: readonly VocabularyItem[],
  config: TypingConfig,
): TypingQuestion[] {
  const seed = config.seed ?? 0;
  if (config.mode === "fill_gap") {
    const available = shuffled(items.filter(({ fillGapApproved }) => fillGapApproved), seed);
    return available.slice(0, requestedCount(config, available.length)).map((item) => createQuestion(item, "fill_gap"));
  }
  if (config.mode === "translation_typing") {
    const available = shuffled(items, seed);
    return available.slice(0, requestedCount(config, available.length)).map((item) => createQuestion(item, "translation_typing"));
  }

  const available = shuffled(items, seed);
  return available.slice(0, requestedCount(config, available.length)).map((item, index) => {
    const preferred: TypingQuestionMode = index % 2 === 0 ? "fill_gap" : "translation_typing";
    return createQuestion(item, preferred === "fill_gap" && !item.fillGapApproved ? "translation_typing" : preferred);
  });
}

export function compareAttempt(answer: string, attempt: string): CharacterComparison[] {
  const expected = normalize(answer);
  const actual = normalize(attempt);
  const length = Math.max(expected.length, actual.length);
  return Array.from({ length }, (_, index) => {
    const expectedCharacter = expected[index] ?? null;
    const actualCharacter = actual[index] ?? null;
    let status: CharacterComparison["status"];
    if (expectedCharacter === null) status = "extra";
    else if (actualCharacter === null) status = "pending";
    else status = expectedCharacter === actualCharacter ? "correct" : "incorrect";
    return { index, expected: expectedCharacter, actual: actualCharacter, status };
  });
}

export function isAnswerCorrect(answer: string, attempt: string): boolean {
  return normalize(answer) === normalize(attempt);
}

export function applyChallengeKey(state: ChallengeState, key: string): ChallengeKeyResult {
  if (key === "Backspace") {
    const attempt = state.attempt.slice(0, -1);
    return { ...state, attempt, accepted: true, reset: false, complete: isAnswerCorrect(state.answer, attempt) };
  }
  if (!/^[a-z-]$/i.test(key)) {
    return { ...state, accepted: false, reset: false, complete: isAnswerCorrect(state.answer, state.attempt) };
  }

  const answer = normalize(state.answer);
  const nextCharacter = answer[state.attempt.length];
  if (key.toLocaleLowerCase("en-US") !== nextCharacter) {
    return {
      ...state,
      attempt: "",
      mistakeCount: state.mistakeCount + 1,
      combo: 0,
      accepted: false,
      reset: true,
      complete: false,
    };
  }

  const attempt = state.attempt + nextCharacter;
  const complete = attempt === answer;
  return {
    ...state,
    attempt,
    combo: complete && state.mistakeCount === 0 ? state.combo + 1 : state.combo,
    accepted: true,
    reset: false,
    complete,
  };
}

function oneMissingCharacter(answer: string, attempt: string): boolean {
  if (answer.length !== attempt.length + 1) return false;
  for (let index = 0; index < answer.length; index += 1) {
    if (answer.slice(0, index) + answer.slice(index + 1) === attempt) return true;
  }
  return false;
}

function adjacentTransposition(answer: string, attempt: string): boolean {
  if (answer.length !== attempt.length) return false;
  const differences = [...answer].map((character, index) => character === attempt[index] ? -1 : index).filter((index) => index >= 0);
  if (differences.length !== 2 || differences[1] !== differences[0] + 1) return false;
  const [first, second] = differences;
  return answer[first] === attempt[second] && answer[second] === attempt[first];
}

export function classifyTypingError(answerValue: string, attemptValue: string): TypingErrorType {
  const answer = normalize(answerValue);
  const attempt = normalize(attemptValue);
  if (answer === attempt) return "none";
  if (answer.replaceAll("-", "") === attempt.replaceAll("-", "")) return "hyphen_error";
  if (oneMissingCharacter(answer, attempt)) return "missing_character";
  if (oneMissingCharacter(attempt, answer)) return "extra_character";
  if (adjacentTransposition(answer, attempt)) return "transposition";
  if (answer.length === attempt.length) return "substitution";
  return "wrong_word";
}

export function advanceHint(answerValue: string, currentLevel: HintLevel): HintState {
  const answer = normalize(answerValue);
  const level = Math.min(4, currentLevel + 1) as HintLevel;
  const revealedCount = level === 1 ? 1 : level >= 2 && level < 4 ? Math.min(2, answer.length) : level === 4 ? answer.length : 0;
  return {
    level,
    length: answer.length,
    revealed: Array.from({ length: revealedCount }, (_, index) => ({ index, character: answer[index] })),
    playAudio: level === 3,
    showAnswer: level === 4,
  };
}

export function scoreQuestion(hintLevel: HintLevel): number {
  return XP_BY_HINT_LEVEL[hintLevel];
}

export function buildCorrectAudioPlan(
  question: TypingQuestion,
  settings: TypingAudioSettings,
): TypingAudioStep[] {
  const plan: TypingAudioStep[] = [];
  if (settings.speakWord) plan.push({ kind: "word", text: question.answer, lang: "en-US", rate: 0.84 });
  if (settings.speakMeaning) plan.push({ kind: "meaning", text: question.vi, lang: "vi-VN", rate: 0.9 });
  if (settings.speakSentence && question.sentenceApproved && question.completedSentence) {
    plan.push({ kind: "sentence", text: question.completedSentence, lang: "en-US", rate: 0.86 });
  }
  return plan;
}

export function summarizeSession(attempts: readonly TypingAttempt[]): TypingSummary {
  const errorCounts = new Map<TypingErrorType, number>();
  const reviewVocabIds: string[] = [];
  const seenReview = new Set<string>();
  for (const attempt of attempts) {
    if (attempt.errorType !== "none") errorCounts.set(attempt.errorType, (errorCounts.get(attempt.errorType) ?? 0) + 1);
    if ((!attempt.firstTryCorrect || attempt.hintLevel > 0 || !attempt.correct) && !seenReview.has(attempt.vocabId)) {
      seenReview.add(attempt.vocabId);
      reviewVocabIds.push(attempt.vocabId);
    }
  }
  const commonError = [...errorCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
  return {
    totalQuestions: attempts.length,
    correctCount: attempts.filter(({ correct }) => correct).length,
    totalXp: attempts.reduce((total, { xp }) => total + xp, 0),
    firstTryCorrectCount: attempts.filter(({ firstTryCorrect }) => firstTryCorrect).length,
    hintUses: attempts.reduce((total, { hintLevel }) => total + hintLevel, 0),
    commonError,
    reviewVocabIds,
  };
}
