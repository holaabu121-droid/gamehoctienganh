import sourceJson from "../../../../data/lessons/unit7_source.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { bilingualFoundationItems, type FoundationItem } from "../skills-common/learningUx";
import { UNIT7_GAME_SECTIONS, validateUnit7, type Unit7GameId, type Unit7SectionId, type Unit7Source } from "./unit7Engine";

export const unit7Lesson = validateUnit7(sourceJson as Unit7Source);

const LABELS: Record<Unit7GameId, [string, string, string]> = {
  dialogue:["📺","What's on Today?","Đọc hiểu hội thoại mở đầu."], programme_match:["🧩","Programme Match","Ghép chương trình với thể loại."], comprehension:["🔎","Conversation Check","Tìm chi tiết đúng."], adjectives:["✨","TV Adjectives","Chọn tính từ mô tả."], fact_check:["✅","Fact Check","Kiểm tra thông tin hội thoại."], interview:["🎤","Favourite Programme","Luyện hỏi đáp sở thích."], spelling:["⌨️","TV Spelling","Nhận diện từ truyền hình."],
  vocabulary:["📚","TV Vocabulary","Học từ vựng chương trình TV."], definitions:["🔗","Definition Match","Ghép từ với định nghĩa."], context:["💬","Context Clues","Dùng từ trong ngữ cảnh."], sound:["👂","Sounds /θ/–/ð/","Luyện nghe chủ động 60 giây."], tongue_twister:["🗣️","Tongue Twister","Phân biệt âm trong câu 60 giây."],
  question_words:["❓","Question Words","Chọn từ để hỏi."], wh_dialogue:["🗨️","Wh-dialogue","Hoàn chỉnh hội thoại."], wh_questions:["🧱","Question Builder","Xây câu hỏi đúng."], conjunctions:["🔗","And · But · So","Chọn liên từ phù hợp."], sentence_join:["🧲","Sentence Join","Nối hai ý thành câu."],
  favourite:["❤️","My Favourite Show","Luyện nói chương trình yêu thích."], world_tv:["🌍","TV Around the World","Khám phá truyền hình các nước."], lets_learn:["🎓","Let's Learn","Đọc thông tin chương trình giáo dục."], hello_fatty:["🦊","Hello Fatty","Đọc thông tin phim hoạt hình."], compare:["⚖️","Programme Compare","So sánh hai chương trình."],
  tv_guide:["📰","TV Guide","Đọc lịch phát sóng."], time_match:["🕗","Time Match","Ghép giờ với chương trình."], preferences:["👨‍👩‍👧","Viewer Choice","Chọn chương trình phù hợp."], speaking:["🎙️","Programme Talk","Luyện nói về lựa chọn."], schedule:["🗓️","My TV Plan","Lập lịch xem hợp lý."],
  listening:["🎧","TV Listening","Nghe thông tin chương trình."], details:["🧠","Detail Catcher","Nghe và bắt chi tiết."], habits:["⏱️","TV Habits","Nhận biết thói quen xem TV."], writing:["✍️","Writing Builder","Xây câu về thói quen."], paragraph:["📝","My TV Paragraph","Hoàn chỉnh đoạn văn."],
  category:["🗂️","Word Categories","Ôn nhóm từ."], fill:["🧩","Review Fill","Điền từ vào câu."], wh_review:["❓","Wh-review","Ôn từ để hỏi."], conjunction_review:["🔗","Conjunction Review","Ôn and/but/so."], final_mix:["🏁","Final Mix","Ôn tổng hợp Unit 7."],
  survey:["📋","TV Survey","Hiểu mục tiêu khảo sát."], questions:["❔","Survey Questions","Chọn câu hỏi rõ ràng."], interview_plan:["🛡️","Safe Interview","Lập kế hoạch phỏng vấn an toàn."], results:["📊","Survey Results","Tổng hợp kết quả."], presentation:["🎤","Class Presentation","Chuẩn bị báo cáo trước lớp."],
};

const ACTIVITY_PREFIX: Record<Unit7SectionId, string> = {getting:"getting",acl1:"acl1",acl2:"acl2",communication:"communication",skills1:"skills1",skills2:"skills2",looking_back:"looking-back",project:"project"};
const SECTION_LABEL: Record<Unit7SectionId, string> = {getting:"Getting Started",acl1:"A Closer Look 1",acl2:"A Closer Look 2",communication:"Communication",skills1:"Skills 1",skills2:"Skills 2",looking_back:"Looking Back",project:"Project"};
const SECTION_INTRO: Record<Unit7SectionId, [string,string,string]> = {
  getting:["What's on Today?","Hôm nay có gì trên TV?","Theo dõi Phong và Hùng nói về chương trình yêu thích; nhận biết thể loại, nhân vật và kênh truyền hình."],
  acl1:["Television words and sounds","Từ vựng và âm /θ/–/ð/","Học từ chỉ chương trình truyền hình, tính từ mô tả và luyện hai âm của th."],
  acl2:["Question words and conjunctions","Từ để hỏi và liên từ","Dùng từ để hỏi đúng mục đích; nối ý bằng and, but và so."],
  communication:["My favourite programme","Chương trình em yêu thích","Hỏi đáp sở thích và đọc thông tin về chương trình truyền hình ở nhiều quốc gia."],
  skills1:["Reading a TV guide","Đọc lịch truyền hình","Đọc giờ phát sóng, nội dung chương trình và chọn chương trình phù hợp cho từng người xem."],
  skills2:["Listening and writing about TV habits","Nghe và viết về thói quen xem TV","Audio gốc không có trong PDF; phần nghe dùng kịch bản luyện tập mới với TTS và nhãn AI."],
  looking_back:["Vocabulary and grammar review","Ôn tập Unit 7","Củng cố từ vựng truyền hình, từ để hỏi và các liên từ đã học."],
  project:["How important is TV to you?","TV quan trọng với em thế nào?","Thiết kế khảo sát ngắn, tổng hợp câu trả lời và trình bày kết quả mà không thu thông tin riêng tư."],
};

function metaFor(section: Unit7SectionId): GameMeta<Unit7GameId>[] {
  return UNIT7_GAME_SECTIONS[section].map((id) => {
    const [icon,title,description] = LABELS[id];
    return { id, icon, title, description, activityId:`unit7-${ACTIVITY_PREFIX[section]}-${id.replaceAll("_","-")}`, ...(["sound","tongue_twister"].includes(id)?{timedSeconds:60}:{}), ...(["listening","details"].includes(id)?{listening:true}:{}) };
  });
}

const dialogueFoundations: FoundationItem[] = unit7Lesson.dialogue.map((item) => ({
  text: item.context,
  translation: item.translation,
}));

const FOUNDATIONS: Record<Unit7SectionId, Array<{title:string;items:FoundationItem[]}>> = {
  getting:[
    {title:"Hội thoại Phong và Hùng",items:dialogueFoundations},
    {title:"Programme types",items:bilingualFoundationItems(
      unit7Lesson.banks.programmes.slice(0,5).map((item)=>`${item.context}: ${item.answer}`),
      ["Giọng hát Việt nhí: chương trình tìm kiếm tài năng âm nhạc","Vua Sư Tử: phim hoạt hình","Tom và Jerry: phim hoạt họa","VTV7: kênh truyền hình","English in a Minute: chương trình giáo dục"],
    )},
  ],
  acl1:[
    {title:"Television vocabulary",items:bilingualFoundationItems(
      unit7Lesson.banks.vocabulary.slice(0,6).map((item)=>`${item.answer}: ${item.context}`),
      ["nhân vật: người hoặc con vật trong phim hay phim hoạt họa","chương trình giáo dục: chương trình dạy những điều hữu ích","hài kịch: phim hoặc chương trình vui nhộn","chương trình tài năng: cuộc thi tìm người biểu diễn giỏi nhất","người xem: người xem truyền hình","kênh: đài truyền hình"],
    )},
    {title:"Sound groups",items:[
      {text:"/θ/: theatre, earth, anything, both, through",pronunciationVi:"Đặt nhẹ đầu lưỡi giữa hai hàm răng và thổi hơi ra; cổ họng không rung.",speechText:"thh. theatre. earth. anything. both. through"},
      {text:"/ð/: there, them, neither, weather, than",pronunciationVi:"Đặt đầu lưỡi giữa hai hàm răng như âm /θ/, nhưng bật giọng để cổ họng rung.",speechText:"thuh. there. them. neither. weather. than"},
    ]},
  ],
  acl2:[
    {title:"Question words",items:bilingualFoundationItems(
      unit7Lesson.banks.question_words.slice(0,7).map((item)=>`${item.answer}: ${item.context}`),
      ["When: hỏi về thời gian","How many: hỏi về số lượng","How often: hỏi về mức độ lặp lại","What: hỏi về sự vật hoặc sự việc","Where: hỏi về nơi chốn","Who: hỏi về người","Why: hỏi về lý do"],
    )},
    {title:"Conjunctions",items:[{text:"and",translation:"và: thêm ý cùng hướng"},{text:"but",translation:"nhưng: nối hai ý tương phản"},{text:"so",translation:"vì vậy: nêu kết quả"}]},
  ],
  communication:[
    {title:"Favourite programme dialogue",items:bilingualFoundationItems(
      ["What is your favourite TV programme?","Why do you like it?","Because I can see the animals in their real life."],
      ["Chương trình truyền hình yêu thích của bạn là gì?","Tại sao bạn thích chương trình đó?","Vì mình có thể thấy các con vật trong cuộc sống thật của chúng."],
    )},
    {title:"TV facts",items:bilingualFoundationItems(
      unit7Lesson.banks.communication.slice(2,10).map((item)=>`${item.context} — ${item.answer}`),
      ["Pokémon đến từ Nhật Bản.","Bibi là phim hoạt họa nổi tiếng ở Việt Nam.","Trước năm 1986, Iceland không phát TV vào thứ Năm.","Discovery Channel là kênh giáo dục ở Hoa Kỳ.","Let's Learn được chiếu tại 80 quốc gia.","Cha mẹ và trẻ em đều có thể thưởng thức Let's Learn.","Hello Fatty là một phim hoạt họa.","Nhân vật chính là một chú cáo thông minh."],
    )},
  ],
  skills1:[
    {title:"TV guide",items:bilingualFoundationItems(
      unit7Lesson.banks.tv_guide.slice(0,5).map((item)=>`${item.context}: ${item.answer}`),
      ["8 giờ — Động vật hoang dã: Vườn quốc gia Cúc Phương; cây cối, hoa và động vật.","9 giờ — Hài kịch: Thầy giáo Cáo; ngày đầu tiên của thầy giáo cáo.","10 giờ 30 — Thể thao: Cuộc đua lợn; những chú lợn đáng yêu thi chạy.","11 giờ — Trò chơi truyền hình: Trẻ em luôn đúng; câu hỏi về thú cưng.","12 giờ 15 — Khoa học: Cá heo; cá heo trong biển."],
    )},
    {title:"Speaking model",items:bilingualFoundationItems(["I'd like to watch ...","Because I like ..."],["Mình muốn xem...","Vì mình thích..."])},
  ],
  skills2:[
    {title:"AI practice script",items:bilingualFoundationItems(
      unit7Lesson.banks.listening.map((item)=>item.context),
      ["Mai xem Green Summer cùng gia đình vào thứ Bảy.","Em trai Mai thích phim hoạt họa My Childhood.","Mai xem Harry Potter vào tối Chủ nhật.","Bạn ấy học từ mới từ English and Fun.","Mai thường xem TV một giờ mỗi ngày.","Bạn ấy xem TV sau khi làm xong bài tập.","Gia đình cùng xem trong phòng khách.","Mai không xem TV trong bữa ăn.","Chương trình giáo dục là chương trình yêu thích của bạn ấy.","Cuối tuần bạn ấy có thể xem một bộ phim."],
    )},
    {title:"TV habits paragraph",items:bilingualFoundationItems(["I usually watch ...","My favourite programme is ...","I watch TV for ... a day."],["Mình thường xem...","Chương trình yêu thích của mình là...","Mình xem TV ... mỗi ngày."])},
  ],
  looking_back:[
    {title:"Programme words",items:bilingualFoundationItems(
      unit7Lesson.banks.programmes.map((item)=>item.answer),
      ["chương trình tìm kiếm tài năng âm nhạc","phim hoạt hình","phim hoạt họa","kênh truyền hình","chương trình giáo dục","hài kịch","trò chơi truyền hình","chương trình động vật hoang dã","bản tin","chương trình thể thao"],
    )},
    {title:"Grammar check",items:bilingualFoundationItems(["Choose a Wh-word for the information needed.","Use and, but or so to connect ideas."],["Chọn từ để hỏi phù hợp với thông tin cần tìm.","Dùng and, but hoặc so để nối các ý."])},
  ],
  project:[],
};

export function Unit7Section({section,reviewTarget}:{section:Unit7SectionId;reviewTarget?:ReviewTarget|null}) {
  const meta=metaFor(section), ids=UNIT7_GAME_SECTIONS[section];
  const games=Object.fromEntries(ids.map((id)=>[id,unit7Lesson.games[id]])) as Record<Unit7GameId,(typeof unit7Lesson.games)[Unit7GameId]>;
  const help=Object.fromEntries(ids.map((id)=>[id,unit7Lesson.help[id]])) as Record<Unit7GameId,(typeof unit7Lesson.help)[Unit7GameId]>;
  const [title,titleVi,description]=SECTION_INTRO[section];
  return <SkillsSection unitId="unit7" sectionLabel={`Unit 7 · ${SECTION_LABEL[section]}`} trailTitle={`${SECTION_LABEL[section]} Trail`} introTitle={title} introTitleVi={titleVi} introDescription={description} foundations={FOUNDATIONS[section]} privacyNote={section==="project"?"Chỉ ghi tổng hợp câu trả lời; không thu tên đầy đủ, địa chỉ, số điện thoại hoặc tài khoản của học sinh.":undefined} games={games} help={help} meta={meta} listening={section==="skills2"} reviewTarget={reviewTarget}/>;
}
