import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildGeneratedMathBranch, MATH_SEMESTER_1_GENERATED_BRANCHES } from "../src/features/math6/mathSemester1Curriculum.ts";
import { buildMathSemester2Branch, MATH_SEMESTER_2_GENERATED_BRANCHES } from "../src/features/math6/mathSemester2Curriculum.ts";
import { MATH_PILOT_TASK_BANKS, PILOT_GAME_IDS, PILOT_LEVEL_SEQUENCE } from "../src/features/math6/mathPilotTaskBanks.ts";

const pilotIds = ["math6-s1-lesson6", "math6-s2-lesson23", "math6-s2-lesson40"];
const lessons = pilotIds.map((id) => {
  const semester1 = MATH_SEMESTER_1_GENERATED_BRANCHES.find((item) => item.id === id);
  const semester2 = MATH_SEMESTER_2_GENERATED_BRANCHES.find((item) => item.id === id);
  return semester1 ? buildGeneratedMathBranch(semester1) : buildMathSemester2Branch(semester2);
});

test("1. every wrong option has a four-part diagnosis", () => {
  for (const lesson of lessons) for (const item of Object.values(lesson.rounds).flat()) {
    for (const option of item.options.filter((value) => value !== item.answer)) {
      assert.match(item.wrong_feedback?.[option] ?? "", /Lỗi:[\s\S]*Vì sao sai:[\s\S]*Cách sửa:[\s\S]*Ôn lại/, `${lesson.branch_id}/${item.id}/${option}`);
    }
  }
});

test("2. teaching cards and thinking guides are deep and topic-specific", () => {
  const markers = {
    "math6-s1-lesson6": /cơ số|số mũ|lũy thừa/i,
    "math6-s2-lesson23": /tử|mẫu|phân số|tích chéo/i,
    "math6-s2-lesson40": /biểu đồ|cột|trục|dữ liệu/i,
  };
  for (const lesson of lessons) {
    const cards = lesson.foundations.flatMap((block) => block.items);
    assert.equal(cards.length, 10);
    assert.equal(new Set(cards.map((item) => item.text)).size, 10);
    const help = Object.values(lesson.help);
    assert.equal(new Set(help.map((item) => item.teaching_vi)).size, 6);
    assert.ok(help.every((item) => item.steps.length === 3));
    assert.ok(help.every((item) => markers[lesson.branch_id].test(`${item.teaching_vi} ${item.steps.join(" ")}`)));
  }
});

test("3. every game follows 3 basic, 4 understanding, 2 application and 1 challenge", () => {
  for (const lesson of lessons) for (const rounds of Object.values(lesson.rounds)) {
    assert.deepEqual(rounds.map((item) => item.context.split(" · ")[0]), PILOT_LEVEL_SEQUENCE);
  }
});

test("4. each lesson has 60 different contexts and ten representations per game", () => {
  for (const id of pilotIds) {
    const bank = MATH_PILOT_TASK_BANKS[id];
    const tasks = Object.values(bank).flat();
    assert.equal(new Set(tasks.map((item) => `${item.context}|${item.answer}`)).size, 60);
    assert.ok(tasks.every((item) => new Set([item.answer, ...item.distractors]).size === 4));
    for (const gameId of PILOT_GAME_IDS) {
      assert.equal(new Set(bank[gameId].map((item) => item.context)).size, 10);
      assert.equal(new Set(bank[gameId].map((item) => item.representation)).size, 10);
    }
  }
});

test("5. all three lessons use the same six competency model", () => {
  const markers = [/nhận diện/i, /thực hiện/i, /lập luận/i, /sửa lỗi/i, /tổng hợp/i, /vận dụng/i];
  for (const lesson of lessons) {
    assert.deepEqual(Object.keys(lesson.rounds), PILOT_GAME_IDS);
    PILOT_GAME_IDS.forEach((gameId, index) => assert.ok(lesson.rounds[gameId].every((item) => markers[index].test(item.prompt))));
  }
});

test("6. exponent, fraction and chart strands expose interactive controls", () => {
  const source = readFileSync(new URL("../src/features/math6/MathConceptVisuals.tsx", import.meta.url), "utf8");
  assert.match(source, /setBase/);
  assert.match(source, /setDenominator/);
  assert.match(source, /setValues/);
  assert.match(source, /math6-s1-lesson6/);
  assert.match(source, /math6-s2-lesson23/);
  assert.match(source, /math6-s2-lesson40/);
  assert.ok((source.match(/type="range"/g) ?? []).length >= 6);
});
