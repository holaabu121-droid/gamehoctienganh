import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_lesson2.json";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { validateStructuredMathLesson, type StructuredMathLessonSource } from "./structuredMathLessonEngine";

export function MathLesson2() {
  const lesson = useMemo(() => validateStructuredMathLesson(sourceJson as StructuredMathLessonSource, { lessonId: "math6-s1-lesson2", lessonNumber: 2, pageLabel: "trang 9–12" }), []);
  return <StructuredMathLesson lesson={lesson} pageLabel="trang 9–12" />;
}
