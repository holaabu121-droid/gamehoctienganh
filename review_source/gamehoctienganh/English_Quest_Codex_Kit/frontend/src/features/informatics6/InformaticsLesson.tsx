import { SkillsSection } from "../skills-common/SkillsSection";
import { InformaticsConceptVisual } from "./InformaticsConceptVisual";
import { buildInformaticsLesson, type InformaticsLessonSpec } from "./informaticsCurriculum";

export function InformaticsLesson({ spec }: { spec: InformaticsLessonSpec }) {
  const lesson = buildInformaticsLesson(spec);
  return <>
    <header className="unit-header informatics-unit-header">
      <span className="eyebrow">Tin học 6 · {spec.courseId.endsWith("2") ? "Học kỳ 2" : "Học kỳ 1"}</span>
      <div className="unit-identity"><span className="unit-number">{spec.number}</span><div><span>{spec.topic}</span><h1>Bài {spec.number} · {spec.title}</h1><p>{spec.lead}</p></div></div>
      <section className="section-overview" aria-label={`Mục tiêu Bài ${spec.number}`}><div className="section-guide"><span className="section-kicker">Em sẽ học</span><h2>{spec.title}</h2><p>{spec.lead}</p></div><div className="section-objectives"><strong>Mục tiêu bài học</strong><ul>{spec.objectives.map(item=><li key={item}>{item}</li>)}</ul></div></section>
    </header>
    <InformaticsConceptVisual spec={spec}/>
    <section className="lesson-card informatics-part-plan" aria-label={`Ý tưởng từng phần của Bài ${spec.number}`}>
      <span className="eyebrow">Bản đồ bài học · từng phần</span><h2>{spec.title}</h2>
      <div>{lesson.partPlan.map(item=><article key={item.part}><span>{item.part}</span><h3>{item.title}</h3><p>{item.idea}</p><small>{item.evidence}</small></article>)}</div>
    </section>
    <SkillsSection unitId={spec.id} sectionLabel={`Tin học 6 · Bài ${spec.number} · ${spec.pages}`} trailTitle={`Hành trình số · ${spec.title}`} introTitle={`Bài ${spec.number} · ${spec.title}`} introTitleVi="Hiểu khái niệm, luyện quy trình và ra quyết định an toàn" introDescription="Mở các thẻ bài giảng trước khi luyện. Sáu trò chơi kiểm tra sáu năng lực khác nhau; mỗi trò có 10 câu theo lộ trình 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách." foundations={lesson.foundations} games={lesson.rounds} help={lesson.help} meta={lesson.meta} listening={false} questionEmphasis="prompt" speechLang="vi-VN" privacyNote={spec.practice ?? "Bài luyện dùng tình huống mô phỏng, không yêu cầu cung cấp thông tin cá nhân hoặc thao tác trên tài khoản thật."}/>
    <aside className="lesson-card informatics-rubric"><span className="eyebrow">Rubric quan sát · không chấm thao tác thật tự động</span><h3>{lesson.rubric.title}</h3><ul>{lesson.rubric.criteria.map(item=><li key={item}>{item}</li>)}</ul></aside>
    {spec.practice&&<aside className="lesson-card informatics-practice-note"><span className="eyebrow">Thực hành an toàn · không chấm điểm thao tác thật</span><h3>Chỉ thực hiện khi được cho phép</h3><p>{spec.practice}</p></aside>}
  </>;
}
