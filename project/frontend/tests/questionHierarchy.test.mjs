import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const shared=read("../src/features/skills-common/SkillsSection.tsx");
const styles=read("../src/styles.css");
test("English question panel shows main task and a secondary hint",()=>{
  assert.match(shared,/questionEmphasis\?: "context" \| "prompt"/);
  assert.match(shared,/skills-prompt--context-primary[\s\S]*skills-primary-question[\s\S]*skills-secondary-guidance/);
  assert.match(shared,/props\.questionEmphasis\?\?"context"/);
});
test("main question is visually stronger than the explanation",()=>{
  assert.match(styles,/skills-primary-question[^}]*font-size:[^;]*1\.65rem[^}]*font-weight: 900/);
  assert.match(styles,/skills-secondary-guidance[^}]*font-size:[^;]*\.98rem[^}]*font-weight: 400/);
});
