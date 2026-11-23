import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useProgress } from "../../progress/ProgressProvider";
import { useActivityScoring, type ActivityQuestionCount } from "../../progress/useActivityScoring";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { advanceHint, applyChallengeKey, buildCorrectAudioPlan, classifyTypingError, compareAttempt, isAnswerCorrect, scoreQuestion } from "./typingQuestEngine";
import type { HintState, TypingAttempt, TypingAudioSettings, TypingConfig, TypingErrorType, TypingQuestion } from "./typingQuestTypes";

type Props = { questions: TypingQuestion[]; config: TypingConfig; audio: TypingAudioSettings; onComplete: (attempts: TypingAttempt[]) => void; onExit: () => void };
const ERROR_MESSAGES: Record<Exclude<TypingErrorType, "none">, string> = {
  missing_character: "Em đang thiếu một chữ cái. Hãy nhìn lại từng vị trí.", extra_character: "Em đang thừa một chữ cái. Hãy sửa rồi thử lại.",
  transposition: "Hai chữ cái đang bị đảo vị trí. Em gần đúng rồi!", substitution: "Có chữ cái chưa đúng. Hãy sửa phần được đánh dấu đỏ.",
  wrong_word: "Từ này chưa đúng. Hãy thử lại hoặc mở gợi ý.", hyphen_error: "Nhớ gõ đúng dấu gạch nối trong từ này.",
};
const initialHint = (answer: string): HintState => ({ level: 0, length: answer.length, revealed: [], playAudio: false, showAnswer: false });

export function TypingRound({ questions, config, audio, onComplete, onExit }: Props) {
  const speech = useMemo(() => new SpeechQueue(), []);
  const scoring = useActivityScoring(questions.length as ActivityQuestionCount);
  const { submitActivityResult } = useProgress();
  const helpId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());
  const audioRun = useRef(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [hint, setHint] = useState<HintState>(() => initialHint(questions[0].answer));
  const [feedback, setFeedback] = useState("Hãy gõ đáp án rồi nhấn Enter.");
  const [phase, setPhase] = useState<"typing" | "correct">("typing");
  const [firstTry, setFirstTry] = useState(true);
  const [lastError, setLastError] = useState<TypingErrorType>("none");
  const [mistakeCount, setMistakeCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [attempts, setAttempts] = useState<TypingAttempt[]>([]);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const question = questions[questionIndex];
  const comparison = compareAttempt(question.answer, attempt);
  const currentXp = scoreQuestion(hint.level);
  const totalXp = attempts.reduce((total, item) => total + item.xp, 0);

  useEffect(() => () => { audioRun.current += 1; speech.dispose(); }, [speech]);
  useEffect(() => { if (phase === "typing") inputRef.current?.focus(); }, [phase, questionIndex]);
  useEffect(() => { scoring.startQuestion(); setHelpOpen(false); }, [questionIndex, scoring.startQuestion]);

  function resetQuestion(nextIndex: number) {
    setQuestionIndex(nextIndex); setAttempt(""); setHint(initialHint(questions[nextIndex].answer)); setFeedback("Hãy gõ đáp án rồi nhấn Enter.");
    setPhase("typing"); setFirstTry(true); setLastError("none"); setMistakeCount(0); startedAt.current = Date.now();
  }
  async function playCorrectSequence() {
    const run = audioRun.current + 1;
    audioRun.current = run;
    setBusy(true);
    for (const step of buildCorrectAudioPlan(question, audio)) {
      if (audioRun.current !== run) return;
      await speech.enqueue({ text: step.text, lang: step.lang, rate: step.rate });
      if (audioRun.current !== run) return;
    }
    if (audioRun.current === run) setBusy(false);
  }
  async function submit() {
    if (phase !== "typing" || busy) return;
    if (!attempt) { setFeedback("Em hãy gõ một từ trước khi kiểm tra."); return; }
    if (config.difficulty === "challenge" && attempt.length < question.answer.length) { setFeedback("Hãy gõ đủ các ký tự trước khi nhấn Enter."); return; }
    if (!isAnswerCorrect(question.answer, attempt)) {
      scoring.recordWrong();
      const error = classifyTypingError(question.answer, attempt); setFirstTry(false); setLastError(error);
      setFeedback(ERROR_MESSAGES[error === "none" ? "wrong_word" : error]); inputRef.current?.focus(); return;
    }
    const record: TypingAttempt = { questionId: question.id, vocabId: question.vocabId, mode: question.mode, difficulty: config.difficulty, correct: true,
      firstTryCorrect: firstTry && mistakeCount === 0, hintLevel: hint.level, xp: currentXp, errorType: lastError, mistakeCount, durationMs: Date.now() - startedAt.current };
    scoring.breakWrongStreak(); scoring.completeQuestion();
    setAttempts((current) => [...current, record]); setPhase("correct"); setFeedback(`Chính xác! ${question.answer}`); await playCorrectSequence();
  }
  function applyChallengeCharacter(key: string) {
    const result = applyChallengeKey({ answer: question.answer, attempt, mistakeCount, combo }, key);
    setAttempt(result.attempt); setMistakeCount(result.mistakeCount); setCombo(result.combo);
    if (result.reset) {
      scoring.recordWrong();
      setFirstTry(false); const expected = question.answer[attempt.length]?.toLowerCase();
      setLastError(expected === "-" || key === "-" ? "hyphen_error" : "substitution"); setFeedback("Sai một ký tự - hãy gõ lại từ đầu!");
    } else if (result.complete) setFeedback("Đã đủ ký tự. Nhấn Enter để kiểm tra!");
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") { event.preventDefault(); void submit(); return; }
    if (config.difficulty !== "challenge" || phase !== "typing") return;
    if (event.key === "Backspace" || /^[a-z-]$/i.test(event.key)) { event.preventDefault(); applyChallengeCharacter(event.key); }
  }
  function handleChallengeMobileChange(value: string) {
    const clean = value.replace(/[^a-z-]/gi, "");
    if (clean.length < attempt.length) applyChallengeCharacter("Backspace");
    else if (clean.length > attempt.length) applyChallengeCharacter(clean.at(-1) ?? "");
  }
  async function useHint() {
    if (phase !== "typing" || busy || hint.level === 4) return;
    scoring.recordHelp(); const next = advanceHint(question.answer, hint.level); setHint(next);
    if (next.playAudio) await speech.enqueue({ text: question.answer, lang: "en-US", rate: 0.82 });
    setFeedback(next.showAnswer ? "Đáp án đã hiện. Em hãy tự gõ lại từ hoàn chỉnh." : `Đã mở gợi ý ${next.level}.`); inputRef.current?.focus();
  }
  async function replay() { if (!busy) await playCorrectSequence(); }
  async function nextQuestion() {
    if (busy || saving) return;
    if (questionIndex === questions.length - 1) {
      setSaving(true); setSaveError("");
      try {
        const result = scoring.finish();
        await submitActivityResult({ unitId: "unit3", activityId: "unit3-getting-typing", completed: true, questions: result.questions });
        onComplete(attempts);
      } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm."); }
      finally { setSaving(false); }
      return;
    }
    resetQuestion(questionIndex + 1);
  }
  function toggleMuted() { const next = !muted; setMuted(next); speech.setMuted(next); }

  return <section className="lesson-card typing-round" aria-labelledby="typing-round-title">
    <header className="typing-round-header"><div><span className="eyebrow">Typing Quest · {config.difficulty === "learning" ? "Luyện tập" : "Thử thách"}</span><div className="acl-game-header"><h3 id="typing-round-title">Câu {questionIndex + 1}</h3><button className="acl-help-button" type="button" aria-label="Xem hướng dẫn" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => { if (!open) scoring.recordHelp(); return !open; })}>?</button></div></div>
      <div className="typing-header-actions"><button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>{muted ? "Bật âm thanh" : "Tắt âm thanh"}</button><button className="secondary-button" type="button" onClick={() => { audioRun.current += 1; speech.cancel(); onExit(); }}>Đổi cấu hình</button></div></header>
    {helpOpen && <aside className="acl-help-panel" id={helpId}><h4>Lời giảng</h4><p>Đọc câu hoặc nghĩa Việt rồi gõ đúng từ tiếng Anh. Mỗi câu tối đa 100 điểm; gõ sai, dùng gợi ý hoặc làm lâu sẽ giảm điểm.</p></aside>}
    <div className="typing-scorebar"><strong>{questionIndex + 1}/{questions.length}</strong><div className="progress-track" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div><span>XP: {totalXp}{phase === "correct" ? "" : ` + ${currentXp}`}</span>{config.difficulty === "challenge" && <span>Combo: {combo}</span>}</div>
    <div className="typing-prompt-card"><span>{question.mode === "fill_gap" ? "Điền từ còn thiếu" : `Nhớ nghĩa · ${question.type}`}</span>
      {question.mode === "fill_gap" && question.gapParts ? <p className="typing-sentence">{question.gapParts.before}<mark>{phase === "correct" ? question.answer : "_____"}</mark>{question.gapParts.after}</p> : <p className="typing-translation-prompt" lang="vi">{question.prompt}</p>}
    </div>
    {phase === "typing" ? <>
      <div className="typing-character-track" aria-label={`Tiến trình gõ ${attempt.length} trên ${question.answer.length} ký tự`}>
        {comparison.map((character) => { const revealed = hint.revealed.find(({ index }) => index === character.index)?.character; const visible = character.actual ?? revealed ?? "·"; const status = character.actual ? character.status : revealed ? "hint" : "pending"; return <span key={character.index} className={`typing-character typing-character--${status}`} aria-label={`Vị trí ${character.index + 1}: ${status}`}>{visible.toUpperCase()}</span>; })}
      </div>
      {hint.showAnswer && <p className="typing-revealed-answer">Đáp án để chép lại: <strong>{question.answer}</strong></p>}
      <label className="typing-input-label" htmlFor="typing-answer">Nhập đáp án bằng bàn phím</label>
      <input ref={inputRef} id="typing-answer" className="typing-input" value={attempt} autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={question.answer.length + 2}
        onChange={(event) => config.difficulty === "learning" ? setAttempt(event.target.value.replace(/[^a-z-]/gi, "")) : handleChallengeMobileChange(event.target.value)} onKeyDown={handleKeyDown} />
      <div className="typing-controls"><button className="secondary-button" type="button" disabled={busy || hint.level === 4} onClick={() => void useHint()}>{hint.level === 0 ? "Gợi ý" : `Gợi ý ${hint.level}/4`}</button><button className="primary-button" type="button" disabled={busy} onClick={() => void submit()}>Kiểm tra đáp án</button></div>
    </> : <div className="typing-correct-card"><span aria-hidden="true">★</span><div><strong>{question.answer}</strong><p lang="vi">{question.vi}</p></div>{question.completedSentence && question.sentenceApproved && <div className="typing-completed-example"><p lang="en">{question.completedSentence}</p><p className="typing-sentence-translation" lang="vi">{question.sentenceVi}</p></div>}
      <div className="typing-controls"><button className="secondary-button" type="button" disabled={busy || saving} onClick={() => void replay()}>Nghe lại</button><button className="primary-button" type="button" disabled={busy || saving} onClick={() => void nextQuestion()}>{saving ? "Đang lưu…" : questionIndex === questions.length - 1 ? "Xem kết quả" : "Từ tiếp theo"}</button></div></div>}
    <p className="typing-feedback" role="status" aria-live="polite" aria-atomic="true">{busy ? "Đang phát âm đáp án…" : feedback}</p>
    {saveError && <p className="auth-error" role="alert">{saveError}</p>}
    {!speech.available && <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản; trò chơi vẫn hoạt động bình thường.</p>}
  </section>;
}
