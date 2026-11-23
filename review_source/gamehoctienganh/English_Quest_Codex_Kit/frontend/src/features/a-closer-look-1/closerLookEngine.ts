export type GameId = "picture" | "context" | "garden" | "sound" | "rhythm";
export type InitialSound = "b" | "p";

export type PictureItem = {
  id: string;
  character_name: string;
  word: string;
  vi: string;
  emoji: string;
  scene: string;
  sentence: string;
  sentence_vi: string;
};

export type ContextQuestion = { id: string; character_name: string; answer: string; prompt: string; prompt_vi: string };
export type GardenCharacter = { id: string; name: string; emoji: string; clue: string; clue_vi: string; answers: string[]; sentence: string; sentence_vi: string };
export type SoundItem = { word: string; sound: InitialSound };
export type VocabularyEntry = { word: string; vi: string };
export type CloserLookData = {
  lesson_id: string;
  source_status: "designed";
  source_note: string;
  intro: {
    title: string;
    title_vi: string;
    description_vi: string;
    guide_vi: string;
    appearance_examples: string[];
    personality_examples: string[];
    vocabulary: VocabularyEntry[];
    pronunciation: {
      title: string;
      description_vi: string;
      practice_tip_vi: string;
      sounds: Array<{ symbol: "/b/" | "/p/"; tip_vi: string; examples: string[] }>;
    };
  };
  game_help: Record<GameId, string[]>;
  picture_match: PictureItem[];
  context_clues: { word_bank: string[]; questions: ContextQuestion[] };
  friendship_garden: GardenCharacter[];
  sound_sort: SoundItem[];
  rhythm_echo: { gap_ms: number; speakers: string[]; lines: string[] };
};

export type RhythmStep =
  | { kind: "speak-line"; lineIndex: number; text: string; rate: number }
  | { kind: "repeat-gap"; lineIndex: number; durationMs: number }
  | { kind: "speak-full"; text: string; rate: number };

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function isTwoWordName(value: string): boolean {
  return value.trim().split(/\s+/).length === 2;
}

export function validateCloserLookData(data: CloserLookData): CloserLookData {
  if (data.source_status !== "designed") throw new Error("A Closer Look 1 must be marked designed");
  const roundCounts = [data.picture_match.length, data.context_clues.questions.length, data.friendship_garden.length, data.sound_sort.length, data.rhythm_echo.lines.length];
  if (roundCounts.some((count) => count !== 10)) throw new Error("Every A Closer Look 1 game must contain exactly ten rounds");
  if (data.rhythm_echo.gap_ms !== 7000) throw new Error("Rhythm Echo requires a 7-second repeat gap");
  const vocabularyWords = data.intro.vocabulary.map(({ word }) => word);
  if (!unique(vocabularyWords) || data.intro.vocabulary.some(({ word, vi }) => !word.trim() || !vi.trim()) || !unique(data.picture_match.map(({ word }) => word)) || !unique(data.sound_sort.map(({ word }) => word))) {
    throw new Error("Duplicate A Closer Look 1 content");
  }
  const helpKeys = Object.keys(data.game_help).sort();
  const invalidHelp = Object.values(data.game_help).some((steps) => steps.length < 3 || steps.some((step) => !step.trim()) || !steps.some((step) => step.includes("10")));
  const invalidScoredHelp = (["picture", "context", "garden"] as const).some((id) => !data.game_help[id].some((step) => step.includes("1000")));
  const invalidPracticeHelp = (["sound", "rhythm"] as const).some((id) => !data.game_help[id].some((step) => step.includes("1000")) || !data.game_help[id].some((step) => step.includes("60 giây")));
  if (helpKeys.join(",") !== ["context", "garden", "picture", "rhythm", "sound"].join(",") || invalidHelp || invalidScoredHelp || invalidPracticeHelp) {
    throw new Error("Every game needs useful help steps that explain ten rounds and scoring");
  }
  if (data.intro.pronunciation.sounds.length !== 2 || new Set(data.intro.pronunciation.sounds.map(({ symbol }) => symbol)).size !== 2 || data.intro.pronunciation.sounds.some(({ tip_vi, examples }) => !tip_vi.trim() || examples.length < 2)) {
    throw new Error("Pronunciation foundation must explain /b/ and /p/");
  }
  const bank = new Set(data.context_clues.word_bank);
  if (!data.context_clues.questions.every(({ answer }) => bank.has(answer))) throw new Error("Context answer is missing from the word bank");
  if (!data.friendship_garden.every(({ name, clue, clue_vi, answers }) => isTwoWordName(name) && clue.trim() && clue_vi.trim() && answers.length === 2 && unique(answers) && answers.every((answer) => vocabularyWords.includes(answer)))) throw new Error("Each garden character needs a two-word name, clues and two unique vocabulary answers");
  const exampleNames = [...data.picture_match.map(({ character_name }) => character_name), ...data.context_clues.questions.map(({ character_name }) => character_name), ...data.rhythm_echo.speakers];
  if (!exampleNames.every(isTwoWordName)) throw new Error("Every example character needs a two-word Vietnamese name");
  if (!data.sound_sort.every(({ sound }) => sound === "b" || sound === "p") || data.sound_sort.filter(({ sound }) => sound === "b").length !== 5 || data.sound_sort.filter(({ sound }) => sound === "p").length !== 5) throw new Error("Sound Sort needs five /b/ and five /p/ words");
  return data;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");

export function isPictureMatch(word: string, item: PictureItem): boolean {
  return normalize(word) === normalize(item.word);
}

export function isContextAnswer(question: ContextQuestion, answer: string): boolean {
  return normalize(question.answer) === normalize(answer);
}

export function isGardenAnswer(character: GardenCharacter, answers: readonly string[]): boolean {
  if (answers.length !== character.answers.length) return false;
  const expected = [...character.answers].map(normalize).sort();
  return [...answers].map(normalize).sort().every((answer, index) => answer === expected[index]);
}

export function isSoundAnswer(item: SoundItem, answer: InitialSound): boolean {
  return item.sound === answer;
}

export function buildRhythmPlan(lines: readonly string[], gapMs: number): RhythmStep[] {
  if (!lines.length || gapMs < 1000) throw new Error("Rhythm plan needs lines and a usable gap");
  const practice = lines.flatMap<RhythmStep>((text, lineIndex) => [
    { kind: "speak-line", lineIndex, text, rate: 0.72 },
    { kind: "repeat-gap", lineIndex, durationMs: gapMs },
  ]);
  return [...practice, { kind: "speak-full", text: lines.join(" "), rate: 0.86 }];
}
