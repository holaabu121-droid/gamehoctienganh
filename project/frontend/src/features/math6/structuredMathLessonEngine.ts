import type { CommonRound, GameMeta } from "../skills-common/SkillsSection";
import type { FoundationItem } from "../skills-common/learningUx";
import { buildMathDeepHelp, deepenMathMeta, deepenMathRounds, expandMathFoundations } from "./mathCurriculumDepth.ts";

export type StructuredMathGameEntry = {
  id: string;
  context: string;
  hint_vi: string;
  prompt: string;
  task_vi: string;
  options: string[];
  answer: string;
  explanation_vi: string;
  source_status: "user-provided-reference" | "ai-generated";
};

export type StructuredMathGameMeta<Id extends string = string> = {
  id: Id;
  icon: string;
  title: string;
  description: string;
  teaching_vi: string;
};

export type StructuredMathLessonSource<Id extends string = string> = {
  lesson_id: string;
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  course_id: "math-6-semester-1" | "math-6-semester-2";
  branch_id: string;
  lesson: { number: number; title: string; chapter: string; lead: string; objectives: string[]; extension?: string };
  foundations: Array<{ title: string; items: FoundationItem[] }>;
  game_meta: Array<StructuredMathGameMeta<Id>>;
  games: Record<Id, StructuredMathGameEntry[]>;
};

export type StructuredMathLessonBuilt<Id extends string = string> = StructuredMathLessonSource<Id> & {
  gameIds: Id[];
  rounds: Record<Id, CommonRound[]>;
  help: Record<Id, { source_title: string; teaching_vi: string; steps: string[] }>;
  meta: GameMeta<Id>[];
};

const normalize = (value: string) => value.trim();

export function validateStructuredMathLesson<Id extends string>(source: StructuredMathLessonSource<Id>, expected: { lessonId: string; lessonNumber: number; pageLabel: string; courseId?: StructuredMathLessonSource["course_id"] }): StructuredMathLessonBuilt<Id> {
  const expectedCourseId = expected.courseId ?? "math-6-semester-1";
  if (source.lesson_id !== expected.lessonId || source.branch_id !== expected.lessonId || source.course_id !== expectedCourseId || source.lesson.number !== expected.lessonNumber || source.source_status !== "user-provided-reference" || source.usage_scope !== "personal-family" || !source.source_note.trim()) {
    throw new Error(`Math lesson ${expected.lessonNumber} provenance or identity is invalid`);
  }
  if (source.lesson.objectives.length < 4 || source.foundations.length < 3 || source.foundations.some((block) => !block.title.trim() || block.items.length < 2)) {
    throw new Error(`Math lesson ${expected.lessonNumber} needs objectives and three teaching foundations`);
  }
  const gameIds = source.game_meta.map((item) => item.id);
  if (gameIds.length !== 6 || new Set(gameIds).size !== 6 || source.game_meta.some((item) => !item.icon.trim() || !item.title.trim() || !item.description.trim() || !item.teaching_vi.trim())) {
    throw new Error(`Math lesson ${expected.lessonNumber} needs six complete game descriptors`);
  }
  if (JSON.stringify(Object.keys(source.games).sort()) !== JSON.stringify([...gameIds].sort())) {
    throw new Error(`Math lesson ${expected.lessonNumber} games do not match navigation`);
  }
  const rounds = {} as Record<Id, CommonRound[]>;
  for (const gameId of gameIds) {
    const bank = source.games[gameId];
    if (bank.length !== 10 || new Set(bank.map((item) => item.id)).size !== 10) throw new Error(`${gameId} needs ten unique rounds`);
    rounds[gameId] = bank.map((item) => {
      if (!item.context.trim() || !item.hint_vi.trim() || !item.prompt.trim() || !item.task_vi.trim() || !item.explanation_vi.trim()) throw new Error(`${item.id} is incomplete`);
      if (item.options.length !== 4 || new Set(item.options.map(normalize)).size !== 4 || !item.options.map(normalize).includes(normalize(item.answer))) throw new Error(`${item.id} has invalid answer options`);
      if (item.source_status !== "user-provided-reference" && item.source_status !== "ai-generated") throw new Error(`${item.id} has invalid provenance`);
      return { id: item.id, source_status: item.source_status, context: item.context, context_vi: item.hint_vi, prompt: item.prompt, prompt_vi: item.task_vi, options: item.options, answer: item.answer, explanation_vi: item.explanation_vi };
    });
  }
  const sourceTitle = `SGK Toán 6 · Bài ${source.lesson.number} · ${source.lesson.title} · ${expected.pageLabel}`;
  const identity = { id: source.lesson_id, title: source.lesson.title, chapter: source.lesson.chapter, lead: source.lesson.lead };
  const deepRounds = deepenMathRounds(rounds, gameIds, identity, { transformCompetencies: true });
  const help = buildMathDeepHelp(gameIds, identity, sourceTitle) as StructuredMathLessonBuilt<Id>["help"];
  const meta = deepenMathMeta(source.game_meta.map((game) => ({ id: game.id, icon: game.icon, title: game.title, description: game.description, activityId: `${source.branch_id}-${game.id}` })));
  const foundations = expandMathFoundations(source.foundations, deepRounds, identity);
  return { ...source, foundations, gameIds, rounds: deepRounds, help, meta };
}
