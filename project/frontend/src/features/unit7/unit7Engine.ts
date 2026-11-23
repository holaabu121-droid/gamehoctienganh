import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit7GameId =
  | "dialogue" | "programme_match" | "comprehension" | "adjectives" | "fact_check" | "interview" | "spelling"
  | "vocabulary" | "definitions" | "context" | "sound" | "tongue_twister"
  | "question_words" | "wh_dialogue" | "wh_questions" | "conjunctions" | "sentence_join"
  | "favourite" | "world_tv" | "lets_learn" | "hello_fatty" | "compare"
  | "tv_guide" | "time_match" | "preferences" | "speaking" | "schedule"
  | "listening" | "details" | "habits" | "writing" | "paragraph"
  | "category" | "fill" | "wh_review" | "conjunction_review" | "final_mix"
  | "survey" | "questions" | "interview_plan" | "results" | "presentation";

export type Unit7SectionId = "getting" | "acl1" | "acl2" | "communication" | "skills1" | "skills2" | "looking_back" | "project";
type Status = CommonRound["source_status"];
type Entry = { context: string; answer: string; translation?: string; source_status: Status };
export type Unit7Source = {
  lesson_id: "unit7-source"; source_status: "user-provided-reference"; usage_scope: "personal-family"; source_note: string;
  unit: { number: 7; title: string; title_vi: string };
  dialogue: Entry[];
  banks: Record<"programmes" | "vocabulary" | "adjectives" | "sounds" | "tongue_twisters" | "question_words" | "conjunctions" | "communication" | "tv_guide" | "listening" | "project" | "project_checklist", Entry[]>;
};
export type Unit7Built = Unit7Source & { games: Record<Unit7GameId, CommonRound[]>; help: Record<Unit7GameId, { source_title: string; teaching_vi: string; steps: string[] }> };

export const UNIT7_GAME_SECTIONS: Record<Unit7SectionId, Unit7GameId[]> = {
  getting: ["dialogue", "programme_match", "comprehension", "adjectives", "fact_check", "interview", "spelling"],
  acl1: ["vocabulary", "definitions", "context", "sound", "tongue_twister"],
  acl2: ["question_words", "wh_dialogue", "wh_questions", "conjunctions", "sentence_join"],
  communication: ["favourite", "world_tv", "lets_learn", "hello_fatty", "compare"],
  skills1: ["tv_guide", "time_match", "preferences", "speaking", "schedule"],
  skills2: ["listening", "details", "habits", "writing", "paragraph"],
  looking_back: ["category", "fill", "wh_review", "conjunction_review", "final_mix"],
  project: ["survey", "questions", "interview_plan", "results", "presentation"],
};

const BANK_FOR_GAME: Record<Unit7GameId, keyof Unit7Source["banks"] | "dialogue"> = {
  dialogue: "dialogue", programme_match: "programmes", comprehension: "dialogue", adjectives: "adjectives", fact_check: "dialogue", interview: "programmes", spelling: "vocabulary",
  vocabulary: "vocabulary", definitions: "vocabulary", context: "adjectives", sound: "sounds", tongue_twister: "tongue_twisters",
  question_words: "question_words", wh_dialogue: "question_words", wh_questions: "question_words", conjunctions: "conjunctions", sentence_join: "conjunctions",
  favourite: "communication", world_tv: "communication", lets_learn: "communication", hello_fatty: "communication", compare: "communication",
  tv_guide: "tv_guide", time_match: "tv_guide", preferences: "tv_guide", speaking: "programmes", schedule: "tv_guide",
  listening: "listening", details: "listening", habits: "listening", writing: "listening", paragraph: "listening",
  category: "programmes", fill: "vocabulary", wh_review: "question_words", conjunction_review: "conjunctions", final_mix: "communication",
  survey: "project", questions: "project", interview_plan: "project", results: "project", presentation: "project_checklist",
};

const PROMPT: Partial<Record<Unit7GameId, string>> = {
  dialogue: "Choose the answer from the conversation.", programme_match: "Match the programme with its type.", comprehension: "Choose the correct detail.", adjectives: "Choose the best adjective.", fact_check: "Choose the correct information.", interview: "Choose the suitable answer.", spelling: "Choose the television word.",
  vocabulary: "Choose the television word.", definitions: "Match the definition.", context: "Choose the word that fits the context.", sound: "Choose the final sound.", tongue_twister: "Identify the highlighted sound.",
  question_words: "Choose the question word.", wh_dialogue: "Complete the dialogue.", wh_questions: "Build the correct question.", conjunctions: "Choose and, but or so.", sentence_join: "Join the ideas correctly.",
  favourite: "Choose the suitable reply.", world_tv: "Choose the country or fact.", lets_learn: "Check the Let's Learn detail.", hello_fatty: "Check the Hello Fatty detail.", compare: "Compare the two programmes.",
  tv_guide: "Read the TV guide and choose.", time_match: "Match the time and programme.", preferences: "Choose a programme for the viewer.", speaking: "Choose the complete speaking answer.", schedule: "Plan the viewing schedule.",
  listening: "Listen and choose the detail.", details: "Choose the detail you hear.", habits: "Identify Mai's TV habit.", writing: "Choose the best sentence for a TV-habits paragraph.", paragraph: "Complete the paragraph.",
  category: "Put the word in the correct group.", fill: "Complete the review sentence.", wh_review: "Choose the question word.", conjunction_review: "Choose the conjunction.", final_mix: "Review Unit 7.",
  survey: "Identify the survey focus.", questions: "Choose the clear survey question.", interview_plan: "Choose the safe interview step.", results: "Choose how to report results.", presentation: "Prepare the class presentation.",
};

function options(answer: string, bank: Entry[], index: number) {
  const alternatives = [...new Set(bank.map((item) => item.answer))].filter((item) => item !== answer);
  return [answer, alternatives[index % alternatives.length], alternatives[(index + 3) % alternatives.length], alternatives[(index + 6) % alternatives.length]].filter((item, pos, all) => item && all.indexOf(item) === pos).slice(0, 4);
}

function buildGame(gameId: Unit7GameId, bank: Entry[]): CommonRound[] {
  const listening = ["sound", "tongue_twister", "listening", "details"].includes(gameId);
  return Array.from({ length: 10 }, (_, index) => {
    const item = bank[index % bank.length];
    return {
      id: `u7-${gameId.replaceAll("_", "-")}-${String(index + 1).padStart(2, "0")}`,
      source_status: index < bank.length ? item.source_status : "ai-generated",
      context: item.context,
      prompt: PROMPT[gameId] ?? "Choose the correct answer.",
      options: options(item.answer, bank, index),
      answer: item.answer,
      explanation_vi: `Đáp án phù hợp là “${item.answer}”.`,
      ...(listening ? { audio_text: item.context, audio_source_status: "ai-generated" as const } : {}),
    };
  });
}

export function validateUnit7(source: Unit7Source): Unit7Built {
  if (source.lesson_id !== "unit7-source" || source.source_status !== "user-provided-reference" || source.usage_scope !== "personal-family" || source.unit.number !== 7 || !source.source_note.trim()) throw new Error("Unit 7 provenance is invalid");
  if (source.dialogue.length < 10) throw new Error("Unit 7 dialogue needs at least 10 source anchors");
  for (const [name, bank] of Object.entries(source.banks)) {
    const minimumAnswers = name === "sounds" ? 2 : name === "tongue_twisters" ? 1 : 3;
    if (bank.length < 5 || new Set(bank.map((item) => item.answer)).size < minimumAnswers) throw new Error(`Unit 7 bank ${name} is incomplete`);
  }
  const gameIds = Object.values(UNIT7_GAME_SECTIONS).flat();
  if (gameIds.length !== 42 || new Set(gameIds).size !== 42) throw new Error("Unit 7 needs exactly 42 games");
  const games = Object.fromEntries(gameIds.map((id) => {
    const key = BANK_FOR_GAME[id];
    const bank = key === "dialogue" ? source.dialogue : source.banks[key];
    return [id, buildGame(id, bank)];
  })) as Record<Unit7GameId, CommonRound[]>;
  const help = Object.fromEntries(gameIds.map((id) => [id, {
    source_title: "Tiếng Anh 6 · Unit 7 — Television",
    teaching_vi: "Đọc hoặc nghe phần gợi ý, xác định từ khóa rồi chọn đáp án phù hợp nhất.",
    steps: ["Đọc câu hỏi và gợi ý tiếng Việt.", "Loại các đáp án không đúng chủ đề hoặc ngữ pháp.", "Chọn đáp án rồi xem giải thích trước khi chuyển câu."],
  }])) as Unit7Built["help"];
  return { ...source, games, help };
}
