import type { CommonRound } from "../skills-common/SkillsSection";
import type { BonusLesson, BonusRound, BonusStageId } from "../bonus/bonusEngine";

export type StructuredSectionId = "getting"|"acl1"|"acl2"|"communication"|"skills1"|"skills2"|"looking_back"|"project";
export type StructuredGameId =
  | "getting-dialogue"|"getting-detail"|"getting-vocabulary"|"getting-match"|"getting-order"|"getting-true-false"|"getting-recap"
  | "acl1-vocabulary"|"acl1-match"|"acl1-context"|"acl1-sound"|"acl1-sound-sentence"
  | "acl2-rule"|"acl2-choice"|"acl2-fill"|"acl2-context"|"acl2-review"
  | "communication-language"|"communication-response"|"communication-quiz"|"communication-speaking"|"communication-report"
  | "skills1-reading"|"skills1-details"|"skills1-inference"|"skills1-speaking"|"skills1-presentation"
  | "skills2-listening"|"skills2-true-false"|"skills2-detail-fill"|"skills2-writing-cues"|"skills2-paragraph"
  | "looking-back-vocabulary"|"looking-back-grammar"|"looking-back-correction"|"looking-back-final-mix"|"looking-back-self-check"
  | "project-plan"|"project-details"|"project-steps"|"project-report"|"project-presentation";

export const STRUCTURED_GAME_SECTIONS:Record<StructuredSectionId,StructuredGameId[]>={
  getting:["getting-dialogue","getting-detail","getting-vocabulary","getting-match","getting-order","getting-true-false","getting-recap"],
  acl1:["acl1-vocabulary","acl1-match","acl1-context","acl1-sound","acl1-sound-sentence"],
  acl2:["acl2-rule","acl2-choice","acl2-fill","acl2-context","acl2-review"],
  communication:["communication-language","communication-response","communication-quiz","communication-speaking","communication-report"],
  skills1:["skills1-reading","skills1-details","skills1-inference","skills1-speaking","skills1-presentation"],
  skills2:["skills2-listening","skills2-true-false","skills2-detail-fill","skills2-writing-cues","skills2-paragraph"],
  looking_back:["looking-back-vocabulary","looking-back-grammar","looking-back-correction","looking-back-final-mix","looking-back-self-check"],
  project:["project-plan","project-details","project-steps","project-report","project-presentation"],
};

export type StructuredBankName="topic"|"vocabulary"|"sounds"|"grammar"|"communication"|"reading"|"listening"|"looking_back"|"project"|"project_checklist";
export type StructuredEntry={context:string;answer:string;translation:string;source_status:"user-provided-reference"|"ai-generated";speech_text?:string;pronunciation_vi?:string};
export type StructuredUnitSource={
  lesson_id:string;source_status:"user-provided-reference";usage_scope:"personal-family";source_note:string;
  unit:{number:number;title:string;title_vi:string}; dialogue:StructuredEntry[]; banks:Record<StructuredBankName,StructuredEntry[]>;
  section_intro:Record<StructuredSectionId,{title:string;title_vi:string;description_vi:string}>;
  objectives:string[];
};
export type StructuredUnitBuilt=StructuredUnitSource&{games:Record<StructuredGameId,CommonRound[]>;help:Record<StructuredGameId,{source_title:string;teaching_vi:string;steps:string[]}>};

const BANK_FOR_SECTION:Record<StructuredSectionId,StructuredBankName|"dialogue">={getting:"dialogue",acl1:"vocabulary",acl2:"grammar",communication:"communication",skills1:"reading",skills2:"listening",looking_back:"looking_back",project:"project"};
function bankForGame(source:StructuredUnitSource,id:StructuredGameId){const section=id.split("-")[0].replace("looking","looking_back") as StructuredSectionId;if(id.includes("sound"))return source.banks.sounds;if(id==="skills2-writing-cues"||id==="skills2-paragraph")return source.banks.project_checklist;if(id==="project-presentation")return source.banks.project_checklist;const key=BANK_FOR_SECTION[section];return key==="dialogue"?source.dialogue:source.banks[key];}
function options(answer:string,bank:StructuredEntry[],index:number){const alternatives=[...new Set(bank.map(item=>item.answer))].filter(item=>item!==answer);return [answer,...alternatives.slice(index%Math.max(1,alternatives.length)),...alternatives,"Not given","Another answer"].filter((item,pos,all)=>item&&all.indexOf(item)===pos).slice(0,4);}
function buildRounds(unit:number,id:StructuredGameId,bank:StructuredEntry[]):CommonRound[]{const listening=id.includes("sound")||id.startsWith("skills2-");return Array.from({length:10},(_,index)=>{const item=bank[index%bank.length];return {id:`u${unit}-${id}-${String(index+1).padStart(2,"0")}`,source_status:index<bank.length?item.source_status:"ai-generated",context:item.context,prompt:"Choose the best answer.",options:options(item.answer,bank,index),answer:item.answer,explanation_vi:item.translation,...(listening?{audio_text:(item.speech_text??item.context).replaceAll("/",""),audio_source_status:"ai-generated" as const}:{})};});}

export function validateStructuredUnit(source:StructuredUnitSource):StructuredUnitBuilt{
  if(source.lesson_id!==`unit${source.unit.number}-source`||source.source_status!=="user-provided-reference"||source.usage_scope!=="personal-family"||!source.source_note.trim())throw new Error("Structured Unit provenance is invalid");
  if(source.dialogue.length<10||source.dialogue.some(item=>!item.translation))throw new Error(`Unit ${source.unit.number} needs ten translated dialogue anchors`);
  const bankNames=Object.keys(source.banks);
  if(bankNames.length!==10||bankNames.some(name=>source.banks[name as StructuredBankName].length<5))throw new Error(`Unit ${source.unit.number} banks are incomplete`);
  const gameIds=Object.values(STRUCTURED_GAME_SECTIONS).flat();if(gameIds.length!==42||new Set(gameIds).size!==42)throw new Error("Structured Unit needs exactly 42 games");
  const games=Object.fromEntries(gameIds.map(id=>[id,buildRounds(source.unit.number,id,bankForGame(source,id))])) as Record<StructuredGameId,CommonRound[]>;
  const help=Object.fromEntries(gameIds.map(id=>[id,{source_title:`Tiếng Anh 6 · Unit ${source.unit.number} — ${source.unit.title}`,teaching_vi:"Đọc hoặc nghe gợi ý, tìm từ khóa của phần học rồi chọn đáp án phù hợp nhất.",steps:["Đọc yêu cầu và gợi ý tiếng Việt.","Loại đáp án sai chủ đề hoặc sai cấu trúc.","Chọn đáp án và đọc giải thích trước khi chuyển câu."]}])) as StructuredUnitBuilt["help"];
  return {...source,games,help};
}

const NAMES=["Lan Anh","Minh Khoa","Bảo Ngọc","Hải Nam","Mai Chi","Thu Hà","Đức Anh","Khánh Linh","Quang Huy","Yến Nhi"];
export function buildStructuredBonus(source:StructuredUnitSource):BonusLesson{
  const make=(stage:BonusStageId,bank:StructuredEntry[]):BonusRound[]=>Array.from({length:10},(_,index)=>{const item=bank[index%bank.length];return {id:`u${source.unit.number}-${stage.slice(0,2)}-${String(index+1).padStart(2,"0")}`,source_status:"ai-generated",character_name:NAMES[index],skill:stage==="boss"?"grammar":stage==="detective"?"reading":"vocabulary",prompt_vi:"Đọc hoặc nghe manh mối rồi gõ đáp án tiếng Anh.",clue:item.context,audio_text:stage==="treasure"?(item.speech_text??item.context).replaceAll("/",""):undefined,answer:item.answer,explanation_vi:item.translation,completed_text:`${item.context} ${item.answer}`};});
  return {lesson_id:`unit${source.unit.number}-bonus`,source_status:"designed",usage_scope:"personal-family",source_note:`Ba màn Bonus AI luyện mục tiêu Unit ${source.unit.number}; âm thanh là TTS thay thế.`,variant_catalog:[{id:"treasure",title:"Kho báu từ vựng",skills:["vocabulary","listening"]},{id:"boss",title:"Grammar Boss",skills:["grammar"]},{id:"detective",title:"Thám tử nội dung",skills:["reading","project"]}],selected_variants:["treasure","boss","detective"],rules_vi:[`Bonus chỉ mở sau khi hoàn thành đủ 42 hoạt động Unit ${source.unit.number}.`,"Điểm Unit từ 90% mở kho cao.","Điểm Unit từ 70% mở kho tiêu chuẩn.","Dưới 70%, hãy luyện lại câu điểm thấp.","Điểm thưởng tách khỏi điểm học tập.","Mỗi màn chỉ nhận thưởng một lần."],stages:{treasure:{title:"Kho báu từ vựng",subtitle:"Mở 10 ô từ khóa",variant:"treasure",help_vi:"Dùng từ vựng cốt lõi của Unit.",rounds:make("treasure",source.banks.vocabulary)},boss:{title:"Grammar Boss",subtitle:"Hoàn thành 10 cấu trúc",variant:"boss",help_vi:"Dựa vào quy tắc ngữ pháp của Unit.",rounds:make("boss",source.banks.grammar)},detective:{title:"Thám tử nội dung",subtitle:"Khôi phục 10 manh mối",variant:"detective",help_vi:"Dùng bài đọc và gợi ý Project.",rounds:make("detective",[...source.banks.reading,...source.banks.project])}}};
}
