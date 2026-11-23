import { useEffect, useId, useMemo, useState } from "react";
import lessonJson from "../../../../data/lessons/unit3_communication.json";
import { useProgress } from "../../progress/ProgressProvider";
import type { QuestionScore } from "../../progress/scoringEngine";
import type { ReviewTarget } from "../../reviewTarget";
import { useActivityScoring, type ActivityQuestionCount } from "../../progress/useActivityScoring";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { useAuth } from "../../auth/AuthProvider";
import { stableShuffle } from "../skills-common/learningUx";
import {
  isBirthdayAnswer,
  isDetectiveAnswer,
  isDialogueAnswer,
  isInterviewAnswer,
  isOpinionAnswer,
  validateCommunicationData,
  type CommunicationData,
  type CommunicationGameId,
  type DialogueFunction,
} from "./communicationEngine";

const lesson = validateCommunicationData(lessonJson as CommunicationData);
type Screen = "intro" | "hub" | CommunicationGameId;
type SharedProps = { speech: SpeechQueue; onBack: () => void; onComplete: () => void; initialIndex?: number };

const GAME_META: Array<{ id: CommunicationGameId; icon: string; title: string; description: string }> = [
  { id: "dialogue", icon: "💬", title: "Dialogue Lab", description: "Phân biệt câu về ngoại hình và tính cách." },
  { id: "interview", icon: "🎤", title: "Best-friend Interview", description: "Ghép câu hỏi với câu trả lời phù hợp." },
  { id: "detective", icon: "🕵️", title: "Student Detective", description: "Đọc hồ sơ và chọn tính từ có bằng chứng." },
  { id: "birthday", icon: "🎂", title: "Birthday Personality", description: "Tra 12 khoảng ngày sinh trong bảng." },
  { id: "opinion", icon: "🗣️", title: "Share Your Opinion", description: "Luyện nêu ý kiến lịch sự và có lý do." },
];

const FUNCTION_LABELS: Record<DialogueFunction, string> = {
  "appearance-question": "Câu hỏi về ngoại hình",
  "appearance-description": "Mô tả ngoại hình",
  "personality-question": "Câu hỏi về tính cách",
  "personality-description": "Mô tả tính cách",
};

function GameShell({ title, eyebrow, help, questionKey, onHelp, onBack, children }: {
  title: string; eyebrow: string; help: { source_title: string; teaching_vi: string; steps: string[] };
  questionKey: number; onHelp: () => void; onBack: () => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => setOpen(false), [questionKey]);
  return <section className="lesson-card acl-game communication-game">
    <button className="back-to-games" type="button" onClick={onBack}>← Danh sách trò chơi</button>
    <header className="acl-game-header"><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div><button className="acl-help-button" type="button" aria-label="Xem lời giảng gợi ý" aria-expanded={open} aria-controls={id} onClick={() => setOpen((current) => { if (!current) onHelp(); return !current; })}>?</button></header>
    {open && <aside className="acl-help-panel" id={id}><span className="eyebrow">Lời giảng gợi ý</span><h4>{help.teaching_vi}</h4><p lang="en"><em>{help.source_title}</em></p><ol>{help.steps.map((step) => <li key={step}>{step}</li>)}</ol></aside>}
    {children}
  </section>;
}

function useScoredGame(activityId: string, total: ActivityQuestionCount, index: number, initialIndex: number, onComplete: () => void) {
  const scoring = useActivityScoring(total, initialIndex);
  const { submitActivityResult } = useProgress();
  const [questionScore, setQuestionScore] = useState<QuestionScore | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => { scoring.startQuestion(); setQuestionScore(null); setSaveError(""); }, [index, scoring.startQuestion]);
  function markCorrect() { scoring.breakWrongStreak(); setQuestionScore(scoring.completeQuestion()); }
  async function finishGame() {
    if (saving) return;
    setSaving(true); setSaveError("");
    try {
      const { questions } = scoring.finish();
      await submitActivityResult({ unitId: "unit3", activityId, completed: true, questions });
      onComplete();
    } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm. Em hãy thử lại."); }
    finally { setSaving(false); }
  }
  return { recordHelp: scoring.recordHelp, recordWrong: scoring.recordWrong, markCorrect, finishGame, questionScore, saving, saveError };
}

function Progress({ index, total, correct }: { index: number; total: number; correct: boolean }) {
  return <div className="acl-progress"><strong>{index + 1}/{total}</strong><div className="progress-track"><span style={{ width: `${((index + (correct ? 1 : 0)) / total) * 100}%` }} /></div></div>;
}

function Feedback({ score, error, text, busy }: { score: QuestionScore | null; error: string; text: string; busy: boolean }) {
  return <><p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : text}</p>{score && <p className="acl2-question-score">+{score.earned}/100 điểm · {score.rankLabel}</p>}{error && <p className="auth-error" role="alert">{error}</p>}</>;
}

function Next({ last, busy, onClick }: { last: boolean; busy: boolean; onClick: () => void }) {
  return <div className="acl-finish-action"><button className="primary-button" type="button" disabled={busy} onClick={onClick}>{busy && last ? "Đang lưu…" : last ? "Hoàn thành" : "Câu tiếp theo"}</button></div>;
}

function DialogueLab({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.dialogue_lab.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Đọc câu thoại rồi chọn đúng chức năng giao tiếp.");
  const item = lesson.dialogue_lab[index]; const scored = useScoredGame("unit3-communication-dialogue", 10, index, initialIndex, onComplete);
  async function choose(option: DialogueFunction) {
    if (busy || correct) return; setBusy(true); await speech.enqueue({ text: FUNCTION_LABELS[option], lang: "vi-VN", rate: .9 });
    if (isDialogueAnswer(item, option)) { scored.markCorrect(); setCorrect(true); setFeedback(item.explanation_vi); await speech.enqueue({ text: item.line, lang: "en-US", rate: .83 }); }
    else { scored.recordWrong(); setFeedback("Chưa đúng. Hãy tìm look like, đặc điểm nhìn thấy hoặc tính từ chỉ tính cách."); }
    setBusy(false);
  }
  async function next() { if (index === lesson.dialogue_lab.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Đọc câu thoại rồi chọn đúng chức năng giao tiếp."); }
  return <GameShell eyebrow="Communication · Bài 1" title="Dialogue Lab" help={lesson.game_help.dialogue} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <Progress index={index} total={lesson.dialogue_lab.length} correct={correct} /><article className="communication-prompt"><span>{item.speaker}</span><p lang="en">{item.line}</p></article>
    <div className="acl2-option-grid acl2-option-grid--two">{stableShuffle(item.options,`dialogue-${index}`).map((option) => <button key={option} type="button" disabled={busy || correct} onClick={() => void choose(option)}>{FUNCTION_LABELS[option]}</button>)}</div>
    <Feedback score={scored.questionScore} error={scored.saveError} text={feedback} busy={busy} />{correct && <Next last={index === lesson.dialogue_lab.length - 1} busy={busy || scored.saving} onClick={() => void next()} />}
  </GameShell>;
}

function BestFriendInterview({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.best_friend_interview.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Chọn câu trả lời đúng loại thông tin được hỏi.");
  const item = lesson.best_friend_interview[index]; const scored = useScoredGame("unit3-communication-interview", 10, index, initialIndex, onComplete);
  async function choose(option: string) {
    if (busy || correct) return; setBusy(true); await speech.enqueue({ text: option, lang: "en-US", rate: .83 });
    if (isInterviewAnswer(item, option)) { scored.markCorrect(); setCorrect(true); setFeedback(item.answer_vi); await speech.enqueue({ text: `${item.question} ${item.answer}`, lang: "en-US", rate: .83 }); }
    else { scored.recordWrong(); setFeedback(item.target === "appearance" ? "Câu hỏi này cần mô tả tóc, mắt, chiều cao hoặc đặc điểm nhìn thấy." : "Câu hỏi này cần tính từ chỉ tính cách."); }
    setBusy(false);
  }
  async function next() { if (index === lesson.best_friend_interview.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Chọn câu trả lời đúng loại thông tin được hỏi."); }
  return <GameShell eyebrow="Communication · Bài 2" title="Best-friend Interview" help={lesson.game_help.interview} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <Progress index={index} total={lesson.best_friend_interview.length} correct={correct} /><article className="communication-prompt"><span>{item.target === "appearance" ? "Ngoại hình" : "Tính cách"}</span><p lang="en">{item.question}</p><small>{item.prompt_vi}</small></article>
    <div className="acl2-option-grid">{stableShuffle(item.options,`interview-${index}`).map((option) => <button key={option} type="button" disabled={busy || correct} onClick={() => void choose(option)}>{option}</button>)}</div>
    <Feedback score={scored.questionScore} error={scored.saveError} text={feedback} busy={busy} />{correct && <Next last={index === lesson.best_friend_interview.length - 1} busy={busy || scored.saving} onClick={() => void next()} />}
  </GameShell>;
}

function StudentDetective({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.student_detective.length - 1))); const [chosen, setChosen] = useState<string[]>([]); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Chọn một hoặc hai tính từ có bằng chứng trong hồ sơ.");
  const item = lesson.student_detective[index]; const scored = useScoredGame("unit3-communication-students", 10, index, initialIndex, onComplete);
  async function toggle(option: string) { if (busy || correct) return; setBusy(true); await speech.enqueue({ text: option, lang: "en-US", rate: .82 }); setChosen((current) => current.includes(option) ? current.filter((word) => word !== option) : current.length < 2 ? [...current, option] : current); setBusy(false); }
  function check() {
    if (chosen.length !== item.answers.length) { setFeedback(`Hồ sơ này cần chọn đúng ${item.answers.length} tính từ.`); return; }
    if (isDetectiveAnswer(item, chosen)) { scored.markCorrect(); setCorrect(true); setFeedback(item.evidence_vi); void speech.enqueue({ text: item.answers.join(" and "), lang: "en-US", rate: .82 }); }
    else { scored.recordWrong(); setFeedback("Chưa khớp. Hãy đọc lại hành động trong hồ sơ, không đoán theo tên hoặc ngày sinh."); }
  }
  async function next() { if (index === lesson.student_detective.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setChosen([]); setCorrect(false); setFeedback("Chọn một hoặc hai tính từ có bằng chứng trong hồ sơ."); }
  return <GameShell eyebrow="Communication · Bài 3" title="Student Detective" help={lesson.game_help.detective} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <Progress index={index} total={lesson.student_detective.length} correct={correct} /><article className="communication-profile"><h4>{item.header}</h4><p lang="en">{item.profile}</p></article>
    <div className="acl2-option-grid acl2-option-grid--two">{stableShuffle(item.options,`detective-${index}`).map((option) => <button key={option} type="button" aria-pressed={chosen.includes(option)} disabled={busy || correct} onClick={() => void toggle(option)}>{option}</button>)}</div>
    <Feedback score={scored.questionScore} error={scored.saveError} text={feedback} busy={busy} /><div className="acl-finish-action">{correct ? <Next last={index === lesson.student_detective.length - 1} busy={scored.saving} onClick={() => void next()} /> : <button className="primary-button" type="button" disabled={busy || !chosen.length} onClick={check}>Kiểm tra tính từ</button>}</div>
  </GameShell>;
}

function BirthdayPersonality({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.birthday_personality.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Đối chiếu khoảng ngày với đúng cặp tính từ.");
  const item = lesson.birthday_personality[index]; const scored = useScoredGame("unit3-communication-birthdays", 15, index, initialIndex, onComplete);
  async function choose(option: string) {
    if (busy || correct) return; setBusy(true); await speech.enqueue({ text: option.replace(",", " and"), lang: "en-US", rate: .82 });
    if (isBirthdayAnswer(item, option)) { scored.markCorrect(); setCorrect(true); setFeedback("Đúng theo bảng. Đây chỉ là gợi ý vui, không quyết định tính cách thật của một người."); }
    else { scored.recordWrong(); setFeedback(`Chưa đúng. Hãy nhìn lại khoảng ${item.date_range}.`); }
    setBusy(false);
  }
  async function next() { if (index === lesson.birthday_personality.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Đối chiếu khoảng ngày với đúng cặp tính từ."); }
  return <GameShell eyebrow="Communication · Bài 4" title="Birthday Personality" help={lesson.game_help.birthday} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <Progress index={index} total={lesson.birthday_personality.length} correct={correct} /><article className="communication-birthday"><span aria-hidden="true">🎂</span><div><small>{item.birthday ? `Ngày sinh ${item.birthday}` : "Khoảng ngày sinh"}</small><h4>{item.date_range}</h4></div></article><p className="communication-caution">💡 {lesson.intro.birthday_note_vi}</p>
    <div className="acl2-option-grid">{stableShuffle(item.options,`birthday-${index}`).map((option) => <button key={option} type="button" disabled={busy || correct} onClick={() => void choose(option)}>{option}</button>)}</div>
    <Feedback score={scored.questionScore} error={scored.saveError} text={feedback} busy={busy} />{correct && <Next last={index === lesson.birthday_personality.length - 1} busy={busy || scored.saving} onClick={() => void next()} />}
  </GameShell>;
}

function ShareOpinion({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.opinion_true_false.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Quyết định cách nêu ý kiến này đúng hay sai.");
  const item = lesson.opinion_true_false[index]; const scored = useScoredGame("unit3-communication-opinions", 10, index, initialIndex, onComplete);
  async function choose(option: "Đúng" | "Sai") {
    if (busy || correct) return; setBusy(true); await speech.enqueue({ text: option, lang: "vi-VN", rate: .9 });
    if (isOpinionAnswer(item, option)) { scored.markCorrect(); setCorrect(true); setFeedback(item.explanation_vi); await speech.enqueue({ text: item.statement, lang: "en-US", rate: .83 }); }
    else { scored.recordWrong(); setFeedback("Chưa đúng. Ý kiến tốt cần lịch sự, có lý do và không biến bảng dự đoán thành sự thật khoa học."); }
    setBusy(false);
  }
  async function next() { if (index === lesson.opinion_true_false.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Quyết định cách nêu ý kiến này đúng hay sai."); }
  return <GameShell eyebrow="Communication · Bài 5" title="Share Your Opinion" help={lesson.game_help.opinion} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <Progress index={index} total={lesson.opinion_true_false.length} correct={correct} /><article className="communication-prompt"><span>Ý kiến</span><p lang="en">{item.statement}</p></article>
    <div className="communication-true-false">{stableShuffle(item.options,`opinion-${index}`).map((option) => <button key={option} type="button" disabled={busy || correct} onClick={() => void choose(option)}>{option === "Đúng" ? "✓ Đúng" : "✕ Sai"}</button>)}</div>
    <Feedback score={scored.questionScore} error={scored.saveError} text={feedback} busy={busy} />{correct && <Next last={index === lesson.opinion_true_false.length - 1} busy={busy || scored.saving} onClick={() => void next()} />}
  </GameShell>;
}

export function Communication({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  const { summary } = useAuth();
  const speech = useMemo(() => new SpeechQueue(), []);
  const targetScreen = useMemo<CommunicationGameId | null>(() => {
    const map: Record<string, CommunicationGameId> = { "unit3-communication-dialogue": "dialogue", "unit3-communication-interview": "interview", "unit3-communication-students": "detective", "unit3-communication-birthdays": "birthday", "unit3-communication-opinions": "opinion" };
    return reviewTarget ? map[reviewTarget.activityId] ?? null : null;
  }, [reviewTarget]);
  const [screen, setScreen] = useState<Screen>(() => targetScreen ?? "intro");
  const [completed, setCompleted] = useState<Set<CommunicationGameId>>(() => new Set());
  const [muted, setMuted] = useState(false);
  useEffect(() => () => speech.dispose(), [speech]);
  useEffect(() => {
    const map: Record<string, CommunicationGameId> = { "unit3-communication-dialogue": "dialogue", "unit3-communication-interview": "interview", "unit3-communication-students": "detective", "unit3-communication-birthdays": "birthday", "unit3-communication-opinions": "opinion" };
    const saved = new Set<CommunicationGameId>();
    summary?.progress?.forEach((item) => { const id = map[item.activity_id]; if (id && item.completed) saved.add(id); });
    setCompleted((current) => new Set([...current, ...saved]));
  }, [summary]);
  useEffect(() => { if (targetScreen) setScreen(targetScreen); }, [targetScreen]);
  function open(next: Screen) { speech.cancel(); setScreen(next); }
  function finish(game: CommunicationGameId) { setCompleted((current) => new Set(current).add(game)); open("hub"); }
  function toggleMuted() { const next = !muted; setMuted(next); speech.setMuted(next); }
  const sound = <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>{muted ? "Bật âm thanh" : "Tắt âm thanh"}</button>;

  if (screen === "intro") return <section className="lesson-card communication-intro"><header className="lesson-heading"><div><span className="eyebrow">Everyday English</span><h3>{lesson.intro.title}</h3><p className="acl-intro-translation">{lesson.intro.title_vi}</p></div>{sound}</header><div className="communication-foundation"><article><strong>What does ... look like?</strong><p>{lesson.intro.appearance_rule_vi}</p></article><article><strong>What is ... like?</strong><p>{lesson.intro.personality_rule_vi}</p></article></div><p className="communication-caution">🎂 {lesson.intro.birthday_note_vi}</p><div className="acl-intro-actions"><button className="primary-button" type="button" onClick={() => open("hub")}>Bắt đầu {GAME_META.length} trò chơi</button></div></section>;

  if (screen === "hub") return <section className="lesson-card acl-hub"><header className="lesson-heading"><div><span className="eyebrow">Communication Trail</span><h3>Friend Talk</h3><p className="lesson-lead">Hoàn thành năm thử thách để hỏi, mô tả và chia sẻ ý kiến về bạn bè.</p></div>{sound}</header><div className="acl-progress"><strong>{completed.size}/{GAME_META.length}</strong><div className="progress-track"><span style={{ width: `${completed.size * (100 / GAME_META.length)}%` }} /></div></div><div className="acl-game-grid">{GAME_META.map((game, index) => <button type="button" key={game.id} className={completed.has(game.id) ? "acl-game-card acl-game-card--done" : "acl-game-card"} onClick={() => open(game.id)}><span className="acl-game-number">{completed.has(game.id) ? "✓" : index + 1}</span><span className="acl-game-icon" aria-hidden="true">{game.icon}</span><strong>{game.title}</strong><span>{game.description}</span></button>)}</div><button className="secondary-button acl-review-intro" type="button" onClick={() => open("intro")}>Xem lại kiến thức nền</button></section>;

  const shared = { speech, onBack: () => open("hub"), initialIndex: reviewTarget?.questionIndex ?? 0 };
  if (screen === "dialogue") return <DialogueLab {...shared} onComplete={() => finish("dialogue")} />;
  if (screen === "interview") return <BestFriendInterview {...shared} onComplete={() => finish("interview")} />;
  if (screen === "detective") return <StudentDetective {...shared} onComplete={() => finish("detective")} />;
  if (screen === "birthday") return <BirthdayPersonality {...shared} onComplete={() => finish("birthday")} />;
  return <ShareOpinion {...shared} onComplete={() => finish("opinion")} />;
}
