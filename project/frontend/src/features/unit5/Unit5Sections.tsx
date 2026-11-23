import sourceJson from "../../../../data/lessons/unit5_phase1.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateUnit5, type Unit5GameId, type Unit5Source } from "./unit5Engine";

export const unit5Lesson=validateUnit5(sourceJson as Unit5Source);
type GettingId=Extract<Unit5GameId,"dialogue"|"wonders_fill"|"nature_match"|"quiz"|"fact_check"|"travel_word"|"spelling">;
type Acl1Id=Extract<Unit5GameId,"items"|"context"|"packing"|"sound"|"rhythm">;
type Acl2Id=Extract<Unit5GameId,"countability"|"quantifiers"|"gap_fill"|"modal"|"rules">;
const gettingMeta:GameMeta<GettingId>[]=[
  {id:"dialogue",icon:"🌏",title:"Geography Club",description:"Đọc hiểu hội thoại về kỳ quan.",activityId:"unit5-getting-dialogue"},
  {id:"wonders_fill",icon:"🧩",title:"Wonder Words",description:"Điền từ vựng vào câu.",activityId:"unit5-getting-wonders-fill"},
  {id:"nature_match",icon:"🏞️",title:"Nature Match",description:"Nhận biết các dạng địa hình.",activityId:"unit5-getting-nature-match"},
  {id:"quiz",icon:"❓",title:"Viet Nam Quiz",description:"Trả lời câu hỏi địa lý.",activityId:"unit5-getting-quiz"},
  {id:"fact_check",icon:"🔎",title:"Fact Check",description:"Xác định thông tin đúng hoặc sai.",activityId:"unit5-getting-fact-check"},
  {id:"travel_word",icon:"🎒",title:"Travel Word",description:"Đoán vật dụng từ chức năng.",activityId:"unit5-getting-travel-word"},
  {id:"spelling",icon:"⌨️",title:"Nature Spelling",description:"Nghe và nhận biết cách viết đúng.",activityId:"unit5-getting-spelling",listening:true},
];
const acl1Meta:GameMeta<Acl1Id>[]=[
  {id:"items",icon:"🧳",title:"Travel Item Match",description:"Gọi tên vật dụng du lịch.",activityId:"unit5-acl1-items"},
  {id:"context",icon:"💬",title:"Context Packing",description:"Chọn vật dụng theo ngữ cảnh.",activityId:"unit5-acl1-context"},
  {id:"packing",icon:"🏕️",title:"Packing Priority",description:"Chọn đồ hữu ích cho chuyến đi.",activityId:"unit5-acl1-packing"},
  {id:"sound",icon:"👂",title:"Sound Sort /t/–/d/",description:"Luyện nghe chủ động đủ 60 giây.",activityId:"unit5-acl1-sound",timedSeconds:60},
  {id:"rhythm",icon:"🥁",title:"Rhythm Echo",description:"Nghe câu chủ động đủ 60 giây.",activityId:"unit5-acl1-rhythm",timedSeconds:60},
];
const acl2Meta:GameMeta<Acl2Id>[]=[
  {id:"countability",icon:"🔢",title:"Countability Sort",description:"Phân loại danh từ.",activityId:"unit5-acl2-countability"},
  {id:"quantifiers",icon:"⚖️",title:"Quantifier Choice",description:"Chọn lượng từ phù hợp.",activityId:"unit5-acl2-quantifiers"},
  {id:"gap_fill",icon:"🧱",title:"Grammar Gap",description:"Dùng a, an, any, some, much, many.",activityId:"unit5-acl2-gap-fill"},
  {id:"modal",icon:"⚠️",title:"Must or Mustn't",description:"Chọn quy tắc bắt buộc hoặc cấm.",activityId:"unit5-acl2-modal"},
  {id:"rules",icon:"📜",title:"Rule Keeper",description:"Hiểu nội quy lớp và nơi tham quan.",activityId:"unit5-acl2-rules"},
];
const select=<Id extends Unit5GameId>(ids:Id[])=>Object.fromEntries(ids.map(id=>[id,unit5Lesson.games[id]])) as Record<Id,(typeof unit5Lesson.games)[Id]>;
const selectHelp=<Id extends Unit5GameId>(ids:Id[])=>Object.fromEntries(ids.map(id=>[id,unit5Lesson.help[id]])) as Record<Id,(typeof unit5Lesson.help)[Id]>;
export function Unit5GettingStarted({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=gettingMeta.map(item=>item.id);return <SkillsSection unitId="unit5" sectionLabel="Unit 5 · Getting Started" trailTitle="Natural Wonder Trail" introTitle="Geography Club" introTitleVi="Câu lạc bộ Địa lý" introDescription="Khám phá kỳ quan Việt Nam, nhận biết địa hình tự nhiên và luyện từ vựng theo hội thoại trang 48–49." foundations={[{title:"Hội thoại Geography Club",items:unit5Lesson.getting_started.dialogue.map(line=>`${line.speaker}: ${line.text}`)},{title:"Từ vựng cốt lõi",items:["natural wonder: kỳ quan thiên nhiên","scenery: phong cảnh","island: đảo",...unit5Lesson.getting_started.nature_words]}]} games={select(ids)} help={selectHelp(ids)} meta={gettingMeta} listening={false} reviewTarget={reviewTarget}/>;}
export function Unit5Acl1({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=acl1Meta.map(item=>item.id);return <SkillsSection unitId="unit5" sectionLabel="Unit 5 · A Closer Look 1" trailTitle="Travel Packing Trail" introTitle="Travel items and final sounds" introTitleVi="Vật dụng du lịch và âm cuối /t/–/d/" introDescription="Ba game từ vựng và hai game nghe 60 giây. Phần nghe dùng TTS vì Track 33–34 chưa được cung cấp và không chấm phát âm." foundations={[{title:"Vật dụng du lịch",items:unit5Lesson.closer_look_1.travel_items},{title:"Sound groups",items:[{text:"/t/: mountain, waterfall, desert, plaster",pronunciationVi:"Chạm đầu lưỡi vào lợi trên rồi bật luồng hơi ra nhanh; cổ họng không rung.",speechText:"t. mountain. waterfall. desert. plaster"},{text:"/d/: wonder, island, guide, holiday",pronunciationVi:"Chạm đầu lưỡi vào lợi trên như âm /t/, nhưng bật giọng để cổ họng rung.",speechText:"d. wonder. island. guide. holiday"}]}]} games={select(ids)} help={selectHelp(ids)} meta={acl1Meta} listening={false} reviewTarget={reviewTarget}/>;}
export function Unit5Acl2({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=acl2Meta.map(item=>item.id);return <SkillsSection unitId="unit5" sectionLabel="Unit 5 · A Closer Look 2" trailTitle="Nature Grammar Lab" introTitle="Countable nouns, quantifiers and rules" introTitleVi="Danh từ đếm được, lượng từ và must/mustn't" introDescription="Phân biệt danh từ, chọn lượng từ và dùng must/mustn't để diễn đạt điều bắt buộc hoặc không được phép." foundations={[{title:"Countable / uncountable",items:["Countable: a rock, an island; rocks, islands.","Uncountable: water, cream, chocolate.","many / a few + countable; much / a little + uncountable."]},{title:"Must / mustn't",items:["must: rất cần thiết hoặc quan trọng","mustn't: không được phép làm"]}]} games={select(ids)} help={selectHelp(ids)} meta={acl2Meta} listening={false} reviewTarget={reviewTarget}/>;}
