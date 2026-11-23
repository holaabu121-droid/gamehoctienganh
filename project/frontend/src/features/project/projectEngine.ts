export type ProjectGameId = "path" | "interview" | "notes" | "writer" | "present";
export type ProjectSource = "user-provided-reference" | "ai-generated";
export type ProjectRound = {
  id: string;
  source_status: ProjectSource;
  character_name?: string;
  context: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation_vi: string;
  completed_text: string;
};
export type ProjectData = {
  lesson_id: "unit3-project";
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  intro: {
    title: string;
    title_vi: string;
    description_vi: string;
    project_steps_vi: string[];
    language_steps: string[];
    privacy_note_vi: string;
  };
  source_material: { project_steps: string[]; now_i_can: string[] };
  game_help: Record<ProjectGameId, { source_title: string; teaching_vi: string; steps: string[] }>;
  games: Record<ProjectGameId, ProjectRound[]>;
};

const GAME_IDS: ProjectGameId[] = ["path", "interview", "notes", "writer", "present"];
const REFERENCE_COUNTS: Record<ProjectGameId, number> = { path: 5, interview: 3, notes: 0, writer: 3, present: 8 };
const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const isTwoWordName = (value: string) => value.trim().split(/\s+/).length === 2;

function hasImageField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasImageField);
  return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child));
}

export function validateProjectData(data: ProjectData): ProjectData {
  if (data.lesson_id !== "unit3-project" || data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) throw new Error("Project provenance is invalid");
  if (hasImageField(data)) throw new Error("Project lesson must not embed image fields");
  if (data.source_material.project_steps.length !== 5 || data.source_material.now_i_can.length !== 8) throw new Error("Project source anchors are incomplete");
  if (data.intro.project_steps_vi.length !== 5 || data.intro.language_steps.length < 3 || !/hư cấu/i.test(data.intro.privacy_note_vi)) throw new Error("Project foundation is incomplete");
  if (JSON.stringify(Object.keys(data.games)) !== JSON.stringify(GAME_IDS)) throw new Error("Project needs five ordered games");

  for (const gameId of GAME_IDS) {
    const rounds = data.games[gameId];
    if (rounds.length !== 10 || new Set(rounds.map(({ id }) => id)).size !== 10) throw new Error(`${gameId} needs exactly 10 unique rounds`);
    if (rounds.filter(({ source_status }) => source_status === "user-provided-reference").length !== REFERENCE_COUNTS[gameId]) throw new Error(`${gameId} provenance ratio is invalid`);
    for (const round of rounds) {
      if (!round.context.trim() || !round.prompt.trim() || !round.explanation_vi.trim() || !round.completed_text.trim() || round.options.length !== 3 || new Set(round.options.map(normalize)).size !== 3 || !round.options.map(normalize).includes(normalize(round.answer))) throw new Error(`${gameId}/${round.id} content is invalid`);
      if (round.source_status === "ai-generated" && (!round.character_name || !isTwoWordName(round.character_name))) throw new Error(`${gameId}/${round.id} needs a two-word AI name`);
      if (round.source_status !== "ai-generated" && round.source_status !== "user-provided-reference") throw new Error(`${gameId}/${round.id} source status is invalid`);
    }
    const help = data.game_help[gameId];
    if (!help?.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3 || !help.steps.some((step) => step.includes("10")) || !help.steps.some((step) => /sai|phản hồi/i.test(step))) throw new Error(`${gameId} help is incomplete`);
  }
  return data;
}

export const isProjectAnswer = (round: ProjectRound, answer: string): boolean => normalize(round.answer) === normalize(answer);
