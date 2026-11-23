import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { scoreActivity, type ActivityScore, type QuestionScoreInput } from "./scoringEngine";

export type ActivityResult = { unitId: string; activityId: string; completed: boolean; questions: QuestionScoreInput[] };
export type ScoredActivityResult = ActivityResult & { score: ActivityScore };
type ProgressContextValue = { lastResult: ScoredActivityResult | null; submitActivityResult: (result: ActivityResult) => Promise<ScoredActivityResult> };
const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children, onActivityResult }: { children: ReactNode; onActivityResult?: (result: ScoredActivityResult) => void | Promise<void> }) {
  const [lastResult, setLastResult] = useState<ScoredActivityResult | null>(null);
  const submitActivityResult = useCallback(async (result: ActivityResult) => {
    const scored = { ...result, score: scoreActivity(result.questions) };
    await onActivityResult?.(scored);
    setLastResult(scored);
    return scored;
  }, [onActivityResult]);
  const value = useMemo(() => ({ lastResult, submitActivityResult }), [lastResult, submitActivityResult]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
