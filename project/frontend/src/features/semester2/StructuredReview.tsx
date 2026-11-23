import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import type { UnitSummary } from "../../auth/authApi";
import { useProgress } from "../../progress/ProgressProvider";
import type { ReviewTarget } from "../../reviewTarget";
import { validateBonusLesson } from "../bonus/bonusEngine";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import {
  buildStructuredReviewBonus,
  validateStructuredReview,
  type StructuredReviewGameId,
  type StructuredReviewSource,
} from "./structuredReviewEngine";
const Bonus = lazy(() =>
  import("../bonus/Bonus").then((module) => ({ default: module.Bonus })),
);
type Section = "language" | "skills" | "bonus";
type LanguageId = Extract<StructuredReviewGameId, "pronunciation" | "vocabulary" | "grammar">;
type SkillsId = Extract<StructuredReviewGameId, "reading" | "listening" | "writing">;
const LANGUAGE_META: GameMeta<LanguageId>[] = [
  {
    id: "pronunciation",
    icon: "👂",
    title: "Sound Check",
    description: "Nhận biết âm khác nhóm.",
    activityId: "",
  },
  {
    id: "vocabulary",
    icon: "🧩",
    title: "Word Check",
    description: "Ôn từ vựng ba Unit.",
    activityId: "",
  },
  {
    id: "grammar",
    icon: "🧭",
    title: "Grammar Check",
    description: "Chọn cấu trúc đúng.",
    activityId: "",
  },
];
const SKILLS_META: GameMeta<SkillsId>[] = [
  {
    id: "reading",
    icon: "📖",
    title: "Reading Check",
    description: "Tìm bằng chứng trong bài đọc.",
    activityId: "",
  },
  {
    id: "listening",
    icon: "🎧",
    title: "Listening Check",
    description: "Nghe script luyện tập thay thế.",
    activityId: "",
    listening: true,
  },
  {
    id: "writing",
    icon: "✍️",
    title: "Writing Check",
    description: "Hoàn thiện đoạn văn.",
    activityId: "",
  },
];
export function StructuredReview({
  source,
}: {
  source: StructuredReviewSource;
}) {
  const lesson = useMemo(() => validateStructuredReview(source), [source]),
    bonus = useMemo(
      () => validateBonusLesson(buildStructuredReviewBonus(source)),
      [source],
    ),
    reviewId = `review${source.review.number}`,
    [section, setSection] = useState<Section>("language"),
    [target, setTarget] = useState<ReviewTarget | null>(null),
    { user, logout, getUnitSummary } = useAuth(),
    { lastResult } = useProgress(),
    [summary, setSummary] = useState<UnitSummary | null>(null);
  useEffect(() => {
    void getUnitSummary(reviewId).then(setSummary);
  }, [getUnitSummary, lastResult, reviewId, section]);
  const percent = Math.max(
    0,
    Math.min(100, Math.round(summary?.completion_percent ?? 0)),
  );
  const meta = <Id extends StructuredReviewGameId>(items: GameMeta<Id>[]) =>
    items.map((item) => ({
      ...item,
      activityId: `${reviewId}-${item.id === "pronunciation" || item.id === "vocabulary" || item.id === "grammar" ? "language" : "skills"}-${item.id}`,
    }));
  function improve(next: ReviewTarget) {
    setTarget(next);
    setSection(next.activityId.includes("-language-") ? "language" : "skills");
  }
  return (
    <>
      <section className="unit-dashboard review-dashboard">
        <div className="student-chip">
          <span>🧭</span>
          <div>
            <small>Người học</small>
            <strong>{user?.username}</strong>
          </div>
        </div>
        <div className="unit-metrics">
          <div>
            <span>✅</span>
            <small>Review {source.review.number}</small>
            <strong>{summary ? `${percent}%` : "—"}</strong>
          </div>
          <div>
            <span>⭐</span>
            <small>Điểm Review</small>
            <strong>
              {summary
                ? `${summary.earned_score ?? 0}/${summary.max_score ?? 6000}`
                : "—"}
            </strong>
          </div>
        </div>
        <button type="button" onClick={() => void logout()}>
          Đăng xuất
        </button>
      </section>
      <header className="unit-header review-header">
        <span className="eyebrow">English Quest · {source.review.units}</span>
        <div className="unit-identity">
          <span className="unit-number">R{source.review.number}</span>
          <div>
            <span>Review {source.review.number}</span>
            <h1>{source.review.title}</h1>
            <p>{source.review.title_vi}</p>
          </div>
        </div>
        <nav className="major-nav review-nav">
          <button
            type="button"
            aria-current={section === "language" ? "page" : undefined}
            onClick={() => {
              setTarget(null);
              setSection("language");
            }}
          >
            <strong>Language</strong>
            <span>Âm · từ vựng · ngữ pháp</span>
          </button>
          <button
            type="button"
            aria-current={section === "skills" ? "page" : undefined}
            onClick={() => {
              setTarget(null);
              setSection("skills");
            }}
          >
            <strong>Skills</strong>
            <span>Đọc · nghe · viết</span>
          </button>
          <button
            type="button"
            aria-current={section === "bonus" ? "page" : undefined}
            onClick={() => {
              setTarget(null);
              setSection("bonus");
            }}
          >
            <strong>Review Bonus</strong>
            <span>3 màn thưởng</span>
          </button>
        </nav>
      </header>
      <Suspense
        fallback={
          <section className="lesson-card auth-loading">
            <strong>Đang mở Review…</strong>
          </section>
        }
      >
        {section === "language" ? (
          <SkillsSection
            unitId={reviewId}
            sectionLabel={`Review ${source.review.number} · Language`}
            trailTitle="Language Review Trail"
            introTitle="Language Checkpoint"
            introTitleVi="Trạm ôn ngôn ngữ"
            introDescription={`Ôn ${source.review.units} qua ba game, mỗi game 10 câu.`}
            foundations={[
              { title: "Ngôn ngữ", items: lesson.foundations.language },
            ]}
            games={{
              pronunciation: lesson.games.pronunciation,
              vocabulary: lesson.games.vocabulary,
              grammar: lesson.games.grammar,
            }}
            help={{
              pronunciation: lesson.help.pronunciation,
              vocabulary: lesson.help.vocabulary,
              grammar: lesson.help.grammar,
            }}
            meta={meta(LANGUAGE_META)}
            listening={false}
            reviewTarget={target}
          />
        ) : section === "skills" ? (
          <SkillsSection
            unitId={reviewId}
            sectionLabel={`Review ${source.review.number} · Skills`}
            trailTitle="Skills Review Trail"
            introTitle="Skills Checkpoint"
            introTitleVi="Trạm ôn kỹ năng"
            introDescription="Đọc, nghe và viết bằng nội dung an toàn."
            foundations={[
              { title: "Kỹ năng", items: lesson.foundations.skills },
            ]}
            games={{
              reading: lesson.games.reading,
              listening: lesson.games.listening,
              writing: lesson.games.writing,
            }}
            help={{
              reading: lesson.help.reading,
              listening: lesson.help.listening,
              writing: lesson.help.writing,
            }}
            meta={meta(SKILLS_META)}
            listening={false}
            reviewTarget={target}
          />
        ) : (
          <Bonus
            unitId={reviewId}
            branchTitle={`Review ${source.review.number}`}
            lesson={bonus}
            onImprove={improve}
          />
        )}
      </Suspense>
    </>
  );
}
