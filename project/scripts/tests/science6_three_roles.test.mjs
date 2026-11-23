import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const report = JSON.parse(await readFile(path.join(ROOT, "data", "science6_pilot", "reports", "three-role-evaluation.json"), "utf8"));

test("báo cáo đánh giá đúng phạm vi 55 bài và ba vai trò", () => {
  assert.equal(report.evidence.lessons, 55);
  assert.deepEqual(Object.keys(report.role_reviews), ["student", "classroom_teacher", "education_expert"]);
});

test("mỗi vai trò có bảng điểm đủ 100 và bằng chứng", () => {
  for (const review of Object.values(report.role_reviews)) {
    assert.equal(review.maximum, 100);
    assert.equal(review.criteria.reduce((sum, item) => sum + item.maximum, 0), 100);
    assert.equal(review.criteria.reduce((sum, item) => sum + item.score, 0), review.score);
    assert.ok(review.criteria.every((item) => item.evidence.length > 20));
  }
});

test("báo cáo không đánh tráo mô phỏng với kiểm thử người thật", () => {
  assert.match(report.review_mode, /not-human-usability-validation/);
  assert.match(report.scope, /integrated-course/);
  assert.equal(report.release_decision.student_release, "NOT_READY");
  assert.ok(report.release_decision.blocking_reasons.some((reason) => /học sinh lớp 6/.test(reason)));
});

test("báo cáo ghi nhận trung thực tải đọc và khuôn biểu diễn", () => {
  assert.equal(report.evidence.questions, 3300);
  assert.equal(report.evidence.representation_types, 18);
  assert.ok(report.evidence.prompt_words.average >= 35);
  assert.ok(report.evidence.option_words.over_30 > 0);
});

test("an toàn thực hành và mô phỏng vẫn giữ điểm bằng không", () => {
  assert.equal(report.evidence.practical_scored, 0);
  assert.equal(report.evidence.simulation_scored, 0);
});
