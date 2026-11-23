import type { CommonRound } from "../skills-common/SkillsSection";
import type { FoundationItem } from "../skills-common/learningUx";
import { buildMathDeepHelp, deepenMathRounds, expandMathFoundations } from "./mathCurriculumDepth.ts";

export type MathLesson1GameId = "identify" | "membership" | "notation" | "listing" | "natural" | "describe";
export type MathLesson1Entry = {
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
export type MathLesson1Source = {
  lesson_id: "math6-s1-lesson1";
  source_status: "user-provided-reference";
  usage_scope: "personal-family";
  source_note: string;
  course_id: "math-6-semester-1";
  branch_id: "math6-s1-lesson1";
  lesson: { number: 1; title: string; chapter: string; objectives: string[] };
  foundations: Array<{ title: string; items: FoundationItem[] }>;
  games: Record<MathLesson1GameId, MathLesson1Entry[]>;
};
export type MathLesson1Built = MathLesson1Source & {
  rounds: Record<MathLesson1GameId, CommonRound[]>;
  help: Record<MathLesson1GameId, { source_title: string; teaching_vi: string; steps: string[] }>;
};

export const MATH_LESSON1_GAME_IDS: MathLesson1GameId[] = ["identify", "membership", "notation", "listing", "natural", "describe"];
const TEACHING: Record<MathLesson1GameId, string> = {
  identify: "Một tập hợp gồm những đối tượng được xác định rõ; mỗi đối tượng trong đó là một phần tử.",
  membership: "Tìm đối tượng trong tập hợp: có thì dùng ∈, không có thì dùng ∉.",
  notation: "Tên tập hợp thường viết hoa, phần tử đặt trong ngoặc nhọn, ngăn bằng dấu chấm phẩy và không lặp.",
  listing: "Đọc điều kiện, tìm lần lượt mọi phần tử thỏa mãn rồi kiểm tra không thiếu, không thừa và không lặp.",
  natural: "N có số 0, còn N* gồm các số tự nhiên khác 0 và bắt đầu từ 1.",
  describe: "Hai tập hợp bằng nhau khi chúng có đúng cùng các phần tử, dù được liệt kê hay nêu bằng dấu hiệu đặc trưng.",
};
// Chữ hoa và chữ thường mang ý nghĩa khác nhau trong kí hiệu tập hợp (M là tên tập, m không theo quy ước).
const normalize = (value: string) => value.trim();

export function validateMathLesson1(source: MathLesson1Source): MathLesson1Built {
  if (source.lesson_id !== "math6-s1-lesson1" || source.course_id !== "math-6-semester-1" || source.branch_id !== "math6-s1-lesson1" || source.lesson.number !== 1 || source.source_status !== "user-provided-reference" || source.usage_scope !== "personal-family" || !source.source_note.trim()) {
    throw new Error("Math lesson 1 provenance or identity is invalid");
  }
  if (source.lesson.objectives.length < 4 || source.foundations.length < 3 || source.foundations.some((block) => !block.title.trim() || block.items.length < 2)) {
    throw new Error("Math lesson 1 needs objectives and three teaching foundations");
  }
  if (JSON.stringify(Object.keys(source.games).sort()) !== JSON.stringify([...MATH_LESSON1_GAME_IDS].sort())) {
    throw new Error("Math lesson 1 needs exactly six games");
  }
  const rounds = {} as Record<MathLesson1GameId, CommonRound[]>;
  for (const gameId of MATH_LESSON1_GAME_IDS) {
    const bank = source.games[gameId];
    if (bank.length !== 10 || new Set(bank.map((item) => item.id)).size !== 10) throw new Error(`${gameId} needs ten unique rounds`);
    rounds[gameId] = bank.map((item) => {
      if (!item.context.trim() || !item.hint_vi.trim() || !item.prompt.trim() || !item.task_vi.trim() || !item.explanation_vi.trim()) throw new Error(`${item.id} is incomplete`);
      if (item.options.length !== 4 || new Set(item.options.map(normalize)).size !== 4 || !item.options.map(normalize).includes(normalize(item.answer))) throw new Error(`${item.id} has invalid answer options`);
      if (item.source_status !== "user-provided-reference" && item.source_status !== "ai-generated") throw new Error(`${item.id} has invalid provenance`);
      return {
        id: item.id,
        source_status: item.source_status,
        context: item.context,
        context_vi: item.hint_vi,
        prompt: item.prompt,
        prompt_vi: item.task_vi,
        options: item.options,
        answer: item.answer,
        explanation_vi: item.explanation_vi,
      };
    });
  }
  const identity = { id: source.lesson_id, title: source.lesson.title, chapter: source.lesson.chapter, lead: "Quan sát, phân loại, dùng kí hiệu và chuyển đổi giữa hai cách mô tả tập hợp." };
  const deepRounds = deepenMathRounds(rounds, MATH_LESSON1_GAME_IDS, identity, { transformCompetencies: true });
  const help = buildMathDeepHelp(MATH_LESSON1_GAME_IDS, identity, "SGK Toán 6 · Bài 1 · Tập hợp · trang 5–8") as MathLesson1Built["help"];
  for (const gameId of MATH_LESSON1_GAME_IDS) help[gameId].teaching_vi += ` ${TEACHING[gameId]}`;
  const foundations = expandMathFoundations(source.foundations, deepRounds, identity);
  return { ...source, foundations, rounds: deepRounds, help };
}
