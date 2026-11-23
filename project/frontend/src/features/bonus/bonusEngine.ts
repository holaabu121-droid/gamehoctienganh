export type BonusStageId = "treasure" | "boss" | "detective";
export type BonusRound = { id:string; source_status:"ai-generated"; character_name:string; skill:string; prompt_vi:string; clue:string; audio_text?:string; answer:string; explanation_vi:string; completed_text:string };
export type BonusLesson = { lesson_id:string; source_status:"designed"; usage_scope:"personal-family"; source_note:string; variant_catalog:Array<{id:string;title:string;skills:string[]}>; selected_variants:BonusStageId[]; rules_vi:string[]; stages:Record<BonusStageId,{title:string;subtitle:string;variant:BonusStageId;help_vi:string;rounds:BonusRound[]}> };
export type RewardTier = "high" | "standard";

const normalize=(value:string)=>value.trim().toLocaleLowerCase("en-US").replace(/[.!?]+$/g,"").replace(/\s+/g," ");
const twoWords=(value:string)=>value.trim().split(/\s+/).length===2;

export function validateBonusLesson(data:BonusLesson):BonusLesson{
  if(!data.lesson_id.endsWith("-bonus")||data.source_status!=="designed"||data.usage_scope!=="personal-family"||!data.source_note.trim())throw new Error("Bonus provenance is invalid");
  if(data.selected_variants.length!==3||new Set(data.selected_variants).size!==3)throw new Error("Bonus needs three selected variants");
  for(const id of data.selected_variants){const stage=data.stages[id];if(!stage||stage.variant!==id||stage.rounds.length!==10||new Set(stage.rounds.map(({id})=>id)).size!==10)throw new Error(`${id} needs exactly 10 rounds`);for(const round of stage.rounds){if(round.source_status!=="ai-generated"||!twoWords(round.character_name)||!round.prompt_vi.trim()||!round.clue.trim()||!round.answer.trim()||!round.explanation_vi.trim()||!round.completed_text.trim())throw new Error(`${id}/${round.id} is invalid`);}}
  if(data.rules_vi.length<6||!data.rules_vi.some(rule=>rule.includes("90%"))||!data.rules_vi.some(rule=>rule.includes("70%")))throw new Error("Bonus rules are incomplete");
  return data;
}

export const isBonusAnswer=(round:BonusRound,answer:string)=>normalize(round.answer)===normalize(answer);
export function rewardPool(tier:RewardTier){return tier==="high"?[{points:50000,weight:50},{points:100000,weight:35},{points:150000,weight:15}]:[{points:20000,weight:50},{points:30000,weight:35},{points:50000,weight:15}];}
export function selectCompatibleVariants(unitId:string,compatible:readonly string[],count=3){let seed=[...unitId].reduce((total,char)=>((total*31)+char.charCodeAt(0))>>>0,2166136261);const values=[...compatible];for(let i=values.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[values[i],values[j]]=[values[j],values[i]];}return values.slice(0,Math.min(count,values.length));}
