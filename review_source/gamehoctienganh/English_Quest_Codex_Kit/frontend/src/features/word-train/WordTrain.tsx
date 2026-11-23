import { useEffect, useMemo, useState } from "react";
import sourceData from "../../../../data/raw/getting_started_unit3.json";
import practiceData from "../../../../data/lessons/unit3_part2_practice.json";
import { useActivityScoring } from "../../progress/useActivityScoring";
import { useProgress } from "../../progress/ProgressProvider";
import { SpeechQueue } from "../word-magnet/speechQueue";
import type { RawWordMagnetQuestion } from "../word-magnet/wordMagnetEngine";
import {
  createWordTrainRounds,
  evaluateWordTrain,
  type WordToken,
} from "./wordTrainEngine";

const rounds = createWordTrainRounds(
  [
    ...(sourceData.part2_blanks as RawWordMagnetQuestion[]).map((question) => ({ ...question, source_status: "user-provided-reference" as const })),
    ...(practiceData.questions as RawWordMagnetQuestion[]),
  ],
);

const ENCOURAGEMENTS = [
  "Gần đúng rồi! Em hãy thử đổi lại thứ tự nhé.",
  "Cố lên! Hãy xem lại vị trí của từng từ.",
  "Good try! Chạm vào từ cần sửa và thử lại nào.",
];

export function WordTrain({ initialQuestionIndex = 0 }: { initialQuestionIndex?: number }) {
  const scoring = useActivityScoring(10, initialQuestionIndex);
  const { submitActivityResult } = useProgress();
  const speech = useMemo(() => new SpeechQueue(), []);
  const [roundIndex, setRoundIndex] = useState(Math.max(0, Math.min(initialQuestionIndex, 9)));
  const [selectedTokens, setSelectedTokens] = useState<WordToken[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [finalScore, setFinalScore] = useState<{ earned: number; max: number; percent: number; rankLabel: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const round = rounds[roundIndex];
  const selectedIds = new Set(selectedTokens.map(({ id }) => id));
  const bankTokens = round.shuffledTokens.filter(({ id }) => !selectedIds.has(id));

  useEffect(() => { scoring.startQuestion(); return () => speech.dispose(); }, [speech, scoring.startQuestion]);

  function toggleHelp() {
    setHelpOpen((open) => {
      if (!open) scoring.recordHelp();
      return !open;
    });
  }

  async function selectToken(token: WordToken) {
    if (busy || result === "correct") return;
    const nextTokens = [...selectedTokens, token];
    setBusy(true);
    setSelectedTokens(nextTokens);
    setResult(null);
    await speech.enqueue({ text: token.spokenText, lang: "en-US", rate: 0.86 });

    if (nextTokens.length === round.tokens.length) {
      const evaluation = evaluateWordTrain(round, nextTokens);
      if (evaluation.correct) {
        scoring.breakWrongStreak();
        scoring.completeQuestion();
        setResult("correct");
        if (evaluation.completedSpeech) {
          await speech.enqueue({ text: evaluation.completedSpeech, lang: "en-US", rate: 0.86 });
        }
      } else {
        scoring.recordWrong();
        setAttempts((count) => count + 1);
        setResult("wrong");
      }
    }
    setBusy(false);
  }

  function removeToken(index: number) {
    if (busy || result === "correct") return;
    setSelectedTokens((tokens) => tokens.filter((_, tokenIndex) => tokenIndex !== index));
    setResult(null);
  }

  function resetRound() {
    if (busy) return;
    setSelectedTokens([]);
    setResult(null);
  }

  async function nextRound() {
    if (saving) return;
    if (roundIndex === rounds.length - 1) {
      setSaving(true); setSaveError("");
      try {
        const { score, questions } = scoring.finish();
        await submitActivityResult({ unitId: "unit3", activityId: "unit3-getting-word-train", completed: true, questions });
        setFinalScore(score);
        setFinished(true);
      } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm. Em hãy thử lại."); }
      finally { setSaving(false); }
      return;
    }
    setRoundIndex((index) => index + 1);
    setSelectedTokens([]);
    setResult(null);
    setAttempts(0);
    scoring.startQuestion();
  }

  function restart() {
    setRoundIndex(0);
    setSelectedTokens([]);
    setResult(null);
    setAttempts(0);
    setFinished(false);
    setFinalScore(null);
    setHelpOpen(false);
    setSaveError("");
    scoring.reset();
    scoring.startQuestion();
  }

  function toggleMuted() {
    const next = !muted;
    setMuted(next);
    speech.setMuted(next);
  }

  if (finished) {
    return (
      <section className="lesson-card word-train-finished" aria-labelledby="word-train-title">
        <span className="eyebrow">Getting Started · Unit 3 · Part 2</span>
        <h3 id="word-train-title">Word Train</h3>
        <p className="finish-mark" aria-hidden="true">★</p>
        <h4>All aboard!</h4>
        <p>Em đã hoàn thành cả {rounds.length} đoàn tàu câu.</p>
        {finalScore && <p className="activity-score"><strong>{finalScore.earned}/{finalScore.max}</strong><span>{finalScore.percent}% · {finalScore.rankLabel}</span></p>}
        <button className="primary-button" type="button" onClick={restart}>Chơi lại</button>
      </section>
    );
  }

  return (
    <section className="lesson-card word-train" aria-labelledby="word-train-title">
      <header className="lesson-heading">
        <div>
          <span className="eyebrow">Getting Started · Unit 3 · Part 2</span>
          <div className="acl-game-header"><h3 id="word-train-title">Word Train</h3><button className="acl-help-button" type="button" aria-label="Xem lời giảng Word Train" aria-expanded={helpOpen} onClick={toggleHelp}>?</button></div>
          <p className="lesson-lead">Chọn từng từ theo đúng thứ tự để ghép thành câu hoàn chỉnh.</p>
        </div>
        <button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>
          {muted ? "Bật âm thanh" : "Tắt âm thanh"}
        </button>
      </header>

      {helpOpen && <aside className="acl-help-panel"><span className="eyebrow">Lời giảng gợi ý</span><h4>Chọn từng từ theo đúng thứ tự để ghép thành câu hoàn chỉnh.</h4><p><strong>Cách làm:</strong> chạm vào từng toa từ; chạm lại một toa đã chọn nếu muốn đưa về khay.</p><p><strong>Hoàn thành:</strong> xếp đúng đủ 10 đoàn tàu câu.</p><p><strong>Phản hồi:</strong> mỗi từ đều được đọc; khi đúng, app đọc cả câu hoàn chỉnh.</p></aside>}

      <div className="lab-progress" aria-label={`Câu ${roundIndex + 1} trên ${rounds.length}`}>
        <strong>{roundIndex + 1} / {rounds.length}</strong>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((roundIndex + 1) / rounds.length) * 100}%` }} />
        </div>
      </div>

      <div
        className={`sentence-train-box${result ? ` sentence-train-box--${result}` : ""}`}
        aria-label="Câu đang sắp xếp"
      >
        {selectedTokens.length === 0 && <span className="train-placeholder">Các từ em chọn sẽ xuất hiện ở đây…</span>}
        {selectedTokens.map((token, index) => (
          <button
            className="train-word train-word--placed"
            type="button"
            key={token.id}
            disabled={busy || result === "correct"}
            onClick={() => removeToken(index)}
            aria-label={`Đưa ${token.text} trở lại khay`}
          >
            {token.text}
          </button>
        ))}
      </div>

      <p className="train-instruction">Chạm vào từng toa từ theo thứ tự đúng:</p>
      <div className="train-bank" aria-label="Khay từ">
        {bankTokens.map((token) => (
          <button
            className="train-word"
            type="button"
            key={token.id}
            disabled={busy || result === "correct"}
            onClick={() => void selectToken(token)}
          >
            {token.text}
          </button>
        ))}
      </div>

      <div className="feedback train-feedback" aria-live="polite" aria-atomic="true">
        {busy && !result && "Đang phát âm từ đã chọn…"}
        {result === "wrong" && ENCOURAGEMENTS[Math.max(0, attempts - 1) % ENCOURAGEMENTS.length]}
        {result === "correct" && "Excellent! Đoàn tàu câu đã đúng thứ tự."}
      </div>
      {saveError && <p className="auth-error" role="alert">{saveError}</p>}

      <div className="actions train-actions">
        {selectedTokens.length > 0 && result !== "correct" && (
          <button className="secondary-button" type="button" disabled={busy} onClick={resetRound}>Làm lại</button>
        )}
        {result === "correct" && (
          <>
            <button
              className="secondary-button"
              type="button"
              disabled={busy}
              onClick={() => void speech.enqueue({ text: round.completedSentence, lang: "en-US", rate: 0.86 })}
            >
              Nghe lại câu
            </button>
            <button className="primary-button" type="button" disabled={busy || saving} onClick={() => void nextRound()}>
              {saving ? "Đang lưu…" : roundIndex === rounds.length - 1 ? "Hoàn thành" : "Câu tiếp theo"}
            </button>
          </>
        )}
      </div>
      {!speech.available && <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản.</p>}
    </section>
  );
}
