import assert from "node:assert/strict";
import test from "node:test";
import { buildGeneratedMathBranch, MATH_SEMESTER_1_GENERATED_BRANCHES } from "../src/features/math6/mathSemester1Curriculum.ts";
import { buildMathSemester2Branch, MATH_SEMESTER_2_GENERATED_BRANCHES } from "../src/features/math6/mathSemester2Curriculum.ts";
import { MATH_PILOT_CONFIGS } from "../src/features/math6/mathPilotDepth.ts";
import { MATH_PILOT_TASK_BANKS, PILOT_LEVEL_SEQUENCE } from "../src/features/math6/mathPilotTaskBanks.ts";

const pilotIds = ["math6-s1-lesson6", "math6-s2-lesson23", "math6-s2-lesson40"];
const levels = ["Cơ bản", "Thông hiểu", "Vận dụng"];

const builtPilots = pilotIds.map((id) => {
  const semester1 = MATH_SEMESTER_1_GENERATED_BRANCHES.find((item) => item.id === id);
  const semester2 = MATH_SEMESTER_2_GENERATED_BRANCHES.find((item) => item.id === id);
  return semester1 ? buildGeneratedMathBranch(semester1) : buildMathSemester2Branch(semester2);
});

test("pilot registry contains exactly Lessons 6, 23 and 40", () => {
  assert.deepEqual(Object.keys(MATH_PILOT_CONFIGS), pilotIds);
});

for (const lesson of builtPilots) {
  test(`${lesson.branch_id} has a ten-card teaching sequence and twelve original seeds`, () => {
    const config = MATH_PILOT_CONFIGS[lesson.branch_id];
    const foundationItems = lesson.foundations.flatMap((block) => block.items);
    assert.equal(lesson.foundations.length, 5);
    assert.equal(foundationItems.length, 10);
    assert.equal(new Set(foundationItems.map((item) => item.text)).size, 10);
    assert.equal(config.concepts.length, 12);
    assert.equal(new Set(config.concepts.map((item) => item.question)).size, 12);
    assert.equal(lesson.lesson.objectives.length, 5);
    for (const level of levels) assert.equal(config.concepts.filter((item) => item.difficulty === level).length, 4, `${lesson.branch_id}/${level}`);
  });

  test(`${lesson.branch_id} keeps six competencies, difficulty progression and diagnostic feedback`, () => {
    const rounds = Object.values(lesson.rounds).flat();
    assert.equal(rounds.length, 60);
    assert.equal(new Set(rounds.map((item) => item.prompt)).size, 60);
    for (const gameRounds of Object.values(lesson.rounds)) {
      assert.equal(gameRounds.length, 10);
      assert.deepEqual(gameRounds.map((item) => item.context.split(" · ")[0]), PILOT_LEVEL_SEQUENCE, `${lesson.branch_id} must follow 3-4-2-1`);
      assert.equal(new Set(gameRounds.map((item) => item.context.split(" · ")[1])).size, 10, `${lesson.branch_id} needs ten representations per game`);
    }
    for (const item of rounds) {
      const wrongOptions = item.options.filter((option) => option !== item.answer);
      assert.equal(wrongOptions.length, 3);
      assert.ok(item.wrong_feedback);
      assert.ok(wrongOptions.every((option) => item.wrong_feedback[option]?.length >= 10), `${lesson.branch_id}/${item.id}`);
      assert.ok(wrongOptions.every((option) => /Lỗi:/.test(item.wrong_feedback[option]) && /Vì sao sai:/.test(item.wrong_feedback[option]) && /Cách sửa:/.test(item.wrong_feedback[option]) && /Ôn lại/.test(item.wrong_feedback[option])), `${lesson.branch_id}/${item.id} lacks four-part diagnosis`);
    }
    assert.equal(new Set(Object.values(lesson.help).map((help) => help.teaching_vi)).size, 6);
    assert.ok(Object.values(lesson.help).every((help) => help.steps.length === 3));
    const bank = MATH_PILOT_TASK_BANKS[lesson.branch_id];
    const bankTasks = Object.values(bank).flat();
    assert.equal(new Set(bankTasks.map((item) => `${item.context}|${item.answer}`)).size, 60);
    assert.ok(Object.values(bank).every((items) => new Set(items.map((item) => item.representation)).size === 10));
  });
}

