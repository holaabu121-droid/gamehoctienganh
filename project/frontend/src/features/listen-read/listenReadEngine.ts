export type ConversationLine = { speaker: string; text: string; voice: string };

export type ListenReadStep =
  | { kind: "full-line"; lineIndex: number; line: ConversationLine; rate: number }
  | { kind: "guide"; text: string; lang: "vi-VN"; rate: number }
  | { kind: "repeat-line"; lineIndex: number; line: ConversationLine; rate: number }
  | { kind: "repeat-gap"; lineIndex: number; durationMs: number };

export const VIETNAMESE_GUIDE =
  "Bây giờ, em hãy đọc theo người hướng dẫn. Nghe từng câu tiếng Anh, sau đó đọc lại trong khoảng lặng.";
export const DEFAULT_REPEAT_GAP_MS = 4500;

export function createListenReadPlan(
  conversation: readonly ConversationLine[],
  repeatGapMs = DEFAULT_REPEAT_GAP_MS,
): ListenReadStep[] {
  if (conversation.length === 0) throw new Error("Listen and read requires conversation lines");
  if (repeatGapMs < 1000) throw new Error("Repeat gap must be at least one second");

  const fullPass: ListenReadStep[] = conversation.map((line, lineIndex) => ({
    kind: "full-line", lineIndex, line, rate: 0.92,
  }));
  const guidedPractice: ListenReadStep[] = conversation.flatMap((line, lineIndex) => [
    { kind: "repeat-line", lineIndex, line, rate: 0.7 },
    { kind: "repeat-gap", lineIndex, durationMs: repeatGapMs },
  ]);
  return [
    ...fullPass,
    { kind: "guide", text: VIETNAMESE_GUIDE, lang: "vi-VN", rate: 0.9 },
    ...guidedPractice,
  ];
}

export function countPlanSteps(plan: readonly ListenReadStep[]) {
  return plan.reduce(
    (counts, step) => ({ ...counts, [step.kind]: counts[step.kind] + 1 }),
    { "full-line": 0, guide: 0, "repeat-line": 0, "repeat-gap": 0 },
  );
}
