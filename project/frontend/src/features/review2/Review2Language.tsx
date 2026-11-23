import lessonJson from "../../../../data/lessons/review2.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateReview2Data, type Review2Data, type Review2GameId } from "./review2Engine";
const lesson=validateReview2Data(lessonJson as Review2Data);
type Id=Extract<Review2GameId,"pronunciation"|"vocabulary"|"grammar">;
const META:GameMeta<Id>[]=[
  {id:"pronunciation",icon:"👂",title:"Sound Compass",description:"Tìm âm khác trong ba lựa chọn.",activityId:"review2-language-pronunciation"},
  {id:"vocabulary",icon:"↔️",title:"Opposite Bridge",description:"Ghép tám cặp từ trái nghĩa.",activityId:"review2-language-vocabulary"},
  {id:"grammar",icon:"🧭",title:"Rule Ranger",description:"Định nghĩa, lượng từ và lời khuyên.",activityId:"review2-language-grammar"}
];
export function Review2Language({reviewTarget}:{reviewTarget?:ReviewTarget|null}){return <SkillsSection unitId="review2" sectionLabel="Review 2 · Language" trailTitle="Language Review Trail" introTitle="Language Checkpoint" introTitleVi="Trạm ôn ngôn ngữ" introDescription="Ôn trọng tâm Units 4–5–6 qua ba game, mỗi game 10 câu." foundations={[{title:"Âm và từ vựng",items:lesson.intro.language_foundations.slice(0,2)},{title:"Ngữ pháp",items:lesson.intro.language_foundations.slice(2)}]} games={{pronunciation:lesson.games.pronunciation,vocabulary:lesson.games.vocabulary,grammar:lesson.games.grammar}} help={{pronunciation:lesson.game_help.pronunciation,vocabulary:lesson.game_help.vocabulary,grammar:lesson.game_help.grammar}} meta={META} listening={false} reviewTarget={reviewTarget}/>;}
