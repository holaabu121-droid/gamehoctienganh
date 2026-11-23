import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildRhythmPlan,
  isContextAnswer,
  isGardenAnswer,
  isPictureMatch,
  isSoundAnswer,
  validateCloserLookData,
} from "../src/features/a-closer-look-1/closerLookEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_a_closer_look1.json", import.meta.url), "utf8"));
const componentSource = readFileSync(new URL("../src/features/a-closer-look-1/ACloserLook1.tsx", import.meta.url), "utf8");

test("validates designed A Closer Look content without mutating it", () => {
  const snapshot = JSON.stringify(raw);
  const lesson = validateCloserLookData(raw);
  assert.equal(lesson.source_status, "designed");
  assert.deepEqual([
    lesson.picture_match.length,
    lesson.context_clues.questions.length,
    lesson.friendship_garden.length,
    lesson.sound_sort.length,
    lesson.rhythm_echo.lines.length,
  ], [10, 10, 10, 10, 10]);
  assert.equal(JSON.stringify(raw), snapshot);
});

test("provides Vietnamese meanings and two explicit knowledge foundations", () => {
  const lesson = validateCloserLookData(raw);
  assert.equal(lesson.intro.vocabulary.length, 11);
  assert.ok(lesson.intro.vocabulary.every(({ word, vi }) => word.trim() && vi.trim()));
  assert.equal(new Set(lesson.intro.vocabulary.map(({ word }) => word)).size, 11);
  assert.deepEqual(lesson.intro.pronunciation.sounds.map(({ symbol }) => symbol).sort(), ["/b/", "/p/"]);
  assert.ok(lesson.intro.pronunciation.sounds.every(({ tip_vi, examples }) => tip_vi.trim() && examples.length >= 2));
});

test("provides useful help for all five games", () => {
  const lesson = validateCloserLookData(raw);
  assert.deepEqual(Object.keys(lesson.game_help).sort(), ["context", "garden", "picture", "rhythm", "sound"]);
  assert.ok(Object.values(lesson.game_help).every((steps) => steps.length >= 3 && steps.every((step) => step.trim())));
  assert.ok(["picture", "context", "garden"].every((id) => lesson.game_help[id].some((step) => step.includes("1000"))));
  assert.ok(["sound", "rhythm"].every((id) => lesson.game_help[id].some((step) => step.includes("1000")) && lesson.game_help[id].some((step) => step.includes("60 giây"))));
  assert.ok(lesson.game_help.garden.some((step) => step.includes("hai")));
});

test("uses two-word Vietnamese example names and gives garden clues", () => {
  const lesson = validateCloserLookData(raw);
  const names = [
    ...lesson.picture_match.map(({ character_name }) => character_name),
    ...lesson.context_clues.questions.map(({ character_name }) => character_name),
    ...lesson.friendship_garden.map(({ name }) => name),
    ...lesson.rhythm_echo.speakers,
  ];
  assert.ok(names.every((name) => name.trim().split(/\s+/).length === 2));
  assert.ok(lesson.friendship_garden.every(({ clue, clue_vi }) => clue.trim() && clue_vi.trim()));
});

test("matches picture words and context answers exactly", () => {
  const lesson = validateCloserLookData(raw);
  assert.equal(isPictureMatch(" Caring ", lesson.picture_match.find(({ id }) => id === "caring")), true);
  assert.equal(isPictureMatch("active", lesson.picture_match.find(({ id }) => id === "caring")), false);
  const creative = lesson.context_clues.questions.find(({ id }) => id === "creative");
  assert.equal(isContextAnswer(creative, "creative"), true);
  assert.equal(isContextAnswer(creative, "kind"), false);
  assert.ok(lesson.context_clues.word_bank.includes("kind"));
});

test("accepts friendship adjectives in either order and rejects partial sets", () => {
  const minh = validateCloserLookData(raw).friendship_garden[0];
  assert.equal(isGardenAnswer(minh, ["funny", "kind"]), true);
  assert.equal(isGardenAnswer(minh, ["kind"]), false);
  assert.equal(isGardenAnswer(minh, ["kind", "active"]), false);
});

test("classifies every b and p sound item", () => {
  const items = validateCloserLookData(raw).sound_sort;
  assert.equal(items.filter(({ sound }) => sound === "b").length, 5);
  assert.equal(items.filter(({ sound }) => sound === "p").length, 5);
  assert.ok(items.every((item) => isSoundAnswer(item, item.sound)));
  assert.equal(isSoundAnswer(items.find(({ word }) => word === "pig"), "b"), false);
});

test("builds one slow line and one seven-second gap per chant line before the full chant", () => {
  const { lines, gap_ms: gapMs } = validateCloserLookData(raw).rhythm_echo;
  const plan = buildRhythmPlan(lines, gapMs);
  assert.equal(plan.length, lines.length * 2 + 1);
  assert.equal(plan.filter(({ kind }) => kind === "repeat-gap").length, lines.length);
  assert.ok(plan.filter(({ kind }) => kind === "repeat-gap").every(({ durationMs }) => durationMs === 7000));
  assert.deepEqual(plan.slice(0, 2).map(({ kind }) => kind), ["speak-line", "repeat-gap"]);
  assert.equal(plan.at(-1).kind, "speak-full");
});

test("rejects any lesson whose games do not all contain ten rounds", () => {
  const invalid = structuredClone(raw);
  invalid.friendship_garden.pop();
  assert.throws(() => validateCloserLookData(invalid), /exactly ten rounds/);
});

test("scores three vocabulary games and two sixty-second pronunciation practices", () => {
  for (const id of ["picture", "context", "garden", "sound", "rhythm"]) {
    assert.ok(componentSource.includes(`unit3-a-closer-look1-${id}`));
  }
  assert.ok(componentSource.includes("scored.recordHelp"));
  assert.ok(componentSource.includes("scored.recordWrong"));
  assert.ok(componentSource.includes("scored.markComplete"));
  assert.ok(componentSource.includes("scored.finishGame"));
  assert.ok(componentSource.includes("confirmPractice"));
  assert.ok(componentSource.includes("Hoạt động tính điểm theo thời gian"));
  assert.ok(componentSource.includes("elapsedSeconds >= 60"));
  assert.ok(componentSource.includes("Em đã đọc xong"));
  const rhythmBody = componentSource.slice(componentSource.indexOf("function RhythmEcho"), componentSource.indexOf("export function ACloserLook1"));
  assert.equal(rhythmBody.includes("recordWrong"), false);
});
