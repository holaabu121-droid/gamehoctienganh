# English Quest — Checkpoint

## Trạng thái hiện tại

- Cập nhật: 2026-11-18 (UTC).
- Nhiệm vụ hiện tại: không còn nhiệm vụ `IN_PROGRESS` hoặc `TODO`.
- Kết quả gần nhất: `MATH-VISUAL-AUDIT-001` hoàn tất ở mức thiết kế; chưa triển khai thay đổi giao diện.

## Bước tiếp theo

1. Chờ người dùng duyệt bản thiết kế và chọn phạm vi triển khai; không tự sửa renderer từ báo cáo này.
- Git: đã khởi tạo tại dự án với nhánh `main`; bản phát hành có nhánh `stable/1.1` và tag `v1.1.0`. Artifact/phụ thuộc/runtime/database cục bộ được loại khỏi lịch sử.
- Phạm vi đã xác minh: dự án React/TypeScript/Vite trong `frontend`, FastAPI/SQLite trong `backend`, học liệu trong `data`, validator trong `scripts`.

## Kết quả hoàn tất MATH-VISUAL-AUDIT-001

- Kiểm kê xác nhận 74 nhánh Toán: 43 bài chính và 31 phần luyện tập, ôn tập, trải nghiệm; hiện chỉ Bài 6, 23, 40 có trực quan biên soạn riêng, phần còn lại dùng 13 chế độ chung.
- Phát hiện ghép sai có bằng chứng: Bài 3 rơi vào mô hình tập hợp; Bài 10 và một số ôn tập Chương II rơi vào trục số; Bài 15–17 cùng dùng trục số dù quy trình khác nhau.
- Báo cáo quy định `visualKey` riêng cho 43 bài; mô tả hình, thao tác và tự kiểm tra từng bài. 31 phần tổng hợp dùng `representationKey` theo từng câu, không ép một hình cho cả phần.
- Phương án ưu tiên: sửa ghép sai → quy trình dễ nhầm → biểu tượng hình học/dữ liệu → hợp nhất nhánh tổng hợp; giữ và mở rộng ba mô hình tốt hiện có.
- Tệp mới: `docs/MATH_RULE_VISUAL_AUDIT_2026-11-18.md`. Không sửa mã giao diện, học liệu, đáp án hoặc điểm.
- Kiểm tra: đủ dãy Bài 1–43, đủ tổng 74 nhánh/31 nhánh bổ sung, `git diff --check` PASS.

## Kết quả hoàn tất TTS-VI-NUMBERS-001

- Nguyên nhân: Web Speech nhận nguyên chuỗi hiển thị như `7 000 000`, coi các nhóm cách nhau là những số rời và đọc từng số 0.
- `SpeechQueue` nay chỉ với ngôn ngữ `vi-*` sẽ bỏ khoảng trắng thường, khoảng trắng không ngắt và khoảng trắng hẹp nằm trong số nguyên được nhóm từng ba chữ số.
- Ví dụ đã khóa bằng hồi quy: `7 000` → `7000`, `70 000` → `70000`, `700 000` → `700000`, `7 000 000` → `7000000`, `7 110 385` → `7110385`.
- Chuỗi tiếng Anh và các khoảng trắng thông thường không đổi; giao diện vẫn hiển thị số có phân nhóm dễ đọc.
- Tệp sửa: `frontend/src/features/word-magnet/speechQueue.ts`, `frontend/tests/speechQueue.test.mjs`.
- Kiểm thử: SpeechQueue 3/3 PASS; toàn frontend 399/399 PASS; TypeScript/Vite production build PASS 272 modules.

## Kết quả hoàn tất MATH-BLANK-SCREEN-001

- Lỗi runtime xác nhận trên tab Edge: `Failed to fetch dynamically imported module` cho asset `MathLesson3` cũ; HTML/build mới đã tạo tên hash khác nên phiên đang mở không còn tải được tệp cũ.
- Thêm `AppRecoveryBoundary`: bắt lỗi render, tự tải lại đúng một lần trong cửa sổ 60 giây khi asset tải trễ bị cũ, và hiện màn hình khôi phục có nút tải lại nếu lỗi vẫn còn.
- Bắt sự kiện `vite:preloadError` dùng cùng cơ chế khôi phục; giữ nguyên dữ liệu tài khoản, điểm, tiến độ và nội dung Toán.
- Tệp chính: `frontend/src/components/AppRecoveryBoundary.tsx`, `frontend/src/main.tsx`, `frontend/src/styles.css`, `frontend/tests/runtimeRecovery.test.mjs`.
- Kiểm thử: hồi quy 3/3 PASS; toàn frontend 397/397 PASS; TypeScript/Vite production build PASS 272 modules; `git diff --check` PASS.
- Click-through thật trên Edge tại cổng 4173: Bài 1, Bài 2 và Bài 3 đều hiển thị tiêu đề, năm nhóm kiến thức nền và nút “Bắt đầu 6 trò chơi”; không phát sinh lỗi runtime mới sau build.

## Kết quả hoàn tất UI-HIERARCHY-001

- `SkillsSection` có `questionEmphasis`: mặc định `context` cho toàn bộ Tiếng Anh; Science khai báo `context`; Math, Informatics và Vietnamese khai báo `prompt`.
- Với `context`: ý chính hiển thị bằng tiêu đề lớn trước, phần “Nhận biết/Chọn…” chuyển thành hộp gợi ý nhỏ. Với `prompt`: mức độ/bối cảnh dùng chữ nhỏ và câu hỏi là tiêu đề chính.
- CSS mới tách `skills-primary-question`, `skills-question-context` và `skills-secondary-guidance`; áp dụng cả game thường lẫn luyện nghe tính giờ.
- Tệp chính: `SkillsSection.tsx`, `styles.css`, các renderer Math/Informatics/Vietnamese/Science và `questionHierarchy.test.mjs`.
- Kiểm thử: hierarchy 3/3 PASS; frontend 394/394 PASS; TypeScript/Vite build PASS 271 modules; không thay backend hoặc dữ liệu học liệu.
- Thử mở UI localhost bằng trình duyệt nội bộ thất bại do `ERR_CONNECTION_TIMED_OUT`; chưa có xác minh trực quan trên thiết bị thật.
- Không có bước tự động tiếp theo; chờ người dùng xem giao diện và phản hồi về kích thước/màu sắc thực tế.

## Kết quả hoàn tất APP-FULL-AUDIT-001

- Kiểm kê: 10 khóa, 5 môn, 174 nhánh, 1.476 hoạt động và tổng tối đa 1.476.500 điểm; điểm khóa, môn và toàn hệ thống được tách/cộng đúng theo kế hoạch.
- Sửa lỗi bộ sinh Khoa học tự nhiên làm lùi manifest/báo cáo về trạng thái độc lập; báo cáo mới phản ánh đúng catalog, renderer, tiến độ và hồ sơ đã tích hợp.
- Tách tải 55 bài Khoa học tự nhiên: bỏ khối khoảng 24 MB, giữ `ScienceBranch` 13,26 KB và mỗi bài khoảng 24–31 KB gzip; có trạng thái tải/lỗi và hồi quy nguồn.
- Kiểm thử cuối: frontend 391/391; backend 64/64; học liệu 46/46; Science gate PASS 55 bài/330 game/3.300 câu/9.900 phản hồi; validator 0 lỗi/0 cảnh báo; dependency/compile PASS; production build 271 modules.
- Đánh giá Science mô phỏng sau đồng bộ: học sinh 74/100, giáo viên 84/100, chuyên gia 74/100; vẫn `NOT_READY` cho phát hành học sinh vì chưa có mô phỏng tương tác, người thật và accessibility.
- Tồn tại: khối chính 525,20 KB trước nén; chưa click-through/TTS/accessibility/390 px trên thiết bị thật; bộ cài 1.2.0 hiện có tạo trước vòng sửa cuối và cần build lại trước phát hành.
- Không có bước tự động tiếp theo. Chỉ mở nhiệm vụ mới khi người dùng yêu cầu rõ.

## Kết quả hoàn tất INTEGRATE-STANDALONE-SUBJECTS-001

- Catalog chính có 10 khóa khả dụng thuộc 5 môn: Tiếng Anh, Toán, Tin học, Ngữ văn và Khoa học tự nhiên; Khoa học tự nhiên học kỳ 1 gồm Bài 1–28, học kỳ 2 gồm Bài 29–55.
- Renderer mới dùng chỉ mục bài học nhẹ ở lúc mở ứng dụng và tải trễ gói 55 bài khi vào môn; điều hướng hiển thị số/tên bài, Hồ sơ và nút về Thư viện.
- Backend đăng ký 55 nhánh × 6 hoạt động = 330 game, tổng tối đa 330.000 điểm; hồ sơ có nhãn bài, điểm từng học kỳ, tổng môn và tổng tất cả môn.
- Mỗi bài giữ 5 chặng/10 thẻ, 60 câu, lộ trình 3-4-2-1 và chẩn đoán riêng cho từng đáp án sai. Mô phỏng/ứng dụng thực tế không chấm điểm, có cảnh báo phụ huynh/giáo viên.
- Tệp chính: `data/curriculum/catalog.json`, `frontend/src/features/science6/`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/db.py`, hồ sơ/nhãn/styles và các kiểm thử liên quan.
- Kiểm thử: frontend 391/391 PASS; backend 61/61 PASS; Science data gate PASS 55 bài/330 game/3.300 câu/9.900 phản hồi; Science hồi quy 8/8 PASS; TypeScript/Vite production build PASS 270 modules.
- Giới hạn trung thực: đánh giá ba vai trò vẫn `PASS_WITH_RELEASE_BLOCKERS` (69/80/62) vì mô phỏng trực quan mới là đặc tả, chưa có giáo viên bộ môn thật duyệt toàn bộ, học sinh thật thí điểm hoặc click-through/accessibility trên thiết bị thật.

## Kết quả hoàn tất COMPUTER6-DEPTH-002

- Đã rà lại đủ 6 chủ đề/Bài 1–17 và cập nhật `data/informatics6/CURRICULUM_RESEARCH.md` với lộ trình năm phần cùng ý tưởng trọng tâm riêng cho từng bài.
- Mỗi bài tăng từ bốn lên sáu hạt kiến thức và từ tám lên 12 thẻ không trùng; toàn môn có 102 hạt, 204 thẻ, 85 phần học, 17 rubric, 102 game, 1.020 câu và 3.060 phản hồi chẩn đoán.
- Bản đồ bài học mới gồm khởi động, hình thành kiến thức, luyện quy trình, chẩn đoán–sửa sai và vận dụng–sản phẩm. Rubric bốn tiêu chí không tự động chấm thao tác thật.
- Giữ nguyên branch/activity ID, sáu năng lực, lộ trình 3-4-2-1, điểm tối đa 102.000 và dữ liệu tiến độ hiện có. Thực hành nhạy cảm tiếp tục dùng dữ liệu giả và yêu cầu người lớn cho phép/hướng dẫn.
- Kiểm thử: Tin học/catalog 25/25 PASS; toàn frontend 388/388 PASS; backend 63/63 PASS; đánh giá ba vai trò 6/6 PASS; production build PASS 210 modules; validator 0 lỗi/0 cảnh báo; `git diff --check` không có lỗi khoảng trắng.
- Mô phỏng AI mới: học sinh 88/100, giáo viên 90/100, chuyên gia ứng dụng giáo dục 85/100. Đây không phải nghiệm thu người thật; chưa hoàn tất click-through UI, thẩm âm TTS hoặc accessibility trên thiết bị gia đình.
- Báo cáo: `data/informatics6/reports/three-role-evaluation.md` và `.json`.

## Kết quả hoàn tất VIETNAMESE6-FULL-002

- Đã đối chiếu phạm vi hai SGK với hai khung nghiên cứu trước đó và tạo ma trận tại `data/vietnamese6/CURRICULUM_REVIEW.md`: Bài 1–10 cùng Ôn tập I–II, bao phủ Đọc, Thực hành tiếng Việt, Viết, Nói-nghe và dự án.
- Hai khóa `vietnamese-6-semester-1` và `vietnamese-6-semester-2` đã mở trong catalog. Mười hai nhánh có 144 thẻ giảng dạy, 61 kế hoạch phần học, 72 game, 720 câu và 2.160 phản hồi sai bốn phần.
- Mỗi nhánh có sáu năng lực và mỗi game đi đúng 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách. Câu mở dùng rubric, phương án hư cấu và rào chắn không buộc học sinh chia sẻ dữ liệu riêng tư.
- Điểm được lưu riêng theo học kỳ, cộng đúng tổng môn Ngữ văn và tổng tất cả môn; không đổi ID hoặc nội dung các môn hiện có.
- Frontend 388/388 PASS; backend 62/62 PASS; kiểm thử ba vai trò 6/6 PASS; TypeScript/Vite build PASS 210 modules; validator nguồn 0 lỗi/0 cảnh báo; `git diff --check` được chạy ở vòng chốt.
- Mô phỏng AI: học sinh 88/100, giáo viên giảng dạy 87/100, chuyên gia ứng dụng giáo dục 85/100. Sản phẩm kỹ thuật sẵn sàng; dùng lớp học có điều kiện và phát hành rộng vẫn cần giáo viên/học sinh thật thí điểm.
- Báo cáo: `data/vietnamese6/reports/three-role-evaluation.md` và `.json`. Công cụ trình duyệt không truy cập được localhost nên chưa có bằng chứng click-through UI, thẩm âm hoặc kiểm thử trình đọc màn hình người thật.

## Kết quả hoàn tất COMPUTER6-TRIROLE-001

- Đã tạo bộ đánh giá tái chạy được tại `scripts/evaluate_informatics6_three_roles.mjs` và bộ kiểm thử tại `scripts/tests/informatics6_three_roles.test.mjs`.
- Học sinh mô phỏng: 86/100. Mô phỏng đủ 1.020 câu; mỗi câu chọn một đáp án sai, nhận phản hồi đúng hợp đồng bốn phần rồi sửa đúng. Kết quả: 1.020/1.020 phản hồi hiển thị, 1.020/1.020 sửa đúng, 0 dữ liệu không hợp lệ.
- Giáo viên giảng dạy: 84/100. Đủ 17 bài, 6 chủ đề, 68 mục tiêu, 102 game và lộ trình 3-4-2-1; hạn chế chính là bốn hạt kiến thức/bài, thiếu rubric thực hành, hoạt động nhóm và bảng điều khiển giáo viên.
- Chuyên gia ứng dụng giáo dục: 84/100. Điểm mạnh là thiết kế nhất quán, 3.060 phản hồi chẩn đoán, rào chắn an toàn và điểm riêng môn/tổng môn; chưa có dữ liệu người thật, kiểm thử đọc màn hình/TTS bằng tai hoặc đo hiệu quả trước-sau.
- Kết luận: sản phẩm kỹ thuật `READY`; dùng gia đình `READY_WITH_ADULT_SUPPORT`; dùng trên lớp `CONDITIONAL_READY`; phát hành rộng `PILOT_REQUIRED`.
- Báo cáo: `data/informatics6/reports/three-role-evaluation.md` và `data/informatics6/reports/three-role-evaluation.json`.
- Kiểm thử: `node --test scripts/tests/informatics6_three_roles.test.mjs` — 6/6 PASS; `frontend: node --test tests/informatics6Full.test.mjs tests/courseCatalog.test.mjs` — 25/25 PASS; `git diff --check` không có lỗi khoảng trắng, chỉ cảnh báo chuyển LF/CRLF.
- Giới hạn trung thực: đây là mô phỏng AI trên mã nguồn/dữ liệu, không phải học sinh thật, giáo viên thật hay chứng nhận chuyên gia; chưa hoàn tất click-through UI localhost và thẩm âm TTS.

## Kết quả hoàn tất COMPUTER6-FULL-001

- Đã đối chiếu SGK Tin học 6 Kết nối tri thức: 6 chủ đề, Bài 1–17, phạm vi trang 6–81 và thuật ngữ từ trang 82.
- Hai khóa mới: Tin học 6 Học kỳ 1 có Bài 1–9; Học kỳ 2 có Bài 10–17. Cả hai dùng chung subject `informatics`, nên hồ sơ có điểm từng học kỳ, tổng môn Tin học và tổng tất cả môn.
- Quy mô: 17 bài, 68 khái niệm cốt lõi, 136 thẻ giảng dạy, 17 trực quan, 102 game, 1.020 câu và 3.060 phản hồi chẩn đoán bốn phần; mỗi game theo 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách.
- Sáu năng lực thống nhất: nhận biết, quy trình, giải thích có căn cứ, bắt lỗi, kết nối tình huống và vận dụng an toàn.
- Tìm kiếm Web, email, an toàn số, soạn thảo và dự án tổng hợp đều có rào chắn quyền riêng tư/cho phép người lớn. Bài 14 ghi rõ sản phẩm thực hành thật không chấm tự động.
- Tệp chính: `frontend/src/features/informatics6/`, `frontend/tests/informatics6Full.test.mjs`, `data/informatics6/CURRICULUM_RESEARCH.md`, `data/curriculum/catalog.json`, `frontend/src/curriculum/courseRegistry.ts`, `frontend/src/App.tsx`, `backend/app/db.py`.
- Kiểm thử: frontend 373/373 PASS; backend 61/61 PASS; production build PASS 206 modules; `git diff --check` chỉ có cảnh báo chuyển dòng, không có lỗi khoảng trắng.
- Smoke test gói chạy: version 1.2.0, status ok, integrity ok, 6 khóa, Tin học đủ 9+8 bài. Bộ cài `release/EnglishQuest-Setup-1.2.0.exe`, SHA-256 `bddae7ab26574c0c37f866bece04a76b21e79fcad05c0a3551c1305cece9858f`.
- UI automation qua Edge không hoàn tất vì công cụ Computer Use dừng khi không xác định chắc URL localhost; không có bằng chứng click-through/tai nghe TTS người thật. Không ảnh hưởng kết quả build, API hoặc smoke test gói chạy.

## Kết quả hoàn tất VIETNAMESE6-S2-RESEARCH-001

- Đã đối chiếu PDF người dùng cung cấp gồm 122 trang PDF, tập trung trang in 4–108; kiểm kê đủ Bài 6–10 và Ôn tập học kỳ II.
- Ma trận nêu rõ thể loại/văn bản, thực hành tiếng Việt, viết, nói-nghe và giá trị thái độ của từng bài.
- Khung Bài 6–9 gồm 7 chặng; Bài 10 dùng hồ sơ đọc 6 chặng thay vì ép thành game trắc nghiệm.
- Đã đề xuất 6 năng lực, 30 khuôn luyện tập, gói game riêng cho từng bài và lộ trình 3-4-2-1 cho câu khách quan.
- Có 14 nhóm lỗi chẩn đoán; mỗi lựa chọn sai phải nêu loại lỗi, lí do sai, cách sửa và thẻ cần ôn.
- Đã bổ sung quy tắc nguồn, bản quyền, dữ kiện lịch sử/môi trường, quan điểm mở, quyền riêng tư và hoạt động an toàn.
- Báo cáo: `data/vietnamese6_s2_research/PRACTICE_FRAMEWORK.md`.
- Kiểm tra cấu trúc PASS: đủ 5 bài, Ôn tập học kỳ II, 30 khuôn, hồ sơ Bài 10, độ khó 3-4-2-1, chẩn đoán, provenance và quyền riêng tư; `git diff --check` PASS.
- Không chạy test ứng dụng vì chỉ thêm báo cáo Markdown; không thay đổi catalog, frontend, backend hoặc dữ liệu điểm.

## Kết quả hoàn tất VIETNAMESE6-S1-RESEARCH-001

- Đã đối chiếu PDF người dùng cung cấp gồm 138 trang PDF, tập trung trang in 8–131; kiểm kê đủ năm bài và phần Ôn tập học kỳ I.
- Ma trận nêu rõ văn bản/thể loại, kiến thức tiếng Việt, viết, nói-nghe và giá trị thái độ của từng bài.
- Khung đề xuất gồm 7 chặng, 6 năng lực chung, 24 khuôn luyện tập và 6 game gợi ý riêng cho mỗi bài.
- Câu khách quan theo lộ trình 3 cơ bản – 4 thông hiểu – 2 vận dụng – 1 thử thách; sáng tạo, cảm xúc và trải nghiệm cá nhân dùng rubric hoặc không chấm điểm.
- Đã thiết kế 10 nhóm lỗi chẩn đoán; mỗi phương án sai phải có loại lỗi, lý do sai, cách sửa và thẻ cần ôn.
- Đã bổ sung rào chắn bản quyền, nguồn `source-derived`/`ai-generated`, nội dung nhạy cảm, ghi âm cục bộ và quyền bỏ qua trải nghiệm riêng.
- Báo cáo: `data/vietnamese6_s1_research/PRACTICE_FRAMEWORK.md`.
- Kiểm tra cấu trúc báo cáo PASS: đủ 5 bài, Ôn tập học kỳ I, 24 khuôn, độ khó 3-4-2-1, chẩn đoán, provenance và quyền riêng tư; `git diff --check` PASS.
- Không chạy test ứng dụng vì chỉ thêm báo cáo Markdown; không thay đổi catalog, frontend, backend hoặc dữ liệu điểm.

## Kết quả hoàn tất SCIENCE6-TEMPLATES-002

- Ngân hàng có 18 khuôn; mỗi bài lấy sáu khuôn khác nhau, luân phiên theo chu kỳ ba bài. Sáu khuôn đầu được dùng 190 câu/khuôn, mười hai khuôn còn lại 180 câu/khuôn.
- Giữ nguyên 6 game × 10 câu/bài, tổng 3.300 câu và lộ trình 3-4-2-1. Không giảm xuống sáu câu tổng vì sẽ làm mất ngân hàng luyện tập và phân hóa.
- Mọi câu có căn cứ `reviewed-foundation-only-no-external-claim`, trỏ đúng thẻ, trang nguồn và vật liệu đã duyệt. Cổng kiểm tra đáp án/lời giải bám sự kiện-căn cứ-kết quả; phương án sai ghi `intentionally-incorrect-distractor`.
- Tải đọc sau tối ưu: 42,2 từ/câu dẫn, tối đa 64; 2.538/3.300 câu dẫn trên 35 từ. Phương án trung bình 28,3 từ; 4.202/13.200 phương án trên 30 từ.
- Kiểm thử: 55/55 cổng bài riêng PASS và SHA báo cáo đã cập nhật; data gate PASS; Node PASS 34/34; mô phỏng học sinh PASS 3.300 câu; cấu trúc giáo viên 5/5; validator nguồn 0 lỗi/0 cảnh báo.
- Báo cáo ba vai trò mới: học sinh mô phỏng 69/100, giáo viên giảng dạy mô phỏng 80/100, chuyên gia ứng dụng giáo dục mô phỏng 62/100. Vẫn NOT_READY cho phát hành học sinh vì chưa có renderer/UI và người thật.
- Tệp chính: `data/science6_pilot/source/science6PresentationTemplates.mjs`, `scripts/build_science6_pilot.mjs`, `scripts/validate_science6_pilot.mjs`, `scripts/tests/science6_templates18.test.mjs`, dữ liệu 55 bài và các báo cáo sinh lại.

## Kết quả hoàn tất SCIENCE6-TRIROLE-001

- Báo cáo ba vai trò sau nâng cấp 18 khuôn: học sinh mô phỏng 69/100; giáo viên giảng dạy mô phỏng 80/100; chuyên gia ứng dụng giáo dục mô phỏng 62/100.
- Bằng chứng: 55 bài, 330 game, 3.300 câu không trùng nguyên văn, 550 bối cảnh, 9.900 phản hồi; mọi câu có luồng sai → chẩn đoán → sửa đúng.
- Tải đọc: trung bình 42,2 từ/câu hỏi và 28,3 từ/phương án; 4.202/13.200 phương án dài trên 30 từ. Toàn gói có 18 khuôn biểu diễn nhưng mọi mô phỏng vẫn `specification-only`.
- Kết luận phát hành: gói dữ liệu `READY`; dùng trực tiếp trên lớp `CONDITIONAL_NOT_READY`; phát hành học sinh `NOT_READY`.
- Điều kiện chặn: chưa có renderer/UI tích hợp; chưa được giáo viên Khoa học tự nhiên thật duyệt 55 bài; chưa thí điểm học sinh lớp 6 và khả năng tiếp cận.
- Kiểm thử: đánh giá ba vai trò và hồi quy PASS 13/13; science data gate PASS; validator nguồn chung 0 lỗi/0 cảnh báo; `git diff --check` không có lỗi khoảng trắng.
- Tệp mới: `scripts/evaluate_science6_three_roles.mjs`, `scripts/tests/science6_three_roles.test.mjs`, `data/science6_pilot/reports/three-role-evaluation.md` và `.json`.

## Kết quả hoàn tất SCIENCE6-FULL-001

- Hoàn tất đủ Bài 1-55, mười chương và đúng thứ tự sách; manifest `standalone-complete`, phiên bản nội dung 1.0.0.
- Quy mô: 275 chặng, 550 thẻ, 330 game, 3.300 câu, 9.900 phản hồi; 990 cơ bản, 1.320 thông hiểu, 660 vận dụng, 330 thử thách.
- Từng Bài 1-55 PASS riêng 1/6/60/180/0 và có báo cáo tại `data/science6_pilot/reports/lessons/`.
- Cổng tổng PASS 8/8; test hồi quy gói và Bài 1-10 PASS 16/16; validator nguồn chung 0 lỗi/0 cảnh báo; `git diff --check` không có lỗi khoảng trắng.
- Mô phỏng học sinh PASS 3.300/3.300 câu, nhận đủ phản hồi sau lượt sai và sửa đúng 3.300/3.300; điểm thực hành bằng 0.
- Đánh giá cấu trúc giáo viên 5/5. Giới hạn: engine câu chung còn cần giáo viên rà độ tự nhiên/phân hóa; mô phỏng chưa có renderer; chưa thử học sinh thật hoặc UI.
- Báo cáo tổng: `data/science6_pilot/reports/full55-evaluation.md` và `full55-evaluation.json`.
- Tệp chính: `data/science6_pilot/source/science6PilotSource.mjs`, `science6RemainingSource.mjs`, `data/science6_pilot/lessons/`, `scripts/build_science6_pilot.mjs`, `scripts/validate_science6_pilot.mjs`, `scripts/tests/science6_full55.test.mjs`, `scripts/evaluate_science6_full55.mjs`.

## Tiến độ SCIENCE6-FULL-001

- Bài 1 — Giới thiệu về khoa học tự nhiên: **PASS** cổng riêng.
- Bài 3 — Sử dụng kính lúp: **PASS** cổng riêng.
- Bài 4 — Sử dụng kính hiển vi quang học: **PASS** cổng riêng.
- Bài 5 — Đo chiều dài: **PASS** cổng riêng.
- Bài 6 — Đo khối lượng: **PASS** cổng riêng.
- Bài 7 — Đo thời gian: **PASS** cổng riêng.
- Bài 9 — Sự đa dạng của chất: **PASS** cổng riêng.
- Bài 10 — Các thể của chất và sự chuyển thể: **PASS** cổng riêng.
- Đã đối chiếu trang in 7–10; tạo 5 chặng/10 thẻ, 6 năng lực × 10 câu, 180 phản hồi chẩn đoán, mô phỏng và ứng dụng thực tế đều 0 điểm.
- Tám bài mới đều có 5 chặng/10 thẻ, 6 năng lực × 10 câu, 180 phản hồi chẩn đoán/bài; mô phỏng và ứng dụng thực tế đều 0 điểm, có cảnh báo và giám sát. Bài 2 và 8 kế thừa từ gói thí điểm đã PASS.
- Kiểm thử riêng: đủ Bài 1-10 đều có báo cáo PASS 1/6/60/180/0.
- Cổng nghiệm thu một lượt Bài 1-10: PASS 8/8 phép kiểm; 10 bài/50 chặng/100 thẻ/60 game/600 câu/1.800 phản hồi; 180 cơ bản, 240 thông hiểu, 120 vận dụng, 60 thử thách; đáp án đúng phân bố 150/140/150/160 ở bốn vị trí.
- Mô phỏng học sinh Bài 1-10: PASS 600/600 câu, nhận phản hồi sau 600/600 lượt chọn sai và sửa đúng 600/600; điểm thực hành 0.
- Đánh giá cấu trúc giáo viên: 5/5; đây là đánh giá vai trò AI, chưa phải nghiệm thu người thật hoặc UI.
- Cổng toàn gói hiện có: PASS 16 bài/96 game/960 câu/160 thẻ/2.880 phản hồi/0 thực hành có điểm; test gói 8/8 PASS; validator dữ liệu chung 0 lỗi/0 cảnh báo.
- Báo cáo tổng: `data/science6_pilot/reports/first10-evaluation.md` và `first10-evaluation.json`; báo cáo riêng đủ 10 bài tại `data/science6_pilot/reports/lessons/`.
- Tệp sửa chính: `data/science6_pilot/source/science6PilotSource.mjs`, `scripts/build_science6_pilot.mjs`, `scripts/validate_science6_pilot.mjs`, `scripts/evaluate_science6_pilot.mjs`, `scripts/lib/science6PilotAudit.mjs`, `scripts/tests/science6_pilot.test.mjs` và dữ liệu/báo cáo sinh lại.
- Bước tiếp theo được mở: nghiên cứu và xây dựng Bài 11.

## Kết quả hoàn tất SCIENCE6-PILOT-001

- Gói độc lập nằm tại `data/science6_pilot`; manifest xác nhận chưa đăng ký catalog, renderer hoặc activity plan.
- Tám bài: 2, 8, 17, 21, 26, 42, 48 và 53. Mỗi bài có 5 chặng/10 thẻ, đặc tả mô phỏng và 6 game năng lực x 10 câu.
- Tổng 480 câu theo đúng 144 cơ bản, 192 thông hiểu, 96 vận dụng và 48 thử thách; mỗi câu thử thách có bốn thao tác bắt buộc.
- Có 1.440 phản hồi sai gồm loại lỗi, vì sao sai, cách sửa, thẻ cần ôn và mã chẩn đoán. Phương án nhiễu dùng ngộ nhận riêng, không mượn đáp án đúng của câu khác.
- Có 80 tiêu chí phân loại/nhóm/quy tắc khoa học riêng; representation chứa payload cảnh, lưới, bảng, sơ đồ nguyên nhân, quy trình hoặc lập luận.
- Tất cả `practical_application` và simulation đều không chấm điểm; ứng dụng thực tế có mức giám sát, cảnh báo, việc được phép và việc cấm.
- Kiểm thử: validator riêng PASS 8 bài/48 game/480 câu/1.440 feedback/0 practical score; Node test PASS 8/8; validator toàn dự án PASS 0 lỗi/0 cảnh báo.
- Mô phỏng logic học sinh cố ý sai rồi sửa đúng PASS 480/480; báo cáo ghi rõ đây không phải học sinh/UI thật. Đánh giá vai trò giáo viên chỉ chấm cổng cấu trúc; QA độc lập vòng ba PASS, còn hai ghi chú P2 không chặn cho giai đoạn renderer/ngân hàng mở rộng.
- Tệp chính: `data/science6_pilot/**`, `scripts/build_science6_pilot.mjs`, `scripts/validate_science6_pilot.mjs`, `scripts/evaluate_science6_pilot.mjs`, `scripts/lib/science6PilotAudit.mjs`, `scripts/tests/science6_pilot.test.mjs`.

## Kết quả hoàn tất RELEASE-DATA-GIT-002

- Phiên bản chuẩn nằm tại `VERSION=1.1.0`; `frontend/package.json`, FastAPI, launcher, PyInstaller và installer cùng giá trị. Script build dừng nếu có lệch phiên bản.
- Database schema v2: tự tạo SQLite backup trước migration, nâng v1 thiếu `status` mà giữ dữ liệu, dùng WAL/busy timeout, `quick_check`, báo version qua `/health` và từ chối schema mới hơn ứng dụng.
- Hồ sơ có xuất/nhập JSON theo tài khoản. Gói không chứa PIN/hash/session; restore kiểm tra branch/activity/điểm, tự lưu snapshot, gộp điểm tốt nhất và không nhân đôi lịch sử khi nhập lại.
- HTTP smoke thật: health `ok`, version `1.1.0`, schema `2`, integrity `ok`; xuất 1.832 byte, khôi phục 1 hoạt động/10 câu và tài khoản đích đạt 1.000 điểm.
- Bộ cài `release/EnglishQuest-Setup-1.1.0.exe`, 26.668.855 byte, SHA-256 `aed03e92b069794bb02d875ce7ca4e537e72a0ee8c7aadfecfdcf5626b098ffc`.
- E2E bộ cài trong vùng thử: executable chạy, catalog 4 khóa, schema/integrity đúng, database tạo ngoài thư mục chương trình và còn sau gỡ. Trình dọn có thể để lại thư mục chương trình rỗng trong vùng thử nhưng không để lại executable.
- Kiểm thử cuối: validator 0 lỗi/0 cảnh báo; backend 61/61; frontend 354/354; TypeScript/Vite production build PASS; PyInstaller app/setup PASS.
- Git: `.gitignore` loại môi trường, cache, build/release và dữ liệu học sinh; commit phát hành được gắn nhánh `stable/1.1` và tag chú thích `v1.1.0`.

## Kết quả hoàn tất MATH-STUDENT-E2E-001

- Môi trường thử tách biệt: backend `127.0.0.1:8766`, SQLite `.run/student-e2e-host-20261114.db`, tài khoản giả lập `student_qa_1114`; dữ liệu gia đình không bị đọc hoặc sửa.
- Luồng đạt: đăng nhập → Thư viện → Toán 6 Kỳ 1 → Bài 1; khóa mở đúng bài đầu, đủ 38 nút điều hướng và Bài 5–6 không bị che.
- Bài học đạt: mục tiêu, trực quan tập hợp có thanh trượt, 5 khối/10 thẻ bài giảng và 6 trò chơi năng lực đều hiển thị.
- Trò chơi đạt: phản hồi sai nêu lỗi/nguyên nhân/cách sửa/thẻ ôn; trợ giúp riêng theo chủ đề; điểm giảm khi dùng trợ giúp; trạng thái đọc/lưu hiển thị; câu đã chấm có bỏ qua/làm lại; tải lại tiếp tục đúng câu dở.
- Lỗi tìm thấy và đã sửa: `ChoiceGame` từng dùng key chứa `initialIndex`, nên sau khi lưu câu cuối, refresh tiến độ dựng lại game ở câu 1 trước nút “Hoàn thành”. Key nay ổn định theo `activityId`, cho phép bấm “Hoàn thành” và ghi trạng thái activity.
- Xác minh sau sửa bằng UI thật: hoàn thành game “Thực hiện quy trình” 10/10, trở về hub với dấu `✓`, tải lại vẫn còn `1/6` và dấu hoàn thành.
- Xác minh API: `activity_completed=True`, `activity_score=992`, `saved_questions=10`, `course_score=1966`, `course_completed=1`, `math_total=1966`, `grand_total=1966`, `grand_completed=1`.
- Hồ sơ UI khớp: tổng 1.966, môn Toán 1.966, Toán Kỳ 1 1.966, Bài 1 1.966/6.000 và 1/6 hoạt động; danh sách câu yếu hiển thị riêng cho hai game.
- Kiểm thử: `learningUx.test.mjs` PASS 12/12; toàn frontend PASS 352/352; TypeScript và Vite production build PASS, 202 modules.
- Giới hạn/phát hiện còn lại: viewport 390 px có `bodyScrollWidth=627` trong khi `bodyClientWidth=375`, tức trang Hồ sơ còn cuộn ngang. Trạng thái TTS đã quan sát trên UI nhưng chưa thẩm âm bằng tai.

## Kết quả hoàn tất MATH-DEEP-CURRICULUM-004

- Bảy phần viết tay gồm Bài 1–5, Luyện tập chung và Bài tập cuối Chương I vẫn giữ nguyên ID hoạt động, 60 câu/phần và điểm tối đa.
- Game 1–2 tiếp tục chấm nhận biết và quy trình. Game 3 buộc chọn lời giải thích đúng; Game 4 đưa một phương án sai để học sinh chẩn đoán và sửa; Game 5 ghép hai nhiệm vụ theo thứ tự A–B; Game 6 yêu cầu kết quả kèm căn cứ trong tình huống quyết định.
- Mọi câu biến đổi vẫn chứa bài toán, đáp án và lời giải gốc để bảo toàn mốc SGK; nhiệm vụ dẫn xuất được gắn `ai-generated`. Phản hồi sai tiếp tục có đủ lỗi, nguyên nhân, cách sửa và thẻ cần ôn.
- Tệp mã chính: `frontend/src/features/math6/mathCurriculumDepth.ts`, `structuredMathLessonEngine.ts`, `structuredMathReviewEngine.ts`, `mathLesson1Engine.ts`.
- Tệp kiểm thử: `frontend/tests/mathLesson1Engine.test.mjs`, `mathLesson2Engine.test.mjs`, `mathLesson3Engine.test.mjs`, `mathLesson4Engine.test.mjs`, `mathLesson5Engine.test.mjs`, `mathChapter1PracticeEngine.test.mjs`, `mathChapter1ReviewEngine.test.mjs`, `mathRemainingDepth.test.mjs`.
- Kiểm thử riêng bảy phần/chiều sâu: PASS 31/31. Toàn frontend: PASS 351/351. Validator chạy UTF-8: PASS 0 lỗi/0 cảnh báo. Backend: PASS 55/55. TypeScript và Vite production build: PASS, 202 modules.
- Chưa click-through sau đăng nhập trong lượt này; cấu trúc câu, đáp án, provenance, điểm, dữ liệu, kiểu TypeScript và bundle production đã được xác minh tự động.

## Kết quả hoàn tất MATH-DEEP-CURRICULUM-003

- Đã nâng cấp 71 phần còn lại, tương đương 4.260 lượt học; cộng ba bài thí điểm, toàn bộ Toán 6 hiện có 74 phần/4.440 lượt theo chuẩn chiều sâu.
- Mỗi game có đúng 3 câu cơ bản, 4 thông hiểu, 2 vận dụng và 1 thử thách; 10 lượt dùng 10 dạng biểu diễn từ kí hiệu, lời nói, phép tính, bảng, sơ đồ đến tình huống và quyết định.
- Mọi lựa chọn sai có đủ `Lỗi`, `Vì sao sai`, `Cách sửa`, `Ôn lại thẻ`; nội dung chẩn đoán lấy lỗi thường gặp, quy trình và cách kiểm tra riêng của mạch toán tương ứng.
- Mỗi phần có 5 chặng/10 thẻ: nền tảng–mô hình, quy tắc–quy trình, ví dụ hướng dẫn, chẩn đoán lỗi, tự kiểm tra. 64 phần sinh tự động có 12 hạt nhiệm vụ thay cho 4 hạt ban đầu.
- Bảy phần viết tay Bài 1–5 và hai phần luyện/ôn Chương I đã dùng chung sáu năng lực mà không đổi ID hoạt động, kế hoạch điểm hoặc tiến độ cũ.
- Registry trực quan bao phủ 13 mạch và định tuyến theo tiêu đề/mục tiêu của từng bài. Có kiểm thử riêng cho năm tên dễ nhầm: tập hợp số nguyên → trục số; ôn hình phẳng → hình; số thập phân → lưới thập phân; xác suất thực nghiệm → mô phỏng; ôn cuối năm → mô hình tổng hợp.
- Tệp chính: `frontend/src/features/math6/mathCurriculumDepth.ts`, `frontend/src/features/math6/MathLessonVisualLab.tsx`, `frontend/src/features/math6/mathSemester1Curriculum.ts`, `frontend/src/features/math6/structuredMathLessonEngine.ts`, `frontend/src/features/math6/structuredMathReviewEngine.ts`, `frontend/src/features/math6/mathLesson1Engine.ts`, `frontend/src/features/math6/MathLesson1.tsx`, `frontend/src/features/math6/MathConceptVisuals.tsx`, `frontend/src/features/math6/StructuredMathLesson.tsx`, `frontend/src/styles.css`, `frontend/tests/mathRemainingDepth.test.mjs` và các cổng Bài 1–5.
- Kiểm thử: chuyên biệt 38/38 PASS; định tuyến nâng cao 5/5 PASS; từng phần Kỳ 1 và Kỳ 2 PASS độc lập; validator 0 lỗi/0 cảnh báo; backend 55/55; frontend 351/351; TypeScript/build PASS, 202 modules.
- Chưa click-through các bài sau đăng nhập vì không tự động thao tác xác thực hoặc tạo tài khoản học sinh. Cấu trúc component, responsive, dữ liệu, logic và bundle production đã được xác minh.

## Kết quả hoàn tất MATH-DEEP-CURRICULUM-002

- Bài 6, 23 và 40 có tổng cộng 180 nhiệm vụ: mỗi bài 6 game năng lực × 10 câu. Mỗi game có đúng 3 câu cơ bản, 4 câu thông hiểu, 2 câu vận dụng và 1 câu thử thách.
- Mỗi câu có một trong 10 dạng biểu diễn/tình huống khác nhau. Mỗi bài đạt 60 chữ ký `tình huống + đáp án` riêng; bốn lựa chọn của từng câu không trùng nhau.
- Mỗi lựa chọn sai có chẩn đoán bốn phần: `Lỗi`, `Vì sao sai`, `Cách sửa`, `Ôn lại thẻ`; không còn phản hồi chung cho ba bài thí điểm.
- Bài giảng và hướng dẫn cách nghĩ được viết riêng theo sáu năng lực cho ba mạch số mũ, phân số và biểu đồ cột; ba bài dùng cùng cấu trúc sáu năng lực. Bảy bài biên soạn tay nằm ngoài phạm vi ba bài này và không bị sửa.
- Trực quan tương tác gồm bàn tạo lũy thừa bằng cơ số/số mũ, hai thanh phân số bằng nhau với hệ số mở rộng, và biểu đồ cột A/B/C có thanh trượt cùng tổng–lớn nhất–chênh lệch cập nhật trực tiếp.
- Tệp sửa chính: `frontend/src/features/math6/mathPilotTaskBanks.ts`, `frontend/src/features/math6/mathSemester1Curriculum.ts`, `frontend/src/features/math6/mathPilotDepth.ts`, `frontend/src/features/math6/MathConceptVisuals.tsx`, `frontend/src/styles.css`, `frontend/tests/mathPilotDepth.test.mjs`, `frontend/tests/mathConceptVisuals.test.mjs`, `frontend/tests/mathPilotCompletion.test.mjs`, `TASKS.md`, `CHECKPOINT.md`, `docs/STATE.md`.
- Cổng hoàn thiện sáu yêu cầu → PASS 6/6. Cổng hẹp pilot/visual/sư phạm → PASS 21/21. Cổng riêng từng bài → Bài 6 PASS 2/2, Bài 23 PASS 2/2, Bài 40 PASS 2/2.
- Hồi quy: validator PASS 0 lỗi/0 cảnh báo; backend PASS 55/55; frontend PASS 346/346; TypeScript PASS; Vite production build PASS, 200 modules.
- Kiểm tra Edge: ứng dụng tải đúng màn đăng nhập tại `127.0.0.1:5173`. Chưa click-through ba bài sau đăng nhập vì không có tài khoản kiểm thử trong phiên và không tự tạo dữ liệu học sinh.

## Kết quả hoàn tất MATH-VISUALS-001

- Bài 6 có ba hình “Học bằng hình”: cấu tạo cơ số–số mũ của `2⁴`, bốn thừa số `2 × 2 × 2 × 2 = 16`, và ghép nhóm để giải thích `2³ × 2² = 2⁵`.
- Bài 23 có ba hình: hai thanh phần bằng nhau minh họa `2/3 = 8/12`, điểm `−3/4` trên trục số, và quy trình chia cả tử lẫn mẫu cho 6 để rút gọn `−18/24 = −3/4`.
- Hình được ghép tự động đúng hai bài, đặt trước bài giảng/trò chơi, co về một cột trên màn hình hẹp và có `title`/`desc` cho trình đọc màn hình.
- Tệp sửa: `frontend/src/features/math6/MathConceptVisuals.tsx`, `frontend/src/features/math6/StructuredMathLesson.tsx`, `frontend/src/styles.css`, `frontend/tests/mathConceptVisuals.test.mjs`, `TASKS.md`, `CHECKPOINT.md`, `docs/STATE.md`.
- Kiểm thử hình riêng → PASS 3/3; TypeScript → PASS; validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 55/55; frontend → PASS 340/340; production build → PASS, 199 modules.
- Chưa xác minh click-through trực quan: trình duyệt localhost không khả dụng trong phiên này. Cấu trúc, nội dung, khả năng truy cập, responsive và bản dựng đã được kiểm thử tự động.

## Kết quả hoàn tất MATH-PILOT-DEPTH-001

- Bài 6 dạy phép nhân lặp, cơ số/số mũ, lũy thừa của 10, nhân/chia cùng cơ số, so sánh, tìm số mũ và vận dụng đếm/diện tích.
- Bài 23 dạy điều kiện phân số, tử/mẫu, số nguyên dạng phân số, phân số bằng nhau, tích chéo, dấu âm, tối giản, tìm thành phần chưa biết và lỗi biến đổi một phía.
- Bài 40 dạy cấu tạo biểu đồ, đọc thang đo, chuyển bảng–biểu đồ, tổng/hiệu, nhận xét có bằng chứng, thiếu đơn vị và thang đo gây hiểu nhầm.
- Mỗi bài: 5 khối/10 thẻ giảng dạy, 5 mục tiêu riêng, 12 hạt kiến thức chia đều ba mức và 60 câu trong sáu năng lực. Mọi đáp án sai có thông báo chỉ ra loại nhầm lẫn thay cho phản hồi chung.
- Tệp sửa: `frontend/src/features/math6/mathPilotDepth.ts`, `frontend/src/features/math6/mathSemester1Curriculum.ts`, `frontend/src/features/skills-common/SkillsSection.tsx`, `frontend/tests/mathPilotDepth.test.mjs`, `frontend/tests/mathPedagogyDepth.test.mjs`, `TASKS.md`, `CHECKPOINT.md`, `docs/STATE.md`.
- Kiểm thử riêng từng bài → PASS 3/3 cho Bài 6, Bài 23 và Bài 40. Cổng pilot + chiều sâu → PASS 12/12.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 55/55; frontend → PASS 337/337; TypeScript/Vite production build → PASS, 198 modules.
- Chưa xác minh click-through trực quan: Codex báo `Local browser access is unavailable for this chat`. Cấu trúc hiển thị, nội dung, đáp án, phản hồi và build đã được kiểm thử tự động.

## Kết quả hoàn tất MATH-PEDAGOGY-001

- Thay bộ sinh lặp bốn câu bằng sáu ngân hàng năng lực: nhận biết, quy trình, lập luận, sửa sai, tổng hợp hai nhiệm vụ và vận dụng kết quả–căn cứ.
- 67 nhánh sinh tự động có đúng 60 prompt và 60 chữ ký nhiệm vụ khác nhau; mỗi game có 10 câu riêng, bốn phương án không trùng và đáp án hợp lệ.
- Kiểm kê bảy nhánh Toán biên soạn tay: mỗi nhánh có sáu game × 10 câu và 60 tình huống `context + prompt + answer` riêng.
- Sửa `StructuredMathLesson` để nhãn Học kỳ 1/2 được lấy từ `course_id`; giữ nguyên activity ID, tổng điểm, provenance và dữ liệu học sinh.
- Tệp sửa: `frontend/src/features/math6/mathSemester1Curriculum.ts`, `frontend/src/features/math6/StructuredMathLesson.tsx`, `frontend/tests/mathPedagogyDepth.test.mjs`, `TASKS.md`, `CHECKPOINT.md`, `docs/STATE.md`.
- Kiểm thử hẹp `mathPedagogyDepth` → PASS 4/4. Các cổng riêng hiện có tiếp tục PASS cho 31 nhánh sinh tự động Kỳ 1 và 36 nhánh Kỳ 2.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 55/55; frontend → PASS 329/329; TypeScript/Vite production build → PASS, 197 modules.
- Kiểm tra trực tiếp Edge → PASS: Toán Học kỳ 2 hiển thị đúng nhãn, sáu thẻ năng lực xuất hiện đủ và câu Lập luận hiển thị gợi ý/yêu cầu/bốn lựa chọn đúng cấu trúc.

## Kết quả hoàn tất MATH-S2-FULL-001

- Đã tạo 36 nhánh theo mục lục SGK Toán 6 Tập 2: Chương VI–IX, Bài 23–43, các Luyện tập chung/Bài tập cuối chương, ba Hoạt động thực hành trải nghiệm và Ôn tập cuối năm.
- Mỗi nhánh có 4 khối kiến thức nền, bài giảng, 6 trò chơi × 10 câu, gợi ý/yêu cầu/giải thích và provenance; khóa mở từ `math6-s2-lesson23`.
- Điểm tối đa Toán Học kỳ 2 là 216.000; tổng hai học kỳ của môn Toán là 444.000. Điểm vẫn tách theo khóa, đồng thời cộng vào tổng hồ sơ học sinh.
- Tệp chính: `frontend/src/features/math6/mathSemester2Curriculum.ts`, `frontend/src/features/math6/MathSemester2Branch.tsx`, `frontend/src/features/math6/mathSemester1Curriculum.ts`, `frontend/src/features/math6/structuredMathLessonEngine.ts`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `frontend/src/features/profile/ScoreProfile.tsx`, `data/curriculum/catalog.json`, `backend/app/db.py`, `frontend/tests/mathSemester2Full.test.mjs`, `backend/tests/test_db.py`.
- Kiểm thử riêng Toán Học kỳ 2 → PASS 38/38, gồm một lượt riêng cho từng nhánh. Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 55/55; frontend → PASS 325/325; TypeScript/Vite production build → PASS.
- Kênh trình duyệt điều khiển của Codex không truy cập được máy chủ localhost nên chưa xác minh click-through trực quan. Không làm gián đoạn tiến trình ứng dụng cũ đang chạy ở cổng 8000; cần đóng/mở lại ứng dụng để thấy catalog mới.

## Kết quả hoàn tất MATH-S1-FULL-001

- Toán 6 Học kỳ 1 có 38 nhánh: Bài 1–22, Luyện tập chung/Bài tập cuối của 5 chương và 3 Hoạt động thực hành trải nghiệm; 6 trò chơi × 10 câu mỗi nhánh; tổng điểm tối đa 228.000.
- Năm vấn đề đã sửa: lưu checkpoint từng câu; trạng thái âm thanh hiển thị rõ; khôi phục bài dở với bỏ qua/làm lại; thương hiệu đăng nhập trung lập cho đa môn; toàn bộ nội dung Toán Học kỳ 1 được mở trong catalog.
- Tệp chính: `frontend/src/features/math6/mathSemester1Curriculum.ts`, `frontend/src/features/math6/MathGeneratedBranch.tsx`, `frontend/src/features/math6/MathChapter1Practice.tsx`, `frontend/src/features/math6/MathChapter1Review.tsx`, `frontend/src/features/skills-common/SkillsSection.tsx`, `frontend/src/auth/AuthGate.tsx`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/main.py`, `backend/app/db.py`, `data/curriculum/catalog.json`.
- Kiểm thử từng vấn đề: checkpoint từng câu PASS; trạng thái âm thanh PASS; tiếp tục/bỏ qua/làm lại PASS; đăng nhập đa môn PASS; cổng Toán 39/39 PASS.
- Kiểm thử tổng: validator 0 lỗi/0 cảnh báo; backend 54/54 PASS; frontend 286/286 PASS; TypeScript/Vite production build PASS.
- Chưa xác minh trong lượt này: thao tác trực quan xuyên suốt 38 nhánh bằng trình duyệt và chất lượng giọng đọc thực tế trên từng máy.

## Kết quả Bài 5 thuộc MATH-S1-FULL-001

- Đã đối chiếu Bài 5 trang sách 17–19: thuật ngữ phép nhân/chia, cộng lặp, tính chất giao hoán–kết hợp–phân phối, nhân 1/0, chia hết và chia có dư `a = bq + r` với `0 ≤ r < b`.
- Đã tạo 3 khối bài giảng và 6 trò chơi × 10 câu; giữ các mốc 24·25, 125·8 001·8, 4 847:131, 5 580:157, 945:45, 3 121:51, bài xe 487/45, bài mở đầu tiền gạo và bài 1.23–1.30.
- Đã đăng ký `math6-s1-lesson5` sau Bài 4; 6 hoạt động × 1.000 điểm được cộng riêng vào Toán 6 Học kỳ 1 và tổng điểm hồ sơ.
- Tệp chính: `data/lessons/math6_s1_lesson5.json`, `frontend/src/features/math6/MathLesson5.tsx`, `frontend/tests/mathLesson5Engine.test.mjs`, `data/curriculum/catalog.json`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/db.py`, `scripts/validate_source_data.py`.
- Kiểm thử Toán → PASS 25/25; validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 47/47; frontend → PASS 245/245; TypeScript/Vite production build → PASS, 188 modules.

## Kết quả Bài 4 thuộc MATH-S1-FULL-001

- Đã đối chiếu Bài 4 trang sách 15–16: thuật ngữ phép cộng/phép trừ, tia số, giao hoán, kết hợp, cộng 0, tính hợp lí và điều kiện thực hiện phép trừ trong ℕ.
- Đã tạo 3 khối bài giảng và 6 trò chơi × 10 câu; giữ các mốc mở đầu 18 + 21 + 30 và 100, 713 200 − 14 500, 66 + 289 + 134 + 311, 117 + 68 + 23, 865 279 − 45 027 và bài 1.17–1.22.
- Đã đăng ký `math6-s1-lesson4` sau Bài 3; 6 hoạt động × 1.000 điểm được cộng riêng vào Toán 6 Học kỳ 1 và tổng điểm hồ sơ.
- Tệp chính: `data/lessons/math6_s1_lesson4.json`, `frontend/src/features/math6/MathLesson4.tsx`, `frontend/tests/mathLesson4Engine.test.mjs`, `data/curriculum/catalog.json`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/db.py`, `scripts/validate_source_data.py`.
- Kiểm thử Toán → PASS 21/21; validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 46/46; frontend → PASS 241/241; TypeScript/Vite production build → PASS, 186 modules.

## Kết quả Bài 3 thuộc MATH-S1-FULL-001

- Đã đối chiếu Bài 3 trang sách 13–14: tia số và điểm biểu diễn, so sánh số tự nhiên, số liền trước/liền sau, hai số liên tiếp, số 0, tính bắc cầu và các kí hiệu ≤/≥.
- Đã tạo 3 khối bài giảng và 6 trò chơi × 10 câu, gồm các mốc bài 1.13–1.16: dãy 3 528–3 533, a < b < c, tập M/K/L và thứ tự chiều cao Cường–An–Bắc.
- Đã đăng ký `math6-s1-lesson3` sau Bài 2; 6 hoạt động × 1.000 điểm được cộng riêng vào Toán 6 Học kỳ 1 và tổng điểm hồ sơ.
- Tệp chính: `data/lessons/math6_s1_lesson3.json`, `frontend/src/features/math6/MathLesson3.tsx`, `frontend/tests/mathLesson3Engine.test.mjs`, `data/curriculum/catalog.json`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/db.py`, `scripts/validate_source_data.py`.
- Kiểm thử Toán → PASS 17/17; validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 45/45; frontend → PASS 237/237; TypeScript/Vite production build → PASS, 184 modules.

## Kết quả Bài 2 thuộc MATH-S1-FULL-001

- Đã đối chiếu Bài 2 trang sách 9–12: hệ thập phân, giá trị theo hàng, đọc/viết số, viết số thành tổng và số La Mã I–XXX; phần mở rộng ngoài yêu cầu bắt buộc không tính điểm.
- Đã tạo 3 khối bài giảng và 6 trò chơi × 10 câu: giá trị theo hàng, khai triển, đọc–viết số, đọc số La Mã, viết số La Mã và luyện tập tổng hợp.
- Đã bổ sung engine/component Toán có cấu trúc để tái sử dụng cho các bài tiếp theo; mỗi câu có gợi ý, yêu cầu, phản hồi và provenance.
- Đã đăng ký `math6-s1-lesson2` sau Bài 1; 6 hoạt động × 1.000 điểm được cộng riêng vào Toán 6 Học kỳ 1 và tổng điểm hồ sơ.
- Tệp chính: `data/lessons/math6_s1_lesson2.json`, `frontend/src/features/math6/StructuredMathLesson.tsx`, `frontend/src/features/math6/structuredMathLessonEngine.ts`, `frontend/src/features/math6/MathLesson2.tsx`, `frontend/tests/mathLesson2Engine.test.mjs`, `data/curriculum/catalog.json`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/db.py`, `scripts/validate_source_data.py`.
- Kiểm thử riêng frontend → PASS 13/13. Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 44/44; frontend → PASS 233/233; TypeScript/Vite production build → PASS, 182 modules.

## Kết quả MATH-S1-L1-001

- Đã đối chiếu Bài 1 trang sách 5–8: tập hợp/phần tử, kí hiệu ∈ và ∉, hai cách mô tả, quy tắc không lặp phần tử, N và N*; Cantor, hữu hạn/vô hạn và giao chỉ là mở rộng không tính điểm.
- Đã tạo 3 khối bài giảng tương tác, 4 mục tiêu và 6 trò chơi × 10 câu: nhận biết, thuộc/không thuộc, sửa kí hiệu, liệt kê, N/N* và chuyển đổi mô tả.
- Mỗi câu có gợi ý trước câu hỏi, yêu cầu bài tập, đáp án xác định, giải thích sau chấm và provenance; câu nguồn và câu luyện thêm được phân biệt, không nhúng ảnh sách.
- Đã mở `math-6-semester-1` tại `math6-s1-lesson1`; 6 hoạt động × 1.000 điểm được tách riêng trong hồ sơ môn Toán và cộng vào tổng tất cả môn.
- Đã thêm ngôn ngữ đọc tùy chọn cho engine dùng chung; Bài Toán dùng `vi-VN`, các bài Tiếng Anh tiếp tục mặc định `en-US`.
- Tệp chính: `data/lessons/math6_s1_lesson1.json`, `frontend/src/features/math6/MathLesson1.tsx`, `frontend/src/features/math6/mathLesson1Engine.ts`, `frontend/tests/mathLesson1Engine.test.mjs`, `data/curriculum/catalog.json`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `backend/app/db.py`, `scripts/validate_source_data.py`.
- Kiểm thử hẹp → PASS 9/9. Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 46/46; frontend → PASS 229/229; TypeScript/Vite production build → PASS, 178 modules.
- Trình duyệt thật mở được ứng dụng và hiển thị đúng màn đăng nhập. Chưa click-through phần Toán sau đăng nhập vì phiên kiểm thử không có tài khoản và không tự tạo dữ liệu học sinh.

## Kết quả S2-R4-001

- Đã đối chiếu trực quan Review 4 trang sách 68–69: Language và Skills tổng hợp Units 10–11–12.
- Đã tạo 6 game × 10 câu và 3 màn Bonus × 10 câu; phần nghe thay thế có `source_status: ai-generated` và lời đọc riêng, không nhúng ảnh sách.
- Đã đăng ký `review4` sau `unit12`, activity plan 6.000 điểm và hoàn tất chuỗi Tiếng Anh 6 Học kỳ 2 từ Unit 7 đến Review 4.
- Tệp chính: `data/lessons/review4_source.json`, `frontend/src/features/review4/Review4.tsx`, `frontend/tests/review4Engine.test.mjs`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `data/curriculum/catalog.json`, `backend/app/db.py`.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 45/45; frontend → PASS 225/225; TypeScript/Vite production build → PASS, 175 modules.

## Kết quả S2-U12-001

- Đã đối chiếu trực quan Unit 12 trang sách 58–67: triển lãm robot, hoạt động hằng ngày, ngữ điệu xuống, so sánh nhất, đồng ý/không đồng ý, năm loại robot, nghe thay thế, Looking Back, Robot Design Competition và `Now I can`.
- Đã tạo 42 game × 10 câu, hai bài luyện ngữ điệu xuống 60 giây, 3 màn Bonus × 10 câu; audio thay Track 37–44 có nhãn AI, Project dùng trực tiếp bốn tiêu chí thiết kế robot.
- Đã đăng ký `unit12` sau `unit11`, activity plan 42.000 điểm và hồ sơ Học kỳ 2.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 44/44; frontend → PASS 221/221; TypeScript/Vite production build → PASS.

## Kết quả S2-U11-001

- Đã đối chiếu trực quan Unit 11 trang sách 48–57: 3Rs, rubbish/plastic/glass, nhịp câu, articles, first conditional, warnings, green-school tips, 3Rs Club, Looking Back, Project tái sử dụng đồ cũ và `Now I can`.
- Đã tạo 42 game × 10 câu, hai bài luyện nhịp 60 giây, 3 màn Bonus × 10 câu; audio thay Track 31–37 có nhãn AI, Project điều khiển trò chơi thay vì hiện như kiến thức nền.
- Đã đăng ký `unit11` sau `unit10`, activity plan 42.000 điểm và hồ sơ Học kỳ 2.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 43/43; frontend → PASS 217/217; TypeScript/Vite production build → PASS.

## Kết quả S2-U10-001

- Đã đối chiếu trực quan Unit 10 trang sách 38–47: nhà và thiết bị tương lai, trọng âm từ hai âm tiết, will/won't, might, bày tỏ ngạc nhiên, bài đọc nhà trên đảo, nghe thay thế về Linda/Nick, Looking Back, Project và `Now I can`.
- Đã tạo 42 game × 10 câu, hai bài luyện trọng âm 60 giây, 3 màn Bonus × 10 câu; audio thay Track 23–30 có nhãn AI, Project điều khiển trò chơi thay vì hiện như kiến thức nền.
- Đã đăng ký `unit10` sau `review3`, activity plan 42.000 điểm và hồ sơ Học kỳ 2.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 42/42; frontend → PASS 213/213; TypeScript/Vite production build → PASS.

## Kết quả S2-R3-001

- Đã đối chiếu trực quan Review 3 trang sách 36–37: Language và Skills cho Units 7–8–9.
- Đã tạo 6 game × 10 câu, 3 màn Bonus × 10 câu; phần nghe Singapore thay Track 22 có nhãn AI, không nhúng ảnh sách.
- Đã đăng ký `review3` sau `unit9`, activity plan 6.000 điểm và hồ sơ Review tách riêng.
- Tệp chính: `data/lessons/review3_source.json`, `frontend/src/features/semester2/structuredReviewEngine.ts`, `frontend/src/features/semester2/StructuredReview.tsx`, `frontend/src/features/review3/Review3.tsx`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `data/curriculum/catalog.json`, `backend/app/db.py`.
- Validator → PASS 0 lỗi/0 cảnh báo; backend → PASS 41/41; frontend → PASS 209/209; production build → PASS.

## Kết quả S2-U9-001

- Đã đối chiếu trực quan toàn bộ Unit 9 trang sách 26–35: Cities of the World, /əʊ/–/aʊ/, sở hữu, câu cảm thán, Stockholm, Bangkok, Looking Back, Project và `Now I can`.
- Đã tạo 42 game × 10 câu, hai bài luyện âm 60 giây, 3 màn Bonus × 10 câu; audio nghe thay thế được ghi nhãn AI và lời đọc âm không chứa dấu `/`.
- Đã đăng ký `unit9` sau `unit8`, activity plan 42.000 điểm và hồ sơ điểm Học kỳ 2.
- Tệp chính: `data/lessons/unit9_source.json`, `frontend/src/features/semester2/structuredUnitEngine.ts`, `frontend/src/features/semester2/StructuredUnit.tsx`, `frontend/src/features/unit9/Unit9.tsx`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `data/curriculum/catalog.json`, `backend/app/db.py`.
- `PYTHONUTF8=1 python scripts/validate_source_data.py` → PASS, 0 lỗi/0 cảnh báo.
- `python -m unittest discover -s backend/tests -v` → PASS, 40/40 (sau khi cập nhật hai mốc tổng điểm có thêm Unit 9).
- `npm test` trong `frontend` → PASS, 205/205.
- `npm run build` trong `frontend` → PASS (TypeScript + Vite production).
- Chưa kiểm tra trực quan/click-through bằng trình duyệt nội bộ vì quyền truy cập máy chủ cục bộ không khả dụng trong phiên.

## Kết quả S2-U8-001

- Đã đối chiếu trực quan toàn bộ Unit 8 trang sách 16–25 trong PDF Tập 2: Getting Started, A Closer Look 1–2, Communication, Skills 1–2, Looking Back, Project và `Now I can`.
- Đã tạo dữ liệu nguồn song ngữ, 42 game × 10 câu, hai bài âm /e/–/æ/ 60 giây và 3 màn Bonus × 10 câu; phần nghe thay thế không có audio gốc được ghi nhãn AI.
- Chuỗi đọc âm không chứa dấu `/`; Project dùng các bước chơi blind man's bluff và gợi ý trò chơi truyền thống làm vật liệu game, không hiện như kiến thức nền.
- Đã đăng ký `unit8` sau `unit7` trong catalog Học kỳ 2, renderer frontend, activity plan 42.000 điểm, thời lượng luyện âm và hồ sơ điểm theo khóa.
- Tệp chính: `data/lessons/unit8_source.json`, `data/lessons/unit8_bonus.json`, `frontend/src/features/unit8/*`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `data/curriculum/catalog.json`, `backend/app/db.py`.
- `PYTHONUTF8=1 python scripts/validate_source_data.py` → PASS, 0 lỗi/0 cảnh báo.
- `python -m unittest discover -s backend/tests -v` → PASS, 39/39.
- `npm test` trong `frontend` → PASS, 201/201.
- `npm run build` trong `frontend` → PASS (TypeScript + Vite production).
- Chưa kiểm tra trực quan/click-through bằng trình duyệt nội bộ: Codex Desktop trả `Local browser access is unavailable for this chat`; không ghi nhận mục này là đã xác minh.

## Kết quả S2-U7-001

- Đã đối chiếu Unit 7 trang sách 6–15 và Track 2–7 trong PDF Tập 2; audio gốc không có nên phần nghe thay thế dùng TTS và giữ nhãn AI.
- Đã sửa 12 lượt hội thoại, TV guide, Communication, Project và 9 mục `Now I can`; bổ sung bản dịch cho các khối kiến thức nền tiếng Anh.
- Đã tạo đủ 42 game × 10 câu, hai bài âm 60 giây, 3 màn Bonus × 10 câu; Project steps/Now I can điều khiển trò chơi thay vì hiện như kiến thức nền.
- Đã mở `english-6-semester-2` với nhánh đầu `unit7`, renderer riêng, activity plan 42.000 điểm và profile theo khóa.
- Tệp chính: `data/lessons/unit7_source.json`, `data/lessons/unit7_bonus.json`, `frontend/src/features/unit7/*`, `frontend/src/App.tsx`, `frontend/src/curriculum/courseRegistry.ts`, `data/curriculum/catalog.json`, `backend/app/db.py`.
- Kiểm thử: validator 0 lỗi/0 cảnh báo; backend 38/38 PASS; frontend 195/195 PASS; TypeScript và Vite production build PASS.
- Chưa kiểm tra trực quan/click-through bằng trình duyệt nội bộ vì quyền local browser của Codex Desktop chưa khả dụng trong phiên.

## Kết quả AUDIT-001

- Đã đọc mục lục và kiểm tra trực quan toàn bộ trang sách 6–69 trong PDF quét 74 trang: Units 1–3, Review 1, Units 4–6 và Review 2.
- Đã đối chiếu đủ tám phần học của từng Unit, hai nhóm Language/Skills của từng Review, các trang Project và bảng `Now I can` với cấu trúc dữ liệu/trò chơi hiện hành.
- Không phát hiện sai thứ tự Unit/Review, thiếu phần học hoặc sai phạm vi trang. Các câu mở rộng và audio thay thế tiếp tục giữ provenance AI; PDF không cung cấp audio gốc.
- Đã thêm `docs/SEMESTER1_BOOK_AUDIT.md` và cập nhật `docs/CONTENT_RULES.md` để PDF toàn tập là nguồn đối chiếu tổng thể.
- Đã đổi `.course-branch-nav` thành lưới đáp ứng 5 cột (màn hình rộng), 3 cột (≤900 px), 2 cột (≤620 px); toàn bộ 10 nút Thư viện/Hồ sơ/Units/Reviews nằm trong luồng trang.
- Kiểm tra trực quan trong Edge tại bản dev xác nhận Unit 5, Unit 6 và Review 2 cùng hiện rõ trên hàng thứ hai; tài khoản và cơ sở dữ liệu thử đã được xóa sau kiểm tra.
- `PYTHONUTF8=1 python scripts/validate_source_data.py` → PASS, 0 lỗi/0 cảnh báo.
- `pnpm test` → PASS 189/189.
- `pnpm run build` → PASS (TypeScript + Vite production).

## Kết quả UX-007

- Project Units 1–6 truyền danh sách kiến thức nền rỗng; phần mở đầu giải thích rõ bước trong sách được luyện qua game.
- Project Plan/Path dùng trực tiếp các bước hoặc câu hỏi gợi ý của trang Project.
- Show & Tell dùng đủ từng dòng Now I can làm lượt tự kiểm tra, sau đó mới đến lượt hoàn tất/trình bày.
- Unit 3 hiện dùng đủ 5 bước làm kỷ yếu và đủ 8 tiêu chí Now I can trong ảnh; trước sửa mới dùng 6/8 tiêu chí.
- Nút trợ giúp của game Plan và Show & Tell giải thích vai trò của gợi ý, tiêu chí hoàn thành và phản hồi khi sai.
- `pnpm test` → PASS 188/188.
- `pnpm run build` → PASS (TypeScript + Vite production).

## Kết quả UX-006

- Đã thêm helper ghép bắt buộc một-một giữa câu tiếng Anh và bản dịch tiếng Việt; thiếu bản dịch hoặc lệch số lượng sẽ báo lỗi thay vì âm thầm hiện “Ghi chú”.
- Đã áp dụng cho Communication, Skills 1, Skills 2, Looking Back và Project của Units 1, 2, 4, 5, 6; Unit 3 được rà soát và giữ các hướng dẫn Việt/Anh đã đầy đủ.
- Bộ đọc kiến thức nền loại mọi ký tự `/`, gộp khoảng trắng và loại khoảng trắng thừa trước dấu câu.
- `pnpm test` → PASS 186/186.
- `pnpm run build` → PASS (TypeScript + Vite production).

## Kết quả UX-005

- Kiến thức nền dùng loại riêng `pronunciationVi` và `speechText`; giao diện hiện nhãn “Cách phát âm”.
- Lời đọc âm tách khỏi phần hiển thị: không đọc dấu `/`, không đọc hướng dẫn tiếng Việt, chỉ phát âm mẫu và các từ ví dụ.
- Đã áp dụng cho /ɑː/–/ʌ/, /s/–/z/, /b/–/p/, /ɪ/–/iː/, /t/–/d/, /s/–/ʃ/ và bản nháp /θ/–/ð/ của Unit 7.
- `pnpm test` → PASS 184/184.
- `pnpm run build` → PASS (TypeScript + Vite production).

## Kết quả UX-004

- Đã xác định nguyên nhân: mục tiếng Anh chưa có `translation` bị giao diện gắn nhãn “Ghi chú”.
- Đã bổ sung nghĩa cụ thể cho cụm từ trường học, phòng/nội thất, địa điểm/tính từ khu phố, vật dụng du lịch và từ/cụm từ Tết.
- Đã sửa Unit 4–5 để truyền từ gốc vào bộ từ điển thay vì gắn mô tả chung.
- `pnpm test` → PASS 183/183.
- `pnpm run build` → PASS (TypeScript + Vite production).

## Công việc hoàn thành gần nhất

1. Đã đọc `AGENTS.md`, `README_VI.md`, `frontend/package.json`, `backend/requirements.txt` và danh sách script.
2. Đã xác nhận chưa có `TASKS.md`, `CHECKPOINT.md` hoặc Automation cục bộ trước phiên này.
3. Đã tạo `TASKS.md` và chuyển `OPS-001` sang `IN_PROGRESS` trước khi triển khai.
4. Đã bổ sung vào `AGENTS.md` giao thức tiếp tục phiên, chống ghi đè và ma trận kiểm thử.
5. Đã tạo heartbeat `Auto Resume Project` trong Codex Desktop, gắn với chat hiện tại và đặt trạng thái `ACTIVE`; tệp Automation cục bộ đã được xác minh.
6. Đã hoàn thành bài thử `CHK-001` và chuyển trạng thái `IN_PROGRESS` → `DONE` sau khi kiểm tra đạt.
7. Đã thêm cơ chế dùng chung `FoundationBlocks`: nghe toàn bài, nghe riêng từng mục, hộp thoại tương tác và bản dịch/ghi chú tiếng Việt.
8. Đã đưa kiến thức nền xuống cuối game dùng chung; Unit 3 có footer kiến thức nền theo mục tiêu phần học.
9. Đã thêm xáo trộn đáp án có seed cho game dùng chung và các game tùy biến Unit 3.
10. Đã mở rộng tiến độ từng câu bằng trạng thái `scored`/`skipped`; câu đã chấm có nút bỏ qua hoặc làm lại, điểm tốt nhất vẫn được giữ.
11. Đã thêm gợi ý hồ sơ theo từng hoạt động: tối đa 5 câu bỏ qua và 5 câu có điểm thấp nhất.
12. Đã thêm `RoundGuide` trước câu hỏi game dùng chung; School Vocabulary có đủ 10 nghĩa tiếng Việt và yêu cầu bài tập cụ thể.
13. Đã dịch các danh sách hướng dẫn tiếng Việt của Unit 3, Review 1 và Review 2 sang bản hướng dẫn tiếng Anh dùng cho TTS; phần hiển thị tiếng Việt vẫn được giữ để học sinh đọc.
14. Đã loại mô tả và tiêu đề tiếng Việt khỏi “Nghe toàn bài”; cặp từ vựng Anh–Việt tiếp tục chỉ đọc vế tiếng Anh.
15. Đã thêm `SpeechQueue.replace`: thao tác nghe kiến thức nền mới hủy ngay âm thanh đang phát, không xếp chồng hoặc chờ hàng đợi cũ.
16. Đã thêm catalog `english-6-semester-1`, `english-6-semester-2`, `math-6-semester-1`, `math-6-semester-2`; chỉ khóa đầu tiên đang `available`.
17. Đã thêm thư viện chương trình, catalog runtime từ backend và registry renderer; khóa thiếu renderer bị vô hiệu hóa an toàn.
18. Đã giữ nguyên schema SQLite/ID cũ, đồng thời lọc hồ sơ, lịch sử, Bonus và gợi ý theo khóa học.
19. Backend hiện từ chối branch/activity không có trong catalog/activity plan; startup dừng rõ ràng nếu catalog và registry lệch nhau.
20. QA vòng một tìm 2 lỗi P1 về mở nhầm renderer và ghi branch tùy ý; Builder đã sửa, QA vòng hai xác nhận không còn lỗi chặn.
21. Đã thêm `/profile/overview`: tổng chung, nhóm theo môn và chi tiết từng học kỳ/khóa.
22. Hồ sơ hiển thị lần lượt tổng tất cả môn, điểm từng môn, điểm từng khóa và chi tiết khóa đang xem; Bonus tách riêng.
23. Chỉ khóa `available` có branch mới tham gia tổng điểm; khóa `planned` có branch nháp cũng bị loại.
24. Tiêu đề khóa trong hồ sơ lấy từ catalog runtime của backend, tránh lệch phiên bản với frontend bundle.
25. Đã xác định ảnh `Not Found` do backend cũ: `/health` 200 nhưng `/courses` 404; không liên quan dữ liệu học sinh.
26. Đã khởi động lại backend hiện tại và xác minh catalog 4 khóa cùng route `/profile/overview`.
27. Launcher giờ kiểm tra hợp đồng API bắt buộc, không chỉ health; backend cũ được dừng nếu thuộc launcher hoặc báo hướng dẫn rõ nếu không quản lý được.
28. Đã bỏ khôi phục khóa học từ `localStorage`; tài khoản đã đăng nhập luôn bắt đầu ở Thư viện chương trình.
29. Registry khóa học giờ chỉ hợp lệ khi `initialBranch` là nhánh đầu tiên trong catalog; Tiếng Anh 6 Kỳ 1 bắt đầu ở Unit 1.
30. Unit 1 tự bắt đầu ở `Getting Started`; tiêu đề cửa sổ mặc định đổi từ Unit 3 sang Thư viện chương trình.
31. Frontend production dùng API cùng origin; chế độ dev và launcher cũ tại cổng 4173 vẫn gọi backend 8000.
32. Backend phục vụ trực tiếp frontend đã build tại `/` và `/assets`, đồng thời giữ nguyên toàn bộ API.
33. Đã thêm launcher Windows bind `127.0.0.1:8765`; database/log nằm ngoài thư mục cài đặt trong `%LOCALAPPDATA%\EnglishQuest`.
34. Đã thêm PyInstaller onedir và bộ cài một tệp; version được nhúng khi build, đường dẫn xóa/gỡ bị giới hạn an toàn.
35. Artifact cuối `release/EnglishQuest-Setup-1.0.0.exe` có SHA-256 `118a7c167ddbfa599a42a8c05098bd143955ded4869785099e493e52ba4549de`.
36. Vòng cài–chạy–gỡ trên artifact cuối đạt: root/health/catalog hoạt động, database được tạo và vẫn còn sau khi thư mục chương trình được gỡ.
37. QA độc lập xác nhận artifact/hash/version mới, không còn blocker cho phát hành gia đình; SmartScreen do chưa ký số là P2 đã ghi rõ.

## Tệp đã sửa trong nhiệm vụ hiện tại

- `frontend/src/styles.css` — thanh chọn nhánh 5/3/2 cột, không còn tràn ngang che Unit 5–6.
- `frontend/tests/courseCatalog.test.mjs` — kiểm thử đủ 10 nút, đúng thứ tự Unit 5 → Unit 6 → Review 2 và các breakpoint lưới.
- `docs/CONTENT_RULES.md`, `docs/SEMESTER1_BOOK_AUDIT.md`, `docs/STATE.md` — nguồn PDF toàn tập, ma trận đối chiếu và trạng thái kiểm chứng.
- `TASKS.md`, `CHECKPOINT.md` — hoàn tất `AUDIT-001` và lưu kết quả kiểm thử.

- `frontend/src/features/unit1/Unit1Phase2Sections.tsx`, `unit2/Unit2Phase2Sections.tsx`, `unit4/Unit4Phase2Sections.tsx`, `unit5/Unit5Phase2Sections.tsx`, `unit6/Unit6Phase2Sections.tsx` — bỏ khối kiến thức nền Project.
- `frontend/src/features/unit1/unit1Phase2Engine.ts`, `unit2/unit2Phase2Engine.ts`, `unit4/unit4Phase2Engine.ts`, `unit5/unit5Phase2Engine.ts`, `unit6/unit6Phase2Engine.ts` — chuyển Project steps/prompts và Now I can thành lượt game cùng trợ giúp.
- `frontend/src/features/project/Project.tsx`, `data/lessons/unit3_project.json` — Unit 3 bỏ nền, dùng đủ 8 tiêu chí tự kiểm tra trong trò chơi.
- `frontend/tests/projectGuidance.test.mjs` — kiểm thử liên kết nội dung Project với game cho Units 1–6.
- `TASKS.md`, `CHECKPOINT.md`, `docs/STATE.md` — trạng thái và bàn giao UX-007.

- `frontend/src/features/skills-common/learningUx.ts` — helper bản dịch bắt buộc và chuẩn hóa lời đọc không còn dấu `/`.
- `frontend/src/features/unit1/Unit1Phase2Sections.tsx`, `unit2/Unit2Phase2Sections.tsx`, `unit4/Unit4Phase2Sections.tsx`, `unit5/Unit5Phase2Sections.tsx`, `unit6/Unit6Phase2Sections.tsx` — bản dịch cụ thể cho Communication, Skills 1–2, Looking Back và Project.
- `frontend/tests/learningUx.test.mjs` — kiểm thử bản dịch một-một, bỏ dấu `/`, dọn dấu câu và áp dụng helper cho các Unit học kỳ 1.
- `TASKS.md`, `CHECKPOINT.md`, `docs/STATE.md` — trạng thái, kết quả và bàn giao UX-006.

- `frontend/src/features/skills-common/SkillsSection.tsx` — âm thanh toàn bài/từng mục, kiến thức nền cuối game, bỏ qua/làm lại và xáo trộn.
- `frontend/src/features/skills-common/learningUx.ts` — xáo trộn ổn định, chuẩn hóa kiến thức nền và bản dịch cốt lõi.
- `frontend/src/progress/scoringEngine.ts`, `frontend/src/progress/useActivityScoring.ts` — lưu trạng thái bỏ qua.
- `frontend/src/auth/authApi.ts`, `frontend/src/auth/AuthProvider.tsx`, `frontend/src/App.tsx` — truyền trạng thái từng câu và footer Unit 3.
- `frontend/src/features/profile/ScoreProfile.tsx`, `frontend/src/styles.css` — gợi ý hồ sơ và giao diện mới.
- `frontend/src/features/a-closer-look-2/ACloserLook2.tsx`, `body-lab/BodyLab.tsx`, `communication/Communication.tsx`, `word-webs/WordWebs.tsx` — xáo trộn đáp án Unit 3.
- `backend/app/main.py`, `backend/app/db.py` — API/schema trạng thái câu và gợi ý hồ sơ.
- `frontend/tests/learningUx.test.mjs`, `frontend/tests/scoringEngine.test.mjs`, `backend/tests/test_db.py` — kiểm thử mới.
- `TASKS.md`, `CHECKPOINT.md` — trạng thái và bàn giao.
- `frontend/src/features/skills-common/SkillsSection.tsx`, `frontend/src/styles.css` — khối mô tả tiếng Việt trước câu hỏi.
- `frontend/src/features/unit1/unit1Engine.ts`, `frontend/tests/unit1Engine.test.mjs` — nghĩa tiếng Việt School Vocabulary và kiểm thử `physical activity`.
- `frontend/src/features/skills-common/learningUx.ts` — bản hướng dẫn tiếng Anh và bộ lọc không đưa tiếng Việt vào giọng `en-US`.
- `frontend/src/features/skills-common/SkillsSection.tsx` — hiển thị hướng dẫn tiếng Anh, nghe toàn bài chỉ dùng tiếng Anh và thay thế âm thanh đang phát.
- `frontend/src/features/word-magnet/speechQueue.ts` — API `replace` hủy lời đọc cũ trước khi phát mục mới.
- `frontend/tests/learningUx.test.mjs`, `frontend/tests/speechQueue.test.mjs` — kiểm thử bản dịch và ưu tiên âm thanh mới.
- `data/curriculum/catalog.json` — danh mục môn/lớp/học kỳ và ID nhánh toàn cục.
- `backend/app/curriculum.py`, `backend/app/db.py`, `backend/app/main.py` — đọc/kiểm tra catalog, API khóa học, lọc hồ sơ và chặn tiến độ ngoài registry.
- `backend/tests/test_db.py` — tương thích dữ liệu cũ, cô lập profile và từ chối branch/activity chưa đăng ký.
- `frontend/src/curriculum/courseCatalog.ts`, `courseRegistry.ts`, `courseRegistryCore.ts` — validate catalog và đăng ký renderer khóa học.
- `frontend/src/features/courses/CourseLibrary.tsx`, `frontend/src/App.tsx`, `frontend/src/styles.css` — thư viện chương trình và shell renderer theo khóa.
- `frontend/src/auth/authApi.ts`, `frontend/src/auth/AuthProvider.tsx`, `frontend/src/features/profile/ScoreProfile.tsx` — catalog runtime, profile theo khóa và refresh đúng nhánh.
- Các component Skills/Project/Looking Back/Friend Detective — bắt buộc nhận `unitId` rõ ràng, không fallback Unit 3.
- `frontend/tests/courseCatalog.test.mjs`, `frontend/tests/profileStructure.test.mjs` — khóa thiếu renderer và cấu trúc profile theo khóa.
- `backend/app/db.py`, `backend/app/main.py` — tổng hợp điểm toàn hệ thống và API `/profile/overview`.
- `frontend/src/auth/authApi.ts`, `frontend/src/auth/AuthProvider.tsx` — kiểu dữ liệu và hàm tải tổng quan điểm.
- `frontend/src/features/profile/ScoreProfile.tsx`, `frontend/src/styles.css` — tổng tất cả môn, từng môn, từng học kỳ và khóa đang xem.
- `backend/tests/test_db.py`, `frontend/tests/profileStructure.test.mjs` — test nhóm nhiều học kỳ theo môn, tổng chung và loại khóa `planned`.
- `scripts/start_english_quest.ps1` — kiểm tra tương thích `/courses` và `/profile/overview`, xử lý backend cũ trước khi mở giao diện.
- `frontend/src/App.tsx` — luôn mở thư viện sau đăng nhập và không lưu/khôi phục khóa cũ.
- `frontend/src/curriculum/courseRegistry.ts`, `courseRegistryCore.ts` — Unit 1 là nhánh đầu, bắt buộc khóa mở tại nhánh catalog đầu tiên.
- `frontend/index.html` — tiêu đề mặc định của Thư viện chương trình.
- `frontend/tests/courseCatalog.test.mjs` — kiểm thử đăng nhập, thư viện và điểm vào khóa.
- `frontend/src/auth/authApi.ts` — production dùng API cùng origin của ứng dụng đóng gói.
- `backend/app/main.py` — phục vụ frontend tĩnh cùng backend.
- `packaging/launcher.py`, `EnglishQuest.spec` — launcher và bundle ứng dụng Windows.
- `packaging/setup_launcher.py`, `EnglishQuestSetup.spec`, `build_version.py`, `installer.iss` — bộ cài, nâng cấp/gỡ và version ổn định.
- `scripts/build_windows_installer.ps1`, `packaging/requirements.txt` — pipeline build tái lập và phụ thuộc PyInstaller.
- `backend/tests/test_packaging.py`, `frontend/tests/packagingConfig.test.mjs` — kiểm thử static frontend, đường dẫn dữ liệu/xóa an toàn và cấu hình installer.
- `docs/WINDOWS_INSTALLER.md`, `README_VI.md` — hướng dẫn cài, nâng cấp, chuyển database và build.

## Kiểm thử đã chạy

- `git -C <project> rev-parse --show-toplevel` → FAIL dự kiến: dự án chưa phải Git repository.
- Kiểm thử nội dung checkpoint bằng PowerShell → PASS: `files=3 headings=4 in_progress=1 checkpoint_current=CHK-001` tại thời điểm nhiệm vụ đang chạy.
- Kiểm thử Automation bằng một lượt chạy thật: CHƯA CHẠY.
- Kiểm tra cấu hình Automation cục bộ → PASS: `auto-resume-project`, `ACTIVE`, heartbeat hiện tại, `RRULE:FREQ=HOURLY;INTERVAL=2`, đúng `target_thread_id`.
- `pnpm test` trong `frontend` → PASS: 171/171.
- `python -m unittest discover -s backend/tests -v` → PASS: 29/29.
- `pnpm run build` trong `frontend` → PASS: TypeScript `--noEmit` và Vite production build.
- `pnpm test` sau UX-002 → PASS: 172/172.
- `pnpm run build` sau UX-002 → PASS: TypeScript và Vite production build.
- `pnpm test` sau UX-003 → PASS: 176/176.
- `pnpm run build` sau UX-003 → PASS: TypeScript `--noEmit` và Vite production build.
- `python scripts/validate_source_data.py` sau ARCH-001 → PASS: 0 lỗi, 0 cảnh báo.
- `python -m unittest discover -s backend/tests -v` sau ARCH-001 → PASS: 31/31.
- `pnpm test` sau ARCH-001 → PASS: 179/179.
- `pnpm run build` sau ARCH-001 → PASS: TypeScript, Vite production build, 149 modules.
- QA độc lập vòng hai → PASS: backend hẹp 3/3, frontend catalog/profile 5/5, build PASS; không còn lỗi chặn.
- `python -m unittest discover -s backend/tests -v` sau PROFILE-001 → PASS: 34/34.
- `pnpm test` sau PROFILE-001 → PASS: 179/179.
- `pnpm run build` sau PROFILE-001 → PASS: TypeScript và Vite production build, 149 modules.
- QA PROFILE-001 → PASS: phép tổng, nhóm theo môn, catalog runtime và loại khóa `planned`; không còn lỗi chặn.
- PowerShell parser cho `scripts/start_english_quest.ps1` → PASS.
- `start_english_quest.ps1 -NoBrowser` với backend mới → PASS; `/courses` có 4 khóa và OpenAPI có `/profile/overview`.
- `pnpm test` sau NAV-001 → PASS: 180/180.
- `node --test tests/courseCatalog.test.mjs` sau bổ sung kiểm tra auth → PASS: 4/4.
- `pnpm run build` sau NAV-001 → PASS: TypeScript `--noEmit` và Vite production build, 149 modules.
- `pnpm test` sau PKG-001 → PASS: 182/182.
- `python -m unittest discover -s backend/tests -v` sau PKG-001 → PASS: 37/37.
- `pnpm run build` và PyInstaller onedir/setup → PASS; script build tái tạo artifact và SHA-256.
- Smoke test launcher nguồn → PASS: `/`, `/health`, `/courses`, 4 khóa và database riêng.
- Smoke test bản PyInstaller → PASS: đăng ký/đăng nhập, tắt–mở lại vẫn đăng nhập được bằng database cũ.
- E2E bộ cài cuối → PASS: setup 0, root 200, health ok, catalog 4 khóa, uninstall 0, thư mục chương trình bị xóa, database được giữ.
- `python -m compileall -q backend packaging` → PASS; SHA-256 artifact khớp tệp `.sha256.txt`.
- QA PKG-001 cuối → PASS: không còn blocker; artifact mới hơn source sửa lỗi và hash khớp.

## Lỗi hoặc giới hạn còn tồn tại

- Không thể kiểm kê thay đổi chưa commit cho tới khi dự án được đặt trong Git repository. Không tự khởi tạo Git nếu người dùng chưa yêu cầu.
- Chưa xác minh một lượt Automation thực thi đầu-cuối theo giờ; cấu hình đã `ACTIVE`, nhưng lượt đầu tiên chỉ chạy ở mốc lịch kế tiếp và sẽ chờ nếu chat đang bận.
- Automation không có trigger theo sự kiện “credit vừa reset”. Lịch hai giờ chỉ bảo đảm thử lại ở mốc kế tiếp sau khi hạn mức được khôi phục; nó không chạy ngay đúng thời điểm reset.
- Click-through trong trình duyệt nội bộ đã hoạt động và hoàn tất bằng tài khoản thử tách biệt; không còn giới hạn local browser cho luồng này.
- Một số kiến thức nền không có bản dịch gốc trong dữ liệu nguồn. Các hội thoại Getting Started và từ vựng cốt lõi đã có bản dịch; mục chưa có bản dịch hiện mở ghi chú tiếng Việt an toàn thay vì tự bịa bản dịch.
- Chưa kiểm tra bằng tai giọng TTS và tốc độ chuyển câu trên thiết bị thật; hành vi hủy/thay thế đã được kiểm thử bằng mô phỏng Web Speech API.
- Thư viện chương trình đã được kiểm tra trực quan: đăng nhập mở thư viện, Toán Kỳ 1 mở đúng Bài 1 và đủ 38 nhánh. Trang Hồ sơ còn cuộn ngang tại viewport 390 px.
- Một khóa mới chỉ được mở khi có đủ catalog, activity plan và renderer đã đăng ký. Đây là hàng rào chủ ý để chỉ sửa manifest không thể làm học sinh ghi nhầm điểm.
- Bộ cài chưa ký số nên Windows SmartScreen có thể báo `Unknown publisher`; cần chứng thư code-signing trước khi phát hành rộng rãi.
- Bản hiện tại nhắm Windows 64-bit. Gỡ cài đặt giữ database và một helper dọn dẹp cố định ngoài thư mục app; helper này được ghi đè, không tăng theo mỗi lần gỡ.

## Bước tiếp theo chính xác

1. Không còn mục `IN_PROGRESS` hoặc `TODO`; Automation không tự tạo nhiệm vụ mới.
2. Chờ yêu cầu tiếp theo của người dùng, hoặc dựng lại bộ cài Windows khi người dùng muốn phát hành bản Toán 6 đầy đủ hai học kỳ.
3. Nếu có điều kiện, thẩm âm giọng đọc trên loa thiết bị thật và sửa cuộn ngang của Hồ sơ ở viewport điện thoại.

## Cấu hình Automation đã kích hoạt

- Tên: `Auto Resume Project`.
- Kiểu: heartbeat gắn với cuộc trò chuyện hiện tại.
- Lịch: mỗi 2 giờ.
- Múi giờ: lịch lặp theo khoảng hai giờ nên không phụ thuộc DST; `Asia/Bangkok` không làm thay đổi khoảng lặp này.
- Phạm vi: chỉ tiếp tục mục `IN_PROGRESS`/`TODO`; nếu đang có phiên hoặc mọi việc đã `DONE`/`BLOCKED` thì không tạo công việc trùng.
- Hạn chế: không mua credit, không kích hoạt reset trả phí, không gọi API trả phí riêng, không tạo agent giám sát hạn mức.
- Bằng chứng: `C:\Users\nvngh\.codex\automations\auto-resume-project\automation.toml`; `target_thread_id = "01a1b16e-c4c1-7ba2-a476-3c6748904bef"`.
# Kết quả hoàn tất MATH-VISUAL-IMPLEMENT-001

- 43 bài chính và 31 nhánh tổng hợp có 74 `visualKey` không trùng; Bài 3/10/15/16/17 lần lượt dùng tia số, sàng nguyên tố, cổng dấu ngoặc, chẵn–lẻ dấu tích và bảng dấu thương.
- Trực quan được nhúng ngay sau nội dung trong thẻ “Quy tắc và quy trình”; màn chơi thu gọn không lặp hình. Ba mô hình chuyên dụng Bài 6, 23, 40 được giữ và thu gọn khung khi lồng thẻ.
- Sửa thêm lỗi chuyển bài giữ giá trị thanh kéo cũ: mỗi `lesson_id` tạo lại mô hình và đặt đúng số ban đầu của bài.
- Tệp chính: `SkillsSection.tsx`, `StructuredMathLesson.tsx`, `MathLesson1.tsx`, `MathLessonVisualLab.tsx`, `mathRuleVisualRegistry.ts`, `styles.css` và hai kiểm thử Toán.
- Kiểm thử: hẹp 10/10 PASS; toàn frontend 401/401 PASS; TypeScript/Vite build PASS 273 modules; click-through thật Bài 2, 3, 10, 15–17, 30, 37, 43 PASS.
- Không đổi nội dung câu hỏi, đáp án, ID hoạt động, cách chấm hoặc tiến độ. Chưa có đánh giá trực quan từng bài từ người dùng trên thiết bị đích; chờ người dùng kiểm tra và phản hồi kích thước/màu sắc.
