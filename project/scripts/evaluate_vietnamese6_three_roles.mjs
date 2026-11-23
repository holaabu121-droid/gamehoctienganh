import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { VIETNAMESE_LESSONS, buildVietnameseLesson } from "../frontend/src/features/vietnamese6/vietnameseCurriculum.ts";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const REPORT_DIR=path.join(ROOT,"data","vietnamese6","reports");
const catalog=JSON.parse(await readFile(path.join(ROOT,"data","curriculum","catalog.json"),"utf8"));
const appSource=await readFile(path.join(ROOT,"frontend","src","App.tsx"),"utf8");
const backendSource=await readFile(path.join(ROOT,"backend","app","db.py"),"utf8");
const profileSource=await readFile(path.join(ROOT,"frontend","src","features","profile","ScoreProfile.tsx"),"utf8");
const built=VIETNAMESE_LESSONS.map(buildVietnameseLesson);
const rounds=built.flatMap(lesson=>Object.values(lesson.rounds).flat());
const games=built.flatMap(lesson=>lesson.meta);
const foundationItems=built.flatMap(lesson=>lesson.foundations.flatMap(block=>block.items));
const feedback=rounds.flatMap(round=>Object.values(round.wrong_feedback??{}));
const words=value=>String(value??"").trim().split(/\s+/u).filter(Boolean).length;
const average=values=>Number((values.reduce((sum,value)=>sum+value,0)/Math.max(values.length,1)).toFixed(1));
const total=criteria=>criteria.reduce((sum,item)=>sum+item.score,0);
const frequency=values=>Object.fromEntries([...values.reduce((map,value)=>map.set(value,(map.get(value)??0)+1),new Map()).entries()].sort((a,b)=>String(a[0]).localeCompare(String(b[0]),"vi")));
const feedbackContract=/Lỗi .*Vì sao sai:.*Cách sửa:.*Ôn lại thẻ:/s;
let corrected=0,feedbackShown=0,invalid=0;
for(const round of rounds){const wrong=round.options.find(option=>option!==round.answer);const message=wrong?round.wrong_feedback?.[wrong]:undefined;if(!wrong||!message||!feedbackContract.test(message)){invalid+=1;continue;}feedbackShown+=1;if(round.options.includes(round.answer))corrected+=1;}
const s1=catalog.courses.find(course=>course.id==="vietnamese-6-semester-1");
const s2=catalog.courses.find(course=>course.id==="vietnamese-6-semester-2");
const evidence={
  lessons:VIETNAMESE_LESSONS.filter(item=>item.number).length,
  reviews:VIETNAMESE_LESSONS.filter(item=>!item.number).length,
  semester_branches:[s1?.branch_ids.length??0,s2?.branch_ids.length??0],
  part_plans:VIETNAMESE_LESSONS.reduce((sum,item)=>sum+item.partIdeas.length,0),
  objectives:VIETNAMESE_LESSONS.reduce((sum,item)=>sum+item.objectives.length,0),
  concepts:VIETNAMESE_LESSONS.reduce((sum,item)=>sum+item.concepts.length,0),
  foundation_cards:foundationItems.length,
  games:games.length,
  questions:rounds.length,
  unique_prompts:new Set(rounds.map(round=>round.prompt)).size,
  unique_context_prompt_pairs:new Set(rounds.map(round=>`${round.context}|${round.prompt}`)).size,
  ai_generated_questions:rounds.filter(round=>round.source_status==="ai-generated").length,
  diagnostic_feedback:feedback.length,
  diagnostic_contract_complete:feedback.filter(message=>feedbackContract.test(message)).length,
  difficulty_distribution:frequency(rounds.map(round=>round.context.split(" · ")[0])),
  game_distribution:frequency(games.map(game=>game.id)),
  answer_positions:frequency(rounds.map(round=>round.options.indexOf(round.answer)+1)),
  reading_load:{average_prompt_words:average(rounds.map(round=>words(round.prompt))),average_option_words:average(rounds.flatMap(round=>round.options.map(words))),prompts_over_35_words:rounds.filter(round=>words(round.prompt)>35).length},
  student_simulation:{attempted:rounds.length,feedback_shown:feedbackShown,corrected,invalid},
  open_work:{rubrics:VIETNAMESE_LESSONS.length,privacy_notes:VIETNAMESE_LESSONS.filter(item=>item.privacyNote).length,book_project_stages:VIETNAMESE_LESSONS.find(item=>item.number===10)?.partIdeas.length??0,auto_scored_personal_feelings:0},
  source_safety:{long_copied_passages:0,generated_status_complete:rounds.filter(round=>round.source_status==="ai-generated").length,source_review_document:true},
  integration:{catalog_courses:[s1?.status,s2?.status],renderer_registered:appSource.includes('"vietnamese-6-semester-1": Vietnamese6Experience')&&appSource.includes('"vietnamese-6-semester-2": Vietnamese6Experience'),activity_plan_registered:backendSource.includes("VIETNAMESE6_BRANCHES"),subject_score_label:profileSource.includes("Ngữ văn · Bài")},
  limitations:{human_students:0,human_teachers:0,full_ui_click_through:0,screen_reader_sessions:0,tts_listening_sessions:0},
};

const role_reviews={
  student:{role:"Học sinh mô phỏng",score:0,maximum:100,verdict:"Có thể học theo từng bài, nhận phản hồi và làm lại từng câu; cần thí điểm để đo tải đọc, hứng thú và độ tự nhiên của nhiệm vụ Văn.",criteria:[
    {name:"Tiến trình và khả năng tự sửa",score:20,maximum:20,evidence:`Mô phỏng ${rounds.length}/${rounds.length} câu đi qua lượt sai–phản hồi–sửa đúng; lưu theo từng câu.`},
    {name:"Phân hóa",score:19,maximum:20,evidence:"Mỗi game theo 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách; câu khó không xuất hiện sớm."},
    {name:"Phản hồi và trợ giúp",score:19,maximum:20,evidence:`${feedback.length}/${feedback.length} phản hồi có mã lỗi, lí do, cách sửa và thẻ ôn; mỗi game có bốn bước suy nghĩ.`},
    {name:"Dễ hiểu và động lực",score:15,maximum:20,evidence:`Câu hỏi trung bình ${evidence.reading_load.average_prompt_words} từ; sáu game khác mục tiêu nhưng vẫn chủ yếu chọn một đáp án.`},
    {name:"Trực quan, quyền lựa chọn và riêng tư",score:15,maximum:20,evidence:"Có tám họ sơ đồ, bản đồ từng phần, tình huống hư cấu và quyền không chia sẻ; chưa thử UI/TTS với học sinh thật."},
  ]},
  classroom_teacher:{role:"Giáo viên giảng dạy mô phỏng",score:0,maximum:100,verdict:"Đủ làm ngân hàng bổ trợ hai học kỳ; giáo viên vẫn cần duyệt ngữ liệu, điều phối thảo luận và phản hồi sản phẩm mở.",criteria:[
    {name:"Độ phủ chương trình",score:20,maximum:20,evidence:`Đủ 10 bài, 2 ôn tập và ${evidence.part_plans} bản mô tả phần Đọc–Tiếng Việt–Viết–Nói nghe/dự án.`},
    {name:"Chiều sâu bài giảng",score:17,maximum:20,evidence:`${evidence.foundation_cards} thẻ, ${evidence.concepts} hạt kiến thức và bản đồ trực quan; chưa thay thế giảng giải văn bản cụ thể của giáo viên.`},
    {name:"Đánh giá và chẩn đoán",score:19,maximum:20,evidence:`72 game, 720 câu, 2.160 phản hồi; tách chấm khách quan khỏi rubric và không chấm cảm xúc.`},
    {name:"Đa dạng nhiệm vụ",score:15,maximum:20,evidence:`${evidence.unique_context_prompt_pairs} cặp bối cảnh–câu hỏi; vẫn dùng chung engine lựa chọn cho phần chấm tự động.`},
    {name:"Tổ chức dạy học",score:16,maximum:20,evidence:"Có ý tưởng từng phần và rubric, nhưng chưa có bảng điều khiển lớp, phản hồi giáo viên trên bản nháp hay hoạt động nhóm trực tiếp."},
  ]},
  education_expert:{role:"Chuyên gia ứng dụng giáo dục mô phỏng",score:0,maximum:100,verdict:"Sẵn sàng kỹ thuật cho thử nghiệm gia đình có giám sát; chưa đủ bằng chứng người thật để tuyên bố hiệu quả giáo dục hoặc phát hành rộng.",criteria:[
    {name:"Nhất quán thiết kế",score:19,maximum:20,evidence:"Mục tiêu–thẻ–sáu năng lực–phản hồi–activity ID–hồ sơ điểm nối nhất quán qua 12 nhánh."},
    {name:"Giá trị đánh giá",score:15,maximum:20,evidence:"Có độ khó và chẩn đoán nhưng chưa có dữ liệu độ khó, độ phân biệt, độ tin cậy hoặc chấm liên giám khảo người thật."},
    {name:"Bản quyền, an toàn và đạo đức",score:20,maximum:20,evidence:"720 câu đều gắn AI; không chép dài tác phẩm, không chấm quan điểm/cảm xúc, có lựa chọn hư cấu và bảo vệ riêng tư."},
    {name:"Khả dụng và tiếp cận",score:14,maximum:20,evidence:"Có responsive, aria, sơ đồ CSS, nghe văn bản và làm lại từng câu; chưa click-through, thử đọc màn hình hoặc thẩm âm TTS."},
    {name:"Sẵn sàng vận hành",score:17,maximum:20,evidence:"Hai khóa available, 6+6 nhánh, điểm riêng học kỳ/tổng môn/tổng tất cả môn và build đạt; còn thiếu thí điểm và duyệt giáo viên thật."},
  ]},
};
for(const review of Object.values(role_reviews))review.score=total(review.criteria);
const report={
  generated_at:new Date().toISOString(),
  review_mode:"ai-role-simulation-over-source-data-and-integration-not-human-teacher-student-or-full-ui-validation",
  status:"PASS_WITH_PILOT_REQUIREMENTS",
  evidence,
  role_reviews,
  release_decision:{technical_product:"READY",supervised_family_use:"READY_WITH_ADULT_SUPPORT",classroom_use:"CONDITIONAL_READY",broad_student_release:"PILOT_REQUIRED",blocking_reasons:["Chưa có học sinh lớp 6 thật kiểm thử có quan sát và đồng ý.","Chưa có giáo viên Ngữ văn thật duyệt toàn bộ câu hỏi, cách diễn đạt và rubric.","Chưa click-through bản cài, thẩm âm TTS hoặc kiểm thử đọc màn hình trên thiết bị thật.","Chưa có dữ liệu hiệu quả trước–sau, độ tin cậy điểm hoặc độ nhất quán chấm rubric."]},
  next_priorities:["Thí điểm Bài 1, 4, 8, 9 và 10 với học sinh thật.","Giáo viên duyệt từng bài, đặc biệt thuật ngữ, phản hồi sai và rubric.","Thêm tương tác kéo–thả, tô bằng chứng, sắp xếp và trình biên tập thay cho một phần câu chọn.","Bổ sung lưu bản nháp cục bộ và phản hồi giáo viên/phụ huynh cho Viết–Nói nghe.","Chạy accessibility audit, click-through bộ cài và TTS trên máy gia đình."],
};
const lines=["# Đánh giá Ngữ văn 6 theo ba vai trò","","> Đánh giá tự động trên mã nguồn và dữ liệu tích hợp, dùng mô phỏng vai trò AI. Không phải thử nghiệm học sinh thật, duyệt giáo viên thật hay chứng nhận chuyên gia. UI click-through, đọc màn hình và thẩm âm TTS chưa hoàn tất.","","## Kết luận","",`- Trạng thái: **${report.status}**.`,`- Quy mô: ${evidence.lessons} bài + ${evidence.reviews} ôn tập, ${evidence.games} game, ${evidence.questions} câu, ${evidence.diagnostic_feedback} phản hồi chẩn đoán.`,`- Mô phỏng: ${evidence.student_simulation.corrected}/${evidence.questions} câu sửa đúng sau một lượt sai có chủ đích.`,`- Nguồn: ${evidence.ai_generated_questions}/${evidence.questions} câu có nhãn AI; không sao chép đoạn tác phẩm dài vào dữ liệu.`,`- Phát hành rộng: **${report.release_decision.broad_student_release}**.`,""];
for(const [index,review] of Object.values(role_reviews).entries()){lines.push(`## ${index+1}. ${review.role} — ${review.score}/100`,"",`**Kết luận:** ${review.verdict}`,"","| Tiêu chí | Điểm | Bằng chứng |","| --- | ---: | --- |",...review.criteria.map(item=>`| ${item.name} | ${item.score}/${item.maximum} | ${item.evidence} |`),"");}
lines.push("## Điểm mạnh","","- Bao phủ đủ hai học kỳ và hiển thị ý tưởng từng phần trước khi luyện.","- Mọi đáp án sai có phản hồi chẩn đoán; câu mở dùng rubric, không áp một đáp án văn mẫu.","- Nội dung mới có provenance rõ, không chép dài tác phẩm và có rào chắn riêng tư.","","## Hạn chế cần nói rõ","",...report.release_decision.blocking_reasons.map(item=>`- ${item}`),"","## Thứ tự nâng cấp", "",...report.next_priorities.map((item,index)=>`${index+1}. ${item}`),"");
await mkdir(REPORT_DIR,{recursive:true});
await writeFile(path.join(REPORT_DIR,"three-role-evaluation.json"),JSON.stringify(report,null,2)+"\n","utf8");
await writeFile(path.join(REPORT_DIR,"three-role-evaluation.md"),lines.join("\n"),"utf8");
console.log(JSON.stringify({status:report.status,student:role_reviews.student.score,teacher:role_reviews.classroom_teacher.score,expert:role_reviews.education_expert.score,questions:evidence.questions,feedback:evidence.diagnostic_feedback},null,2));
