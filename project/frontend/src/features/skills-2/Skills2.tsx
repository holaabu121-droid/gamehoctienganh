import lessonJson from "../../../../data/lessons/unit3_skills2.json";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateSkills2Data, type Skills2Data, type Skills2GameId } from "./skills2Engine";
import type { ReviewTarget } from "../../reviewTarget";
const lesson=validateSkills2Data(lessonJson as Skills2Data);
const META:GameMeta<Skills2GameId>[]=[
  {id:"actions",icon:"🎧",title:"Action Ears",description:"Nghe và nhận ra hành động.",activityId:"unit3-skills2-actions"},
  {id:"who",icon:"👤",title:"Who Is Who",description:"Nhận diện người từ mô tả.",activityId:"unit3-skills2-who"},
  {id:"fill",icon:"✍️",title:"Listen & Fill",description:"Bắt đúng một từ hoặc một số.",activityId:"unit3-skills2-fill"},
  {id:"interview",icon:"🎤",title:"Friend Interview",description:"Ghép hỏi đáp đúng loại ý.",activityId:"unit3-skills2-interview"},
  {id:"diary",icon:"📔",title:"Diary Builder",description:"Xây đoạn nhật ký nhất quán.",activityId:"unit3-skills2-diary"}
];
export function Skills2({reviewTarget}:{reviewTarget?:ReviewTarget|null}){return <SkillsSection unitId="unit3" sectionLabel="Skills 2 · Listening & Writing" trailTitle="Listen & Write Studio" introTitle={lesson.intro.title} introTitleVi={lesson.intro.title_vi} introDescription={lesson.intro.description_vi} foundations={[{title:"Ba lượt nghe thông minh",items:lesson.intro.listening_steps},{title:"Bốn ô ý trước khi viết",items:lesson.intro.writing_plan}]} privacyNote={lesson.intro.privacy_note_vi} games={lesson.games} help={lesson.game_help} meta={META} listening reviewTarget={reviewTarget}/>;}
