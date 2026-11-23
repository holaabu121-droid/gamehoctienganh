import { lazy, Suspense, useCallback, useEffect, useState, type ComponentType } from "react";
import unitJson from "../../data/lessons/unit3_structure.json";
import { AuthGate } from "./auth/AuthGate";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { ProgressProvider, useProgress } from "./progress/ProgressProvider";
import { validateUnit3Structure, type Unit3SectionId, type Unit3Structure } from "./unit3Structure";
import type { ReviewTarget } from "./reviewTarget";
import { CourseLibrary } from "./features/courses/CourseLibrary";
import { validateCourseCatalog, type CourseCatalog } from "./curriculum/courseCatalog";
import { courseExperienceFor, type CourseExperienceDescriptor, type CourseRendererKey, type English6Semester1Branch, type English6Semester2Branch, type Math6Semester1Branch, type Math6Semester2Branch, type Informatics6Semester1Branch, type Informatics6Semester2Branch, type Vietnamese6Semester1Branch, type Vietnamese6Semester2Branch } from "./curriculum/courseRegistry";
import { authApi } from "./auth/authApi";
import { MATH_SEMESTER_1_GENERATED_BRANCHES } from "./features/math6/mathSemester1Curriculum";
import { MATH_SEMESTER_2_GENERATED_BRANCHES } from "./features/math6/mathSemester2Curriculum";
import { INFORMATICS_S1_BRANCHES, INFORMATICS_S2_BRANCHES } from "./features/informatics6/informaticsCurriculum";
import { VIETNAMESE_S1_BRANCHES, VIETNAMESE_S2_BRANCHES } from "./features/vietnamese6/vietnameseCurriculum";
import { SCIENCE_S1_LESSON_INDEX, SCIENCE_S2_LESSON_INDEX } from "./features/science6/scienceLessonIndex";

const unit = validateUnit3Structure(unitJson as Unit3Structure);
const Unit1 = lazy(() => import("./features/unit1/Unit1").then((module) => ({ default: module.Unit1 })));
const Unit2 = lazy(() => import("./features/unit2/Unit2").then((module) => ({ default: module.Unit2 })));
const ACloserLook1 = lazy(() => import("./features/a-closer-look-1/ACloserLook1").then((module) => ({ default: module.ACloserLook1 })));
const ACloserLook2 = lazy(() => import("./features/a-closer-look-2/ACloserLook2").then((module) => ({ default: module.ACloserLook2 })));
const Communication = lazy(() => import("./features/communication/Communication").then((module) => ({ default: module.Communication })));
const LookingBack = lazy(() => import("./features/looking-back/LookingBack").then((module) => ({ default: module.LookingBack })));
const Skills1 = lazy(() => import("./features/skills-1/Skills1").then((module) => ({ default: module.Skills1 })));
const Skills2 = lazy(() => import("./features/skills-2/Skills2").then((module) => ({ default: module.Skills2 })));
const ListenAndRead = lazy(() => import("./features/listen-read/ListenAndRead").then((module) => ({ default: module.ListenAndRead })));
const Part2Games = lazy(() => import("./features/part2-games/Part2Games").then((module) => ({ default: module.Part2Games })));
const Part3Games = lazy(() => import("./features/part3-games/Part3Games").then((module) => ({ default: module.Part3Games })));
const TypingQuest = lazy(() => import("./features/typing-quest/TypingQuest").then((module) => ({ default: module.TypingQuest })));
const WordWebs = lazy(() => import("./features/word-webs/WordWebs").then((module) => ({ default: module.WordWebs })));
const FriendDetective = lazy(() => import("./features/friend-detective/FriendDetective").then((module) => ({ default: module.FriendDetective })));
const Project = lazy(() => import("./features/project/Project").then((module) => ({ default: module.Project })));
const Bonus = lazy(() => import("./features/bonus/Bonus").then((module) => ({ default: module.Bonus })));
const Review1 = lazy(() => import("./features/review/Review1").then((module) => ({ default: module.Review1 })));
const Unit4 = lazy(() => import("./features/unit4/Unit4").then((module) => ({ default: module.Unit4 })));
const Unit5 = lazy(() => import("./features/unit5/Unit5").then((module) => ({ default: module.Unit5 })));
const Unit6 = lazy(() => import("./features/unit6/Unit6").then((module) => ({ default: module.Unit6 })));
const Review2 = lazy(() => import("./features/review2/Review2").then((module) => ({ default: module.Review2 })));
const Unit7 = lazy(() => import("./features/unit7/Unit7").then((module) => ({ default: module.Unit7 })));
const Unit8 = lazy(() => import("./features/unit8/Unit8").then((module) => ({ default: module.Unit8 })));
const Unit9 = lazy(() => import("./features/unit9/Unit9").then((module) => ({ default: module.Unit9 })));
const Review3 = lazy(() => import("./features/review3/Review3").then((module) => ({ default: module.Review3 })));
const Unit10 = lazy(() => import("./features/unit10/Unit10").then((module) => ({ default: module.Unit10 })));
const Unit11 = lazy(() => import("./features/unit11/Unit11").then((module) => ({ default: module.Unit11 })));
const Unit12 = lazy(() => import("./features/unit12/Unit12").then((module) => ({ default: module.Unit12 })));
const Review4 = lazy(() => import("./features/review4/Review4").then((module) => ({ default: module.Review4 })));
const MathLesson1 = lazy(() => import("./features/math6/MathLesson1").then((module) => ({ default: module.MathLesson1 })));
const MathLesson2 = lazy(() => import("./features/math6/MathLesson2").then((module) => ({ default: module.MathLesson2 })));
const MathLesson3 = lazy(() => import("./features/math6/MathLesson3").then((module) => ({ default: module.MathLesson3 })));
const MathLesson4 = lazy(() => import("./features/math6/MathLesson4").then((module) => ({ default: module.MathLesson4 })));
const MathLesson5 = lazy(() => import("./features/math6/MathLesson5").then((module) => ({ default: module.MathLesson5 })));
const MathChapter1Practice = lazy(() => import("./features/math6/MathChapter1Practice").then((module) => ({ default: module.MathChapter1Practice })));
const MathChapter1Review = lazy(() => import("./features/math6/MathChapter1Review").then((module) => ({ default: module.MathChapter1Review })));
const MathGeneratedBranch = lazy(() => import("./features/math6/MathGeneratedBranch").then((module) => ({ default: module.MathGeneratedBranch })));
const MathSemester2Branch = lazy(() => import("./features/math6/MathSemester2Branch").then((module) => ({ default: module.MathSemester2Branch })));
const InformaticsBranch = lazy(() => import("./features/informatics6/InformaticsBranch").then((module) => ({ default: module.InformaticsBranch })));
const VietnameseBranch = lazy(() => import("./features/vietnamese6/VietnameseBranch").then((module) => ({ default: module.VietnameseBranch })));
const ScienceBranch = lazy(() => import("./features/science6/ScienceBranch").then((module) => ({ default: module.ScienceBranch })));
const ScoreProfile = lazy(() => import("./features/profile/ScoreProfile").then((module) => ({ default: module.ScoreProfile })));
type GettingView = 1 | 2 | 3 | 4 | 5 | "typing";
const GETTING_NAV: Array<{ id: GettingView; label: string; description: string }> = [
  { id: 1, label: "Part 1", description: "Listen and read" },
  { id: 2, label: "Part 2", description: "Fill in the blanks" },
  { id: 3, label: "Part 3", description: "Body Lab" },
  { id: 4, label: "Part 4", description: "Word webs" },
  { id: 5, label: "Part 5", description: "Friend Detective" },
  { id: "typing", label: "Practice", description: "Typing Quest" },
];

function UnitDashboard() {
  const { user, summary, summaryError, logout, refreshSummary } = useAuth();
  const { lastResult } = useProgress();
  useEffect(() => { void refreshSummary("unit3"); }, [lastResult, refreshSummary]);
  const percent = Math.max(0, Math.min(100, Math.round(summary?.completion_percent ?? 0)));
  return <section className="unit-dashboard" aria-label="Tiến độ học tập của em">
    <div className="student-chip"><span aria-hidden="true">👋</span><div><small>Người học</small><strong>{user?.username}</strong></div></div>
    <div className="unit-metrics">
      <div><span aria-hidden="true">🔥</span><small>Chuỗi hiện tại</small><strong>{summary ? summary.current_streak : "—"}</strong></div>
      <div><span aria-hidden="true">🏆</span><small>Chuỗi tốt nhất</small><strong>{summary ? summary.best_streak : "—"}</strong></div>
      <div className="unit-completion"><span aria-hidden="true">📚</span><small>Unit 3</small><strong>{summary ? `${percent}%` : "—"}</strong><span className="unit-completion-track" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span></div>
      {summary?.max_score ? <div><span aria-hidden="true">⭐</span><small>Điểm Unit</small><strong>{summary.earned_score ?? 0}/{summary.max_score}</strong></div> : null}
    </div>
    <div className="student-actions">
      {summaryError && <button type="button" onClick={() => void refreshSummary("unit3")} title={summaryError}>Tải lại tiến độ</button>}
      <button type="button" onClick={() => void logout()}>Đăng xuất</button>
    </div>
    {lastResult && <div className="latest-score" role="status"><small>Kết quả game gần nhất</small><strong>{lastResult.score.earned}/{lastResult.score.max} · {lastResult.score.percent}%</strong><span>{lastResult.score.rankLabel}</span></div>}
  </section>;
}

type CourseRendererProps = { courseId: string; descriptor: CourseExperienceDescriptor; onChooseCourse: () => void };

function English6Semester1Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<English6Semester1Branch>(descriptor.initialBranch as English6Semester1Branch);
  const [sectionId, setSectionId] = useState<Unit3SectionId>("getting-started");
  const [gettingView, setGettingView] = useState<GettingView>(1);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const section = unit.sections.find(({ id }) => id === sectionId)!;
  const gettingContent = gettingView === 1 ? <ListenAndRead /> : gettingView === 2 ? <Part2Games reviewTarget={reviewTarget} /> : gettingView === 3 ? <Part3Games reviewTarget={reviewTarget} /> : gettingView === 4 ? <WordWebs initialQuestionIndex={reviewTarget?.questionIndex} /> : gettingView === 5 ? <FriendDetective reviewTarget={reviewTarget} /> : <TypingQuest />;
  function improveActivity(target: ReviewTarget) {
    const activityId = target.activityId;
    setReviewTarget(target);
    if (activityId.startsWith("unit3-getting-")) {
      setSectionId("getting-started");
      if (activityId.includes("body") || activityId.includes("word-bridge")) setGettingView(3);
      else if (activityId.includes("word-web")) setGettingView(4);
      else if (activityId.includes("friend-detective")) setGettingView(5);
      else if (activityId.includes("typing")) setGettingView("typing");
      else setGettingView(2);
      return;
    }
    if (activityId.includes("a-closer-look1")) setSectionId("closer-look-1");
    else if (activityId.includes("a-closer-look2")) setSectionId("closer-look-2");
    else if (activityId.includes("communication")) setSectionId("communication");
    else if (activityId.includes("skills1")) setSectionId("skills-1");
    else if (activityId.includes("skills2")) setSectionId("skills-2");
    else if (activityId.includes("looking-back")) setSectionId("looking-back");
    else if (activityId.includes("project")) setSectionId("project");
  }

  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Chọn nhánh học cùng cấp">
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm tốt nhất</span></button>
        <button type="button" aria-current={courseBranch === "unit1" ? "page" : undefined} onClick={() => setCourseBranch("unit1")}><strong>Unit 1</strong><span>My New School</span></button>
        <button type="button" aria-current={courseBranch === "unit2" ? "page" : undefined} onClick={() => setCourseBranch("unit2")}><strong>Unit 2</strong><span>My House</span></button>
        <button type="button" aria-current={courseBranch === "unit3" ? "page" : undefined} onClick={() => setCourseBranch("unit3")}><strong>Unit 3</strong><span>My Friends</span></button>
        <button type="button" aria-current={courseBranch === "review1" ? "page" : undefined} onClick={() => setCourseBranch("review1")}><strong>Review 1</strong><span>Units 1–2–3</span></button>
        <button type="button" aria-current={courseBranch === "unit4" ? "page" : undefined} onClick={() => setCourseBranch("unit4")}><strong>Unit 4</strong><span>My Neighbourhood</span></button>
        <button type="button" aria-current={courseBranch === "unit5" ? "page" : undefined} onClick={() => setCourseBranch("unit5")}><strong>Unit 5</strong><span>Natural Wonders</span></button>
        <button type="button" aria-current={courseBranch === "unit6" ? "page" : undefined} onClick={() => setCourseBranch("unit6")}><strong>Unit 6</strong><span>Our Tet Holiday</span></button>
        <button type="button" aria-current={courseBranch === "review2" ? "page" : undefined} onClick={() => setCourseBranch("review2")}><strong>Review 2</strong><span>Units 4–5–6</span></button>
      </nav>
      {courseBranch === "profile" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">📊</span><strong>Đang mở hồ sơ…</strong></section>}><ScoreProfile courseId={courseId} /></Suspense> : courseBranch === "unit1" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🏫</span><strong>Đang mở Unit 1…</strong></section>}><Unit1 /></Suspense> : courseBranch === "unit2" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🏠</span><strong>Đang mở Unit 2…</strong></section>}><Unit2 /></Suspense> : courseBranch === "unit3" ? <>
      <UnitDashboard />
      <header className="unit-header">
        <span className="eyebrow">English Quest</span>
        <div className="unit-identity"><span className="unit-number" aria-label={`Unit ${unit.unit_number}`}>{unit.unit_number}</span><div><span>Unit {unit.unit_number}</span><h1>{unit.unit_title}</h1><p>{unit.unit_title_vi}</p></div></div>
        <nav className="major-nav" aria-label="Các phần lớn của Unit 3">
          {unit.sections.map((item) => <button type="button" key={item.id} aria-current={sectionId === item.id ? "page" : undefined} onClick={() => { setReviewTarget(null); setSectionId(item.id); }}><strong>{item.title}</strong><span>{item.title_vi}</span></button>)}
        </nav>
      </header>

      <section className="section-overview" aria-labelledby="current-section-title">
        <div className="section-guide"><span className="section-kicker">Lời dẫn</span><h2 id="current-section-title">{section.title}</h2><p>{section.lead_vi}</p></div>
        <div className="section-objectives"><strong>Mục tiêu phần học</strong><ul>{section.objectives_vi.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
      </section>

      {sectionId === "getting-started" && <nav className="getting-subnav" aria-label="Các hoạt động trong Getting Started">
        {GETTING_NAV.map((item) => <button type="button" key={String(item.id)} aria-current={gettingView === item.id ? "page" : undefined} onClick={() => { setReviewTarget(null); setGettingView(item.id); }}><strong>{item.label}</strong><span>{item.description}</span></button>)}
      </nav>}

      <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🧭</span><strong>Đang mở hoạt động…</strong></section>}>
        {sectionId === "getting-started" ? gettingContent : sectionId === "closer-look-1" ? <ACloserLook1 reviewTarget={reviewTarget} /> : sectionId === "closer-look-2" ? <ACloserLook2 reviewTarget={reviewTarget} /> : sectionId === "communication" ? <Communication reviewTarget={reviewTarget} /> : sectionId === "skills-1" ? <Skills1 reviewTarget={reviewTarget} /> : sectionId === "skills-2" ? <Skills2 reviewTarget={reviewTarget} /> : sectionId === "looking-back" ? <LookingBack reviewTarget={reviewTarget} /> : sectionId === "project" ? <Project reviewTarget={reviewTarget} /> : <Bonus onImprove={improveActivity} />}
      </Suspense>
      {sectionId !== "bonus" && <aside className="lesson-card section-knowledge-footer"><span className="eyebrow">Kiến thức nền của phần học</span><h3>{section.title}</h3><ul>{section.objectives_vi.map(objective=><li key={objective}>{objective}</li>)}</ul></aside>}
      </> : courseBranch === "review1" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🧭</span><strong>Đang mở Review 1…</strong></section>}><Review1 /></Suspense> : courseBranch === "unit4" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🗺️</span><strong>Đang mở Unit 4…</strong></section>}><Unit4 /></Suspense> : courseBranch === "unit5" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🏞️</span><strong>Đang mở Unit 5…</strong></section>}><Unit5 /></Suspense> : courseBranch === "unit6" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🧧</span><strong>Đang mở Unit 6…</strong></section>}><Unit6 /></Suspense> : <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🇸🇬</span><strong>Đang mở Review 2…</strong></section>}><Review2 /></Suspense>}
    </div>
  </main></ProgressProvider>;
}

function English6Semester2Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<English6Semester2Branch>(descriptor.initialBranch as English6Semester2Branch);
  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Chọn nhánh học cùng cấp">
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm tốt nhất</span></button>
        <button type="button" aria-current={courseBranch === "unit7" ? "page" : undefined} onClick={() => setCourseBranch("unit7")}><strong>Unit 7</strong><span>Television</span></button>
        <button type="button" aria-current={courseBranch === "unit8" ? "page" : undefined} onClick={() => setCourseBranch("unit8")}><strong>Unit 8</strong><span>Sports and Games</span></button>
        <button type="button" aria-current={courseBranch === "unit9" ? "page" : undefined} onClick={() => setCourseBranch("unit9")}><strong>Unit 9</strong><span>Cities of the World</span></button>
        <button type="button" aria-current={courseBranch === "review3" ? "page" : undefined} onClick={() => setCourseBranch("review3")}><strong>Review 3</strong><span>Units 7–8–9</span></button>
        <button type="button" aria-current={courseBranch === "unit10" ? "page" : undefined} onClick={() => setCourseBranch("unit10")}><strong>Unit 10</strong><span>Our Houses in the Future</span></button>
        <button type="button" aria-current={courseBranch === "unit11" ? "page" : undefined} onClick={() => setCourseBranch("unit11")}><strong>Unit 11</strong><span>Our Greener World</span></button>
        <button type="button" aria-current={courseBranch === "unit12" ? "page" : undefined} onClick={() => setCourseBranch("unit12")}><strong>Unit 12</strong><span>Robots</span></button>
        <button type="button" aria-current={courseBranch === "review4" ? "page" : undefined} onClick={() => setCourseBranch("review4")}><strong>Review 4</strong><span>Units 10–11–12</span></button>
      </nav>
      {courseBranch === "profile" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">📊</span><strong>Đang mở hồ sơ…</strong></section>}><ScoreProfile courseId={courseId} /></Suspense> : courseBranch === "review4" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">✅</span><strong>Đang mở Review 4…</strong></section>}><Review4 /></Suspense> : courseBranch === "unit12" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🤖</span><strong>Đang mở Unit 12…</strong></section>}><Unit12 /></Suspense> : courseBranch === "unit11" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🌱</span><strong>Đang mở Unit 11…</strong></section>}><Unit11 /></Suspense> : courseBranch === "unit10" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🏠</span><strong>Đang mở Unit 10…</strong></section>}><Unit10 /></Suspense> : courseBranch === "review3" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🧭</span><strong>Đang mở Review 3…</strong></section>}><Review3 /></Suspense> : courseBranch === "unit9" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🌍</span><strong>Đang mở Unit 9…</strong></section>}><Unit9 /></Suspense> : courseBranch === "unit8" ? <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🏅</span><strong>Đang mở Unit 8…</strong></section>}><Unit8 /></Suspense> : <Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">📺</span><strong>Đang mở Unit 7…</strong></section>}><Unit7 /></Suspense>}
    </div>
  </main></ProgressProvider>;
}

const MATH6_S1_NAV: Array<{ id: Math6Semester1Branch; label: string; title: string }> = [
  { id: "math6-s1-lesson1", label: "Bài 1", title: "Tập hợp" },
  { id: "math6-s1-lesson2", label: "Bài 2", title: "Cách ghi số tự nhiên" },
  { id: "math6-s1-lesson3", label: "Bài 3", title: "Thứ tự trong ℕ" },
  { id: "math6-s1-lesson4", label: "Bài 4", title: "Phép cộng và phép trừ" },
  { id: "math6-s1-lesson5", label: "Bài 5", title: "Phép nhân và phép chia" },
  { id: "math6-s1-chapter1-practice", label: "Luyện tập", title: "Trang 20–21" },
  { id: "math6-s1-chapter1-review", label: "Cuối Chương I", title: "Bài tập tổng hợp" },
  ...MATH_SEMESTER_1_GENERATED_BRANCHES.map((item) => ({ id: item.id as Math6Semester1Branch, label: item.label, title: item.title })),
];

function Math6Semester1Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<Math6Semester1Branch>(descriptor.initialBranch as Math6Semester1Branch);
  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Chọn bài học Toán 6 Học kỳ 1">
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm môn Toán</span></button>
        {MATH6_S1_NAV.map((item) => <button key={item.id} type="button" aria-current={courseBranch === item.id ? "page" : undefined} onClick={() => setCourseBranch(item.id)}><strong>{item.label}</strong><span>{item.title}</span></button>)}
      </nav>
      <Suspense fallback={<section className="lesson-card auth-loading" role="status"><strong>Đang mở bài học Toán…</strong></section>}>
        {courseBranch === "profile" ? <ScoreProfile courseId={courseId} />
          : courseBranch === "math6-s1-lesson1" ? <MathLesson1 />
          : courseBranch === "math6-s1-lesson2" ? <MathLesson2 />
          : courseBranch === "math6-s1-lesson3" ? <MathLesson3 />
          : courseBranch === "math6-s1-lesson4" ? <MathLesson4 />
          : courseBranch === "math6-s1-lesson5" ? <MathLesson5 />
          : courseBranch === "math6-s1-chapter1-practice" ? <MathChapter1Practice />
          : courseBranch === "math6-s1-chapter1-review" ? <MathChapter1Review />
          : <MathGeneratedBranch branchId={courseBranch} />}
      </Suspense>
    </div>
  </main></ProgressProvider>;
}

const MATH6_S2_NAV: Array<{ id: Math6Semester2Branch; label: string; title: string }> = MATH_SEMESTER_2_GENERATED_BRANCHES.map((item) => ({ id: item.id as Math6Semester2Branch, label: item.label, title: item.title }));

function Math6Semester2Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<Math6Semester2Branch>(descriptor.initialBranch as Math6Semester2Branch);
  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Chọn bài học Toán 6 Học kỳ 2">
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm Toán Học kỳ 2</span></button>
        {MATH6_S2_NAV.map((item) => <button key={item.id} type="button" aria-current={courseBranch === item.id ? "page" : undefined} onClick={() => setCourseBranch(item.id)}><strong>{item.label}</strong><span>{item.title}</span></button>)}
      </nav>
      <Suspense fallback={<section className="lesson-card auth-loading" role="status"><strong>Đang mở bài học Toán Học kỳ 2…</strong></section>}>
        {courseBranch === "profile" ? <ScoreProfile courseId={courseId} /> : <MathSemester2Branch branchId={courseBranch} />}
      </Suspense>
    </div>
  </main></ProgressProvider>;
}

type InformaticsBranchId = Informatics6Semester1Branch | Informatics6Semester2Branch;
function Informatics6Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<InformaticsBranchId>(descriptor.initialBranch as InformaticsBranchId);
  const lessons = courseId === "informatics-6-semester-1" ? INFORMATICS_S1_BRANCHES : INFORMATICS_S2_BRANCHES;
  const semester = courseId.endsWith("2") ? "2" : "1";
  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label={`Chọn bài Tin học 6 Học kỳ ${semester}`}>
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm môn Tin học</span></button>
        {lessons.map(item=><button key={item.id} type="button" aria-current={courseBranch === item.id ? "page" : undefined} onClick={()=>setCourseBranch(item.id as InformaticsBranchId)}><strong>Bài {item.number}</strong><span>{item.title}</span></button>)}
      </nav>
      <Suspense fallback={<section className="lesson-card auth-loading" role="status"><strong>Đang mở bài học Tin học…</strong></section>}>
        {courseBranch === "profile" ? <ScoreProfile courseId={courseId}/> : <InformaticsBranch branchId={courseBranch}/>}
      </Suspense>
    </div>
  </main></ProgressProvider>;
}

type VietnameseBranchId = Vietnamese6Semester1Branch | Vietnamese6Semester2Branch;
function Vietnamese6Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<VietnameseBranchId>(descriptor.initialBranch as VietnameseBranchId);
  const lessons = courseId === "vietnamese-6-semester-1" ? VIETNAMESE_S1_BRANCHES : VIETNAMESE_S2_BRANCHES;
  const semester = courseId.endsWith("2") ? "2" : "1";
  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label={`Chọn bài Ngữ văn 6 Học kỳ ${semester}`}>
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm môn Ngữ văn</span></button>
        {lessons.map(item => <button key={item.id} type="button" aria-current={courseBranch === item.id ? "page" : undefined} onClick={() => setCourseBranch(item.id as VietnameseBranchId)}><strong>{item.label}</strong><span>{item.title}</span></button>)}
      </nav>
      <Suspense fallback={<section className="lesson-card auth-loading" role="status"><strong>Đang mở bài học Ngữ văn…</strong></section>}>
        {courseBranch === "profile" ? <ScoreProfile courseId={courseId}/> : <VietnameseBranch branchId={courseBranch}/>}
      </Suspense>
    </div>
  </main></ProgressProvider>;
}

function Science6Experience({ courseId, descriptor, onChooseCourse }: CourseRendererProps) {
  const { saveActivityProgress } = useAuth();
  const [courseBranch, setCourseBranch] = useState<string>(descriptor.initialBranch);
  const lessons = courseId === "science-6-semester-1" ? SCIENCE_S1_LESSON_INDEX : SCIENCE_S2_LESSON_INDEX;
  const semester = courseId.endsWith("2") ? "2" : "1";
  return <ProgressProvider onActivityResult={(result) => saveActivityProgress(result.unitId, result.activityId, result.score.earned, result.score.max, result.completed, result.score.questionScores.map(({ earned }) => earned), result.questions.map((question) => question.skipped ? "skipped" : "scored"))}><main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label={`Chọn bài Khoa học tự nhiên 6 Học kỳ ${semester}`}>
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn · học kỳ</span></button>
        <button type="button" aria-current={courseBranch === "profile" ? "page" : undefined} onClick={() => setCourseBranch("profile")}><strong>Hồ sơ</strong><span>Điểm môn Khoa học tự nhiên</span></button>
        {lessons.map(item => <button key={item.id} type="button" aria-current={courseBranch === item.id ? "page" : undefined} onClick={() => setCourseBranch(item.id)}><strong>Bài {item.number}</strong><span>{item.title}</span></button>)}
      </nav>
      <Suspense fallback={<section className="lesson-card auth-loading" role="status"><strong>Đang mở bài học Khoa học tự nhiên…</strong></section>}>
        {courseBranch === "profile" ? <ScoreProfile courseId={courseId}/> : <ScienceBranch branchId={courseBranch}/>}
      </Suspense>
    </div>
  </main></ProgressProvider>;
}

const COURSE_RENDERERS: Record<CourseRendererKey, ComponentType<CourseRendererProps>> = {
  "english-6-semester-1": English6Semester1Experience,
  "english-6-semester-2": English6Semester2Experience,
  "math-6-semester-1": Math6Semester1Experience,
  "math-6-semester-2": Math6Semester2Experience,
  "informatics-6-semester-1": Informatics6Experience,
  "informatics-6-semester-2": Informatics6Experience,
  "vietnamese-6-semester-1": Vietnamese6Experience,
  "vietnamese-6-semester-2": Vietnamese6Experience,
  "science-6-semester-1": Science6Experience,
  "science-6-semester-2": Science6Experience,
};

function LearningApp() {
  const [catalog, setCatalog] = useState<CourseCatalog | null>(null);
  const [catalogError, setCatalogError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const loadCatalog = useCallback(async () => {
    setCatalogError("");
    try { setCatalog(validateCourseCatalog(await authApi.getCourseCatalog())); }
    catch (error) { setCatalog(null); setCatalogError(error instanceof Error ? error.message : "Không tải được thư viện chương trình."); }
  }, []);
  useEffect(() => { void loadCatalog(); }, [loadCatalog]);
  if (!catalog) return <main className="app-shell auth-shell"><section className="lesson-card auth-loading" role="status"><span aria-hidden="true">📚</span><strong>{catalogError || "Đang tải thư viện chương trình…"}</strong>{catalogError && <button className="primary-button" type="button" onClick={() => void loadCatalog()}>Thử lại</button>}</section></main>;
  const descriptor = selectedCourseId ? courseExperienceFor(selectedCourseId, catalog) : undefined;
  const selectCourse = (courseId: string) => {
    if (!courseExperienceFor(courseId, catalog)) return;
    setSelectedCourseId(courseId);
  };
  if (!selectedCourseId || !descriptor) return <main className="app-shell"><div className="lesson-shell"><CourseLibrary catalog={catalog} onSelect={selectCourse} /></div></main>;
  const CourseRenderer = COURSE_RENDERERS[descriptor.rendererKey];
  return <CourseRenderer key={selectedCourseId} courseId={selectedCourseId} descriptor={descriptor} onChooseCourse={() => setSelectedCourseId(null)} />;
}

function AppGate() {
  const { status } = useAuth();
  if (status === "loading") return <main className="app-shell auth-shell"><div className="auth-loading" role="status"><span aria-hidden="true">🧭</span><strong>Đang mở hành trình học…</strong></div></main>;
  if (status === "anonymous") return <AuthGate />;
  return <LearningApp />;
}

export function App() {
  return <AuthProvider><AppGate /></AuthProvider>;
}
