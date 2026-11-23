import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateProjectData } from "../src/features/project/projectEngine.ts";
import { validateUnit1Phase2 } from "../src/features/unit1/unit1Phase2Engine.ts";
import { validateUnit2Phase2 } from "../src/features/unit2/unit2Phase2Engine.ts";
import { validateUnit4Phase2 } from "../src/features/unit4/unit4Phase2Engine.ts";
import { validateUnit5Phase2 } from "../src/features/unit5/unit5Phase2Engine.ts";
import { validateUnit6Phase2 } from "../src/features/unit6/unit6Phase2Engine.ts";

const lesson = (name) => JSON.parse(readFileSync(new URL(`../../data/lessons/${name}`, import.meta.url), "utf8"));

const phaseProjects = [
  [1, validateUnit1Phase2, lesson("unit1_phase2.json")],
  [2, validateUnit2Phase2, lesson("unit2_phase2.json")],
  [4, validateUnit4Phase2, lesson("unit4_phase2.json")],
  [5, validateUnit5Phase2, lesson("unit5_phase2.json")],
  [6, validateUnit6Phase2, lesson("unit6_phase2.json")],
];

test("Project instructions drive games instead of appearing as foundation cards", () => {
  for (const [unit, validate, source] of phaseProjects) {
    const built = validate(source);
    const planText = built.games.plan.flatMap(({ context, prompt, answer }) => [context, prompt, answer]).join("\n");
    for (const step of source.project.steps ?? []) assert.ok(planText.includes(step), `Unit ${unit} plan must use: ${step}`);
    for (const prompt of source.project.prompts ?? []) assert.ok(planText.includes(prompt), `Unit ${unit} plan must use: ${prompt}`);

    const presentContexts = new Set(built.games.present.map(({ context }) => context));
    for (const skill of source.project.now_i_can) {
      assert.ok(presentContexts.has(`Now I can: ${skill}`), `Unit ${unit} self-check must use: ${skill}`);
    }
    assert.match(built.help.plan.steps.join(" "), /gợi ý|câu hỏi/i);
    assert.match(built.help.present.source_title, /Now I can/i);

    const component = readFileSync(new URL(`../src/features/unit${unit}/Unit${unit}Phase2Sections.tsx`, import.meta.url), "utf8");
    const projectSource = component.slice(component.indexOf(`function Unit${unit}Project`));
    assert.match(projectSource, /foundations=\{\[\]\}/);
    assert.doesNotMatch(projectSource, /title:\s*["']Now I can/);
  }
});

test("Unit 3 uses all five Project steps and all eight Now I can checks as game material", () => {
  const source = lesson("unit3_project.json");
  const built = validateProjectData(source);
  assert.equal(built.games.path.filter(({ source_status }) => source_status === "user-provided-reference").length, source.source_material.project_steps.length);
  const contexts = new Set(built.games.present.map(({ context }) => context));
  for (const skill of source.source_material.now_i_can) assert.ok(contexts.has(`Now I can: ${skill}`), skill);
  const component = readFileSync(new URL("../src/features/project/Project.tsx", import.meta.url), "utf8");
  assert.match(component, /foundations=\{\[\]\}/);
});
