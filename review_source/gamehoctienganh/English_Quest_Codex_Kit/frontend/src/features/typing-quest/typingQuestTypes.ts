export type RawVocabularyItem = {
  en: string;
  type: string;
  vi: string;
  sentence: string;
  options?: string[];
};

export type VocabularyItem = {
  id: string;
  unit: 3;
  en: string;
  type: string;
  vi: string;
  sentence: string;
  sentenceVi: string;
  options: string[];
  fillGapApproved: boolean;
  sourceStatus: "reference-only" | "designed";
};

export type TypingQuestionMode = "fill_gap" | "translation_typing";
export type TypingMode = TypingQuestionMode | "mixed";
export type TypingDifficulty = "learning" | "challenge";
export type TypingQuestionCount = 10;

export type TypingConfig = {
  mode: TypingMode;
  difficulty: TypingDifficulty;
  count: TypingQuestionCount;
  seed?: number;
};

export type GapParts = {
  before: string;
  after: string;
};

export type TypingQuestion = {
  id: string;
  vocabId: string;
  mode: TypingQuestionMode;
  prompt: string;
  answer: string;
  vi: string;
  type: string;
  gapParts?: GapParts;
  completedSentence?: string;
  sentenceVi: string;
  sentenceApproved: boolean;
  sourceStatus: "reference-only" | "designed";
};

export type CharacterStatus = "correct" | "incorrect" | "pending" | "extra";

export type CharacterComparison = {
  index: number;
  expected: string | null;
  actual: string | null;
  status: CharacterStatus;
};

export type ChallengeState = {
  answer: string;
  attempt: string;
  mistakeCount: number;
  combo: number;
};

export type ChallengeKeyResult = ChallengeState & {
  accepted: boolean;
  reset: boolean;
  complete: boolean;
};

export type TypingErrorType =
  | "none"
  | "missing_character"
  | "extra_character"
  | "transposition"
  | "substitution"
  | "wrong_word"
  | "hyphen_error";

export type HintLevel = 0 | 1 | 2 | 3 | 4;

export type HintState = {
  level: HintLevel;
  length: number;
  revealed: Array<{ index: number; character: string }>;
  playAudio: boolean;
  showAnswer: boolean;
};

export type TypingAudioSettings = {
  speakWord: boolean;
  speakMeaning: boolean;
  speakSentence: boolean;
};

export type TypingAudioStep = {
  kind: "word" | "meaning" | "sentence";
  text: string;
  lang: "en-US" | "vi-VN";
  rate: number;
};

export type TypingAttempt = {
  questionId: string;
  vocabId: string;
  mode: TypingQuestionMode;
  difficulty: TypingDifficulty;
  correct: boolean;
  firstTryCorrect: boolean;
  hintLevel: HintLevel;
  xp: number;
  errorType: TypingErrorType;
  mistakeCount: number;
  durationMs: number;
};

export type TypingSummary = {
  totalQuestions: number;
  correctCount: number;
  totalXp: number;
  firstTryCorrectCount: number;
  hintUses: number;
  commonError: TypingErrorType | null;
  reviewVocabIds: string[];
};
