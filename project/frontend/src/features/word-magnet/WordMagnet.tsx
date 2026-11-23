import { useEffect, useMemo, useState } from "react";
import sourceData from "../../../../data/raw/getting_started_unit3.json";
import practiceData from "../../../../data/lessons/unit3_part2_practice.json";
import { useActivityScoring } from "../../progress/useActivityScoring";
import { useProgress } from "../../progress/ProgressProvider";
import {
  createAudioPlan,
  evaluateSlotSelection,
  normalizeQuestions,
  type RawWordMagnetQuestion,
  type WordMagnetSlotChoice,
} from "./wordMagnetEngine";
import { SpeechQueue } from "./speechQueue";

const questions = normalizeQuestions(
  [
    ...(sourceData.part2_blanks as RawWordMagnetQuestion[]).map((question) => ({ ...question, source_status: "user-provided-reference" as const })),
    ...(practiceData.questions as RawWordMagnetQuestion[]),
  ],
);
const ANIMATION_MS = 650;

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function WordMagnet({ initialQuestionIndex = 0 }: { initialQuestionIndex?: number }) {
  const scoring = useActivityScoring(10, initialQuestionIndex);
  const { submitActivityResult } = useProgress();
  const speech = useMemo(() => new SpeechQueue(), []);
  const [questionIndex, setQuestionIndex] = useState(Math.max(0, Math.min(initialQuestionIndex, 9)));
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<WordMagnetSlotChoice[]>([]);
  const [solvedSentence, setSolvedSentence] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [finalScore, setFinalScore] = useState<{ earned: number; max: number; percent: number; rankLabel: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const question = questions[questionIndex];
  const fragments = question.sentence.split("[BLANK]");
  const isMultiSlot = question.slotAnswers.length > 1;
  const solved = result === "correct";

  useEffect(() => { scoring.startQuestion(); return () => speech.dispose(); }, [speech, scoring.startQuestion]);

  function toggleHelp() {
    setHelpOpen((open) => {
      if (!open) scoring.recordHelp();
      return !open;
    });
  }

  async function choose(option: string) {
    if (busy || solved) return;

    const plan = createAudioPlan(question, option);
    setBusy(true);
    setSelected(option);
    setResult(null);

    await speech.enqueue(plan.selectedSpeech);

    if (plan.correct) {
      scoring.breakWrongStreak();
      scoring.completeQuestion();
      setResult("correct");
      await wait(ANIMATION_MS);
      if (plan.completedSpeech) {
        await speech.enqueue(plan.completedSpeech);
      }
    } else {
      scoring.recordWrong();
      setResult("wrong");
    }

    setBusy(false);
  }

  async function chooseSlot(choice: WordMagnetSlotChoice) {
    if (busy || solved || selectedSlots.length >= question.slotAnswers.length) return;
    const nextSlots = [...selectedSlots, choice];
    setBusy(true);
    setSelectedSlots(nextSlots);
    setResult(null);
    await speech.enqueue(choice.text);

    if (nextSlots.length === question.slotAnswers.length) {
      const evaluation = evaluateSlotSelection(question, nextSlots.map(({ text }) => text));
      if (evaluation.correct) {
        scoring.breakWrongStreak();
        scoring.completeQuestion();
        setSolvedSentence(evaluation.completedSentence);
        setResult("correct");
        await wait(ANIMATION_MS);
        if (evaluation.completedSentence) await speech.enqueue(evaluation.completedSentence);
      } else {
        scoring.recordWrong();
        setResult("wrong");
      }
    }
    setBusy(false);
  }

  function removeSlot(index: number) {
    if (busy || solved) return;
    setSelectedSlots((slots) => slots.filter((_, slotIndex) => slotIndex !== index));
    setResult(null);
    setSolvedSentence(null);
  }

  function resetSlots() {
    if (busy || solved) return;
    setSelectedSlots([]);
    setResult(null);
    setSolvedSentence(null);
  }

  async function goNext() {
    if (saving) return;
    if (questionIndex === questions.length - 1) {
      setSaving(true); setSaveError("");
      try {
        const { score, questions: questionResults } = scoring.finish();
        await submitActivityResult({ unitId: "unit3", activityId: "unit3-getting-word-magnet", completed: true, questions: questionResults });
        setFinalScore(score);
        setFinished(true);
      } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa lưu được điểm. Em hãy thử lại."); }
      finally { setSaving(false); }
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelected(null);
    setSelectedSlots([]);
    setSolvedSentence(null);
    setResult(null);
    scoring.startQuestion();
  }

  function restart() {
    setQuestionIndex(0);
    setSelected(null);
    setSelectedSlots([]);
    setSolvedSentence(null);
    setResult(null);
    setFinished(false);
    setFinalScore(null);
    setHelpOpen(false);
    setSaveError("");
    scoring.reset();
    scoring.startQuestion();
  }

  function toggleMuted() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    speech.setMuted(nextMuted);
  }

  if (finished) {
    return (
      <section className="game-card game-card--finished" aria-labelledby="game-title">
        <span className="eyebrow">Getting Started · Unit 3</span>
        <h3 id="game-title">Word Magnet</h3>
        <p className="finish-mark" aria-hidden="true">★</p>
        <h4>Great work!</h4>
        <p>Bạn đã hoàn thành cả {questions.length} câu.</p>
        {finalScore && <p className="activity-score"><strong>{finalScore.earned}/{finalScore.max}</strong><span>{finalScore.percent}% · {finalScore.rankLabel}</span></p>}
        <button className="primary-button" type="button" onClick={restart}>
          Chơi lại
        </button>
      </section>
    );
  }

  return (
    <section className="game-card" aria-labelledby="game-title">
      <header className="game-header">
        <div>
          <span className="eyebrow">Getting Started · Unit 3</span>
          <div className="acl-game-header"><h3 id="game-title">Word Magnet</h3><button className="acl-help-button" type="button" aria-label="Xem lời giảng Word Magnet" aria-expanded={helpOpen} onClick={toggleHelp}>?</button></div>
        </div>
        <button
          className="sound-button"
          type="button"
          aria-pressed={muted}
          onClick={toggleMuted}
        >
          {muted ? "Bật âm thanh" : "Tắt âm thanh"}
        </button>
      </header>

      {helpOpen && <aside className="acl-help-panel"><span className="eyebrow">Lời giảng gợi ý</span><h4>Chọn đáp án phù hợp để điền vào chỗ trống và hoàn thành câu.</h4><p><strong>Cách làm:</strong> đọc cả câu rồi chọn nam châm cho từng ô. Với hai ý nối bằng <em>and</em>, em có thể đặt hai đáp án đúng theo bất kỳ thứ tự nào.</p><p><strong>Hoàn thành:</strong> trả lời đúng đủ 10 câu.</p><p><strong>Phản hồi:</strong> chọn sai được đổi lại; chọn đúng sẽ nhìn thấy và nghe câu hoàn chỉnh.</p></aside>}

      <div className="progress" aria-label={`Câu ${questionIndex + 1} trên ${questions.length}`}>
        <span>{questionIndex + 1} / {questions.length}</span>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <p className="instruction">{isMultiSlot ? "Chọn hai nam châm đúng; hai vị trí có thể đổi cho nhau." : "Chọn nam châm đúng để hoàn thành câu."}</p>

      <p className="sentence" aria-label={solved ? solvedSentence ?? question.completedSentence : question.sentence}>
        {fragments.map((fragment, index) => (
          <span key={`${question.id}-${index}`}>
            {fragment}
            {index < fragments.length - 1 && (
              isMultiSlot ? <button
                className={`blank blank--slot ${selectedSlots[index] ? "blank--filled" : ""}`}
                type="button"
                disabled={!selectedSlots[index] || busy || solved}
                onClick={() => removeSlot(index)}
                aria-label={selectedSlots[index] ? `Đưa ${selectedSlots[index].text} trở lại khay` : `Ô trống ${index + 1}`}
              >{selectedSlots[index]?.text ?? "?"}</button> :
              <span className={`blank ${solved ? "blank--filled" : ""}`}>{solved ? question.slotAnswers[index] : "?"}</span>
            )}
          </span>
        ))}
      </p>

      <div className="options" aria-label="Các đáp án">
        {(isMultiSlot ? question.slotChoices.filter((choice) => !selectedSlots.some(({ id }) => id === choice.id)) : question.options).map((option) => {
          if (typeof option !== "string") return <button
            key={option.id}
            type="button"
            className="option"
            disabled={busy || solved || selectedSlots.length >= question.slotAnswers.length}
            onClick={() => void chooseSlot(option)}
          >{option.text}</button>;
          const isSelected = selected === option;
          const optionState = isSelected && result ? ` option--${result}` : "";
          return (
            <button
              key={option}
              type="button"
              className={`option${optionState}`}
              disabled={busy || solved}
              onClick={() => void choose(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="feedback" aria-live="polite" aria-atomic="true">
        {busy && !result && "Đang phát đáp án…"}
        {result === "wrong" && "Chưa đúng. Hãy thử một nam châm khác!"}
        {result === "correct" && "Chính xác! Cả câu đã hoàn thành."}
      </div>
      {isMultiSlot && selectedSlots.length > 0 && !solved && <div className="actions"><button className="secondary-button" type="button" disabled={busy} onClick={resetSlots}>Chọn lại hai ô</button></div>}
      {saveError && <p className="auth-error" role="alert">{saveError}</p>}

      {solved && (
        <div className="actions">
          <button
            className="secondary-button"
            type="button"
            disabled={busy}
            onClick={() => void speech.enqueue(solvedSentence ?? question.completedSentence)}
          >
            Nghe lại câu
          </button>
          <button className="primary-button" type="button" disabled={busy || saving} onClick={() => void goNext()}>
            {saving ? "Đang lưu…" : questionIndex === questions.length - 1 ? "Hoàn thành" : "Câu tiếp theo"}
          </button>
        </div>
      )}

      {!speech.available && (
        <p className="audio-note">Trình duyệt này không hỗ trợ đọc văn bản.</p>
      )}
    </section>
  );
}
