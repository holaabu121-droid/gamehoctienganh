import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const lessonDirectory = new URL("../../data/science6_pilot/lessons/", import.meta.url);
const lessonFiles = readdirSync(lessonDirectory).filter(name => /^science6-l\d{2}\.json$/.test(name)).sort();
const lessons = lessonFiles.map(name => JSON.parse(readFileSync(new URL(name, lessonDirectory), "utf8")));
const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const curriculum = readFileSync(new URL("../src/features/science6/scienceCurriculum.ts", import.meta.url), "utf8");
const lessonView = readFileSync(new URL("../src/features/science6/ScienceLesson.tsx", import.meta.url), "utf8");

const GAME_IDS = ["observe-identify", "classify-model", "measure-analyze", "predict-reason", "experiment-safety", "explain-apply"];

test("all 55 science lessons are integrated across two semesters", () => {
  assert.equal(lessons.length, 55);
  assert.deepEqual(lessons.map(item => item.lesson_number), Array.from({ length: 55 }, (_, index) => index + 1));
  assert.equal(new Set(lessons.map(item => item.branch_id)).size, 55);
  const first = catalog.courses.find(item => item.id === "science-6-semester-1");
  const second = catalog.courses.find(item => item.id === "science-6-semester-2");
  assert.deepEqual([first.status, first.branch_ids.length, first.branch_ids[0], first.branch_ids.at(-1)], ["available", 28, "science6-l01", "science6-l28"]);
  assert.deepEqual([second.status, second.branch_ids.length, second.branch_ids[0], second.branch_ids.at(-1)], ["available", 27, "science6-l29", "science6-l55"]);
  assert.ok(app.includes("Science6Experience"));
  assert.ok(app.includes("<ScienceBranch branchId={courseBranch}"));
  assert.ok(curriculum.includes("import.meta.glob"));
  assert.ok(curriculum.includes("loadScienceLesson"));
  assert.ok(!curriculum.includes('import lesson01 from'), "science data must remain per-lesson lazy chunks");
});

test("each science lesson preserves five teaching stages and six distinct ten-question competencies", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.foundations.length, 5, lesson.branch_id);
    assert.equal(lesson.foundations.flatMap(stage => stage.cards).length, 10, lesson.branch_id);
    assert.deepEqual(lesson.competencies.map(item => item.id), GAME_IDS, lesson.branch_id);
    for (const competency of lesson.competencies) {
      assert.equal(competency.scored, true, `${lesson.branch_id}/${competency.id}`);
      assert.equal(competency.rounds.length, 10, `${lesson.branch_id}/${competency.id}`);
      const levels = Object.fromEntries(["basic", "understanding", "application", "challenge"].map(level => [level, competency.rounds.filter(round => round.level === level).length]));
      assert.deepEqual(levels, { basic: 3, understanding: 4, application: 2, challenge: 1 }, `${lesson.branch_id}/${competency.id}`);
      for (const round of competency.rounds) {
        for (const option of round.options.filter(option => option !== round.answer)) {
          const feedback = round.wrong_feedback[option];
          assert.ok(feedback?.error_type_vi && feedback?.why_wrong_vi && feedback?.fix_vi && feedback?.review_card_id, `${lesson.branch_id}/${round.id}/${option}`);
        }
      }
    }
  }
});

test("simulation and practical application stay unscored and visibly safety-gated", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.simulation.scored, false, lesson.branch_id);
    assert.equal(lesson.practical_application.scored, false, lesson.branch_id);
    assert.match(lesson.practical_application.warning_vi, /(phụ huynh|giáo viên|cho phép|hướng dẫn)/i, lesson.branch_id);
  }
  assert.ok(lessonView.includes("Mô phỏng · không chấm điểm"));
  assert.ok(lessonView.includes("Ứng dụng thực tế · không chấm điểm"));
});
