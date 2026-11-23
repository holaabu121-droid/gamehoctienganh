import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isFriendDetectiveAnswer, validateFriendDetectiveData } from "../src/features/friend-detective/friendDetectiveEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_part5_designed.json", import.meta.url), "utf8"));

test("Friend Detective is a designed ten-round Part 5 game", () => {
  const snapshot = JSON.stringify(raw);
  const lesson = validateFriendDetectiveData(raw);
  assert.equal(lesson.source_status, "designed");
  assert.equal(lesson.games.detective.length, 10);
  assert.ok(lesson.games.detective.every(({ source_status, character_name }) => source_status === "ai-generated" && character_name.trim().split(/\s+/).length === 2));
  assert.equal(JSON.stringify(raw), snapshot);
});

test("Friend Detective has deterministic answers, privacy and complete help", () => {
  const lesson = validateFriendDetectiveData(raw);
  assert.match(lesson.intro.privacy_note_vi, /hư cấu/i);
  assert.equal(isFriendDetectiveAnswer(lesson.games.detective[0], " lan anh "), true);
  assert.ok(lesson.game_help.detective.steps.some((step) => step.includes("10")));
  assert.ok(lesson.game_help.detective.steps.some((step) => /đúng|sai|phản hồi/i.test(step)));
});

test("Friend Detective rejects bad counts, provenance, names and answers", () => {
  const count = structuredClone(raw); count.games.detective.pop();
  assert.throws(() => validateFriendDetectiveData(count), /exactly 10/);
  const provenance = structuredClone(raw); provenance.games.detective[0].source_status = "user-provided-reference";
  assert.throws(() => validateFriendDetectiveData(provenance), /provenance/);
  const name = structuredClone(raw); name.games.detective[0].character_name = "Lan";
  assert.throws(() => validateFriendDetectiveData(name), /name/);
  const answer = structuredClone(raw); answer.games.detective[0].answer = "Nobody";
  assert.throws(() => validateFriendDetectiveData(answer), /content/);
});
