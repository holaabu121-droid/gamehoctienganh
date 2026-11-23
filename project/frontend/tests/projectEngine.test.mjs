import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isProjectAnswer, validateProjectData } from "../src/features/project/projectEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_project.json", import.meta.url), "utf8"));

test("Project has five scored games of ten rounds without mutating data", () => {
  const snapshot = JSON.stringify(raw);
  const lesson = validateProjectData(raw);
  assert.deepEqual(Object.values(lesson.games).map((rounds) => rounds.length), [10, 10, 10, 10, 10]);
  assert.equal(Object.values(lesson.games).flat().length, 50);
  assert.equal(JSON.stringify(raw), snapshot);
});

test("Project preserves five steps, eight self-checks and exact provenance ratios", () => {
  const lesson = validateProjectData(raw);
  assert.equal(lesson.source_material.project_steps.length, 5);
  assert.equal(lesson.source_material.now_i_can.length, 8);
  assert.deepEqual(Object.values(lesson.games).map((rounds) => rounds.filter(({ source_status }) => source_status === "user-provided-reference").length), [5, 3, 0, 3, 8]);
});

test("Project uses safe fictional profiles and deterministic answers", () => {
  const lesson = validateProjectData(raw);
  const generated = Object.values(lesson.games).flat().filter(({ source_status }) => source_status === "ai-generated");
  assert.ok(generated.every(({ character_name }) => character_name.trim().split(/\s+/).length === 2));
  assert.match(lesson.intro.privacy_note_vi, /hư cấu/i);
  assert.equal(isProjectAnswer(lesson.games.interview[0], " what is your favourite subject? "), true);
});

test("Project rejects bad counts, provenance, names, answers and image fields", () => {
  const count = structuredClone(raw); count.games.writer.pop();
  assert.throws(() => validateProjectData(count), /exactly 10/);
  const provenance = structuredClone(raw); provenance.games.notes[0].source_status = "user-provided-reference";
  assert.throws(() => validateProjectData(provenance), /provenance ratio/);
  const name = structuredClone(raw); name.games.notes[0].character_name = "Lan";
  assert.throws(() => validateProjectData(name), /two-word/);
  const answer = structuredClone(raw); answer.games.path[0].answer = "Missing";
  assert.throws(() => validateProjectData(answer), /content/);
  const image = structuredClone(raw); image.games.path[0].image = "page.jpg";
  assert.throws(() => validateProjectData(image), /image fields/);
});

test("Project help explains ten rounds, completion and feedback", () => {
  const lesson = validateProjectData(raw);
  for (const help of Object.values(lesson.game_help)) {
    assert.ok(help.steps.some((step) => step.includes("10")));
    assert.ok(help.steps.some((step) => /sai|phản hồi/i.test(step)));
  }
});
