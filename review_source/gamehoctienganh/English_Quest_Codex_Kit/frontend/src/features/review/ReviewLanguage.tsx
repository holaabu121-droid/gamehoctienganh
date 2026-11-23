import lessonJson from "../../../../data/lessons/review1.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateReviewData, type ReviewData, type ReviewGameId } from "./reviewEngine";

const lesson = validateReviewData(lessonJson as ReviewData);
type LanguageId = Extract<ReviewGameId, "sounds" | "vocabulary" | "grammar">;
const META: GameMeta<LanguageId>[] = [
  { id: "sounds", icon: "👂", title: "Sound Sorter", description: "Nhận biết âm khác và nhóm /b/–/p/.", activityId: "review1-language-sounds" },
  { id: "vocabulary", icon: "🧩", title: "Word Grid", description: "Hoàn thành từ và cụm từ quen thuộc.", activityId: "review1-language-vocabulary" },
  { id: "grammar", icon: "⏱️", title: "Grammar Switch", description: "Chọn vị trí và đúng thì của động từ.", activityId: "review1-language-grammar" },
];

export function ReviewLanguage({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  return <SkillsSection unitId="review1" sectionLabel="Review 1 · Language" trailTitle="Language Review Trail" introTitle="Language Checkpoint" introTitleVi="Trạm ôn ngôn ngữ" introDescription="Ôn trọng tâm Units 1–2–3 qua ba game, mỗi game 10 câu và lưu điểm cao nhất từng câu." foundations={[{ title: "Âm và từ vựng", items: lesson.intro.language_foundations.slice(0, 2) }, { title: "Ngữ pháp", items: lesson.intro.language_foundations.slice(2) }]} games={{ sounds: lesson.games.sounds, vocabulary: lesson.games.vocabulary, grammar: lesson.games.grammar }} help={{ sounds: lesson.game_help.sounds, vocabulary: lesson.game_help.vocabulary, grammar: lesson.game_help.grammar }} meta={META} listening={false} reviewTarget={reviewTarget} />;
}

