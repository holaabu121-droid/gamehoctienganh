Tôi đang mở repo cục bộ English Quest trên Windows. Hãy thiết lập workflow Codex ít tốn credit theo AGENTS.md và .codex/agents đã có trong repo.

1) Kiểm tra và tóm tắt rất ngắn cấu trúc hiện tại (không đọc node_modules, .venv, dist, logs, MP3).
2) Kiểm tra các file cấu hình agent có được nhận diện; KHÔNG ghi đè config/agent hiện có mà chưa so sánh.
3) Chạy python scripts/validate_source_data.py để hiểu tình trạng 2 JSON nguồn.
4) Đề xuất 3 nhiệm vụ nhỏ đầu tiên tạo app cục bộ React + FastAPI + SQLite; mỗi nhiệm vụ phải có tiêu chí kiểm thử.
5) CHƯA triển khai toàn bộ app trong một lượt; chỉ thiết lập và báo kết quả thực tế.
6) Ưu tiên thực thi trực tiếp thay vì phân tích lặp đi lặp lại. Không tự gọi subagent cho bước thiết lập đơn giản.
