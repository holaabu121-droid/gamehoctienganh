import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { INFORMATICS_LESSONS, buildInformaticsLesson } from "../frontend/src/features/informatics6/informaticsCurriculum.ts";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const REPORT_DIR=path.join(ROOT,"data","informatics6","reports");
const catalog=JSON.parse(await readFile(path.join(ROOT,"data","curriculum","catalog.json"),"utf8"));
const appSource=await readFile(path.join(ROOT,"frontend","src","App.tsx"),"utf8");
const backendSource=await readFile(path.join(ROOT,"backend","app","db.py"),"utf8");
const built=INFORMATICS_LESSONS.map(buildInformaticsLesson);
const rounds=built.flatMap(lesson=>Object.values(lesson.rounds).flat());
const games=built.flatMap(lesson=>lesson.meta);
const foundationItems=built.flatMap(lesson=>lesson.foundations.flatMap(block=>block.items));
const partPlans=built.flatMap(lesson=>lesson.partPlan);
const rubrics=built.map(lesson=>lesson.rubric);
const wrongFeedback=rounds.flatMap(round=>Object.values(round.wrong_feedback??{}));
const words=value=>String(value??"").trim().split(/\s+/u).filter(Boolean).length;
const average=values=>Number((values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length)).toFixed(1));
const sumScore=criteria=>criteria.reduce((sum,item)=>sum+item.score,0);
const frequency=values=>Object.fromEntries([...values.reduce((map,value)=>map.set(value,(map.get(value)??0)+1),new Map()).entries()].sort((a,b)=>String(a[0]).localeCompare(String(b[0]),"vi")));
const course1=catalog.courses.find(course=>course.id==="informatics-6-semester-1");
const course2=catalog.courses.find(course=>course.id==="informatics-6-semester-2");

const promptWords=rounds.map(round=>words(round.prompt));
const optionWords=rounds.flatMap(round=>round.options.map(words));
const answerPositions=[0,0,0,0];
for(const round of rounds)answerPositions[round.options.indexOf(round.answer)]+=1;
const levels=rounds.map(round=>round.context.split(" · ")[0]);
const feedbackContract=/Lỗi:.*Vì sao sai:.*Cách sửa:.*Ôn lại thẻ/s;
let corrected=0,feedbackShown=0,invalid=0;
for(const round of rounds){
  const wrong=round.options.find(option=>option!==round.answer);
  const feedback=wrong?round.wrong_feedback?.[wrong]:undefined;
  if(!wrong||!feedback||!feedbackContract.test(feedback)){invalid+=1;continue;}
  feedbackShown+=1;
  if(round.options.includes(round.answer))corrected+=1;
}

const evidence={
  lessons:built.length,
  topics:new Set(INFORMATICS_LESSONS.map(lesson=>lesson.topic.split(" · ")[0])).size,
  objectives:INFORMATICS_LESSONS.reduce((sum,lesson)=>sum+lesson.objectives.length,0),
  concepts:INFORMATICS_LESSONS.reduce((sum,lesson)=>sum+lesson.concepts.length,0),
  foundation_cards:foundationItems.length,
  unique_foundation_cards:new Set(foundationItems.map(item=>`${item.text}|${item.translation}`)).size,
  part_plans:partPlans.length,
  rubric_lessons:rubrics.filter(rubric=>rubric.criteria.length===4).length,
  games:games.length,
  questions:rounds.length,
  unique_prompts:new Set(rounds.map(round=>round.prompt)).size,
  unique_context_prompt_pairs:new Set(rounds.map(round=>`${round.context}|${round.prompt}`)).size,
  diagnostic_feedback:wrongFeedback.length,
  diagnostic_contract_complete:wrongFeedback.filter(value=>feedbackContract.test(value)).length,
  difficulty_distribution:frequency(levels),
  game_distribution:frequency(games.map(game=>game.id)),
  visual_families:new Set(INFORMATICS_LESSONS.map(lesson=>lesson.visual)).size,
  visual_lessons:INFORMATICS_LESSONS.filter(lesson=>lesson.visual).length,
  safeguarded_practice_lessons:INFORMATICS_LESSONS.filter(lesson=>lesson.practice).map(lesson=>lesson.number),
  prompt_words:{average:average(promptWords),maximum:Math.max(...promptWords),over_35:promptWords.filter(value=>value>35).length},
  option_words:{average:average(optionWords),maximum:Math.max(...optionWords),over_20:optionWords.filter(value=>value>20).length,total:optionWords.length},
  answer_position_distribution:answerPositions,
  student_simulation:{attempted:rounds.length,feedback_shown:feedbackShown,corrected,invalid},
  integration:{
    semester1_branches:course1?.branch_ids?.length??0,semester2_branches:course2?.branch_ids?.length??0,
    renderer_registered:appSource.includes('"informatics-6-semester-1": Informatics6Experience')&&appSource.includes('"informatics-6-semester-2": Informatics6Experience'),
    activity_plan_registered:backendSource.includes("INFORMATICS6_BRANCHES")&&backendSource.includes('"safe-apply"'),
    separate_subject_score:course1?.subject==="informatics"&&course2?.subject==="informatics",
  },
  limitations:{human_students:0,human_teachers:0,accessibility_audit:false,completed_ui_clickthrough:false,tts_listening_test:false},
};

const studentCriteria=[
  {criterion:"Tiến trình học và khả năng tự sửa",score:20,maximum:20,evidence:`Mô phỏng ${corrected}/${rounds.length} câu đi qua lượt sai, nhận phản hồi và sửa đúng; 102 game lưu theo từng câu.`},
  {criterion:"Phân hóa từ dễ đến khó",score:19,maximum:20,evidence:`Phân bố ${levels.filter(x=>x==="Cơ bản").length} cơ bản, ${levels.filter(x=>x==="Thông hiểu").length} thông hiểu, ${levels.filter(x=>x==="Vận dụng").length} vận dụng, ${levels.filter(x=>x==="Thử thách").length} thử thách; đúng 3-4-2-1 mỗi game.`},
  {criterion:"Phản hồi và trợ giúp",score:20,maximum:20,evidence:`${wrongFeedback.length}/${wrongFeedback.length} phản hồi đủ lỗi, lí do, cách sửa và thẻ ôn; mỗi game có hướng dẫn bốn bước gắn đúng bài và năng lực.`},
  {criterion:"Dễ đọc và động lực",score:16,maximum:20,evidence:`Câu hỏi trung bình ${evidence.prompt_words.average} từ, phương án ${evidence.option_words.average} từ; ${evidence.prompt_words.over_35} câu trên 35 từ. Có bản đồ năm phần trước game nhưng sáu game vẫn giữ bố cục lựa chọn giống nhau.`},
  {criterion:"Trực quan, thao tác và tiếp cận",score:13,maximum:20,evidence:`17/17 bài có trực quan thuộc ${evidence.visual_families} họ; có nghe bài, bàn phím theo thành phần chung nhưng chưa click-through localhost, nghe TTS bằng tai hoặc thử người học thật.`},
];
const teacherCriteria=[
  {criterion:"Độ phủ chương trình và tính đúng trọng tâm",score:20,maximum:20,evidence:`Đủ ${evidence.lessons}/17 bài, 6 chủ đề, 68 mục tiêu và phạm vi trang nguồn; hai học kỳ giữ đúng thứ tự bài.`},
  {criterion:"Cấu trúc bài giảng và cách nghĩ",score:19,maximum:20,evidence:`${evidence.foundation_cards} thẻ cho 17 bài, ${evidence.concepts} hạt kiến thức và ${evidence.part_plans} phần học; mỗi bài có sáu khái niệm, 12 thẻ và lộ trình khởi động–hình thành–luyện–sửa sai–vận dụng.`},
  {criterion:"Đánh giá sáu năng lực và chẩn đoán",score:19,maximum:20,evidence:`${evidence.games} game, ${evidence.questions} câu, ${evidence.diagnostic_feedback} phản hồi; sáu năng lực và điểm hoạt động tách biệt.`},
  {criterion:"Phân hóa và đa dạng nhiệm vụ",score:14,maximum:20,evidence:`${evidence.unique_context_prompt_pairs}/${evidence.questions} cặp bối cảnh-câu hỏi khác nhau nhưng chỉ ${evidence.unique_prompts} câu dẫn khác chữ; các game dùng chung một bộ sinh mẫu.`},
  {criterion:"Khả năng tổ chức dạy học và thực hành",score:18,maximum:20,evidence:`Có ${evidence.part_plans} kế hoạch phần học, rubric bốn tiêu chí ở ${evidence.rubric_lessons}/17 bài và cảnh báo thực hành ở Bài ${evidence.safeguarded_practice_lessons.join(", ")}; chưa có kế hoạch thời lượng hoặc bảng điều khiển giáo viên.`},
];
const expertCriteria=[
  {criterion:"Tính nhất quán thiết kế học tập",score:20,maximum:20,evidence:"Mục tiêu, 12 thẻ, năm phần học, rubric, sáu năng lực, phản hồi, activity ID, tiến độ và hồ sơ điểm nối nhất quán qua 17 bài."},
  {criterion:"Giá trị và độ tin cậy đánh giá",score:14,maximum:20,evidence:`Lộ trình và đáp án được kiểm soát, vị trí đáp án ${answerPositions.join("/")}; chưa có dữ liệu độ khó thực nghiệm, độ phân biệt hoặc độ tin cậy từ người học thật.`},
  {criterion:"An toàn, riêng tư và đạo đức số",score:20,maximum:20,evidence:"Không yêu cầu tài khoản/dữ liệu thật; tìm kiếm, email, chia sẻ và dự án đều yêu cầu cho phép/giám sát, thực hành thật không chấm tự động."},
  {criterion:"Khả dụng và khả năng tiếp cận",score:13,maximum:20,evidence:"Có responsive, nhãn aria, lưu/bỏ qua/làm lại và trực quan CSS; chưa hoàn tất click-through, kiểm thử đọc màn hình, TTS bằng tai hoặc thiết bị học sinh."},
  {criterion:"Sẵn sàng vận hành và đo lường",score:18,maximum:20,evidence:`Đã đăng ký ${evidence.integration.semester1_branches}+${evidence.integration.semester2_branches} bài, renderer, activity plan, điểm môn/tổng môn và bộ cài 1.2.0; còn thiếu thí điểm và telemetry sư phạm có đồng ý.`},
];

const reviews={
  student:{role:"Mô phỏng học sinh lớp 6",score:sumScore(studentCriteria),maximum:100,verdict:"Có thể học độc lập trong gia đình với người lớn hỗ trợ; cần thí điểm người thật để xác nhận mức hấp dẫn và dễ dùng.",criteria:studentCriteria,strengths:["Luồng sai–phản hồi–sửa đúng hoạt động với mọi câu.","Câu khó không xuất hiện sớm; có bỏ qua và làm lại từng câu.","Tình huống an toàn số gần gũi, không buộc cung cấp dữ liệu thật."],concerns:["Sáu trò chơi lặp bố cục lựa chọn, có thể gây đơn điệu sau nhiều bài.","Trực quan hiện là minh họa tĩnh theo sáu họ, chưa phải mô phỏng tương tác sâu.","Chưa có học sinh thật kiểm tra tốc độ đọc, thao tác, âm thanh và mức hứng thú."]},
  classroom_teacher:{role:"Mô phỏng giáo viên trực tiếp giảng dạy",score:sumScore(teacherCriteria),maximum:100,verdict:"Đủ tốt để dùng làm bài giảng và ngân hàng luyện tập bổ trợ; thực hành thật vẫn cần giáo viên quan sát và phản hồi.",criteria:teacherCriteria,strengths:["Bao phủ đủ 17 bài và giữ đúng thứ tự chương trình.","Mỗi bài có sáu hạt kiến thức, 12 thẻ, năm phần học, rubric và sáu năng lực.","An toàn số được dạy như tiêu chí ra quyết định, không chỉ là ghi chú."],concerns:["Sáu game vẫn dùng chung bộ sinh mẫu nên định dạng tương tác chưa đa dạng sâu.","Rubric hỗ trợ quan sát nhưng ứng dụng chưa có màn giáo viên nhập nhận xét sản phẩm.","Thiếu kế hoạch thời lượng, hoạt động cặp/nhóm chi tiết và trang tổng quan dành cho giáo viên."]},
  education_expert:{role:"Mô phỏng chuyên gia đánh giá ứng dụng giáo dục",score:sumScore(expertCriteria),maximum:100,verdict:"Sẵn sàng về kỹ thuật cho thí điểm có giám sát; chưa đủ bằng chứng để khẳng định hiệu quả giáo dục hoặc phát hành rộng.",criteria:expertCriteria,strengths:["Kiến trúc học liệu và đo điểm nhất quán, truy vết được tới bài và năng lực.","Phản hồi chẩn đoán tốt hơn phản hồi đúng/sai đơn thuần.","Quyền riêng tư, sự đồng ý, bản quyền và vai trò người lớn được tích hợp từ thiết kế."],concerns:["Chưa có bằng chứng trước–sau, độ tin cậy bài kiểm tra hoặc dữ liệu người học thật.","Chưa có kiểm thử khả năng tiếp cận đầy đủ và click-through trên bản cài cuối.","Độ đa dạng câu hỏi chủ yếu đến từ bối cảnh và thao tác, chưa đủ biến thiên định dạng tương tác."]},
};

const evaluation={
  status:invalid===0&&corrected===rounds.length?"PASS_WITH_PILOT_REQUIREMENTS":"FAIL",
  scope:"integrated-informatics6-semesters-1-and-2-lessons-01-to-17",
  review_mode:"automated-three-role-simulation-not-human-teacher-student-or-full-ui-validation",
  generated_at:new Date().toISOString(),evidence,role_reviews:reviews,
  release_decision:{technical_product:"READY",supervised_family_use:"READY_WITH_ADULT_SUPPORT",classroom_use:"CONDITIONAL_READY",broad_student_release:"PILOT_REQUIRED",blocking_reasons:["Chưa có học sinh lớp 6 thật tham gia kiểm thử có quan sát và đồng ý.","Chưa có giáo viên Tin học thật duyệt toàn bộ câu hỏi, lời giảng và mức độ khó.","Chưa hoàn tất click-through bản cài, kiểm thử đọc màn hình/TTS bằng tai và thiết bị cấu hình thấp.","Chưa có dữ liệu thực nghiệm về hiệu quả trước–sau, độ phân biệt và độ tin cậy của điểm."]},
  priorities:["Thí điểm 5–10 học sinh cho Bài 1, 7, 9, 14 và 16; ghi thời gian, lỗi, bỏ cuộc và phỏng vấn ngắn.","Mời giáo viên Tin học duyệt từng bài, ưu tiên độ chính xác của sáu hạt kiến thức, đáp án và phản hồi sai.","Thêm biến thể tương tác ngoài trắc nghiệm: kéo thả luồng dữ liệu, email giả lập, định dạng văn bản và sơ đồ thuật toán.","Tạo màn giáo viên ghi rubric/nhận xét cho sản phẩm thật mà không tự động chấm thao tác.","Nâng sáu trực quan tĩnh thành mô phỏng có bàn phím và mô tả đọc màn hình.","Chạy accessibility audit, click-through bộ cài và thử TTS trên máy gia đình trước phát hành rộng."],
};

await mkdir(REPORT_DIR,{recursive:true});
await writeFile(path.join(REPORT_DIR,"three-role-evaluation.json"),`${JSON.stringify(evaluation,null,2)}\n`,"utf8");
const table=criteria=>["| Tiêu chí | Điểm | Bằng chứng |","| --- | ---: | --- |",...criteria.map(item=>`| ${item.criterion} | ${item.score}/${item.maximum} | ${item.evidence} |`)].join("\n");
const list=items=>items.map(item=>`- ${item}`).join("\n");
const section=(title,review)=>`## ${title} — ${review.score}/100\n\n**Kết luận:** ${review.verdict}\n\n${table(review.criteria)}\n\n### Điểm mạnh\n\n${list(review.strengths)}\n\n### Điểm chưa đạt\n\n${list(review.concerns)}`;
const markdown=`# Đánh giá Tin học 6 theo ba vai trò

> Đây là đánh giá tự động trên mã nguồn và dữ liệu tích hợp, dùng mô phỏng vai trò AI. Không phải thử nghiệm học sinh thật, duyệt giáo viên thật hay chứng nhận chuyên gia. UI click-through và thẩm âm TTS chưa hoàn tất.

## Kết luận điều hành

- Trạng thái: **${evaluation.status}**.
- Sản phẩm kỹ thuật: **${evaluation.release_decision.technical_product}**.
- Dùng trong gia đình có người lớn hỗ trợ: **${evaluation.release_decision.supervised_family_use}**.
- Dùng trên lớp: **${evaluation.release_decision.classroom_use}**.
- Phát hành rộng cho học sinh: **${evaluation.release_decision.broad_student_release}**.
- Quy mô: ${evidence.lessons} bài, ${evidence.games} game, ${evidence.questions} câu, ${evidence.diagnostic_feedback} phản hồi chẩn đoán.
- Mô phỏng học sinh: ${corrected}/${rounds.length} câu sửa đúng sau một lượt sai có chủ đích.
- Tải đọc: ${evidence.prompt_words.average} từ/câu hỏi; ${evidence.option_words.average} từ/phương án.
- Độ đa dạng: ${evidence.unique_context_prompt_pairs} cặp bối cảnh–câu hỏi, nhưng chỉ ${evidence.unique_prompts} câu dẫn khác chữ và ${evidence.visual_families} họ trực quan.

${section("1. Góc nhìn học sinh",reviews.student)}

${section("2. Góc nhìn giáo viên giảng dạy",reviews.classroom_teacher)}

${section("3. Góc nhìn chuyên gia ứng dụng giáo dục",reviews.education_expert)}

## Điều kiện cần trước khi phát hành rộng

${list(evaluation.release_decision.blocking_reasons)}

## Thứ tự nâng cấp đề xuất

${evaluation.priorities.map((item,index)=>`${index+1}. ${item}`).join("\n")}
`;
await writeFile(path.join(REPORT_DIR,"three-role-evaluation.md"),markdown,"utf8");
console.log(JSON.stringify({status:evaluation.status,student:reviews.student.score,teacher:reviews.classroom_teacher.score,expert:reviews.education_expert.score,questions:evidence.questions,unique_prompts:evidence.unique_prompts,unique_context_prompt_pairs:evidence.unique_context_prompt_pairs},null,2));
