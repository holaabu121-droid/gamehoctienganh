import { useEffect, useId, useMemo, useState } from "react";
import lessonData from "../../../../data/raw/getting_started_unit3.json";
import vocabularyData from "../../../../data/raw/unit3_game_data.json";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { useProgress } from "../../progress/ProgressProvider";
import { useActivityScoring } from "../../progress/useActivityScoring";
import {
  createVocabularyPairs,
  createWordBridgeRounds,
  getAnswerText,
  getPromptText,
  isCorrectMatch,
  scoreForAttempt,
  type MatchDirection,
  type RawVocabularyItem,
  type VocabularyPair,
} from "./wordBridgeEngine";

const pairs = createVocabularyPairs(
  lessonData.part3_body_parts as string[],
  vocabularyData as RawVocabularyItem[],
);
const rounds = createWordBridgeRounds(pairs);
const ENCOURAGEMENTS = [
  "Gần đúng rồi, em thử lại nhé!",
  "Hãy quan sát kỹ nghĩa của từ.",
  "Good try! You can do it!",
];

export function WordBridge({ initialQuestionIndex = 0 }: { initialQuestionIndex?: number }) {
  const speech = useMemo(() => new SpeechQueue(), []);
  const scoring = useActivityScoring(10, initialQuestionIndex);
  const { submitActivityResult } = useProgress();
  const helpId = useId();
  const [direction, setDirection] = useState<MatchDirection | null>(null);
  const [roundIndex, setRoundIndex] = useState(Math.max(0, Math.min(initialQuestionIndex, 9)));
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const round = rounds[roundIndex];
  const activePrompt = round.prompts.find(({ id }) => id === activePromptId) ?? null;
  const complete = matchedIds.length === round.prompts.length;

  useEffect(() => () => speech.dispose(), [speech]);
  useEffect(() => { if (direction && activePromptId) scoring.startQuestion(); setHelpOpen(false); }, [activePromptId, direction, scoring.startQuestion]);

  function startMode(nextDirection: MatchDirection) {
    setDirection(nextDirection);
    setRoundIndex(0);
    setMatchedIds([]);
    setMistakes({});
    setScore(0);
    setFeedback("");
    setFinished(false);
    setSaveError("");
    scoring.reset();
    setActivePromptId(rounds[0].prompts[0].id);
  }

  function selectPrompt(pair: VocabularyPair) {
    if (busy || matchedIds.includes(pair.id) || activePromptId !== pair.id) return;
    setFeedback("");
    if (direction === "en-to-vi") {
      void speech.enqueue({ text: pair.en, lang: "en-US", rate: 0.84 });
    }
  }

  async function selectAnswer(answer: VocabularyPair) {
    if (!activePrompt || busy || matchedIds.includes(answer.id)) return;
    setBusy(true);
    await speech.enqueue({ text: answer.en, lang: "en-US", rate: 0.84 });
    if (isCorrectMatch(activePrompt, answer)) {
      scoring.breakWrongStreak();
      scoring.completeQuestion();
      const nextMatched = [...matchedIds, activePrompt.id];
      setMatchedIds(nextMatched);
      setScore((value) => value + scoreForAttempt(mistakes[activePrompt.id] ?? 0));
      setFeedback(`Chính xác! ${activePrompt.en} — ${activePrompt.vi}`);
      const nextPrompt = round.prompts.find(({ id }) => !nextMatched.includes(id));
      setActivePromptId(nextPrompt?.id ?? null);
    } else {
      scoring.recordWrong();
      const nextMistakes = (mistakes[activePrompt.id] ?? 0) + 1;
      setMistakes((current) => ({ ...current, [activePrompt.id]: nextMistakes }));
      setFeedback(ENCOURAGEMENTS[(nextMistakes - 1) % ENCOURAGEMENTS.length]);
    }
    setBusy(false);
  }

  async function nextRound() {
    if (saving) return;
    if (roundIndex === rounds.length - 1) {
      setSaving(true); setSaveError("");
      try {
        const result = scoring.finish();
        await submitActivityResult({ unitId: "unit3", activityId: "unit3-getting-word-bridge", completed: true, questions: result.questions });
        setFinished(true);
      } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm."); }
      finally { setSaving(false); }
      return;
    }
    const nextIndex = roundIndex + 1;
    setRoundIndex(nextIndex);
    setMatchedIds([]);
    setMistakes({});
    setFeedback("");
    setActivePromptId(rounds[nextIndex].prompts[0].id);
  }

  function toggleMuted() {
    const next = !muted;
    setMuted(next);
    speech.setMuted(next);
  }

  if (!direction) {
    return (
      <section className="lesson-card bridge-mode" aria-labelledby="bridge-title">
        <span className="eyebrow">Getting Started · Unit 3 · Part 3</span>
        <h3 id="bridge-title">Word Bridge</h3>
        <p className="lesson-lead">Chọn chiều luyện để nối từ với nghĩa tương ứng.</p>
        <div className="bridge-mode-grid">
          <button type="button" onClick={() => startMode("en-to-vi")}>
            <strong>English → Vietnamese</strong>
            <span>Đọc từ tiếng Anh và chọn nghĩa tiếng Việt.</span>
          </button>
          <button type="button" onClick={() => startMode("vi-to-en")}>
            <strong>Vietnamese → English</strong>
            <span>Đọc nghĩa tiếng Việt và chọn từ tiếng Anh.</span>
          </button>
        </div>
      </section>
    );
  }

  if (finished) {
    const reverse: MatchDirection = direction === "en-to-vi" ? "vi-to-en" : "en-to-vi";
    return (
      <section className="lesson-card bridge-finished" aria-labelledby="bridge-title">
        <span className="eyebrow">Getting Started · Unit 3 · Part 3</span>
        <h3 id="bridge-title">Word Bridge</h3>
        <p className="finish-mark" aria-hidden="true">★</p>
        <h4>Perfect Match!</h4>
        <p>Em đã nối đủ {pairs.length} cặp từ. Tổng điểm: <strong>{score}</strong>.</p>
        <div className="actions bridge-finish-actions">
          <button className="secondary-button" type="button" onClick={() => startMode(direction)}>Chơi lại</button>
          <button className="primary-button" type="button" onClick={() => startMode(reverse)}>Luyện chiều ngược lại</button>
        </div>
      </section>
    );
  }

  const availableAnswers = round.answerBank.filter(({ id }) => !matchedIds.includes(id));
  return (
    <section className="lesson-card word-bridge" aria-labelledby="bridge-title">
      <header className="lesson-heading">
        <div>
          <span className="eyebrow">Getting Started · Unit 3 · Part 3</span>
          <div className="acl-game-header"><h3 id="bridge-title">Word Bridge</h3><button className="acl-help-button" type="button" aria-label="Xem hướng dẫn" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => { if (!open) scoring.recordHelp(); return !open; })}>?</button></div>
          <p className="lesson-lead">
            {direction === "en-to-vi" ? "Chọn nghĩa tiếng Việt tương ứng." : "Chọn từ tiếng Anh tương ứng."}
          </p>
        </div>
        <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>
          {muted ? "Bật âm thanh" : "Tắt âm thanh"}
        </button>
      </header>
      {helpOpen && <aside className="acl-help-panel" id={helpId}><h4>Lời giảng</h4><p>Làm lần lượt từ hàng đang sáng rồi chọn nghĩa hoặc từ tương ứng. Một lượt gồm đủ 10 cặp; mỗi cặp tối đa 100 điểm và đáp án sai, gợi ý hoặc thời gian sẽ làm giảm điểm.</p></aside>}

      <div className="lab-progress" aria-label={`Lượt ${roundIndex + 1} trên ${rounds.length}`}>
        <strong>Lượt {roundIndex + 1}/{rounds.length}</strong>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${(matchedIds.length / pairs.length) * 100}%` }} />
        </div>
        <span>Điểm: {score}</span>
      </div>

      <div className="bridge-board">
        <div className="bridge-prompts" aria-label="Các hàng cần ghép">
          {round.prompts.map((pair) => {
            const matched = matchedIds.includes(pair.id);
            const active = activePromptId === pair.id;
            return (
              <button
                type="button"
                key={pair.id}
                className={`bridge-row${active ? " bridge-row--active" : ""}${matched ? " bridge-row--matched" : ""}`}
                disabled={busy || matched || !active}
                aria-pressed={active}
                onClick={() => selectPrompt(pair)}
              >
                <strong>{getPromptText(pair, direction)}</strong>
                <span>{matched ? getAnswerText(pair, direction) : "Chọn đáp án…"}</span>
              </button>
            );
          })}
        </div>

        <div className="bridge-answer-bank" aria-label="Khay đáp án">
          <span className="bridge-bank-title">Đáp án xáo trộn</span>
          {availableAnswers.map((pair) => (
            <button
              type="button"
              key={pair.id}
              disabled={busy || !activePrompt}
              onClick={() => void selectAnswer(pair)}
            >
              {getAnswerText(pair, direction)}
            </button>
          ))}
        </div>
      </div>

      <div className="feedback bridge-feedback" aria-live="polite" aria-atomic="true">
        {busy ? "Đang phát âm từ đã chọn…" : feedback || "Chọn một hàng, sau đó chọn đáp án tương ứng."}
      </div>
      {complete && (
        <div className="actions">
          <button className="primary-button" type="button" disabled={saving} onClick={() => void nextRound()}>
            {saving ? "Đang lưu…" : roundIndex === rounds.length - 1 ? "Hoàn thành" : "Lượt tiếp theo"}
          </button>
        </div>
      )}
      {saveError && <p className="auth-error" role="alert">{saveError}</p>}
      {!speech.available && <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản.</p>}
    </section>
  );
}
