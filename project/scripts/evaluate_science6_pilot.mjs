import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { evaluateAsTeacher, simulateStudent } from "./lib/science6PilotAudit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const REPORT_DIR = path.join(PACK_DIR, "reports");
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const lessons = await Promise.all(manifest.lessons.map(async (entry) => JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))));

const student = simulateStudent(lessons);
const teacher = evaluateAsTeacher(lessons);
const lessonCount = lessons.length;
const gameCount = lessonCount * 6;
const questionCount = lessonCount * 60;
await mkdir(REPORT_DIR, { recursive: true });
await writeFile(path.join(REPORT_DIR, "student-simulation.json"), `${JSON.stringify(student, null, 2)}\n`, "utf8");
await writeFile(path.join(REPORT_DIR, "teacher-review.json"), `${JSON.stringify(teacher, null, 2)}\n`, "utf8");

const markdown = `# Đánh giá gói Khoa học tự nhiên 6 đang phát triển

> Báo cáo này là kiểm thử logic và đánh giá vai trò do AI thực hiện, không phải bằng chứng học sinh thật đã sử dụng hay giáo viên bộ môn đã nghiệm thu.

## Lượt học sinh mô phỏng dữ liệu

- Kết quả: ${student.passed ? "PASS" : "FAIL"}.
- Hoàn thành: ${student.lessons_completed}/${lessonCount} bài, ${student.games_completed}/${gameCount} trò chơi, ${student.questions_completed}/${questionCount} câu.
- Cố ý chọn sai để kiểm tra phản hồi: ${student.intentional_wrong_attempts} lượt.
- Nhận phản hồi chẩn đoán: ${student.diagnostic_feedback_received}/${student.intentional_wrong_attempts}.
- Sửa sang đáp án đúng: ${student.corrected_answers}/${student.questions_completed}.
- Phân bố: ${student.level_counts.basic} cơ bản, ${student.level_counts.understanding} thông hiểu, ${student.level_counts.application} vận dụng, ${student.level_counts.challenge} thử thách.
- Điểm phát sinh từ ứng dụng thực tế: ${student.practical_application_points}.

### Giới hạn mô phỏng học sinh

${student.limitations.map((item) => `- ${item}`).join("\n")}

## Đánh giá theo vai trò giáo viên

- Cổng cấu trúc tự động: **${teacher.automated_structural_score}/5**. Đây không phải điểm chất lượng giảng dạy thực tế.
${Object.entries(teacher.metrics).map(([key, value]) => `- ${key}: ${(value * 100).toFixed(0)}%`).join("\n")}
- Nhận xét nội dung: ${teacher.scientific_content_judgement_vi}

### Nhận xét từng bài

${teacher.lesson_notes.map((item) => `- **${item.title_vi}:** ${item.note_vi}`).join("\n")}

### Giới hạn cần nói rõ

${teacher.limitations.map((item) => `- ${item}`).join("\n")}

### Khuyến nghị

${teacher.recommendation}
`;
await writeFile(path.join(REPORT_DIR, "teacher-and-student-review.md"), markdown, "utf8");

console.log(`Student simulation: ${student.passed ? "PASS" : "FAIL"} (${student.questions_completed} câu)`);
console.log(`Teacher-role structural audit: ${teacher.automated_structural_score}/5 (không phải nghiệm thu giáo viên thật)`);
if (!student.passed) process.exitCode = 1;
