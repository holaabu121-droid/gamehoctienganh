import lessonJson from "../../../../data/lessons/review2.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateReview2Data, type Review2Data, type Review2GameId } from "./review2Engine";
const lesson=validateReview2Data(lessonJson as Review2Data);
type Id=Extract<Review2GameId,"reading"|"listening"|"writing">;
const META:GameMeta<Id>[]=[
  {id:"reading",icon:"🇸🇬",title:"Singapore Scanner",description:"Tìm bằng chứng Nature · Culture · Family.",activityId:"review2-skills-reading"},
  {id:"listening",icon:"🎧",title:"Travel Agent Radio",description:"Nghe script AI thay Track 45.",activityId:"review2-skills-listening",listening:true},
  {id:"writing",icon:"✍️",title:"Neighbourhood Writer",description:"Hoàn thiện đoạn văn an toàn.",activityId:"review2-skills-writing"}
];
export function Review2Skills({reviewTarget}:{reviewTarget?:ReviewTarget|null}){return <SkillsSection unitId="review2" sectionLabel="Review 2 · Skills" trailTitle="Skills Review Trail" introTitle="Skills Checkpoint" introTitleVi="Trạm ôn kỹ năng" introDescription="Đọc Visit Singapore, nghe một lịch trình mới và viết về khu phố hư cấu." foundations={[{title:"Đọc có bằng chứng",items:lesson.intro.skills_foundations.slice(0,1)},{title:"Nghe và viết an toàn",items:lesson.intro.skills_foundations.slice(1)}]} privacyNote="Các địa danh và hồ sơ viết trong game là hư cấu; em không cần nhập địa chỉ thật." games={{reading:lesson.games.reading,listening:lesson.games.listening,writing:lesson.games.writing}} help={{reading:lesson.game_help.reading,listening:lesson.game_help.listening,writing:lesson.game_help.writing}} meta={META} listening={false} reviewTarget={reviewTarget}/>;}
