# Đánh giá Khoa học tự nhiên 6 theo ba vai trò

> Đây là đánh giá tự động trên **khóa học đã tích hợp**, dùng mô phỏng vai trò AI và kiểm tra mã nguồn. Không phải kiểm thử khả dụng trên thiết bị thật, học sinh thật, giáo viên thật hoặc chứng nhận chuyên gia.

## Kết luận điều hành

- Trạng thái kiểm thử dữ liệu: **PASS_WITH_RELEASE_BLOCKERS**.
- Gói dữ liệu: **READY**.
- Dùng trực tiếp trên lớp: **CONDITIONAL_NOT_READY**.
- Phát hành cho học sinh: **NOT_READY**.
- Quy mô: 55 bài, 330 game, 3300 câu, 9900 phản hồi chẩn đoán.
- Tải đọc: trung bình 42.2 từ/câu hỏi và 28.3 từ/phương án; 4202/13200 phương án dài trên 30 từ.
- Đa dạng: 3264 câu không trùng nguyên văn, 550 bối cảnh và 18 khuôn biểu diễn luân phiên sáu khuôn/bài.

## 1. Góc nhìn học sinh — 74/100

**Kết luận:** Đạt luồng dữ liệu; chưa đủ bằng chứng về trải nghiệm học sinh thật.

| Tiêu chí | Điểm | Bằng chứng |
| --- | ---: | --- |
| Luồng sai - nhận phản hồi - sửa đúng | 20/20 | 3300/3300 câu sửa đúng sau lượt sai. |
| Tiến trình từ dễ đến khó | 19/20 | Mọi game theo đúng 3 cơ bản - 4 thông hiểu - 2 vận dụng - 1 thử thách. |
| Phản hồi giúp tự sửa | 18/20 | 9900 phản hồi; mọi phản hồi nối về thẻ cần ôn. |
| Tải đọc và sự rõ ràng | 9/20 | Câu hỏi trung bình 42.2 từ; 4202/13200 phương án dài trên 30 từ. |
| Trực quan, thao tác và khả năng tiếp cận | 8/20 | Có renderer cho bài giảng, sáu khuôn biểu diễn và trò chơi; mô phỏng vẫn là specification-only và chưa kiểm thử hỗ trợ tiếp cận trên thiết bị thật. |

### Điểm tốt

- Học sinh luôn có thể thử sai, nhận nguyên nhân và quay về đúng thẻ kiến thức.
- Lộ trình khó tăng dần nhất quán, không đẩy câu thử thách lên đầu.
- Các hoạt động thực tế không gây áp lực điểm số.

### Vấn đề học sinh có thể gặp

- Nhiều câu và phương án dài, có nguy cơ gây mệt đọc cho học sinh lớp 6.
- Mười tám khuôn đã giảm lặp và renderer đã hiển thị chúng, nhưng chất lượng trải nghiệm chưa thể xác nhận khi chưa có kiểm thử người thật.
- Chưa thể đánh giá thao tác, âm thanh, hình ảnh, động lực, khả năng tiếp cận hay lưu tiến độ trên UI.

## 2. Góc nhìn giáo viên giảng dạy — 84/100

**Kết luận:** Tốt để làm ngân hàng học liệu tích hợp; cần duyệt chuyên môn và thí điểm có giám sát trước khi dùng trên lớp.

| Tiêu chí | Điểm | Bằng chứng |
| --- | ---: | --- |
| Độ phủ chương trình và nguồn | 20/20 | 55/55 bài, 10/10 chương và 55/55 bài có provenance trang nguồn. |
| Cấu trúc bài dạy và mục tiêu | 19/20 | 276 mục tiêu, 275 chặng và 550 thẻ; cấu trúc giáo viên 5/5. |
| Đánh giá và chẩn đoán | 18/20 | Sáu năng lực/bài, 9900 phản hồi và phân bố đáp án 825/770/825/880. |
| Phân hóa và đa dạng tư duy | 17/20 | 3264 câu không trùng nguyên văn và 18 khuôn biểu diễn được luân phiên sáu khuôn/bài. |
| Khả năng tổ chức dạy học thật | 10/20 | Có học liệu trực quan chạy trong ứng dụng, đặc tả mô phỏng và thực hành an toàn; chưa có mô phỏng tương tác, giáo án thời lượng hoặc quan sát lớp học thật. |

### Điểm tốt

- Bao phủ đủ bài, mục tiêu, kiến thức nền, sáu năng lực và phản hồi chẩn đoán.
- Có thể dùng dữ liệu để giao bài theo mức cơ bản, thông hiểu, vận dụng và thử thách.
- Quy tắc an toàn rõ và phù hợp yêu cầu chỉ thực hành khi được cho phép, hướng dẫn.

### Điều giáo viên còn thiếu

- Cần giáo viên Khoa học tự nhiên duyệt câu chữ, số liệu và độ chính xác từng bài trước phát hành.
- Chưa có kế hoạch thời lượng, hoạt động nhóm, câu hỏi mở và rubric cho sản phẩm học tập.
- Sáu khuôn có giao diện trực quan tĩnh, nhưng mô phỏng chưa tương tác nên chưa thay thế được thao tác khoa học trực quan.

## 3. Góc nhìn chuyên gia ứng dụng giáo dục — 74/100

**Kết luận:** Đạt mốc gói dữ liệu, chưa đạt mốc sản phẩm giáo dục sẵn sàng phát hành.

| Tiêu chí | Điểm | Bằng chứng |
| --- | ---: | --- |
| Tính nhất quán thiết kế học tập | 18/20 | Mục tiêu - thẻ - sáu năng lực - phản hồi - ôn lại được nối bằng ID nhất quán. |
| Giá trị và độ tin cậy đánh giá | 15/20 | Độ khó, căn cứ và đáp án được kiểm soát; 18 khuôn tăng độ đa dạng nhưng vẫn cần dữ liệu người học để xác lập độ tin cậy. |
| An toàn và đạo đức | 20/20 | Thực hành/mô phỏng đều 0 điểm; có giám sát, cảnh báo, việc được làm và việc cấm. |
| Khả dụng và tiếp cận | 7/20 | Đã có giao diện tích hợp và trạng thái tải/lỗi; chưa kiểm thử bàn phím, đọc màn hình, thiết bị nhỏ, thời lượng hoặc học sinh thật. |
| Sẵn sàng vận hành và đo lường | 14/20 | Đã nối catalog, renderer, tài khoản, tiến độ, điểm và hồ sơ; chưa có thí điểm người thật hoặc phân tích hiệu quả học tập. |

### Điểm tốt

- Kiến trúc học liệu có truy vết nguồn, ID ổn định và cổng kiểm thử tái lập.
- Phản hồi sai gắn với ngộ nhận và thẻ ôn, tốt hơn phản hồi đúng/sai đơn thuần.
- An toàn thực hành được thiết kế ngay trong dữ liệu và tách khỏi chấm điểm.

### Rủi ro và khoảng trống bằng chứng

- Chưa có bằng chứng hiệu quả học tập từ học sinh thật hoặc đánh giá nội dung từ giáo viên bộ môn thật.
- Chưa có dữ liệu về khả dụng, tiếp cận, tải nhận thức, độ tin cậy bài kiểm tra và công bằng.
- Tải đọc còn cao; 18 khuôn mới chưa có dữ liệu người học để chứng minh cải thiện trải nghiệm và giá trị đánh giá.
- Đã tích hợp tiến độ và hồ sơ điểm, nhưng chưa có dữ liệu người thật để phân tích hiệu quả học tập.

## Điều kiện chặn phát hành

- Mô phỏng tương tác chưa được hiện thực và giao diện chưa được kiểm thử trải nghiệm trên thiết bị thật.
- Chưa được giáo viên Khoa học tự nhiên duyệt toàn bộ nội dung từng bài.
- Chưa thí điểm với học sinh lớp 6 và chưa kiểm thử khả năng tiếp cận.

## Thứ tự nâng cấp đề xuất

1. Nâng sáu dạng biểu diễn tĩnh thành trực quan tương tác và hiện thực mô phỏng theo từng mạch kiến thức.
2. Rút gọn câu hỏi/phương án dài, chia nhỏ thông tin và kiểm thử tải đọc với học sinh lớp 6.
3. Tiếp tục mở rộng tình huống bên trong 18 khuôn và đo mức lặp bằng dữ liệu người học thay vì chỉ đếm câu khác chữ.
4. Tổ chức duyệt chuyên môn từng bài bởi giáo viên Khoa học tự nhiên, có biên bản sửa và ký duyệt.
5. Chạy E2E trên tài khoản tách biệt để xác minh catalog, tiến độ và hồ sơ điểm đã tích hợp.
6. Thí điểm người thật, đo hoàn thành, thời gian, lỗi, mức hiểu trước-sau và khả năng tiếp cận trước phát hành.
