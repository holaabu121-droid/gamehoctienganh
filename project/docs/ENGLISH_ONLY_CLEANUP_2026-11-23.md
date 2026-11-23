# Biên bản tách ứng dụng English Quest (23/11/2026)

## Nguồn và phạm vi
- Repository riêng tư: `holaabu121-droid/gamehoctienganh`, nhánh review: `review/english-only`.
- Nguồn: Release `v1.0.0`, file `gamehoctienganh.zip` 1.595.328.087 byte.
- SHA-256 của file gốc đã xác minh: `31ba4b5e769cc8fdef7c681a63507bc960ca3bb890b3dd5058b17a5d0711d617`.
- Đã trích 447 tệp ứng dụng (~31,8MB); không trích/xóa tệp SQLite người học, PIN, backups.
- Bản gốc trong Releases và nhánh `main` không bị ghi đè.

## Thay đổi mã nguồn
- Catalog chỉ còn hai khóa Tiếng Anh 6 học kỳ 1, 2.
- Frontend App và courseRegistry chỉ có hai renderer Tiếng Anh. Unit 1–12, Review 1–4 được giữ.
- Gỡ mã bài tập, học liệu và kiểm thử chuyên biệt của Toán, Khoa học tự nhiên, Ngữ văn và Tin học khỏi nhánh.
- Không xóa cơ sở dữ liệu của học sinh; backend giữ các định nghĩa điểm cũ trong `UNIT_ACTIVITY_MAXIMA` để bảo toàn lịch sử, nhưng từ chối truy cập branch ngoài catalog.
- Sửa nhãn màn hình đăng nhập/hồ sơ cho phạm vi riêng Tiếng Anh.
- Khôi phục `project/VERSION` và `project/packaging/installer.iss` để build và kiểm thử.
- 707 đường dẫn đã được loại ở commit dọn dẹp đầu tiên, bao gồm rất nhiều tệp trích xuất tạm trong `review_source/`, không phải 707 bài tập.

## Kiểm thử
- GitHub Actions: `45173061289` (trước chỉnh nhãn UI cuối).
- Frontend: 235/235 test PASS.
- Backend: 54/54 test PASS.
- Vite production build: 176 modules PASS.
- Kiểm tra danh mục khóa học chỉ Tiếng Anh: PASS.
- Chưa kiểm tra click-through thủ công trên Windows/Android và chưa tạo lại bộ cài Windows.

## Giới hạn và kế hoạch hợp nhất
- Nội dung trên nhánh review, chưa cập nhật nhánh `main`; chủ dự án kiểm tra PR trước khi hợp nhất.
- Cần chạy lại CI sau thay đổi nhãn UI.
- Không xóa bản Release ZIP gốc để có thể khôi phục các môn khi cần.
