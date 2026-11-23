import lessonJson from "../../../../data/lessons/review1.json";
import type { ReviewTarget } from "../../reviewTarget";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateReviewData, type ReviewData, type ReviewGameId } from "./reviewEngine";

const lesson = validateReviewData(lessonJson as ReviewData);
type SkillsId = Extract<ReviewGameId, "email" | "school" | "listen_write">;
const META: GameMeta<SkillsId>[] = [
  { id: "email", icon: "✉️", title: "Email Repair", description: "Khôi phục email bằng ngữ cảnh.", activityId: "review1-skills-email" },
  { id: "school", icon: "🏫", title: "School Scanner", description: "Tìm bằng chứng trong bài đọc.", activityId: "review1-skills-school" },
  { id: "listen_write", icon: "🎧", title: "Message Mission", description: "Nghe chi tiết và chọn câu viết đúng.", activityId: "review1-skills-listen-write", listening: true },
];

export function ReviewSkills({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  return <SkillsSection unitId="review1" sectionLabel="Review 1 · Skills" trailTitle="Skills Review Trail" introTitle="Skills Checkpoint" introTitleVi="Trạm ôn kỹ năng" introDescription="Luyện đọc, nghe và viết với dữ liệu an toàn. Track 22 không có trong ảnh nên năm câu nghe dùng script mới và được ghi nhãn rõ." foundations={[{ title: "Đọc có bằng chứng", items: lesson.intro.skills_foundations.slice(0, 1) }, { title: "Nghe và viết an toàn", items: lesson.intro.skills_foundations.slice(1) }]} privacyNote="Hồ sơ trong game là nhân vật hư cấu; em không cần nhập thông tin thật của bạn học hoặc gia đình." games={{ email: lesson.games.email, school: lesson.games.school, listen_write: lesson.games.listen_write }} help={{ email: lesson.game_help.email, school: lesson.game_help.school, listen_write: lesson.game_help.listen_write }} meta={META} listening={false} reviewTarget={reviewTarget} />;
}
