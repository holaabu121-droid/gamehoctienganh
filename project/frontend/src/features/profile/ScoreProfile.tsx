import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { activityLabel } from "../../activityLabels";
import { useAuth } from "../../auth/AuthProvider";
import type { ScoreOverview, ScoreProfile as ScoreProfileData } from "../../auth/authApi";

const BRANCH_LABELS: Record<string, string> = { unit1: "Unit 1 · My New School", unit2: "Unit 2 · My House", unit3: "Unit 3 · My Friends", review1: "Review 1 · Units 1–2–3", unit4: "Unit 4 · My Neighbourhood", unit5: "Unit 5 · Natural Wonders of Viet Nam", unit6: "Unit 6 · Our Tet Holiday", review2: "Review 2 · Units 4–5–6", unit7: "Unit 7 · Television", unit8: "Unit 8 · Sports and Games", unit9: "Unit 9 · Cities of the World", review3: "Review 3 · Units 7–8–9", unit10: "Unit 10 · Our Houses in the Future", unit11: "Unit 11 · Our Greener World", unit12: "Unit 12 · Robots", review4: "Review 4 · Units 10–11–12" };
function branchLabel(branchId: string) {
  if (BRANCH_LABELS[branchId]) return BRANCH_LABELS[branchId];
  const lesson = branchId.match(/^math6-s[12]-lesson(\d+)$/);
  if (lesson) return `Bài ${lesson[1]}`;
  const informaticsLesson = branchId.match(/^informatics6-s[12]-lesson(\d+)$/);
  if (informaticsLesson) return `Tin học · Bài ${informaticsLesson[1]}`;
  const vietnameseLesson = branchId.match(/^vietnamese6-s[12]-lesson(\d+)$/);
  if (vietnameseLesson) return `Ngữ văn · Bài ${vietnameseLesson[1]}`;
  const scienceLesson = branchId.match(/^science6-l(\d+)$/);
  if (scienceLesson) return `Khoa học tự nhiên · Bài ${Number(scienceLesson[1])}`;
  if (branchId === "vietnamese6-s1-review") return "Ngữ văn · Ôn tập học kỳ I";
  if (branchId === "vietnamese6-s2-review") return "Ngữ văn · Ôn tập học kỳ II";
  const chapterPart = branchId.match(/^math6-s[12]-chapter(\d+)-(practice|review)(\d*)$/);
  if (chapterPart) return chapterPart[2] === "review" ? `Bài tập cuối Chương ${chapterPart[1]}` : `Chương ${chapterPart[1]} · Luyện tập chung${chapterPart[3] ? ` ${chapterPart[3]}` : ""}`;
  if (branchId === "math6-s2-final-review") return "Ôn tập cuối năm";
  if (branchId.includes("activity-")) return "Hoạt động thực hành trải nghiệm";
  return branchId;
}
const formatNumber = (value: number) => value.toLocaleString("vi-VN");
function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa học";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function ScoreProfile({ courseId }: { courseId: string }) {
  const { downloadBackup, getScoreOverview, getScoreProfile, logout, restoreBackup } = useAuth();
  const [profile, setProfile] = useState<ScoreProfileData | null>(null);
  const [overview, setOverview] = useState<ScoreOverview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [backupBusy, setBackupBusy] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  const load = useMemo(() => async () => {
    setLoading(true); setError("");
    try {
      const [nextProfile, nextOverview] = await Promise.all([getScoreProfile(courseId), getScoreOverview()]);
      setProfile(nextProfile); setOverview(nextOverview);
    }
    catch (value) { setError(value instanceof Error ? value.message : "Không tải được hồ sơ điểm."); }
    finally { setLoading(false); }
  }, [courseId, getScoreOverview, getScoreProfile]);
  useEffect(() => { void load(); }, [load]);
  if (loading && (!profile || !overview)) return <section className="lesson-card auth-loading" role="status"><span aria-hidden="true">📊</span><strong>Đang tổng hợp thành tích tốt nhất…</strong></section>;
  if (!profile || !overview) return <section className="lesson-card profile-error"><h2>Hồ sơ học tập</h2><p className="auth-error">{error}</p><button className="primary-button" type="button" onClick={() => void load()}>Tải lại</button></section>;
  const currentCourse = overview.courses.find(course => course.course_id === profile.course_id);
  async function exportProgress() {
    setBackupBusy(true); setBackupMessage("");
    try {
      const download = await downloadBackup();
      const url = URL.createObjectURL(download.blob);
      const link = document.createElement("a");
      link.href = url; link.download = download.filename; link.click();
      URL.revokeObjectURL(url);
      setBackupMessage("Đã tạo tệp sao lưu. Em có thể lưu tệp này vào Google Drive.");
    } catch (value) {
      setBackupMessage(value instanceof Error ? value.message : "Không tạo được bản sao lưu.");
    } finally { setBackupBusy(false); }
  }
  async function importProgress(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!window.confirm("Khôi phục sẽ gộp tiến độ trong tệp với điểm tốt nhất hiện tại. Tiếp tục?")) return;
    setBackupBusy(true); setBackupMessage("");
    try {
      const backup = JSON.parse(await file.text()) as unknown;
      const result = await restoreBackup(backup);
      await load();
      setBackupMessage(`Đã khôi phục ${result.counts.activities} hoạt động và ${result.counts.questions} câu từ tài khoản ${result.source_username}.`);
    } catch (value) {
      setBackupMessage(value instanceof Error ? value.message : "Tệp sao lưu không hợp lệ.");
    } finally { setBackupBusy(false); }
  }
  return <section className="score-profile">
    <header className="profile-hero">
      <div><span className="eyebrow">Hồ sơ dành cho học sinh và phụ huynh</span><h1>{profile.user.username}</h1><p>{currentCourse?.title ?? profile.course_id} · Chỉ hiển thị thành tích tốt nhất. Lượt chơi thấp hơn vẫn giúp luyện tập nhưng không làm giảm điểm.</p></div>
      <div className="student-actions"><button type="button" onClick={() => void load()}>Làm mới</button><button type="button" onClick={() => void logout()}>Đăng xuất</button></div>
    </header>
    <section className="lesson-card profile-section profile-backup"><header><span className="eyebrow">Sao lưu an toàn</span><h2>Chuyển tiến độ qua máy khác</h2><p>Tệp sao lưu không chứa PIN hoặc phiên đăng nhập. Hãy lưu tệp vào Google Drive, OneDrive hoặc USB; đăng nhập tài khoản đích rồi chọn tệp để khôi phục.</p></header><div><button type="button" onClick={() => void exportProgress()} disabled={backupBusy}>Tải tệp sao lưu</button><label className={backupBusy ? "is-disabled" : ""}>Chọn tệp để khôi phục<input type="file" accept="application/json,.json" onChange={(event) => void importProgress(event)} disabled={backupBusy} /></label></div>{backupMessage && <p role="status">{backupMessage}</p>}</section>
    <section className="lesson-card profile-section profile-overview"><header><span className="eyebrow">Tổng tất cả môn</span><h2>Thành tích của các môn học</h2><p>Các khóa đang lên kế hoạch nhưng chưa có bài học không được tính vào mẫu số.</p></header><div className="profile-summary-grid"><article className="profile-summary-card profile-summary-card--main"><span>Tổng điểm tốt nhất toàn bộ môn học</span><strong>{formatNumber(overview.grand_total.earned_score)} / {formatNumber(overview.grand_total.max_score)}</strong><em>{overview.grand_total.percent}%</em><div className="profile-score-track"><i style={{ width: `${Math.min(100, overview.grand_total.percent)}%` }} /></div></article><article className="profile-summary-card"><span>Tổng hoạt động hoàn thành</span><strong>{overview.grand_total.completed_activities}/{overview.grand_total.total_activities}</strong><em>trên các khóa có nội dung</em></article><article className="profile-summary-card"><span>Tổng điểm thưởng Bonus</span><strong>{formatNumber(overview.grand_total.bonus_reward_total)}</strong><em>không cộng vào điểm học tập</em></article></div><div className="profile-subject-grid">{overview.subjects.map(subject=><article key={subject.subject}><header><span>Môn học</span><strong>{subject.subject_label}</strong></header><b>{formatNumber(subject.earned_score)} / {formatNumber(subject.max_score)}</b><div className="profile-score-track"><i style={{width:`${Math.min(100,subject.percent)}%`}}/></div><footer><span>{subject.percent}% · {subject.completed_activities}/{subject.total_activities} hoạt động</span><small>{subject.course_count} khóa có nội dung</small></footer></article>)}</div><div className="profile-course-overview"><h3>Điểm theo học kỳ / khóa</h3>{overview.courses.map(course=><article key={course.course_id} data-current={course.course_id===profile.course_id||undefined}><div><strong>{course.title}</strong><span>{course.subject_label} · Lớp {course.grade} · Học kỳ {course.semester}</span></div><b>{formatNumber(course.earned_score)} / {formatNumber(course.max_score)}</b><span>{course.percent}%</span><time>{formatDate(course.last_updated)}</time></article>)}</div></section>
    <section className="profile-current-course" aria-labelledby="current-course-score"><header><span className="eyebrow">Khóa đang xem</span><h2 id="current-course-score">{currentCourse?.title ?? profile.course_id}</h2></header><div className="profile-summary-grid">
      <article className="profile-summary-card profile-summary-card--main"><span>Điểm tốt nhất khóa đang xem</span><strong>{formatNumber(profile.course_best.earned_score)} / {formatNumber(profile.course_best.max_score)}</strong><em>{profile.course_best.percent}%</em><div className="profile-score-track"><i style={{ width: `${Math.min(100, profile.course_best.percent)}%` }} /></div></article>
      <article className="profile-summary-card"><span>Hoạt động hoàn thành trong khóa</span><strong>{profile.course_best.completed_activities}/{profile.course_best.total_activities}</strong><em>theo các Unit và Review</em></article>
      <article className="profile-summary-card"><span>Chuỗi học tốt nhất</span><strong>{profile.best_streak} ngày</strong><em>Hiện tại: {profile.current_streak} ngày</em></article>
      <article className="profile-summary-card"><span>Điểm thưởng Bonus của khóa</span><strong>{formatNumber(profile.bonus_reward_total)}</strong><em>tách khỏi điểm học tập</em></article>
    </div></section>
    <section className="lesson-card profile-section"><header><span className="eyebrow">Điểm theo phần học</span><h2>Thành tích tốt nhất từng bài và phần ôn tập</h2></header><div className="profile-branch-grid">{profile.branches.map((branch) => <article key={branch.unit_id}><div><strong>{branchLabel(branch.unit_id)}</strong><span>{branch.completed_activities}/{branch.total_activities} hoạt động</span></div><b>{formatNumber(branch.earned_score)} / {formatNumber(branch.max_score)}</b><div className="profile-score-track"><i style={{ width: `${Math.min(100, branch.percent)}%` }} /></div><footer><span>{branch.percent}%</span><time>{formatDate(branch.last_updated)}</time></footer></article>)}</div></section>
    <section className="lesson-card profile-section"><header><span className="eyebrow">Gợi ý luyện tập cá nhân</span><h2>Câu bị bỏ qua và câu cần cải thiện</h2><p>Mỗi phần hiển thị tối đa 5 câu đã bỏ qua và 5 câu có điểm thấp nhất. Điểm tốt nhất cũ luôn được giữ khi em làm lại.</p></header>{profile.recommendations.length?<div className="profile-recommendations">{profile.recommendations.map(item=><article key={`${item.unit_id}-${item.activity_id}`}><header><strong>{activityLabel(item.activity_id)}</strong><span>{branchLabel(item.unit_id)}</span></header><div><section><h3>Bị bỏ qua</h3>{item.skipped_questions.length?<ol>{item.skipped_questions.map(question=><li key={question.question_index}>Câu {question.question_index+1}</li>)}</ol>:<p>Không có</p>}</section><section><h3>Thành tích thấp</h3>{item.weak_questions.length?<ol>{item.weak_questions.map(question=><li key={question.question_index}>Câu {question.question_index+1} · {question.earned_score}/100</li>)}</ol>:<p>Chưa có</p>}</section></div></article>)}</div>:<p className="profile-empty">Chưa có câu nào cần gợi ý. Hãy hoàn thành một trò chơi để hệ thống phân tích.</p>}</section>
    <section className="lesson-card profile-section"><header><span className="eyebrow">Lịch sử cải thiện</span><h2>Các mốc thành tích tốt nhất</h2><p>Chỉ ghi khi điểm tốt nhất tăng, giúp phụ huynh xem nhanh tiến bộ thật.</p></header>{profile.best_history.length ? <div className="profile-history"><div className="profile-history-head"><span>Thời gian</span><span>Bài học</span><span>Điểm tốt nhất</span><span>Mức tăng</span></div>{profile.best_history.map((item) => <article key={item.id}><time>{formatDate(item.recorded_at)}</time><div><strong>{activityLabel(item.activity_id)}</strong><span>{branchLabel(item.unit_id)}</span></div><b>{formatNumber(item.new_best)}/{formatNumber(item.max_score)}</b><em>+{formatNumber(item.improvement)}</em></article>)}</div> : <p className="profile-empty">Chưa có mốc điểm mới. Hãy hoàn thành game đầu tiên để bắt đầu lịch sử.</p>}{error && <p className="auth-error">{error}</p>}</section>
  </section>;
}
