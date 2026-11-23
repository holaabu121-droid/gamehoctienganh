# Đánh giá Ngữ văn 6 theo ba vai trò

> Đánh giá tự động trên mã nguồn và dữ liệu tích hợp, dùng mô phỏng vai trò AI. Không phải thử nghiệm học sinh thật, duyệt giáo viên thật hay chứng nhận chuyên gia. UI click-through, đọc màn hình và thẩm âm TTS chưa hoàn tất.

## Kết luận

- Trạng thái: **PASS_WITH_PILOT_REQUIREMENTS**.
- Quy mô: 10 bài + 2 ôn tập, 72 game, 720 câu, 2160 phản hồi chẩn đoán.
- Mô phỏng: 720/720 câu sửa đúng sau một lượt sai có chủ đích.
- Nguồn: 720/720 câu có nhãn AI; không sao chép đoạn tác phẩm dài vào dữ liệu.
- Phát hành rộng: **PILOT_REQUIRED**.

## 1. Học sinh mô phỏng — 88/100

**Kết luận:** Có thể học theo từng bài, nhận phản hồi và làm lại từng câu; cần thí điểm để đo tải đọc, hứng thú và độ tự nhiên của nhiệm vụ Văn.

| Tiêu chí | Điểm | Bằng chứng |
| --- | ---: | --- |
| Tiến trình và khả năng tự sửa | 20/20 | Mô phỏng 720/720 câu đi qua lượt sai–phản hồi–sửa đúng; lưu theo từng câu. |
| Phân hóa | 19/20 | Mỗi game theo 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách; câu khó không xuất hiện sớm. |
| Phản hồi và trợ giúp | 19/20 | 2160/2160 phản hồi có mã lỗi, lí do, cách sửa và thẻ ôn; mỗi game có bốn bước suy nghĩ. |
| Dễ hiểu và động lực | 15/20 | Câu hỏi trung bình 23.2 từ; sáu game khác mục tiêu nhưng vẫn chủ yếu chọn một đáp án. |
| Trực quan, quyền lựa chọn và riêng tư | 15/20 | Có tám họ sơ đồ, bản đồ từng phần, tình huống hư cấu và quyền không chia sẻ; chưa thử UI/TTS với học sinh thật. |

## 2. Giáo viên giảng dạy mô phỏng — 87/100

**Kết luận:** Đủ làm ngân hàng bổ trợ hai học kỳ; giáo viên vẫn cần duyệt ngữ liệu, điều phối thảo luận và phản hồi sản phẩm mở.

| Tiêu chí | Điểm | Bằng chứng |
| --- | ---: | --- |
| Độ phủ chương trình | 20/20 | Đủ 10 bài, 2 ôn tập và 61 bản mô tả phần Đọc–Tiếng Việt–Viết–Nói nghe/dự án. |
| Chiều sâu bài giảng | 17/20 | 144 thẻ, 72 hạt kiến thức và bản đồ trực quan; chưa thay thế giảng giải văn bản cụ thể của giáo viên. |
| Đánh giá và chẩn đoán | 19/20 | 72 game, 720 câu, 2.160 phản hồi; tách chấm khách quan khỏi rubric và không chấm cảm xúc. |
| Đa dạng nhiệm vụ | 15/20 | 720 cặp bối cảnh–câu hỏi; vẫn dùng chung engine lựa chọn cho phần chấm tự động. |
| Tổ chức dạy học | 16/20 | Có ý tưởng từng phần và rubric, nhưng chưa có bảng điều khiển lớp, phản hồi giáo viên trên bản nháp hay hoạt động nhóm trực tiếp. |

## 3. Chuyên gia ứng dụng giáo dục mô phỏng — 85/100

**Kết luận:** Sẵn sàng kỹ thuật cho thử nghiệm gia đình có giám sát; chưa đủ bằng chứng người thật để tuyên bố hiệu quả giáo dục hoặc phát hành rộng.

| Tiêu chí | Điểm | Bằng chứng |
| --- | ---: | --- |
| Nhất quán thiết kế | 19/20 | Mục tiêu–thẻ–sáu năng lực–phản hồi–activity ID–hồ sơ điểm nối nhất quán qua 12 nhánh. |
| Giá trị đánh giá | 15/20 | Có độ khó và chẩn đoán nhưng chưa có dữ liệu độ khó, độ phân biệt, độ tin cậy hoặc chấm liên giám khảo người thật. |
| Bản quyền, an toàn và đạo đức | 20/20 | 720 câu đều gắn AI; không chép dài tác phẩm, không chấm quan điểm/cảm xúc, có lựa chọn hư cấu và bảo vệ riêng tư. |
| Khả dụng và tiếp cận | 14/20 | Có responsive, aria, sơ đồ CSS, nghe văn bản và làm lại từng câu; chưa click-through, thử đọc màn hình hoặc thẩm âm TTS. |
| Sẵn sàng vận hành | 17/20 | Hai khóa available, 6+6 nhánh, điểm riêng học kỳ/tổng môn/tổng tất cả môn và build đạt; còn thiếu thí điểm và duyệt giáo viên thật. |

## Điểm mạnh

- Bao phủ đủ hai học kỳ và hiển thị ý tưởng từng phần trước khi luyện.
- Mọi đáp án sai có phản hồi chẩn đoán; câu mở dùng rubric, không áp một đáp án văn mẫu.
- Nội dung mới có provenance rõ, không chép dài tác phẩm và có rào chắn riêng tư.

## Hạn chế cần nói rõ

- Chưa có học sinh lớp 6 thật kiểm thử có quan sát và đồng ý.
- Chưa có giáo viên Ngữ văn thật duyệt toàn bộ câu hỏi, cách diễn đạt và rubric.
- Chưa click-through bản cài, thẩm âm TTS hoặc kiểm thử đọc màn hình trên thiết bị thật.
- Chưa có dữ liệu hiệu quả trước–sau, độ tin cậy điểm hoặc độ nhất quán chấm rubric.

## Thứ tự nâng cấp

1. Thí điểm Bài 1, 4, 8, 9 và 10 với học sinh thật.
2. Giáo viên duyệt từng bài, đặc biệt thuật ngữ, phản hồi sai và rubric.
3. Thêm tương tác kéo–thả, tô bằng chứng, sắp xếp và trình biên tập thay cho một phần câu chọn.
4. Bổ sung lưu bản nháp cục bộ và phản hồi giáo viên/phụ huynh cho Viết–Nói nghe.
5. Chạy accessibility audit, click-through bộ cài và TTS trên máy gia đình.
