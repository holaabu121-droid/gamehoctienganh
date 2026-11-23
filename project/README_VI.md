# Bộ khởi tạo Codex – English Quest

Mục đích: cấu hình 1 agent chính (Orchestrator) + 3 agent chuyên trách (Builder, QA và Unit Analyst), không dùng Streamlit. Cấu hình vẫn giới hạn tối đa 2 subagent chạy đồng thời.

## Cài vào dự án hiện có (Windows)

1. Sao lưu hoặc commit dự án của bạn trước khi thay đổi.
2. Giải nén bộ này. **Chỉ sao chép các tệp chưa tồn tại**; nếu dự án đã có `AGENTS.md`, `.codex/config.toml`, `.codex/agents/` hoặc `data/raw/`, hãy gộp thủ công, KHÔNG ghi đè.
3. Đặt các tệp dưới thư mục gốc Git của English Quest. Hai tệp JSON mẫu nằm ở `data/raw/` và phải giữ nguyên.
4. Mở Codex tại thư mục gốc dự án và dùng nội dung `prompts/01_SETUP_ONCE.md` một lần.
5. Với nhiệm vụ mới, điền `prompts/02_TASK_TEMPLATE.md`. Không cần dán lại toàn bộ đặc tả dự án.
6. Kiểm tra dữ liệu gốc cục bộ, không tốn lượt AI: `python scripts/validate_source_data.py`.
7. Hãy xác minh cấu hình đang được nạp và quyền thực thi trong ứng dụng Codex thực tế. Nếu cấu hình dự án chưa được tin cậy, xác nhận trust trong Codex.

## Nguyên tắc hoạt động
- Agent chính nhận yêu cầu, tự làm các thay đổi nhỏ; chỉ gọi Builder cho thay đổi mã lớn và QA cho rủi ro/phạm vi đáng kể.
- Chỉ gọi Unit Analyst khi người dùng gửi ảnh Unit hoặc yêu cầu phân tích học liệu. Agent tạo riêng `Reference Analysis` và `Clean Unit Learning Brief`, không viết nội dung thương mại trong cùng bước.
- Dùng test, lint, typecheck và script Python để kiểm tra trước khi gọi QA bằng AI.
- Giới hạn 2 lượt sửa sau khi có lỗi kiểm thử. Chưa đạt phải báo cáo nguyên nhân; không được báo thành công giả.
- Không tự ý cài phụ thuộc mới, dùng API tính phí, tải dữ liệu từ web hoặc xóa/chỉnh sửa dữ liệu gốc mà không được duyệt.
- Lưu ý: hướng dẫn 'QA không sửa file' là quy tắc prompt, không phải sandbox read-only độc lập. Quyền sandbox được điều khiển ở phiên cha.

## Chạy ứng dụng bằng nhấp đúp

- Nhấp đúp `START_ENGLISH_QUEST.bat` ở thư mục gốc để chạy backend, chạy giao diện và tự mở trình duyệt.
- Nhấp đúp `STOP_ENGLISH_QUEST.bat` để dừng đúng các tiến trình do launcher đã tạo.
- Launcher chỉ bind vào `127.0.0.1`; PID và log chẩn đoán được lưu tạm trong `.run/`.

## Cài trên máy Windows khác

- Chạy `release\EnglishQuest-Setup-1.1.0.exe`; máy đích không cần Python, Node.js, pnpm hoặc `.pnpm-store`.
- Ứng dụng cài cho tài khoản Windows hiện tại và tạo shortcut; dữ liệu học sinh nằm riêng tại `%LOCALAPPDATA%\EnglishQuest\data\english_quest.db`.
- Cài bản mới hoặc gỡ ứng dụng không xóa kết quả học. Xem quy trình build, cập nhật và chuyển dữ liệu tại `docs/WINDOWS_INSTALLER.md`.
- Trong **Hồ sơ**, dùng **Tải tệp sao lưu** để lưu tiến độ lên Google Drive và **Chọn tệp để khôi phục** trên máy mới; tệp sao lưu không chứa PIN.

## Các tệp quan trọng
- `AGENTS.md`: quy tắc Codex đọc tự động.
- `.codex/config.toml`: giới hạn 2 subagent đồng thời, không ép đổi model đăng nhập.
- `.codex/agents/builder.toml`, `qa.toml`: vai trò triển khai và kiểm thử.
- `.codex/agents/unit_analyst.toml`: phân tích ảnh Unit, đánh dấu phần thiếu/mờ và tạo hai đầu ra tách biệt; không sao chép cách thể hiện của sách vào brief sạch.
- `docs/PRODUCT.md`: phạm vi sản phẩm.
- `docs/CONTENT_RULES.md`: dữ liệu nguồn, lỗi đã biết, nguyên tắc bảo toàn.
- `docs/STATE.md`: bàn giao ngắn hạn theo nhiệm vụ, chỉ cập nhật khi thay đổi thực tế.
- `docs/TASK_TEMPLATE.md`: hợp đồng nhiệm vụ.
- `scripts/validate_source_data.py`: bộ kiểm tra JSON tiêu chuẩn thư viện Python.
- `data/raw/*`: dữ liệu gốc đã cung cấp; không ghi đè.

## Phát triển đa môn lớp 6 (nhánh feature/grade6-multisubject)

Ứng dụng nay có Tiếng Anh 6 (hai học kỳ, Units 1–12, Review 1–4) và Toán 6 (hiện chỉ Bài 1: Tập hợp, 50 câu). Sau khi đăng nhập, chọn môn/học kỳ trong Thư viện. Toán được tích hợp qua bộ bài tương tác v0.5.4; điểm đề hoàn thành lưu vào cùng hồ sơ, đề dở lưu trên trình duyệt theo người học. Chưa triển khai bản này thành bộ cài Windows; mọi đường dẫn nhắc đến bộ cài cũ chỉ mô tả lịch sử, không phản ánh chức năng đa môn mới. Xem `docs/MULTISUBJECT_GRADE6_2026-11-23.md`.
