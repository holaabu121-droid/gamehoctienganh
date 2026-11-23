export type Skills1GameId = "scanner" | "evidence" | "file" | "match" | "reason";
export type SkillsSource = "user-provided-reference" | "ai-generated";
export type SkillsRound = {
  id: string; source_status: SkillsSource; character_name?: string; context: string;
  prompt: string; options: string[]; answer: string; explanation_vi: string; read_aloud?: string;
};
export type SkillsHelp = { source_title: string; teaching_vi: string; steps: string[] };
export type Skills1Data = {
  lesson_id: "unit3-skills1"; source_status: "user-provided-reference"; usage_scope: "personal-family"; source_note: string;
  intro: { title: string; title_vi: string; description_vi: string; scan_targets: string[]; evidence_steps: string[] };
  source_material: { camp_name: string; age_range: string; email_friends: string[]; speaking_names: string[] };
  game_help: Record<Skills1GameId, SkillsHelp>;
  games: Record<Skills1GameId, SkillsRound[]>;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const unique = (values: readonly string[]) => new Set(values.map(normalize)).size === values.length;
const twoWords = (value: string) => value.trim().split(/\s+/).length === 2;
function hasImageField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasImageField);
  return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child));
}

export function validateSkills1Data(data: Skills1Data): Skills1Data {
  if (data.lesson_id !== "unit3-skills1" || data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) throw new Error("Skills 1 provenance is invalid");
  if (hasImageField(data)) throw new Error("Skills 1 must not embed image fields");
  if (data.source_material.camp_name !== "The Superb Summer Camp" || data.source_material.age_range !== "10 to 15" || JSON.stringify(data.source_material.email_friends) !== JSON.stringify(["Jimmy", "Phong", "Nhung"]) || JSON.stringify(data.source_material.speaking_names) !== JSON.stringify(["Mi", "An", "Vy"])) throw new Error("Skills 1 literal source changed");
  const ids = Object.keys(data.games).sort();
  if (JSON.stringify(ids) !== JSON.stringify(["evidence", "file", "match", "reason", "scanner"])) throw new Error("Skills 1 needs five games");
  for (const id of ids as Skills1GameId[]) {
    const rounds = data.games[id]; const help = data.game_help[id];
    if (rounds.length !== 10 || !unique(rounds.map((item) => item.id))) throw new Error(`${id} needs exactly 10 unique rounds`);
    if (!help?.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3 || !help.steps.some((step) => step.includes("10")) || !help.steps.some((step) => /đúng|sai|phản hồi/i.test(step))) throw new Error(`${id} help is incomplete`);
    const expectedReference: Record<Skills1GameId, number> = { scanner: 5, evidence: 5, file: 5, match: 3, reason: 1 };
    if (rounds.filter((item) => item.source_status === "user-provided-reference").length !== expectedReference[id] || rounds.some((item) => item.source_status !== "user-provided-reference" && item.source_status !== "ai-generated")) throw new Error(`${id} provenance is invalid`);
    for (const item of rounds) {
      if (!item.context.trim() || !item.prompt.trim() || !item.explanation_vi.trim() || item.options.length < 2 || item.options.length > 4 || !unique(item.options) || !item.options.map(normalize).includes(normalize(item.answer))) throw new Error(`${id}/${item.id} is invalid`);
      if (item.source_status === "ai-generated" && item.character_name && !twoWords(item.character_name)) throw new Error(`${id}/${item.id} needs a two-word AI name`);
    }
  }
  return data;
}
export const isSkills1Answer = (item: SkillsRound, answer: string) => normalize(item.answer) === normalize(answer);
