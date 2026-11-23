import type { Course, CourseCatalog } from "../../curriculum/courseCatalog";
import { isCourseOpenable } from "../../curriculum/courseRegistry";

function CourseCard({ course, catalog, onSelect }: { course: Course; catalog: CourseCatalog; onSelect: (courseId: string) => void }) {
  const available = isCourseOpenable(course.id, catalog);
  const awaitingRenderer = course.status === "available" && !available;
  return <article className={`course-card course-card--${course.status}`}>
    <header>
      <span>{course.subject_label} · Lớp {course.grade} · Học kỳ {course.semester}</span>
      <strong>{available ? "Đang mở" : awaitingRenderer ? "Chưa hỗ trợ" : "Sắp có"}</strong>
    </header>
    <h2>{course.title}</h2>
    <p>{course.description}</p>
    <footer>
      <small>{available ? `${course.branch_ids.length} phần học · bản ${course.content_version}` : awaitingRenderer ? "Nội dung chưa có giao diện tương thích" : "Chưa có nội dung học"}</small>
      <button type="button" disabled={!available} onClick={() => onSelect(course.id)}>
        {available ? "Vào học" : "Đang chuẩn bị"}
      </button>
    </footer>
  </article>;
}

export function CourseLibrary({ catalog, onSelect }: { catalog: CourseCatalog; onSelect: (courseId: string) => void }) {
  return <section className="course-library" aria-labelledby="course-library-title">
    <header className="course-library-hero">
      <span className="eyebrow">Thư viện luyện tập đa môn · Lớp 6</span>
      <h1 id="course-library-title">Chọn môn học và học kỳ</h1>
      <p>Học Tiếng Anh và Toán trong cùng một ứng dụng. Điểm và tiến độ được lưu riêng theo môn, khóa và bài.</p>
    </header>
    <div className="course-library-grid">
      {catalog.courses.map((course) => <CourseCard key={course.id} course={course} catalog={catalog} onSelect={onSelect} />)}
    </div>
  </section>;
}
