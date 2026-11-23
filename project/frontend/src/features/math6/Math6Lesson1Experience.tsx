import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import type { CourseExperienceDescriptor } from "../../curriculum/courseRegistry";
import { ScoreProfile } from "../profile/ScoreProfile";

type Props = {
  courseId: string;
  descriptor: CourseExperienceDescriptor;
  onChooseCourse: () => void;
};
type MathMessage = {
  source?: unknown;
  kind?: unknown;
  student?: unknown;
  knowledge?: unknown;
  earnedScore?: unknown;
  questionScores?: unknown;
  height?: unknown;
};

const UNIT_ID = "math6-bai1-v054";

/**
 * The verified Toan 6 v0.5.4 lesson remains an isolated HTML game.
 * Its quiz generation, 50 original questions, hints and time scoring are
 * unchanged. Only completed test scores are synced to the authenticated API.
 */
export function Math6Lesson1Experience({ courseId, onChooseCourse }: Props) {
  const { user, saveActivityProgress } = useAuth();
  const frame = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(1120);
  const [showProfile, setShowProfile] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const student = String(user?.username ?? "");
  const sourceUrl = useMemo(() => "/math6-bai1/index.html?student=" + encodeURIComponent(student), [student]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (!event.data || typeof event.data !== "object") return;
      const data = event.data as MathMessage;
      if (data.source !== "math6-bai1-v054") return;

      if (data.kind === "resize") {
        const requested = Number(data.height);
        if (Number.isFinite(requested) && requested >= 400 && requested <= 20000) {
          setHeight(Math.min(20000, Math.max(600, Math.ceil(requested) + 20)));
        }
        return;
      }

      if (data.kind !== "quiz-completed" || data.student !== student) return;
      const knowledge = Number(data.knowledge);
      const scores = data.questionScores;
      if (![1, 2].includes(knowledge) || !Array.isArray(scores) || scores.length !== 10) return;
      if (!scores.every(value => Number.isInteger(value) && value >= 0 && value <= 100)) return;
      const earned = scores.reduce<number>((sum, score) => sum + Number(score), 0);
      if (data.earnedScore !== earned) return;

      const activityId = UNIT_ID + "-kn" + knowledge;
      setSyncMessage("Đang đồng bộ điểm Toán với hồ sơ học sinh…");
      void saveActivityProgress(UNIT_ID, activityId, earned, 1000, true, scores as number[])
        .then(() => setSyncMessage("Điểm Toán đã được lưu vào hồ sơ học sinh."))
        .catch(() => setSyncMessage("Chưa đồng bộ được điểm lên hồ sơ. Bản trên thiết bị vẫn được giữ; mở lại bài Toán để thử đồng bộ."));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [saveActivityProgress, student]);

  return <main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Điều hướng môn Toán">
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn và học kỳ</span></button>
        <button type="button" aria-current={!showProfile ? "page" : undefined} onClick={() => setShowProfile(false)}>
          <strong>Bài 1</strong><span>Tập hợp · 50 câu</span>
        </button>
        <button type="button" aria-current={showProfile ? "page" : undefined} onClick={() => setShowProfile(true)}>
          <strong>Hồ sơ</strong><span>Điểm và tiến độ học</span>
        </button>
      </nav>
      {showProfile
        ? <ScoreProfile courseId={courseId} />
        : <section aria-label="Toán 6 Bài 1 – Tập hợp">
          <div className="lesson-card" style={{marginBottom: 14}}>
            <h1>Toán 6 · Bài 1: Tập hợp</h1>
            <p>Học hai kiến thức nền, luyện tập với ngân hàng 50 câu. Mỗi đề gồm 6 câu luyện tập và 4 câu vận dụng. Kết quả hoàn thành được lưu theo tài khoản học sinh.</p>
            {syncMessage && <p role="status">{syncMessage}</p>}
          </div>
          <iframe
            ref={frame}
            title="Ứng dụng tương tác Toán 6 Bài 1 – 50 câu"
            src={sourceUrl}
            style={{width:"100%",height:height+"px",border:"0",background:"#f5f7fc",display:"block"}}
          />
          <p className="muted small">Đề đang làm dở được giữ trên trình duyệt này theo từng tài khoản. Điểm của bài hoàn thành được đồng bộ về hồ sơ; không thay đổi cách chấm hoặc câu hỏi trong bản v0.5.4.</p>
        </section>}
    </div>
  </main>;
}
