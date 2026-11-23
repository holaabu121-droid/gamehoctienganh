export type CommunicationGameId = "dialogue" | "interview" | "detective" | "birthday" | "opinion";
export type ItemSourceStatus = "user-provided-reference" | "ai-generated";
export type DialogueFunction = "appearance-question" | "appearance-description" | "personality-question" | "personality-description";
export type InterviewTarget = "appearance" | "personality";

type SourcedRound = { id: string; source_status: ItemSourceStatus; character_name?: string };
export type DialogueRound = SourcedRound & { speaker: string; character_name: string; line: string; answer: DialogueFunction; options: DialogueFunction[]; explanation_vi: string };
export type InterviewRound = SourcedRound & { character_name: string; target: InterviewTarget; question: string; prompt_vi: string; answer: string; answer_vi: string; options: string[] };
export type DetectiveRound = SourcedRound & { character_name: string; header: string; profile: string; answers: string[]; options: string[]; evidence_vi: string };
export type BirthdayRound = SourcedRound & { character_name?: string; birthday?: string; date_range: string; traits: string[]; answer: string; options: string[] };
export type OpinionRound = SourcedRound & { character_name: string; statement: string; answer: "Đúng" | "Sai"; options: Array<"Đúng" | "Sai">; explanation_vi: string };

type HelpEntry = { source_title: string; teaching_vi: string; steps: string[] };
type SourceMaterial = {
  dialogue_title: string;
  dialogue: Array<{ speaker: string; line: string }>;
  interview_instruction: string;
  profiles: Array<{ header: string; text: string }>;
  birthday_table: Array<{ date_range: string; traits: string[] }>;
  example_stems: string[];
};

export type CommunicationData = {
  lesson_id: string;
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  provenance: { reference_image_count: 1; user_provided_reference_items: 23; ai_generated_items: 32; ai_generation_note: string };
  intro: { title: string; title_vi: string; appearance_rule_vi: string; personality_rule_vi: string; birthday_note_vi: string };
  source_material: SourceMaterial;
  game_help: Record<CommunicationGameId, HelpEntry>;
  dialogue_lab: DialogueRound[];
  best_friend_interview: InterviewRound[];
  student_detective: DetectiveRound[];
  birthday_personality: BirthdayRound[];
  opinion_true_false: OpinionRound[];
};

const EXPECTED_DIALOGUE = [
  { speaker: "Linda", line: "What does your best friend look like?" },
  { speaker: "Mi", line: "She's short with long black hair. She has bright brown eyes." },
  { speaker: "Linda", line: "What's she like?" },
  { speaker: "Mi", line: "She's very kind and creative." },
];
const EXPECTED_PROFILES = [
  { header: "Vinh (Viet Nam, birthday 7/12)", text: "I live in Da Nang. At home, I can do my homework without my parents' help. At school, I like speaking English. I'm going to an English club now." },
  { header: "John (England, birthday 26/2)", text: "I come from Cambridge. In my free time, I draw pictures and play the piano. I also help some old people near my house. I usually read to them at the weekend. Now I'm drawing in my garden." },
];
const EXPECTED_BIRTHDAY_TABLE = [
  ["21/3 - 19/4", "confident", "active"], ["20/4 - 20/5", "loving", "hard-working"],
  ["21/5 - 21/6", "active", "friendly"], ["22/6 - 22/7", "caring", "clever"],
  ["23/7 - 22/8", "confident", "creative"], ["23/8 - 22/9", "careful", "hard-working"],
  ["23/9 - 23/10", "creative", "friendly"], ["24/10 - 21/11", "careful", "funny"],
  ["22/11 - 21/12", "clever", "confident"], ["22/12 - 19/1", "careful", "hard-working"],
  ["20/1 - 18/2", "friendly", "clever"], ["19/2 - 20/3", "kind", "creative"],
];
const EXPECTED_STEMS = ["My birthday is ...", "It's true that ...", "It isn't true that ..."];

const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const unique = (values: readonly string[]) => new Set(values).size === values.length;
const isTwoWordName = (value: string) => value.trim().split(/\s+/).length === 2;

function validateOptions(options: readonly string[], answer: string, label: string, max = 4) {
  const normalized = options.map(normalize);
  if (options.length < 2 || options.length > max || !unique(normalized) || !normalized.includes(normalize(answer))) {
    throw new Error(`${label} needs unique options containing its answer`);
  }
}

function hasImageField(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasImageField);
  return Object.entries(value).some(([key, child]) => /^(image|image_url|image_src|illustration|photo)$/i.test(key) || hasImageField(child));
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function validateCommunicationData(data: CommunicationData): CommunicationData {
  if (data.lesson_id !== "unit3-communication" || data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) {
    throw new Error("Communication needs personal-family reference provenance");
  }
  if (data.provenance.reference_image_count !== 1 || data.provenance.user_provided_reference_items !== 23 || data.provenance.ai_generated_items !== 32 || !data.provenance.ai_generation_note.trim()) {
    throw new Error("Communication provenance totals are invalid");
  }
  if (hasImageField(data)) throw new Error("Communication lesson must not embed image fields");

  const collections = [data.dialogue_lab, data.best_friend_interview, data.student_detective, data.birthday_personality, data.opinion_true_false] as const;
  const expectedCounts = [10, 10, 10, 15, 10];
  const expectedReferenceCounts = [4, 2, 2, 12, 3];
  collections.forEach((items, index) => {
    if (items.length !== expectedCounts[index]) throw new Error(`Communication game ${index + 1} needs exactly ${expectedCounts[index]} rounds`);
    if (!unique(items.map(({ id }) => id))) throw new Error(`Communication game ${index + 1} needs unique ids`);
    const referenceCount = items.filter(({ source_status }) => source_status === "user-provided-reference").length;
    const aiCount = items.filter(({ source_status }) => source_status === "ai-generated").length;
    if (referenceCount !== expectedReferenceCounts[index] || aiCount !== expectedCounts[index] - expectedReferenceCounts[index]) throw new Error(`Invalid provenance ratio for Communication game ${index + 1}`);
    if (items.some(({ source_status }) => source_status !== "user-provided-reference" && source_status !== "ai-generated")) throw new Error(`Invalid item provenance for Communication game ${index + 1}`);
    if (items.some(({ source_status, character_name }) => source_status === "ai-generated" && (!character_name || !isTwoWordName(character_name)))) throw new Error(`AI-generated Communication names in game ${index + 1} must contain two words`);
  });

  const expectedHelpKeys = ["birthday", "detective", "dialogue", "interview", "opinion"];
  if (!sameJson(Object.keys(data.game_help).sort(), expectedHelpKeys)) throw new Error("Communication needs help for all five games");
  expectedHelpKeys.forEach((key, index) => {
    const help = data.game_help[key as CommunicationGameId];
    const count = key === "birthday" ? "15" : "10";
    if (!help.source_title.trim() || !help.teaching_vi.trim() || help.steps.length < 3 || help.steps.some((step) => !step.trim()) || !help.steps.some((step) => step.includes(count))) {
      throw new Error(`Communication help ${index + 1} must explain its source, completion and round count`);
    }
  });

  if (!data.intro.title.trim() || !data.intro.title_vi.trim() || !data.intro.appearance_rule_vi.includes("look like") || !data.intro.personality_rule_vi.includes("What is") || !/không phải bằng chứng khoa học/i.test(data.intro.birthday_note_vi)) {
    throw new Error("Communication knowledge foundation is incomplete");
  }
  if (!sameJson(data.source_material.dialogue, EXPECTED_DIALOGUE) || !sameJson(data.source_material.profiles, EXPECTED_PROFILES)) throw new Error("Literal dialogue or profiles changed from the user reference");
  const tableRows = data.source_material.birthday_table.map(({ date_range, traits }) => [date_range, ...traits]);
  if (!sameJson(tableRows, EXPECTED_BIRTHDAY_TABLE) || !sameJson(data.source_material.example_stems, EXPECTED_STEMS)) throw new Error("Literal birthday table or example stems changed from the user reference");
  if (data.source_material.dialogue_title !== "Listen and read the dialogue between Linda and Mi. Pay attention to the highlighted questions." || data.source_material.interview_instruction !== "Work with a classmate. Ask him / her about his / her best friend. Remember to use the two questions highlighted in 1.") throw new Error("Literal source instructions changed");

  data.dialogue_lab.forEach((item) => {
    validateOptions(item.options, item.answer, `Dialogue ${item.id}`);
    if (!item.line.trim() || !item.explanation_vi.trim()) throw new Error(`Dialogue ${item.id} is incomplete`);
  });
  data.best_friend_interview.forEach((item) => {
    validateOptions(item.options, item.answer, `Interview ${item.id}`, 3);
    if ((item.target !== "appearance" && item.target !== "personality") || !item.question.trim() || !item.answer_vi.trim()) throw new Error(`Interview ${item.id} is incomplete`);
  });
  data.student_detective.forEach((item) => {
    if (item.answers.length < 1 || item.answers.length > 2 || !unique(item.answers.map(normalize)) || item.options.length !== 4 || !unique(item.options.map(normalize)) || !item.answers.every((answer) => item.options.map(normalize).includes(normalize(answer))) || !item.profile.trim() || !item.evidence_vi.trim()) {
      throw new Error(`Detective ${item.id} needs one or two evidenced answers inside four unique options`);
    }
  });
  data.birthday_personality.forEach((item) => {
    validateOptions(item.options, item.answer, `Birthday ${item.id}`, 3);
    if (item.traits.length !== 2 || !unique(item.traits.map(normalize)) || normalize(item.answer) !== normalize(item.traits.join(", ")) || !item.date_range.trim()) throw new Error(`Birthday ${item.id} needs one range and two traits`);
  });
  data.opinion_true_false.forEach((item) => {
    validateOptions(item.options, item.answer, `Opinion ${item.id}`, 2);
    if (!sameJson([...item.options].sort(), ["Sai", "Đúng"]) || !item.statement.trim() || !item.explanation_vi.trim()) throw new Error(`Opinion ${item.id} needs a true/false answer and explanation`);
  });

  if (!sameJson(data.dialogue_lab.slice(0, 4).map(({ speaker, line }) => ({ speaker, line })), EXPECTED_DIALOGUE)) throw new Error("Source dialogue rounds must remain first and literal");
  if (!sameJson(data.student_detective.slice(0, 2).map(({ header, profile }) => ({ header, text: profile })), EXPECTED_PROFILES)) throw new Error("Source profile rounds must remain first and literal");
  if (!sameJson(data.birthday_personality.slice(0, 12).map(({ date_range, traits }) => [date_range, ...traits]), EXPECTED_BIRTHDAY_TABLE)) throw new Error("Source birthday rows must remain literal");
  if (!sameJson(data.opinion_true_false.slice(0, 3).map(({ statement }) => statement), EXPECTED_STEMS)) throw new Error("Source opinion stems must remain literal");
  return data;
}

export function isDialogueAnswer(item: DialogueRound, answer: string): boolean {
  return normalize(item.answer) === normalize(answer);
}

export function isInterviewAnswer(item: InterviewRound, answer: string): boolean {
  return normalize(item.answer) === normalize(answer);
}

export function isDetectiveAnswer(item: DetectiveRound, answers: readonly string[]): boolean {
  if (answers.length !== item.answers.length) return false;
  const expected = item.answers.map(normalize).sort();
  return answers.map(normalize).sort().every((answer, index) => answer === expected[index]);
}

export function isBirthdayAnswer(item: BirthdayRound, answer: string): boolean {
  return normalize(item.answer) === normalize(answer);
}

export function isOpinionAnswer(item: OpinionRound, answer: string): boolean {
  return normalize(item.answer) === normalize(answer);
}
