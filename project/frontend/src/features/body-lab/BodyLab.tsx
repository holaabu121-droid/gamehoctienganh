import { useEffect, useId, useMemo, useState } from "react";
import sourceData from "../../../../data/raw/getting_started_unit3.json";
import { useProgress } from "../../progress/ProgressProvider";
import { useActivityScoring } from "../../progress/useActivityScoring";
import type { QuestionScore } from "../../progress/scoringEngine";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { stableShuffle } from "../skills-common/learningUx";
import { createBodyLabQuestions } from "./bodyLabEngine";

const questions = createBodyLabQuestions(sourceData.part3_body_parts as string[]);

function BodyFigure({ question, solved }: { question: (typeof questions)[number]; solved: boolean }) {
  const { point, answer } = question;
  return (
    <svg className="body-figure" viewBox="0 0 320 530" role="img" aria-label={`Mô hình cơ thể, vị trí cần tìm: ${solved ? answer : "đang được đánh dấu"}`}>
      <path className="figure-hair" d="M110 79c5-43 28-63 51-63 30 0 49 20 52 63-17-20-27-24-52-24-21 0-36 7-51 24Z" />
      <circle className="figure-skin" cx="160" cy="103" r="55" />
      <circle className="figure-eye" cx="143" cy="89" r="5" /><circle className="figure-eye" cx="179" cy="89" r="5" />
      <path className="figure-detail" d="M160 96v18l8 2M146 128q14 12 29 0" />
      <path className="figure-skin figure-limb" d="M126 150v24M194 150v24M112 184 72 316M208 184l40 132" />
      <rect className="figure-shirt" x="105" y="164" width="110" height="150" rx="38" />
      <circle className="figure-skin" cx="67" cy="326" r="16" /><circle className="figure-skin" cx="253" cy="326" r="16" />
      <path className="figure-trousers figure-leg" d="M137 309 128 478M183 309l9 169" />
      <ellipse className="figure-shoe" cx="116" cy="494" rx="31" ry="14" /><ellipse className="figure-shoe" cx="204" cy="494" rx="31" ry="14" />
      <circle className="body-target-ring" cx={point.x} cy={point.y} r="18" />
      <circle className="body-target-dot" cx={point.x} cy={point.y} r="7" />
      {solved && (
        <g className="body-label">
          <line x1={point.x} y1={point.y} x2={point.labelX} y2={point.labelY} />
          <rect x={point.labelX - 46} y={point.labelY - 17} width="92" height="34" rx="12" />
          <text x={point.labelX} y={point.labelY}>{answer}</text>
        </g>
      )}
    </svg>
  );
}

export function BodyLab({ initialQuestionIndex = 0 }: { initialQuestionIndex?: number }) {
  const speech = useMemo(() => new SpeechQueue(), []);
  const scoring = useActivityScoring(10, initialQuestionIndex);
  const { submitActivityResult } = useProgress();
  const helpId = useId();
  const [questionIndex, setQuestionIndex] = useState(Math.max(0, Math.min(initialQuestionIndex, 9)));
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [questionScore, setQuestionScore] = useState<QuestionScore | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const question = questions[questionIndex];
  const solved = result === "correct";

  useEffect(() => () => speech.dispose(), [speech]);
  useEffect(() => { scoring.startQuestion(); setQuestionScore(null); setHelpOpen(false); }, [questionIndex, scoring.startQuestion]);

  async function choose(option: string) {
    if (busy || solved) return;
    setBusy(true);
    setSelected(option);
    setResult(null);
    await speech.enqueue({ text: option, lang: "en-US", rate: 0.82 });
    if (option === question.answer) {
      scoring.breakWrongStreak();
      setQuestionScore(scoring.completeQuestion());
      setResult("correct");
    } else {
      scoring.recordWrong();
      setResult("wrong");
    }
    setBusy(false);
  }

  async function nextQuestion() {
    if (saving) return;
    if (questionIndex === questions.length - 1) {
      setSaving(true); setSaveError("");
      try {
        const result = scoring.finish();
        await submitActivityResult({ unitId: "unit3", activityId: "unit3-getting-body-lab", completed: true, questions: result.questions });
        setFinished(true);
      } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm."); }
      finally { setSaving(false); }
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelected(null);
    setResult(null);
    setSaveError("");
  }

  function restart() {
    setQuestionIndex(0);
    setSelected(null);
    setResult(null);
    setFinished(false);
    scoring.reset();
  }

  function toggleMuted() {
    const next = !muted;
    setMuted(next);
    speech.setMuted(next);
  }

  if (finished) {
    return (
      <section className="lesson-card body-lab-finished" aria-labelledby="body-lab-title">
        <span className="eyebrow">Getting Started · Unit 3 · Part 3</span>
        <h3 id="body-lab-title">Body Lab</h3>
        <p className="finish-mark" aria-hidden="true">★</p>
        <h4>Excellent!</h4>
        <p>Em đã gắn đúng {questions.length}/{questions.length} nhãn bộ phận cơ thể.</p>
        <button className="primary-button" type="button" onClick={restart}>Chơi lại</button>
      </section>
    );
  }

  return (
    <section className="lesson-card body-lab" aria-labelledby="body-lab-title">
      <header className="lesson-heading">
        <div>
          <span className="eyebrow">Getting Started · Unit 3 · Part 3</span>
          <div className="acl-game-header"><h3 id="body-lab-title">Body Lab</h3><button className="acl-help-button" type="button" aria-label="Xem hướng dẫn" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => { if (!open) scoring.recordHelp(); return !open; })}>?</button></div>
          <p className="lesson-lead">Quan sát vị trí phát sáng và chọn đúng tên bộ phận cơ thể.</p>
        </div>
        <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>
          {muted ? "Bật âm thanh" : "Tắt âm thanh"}
        </button>
      </header>
      {helpOpen && <aside className="acl-help-panel" id={helpId}><h4>Lời giảng</h4><p>Quan sát điểm sáng trên cơ thể, nghe từng lựa chọn rồi chọn đúng tên. Mỗi câu tối đa 100 điểm; trả lời sai, mở gợi ý hoặc làm lâu sẽ bị trừ điểm.</p></aside>}

      <div className="lab-progress" aria-label={`Câu ${questionIndex + 1} trên ${questions.length}`}>
        <strong>{questionIndex + 1} / {questions.length}</strong>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
        <span>Điểm: {questionIndex + (solved ? 1 : 0)}</span>
      </div>

      <div className="body-lab-layout">
        <div className="body-stage"><BodyFigure question={question} solved={solved} /></div>
        <div className="lab-panel">
          <p className="lab-prompt">Which body part is highlighted?</p>
          <div className="body-options" aria-label="Các đáp án">
            {stableShuffle(question.options,`body-${questionIndex}`).map((option) => {
              const state = selected === option && result ? ` body-choice--${result}` : "";
              return (
                <button className={`body-choice${state}`} type="button" key={option} disabled={busy || solved} onClick={() => void choose(option)}>
                  {option}
                </button>
              );
            })}
          </div>
          <div className="feedback" aria-live="polite" aria-atomic="true">
            {busy && "Đang phát âm từ đã chọn…"}
            {result === "wrong" && "Chưa đúng. Hãy quan sát điểm sáng và thử lại!"}
            {result === "correct" && `Chính xác! Đây là ${question.answer}.`}
          </div>
          {questionScore && <p className="acl2-question-score">+{questionScore.earned}/100 điểm</p>}
          {saveError && <p className="auth-error" role="alert">{saveError}</p>}
          {solved && (
            <div className="actions">
              <button className="secondary-button" type="button" onClick={() => void speech.enqueue({ text: question.answer, lang: "en-US", rate: 0.82 })}>Nghe lại từ</button>
              <button className="primary-button" type="button" disabled={saving} onClick={() => void nextQuestion()}>{saving ? "Đang lưu…" : questionIndex === questions.length - 1 ? "Hoàn thành" : "Bộ phận tiếp theo"}</button>
            </div>
          )}
        </div>
      </div>
      {!speech.available && <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản.</p>}
    </section>
  );
}
