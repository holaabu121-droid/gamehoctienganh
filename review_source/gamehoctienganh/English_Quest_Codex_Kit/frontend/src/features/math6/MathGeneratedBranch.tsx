import { useMemo } from "react";
import { StructuredMathLesson } from "./StructuredMathLesson";
import { buildGeneratedMathBranch, MATH_SEMESTER_1_GENERATED_BY_ID } from "./mathSemester1Curriculum";

export function MathGeneratedBranch({ branchId }: { branchId: string }) {
  const spec = MATH_SEMESTER_1_GENERATED_BY_ID[branchId];
  if (!spec) throw new Error(`Unknown Math 6 semester 1 branch: ${branchId}`);
  const lesson = useMemo(() => buildGeneratedMathBranch(spec), [spec]);
  return <StructuredMathLesson lesson={lesson} pageLabel={spec.pages} displayLabel={spec.label} badgeLabel={spec.badge} />;
}
