import { useCallback, useRef, useState } from "react";
import { scoreActivity, scoreQuestion, type ActivityScore, type QuestionScore, type QuestionScoreInput } from "./scoringEngine";

export type ActivityQuestionCount = 10 | 15 | 20;

export function useActivityScoring(totalQuestions: ActivityQuestionCount, initialQuestionIndex = 0) {
  const skipped = Math.max(0, Math.min(Math.floor(initialQuestionIndex), totalQuestions - 1));
  const skippedResults = () => Array.from({ length: skipped }, () => ({ elapsedMs: 0, helpUses: 0, wrongAnswers: 0, longestWrongStreak: 0, skipped: true } satisfies QuestionScoreInput));
  const [completedQuestions, setCompletedQuestions] = useState(skipped);
  const resultsRef = useRef<QuestionScoreInput[]>(skippedResults());
  const startedAtRef = useRef<number | null>(null);
  const helpUsesRef = useRef(0);
  const wrongAnswersRef = useRef(0);
  const currentWrongStreakRef = useRef(0);
  const longestWrongStreakRef = useRef(0);

  const startQuestion = useCallback(() => {
    startedAtRef.current = performance.now();
    helpUsesRef.current = 0;
    wrongAnswersRef.current = 0;
    currentWrongStreakRef.current = 0;
    longestWrongStreakRef.current = 0;
  }, []);

  const recordHelp = useCallback(() => { helpUsesRef.current += 1; }, []);
  const recordWrong = useCallback(() => {
    wrongAnswersRef.current += 1;
    currentWrongStreakRef.current += 1;
    longestWrongStreakRef.current = Math.max(longestWrongStreakRef.current, currentWrongStreakRef.current);
  }, []);
  const breakWrongStreak = useCallback(() => { currentWrongStreakRef.current = 0; }, []);

  const completeQuestion = useCallback((): QuestionScore => {
    if (startedAtRef.current === null) throw new Error("startQuestion must be called before completeQuestion");
    if (resultsRef.current.length >= totalQuestions) throw new Error("All questions in this activity are already complete");
    const input: QuestionScoreInput = {
      elapsedMs: performance.now() - startedAtRef.current,
      helpUses: helpUsesRef.current,
      wrongAnswers: wrongAnswersRef.current,
      longestWrongStreak: longestWrongStreakRef.current,
    };
    resultsRef.current.push(input);
    startedAtRef.current = null;
    setCompletedQuestions(resultsRef.current.length);
    return scoreQuestion(input);
  }, [totalQuestions]);

  const skipQuestion = useCallback((): QuestionScore => {
    if (resultsRef.current.length >= totalQuestions) throw new Error("All questions in this activity are already complete");
    const input: QuestionScoreInput = { elapsedMs: 0, helpUses: 0, wrongAnswers: 0, longestWrongStreak: 0, skipped: true };
    resultsRef.current.push(input);
    startedAtRef.current = null;
    setCompletedQuestions(resultsRef.current.length);
    return scoreQuestion(input);
  }, [totalQuestions]);

  const finish = useCallback((): { score: ActivityScore; questions: QuestionScoreInput[] } => {
    if (resultsRef.current.length !== totalQuestions) throw new Error(`Expected ${totalQuestions} completed questions before finishing`);
    const questions = resultsRef.current.map((result) => ({ ...result }));
    return { score: scoreActivity(questions), questions };
  }, [totalQuestions]);

  const reset = useCallback(() => {
    resultsRef.current = skippedResults();
    startedAtRef.current = null;
    helpUsesRef.current = 0;
    wrongAnswersRef.current = 0;
    currentWrongStreakRef.current = 0;
    longestWrongStreakRef.current = 0;
    setCompletedQuestions(skipped);
  }, [skipped]);

  return { totalQuestions, completedQuestions, startQuestion, recordHelp, recordWrong, breakWrongStreak, completeQuestion, skipQuestion, finish, reset };
}
