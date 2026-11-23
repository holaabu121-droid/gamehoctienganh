export type LookingBackGameId = "personality" | "appearance" | "continuous" | "tenses" | "review";
export type LookingBackSource = "user-provided-reference" | "ai-generated";
export type LookingBackRound = {
  id: string;
  source_status: LookingBackSource;
  character_name?: string;
  context: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation_vi: string;
  read_aloud?: string;
  completed_text?: string;
};
export type LookingBackHelp = { source_title: string; teaching_vi: string; steps: string[] };
export type LookingBackData = {
  lesson_id: "unit3-looking-back";
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  intro: {
    title: string;
    title_vi: string;
    description_vi: string;
    vocabulary_steps: string[];
    grammar_steps: string[];
    privacy_note_vi: string;
  };
  source_material: {
    personality_answers: string[];
    appearance_questions: string[];
    continuous_answers: string[];
    tense_answers: string[];
  };
  game_help: Record<LookingBackGameId, LookingBackHelp>;
  games: Record<LookingBackGameId, LookingBackRound[]>;
};

const EXPECTED_PERSONALITY = ["funny", "hard-working", "kind", "caring", "active"];
const EXPECTED_APPEARANCE = [
  "Who has long hair in your class?",
  "Who has a small nose?",
  "Who has a round face?",
  "Does the classmate next to you have long hair?",
  "Does the classmate next to you have big eyes?",
];
const EXPECTED_CONTINUOUS = ["are running", "are talking", "aren't talking", "are drawing", "isn't teaching"];
const EXPECTED_TENSES = ["are you doing", "am writing", "cycles", "don't cycle", "walk", "Is he doing", "is reading"];
const EXPECTED_REFERENCE_COUNTS: Record<LookingBackGameId, number> = {
  personality: 5,
  appearance: 0,
  continuous: 5,
  tenses: 7,
  review: 0,
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const unique = (values: readonly string[]) => new Set(values.map(normalize)).size === values.length;
const isTwoWordName = (value: string) => value.trim().split(/\s+/).length === 2;
const sameJson = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);

function hasImageField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasImageField);
  return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child));
}

export function validateLookingBackData(data: LookingBackData): LookingBackData {
  if (data.lesson_id !== "unit3-looking-back" || data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) {
    throw new Error("Looking Back provenance is invalid");
  }
  if (hasImageField(data)) throw new Error("Looking Back must not embed image fields");
  if (!sameJson(data.source_material.personality_answers, EXPECTED_PERSONALITY)
      || !sameJson(data.source_material.appearance_questions, EXPECTED_APPEARANCE)
      || !sameJson(data.source_material.continuous_answers, EXPECTED_CONTINUOUS)
      || !sameJson(data.source_material.tense_answers, EXPECTED_TENSES)) {
    throw new Error("Looking Back literal source anchors changed");
  }
  if (data.intro.vocabulary_steps.length < 3 || data.intro.grammar_steps.length < 3 || !/hư cấu/i.test(data.intro.privacy_note_vi)) {
    throw new Error("Looking Back knowledge foundation is incomplete");
  }

  const gameIds = Object.keys(data.games).sort();
  if (!sameJson(gameIds, ["appearance", "continuous", "personality", "review", "tenses"])) throw new Error("Looking Back needs five games");
  for (const id of gameIds as LookingBackGameId[]) {
    const rounds = data.games[id];
    const help = data.game_help[id];
    if (rounds.length !== 10 || !unique(rounds.map(({ id: roundId }) => roundId))) throw new Error(`${id} needs exactly 10 unique rounds`);
    if (!help?.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3 || !help.steps.some((step) => step.includes("10")) || !help.steps.some((step) => /đúng|sai|phản hồi/i.test(step))) {
      throw new Error(`${id} help is incomplete`);
    }
    const referenceCount = rounds.filter(({ source_status }) => source_status === "user-provided-reference").length;
    if (referenceCount !== EXPECTED_REFERENCE_COUNTS[id]) throw new Error(`${id} provenance ratio is invalid`);
    for (const round of rounds) {
      if (round.source_status !== "user-provided-reference" && round.source_status !== "ai-generated") throw new Error(`${id}/${round.id} source status is invalid`);
      if (!round.context.trim() || !round.prompt.trim() || !round.explanation_vi.trim() || round.options.length < 2 || round.options.length > 4 || !unique(round.options) || !round.options.map(normalize).includes(normalize(round.answer))) {
        throw new Error(`${id}/${round.id} is invalid`);
      }
      if (round.source_status === "ai-generated" && (!round.character_name || !isTwoWordName(round.character_name))) throw new Error(`${id}/${round.id} needs a two-word AI name`);
    }
  }

  if (!sameJson(data.games.personality.slice(0, 5).map(({ answer }) => answer), EXPECTED_PERSONALITY)
      || !sameJson(data.games.continuous.slice(0, 5).map(({ answer }) => answer), EXPECTED_CONTINUOUS)
      || !sameJson(data.games.tenses.slice(0, 7).map(({ answer }) => answer), EXPECTED_TENSES)) {
    throw new Error("Looking Back source rounds must remain first and literal");
  }
  if (data.games.appearance.some(({ source_status }) => source_status !== "ai-generated")) throw new Error("Appearance game must use deterministic fictional profiles");
  return data;
}

export const isLookingBackAnswer = (round: LookingBackRound, answer: string): boolean => normalize(round.answer) === normalize(answer);
