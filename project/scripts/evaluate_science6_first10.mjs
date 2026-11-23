import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { evaluateAsTeacher, simulateStudent } from "./lib/science6PilotAudit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const REPORT_DIR = path.join(PACK_DIR, "reports");
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const entries = manifest.lessons.filter((entry) => entry.lesson_number <= 10);
const lessons = await Promise.all(entries.map(async (entry) => JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))));
const rounds = lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds));
const cards = lessons.flatMap((lesson) => lesson.foundations.flatMap((stage) => stage.cards));
const student = simulateStudent(lessons);
const teacher = evaluateAsTeacher(lessons);
const answerPositions = [0, 0, 0, 0];
for (const round of rounds) answerPositions[round.options.indexOf(round.answer)] += 1;

const evaluation = {
  status: student.passed && teacher.automated_structural_score === 5 ? "PASS" : "FAIL",
  scope: "science6-lessons-01-to-10",
  review_mode: "automated-data-logic-and-provisional-ai-teacher-role",
  counts: {
    lessons: lessons.length,
    foundation_stages: lessons.reduce((sum, lesson) => sum + lesson.foundations.length, 0),
    foundation_cards: cards.length,
    competency_games: lessons.reduce((sum, lesson) => sum + lesson.competencies.length, 0),
    questions: rounds.length,
    diagnostic_feedback: rounds.reduce((sum, round) => sum + Object.keys(round.wrong_feedback).length, 0),
    practical_scored: lessons.filter((lesson) => lesson.practical_application.scored).length,
    simulations_scored: lessons.filter((lesson) => lesson.simulation.scored).length,
  },
  level_distribution: rounds.reduce((result, round) => ({ ...result, [round.level]: result[round.level] + 1 }), { basic: 0, understanding: 0, application: 0, challenge: 0 }),
  answer_position_distribution: answerPositions,
  student_simulation: student,
  teacher_role_audit: teacher,
  assessment: {
    strengths: [
      "Phạm vi Bài 1-10 liền mạch từ nhập môn, an toàn, dụng cụ-quy trình đo đến chất và sự chuyển thể.",
      "Mỗi bài có đủ bài giảng 5 chặng/10 thẻ, sáu năng lực và lộ trình 3-4-2-1.",
      "Mỗi lựa chọn sai đều có chẩn đoán, cách sửa và thẻ kiến thức cần quay lại.",
      "Thực hành gia đình không chấm điểm; hoạt động có nhiệt, lửa, hóa chất, vật sắc và thiết bị quang học đều bị giới hạn hoặc chuyển sang mô phỏng/giáo viên biểu diễn.",
    ],
    pedagogical_risks: [
      "Sáu game dùng một bộ khung sinh câu chung nên độ đa dạng cấu trúc tư duy chưa tương đương ngân hàng câu viết tay hoàn toàn.",
      "Renderer đã trình bày bài giảng, sáu khuôn biểu diễn và trò chơi; mô phỏng tương tác vẫn là đặc tả dữ liệu và chưa được kiểm thử khả năng tiếp cận trên thiết bị thật.",
      "Chưa có quan sát học sinh thật hoặc nghiệm thu của giáo viên Khoa học tự nhiên; điểm 5/5 chỉ là cổng cấu trúc tự động.",
    ],
    recommendation: "Dữ liệu Bài 1-10 và renderer tích hợp đã đạt cổng tự động. Trước khi phát hành rộng cần thử với học sinh và giáo viên, kiểm thử khả năng tiếp cận, rồi mở rộng biến thiên số liệu-tình huống ở từng năng lực.",
  },
};

await mkdir(REPORT_DIR, { recursive: true });
await writeFile(path.join(REPORT_DIR, "first10-evaluation.json"), `${JSON.stringify(evaluation, null, 2)}\n`, "utf8");
const markdown = `# Đánh giá Khoa học tự nhiên 6 - Bài 1 đến Bài 10

> Đây là kiểm thử dữ liệu, mô phỏng logic học sinh và đánh giá vai trò giáo viên do AI thực hiện; chưa phải nghiệm thu của giáo viên hoặc học sinh thật.

## Kết quả

- Trạng thái: **${evaluation.status}**.
- Quy mô: ${evaluation.counts.lessons} bài, ${evaluation.counts.foundation_stages} chặng, ${evaluation.counts.foundation_cards} thẻ, ${evaluation.counts.competency_games} trò chơi, ${evaluation.counts.questions} câu.
- Phản hồi chẩn đoán: ${evaluation.counts.diagnostic_feedback}.
- Phân bố độ khó: ${evaluation.level_distribution.basic} cơ bản, ${evaluation.level_distribution.understanding} thông hiểu, ${evaluation.level_distribution.application} vận dụng, ${evaluation.level_distribution.challenge} thử thách.
- Vị trí đáp án đúng 1-4: ${evaluation.answer_position_distribution.join(" / ")}.
- Thực hành có điểm: ${evaluation.counts.practical_scored}; mô phỏng có điểm: ${evaluation.counts.simulations_scored}.
- Mô phỏng học sinh: ${student.passed ? "PASS" : "FAIL"}, hoàn thành ${student.questions_completed}/600 câu, nhận ${student.diagnostic_feedback_received}/600 phản hồi sau lựa chọn sai và sửa đúng ${student.corrected_answers}/600 câu.
- Cổng cấu trúc giáo viên: ${teacher.automated_structural_score}/5.

## Điểm mạnh

${evaluation.assessment.strengths.map((item) => `- ${item}`).join("\n")}

## Giới hạn và rủi ro sư phạm

${evaluation.assessment.pedagogical_risks.map((item) => `- ${item}`).join("\n")}

## Khuyến nghị

${evaluation.assessment.recommendation}
`;
await writeFile(path.join(REPORT_DIR, "first10-evaluation.md"), markdown, "utf8");

console.log(`Science 6 first 10 evaluation: ${evaluation.status}`);
console.log(JSON.stringify(evaluation.counts));
if (evaluation.status !== "PASS") process.exitCode = 1;
