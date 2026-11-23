import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateBonusLesson } from "../src/features/bonus/bonusEngine.ts";
import { validateUnit4Data } from "../src/features/unit4/unit4Engine.ts";
import { validateUnit4Phase2 } from "../src/features/unit4/unit4Phase2Engine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit4_phase1.json", import.meta.url), "utf8"));
const bonusRaw = JSON.parse(readFileSync(new URL("../../data/lessons/unit4_bonus.json", import.meta.url), "utf8"));
const phase2Raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit4_phase2.json", import.meta.url), "utf8"));

test("Unit 4 phase 1 builds 17 games with ten valid rounds", () => {
  const before = JSON.stringify(raw);
  const lesson = validateUnit4Data(raw);
  assert.equal(JSON.stringify(raw), before);
  assert.equal(Object.keys(lesson.games).length, 17);
  assert.equal(Object.values(lesson.games).flat().length, 170);
  for (const rounds of Object.values(lesson.games)) {
    assert.equal(rounds.length, 10);
    assert.equal(new Set(rounds.map((item) => item.id)).size, 10);
    assert.ok(rounds.every((item) => item.options.includes(item.answer)));
  }
});

test("Unit 4 preserves textbook anchors and labels AI extensions", () => {
  const lesson = validateUnit4Data(raw);
  assert.equal(lesson.getting_started.dialogue.length, 14);
  assert.deepEqual(lesson.getting_started.directions, ["turn right", "cross the road", "turn left", "go straight", "take the second turning on the left"]);
  assert.ok(lesson.closer_look_2.comparatives.some((item) => item.adjective === "noisy" && item.answer === "noisier"));
  const rounds = Object.values(lesson.games).flat();
  assert.ok(rounds.some((item) => item.source_status === "user-provided-reference"));
  assert.ok(rounds.some((item) => item.source_status === "ai-generated"));
});

test("Unit 4 sound games are listening practice without pronunciation scoring", () => {
  const lesson = validateUnit4Data(raw);
  assert.equal(lesson.games.sound.length, 10);
  assert.equal(lesson.games.rhythm.length, 10);
  assert.ok([...lesson.games.sound, ...lesson.games.rhythm].every((item) => item.audio_text && item.audio_source_status === "ai-generated"));
  assert.ok(!JSON.stringify(lesson).includes('"skill":"pronunciation"'));
  const sections = readFileSync(new URL("../src/features/unit4/Unit4Sections.tsx", import.meta.url), "utf8");
  assert.equal((sections.match(/timedSeconds:60/g) ?? []).length, 2);
});

test("Unit 4 Bonus has three AI stages of ten rounds", () => {
  const bonus = validateBonusLesson(bonusRaw);
  assert.equal(bonus.lesson_id, "unit4-bonus");
  assert.deepEqual(bonus.selected_variants, ["treasure", "boss", "detective"]);
  assert.deepEqual(bonus.selected_variants.map((id) => bonus.stages[id].rounds.length), [10, 10, 10]);
  assert.ok(bonus.selected_variants.flatMap((id) => bonus.stages[id].rounds).every((item) => item.source_status === "ai-generated"));
});

test("Unit 4 rejects changed anchors and embedded textbook images", () => {
  const anchors = structuredClone(raw);
  anchors.getting_started.dialogue.pop();
  assert.throws(() => validateUnit4Data(anchors), /anchors changed/);
  const image = structuredClone(raw);
  image.image_url = "textbook-page.jpg";
  assert.throws(() => validateUnit4Data(image), /must not embed/);
});

test("Unit 4 phase 2 builds the remaining 25 games with ten rounds", () => {
  const before = JSON.stringify(phase2Raw);
  const lesson = validateUnit4Phase2(phase2Raw);
  assert.equal(JSON.stringify(phase2Raw), before);
  assert.equal(Object.keys(lesson.games).length, 25);
  assert.equal(Object.values(lesson.games).flat().length, 250);
  for (const rounds of Object.values(lesson.games)) {
    assert.equal(rounds.length, 10);
    assert.equal(new Set(rounds.map((item) => item.id)).size, 10);
    assert.ok(rounds.every((item) => item.options.includes(item.answer)));
  }
});

test("Unit 4 phase 2 preserves page anchors and labels replacement audio", () => {
  const lesson = validateUnit4Phase2(phase2Raw);
  assert.equal(lesson.communication.dialogues.length, 2);
  assert.equal(lesson.skills1.questions.length, 4);
  assert.equal(lesson.skills2.visible_statements.length, 5);
  assert.equal(lesson.looking_back.comparatives.length, 9);
  assert.equal(lesson.project.now_i_can.length, 8);
  const audioRounds = Object.values(lesson.games).flat().filter((item) => item.audio_text);
  assert.ok(audioRounds.length >= 20);
  assert.ok(audioRounds.every((item) => item.audio_source_status === "ai-generated"));
  assert.ok(lesson.source_note.includes("Track 27–30"));
  assert.ok(lesson.games.writing.every((item) => item.source_status === "ai-generated"));
  assert.ok(lesson.games.writing.every((item) => item.context.includes("fictional")));
});

test("Unit 4 now exposes all 42 scored games and no waiting branches", () => {
  const phase1 = validateUnit4Data(raw);
  const phase2 = validateUnit4Phase2(phase2Raw);
  assert.equal(Object.keys(phase1.games).length + Object.keys(phase2.games).length, 42);
  const component = readFileSync(new URL("../src/features/unit4/Unit4.tsx", import.meta.url), "utf8");
  assert.ok(!component.includes("WaitingSection"));
  for (const name of ["Unit4Communication", "Unit4Skills1", "Unit4Skills2", "Unit4LookingBack", "Unit4Project"]) assert.ok(component.includes(`<${name}`));
});

test("Unit 4 phase 2 rejects changed anchors and unlabelled audio", () => {
  const anchor = structuredClone(phase2Raw);
  anchor.project.now_i_can.pop();
  assert.throws(() => validateUnit4Phase2(anchor), /anchors changed/);
  const audio = structuredClone(phase2Raw);
  audio.skills2.replacement_audio.source_status = "user-provided-reference";
  assert.throws(() => validateUnit4Phase2(audio), /AI-labelled/);
});
