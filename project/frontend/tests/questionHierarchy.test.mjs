import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const shared = read("../src/features/skills-common/SkillsSection.tsx");
const styles = read("../src/styles.css");
const math1 = read("../src/features/math6/MathLesson1.tsx");
const structuredMath = read("../src/features/math6/StructuredMathLesson.tsx");
const informatics = read("../src/features/informatics6/InformaticsLesson.tsx");
const vietnamese = read("../src/features/vietnamese6/VietnameseLesson.tsx");
const science = read("../src/features/science6/ScienceLesson.tsx");

test("shared question block separates the primary task from secondary guidance", () => {
  assert.match(shared, /questionEmphasis\?: "context" \| "prompt"/);
  assert.match(shared, /skills-prompt--context-primary[\s\S]*skills-primary-question[\s\S]*skills-secondary-guidance/);
  assert.match(shared, /skills-prompt--prompt-primary[\s\S]*skills-question-context[\s\S]*skills-primary-question/);
  assert.equal((shared.match(/<QuestionBlock item=\{item\} emphasis=\{questionEmphasis\}\/>/g) ?? []).length, 2);
});

test("all five subjects select the correct information hierarchy", () => {
  assert.match(science, /questionEmphasis="context"/);
  assert.match(math1, /questionEmphasis="prompt"/);
  assert.match(structuredMath, /questionEmphasis="prompt"/);
  assert.match(informatics, /questionEmphasis="prompt"/);
  assert.match(vietnamese, /questionEmphasis="prompt"/);
  assert.match(shared, /props\.questionEmphasis\?\?"context"/);
});

test("primary text is visually stronger than guidance", () => {
  assert.match(styles, /skills-primary-question[^}]*font-size:[^;]*1\.65rem[^}]*font-weight: 900/);
  assert.match(styles, /skills-secondary-guidance[^}]*font-size:[^;]*\.98rem[^}]*font-weight: 400/);
});
