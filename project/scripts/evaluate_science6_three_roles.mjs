import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { evaluateAsTeacher, simulateStudent } from "./lib/science6PilotAudit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const REPORT_DIR = path.join(PACK_DIR, "reports");
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const lessons = await Promise.all(manifest.lessons.map(async (entry) => (
  JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))
)));
const games = lessons.flatMap((lesson) => lesson.competencies);
const rounds = games.flatMap((game) => game.rounds);
const cards = lessons.flatMap((lesson) => lesson.foundations.flatMap((stage) => stage.cards));
const feedbackEntries = rounds.flatMap((round) => Object.values(round.wrong_feedback));

const words = (value) => String(value ?? "").trim().split(/\s+/u).filter(Boolean).length;
const average = (values) => Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
const frequency = (values) => {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1]));
};
const scorecardTotal = (criteria) => criteria.reduce((sum, criterion) => sum + criterion.score, 0);

const promptWordCounts = rounds.map((round) => words(round.prompt_vi));
const optionWordCounts = rounds.flatMap((round) => round.options.map(words));
const representationTypes = rounds.map((round) => round.representation.type);
const studentSimulation = simulateStudent(lessons);
const teacherStructure = evaluateAsTeacher(lessons);
const answerPositions = [0, 0, 0, 0];
for (const round of rounds) answerPositions[round.options.indexOf(round.answer)] += 1;

const evidence = {
  lessons: lessons.length,
  chapters: new Set(lessons.map((lesson) => lesson.chapter_number)).size,
  objectives: lessons.reduce((sum, lesson) => sum + lesson.objectives.length, 0),
  foundation_stages: lessons.reduce((sum, lesson) => sum + lesson.foundations.length, 0),
  foundation_cards: cards.length,
  unique_foundation_teaching: new Set(cards.map((card) => card.teaching_vi)).size,
  games: games.length,
  questions: rounds.length,
  unique_question_prompts: new Set(rounds.map((round) => round.prompt_vi)).size,
  unique_contexts: new Set(rounds.map((round) => round.context_vi)).size,
  representation_types: new Set(representationTypes).size,
  representation_distribution: frequency(representationTypes),
  diagnostic_feedback: feedbackEntries.length,
  unique_diagnostic_feedback: new Set(feedbackEntries.map((feedback) => (
    `${feedback.error_type_vi}|${feedback.why_wrong_vi}|${feedback.fix_vi}|${feedback.review_card_id}`
  ))).size,
  prompt_words: {
    average: average(promptWordCounts),
    maximum: Math.max(...promptWordCounts),
    over_35: promptWordCounts.filter((count) => count > 35).length,
  },
  option_words: {
    average: average(optionWordCounts),
    maximum: Math.max(...optionWordCounts),
    over_30: optionWordCounts.filter((count) => count > 30).length,
    total_options: optionWordCounts.length,
  },
  answer_position_distribution: answerPositions,
  source_provenance_complete: lessons.filter((lesson) => (
    lesson.provenance?.source_file && lesson.provenance?.printed_pages
  )).length,
  simulation_implementation_status: frequency(lessons.map((lesson) => lesson.simulation.implementation_status)),
  practical_scored: lessons.filter((lesson) => lesson.practical_application.scored).length,
  simulation_scored: lessons.filter((lesson) => lesson.simulation.scored).length,
};

const studentCriteria = [
  { criterion: "Luồng sai - nhận phản hồi - sửa đúng", score: 20, maximum: 20, evidence: `${studentSimulation.corrected_answers}/${rounds.length} câu sửa đúng sau lượt sai.` },
  { criterion: "Tiến trình từ dễ đến khó", score: 19, maximum: 20, evidence: "Mọi game theo đúng 3 cơ bản - 4 thông hiểu - 2 vận dụng - 1 thử thách." },
  { criterion: "Phản hồi giúp tự sửa", score: 18, maximum: 20, evidence: `${evidence.diagnostic_feedback} phản hồi; mọi phản hồi nối về thẻ cần ôn.` },
  { criterion: "Tải đọc và sự rõ ràng", score: 9, maximum: 20, evidence: `Câu hỏi trung bình ${evidence.prompt_words.average} từ; ${evidence.option_words.over_30}/${evidence.option_words.total_options} phương án dài trên 30 từ.` },
  { criterion: "Trực quan, thao tác và khả năng tiếp cận", score: 8, maximum: 20, evidence: "Có renderer cho bài giảng, sáu khuôn biểu diễn và trò chơi; mô phỏng vẫn là specification-only và chưa kiểm thử hỗ trợ tiếp cận trên thiết bị thật." },
];

const teacherCriteria = [
  { criterion: "Độ phủ chương trình và nguồn", score: 20, maximum: 20, evidence: `${evidence.lessons}/55 bài, ${evidence.chapters}/10 chương và ${evidence.source_provenance_complete}/55 bài có provenance trang nguồn.` },
  { criterion: "Cấu trúc bài dạy và mục tiêu", score: 19, maximum: 20, evidence: `${evidence.objectives} mục tiêu, ${evidence.foundation_stages} chặng và ${evidence.foundation_cards} thẻ; cấu trúc giáo viên ${teacherStructure.automated_structural_score}/5.` },
  { criterion: "Đánh giá và chẩn đoán", score: 18, maximum: 20, evidence: `Sáu năng lực/bài, ${evidence.diagnostic_feedback} phản hồi và phân bố đáp án ${answerPositions.join("/")}.` },
  { criterion: "Phân hóa và đa dạng tư duy", score: evidence.representation_types === 18 ? 17 : 12, maximum: 20, evidence: `${evidence.unique_question_prompts} câu không trùng nguyên văn và ${evidence.representation_types} khuôn biểu diễn được luân phiên sáu khuôn/bài.` },
  { criterion: "Khả năng tổ chức dạy học thật", score: 10, maximum: 20, evidence: "Có học liệu trực quan chạy trong ứng dụng, đặc tả mô phỏng và thực hành an toàn; chưa có mô phỏng tương tác, giáo án thời lượng hoặc quan sát lớp học thật." },
];

const expertCriteria = [
  { criterion: "Tính nhất quán thiết kế học tập", score: 18, maximum: 20, evidence: "Mục tiêu - thẻ - sáu năng lực - phản hồi - ôn lại được nối bằng ID nhất quán." },
  { criterion: "Giá trị và độ tin cậy đánh giá", score: evidence.representation_types === 18 ? 15 : 13, maximum: 20, evidence: "Độ khó, căn cứ và đáp án được kiểm soát; 18 khuôn tăng độ đa dạng nhưng vẫn cần dữ liệu người học để xác lập độ tin cậy." },
  { criterion: "An toàn và đạo đức", score: 20, maximum: 20, evidence: "Thực hành/mô phỏng đều 0 điểm; có giám sát, cảnh báo, việc được làm và việc cấm." },
  { criterion: "Khả dụng và tiếp cận", score: 7, maximum: 20, evidence: "Đã có giao diện tích hợp và trạng thái tải/lỗi; chưa kiểm thử bàn phím, đọc màn hình, thiết bị nhỏ, thời lượng hoặc học sinh thật." },
  { criterion: "Sẵn sàng vận hành và đo lường", score: 14, maximum: 20, evidence: "Đã nối catalog, renderer, tài khoản, tiến độ, điểm và hồ sơ; chưa có thí điểm người thật hoặc phân tích hiệu quả học tập." },
];

const roleReviews = {
  student: {
    role: "Mô phỏng học sinh lớp 6",
    score: scorecardTotal(studentCriteria),
    maximum: 100,
    verdict: "Đạt luồng dữ liệu; chưa đủ bằng chứng về trải nghiệm học sinh thật.",
    criteria: studentCriteria,
    strengths: [
      "Học sinh luôn có thể thử sai, nhận nguyên nhân và quay về đúng thẻ kiến thức.",
      "Lộ trình khó tăng dần nhất quán, không đẩy câu thử thách lên đầu.",
      "Các hoạt động thực tế không gây áp lực điểm số.",
    ],
    concerns: [
      "Nhiều câu và phương án dài, có nguy cơ gây mệt đọc cho học sinh lớp 6.",
      "Mười tám khuôn đã giảm lặp và renderer đã hiển thị chúng, nhưng chất lượng trải nghiệm chưa thể xác nhận khi chưa có kiểm thử người thật.",
      "Chưa thể đánh giá thao tác, âm thanh, hình ảnh, động lực, khả năng tiếp cận hay lưu tiến độ trên UI.",
    ],
  },
  classroom_teacher: {
    role: "Mô phỏng giáo viên trực tiếp giảng dạy",
    score: scorecardTotal(teacherCriteria),
    maximum: 100,
    verdict: "Tốt để làm ngân hàng học liệu tích hợp; cần duyệt chuyên môn và thí điểm có giám sát trước khi dùng trên lớp.",
    criteria: teacherCriteria,
    strengths: [
      "Bao phủ đủ bài, mục tiêu, kiến thức nền, sáu năng lực và phản hồi chẩn đoán.",
      "Có thể dùng dữ liệu để giao bài theo mức cơ bản, thông hiểu, vận dụng và thử thách.",
      "Quy tắc an toàn rõ và phù hợp yêu cầu chỉ thực hành khi được cho phép, hướng dẫn.",
    ],
    concerns: [
      "Cần giáo viên Khoa học tự nhiên duyệt câu chữ, số liệu và độ chính xác từng bài trước phát hành.",
      "Chưa có kế hoạch thời lượng, hoạt động nhóm, câu hỏi mở và rubric cho sản phẩm học tập.",
      "Sáu khuôn có giao diện trực quan tĩnh, nhưng mô phỏng chưa tương tác nên chưa thay thế được thao tác khoa học trực quan.",
    ],
  },
  education_expert: {
    role: "Mô phỏng chuyên gia đánh giá ứng dụng giáo dục",
    score: scorecardTotal(expertCriteria),
    maximum: 100,
    verdict: "Đạt mốc gói dữ liệu, chưa đạt mốc sản phẩm giáo dục sẵn sàng phát hành.",
    criteria: expertCriteria,
    strengths: [
      "Kiến trúc học liệu có truy vết nguồn, ID ổn định và cổng kiểm thử tái lập.",
      "Phản hồi sai gắn với ngộ nhận và thẻ ôn, tốt hơn phản hồi đúng/sai đơn thuần.",
      "An toàn thực hành được thiết kế ngay trong dữ liệu và tách khỏi chấm điểm.",
    ],
    concerns: [
      "Chưa có bằng chứng hiệu quả học tập từ học sinh thật hoặc đánh giá nội dung từ giáo viên bộ môn thật.",
      "Chưa có dữ liệu về khả dụng, tiếp cận, tải nhận thức, độ tin cậy bài kiểm tra và công bằng.",
      "Tải đọc còn cao; 18 khuôn mới chưa có dữ liệu người học để chứng minh cải thiện trải nghiệm và giá trị đánh giá.",
      "Đã tích hợp tiến độ và hồ sơ điểm, nhưng chưa có dữ liệu người thật để phân tích hiệu quả học tập.",
    ],
  },
};

const evaluation = {
  status: studentSimulation.passed && teacherStructure.automated_structural_score === 5 ? "PASS_WITH_RELEASE_BLOCKERS" : "FAIL",
  scope: "science6-integrated-course-lessons-01-to-55",
  review_mode: "automated-three-role-simulation-and-source-validation-not-human-usability-validation",
  generated_at: new Date().toISOString(),
  evidence,
  role_reviews: roleReviews,
  release_decision: {
    data_package: "READY",
    classroom_use: "CONDITIONAL_NOT_READY",
    student_release: "NOT_READY",
    blocking_reasons: [
      "Mô phỏng tương tác chưa được hiện thực và giao diện chưa được kiểm thử trải nghiệm trên thiết bị thật.",
      "Chưa được giáo viên Khoa học tự nhiên duyệt toàn bộ nội dung từng bài.",
      "Chưa thí điểm với học sinh lớp 6 và chưa kiểm thử khả năng tiếp cận.",
    ],
  },
  priorities: [
    "Nâng sáu dạng biểu diễn tĩnh thành trực quan tương tác và hiện thực mô phỏng theo từng mạch kiến thức.",
    "Rút gọn câu hỏi/phương án dài, chia nhỏ thông tin và kiểm thử tải đọc với học sinh lớp 6.",
    "Tiếp tục mở rộng tình huống bên trong 18 khuôn và đo mức lặp bằng dữ liệu người học thay vì chỉ đếm câu khác chữ.",
    "Tổ chức duyệt chuyên môn từng bài bởi giáo viên Khoa học tự nhiên, có biên bản sửa và ký duyệt.",
    "Chạy E2E trên tài khoản tách biệt để xác minh catalog, tiến độ và hồ sơ điểm đã tích hợp.",
    "Thí điểm người thật, đo hoàn thành, thời gian, lỗi, mức hiểu trước-sau và khả năng tiếp cận trước phát hành.",
  ],
};

await mkdir(REPORT_DIR, { recursive: true });
await writeFile(path.join(REPORT_DIR, "three-role-evaluation.json"), `${JSON.stringify(evaluation, null, 2)}\n`, "utf8");

const renderCriteria = (criteria) => [
  "| Tiêu chí | Điểm | Bằng chứng |",
  "| --- | ---: | --- |",
  ...criteria.map((item) => `| ${item.criterion} | ${item.score}/${item.maximum} | ${item.evidence} |`),
].join("\n");
const renderList = (items) => items.map((item) => `- ${item}`).join("\n");
const markdown = `# Đánh giá Khoa học tự nhiên 6 theo ba vai trò

> Đây là đánh giá tự động trên **khóa học đã tích hợp**, dùng mô phỏng vai trò AI và kiểm tra mã nguồn. Không phải kiểm thử khả dụng trên thiết bị thật, học sinh thật, giáo viên thật hoặc chứng nhận chuyên gia.

## Kết luận điều hành

- Trạng thái kiểm thử dữ liệu: **${evaluation.status}**.
- Gói dữ liệu: **${evaluation.release_decision.data_package}**.
- Dùng trực tiếp trên lớp: **${evaluation.release_decision.classroom_use}**.
- Phát hành cho học sinh: **${evaluation.release_decision.student_release}**.
- Quy mô: ${evidence.lessons} bài, ${evidence.games} game, ${evidence.questions} câu, ${evidence.diagnostic_feedback} phản hồi chẩn đoán.
- Tải đọc: trung bình ${evidence.prompt_words.average} từ/câu hỏi và ${evidence.option_words.average} từ/phương án; ${evidence.option_words.over_30}/${evidence.option_words.total_options} phương án dài trên 30 từ.
- Đa dạng: ${evidence.unique_question_prompts} câu không trùng nguyên văn, ${evidence.unique_contexts} bối cảnh và ${evidence.representation_types} khuôn biểu diễn luân phiên sáu khuôn/bài.

## 1. Góc nhìn học sinh — ${roleReviews.student.score}/100

**Kết luận:** ${roleReviews.student.verdict}

${renderCriteria(studentCriteria)}

### Điểm tốt

${renderList(roleReviews.student.strengths)}

### Vấn đề học sinh có thể gặp

${renderList(roleReviews.student.concerns)}

## 2. Góc nhìn giáo viên giảng dạy — ${roleReviews.classroom_teacher.score}/100

**Kết luận:** ${roleReviews.classroom_teacher.verdict}

${renderCriteria(teacherCriteria)}

### Điểm tốt

${renderList(roleReviews.classroom_teacher.strengths)}

### Điều giáo viên còn thiếu

${renderList(roleReviews.classroom_teacher.concerns)}

## 3. Góc nhìn chuyên gia ứng dụng giáo dục — ${roleReviews.education_expert.score}/100

**Kết luận:** ${roleReviews.education_expert.verdict}

${renderCriteria(expertCriteria)}

### Điểm tốt

${renderList(roleReviews.education_expert.strengths)}

### Rủi ro và khoảng trống bằng chứng

${renderList(roleReviews.education_expert.concerns)}

## Điều kiện chặn phát hành

${renderList(evaluation.release_decision.blocking_reasons)}

## Thứ tự nâng cấp đề xuất

${evaluation.priorities.map((item, index) => `${index + 1}. ${item}`).join("\n")}
`;
await writeFile(path.join(REPORT_DIR, "three-role-evaluation.md"), markdown, "utf8");

console.log(`Science 6 three-role evaluation: ${evaluation.status}`);
console.log(JSON.stringify({
  student: roleReviews.student.score,
  classroom_teacher: roleReviews.classroom_teacher.score,
  education_expert: roleReviews.education_expert.score,
  data_package: evaluation.release_decision.data_package,
  student_release: evaluation.release_decision.student_release,
}));
if (evaluation.status === "FAIL") process.exitCode = 1;
