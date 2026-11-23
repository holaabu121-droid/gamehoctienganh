import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  countPlanSteps,
  createListenReadPlan,
  DEFAULT_REPEAT_GAP_MS,
  VIETNAMESE_GUIDE,
} from "../src/features/listen-read/listenReadEngine.ts";

const rawPath = new URL("../../data/raw/getting_started_unit3.json", import.meta.url);
const source = JSON.parse(readFileSync(rawPath, "utf8"));

test("orders a full English pass before Vietnamese guidance and repeat practice", () => {
  const plan = createListenReadPlan(source.part1_conversation);
  assert.deepEqual(countPlanSteps(plan), { "full-line": 15, guide: 1, "repeat-line": 15, "repeat-gap": 15 });
  assert.ok(plan.slice(0, 15).every((step) => step.kind === "full-line"));
  assert.deepEqual(plan[15], { kind: "guide", text: VIETNAMESE_GUIDE, lang: "vi-VN", rate: 0.9 });
});

test("pairs every slow sentence with silent reading time", () => {
  const practice = createListenReadPlan(source.part1_conversation).slice(16);
  for (let index = 0; index < practice.length; index += 2) {
    const speech = practice[index];
    const gap = practice[index + 1];
    assert.equal(speech.kind, "repeat-line");
    assert.equal(speech.rate, 0.7);
    assert.equal(gap.kind, "repeat-gap");
    assert.equal(gap.lineIndex, speech.lineIndex);
    assert.equal(gap.durationMs, DEFAULT_REPEAT_GAP_MS);
  }
});

test("preserves source lines and voices without mutating raw data", () => {
  const snapshot = JSON.stringify(source.part1_conversation);
  const first = createListenReadPlan(source.part1_conversation)[0];
  assert.equal(first.kind, "full-line");
  assert.deepEqual(first.line, source.part1_conversation[0]);
  assert.equal(JSON.stringify(source.part1_conversation), snapshot);
});

test("rejects an empty lesson or unusably short repeat gap", () => {
  assert.throws(() => createListenReadPlan([]), /requires conversation lines/);
  assert.throws(() => createListenReadPlan(source.part1_conversation, 500), /at least one second/);
});
