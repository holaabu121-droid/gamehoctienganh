import type { ScienceLessonSpec } from "./scienceCurriculum";

export function ScienceConceptVisual({spec}:{spec:ScienceLessonSpec}){
  return <section className="science-visual" aria-label={`Sáu khuôn biểu diễn của Bài ${spec.lesson_number}`}>
    <header><span className="eyebrow">Phòng khoa học trực quan</span><h2>Sáu cách quan sát và lập luận</h2><p>Mỗi trò chơi dùng một khuôn khác nhau; mọi kết luận chỉ dựa trên thẻ kiến thức đã rà soát.</p></header>
    <div>{spec.competencies.map(competency=>{const view=competency.rounds[0].representation;return <article key={competency.id}><span>{view.title_vi}</span><h3>{view.focus_vi}</h3><p>{view.student_action_vi}</p><ul>{view.elements?.slice(0,3).map(item=><li key={`${item.label}-${item.value}`}><strong>{item.label}:</strong> {item.value}</li>)}</ul></article>;})}</div>
  </section>;
}
