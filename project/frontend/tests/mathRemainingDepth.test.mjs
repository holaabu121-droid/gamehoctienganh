import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { MATH_LEVEL_SEQUENCE, MATH_REPRESENTATIONS, getMathTopicProfile } from "../src/features/math6/mathCurriculumDepth.ts";
import { buildGeneratedMathBranch, expandMathConcepts, MATH_SEMESTER_1_GENERATED_BRANCHES } from "../src/features/math6/mathSemester1Curriculum.ts";
import { buildMathSemester2Branch, MATH_SEMESTER_2_GENERATED_BRANCHES } from "../src/features/math6/mathSemester2Curriculum.ts";
import { validateMathLesson1 } from "../src/features/math6/mathLesson1Engine.ts";
import { validateStructuredMathLesson } from "../src/features/math6/structuredMathLessonEngine.ts";
import { validateStructuredMathReview } from "../src/features/math6/structuredMathReviewEngine.ts";
import { MATH_RULE_VISUALS, MATH_MAIN_RULE_VISUALS, MATH_COMPOSITE_RULE_VISUALS } from "../src/features/math6/mathRuleVisualRegistry.ts";

const pilotIds = new Set(["math6-s1-lesson6", "math6-s2-lesson23", "math6-s2-lesson40"]);
const generated = [
  ...MATH_SEMESTER_1_GENERATED_BRANCHES.map((spec) => ({ spec, lesson: buildGeneratedMathBranch(spec) })),
  ...MATH_SEMESTER_2_GENERATED_BRANCHES.map((spec) => ({ spec, lesson: buildMathSemester2Branch(spec) })),
];
const remainingGenerated = generated.filter(({ spec }) => !pilotIds.has(spec.id));
const data = (name) => JSON.parse(readFileSync(new URL(`../../data/lessons/${name}`, import.meta.url), "utf8"));

const manual = [
  validateMathLesson1(data("math6_s1_lesson1.json")),
  ...[2, 3, 4, 5].map((number) => validateStructuredMathLesson(data(`math6_s1_lesson${number}.json`), { lessonId: `math6-s1-lesson${number}`, lessonNumber: number, pageLabel: "trang kiểm thử" })),
  validateStructuredMathReview(data("math6_s1_chapter1_practice.json"), { reviewId: "math6-s1-chapter1-practice", sequence: 6, pageLabel: "trang kiểm thử" }),
  validateStructuredMathReview(data("math6_s1_chapter1_review.json"), { reviewId: "math6-s1-chapter1-review", sequence: 7, pageLabel: "trang kiểm thử" }),
];

const assertDeepRounds = (lesson) => {
  for (const rounds of Object.values(lesson.rounds)) {
    assert.equal(rounds.length, 10, lesson.branch_id);
    assert.deepEqual(rounds.map((item) => item.context.split(" · ")[0]), MATH_LEVEL_SEQUENCE, lesson.branch_id);
    assert.deepEqual(rounds.map((item) => item.context.split(" · ")[1]), MATH_REPRESENTATIONS, lesson.branch_id);
    for (const item of rounds) {
      const wrong = item.options.filter((option) => option !== item.answer);
      assert.equal(Object.keys(item.wrong_feedback ?? {}).length, 3, `${lesson.branch_id}/${item.id}`);
      for (const option of wrong) assert.match(item.wrong_feedback[option], /Lỗi:.*Vì sao sai:.*Cách sửa:.*Ôn lại thẻ/s, `${lesson.branch_id}/${item.id}/${option}`);
    }
  }
};

test("64 remaining generated lessons follow 3-4-2-1 and diagnose every wrong answer", () => {
  assert.equal(remainingGenerated.length, 64);
  remainingGenerated.forEach(({ lesson }) => assertDeepRounds(lesson));
});

test("remaining generated lessons have expanded teaching and five distinct learning stages", () => {
  for (const { spec, lesson } of remainingGenerated) {
    const seeds = expandMathConcepts(spec);
    assert.equal(seeds.length, 12, lesson.branch_id);
    assert.equal(new Set(seeds.map((item) => `${item.question}|${item.answer}`)).size, 12, `${lesson.branch_id} repeats a seed`);
    assert.equal(lesson.foundations.length, 5, lesson.branch_id);
    const cards = lesson.foundations.flatMap((block) => block.items.map((item) => typeof item === "string" ? item : item.text));
    assert.equal(cards.length, 10, lesson.branch_id);
    assert.equal(new Set(cards).size, 10, `${lesson.branch_id} repeats a teaching card`);
    assert.ok(lesson.gameIds.every((id) => lesson.help[id].steps.length === 3 && lesson.help[id].steps.join(" ").includes("Tự kiểm tra")), lesson.branch_id);
  }
});

test("seven handcrafted lessons now use the same six competencies and depth contract", () => {
  assert.equal(manual.length, 7);
  for (const lesson of manual) {
    assert.equal(lesson.foundations.length, 5, lesson.branch_id);
    assertDeepRounds(lesson);
    const manualGameIds = lesson.gameIds ?? Object.keys(lesson.rounds);
    const banks = manualGameIds.map((id) => lesson.rounds[id]);
    assert.ok(banks[2].every((round) => round.prompt.includes("Vì sao") && round.answer.startsWith("Đúng, vì")), `${lesson.branch_id} must assess reasoning`);
    assert.ok(banks[3].every((round) => round.prompt.includes("Cách sửa nào đúng") && round.answer.startsWith("Sai; sửa thành")), `${lesson.branch_id} must assess error correction`);
    assert.ok(banks[4].every((round) => round.prompt.includes("Giải đồng thời hai yêu cầu") && round.answer.includes("Kết quả A:") && round.answer.includes("kết quả B:")), `${lesson.branch_id} must assess synthesis`);
    assert.ok(banks[5].every((round) => round.prompt.includes("quyết định có căn cứ") && round.answer.startsWith("Chọn “") && round.answer.includes("vì")), `${lesson.branch_id} must assess application`);
    assert.ok(banks.slice(2).flat().every((round) => round.source_status === "ai-generated"), `${lesson.branch_id} transformed tasks need derived provenance`);
    if (lesson.meta) assert.deepEqual(lesson.meta.map((item) => item.title), ["Nhận biết khái niệm", "Thực hiện quy trình", "Lập luận – giải thích", "Phân tích – sửa sai", "Kết nối – tổng hợp", "Vận dụng – thử thách"]);
  }
  const lesson1 = readFileSync(new URL("../src/features/math6/MathLesson1.tsx", import.meta.url), "utf8");
  assert.match(lesson1, /deepenMathMeta/);
});

test("all 74 Math branches receive explicit rule visuals instead of keyword guesses", () => {
  const identities = generated.map(({ spec }) => ({ id: spec.id, title: spec.title, chapter: spec.chapter, lead: spec.lead }));
  for (const lesson of manual) identities.push({ id: lesson.branch_id, title: lesson.lesson.title, chapter: lesson.lesson.chapter, lead: lesson.lesson.lead ?? lesson.lesson.title });
  assert.equal(identities.length, 74);
  assert.deepEqual(identities.map((item) => item.id).sort(), Object.keys(MATH_RULE_VISUALS).sort());
  assert.equal(Object.keys(MATH_MAIN_RULE_VISUALS).length, 43);
  assert.equal(Object.keys(MATH_COMPOSITE_RULE_VISUALS).length, 31);
  assert.equal(new Set(Object.values(MATH_RULE_VISUALS).map((item) => item.visualKey)).size, 74);
  assert.ok(new Set(Object.values(MATH_MAIN_RULE_VISUALS).map((item) => item.kind)).size >= 35, "main lessons need distinct mathematical models");
  const visual = readFileSync(new URL("../src/features/math6/MathLessonVisualLab.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(visual, /Dữ kiện A|Dữ kiện B|getMathTopicProfile/);
  assert.match(visual, /data-visual-key=\{spec\.visualKey\}/);
  assert.match(visual, /data-lesson-visual=\{lessonId\}/);
});

test("formerly ambiguous lessons use their own mathematical process", () => {
  assert.equal(MATH_RULE_VISUALS["math6-s1-lesson3"].kind, "number-ray");
  assert.equal(MATH_RULE_VISUALS["math6-s1-lesson10"].kind, "prime-sieve");
  assert.equal(MATH_RULE_VISUALS["math6-s1-lesson15"].kind, "bracket-gate");
  assert.equal(MATH_RULE_VISUALS["math6-s1-lesson16"].kind, "sign-parity");
  assert.equal(MATH_RULE_VISUALS["math6-s1-lesson17"].kind, "integer-division");
});

test("ambiguous lesson names route to the mathematically correct visual strand", () => {
  const byId = Object.fromEntries(generated.map(({ spec }) => [spec.id, getMathTopicProfile({ id: spec.id, title: spec.title, chapter: spec.chapter, lead: spec.lead }).mode]));
  assert.equal(byId["math6-s1-lesson13"], "number-line");
  assert.equal(byId["math6-s1-chapter4-review"], "shape");
  assert.equal(byId["math6-s2-lesson28"], "decimal");
  assert.equal(byId["math6-s2-lesson43"], "probability");
  assert.equal(byId["math6-s2-final-review"], "applied");
});

