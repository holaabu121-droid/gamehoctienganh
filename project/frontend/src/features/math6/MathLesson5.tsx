import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_lesson5.json";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { validateStructuredMathLesson, type StructuredMathLessonSource } from "./structuredMathLessonEngine";

export function MathLesson5() {
  const lesson = useMemo(() => validateStructuredMathLesson(sourceJson as StructuredMathLessonSource, { lessonId: "math6-s1-lesson5", lessonNumber: 5, pageLabel: "trang 17–19" }), []);
  return <StructuredMathLesson lesson={lesson} pageLabel="trang 17–19" />;
}
