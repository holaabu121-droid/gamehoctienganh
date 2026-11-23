import { useState } from "react";
import { BodyLab } from "../body-lab/BodyLab";
import { WordBridge } from "../word-bridge/WordBridge";
import type { ReviewTarget } from "../../reviewTarget";

type Part3Game = "body-lab" | "word-bridge" | null;

export function Part3Games({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  const targetGame = reviewTarget?.activityId === "unit3-getting-body-lab" ? "body-lab" : reviewTarget?.activityId === "unit3-getting-word-bridge" ? "word-bridge" : null;
  const [game, setGame] = useState<Part3Game>(targetGame);

  if (game) {
    return (
      <div className="part3-game-view">
        <button className="back-to-games" type="button" onClick={() => setGame(null)}>
          ← Chọn trò chơi khác
        </button>
        {game === "body-lab" ? <BodyLab initialQuestionIndex={reviewTarget?.questionIndex} /> : <WordBridge initialQuestionIndex={reviewTarget?.questionIndex} />}
      </div>
    );
  }

  return (
    <section className="lesson-card part3-hub" aria-labelledby="part3-title">
      <span className="eyebrow">Getting Started · Unit 3 · Part 3</span>
      <h3 id="part3-title">Body Vocabulary Games</h3>
      <p className="lesson-lead">Chọn một trò chơi để luyện tên và nghĩa các bộ phận cơ thể.</p>
      <div className="game-choice-grid">
        <button className="game-choice-card" type="button" onClick={() => setGame("body-lab")}>
          <span className="game-choice-icon" aria-hidden="true">🧍</span>
          <strong>Body Lab</strong>
          <span>Quan sát vị trí và chọn tên bộ phận.</span>
        </button>
        <button className="game-choice-card game-choice-card--bridge" type="button" onClick={() => setGame("word-bridge")}>
          <span className="game-choice-icon" aria-hidden="true">🌉</span>
          <strong>Word Bridge</strong>
          <span>Nối từ tiếng Anh với nghĩa tiếng Việt.</span>
        </button>
      </div>
    </section>
  );
}
