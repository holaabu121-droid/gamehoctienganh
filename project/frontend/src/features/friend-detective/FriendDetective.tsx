import lessonJson from "../../../../data/lessons/unit3_part5_designed.json";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateFriendDetectiveData, type FriendDetectiveData } from "./friendDetectiveEngine";
import type { ReviewTarget } from "../../reviewTarget";

const lesson = validateFriendDetectiveData(lessonJson as FriendDetectiveData);
const META: GameMeta<"detective">[] = [{
  id: "detective",
  icon: "🔎",
  title: "Friend Detective",
  description: "Đọc mô tả ngoại hình và đoán đúng người bạn hư cấu.",
  activityId: "unit3-getting-friend-detective",
}];

export function FriendDetective({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  return <SkillsSection
    unitId="unit3"
    sectionLabel="Getting Started · Unit 3 · Part 5"
    trailTitle="Friend Detective Casebook"
    introTitle={lesson.intro.title}
    introTitleVi={lesson.intro.title_vi}
    introDescription={lesson.intro.description_vi}
    foundations={[
      { title: "Tìm manh mối ngoại hình", items: lesson.intro.clue_steps },
      { title: "Mẫu câu cần nhớ", items: lesson.intro.language_steps },
    ]}
    privacyNote={lesson.intro.privacy_note_vi}
    games={lesson.games}
    help={lesson.game_help}
    meta={META}
    listening={false}
    reviewTarget={reviewTarget}
  />;
}
