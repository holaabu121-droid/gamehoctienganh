import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_chapter1_practice.json";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { validateStructuredMathReview, type StructuredMathReviewSource } from "./structuredMathReviewEngine";

export function MathChapter1Practice() {
  const lesson = useMemo(() => validateStructuredMathReview(sourceJson as StructuredMathReviewSource, { reviewId: "math6-s1-chapter1-practice", sequence: 6, pageLabel: "trang 20–21" }), []);
  return <StructuredMathLesson lesson={lesson} pageLabel="trang 20–21" displayLabel="Luyện tập chung" badgeLabel="LT" />;
}
