export type FriendDetectiveRound = {
  id: string;
  source_status: "ai-generated";
  character_name: string;
  context: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation_vi: string;
  completed_text: string;
};

export type FriendDetectiveData = {
  lesson_id: "unit3-getting-started-part5";
  source_status: "designed";
  usage_scope: "personal-family";
  source_note: string;
  intro: {
    title: string;
    title_vi: string;
    description_vi: string;
    clue_steps: string[];
    language_steps: string[];
    privacy_note_vi: string;
  };
  game_help: {
    detective: { source_title: string; teaching_vi: string; steps: string[] };
  };
  games: { detective: FriendDetectiveRound[] };
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const isTwoWordName = (value: string) => value.trim().split(/\s+/).length === 2;

function hasImageField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasImageField);
  return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child));
}

export function validateFriendDetectiveData(data: FriendDetectiveData): FriendDetectiveData {
  if (data.lesson_id !== "unit3-getting-started-part5" || data.source_status !== "designed" || data.usage_scope !== "personal-family" || !data.source_note.trim()) {
    throw new Error("Friend Detective provenance is invalid");
  }
  if (hasImageField(data)) throw new Error("Friend Detective must not embed image fields");
  if (data.intro.clue_steps.length < 3 || data.intro.language_steps.length < 3 || !/hư cấu/i.test(data.intro.privacy_note_vi)) {
    throw new Error("Friend Detective foundation is incomplete");
  }
  const rounds = data.games.detective;
  if (rounds.length !== 10 || new Set(rounds.map(({ id }) => id)).size !== 10) throw new Error("Friend Detective needs exactly 10 unique rounds");
  for (const round of rounds) {
    if (round.source_status !== "ai-generated" || !isTwoWordName(round.character_name)) throw new Error(`${round.id} provenance or name is invalid`);
    if (!round.context.trim() || !round.prompt.trim() || !round.explanation_vi.trim() || !round.completed_text.trim() || round.options.length !== 3 || new Set(round.options.map(normalize)).size !== 3 || !round.options.map(normalize).includes(normalize(round.answer))) {
      throw new Error(`${round.id} content is invalid`);
    }
  }
  const help = data.game_help.detective;
  if (!help.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3 || !help.steps.some((step) => step.includes("10")) || !help.steps.some((step) => /đúng|sai|phản hồi/i.test(step))) {
    throw new Error("Friend Detective help is incomplete");
  }
  return data;
}

export const isFriendDetectiveAnswer = (round: FriendDetectiveRound, answer: string): boolean => normalize(round.answer) === normalize(answer);
