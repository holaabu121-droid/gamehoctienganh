import { useMemo } from "react";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { buildMathSemester2Branch, MATH_SEMESTER_2_GENERATED_BY_ID } from "./mathSemester2Curriculum";

export function MathSemester2Branch({ branchId }: { branchId: string }) {
  const spec = MATH_SEMESTER_2_GENERATED_BY_ID[branchId];
  if (!spec) throw new Error(`Unknown Math 6 semester 2 branch: ${branchId}`);
  const lesson = useMemo(() => buildMathSemester2Branch(spec), [spec]);
  return <StructuredMathLesson lesson={lesson} pageLabel={spec.pages} displayLabel={spec.label} badgeLabel={spec.badge} />;
}
