import { VietnameseLesson } from "./VietnameseLesson";
import { VIETNAMESE_BY_ID } from "./vietnameseCurriculum";

export function VietnameseBranch({ branchId }: { branchId: string }) {
  const spec = VIETNAMESE_BY_ID[branchId];
  if (!spec) return <section className="lesson-card auth-loading" role="alert"><strong>Không tìm thấy bài Ngữ văn này.</strong></section>;
  return <VietnameseLesson spec={spec}/>;
}
