# Hiện trạng – Ứng dụng luyện tập đa môn lớp 6
Ngày cập nhật: 2026-11-23. Nhánh: `feature/grade6-multisubject`.

- Môn Tiếng Anh 6 giữ hai học kỳ, Unit 1–12 và Review 1–4 từ nhánh `review/english-only`.
- Môn Toán 6 mới chỉ có **Bài 1 – Tập hợp**, gồm 50 câu: 30 luyện tập, 20 vận dụng, phân 2 kiến thức nền; không tự đưa các bài Toán chưa duyệt vào catalog.
- Bài Toán dùng đúng ngân hàng/engine đã kiểm duyệt v0.5.4 trong `frontend/public/math6-bai1/index.html`.
- Menu chọn môn/học kỳ gồm 3 khóa: Tiếng Anh HK1, Tiếng Anh HK2, Toán HK1 (Bài 1).
- Backend vẫn là FastAPI/SQLite. Định danh bài Toán mới `math6-bai1-v054`, có hai hoạt động `-kn1` và `-kn2`, mỗi hoạt động tối đa 1000 điểm, tách biệt với ID Toán cũ.
- Khi hoàn thành đề Toán, điểm tổng được chuyển đến API của tài khoản đang đăng nhập; giữ điểm tốt nhất theo đề, không ghép điểm theo vị trí câu hỏi ngẫu nhiên.
- Tiến độ đề Toán đang làm dở và chi tiết từng câu tiếp tục lưu cục bộ theo tài khoản trên trình duyệt; chưa đồng bộ dở dang hoặc lịch sử chi tiết qua nhiều thiết bị.
- Toàn bộ tiến độ/điểm Tiếng Anh, đăng nhập, backup/restore và mã nguồn gốc được giữ; không thao tác dữ liệu SQLite người học thật.
- Không sửa `main`, không gộp PR #1, không đụng bản ZIP Release v1.0.0, không công khai triển khai.
- Chưa tạo bộ cài Windows mới hay kiểm tra trực quan thủ công trên Android/Windows.
- Xem báo cáo `docs/MULTISUBJECT_GRADE6_2026-11-23.md`.
