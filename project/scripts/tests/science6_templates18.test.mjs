import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

import { presentationTemplates, templatesForLesson } from "../../data/science6_pilot/source/science6PresentationTemplates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const manifest = JSON.parse(await readFile(path.join(PACK_DIR, "manifest.json"), "utf8"));
const lessons = await Promise.all(manifest.lessons.map(async (entry) => JSON.parse(await readFile(path.join(PACK_DIR, entry.file), "utf8"))));
const rounds = lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds));

test("ngân hàng có đúng 18 khuôn duy nhất", () => {
  assert.equal(presentationTemplates.length, 18);
  assert.equal(new Set(presentationTemplates.map((template) => template.id)).size, 18);
  assert.deepEqual(manifest.presentation_templates, presentationTemplates);
});

test("mỗi bài dùng sáu khuôn khác nhau theo đúng vòng luân phiên", () => {
  for (const lesson of lessons) {
    const actual = lesson.competencies.map((game) => game.presentation_template.id);
    const expected = templatesForLesson(lesson.lesson_number).map((template) => template.id);
    assert.deepEqual(actual, expected, lesson.lesson_id);
    assert.equal(new Set(actual).size, 6, lesson.lesson_id);
  }
});

test("toàn bộ 18 khuôn đều được sử dụng và có payload riêng", () => {
  const games = lessons.flatMap((lesson) => lesson.competencies);
  assert.equal(new Set(games.map((game) => game.presentation_template.id)).size, 18);
  for (const game of games) {
    assert.ok(game.rounds.every((round) => round.representation.type === game.presentation_template.id), game.game_id);
    assert.equal(new Set(game.rounds.map((round) => round.representation.id)).size, 10, game.game_id);
  }
});

test("3.300 câu chỉ dùng vật liệu có căn cứ đã duyệt", () => {
  for (const round of rounds) {
    assert.equal(round.grounding.policy, "reviewed-foundation-only-no-external-claim", round.id);
    assert.equal(round.grounding.foundation_card_id, round.concept_card_id, round.id);
    assert.deepEqual(round.grounding.unsupported_external_claims, [], round.id);
    const supported = Object.values(round.grounding.supported_material).map((value) => value.toLocaleLowerCase("vi"));
    assert.ok(supported.some((value) => round.answer.toLocaleLowerCase("vi").includes(value)), round.id);
  }
});

test("phương án sai được phân biệt rõ với thông tin có căn cứ", () => {
  for (const round of rounds) {
    for (const option of round.options.filter((value) => value !== round.answer)) {
      assert.equal(round.wrong_feedback[option].option_status, "intentionally-incorrect-distractor", round.id);
    }
  }
});
