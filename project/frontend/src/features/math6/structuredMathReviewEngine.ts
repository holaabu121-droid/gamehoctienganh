import type { StructuredMathLessonBuilt, StructuredMathGameMeta } from "./structuredMathLessonEngine";
import type { FoundationItem } from "../skills-common/learningUx";
import { buildMathDeepHelp, deepenMathMeta, deepenMathRounds, expandMathFoundations } from "./mathCurriculumDepth.ts";

type ReviewSeed = {
  id: string;
  q: string;
  a: string;
  d: string[];
  e: string;
  s: "user-provided-reference" | "ai-generated";
  c?: string;
  h?: string;
  t?: string;
};

export type StructuredMathReviewSource<Id extends string = string> = {
  review_id: string;
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  course_id: "math-6-semester-1";
  branch_id: string;
  review: { sequence: number; label: string; badge: string; title: string; chapter: string; lead: string; objectives: string[]; extension?: string };
  foundations: Array<{ title: string; items: FoundationItem[] }>;
  game_meta: Array<StructuredMathGameMeta<Id> & { default_hint_vi: string }>;
  games: Record<Id, ReviewSeed[]>;
};

export function validateStructuredMathReview<Id extends string>(source: StructuredMathReviewSource<Id>, expected: { reviewId: string; sequence: number; pageLabel: string }): StructuredMathLessonBuilt<Id> {
  if (source.review_id !== expected.reviewId || source.branch_id !== expected.reviewId || source.course_id !== "math-6-semester-1" || source.review.sequence !== expected.sequence || source.source_status !== "user-provided-reference" || source.usage_scope !== "personal-family" || !source.source_note.trim()) throw new Error(`Math review ${expected.reviewId} provenance or identity is invalid`);
  if (source.review.objectives.length < 4 || source.foundations.length < 3 || source.foundations.some((block) => !block.title.trim() || block.items.length < 2)) throw new Error(`${expected.reviewId} needs objectives and three teaching foundations`);
  const gameIds = source.game_meta.map((item) => item.id);
  if (gameIds.length !== 6 || new Set(gameIds).size !== 6 || source.game_meta.some((item) => !item.icon.trim() || !item.title.trim() || !item.description.trim() || !item.teaching_vi.trim() || !item.default_hint_vi.trim())) throw new Error(`${expected.reviewId} needs six complete game descriptors`);
  if (JSON.stringify(Object.keys(source.games).sort()) !== JSON.stringify([...gameIds].sort())) throw new Error(`${expected.reviewId} games do not match navigation`);
  const rounds = {} as StructuredMathLessonBuilt<Id>["rounds"];
  for (const game of source.game_meta) {
    const bank = source.games[game.id];
    if (bank.length !== 10 || new Set(bank.map((item) => item.id)).size !== 10) throw new Error(`${game.id} needs ten unique rounds`);
    rounds[game.id] = bank.map((item) => {
      const options = [item.a, ...item.d];
      if (!item.q.trim() || !item.e.trim() || item.d.length !== 3 || options.some((option) => !option.trim()) || new Set(options).size !== 4) throw new Error(`${item.id} is incomplete`);
      return { id: item.id, source_status: item.s, context: item.c ?? `${source.review.label} · ${game.title}`, context_vi: item.h ?? game.default_hint_vi, prompt: item.q, prompt_vi: item.t ?? "Chọn đáp án đúng.", options, answer: item.a, explanation_vi: item.e };
    });
  }
  const sourceTitle = `SGK Toán 6 · ${source.review.label} · ${source.review.title} · ${expected.pageLabel}`;
  const identity = { id: source.review_id, title: source.review.title, chapter: source.review.chapter, lead: source.review.lead };
  const deepRounds = deepenMathRounds(rounds, gameIds, identity, { transformCompetencies: true });
  const help = buildMathDeepHelp(gameIds, identity, sourceTitle) as StructuredMathLessonBuilt<Id>["help"];
  const meta = deepenMathMeta(source.game_meta.map((game) => ({ id: game.id, icon: game.icon, title: game.title, description: game.description, activityId: `${source.branch_id}-${game.id}` })));
  const foundations = expandMathFoundations(source.foundations, deepRounds, identity);
  return { lesson_id: source.review_id, source_status: source.source_status, usage_scope: source.usage_scope, source_note: source.source_note, course_id: source.course_id, branch_id: source.branch_id, lesson: { number: source.review.sequence, title: source.review.title, chapter: source.review.chapter, lead: source.review.lead, objectives: source.review.objectives, extension: source.review.extension }, foundations, game_meta: source.game_meta, games: {} as StructuredMathLessonBuilt<Id>["games"], gameIds, rounds: deepRounds, help, meta };
}
