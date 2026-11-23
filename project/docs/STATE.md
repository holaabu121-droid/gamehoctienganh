# English Quest – Trạng thái hiện tại (23/11/2026)

- Nhánh `review/english-only` chứa bản mã nguồn giải nén từ Release `v1.0.0`.
- Danh mục học tập chỉ có Tiếng Anh 6 học kỳ 1 và học kỳ 2.
- Giao diện hỗ trợ Unit 1–12 và Review 1–4, chấm điểm, làm lại, lưu tiến độ và xuất/nhập bản sao lưu.
- Mã bài tập Toán, Khoa học tự nhiên, Ngữ văn, Tin học đã được loại khỏi nhánh làm việc.
- Backend giữ đăng ký điểm cũ làm dữ liệu lịch sử nhưng không cho truy cập các nhánh không còn trong catalog.
- Không đưa cơ sở dữ liệu thật của học sinh, tệp PIN hay các bản sao lưu cá nhân lên GitHub.
- Kiểm thử gần nhất: CI `45173061289`, frontend 235/235, backend 54/54, Vite build PASS (176 modules).
- Những thay đổi câu chữ UI cuối cùng cần kiểm thử CI lại.
- Chưa click-through thực trên Windows/Android, chưa tạo bộ cài mới.
- Main và Release sao lưu gốc chưa thay đổi. Xem `docs/ENGLISH_ONLY_CLEANUP_2026-11-23.md`.
