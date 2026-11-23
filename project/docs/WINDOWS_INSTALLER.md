# Đóng gói và cài English Quest trên Windows

## Tệp giao cho máy khác

Chỉ cần sao chép `release/EnglishQuest-Setup-<phiên-bản>.exe` sang máy Windows 64-bit và chạy tệp đó. Máy đích không cần cài Python, Node.js, pnpm hoặc sao chép `.pnpm-store`.

Ứng dụng được cài riêng cho tài khoản Windows hiện tại tại `%LOCALAPPDATA%\Programs\EnglishQuest`. Shortcut được tạo trong Start Menu và có tùy chọn tạo ngoài Desktop. Khi mở, ứng dụng chạy cục bộ tại `127.0.0.1` và mở bằng trình duyệt mặc định; không cần Internet để học.

## Dữ liệu học sinh và cập nhật

- Tài khoản, PIN đã băm và kết quả học được lưu tại `%LOCALAPPDATA%\EnglishQuest\data\english_quest.db`.
- Bộ cài không chứa database đang dùng trên máy đóng gói.
- Cài phiên bản mới bằng cùng `AppId` chỉ thay tệp chương trình, không ghi đè database.
- Gỡ ứng dụng cũng giữ database để tránh mất tiến độ. Muốn xóa hoàn toàn dữ liệu phải tự xóa thư mục `%LOCALAPPDATA%\EnglishQuest` sau khi đã sao lưu.
- Ứng dụng tự tạo bản sao SQLite trong thư mục `backups` trước mỗi lần nâng cấp schema và từ chối mở database có schema mới hơn phiên bản ứng dụng.
- Cách chuyển tiến độ được khuyến nghị: mở **Hồ sơ → Sao lưu an toàn → Tải tệp sao lưu**, lưu tệp JSON lên Google Drive/OneDrive/USB; ở máy mới đăng nhập tài khoản đích rồi chọn tệp để khôi phục. Tệp không chứa PIN hoặc token đăng nhập.
- Khôi phục dùng cơ chế gộp: giữ điểm tốt nhất hiện có, bổ sung câu hỏi/ngày học/Bonus/lịch sử còn thiếu và tự tạo snapshot trước khi nhập.
- Sao chép trực tiếp `english_quest.db` chỉ dành cho quản trị toàn bộ gia đình: phải đóng English Quest trên cả hai máy trước khi chép.

## Build bộ cài

Yêu cầu trên máy phát triển: Python 3.12/3.13 và pnpm. Nếu có Inno Setup 6/7, script dùng Inno; nếu không, PyInstaller tạo bộ cài tự chứa tương đương.

Phiên bản chính thức nằm duy nhất trong tệp `VERSION`; `frontend/package.json`, API và installer phải khớp tệp này.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_windows_installer.ps1
```

Script chạy test, build frontend, tạo môi trường `.packaging-venv`, đóng gói `EnglishQuest.exe` bằng PyInstaller `onedir`, tạo bộ cài một tệp và ghi SHA-256 trong `release/`.

## Git và phát hành ổn định

- Phát triển trên nhánh `main`; nhánh `stable/<major>.<minor>` chỉ trỏ tới bản đã qua đủ cổng kiểm thử.
- Mỗi bộ cài phát hành có tag dạng `v<major>.<minor>.<patch>`, ví dụ `v1.1.0`.
- `build/`, `release/`, môi trường Python/Node và database học sinh bị loại khỏi Git. Đưa installer lên GitHub Releases hoặc Drive cùng tệp SHA-256, không commit tệp nhị phân vào lịch sử nguồn.
- Khi tăng phiên bản: cập nhật `VERSION` và `frontend/package.json`, chạy script build; script từ chối đóng gói nếu hai phiên bản không khớp.

## Lưu ý phát hành

Bộ cài chưa được ký số nên Windows SmartScreen có thể hiện cảnh báo **Unknown publisher**. Chỉ phát hành tệp có SHA-256 khớp tệp `.sha256.txt`; nếu phát hành rộng rãi nên ký số bộ cài bằng chứng thư code-signing phù hợp.
