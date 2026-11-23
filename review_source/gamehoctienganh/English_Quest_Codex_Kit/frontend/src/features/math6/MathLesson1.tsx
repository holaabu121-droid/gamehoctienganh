import { useMemo } from "react";
import sourceJson from "../../../../data/lessons/math6_s1_lesson1.json";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { MATH_LESSON1_GAME_IDS, validateMathLesson1, type MathLesson1GameId, type MathLesson1Source } from "./mathLesson1Engine";
import { deepenMathMeta } from "./mathCurriculumDepth.ts";
import { MathConceptVisuals } from "./MathConceptVisuals";

const META: GameMeta<MathLesson1GameId>[] = deepenMathMeta([
  { id: "identify", icon: "🧺", title: "Chiếc hộp tập hợp", description: "Nhận biết tập hợp và phần tử.", activityId: "math6-s1-lesson1-identify" },
  { id: "membership", icon: "🚪", title: "Thuộc hay không thuộc", description: "Chọn đúng kí hiệu ∈ hoặc ∉.", activityId: "math6-s1-lesson1-membership" },
  { id: "notation", icon: "🩺", title: "Bác sĩ kí hiệu", description: "Phát hiện và sửa cách viết sai.", activityId: "math6-s1-lesson1-notation" },
  { id: "listing", icon: "🧱", title: "Xây dựng tập hợp", description: "Liệt kê đủ các phần tử.", activityId: "math6-s1-lesson1-listing" },
  { id: "natural", icon: "🔢", title: "Cánh cổng N và N*", description: "Phân biệt hai tập số tự nhiên.", activityId: "math6-s1-lesson1-natural" },
  { id: "describe", icon: "🔄", title: "Hai cách – Một tập hợp", description: "Đổi giữa liệt kê và dấu hiệu đặc trưng.", activityId: "math6-s1-lesson1-describe" },
]);

export function MathLesson1() {
  const lesson = useMemo(() => validateMathLesson1(sourceJson as MathLesson1Source), []);
  if (MATH_LESSON1_GAME_IDS.length !== META.length) throw new Error("Math lesson navigation is incomplete");
  return <>
    <header className="unit-header math-unit-header">
      <span className="eyebrow">Toán 6 · Học kỳ 1</span>
      <div className="unit-identity"><span className="unit-number">1</span><div><span>{lesson.lesson.chapter}</span><h1>Bài 1 · {lesson.lesson.title}</h1><p>Từ đối tượng quen thuộc đến ngôn ngữ tập hợp</p></div></div>
      <section className="section-overview" aria-label="Mục tiêu Bài 1"><div className="section-guide"><span className="section-kicker">Em sẽ học</span><h2>Tập hợp và phần tử</h2><p>Quan sát, phân loại, dùng kí hiệu và chuyển đổi giữa hai cách mô tả tập hợp.</p></div><div className="section-objectives"><strong>Mục tiêu bài học</strong><ul>{lesson.lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div></section>
    </header>
    <SkillsSection
      unitId="math6-s1-lesson1"
      sectionLabel="Toán 6 · Bài 1 · trang 5–8"
      trailTitle="Hành trình chinh phục tập hợp"
      introTitle="Bài 1 · Tập hợp"
      introTitleVi="Học định nghĩa qua ví dụ, sau đó luyện 6 trò chơi"
      introDescription="Mở từng thẻ kiến thức để xem giải thích. Sáu trò chơi có 10 câu, tối đa 1.000 điểm mỗi trò và luôn lưu điểm tốt nhất."
      foundations={lesson.foundations}
      foundationVisual={<MathConceptVisuals key={lesson.lesson_id} lessonId={lesson.lesson_id} title={lesson.lesson.title} chapter={lesson.lesson.chapter} lead="Quan sát, phân loại, dùng kí hiệu và chuyển đổi giữa hai cách mô tả tập hợp." foundations={lesson.foundations} />}
      foundationVisualIndex={1}
      games={lesson.rounds}
      help={lesson.help}
      meta={META}
      listening={false}
      questionEmphasis="prompt"
      speechLang="vi-VN"
    />
    <aside className="lesson-card section-knowledge-footer"><span className="eyebrow">Mở rộng · không tính điểm bắt buộc</span><h3>Em có biết?</h3><p>Georg Cantor góp phần phát triển lí thuyết tập hợp. Tập hợp có thể hữu hạn hoặc vô hạn; “giao” của hai tập hợp gồm những phần tử chung. Nội dung này chỉ để khám phá thêm.</p></aside>
  </>;
}
