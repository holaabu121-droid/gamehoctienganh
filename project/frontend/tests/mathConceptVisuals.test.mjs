import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const visuals = readFileSync(new URL("../src/features/math6/MathConceptVisuals.tsx", import.meta.url), "utf8");
const lesson = readFileSync(new URL("../src/features/math6/StructuredMathLesson.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const skills = readFileSync(new URL("../src/features/skills-common/SkillsSection.tsx", import.meta.url), "utf8");

test("Lesson 6 contains three accessible exponent diagrams", () => {
  for (const id of ["exponent-anatomy", "exponent-product", "exponent-rule"]) assert.ok(visuals.includes(id));
  assert.ok(visuals.includes("Cơ số và số mũ"));
  assert.ok(visuals.includes("Số mũ là số lần lặp"));
  assert.ok(visuals.includes("Nhân cùng cơ số"));
  assert.ok((visuals.match(/role="img"/g) ?? []).length >= 6);
});

test("Lesson 23 contains equivalence, number-line and simplification diagrams", () => {
  for (const id of ["fraction-equivalent", "fraction-number-line", "fraction-simplify"]) assert.ok(visuals.includes(id));
  assert.ok(visuals.includes("2/3 = 8/12"));
  assert.ok(visuals.includes("−3/4"));
  assert.ok(visuals.includes("−18 ÷ 6 = −3"));
  assert.ok((visuals.match(/<title id=/g) ?? []).length >= 6);
  assert.ok((visuals.match(/<desc id=/g) ?? []).length >= 6);
});

test("visual gallery keeps three bespoke pilots and routes every other lesson to its own model", () => {
  assert.match(lesson, /<MathConceptVisuals key=\{lesson\.lesson_id\} lessonId=\{lesson\.lesson_id\}/);
  assert.match(visuals, /lessonId === "math6-s1-lesson6"/);
  assert.match(visuals, /lessonId === "math6-s2-lesson23"/);
  assert.match(visuals, /lessonId === "math6-s2-lesson40"/);
  assert.match(visuals, /<MathLessonVisualLab lessonId=\{lessonId\}/);
  assert.ok((visuals.match(/type="range"/g) ?? []).length >= 6);
  assert.match(visuals, /Phòng thí nghiệm dữ liệu/);
  assert.match(visuals, /interactive-bar-chart/);
  assert.match(styles, /\.math-visual-grid \{ display: grid/);
  assert.match(styles, /\.math-interactive-lab/);
  assert.match(styles, /\.lesson-math-model/);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.math-visual-grid \{ grid-template-columns: 1fr; \}/);
});

test("Math visuals are embedded in the rules foundation card", () => {
  assert.doesNotMatch(lesson, /<MathConceptVisuals[\s\S]*?\/>\s*<SkillsSection/);
  assert.match(lesson, /foundationVisual=\{<MathConceptVisuals/);
  assert.match(lesson, /foundationVisualIndex=\{1\}/);
  assert.match(skills, /blockIndex === visualIndex/);
  assert.match(styles, /\.foundation-visual-slot/);
});

