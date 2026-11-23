export type CloserLook2GameId = "builder" | "reporter" | "questions" | "detective" | "guessing";
export type TenseId = "simple" | "continuous";
export type ItemSourceStatus = "user-provided-reference" | "ai-generated";

export type Pattern = { id: "positive" | "negative" | "question" | "short-answer"; label_vi: string; pattern: string; example: string; example_vi: string };
export type BuilderRound = { id: string; source_status: ItemSourceStatus; character_name: string; subject: string; verb: string; cue_vi: string; polarity: "positive" | "negative" | "question"; be: string; verb_ing: string; be_options: string[]; verb_options: string[]; sentence: string; sentence_vi: string };
export type ReporterRound = { id: string; source_status: ItemSourceStatus; character_name: string; emoji: string; scene_vi: string; answer: string; answer_vi: string; options: string[] };
export type QuestionRound = { id: string; source_status: ItemSourceStatus; character_name: string; situation_vi: string; question: string; short_answer: string; question_options: string[]; answer_options: string[] };
export type DetectiveRound = { id: string; source_status: ItemSourceStatus; character_name: string; context: string; context_vi: string; answer_tense: TenseId; completed_sentence: string; completed_sentence_vi: string };
export type GuessingRound = { id: string; source_status: ItemSourceStatus; character_name: string; emoji: string; clue_vi: string; question: string; short_answer: string; options: string[] };

export type CloserLook2Data = {
  lesson_id: string;
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  provenance: { reference_image_count: 2; user_provided_reference_items: 22; ai_generated_items: 28; ai_generation_note: string };
  intro: {
    title: string;
    title_vi: string;
    description_vi: string;
    guide_vi: string;
    present_continuous: { use_vi: string; time_markers: string[]; patterns: Pattern[] };
    tense_choice: { simple_vi: string; continuous_vi: string; decision_tip_vi: string; simple_markers: string[]; continuous_markers: string[] };
  };
  game_help: Record<CloserLook2GameId, { source_title: string; teaching_vi: string; steps: string[] }>;
  be_builder: BuilderRound[];
  action_reporter: ReporterRound[];
  question_switch: QuestionRound[];
  time_detective: DetectiveRound[];
  action_guessing: GuessingRound[];
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("en-US");
const unique = (values: readonly string[]) => new Set(values).size === values.length;

function validateOptions(options: readonly string[], answer: string, label: string) {
  if (options.length < 2 || options.length > 3 || !unique(options.map(normalize)) || !options.some((option) => normalize(option) === normalize(answer))) {
    throw new Error(`${label} needs two or three unique options containing its answer`);
  }
}

export function validateCloserLook2Data(data: CloserLook2Data): CloserLook2Data {
  if (data.source_status !== "user-provided-reference" || data.usage_scope !== "personal-family" || !data.source_note.trim()) throw new Error("A Closer Look 2 needs user-provided personal-use provenance");
  if (data.provenance.reference_image_count !== 2 || data.provenance.user_provided_reference_items !== 22 || data.provenance.ai_generated_items !== 28 || !data.provenance.ai_generation_note.trim()) throw new Error("A Closer Look 2 provenance totals are invalid");
  const collections = [data.be_builder, data.action_reporter, data.question_switch, data.time_detective, data.action_guessing];
  if (collections.some((items) => items.length !== 10)) throw new Error("Every A Closer Look 2 game needs exactly ten rounds");
  if (collections.some((items) => !unique(items.map(({ id }) => id)))) throw new Error("Game round ids must be unique inside each game");

  const expectedReferenceCounts = [5, 5, 5, 5, 2];
  collections.forEach((items, index) => {
    const referenceCount = items.filter(({ source_status }) => source_status === "user-provided-reference").length;
    const aiCount = items.filter(({ source_status }) => source_status === "ai-generated").length;
    if (referenceCount !== expectedReferenceCounts[index] || aiCount !== 10 - expectedReferenceCounts[index]) throw new Error(`Invalid provenance ratio for game ${index + 1}`);
    if (items.some(({ source_status }) => source_status !== "user-provided-reference" && source_status !== "ai-generated")) throw new Error(`Invalid item provenance for game ${index + 1}`);
    if (items.some(({ source_status, character_name }) => source_status === "ai-generated" && character_name.trim().split(/\s+/).length !== 2)) throw new Error(`AI-generated examples in game ${index + 1} need two-word Vietnamese names`);
  });

  const patternIds = data.intro.present_continuous.patterns.map(({ id }) => id).sort();
  if (patternIds.join(",") !== ["negative", "positive", "question", "short-answer"].join(",")) throw new Error("Present continuous foundation needs all four forms");
  if (!data.intro.present_continuous.use_vi.trim() || data.intro.present_continuous.time_markers.length < 3 || !data.intro.tense_choice.decision_tip_vi.trim()) {
    throw new Error("Grammar foundations are incomplete");
  }
  if (!data.intro.tense_choice.simple_vi.trim() || !data.intro.tense_choice.continuous_vi.trim()) throw new Error("Tense contrast is incomplete");

  const helpKeys = Object.keys(data.game_help).sort();
  if (helpKeys.join(",") !== ["builder", "detective", "guessing", "questions", "reporter"].join(",") || Object.values(data.game_help).some(({ source_title, teaching_vi, steps }) => !source_title.trim() || !teaching_vi.trim() || steps.length < 3 || steps.some((step) => !step.trim()))) {
    throw new Error("Every game needs a source title, Vietnamese teaching translation and three help steps");
  }

  for (const item of data.be_builder) {
    validateOptions(item.be_options, item.be, `Builder ${item.id} auxiliary`);
    validateOptions(item.verb_options, item.verb_ing, `Builder ${item.id} verb`);
    if (!item.sentence.trim() || !item.sentence_vi.trim()) throw new Error(`Builder ${item.id} needs a bilingual sentence`);
  }
  for (const item of data.action_reporter) validateOptions(item.options, item.answer, `Reporter ${item.id}`);
  for (const item of data.question_switch) {
    validateOptions(item.question_options, item.question, `Question ${item.id}`);
    validateOptions(item.answer_options, item.short_answer, `Short answer ${item.id}`);
  }
  if (data.time_detective.some(({ answer_tense }) => answer_tense !== "simple" && answer_tense !== "continuous")) throw new Error("Invalid tense answer");
  for (const item of data.action_guessing) validateOptions(item.options, item.question, `Guessing ${item.id}`);
  return data;
}

export function isBuilderAnswer(item: BuilderRound, be: string, verbIng: string): boolean {
  return normalize(item.be) === normalize(be) && normalize(item.verb_ing) === normalize(verbIng);
}

export function isReporterAnswer(item: ReporterRound, answer: string): boolean {
  return normalize(item.answer) === normalize(answer);
}

export function isQuestionAnswer(item: QuestionRound, question: string, shortAnswer: string): boolean {
  return normalize(item.question) === normalize(question) && normalize(item.short_answer) === normalize(shortAnswer);
}

export function isTenseAnswer(item: DetectiveRound, tense: TenseId): boolean {
  return item.answer_tense === tense;
}

export function isGuessingAnswer(item: GuessingRound, question: string): boolean {
  return normalize(item.question) === normalize(question);
}
