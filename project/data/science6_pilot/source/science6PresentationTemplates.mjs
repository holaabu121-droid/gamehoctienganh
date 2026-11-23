export const presentationTemplates = [
  { id: "annotated-scene", title_vi: "Phiếu quan sát có chú thích", action_vi: "quan sát dấu hiệu và giới hạn kết luận", renderer_kind: "annotated-scene" },
  { id: "classification-grid", title_vi: "Lưới phân loại", action_vi: "xếp nhóm theo một tiêu chí nhất quán", renderer_kind: "classification-grid" },
  { id: "evidence-table", title_vi: "Bảng bằng chứng", action_vi: "đọc điều kiện, bằng chứng và kết quả", renderer_kind: "evidence-table" },
  { id: "cause-effect-map", title_vi: "Sơ đồ nguyên nhân - kết quả", action_vi: "nối căn cứ, thao tác và kết quả", renderer_kind: "cause-effect-map" },
  { id: "procedure-cards", title_vi: "Thẻ quy trình", action_vi: "sắp xếp thao tác và điểm dừng an toàn", renderer_kind: "procedure-cards" },
  { id: "claim-evidence-reasoning", title_vi: "Khẳng định - bằng chứng - lập luận", action_vi: "nối kết luận với bằng chứng và cơ chế", renderer_kind: "cer-frame" },
  { id: "diagram-labeling", title_vi: "Gắn nhãn vào sơ đồ", action_vi: "ghép tên, dấu hiệu và kết quả vào đúng vị trí", renderer_kind: "label-diagram" },
  { id: "sequence-builder", title_vi: "Sắp xếp trình tự", action_vi: "xếp các bước theo quan hệ trước - sau", renderer_kind: "sortable-sequence" },
  { id: "error-diagnosis", title_vi: "Tìm và sửa lỗi", action_vi: "phát hiện bước thiếu căn cứ và chọn cách sửa", renderer_kind: "error-repair" },
  { id: "before-after-comparison", title_vi: "So sánh trước - sau", action_vi: "đối chiếu trạng thái, thao tác và kết quả", renderer_kind: "before-after" },
  { id: "diagram-gap-fill", title_vi: "Điền khuyết sơ đồ", action_vi: "hoàn thiện mắt xích còn thiếu bằng căn cứ đã học", renderer_kind: "diagram-gap" },
  { id: "chart-reading", title_vi: "Đọc biểu đồ định tính", action_vi: "đọc xu hướng từ bằng chứng có sẵn, không tự sinh số liệu", renderer_kind: "qualitative-chart" },
  { id: "experiment-designer", title_vi: "Thiết kế kiểm tra khoa học", action_vi: "chọn điều kiện, thao tác, kết quả cần ghi và giới hạn an toàn", renderer_kind: "experiment-planner" },
  { id: "tool-selector", title_vi: "Chọn công cụ hoặc cách làm", action_vi: "chọn thao tác phù hợp từ mục tiêu và căn cứ", renderer_kind: "tool-selector" },
  { id: "virtual-lab", title_vi: "Phòng khoa học ảo", action_vi: "thay đổi điều kiện trong mô phỏng và đối chiếu kết quả dự kiến", renderer_kind: "virtual-lab" },
  { id: "decision-scenario", title_vi: "Tình huống ra quyết định", action_vi: "chọn phương án có căn cứ và an toàn", renderer_kind: "decision-scenario" },
  { id: "multi-layer-matching", title_vi: "Ghép cặp nhiều tầng", action_vi: "ghép khái niệm, căn cứ, thao tác và kết quả", renderer_kind: "multi-match" },
  { id: "concept-map", title_vi: "Bản đồ khái niệm", action_vi: "nối khái niệm bằng quan hệ khoa học đã được cung cấp", renderer_kind: "concept-map" },
];

export function templatesForLesson(lessonNumber) {
  const start = ((lessonNumber - 1) * 6) % presentationTemplates.length;
  return Array.from({ length: 6 }, (_, index) => presentationTemplates[(start + index) % presentationTemplates.length]);
}
