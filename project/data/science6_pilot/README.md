# Gói nội dung Khoa học tự nhiên 6

Gói dữ liệu 55 bài này đã được nối vào ứng dụng chính thành hai khóa Khoa học tự nhiên 6 học kỳ 1 và học kỳ 2. Catalog, giao diện bài học và kế hoạch lưu điểm đều đã đăng ký; nội dung Tiếng Anh, Toán, Ngữ văn và Tin học vẫn giữ nguyên.

## Phạm vi khởi đầu và phạm vi hoàn chỉnh

- Bài 2: An toàn trong phòng thực hành.
- Bài 8: Đo nhiệt độ.
- Bài 17: Tách chất khỏi hỗn hợp.
- Bài 21: Quan sát và phân biệt một số loại tế bào.
- Bài 26: Khóa lưỡng phân.
- Bài 42: Biến dạng của lò xo.
- Bài 48: Sự chuyển hóa năng lượng.
- Bài 53: Mặt Trăng.

Từ tám bài khởi đầu trên, gói đã được mở rộng và kiểm tra cấu trúc đủ Bài 1–55.

Mỗi bài có 5 chặng/10 thẻ bài giảng và 6 trò chơi năng lực x 10 câu. Mỗi trò chơi theo thứ tự 3 câu cơ bản, 4 câu thông hiểu, 2 câu vận dụng và 1 câu thử thách. Sáu trò của mỗi bài lấy sáu khuôn khác nhau từ ngân hàng 18 khuôn và luân phiên theo bài. Câu luyện là nội dung diễn đạt mới có nhãn `ai-generated`; không nhúng ảnh sách.

Mỗi câu AI có `grounding` trỏ về đúng thẻ kiến thức, trang nguồn và các vật liệu đã duyệt gồm khái niệm, bối cảnh, sự kiện, căn cứ, quy trình và kết quả. Cổng dữ liệu không cho phép khai báo khẳng định bên ngoài các vật liệu này; phương án sai phải được ghi rõ là nhiễu cố ý. Cổng tự động kiểm soát truy vết, không thay thế vòng duyệt chính xác khoa học của giáo viên bộ môn.

## An toàn và điểm số

`practical_application` chỉ mô tả ứng dụng an toàn và luôn có `scored: false`. Hoạt động có rủi ro phải nêu người giám sát, cảnh báo, việc được phép và việc cấm. Mô phỏng mới ở mức đặc tả, cũng không chấm điểm.

## Tạo và kiểm tra dữ liệu

```powershell
node scripts/build_science6_pilot.mjs
node scripts/validate_science6_pilot.mjs
node --test scripts/tests/science6_pilot.test.mjs
node scripts/evaluate_science6_pilot.mjs
```

Renderer của ứng dụng chỉ chấm sáu trò chơi năng lực. Mô phỏng và ứng dụng thực tế tiếp tục hiển thị như hoạt động hướng dẫn, không tham gia điểm số.
