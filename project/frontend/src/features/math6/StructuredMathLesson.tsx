import { SkillsSection } from "../skills-common/SkillsSection";
import type { StructuredMathLessonBuilt } from "./structuredMathLessonEngine";
import { MathConceptVisuals } from "./MathConceptVisuals";

export function StructuredMathLesson({ lesson, pageLabel, displayLabel, badgeLabel }: { lesson: StructuredMathLessonBuilt; pageLabel: string; displayLabel?: string; badgeLabel?: string }) {
  const lessonLabel = displayLabel ?? `Bài ${lesson.lesson.number}`;
  const semesterLabel = lesson.course_id === "math-6-semester-2" ? "Học kỳ 2" : "Học kỳ 1";
  return <>
    <header className="unit-header math-unit-header">
      <span className="eyebrow">Toán 6 · {semesterLabel}</span>
      <div className="unit-identity"><span className="unit-number">{badgeLabel ?? lesson.lesson.number}</span><div><span>{lesson.lesson.chapter}</span><h1>{lessonLabel} · {lesson.lesson.title}</h1><p>{lesson.lesson.lead}</p></div></div>
      <section className="section-overview" aria-label={`Mục tiêu ${lessonLabel}`}><div className="section-guide"><span className="section-kicker">Em sẽ học</span><h2>{lesson.lesson.title}</h2><p>{lesson.lesson.lead}</p></div><div className="section-objectives"><strong>Mục tiêu bài học</strong><ul>{lesson.lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div></section>
    </header>
    <SkillsSection
      unitId={lesson.branch_id}
      sectionLabel={`Toán 6 · ${lessonLabel} · ${pageLabel}`}
      trailTitle={`Hành trình · ${lesson.lesson.title}`}
      introTitle={`${lessonLabel} · ${lesson.lesson.title}`}
      introTitleVi="Học quy tắc qua ví dụ, sau đó luyện 6 trò chơi"
      introDescription="Mở từng thẻ kiến thức để xem giải thích. Sáu trò chơi có 10 câu, tối đa 1.000 điểm mỗi trò và luôn lưu điểm tốt nhất."
      foundations={lesson.foundations}
      foundationVisual={<MathConceptVisuals key={lesson.lesson_id} lessonId={lesson.lesson_id} title={lesson.lesson.title} chapter={lesson.lesson.chapter} lead={lesson.lesson.lead} foundations={lesson.foundations} />}
      foundationVisualIndex={1}
      games={lesson.rounds}
      help={lesson.help}
      meta={lesson.meta}
      listening={false}
      questionEmphasis="prompt"
      speechLang="vi-VN"
    />
    {lesson.lesson.extension && <aside className="lesson-card section-knowledge-footer"><span className="eyebrow">Mở rộng · không tính điểm bắt buộc</span><h3>Em có biết?</h3><p>{lesson.lesson.extension}</p></aside>}
  </>;
}
