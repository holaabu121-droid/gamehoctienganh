import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { buildGeneratedMathBranch, MATH_SEMESTER_1_GENERATED_BRANCHES } from "../src/features/math6/mathSemester1Curriculum.ts";
import { buildMathSemester2Branch, MATH_SEMESTER_2_GENERATED_BRANCHES } from "../src/features/math6/mathSemester2Curriculum.ts";

const EXPECTED_GAMES = ["concept", "apply", "reason", "error", "mixed", "challenge"];
const COMPETENCY_MARKERS = {
  concept: /nhận diện|nhận biết|kiến thức nền/i,
  apply: /thực hiện|quy trình|tính/i,
  reason: /vì sao|lập luận|căn cứ|giải thích|lí do/i,
  error: /sai|sửa lỗi|cách sửa/i,
  mixed: /nhiệm vụ 1|tổng hợp|kết quả 1/i,
  challenge: /tình huống|vận dụng|quyết định|phương án hoàn chỉnh/i,
};

const generatedBranches = [
  ...MATH_SEMESTER_1_GENERATED_BRANCHES.map((spec) => buildGeneratedMathBranch(spec)),
  ...MATH_SEMESTER_2_GENERATED_BRANCHES.map((spec) => buildMathSemester2Branch(spec)),
];

test("all 67 generated Math branches contain 60 genuinely distinct tasks", () => {
  assert.equal(generatedBranches.length, 67);
  for (const lesson of generatedBranches) {
    assert.deepEqual(Object.keys(lesson.rounds), EXPECTED_GAMES, lesson.branch_id);
    const rounds = Object.values(lesson.rounds).flat();
    assert.equal(rounds.length, 60, lesson.branch_id);
    assert.equal(new Set(rounds.map((item) => item.prompt.trim())).size, 60, `${lesson.branch_id} repeats a prompt`);
    assert.equal(new Set(rounds.map((item) => `${item.context}|${item.prompt}|${item.answer}`)).size, 60, `${lesson.branch_id} repeats a task`);
  }
});

test("six generated games assess six explicit and different competencies", () => {
  for (const lesson of generatedBranches) {
    assert.equal(new Set(lesson.meta.map((item) => item.description)).size, 6, lesson.branch_id);
    lesson.meta.forEach((item, index) => assert.match(item.description, new RegExp(`Năng lực ${index + 1}`), `${lesson.branch_id}/${item.id}`));
    for (const gameId of EXPECTED_GAMES) {
      const rounds = lesson.rounds[gameId];
      assert.equal(rounds.length, 10, `${lesson.branch_id}/${gameId}`);
      assert.equal(new Set(rounds.map((item) => item.prompt)).size, 10, `${lesson.branch_id}/${gameId}`);
      assert.ok(rounds.every((item) => COMPETENCY_MARKERS[gameId].test(`${item.context} ${item.prompt} ${item.prompt_vi}`)), `${lesson.branch_id}/${gameId} does not express its competency`);
      assert.ok(rounds.every((item) => item.options.length === 4 && new Set(item.options).size === 4 && item.options.includes(item.answer)), `${lesson.branch_id}/${gameId} has invalid options`);
    }
  }
});

test("seven handcrafted Math branches retain 40–60 distinct, contextualised tasks", () => {
  const lessonDirectory = new URL("../../data/lessons/", import.meta.url);
  const files = readdirSync(lessonDirectory).filter((name) => /^math6_s1_(lesson[1-5]|chapter1_(practice|review))\.json$/.test(name));
  assert.equal(files.length, 7);
  for (const file of files) {
    const source = JSON.parse(readFileSync(new URL(file, lessonDirectory), "utf8"));
    const banks = Object.values(source.games);
    assert.equal(banks.length, 6, file);
    assert.ok(banks.every((bank) => bank.length === 10), file);
    const tasks = banks.flat().map((item) => `${item.context ?? item.c ?? ""}|${item.prompt ?? item.q}|${item.answer ?? item.a}`);
    assert.ok(new Set(tasks).size >= 40 && new Set(tasks).size <= 60, `${file} lacks pedagogical variety`);
    assert.equal(new Set(banks.map((bank) => bank.map((item) => item.task_vi ?? item.t ?? item.prompt ?? item.q).join("|"))).size, 6, `${file} repeats an entire game bank`);
  }
});

test("structured Math header derives the correct semester from the course", () => {
  const component = readFileSync(new URL("../src/features/math6/StructuredMathLesson.tsx", import.meta.url), "utf8");
  assert.match(component, /lesson\.course_id === "math-6-semester-2"/);
  assert.match(component, /Toán 6 · \{semesterLabel\}/);
});

test("choice games can diagnose the specific wrong option selected by a learner", () => {
  const component = readFileSync(new URL("../src/features/skills-common/SkillsSection.tsx", import.meta.url), "utf8");
  assert.match(component, /item\.wrong_feedback\?\.\[option\]/);
});
