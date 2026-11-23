import sourceJson from "../../../../data/lessons/unit4_phase2.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { bilingualFoundationItems as vi } from "../skills-common/learningUx";
import { validateUnit4Phase2, type Unit4Phase2GameId, type Unit4Phase2Source } from "./unit4Phase2Engine";

export const unit4Phase2=validateUnit4Phase2(sourceJson as Unit4Phase2Source);
type CommunicationId=Extract<Unit4Phase2GameId,"directions"|"landmarks"|"dialogue"|"route"|"mission">;
type Skills1Id=Extract<Unit4Phase2GameId,"reading"|"evidence"|"map"|"speaking"|"summary">;
type Skills2Id=Extract<Unit4Phase2GameId,"listening"|"details"|"order"|"writing"|"paragraph">;
type LookingBackId=Extract<Unit4Phase2GameId,"places"|"directions_review"|"adjectives"|"comparatives"|"review">;
type ProjectId=Extract<Unit4Phase2GameId,"plan"|"project_map"|"notes"|"writer"|"present">;
const communicationMeta:GameMeta<CommunicationId>[]=[
  {id:"directions",icon:"🧭",title:"Direction Coach",description:"Hỏi và chỉ đường lịch sự.",activityId:"unit4-communication-directions"},
  {id:"landmarks",icon:"🏛️",title:"Landmark Hunt",description:"Đoán địa điểm từ chức năng.",activityId:"unit4-communication-landmarks"},
  {id:"dialogue",icon:"💬",title:"Dialogue Lab",description:"Hoàn chỉnh hội thoại chỉ đường.",activityId:"unit4-communication-dialogue"},
  {id:"route",icon:"🔗",title:"Route Builder",description:"Dùng first, then, after that, finally.",activityId:"unit4-communication-route"},
  {id:"mission",icon:"🎧",title:"City Mission",description:"Nghe audio guide mới và tìm lộ trình.",activityId:"unit4-communication-mission",listening:true},
];
const skills1Meta:GameMeta<Skills1Id>[]=[
  {id:"reading",icon:"📖",title:"Reading Map",description:"Hiểu từ trong ngữ cảnh blog.",activityId:"unit4-skills1-reading"},
  {id:"evidence",icon:"🔎",title:"Evidence Check",description:"Phân loại likes và dislikes.",activityId:"unit4-skills1-evidence"},
  {id:"map",icon:"🗺️",title:"Blog Scanner",description:"Tìm bằng chứng trả lời câu hỏi.",activityId:"unit4-skills1-map"},
  {id:"speaking",icon:"🎙️",title:"Speaking Planner",description:"Chuẩn bị hỏi đáp về khu phố hư cấu.",activityId:"unit4-skills1-speaking"},
  {id:"summary",icon:"📝",title:"Summary Builder",description:"Tóm tắt blog bằng từ khóa.",activityId:"unit4-skills1-summary"},
];
const skills2Meta:GameMeta<Skills2Id>[]=[
  {id:"listening",icon:"🎧",title:"Listening Route",description:"Nghe và xác định đúng/sai.",activityId:"unit4-skills2-listening",listening:true},
  {id:"details",icon:"🧩",title:"Detail Catcher",description:"Nghe chi tiết còn thiếu.",activityId:"unit4-skills2-details",listening:true},
  {id:"order",icon:"🧵",title:"Route Order",description:"Sắp trình tự thông tin nghe.",activityId:"unit4-skills2-order"},
  {id:"writing",icon:"✅",title:"Writing Coach",description:"Chọn likes hoặc dislikes.",activityId:"unit4-skills2-writing"},
  {id:"paragraph",icon:"✍️",title:"Paragraph Builder",description:"Xây đoạn văn khoảng 50 từ.",activityId:"unit4-skills2-paragraph"},
];
const lookingBackMeta:GameMeta<LookingBackId>[]=[
  {id:"places",icon:"📍",title:"Place Review",description:"Ôn tên địa điểm.",activityId:"unit4-looking-back-places"},
  {id:"directions_review",icon:"↱",title:"Direction Review",description:"Ôn câu chỉ đường và vị trí.",activityId:"unit4-looking-back-directions"},
  {id:"adjectives",icon:"🔤",title:"Adjective Review",description:"Phân loại theo số âm tiết.",activityId:"unit4-looking-back-adjectives"},
  {id:"comparatives",icon:"⚖️",title:"Comparative Review",description:"Ôn dạng so sánh hơn.",activityId:"unit4-looking-back-comparatives"},
  {id:"review",icon:"🏁",title:"Final Mix",description:"Hoàn thành câu so sánh tổng hợp.",activityId:"unit4-looking-back-review"},
];
const projectMeta:GameMeta<ProjectId>[]=[
  {id:"plan",icon:"📋",title:"Project Plan",description:"Lập kế hoạch My Map.",activityId:"unit4-project-plan"},
  {id:"project_map",icon:"🗺️",title:"Neighbourhood Map",description:"Đọc bản đồ khu phố hư cấu.",activityId:"unit4-project-map"},
  {id:"notes",icon:"📌",title:"Note Sorter",description:"Chọn ghi chú thiết kế hữu ích.",activityId:"unit4-project-notes"},
  {id:"writer",icon:"✍️",title:"Direction Writer",description:"Viết chỉ dẫn theo bản đồ.",activityId:"unit4-project-writer"},
  {id:"present",icon:"🎤",title:"Show & Tell",description:"Chuẩn bị trình bày bản đồ.",activityId:"unit4-project-present"},
];
const select=<Id extends Unit4Phase2GameId>(ids:Id[])=>Object.fromEntries(ids.map(id=>[id,unit4Phase2.games[id]])) as Record<Id,(typeof unit4Phase2.games)[Id]>;
const selectHelp=<Id extends Unit4Phase2GameId>(ids:Id[])=>Object.fromEntries(ids.map(id=>[id,unit4Phase2.help[id]])) as Record<Id,(typeof unit4Phase2.help)[Id]>;

export function Unit4Communication({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=communicationMeta.map(item=>item.id);return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · Communication" trailTitle="City Guide Trail" introTitle="Asking for and giving directions" introTitleVi="Hỏi và chỉ đường" introDescription="Luyện hội thoại lịch sự, từ nối lộ trình và audio guide. Track 27–28 chưa có nên phần nghe dùng script mới được ghi nhãn AI." foundations={[{title:"Cách hỏi lịch sự",items:vi(unit4Phase2.communication.dialogues.map(item=>`${item.ask} — ${item.answer}`),["Xin lỗi, bạn có thể chỉ cho tôi đường đến rạp chiếu phim được không? — Đi dọc con phố này. Rạp ở bên trái của bạn.","Xin lỗi, bưu điện gần nhất ở đâu? — Ra khỏi nhà ga rồi rẽ phải ở ngã rẽ đầu tiên."])},{title:"Tổ chức lộ trình",items:["First: bước đầu tiên","Then / After that: bước tiếp theo","Finally: điểm kết thúc"]}]} games={select(ids)} help={selectHelp(ids)} meta={communicationMeta} listening={false} reviewTarget={reviewTarget}/>;}
export function Unit4Skills1({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=skills1Meta.map(item=>item.id);return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · Skills 1" trailTitle="Khang's Blog Trail" introTitle="Reading and speaking about a neighbourhood" introTitleVi="Đọc và nói về khu phố" introDescription="Đọc blog của Khang, tìm bằng chứng về likes/dislikes rồi chuẩn bị nói bằng thông tin hư cấu an toàn." foundations={[{title:"Khang's blog",items:vi(unit4Phase2.skills1.blog_paragraphs,["Tôi sống ở vùng ngoại ô thành phố Đà Nẵng. Có nhiều điều tôi thích ở khu phố của mình.","Nơi đây rất thích hợp cho hoạt động ngoài trời vì có công viên đẹp, bãi biển đầy cát và thời tiết dễ chịu. Gần như mọi thứ tôi cần đều có ở đây: cửa hàng, nhà hàng và chợ. Người dân thân thiện hơn và thức ăn ngon hơn những nơi khác.","Tuy nhiên, có hai điều tôi không thích: có nhiều tòa nhà và văn phòng hiện đại; đường phố thì nhộn nhịp và đông đúc."])},{title:"Từ khóa",items:["suburbs: vùng ngoại ô","dislike: không thích","outdoor: ở ngoài trời"]}]} privacyNote="Bài nói trong app dùng Green Town và nhân vật hư cấu; không yêu cầu địa chỉ nhà thật." games={select(ids)} help={selectHelp(ids)} meta={skills1Meta} listening={false} reviewTarget={reviewTarget}/>;}
export function Unit4Skills2({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=skills2Meta.map(item=>item.id);return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · Skills 2" trailTitle="Listen and Write Trail" introTitle="Listening and writing about a neighbourhood" introTitleVi="Nghe và viết về khu phố" introDescription="Track 29–30 chưa được cung cấp. Hai game nghe dùng script mới có đáp án xác định và nhãn AI; ba game viết dùng khung của trang nguồn." foundations={[{title:"Nghe có mục tiêu",items:["Lượt 1: nghe địa điểm và đặc điểm chính.","Lượt 2: nghe chi tiết likes/dislikes.","Không chấm phát âm hoặc giọng nói."]},{title:"Khung đoạn văn",items:vi(unit4Phase2.skills2.paragraph_frames,["Tôi sống ở ...","Có nhiều điều tôi thích ở khu phố của mình.","Tuy nhiên, có một số điều tôi không thích ở nơi này."])}]} privacyNote="Đoạn văn luyện tập dùng khu phố hư cấu; không cần nhập địa chỉ thật." games={select(ids)} help={selectHelp(ids)} meta={skills2Meta} listening={true} reviewTarget={reviewTarget}/>;}
export function Unit4LookingBack({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=lookingBackMeta.map(item=>item.id);return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · Looking Back" trailTitle="Neighbourhood Review Trail" introTitle="Vocabulary and comparative review" introTitleVi="Ôn địa điểm, chỉ đường và so sánh hơn" introDescription="Củng cố toàn bộ từ vựng và ngữ pháp cốt lõi trước Project và Bonus." foundations={[{title:"Địa điểm",items:unit4Phase2.looking_back.places},{title:"So sánh hơn",items:vi(["fast → faster","noisy → noisier","hot → hotter","beautiful → more beautiful","expensive → more expensive"],["nhanh → nhanh hơn","ồn ào → ồn ào hơn","nóng → nóng hơn","đẹp → đẹp hơn","đắt → đắt hơn"])}]} games={select(ids)} help={selectHelp(ids)} meta={lookingBackMeta} listening={false} reviewTarget={reviewTarget}/>;}
export function Unit4Project({reviewTarget}:{reviewTarget?:ReviewTarget|null}){const ids=projectMeta.map(item=>item.id);return <SkillsSection unitId="unit4" sectionLabel="Unit 4 · Project" trailTitle="My Map Studio" introTitle="My Map" introTitleVi="Bản đồ khu phố của em" introDescription="Hai bước trong sách được luyện ở Project Plan; bảng Now I can trở thành các lượt tự kiểm tra trong Show & Tell." foundations={[]} privacyNote="Chỉ dùng bản đồ hư cấu trong ứng dụng; không nhập địa chỉ nhà hoặc vị trí riêng tư." games={select(ids)} help={selectHelp(ids)} meta={projectMeta} listening={false} reviewTarget={reviewTarget}/>;}
