import { useEffect, useMemo, useRef, useState } from "react";
import sourceData from "../../../../data/raw/getting_started_unit3.json";
import { SpeechQueue } from "../word-magnet/speechQueue";
import {
  createListenReadPlan,
  DEFAULT_REPEAT_GAP_MS,
  type ConversationLine,
  type ListenReadStep,
} from "./listenReadEngine";

const conversation = sourceData.part1_conversation as ConversationLine[];
const plan = createListenReadPlan(conversation);
type LessonPhase = "idle" | "full" | "guide" | "practice" | "done";

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function ListenAndRead() {
  const speech = useMemo(() => new SpeechQueue(), []);
  const runId = useRef(0);
  const pausedRef = useRef(false);
  const dialogueLineRefs = useRef<Array<HTMLLIElement | null>>([]);
  const repeatCardRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<LessonPhase>("idle");
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [gapSeconds, setGapSeconds] = useState(0);

  useEffect(() => () => {
    runId.current += 1;
    speech.dispose();
  }, [speech]);

  useEffect(() => {
    if (phase !== "full" || activeLine === null) return;
    const activeElement = dialogueLineRefs.current[activeLine];
    if (!activeElement) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeElement.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [activeLine, phase]);

  useEffect(() => {
    if (phase !== "practice" || activeLine !== 0 || !repeatCardRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    repeatCardRef.current.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [activeLine, phase]);

  async function waitForStudent(durationMs: number, currentRun: number) {
    let remaining = durationMs;
    setGapSeconds(Math.ceil(remaining / 1000));
    while (remaining > 0 && runId.current === currentRun) {
      await delay(100);
      if (!pausedRef.current) remaining -= 100;
      setGapSeconds(Math.max(0, Math.ceil(remaining / 1000)));
    }
  }

  async function performStep(step: ListenReadStep, currentRun: number) {
    if (step.kind === "repeat-gap") {
      setPhase("practice");
      await waitForStudent(step.durationMs, currentRun);
      return;
    }
    setGapSeconds(0);
    if (step.kind === "guide") {
      setPhase("guide");
      setActiveLine(null);
      await speech.enqueue({ text: step.text, lang: step.lang, rate: step.rate });
      return;
    }
    setPhase(step.kind === "full-line" ? "full" : "practice");
    setActiveLine(step.lineIndex);
    await speech.enqueue({
      text: step.line.text,
      lang: "en-US",
      rate: step.rate,
      voiceName: step.line.voice,
    });
  }

  async function startLesson() {
    stopLesson();
    const currentRun = runId.current;
    setRunning(true);
    for (const step of plan) {
      if (runId.current !== currentRun) return;
      await performStep(step, currentRun);
    }
    if (runId.current === currentRun) {
      setPhase("done");
      setRunning(false);
      setPaused(false);
      pausedRef.current = false;
      setGapSeconds(0);
    }
  }

  function stopLesson() {
    runId.current += 1;
    speech.cancel();
    pausedRef.current = false;
    setPaused(false);
    setRunning(false);
    setGapSeconds(0);
    setPhase("idle");
  }

  function togglePause() {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) speech.pause();
    else speech.resume();
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    speech.setMuted(next);
  }

  function replayActiveLine() {
    if (activeLine === null || running) return;
    const line = conversation[activeLine];
    void speech.enqueue({ text: line.text, lang: "en-US", rate: 0.7, voiceName: line.voice });
  }

  const phaseText = {
    idle: "Sẵn sàng nghe và luyện đọc",
    full: "Đang nghe toàn bộ bài hội thoại",
    guide: "Nghe hướng dẫn luyện đọc",
    practice: gapSeconds > 0 ? `Đến lượt em đọc · còn ${gapSeconds} giây` : "Nghe chậm và đọc theo",
    done: "Hoàn thành lượt luyện đọc",
  }[phase];

  return (
    <section className="lesson-card listen-read" aria-labelledby="listen-read-title">
      <header className="lesson-heading">
        <div>
          <span className="eyebrow">Getting Started · Unit 3 · Part 1</span>
          <h3 id="listen-read-title">Listen and read</h3>
          <p className="lesson-lead">Nghe toàn bài một lượt, sau đó luyện đọc từng câu theo người hướng dẫn.</p>
        </div>
        <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMute}>
          {muted ? "Bật âm thanh" : "Tắt âm thanh"}
        </button>
      </header>

      <div className="playback-panel" aria-live="polite">
        <div>
          <span className={`phase-dot phase-dot--${phase}`} aria-hidden="true" />
          <strong>{phaseText}</strong>
          {phase === "practice" && activeLine !== null && (
            <span className="line-counter">Câu {activeLine + 1} / {conversation.length}</span>
          )}
        </div>
        <div className="playback-actions">
          {!running ? (
            <button className="primary-button" type="button" onClick={() => void startLesson()}>
              {phase === "done" ? "Luyện lại từ đầu" : "Bắt đầu nghe và đọc"}
            </button>
          ) : (
            <>
              <button className="secondary-button" type="button" onClick={togglePause}>
                {paused ? "Tiếp tục" : "Tạm dừng"}
              </button>
              <button className="secondary-button" type="button" onClick={stopLesson}>Dừng</button>
            </>
          )}
          <button className="secondary-button" type="button" disabled={activeLine === null || running} onClick={replayActiveLine}>
            Nghe lại câu hiện tại
          </button>
        </div>
      </div>

      {phase === "practice" && activeLine !== null && (
        <div
          ref={repeatCardRef}
          className={`repeat-card ${gapSeconds > 0 ? "repeat-card--your-turn" : ""}`}
        >
          <span>{gapSeconds > 0 ? "Đến lượt em đọc" : `Nghe ${conversation[activeLine].speaker} đọc chậm`}</span>
          <p>{conversation[activeLine].text}</p>
          {gapSeconds > 0 && <div className="gap-meter" />}
        </div>
      )}

      <div className="dialogue-heading">
        <h4>Bài hội thoại</h4><span>{conversation.length} lượt thoại</span>
      </div>
      <ol className="dialogue-list">
        {conversation.map((line, index) => (
          <li
            key={`${line.speaker}-${index}`}
            ref={(element) => { dialogueLineRefs.current[index] = element; }}
            className={activeLine === index ? "dialogue-line dialogue-line--active" : "dialogue-line"}
            aria-current={activeLine === index ? "true" : undefined}
          >
            <span className="speaker">{line.speaker}</span><p>{line.text}</p>
          </li>
        ))}
      </ol>

      <p className="practice-note">Mỗi câu được phát chậm, sau đó có {DEFAULT_REPEAT_GAP_MS / 1000} giây để em đọc lại.</p>
      {!speech.available && <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản.</p>}
    </section>
  );
}
