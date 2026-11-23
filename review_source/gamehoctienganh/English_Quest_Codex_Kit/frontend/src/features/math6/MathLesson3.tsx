import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_lesson3.json";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { validateStructuredMathLesson, type StructuredMathLessonSource } from "./structuredMathLessonEngine";

export function MathLesson3() {
  const lesson = useMemo(() => validateStructuredMathLesson(sourceJson as StructuredMathLessonSource, { lessonId: "math6-s1-lesson3", lessonNumber: 3, pageLabel: "trang 13–14" }), []);
  return <StructuredMathLesson lesson={lesson} pageLabel="trang 13–14" />;
}
