export type QuestionScoreInput = { elapsedMs: number; helpUses: number; wrongAnswers: number; longestWrongStreak: number; skipped?: boolean };
export type ScoreRank = "excellent" | "good" | "passed" | "practice";
export type QuestionScore = { earned: number; max: 100; percent: number; rank: ScoreRank; rankLabel: string; skipped: boolean };
export type ActivityScore = { earned: number; max: number; percent: number; rank: ScoreRank; rankLabel: string; questionScores: QuestionScore[] };

const clampCount = (value: number) => Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));

export function getScoreRank(percent: number): Pick<QuestionScore, "rank" | "rankLabel"> {
  if (percent >= 90) return { rank: "excellent", rankLabel: "Xuất sắc" };
  if (percent >= 75) return { rank: "good", rankLabel: "Tốt" };
  if (percent >= 60) return { rank: "passed", rankLabel: "Đạt" };
  return { rank: "practice", rankLabel: "Cần luyện thêm" };
}

export function scoreQuestion(input: QuestionScoreInput): QuestionScore {
  if (input.skipped) return { earned: 0, max: 100, percent: 0, ...getScoreRank(0), skipped: true };
  const elapsedSeconds = Math.max(0, Number.isFinite(input.elapsedMs) ? input.elapsedMs : 0) / 1000;
  const timePenalty = Math.min(25, Math.floor(Math.max(0, elapsedSeconds - 8) / 3));
  const helpPenalty = Math.min(30, clampCount(input.helpUses) * 15);
  const wrongPenalty = Math.min(32, clampCount(input.wrongAnswers) * 8);
  const streakPenalty = Math.min(12, Math.max(0, clampCount(input.longestWrongStreak) - 1) * 4);
  const earned = Math.max(0, 100 - timePenalty - helpPenalty - wrongPenalty - streakPenalty);
  return { earned, max: 100, percent: earned, ...getScoreRank(earned), skipped: false };
}

export function scoreActivity(questions: readonly QuestionScoreInput[]): ActivityScore {
  if (![10, 15, 20].includes(questions.length)) throw new Error("An activity must contain 10, 15 or 20 question results");
  const questionScores = questions.map(scoreQuestion);
  const earned = questionScores.reduce((total, score) => total + score.earned, 0);
  const max = questionScores.length * 100;
  const percent = Math.round((earned / max) * 100);
  return { earned, max, percent, ...getScoreRank(percent), questionScores };
}
