# Rà soát trực quan “Quy tắc và quy trình” — Toán 6

Ngày rà soát: 2026-11-18  
Phạm vi: Toán 6 Học kỳ 1–2, 43 bài chính và 31 phần luyện tập, ôn tập, trải nghiệm.  
Trạng thái: bản thiết kế nội dung và tương tác; chưa sửa renderer, đáp án, điểm hoặc tiến độ.

## 1. Kết luận hiện trạng

- Ứng dụng đang dùng 13 chế độ mô hình chung để phủ 74 phần học. Chỉ Bài 6, Bài 23 và Bài 40 có trực quan được biên soạn riêng.
- Các bài còn lại được phân loại chủ yếu bằng từ khóa trong tiêu đề và lời dẫn. Cách này tạo ra các ghép sai rõ ràng: Bài 3 dùng mô hình tập hợp; Bài 10 dùng trục số; Bài 15–17 đều dùng cùng trục số dù quy trình toán học khác nhau.
- Hai thanh “Dữ kiện A/B” không mang tên đại lượng của bài. Học sinh có thể thấy hình thay đổi nhưng không biết thao tác đó minh họa quy tắc nào.
- Hình hiện nằm trước toàn bộ bài học, trong khi yêu cầu sư phạm là đặt hình ngay trong khối “Quy tắc và quy trình”, gắn từng hình với đúng câu quy tắc.
- Các phần luyện tập/ôn tập có nhiều mạch kiến thức nhưng đang bị ép vào một mô hình cố định. Chúng cần bộ chọn trực quan theo dạng câu.

## 2. Nguyên tắc thiết kế thay thế

1. Mỗi bài có `visualKey` riêng; không suy đoán hình bằng từ khóa ở thời gian chạy.
2. Mỗi quy tắc có một quan hệ nhìn thấy được: đối tượng → thao tác → kết quả → cách tự kiểm tra.
3. Điều khiển phải mang tên toán học thật như “tử số”, “số bị chia”, “góc”, không dùng “Dữ kiện A/B”.
4. Hình dùng SVG/HTML rõ nét, hỗ trợ bàn phím, có mô tả thay thế; màu chỉ hỗ trợ chứ không phải tín hiệu duy nhất.
5. Khi học sinh thay đổi số liệu, lời giải thích, phép tính và hình phải cập nhật đồng thời.
6. Mỗi mô hình có nút “Đặt lại”, một câu tự kiểm tra và một lỗi thường gặp được minh họa trực tiếp.
7. Khối quy tắc chỉ nên có 1–2 mô hình trọng tâm; không biến thành phòng tranh dài làm gián đoạn bài học.

## 3. Học kỳ 1 — thiết kế riêng từng bài

| Bài | Quy tắc cần làm rõ | Trực quan đề xuất | Tương tác và tự kiểm tra |
|---|---|---|---|
| 1. Tập hợp | Phần tử thuộc/không thuộc; liệt kê và nêu dấu hiệu | Hai vòng tập hợp chứa thẻ đồ vật/số; cùng một tập được đổi giữa vòng bao, ngoặc nhọn và câu mô tả | Kéo thẻ vào/ra; hệ thống đánh dấu `∈/∉`; bật “thiếu, thừa, lặp” để học sinh sửa |
| 2. Cách ghi số tự nhiên | Mỗi lớp ba hàng; giá trị chữ số theo vị trí; số là tổng các giá trị | Bảng lớp triệu–nghìn–đơn vị, mỗi lớp có trăm–chục–đơn vị; màu nối chữ số trong `7 110 385` với dạng khai triển; thẻ La Mã riêng | Chạm một chữ số để hiện `7 × 1 000 000`; kéo vạch tách lớp; đổi số; kiểm tra đọc số và dạng khai triển |
| 3. Thứ tự trong tập hợp số tự nhiên | So sánh; liền trước/liền sau; tính bắc cầu; `≤/≥` | Tia số có các điểm kéo được, kính phóng đại cho số lớn và dải khoảng biểu diễn điều kiện | Kéo ba điểm a, b, c; điền dấu; bật mũi tên bắc cầu; tìm hai điểm kề n và n+1 |
| 4. Phép cộng và phép trừ số tự nhiên | Thành phần; tính chất cộng; trừ là phép ngược | Sơ đồ phần–phần–toàn thể kết hợp bước nhảy trên tia số; các khối màu đổi chỗ để thấy giao hoán | Đổi số hạng, kéo nhóm; ẩn một thành phần để tìm số chưa biết; kiểm tra bằng phép ngược |
| 5. Phép nhân và phép chia số tự nhiên | Nhóm bằng nhau; chia hết/chia có dư; `a=bq+r` | Mảng chấm theo hàng×cột và khay chia đều; phần dư nằm ngoài các khay | Chọn số vật và số nhóm; quan sát q, r; hệ thống chỉ cho hợp lệ khi `0 ≤ r < b` |
| 6. Lũy thừa với số mũ tự nhiên | Cơ số, số mũ; nhân/chia cùng cơ số | Giữ mô hình riêng hiện có: thẻ thừa số lặp; ghép/tách hai nhóm cùng cơ số | Kéo cơ số/số mũ; ghép nhóm để cộng số mũ, tách nhóm để trừ; thêm cảnh báo không nhân cơ số với số mũ |
| 7. Thứ tự thực hiện phép tính | Ngoặc → lũy thừa → nhân/chia → cộng/trừ | Cây biểu thức và “đèn bước” tô đúng phép tính được thực hiện ở mỗi lượt | Học sinh chọn nút phép tính tiếp theo; chọn sai thì cây chỉ ra quy tắc ưu tiên bị vi phạm |
| 8. Quan hệ chia hết và tính chất | `a|b`; tổng/hiệu bảo toàn chia hết trong điều kiện phù hợp | Các khay nhóm bằng nhau hiển thị số dư; hai thanh a, b được ghép thành tổng hoặc cắt thành hiệu | Thay môđun m; xem dư của a, b, a±b; học sinh dự đoán trước khi ghép |
| 9. Dấu hiệu chia hết | Tận cùng cho 2,5; tổng chữ số cho 3,9 | Dãy thẻ chữ số, ô cuối phóng to và “máy cộng chữ số” chạy sang bên cạnh | Sửa từng chữ số; các huy hiệu 2/3/5/9 bật tắt kèm căn cứ, không chỉ báo đúng/sai |
| 10. Số nguyên tố | Hai ước; hợp số; phân tích thừa số nguyên tố | Sàng Eratosthenes 1–100 kết hợp cây thừa số | Chọn một số để xem các ước; gạch bội theo từng số nguyên tố; kéo nhánh cây đến toàn số nguyên tố |
| 11. Ước chung, UCLN | Thừa số chung với số mũ nhỏ nhất; chia nhóm lớn nhất | Sơ đồ Venn chứa thẻ thừa số nguyên tố và mô hình chia quà thành các nhóm giống nhau | Đổi hai số; kéo thừa số chung vào vùng giao; số nhóm/quà mỗi nhóm cập nhật đồng thời |
| 12. Bội chung, BCNN | Mọi thừa số với số mũ lớn nhất; chu kì gặp lại | Hai đường thời gian có đèn nháy theo chu kì, dưới là bảng thừa số nguyên tố | Chạy/dừng thời gian; đánh dấu lần trùng đầu; so sánh trực tiếp với UCLN để tránh chọn nhầm |
| 13. Tập hợp các số nguyên | Số âm, số đối, giá trị tuyệt đối, thứ tự | Trục số ngang kết hợp nhiệt kế dọc; cặp điểm đối xứng qua 0 | Kéo điểm; bật điểm đối; đo khoảng cách đến 0; chuyển tình huống nhiệt độ sang vị trí trên trục |
| 14. Cộng và trừ số nguyên | Cùng dấu, khác dấu; trừ thành cộng số đối | Hai mô hình đồng bộ: bước đi có hướng trên trục số và thẻ `+/-` triệt tiêu thành cặp 0 | Chọn phép tính; xem đổi `a-b` thành `a+(-b)`; so sánh kết quả của hai mô hình |
| 15. Quy tắc dấu ngoặc | Dấu `+` giữ dấu; dấu `−` đổi mọi dấu; nhóm số hạng | “Cổng dấu ngoặc”: các thẻ số hạng đi qua cổng cộng hoặc trừ và đổi màu/dấu | Kéo dấu ngoặc qua cổng; học sinh xác nhận từng dấu sau khi bỏ ngoặc; ghép cặp số đối bằng 0 |
| 16. Phép nhân số nguyên | Dấu tích theo số thừa số âm; tính chất nhân | Bảng mẫu tích tăng/giảm để suy ra dấu và dải thẻ đếm số thừa số âm | Thêm/bớt thừa số âm; nền kết quả đổi theo chẵn/lẻ; bắt buộc dự đoán dấu trước khi tính độ lớn |
| 17. Chia hết, ước và bội số nguyên | Quy tắc dấu thương; ước nguyên xuất hiện theo cặp `±` | Bảng bốn trường hợp dấu và vòng cặp ước `−d, d` quanh số | Chọn số nguyên; các cặp ước sáng đồng thời; thử nhân ngược để xác nhận thương và ước |
| 18. Tam giác đều, hình vuông, lục giác đều | Cạnh/góc bằng nhau; đường chéo | Ba hình đúng tỉ lệ đặt cạnh nhau, có dấu gạch cạnh, cung góc và đường chéo bật/tắt | Chọn thuộc tính để tô trên cả ba hình; kéo đỉnh trong chế độ “sai” để thấy tính đều bị phá vỡ |
| 19. Chữ nhật, thoi, bình hành, thang cân | So sánh cạnh, góc, song song và đường chéo | Bốn tứ giác trên cùng hệ nhãn; bảng thuộc tính liên kết với hình | Bật một thuộc tính để lọc hình thỏa mãn; kéo đỉnh trong giới hạn để thấy thuộc tính bất biến |
| 20. Chu vi và diện tích tứ giác | Biên khác mặt; công thức theo từng hình | Gạch sáng đường biên cho chu vi, lát ô vuông cho diện tích; cắt–ghép bình hành và hình thoi | Đổi kích thước; xem đơn vị cm và cm²; yêu cầu chọn “đo biên” hay “đo mặt” trước khi tính |
| 21. Hình có trục đối xứng | Hai nửa trùng nhau khi gấp | Tấm lưới có đường gấp kéo được và lớp ảnh bán trong suốt | Kéo trục, bấm “gấp”; chỉ công nhận khi mọi điểm và ảnh cách trục bằng nhau |
| 22. Hình có tâm đối xứng | Hình trùng sau quay 180° | Bàn quay có tâm O, điểm và ảnh nối qua O | Kéo tâm rồi quay 180°; kiểm tra O là trung điểm của từng đoạn nối cặp điểm |

## 4. Học kỳ 2 — thiết kế riêng từng bài

| Bài | Quy tắc cần làm rõ | Trực quan đề xuất | Tương tác và tự kiểm tra |
|---|---|---|---|
| 23. Mở rộng phân số, phân số bằng nhau | Mẫu khác 0; dấu âm; nhân/chia cả tử và mẫu | Giữ thanh phân số và trục số hiện có; bổ sung thẻ điều kiện mẫu và lớp dấu âm | Đổi tử/mẫu/hệ số; khóa mẫu 0; tích chéo hai phân số; kiểm tra phần tô không đổi |
| 24. So sánh phân số, hỗn số dương | Quy đồng; so sánh; đổi hỗn số | Hai thanh phân số cùng độ dài, trục số và khối “phần nguyên + phần lẻ” | Chọn mẫu chung; chia lại thanh; kéo hỗn số lên trục rồi đổi sang phân số lớn hơn 1 |
| 25. Cộng và trừ phân số | Cùng mẫu sau quy đồng; giữ mẫu chung | Hai thanh phần được ghép hoặc lấy bớt; vạch chia tự chuyển về mẫu chung | Học sinh chọn mẫu chung trước; hệ thống không cho cộng trực tiếp hai mẫu khác nhau |
| 26. Nhân và chia phân số | Diện tích giao nhau; chia là nhân nghịch đảo | Lưới diện tích hai chiều cho phép nhân; thẻ phân số thứ hai lật 180° khi chuyển phép chia | Tô hàng/cột để thấy tích; bấm “nghịch đảo” rồi rút gọn chéo trước khi nhân |
| 27. Hai bài toán về phân số | Tìm phần của một số và tìm toàn thể | Sơ đồ đoạn thẳng kép: một thanh toàn thể chia phần và một thanh giá trị đã biết | Chọn ẩn là “phần” hoặc “toàn thể”; kéo nhãn dữ kiện đúng vị trí rồi mới hiện phép tính |
| 28. Số thập phân | Hàng thập phân; so sánh; liên hệ phân số thập phân | Bảng giá trị hàng qua dấu phẩy, lưới 10×10 và trục số phóng đại | Kéo chữ số qua dấu phẩy; tô lưới; đặt hai số trên trục để kiểm tra so sánh |
| 29. Tính toán với số thập phân | Thẳng cột dấu phẩy; bốn phép tính | Bảng tính cột có đường dọc qua dấu phẩy; mô hình diện tích cho phép nhân và sơ đồ nhóm cho phép chia | Kéo các số vào đúng hàng; cảnh báo nếu dấu phẩy lệch; ước lượng trước rồi tính chính xác |
| 30. Làm tròn và ước lượng | Chọn hàng làm tròn; so với mốc giữa | Trục số phóng đại giữa hai bội liên tiếp, có mốc giữa và hai vùng gần | Chọn độ chính xác; kéo số; dự đoán hướng làm tròn; so sánh kết quả ước lượng với tính thật |
| 31. Tỉ số và tỉ số phần trăm | Phần/toàn thể; đổi về 100; tăng giảm phần trăm | Lưới 100 ô, thanh tỉ lệ kép và sơ đồ “giá gốc → thay đổi → giá mới” | Đổi phần và toàn thể; xem đồng thời phân số–thập phân–%; bật mũi tên tăng/giảm để tránh cộng sai cơ sở |
| 32. Điểm và đường thẳng | Thuộc/không thuộc; cắt, song song, trùng | Mặt phẳng động có điểm và hai đường thẳng, kèm kí hiệu quan hệ | Kéo điểm/đường; hệ thống cập nhật `A∈d`, giao điểm hoặc song song; chế độ chồng hai đường để thấy trùng nhau |
| 33. Điểm nằm giữa, tia | Thứ tự ba điểm; gốc và hướng tia; tia đối/trùng | Dòng thẳng có ba điểm kéo được và các mũi tên tia xuất phát từ cùng gốc | Đổi thứ tự điểm; chọn gốc/hướng; chồng hai tia để xác định đối nhau hay trùng nhau |
| 34. Đoạn thẳng, độ dài | Đầu mút; đo từ vạch 0; cộng đoạn thẳng | Thước có thể đặt sai/đúng vạch 0 và đoạn AB có điểm C nằm giữa | Kéo thước; đọc độ dài; thay vị trí C để kiểm tra `AC+CB=AB` chỉ khi C nằm giữa |
| 35. Trung điểm đoạn thẳng | Nằm giữa và hai đoạn bằng nhau | Đoạn AB có thanh cân bằng tại M, dấu gạch bằng nhau và phép gấp | Kéo M; chỉ bật “trung điểm” khi đồng thời thỏa nằm giữa và `MA=MB` |
| 36. Góc | Đỉnh, hai cạnh, miền trong; góc bẹt | Hai tia bản lề quay quanh đỉnh, miền trong được tô mờ | Kéo tia; chọn điểm trong/ngoài; đổi tên góc nhưng giữ đỉnh ở giữa tên ba chữ cái |
| 37. Số đo góc | Đặt tâm và vạch 0 của thước; phân loại góc | Thước đo góc trong suốt phủ lên góc, có vùng nhọn–vuông–tù–bẹt | Kéo/xoay thước; đọc đúng thang; cảnh báo khi tâm hoặc vạch 0 đặt sai |
| 38. Dữ liệu và thu thập dữ liệu | Dữ liệu định tính/định lượng; chọn cách thu thập | Luồng “câu hỏi → đối tượng → phương pháp → dữ liệu thô → kiểm tra” với các thẻ dữ liệu | Kéo thẻ vào đúng loại và phương pháp; phát hiện dữ liệu thiếu, trùng hoặc không liên quan |
| 39. Bảng thống kê và biểu đồ tranh | Đếm, tần số; chú giải mỗi hình | Dữ liệu thô chuyển qua vạch kiểm đếm thành bảng và biểu đồ tranh | Thay chú giải `1 hình = n`; số hình và nửa hình cập nhật; tổng từ ba biểu diễn phải khớp |
| 40. Biểu đồ cột | Trục, đơn vị, thang đo; đọc và vẽ cột | Giữ phòng thí nghiệm biểu đồ cột hiện có; bổ sung trường hợp thang đo sai | Kéo giá trị cột; dự đoán tổng/chênh lệch; sửa một biểu đồ thiếu nhãn hoặc dùng khoảng chia không đều |
| 41. Biểu đồ cột kép | Hai dãy dữ liệu, chú giải, so sánh theo cặp | Mỗi nhóm có hai cột màu/kí hiệu khác nhau, nối với bảng hai hàng | Bật/tắt từng dãy; chọn cùng một nhóm trước khi lấy hiệu; kiểm tra chú giải và thang đo chung |
| 42. Kết quả có thể và sự kiện | Không gian kết quả; chắc chắn/có thể/không thể | Cây kết quả hoặc lưới kết quả của đồng xu/xúc xắc, có bộ lọc sự kiện | Chạy một phép thử; chọn tập kết quả của sự kiện; phân loại dựa trên tập rỗng/toàn bộ/một phần |
| 43. Xác suất thực nghiệm | Số lần sự kiện/tổng số lần thử | Mô phỏng xu/xúc xắc, dải lịch sử và đồ thị tỉ lệ chạy theo số lần thử | Chọn 10–500 lần thử; xem phân số cập nhật; so sánh hai đợt thử và không khẳng định chắc chắn từ mẫu nhỏ |

## 5. Thiết kế cho 31 phần luyện tập, ôn tập và trải nghiệm

Các phần này không nên có một `visualKey` cố định. Mỗi câu cần khai báo `representationKey`; giao diện chọn mô hình tương ứng từ các bài đã học.

| Nhóm phần | Trực quan phù hợp |
|---|---|
| Luyện tập/ôn tập Chương I | Bộ chọn: tập hợp, bảng giá trị hàng, tia số, sơ đồ phép tính, mảng chia, lũy thừa, cây biểu thức |
| Luyện tập/ôn tập Chương II | Máy dấu hiệu chia hết, cây thừa số, Venn UCLN và đường thời gian BCNN |
| Luyện tập/ôn tập Chương III | Trục số, thẻ triệt tiêu, cổng dấu ngoặc, bảng dấu nhân/chia và cặp ước `±` |
| Luyện tập/ôn tập Chương IV–V | Bảng thuộc tính hình, lát diện tích, đo biên, bàn gấp và bàn quay 180° |
| Luyện tập/ôn tập Chương VI–VII | Thanh phân số, trục số, bảng dấu phẩy, trục làm tròn và lưới phần trăm |
| Luyện tập/ôn tập Chương VIII | Mặt phẳng điểm–đường, tia, thước đo đoạn, trung điểm, bản lề góc và thước đo góc |
| Luyện tập/ôn tập Chương IX | Dữ liệu thô–bảng–biểu đồ, cây kết quả và mô phỏng xác suất thực nghiệm |
| Thiệp và phòng học | Lưới thiết kế có kích thước, bảng vật liệu, trục đối xứng và bộ tính chu vi/diện tích |
| GeoGebra | Mô phỏng thanh công cụ theo bước: chọn công cụ → chọn đối tượng → kiểm tra thuộc tính; không giả vờ điều khiển phần mềm thật |
| Máy tính cầm tay | Bàn phím và màn hình mô phỏng, chuỗi phím theo thứ tự, bước ước lượng để phát hiện nhập sai |
| Kế hoạch chi tiêu | Bảng thu–chi, thanh ngân sách xếp chồng và cảnh báo tổng chi vượt thu |
| Khảo sát thể thao | Quy trình khảo sát → bảng tần số → biểu đồ cột, kèm kiểm tra tổng số người trả lời |
| Ôn tập cuối năm | Bản đồ quyết định theo câu hỏi: số → hình → dữ liệu → xác suất; sau khi chọn mạch mới mở mô hình tương ứng |

## 6. Thứ tự triển khai đề nghị

1. **Ưu tiên 1 — sửa ghép sai:** Bài 2, 3, 10, 15, 16, 17 và các ôn tập Chương II.
2. **Ưu tiên 2 — quy trình dễ nhầm:** Bài 7, 9, 11, 12, 14, 25–31, 34–37.
3. **Ưu tiên 3 — hình thành biểu tượng:** Bài 18–22, 32–33, 38–43.
4. **Ưu tiên 4 — hợp nhất phần tổng hợp:** thêm `representationKey` cho 31 nhánh luyện tập/ôn tập/trải nghiệm.
5. Giữ và mở rộng ba mô hình riêng đã tốt ở Bài 6, 23 và 40; không viết lại từ đầu.

## 7. Tiêu chí nghiệm thu khi bắt đầu lập trình

- 43/43 bài chính có khóa trực quan khai báo rõ, không rơi về mô hình suy đoán chung.
- 31/31 phần tổng hợp chọn hình theo từng câu, không theo tiêu đề toàn phần.
- Nội dung “Quy tắc và quy trình” của mỗi bài có ít nhất một mô hình thể hiện đúng thao tác toán học và một cơ chế tự kiểm tra.
- Tên điều khiển là đại lượng thật; không còn nhãn “Dữ kiện A/B”.
- Hình, phép tính và lời giải thích thay đổi đồng bộ; có mô tả cho trình đọc màn hình và thao tác bàn phím.
- Kiểm thử dữ liệu xác nhận đủ 74 nhánh, không trùng `visualKey`, không thiếu `representationKey` ở câu tổng hợp.
- Kiểm thử trực quan tối thiểu ở màn hình 390 px, 768 px và desktop; không che nội dung, không buộc cuộn ngang.
- Mọi thay đổi chỉ tác động cách giảng và hiển thị; đáp án, điểm đã lưu và mã hoạt động phải giữ nguyên.
