# English Quest — Task Board

> Tệp này là nguồn sự thật cho công việc còn dở. Automation chỉ được tiếp tục mục `TODO` hoặc `IN_PROGRESS`; không tự tạo việc mới khi mọi mục đã `DONE` hoặc `BLOCKED`.

## IN_PROGRESS

## TODO


## DONE

- [x] `MATH-VISUAL-IMPLEMENT-001` Đưa trực quan riêng của từng bài Toán 6 vào đúng khối “Quy tắc và quy trình”.
  - 43 bài chính dùng 43 khóa trực quan tường minh; 31 phần tổng hợp có bộ chọn mô hình theo đúng mạch kiến thức, không còn đoán bằng từ khóa.
  - Hình nằm trong thẻ kiến thức thứ hai; điều khiển mang tên đại lượng thật, có đối chiếu quy tắc, tự kiểm tra và lỗi cần tránh; không còn “Dữ kiện A/B”.
  - Giữ nguyên câu hỏi, đáp án, ID, điểm và tiến độ. Frontend 401/401, kiểm thử hẹp 10/10 và build 273 modules PASS; click-through Bài 2, 3, 10, 15–17, 30, 37, 43 PASS.

- [x] `MATH-VISUAL-AUDIT-001` Rà soát “Quy tắc và quy trình” của toàn bộ Toán 6 hai học kỳ và thiết kế trực quan riêng theo từng bài.
  - Bản thiết kế phủ đủ Bài 1–43 và phương án theo từng câu cho 31 phần luyện tập, ôn tập, trải nghiệm.
  - Xác định ba mô hình riêng hiện có, các trường hợp ghép sai do từ khóa, hình–tương tác–tự kiểm tra của từng bài và bốn mức ưu tiên triển khai.
  - Chỉ thêm báo cáo thiết kế; chưa thay renderer, nội dung, đáp án, điểm hoặc tiến độ. Kiểm tra cấu trúc 43/43 + 31/31 và `git diff --check` PASS.

- [x] `TTS-VI-NUMBERS-001` Sửa cách đọc số có khoảng trắng phân tách hàng nghìn trong tiếng Việt.
  - Hàng đợi âm thanh dùng chung chuyển `7 000`, `700 000`, `7 000 000` thành `7000`, `700000`, `7000000` riêng cho giọng `vi-*` trước khi đọc.
  - Văn bản hiển thị, đáp án, điểm, tiến độ và cách đọc tiếng Anh được giữ nguyên.
  - Kiểm thử riêng 3/3, toàn frontend 399/399 và production build 272 modules đều PASS.

- [x] `MATH-BLANK-SCREEN-001` Sửa màn hình trắng khi mở các phần Toán 1–3.
  - Nguyên nhân là phiên trình duyệt cũ gọi tệp bài học đã đổi tên sau một lần build mới; dynamic import thất bại làm React mất toàn bộ nội dung.
  - Thêm khôi phục tự động có giới hạn cho lỗi asset tải trễ và màn hình tải lại an toàn cho mọi lỗi render, không đổi điểm hoặc tiến độ.
  - Kiểm thử frontend 397/397 và production build 272 modules PASS; click-through trực tiếp Bài 1, 2, 3 đều hiển thị đủ tiêu đề, kiến thức và nút trò chơi.

- [x] `UI-HIERARCHY-001` Chuẩn hóa cấu trúc hiển thị ý chính, gợi ý và nhãn phụ trên toàn bộ các môn.
  - Component chung có hai chế độ rõ ràng: Tiếng Anh/Khoa học tự nhiên nhấn mạnh bối cảnh–ý chính; Toán/Tin học/Ngữ văn nhấn mạnh câu hỏi–nhiệm vụ.
  - Ý chính dùng tiêu đề lớn, đậm; gợi ý dùng chữ nhỏ, nét thường, nền nhẹ và nhãn “Gợi ý”; mức độ/bối cảnh phụ không còn lấn át câu hỏi.
  - Giữ nguyên nội dung, đáp án, âm thanh, điểm và tiến độ; kiểm thử cấu trúc 3/3, toàn frontend 394/394 và production build 271 modules đều PASS.
  - Chưa click-through trực quan vì trình duyệt nội bộ timeout khi mở localhost; không tuyên bố đã kiểm tra bằng mắt trên thiết bị thật.

- [x] `APP-FULL-AUDIT-001` Kiểm tra toàn bộ ứng dụng, sửa lỗi có bằng chứng và bàn giao biên bản kỹ thuật–giáo dục.
  - Đã kiểm kê 10 khóa/5 môn/174 nhánh/1.476 hoạt động; xác minh tài khoản, điểm từng câu, tổng khóa–môn–toàn hệ thống, backup/restore, migration, nguồn, build và phụ thuộc.
  - Sửa bộ sinh Khoa học tự nhiên làm lùi trạng thái tích hợp; đồng bộ báo cáo/kiểm thử; tách khối 55 bài khoảng 24 MB thành 55 gói tải trễ khoảng 24–31 KB gzip/bài.
  - Cổng cuối: frontend 391/391, backend 64/64, học liệu 46/46, Science gate PASS, validator 0 lỗi/0 cảnh báo, production build 271 modules, audit phụ thuộc offline không phát hiện lỗ hổng đã biết.
  - Biên bản: `docs/APP_AUDIT_2026-11-17.md`. Kết luận bàn giao có điều kiện; còn cần click-through/accessibility/TTS, giáo viên–học sinh thật, mô phỏng Science tương tác và tạo lại bộ cài từ mã hiện tại.

- [x] `INTEGRATE-STANDALONE-SUBJECTS-001` Tích hợp toàn bộ môn đã xây riêng vào ứng dụng chính.
  - Kiểm kê xác nhận Tiếng Anh, Toán, Tin học và Ngữ văn đã tích hợp; Khoa học tự nhiên là môn duy nhất còn đứng riêng và nay đã mở đủ Bài 1–55 thành hai học kỳ 28+27 bài.
  - Đã nối catalog, renderer tải trễ, điều hướng bài, sáu game năng lực, lưu điểm từng học kỳ, tổng môn Khoa học tự nhiên, tổng tất cả môn và nhãn hồ sơ; giữ nguyên các môn đang chạy.
  - Mỗi bài giữ 5 chặng/10 thẻ, 6 game × 10 câu theo 3-4-2-1, phản hồi sai bốn phần; mô phỏng và ứng dụng thực tế hiển thị riêng, luôn không chấm điểm và có cảnh báo giám sát.
  - Kiểm thử frontend 391/391, backend 61/61, science gate PASS, hồi quy Science 8/8 và production build PASS. Chưa thay thế duyệt giáo viên Khoa học tự nhiên thật, thí điểm học sinh thật hoặc click-through/accessibility trên thiết bị thật.

- [x] `COMPUTER6-DEPTH-002` Rà soát và nâng cấp chiều sâu toàn bộ Tin học 6 hai học kỳ.
  - Giữ nguyên 17 ID bài, 102 activity và điểm/tiến độ; mở mỗi bài từ 4 lên 6 hạt kiến thức, 12 thẻ, 5 phần học và rubric 4 tiêu chí.
  - Hồ sơ nội dung đã có ma trận ý tưởng riêng Bài 1–17; thực hành thật vẫn không chấm tự động và yêu cầu cha mẹ/giáo viên cho phép khi cần.
  - Giữ 6 năng lực × 10 câu/bài theo 3-4-2-1, tổng 1.020 câu và 3.060 phản hồi; hướng dẫn mỗi game tăng từ 3 lên 4 bước gắn đúng bài.
  - Frontend 388/388, backend 63/63, đánh giá ba vai trò 6/6, production build 210 modules và validator 0 lỗi/0 cảnh báo đều PASS.
  - Mô phỏng AI sau nâng cấp: học sinh 88/100, giáo viên 90/100, chuyên gia 85/100; phát hành rộng vẫn cần thí điểm người thật và accessibility/UI/TTS trên máy thật.

- [x] `VIETNAMESE6-FULL-002` Rà soát, xây dựng và tích hợp đầy đủ Ngữ văn 6 tập 1–2.
  - Đã lập ma trận Bài 1–10 và hai phần Ôn tập theo Đọc, Thực hành tiếng Việt, Viết, Nói-nghe và dự án; mở hai khóa Ngữ văn 6 Học kỳ 1–2.
  - Mỗi nhánh có mục tiêu, 12 thẻ giảng dạy, ý tưởng từng phần, trực quan nguyên bản và 6 năng lực × 10 câu theo 3-4-2-1; tổng 72 game, 720 câu và 2.160 phản hồi chẩn đoán.
  - Đã tích hợp catalog, renderer, tiến độ, điểm từng học kỳ, tổng môn Ngữ văn và tổng tất cả môn; câu mở dùng rubric, tùy chọn hư cấu và rào chắn quyền riêng tư.
  - Kiểm thử frontend 388/388, backend 62/62, đánh giá ba vai trò 6/6, production build 210 modules và validator 0 lỗi/0 cảnh báo đều PASS.
  - Mô phỏng AI: học sinh 88/100, giáo viên 87/100, chuyên gia ứng dụng giáo dục 85/100. Chưa thay thế thí điểm người thật hoặc kiểm thử nghe/khả năng tiếp cận; công cụ trình duyệt không mở được localhost để click-through.

- [x] `COMPUTER6-TRIROLE-001` Kiểm thử và đánh giá nhánh Tin học 6 theo ba vai trò.
  - Học sinh mô phỏng: 86/100; đã đi đủ 1.020 câu, chủ động chọn sai để kiểm tra phản hồi rồi sửa đúng 1.020/1.020 câu; tiến trình 3-4-2-1 đúng ở 102/102 game.
  - Giáo viên giảng dạy: 84/100; đủ 17 bài và 6 năng lực nhưng bài giảng còn dựa trên bốn hạt kiến thức/bài, thiếu rubric thực hành và hoạt động nhóm.
  - Chuyên gia ứng dụng giáo dục: 84/100; kiến trúc, an toàn và hồ sơ điểm nhất quán, nhưng chưa có kiểm thử người thật, dữ liệu hiệu quả trước-sau hoặc accessibility đầy đủ.
  - Báo cáo: `data/informatics6/reports/three-role-evaluation.md` và `.json`; kiểm thử báo cáo 6/6 PASS, hồi quy Tin học/catalog 25/25 PASS, `git diff --check` không có lỗi khoảng trắng.
  - Kết luận phát hành: kỹ thuật sẵn sàng; gia đình dùng có người lớn hỗ trợ; lớp học sẵn sàng có điều kiện; phát hành rộng phải qua thí điểm.

- [x] `COMPUTER6-FULL-001` Xây dựng nhánh Tin học 6 từ SGK đến sản phẩm tích hợp hoàn chỉnh.
  - Đã đối chiếu đủ 6 chủ đề, Bài 1–17 và chia thành hai học kỳ; hồ sơ nguồn/an toàn tại `data/informatics6/CURRICULUM_RESEARCH.md`.
  - Mỗi bài có mục tiêu, 8 thẻ giảng dạy, trực quan tự tạo, 6 năng lực × 10 câu theo 3-4-2-1 và phản hồi chẩn đoán riêng cho mọi đáp án sai; tổng 1.020 câu và 3.060 phản hồi sai.
  - Đã tích hợp renderer, catalog, activity plan, nhãn hồ sơ, điểm riêng hai học kỳ, tổng môn Tin học và tổng tất cả môn; thực hành thật chỉ hướng dẫn an toàn, không chấm thao tác/tài khoản thật.
  - Frontend 373/373 PASS; backend 61/61 PASS; TypeScript/Vite build PASS; gói chạy thử trả version 1.2.0, integrity ok, đủ 9+8 bài.
  - Bộ cài cuối: `release/EnglishQuest-Setup-1.2.0.exe`, SHA-256 `bddae7ab26574c0c37f866bece04a76b21e79fcad05c0a3551c1305cece9858f`.
  - Chưa click-through giao diện bằng công cụ điều khiển Windows vì công cụ dừng khi không xác định chắc URL localhost; cấu trúc, responsive, build và máy chủ đóng gói đã được kiểm thử tự động.

- [x] `VIETNAMESE6-S2-RESEARCH-001` Nghiên cứu SGK Ngữ văn 6 tập 2 và xây khung ý tưởng luyện tập độc lập.
  - Đã kiểm kê đủ Bài 6–10 và Ôn tập học kỳ II theo Đọc, Thực hành tiếng Việt, Viết, Nói-nghe.
  - Đã đề xuất kiến trúc 7 chặng cho Bài 6–9, hồ sơ 6 chặng riêng cho Bài 10, 6 năng lực, 30 khuôn luyện tập, phản hồi chẩn đoán và quy tắc chấm/rubric.
  - Báo cáo độc lập tại `data/vietnamese6_s2_research/PRACTICE_FRAMEWORK.md`; chưa sửa catalog, frontend, backend hoặc nội dung môn đang chạy.

- [x] `VIETNAMESE6-S1-RESEARCH-001` Nghiên cứu SGK Ngữ văn/Tiếng Việt 6 tập 1 và xây khung ý tưởng luyện tập độc lập.
  - Đã kiểm kê đủ 5 bài và Ôn tập học kỳ I theo bốn mạch Đọc, Thực hành tiếng Việt, Viết, Nói-nghe.
  - Đã đề xuất kiến trúc 7 chặng, 6 năng lực, 24 khuôn luyện tập, lộ trình 3-4-2-1, phản hồi chẩn đoán, chấm điểm/rubric và bảo vệ quyền riêng tư.
  - Báo cáo độc lập tại `data/vietnamese6_s1_research/PRACTICE_FRAMEWORK.md`; chưa sửa catalog, frontend, backend hoặc nội dung môn đang chạy.

- [x] `SCIENCE6-TEMPLATES-002` Mở rộng Khoa học tự nhiên 6 lên 18 khuôn biểu diễn và thêm cổng căn cứ nội dung AI.
  - Giữ 6 trò chơi × 10 câu/bài và lộ trình 3-4-2-1; mỗi bài dùng sáu khuôn khác nhau, luân phiên đủ 18 khuôn trong toàn gói. Phiên bản nội dung tăng lên 1.1.0.
  - Đủ 3.300/3.300 câu có `grounding` trỏ đúng thẻ, trang nguồn, sự kiện, căn cứ, quy trình và kết quả; 0 khẳng định ngoài nguồn được khai báo, phương án sai đều ghi rõ là nhiễu cố ý.
  - Câu dẫn sau tối ưu dài trung bình 42,2 từ; vẫn còn 2.538/3.300 câu trên 35 từ và 4.202/13.200 phương án trên 30 từ, cần tiếp tục giảm tải đọc khi làm renderer.
  - 55/55 bài PASS cổng riêng; data gate PASS; kiểm thử mới và hồi quy PASS 34/34; validator nguồn 0 lỗi/0 cảnh báo. Đánh giá mới: học sinh mô phỏng 69/100, giáo viên 80/100, chuyên gia ứng dụng 62/100.

- [x] `SCIENCE6-TRIROLE-001` Kiểm tra và đánh giá toàn bộ gói Khoa học tự nhiên 6 theo ba vai trò.
  - Mô phỏng học sinh đạt 69/100, giáo viên giảng dạy 80/100, chuyên gia ứng dụng giáo dục 62/100 sau vòng nâng cấp 18 khuôn; báo cáo ghi rõ đây không phải kiểm thử UI hoặc người thật.
  - Luồng dữ liệu đạt 55 bài/330 game/3.300 câu/9.900 phản hồi; kiểm thử mới và hồi quy PASS 13/13, data gate PASS, validator nguồn 0 lỗi/0 cảnh báo.
  - Kết luận: gói dữ liệu `READY`, dùng trực tiếp trên lớp `CONDITIONAL_NOT_READY`, phát hành cho học sinh `NOT_READY` do chưa có renderer/UI, duyệt giáo viên thật và thí điểm học sinh thật.
  - Phát hiện hiện tại: câu hỏi trung bình 42,2 từ, phương án 28,3 từ; 4.202/13.200 phương án dài trên 30 từ; 3.300 câu không trùng nguyên văn và dùng 18 khuôn biểu diễn.

- [x] `SCIENCE6-FULL-001` Hoàn tất gói dữ liệu độc lập Khoa học tự nhiên 6 đủ Bài 1-55.
  - Đủ 55 bài theo thứ tự sách; 275 chặng, 550 thẻ, 330 game, 3.300 câu và 9.900 phản hồi chẩn đoán; mỗi game theo lộ trình 3-4-2-1.
  - Từng Bài 1-55 đều PASS cổng riêng và có báo cáo; cổng tổng PASS 8/8, mô phỏng học sinh hoàn thành/sửa đúng 3.300/3.300 câu, cấu trúc giáo viên 5/5.
  - 55 thực hành và 55 mô phỏng đều không chấm điểm, có cảnh báo cho phép/giám sát; nội dung nguy hiểm bị cấm hoặc chuyển sang mô phỏng/giáo viên biểu diễn.
  - Gói ở trạng thái `standalone-complete` phiên bản 1.0.0; không thay đổi catalog/frontend/backend. Chưa có renderer, kiểm thử UI, học sinh thật hoặc nghiệm thu giáo viên bộ môn.

- [x] `SCIENCE6-PILOT-001` Xây dựng và kiểm thử gói dữ liệu độc lập cho 8 bài Khoa học tự nhiên 6 thí điểm.
  - Đủ Bài 2, 8, 17, 21, 26, 42, 48 và 53; mỗi bài có 5 chặng/10 thẻ, 6 năng lực x 10 câu, lộ trình 3-4-2-1 và payload biểu diễn riêng.
  - Tổng 480 câu AI, 1.440 phản hồi chẩn đoán theo ngộ nhận; tiêu chí phân loại riêng cho 80 khái niệm và câu thử thách yêu cầu đủ bốn thao tác.
  - Mọi ứng dụng thực tế `scored:false`, 0 điểm, có mức giám sát, cảnh báo, việc được phép và việc cấm; mô phỏng mới ở mức đặc tả.
  - Validator PASS 8/48/480/1.440/0; test 8/8; mô phỏng logic học sinh PASS; QA độc lập vòng ba PASS. Chưa tích hợp catalog/frontend/backend và chưa phải kiểm thử UI hoặc nghiệm thu người thật.

- [x] `RELEASE-DATA-GIT-002` Đồng bộ phiên bản, bảo vệ dữ liệu học sinh và tạo bản phát hành Git/Windows mới.
  - `VERSION` là nguồn phiên bản 1.1.0; frontend, API, launcher và installer cùng phiên bản, script build từ chối giá trị lệch.
  - SQLite schema v2 có backup trước migration, WAL/busy timeout, quick check và chặn schema mới hơn; Hồ sơ xuất/nhập gói tiến độ không chứa PIN/token, tự snapshot trước restore và gộp theo điểm tốt nhất để lưu qua Drive.
  - Git loại trừ phụ thuộc/artifact/database, có nhánh `main`, nhánh ổn định `stable/1.1` và tag `v1.1.0` trên commit phát hành.
  - Kiểm thử: validator 0 lỗi/0 cảnh báo; backend 61/61; frontend 354/354; production build PASS; HTTP backup/restore PASS; installer 1.1.0 build và chạy từ vùng cài thử PASS.

- [x] `MATH-STUDENT-E2E-001` Đóng vai học sinh và kiểm thử tiến trình Toán trên ứng dụng thật.
  - Dùng tài khoản/SQLite thử riêng; đăng nhập, vào Toán 6 Kỳ 1, mở Bài 1, trực quan, lời giảng, phản hồi sai, trợ giúp, lưu từng câu, bỏ qua/làm lại và tiếp tục sau tải lại đều hoạt động.
  - Phát hiện và sửa lỗi câu thứ 10 đã lưu nhưng game chưa hoàn thành do component bị dựng lại; thêm kiểm thử hồi quy và hoàn thành thật game “Thực hiện quy trình” 10/10.
  - Giao diện và API cùng xác nhận game hoàn thành, 10 câu đã lưu, 992 điểm game, 1.966 điểm Bài 1/Toán Kỳ 1/môn Toán/tổng tất cả môn và 1 hoạt động hoàn thành.
  - Frontend PASS 352/352; production build PASS. Còn ghi nhận trang hồ sơ ở viewport 390 px có cuộn ngang và chưa nghe thẩm âm TTS bằng tai.

- [x] `MATH-DEEP-CURRICULUM-004` Chuẩn hóa thực chất sáu năng lực cho bảy phần Toán biên soạn tay.
  - Hai game đầu chấm nhận biết/quy trình; bốn game sau chấm trực tiếp lập luận có căn cứ, sửa lời giải sai, kết nối hai nhiệm vụ và quyết định kèm giải thích.
  - Giữ nguyên branch/activity ID, 6 game × 10 câu, điểm tối đa và tiến độ cũ; các nhiệm vụ dẫn xuất được gắn đúng nhãn AI trong khi bài toán gốc vẫn còn trong câu hỏi/lời giải.
  - Cổng riêng bảy phần và chiều sâu đạt 31/31; frontend 351/351; validator 0 lỗi/0 cảnh báo; backend 55/55; TypeScript và production build PASS, 202 modules.

- [x] `MATH-DEEP-CURRICULUM-003` Áp dụng chuẩn chiều sâu sư phạm cho 71 phần Toán còn lại của hai học kỳ.
  - 64 phần sinh tự động và 7 phần biên soạn tay đều có 6 năng lực × 10 câu, đúng lộ trình 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách; tổng 4.260 lượt học được nâng cấp.
  - Mỗi lựa chọn sai có chẩn đoán bốn phần; mỗi phần có 5 chặng/10 thẻ bài giảng và hướng dẫn cách nghĩ riêng. Phần sinh tự động được mở từ 4 lên 12 hạt nhiệm vụ trước khi phân phối qua sáu năng lực.
  - Bảy phần viết tay giữ nguyên ID hoạt động, điểm và dữ liệu học sinh nhưng đã dùng cùng sáu năng lực.
  - Toàn bộ 74 phần Toán có trực quan riêng theo bài; bộ định tuyến gồm 13 mạch như tập hợp, hàng số, phép tính, ước–bội, số nguyên, hình phẳng, đối xứng, phân số, thập phân, điểm–đường–góc, dữ liệu, xác suất và thực hành tổng hợp. Ba bài thí điểm tiếp tục dùng trực quan chuyên dụng.
  - Kiểm thử chuyên biệt 38/38 rồi 5/5 PASS; từng phần Kỳ 1 và Kỳ 2 PASS độc lập; validator 0 lỗi/0 cảnh báo; backend 55/55; frontend 351/351; TypeScript và production build PASS, 202 modules.
  - Chưa click-through sau đăng nhập vì không tự động thao tác xác thực hoặc tạo tài khoản học sinh; cấu trúc hiển thị, responsive và bản dựng đã được kiểm thử tự động.

- [x] `MATH-DEEP-CURRICULUM-002` Hoàn thiện sâu ba bài thí điểm Bài 6, Bài 23 và Bài 40 theo sáu lớp sư phạm.
  - Ba bài có tổng cộng 180 nhiệm vụ: mỗi bài 6 năng lực × 10 câu; từng game đi đúng 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách và dùng 10 kiểu biểu diễn/tình huống.
  - Mọi phương án sai có phản hồi riêng gồm loại lỗi, vì sao sai, cách sửa và thẻ kiến thức cần ôn; bài giảng/cách nghĩ được viết riêng cho số mũ, phân số và biểu đồ cột.
  - Ba bài cùng mô hình sáu năng lực; phạm vi ba bài sinh tự động không thay đổi bảy bài biên soạn tay của chương trình.
  - Trực quan tương tác đã phủ số mũ, phân số và biểu đồ cột. Cổng hoàn thiện 6/6 PASS; cổng hẹp 21/21 PASS; cổng riêng Bài 6, 23, 40 đều 2/2 PASS; validator 0 lỗi/0 cảnh báo; backend 55/55; frontend 346/346; TypeScript và production build PASS, 200 modules.
  - Edge xác nhận ứng dụng mở đúng màn đăng nhập. Chưa click-through ba bài sau đăng nhập vì phiên kiểm thử không có tài khoản và không tự tạo dữ liệu học sinh.

- [x] `MATH-VISUALS-001` Bổ sung hình trực quan cho phần số mũ và phân số.
  - Bài 6 có ba hình: cơ số–số mũ, phép nhân lặp và nhân lũy thừa cùng cơ số.
  - Bài 23 có ba hình: phân số bằng nhau, phân số âm trên trục số và rút gọn phân số.
  - Sáu hình là SVG nguyên bản, co giãn trên màn hình nhỏ, có tiêu đề, chú thích và mô tả cho trình đọc màn hình; không sao chép ảnh sách và không thay đổi ID/điểm học tập.
  - Kiểm thử hình riêng 3/3 PASS; validator 0 lỗi/0 cảnh báo; backend 55/55 PASS; frontend 340/340 PASS; TypeScript và production build PASS, 199 modules. Chưa click-through trực quan vì localhost không khả dụng trong phiên này.

- [x] `MATH-PILOT-DEPTH-001` Thí điểm bài giảng chiều sâu cho Bài 6, Bài 23 và Bài 40.
  - Mỗi bài có 5 chặng với 10 thẻ giảng dạy không trùng: tiền đề/khám phá, quy tắc, ví dụ mẫu, lỗi thường gặp và tự kiểm tra; mục tiêu được viết riêng theo nội dung bài.
  - Mỗi bài có 12 ý/ví dụ gốc chia đều 4 cơ bản, 4 thông hiểu, 4 vận dụng; sáu trò chơi × 10 câu giữ sáu năng lực và mọi phương án sai đều có phản hồi chẩn đoán riêng.
  - Giữ nguyên branch/activity ID, điểm và tiến độ. Kiểm thử riêng: Bài 6 PASS 3/3, Bài 23 PASS 3/3, Bài 40 PASS 3/3; cổng thí điểm + sư phạm PASS 12/12.
  - Hồi quy: validator 0 lỗi/0 cảnh báo; backend 55/55 PASS; frontend 337/337 PASS; TypeScript/Vite production build PASS, 198 modules. Chưa click-through trực quan vì trình duyệt localhost không khả dụng trong phiên này.

- [x] `MATH-PEDAGOGY-001` Nâng cấp chiều sâu sư phạm toàn bộ Toán 6 hai học kỳ.
  - 67 nhánh sinh tự động có 60 nhiệm vụ riêng mỗi nhánh; bảy nhánh biên soạn tay giữ 60 tình huống có ngữ cảnh và đều vượt ngưỡng 40 nhiệm vụ khác nhau.
  - Sáu trò chơi được tách rõ thành sáu năng lực: nhận biết khái niệm, thực hiện quy trình, lập luận–giải thích, phân tích–sửa sai, kết nối–tổng hợp và vận dụng–thử thách.
  - Giữ nguyên ID nhánh/hoạt động, kế hoạch điểm và dữ liệu học sinh; sửa renderer để Toán Học kỳ 2 hiển thị đúng nhãn học kỳ.
  - Kiểm thử: cổng sư phạm 4/4 PASS; 67/67 nhánh sinh tự động PASS độc lập; bảy nhánh viết tay đạt 60 nhiệm vụ riêng; validator 0 lỗi/0 cảnh báo; backend 55/55 PASS; frontend 329/329 PASS; TypeScript/Vite production build PASS; Edge xác nhận nhãn Học kỳ 2, sáu thẻ năng lực và màn trò chơi lập luận.

- [x] `MATH-S2-FULL-001` Xây dựng và ghép nối toàn bộ Toán 6 · Học kỳ 2.
  - Kết quả nội dung: đủ 36 nhánh theo SGK Tập 2, gồm Chương VI–IX, Bài 23–43, các Luyện tập chung/Bài tập cuối chương, ba Hoạt động thực hành trải nghiệm và Ôn tập cuối năm; mỗi nhánh có bài giảng và 6 trò chơi × 10 câu.
  - Kết quả tích hợp: khóa `math-6-semester-2` mở tại Bài 23; activity plan tối đa 216.000 điểm, được lưu riêng theo học kỳ và cộng vào tổng môn Toán 444.000 điểm cùng tổng hồ sơ tất cả môn; giữ nguyên dữ liệu điểm cũ.
  - Kiểm thử riêng: 38/38 PASS, trong đó đủ một lượt cho từng nhánh. Hồi quy: validator 0 lỗi/0 cảnh báo; backend 55/55 PASS; frontend 325/325 PASS; TypeScript/Vite production build PASS.
  - Giới hạn: kênh điều khiển trình duyệt của Codex không truy cập được máy chủ cục bộ nên chưa click-through trực quan; logic, API, dữ liệu và bản dựng đã được kiểm thử tự động.

- [x] `MATH-S1-FULL-001` Hoàn thiện Toán 6 · Học kỳ 1 và sửa đủ năm vấn đề trong tiến trình học.
  - Kết quả nội dung: khóa Toán có đủ 38 nhánh từ Bài 1–22, các Luyện tập chung/Bài tập cuối chương và ba Hoạt động thực hành trải nghiệm; mỗi nhánh có 6 trò chơi × 10 câu, tổng điểm tối đa 228.000.
  - Kết quả trải nghiệm: lưu từng câu; báo rõ trạng thái âm thanh; tiếp tục đúng câu chưa làm và cho bỏ qua/làm lại câu đã lưu; màn đăng nhập dùng thương hiệu thư viện học tập đa môn; điểm Toán tiếp tục được tổng hợp riêng và vào tổng hồ sơ.
  - Kiểm thử riêng: checkpoint từng câu PASS; trạng thái âm thanh PASS; bỏ qua/làm lại và tiếp tục bài dở PASS; thương hiệu/điểm vào đa môn PASS; 39/39 cổng Toán PASS, trong đó từng phần Toán sinh tự động có một lượt kiểm thử riêng.
  - Hồi quy: validator 0 lỗi/0 cảnh báo; backend 54/54 PASS; frontend 286/286 PASS; TypeScript/Vite production build PASS.

- [x] `MATH-S1-L1-001` Xây dựng Toán 6 · Học kỳ 1 · Bài 1 — Tập hợp.
  - Kết quả: bài giảng tương tác bám trang sách 5–8, 3 khối kiến thức, 4 mục tiêu, 6 trò chơi × 10 câu và phản hồi sư phạm; khóa Toán 6 Học kỳ 1 mở tại Bài 1, điểm tối đa 6.000 và được tổng hợp riêng theo môn.
  - Kiểm thử riêng: 9/9 PASS. Hồi quy: validator 0 lỗi/0 cảnh báo; backend 46/46 PASS; frontend 229/229 PASS; TypeScript/Vite production build PASS (178 modules). Giao diện thật xác nhận tới màn đăng nhập; chưa click-through sau đăng nhập vì không tự tạo tài khoản/dữ liệu học sinh.

- [x] `S2-R4-001` Xây dựng Review 4 — Units 10–11–12.
  - Kết quả: đủ 6 game × 10 câu, 3 màn Bonus × 10 câu; Language bám trọng âm/từ vựng/ngữ pháp, Skills bám ngôi nhà tương lai, môi trường và bài viết; audio nghe thay thế có nhãn AI; điểm Review tối đa 6.000.
  - Kiểm thử riêng: validator 0 lỗi/0 cảnh báo; backend 45/45 PASS; frontend 225/225 PASS; TypeScript và Vite production build PASS (175 modules).

- [x] `S2-U12-001` Xây dựng Unit 12 — Robots.
  - Kết quả: đủ 42 game × 10 câu, hai bài luyện ngữ điệu xuống 60 giây, 3 màn Bonus × 10 câu; hoạt động robot, so sánh nhất, triển lãm robot và Project thiết kế robot đã được nối vào Học kỳ 2, điểm Unit tối đa 42.000.
  - Kiểm thử riêng: validator 0 lỗi/0 cảnh báo; backend 44/44 PASS; frontend 221/221 PASS; TypeScript và Vite production build PASS.

- [x] `S2-U11-001` Xây dựng Unit 11 — Our Greener World.
  - Kết quả: đủ 42 game × 10 câu, hai bài luyện nhịp câu 60 giây, 3 màn Bonus × 10 câu; 3Rs, trường học xanh, first conditional, bài nghe thay thế và Project tái sử dụng đồ cũ đã được nối vào Học kỳ 2, điểm Unit tối đa 42.000.
  - Kiểm thử riêng: validator 0 lỗi/0 cảnh báo; backend 43/43 PASS; frontend 217/217 PASS; TypeScript và Vite production build PASS.

- [x] `S2-U10-001` Xây dựng Unit 10 — Our Houses in the Future.
  - Kết quả: đủ 42 game × 10 câu, hai bài luyện trọng âm từ hai âm tiết 60 giây, 3 màn Bonus × 10 câu; hội thoại, thiết bị, will/won't, might, ngôi nhà trên đảo và Project thiết bị tương lai đã được nối vào Học kỳ 2, điểm Unit tối đa 42.000.
  - Kiểm thử riêng: validator 0 lỗi/0 cảnh báo; backend 42/42 PASS; frontend 213/213 PASS; TypeScript và Vite production build PASS.

- [x] `S2-R3-001` Xây dựng Review 3 — Units 7–8–9.
  - Kết quả: đủ 6 game × 10 câu, 3 màn Bonus × 10 câu; Language bám âm/từ vựng/ngữ pháp, Skills bám Cheese Rolling, Toe Wrestling, Singapore và đoạn viết về Delhi; audio thay Track 22 có nhãn AI; điểm Review tối đa 6.000.
  - Kiểm thử riêng: validator 0 lỗi/0 cảnh báo; backend 41/41 PASS; frontend 209/209 PASS; TypeScript và Vite production build PASS.

- [x] `S2-U9-001` Xây dựng Unit 9 — Cities of the World.
  - Kết quả: đủ 42 game × 10 câu, hai bài luyện âm /əʊ/–/aʊ/ 60 giây, 3 màn Bonus × 10 câu; hội thoại, từ vựng, ngữ pháp, Stockholm/Bangkok và Project hành trình thế giới đã được nối vào Học kỳ 2, điểm Unit tối đa 42.000.
  - Kiểm thử riêng: validator 0 lỗi/0 cảnh báo; backend 40/40 PASS; frontend 205/205 PASS; TypeScript và Vite production build PASS. Chưa kiểm tra trực quan bằng trình duyệt nội bộ vì phiên Codex không có quyền truy cập máy chủ cục bộ.

- [x] `S2-U8-001` Xây dựng Unit 8 — Sports and Games.
  - Kết quả: Học kỳ 2 có thêm Unit 8 sau Unit 7; đủ 42 game × 10 câu, hai bài luyện âm 60 giây, 3 màn Bonus × 10 câu, hội thoại/từ vựng có bản dịch, Project dùng gợi ý trò chơi truyền thống làm vật liệu luyện tập, điểm Unit tối đa 42.000 và được tổng hợp riêng theo khóa.
  - Kiểm thử: validator 0 lỗi/0 cảnh báo; backend 39/39 PASS; frontend 201/201 PASS; TypeScript và Vite production build PASS. Chưa kiểm tra trực quan bằng trình duyệt nội bộ vì phiên Codex không cho truy cập máy chủ cục bộ.

- [x] `S2-U7-001` Mở khóa Tiếng Anh 6 · Học kỳ 2 và xây dựng Unit 7 — Television từ SGK Tập 2.
  - Kết quả: Học kỳ 2 đã mở tại Unit 7; đủ 42 game × 10 câu, hai bài luyện âm 60 giây, 3 màn Bonus × 10 câu, hội thoại/từ vựng có bản dịch, Project dùng gợi ý làm vật liệu trò chơi, điểm Unit tối đa 42.000 và hồ sơ tách riêng theo khóa.
  - Kiểm thử: validator 0 lỗi/0 cảnh báo; backend 38/38 PASS; frontend 195/195 PASS; TypeScript và Vite production build PASS.

- [x] `AUDIT-001` Rà soát Tiếng Anh 6 Tập 1 với nội dung/trò chơi ứng dụng và sửa danh sách Unit bị khuất.
  - Kết quả: đã kiểm tra trực quan đủ Units 1–6 và Reviews 1–2 trong PDF 74 trang; cấu trúc, thứ tự, phạm vi trang, mốc bài tập và Project/Now I can khớp dữ liệu đã kiểm chứng. Đã lập báo cáo đối chiếu và cập nhật nguồn toàn tập. Thanh chọn 10 nhánh đổi từ một hàng ngang thành lưới đáp ứng 5/3/2 cột nên Unit 5, Unit 6 và Review 2 luôn truy cập được.
  - Kiểm thử: validator 0 lỗi/0 cảnh báo; frontend 189/189 PASS; TypeScript và Vite production build PASS; kiểm tra trực quan Edge xác nhận cả 10 nút hiện đầy đủ trên hai hàng ở màn hình rộng.

- [x] `UX-007` Chuyển nội dung Project từ “kiến thức nền” thành gợi ý và tiêu chí của trò chơi.
  - Kết quả: Project Units 1–6 không còn khối kiến thức nền; các bước/câu hỏi Project điều khiển trò Project Plan/Path, còn toàn bộ “Now I can…” điều khiển các lượt tự kiểm tra của Show & Tell. Unit 3 dùng đủ 5 bước làm kỷ yếu và đủ 8 tiêu chí trong ảnh.
  - Kiểm thử: frontend 188/188 PASS; kiểm thử đối chiếu Project steps/prompts/Now I can với game PASS; TypeScript và Vite production build PASS.

- [x] `UX-006` Chuẩn hóa bản dịch và lời đọc cho Communication, Skills 1–2, Looking Back và Project.
  - Kết quả: các mục tiếng Anh ở năm phần cuối của Units 1, 2, 4, 5, 6 đều có bản dịch tiếng Việt cụ thể; Unit 3 được rà soát và giữ các hướng dẫn song ngữ đã có. Bộ đọc dùng chung loại bỏ mọi ký tự `/` và dọn khoảng trắng trước dấu câu, áp dụng cả likes/dislikes, He/She và các ký hiệu âm trong Now I can.
  - Kiểm thử: frontend 186/186 PASS; kiểm thử helper bản dịch, sai lệch số lượng và chuỗi TTS không chứa `/` PASS; TypeScript và Vite production build PASS.

- [x] `UX-005` Chuẩn hóa phần Sound groups và cách đọc âm cho tất cả Unit.
  - Kết quả: Units 1–6 hiển thị “Cách phát âm” bằng tiếng Việt; Unit 3 có nút nghe riêng cho /b/–/p/; TTS chỉ đọc âm mẫu và từ ví dụ, không đọc dấu `/` hoặc phần mô tả. Bản nháp Unit 7 cũng dùng cùng quy tắc.
  - Kiểm thử: frontend 184/184 PASS; kiểm thử chuỗi TTS không có `/` PASS; TypeScript và Vite production build PASS.

- [x] `UX-004` Rà soát nghĩa từ vựng A Closer Look 1 của Tiếng Anh 6 · Học kỳ 1.
  - Kết quả: Units 1, 2, 4, 5, 6 dùng bản dịch tiếng Việt cụ thể cho từng từ/cụm từ khi nhấn “Nghe và xem nghĩa”; bỏ mô tả chung “địa điểm trong khu phố” và “vật dụng cần cho chuyến đi”. Unit 3 vốn đã hiển thị nghĩa trực tiếp cho từng tính từ.
  - Kiểm thử: frontend 183/183 PASS; TypeScript và Vite production build PASS.

- [x] `PKG-001` Đóng gói English Quest thành bộ cài Windows `.exe` độc lập.
  - Kết quả: tạo `release/EnglishQuest-Setup-1.0.0.exe` chứa frontend, backend và Python runtime; máy đích không cần Python/Node/pnpm/`.pnpm-store`. Cài theo tài khoản Windows, tạo shortcut, phục vụ tại `127.0.0.1`; dữ liệu nằm riêng trong `%LOCALAPPDATA%\EnglishQuest\data` và được giữ khi nâng cấp/gỡ.
  - Kiểm thử: frontend 182/182 PASS; backend 37/37 PASS; build production/PyInstaller PASS; cài–khởi động–UI/API–gỡ cài đặt trên artifact cuối PASS; database được giữ; SHA-256 khớp.

- [x] `NAV-001` Chuẩn hóa màn hình khởi động và điểm vào khóa học.
  - Kết quả: chưa đăng nhập vẫn mở đăng ký/đăng nhập; đã đăng nhập luôn mở Thư viện chương trình; không khôi phục khóa/Unit cũ từ `localStorage`; khi chọn khóa, renderer bắt buộc mở nhánh đầu tiên trong catalog. Tiếng Anh 6 Kỳ 1 mở tại Unit 1 → Getting Started.
  - Kiểm thử: frontend 180/180 PASS; kiểm thử riêng catalog/điều hướng 4/4 PASS; TypeScript và Vite production build PASS.

- [x] `BUG-001` Sửa launcher giữ backend cũ sau khi cập nhật làm frontend báo `Not Found`.
  - Nguyên nhân: backend cũ vẫn trả `/health` 200 nên launcher không khởi động mã mới, trong khi `/courses` trả 404.
  - Kết quả: đã khởi động lại backend; launcher kiểm tra `/courses`, catalog mặc định và `/profile/overview` trước khi coi dịch vụ sẵn sàng; backend cũ do launcher quản lý sẽ được dừng, còn tiến trình không xác định được báo lỗi rõ thay vì mở frontend hỏng.
  - Kiểm thử: PowerShell parse PASS; launcher `-NoBrowser` PASS; `/health` 200, `/courses` trả 4 khóa, OpenAPI chứa `/profile/overview`.

- [x] `PROFILE-001` Tách điểm từng môn/khóa và hiển thị tổng điểm tất cả môn trong hồ sơ học sinh.
  - Kết quả: hồ sơ có tổng tất cả môn, tổng riêng từng môn, chi tiết từng học kỳ/khóa và phần khóa đang xem; chỉ khóa `available` có nội dung mới tham gia mẫu số; Bonus luôn tách khỏi điểm học tập; giữ nguyên schema và dữ liệu cũ.
  - Kiểm thử: backend 34/34 PASS; frontend 179/179 PASS; TypeScript/Vite build PASS; QA xác nhận tổng hợp, catalog runtime và hàng rào khóa `planned` đều đạt.

- [x] `ARCH-001` Mở rộng ứng dụng thành danh mục nhiều môn, lớp và học kỳ có thể cập nhật độc lập.
  - Kết quả: đăng ký khóa hiện tại bằng mã ổn định `english-6-semester-1`; giữ nguyên schema SQLite và ID `unit1…review2`; thêm catalog runtime, thư viện chương trình, registry renderer, API profile theo khóa và hàng rào từ chối branch/activity chưa đăng ký. Tiếng Anh 6 Kỳ 2 và Toán 6 Kỳ 1–2 đã có ô `planned` nhưng không thể mở hoặc ghi nhầm tiến độ.
  - Kiểm thử: validator 0 lỗi/0 cảnh báo; backend 31/31 PASS; frontend 179/179 PASS; TypeScript và Vite production build PASS; QA vòng hai không còn lỗi chặn.

- [x] `OPS-001` Thiết lập hệ thống checkpoint và Automation tự tiếp tục.
  - Kết quả: đã tạo Automation thật `Auto Resume Project` trong Codex Desktop, kiểu heartbeat gắn với chat hiện tại, trạng thái `ACTIVE`, lịch mỗi 2 giờ; prompt chỉ tiếp tục `IN_PROGRESS`/`TODO` và cấm mua credit, reset trả phí, API trả phí riêng hoặc agent giám sát hạn mức.
  - Xác minh: `C:\Users\nvngh\.codex\automations\auto-resume-project\automation.toml` tồn tại; `id = "auto-resume-project"`, `status = "ACTIVE"`, `RRULE:FREQ=HOURLY;INTERVAL=2`, đúng `target_thread_id` hiện tại. Lượt chạy theo lịch đầu tiên vẫn cần chờ mốc kế tiếp để xác minh thực thi đầu-cuối.

- [x] `UX-003` Chỉ đọc bản hướng dẫn tiếng Anh cho kiến thức nền và ưu tiên mục âm thanh vừa chọn.
  - Kết quả: các danh sách kiến thức nền tiếng Việt của Unit 3, Review 1 và Review 2 có hướng dẫn tiếng Anh cụ thể; mục chưa định nghĩa dùng câu hướng dẫn tiếng Anh an toàn; nghe toàn bài bỏ phần mô tả/tiêu đề tiếng Việt; chọn mục mới hủy ngay âm thanh cũ rồi phát mục mới.
  - Kiểm thử: frontend 176/176 PASS; kiểm thử `SpeechQueue.replace` PASS; TypeScript và Vite production build PASS.

- [x] `UX-002` Hiển thị mô tả tiếng Việt trước câu hỏi của trò chơi.
  - Kết quả: game lựa chọn dùng chung hiển thị “Gợi ý bản dịch” và “Yêu cầu bài tập” trước nội dung tiếng Anh; School Vocabulary có bản dịch riêng cho đủ 10 gợi ý, gồm `physical activity → hoạt động thể chất`.
  - Kiểm thử: frontend 172/172 PASS; TypeScript và Vite production build PASS.

- [x] `UX-001` Chuẩn hóa âm thanh, kiến thức nền, xáo trộn đáp án, tiếp tục câu đã làm và gợi ý hồ sơ cho toàn khóa.
  - Kết quả: thêm nghe toàn bài và nghe từng mục; hội thoại/từ vựng mở bản dịch hoặc ghi chú; kiến thức nền xuất hiện cuối mọi game dùng chung và cuối phần Unit 3; đáp án xáo trộn ổn định; câu đã chấm cho chọn bỏ qua/làm lại; backend phân biệt `scored`/`skipped`; hồ sơ liệt kê tối đa 5 câu bỏ qua và 5 câu yếu mỗi hoạt động.
  - Kiểm thử: frontend 171/171 PASS; backend 29/29 PASS; TypeScript và Vite production build PASS.

- [x] `CHK-001` Kiểm thử vòng đời checkpoint bằng thay đổi Markdown an toàn.
  - Kết quả: PASS — đủ 3 tệp điều phối, đủ 4 nhóm trạng thái, đúng 1 mục `IN_PROGRESS` trong lúc chạy và checkpoint chỉ đúng nhiệm vụ hiện hành.
  - Sau kiểm thử, mục thử đã chuyển sang `DONE`; không còn nhiệm vụ đang chạy.

## BLOCKED

- Không có.

## Quy tắc chuyển trạng thái

1. Trước khi sửa mã cho một nhiệm vụ, chuyển nhiệm vụ từ `TODO` sang `IN_PROGRESS` và ghi thời điểm/bước kế tiếp trong `CHECKPOINT.md`.
2. Sau khi kiểm thử thành công, chuyển sang `DONE` và ghi lệnh kiểm thử cùng kết quả thực tế.
3. Nếu không thể tiếp tục an toàn, chuyển sang `BLOCKED`, mô tả nguyên nhân và dữ liệu cần từ người dùng.
4. Mỗi lần chỉ có tối đa một nhiệm vụ `IN_PROGRESS`, trừ khi người dùng yêu cầu làm song song rõ ràng.
