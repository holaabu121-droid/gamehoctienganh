import type { CommonRound } from "../skills-common/SkillsSection";

export type Review2GameId = "pronunciation" | "vocabulary" | "grammar" | "reading" | "listening" | "writing";
export type Review2Help = { source_title: string; teaching_vi: string; steps: string[] };
export type Review2Data = { lesson_id:"review2"; source_status:"user-provided-reference"; usage_scope:"personal-family"; source_note:string; intro:{ title:string; title_vi:string; description_vi:string; language_foundations:string[]; skills_foundations:string[] }; games:Record<Review2GameId,CommonRound[]>; game_help:Record<Review2GameId,Review2Help> };
const IDS:Review2GameId[]=["pronunciation","vocabulary","grammar","reading","listening","writing"];
const norm=(value:string)=>value.trim().toLocaleLowerCase("en-US");
const unique=(values:readonly string[])=>new Set(values.map(norm)).size===values.length;
function hasImage(value:unknown):boolean { if(!value||typeof value!=="object")return false; if(Array.isArray(value))return value.some(hasImage); return Object.entries(value).some(([key,child])=>/^(image|image_url|image_src|illustration|photo)$/i.test(key)||hasImage(child)); }
export function validateReview2Data(data:Review2Data):Review2Data {
  if(data.lesson_id!=="review2"||data.source_status!=="user-provided-reference"||data.usage_scope!=="personal-family"||!data.source_note.trim())throw new Error("Review 2 provenance is invalid");
  if(hasImage(data))throw new Error("Review 2 must not embed textbook images");
  if(JSON.stringify(Object.keys(data.games).sort())!==JSON.stringify([...IDS].sort()))throw new Error("Review 2 needs exactly six games");
  for(const id of IDS){const rounds=data.games[id],help=data.game_help[id];if(rounds.length!==10||!unique(rounds.map(r=>r.id)))throw new Error(`${id} needs exactly 10 unique rounds`);if(!help?.source_title.trim()||!help.teaching_vi.trim()||help.steps.length<3)throw new Error(`${id} help is incomplete`);for(const round of rounds){if(!round.context.trim()||!round.prompt.trim()||!round.explanation_vi.trim()||round.options.length<2||round.options.length>4||!unique(round.options)||!round.options.map(norm).includes(norm(round.answer)))throw new Error(`${id}/${round.id} is invalid`);if(round.source_status!=="user-provided-reference"&&round.source_status!=="ai-generated")throw new Error(`${id}/${round.id} provenance is invalid`);if(round.audio_source_status&&round.audio_source_status!=="ai-generated")throw new Error(`${id}/${round.id} audio provenance is invalid`);}}
  if(data.games.listening.some(round=>!round.audio_text||round.audio_source_status!=="ai-generated"))throw new Error("Review 2 listening needs ten labeled replacement-audio rounds");
  return data;
}
