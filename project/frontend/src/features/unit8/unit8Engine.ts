import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit8GameId =
  | "dialogue" | "gap_fill" | "sports_match" | "sporty_quiz" | "details" | "vocabulary" | "dialogue_order"
  | "equipment" | "sport_equipment" | "context" | "sound" | "sound_sentence"
  | "past_simple" | "verb_forms" | "weekend_dialogue" | "imperatives" | "gym_rules"
  | "congratulations" | "replies" | "sports_quiz" | "interview" | "report"
  | "pele_reading" | "pele_details" | "timeline" | "sportsperson" | "presentation"
  | "listening" | "true_false" | "detail_fill" | "writing_cues" | "paragraph"
  | "odd_one_out" | "play_do_go" | "past_review" | "imperatives_review" | "final_mix"
  | "traditional_game" | "player_count" | "equipment_plan" | "how_to_play" | "project_presentation";

export type Unit8SectionId = "getting" | "acl1" | "acl2" | "communication" | "skills1" | "skills2" | "looking_back" | "project";
type Status = CommonRound["source_status"];
type Entry = { context: string; answer: string; translation?: string; source_status: Status };
export type Unit8Source = {
  lesson_id: "unit8-source"; source_status: "user-provided-reference"; usage_scope: "personal-family"; source_note: string;
  unit: { number: 8; title: string; title_vi: string };
  dialogue: Entry[];
  banks: Record<"sports" | "equipment" | "sounds" | "past_simple" | "imperatives" | "communication" | "pele" | "listening" | "looking_back" | "project" | "project_checklist", Entry[]>;
};
export type Unit8Built = Unit8Source & { games: Record<Unit8GameId, CommonRound[]>; help: Record<Unit8GameId, { source_title: string; teaching_vi: string; steps: string[] }> };

export const UNIT8_GAME_SECTIONS: Record<Unit8SectionId, Unit8GameId[]> = {
  getting: ["dialogue", "gap_fill", "sports_match", "sporty_quiz", "details", "vocabulary", "dialogue_order"],
  acl1: ["equipment", "sport_equipment", "context", "sound", "sound_sentence"],
  acl2: ["past_simple", "verb_forms", "weekend_dialogue", "imperatives", "gym_rules"],
  communication: ["congratulations", "replies", "sports_quiz", "interview", "report"],
  skills1: ["pele_reading", "pele_details", "timeline", "sportsperson", "presentation"],
  skills2: ["listening", "true_false", "detail_fill", "writing_cues", "paragraph"],
  looking_back: ["odd_one_out", "play_do_go", "past_review", "imperatives_review", "final_mix"],
  project: ["traditional_game", "player_count", "equipment_plan", "how_to_play", "project_presentation"],
};

const BANK_FOR_GAME: Record<Unit8GameId, keyof Unit8Source["banks"] | "dialogue"> = {
  dialogue:"dialogue", gap_fill:"dialogue", sports_match:"sports", sporty_quiz:"sports", details:"dialogue", vocabulary:"sports", dialogue_order:"dialogue",
  equipment:"equipment", sport_equipment:"equipment", context:"sports", sound:"sounds", sound_sentence:"sounds",
  past_simple:"past_simple", verb_forms:"past_simple", weekend_dialogue:"past_simple", imperatives:"imperatives", gym_rules:"imperatives",
  congratulations:"communication", replies:"communication", sports_quiz:"communication", interview:"communication", report:"communication",
  pele_reading:"pele", pele_details:"pele", timeline:"pele", sportsperson:"pele", presentation:"pele",
  listening:"listening", true_false:"listening", detail_fill:"listening", writing_cues:"listening", paragraph:"listening",
  odd_one_out:"looking_back", play_do_go:"looking_back", past_review:"past_simple", imperatives_review:"imperatives", final_mix:"communication",
  traditional_game:"project", player_count:"project", equipment_plan:"project", how_to_play:"project", project_presentation:"project_checklist",
};

const PROMPT: Partial<Record<Unit8GameId,string>> = {
  dialogue:"Choose the answer from the conversation.", gap_fill:"Complete the conversation detail.", sports_match:"Choose the sport or game.", sporty_quiz:"Choose the sporty answer.", details:"Check the conversation detail.", vocabulary:"Choose the sports word.", dialogue_order:"Choose the next line.",
  equipment:"Name the sports equipment.", sport_equipment:"Match the equipment with the sport.", context:"Choose the word for the context.", sound:"Choose the vowel sound.", sound_sentence:"Identify the target sound.",
  past_simple:"Choose the past simple form.", verb_forms:"Complete the sentence with the past form.", weekend_dialogue:"Complete the weekend dialogue.", imperatives:"Choose the correct imperative.", gym_rules:"Choose a suitable gym rule.",
  congratulations:"Choose the congratulation.", replies:"Choose the suitable reply.", sports_quiz:"Answer the sports quiz.", interview:"Choose the interview question.", report:"Choose the best report sentence.",
  pele_reading:"Read about Pelé and choose.", pele_details:"Choose the correct detail.", timeline:"Put the career fact on the timeline.", sportsperson:"Choose the sportsperson fact.", presentation:"Choose the speaking cue.",
  listening:"Listen and choose the detail.", true_false:"Choose True or False.", detail_fill:"Complete the listening detail.", writing_cues:"Choose the writing cue.", paragraph:"Complete the sports paragraph.",
  odd_one_out:"Choose the odd word or phrase.", play_do_go:"Choose play, do or go.", past_review:"Review the past simple.", imperatives_review:"Review imperatives.", final_mix:"Review Unit 8.",
  traditional_game:"Read the traditional-game information.", player_count:"Choose the number of players.", equipment_plan:"Choose the equipment.", how_to_play:"Choose the next instruction.", project_presentation:"Prepare the project presentation.",
};

function options(answer:string, bank:Entry[], index:number) {
  const alternatives=[...new Set(bank.map((item)=>item.answer))].filter((item)=>item!==answer);
  const fallbacks=["Not given","None","Another answer"];
  return [answer,...alternatives.slice(index%Math.max(1,alternatives.length)),...alternatives,...fallbacks].filter((item,pos,all)=>item&&all.indexOf(item)===pos).slice(0,4);
}

function buildGame(gameId:Unit8GameId,bank:Entry[]):CommonRound[] {
  const listening=["sound","sound_sentence","listening","true_false","detail_fill"].includes(gameId);
  return Array.from({length:10},(_,index)=>{
    const item=bank[index%bank.length];
    return {
      id:`u8-${gameId.replaceAll("_","-")}-${String(index+1).padStart(2,"0")}`,
      source_status:index<bank.length?item.source_status:"ai-generated",
      context:item.context,
      prompt:PROMPT[gameId]??"Choose the correct answer.",
      options:options(item.answer,bank,index),
      answer:item.answer,
      explanation_vi:item.translation??`Đáp án phù hợp là “${item.answer}”.`,
      ...(listening?{audio_text:item.context.replaceAll("/", ""),audio_source_status:"ai-generated" as const}:{}),
    };
  });
}

export function validateUnit8(source:Unit8Source):Unit8Built {
  if(source.lesson_id!=="unit8-source"||source.source_status!=="user-provided-reference"||source.usage_scope!=="personal-family"||source.unit.number!==8||!source.source_note.trim())throw new Error("Unit 8 provenance is invalid");
  if(source.dialogue.length<10)throw new Error("Unit 8 dialogue needs at least 10 source anchors");
  for(const [name,bank] of Object.entries(source.banks)){
    const minimumAnswers=name==="sounds"?2:3;
    if(bank.length<5||new Set(bank.map((item)=>item.answer)).size<minimumAnswers)throw new Error(`Unit 8 bank ${name} is incomplete`);
  }
  const gameIds=Object.values(UNIT8_GAME_SECTIONS).flat();
  if(gameIds.length!==42||new Set(gameIds).size!==42)throw new Error("Unit 8 needs exactly 42 games");
  const games=Object.fromEntries(gameIds.map((id)=>{const key=BANK_FOR_GAME[id];const bank=key==="dialogue"?source.dialogue:source.banks[key];return [id,buildGame(id,bank)];})) as Record<Unit8GameId,CommonRound[]>;
  const help=Object.fromEntries(gameIds.map((id)=>[id,{source_title:"Tiếng Anh 6 · Unit 8 — Sports and Games",teaching_vi:"Đọc hoặc nghe gợi ý, xác định từ khóa thể thao hay dấu hiệu ngữ pháp rồi chọn đáp án phù hợp nhất.",steps:["Đọc yêu cầu tiếng Anh và gợi ý tiếng Việt.","Loại đáp án sai chủ đề hoặc sai dạng từ.","Chọn đáp án rồi xem giải thích trước khi chuyển câu."]}])) as Unit8Built["help"];
  return {...source,games,help};
}
