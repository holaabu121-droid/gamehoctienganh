import lessonJson from "../../../../data/lessons/unit3_skills1.json";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateSkills1Data, type Skills1Data, type Skills1GameId } from "./skills1Engine";
import type { ReviewTarget } from "../../reviewTarget";
const lesson=validateSkills1Data(lessonJson as Skills1Data);
const META:GameMeta<Skills1GameId>[]=[
  {id:"scanner",icon:"🔎",title:"Info Scanner",description:"Quét notice để tìm đúng chi tiết.",activityId:"unit3-skills1-scanner"},
  {id:"evidence",icon:"🧾",title:"Evidence Check",description:"Đúng/sai và sửa bằng chứng.",activityId:"unit3-skills1-evidence"},
  {id:"file",icon:"🗂️",title:"Friend File",description:"Phân loại chi tiết về bạn bè.",activityId:"unit3-skills1-file"},
  {id:"match",icon:"🧭",title:"Activity Match",description:"So hồ sơ với nhiều tiêu chí.",activityId:"unit3-skills1-match"},
  {id:"reason",icon:"🧩",title:"Reason Builder",description:"Nối lựa chọn với lý do logic.",activityId:"unit3-skills1-reason"}
];
export function Skills1({reviewTarget}:{reviewTarget?:ReviewTarget|null}){return <SkillsSection unitId="unit3" sectionLabel="Skills 1 · Reading & Speaking" trailTitle="Evidence Explorer" introTitle={lesson.intro.title} introTitleVi={lesson.intro.title_vi} introDescription={lesson.intro.description_vi} foundations={[{title:"Quét thông tin",items:lesson.intro.scan_targets},{title:"Dùng bằng chứng",items:lesson.intro.evidence_steps}]} games={lesson.games} help={lesson.game_help} meta={META} listening={false} reviewTarget={reviewTarget}/>;}
