import { lazy, Suspense, useEffect, useState } from "react";
import bonusJson from "../../../../data/lessons/unit4_bonus.json";
import { useAuth } from "../../auth/AuthProvider";
import type { UnitSummary } from "../../auth/authApi";
import { useProgress } from "../../progress/ProgressProvider";
import type { ReviewTarget } from "../../reviewTarget";
import { validateBonusLesson, type BonusLesson } from "../bonus/bonusEngine";
import { Unit4Communication, Unit4LookingBack, Unit4Project, Unit4Skills1, Unit4Skills2 } from "./Unit4Phase2Sections";
import { Unit4Acl1, Unit4Acl2, Unit4GettingStarted } from "./Unit4Sections";

const Bonus = lazy(() => import("../bonus/Bonus").then((module) => ({ default: module.Bonus })));
const bonusLesson = validateBonusLesson(bonusJson as BonusLesson);

type Unit4Section = "getting-started" | "closer-look-1" | "closer-look-2" | "communication" | "skills-1" | "skills-2" | "looking-back" | "project" | "bonus";
const SECTIONS: Array<{ id: Unit4Section; title: string; titleVi: string; available: boolean }> = [
  { id: "getting-started", title: "Getting Started", titleVi: "Lost in the old town", available: true },
  { id: "closer-look-1", title: "A Closer Look 1", titleVi: "Địa điểm · mô tả · âm", available: true },
  { id: "closer-look-2", title: "A Closer Look 2", titleVi: "Tính từ so sánh hơn", available: true },
  { id: "communication", title: "Communication", titleVi: "Giao tiếp chỉ đường", available: true },
  { id: "skills-1", title: "Skills 1", titleVi: "Đọc · nói", available: true },
  { id: "skills-2", title: "Skills 2", titleVi: "Nghe · viết", available: true },
  { id: "looking-back", title: "Looking Back", titleVi: "Ôn tập Unit 4", available: true },
  { id: "project", title: "Project", titleVi: "Dự án khu phố", available: true },
  { id: "bonus", title: "Bonus", titleVi: "3 màn thưởng", available: true },
];

function Unit4Dashboard({ section }: { section: Unit4Section }) {
  const { user, logout, getUnitSummary } = useAuth();
  const { lastResult } = useProgress();
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void getUnitSummary("unit4").then((value) => { setSummary(value); setError(""); }).catch((value) => setError(value instanceof Error ? value.message : "Không tải được tiến độ Unit 4."));
  }, [getUnitSummary, section, lastResult]);
  const percent = Math.max(0, Math.min(100, Math.round(summary?.completion_percent ?? 0)));
  const completed = summary?.progress?.filter((item) => item.completed).length ?? 0;
  return <section className="unit-dashboard" aria-label="Tiến độ Unit 4">
    <div className="student-chip"><span aria-hidden="true">🗺️</span><div><small>Người học</small><strong>{user?.username}</strong></div></div>
    <div className="unit-metrics">
      <div><span aria-hidden="true">✅</span><small>Đã hoàn thành</small><strong>{completed}/42</strong></div>
      <div><span aria-hidden="true">⭐</span><small>Điểm Unit 4</small><strong>{summary ? `${summary.earned_score ?? 0}/${summary.max_score ?? 42000}` : "—"}</strong></div>
      <div className="unit-completion"><span aria-hidden="true">🎯</span><small>Tỷ lệ điểm</small><strong>{summary ? `${percent}%` : "—"}</strong><span className="unit-completion-track" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span></div>
    </div>
    <div className="student-actions">{error && <button type="button" onClick={() => location.reload()} title={error}>Tải lại</button>}<button type="button" onClick={() => void logout()}>Đăng xuất</button></div>
  </section>;
}

export function Unit4() {
  const [section, setSection] = useState<Unit4Section>("getting-started");
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  function improve(target: ReviewTarget) {
    setReviewTarget(target);
    const id = target.activityId;
    if (id.startsWith("unit4-getting-")) setSection("getting-started");
    else if (id.startsWith("unit4-acl1-")) setSection("closer-look-1");
    else if (id.startsWith("unit4-acl2-")) setSection("closer-look-2");
    else if (id.startsWith("unit4-communication-")) setSection("communication");
    else if (id.startsWith("unit4-skills1-")) setSection("skills-1");
    else if (id.startsWith("unit4-skills2-")) setSection("skills-2");
    else if (id.startsWith("unit4-looking-back-")) setSection("looking-back");
    else if (id.startsWith("unit4-project-")) setSection("project");
  }
  const selected = SECTIONS.find((item) => item.id === section)!;
  return <>
    <Unit4Dashboard section={section} />
    <header className="unit-header">
      <span className="eyebrow">English Quest</span>
      <div className="unit-identity"><span className="unit-number" aria-label="Unit 4">4</span><div><span>Unit 4</span><h1>My Neighbourhood</h1><p>Khu phố của em</p></div></div>
      <nav className="major-nav" aria-label="Các phần lớn của Unit 4">
        {SECTIONS.map((item) => <button type="button" key={item.id} aria-current={section === item.id ? "page" : undefined} onClick={() => { setReviewTarget(null); setSection(item.id); }}><strong>{item.title}</strong><span>{item.available ? item.titleVi : `${item.titleVi} · sắp mở`}</span></button>)}
      </nav>
    </header>
    <section className="section-overview" aria-labelledby="unit4-section-title"><div className="section-guide"><span className="section-kicker">Lời dẫn</span><h2 id="unit4-section-title">{selected.title}</h2><p>{selected.titleVi}</p></div><div className="section-objectives"><strong>Mục tiêu Unit 4</strong><ul><li>Dùng từ chỉ địa điểm và tính từ mô tả khu phố.</li><li>Hỏi, chỉ đường và đưa ra lời gợi ý.</li><li>So sánh hai nơi bằng tính từ so sánh hơn.</li><li>Giữ điểm tốt nhất của mỗi hoạt động trong hồ sơ.</li></ul></div></section>
    <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🧭</span><strong>Đang mở Unit 4…</strong></section>}>
      {section === "getting-started" ? <Unit4GettingStarted reviewTarget={reviewTarget} /> : section === "closer-look-1" ? <Unit4Acl1 reviewTarget={reviewTarget} /> : section === "closer-look-2" ? <Unit4Acl2 reviewTarget={reviewTarget} /> : section === "communication" ? <Unit4Communication reviewTarget={reviewTarget} /> : section === "skills-1" ? <Unit4Skills1 reviewTarget={reviewTarget} /> : section === "skills-2" ? <Unit4Skills2 reviewTarget={reviewTarget} /> : section === "looking-back" ? <Unit4LookingBack reviewTarget={reviewTarget} /> : section === "project" ? <Unit4Project reviewTarget={reviewTarget} /> : <Bonus unitId="unit4" branchTitle="Unit 4" lesson={bonusLesson} onImprove={improve} />}
    </Suspense>
  </>;
}
