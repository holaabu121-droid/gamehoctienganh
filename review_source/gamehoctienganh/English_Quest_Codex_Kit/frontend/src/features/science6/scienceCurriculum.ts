import type { CommonRound, GameMeta } from "../skills-common/SkillsSection";

export const SCIENCE_GAME_IDS = ["observe-identify","classify-model","measure-analyze","predict-reason","experiment-safety","explain-apply"] as const;
export type ScienceGameId = (typeof SCIENCE_GAME_IDS)[number];

type RawCard={id:string;title_vi:string;teaching_vi:string;why_vi:string;worked_example_vi:string;self_check_vi:string};
type RawFoundation={id:string;title_vi:string;purpose_vi:string;cards:RawCard[]};
type RawFeedback={error_type_vi:string;why_wrong_vi:string;fix_vi:string;review_card_id:string};
export type ScienceRepresentation={id:string;type:string;renderer_kind:string;title_vi:string;student_action_vi:string;level:string;focus_vi:string;elements?:Array<{label:string;value:string}>};
type RawRound={id:string;level:string;representation:ScienceRepresentation;context_vi:string;prompt_vi:string;task_vi:string;options:string[];answer:string;explanation_vi:string;hint_vi:string;source_status:"ai-generated";wrong_feedback:Record<string,RawFeedback>};
type RawCompetency={id:ScienceGameId;title_vi:string;capability_vi:string;presentation_template:{id:string;title_vi:string;action_vi:string;renderer_kind:string};game_id:string;scored:boolean;max_points_per_question:number;rounds:RawRound[]};
export type SciencePractice={scored:false;title_vi:string;safe_summary_vi:string;supervision:string;warning_vi:string;allowed_actions:string[];prohibited_actions:string[];risk_tags:string[]};
export type ScienceSimulation={type:string;description_vi:string;student_actions:string[];variables:string[];outputs:string[];implementation_status:string;scored:false;assets_policy:string};
export type ScienceLessonSpec={lesson_id:string;branch_id:string;chapter_number:number;lesson_number:number;title_vi:string;source_note_vi:string;provenance:{printed_pages:string};objectives:string[];foundations:RawFoundation[];simulation:ScienceSimulation;practical_application:SciencePractice;competencies:RawCompetency[]};

const SCIENCE_LESSON_MODULES = import.meta.glob<{ default: ScienceLessonSpec }>("../../../../data/science6_pilot/lessons/science6-l*.json");

export async function loadScienceLesson(branchId:string):Promise<ScienceLessonSpec|undefined>{
  if(!/^science6-l\d{2}$/.test(branchId))return undefined;
  const path=`../../../../data/science6_pilot/lessons/${branchId}.json`;
  const load=SCIENCE_LESSON_MODULES[path];
  if(!load)return undefined;
  return (await load()).default;
}

const ICONS:Record<ScienceGameId,string>={"observe-identify":"🔎","classify-model":"🧩","measure-analyze":"📊","predict-reason":"💭","experiment-safety":"🧪","explain-apply":"🌱"};
function feedbackText(feedback:RawFeedback){return `Lỗi: ${feedback.error_type_vi}. Vì sao sai: ${feedback.why_wrong_vi} Cách sửa: ${feedback.fix_vi} Ôn lại thẻ ${feedback.review_card_id}.`;}
function mapRound(round:RawRound):CommonRound{return {id:round.id,source_status:round.source_status,context:round.context_vi,context_vi:`${round.representation.title_vi} · ${round.representation.student_action_vi}`,prompt:round.prompt_vi,prompt_vi:round.task_vi,options:round.options,answer:round.answer,explanation_vi:round.explanation_vi,wrong_feedback:Object.fromEntries(Object.entries(round.wrong_feedback).map(([option,feedback])=>[option,feedbackText(feedback)]))};}

export type BuiltScienceLesson={spec:ScienceLessonSpec;foundations:Array<{title:string;items:Array<{text:string;translation:string;speechText:string;detailLabel:string}>}>;rounds:Record<ScienceGameId,CommonRound[]>;help:Record<ScienceGameId,{source_title:string;teaching_vi:string;steps:string[]}>;meta:GameMeta<ScienceGameId>[]};
export function buildScienceLesson(spec:ScienceLessonSpec):BuiltScienceLesson{
  const foundations=spec.foundations.map(stage=>({title:stage.title_vi,items:stage.cards.map(card=>({text:card.title_vi,translation:`${card.teaching_vi} ${card.why_vi} Ví dụ: ${card.worked_example_vi} Tự kiểm tra: ${card.self_check_vi}`,speechText:`${card.title_vi}. ${card.teaching_vi} ${card.worked_example_vi}`,detailLabel:"Lời giảng và ví dụ"}))}));
  const rounds=Object.fromEntries(spec.competencies.map(competency=>[competency.id,competency.rounds.map(mapRound)])) as Record<ScienceGameId,CommonRound[]>;
  const help=Object.fromEntries(spec.competencies.map(competency=>[competency.id,{source_title:`SGK Khoa học tự nhiên 6 · Bài ${spec.lesson_number} · trang ${spec.provenance.printed_pages}`,teaching_vi:`${competency.title_vi}: ${competency.capability_vi}`,steps:["Đọc bối cảnh, xác định đại lượng, dấu hiệu hoặc hiện tượng cần xét.",`Dùng khuôn “${competency.presentation_template.title_vi}” để ${competency.presentation_template.action_vi}.`,"Đối chiếu thẻ kiến thức được gợi ý; chỉ kết luận từ bằng chứng đã cho.",competency.id==="experiment-safety"?"Loại mọi thao tác không được người lớn cho phép hoặc có nguy cơ trước khi chọn.":"Kiểm tra điều kiện, giới hạn kết luận và cách xác minh trước khi trả lời."]}])) as BuiltScienceLesson["help"];
  const meta=spec.competencies.map(competency=>({id:competency.id,icon:ICONS[competency.id],title:competency.title_vi,description:competency.capability_vi,activityId:competency.game_id}));
  return {spec,foundations,rounds,help,meta};
}
