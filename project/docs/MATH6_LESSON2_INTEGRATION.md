# Toán 6 Bài 2 – tích hợp vào ứng dụng đa môn
Ngày: 23/11/2026 · Nhánh: `feature/math6-lesson2-v01`.

## Phạm vi
- Duy trì Tiếng Anh 6 hai học kỳ và Toán 6 Bài 1 v0.5.4, không ghi đè chương trình cũ.
- Bổ sung Bài 2: Cách ghi số tự nhiên trong khóa `math-6-semester-1` đã có.
- 50 câu theo tài liệu được duyệt: hệ thập phân 15 luyện tập + 10 vận dụng; số La Mã 1–30 có 15 luyện tập + 10 vận dụng.
- Đề theo từng kiến thức gồm 6 câu luyện tập + 4 câu vận dụng ngẫu nhiên, 10 câu tối đa 1000 điểm; chưa bật đề tổng kết do chưa được phê duyệt.
- Hai thẻ học được đánh dấu đã xem đủ trước khi mở đề; bảng hàng thập phân và bảng La Mã 1–30.

## Giữ nguyên các luật đã duyệt
- 100 điểm/câu, 10 giây đầu miễn trừ, từ 20 giây trừ 10 điểm, các mốc 30,40,… trừ tiếp 10; 110 giây về 0.
- Sai lần đầu tự gợi ý và trừ tổng 50 điểm cho cả lỗi và gợi ý. Đồng hồ ngừng khi gợi ý mở, chạy lại khi quay về trả lời.
- Sai lần hai cố định 0 điểm, đồng hồ ngừng; vẫn hướng dẫn tới khi làm đúng.
- Đáp án tương đương: số 35 029 / 35.029 / 35029; chữ thường/hoa La Mã; đảo thứ tự các lựa chọn tích chọn không thay đổi kết quả.
- Đáp án chưa điền đủ chỉ nhắc hoàn thiện, không trừ lượt sai.
- Khác Bài 1, những câu cần nhiều phần đã đổi sang ghép bằng lựa chọn `<select>` thay vì phải gõ nguyên câu.

## Tích hợp
- Nhánh ID: `math6-bai2-v01`; hoạt động `math6-bai2-v01-tp`, `math6-bai2-v01-lm`.
- Chạy bài học trong iframe cùng origin, `postMessage` kiểm tra nguồn, tên tài khoản, 10 điểm câu và tổng.
- Lưu điểm tốt nhất của cả đề vào FastAPI/SQLite, không ghép điểm từng vị trí vì đề ngẫu nhiên; lịch sử câu và đề dở nằm trên trình duyệt theo tên học sinh, có thể tiếp tục sau khi mở lại.
- Không cập nhật hoặc xóa cơ sở dữ liệu học sinh thật; không đưa bài học vào `main` khi chưa duyệt PR.

## Kiểm thử
- Tests Node.js cho 50 đáp án chuẩn, phân bố 6+4, chuẩn hóa số/La Mã, ghép cặp, chọn nhiều, xếp thứ tự.
- Kiểm thử mốc 10/20/30/110 giây, trừ 50 lần sai đầu, cố định 0 lần sai thứ hai.
- Kiểm tra nhập ô, ô chọn, gợi ý, đề dở, không trộn điểm đề ngẫu nhiên, nhánh Bài 1 cũ.
- Python backend test cho hai hoạt động Toán Bài 2, tách biệt môn Tiếng Anh và Bài 1.
- GitHub Actions thực thi `npm test`, `npm run build` và Python unittest; kết quả cuối cùng ghi ở CI của nhánh tích hợp.

## Chưa thực hiện
- Chưa chạy thử giao diện trên thiết bị Android/Windows vật lý, chưa đóng bộ cài Windows.
- Chưa hỗ trợ đồng bộ đề Toán đang làm dở qua nhiều thiết bị.
- Chưa bổ sung Bài 3.
