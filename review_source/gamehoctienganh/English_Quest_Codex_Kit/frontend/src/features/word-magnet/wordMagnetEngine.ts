export type RawWordMagnetQuestion = {
  id: number;
  sentence: string;
  answer: string;
  options: string[];
  source_status?: "user-provided-reference" | "ai-generated";
};

export type WordMagnetQuestion = RawWordMagnetQuestion & {
  source_status: "user-provided-reference" | "ai-generated";
  slotAnswers: string[];
  slotChoices: WordMagnetSlotChoice[];
  slotOrderFlexible: boolean;
  completedSentence: string;
};

export type WordMagnetSlotChoice = {
  id: string;
  text: string;
};

export type AudioPlan = {
  correct: boolean;
  selectedSpeech: string;
  completedSpeech: string | null;
};

const BLANK = "[BLANK]";
const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");

function countBlanks(sentence: string): number {
  return sentence.split(BLANK).length - 1;
}

export function splitAnswerIntoSlots(answer: string, slotCount: number): string[] {
  if (slotCount < 1) {
    throw new Error("Word Magnet sentence must contain at least one [BLANK]");
  }

  if (slotCount === 1) {
    return [answer.trim()];
  }

  const slots = answer
    .split(/\s+and\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (slots.length !== slotCount) {
    throw new Error(
      `Cannot map answer "${answer}" to ${slotCount} [BLANK] slots`,
    );
  }

  return slots;
}

export function fillSentence(sentence: string, slotAnswers: readonly string[]): string {
  let slotIndex = 0;
  const completed = sentence.replaceAll(BLANK, () => {
    const answer = slotAnswers[slotIndex];
    slotIndex += 1;
    if (answer === undefined) {
      throw new Error("Not enough answers for the sentence slots");
    }
    return answer;
  });

  if (slotIndex !== slotAnswers.length) {
    throw new Error("Too many answers for the sentence slots");
  }

  return completed;
}

function hasFlexibleAndSlots(sentence: string, slotCount: number): boolean {
  return slotCount === 2 && /\[BLANK\]\s+and\s+\[BLANK\]/i.test(sentence);
}

function createSlotChoices(options: readonly string[], slotCount: number): WordMagnetSlotChoice[] {
  return options.flatMap((option, optionIndex) =>
    splitAnswerIntoSlots(option, slotCount).map((text, slotIndex) => ({
      id: `option-${optionIndex}-slot-${slotIndex}`,
      text,
    })),
  );
}

export function evaluateSlotSelection(
  question: WordMagnetQuestion,
  selectedAnswers: readonly string[],
): { correct: boolean; completedSentence: string | null } {
  if (selectedAnswers.length !== question.slotAnswers.length) {
    return { correct: false, completedSentence: null };
  }
  const selected = selectedAnswers.map(normalize);
  const expected = question.slotAnswers.map(normalize);
  const correct = question.slotOrderFlexible
    ? [...selected].sort().every((answer, index) => answer === [...expected].sort()[index])
    : selected.every((answer, index) => answer === expected[index]);
  return {
    correct,
    completedSentence: correct ? fillSentence(question.sentence, selectedAnswers) : null,
  };
}

export function normalizeQuestions(
  rawQuestions: readonly RawWordMagnetQuestion[],
): WordMagnetQuestion[] {
  return rawQuestions.map((raw) => {
    const sourceStatus = raw.source_status ?? "user-provided-reference";
    if (sourceStatus !== "user-provided-reference" && sourceStatus !== "ai-generated") {
      throw new Error(`Question ${raw.id}: invalid source_status`);
    }
    const slotCount = countBlanks(raw.sentence);
    const slotAnswers = splitAnswerIntoSlots(raw.answer, slotCount);

    if (!raw.options.includes(raw.answer)) {
      throw new Error(`Question ${raw.id}: answer is not one of the options`);
    }

    return {
      id: raw.id,
      sentence: raw.sentence,
      answer: raw.answer,
      options: [...raw.options],
      source_status: sourceStatus,
      slotAnswers,
      slotChoices: createSlotChoices(raw.options, slotCount),
      slotOrderFlexible: hasFlexibleAndSlots(raw.sentence, slotCount),
      completedSentence: fillSentence(raw.sentence, slotAnswers),
    };
  });
}

export function createAudioPlan(
  question: WordMagnetQuestion,
  selectedOption: string,
): AudioPlan {
  const correct = selectedOption === question.answer;
  return {
    correct,
    selectedSpeech: selectedOption,
    completedSpeech: correct ? question.completedSentence : null,
  };
}
