import lessonJson from "../../../../data/lessons/unit3_looking_back.json";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateLookingBackData, type LookingBackData, type LookingBackGameId } from "./lookingBackEngine";
import type { ReviewTarget } from "../../reviewTarget";

const lesson = validateLookingBackData(lessonJson as LookingBackData);
const META: GameMeta<LookingBackGameId>[] = [
  { id: "personality", icon: "🧠", title: "Personality Clue", description: "Chọn tính cách từ bằng chứng hành động.", activityId: "unit3-looking-back-personality" },
  { id: "appearance", icon: "👤", title: "Appearance Q&A", description: "Hỏi đáp từ hồ sơ hư cấu an toàn.", activityId: "unit3-looking-back-appearance" },
  { id: "continuous", icon: "⚙️", title: "Continuous Builder", description: "Ghép be với động từ dạng -ing.", activityId: "unit3-looking-back-continuous" },
  { id: "tenses", icon: "⏱️", title: "Tense Switch", description: "Phân biệt thói quen và hành động lúc này.", activityId: "unit3-looking-back-tenses" },
  { id: "review", icon: "🏁", title: "Final Review Mix", description: "Trộn từ vựng và ngữ pháp toàn phần.", activityId: "unit3-looking-back-review" },
];

export function LookingBack({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  return <SkillsSection
    unitId="unit3"
    sectionLabel="Looking Back · Vocabulary & Grammar"
    trailTitle="Unit 3 Mastery Trail"
    introTitle={lesson.intro.title}
    introTitleVi={lesson.intro.title_vi}
    introDescription={lesson.intro.description_vi}
    foundations={[
      { title: "Từ bằng chứng đến từ vựng", items: lesson.intro.vocabulary_steps },
      { title: "Chọn thì theo ý nghĩa", items: lesson.intro.grammar_steps },
    ]}
    privacyNote={lesson.intro.privacy_note_vi}
    games={lesson.games}
    help={lesson.game_help}
    meta={META}
    listening={false}
    reviewTarget={reviewTarget}
  />;
}
