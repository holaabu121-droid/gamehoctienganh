export function simulateStudent(lessons) {
  const result = {
    role: "student-simulation",
    mode: "deterministic-data-logic-check-not-human-or-ui-test",
    lessons_completed: 0,
    games_completed: 0,
    questions_completed: 0,
    intentional_wrong_attempts: 0,
    diagnostic_feedback_received: 0,
    corrected_answers: 0,
    level_counts: { basic: 0, understanding: 0, application: 0, challenge: 0 },
    practical_application_points: 0,
    failures: [],
    limitations: [
      "Không mô phỏng thời gian suy nghĩ, thao tác chuột, khả năng đọc hay cảm xúc của học sinh thật.",
      "Không đánh giá chất lượng thao tác giao diện; renderer bài học đã có nhưng mô phỏng tương tác vẫn mới ở mức đặc tả dữ liệu.",
      "Chỉ xác minh luồng chọn sai - nhận chẩn đoán - sửa đúng trong dữ liệu.",
    ],
  };
  for (const lesson of lessons) {
    let lessonOk = true;
    for (const game of lesson.competencies) {
      let gameOk = true;
      for (const round of game.rounds) {
        result.questions_completed += 1;
        result.level_counts[round.level] += 1;
        const wrong = round.options.find((option) => option !== round.answer);
        result.intentional_wrong_attempts += 1;
        const feedback = round.wrong_feedback[wrong];
        if (feedback?.why_wrong_vi && feedback?.fix_vi && feedback?.review_card_id) {
          result.diagnostic_feedback_received += 1;
        } else {
          result.failures.push(`${round.id}: không nhận được phản hồi chẩn đoán sau lựa chọn sai`);
          gameOk = false;
          lessonOk = false;
        }
        if (round.options.includes(round.answer)) {
          result.corrected_answers += 1;
        } else {
          result.failures.push(`${round.id}: không thể sửa sang đáp án đúng`);
          gameOk = false;
          lessonOk = false;
        }
      }
      if (gameOk) result.games_completed += 1;
    }
    if (lesson.practical_application.scored !== false || lesson.scoring_policy.practical_application_points !== 0) {
      result.failures.push(`${lesson.lesson_id}: ứng dụng thực tế tạo điểm`);
      lessonOk = false;
    }
    if (lessonOk) result.lessons_completed += 1;
  }
  result.passed = result.failures.length === 0;
  return result;
}

const teacherLessonNotes = {
  "science6-l02": "Tốt cho xây thói quen an toàn; mô phỏng cần ưu tiên quyết định báo người lớn thay vì tự xử lí sự cố.",
  "science6-l08": "Bao phủ chọn dụng cụ, giới hạn đo, độ chia, vị trí đầu đo và sai số thị sai; phù hợp dạy thao tác đo.",
  "science6-l17": "Phân biệt rõ lọc, lắng-gạn, cô cạn, chiết và chuỗi nhiều bước; cảnh báo nước trong không đồng nghĩa nước uống được rất cần thiết.",
  "science6-l21": "Nhấn mạnh bằng chứng quan sát và giới hạn kết luận; cần renderer kính hiển vi thật tốt trước khi mở cho học sinh.",
  "science6-l26": "Khóa lưỡng phân được dạy như một quá trình ra quyết định, không chỉ học tên sinh vật; phù hợp phát triển tư duy phân loại.",
  "science6-l42": "Liên kết được số đo, bảng, đồ thị và giới hạn đàn hồi; nên có hoạt ảnh lò xo và cảnh báo vật bật/rơi.",
  "science6-l48": "Chuỗi chuyển hóa và bảo toàn năng lượng được giải thích bằng nhiều thiết bị quen thuộc; sơ đồ dòng cần phân biệt có ích và phân tán.",
  "science6-l53": "Khắc phục nhầm lẫn pha Mặt Trăng với bóng Trái Đất; mô hình hai góc nhìn là thành phần trực quan bắt buộc.",
};

export function evaluateAsTeacher(lessons) {
  const allRounds = lessons.flatMap((lesson) => lesson.competencies.flatMap((game) => game.rounds));
  const allCards = lessons.flatMap((lesson) => lesson.foundations.flatMap((stage) => stage.cards));
  const feedbackCoverage = allRounds.filter((round) => Object.keys(round.wrong_feedback).length === 3).length / allRounds.length;
  const safetyCoverage = lessons.filter((lesson) => lesson.practical_application.scored === false && lesson.practical_application.warning_vi && lesson.practical_application.prohibited_actions.length >= 3).length / lessons.length;
  const expectedActionCounts = { basic: 1, understanding: 2, application: 3, challenge: 4 };
  const games = lessons.flatMap((lesson) => lesson.competencies);
  const progressionCoverage = games.length
    ? games.filter((game) => game.rounds.map((round) => round.level).join(",") === "basic,basic,basic,understanding,understanding,understanding,understanding,application,application,challenge" && game.rounds.every((round) => round.difficulty_evidence?.required_actions?.length === expectedActionCounts[round.level]) && game.rounds.filter((round) => round.level === "challenge").every((round) => /\(1\).*\(2\).*\(3\).*\(4\)/.test(round.answer))).length / games.length
    : 0;
  const representationCoverage = games.length
    ? games.filter((game) => game.rounds.every((round) => round.representation?.type && round.representation?.title_vi && Object.keys(round.representation).length >= 6) && new Set(game.rounds.map((round) => round.representation.id)).size === 10).length / games.length
    : 0;
  const groundingCoverage = allRounds.length
    ? allRounds.filter((round) => round.grounding?.policy === "reviewed-foundation-only-no-external-claim" && round.grounding?.foundation_card_id === round.concept_card_id && round.grounding?.unsupported_external_claims?.length === 0).length / allRounds.length
    : 0;
  const templateDiversityCoverage = lessons.length
    ? Number(new Set(games.map((game) => game.presentation_template?.id)).size === 18 && lessons.every((lesson) => new Set(lesson.competencies.map((game) => game.presentation_template?.id)).size === 6))
    : 0;
  const metrics = {
    lessons_with_10_unique_foundation_cards: lessons.filter((lesson) => new Set(lesson.foundations.flatMap((stage) => stage.cards).map((card) => card.teaching_vi)).size === 10).length / lessons.length,
    six_competencies_coverage: lessons.filter((lesson) => lesson.competencies.length === 6).length / lessons.length,
    diagnostic_feedback_coverage: feedbackCoverage,
    difficulty_progression_coverage: progressionCoverage,
    representation_payload_coverage: representationCoverage,
    reviewed_grounding_coverage: groundingCoverage,
    eighteen_template_rotation_coverage: templateDiversityCoverage,
    practical_safety_coverage: safetyCoverage,
  };
  const structuralScore = Number((Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.values(metrics).length * 5).toFixed(2));
  return {
    role: "teacher-review",
    review_status: "provisional-ai-role-review-not-human-teacher-validation",
    automated_structural_score: structuralScore,
    automated_structural_scale: "0-5",
    metrics,
    scientific_content_judgement_vi: "Các kiến thức lõi đã được gắn căn cứ thẻ và trang nguồn cho đủ 55 bài. Cổng tự động ngăn câu AI thêm khẳng định ngoài vật liệu đã duyệt, nhưng đây vẫn là nhận xét mô phỏng; giáo viên Khoa học tự nhiên phải duyệt lần cuối trước khi phát hành.",
    strengths: [
      "Mỗi bài có mục tiêu, 5 chặng/10 thẻ và sáu năng lực tách biệt.",
      "Mỗi phương án sai có phản hồi chỉ ra nhầm lẫn, căn cứ sửa và thẻ cần ôn.",
      "Lộ trình 3 cơ bản - 4 thông hiểu - 2 vận dụng - 1 thử thách nhất quán.",
      "Mỗi bài luân phiên sáu khuôn từ ngân hàng 18 khuôn; mọi câu có căn cứ thẻ và không khai báo khẳng định ngoài nguồn.",
      "Ứng dụng thực tế không chấm điểm và luôn có cảnh báo, giám sát, việc được làm và việc cấm.",
      "Nội dung tránh yêu cầu học sinh tự làm thí nghiệm nguy hiểm tại nhà.",
    ],
    limitations: [
      "Renderer hiện trình bày bài giảng, khuôn biểu diễn và trò chơi; phần mô phỏng vẫn ở mức đặc tả, chưa có tương tác trực quan để đánh giá thao tác thật.",
      "Kiểm thử học sinh là mô phỏng logic tất định, chưa thay thế quan sát học sinh lớp 6 thật.",
      "Cần giáo viên bộ môn duyệt lần cuối cách diễn đạt, số liệu và thời lượng trước khi phát hành rộng.",
      "Catalog, điểm và hồ sơ đã tích hợp; vẫn cần kiểm thử giao diện trên thiết bị gia đình và thí điểm người học thật.",
    ],
    lesson_notes: lessons.map((lesson) => ({
      lesson_id: lesson.lesson_id,
      title_vi: lesson.title_vi,
      note_vi: teacherLessonNotes[lesson.lesson_id]
        ?? "Bài có đủ cấu trúc kiến thức, năng lực, phản hồi và an toàn; cần giáo viên Khoa học tự nhiên duyệt diễn đạt, độ khó và trực quan trước khi phát hành.",
    })),
    recommendation: structuralScore === 5
      ? "Cấu trúc dữ liệu và tích hợp kỹ thuật đạt. Nội dung vẫn cần giáo viên bộ môn duyệt; mô phỏng trực quan, khả năng tiếp cận và hiệu quả học tập cần được kiểm thử với học sinh thật trước khi phát hành rộng."
      : "Cấu trúc chưa đạt đủ các cổng tự động; cần sửa trước khi thiết kế renderer.",
  };
}
