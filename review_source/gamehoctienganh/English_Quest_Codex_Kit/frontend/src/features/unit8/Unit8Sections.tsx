import sourceJson from "../../../../data/lessons/unit8_source.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { bilingualFoundationItems, type FoundationItem } from "../skills-common/learningUx";
import { UNIT8_GAME_SECTIONS, validateUnit8, type Unit8GameId, type Unit8SectionId, type Unit8Source } from "./unit8Engine";

export const unit8Lesson=validateUnit8(sourceJson as Unit8Source);

const LABELS:Record<Unit8GameId,[string,string,string]>={
  dialogue:["🏋️","At the Gym","Đọc hiểu hội thoại mở đầu."],gap_fill:["🧩","Conversation Gaps","Điền chi tiết hội thoại."],sports_match:["🏅","Sports Match","Nhận diện môn thể thao và trò chơi."],sporty_quiz:["⚡","How Sporty Are You?","Trả lời câu hỏi về vận động."],details:["🔎","Gym Details","Tìm thông tin đúng."],vocabulary:["📚","Sports Words","Học từ vựng thể thao."],dialogue_order:["🗨️","Dialogue Order","Chọn lượt lời tiếp theo."],
  equipment:["🎒","Sports Equipment","Nhận diện dụng cụ thể thao."],sport_equipment:["🔗","Equipment Match","Ghép dụng cụ với môn chơi."],context:["💬","Sports Context","Dùng từ trong ngữ cảnh."],sound:["👂","Sounds e–æ","Luyện nghe chủ động 60 giây."],sound_sentence:["🗣️","Sound Sentences","Phân biệt âm trong câu 60 giây."],
  past_simple:["⏮️","Past Simple","Chọn dạng quá khứ đơn."],verb_forms:["🧱","Past Forms","Biến đổi động từ."],weekend_dialogue:["📅","Last Weekend","Hoàn chỉnh hội thoại cuối tuần."],imperatives:["👉","Imperatives","Dùng câu mệnh lệnh."],gym_rules:["📋","Gym Rules","Chọn nội quy phòng tập."],
  congratulations:["🎉","Congratulations!","Biết cách chúc mừng."],replies:["🙏","Thank You","Đáp lại lời chúc mừng."],sports_quiz:["🏆","Sports Quiz","Khám phá kiến thức thể thao."],interview:["🎤","Sports Interview","Hỏi đáp về môn yêu thích."],report:["📣","Interview Report","Tường thuật câu trả lời."],
  pele_reading:["⚽","Pelé Reading","Đọc về Vua bóng đá."],pele_details:["🔍","Pelé Details","Tìm dữ kiện trong bài đọc."],timeline:["🗓️","Career Timeline","Sắp xếp mốc sự nghiệp."],sportsperson:["🥇","Famous Sportspeople","Đọc hồ sơ vận động viên."],presentation:["🎙️","Sports Star Talk","Trình bày về người nổi tiếng."],
  listening:["🎧","Sports Listening","Nghe thông tin thể thao."],true_false:["✅","True or False","Nghe và kiểm tra thông tin."],detail_fill:["🧠","Detail Catcher","Nghe và điền chi tiết."],writing_cues:["✍️","Writing Cues","Chọn gợi ý viết."],paragraph:["📝","My Sport Paragraph","Hoàn chỉnh đoạn văn."],
  odd_one_out:["🗂️","Odd One Out","Tìm từ khác nhóm."],play_do_go:["🎯","Play · Do · Go","Chọn động từ đi với môn chơi."],past_review:["⏮️","Past Review","Ôn quá khứ đơn."],imperatives_review:["👉","Imperative Review","Ôn câu mệnh lệnh."],final_mix:["🏁","Final Mix","Ôn tổng hợp Unit 8."],
  traditional_game:["🙈","Traditional Game","Đọc về bịt mắt bắt dê."],player_count:["👥","Players","Xác định số người chơi."],equipment_plan:["🧣","Equipment Plan","Chọn dụng cụ cần thiết."],how_to_play:["🪜","How to Play","Sắp xếp cách chơi."],project_presentation:["🎤","Game Presentation","Chuẩn bị bài giới thiệu trò chơi."],
};

const ACTIVITY_PREFIX:Record<Unit8SectionId,string>={getting:"getting",acl1:"acl1",acl2:"acl2",communication:"communication",skills1:"skills1",skills2:"skills2",looking_back:"looking-back",project:"project"};
const SECTION_LABEL:Record<Unit8SectionId,string>={getting:"Getting Started",acl1:"A Closer Look 1",acl2:"A Closer Look 2",communication:"Communication",skills1:"Skills 1",skills2:"Skills 2",looking_back:"Looking Back",project:"Project"};
const SECTION_INTRO:Record<Unit8SectionId,[string,string,string]>={
  getting:["At the gym","Tại phòng tập","Theo dõi Mai và Dương nói về karate, bóng bàn, chiến thắng đầu tiên và kế hoạch đến câu lạc bộ."],
  acl1:["Sports words and vowel sounds","Từ vựng và âm e–æ","Học tên môn thể thao, dụng cụ; luyện hai nguyên âm qua từ và câu mẫu."],
  acl2:["Past simple and imperatives","Quá khứ đơn và câu mệnh lệnh","Kể việc đã xảy ra; đưa yêu cầu, chỉ dẫn và nội quy ngắn gọn."],
  communication:["Congratulations and sports talk","Chúc mừng và trò chuyện thể thao","Chúc mừng, đáp lời; làm câu đố và phỏng vấn về môn thể thao hoặc trò chơi yêu thích."],
  skills1:["Reading about Pelé","Đọc và nói về danh thủ","Đọc dữ kiện về Pelé và dùng mốc thời gian để trình bày về một vận động viên nổi tiếng."],
  skills2:["Listening and writing about sports","Nghe và viết về thể thao","Bài nghe dùng kịch bản luyện tập TTS có nhãn AI; sau đó lập dàn ý và viết đoạn 40–50 từ."],
  looking_back:["Vocabulary and grammar review","Ôn tập Unit 8","Củng cố từ vựng thể thao, play–do–go, quá khứ đơn và câu mệnh lệnh."],
  project:["A traditional game","Một trò chơi dân gian","Dùng các gợi ý trong sách để xây nội dung giới thiệu cách chơi một trò chơi dân gian."],
};

function metaFor(section:Unit8SectionId):GameMeta<Unit8GameId>[] {
  return UNIT8_GAME_SECTIONS[section].map((id)=>{const [icon,title,description]=LABELS[id];return {id,icon,title,description,activityId:`unit8-${ACTIVITY_PREFIX[section]}-${id.replaceAll("_","-")}`,...(["sound","sound_sentence"].includes(id)?{timedSeconds:60}:{}),...(["listening","true_false","detail_fill"].includes(id)?{listening:true}:{})};});
}

const dialogueFoundations:FoundationItem[]=unit8Lesson.dialogue.map((item)=>({text:item.context,translation:item.translation}));
const FOUNDATIONS:Record<Unit8SectionId,Array<{title:string;items:FoundationItem[]}>>={
  getting:[
    {title:"Hội thoại Mai và Dương",items:dialogueFoundations},
    {title:"Sports and games",items:bilingualFoundationItems(["chess","aerobics","table tennis","cycling","swimming","volleyball"],["cờ vua","thể dục nhịp điệu","bóng bàn","đạp xe","bơi lội","bóng chuyền"])},
  ],
  acl1:[
    {title:"Sports equipment",items:bilingualFoundationItems(["ball","boat","racket","goggles","sports shoes"],["quả bóng","thuyền","vợt","kính bơi","giày thể thao"])},
    {title:"Sound groups",items:[
      {text:"/e/: chess, tennis, exercise, contest",translation:"Âm e ngắn như trong chess và tennis.",pronunciationVi:"Mở miệng vừa phải, lưỡi ở phía trước và phát âm ngắn, gọn.",speechText:"eh. chess. tennis. exercise. contest"},
      {text:"/æ/: racket, match, marathon, active",translation:"Âm æ như trong racket và match.",pronunciationVi:"Hạ hàm rộng hơn âm e, đặt lưỡi thấp phía trước và phát âm ngắn.",speechText:"ae. racket. match. marathon. active"},
    ]},
  ],
  acl2:[
    {title:"Past simple",items:bilingualFoundationItems(["We use the past simple for actions that happened in the past.","I played badminton yesterday.","Did you sleep well? — No, I didn't."],["Dùng quá khứ đơn cho hành động đã xảy ra trong quá khứ.","Hôm qua tôi đã chơi cầu lông.","Bạn đã ngủ ngon không? — Không."])},
    {title:"Imperatives",items:[{text:"Positive: V",translation:"Khẳng định: bắt đầu bằng động từ nguyên mẫu."},{text:"Negative: Don't + V",translation:"Phủ định: Don't + động từ nguyên mẫu."},{text:"Close the window. Don't use the lift.",translation:"Hãy đóng cửa sổ. Đừng dùng thang máy."}]},
  ],
  communication:[
    {title:"Congratulations",items:bilingualFoundationItems(["Congratulations!","Thank you.","So you're our class champion now."],["Chúc mừng!","Cảm ơn bạn.","Vậy giờ bạn là nhà vô địch của lớp mình rồi."])},
    {title:"Sports interview",items:bilingualFoundationItems(["What sports do you play in your free time?","Which sport do you like watching on TV?","Did you join any clubs?"],["Bạn chơi môn nào lúc rảnh?","Bạn thích xem môn nào trên TV?","Bạn đã tham gia câu lạc bộ nào chưa?"])},
  ],
  skills1:[
    {title:"Pelé facts",items:bilingualFoundationItems(["Born in 1940 in Brazil","His father taught him to play football.","He started playing for Santos at 15.","He scored 1,281 goals in total.","Football Player of the Century in 1999","The King of Football"],["Sinh năm 1940 tại Brazil.","Bố ông dạy ông chơi bóng đá.","Ông bắt đầu chơi cho Santos lúc 15 tuổi.","Ông ghi tổng cộng 1.281 bàn.","Cầu thủ của Thế kỷ năm 1999.","Vua bóng đá."])},
    {title:"Speaking cues",items:bilingualFoundationItems(["His or her name","The sport he or she plays","Why he or she is famous","Explain why you like him or her"],["Tên của người đó","Môn thể thao người đó chơi","Vì sao người đó nổi tiếng","Giải thích vì sao bạn thích người đó"])},
  ],
  skills2:[
    {title:"AI practice script",items:unit8Lesson.banks.listening.map((item)=>({text:item.context,translation:item.translation}))},
    {title:"Writing cues",items:bilingualFoundationItems(["What is the name of the sport or game?","How many players are there?","What equipment does it need?","Why do you like it?"],["Tên môn thể thao hoặc trò chơi là gì?","Có bao nhiêu người chơi?","Cần dụng cụ gì?","Tại sao bạn thích?"])},
  ],
  looking_back:[
    {title:"Play · do · go",items:[{text:"play + ball/team/board games",translation:"play đi với trò chơi dùng bóng, theo đội hoặc trò chơi bàn cờ."},{text:"do + martial arts/exercise",translation:"do đi với võ thuật hoặc bài tập."},{text:"go + -ing activities",translation:"go đi với hoạt động dạng -ing như swimming, cycling."}]},
    {title:"Grammar check",items:bilingualFoundationItems(["Use the past simple with finished past time.","Use imperatives to tell someone what to do or not to do."],["Dùng quá khứ đơn với thời gian quá khứ đã kết thúc.","Dùng câu mệnh lệnh để bảo ai làm hoặc không làm việc gì."])},
  ],
  project:[],
};

export function Unit8Section({section,reviewTarget}:{section:Unit8SectionId;reviewTarget?:ReviewTarget|null}){
  const meta=metaFor(section),ids=UNIT8_GAME_SECTIONS[section];
  const games=Object.fromEntries(ids.map((id)=>[id,unit8Lesson.games[id]])) as Record<Unit8GameId,(typeof unit8Lesson.games)[Unit8GameId]>;
  const help=Object.fromEntries(ids.map((id)=>[id,unit8Lesson.help[id]])) as Record<Unit8GameId,(typeof unit8Lesson.help)[Unit8GameId]>;
  const [title,titleVi,description]=SECTION_INTRO[section];
  return <SkillsSection unitId="unit8" sectionLabel={`Unit 8 · ${SECTION_LABEL[section]}`} trailTitle={`${SECTION_LABEL[section]} Trail`} introTitle={title} introTitleVi={titleVi} introDescription={description} foundations={FOUNDATIONS[section]} games={games} help={help} meta={meta} listening={section==="skills2"} reviewTarget={reviewTarget}/>;
}
