import { useState } from "react";
import { WordMagnet } from "../word-magnet/WordMagnet";
import { WordTrain } from "../word-train/WordTrain";
import type { ReviewTarget } from "../../reviewTarget";

type Part2Game = "magnet" | "train" | null;

export function Part2Games({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  const targetGame = reviewTarget?.activityId === "unit3-getting-word-magnet" ? "magnet" : reviewTarget?.activityId === "unit3-getting-word-train" ? "train" : null;
  const [game, setGame] = useState<Part2Game>(targetGame);

  if (game) {
    return (
      <div className="part2-game-view">
        <button className="back-to-games" type="button" onClick={() => setGame(null)}>
          ← Chọn trò chơi khác
        </button>
        {game === "magnet" ? <WordMagnet initialQuestionIndex={reviewTarget?.questionIndex} /> : <WordTrain initialQuestionIndex={reviewTarget?.questionIndex} />}
      </div>
    );
  }

  return (
    <section className="lesson-card part2-hub" aria-labelledby="part2-title">
      <span className="eyebrow">Getting Started · Unit 3 · Part 2</span>
      <h3 id="part2-title">Sentence Games</h3>
      <p className="lesson-lead">Chọn một trò chơi 10 câu để luyện nội dung và trật tự câu. Mỗi trò chơi có tối đa 1.000 điểm.</p>
      <div className="game-choice-grid">
        <button className="game-choice-card" type="button" onClick={() => setGame("magnet")}>
          <span className="game-choice-icon" aria-hidden="true">🧲</span>
          <strong>Word Magnet</strong>
          <span>10 câu · Chọn đáp án để điền đúng chỗ trống.</span>
        </button>
        <button className="game-choice-card game-choice-card--train" type="button" onClick={() => setGame("train")}>
          <span className="game-choice-icon" aria-hidden="true">🚂</span>
          <strong>Word Train</strong>
          <span>10 câu · Chọn từng từ để xếp thành câu đúng.</span>
        </button>
      </div>
    </section>
  );
}
