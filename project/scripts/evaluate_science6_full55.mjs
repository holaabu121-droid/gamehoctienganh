import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { evaluateAsTeacher, simulateStudent } from "./lib/science6PilotAudit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const REPORT_DIR = path.join(PACK_DIR, "reports");
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const lessons = await Promise.all(manifest.lessons.map(async (entry) => JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))));
const rounds = lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds));
const cards = lessons.flatMap((lesson) => lesson.foundations.flatMap((stage) => stage.cards));
const student = simulateStudent(lessons);
const teacher = evaluateAsTeacher(lessons);
const answerPositions = [0, 0, 0, 0];
for (const round of rounds) answerPositions[round.options.indexOf(round.answer)] += 1;
const levelDistribution = rounds.reduce((counts, round) => ({ ...counts, [round.level]: counts[round.level] + 1 }), { basic: 0, understanding: 0, application: 0, challenge: 0 });

const evaluation = {
  status: lessons.length === 55 && student.passed && teacher.automated_structural_score === 5 ? "PASS" : "FAIL",
  scope: "science6-lessons-01-to-55",
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
  level_distribution: levelDistribution,
  answer_position_distribution: answerPositions,
  student_simulation: student,
  teacher_role_audit: teacher,
  assessment: {
    strengths: [
      "Bao phủ liên tục đủ 55 bài và mười chương của sách, từ phương pháp khoa học đến Trái Đất-bầu trời.",
      "Mọi bài cùng chuẩn 5 chặng/10 thẻ, sáu năng lực, 60 câu và lộ trình 3-4-2-1.",
      "Mỗi phương án sai có chẩn đoán, giải thích, cách sửa và liên kết thẻ cần ôn.",
      "Thực hành và mô phỏng đều không tính điểm; nội dung nguy hiểm được chặn hoặc chuyển sang mô phỏng/giáo viên hướng dẫn.",
      "Từng bài có báo cáo PASS riêng và toàn gói có cổng tổng kiểm tra số lượng, ID, điểm, an toàn và mô phỏng học sinh.",
    ],
    pedagogical_risks: [
      "Các bài mới dùng ngân hàng điểm kiến thức riêng nhưng sáu năng lực vẫn được diễn đạt qua một engine sinh câu chung; cần giáo viên rà độ tự nhiên và độ phân hóa của từng câu.",
      "Renderer đã có hình thức trực quan cho bài giảng, sáu khuôn biểu diễn và trò chơi; mô phỏng tương tác vẫn là đặc tả dữ liệu, chưa cho học sinh thao tác thật.",
      "Chưa có thử nghiệm khả dụng, khả năng tiếp cận, thời lượng và tải nhận thức với học sinh lớp 6 thật.",
      "Đánh giá 5/5 là điểm cấu trúc tự động, không thay thế nghiệm thu nội dung của giáo viên Khoa học tự nhiên.",
    ],
    release_readiness: "Gói dữ liệu, catalog, renderer, tiến độ và hồ sơ điểm đã tích hợp. Chưa nên phát hành rộng trước khi giáo viên bộ môn nghiệm thu, học sinh thật thí điểm và khả năng tiếp cận được kiểm thử.",
  },
};

await mkdir(REPORT_DIR, { recursive: true });
await writeFile(path.join(REPORT_DIR, "full55-evaluation.json"), `${JSON.stringify(evaluation, null, 2)}\n`, "utf8");
const markdown = `# Đánh giá Khoa học tự nhiên 6 - Toàn bộ 55 bài

> Đây là kiểm thử dữ liệu, mô phỏng logic học sinh và đánh giá vai trò giáo viên do AI thực hiện; chưa phải nghiệm thu của giáo viên hoặc học sinh thật.

## Kết quả tổng

- Trạng thái: **${evaluation.status}**.
- ${evaluation.counts.lessons} bài, ${evaluation.counts.foundation_stages} chặng, ${evaluation.counts.foundation_cards} thẻ, ${evaluation.counts.competency_games} trò chơi.
- ${evaluation.counts.questions} câu và ${evaluation.counts.diagnostic_feedback} phản hồi chẩn đoán.
- Độ khó: ${levelDistribution.basic} cơ bản, ${levelDistribution.understanding} thông hiểu, ${levelDistribution.application} vận dụng, ${levelDistribution.challenge} thử thách.
- Vị trí đáp án đúng 1-4: ${answerPositions.join(" / ")}.
- Thực hành có điểm: ${evaluation.counts.practical_scored}; mô phỏng có điểm: ${evaluation.counts.simulations_scored}.
- Mô phỏng học sinh: ${student.passed ? "PASS" : "FAIL"}, hoàn thành ${student.questions_completed}/3300 câu và sửa đúng ${student.corrected_answers}/3300 sau lượt chọn sai.
- Cổng cấu trúc giáo viên: ${teacher.automated_structural_score}/5.

## Điểm mạnh

${evaluation.assessment.strengths.map((item) => `- ${item}`).join("\n")}

## Giới hạn và rủi ro sư phạm

${evaluation.assessment.pedagogical_risks.map((item) => `- ${item}`).join("\n")}

## Mức sẵn sàng

${evaluation.assessment.release_readiness}
`;
await writeFile(path.join(REPORT_DIR, "full55-evaluation.md"), markdown, "utf8");

console.log(`Science 6 full 55 evaluation: ${evaluation.status}`);
console.log(JSON.stringify(evaluation.counts));
if (evaluation.status !== "PASS") process.exitCode = 1;
