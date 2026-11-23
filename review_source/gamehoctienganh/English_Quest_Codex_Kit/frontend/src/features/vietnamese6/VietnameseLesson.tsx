import { SkillsSection } from "../skills-common/SkillsSection";
import { VietnameseConceptVisual } from "./VietnameseConceptVisual";
import { buildVietnameseLesson, type VietnameseLessonSpec } from "./vietnameseCurriculum";

export function VietnameseLesson({ spec }: { spec: VietnameseLessonSpec }) {
  const lesson = buildVietnameseLesson(spec);
  return <>
    <header className="unit-header vietnamese-unit-header">
      <span className="eyebrow">Ngữ văn 6 · Học kỳ {spec.semester}</span>
      <div className="unit-identity"><span className="unit-number">{spec.number ?? "Ôn"}</span><div><span>{spec.genre}</span><h1>{spec.label} · {spec.title}</h1><p>{spec.lead}</p></div></div>
      <section className="section-overview" aria-label={`Mục tiêu ${spec.label}`}><div className="section-guide"><span className="section-kicker">Em sẽ học</span><h2>{spec.genre}</h2><p>Văn bản/nguồn đọc: {spec.readings.join(" · ")}</p></div><div className="section-objectives"><strong>Mục tiêu bài học</strong><ul>{spec.objectives.map(item => <li key={item}>{item}</li>)}</ul></div></section>
    </header>
    <VietnameseConceptVisual spec={spec}/>
    <section className="lesson-card vietnamese-part-plan" aria-label={`Ý tưởng từng phần của ${spec.label}`}>
      <span className="eyebrow">Bản đồ bài học · từng phần</span><h2>{spec.title}</h2>
      <div>{spec.partIdeas.map(item => <article key={`${item.part}-${item.title}`}><span>{item.part}</span><h3>{item.title}</h3><p>{item.idea}</p><small>{item.assessment}</small></article>)}</div>
    </section>
    <SkillsSection unitId={spec.id} sectionLabel={`Ngữ văn 6 · ${spec.label} · ${spec.pages}`} trailTitle={`Hành trình đọc–viết · ${spec.title}`} introTitle={`${spec.label} · ${spec.title}`} introTitleVi="Đọc có bằng chứng, dùng tiếng Việt chính xác và tạo lập có trách nhiệm" introDescription="Mở các thẻ kiến thức trước khi luyện. Sáu trò chơi kiểm tra sáu năng lực; mỗi trò có 10 câu theo lộ trình 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách. Tất cả ngữ liệu luyện tập là câu mới, không sao chép dài tác phẩm." foundations={lesson.foundations} games={lesson.rounds} help={lesson.help} meta={lesson.meta} listening={false} questionEmphasis="prompt" speechLang="vi-VN" privacyNote={spec.privacyNote}/>
    <aside className="lesson-card vietnamese-rubric"><span className="eyebrow">Rubric · không chấm cảm xúc hoặc quan điểm</span><h3>Viết, nói và sản phẩm mở</h3><p>{spec.rubric}</p><ul><li>Đúng yêu cầu và đúng kiểu nhiệm vụ.</li><li>Tổ chức rõ; dùng chi tiết hoặc bằng chứng phù hợp.</li><li>Diễn đạt tôn trọng, có tự kiểm tra và chỉnh sửa.</li><li>Cho phép bỏ qua nội dung riêng tư; ghi âm/chia sẻ chỉ khi được người lớn cho phép.</li></ul></aside>
  </>;
}
