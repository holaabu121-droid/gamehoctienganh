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

const LESSONS = {
  1: { unitId: "math6-bai1-v054", name: "Bài 1: Tập hợp", src: "/math6-bai1/index.html" },
  2: { unitId: "math6-bai2-v01", name: "Bài 2: Cách ghi số tự nhiên", src: "/math6-bai2/index.html" },
} as const;

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
  const [lesson, setLesson] = useState<1 | 2>(1);
  const selected = LESSONS[lesson];
  const [syncMessage, setSyncMessage] = useState("");

  const student = String(user?.username ?? "");
  const sourceUrl = useMemo(() => selected.src + "?student=" + encodeURIComponent(student), [student, lesson]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (!event.data || typeof event.data !== "object") return;
      const data = event.data as MathMessage;
      if (data.source !== selected.unitId) return;

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

      const activityId = lesson === 1
        ? selected.unitId + "-kn" + knowledge
        : selected.unitId + (knowledge === 1 ? "-tp" : "-lm");
      setSyncMessage("Đang đồng bộ điểm Toán với hồ sơ học sinh…");
      // Questions are randomized on each attempt. Never merge per-question
      // scores by ordinal position across different quizzes: retain the
      // best total for the activity and keep full per-question detail locally.
      void saveActivityProgress(selected.unitId, activityId, earned, 1000, true)
        .then(() => setSyncMessage("Điểm Toán đã được lưu vào hồ sơ học sinh."))
        .catch(() => setSyncMessage("Chưa đồng bộ được điểm lên hồ sơ. Bản trên thiết bị vẫn được giữ; mở lại bài Toán để thử đồng bộ."));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [saveActivityProgress, student, lesson]);

  return <main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Điều hướng môn Toán">
        <button type="button" onClick={onChooseCourse}><strong>Thư viện</strong><span>Đổi môn và học kỳ</span></button>
        <button type="button" aria-current={!showProfile && lesson === 1 ? "page" : undefined} onClick={() => { setLesson(1); setShowProfile(false); setHeight(1120); setSyncMessage(""); }}>
          <strong>Bài 1</strong><span>Tập hợp · 50 câu</span>
        </button>
        <button type="button" aria-current={!showProfile && lesson === 2 ? "page" : undefined} onClick={() => { setLesson(2); setShowProfile(false); setHeight(1120); setSyncMessage(""); }}>
          <strong>Bài 2</strong><span>Cách ghi số tự nhiên · 50 câu</span>
        </button>
        <button type="button" aria-current={showProfile ? "page" : undefined} onClick={() => setShowProfile(true)}>
          <strong>Hồ sơ</strong><span>Điểm và tiến độ học</span>
        </button>
      </nav>
      {showProfile
        ? <ScoreProfile courseId={courseId} />
        : <section aria-label={selected.name}>
          <div className="lesson-card" style={{marginBottom: 14}}>
            <h1>Toán 6 · {selected.name}</h1>
            <p>Hai kiến thức nền và 50 câu hỏi cho mỗi bài. Mỗi đề gồm 6 luyện tập và 4 vận dụng. Tiến độ từng bài được tách biệt, điểm tốt nhất được lưu theo tài khoản.</p>
            {syncMessage && <p role="status">{syncMessage}</p>}
          </div>
          <iframe
            key={lesson}
            ref={frame}
            title={"Ứng dụng tương tác Toán 6 " + selected.name + " – 50 câu"}
            src={sourceUrl}
            style={{width:"100%",height:height+"px",border:"0",background:"#f5f7fc",display:"block"}}
          />
          <p className="muted small">Đề đang làm dở được giữ trên trình duyệt này theo từng tài khoản. Điểm của bài hoàn thành được đồng bộ về hồ sơ; không thay đổi cách chấm riêng của từng bài.</p>
        </section>}
    </div>
  </main>;
}
