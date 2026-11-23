import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildGeneratedMathBranch, MATH_SEMESTER_1_GENERATED_BRANCHES } from "../src/features/math6/mathSemester1Curriculum.ts";

for (const spec of MATH_SEMESTER_1_GENERATED_BRANCHES) {
  test(`${spec.id} builds and passes its independent six-game gate`, () => {
    const lesson = buildGeneratedMathBranch(spec);
    assert.equal(lesson.branch_id, spec.id);
    assert.equal(lesson.meta.length, 6);
    assert.deepEqual(Object.keys(lesson.rounds), ["concept", "apply", "reason", "error", "mixed", "challenge"]);
    for (const [gameId, rounds] of Object.entries(lesson.rounds)) {
      assert.equal(rounds.length, 10, `${spec.id}/${gameId}`);
      assert.equal(new Set(rounds.map((round) => round.id)).size, 10);
      for (const round of rounds) {
        assert.equal(round.options.length, 4);
        assert.equal(new Set(round.options).size, 4);
        assert.ok(round.options.includes(round.answer));
        assert.ok(round.explanation_vi.trim());
      }
    }
  });
}

test("Math 6 semester 1 registers all 38 branches in catalog, renderer and score plan", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.equal(math.branch_ids.length, 38);
  assert.equal(new Set(math.branch_ids).size, 38);
  for (const spec of MATH_SEMESTER_1_GENERATED_BRANCHES) {
    assert.ok(math.branch_ids.includes(spec.id), spec.id);
    assert.ok(registry.includes(`"${spec.id}"`), spec.id);
    assert.ok(db.includes(`"${spec.id}"`), spec.id);
  }
  assert.ok(app.includes("MATH_SEMESTER_1_GENERATED_BRANCHES.map"));
  assert.ok(app.includes("<MathGeneratedBranch branchId={courseBranch} />"));
  assert.equal(math.branch_ids.at(-1), "math6-s1-activity-calculator");
});

test("Math 6 semester 1 covers the five chapters, Lessons 1–22 and three experiences", () => {
  const generatedIds = new Set(MATH_SEMESTER_1_GENERATED_BRANCHES.map((item) => item.id));
  for (let lesson = 6; lesson <= 22; lesson += 1) assert.ok(generatedIds.has(`math6-s1-lesson${lesson}`));
  assert.deepEqual(MATH_SEMESTER_1_GENERATED_BRANCHES.filter((item) => item.id.includes("activity-")).map((item) => item.id), [
    "math6-s1-activity-card-room", "math6-s1-activity-geogebra", "math6-s1-activity-calculator",
  ]);
  assert.deepEqual(new Set(MATH_SEMESTER_1_GENERATED_BRANCHES.map((item) => item.chapter.split(" · ")[0])), new Set([
    "Chương I", "Chương II", "Chương III", "Chương IV", "Chương V", "Hoạt động thực hành trải nghiệm",
  ]));
});
