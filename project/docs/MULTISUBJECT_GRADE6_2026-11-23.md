# Biên bản tích hợp môn Toán và Tiếng Anh thành ứng dụng luyện tập đa môn lớp 6

Ngày: 23/11/2026
Nguồn GitHub: `holaabu121-droid/gamehoctienganh`, nhánh gốc `review/english-only`, nhánh tích hợp `feature/grade6-multisubject`.

## Đã hợp nhất
- Tiếng Anh: giữ các chương trình Tiếng Anh 6 học kỳ 1/2, Unit 1–12 và Review 1–4.
- Toán: nhập bản Toán 6 Bài 1 "Tập hợp" v0.5.4 từ tệp người dùng đã kiểm duyệt, nguyên 50 câu (30 luyện tập, 20 vận dụng), hai kiến thức nền.
- Menu ứng dụng có hai môn và ba khóa; Toán có trang Bài 1 và Hồ sơ.
- Toán có kiểm tra ngẫu nhiên 6 luyện tập + 4 vận dụng/đề; chấm 100 điểm/câu, gợi ý sau sai lần 1, sai 2 lần 0 điểm nhưng tiếp tục hướng dẫn, tạm dừng đồng hồ khi đọc gợi ý.
- Tên hoạt động Toán mới `math6-bai1-v054-kn1` và `math6-bai1-v054-kn2`, mỗi đề tối đa 1000 điểm. Không kích hoạt lại ID Toán 6 cũ.

## Đồng bộ điểm và bảo vệ dữ liệu
- Phiên trong iframe Toán dùng khóa lưu cục bộ theo tên tài khoản (username); điểm hoàn thành báo qua postMessage same-origin. React kiểm tra nguồn iframe, origin, tài khoản, số điểm 10 câu, các khoảng điểm hợp lệ và tổng trước khi chuyển điểm đến FastAPI đã xác thực.
- Backend giữ điểm **cao nhất của cả đề** cho mỗi kiến thức nền. Không gửi score từng vị trí vào bảng thống kê vì câu ngẫu nhiên khác nhau giữa các lượt; điều này ngăn trộn nhiều lượt thành điểm cao giả.
- Đề đang làm dở và lịch sử câu chi tiết Toán chỉ được lưu cục bộ trên trình duyệt. Hồ sơ SQLite giữ điểm đề đã hoàn thành và có trong quy trình sao lưu/khôi phục chung.
- Không thực hiện thay đổi bảng SQLite hoặc xóa dữ liệu lịch sử; bản ZIP Release cũ được giữ.

## Hạn chế
- Toán mới tích hợp Bài 1, chưa có Bài 2 trở đi.
- Chưa đồng bộ bài Toán dở qua thiết bị; dữ liệu Toán chạy dạng iframe thay vì thay toàn bộ renderer bằng React.
- Chưa kiểm thử bằng tay trên thiết bị Android/Windows thật, chưa tạo bản cài, chưa triển khai.
- Chỉ làm việc trong nhánh tích hợp, chờ duyệt PR trước khi hợp nhất.

## Kiểm thử
- GitHub Actions chạy kiểm thử Node.js frontend và Python backend, validator catalog, TypeScript và Vite build cho nhánh tích hợp.
- Tính đúng của 50 câu nguồn đã kiểm thử riêng ở phiên bản v0.5.4 trước khi đưa vào.
