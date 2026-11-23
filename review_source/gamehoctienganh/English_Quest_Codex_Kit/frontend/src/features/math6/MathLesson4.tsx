import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_lesson4.json";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { validateStructuredMathLesson, type StructuredMathLessonSource } from "./structuredMathLessonEngine";

export function MathLesson4() {
  const lesson = useMemo(() => validateStructuredMathLesson(sourceJson as StructuredMathLessonSource, { lessonId: "math6-s1-lesson4", lessonNumber: 4, pageLabel: "trang 15–16" }), []);
  return <StructuredMathLesson lesson={lesson} pageLabel="trang 15–16" />;
}
