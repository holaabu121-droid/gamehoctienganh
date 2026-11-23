import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_chapter1_review.json";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { validateStructuredMathReview, type StructuredMathReviewSource } from "./structuredMathReviewEngine";

export function MathChapter1Review() {
  const lesson = useMemo(() => validateStructuredMathReview(sourceJson as StructuredMathReviewSource, { reviewId: "math6-s1-chapter1-review", sequence: 7, pageLabel: "trang 28" }), []);
  return <StructuredMathLesson lesson={lesson} pageLabel="trang 28" displayLabel="Bài tập cuối Chương I" badgeLabel="I" />;
}
