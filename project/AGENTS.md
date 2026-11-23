# English Quest – Hướng dẫn Codex

## Mục tiêu và ranh giới
Xây ứng dụng học tiếng Anh lớp 6 chạy cục bộ trên Windows: React + TypeScript + Vite, backend Python FastAPI, SQLite; KHÔNG dùng Streamlit. Không yêu cầu Internet để chơi sau khi tài nguyên đã chuẩn bị.

Chế độ hiện tại là `personal-family`: ứng dụng phục vụ việc học riêng trong gia đình. Ảnh bài học do người dùng cung cấp là nguồn chính cho đúng phần được yêu cầu; chỉ chép nội dung nhìn rõ, giữ cấu trúc, thứ tự và ví dụ của nguồn, đồng thời ghi provenance trong lesson JSON. Theo yêu cầu ngày 2026-11-06, mỗi trò chơi mặc định có đúng 10 câu gồm câu nguồn và câu AI mới đúng cùng dạng; nếu nội dung bắt buộc dài hơn thì chỉ chọn mốc 15 hoặc 20. Mỗi câu AI phải gắn `source_status: ai-generated`, không được trình bày như câu trong sách. Không nhúng/cắt ảnh trang sách vào ứng dụng; dùng chữ, emoji hoặc CSS để tạo hoạt động học.

Chế độ thương mại là phạm vi tương lai, tách biệt. Trước khi phát hành thương mại phải có quyền sử dụng phù hợp hoặc thay toàn bộ học liệu nguồn bằng nội dung nguyên bản được duyệt; không được mặc nhiên tái sử dụng lesson `personal-family`.

Dữ liệu gốc nằm trong `data/raw/` và luôn bất biến. Không tự coi học liệu chưa kiểm duyệt là nội dung SGK đã xác minh.

## Cách làm ít tốn token
- Chỉ đọc các tệp liên quan đến yêu cầu; không quét toàn bộ repo, logs, node_modules, dist, .venv hay MP3.
- Đọc `docs/PRODUCT.md` khi đổi phạm vi/UX; `docs/CONTENT_RULES.md` khi xử lý JSON/học liệu; `docs/STATE.md` khi tiếp tục hạng mục dở dang.
- Nhiệm vụ nhỏ: agent chính tự sửa và chạy kiểm thử đúng phạm vi. Nhiệm vụ vừa/lớn: gọi Builder. Gọi QA chỉ khi có rủi ro hồi quy, thay đổi tích hợp hoặc cần rà soát độc lập.
- Chỉ gọi Unit Analyst khi người dùng gửi ảnh Unit hoặc yêu cầu phân tích học liệu. Agent này chỉ tạo `Reference Analysis` và `Clean Unit Learning Brief`; không viết nội dung thương mại, không sửa `data/raw/`.
- Không tạo thêm agent khác, không chạy các agent phụ chỉ để phân tích lặp lại cùng một vấn đề. Ưu tiên giao việc tuần tự để tránh sửa đè file.

## Vòng lặp khép kín
1. Đọc `TASKS.md` và `CHECKPOINT.md`; kiểm tra Git nếu repo có `.git`. Không làm lại mục đã `DONE`.
2. Trước khi sửa mã, chuyển đúng một nhiệm vụ sang `IN_PROGRESS` và cập nhật bước kế tiếp trong `CHECKPOINT.md`.
3. Xác định đầu ra, tiêu chí kiểm chứng và các tệp dự kiến ảnh hưởng.
4. Thực hiện thay đổi tối thiểu; thêm/sửa test nếu thay đổi hành vi.
5. Chạy kiểm tra xác định (validator, typecheck, test liên quan), chỉ ghi nhận kết quả thật.
6. Nếu lỗi, sửa nguyên nhân gốc; tối đa 2 vòng sửa lại. Không vượt giới hạn nếu không có lý do rõ.
7. Với thay đổi lớn, gửi QA một diff/phạm vi hẹp. Nếu QA phát hiện lỗi quan trọng, Builder sửa và kiểm tra lại.
8. Sau mỗi nhiệm vụ, cập nhật `CHECKPOINT.md` với tệp đã sửa, lệnh kiểm thử và kết quả; chỉ chuyển `DONE` khi kiểm thử đạt.
9. Cập nhật `docs/STATE.md` tối đa 15 dòng có ích nếu có thay đổi trạng thái sản phẩm; báo cáo ngắn: tệp đã đổi, kiểm thử PASS/FAIL, lỗi còn tồn tại.

## Giao thức tiếp tục phiên và Automation
- Khi bắt đầu phiên mới, chạy kiểm tra chỉ đọc: vị trí dự án, `git status --short` nếu có Git, rồi đọc toàn bộ `TASKS.md` và `CHECKPOINT.md`.
- Nếu không có `.git`, ghi rõ `Git unavailable`; không tự khởi tạo Git, commit hoặc suy đoán tệp nào là thay đổi chưa commit.
- Tiếp tục mục `IN_PROGRESS` trước, sau đó mới lấy mục `TODO` đầu tiên. Nếu không còn `TODO`/`IN_PROGRESS`, không tạo công việc mới và kết thúc lượt Automation bằng báo cáo ngắn.
- Trước khi sửa, xác minh các tệp dự kiến chưa bị thay đổi ngoài checkpoint. Không ghi đè, hoàn nguyên, xóa hoặc định dạng hàng loạt những thay đổi chưa được xác minh.
- Nếu một phiên làm việc khác có dấu hiệu đang giữ mục `IN_PROGRESS` hoặc checkpoint vừa được cập nhật, không chạy trùng; chỉ đọc trạng thái và kết thúc.
- Automation không được mua credit, dùng lượt reset trả phí, gọi API trả phí riêng, tạo agent giám sát hạn mức hoặc tự mở rộng phạm vi.
- Sau mỗi bước có ý nghĩa, cập nhật checkpoint đủ để một phiên mới tiếp tục mà không cần lịch sử hội thoại.

## Lệnh kiểm thử chuẩn
- Dữ liệu: `python scripts/validate_source_data.py` (trên Windows có lỗi mã hóa console thì đặt `PYTHONUTF8=1`).
- Backend: `python -m unittest discover -s backend/tests -v`.
- Frontend test: chạy `npm test` trong `frontend/` khi `npm` có trong PATH; nếu không, dùng `node --test tests/*.test.mjs` với Node đã cấu hình.
- Frontend typecheck/build: chạy `npm run build` trong `frontend/`; tối thiểu phải chạy `tsc --noEmit` khi chỉ đổi TypeScript.
- Thay đổi chỉ liên quan Markdown/checkpoint: xác minh tệp tồn tại, trạng thái nhiệm vụ nhất quán và không có hơn một mục `IN_PROGRESS`; không cần chạy toàn bộ test ứng dụng.

## Quy tắc an toàn
- Không sửa `data/raw/`, không tự xóa dữ liệu, không truy cập đường dẫn ngoài repo, không tự commit/push, không dùng API/đăng ký trả phí nếu chưa được phép.
- Không tự tuyên bố UI hoạt động nếu chưa chạy và kiểm tra UI. Phải tách rõ 'đã code', 'đã test', 'chưa test'.
- Giữ âm thanh trong hàng đợi, không phát chồng; đáp án chọn nào cũng phát âm, đúng mới đọc câu hoàn chỉnh.
- Mỗi tiêu đề bài tập phải có nút `?` ngay cạnh. Panel trợ giúp phải nêu tiêu đề nguồn, lời giảng/gợi ý tiếng Việt, thao tác, điều kiện hoàn thành và phản hồi học sinh nhận được.
- Quy tắc tên Việt hai từ chỉ áp dụng cho nội dung thiết kế mới; nội dung theo nguồn giữ nguyên tên nhân vật trong nguồn.
- Mỗi câu chấm tối đa 100 điểm. Điểm phải giảm minh bạch theo thời gian, số lần dùng trợ giúp và số lần/chuỗi trả lời sai phù hợp từng dạng bài; câu chưa hoàn thành nhận 0. Tổng kết hiển thị điểm đạt được, điểm tối đa và phần trăm.
- Tiến độ phải gắn với tài khoản cục bộ: tên đăng nhập tối thiểu 6 ký tự, PIN chỉ gồm 4-6 chữ số, không lưu PIN dạng rõ. Lưu điểm hoạt động, phần trăm Unit, ngày học, chuỗi hiện tại và chuỗi tốt nhất.
