import { lazy, Suspense, useEffect, useState } from "react";
import reviewBonusJson from "../../../../data/lessons/review1_bonus.json";
import { useAuth } from "../../auth/AuthProvider";
import type { UnitSummary } from "../../auth/authApi";
import { useProgress } from "../../progress/ProgressProvider";
import type { ReviewTarget } from "../../reviewTarget";
import { validateBonusLesson, type BonusLesson } from "../bonus/bonusEngine";

const ReviewLanguage = lazy(() => import("./ReviewLanguage").then((module) => ({ default: module.ReviewLanguage })));
const ReviewSkills = lazy(() => import("./ReviewSkills").then((module) => ({ default: module.ReviewSkills })));
const Bonus = lazy(() => import("../bonus/Bonus").then((module) => ({ default: module.Bonus })));
const bonusLesson = validateBonusLesson(reviewBonusJson as BonusLesson);
type ReviewSection = "language" | "skills" | "bonus";

function ReviewDashboard({ section }: { section: ReviewSection }) {
  const { user, logout, getUnitSummary } = useAuth();
  const { lastResult } = useProgress();
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void getUnitSummary("review1").then((value) => { setSummary(value); setError(""); }).catch((value) => setError(value instanceof Error ? value.message : "Không tải được tiến độ Review.")); }, [getUnitSummary, section, lastResult]);
  const percent = Math.max(0, Math.min(100, Math.round(summary?.completion_percent ?? 0)));
  return <section className="unit-dashboard review-dashboard" aria-label="Tiến độ Review 1">
    <div className="student-chip"><span aria-hidden="true">🧭</span><div><small>Người học</small><strong>{user?.username}</strong></div></div>
    <div className="unit-metrics">
      <div><span aria-hidden="true">✅</span><small>Review 1</small><strong>{summary ? `${percent}%` : "—"}</strong></div>
      <div><span aria-hidden="true">⭐</span><small>Điểm Review</small><strong>{summary ? `${summary.earned_score ?? 0}/${summary.max_score ?? 6000}` : "—"}</strong></div>
      <div className="unit-completion"><span aria-hidden="true">🎯</span><small>Điều kiện Bonus</small><strong>{summary?.core_complete ? "Đủ bài" : "Chưa đủ"}</strong><span className="unit-completion-track" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span></div>
    </div>
    <div className="student-actions">{error && <button type="button" onClick={() => location.reload()} title={error}>Tải lại</button>}<button type="button" onClick={() => void logout()}>Đăng xuất</button></div>
  </section>;
}

export function Review1() {
  const [section, setSection] = useState<ReviewSection>("language");
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  function improve(target: ReviewTarget) {
    setReviewTarget(target);
    setSection(target.activityId.includes("-language-") ? "language" : "skills");
  }
  return <>
    <ReviewDashboard section={section} />
    <header className="unit-header review-header">
      <span className="eyebrow">English Quest · Units 1–2–3</span>
      <div className="unit-identity"><span className="unit-number" aria-label="Review 1">R1</span><div><span>Review 1</span><h1>Review Adventure</h1><p>Ôn tập tổng hợp Units 1–2–3</p></div></div>
      <nav className="major-nav review-nav" aria-label="Các phần của Review 1">
        <button type="button" aria-current={section === "language" ? "page" : undefined} onClick={() => { setReviewTarget(null); setSection("language"); }}><strong>Language</strong><span>Âm · từ vựng · ngữ pháp</span></button>
        <button type="button" aria-current={section === "skills" ? "page" : undefined} onClick={() => { setReviewTarget(null); setSection("skills"); }}><strong>Skills</strong><span>Đọc · nghe · viết</span></button>
        <button type="button" aria-current={section === "bonus" ? "page" : undefined} onClick={() => { setReviewTarget(null); setSection("bonus"); }}><strong>Review Bonus</strong><span>3 màn thưởng</span></button>
      </nav>
    </header>
    <section className="section-overview" aria-labelledby="review-section-title"><div className="section-guide"><span className="section-kicker">Lời dẫn</span><h2 id="review-section-title">{section === "language" ? "Language" : section === "skills" ? "Skills" : "Review Bonus"}</h2><p>{section === "language" ? "Củng cố âm, từ vựng và ngữ pháp trọng tâm của ba Unit đầu." : section === "skills" ? "Dùng bằng chứng để đọc, nghe và chọn câu viết phù hợp." : "Hoàn thành sáu game Review để mở lần lượt ba màn thưởng."}</p></div><div className="section-objectives"><strong>Mục tiêu phần học</strong><ul><li>Mỗi game chính có đúng 10 câu và giữ điểm cao nhất từng câu.</li><li>Điểm Review tách riêng, không làm thay đổi điểm Unit 3.</li><li>Bonus chỉ mở sau khi hoàn thành đủ sáu game.</li></ul></div></section>
    <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🧭</span><strong>Đang mở Review…</strong></section>}>
      {section === "language" ? <ReviewLanguage reviewTarget={reviewTarget} /> : section === "skills" ? <ReviewSkills reviewTarget={reviewTarget} /> : <Bonus unitId="review1" branchTitle="Review 1" lesson={bonusLesson} onImprove={improve} />}
    </Suspense>
  </>;
}

