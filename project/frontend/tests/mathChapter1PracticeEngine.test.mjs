import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateStructuredMathReview } from "../src/features/math6/structuredMathReviewEngine.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/math6_s1_chapter1_practice.json", import.meta.url), "utf8"));
const build = () => validateStructuredMathReview(raw, { reviewId: "math6-s1-chapter1-practice", sequence: 6, pageLabel: "trang 20–21" });
const containsAnchor = (round, anchor) => `${round.prompt} ${round.answer} ${round.explanation_vi}`.includes(anchor);

test("Chapter I practice builds six independent scored games of ten rounds", () => {
  const review = build();
  assert.deepEqual(review.gameIds, ["place-value", "sets-order", "add-subtract", "multiply-divide", "word-problem", "mixed"]);
  assert.ok(Object.values(review.rounds).every((rounds) => rounds.length === 10 && rounds.every((round) => round.options.length === 4 && round.options.includes(round.answer))));
  assert.ok(review.meta.every((game) => game.activityId.startsWith("math6-s1-chapter1-practice-")));
});

test("Chapter I practice preserves pages 20 and 21 examples and exercises 1.31 to 1.35", () => {
  const review = build();
  assert.deepEqual(review.rounds["place-value"].slice(0, 5).map((item) => item.answer), ["0", "2", "80 000", "600", "2·100 000 + 8·10 000 + 6·100 + 5·10"]);
  assert.deepEqual(review.rounds["sets-order"].slice(0, 8).map((item) => item.answer), ["{4; 5; 6; 7}", "A = {x ∈ ℕ | 3 < x ≤ 7}", "0; 1; 2; 3; 8; 9", "{0; 2; 5; 6; 8}", "1 000", "1 023", "2 046", "1 357"]);
  const wordProblemAnchors = ["499 giây", "149 700 000 km", "3 900 kg", "83 900 đồng", "86 700 đồng", "30 210 đồng", "200 810 đồng"];
  assert.ok(review.rounds["word-problem"].slice(0, 7).every((round, index) => containsAnchor(round, wordProblemAnchors[index])));
});

test("Chapter I practice includes provenance, teaching help and a 6000-point plan", () => {
  const review = build();
  const all = Object.values(review.rounds).flat();
  assert.ok(review.gameIds.every((id) => review.help[id].source_title.includes("trang 20–21") && review.help[id].teaching_vi));
  assert.ok(all.some((round) => round.source_status === "user-provided-reference"));
  assert.ok(all.some((round) => round.source_status === "ai-generated"));
  const db = readFileSync(new URL("../../backend/app/db.py", import.meta.url), "utf8");
  assert.equal(db.match(/"math6-s1-chapter1-practice-(?:place-value|sets-order|add-subtract|multiply-divide|word-problem|mixed)": 1000/g)?.length, 6);
});
