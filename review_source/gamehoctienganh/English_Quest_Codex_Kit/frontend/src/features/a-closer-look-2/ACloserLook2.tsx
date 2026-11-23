import { useEffect, useId, useMemo, useState } from "react";
import lessonJson from "../../../../data/lessons/unit3_a_closer_look2.json";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { useAuth } from "../../auth/AuthProvider";
import { useProgress } from "../../progress/ProgressProvider";
import { useActivityScoring } from "../../progress/useActivityScoring";
import type { QuestionScore } from "../../progress/scoringEngine";
import type { ReviewTarget } from "../../reviewTarget";
import { stableShuffle } from "../skills-common/learningUx";
import {
  isBuilderAnswer,
  isGuessingAnswer,
  isQuestionAnswer,
  isReporterAnswer,
  isTenseAnswer,
  validateCloserLook2Data,
  type CloserLook2Data,
  type CloserLook2GameId,
  type TenseId,
} from "./closerLook2Engine";

const lesson = validateCloserLook2Data(lessonJson as CloserLook2Data);
type Screen = "intro" | "hub" | CloserLook2GameId;
type SharedProps = { speech: SpeechQueue; onBack: () => void; onComplete: () => void; initialIndex?: number };

const GAME_META: Array<{ id: CloserLook2GameId; icon: string; title: string; description: string }> = [
  { id: "builder", icon: "🧩", title: "Bài 1 · Chia động từ", description: "Chia động từ ở hiện tại tiếp diễn." },
  { id: "reporter", icon: "🖼️", title: "Bài 2 · Viết câu theo hình", description: "Dùng dạng khẳng định hoặc phủ định." },
  { id: "questions", icon: "🔁", title: "Bài 3 · Hỏi và trả lời", description: "Luyện câu hỏi Yes/No theo hình." },
  { id: "detective", icon: "🕵️", title: "Bài 4 · Chọn đúng thì", description: "Hiện tại đơn hay hiện tại tiếp diễn." },
  { id: "guessing", icon: "🎭", title: "Bài 5 · Charades", description: "Diễn tả và đoán hành động." },
];

function GameShell({ eyebrow, title, help, questionKey, onHelp, onBack, children }: { eyebrow: string; title: string; help: { source_title: string; teaching_vi: string; steps: string[] }; questionKey: number; onHelp: () => void; onBack: () => void; children: React.ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpId = useId();
  useEffect(() => setHelpOpen(false), [questionKey]);
  return <section className="lesson-card acl-game acl2-game">
    <button className="back-to-games" type="button" onClick={onBack}>← Danh sách trò chơi</button>
    <header className="acl-game-header"><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div><button className="acl-help-button" type="button" aria-label="Xem hướng dẫn cách chơi" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => { if (!open) onHelp(); return !open; })}>?</button></header>
    {helpOpen && <aside className="acl-help-panel" id={helpId}><span className="eyebrow">Lời giảng gợi ý</span><h4>{help.teaching_vi}</h4><p lang="en"><em>{help.source_title}</em></p><ol>{help.steps.map((step) => <li key={step}>{step}</li>)}</ol></aside>}
    {children}
  </section>;
}

function useScoredGame(activityId: string, index: number, initialIndex: number, onComplete: () => void) {
  const scoring = useActivityScoring(10, initialIndex);
  const { submitActivityResult } = useProgress();
  const [questionScore, setQuestionScore] = useState<QuestionScore | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    scoring.startQuestion();
    setQuestionScore(null);
    setSaveError("");
  }, [index, scoring.startQuestion]);
  function markCorrect() {
    scoring.breakWrongStreak();
    setQuestionScore(scoring.completeQuestion());
  }
  async function finishGame() {
    setSaving(true); setSaveError("");
    try {
      const { questions } = scoring.finish();
      await submitActivityResult({ unitId: "unit3", activityId, completed: true, questions });
      onComplete();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm. Em hãy thử lại.");
    } finally { setSaving(false); }
  }
  return { recordHelp: scoring.recordHelp, recordWrong: scoring.recordWrong, markCorrect, finishGame, questionScore, saving, saveError };
}

function ScoreFeedback({ score, error }: { score: QuestionScore | null; error: string }) {
  return <>{score && <p className="acl2-question-score">+{score.earned}/100 điểm · {score.rankLabel}</p>}{error && <p className="auth-error" role="alert">{error}</p>}</>;
}

function RoundProgress({ index, correct, total = 5 }: { index: number; correct: boolean; total?: number }) {
  const completed = index + (correct ? 1 : 0);
  return <div className="acl-progress"><strong>{index + 1}/{total}</strong><div className="progress-track"><span style={{ width: `${(completed / total) * 100}%` }} /></div></div>;
}

function NextButton({ index, busy, onNext, total = 5 }: { index: number; busy: boolean; onNext: () => void; total?: number }) {
  return <div className="acl-finish-action"><button className="primary-button" type="button" disabled={busy} onClick={onNext}>{index === total - 1 ? "Hoàn thành" : "Bài tiếp theo"}</button></div>;
}

function BeBuilder({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.be_builder.length - 1)));
  const [selectedBe, setSelectedBe] = useState("");
  const [selectedVerb, setSelectedVerb] = useState("");
  const [correct, setCorrect] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("Chọn một mảnh ở mỗi hàng để ghép câu.");
  const item = lesson.be_builder[index];
  const scored = useScoredGame("unit3-a-closer-look2-builder", index, initialIndex, onComplete);

  async function choose(kind: "be" | "verb", value: string) {
    if (busy || correct) return;
    const nextBe = kind === "be" ? value : selectedBe;
    const nextVerb = kind === "verb" ? value : selectedVerb;
    if (kind === "be") setSelectedBe(value); else setSelectedVerb(value);
    setBusy(true);
    await speech.enqueue({ text: value, lang: "en-US", rate: 0.8 });
    if (nextBe && nextVerb) {
      if (isBuilderAnswer(item, nextBe, nextVerb)) {
        setCorrect(true); setFeedback(`Chính xác! ${item.sentence}`);
        scored.markCorrect();
        await speech.enqueue({ text: item.sentence, lang: "en-US", rate: 0.84 });
      } else {
        scored.recordWrong();
        setFeedback("Hai mảnh chưa khớp. Em kiểm tra lại chủ ngữ, am/is/are và dạng -ing nhé!");
      }
    }
    setBusy(false);
  }
  async function next() {
    if (index === lesson.be_builder.length - 1) { await scored.finishGame(); return; }
    setIndex(index + 1); setSelectedBe(""); setSelectedVerb(""); setCorrect(false); setFeedback("Chọn một mảnh ở mỗi hàng để ghép câu.");
  }
  return <GameShell eyebrow="Bài luyện tập 1" title="Chia động từ trong ngoặc" help={lesson.game_help.builder} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <RoundProgress index={index} correct={correct} total={lesson.be_builder.length} />
    <div className="acl2-task-card"><span>{item.polarity === "positive" ? "Khẳng định" : item.polarity === "negative" ? "Phủ định" : "Câu hỏi"}</span><h4>{item.polarity === "question" ? `___ ${item.subject} ___?` : `${item.subject} + ___ + ${item.polarity === "negative" ? "not + " : ""}___`}</h4><p>Động từ gốc: <strong>{item.verb}</strong> · {item.cue_vi}</p></div>
    <div className="acl2-pick-section"><strong>1. Chọn am / is / are</strong><div className="acl2-option-grid acl2-option-grid--three">{stableShuffle(item.be_options,`builder-be-${index}`).map((option) => <button type="button" key={option} aria-pressed={selectedBe === option} disabled={busy || correct} onClick={() => void choose("be", option)}>{option}</button>)}</div></div>
    <div className="acl2-pick-section"><strong>2. Chọn dạng động từ</strong><div className="acl2-option-grid acl2-option-grid--three">{stableShuffle(item.verb_options,`builder-verb-${index}`).map((option) => <button type="button" key={option} aria-pressed={selectedVerb === option} disabled={busy || correct} onClick={() => void choose("verb", option)}>{option}</button>)}</div></div>
    {correct && <div className="acl2-answer"><strong>{item.sentence}</strong><span>{item.sentence_vi}</span></div>}
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} />
    <p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>
    {correct && <NextButton index={index} busy={busy || scored.saving} onNext={() => void next()} total={lesson.be_builder.length} />}
  </GameShell>;
}

function ActionReporter({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.action_reporter.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Chọn câu tường thuật đúng nhất.");
  const item = lesson.action_reporter[index];
  const scored = useScoredGame("unit3-a-closer-look2-reporter", index, initialIndex, onComplete);
  async function choose(option: string) {
    if (busy || correct) return; setBusy(true); await speech.enqueue({ text: option, lang: "en-US", rate: 0.84 });
    if (isReporterAnswer(item, option)) { setCorrect(true); scored.markCorrect(); setFeedback("Bản tin chính xác!"); await speech.enqueue({ text: item.answer, lang: "en-US", rate: 0.84 }); }
    else { scored.recordWrong(); setFeedback("Câu này chưa mô tả đúng điều đang diễn ra. Em thử lại nhé!"); } setBusy(false);
  }
  async function next() { if (index === lesson.action_reporter.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Chọn câu tường thuật đúng nhất."); }
  return <GameShell eyebrow="Bài luyện tập 2" title="Viết câu theo hình" help={lesson.game_help.reporter} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <RoundProgress index={index} correct={correct} total={lesson.action_reporter.length} /><div className="acl2-scene-card"><span aria-hidden="true">{item.emoji}</span><p>{item.scene_vi}</p></div>
    <div className="acl2-option-grid">{stableShuffle(item.options,`reporter-${index}`).map((option) => <button type="button" key={option} disabled={busy || correct} onClick={() => void choose(option)}>{option}</button>)}</div>
    {correct && <div className="acl2-answer"><strong>{item.answer}</strong><span>{item.answer_vi}</span></div>}
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} /><p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>{correct && <NextButton index={index} busy={busy || scored.saving} onNext={() => void next()} total={lesson.action_reporter.length} />}
  </GameShell>;
}

function QuestionSwitch({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.question_switch.length - 1))); const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState(""); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Chọn câu hỏi, rồi chọn câu trả lời ngắn.");
  const item = lesson.question_switch[index];
  const scored = useScoredGame("unit3-a-closer-look2-questions", index, initialIndex, onComplete);
  async function choose(kind: "question" | "answer", value: string) {
    if (busy || correct) return; const nextQuestion = kind === "question" ? value : question; const nextAnswer = kind === "answer" ? value : answer;
    if (kind === "question") setQuestion(value); else setAnswer(value); setBusy(true); await speech.enqueue({ text: value, lang: "en-US", rate: 0.82 });
    if (nextQuestion && nextAnswer) {
      if (isQuestionAnswer(item, nextQuestion, nextAnswer)) { setCorrect(true); scored.markCorrect(); setFeedback("Đúng trật tự và đúng câu trả lời!"); await speech.enqueue({ text: `${item.question} ${item.short_answer}`, lang: "en-US", rate: 0.84 }); }
      else { scored.recordWrong(); setFeedback("Một phần chưa đúng. Hãy đưa am/is/are lên trước chủ ngữ và dùng lại be trong câu trả lời."); }
    }
    setBusy(false);
  }
  async function next() { if (index === lesson.question_switch.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setQuestion(""); setAnswer(""); setCorrect(false); setFeedback("Chọn câu hỏi, rồi chọn câu trả lời ngắn."); }
  return <GameShell eyebrow="Bài luyện tập 3" title="Hỏi và trả lời theo hình" help={lesson.game_help.questions} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <RoundProgress index={index} correct={correct} total={lesson.question_switch.length} /><div className="acl2-task-card"><span>Tình huống</span><p>{item.situation_vi}</p></div>
    <div className="acl2-pick-section"><strong>1. Câu hỏi</strong><div className="acl2-option-grid">{stableShuffle(item.question_options,`question-${index}`).map((option) => <button type="button" key={option} aria-pressed={question === option} disabled={busy || correct} onClick={() => void choose("question", option)}>{option}</button>)}</div></div>
    <div className="acl2-pick-section"><strong>2. Trả lời ngắn</strong><div className="acl2-option-grid acl2-option-grid--three">{stableShuffle(item.answer_options,`answer-${index}`).map((option) => <button type="button" key={option} aria-pressed={answer === option} disabled={busy || correct} onClick={() => void choose("answer", option)}>{option}</button>)}</div></div>
    {correct && <div className="acl2-answer"><strong>{item.question}</strong><span>{item.short_answer}</span></div>}
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} /><p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>{correct && <NextButton index={index} busy={busy || scored.saving} onNext={() => void next()} total={lesson.question_switch.length} />}
  </GameShell>;
}

function TimeDetective({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.time_detective.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Đọc ý nghĩa rồi chọn thì phù hợp.");
  const item = lesson.time_detective[index];
  const scored = useScoredGame("unit3-a-closer-look2-detective", index, initialIndex, onComplete);
  async function choose(tense: TenseId) {
    if (busy || correct) return; const label = tense === "simple" ? "Present simple" : "Present continuous"; setBusy(true); await speech.enqueue({ text: label, lang: "en-US", rate: 0.8 });
    if (isTenseAnswer(item, tense)) { setCorrect(true); scored.markCorrect(); setFeedback("Thám tử thời gian đã tìm đúng dấu hiệu!"); await speech.enqueue({ text: item.completed_sentence, lang: "en-US", rate: 0.84 }); }
    else { scored.recordWrong(); setFeedback("Chưa đúng. Em hãy hỏi: đây là thói quen hay hành động đang xảy ra?"); } setBusy(false);
  }
  async function next() { if (index === lesson.time_detective.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Đọc ý nghĩa rồi chọn thì phù hợp."); }
  return <GameShell eyebrow="Bài luyện tập 4" title="Hiện tại đơn hay hiện tại tiếp diễn" help={lesson.game_help.detective} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <RoundProgress index={index} correct={correct} total={lesson.time_detective.length} /><div className="acl2-context-card"><span>🔎</span><p lang="en">{item.context}</p><small>{item.context_vi}</small></div>
    <div className="acl2-tense-buttons"><button type="button" disabled={busy || correct} onClick={() => void choose("simple")}><strong>Present simple</strong><span>Thói quen / lặp lại</span></button><button type="button" disabled={busy || correct} onClick={() => void choose("continuous")}><strong>Present continuous</strong><span>Đang xảy ra lúc này</span></button></div>
    {correct && <div className="acl2-answer"><strong>{item.completed_sentence}</strong><span>{item.completed_sentence_vi}</span></div>}
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} /><p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>{correct && <NextButton index={index} busy={busy || scored.saving} onNext={() => void next()} total={lesson.time_detective.length} />}
  </GameShell>;
}

function ActionGuessing({ speech, onBack, onComplete, initialIndex = 0 }: SharedProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.action_guessing.length - 1))); const [correct, setCorrect] = useState(false); const [busy, setBusy] = useState(false); const [feedback, setFeedback] = useState("Chọn câu hỏi để đoán hành động.");
  const item = lesson.action_guessing[index];
  const scored = useScoredGame("unit3-a-closer-look2-guessing", index, initialIndex, onComplete);
  async function choose(option: string) {
    if (busy || correct) return; setBusy(true); await speech.enqueue({ text: option, lang: "en-US", rate: 0.82 });
    if (isGuessingAnswer(item, option)) { setCorrect(true); scored.markCorrect(); setFeedback("Đoán đúng rồi!"); await speech.enqueue({ text: `${item.question} ${item.short_answer}`, lang: "en-US", rate: 0.84 }); }
    else { scored.recordWrong(); setFeedback("Câu hỏi này chưa khớp với hành động. Em thử câu khác nhé!"); } setBusy(false);
  }
  async function next() { if (index === lesson.action_guessing.length - 1) { await scored.finishGame(); return; } setIndex(index + 1); setCorrect(false); setFeedback("Chọn câu hỏi để đoán hành động."); }
  return <GameShell eyebrow="Bài luyện tập 5" title="Charades · Đoán hành động" help={lesson.game_help.guessing} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <RoundProgress index={index} correct={correct} total={lesson.action_guessing.length} /><div className="acl2-guess-card"><span aria-hidden="true">{item.emoji}</span><h4>Đoán hành động</h4><p>{item.clue_vi}</p></div>
    <div className="acl2-option-grid">{stableShuffle(item.options,`guess-${index}`).map((option) => <button type="button" key={option} disabled={busy || correct} onClick={() => void choose(option)}>{option}</button>)}</div>
    {correct && <div className="acl2-answer"><strong>{item.question}</strong><span>{item.short_answer}</span></div>}
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} /><p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>{correct && <NextButton index={index} busy={busy || scored.saving} onNext={() => void next()} total={lesson.action_guessing.length} />}
  </GameShell>;
}

export function ACloserLook2({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  const { summary } = useAuth();
  const speech = useMemo(() => new SpeechQueue(), []);
  const targetScreen = useMemo<CloserLook2GameId | null>(() => {
    const map: Record<string, CloserLook2GameId> = { "unit3-a-closer-look2-builder": "builder", "unit3-a-closer-look2-reporter": "reporter", "unit3-a-closer-look2-questions": "questions", "unit3-a-closer-look2-detective": "detective", "unit3-a-closer-look2-guessing": "guessing" };
    return reviewTarget ? map[reviewTarget.activityId] ?? null : null;
  }, [reviewTarget]);
  const [screen, setScreen] = useState<Screen>(() => targetScreen ?? "intro");
  const [completed, setCompleted] = useState<Set<CloserLook2GameId>>(() => new Set());
  const [muted, setMuted] = useState(false);
  useEffect(() => () => speech.dispose(), [speech]);
  useEffect(() => {
    const map: Record<string, CloserLook2GameId> = { "unit3-a-closer-look2-builder": "builder", "unit3-a-closer-look2-reporter": "reporter", "unit3-a-closer-look2-questions": "questions", "unit3-a-closer-look2-detective": "detective", "unit3-a-closer-look2-guessing": "guessing" };
    const saved = new Set<CloserLook2GameId>();
    summary?.progress?.forEach((item) => { const id = map[item.activity_id]; if (id && item.completed) saved.add(id); });
    setCompleted((current) => new Set([...current, ...saved]));
  }, [summary]);
  useEffect(() => { if (targetScreen) setScreen(targetScreen); }, [targetScreen]);
  function open(next: Screen) { speech.cancel(); setScreen(next); }
  function finish(game: CloserLook2GameId) { setCompleted((current) => new Set(current).add(game)); open("hub"); }
  function toggleMuted() { const next = !muted; setMuted(next); speech.setMuted(next); }
  const audioButton = <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>{muted ? "Bật âm thanh" : "Tắt âm thanh"}</button>;

  if (screen === "intro") return <section className="lesson-card acl-intro acl2-intro">
    <header className="lesson-heading"><div><span className="eyebrow">Grammar · Communication</span><h3>{lesson.intro.title}</h3><p className="acl-intro-translation">{lesson.intro.title_vi}</p></div>{audioButton}</header>
    <p className="lesson-lead">{lesson.intro.description_vi}</p>
    <section className="acl-foundation acl2-foundation" aria-labelledby="continuous-foundation-title"><header><span>Kiến thức nền 1</span><h4 id="continuous-foundation-title">Hiện tại tiếp diễn</h4></header><div className="acl-definition"><span aria-hidden="true">⏱️</span><div><strong>Khi nào dùng?</strong><p>{lesson.intro.present_continuous.use_vi}</p><div className="acl2-marker-row">{lesson.intro.present_continuous.time_markers.map((marker) => <small key={marker}>{marker}</small>)}</div></div></div><div className="acl2-pattern-grid">{lesson.intro.present_continuous.patterns.map((pattern) => <article key={pattern.id}><span>{pattern.label_vi}</span><strong>{pattern.pattern}</strong><p lang="en">{pattern.example}</p><small>{pattern.example_vi}</small><button type="button" onClick={() => void speech.enqueue({ text: pattern.example, lang: "en-US", rate: 0.82 })}>🔊 Nghe câu mẫu</button></article>)}</div></section>
    <section className="acl-foundation acl2-foundation acl2-foundation--contrast" aria-labelledby="tense-foundation-title"><header><span>Kiến thức nền 2</span><h4 id="tense-foundation-title">Hiện tại đơn hay hiện tại tiếp diễn?</h4></header><div className="acl2-contrast-grid"><article><span>Present simple</span><p>{lesson.intro.tense_choice.simple_vi}</p><div>{lesson.intro.tense_choice.simple_markers.map((marker) => <small key={marker}>{marker}</small>)}</div></article><article><span>Present continuous</span><p>{lesson.intro.tense_choice.continuous_vi}</p><div>{lesson.intro.tense_choice.continuous_markers.map((marker) => <small key={marker}>{marker}</small>)}</div></article></div><p className="acl-practice-tip">💡 {lesson.intro.tense_choice.decision_tip_vi}</p></section>
    <div className="acl-intro-actions"><button className="primary-button" type="button" onClick={() => open("hub")}>Bắt đầu {GAME_META.length} trò chơi</button></div>
  </section>;

  if (screen === "hub") return <section className="lesson-card acl-hub acl2-hub"><header className="lesson-heading"><div><span className="eyebrow">Grammar Lab</span><h3>Present Actions Trail</h3><p className="lesson-lead">Hoàn thành {GAME_META.length} thử thách để dùng đúng hành động hiện tại.</p></div>{audioButton}</header><div className="acl-progress"><strong>{completed.size}/{GAME_META.length}</strong><div className="progress-track"><span style={{ width: `${completed.size * (100 / GAME_META.length)}%` }} /></div></div><div className="acl-game-grid">{GAME_META.map((game, index) => <button type="button" key={game.id} className={completed.has(game.id) ? "acl-game-card acl-game-card--done" : "acl-game-card"} onClick={() => open(game.id)}><span className="acl-game-number">{completed.has(game.id) ? "✓" : index + 1}</span><span className="acl-game-icon" aria-hidden="true">{game.icon}</span><strong>{game.title}</strong><span>{game.description}</span></button>)}</div><button className="secondary-button acl-review-intro" type="button" onClick={() => open("intro")}>Xem lại kiến thức nền</button></section>;

  const shared = { speech, onBack: () => open("hub"), initialIndex: reviewTarget?.questionIndex ?? 0 };
  if (screen === "builder") return <BeBuilder {...shared} onComplete={() => finish("builder")} />;
  if (screen === "reporter") return <ActionReporter {...shared} onComplete={() => finish("reporter")} />;
  if (screen === "questions") return <QuestionSwitch {...shared} onComplete={() => finish("questions")} />;
  if (screen === "detective") return <TimeDetective {...shared} onComplete={() => finish("detective")} />;
  return <ActionGuessing {...shared} onComplete={() => finish("guessing")} />;
}
