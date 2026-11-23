import { useEffect, useId, useMemo, useRef, useState } from "react";
import lessonJson from "../../../../data/lessons/unit3_a_closer_look1.json";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { pronunciationSpeechText } from "../skills-common/learningUx";
import { useAuth } from "../../auth/AuthProvider";
import { useProgress } from "../../progress/ProgressProvider";
import { useActivityScoring } from "../../progress/useActivityScoring";
import type { QuestionScore } from "../../progress/scoringEngine";
import type { ReviewTarget } from "../../reviewTarget";
import {
  isContextAnswer,
  isGardenAnswer,
  isPictureMatch,
  isSoundAnswer,
  validateCloserLookData,
  type CloserLookData,
  type GameId,
  type InitialSound,
} from "./closerLookEngine";

const lesson = validateCloserLookData(lessonJson as CloserLookData);
type Screen = "intro" | "hub" | GameId;
type SharedGameProps = { speech: SpeechQueue; onBack: () => void; onComplete: () => void; initialIndex?: number };

const GAME_META: Array<{ id: GameId; icon: string; title: string; description: string }> = [
  { id: "picture", icon: "🖼️", title: "Picture Match", description: "Ghép tính từ với hành động của nhân vật." },
  { id: "context", icon: "🔎", title: "Context Clues", description: "Đọc tình huống và tìm tính cách phù hợp." },
  { id: "garden", icon: "🌼", title: "Friendship Garden", description: "Chọn hai cánh hoa tính cách cho mỗi nhân vật." },
  { id: "sound", icon: "👄", title: "Sound Sort", description: "Nghe và phân loại âm đầu /b/ hoặc /p/." },
  { id: "rhythm", icon: "🥁", title: "Rhythm Echo", description: "Nghe từng dòng, đọc theo và giữ đúng nhịp." },
];

function GameShell({ eyebrow, title, help, questionKey, onHelp, onBack, children }: { eyebrow: string; title: string; help: string[]; questionKey: number; onHelp: () => void; onBack: () => void; children: React.ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpId = useId();
  useEffect(() => setHelpOpen(false), [questionKey]);
  return <section className="lesson-card acl-game">
    <button className="back-to-games" type="button" onClick={onBack}>← Danh sách trò chơi</button>
    <header className="acl-game-header"><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div><button className="acl-help-button" type="button" aria-label="Xem hướng dẫn cách chơi" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => { if (!open) onHelp(); return !open; })}>?</button></header>
    {helpOpen && <aside className="acl-help-panel" id={helpId}><h4>Cách chơi</h4><ol>{help.map((step) => <li key={step}>{step}</li>)}</ol></aside>}
    {children}
  </section>;
}

function useScoredGame(activityId: string, questionKey: number, initialIndex: number, onComplete: () => void) {
  const scoring = useActivityScoring(10, initialIndex);
  const { submitActivityResult } = useProgress();
  const [questionScore, setQuestionScore] = useState<QuestionScore | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    scoring.startQuestion();
    setQuestionScore(null);
    setSaveError("");
  }, [questionKey, scoring.startQuestion]);
  function markComplete() {
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
  return { recordHelp: scoring.recordHelp, recordWrong: scoring.recordWrong, markComplete, finishGame, questionScore, saving, saveError };
}

function ScoreFeedback({ score, error }: { score: QuestionScore | null; error: string }) {
  return <>{score && <p className="acl2-question-score">+{score.earned}/100 điểm · {score.rankLabel}</p>}{error && <p className="auth-error" role="alert">{error}</p>}</>;
}

function usePracticeConfirmation(activityId: string, onComplete: () => void) {
  const { confirmPractice } = useAuth();
  const started = useRef(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  function begin() {
    started.current = true;
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (started.current && document.visibilityState === "visible") setElapsedSeconds((value) => Math.min(60, value + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);
  async function confirm() {
    if (elapsedSeconds < 60 || saving) return;
    setSaving(true); setError("");
    try { await confirmPractice("unit3", activityId, elapsedSeconds); onComplete(); }
    catch (value) { setError(value instanceof Error ? value.message : "Chưa xác nhận được phần luyện tập."); }
    finally { setSaving(false); }
  }
  return { begin, elapsedSeconds, canConfirm: elapsedSeconds >= 60, saving, error, confirm };
}

function PracticeConfirmation({ elapsedSeconds, canConfirm, saving, error, onConfirm }: { elapsedSeconds: number; canConfirm: boolean; saving: boolean; error: string; onConfirm: () => void }) {
  return <aside className="practice-confirmation">
    <strong>Hoạt động tính điểm theo thời gian · tối đa 1.000 điểm</strong>
    <p>Đồng hồ chỉ chạy khi trang đang hiển thị. Luyện đủ 60 giây để hoàn thành và nhận 1.000 điểm; hệ thống không chấm chất lượng phát âm.</p>
    <span aria-live="polite">Thời gian chủ động: {elapsedSeconds}/60 giây · Điểm dự kiến: {Math.floor(elapsedSeconds / 60 * 1000)}/1.000</span>
    <button className="primary-button" type="button" disabled={!canConfirm || saving} onClick={onConfirm}>{saving ? "Đang lưu điểm…" : canConfirm ? "Hoàn thành và lưu 1.000 điểm" : "Tiếp tục luyện đủ 60 giây"}</button>
    {error && <p className="auth-error" role="alert">{error}</p>}
  </aside>;
}

function PictureMatch({ speech, onBack, onComplete }: SharedGameProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [feedback, setFeedback] = useState("Chọn một từ, sau đó chọn bức tranh phù hợp.");
  const [busy, setBusy] = useState(false);
  const scored = useScoredGame("unit3-a-closer-look1-picture", Math.min(matched.size, lesson.picture_match.length - 1), 0, onComplete);
  async function chooseWord(word: string) {
    if (busy || matched.has(word)) return;
    setSelected(word); setBusy(true); await speech.enqueue({ text: word, lang: "en-US", rate: 0.82 }); setBusy(false);
  }
  async function chooseScene(item: (typeof lesson.picture_match)[number]) {
    if (!selected || busy || matched.has(item.word)) return;
    if (!isPictureMatch(selected, item)) { scored.recordWrong(); setFeedback("Chưa đúng bức tranh rồi. Em quan sát hành động và thử lại nhé!"); return; }
    scored.markComplete();
    const next = new Set(matched).add(item.word); setMatched(next); setSelected(null); setFeedback(`Chính xác! ${item.word} – ${item.vi}.`);
    setBusy(true); await speech.enqueue({ text: item.sentence, lang: "en-US", rate: 0.84 }); setBusy(false);
  }
  return <GameShell eyebrow="Game 1 · Vocabulary" title="Picture Match" help={lesson.game_help.picture} questionKey={matched.size} onHelp={scored.recordHelp} onBack={onBack}>
    <p className="lesson-lead">Chọn từ rồi ghép với minh họa hành động. Mọi hình đều là minh họa mới của ứng dụng.</p>
    <div className="acl-progress"><strong>{matched.size}/{lesson.picture_match.length}</strong><div className="progress-track"><span style={{ width: `${(matched.size / lesson.picture_match.length) * 100}%` }} /></div></div>
    <div className="acl-word-bank" aria-label="Các tính từ">
      {lesson.picture_match.map((item) => <button type="button" key={item.id} disabled={busy || matched.has(item.word)} aria-pressed={selected === item.word} className={matched.has(item.word) ? "acl-word acl-word--done" : "acl-word"} onClick={() => void chooseWord(item.word)}>{item.word}</button>)}
    </div>
    <div className="acl-scene-grid">
      {lesson.picture_match.map((item) => <button type="button" key={item.id} disabled={busy || matched.has(item.word)} className={matched.has(item.word) ? "acl-scene acl-scene--done" : "acl-scene"} onClick={() => void chooseScene(item)} aria-label={item.scene}>
        <span className="acl-scene-art" aria-hidden="true">{item.emoji}</span><strong>{item.scene}</strong>{matched.has(item.word) && <span>{item.word} · {item.vi}</span>}
      </button>)}
    </div>
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} />
    <p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>
    {matched.size === lesson.picture_match.length && <div className="acl-finish-action"><button className="primary-button" type="button" disabled={busy || scored.saving} onClick={() => void scored.finishGame()}>Hoàn thành trò chơi</button></div>}
  </GameShell>;
}

function ContextClues({ speech, onBack, onComplete, initialIndex = 0 }: SharedGameProps) {
  const audioRun = useRef(0);
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.context_clues.questions.length - 1)));
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState("Tìm từ mô tả đúng nhất tính cách của nhân vật.");
  const [busy, setBusy] = useState(false);
  const question = lesson.context_clues.questions[index];
  const scored = useScoredGame("unit3-a-closer-look1-context", index, initialIndex, onComplete);
  useEffect(() => () => { audioRun.current += 1; }, []);
  async function answer(word: string) {
    if (busy || correct) return;
    const run = audioRun.current + 1; audioRun.current = run;
    setBusy(true); await speech.enqueue({ text: word, lang: "en-US", rate: 0.82 });
    if (audioRun.current !== run) return;
    if (!isContextAnswer(question, word)) { scored.recordWrong(); setFeedback("Từ này chưa khớp với dấu hiệu trong câu. Em thử lại nhé!"); setBusy(false); return; }
    setCorrect(true); scored.markComplete(); setFeedback(`Đúng rồi! ${word}.`); await speech.enqueue({ text: question.prompt, lang: "en-US", rate: 0.84 });
    if (audioRun.current === run) setBusy(false);
  }
  function next() {
    if (index === lesson.context_clues.questions.length - 1) { void scored.finishGame(); return; }
    setIndex(index + 1); setCorrect(false); setFeedback("Tìm từ mô tả đúng nhất tính cách của nhân vật.");
  }
  return <GameShell eyebrow="Game 2 · Vocabulary" title="Context Clues" help={lesson.game_help.context} questionKey={index} onHelp={scored.recordHelp} onBack={() => { audioRun.current += 1; onBack(); }}>
    <div className="acl-progress"><strong>{index + 1}/{lesson.context_clues.questions.length}</strong><div className="progress-track"><span style={{ width: `${((index + (correct ? 1 : 0)) / lesson.context_clues.questions.length) * 100}%` }} /></div></div>
    <div className="acl-prompt-card"><span>Dấu hiệu tính cách</span><p>{question.prompt}</p>{correct && <p className="acl-translation" lang="vi">{question.prompt_vi}</p>}</div>
    <div className="acl-word-bank acl-word-bank--six">
      {lesson.context_clues.word_bank.map((word) => <button className={correct && word === question.answer ? "acl-word acl-word--done" : "acl-word"} type="button" key={word} disabled={busy || correct} onClick={() => void answer(word)}>{word}</button>)}
    </div>
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} />
    <p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>
    {correct && <div className="acl-finish-action"><button className="primary-button" type="button" disabled={busy || scored.saving} onClick={next}>{index === lesson.context_clues.questions.length - 1 ? "Hoàn thành" : "Tình huống tiếp theo"}</button></div>}
  </GameShell>;
}

function FriendshipGarden({ speech, onBack, onComplete, initialIndex = 0 }: SharedGameProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.friendship_garden.length - 1)));
  const [chosen, setChosen] = useState<string[]>([]);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState("Chọn đúng hai cánh hoa tính cách.");
  const [busy, setBusy] = useState(false);
  const character = lesson.friendship_garden[index];
  const bank = lesson.intro.vocabulary.map(({ word }) => word);
  const scored = useScoredGame("unit3-a-closer-look1-garden", index, initialIndex, onComplete);
  async function toggle(word: string) {
    if (busy || correct) return;
    setBusy(true); await speech.enqueue({ text: word, lang: "en-US", rate: 0.82 }); setBusy(false);
    setChosen((current) => current.includes(word) ? current.filter((item) => item !== word) : current.length < 2 ? [...current, word] : current);
  }
  async function check() {
    if (chosen.length !== 2 || busy) { setFeedback("Em hãy chọn đủ hai tính từ."); return; }
    if (!isGardenAnswer(character, chosen)) { scored.recordWrong(); setFeedback("Hai cánh hoa này chưa đúng. Em có thể bỏ chọn và thử lại!"); return; }
    setCorrect(true); scored.markComplete(); setFeedback(`Tuyệt lắm! ${character.sentence}`); setBusy(true); await speech.enqueue({ text: character.sentence, lang: "en-US", rate: 0.84 }); setBusy(false);
  }
  function next() {
    if (index === lesson.friendship_garden.length - 1) { void scored.finishGame(); return; }
    setIndex(index + 1); setChosen([]); setCorrect(false); setFeedback("Chọn đúng hai cánh hoa tính cách.");
  }
  return <GameShell eyebrow="Game 3 · Vocabulary" title="Friendship Garden" help={lesson.game_help.garden} questionKey={index} onHelp={scored.recordHelp} onBack={onBack}>
    <p className="lesson-lead">Các nhân vật đều là hư cấu. Chọn hai từ phù hợp với mỗi nhân vật.</p>
    <div className="acl-progress"><strong>{index + 1}/{lesson.friendship_garden.length}</strong><div className="progress-track"><span style={{ width: `${((index + (correct ? 1 : 0)) / lesson.friendship_garden.length) * 100}%` }} /></div></div>
    <div className="acl-garden-card"><span className="acl-avatar" aria-hidden="true">{character.emoji}</span><h4>{character.name}</h4><div className="acl-garden-clue"><p lang="en">{character.clue}</p><p lang="vi">{character.clue_vi}</p></div><div className="acl-petals">{chosen.length ? chosen.map((word) => <span key={word}>{word}</span>) : <span>Chọn 2 cánh hoa</span>}</div>{correct && <p lang="vi">{character.sentence_vi}</p>}</div>
    <div className="acl-word-bank acl-word-bank--garden">{bank.map((word) => <button type="button" className="acl-word" aria-pressed={chosen.includes(word)} disabled={busy || correct} key={word} onClick={() => void toggle(word)}>{word}</button>)}</div>
    <ScoreFeedback score={scored.questionScore} error={scored.saveError} />
    <p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>
    <div className="acl-finish-action">{correct ? <button className="primary-button" type="button" disabled={busy || scored.saving} onClick={next}>{index === lesson.friendship_garden.length - 1 ? "Hoàn thành" : "Nhân vật tiếp theo"}</button> : <button className="primary-button" type="button" disabled={busy} onClick={() => void check()}>Kiểm tra hai cánh hoa</button>}</div>
  </GameShell>;
}

function SoundSort({ speech, onBack, onComplete, initialIndex = 0 }: SharedGameProps) {
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.sound_sort.length - 1)));
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState("Nghe từ rồi chọn âm đầu em nghe thấy.");
  const [busy, setBusy] = useState(false);
  const item = lesson.sound_sort[index];
  const practice = usePracticeConfirmation("unit3-a-closer-look1-sound", onComplete);
  async function play() { if (!busy) { practice.begin(); setBusy(true); await speech.enqueue({ text: item.word, lang: "en-US", rate: 0.72 }); setBusy(false); } }
  async function answer(sound: InitialSound) {
    if (busy || correct) return;
    practice.begin();
    setBusy(true); await speech.enqueue({ text: item.word, lang: "en-US", rate: 0.72 });
    if (!isSoundAnswer(item, sound)) { setFeedback(`Chưa đúng. Hãy chú ý luồng hơi của âm /${sound}/ và nghe lại.`); setBusy(false); return; }
    setCorrect(true); setFeedback(`Chính xác! ${item.word} bắt đầu bằng âm /${sound}/.`); setBusy(false);
  }
  function next() {
    if (index === lesson.sound_sort.length - 1) { setIndex(0); setCorrect(false); setFeedback("Em có thể luyện lại hoặc xác nhận khi đủ thời gian."); return; }
    setIndex(index + 1); setCorrect(false); setFeedback("Nghe từ rồi chọn âm đầu em nghe thấy.");
  }
  return <GameShell eyebrow="Game 4 · Tính điểm theo 60 giây" title="Sound Sort /b/ và /p/" help={lesson.game_help.sound} questionKey={index} onHelp={practice.begin} onBack={onBack}>
    <div className="acl-sound-tip"><div><strong>/b/</strong><span>Cổ họng rung</span></div><div><strong>/p/</strong><span>Bật luồng hơi</span></div></div>
    <div className="acl-progress"><strong>{index + 1}/{lesson.sound_sort.length}</strong><div className="progress-track"><span style={{ width: `${((index + (correct ? 1 : 0)) / lesson.sound_sort.length) * 100}%` }} /></div></div>
    <div className="acl-sound-round"><span>Lượt {index + 1}</span><strong>{item.word}</strong><button className="secondary-button" type="button" disabled={busy} onClick={() => void play()}>🔊 Nghe từ</button></div>
    <div className="acl-sound-choices"><button type="button" disabled={busy || correct} onClick={() => void answer("b")}>/b/</button><button type="button" disabled={busy || correct} onClick={() => void answer("p")}>/p/</button></div>
    <p className="acl-feedback" role="status">{busy ? "Đang phát âm…" : feedback}</p>
    {correct && <div className="acl-finish-action"><button className="secondary-button" type="button" onClick={next}>{index === lesson.sound_sort.length - 1 ? "Luyện lại từ đầu" : "Từ tiếp theo"}</button></div>}
    <PracticeConfirmation elapsedSeconds={practice.elapsedSeconds} canConfirm={practice.canConfirm} saving={practice.saving} error={practice.error} onConfirm={() => void practice.confirm()} />
  </GameShell>;
}

function RhythmEcho({ speech, onBack, onComplete, initialIndex = 0, muted, onToggleMuted }: SharedGameProps & { muted: boolean; onToggleMuted: () => void }) {
  const [phase, setPhase] = useState<"idle" | "listen" | "repeat" | "ready" | "done">("idle");
  const [lineIndex, setLineIndex] = useState(Math.max(0, Math.min(initialIndex, lesson.rhythm_echo.lines.length - 1)));
  const [seconds, setSeconds] = useState(7);
  const runRef = useRef(0);
  const waitCancelRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<number | null>(null);
  const practice = usePracticeConfirmation("unit3-a-closer-look1-rhythm", onComplete);
  function clearWait() { waitCancelRef.current?.(); waitCancelRef.current = null; if (intervalRef.current !== null) window.clearInterval(intervalRef.current); intervalRef.current = null; }
  function stop() { runRef.current += 1; clearWait(); speech.cancel(); setPhase("idle"); setSeconds(7); }
  useEffect(() => () => { runRef.current += 1; clearWait(); speech.cancel(); }, [speech]);
  function waitForRepeat(ms: number) {
    return new Promise<void>((resolve) => {
      let finished = false;
      const timer = window.setTimeout(finish, ms);
      function finish() { if (finished) return; finished = true; window.clearTimeout(timer); if (intervalRef.current !== null) window.clearInterval(intervalRef.current); intervalRef.current = null; waitCancelRef.current = null; resolve(); }
      waitCancelRef.current = finish;
    });
  }
  async function startLine() {
    practice.begin(); stop(); const run = runRef.current; setPhase("listen");
    await speech.enqueue({ text: lesson.rhythm_echo.lines[lineIndex], lang: "en-US", rate: 0.72 });
    if (runRef.current !== run) return;
    setPhase("repeat"); setSeconds(Math.ceil(lesson.rhythm_echo.gap_ms / 1000)); let remaining = Math.ceil(lesson.rhythm_echo.gap_ms / 1000);
    intervalRef.current = window.setInterval(() => { remaining -= 1; setSeconds(Math.max(0, remaining)); }, 1000);
    await waitForRepeat(lesson.rhythm_echo.gap_ms);
    if (runRef.current === run) setPhase("ready");
  }
  function confirmLine() { if (phase !== "ready") return; setPhase("done"); }
  async function nextLine() {
    if (lineIndex === lesson.rhythm_echo.lines.length - 1) { setLineIndex(0); setPhase("idle"); return; }
    setLineIndex((current) => current + 1); setPhase("idle"); setSeconds(7);
  }
  const currentLine = lesson.rhythm_echo.lines[lineIndex];
  return <GameShell eyebrow="Game 5 · Tính điểm theo 60 giây" title="Rhythm Echo" help={lesson.game_help.rhythm} questionKey={lineIndex} onHelp={practice.begin} onBack={() => { stop(); onBack(); }}>
    <p className="lesson-lead">Mỗi dòng là một lượt. Nghe câu chậm, đọc lại trong 7 giây rồi tự xác nhận; ứng dụng không tự chấm độ chính xác phát âm.</p>
    <div className="acl-progress"><strong>{lineIndex + 1}/{lesson.rhythm_echo.lines.length}</strong><div className="progress-track"><span style={{ width: `${((lineIndex + (phase === "done" ? 1 : 0)) / lesson.rhythm_echo.lines.length) * 100}%` }} /></div></div>
    <div className={`acl-echo-card acl-echo-card--${phase}`}><span>{phase === "listen" ? "Hãy nghe" : phase === "repeat" ? `Đến lượt em · ${seconds}s` : phase === "ready" ? "Tự xác nhận" : phase === "done" ? "Đã hoàn thành dòng" : "Sẵn sàng"}</span><p>{currentLine}</p>{phase === "repeat" && <div className="acl-gap-meter" aria-hidden="true" />}</div>
    <ol className="acl-chant-lines">{lesson.rhythm_echo.lines.map((line, index) => <li className={phase !== "idle" && index === lineIndex ? "acl-chant-line--active" : ""} key={line}>{line}</li>)}</ol>
    <div className="acl-echo-actions"><button className="sound-button" type="button" aria-pressed={muted} onClick={onToggleMuted}>{muted ? "Bật âm thanh" : "Tắt âm thanh"}</button>{phase === "idle" && <button className="primary-button" type="button" onClick={() => void startLine()}>Nghe câu</button>}{(phase === "listen" || phase === "repeat") && <button className="secondary-button" type="button" onClick={stop}>Dừng</button>}{phase === "ready" && <><button className="secondary-button" type="button" onClick={() => void startLine()}>Nghe và đọc lại</button><button className="primary-button" type="button" onClick={confirmLine}>Em đã đọc xong</button></>}{phase === "done" && <button className="secondary-button" type="button" onClick={() => void nextLine()}>{lineIndex === lesson.rhythm_echo.lines.length - 1 ? "Luyện lại từ đầu" : "Dòng tiếp theo"}</button>}</div>
    <PracticeConfirmation elapsedSeconds={practice.elapsedSeconds} canConfirm={practice.canConfirm} saving={practice.saving} error={practice.error} onConfirm={() => void practice.confirm()} />
  </GameShell>;
}

export function ACloserLook1({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  const { summary } = useAuth();
  const speech = useMemo(() => new SpeechQueue(), []);
  const targetScreen = useMemo<Screen | null>(() => {
    const map: Record<string, GameId> = { "unit3-a-closer-look1-picture": "picture", "unit3-a-closer-look1-context": "context", "unit3-a-closer-look1-garden": "garden", "unit3-a-closer-look1-sound": "sound", "unit3-a-closer-look1-rhythm": "rhythm" };
    return reviewTarget ? map[reviewTarget.activityId] ?? null : null;
  }, [reviewTarget]);
  const [screen, setScreen] = useState<Screen>(() => targetScreen ?? "intro");
  const savedCompleted = useMemo(() => {
    const ids = new Set<GameId>();
    const scored: Record<string, GameId> = { "unit3-a-closer-look1-picture": "picture", "unit3-a-closer-look1-context": "context", "unit3-a-closer-look1-garden": "garden", "unit3-a-closer-look1-sound": "sound", "unit3-a-closer-look1-rhythm": "rhythm" };
    summary?.progress?.forEach((item) => { const id = scored[item.activity_id]; if (id && item.completed) ids.add(id); });
    return ids;
  }, [summary]);
  const [completed, setCompleted] = useState<Set<GameId>>(() => new Set());
  const [muted, setMuted] = useState(false);
  useEffect(() => () => speech.dispose(), [speech]);
  useEffect(() => setCompleted((current) => new Set([...current, ...savedCompleted])), [savedCompleted]);
  useEffect(() => { if (targetScreen) setScreen(targetScreen); }, [targetScreen]);
  function open(next: Screen) { speech.cancel(); setScreen(next); }
  function finish(game: GameId) { setCompleted((current) => new Set(current).add(game)); open("hub"); }
  function toggleMuted() { const next = !muted; setMuted(next); speech.setMuted(next); }
  const audioButton = <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>{muted ? "Bật âm thanh" : "Tắt âm thanh"}</button>;

  if (screen === "intro") return <section className="lesson-card acl-intro">
    <header className="lesson-heading"><div><span className="eyebrow">Vocabulary · Pronunciation</span><h3>{lesson.intro.title}</h3><p className="acl-intro-translation">{lesson.intro.title_vi}</p></div>{audioButton}</header>
    <section className="acl-foundation" aria-labelledby="personality-foundation-title"><header><span>Kiến thức nền 1</span><h4 id="personality-foundation-title">Nhóm từ vựng tính cách</h4></header><div className="acl-definition"><span aria-hidden="true">💡</span><div><strong>Personality adjectives là gì?</strong><p>{lesson.intro.description_vi}</p><p>Nhóm từ này giúp trả lời: <em>What is he or she like?</em></p></div></div>
      <div className="acl-compare"><article><span>Miêu tả ngoại hình</span><strong>Appearance</strong><div>{lesson.intro.appearance_examples.map((word) => <small key={word}>{word}</small>)}</div></article><article><span>Miêu tả tính cách</span><strong>Personality</strong><div>{lesson.intro.personality_examples.map((word) => <small key={word}>{word}</small>)}</div></article></div>
      <div className="acl-vocab-preview">{lesson.intro.vocabulary.map(({ word, vi }) => <article key={word}><strong>{word}</strong><span>{vi}</span></article>)}</div>
    </section>
    <section className="acl-foundation acl-foundation--sound" aria-labelledby="pronunciation-foundation-title"><header><span>Kiến thức nền 2</span><h4 id="pronunciation-foundation-title">{lesson.intro.pronunciation.title}</h4></header><p>{lesson.intro.pronunciation.description_vi}</p><div className="acl-pronunciation-grid">{lesson.intro.pronunciation.sounds.map((sound) => <article key={sound.symbol}><strong>{sound.symbol}</strong><span>{sound.tip_vi}</span><div>{sound.examples.map((example) => <small key={example}>{example}</small>)}</div><button type="button" onClick={() => void speech.replace({text:pronunciationSpeechText(sound.symbol,sound.examples,sound.symbol==="/b/"?"buh":"puh"),lang:"en-US",rate:.72})}>🔊 Nghe âm và từ ví dụ</button></article>)}</div><p className="acl-practice-tip">💡 {lesson.intro.pronunciation.practice_tip_vi}</p></section>
    <div className="acl-intro-actions"><button className="secondary-button" type="button" onClick={() => void speech.enqueue({ text: lesson.intro.guide_vi, lang: "vi-VN", rate: 0.9 })}>🔊 Nghe lời giới thiệu</button><button className="primary-button" type="button" onClick={() => open("hub")}>Bắt đầu {GAME_META.length} trò chơi</button></div>
    {!speech.available && <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản; bài học vẫn hoạt động bình thường.</p>}
  </section>;

  if (screen === "hub") return <section className="lesson-card acl-hub">
    <header className="lesson-heading"><div><span className="eyebrow">Vocabulary · Pronunciation</span><h3>Learning Trail</h3><p className="lesson-lead">Cả năm game đều tính điểm Unit. Sound Sort và Rhythm Echo nhận 1.000 điểm khi luyện chủ động đủ 60 giây; không chấm chất lượng phát âm.</p></div>{audioButton}</header>
    <div className="acl-progress"><strong>{completed.size}/{GAME_META.length}</strong><div className="progress-track"><span style={{ width: `${completed.size * (100 / GAME_META.length)}%` }} /></div></div>
    <div className="acl-game-grid">{GAME_META.map((game, index) => <button type="button" key={game.id} className={completed.has(game.id) ? "acl-game-card acl-game-card--done" : "acl-game-card"} onClick={() => open(game.id)}><span className="acl-game-number">{completed.has(game.id) ? "✓" : index + 1}</span><span className="acl-game-icon" aria-hidden="true">{game.icon}</span><strong>{game.title}</strong><span>{game.description}</span></button>)}</div>
    <button className="secondary-button acl-review-intro" type="button" onClick={() => open("intro")}>Xem lại phần mở đầu</button>
  </section>;

  const shared = { speech, onBack: () => open("hub"), initialIndex: reviewTarget?.questionIndex ?? 0 };
  if (screen === "picture") return <PictureMatch {...shared} onComplete={() => finish("picture")} />;
  if (screen === "context") return <ContextClues {...shared} onComplete={() => finish("context")} />;
  if (screen === "garden") return <FriendshipGarden {...shared} onComplete={() => finish("garden")} />;
  if (screen === "sound") return <SoundSort {...shared} onComplete={() => finish("sound")} />;
  return <RhythmEcho {...shared} muted={muted} onToggleMuted={toggleMuted} onComplete={() => finish("rhythm")} />;
}
