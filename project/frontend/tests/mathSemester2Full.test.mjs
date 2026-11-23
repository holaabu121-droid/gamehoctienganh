import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildMathSemester2Branch, MATH_SEMESTER_2_GENERATED_BRANCHES } from "../src/features/math6/mathSemester2Curriculum.ts";

for (const spec of MATH_SEMESTER_2_GENERATED_BRANCHES) {
  test(`${spec.id} builds and passes its independent six-game gate`, () => {
    const lesson = buildMathSemester2Branch(spec);
    assert.equal(lesson.course_id, "math-6-semester-2");
    assert.equal(lesson.branch_id, spec.id);
    assert.equal(lesson.meta.length, 6);
    assert.deepEqual(Object.keys(lesson.rounds), ["concept", "apply", "reason", "error", "mixed", "challenge"]);
    for (const [gameId, rounds] of Object.entries(lesson.rounds)) {
      assert.equal(rounds.length, 10, `${spec.id}/${gameId}`);
      assert.equal(new Set(rounds.map((round) => round.id)).size, 10);
      for (const round of rounds) {
        assert.equal(round.source_status, "ai-generated");
        assert.equal(round.options.length, 4);
        assert.equal(new Set(round.options).size, 4, `${spec.id}/${gameId}/${round.id}`);
        assert.ok(round.options.includes(round.answer));
        assert.ok(round.explanation_vi.trim());
      }
    }
  });
}

test("Math 6 semester 2 registers all 36 branches in catalog, renderer and score plan", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-2");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.equal(math.status, "available");
  assert.equal(math.branch_ids.length, 36);
  assert.equal(new Set(math.branch_ids).size, 36);
  assert.deepEqual(math.branch_ids, MATH_SEMESTER_2_GENERATED_BRANCHES.map((item) => item.id));
  for (const spec of MATH_SEMESTER_2_GENERATED_BRANCHES) {
    assert.ok(registry.includes(`"${spec.id}"`), spec.id);
    assert.ok(db.includes(`"${spec.id}"`), spec.id);
  }
  assert.ok(app.includes("MATH_SEMESTER_2_GENERATED_BRANCHES.map"));
  assert.ok(app.includes("<MathSemester2Branch branchId={courseBranch} />"));
});

test("Math 6 semester 2 covers Lessons 23–43, four chapters, three experiences and final review", () => {
  const ids = new Set(MATH_SEMESTER_2_GENERATED_BRANCHES.map((item) => item.id));
  for (let lesson = 23; lesson <= 43; lesson += 1) assert.ok(ids.has(`math6-s2-lesson${lesson}`));
  assert.deepEqual(MATH_SEMESTER_2_GENERATED_BRANCHES.filter((item) => item.id.includes("activity-")).map((item) => item.id), [
    "math6-s2-activity-budget", "math6-s2-activity-sports-survey", "math6-s2-activity-geogebra",
  ]);
  assert.ok(ids.has("math6-s2-final-review"));
  assert.deepEqual(new Set(MATH_SEMESTER_2_GENERATED_BRANCHES.map((item) => item.chapter)), new Set([
    "Chương VI · Phân số", "Chương VII · Số thập phân", "Chương VIII · Những hình hình học cơ bản",
    "Chương IX · Dữ liệu và xác suất thực nghiệm", "Hoạt động thực hành trải nghiệm", "Ôn tập cuối năm",
  ]));
});
