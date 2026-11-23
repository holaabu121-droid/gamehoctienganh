import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateStructuredMathReview } from "../src/features/math6/structuredMathReviewEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_chapter1_review.json", import.meta.url), "utf8"));
const build = () => validateStructuredMathReview(raw, { reviewId: "math6-s1-chapter1-review", sequence: 7, pageLabel: "trang 28" });
const containsAnchor = (round, anchor) => `${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Chapter I final review builds six independent scored games of ten rounds", () => {
  const review = build();
  assert.deepEqual(review.gameIds, ["number-writing", "neighbors-order", "operations", "powers-order", "applications", "chapter-mastery"]);
  assert.ok(Object.values(review.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
  assert.ok(review.meta.every((game) => game.activityId.startsWith("math6-s1-chapter1-review-")));
});

test("Chapter I final review preserves exercises 1.54 to 1.59", () => {
  const review = build();
  assert.deepEqual(review.rounds["number-writing"].slice(0, 6).map((item) => item.answer), ["15 267 021 908", "11", "{0; 1; 2; 5; 6; 7; 8; 9}", "7", "10 000 000 000", "1 000"]);
  assert.deepEqual(review.rounds["neighbors-order"].slice(0, 6).map((item) => item.answer), ["2 019", "2 021", "a − 1", "a + 1", "0", "Không có số nào"]);
  assert.ok(review.rounds.operations.slice(0, 3).every((round, index) => containsAnchor(round, ["40 511 258", "16 dư 93", "28 dư 188"][index])));
  assert.ok(containsAnchor(review.rounds["powers-order"][1], "2 100"));
  const applicationAnchors = ["8 xe", "324 ghế", "16 200 000 đồng", "283 vé", "14 150 000 đồng", "211 vé", "113 vé"];
  assert.ok(review.rounds.applications.slice(0, 7).every((round, index) => containsAnchor(round, applicationAnchors[index])));
});

test("Chapter I final review is ordered after practice and has a 6000-point plan", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
  const math = catalog.courses.find((course) => course.id === "math-6-semester-1");
  const practiceIndex = math.branch_ids.indexOf("math6-s1-chapter1-practice");
  assert.deepEqual(math.branch_ids.slice(practiceIndex, practiceIndex + 3), ["math6-s1-chapter1-practice", "math6-s1-chapter1-review", "math6-s1-lesson6"]);
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.ok(app.includes("<MathChapter1Review />") && app.includes("<MathChapter1Practice />"));
  assert.ok(registry.includes('"math6-s1-chapter1-review"'));
  assert.equal(db.match(/"math6-s1-chapter1-review-(?:number-writing|neighbors-order|operations|powers-order|applications|chapter-mastery)": 1000/g)?.length, 6);
});
