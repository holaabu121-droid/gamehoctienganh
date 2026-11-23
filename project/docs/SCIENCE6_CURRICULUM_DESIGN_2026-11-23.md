# Khoa học tự nhiên 6 – Thiết kế dữ liệu nền và luyện tập (bản nháp v0.1)

**Nguồn:** `SGK KHTN 6 KNTT(1).pdf` do người dùng tải lên, 199 trang dạng ảnh. Mục lục ở trang PDF 5–7 (trang in 4–6).

**Trạng thái:** 55/55 bài có metadata, 110 thẻ kiến thức dự thảo, **220 câu mẫu** (110 luyện tập + 110 vận dụng). Đây là bản thiết kế để duyệt, chưa phải 2.750 câu đã hoàn thành và chưa dùng để ghi điểm chính thức.

## 1. Kiến trúc học

- Thư viện theo 10 chương và thứ tự Bài 1–55. Chưa tự chia học kỳ, vì tài liệu không xác định ranh giới.
- Mỗi bài có 2 thẻ kiến thức: thẻ 1 gồm ba khái niệm cốt lõi, thẻ 2 gồm tình huống áp dụng và lưu ý an toàn khi cần.
- Mỗi bài có 4 câu mẫu: 2 câu luyện tập (chọn một, ghép ba dòng) và 2 câu vận dụng theo tình huống. Mỗi câu có đáp án và gợi ý.
- Trạng thái tất cả câu hỏi và nội dung thẻ: **đang chờ rà soát sư phạm**. Bộ mô tả chỉ lấy thứ tự và tên bài từ sách; các câu mẫu do người thiết kế soạn riêng.

## 2. Thiết kế bộ đề chính thức sau duyệt

| Thuộc tính | Mục tiêu theo quy tắc Toán 6 |
|---|---|
| Ngân hàng cho mỗi bài | 50 câu: 30 luyện tập + 20 vận dụng |
| Mỗi đề | Rút ngẫu nhiên 6 luyện tập + 4 vận dụng không trùng |
| Điểm | 100 điểm/câu; 1.000 điểm/đề |
| Thời gian | 10 giây đầu miễn trừ; từ 20 giây trừ 10 điểm và mỗi 10 giây tiếp theo trừ thêm 10 |
| Sai lần đầu | Gợi ý và trừ 50 điểm một lần |
| Khi hiện gợi ý | Dừng đồng hồ tính điểm |
| Sai lần hai | 0 điểm, tiếp tục hướng dẫn đến khi trả lời đúng |
| Thiếu ô đáp án | Nhắc hoàn thiện, không tính sai |
| Lưu điểm | Lưu điểm cao nhất toàn đề, không ghép điểm theo vị trí trong các đề ngẫu nhiên |

**Khoảng trống:** mới có 4/50 câu mẫu mỗi bài. Cần phát triển và rà soát **46 câu/bài, tức 2.530 câu bổ sung**, không nên chỉ thay tên hoặc con số để giả tạo sự đa dạng.

## 3. Thiết kế tương tác theo chủ đề

| Chương | Kỹ năng | Dạng tương tác ưu tiên |
|---|---|---|
| I | An toàn, dụng cụ và phép đo | Nhận diện hình dụng cụ; đọc vạch; chọn quy trình an toàn |
| II–IV | Tính chất chất, chuyển thể, hỗn hợp | Phân loại, ghép hiện tượng và chọn phương pháp tách |
| V–VI | Tế bào, các cấp tổ chức cơ thể | Gắn nhãn sơ đồ; sắp xếp thứ tự; so sánh hình |
| VII | Phân loại, khóa lưỡng phân, các nhóm sinh vật | Chọn nhánh khóa; phân loại ảnh; so sánh dấu hiệu |
| VIII | Lực, lực kế, lò xo, ma sát | Mũi tên lực; đọc dụng cụ; nhập số ngắn |
| IX | Truyền, chuyển hóa và sử dụng năng lượng | Sắp xếp dòng năng lượng; phân tích tình huống |
| X | Mặt Trời, Mặt Trăng, Hệ Mặt Trời, Ngân Hà | Sắp xếp thứ tự; nhận diện hình pha; sơ đồ thiên thể |

Ưu tiên chọn đáp án, chọn nhiều, ghép cặp, sắp xếp, tương tác sơ đồ và nhập số ngắn. Không chấm câu tự luận dựa vào trùng khớp từng từ.

## 4. An toàn và bản quyền

- Bài thực hành hoặc mẫu vi sinh vật, hóa chất, nhiệt và nhiên liệu: chỉ đặt câu hỏi nhận biết, an toàn, quan sát. Không cung cấp quy trình tự nuôi cấy, thử chất hoặc thao tác nguy hiểm ngoài giám sát.
- Ảnh/sơ đồ trong ứng dụng nên tự vẽ hoặc sử dụng tài nguyên được cấp phép; không sao chép hàng loạt ảnh SGK vào app.
- Đối chiếu trực tiếp: tên bài, thứ tự, chương và trang in từ mục lục PDF. Nội dung thẻ và câu hỏi là **bản biên soạn suy ra từ chủ đề**, chưa được kiểm chứng từng câu trên toàn bộ trang sách.

## 5. Danh sách 55 bài

| Chương | Bài | Tên bài | Trang in | Bản mẫu |
|---:|---:|---|---:|---|
| 1 | 1 | Giới thiệu về Khoa học tự nhiên | 7 | 2 thẻ · 4 câu |
| 1 | 2 | An toàn trong phòng thực hành | 11 | 2 thẻ · 4 câu |
| 1 | 3 | Sử dụng kính lúp | 13 | 2 thẻ · 4 câu |
| 1 | 4 | Sử dụng kính hiển vi quang học | 15 | 2 thẻ · 4 câu |
| 1 | 5 | Đo chiều dài | 17 | 2 thẻ · 4 câu |
| 1 | 6 | Đo khối lượng | 20 | 2 thẻ · 4 câu |
| 1 | 7 | Đo thời gian | 22 | 2 thẻ · 4 câu |
| 1 | 8 | Đo nhiệt độ | 24 | 2 thẻ · 4 câu |
| 2 | 9 | Sự đa dạng của chất | 28 | 2 thẻ · 4 câu |
| 2 | 10 | Các thể của chất và sự chuyển thể | 30 | 2 thẻ · 4 câu |
| 2 | 11 | Oxygen. Không khí | 36 | 2 thẻ · 4 câu |
| 3 | 12 | Một số vật liệu | 42 | 2 thẻ · 4 câu |
| 3 | 13 | Một số nguyên liệu | 46 | 2 thẻ · 4 câu |
| 3 | 14 | Một số nhiên liệu | 50 | 2 thẻ · 4 câu |
| 3 | 15 | Một số lương thực, thực phẩm | 52 | 2 thẻ · 4 câu |
| 4 | 16 | Hỗn hợp các chất | 56 | 2 thẻ · 4 câu |
| 4 | 17 | Tách chất khỏi hỗn hợp | 60 | 2 thẻ · 4 câu |
| 5 | 18 | Tế bào – Đơn vị cơ bản của sự sống | 64 | 2 thẻ · 4 câu |
| 5 | 19 | Cấu tạo và chức năng các thành phần của tế bào | 67 | 2 thẻ · 4 câu |
| 5 | 20 | Sự lớn lên và sinh sản của tế bào | 70 | 2 thẻ · 4 câu |
| 5 | 21 | Thực hành: Quan sát và phân biệt một số loại tế bào | 73 | 2 thẻ · 4 câu |
| 6 | 22 | Cơ thể sinh vật | 75 | 2 thẻ · 4 câu |
| 6 | 23 | Tổ chức cơ thể đa bào | 79 | 2 thẻ · 4 câu |
| 6 | 24 | Thực hành: Quan sát và mô tả cơ thể đơn bào, cơ thể đa bào | 83 | 2 thẻ · 4 câu |
| 7 | 25 | Hệ thống phân loại sinh vật | 86 | 2 thẻ · 4 câu |
| 7 | 26 | Khóa lưỡng phân | 90 | 2 thẻ · 4 câu |
| 7 | 27 | Vi khuẩn | 92 | 2 thẻ · 4 câu |
| 7 | 28 | Thực hành: Làm sữa chua và quan sát vi khuẩn | 96 | 2 thẻ · 4 câu |
| 7 | 29 | Virus | 98 | 2 thẻ · 4 câu |
| 7 | 30 | Nguyên sinh vật | 102 | 2 thẻ · 4 câu |
| 7 | 31 | Thực hành: Quan sát nguyên sinh vật | 106 | 2 thẻ · 4 câu |
| 7 | 32 | Nấm | 108 | 2 thẻ · 4 câu |
| 7 | 33 | Thực hành: Quan sát các loại nấm | 112 | 2 thẻ · 4 câu |
| 7 | 34 | Thực vật | 115 | 2 thẻ · 4 câu |
| 7 | 35 | Thực hành: Quan sát và phân biệt một số nhóm thực vật | 123 | 2 thẻ · 4 câu |
| 7 | 36 | Động vật | 125 | 2 thẻ · 4 câu |
| 7 | 37 | Thực hành: Quan sát và nhận biết một số nhóm động vật ngoài thiên nhiên | 133 | 2 thẻ · 4 câu |
| 7 | 38 | Đa dạng sinh học | 135 | 2 thẻ · 4 câu |
| 7 | 39 | Tìm hiểu sinh vật ngoài thiên nhiên | 139 | 2 thẻ · 4 câu |
| 8 | 40 | Lực là gì? | 144 | 2 thẻ · 4 câu |
| 8 | 41 | Biểu diễn lực | 147 | 2 thẻ · 4 câu |
| 8 | 42 | Biến dạng của lò xo | 151 | 2 thẻ · 4 câu |
| 8 | 43 | Trọng lượng, lực hấp dẫn | 154 | 2 thẻ · 4 câu |
| 8 | 44 | Lực ma sát | 157 | 2 thẻ · 4 câu |
| 8 | 45 | Lực cản của nước | 160 | 2 thẻ · 4 câu |
| 9 | 46 | Năng lượng và sự truyền năng lượng | 162 | 2 thẻ · 4 câu |
| 9 | 47 | Một số dạng năng lượng | 165 | 2 thẻ · 4 câu |
| 9 | 48 | Sự chuyển hoá năng lượng | 168 | 2 thẻ · 4 câu |
| 9 | 49 | Năng lượng hao phí | 171 | 2 thẻ · 4 câu |
| 9 | 50 | Năng lượng tái tạo | 173 | 2 thẻ · 4 câu |
| 9 | 51 | Tiết kiệm năng lượng | 176 | 2 thẻ · 4 câu |
| 10 | 52 | Chuyển động nhìn thấy của Mặt Trời. Thiên thể | 179 | 2 thẻ · 4 câu |
| 10 | 53 | Mặt Trăng | 183 | 2 thẻ · 4 câu |
| 10 | 54 | Hệ Mặt Trời | 187 | 2 thẻ · 4 câu |
| 10 | 55 | Ngân Hà | 190 | 2 thẻ · 4 câu |

## 6. Dữ liệu và kiểm thử

- `project/data/curriculum/science6_full_year.json`: danh mục chuẩn 55 bài và nguồn trang.
- `project/frontend/public/science6/data/`: dữ liệu nội dung thẻ và câu hỏi mẫu, chia theo chương (chương VII có hai phần).
- `project/frontend/public/science6/lessonEngine.mjs`: kiểm tra dữ liệu, tạo bài học và kiểm đáp án chọn một/ghép ba ô.
- `project/frontend/public/science6/index.html` và `preview.mjs`: trang xem mẫu độc lập, không nối hệ thống ghi điểm.
- `project/frontend/tests/scienceDesign.test.mjs` và `science6.browser.mjs`: kiểm thử metadata, 220 câu và màn hình 390/800 px.

### Kiểm tra các lỗi đã từng gặp

1. Điền dòng thứ hai không làm đổi giá trị dòng thứ nhất.
2. Trả lời thiếu không bị chấm sai; câu có nhiều đáp án diễn đạt tương đương dùng lựa chọn hoặc chuẩn hóa.
3. Gợi ý phải dừng đồng hồ; sai hai lần vẫn cho tiếp tục học đến khi đúng (áp dụng khi bật chế độ tính điểm).
4. Không cộng trộn điểm từ vị trí câu hỏi ngẫu nhiên; đề đang làm không ghi đè bài khác.
5. Hiển thị biểu đồ/sơ đồ không tràn ngang trên điện thoại.

### Điều kiện đưa vào ứng dụng đa môn

Cần duyệt nguồn và nội dung từng bài, bổ sung ngân hàng đúng 30+20, vẽ sơ đồ khi cần, quyết định cách hiển thị theo học kỳ, sau đó kiểm thử lại. Chưa sửa catalog đăng ký môn chính thức, chưa ghi dữ liệu học sinh.
