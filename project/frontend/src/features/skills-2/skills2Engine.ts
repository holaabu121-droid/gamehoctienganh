export type Skills2GameId = "actions" | "who" | "fill" | "interview" | "diary";
export type SkillsSource = "user-provided-reference" | "ai-generated";
export type ListeningRound = {
  id: string; source_status: SkillsSource; character_name?: string; context: string; prompt: string;
  audio_text?: string; audio_source_status?: "ai-generated"; options: string[]; answer: string; explanation_vi: string; completed_text?: string;
};
export type SkillsHelp = { source_title: string; teaching_vi: string; steps: string[] };
export type Skills2Data = {
  lesson_id: "unit3-skills2"; source_status: "user-provided-reference"; usage_scope: "personal-family"; source_note: string;
  intro: { title: string; title_vi: string; description_vi: string; listening_steps: string[]; writing_plan: string[]; privacy_note_vi: string };
  source_material: { visible_actions: string[]; interview_questions: string[]; diary_word_target: number };
  game_help: Record<Skills2GameId, SkillsHelp>;
  games: Record<Skills2GameId, ListeningRound[]>;
};
const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const unique = (values: readonly string[]) => new Set(values.map(normalize)).size === values.length;
const twoWords = (value: string) => value.trim().split(/\s+/).length === 2;
function hasImageField(value: unknown): boolean { if (!value || typeof value !== "object") return false; if (Array.isArray(value)) return value.some(hasImageField); return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child)); }
export function validateSkills2Data(data: Skills2Data): Skills2Data {
  if (data.lesson_id !== "unit3-skills2" || data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) throw new Error("Skills 2 provenance is invalid");
  if (hasImageField(data)) throw new Error("Skills 2 must not embed image fields");
  if (JSON.stringify(data.source_material.visible_actions) !== JSON.stringify(["talking", "playing football", "walking"]) || data.source_material.diary_word_target !== 50 || JSON.stringify(data.source_material.interview_questions) !== JSON.stringify(["What's his / her name?", "What does he / she look like?", "What's he / she like?", "Why do you like him / her?"])) throw new Error("Skills 2 visible source prompts changed");
  const ids = Object.keys(data.games).sort(); if (JSON.stringify(ids) !== JSON.stringify(["actions", "diary", "fill", "interview", "who"])) throw new Error("Skills 2 needs five games");
  for (const id of ids as Skills2GameId[]) {
    const rounds=data.games[id], help=data.game_help[id];
    if (rounds.length !== 10 || !unique(rounds.map((item)=>item.id))) throw new Error(`${id} needs exactly 10 unique rounds`);
    if (!help?.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3 || !help.steps.some((step)=>step.includes("10")) || !help.steps.some((step)=>/đúng|sai|phản hồi/i.test(step))) throw new Error(`${id} help is incomplete`);
    const expectedReference: Record<Skills2GameId, number> = { actions:3, who:0, fill:0, interview:4, diary:2 };
    if (rounds.filter((item)=>item.source_status==="user-provided-reference").length!==expectedReference[id] || rounds.some((item)=>item.source_status!=="user-provided-reference"&&item.source_status!=="ai-generated")) throw new Error(`${id} provenance is invalid`);
    for (const item of rounds) {
      if (!item.context.trim() || !item.prompt.trim() || !item.explanation_vi.trim() || item.options.length < 2 || item.options.length > 4 || !unique(item.options) || !item.options.map(normalize).includes(normalize(item.answer))) throw new Error(`${id}/${item.id} is invalid`);
      if (item.source_status === "ai-generated" && item.character_name && !twoWords(item.character_name)) throw new Error(`${id}/${item.id} needs a two-word AI name`);
      if (["actions","who","fill"].includes(id) && (!item.audio_text || !item.audio_text.trim())) throw new Error(`${id}/${item.id} needs original audio text`);
      if (item.source_status === "user-provided-reference" && item.audio_text && item.audio_source_status !== "ai-generated") throw new Error(`${id}/${item.id} must label its new audio separately`);
    }
  }
  return data;
}
export const isSkills2Answer = (item: ListeningRound, answer: string) => normalize(item.answer) === normalize(answer);
