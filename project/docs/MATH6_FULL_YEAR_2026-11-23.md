# Toán 6 cả năm – mở rộng đến Bài 43
Ngày 23/11/2026 · Nhánh `feature/math6-full-year-curriculum`.

## Nguồn
- SGK Toán 6 *Kết nối tri thức với cuộc sống*, tập 1 (PDF 126 trang) và tập 2 (PDF 114 trang) do người dùng cung cấp.
- Mục lục được đọc trực tiếp từ ảnh PDF: tập 1 gồm Bài 1–22, năm chương; tập 2 gồm Bài 23–43, bốn chương.
- Các PDF là bản trang ảnh, không có văn bản tìm kiếm được. Tên chương, tên bài và số trang mở đầu được đối chiếu qua mục lục, nhưng chưa thẩm định từng hoạt động với toàn bộ trang SGK.

## Đã tích hợp
- Danh mục đủ 43 bài theo thứ tự SGK; 22 bài học kỳ 1 và 21 bài học kỳ 2. Nút danh sách bài, đổi học kỳ, bài trước và bài kế tiếp.
- Hai trò chơi đã duyệt của Bài 1 và Bài 2 giữ nguyên mã nguồn, ngân hàng 50 câu và bộ chấm riêng.
- Bài 3–43 sử dụng hệ thống câu hỏi tự tạo theo chủ đề, mỗi bài 50 **biến thể câu hỏi** (30 luyện tập + 20 vận dụng), tổng 2050 biến thể. Đây là câu hỏi *sinh từ thuật toán*, không phải 2050 bài tập SGK và không đồng nghĩa 2050 ý tưởng độc lập.
- Đề mỗi bài 10 câu: 6 luyện tập + 4 vận dụng, không lặp mã trong một đề; tối đa 1000 điểm.
- Gợi ý sau lần sai đầu (trừ 50 điểm), tạm dừng thời gian khi hiện gợi ý; sai hai lần 0 điểm nhưng tiếp tục hướng dẫn; miễn trừ 10 giây đầu rồi trừ 10 điểm mỗi 10 giây đầy đủ; không âm.
- Chấm đáp án số nguyên, thập phân dùng dấu phẩy hoặc chấm và phân số tương đương. Không so chữ từng từ trong câu giải thích.
- Backend FastAPI/SQLite thêm mã điểm riêng cho Bài 3–43, tách học kỳ và giữ toàn bộ dữ liệu/định nghĩa điểm lịch sử.
- Đề đang làm và lịch sử chi tiết lưu cục bộ theo tài khoản trên thiết bị; tổng điểm tốt nhất của đề hoàn thành đồng bộ lên hồ sơ. Không ghép điểm theo vị trí câu hỏi ở các đề ngẫu nhiên.
- Không sửa Tiếng Anh 6, không sửa PR #1/#2/#3 và không đổi nhánh `main`.

## Hạn chế cần báo cáo trung thực
- Chỉ mục lục đã được đối chiếu trực tiếp; câu hỏi Bài 3–43 là ngân hàng tự tạo **chờ kiểm duyệt sư phạm**. Không coi là ngân hàng đã được duyệt như Bài 1–2.
- Với các bài nhận biết hình hoặc dữ liệu, phần bài luyện hiện thiên về câu chữ và số liệu, chưa có bộ sơ đồ hình học/biểu đồ trực quan đầy đủ của từng bài.
- Chưa có 50 dạng nhiệm vụ khác ý tưởng cho mỗi bài; 50 là số **biến thể** được tạo bởi nhiều mẫu.
- Chưa tạo bộ cài Windows, chưa triển khai URL, chưa thử trên thiết bị Android/Windows thật.
- Chưa đồng bộ đề đang làm dở qua nhiều thiết bị.

## Kiểm thử
- `mathFullYear.test.mjs`: 43 bài đúng chương trình, 2050 bài tự tạo hợp lệ, đáp án đúng, phân số tương đương, số thập phân, tỷ lệ 6+4, điểm thời gian và sai hai lần.
- `mathFullYear.browser.mjs`: Bài 3, 23 và 43 trên Chromium 390/800 px; kiểm tra 10 câu thực, gợi ý, tiếp tục đề và tránh tràn ngang.
- `mathLesson2.browser.mjs`: hồi quy hai học phần đã duyệt.
- `npm test`, `npm run build`, `python -m unittest discover -s backend/tests -v` chạy trên GitHub Actions.
- Các kết quả cụ thể cần được lấy từ GitHub Actions của commit đang dùng.

## Lộ trình kiểm duyệt
Ưu tiên kiểm duyệt các chương hình học (IV, V, VIII) và thống kê (IX), rồi phần còn lại. Khi một bài được duyệt, thay `contentStatus` của bài trong metadata, bổ sung hình/sơ đồ và câu hỏi phong phú hơn. Không nên quảng bá các bài sinh tự động là bài tập SGK chính thức.
