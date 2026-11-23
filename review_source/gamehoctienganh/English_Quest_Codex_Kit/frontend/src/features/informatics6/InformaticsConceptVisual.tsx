import type { InformaticsLessonSpec } from "./informaticsCurriculum";

export function InformaticsConceptVisual({ spec }: { spec: InformaticsLessonSpec }) {
  if (spec.visual === "data") return <section className="informatics-visual" aria-label="Sơ đồ xử lí thông tin"><span>Dữ liệu vào</span><b>→</b><span>Xử lí</span><b>→</b><span>Thông tin ra</span><small>💾 Lưu trữ · 📤 Truyền</small></section>;
  if (spec.visual === "network") return <section className="informatics-visual informatics-network" aria-label="Mô hình mạng"><span>💻 Máy tính</span><b>↔ 📡 ↔</b><span>🖨️ Máy in</span><b>↔</b><span>📱 Điện thoại</span><small>Kết nối để trao đổi dữ liệu và dùng chung tài nguyên có kiểm soát</small></section>;
  if (spec.visual === "web") return <section className="informatics-visual informatics-browser" aria-label="Mô phỏng trình duyệt"><label>🔒 Địa chỉ / từ khóa an toàn</label><div>🔎 Kiểm tra nguồn · Không nhập mật khẩu · Hỏi người lớn khi nghi ngờ</div></section>;
  if (spec.visual === "safety") return <section className="informatics-visual informatics-safety" aria-label="Lá chắn an toàn số"><strong>🛡️ DỪNG – KIỂM TRA – HỎI – BÁO</strong><span>Giữ kín mật khẩu</span><span>Xin phép trước khi chia sẻ</span><span>Chặn và báo người lớn khi gặp nguy hiểm</span></section>;
  if (spec.visual === "document") return <section className="informatics-visual informatics-document" aria-label="Mô hình tài liệu"><strong>Tiêu đề rõ ràng</strong><span>Ý chính → nhánh / đoạn / hàng / cột</span><span>Định dạng nhất quán</span><small>✓ Kiểm tra nội dung · ✓ quyền riêng tư · ✓ nguồn</small></section>;
  return <section className="informatics-visual informatics-algorithm" aria-label="Sơ đồ thuật toán"><span>Bắt đầu</span><b>↓</b><span>Nhập dữ liệu</span><b>↓</b><span>Kiểm tra điều kiện?</span><b>↙ Có · Không ↘</b><span>Kết thúc</span></section>;
}
