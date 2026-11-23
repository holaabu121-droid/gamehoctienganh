import sourceJson from "../../../../data/lessons/unit4_phase1.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateUnit4Data, type Unit4GameId, type Unit4Source } from "./unit4Engine";

export const unit4Lesson=validateUnit4Data(sourceJson as Unit4Source);
type GettingId=Extract<Unit4GameId,"suggestions"|"story_order"|"direction_match"|"map_navigator"|"route_builder"|"place_hunt"|"direction_spelling">;
type Acl1Id=Extract<Unit4GameId,"places"|"is_there"|"profile"|"sound"|"rhythm">;
type Acl2Id=Extract<Unit4GameId,"builder"|"rule_sorter"|"letter"|"compare"|"qa">;

const GETTING_META:GameMeta<GettingId>[]=[
  {id:"suggestions",icon:"💬",title:"Suggestion Spotter",description:"Dùng Let's và Shall we để gợi ý.",activityId:"unit4-getting-suggestions"},
  {id:"story_order",icon:"🧵",title:"Story Route",description:"Sắp đúng trình tự hội thoại.",activityId:"unit4-getting-story-order"},
  {id:"direction_match",icon:"🧭",title:"Direction Match",description:"Ghép lệnh với hướng di chuyển.",activityId:"unit4-getting-direction-match"},
  {id:"map_navigator",icon:"🗺️",title:"Map Navigator",description:"Theo lộ trình để tìm địa điểm.",activityId:"unit4-getting-map-navigator"},
  {id:"route_builder",icon:"🛣️",title:"Route Builder",description:"Hoàn chỉnh chuỗi chỉ đường.",activityId:"unit4-getting-route-builder"},
  {id:"place_hunt",icon:"📍",title:"Place Hunt",description:"Đoán địa điểm từ manh mối.",activityId:"unit4-getting-place-hunt"},
  {id:"direction_spelling",icon:"⌨️",title:"Direction Spelling",description:"Nhận biết cách viết đúng.",activityId:"unit4-getting-direction-spelling",listening:true},
];
const ACL1_META:GameMeta<Acl1Id>[]=[
  {id:"places",icon:"🏛️",title:"Place Match",description:"Ghép địa điểm với chức năng.",activityId:"unit4-acl1-places"},
  {id:"is_there",icon:"❓",title:"Is There?",description:"Hỏi đáp về địa điểm khu phố.",activityId:"unit4-acl1-is-there"},
  {id:"profile",icon:"🏘️",title:"Neighbourhood Profile",description:"Chọn tính từ mô tả phù hợp.",activityId:"unit4-acl1-profile"},
  {id:"sound",icon:"👂",title:"Sound Sort /ɪ/–/iː/",description:"Luyện nghe chủ động đủ 60 giây.",activityId:"unit4-acl1-sound",timedSeconds:60},
  {id:"rhythm",icon:"🥁",title:"Rhythm Echo",description:"Nghe chant chủ động đủ 60 giây.",activityId:"unit4-acl1-rhythm",timedSeconds:60},
];
const ACL2_META:GameMeta<Acl2Id>[]=[
  {id:"builder",icon:"🏗️",title:"Comparative Builder",description:"Tạo dạng so sánh hơn.",activityId:"unit4-acl2-builder"},
  {id:"rule_sorter",icon:"🧰",title:"Rule Sorter",description:"Phân loại quy tắc biến đổi.",activityId:"unit4-acl2-rule-sorter"},
  {id:"letter",icon:"✉️",title:"Letter Repair",description:"Hoàn thành thư của Vy.",activityId:"unit4-acl2-letter"},
  {id:"compare",icon:"⚖️",title:"Neighbourhood Compare",description:"So sánh Bình Minh và Long Sơn.",activityId:"unit4-acl2-compare"},
  {id:"qa",icon:"✅",title:"Comparative Q&A",description:"Hỏi đáp Yes/No về so sánh.",activityId:"unit4-acl2-qa"},
];
const select=<Id extends Unit4GameId>(ids:Id[])=>Object.fromEntries(ids.map(id=>[id,unit4Lesson.games[id]])) as Record<Id,(typeof unit4Lesson.games)[Id]>;
const selectHelp=<Id extends Unit4GameId>(ids:Id[])=>Object.fromEntries(ids.map(id=>[id,unit4Lesson.help[id]])) as Record<Id,(typeof unit4Lesson.help)[Id]>;

export function Unit4GettingStarted({reviewTarget}:{reviewTarget?:ReviewTarget|null}){
  const ids=GETTING_META.map(item=>item.id);
  return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · Getting Started" trailTitle="Lost Town Adventure" introTitle={unit4Lesson.getting_started.title} introTitleVi="Lạc trong khu phố cổ" introDescription="Đọc hội thoại 14 lượt, nhận biết lời gợi ý và dùng chỉ dẫn để tìm đường trong khu phố." foundations={[{title:"Listen and Read · 14 lượt thoại",items:unit4Lesson.getting_started.dialogue.map(line=>`${line.speaker}: ${line.text}`)},{title:"Mẫu câu cốt lõi",items:["Let's + động từ: đưa ra gợi ý.","Shall we + động từ…?: rủ cùng làm việc gì.",...unit4Lesson.getting_started.directions]}]} games={select(ids)} help={selectHelp(ids)} meta={GETTING_META} listening={false} reviewTarget={reviewTarget}/>;
}
export function Unit4Acl1({reviewTarget}:{reviewTarget?:ReviewTarget|null}){
  const ids=ACL1_META.map(item=>item.id);
  return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · A Closer Look 1" trailTitle="Neighbourhood Word Trail" introTitle="Places and neighbourhood adjectives" introTitleVi="Địa điểm và tính từ mô tả khu phố" introDescription="Ba game từ vựng và hai game nghe theo thời gian. Hai game âm không đánh giá giọng nói." foundations={[{title:"Địa điểm",items:unit4Lesson.closer_look_1.places},{title:"Tính từ mô tả",items:unit4Lesson.closer_look_1.adjectives},{title:"Sound groups",items:[{text:"/ɪ/: noisy, exciting, expensive",pronunciationVi:"Âm ngắn. Miệng hơi mở, môi thả lỏng và lưỡi nâng về phía trước; phát âm nhanh, không kéo dài.",speechText:"ih. noisy. exciting. expensive"},{text:"/iː/: clean, peaceful, convenient, cheap, friendly",pronunciationVi:"Âm dài. Kéo hai khóe miệng nhẹ sang hai bên, nâng lưỡi cao phía trước và kéo dài âm.",speechText:"eee. clean. peaceful. convenient. cheap. friendly"}]}]} games={select(ids)} help={selectHelp(ids)} meta={ACL1_META} listening={false} reviewTarget={reviewTarget}/>;
}
export function Unit4Acl2({reviewTarget}:{reviewTarget?:ReviewTarget|null}){
  const ids=ACL2_META.map(item=>item.id);
  return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · A Closer Look 2" trailTitle="Comparative City Lab" introTitle="Comparative adjectives" introTitleVi="Tính từ so sánh hơn" introDescription="So sánh hai người, vật hoặc khu phố bằng -er, -ier, gấp đôi phụ âm hoặc more + tính từ." foundations={[{title:"Tính từ ngắn",items:["tall → taller than","noisy → noisier than","big → bigger than","wide → wider than"]},{title:"Tính từ dài",items:["peaceful → more peaceful than","exciting → more exciting than","delicious → more delicious than"]}]} games={select(ids)} help={selectHelp(ids)} meta={ACL2_META} listening={false} reviewTarget={reviewTarget}/>;
}
