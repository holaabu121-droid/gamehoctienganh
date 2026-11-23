import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  presentationTemplates,
  templatesForLesson,
} from "../data/science6_pilot/source/science6PresentationTemplates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const baselineLessons = [2, 8, 17, 21, 26, 42, 48, 53].map((number) => `science6-l${String(number).padStart(2, "0")}`);
const lessonArgIndex = process.argv.indexOf("--lesson");
const requestedLesson = lessonArgIndex >= 0 ? process.argv[lessonArgIndex + 1] : null;
const expectedCompetencies = [
  "observe-identify",
  "classify-model",
  "measure-analyze",
  "predict-reason",
  "experiment-safety",
  "explain-apply",
];
const expectedLevels = [
  "basic", "basic", "basic",
  "understanding", "understanding", "understanding", "understanding",
  "application", "application", "challenge",
];

const errors = [];
const stats = {
  lessons: 0,
  competencies: 0,
  questions: 0,
  foundations: 0,
  diagnostic_feedback: 0,
  practical_scored: 0,
};
const validatedLessons = [];
const usedPresentationTemplates = new Set();

async function loadJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    errors.push(`Không đọc được ${file}: ${error.message}`);
    return null;
  }
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

const manifest = await loadJson(path.join(PACK_DIR, "manifest.json"));
let expectedLessons = [];
if (manifest) {
  check(manifest.pack_id === "science6-pilot", "Manifest sai pack_id");
  const expectedStatus = manifest.completed_lesson_count === 55 ? "integrated" : "standalone-development";
  check(manifest.status === expectedStatus, `Manifest phải ở trạng thái ${expectedStatus}`);
  check(manifest.integration?.catalog_registered === true, "Gói hoàn chỉnh phải được đăng ký catalog");
  check(manifest.integration?.renderer_registered === true, "Gói hoàn chỉnh phải được đăng ký renderer");
  check(manifest.integration?.activity_plan_registered === true, "Gói hoàn chỉnh phải được đăng ký activity plan");
  check(manifest.scoring?.practical_application_scored === false, "Ứng dụng thực tế không được chấm điểm");
  check(JSON.stringify(manifest.level_sequence) === JSON.stringify(expectedLevels), "Manifest sai lộ trình 3-4-2-1");
  check(manifest.content_version === "1.1.0", "Manifest hoàn chỉnh phải ở content_version 1.1.0");
  check(manifest.presentation_templates?.length === 18, "Manifest phải đăng ký đủ 18 khuôn biểu diễn");
  check(new Set(manifest.presentation_templates?.map((item) => item.id)).size === 18, "ID 18 khuôn biểu diễn phải duy nhất");
  check(manifest.presentation_policy?.templates_per_lesson === 6, "Mỗi bài phải chọn sáu khuôn biểu diễn");
  check(manifest.presentation_policy?.grounding === "reviewed-foundation-only-no-external-claim", "Thiếu chính sách chống khẳng định không có căn cứ");
  const ids = manifest.lessons?.map((lesson) => lesson.lesson_id) ?? [];
  const numbers = manifest.lessons?.map((lesson) => lesson.lesson_number) ?? [];
  check(numbers.every((number, index) => index === 0 || number > numbers[index - 1]), "Manifest phải liệt kê các bài theo thứ tự tăng dần");
  check(baselineLessons.every((id) => ids.includes(id)), "Manifest phải giữ đủ 8 bài thí điểm đã đạt");
  check(manifest.completed_lesson_count === ids.length, "Manifest sai số bài đã hoàn thành");
  if (requestedLesson) {
    check(ids.includes(requestedLesson), `Manifest chưa có bài được yêu cầu: ${requestedLesson}`);
    expectedLessons = ids.includes(requestedLesson) ? [requestedLesson] : [];
  } else {
    expectedLessons = ids;
  }
}

const catalog = await loadJson(path.join(ROOT, "data", "curriculum", "catalog.json"));
if (catalog) {
  const semester1 = catalog.courses.find((course) => course.id === "science-6-semester-1");
  const semester2 = catalog.courses.find((course) => course.id === "science-6-semester-2");
  check(semester1?.status === "available" && semester1.branch_ids?.length === 28, "Catalog phải mở 28 bài Khoa học tự nhiên học kỳ 1");
  check(semester2?.status === "available" && semester2.branch_ids?.length === 27, "Catalog phải mở 27 bài Khoa học tự nhiên học kỳ 2");
  check([...(semester1?.branch_ids ?? []), ...(semester2?.branch_ids ?? [])].length === 55, "Catalog phải đăng ký đủ 55 bài Khoa học tự nhiên");
}

const allQuestionIds = new Set();
for (const lessonId of expectedLessons) {
  const lesson = await loadJson(path.join(PACK_DIR, "lessons", `${lessonId}.json`));
  if (!lesson) continue;
  validatedLessons.push(lesson);
  stats.lessons += 1;
  check(lesson.lesson_id === lessonId && lesson.branch_id === lessonId, `${lessonId}: ID bài/nhánh không ổn định`);
  check(lesson.pack_id === "science6-pilot" && lesson.course_id === "science-6-pilot", `${lessonId}: sai phạm vi gói`);
  check(lesson.usage_scope === "personal-family", `${lessonId}: sai usage_scope`);
  check(lesson.source_status === "user-provided-reference", `${lessonId}: thiếu provenance nguồn`);
  check(lesson.provenance?.source_file === "tài liệu/SGK KHTN 6 KNTT.pdf", `${lessonId}: sai nguồn PDF`);
  check(lesson.provenance?.derivative_items_status === "ai-generated", `${lessonId}: câu dẫn xuất phải gắn nhãn AI`);
  check(Array.isArray(lesson.objectives) && lesson.objectives.length >= 5, `${lessonId}: cần ít nhất 5 mục tiêu`);

  const foundationCards = (lesson.foundations ?? []).flatMap((stage) => stage.cards ?? []);
  stats.foundations += foundationCards.length;
  check(lesson.foundations?.length === 5, `${lessonId}: phải có 5 chặng bài giảng`);
  check(foundationCards.length === 10, `${lessonId}: phải có 10 thẻ kiến thức`);
  check(new Set(foundationCards.map((card) => card.id)).size === 10, `${lessonId}: ID thẻ kiến thức bị trùng`);
  check(new Set(foundationCards.map((card) => card.teaching_vi)).size === 10, `${lessonId}: nội dung thẻ kiến thức bị lặp`);

  check(lesson.simulation?.implementation_status === "specification-only", `${lessonId}: mô phỏng phải ghi rõ mới là đặc tả`);
  check(lesson.simulation?.scored === false, `${lessonId}: mô phỏng không được chấm điểm`);
  const practical = lesson.practical_application;
  check(practical?.scored === false, `${lessonId}: ứng dụng thực tế không được chấm điểm`);
  if (practical?.scored) stats.practical_scored += 1;
  check(["adult", "teacher"].includes(practical?.supervision), `${lessonId}: hoạt động phải nêu phụ huynh hoặc giáo viên giám sát`);
  check(practical?.warning_vi?.includes("cho phép") && (practical.warning_vi.includes("giáo viên") || practical.warning_vi.includes("phụ huynh")), `${lessonId}: cảnh báo phải yêu cầu cho phép/giám sát`);
  check(practical?.allowed_actions?.length >= 3 && practical?.prohibited_actions?.length >= 3, `${lessonId}: thiếu việc được phép hoặc bị cấm`);
  check(lesson.scoring_policy?.practical_application_points === 0, `${lessonId}: điểm ứng dụng thực tế phải bằng 0`);
  check(lesson.scoring_policy?.excluded_sections?.includes("practical_application"), `${lessonId}: ứng dụng thực tế phải bị loại khỏi điểm`);

  const competencyIds = lesson.competencies?.map((game) => game.id) ?? [];
  check(JSON.stringify(competencyIds) === JSON.stringify(expectedCompetencies), `${lessonId}: sai sáu năng lực`);
  const expectedTemplateIds = templatesForLesson(lesson.lesson_number).map((template) => template.id);
  const lessonTemplateIds = lesson.competencies?.map((game) => game.presentation_template?.id) ?? [];
  check(JSON.stringify(lessonTemplateIds) === JSON.stringify(expectedTemplateIds), `${lessonId}: sáu khuôn chưa đúng vòng luân phiên`);
  check(new Set(lessonTemplateIds).size === 6, `${lessonId}: phải dùng sáu khuôn khác nhau`);
  const lessonPrompts = new Set();
  for (const game of lesson.competencies ?? []) {
    stats.competencies += 1;
    check(game.scored === true, `${lessonId}/${game.id}: game phải chấm điểm`);
    check(game.rounds?.length === 10, `${lessonId}/${game.id}: phải có 10 câu`);
    check(JSON.stringify(game.rounds?.map((round) => round.level)) === JSON.stringify(expectedLevels), `${lessonId}/${game.id}: sai lộ trình 3-4-2-1`);
    check(new Set(game.rounds?.map((round) => round.context_vi)).size === 10, `${lessonId}/${game.id}: phải có 10 tình huống khác nhau`);
    check(new Set(game.rounds?.map((round) => round.representation?.id)).size === 10, `${lessonId}/${game.id}: phải có 10 payload biểu diễn khác nhau`);
    check(presentationTemplates.some((template) => template.id === game.presentation_template?.id), `${lessonId}/${game.id}: khuôn game không nằm trong ngân hàng 18 khuôn`);
    usedPresentationTemplates.add(game.presentation_template?.id);
    for (const round of game.rounds ?? []) {
      stats.questions += 1;
      check(!allQuestionIds.has(round.id), `${round.id}: ID câu hỏi bị trùng`);
      allQuestionIds.add(round.id);
      check(!lessonPrompts.has(round.prompt_vi), `${lessonId}: câu hỏi bị trùng nguyên văn`);
      lessonPrompts.add(round.prompt_vi);
      check(round.source_status === "ai-generated", `${round.id}: thiếu nhãn AI`);
      check(Boolean(round.representation?.type && round.representation?.title_vi && round.representation?.focus_vi), `${round.id}: biểu diễn phải có payload thật`);
      check(round.representation?.type === game.presentation_template?.id, `${round.id}: payload không khớp khuôn của game`);
      check(round.representation?.evidence_policy?.includes("không tự sinh số liệu"), `${round.id}: khuôn thiếu chính sách không tự sinh dữ liệu`);
      const card = foundationCards.find((entry) => entry.id === round.concept_card_id);
      const grounding = round.grounding;
      check(grounding?.policy === "reviewed-foundation-only-no-external-claim", `${round.id}: thiếu chính sách căn cứ`);
      check(grounding?.foundation_card_id === round.concept_card_id, `${round.id}: căn cứ không trỏ đúng thẻ`);
      check(grounding?.source_file === lesson.provenance.source_file && grounding?.printed_pages === lesson.provenance.printed_pages, `${round.id}: căn cứ sai nguồn hoặc trang`);
      check(Array.isArray(grounding?.unsupported_external_claims) && grounding.unsupported_external_claims.length === 0, `${round.id}: có khẳng định ngoài nguồn chưa được xác minh`);
      check(grounding?.supported_material?.concept_vi === card?.title_vi, `${round.id}: khái niệm căn cứ không khớp thẻ`);
      check(grounding?.supported_material?.fact_vi === card?.teaching_vi, `${round.id}: sự kiện căn cứ không khớp thẻ`);
      check(grounding?.supported_material?.reason_vi === card?.why_vi, `${round.id}: lí do căn cứ không khớp thẻ`);
      check(card?.worked_example_vi?.includes(grounding?.supported_material?.procedure_vi), `${round.id}: quy trình không có trong thẻ`);
      check(card?.worked_example_vi?.includes(grounding?.supported_material?.outcome_vi), `${round.id}: kết quả không có trong thẻ`);
      const supportedValues = Object.values(grounding?.supported_material ?? {}).filter(Boolean).map((value) => value.toLocaleLowerCase("vi"));
      check(supportedValues.some((value) => round.answer.toLocaleLowerCase("vi").includes(value)), `${round.id}: đáp án đúng không chứa vật liệu đã được duyệt`);
      check(round.explanation_vi.includes(grounding?.supported_material?.fact_vi) && round.explanation_vi.includes(grounding?.supported_material?.reason_vi) && round.explanation_vi.includes(grounding?.supported_material?.outcome_vi), `${round.id}: lời giải không bám đủ sự kiện-căn cứ-kết quả`);
      const expectedSteps = { basic: 1, understanding: 2, application: 3, challenge: 4 }[round.level];
      check(round.difficulty_evidence?.required_actions?.length === expectedSteps, `${round.id}: mức độ khó chưa có đủ thao tác tư duy bắt buộc`);
      if (round.level === "challenge") check(round.prompt_vi.startsWith("Đánh giá"), `${round.id}: câu thử thách phải yêu cầu đánh giá`);
      if (round.level === "application") check(round.prompt_vi.startsWith("Vận dụng"), `${round.id}: câu vận dụng phải nêu tình huống chuyển giao`);
      if (round.level === "challenge") check(round.answer.includes("(1)") && round.answer.includes("(2)") && round.answer.includes("(3)") && round.answer.includes("(4)"), `${round.id}: đáp án thử thách phải thể hiện đủ bốn bước`);
      if (round.representation?.type === "classification-grid") check(Boolean(round.representation?.criterion_vi && round.representation?.target_group_vi && round.representation?.rule_vi), `${round.id}: lưới phân loại phải có tiêu chí, nhóm và quy tắc khoa học`);
      check(round.options?.length === 4 && new Set(round.options).size === 4, `${round.id}: cần 4 lựa chọn khác nhau`);
      check(round.options?.includes(round.answer), `${round.id}: đáp án không nằm trong lựa chọn`);
      const wrongOptions = round.options?.filter((option) => option !== round.answer) ?? [];
      check(Object.keys(round.wrong_feedback ?? {}).length === 3, `${round.id}: cần phản hồi cho 3 đáp án sai`);
      check(new Set(wrongOptions.map((wrong) => round.wrong_feedback?.[wrong]?.diagnostic_tag)).size === 3, `${round.id}: ba phương án sai phải thuộc ba ngộ nhận khác nhau`);
      for (const wrong of wrongOptions) {
        const feedback = round.wrong_feedback?.[wrong];
        check(Boolean(feedback?.error_type_vi && feedback?.why_wrong_vi && feedback?.fix_vi && feedback?.review_card_id && feedback?.diagnostic_tag), `${round.id}: phản hồi sai chưa đủ 5 trường cho “${wrong}”`);
        check(feedback?.option_status === "intentionally-incorrect-distractor", `${round.id}: phương án sai phải ghi rõ là nhiễu cố ý`);
        if (feedback) stats.diagnostic_feedback += 1;
      }
    }
  }
  check(lessonPrompts.size === 60, `${lessonId}: phải có 60 câu hỏi khác nhau`);
}

check(stats.lessons === expectedLessons.length, `Phải đọc đủ ${expectedLessons.length} bài`);
check(stats.competencies === expectedLessons.length * 6, `Phải có ${expectedLessons.length * 6} game năng lực`);
check(stats.questions === expectedLessons.length * 60, `Phải có ${expectedLessons.length * 60} câu hỏi`);
check(stats.foundations === expectedLessons.length * 10, `Phải có ${expectedLessons.length * 10} thẻ bài giảng`);
check(stats.diagnostic_feedback === expectedLessons.length * 180, `Phải có ${expectedLessons.length * 180} phản hồi chẩn đoán`);
check(stats.practical_scored === 0, "Không ứng dụng thực tế nào được chấm điểm");
if (!requestedLesson) {
  check(usedPresentationTemplates.size === 18, `Toàn gói phải sử dụng đủ 18 khuôn, hiện có ${usedPresentationTemplates.size}`);
} else {
  check(usedPresentationTemplates.size === 6, `${requestedLesson}: bài riêng phải sử dụng sáu khuôn, hiện có ${usedPresentationTemplates.size}`);
}

if (errors.length) {
  console.error(`Science 6 data gate${requestedLesson ? ` ${requestedLesson}` : ""}: FAIL (${errors.length} lỗi)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Science 6 data gate${requestedLesson ? ` ${requestedLesson}` : ""}: PASS`);
  console.log(JSON.stringify(stats));
  if (requestedLesson && validatedLessons.length === 1) {
    const lesson = validatedLessons[0];
    const reportDir = path.join(PACK_DIR, "reports", "lessons");
    const lessonJson = JSON.stringify(lesson);
    const report = {
      status: "PASS",
      gate: "science6-single-lesson-data-gate",
      lesson_id: lesson.lesson_id,
      lesson_number: lesson.lesson_number,
      title_vi: lesson.title_vi,
      source_file: lesson.provenance.source_file,
      printed_pages: lesson.provenance.printed_pages,
      output_sha256: createHash("sha256").update(lessonJson).digest("hex"),
      counts: { foundations: 10, competencies: 6, questions: 60, diagnostic_feedback: 180 },
      level_distribution: { basic: 18, understanding: 24, application: 12, challenge: 6 },
      practical_application_scored: false,
      simulation_scored: false,
      limitations: [
        "Đây là kiểm thử dữ liệu tự động, chưa phải kiểm thử giao diện hoặc quan sát học sinh thật.",
        "Nội dung cần giáo viên Khoa học tự nhiên duyệt lần cuối trước khi phát hành.",
      ],
    };
    await mkdir(reportDir, { recursive: true });
    await writeFile(path.join(reportDir, `${requestedLesson}.validation.json`), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
}

export { errors, stats };
