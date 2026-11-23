import { useEffect, useId, useMemo, useState } from "react";
import sourceData from "../../../../data/raw/getting_started_unit3.json";
import { useProgress } from "../../progress/ProgressProvider";
import type { QuestionScore } from "../../progress/scoringEngine";
import { useActivityScoring } from "../../progress/useActivityScoring";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { stableShuffle } from "../skills-common/learningUx";
import { buildWordWebQuestions, buildWordWebs, type RawWordWeb, type WordWebRelation } from "./wordWebsEngine";

const questions = buildWordWebQuestions(buildWordWebs(sourceData.part4_word_webs as RawWordWeb[]));

export function WordWebs({ initialQuestionIndex = 0 }: { initialQuestionIndex?: number }) {
  const speech = useMemo(() => new SpeechQueue(), []);
  const scoring = useActivityScoring(10, initialQuestionIndex);
  const { submitActivityResult } = useProgress();
  const helpId = useId();
  const [index, setIndex] = useState(Math.max(0, Math.min(initialQuestionIndex, questions.length - 1)));
  const [correct, setCorrect] = useState(false);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [feedback, setFeedback] = useState("Chọn cụm tiếng Anh đúng với nghĩa tiếng Việt.");
  const [questionScore, setQuestionScore] = useState<QuestionScore | null>(null);
  const [finished, setFinished] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const question = questions[index];

  useEffect(() => () => speech.dispose(), [speech]);
  useEffect(() => { scoring.startQuestion(); setHelpOpen(false); setQuestionScore(null); }, [index, scoring.startQuestion]);

  async function answer(option: WordWebRelation) {
    if (busy || correct) return;
    setBusy(true); await speech.enqueue({ text: option.phrase, lang: "en-US", rate: 0.82 });
    if (option.id !== question.relation.id) {
      scoring.recordWrong(); setFeedback("Chưa đúng. Hãy so sánh tính từ và bộ phận cơ thể rồi thử lại."); setBusy(false); return;
    }
    scoring.breakWrongStreak(); setQuestionScore(scoring.completeQuestion()); setCorrect(true);
    setFeedback(`Chính xác! ${question.relation.phrase} — ${question.relation.translation}`); setBusy(false);
  }

  async function next() {
    if (saving) return;
    if (index < questions.length - 1) { setIndex((value) => value + 1); setCorrect(false); setFeedback("Chọn cụm tiếng Anh đúng với nghĩa tiếng Việt."); return; }
    setSaving(true); setSaveError("");
    try {
      const result = scoring.finish();
      await submitActivityResult({ unitId: "unit3", activityId: "unit3-getting-word-webs", completed: true, questions: result.questions });
      setFinished(true);
    } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm."); }
    finally { setSaving(false); }
  }
  function restart() { setIndex(0); setCorrect(false); setFinished(false); setSaveError(""); scoring.reset(); }
  function toggleMuted() { const next = !muted; setMuted(next); speech.setMuted(next); }

  if (finished) return <section className="lesson-card word-webs"><span className="eyebrow">Part 4 · Vocabulary</span><h3>Word Webs</h3><p className="finish-mark">★</p><h4>Hoàn thành 10/10!</h4><button className="primary-button" type="button" onClick={restart}>Chơi lại</button></section>;

  return <section className="lesson-card word-webs" aria-labelledby="word-webs-title">
    <header className="lesson-heading"><div><span className="eyebrow">Part 4 · Vocabulary</span><div className="acl-game-header"><h3 id="word-webs-title">Word Webs</h3><button className="acl-help-button" type="button" aria-label="Xem hướng dẫn" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => { if (!open) scoring.recordHelp(); return !open; })}>?</button></div><p className="lesson-lead">Khám phá quan hệ giữa tính từ và bộ phận cơ thể qua 10 câu.</p></div><button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>{muted ? "Bật âm thanh" : "Tắt âm thanh"}</button></header>
    {helpOpen && <aside className="acl-help-panel" id={helpId}><h4>Lời giảng</h4><p>Đọc nghĩa tiếng Việt rồi chọn cụm tiếng Anh phù hợp. Em sẽ làm đúng 10 câu; mỗi câu tối đa 100 điểm, sai/gợi ý/thời gian đều được tính.</p></aside>}
    <div className="web-progress"><strong>{index + 1}/10</strong><div className="progress-track"><span style={{ width: `${((index + (correct ? 1 : 0)) / 10) * 100}%` }} /></div><span>câu khám phá</span></div>
    <div className="acl-prompt-card"><span>Nghĩa cần tìm</span><p lang="vi">{question.relation.translation}</p></div>
    <div className="bridge-answer-bank">{stableShuffle(question.options,`web-${index}`).map((option) => <button type="button" key={option.id} disabled={busy || correct} onClick={() => void answer(option)}>{option.phrase}</button>)}</div>
    <p className="web-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>
    {questionScore && <p className="acl2-question-score">+{questionScore.earned}/100 điểm</p>}
    {saveError && <p className="auth-error" role="alert">{saveError}</p>}
    {correct && <div className="actions"><button className="primary-button" type="button" disabled={saving} onClick={() => void next()}>{saving ? "Đang lưu…" : index === 9 ? "Hoàn thành" : "Câu tiếp theo"}</button></div>}
  </section>;
}
