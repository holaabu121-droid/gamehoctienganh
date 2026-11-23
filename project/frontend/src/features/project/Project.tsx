import lessonJson from "../../../../data/lessons/unit3_project.json";
import { SkillsSection, type GameMeta } from "../skills-common/SkillsSection";
import { validateProjectData, type ProjectData, type ProjectGameId } from "./projectEngine";
import type { ReviewTarget } from "../../reviewTarget";

const lesson = validateProjectData(lessonJson as ProjectData);
const META: GameMeta<ProjectGameId>[] = [
  { id: "path", icon: "🗺️", title: "Project Path", description: "Đi đúng năm bước làm kỷ yếu lớp.", activityId: "unit3-project-path" },
  { id: "interview", icon: "🎤", title: "Interview Coach", description: "Chọn câu hỏi để lấy đúng thông tin.", activityId: "unit3-project-interview" },
  { id: "notes", icon: "🗂️", title: "Profile Sorter", description: "Phân loại ghi chú từ hồ sơ hư cấu.", activityId: "unit3-project-notes" },
  { id: "writer", icon: "✍️", title: "Yearbook Writer", description: "Viết câu và sắp ý cho trang kỷ yếu.", activityId: "unit3-project-writer" },
  { id: "present", icon: "🎙️", title: "Show & Tell", description: "Tập giới thiệu và tự kiểm tra cuối Unit.", activityId: "unit3-project-present" },
];

export function Project({ reviewTarget }: { reviewTarget?: ReviewTarget | null }) {
  return <SkillsSection
    unitId="unit3"
    sectionLabel="Project · Unit 3"
    trailTitle="My Class Yearbook Studio"
    introTitle={lesson.intro.title}
    introTitleVi={lesson.intro.title_vi}
    introDescription={lesson.intro.description_vi}
    foundations={[]}
    privacyNote={lesson.intro.privacy_note_vi}
    games={lesson.games}
    help={lesson.game_help}
    meta={META}
    listening={false}
    reviewTarget={reviewTarget}
  />;
}
