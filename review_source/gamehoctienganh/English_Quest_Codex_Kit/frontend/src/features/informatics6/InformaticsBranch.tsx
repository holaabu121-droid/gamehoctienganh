import { InformaticsLesson } from "./InformaticsLesson";
import { INFORMATICS_BY_ID } from "./informaticsCurriculum";

export function InformaticsBranch({ branchId }: { branchId: string }) {
  const spec = INFORMATICS_BY_ID[branchId];
  if (!spec) return <section className="lesson-card auth-loading" role="alert"><strong>Không tìm thấy bài Tin học này.</strong></section>;
  return <InformaticsLesson spec={spec}/>;
}
