import type { CommonRound } from "../skills-common/SkillsSection";

export type ReviewGameId = "sounds" | "vocabulary" | "grammar" | "email" | "school" | "listen_write";
export type ReviewHelp = { source_title: string; teaching_vi: string; steps: string[] };
export type ReviewData = {
  lesson_id: "review1";
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  intro: {
    title: string;
    title_vi: string;
    description_vi: string;
    language_foundations: string[];
    skills_foundations: string[];
  };
  games: Record<ReviewGameId, CommonRound[]>;
  game_help: Record<ReviewGameId, ReviewHelp>;
};

const IDS: ReviewGameId[] = ["sounds", "vocabulary", "grammar", "email", "school", "listen_write"];
const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const unique = (values: readonly string[]) => new Set(values.map(normalize)).size === values.length;

function hasImageField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasImageField);
  return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child));
}

export function validateReviewData(data: ReviewData): ReviewData {
  if (data.lesson_id !== "review1" || data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) throw new Error("Review 1 provenance is invalid");
  if (hasImageField(data)) throw new Error("Review 1 must not embed textbook images");
  if (JSON.stringify(Object.keys(data.games).sort()) !== JSON.stringify([...IDS].sort())) throw new Error("Review 1 needs exactly six games");
  for (const id of IDS) {
    const rounds = data.games[id];
    const help = data.game_help[id];
    if (rounds.length !== 10 || !unique(rounds.map((round) => round.id))) throw new Error(`${id} needs exactly 10 unique rounds`);
    if (!help?.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3) throw new Error(`${id} help is incomplete`);
    for (const round of rounds) {
      if (!round.context.trim() || !round.prompt.trim() || !round.explanation_vi.trim() || round.options.length < 2 || round.options.length > 4 || !unique(round.options) || !round.options.map(normalize).includes(normalize(round.answer))) throw new Error(`${id}/${round.id} is invalid`);
      if (round.source_status !== "user-provided-reference" && round.source_status !== "ai-generated") throw new Error(`${id}/${round.id} provenance is invalid`);
      if (round.audio_source_status && (id !== "listen_write" || round.audio_source_status !== "ai-generated")) throw new Error(`${id}/${round.id} audio provenance is invalid`);
    }
  }
  const listeningRounds = data.games.listen_write.filter((round) => round.audio_text);
  if (listeningRounds.length !== 5 || listeningRounds.some((round) => round.audio_source_status !== "ai-generated")) throw new Error("Review listening needs five labeled replacement-audio rounds");
  return data;
}

