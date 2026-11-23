import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  competencyDefinitions,
  lessonSpecs,
  levelSequence,
} from "../data/science6_pilot/source/science6PilotSource.mjs";
import {
  presentationTemplates,
  templatesForLesson,
} from "../data/science6_pilot/source/science6PresentationTemplates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "data", "science6_pilot");
const LESSON_DIR = path.join(PACK_DIR, "lessons");

const cognitiveOperations = {
  basic: { label_vi: "Nhận biết trực tiếp", required_actions: ["nhận ra dấu hiệu hoặc quy tắc cốt lõi"] },
  understanding: { label_vi: "So sánh và nêu căn cứ", required_actions: ["so sánh dữ kiện", "nêu căn cứ khoa học"] },
  application: { label_vi: "Chuyển kiến thức sang tình huống mới", required_actions: ["xác định điều kiện mới", "áp dụng quy tắc", "kiểm tra kết quả dự kiến"] },
  challenge: { label_vi: "Đánh giá bằng chứng và giới hạn kết luận", required_actions: ["đọc dữ kiện", "đánh giá căn cứ", "chỉ ra giới hạn", "đề xuất cách kiểm chứng"] },
};

const classificationMaps = {
  1: [
    ["có biến đổi tự nhiên", "hiện tượng tự nhiên", "Sự thay đổi xảy ra trong tự nhiên và có thể quan sát theo điều kiện/thời gian."],
    ["đối tượng và mục tiêu nghiên cứu", "khoa học tự nhiên", "Câu hỏi hướng tới tính chất hoặc quy luật tự nhiên và được kiểm tra bằng bằng chứng."],
    ["đặc trưng sống", "vật sống", "Có nhiều dấu hiệu như trao đổi chất, lớn lên và sinh sản."],
    ["thiếu hệ đặc trưng sống", "vật không sống", "Không có đầy đủ trao đổi chất, lớn lên và sinh sản dù có thể chuyển động thụ động."],
    ["đối tượng là cơ thể sống", "Sinh học", "Nghiên cứu cấu tạo, hoạt động, sinh trưởng và quan hệ môi trường của sinh vật."],
    ["đối tượng là chất và biến đổi chất", "Hóa học", "Nghiên cứu thành phần, tính chất và sự tạo thành chất khác."],
    ["đối tượng là lực/chuyển động/năng lượng/ánh sáng", "Vật lí học", "Nghiên cứu quy luật vật lí mà không nhất thiết tạo chất mới."],
    ["quy mô Trái Đất hoặc thiên thể", "Khoa học Trái Đất/Thiên văn học", "Xếp theo đối tượng là Trái Đất-khí quyển hoặc thiên thể-vũ trụ."],
    ["mục đích ứng dụng", "công nghệ phục vụ đời sống", "Kiến thức khoa học được chuyển thành phương tiện cho liên lạc, sản xuất hoặc vận tải."],
    ["cân bằng lợi ích-rủi ro", "đánh giá tác động công nghệ", "Quyết định phải xét đồng thời lợi ích, sức khỏe, tài nguyên và môi trường."],
  ],
  2: [
    ["đường phơi nhiễm", "bảo hộ cá nhân", "Chọn hàng rào bảo vệ đúng bộ phận có nguy cơ tiếp xúc."],
    ["mức độ nhận diện chất", "kiểm tra trước sử dụng", "Chất chưa rõ nhãn phải được giữ nguyên và báo người phụ trách."],
    ["nguồn nguy hiểm", "nguy cơ điện", "Thiết bị điện gần ẩm thuộc nhóm phải cô lập và báo người lớn."],
    ["tác động lên mô/vật liệu", "nguy cơ hóa học - ăn mòn", "Kí hiệu ăn mòn yêu cầu tránh tiếp xúc da, mắt và bề mặt."],
    ["đường gây hại", "nguy cơ hóa học - độc", "Chất có thể gây hại khi hít, nuốt hoặc tiếp xúc thuộc nhóm chất độc."],
    ["tác nhân sống", "nguy cơ sinh học", "Mẫu có khả năng chứa vi sinh vật phải được kiểm soát và giám sát."],
    ["dạng tổn thương", "nguy cơ vật sắc", "Dụng cụ nứt/vỡ thuộc nhóm có thể gây đứt và phát tán mẫu."],
    ["loại sự cố", "tràn đổ chưa xác định", "Chất đổ chưa rõ phải khoanh vùng và báo cáo, không tự lau."],
    ["nguồn năng lượng", "nguy cơ nhiệt", "Vật đang hoặc vừa đun thuộc nhóm có nguy cơ bỏng/bắn mẫu."],
    ["giai đoạn hoạt động", "kết thúc và khử nhiễm", "Thu dọn, phân loại chất thải và rửa tay thuộc bước kết thúc."],
  ],
  3: [
    ["mục đích quan sát", "phóng đại chi tiết nhỏ", "Kính lúp phù hợp khi cần làm ảnh của vật nhỏ dễ quan sát hơn."],
    ["hình dạng bộ phận quang học", "tấm kính hội tụ", "Tấm kính có rìa mỏng hơn phần giữa là bộ phận tạo ảnh phóng đại."],
    ["chức năng cơ học", "khung và tay cầm", "Bộ phận giữ-bảo vệ kính và giúp điều chỉnh an toàn không phải bộ phận tạo ảnh."],
    ["mức ảnh lớn tương đối", "độ phóng đại", "Chỉ số 3–20 lần mô tả mức phóng to ảnh, không tự bảo đảm ảnh đang rõ."],
    ["tính cơ động", "kính lúp cầm tay", "Nhiệm vụ quan sát nhanh ngoài bàn phù hợp loại cầm tay."],
    ["độ ổn định và chiếu sáng", "kính để bàn có đèn", "Công việc kéo dài trên bàn cần giá đỡ và ánh sáng ổn định."],
    ["nhu cầu dùng hai tay", "kính lúp đeo mắt", "Thao tác sửa chữa chi tiết phù hợp loại giữ trước mắt để hai tay rảnh."],
    ["trình tự điều chỉnh khoảng cách", "lấy nét", "Bắt đầu gần vật rồi dịch kính chậm đến khi ảnh rõ nhất."],
    ["trạng thái sau điểm rõ", "ảnh mờ do quá khoảng lấy nét", "Tiếp tục đưa kính xa sau vị trí rõ có thể làm ảnh mờ trở lại."],
    ["tác động lên mặt kính", "vệ sinh và bảo quản", "Khăn mềm và hộp sạch bảo vệ mặt kính; vật nhám có thể gây xước."],
  ],
  4: [
    ["kích thước chi tiết cần thấy", "kính hiển vi quang học", "Cấu trúc như tế bào cần mức phóng đại cao hơn kính lúp."],
    ["vị trí đối với mắt", "thị kính", "Bộ phận ở đầu ống kính để mắt quan sát và có ghi độ phóng đại."],
    ["vị trí gần mẫu", "vật kính và đĩa quay", "Vật kính gần tiêu bản; đĩa quay dùng chọn các mức phóng đại."],
    ["biên độ điều chỉnh", "ốc to", "Điều chỉnh khoảng cách nhanh để đưa ảnh vào vùng thấy thuộc lấy nét thô."],
    ["biên độ điều chỉnh nhỏ", "ốc nhỏ", "Điều chỉnh chậm sau khi đã thấy mẫu thuộc lấy nét tinh."],
    ["chức năng giữ mẫu", "bàn kính và kẹp", "Bộ phận đặt, định tâm và giữ tiêu bản ổn định."],
    ["nguồn tạo trường nhìn", "đèn chiếu sáng", "Ánh sáng phù hợp giúp thấy mẫu và độ tương phản."],
    ["trình tự thao tác", "quy trình năm bước", "Chọn vật kính-chỉnh sáng-đặt tiêu bản-ốc to-ốc nhỏ là thứ tự an toàn."],
    ["phạm vi quan sát", "chọn dụng cụ phù hợp", "Dụng cụ được chọn theo kích thước chi tiết, không chỉ theo kích thước toàn vật."],
    ["nguy cơ thiết bị", "di chuyển và bảo quản", "Hai tay đỡ thân-chân, tay khô và giấy chuyên dụng bảo vệ kính."],
  ],
  5: [
    ["nguồn kết luận", "phép đo khách quan", "Khi hình nền gây ảo giác, số đo bằng dụng cụ đáng tin hơn cảm giác."],
    ["hệ đơn vị", "mét SI", "Kết quả chiều dài chuẩn cần số và kí hiệu m hoặc đơn vị dẫn xuất phù hợp."],
    ["tỉ lệ giữa đơn vị", "đổi đơn vị", "Đổi đơn vị phải theo đúng hệ số mm-cm-dm-m-km và giữ nguyên độ dài thật."],
    ["bậc độ lớn", "đơn vị phù hợp", "Đơn vị được chọn theo kích thước để số đo dễ đọc và so sánh."],
    ["hình dạng và phạm vi", "loại thước phù hợp", "Đường thẳng, đường cong, khoảng dài và đường kính cần dụng cụ khác nhau."],
    ["giá trị lớn nhất", "giới hạn đo", "GHD phải lớn hơn một chút so với giá trị cần đo để tránh ghép nhiều lần."],
    ["khoảng hai vạch", "độ chia nhỏ nhất", "ĐCNN là độ dài giữa hai vạch chia liên tiếp, không phải số vạch."],
    ["thứ tự kiểm soát sai số", "quy trình năm bước", "Ước lượng-chọn, đặt mốc, nhìn vuông góc, đọc và ghi là chuỗi đầy đủ."],
    ["kiểu sai lệch", "lỗi mốc và thị sai", "Mốc 0 sai và góc nhìn xiên tạo số đọc lệch theo hai cơ chế khác nhau."],
    ["độ ổn định dữ liệu", "đo lặp và trung bình", "Nhiều lần đo cùng điều kiện giúp nhận bất thường và lấy giá trị đại diện."],
  ],
  6: [
    ["đại lượng vật chất", "khối lượng", "Khối lượng đo lượng chất, không suy từ hình dạng hay thể tích nhìn thấy."],
    ["hệ đơn vị", "kilôgam SI", "Số đo chuẩn cần kèm kg hoặc đơn vị khối lượng phù hợp."],
    ["tỉ lệ đơn vị", "đổi đơn vị khối lượng", "mg-g-hg-kg-tạ-tấn liên hệ bằng các hệ số xác định."],
    ["vật và phạm vi", "loại cân phù hợp", "Cân được chọn theo vật, GHD và độ chính xác cần thiết."],
    ["phạm vi và phân giải", "GHD-ĐCNN", "GHD ngăn quá tải, ĐCNN quyết định bước đọc nhỏ nhất."],
    ["mốc không tải", "chỉnh số 0", "Cân không tải phải chỉ 0 trước khi đo để tránh lệch hệ thống."],
    ["vị trí và góc đọc", "đặt vật-đọc cân", "Vật ở giữa, cân phẳng, mắt vuông góc và kim ổn định tạo số đọc đúng."],
    ["khấu trừ vật chứa", "tare", "Tare đặt lại mốc khi bình rỗng để chỉ đo phần vật bên trong."],
    ["điều kiện gây sai", "thao tác sai hoặc quá tải", "Cân nghiêng, vật lệch/cồng kềnh, đọc sớm và quá tải phải được sửa trước."],
    ["mốc hợp lí", "ước lượng trước", "Ước lượng giúp chọn cân và nhận số liệu bất thường."],
  ],
  7: [
    ["hai mốc sự kiện", "khoảng thời gian", "Phải thống nhất mốc đầu và cuối trước khi đo."],
    ["hệ đơn vị", "giây SI", "Thời gian ngắn được ghi bằng số và kí hiệu s."],
    ["hệ số quy đổi", "đơn vị thời gian", "Phút-giờ-ngày dùng hệ số 60 và 24, không mặc định hệ 10."],
    ["cơ chế và điều kiện", "dụng cụ lịch sử", "Mặt Trời cần nắng; đồng hồ cát đo khoảng theo dòng cát."],
    ["mục đích xem giờ", "đồng hồ thường", "Theo dõi thời điểm và khoảng dài không cần bấm mốc nhanh."],
    ["mục đích đo khoảng ngắn", "đồng hồ bấm giây", "Start-stop-reset gắn số đo với sự kiện có mốc rõ."],
    ["bậc thời gian", "ước lượng trước", "Dự đoán giúp chọn đơn vị, dụng cụ và kiểm tra số đọc."],
    ["thứ tự điều khiển", "reset-start-stop", "Đặt 0, bắt đầu đúng mốc và dừng đúng mốc là chuỗi bắt buộc."],
    ["độ trễ con người", "sai số phản xạ", "Thời gian phản ứng tạo chênh lệch nhỏ dù cùng sự kiện."],
    ["độ tin cậy", "đo lặp", "Nhiều lần cùng quy ước giúp phát hiện bất thường và lấy giá trị đại diện."],
  ],
  8: [
    ["đại lượng cần xác định", "nhiệt độ", "Phân loại theo mức nóng-lạnh đo được, không theo cảm giác."],
    ["thang đo", "Celsius", "Kết quả theo thang Celsius phải kèm kí hiệu °C."],
    ["đối tượng đo", "nhiệt kế phòng", "Không khí trong lớp cần loại nhiệt kế dành cho môi trường."],
    ["phạm vi dụng cụ", "giới hạn đo", "Giá trị dự kiến phải nằm dưới giới hạn đo của nhiệt kế."],
    ["độ phân giải", "độ chia nhỏ nhất", "Mức chênh cần phân biệt quyết định độ chia cần chọn."],
    ["vị trí đầu đo", "tiếp xúc đúng mẫu", "Đầu đo ở trong mẫu nhưng không chạm thành/đáy."],
    ["trạng thái số đọc", "ổn định nhiệt", "Số còn đổi thuộc giai đoạn chưa đủ điều kiện ghi."],
    ["góc quan sát", "đọc tránh thị sai", "Mắt ngang mức cột chất lỏng thuộc thao tác đọc đúng."],
    ["mục đích sử dụng", "nhiệt kế y tế", "Dụng cụ tiếp xúc cơ thể thuộc nhóm cần vệ sinh/bao đầu đo."],
    ["độ nhất quán dữ liệu", "đo lặp lại", "Số đo chênh lớn cần kiểm tra thao tác và lặp cùng điều kiện."],
  ],
  9: [
    ["vai trò cấu tạo", "vật thể-chất", "Vật thể là đối tượng cụ thể; chất là vật liệu tạo nên vật thể."],
    ["nguồn hình thành", "tự nhiên/nhân tạo", "Phân loại theo vật có sẵn trong tự nhiên hay do con người tạo."],
    ["đặc trưng sống", "sống/không sống", "Trao đổi chất, lớn lên và sinh sản là căn cứ, không chỉ chuyển động."],
    ["số thành phần", "một hoặc nhiều chất", "Cần dữ liệu thành phần, không suy chỉ từ vẻ ngoài."],
    ["nguồn thu nhận", "tự nhiên/điều chế", "Nguồn chất không tự quyết định mức an toàn hay độc hại."],
    ["cách xác định", "tính chất quan sát", "Trạng thái, màu, bề mặt được mô tả an toàn không cần tạo chất mới."],
    ["dữ liệu định lượng", "tính chất đo", "Nhiệt độ chuyển thể, khối lượng riêng và tính dẫn cần số đo/đơn vị."],
    ["không tạo chất mới", "tính chất vật lí", "Đổi trạng thái/hình dạng nhưng cùng chất thuộc biến đổi vật lí."],
    ["có tạo chất mới", "tính chất hóa học", "Sản phẩm có thành phần-tính chất mới là dấu hiệu hóa học."],
    ["so sánh trước-sau", "bằng chứng chất mới", "Gỉ khác sắt về màu và tính chất là bằng chứng cần giải thích."],
  ],
  10: [
    ["trạng thái tồn tại", "rắn-lỏng-khí", "Phân loại theo hình dạng, khả năng chảy và chịu nén trong điều kiện đang xét."],
    ["hình dạng và độ nén", "thể rắn", "Giữ hình dạng, không chảy và rất khó nén là nhóm rắn."],
    ["hình dạng vật chứa và khả năng chảy", "thể lỏng", "Đổi hình dạng theo phần vật chứa, chảy được và khó nén là nhóm lỏng."],
    ["lan tỏa và chịu nén", "thể khí", "Chiếm đầy vật chứa, lan tỏa và dễ nén là nhóm khí."],
    ["sắp xếp-khoảng cách-chuyển động", "mô hình hạt", "Ba yếu tố vi mô được dùng giải thích tính chất của ba thể."],
    ["chiều rắn-lỏng", "nóng chảy/đông đặc", "Trạng thái trước-sau và chiều trao đổi năng lượng phân biệt hai quá trình."],
    ["vị trí bề mặt", "bay hơi", "Hóa hơi ở bề mặt, xảy ra ở nhiều nhiệt độ và chịu ảnh hưởng nhiệt-gió-diện tích."],
    ["vị trí toàn khối và nhiệt độ", "sôi", "Hóa hơi trong lòng lẫn bề mặt tại nhiệt độ sôi thuộc quá trình sôi."],
    ["chiều khí-lỏng", "ngưng tụ", "Hơi mất năng lượng và tạo giọt lỏng thuộc ngưng tụ."],
    ["chuỗi tự nhiên", "vòng tuần hoàn nước", "Bay hơi-ngưng tụ-mưa liên kết các trạng thái nước trong tự nhiên."],
  ],
  17: [
    ["độ tan và kích thước hạt", "lọc", "Chất rắn không tan, hạt lớn hơn lỗ lọc được giữ lại."],
    ["khả năng lắng", "lắng-gạn", "Hạt lơ lửng nặng lắng xuống trước khi gạn lớp trên."],
    ["khả năng bay hơi", "cô cạn", "Dung môi dễ bay hơi được loại để thu chất rắn khó bay hơi."],
    ["tính tan lẫn và khối lượng riêng", "chiết", "Hai chất lỏng không tan tạo lớp để tách."],
    ["tính từ", "tách bằng nam châm", "Thành phần bị nam châm hút được tách khỏi thành phần không bị hút."],
    ["kích thước hạt", "rây", "Hạt nhỏ qua mắt rây, hạt lớn bị giữ."],
    ["tính chất khác biệt", "chọn phương pháp", "Phương pháp được phân loại theo tính chất khác nhau cần khai thác."],
    ["số loại tính chất cần khai thác", "chuỗi nhiều bước", "Hỗn hợp có nhiều thành phần cần nhiều phép tách nối tiếp."],
    ["mức độ sạch", "trong nhưng chưa an toàn", "Độ trong chỉ phản ánh hạt nhìn thấy, không xác nhận chất tan/vi sinh vật."],
    ["sự phân lớp", "thu gom dầu-nước", "Dầu không tan nổi thành lớp cần thiết bị thu gom chuyên dụng."],
  ],
  21: [
    ["độ dày mẫu", "tiêu bản truyền sáng", "Mẫu mỏng/phẳng thuộc nhóm cho ánh sáng đi qua tốt."],
    ["cách đậy mẫu", "giảm bọt khí", "Hạ lamen nghiêng thuộc quy trình hạn chế bọt che mẫu."],
    ["thứ tự độ phóng đại", "tìm mẫu ở vật kính nhỏ", "Bắt đầu trường nhìn rộng rồi mới tăng phóng đại."],
    ["độ tương phản", "điều chỉnh ánh sáng", "Ảnh tối/chói được xử lí bằng ánh sáng/khẩu độ."],
    ["mức điều chỉnh", "lấy nét thô-tinh", "Chỉnh thô dùng ban đầu; chỉnh tinh dùng làm rõ chi tiết."],
    ["loại bằng chứng", "hình vẽ quan sát", "Hình khoa học chỉ ghi cấu trúc thực sự thấy được."],
    ["cấu trúc ranh giới", "tế bào thực vật", "Thành tế bào rõ và các ô xếp sát là dấu hiệu mẫu thực vật."],
    ["cấu trúc ranh giới", "tế bào động vật", "Không có thành tế bào là dấu hiệu phân biệt với tế bào thực vật."],
    ["bộ phận quang học", "vệ sinh kính", "Thị kính/vật kính chỉ lau bằng giấy chuyên dụng."],
    ["mức chắc chắn kết luận", "không quan sát được", "Thiếu hình ảnh không đồng nghĩa cấu trúc chắc chắn không tồn tại."],
  ],
  26: [
    ["số nhánh tại mỗi bước", "cặp lưỡng phân", "Mỗi bước phải cho đúng hai lựa chọn loại trừ nhau."],
    ["khả năng kiểm chứng", "đặc điểm quan sát/đo được", "Đặc điểm khách quan được ưu tiên hơn nhận xét cảm tính."],
    ["độ bền của đặc điểm", "đặc điểm ổn định", "Đặc điểm ít thay đổi cho kết quả phân loại nhất quán."],
    ["trình tự sử dụng", "đường đi từ gốc", "Phải bắt đầu từ cặp đầu và ghi từng lựa chọn."],
    ["tính đồng nhất tiêu chí", "hai trạng thái cùng đặc điểm", "Hai vế phải xét cùng một đặc điểm."],
    ["hiệu quả chia nhóm", "tiêu chí đầu hữu ích", "Tiêu chí đầu nên giảm rõ số đối tượng còn lại."],
    ["số đối tượng còn lại", "đầu cuối duy nhất", "Chỉ ghi tên khi nhánh còn một đối tượng."],
    ["độ bao phủ", "kiểm thử toàn bộ", "Mọi đối tượng phải đi được đến một đầu cuối."],
    ["mức chồng lấp", "nhánh cần sửa", "Đối tượng vào hai nhánh chứng tỏ mô tả chưa loại trừ."],
    ["độ chính xác và hiệu quả", "so sánh nhiều khóa", "Khóa khác thứ tự vẫn đúng nếu phân loại đủ và không mơ hồ."],
  ],
  42: [
    ["trạng thái tải", "chiều dài ban đầu", "Giá trị khi chưa treo vật là mốc l0."],
    ["đại lượng tính toán", "độ dãn", "Độ dãn là chiều dài có tải trừ chiều dài ban đầu."],
    ["vai trò biến", "khối lượng là biến thay đổi", "Khối lượng thay đổi, độ dãn được đo đáp ứng."],
    ["dạng quan hệ", "tỉ lệ trong vùng đàn hồi", "Các điểm gần đường thẳng qua gốc biểu thị quan hệ tỉ lệ."],
    ["chức năng dụng cụ", "cân lò xo", "Vị trí chỉ thị đã hiệu chuẩn dùng suy ra tải."],
    ["khả năng phục hồi", "vượt giới hạn đàn hồi", "Không trở lại l0 sau tháo tải thuộc biến dạng không phục hồi."],
    ["độ tin cậy", "đo lặp lại", "Số đo khác nhau cần kiểm tra dao động, mốc và thao tác."],
    ["vai trò trục", "đồ thị khối lượng-độ dãn", "Khối lượng ở trục ngang, độ dãn ở trục dọc."],
    ["yếu tố cấu tạo", "độ cứng lò xo", "Cùng tải nhưng lò xo khác nhau có thể dãn khác nhau."],
    ["mối liên hệ dữ liệu-vạch", "hiệu chuẩn thang đo", "Mỗi vạch phải gắn với tải chuẩn đã đo."],
  ],
  48: [
    ["đối tượng cho-nhận", "truyền năng lượng", "Năng lượng đi từ tay sang xe khi tay tác dụng làm xe chuyển động."],
    ["dạng trước-sau", "chuyển hóa năng lượng", "Hóa học-điện-ánh sáng/nhiệt là chuỗi chuyển hóa."],
    ["tổng năng lượng", "bảo toàn", "Phần giảm ở một dạng chuyển sang dạng khác hoặc môi trường."],
    ["vị trí và tốc độ", "thế năng-động năng", "Lên cao tăng thế năng; xuống nhanh tăng động năng."],
    ["mục đích thiết bị", "đầu ra có ích", "Chuyển động không khí là tác dụng chính của quạt."],
    ["mức hữu ích", "năng lượng phân tán", "Nhiệt và âm ngoài mục đích thuộc phần ít hữu ích."],
    ["đầu ra quan sát", "ánh sáng và nhiệt", "Bóng đèn tạo đồng thời ánh sáng và nhiệt."],
    ["nguồn ban đầu", "hóa năng thức ăn", "Cơ thể chuyển hóa hóa năng thành vận động và nhiệt."],
    ["môi trường truyền", "năng lượng âm", "Dao động nguồn truyền qua không khí đến người nghe."],
    ["số công đoạn", "chuỗi nhiều bước", "Ánh sáng-điện-chuyển động cùng nhiệt/âm là chuỗi hệ thống."],
  ],
  53: [
    ["nguồn ánh sáng", "phản xạ ánh sáng Mặt Trời", "Mặt Trăng được nhìn thấy nhờ ánh sáng phản xạ."],
    ["phần được chiếu", "một bán cầu sáng", "Mặt Trời chiếu sáng gần một nửa bề mặt Mặt Trăng."],
    ["góc nhìn phần sáng", "pha Mặt Trăng", "Pha là phần bán cầu sáng nhìn thấy từ Trái Đất."],
    ["cơ chế che khuất", "pha khác nguyệt thực", "Pha hằng tháng do góc nhìn; nguyệt thực mới liên quan bóng Trái Đất."],
    ["vị trí tương đối", "trăng mới", "Mặt Trăng gần hướng Mặt Trời nên phần sáng quay xa người quan sát."],
    ["vị trí tương đối", "trăng tròn", "Mặt Trăng ở phía đối diện Mặt Trời nên thấy gần trọn mặt sáng."],
    ["phần đĩa sáng", "bán nguyệt", "Góc nhìn gần vuông cho thấy khoảng nửa đĩa sáng."],
    ["thời gian lặp pha", "chu kì xấp xỉ 29,5 ngày", "Từ một pha đến pha cùng tên kế tiếp mất gần một tháng."],
    ["chuyển động quỹ đạo", "quay quanh Trái Đất", "Vị trí biểu kiến đổi dần do chuyển động quỹ đạo."],
    ["đủ dữ kiện quan sát", "nhật ký pha", "Ngày, giờ, hướng và hình phần sáng tạo chuỗi bằng chứng so sánh."],
  ],
};

const taskLeads = {
  basic: "Chọn dấu hiệu hoặc thao tác đúng trực tiếp từ dữ kiện.",
  understanding: "So sánh các dữ kiện và chọn phương án có căn cứ khoa học.",
  application: "Vận dụng quy tắc vào tình huống mới, đồng thời kiểm soát điều kiện.",
  challenge: "Đánh giá một kết luận, phát hiện giới hạn và chọn cách kiểm chứng.",
};

const diagnosticTags = {
  "observe-identify": ["ignore-observation", "incomplete-record", "unverified-conclusion"],
  "classify-model": ["subjective-criterion", "over-grouping", "criterion-switch"],
  "measure-analyze": ["missing-condition", "single-guess", "confounded-variables"],
  "predict-reason": ["unsupported-prediction", "reverse-prediction", "overgeneralization"],
  "experiment-safety": ["no-permission", "skipped-safety-step", "continue-after-warning"],
  "explain-apply": ["claim-without-evidence", "reversed-causality", "invalid-transfer"],
};

function lowerFirst(value) {
  return value.charAt(0).toLocaleLowerCase("vi") + value.slice(1);
}

function lessonId(number) {
  return `science6-l${String(number).padStart(2, "0")}`;
}

function rotate(values, shift) {
  return values.map((_, index) => values[(index + shift) % values.length]);
}

function uniqueOptions(answer, distractors, seed) {
  const unique = [...new Set(distractors.filter((value) => value !== answer))].slice(0, 3);
  if (unique.length !== 3) {
    throw new Error(`Không tạo đủ ba phương án nhiễu cho ${answer}`);
  }
  const options = [answer, ...unique];
  return rotate(options, seed % options.length);
}

function correctAnswer(competencyId, item, level, classification) {
  const byCompetency = {
    "observe-identify": {
      basic: item.fact,
      understanding: `${item.fact} Dấu hiệu này có ý nghĩa vì ${item.reason}.`,
      application: `Cần ghi cả bối cảnh “${item.context}” và kết quả “${item.outcome}” trước khi kết luận.`,
      challenge: `(1) Đọc bối cảnh “${item.context}”; (2) kiểm tra dấu hiệu “${item.fact}”; (3) giới hạn kết luận trong điều đã quan sát; (4) kiểm chứng lại bằng bản ghi độc lập.`,
    },
    "classify-model": {
      basic: `Xếp vào nhóm “${classification.group}” theo tiêu chí ${classification.criterion}.`,
      understanding: `Dùng tiêu chí “${classification.criterion}”; quy tắc phân loại là: ${classification.rule}`,
      application: `Áp dụng tiêu chí ${classification.criterion} để xếp vào “${classification.group}”, rồi kiểm tra lại bằng quy tắc: ${classification.rule}`,
      challenge: `(1) Xác định tiêu chí “${classification.criterion}”; (2) áp dụng cùng một quy tắc cho mọi đối tượng; (3) kiểm tra không chồng lấp; (4) xác nhận kết quả thuộc nhóm “${classification.group}”.`,
    },
    "measure-analyze": {
      basic: `Ghi điều kiện “${item.context}” và kết quả “${item.outcome}”.`,
      understanding: `Đối chiếu “${item.outcome}” với căn cứ “${item.reason}” và ghi đủ điều kiện quan sát.`,
      application: `So sánh ít nhất hai bản ghi được thu trong cùng điều kiện an toàn, rồi kiểm tra xem bằng chứng có cùng hỗ trợ kết quả “${item.outcome}” hay không; không tự lặp lại hoạt động có rủi ro.`,
      challenge: `(1) Đọc đủ điều kiện; (2) kiểm tra quy trình “${item.procedure}”; (3) phát hiện hàng dữ liệu thiếu kiểm soát; (4) dùng lần lặp để xác nhận “${item.outcome}”.`,
    },
    "predict-reason": {
      basic: `Nếu ${lowerFirst(item.procedure)}, ${lowerFirst(item.outcome)}.`,
      understanding: `Dự đoán “${item.outcome}” vì ${item.reason}.`,
      application: `Trong tình huống mới, nếu vẫn giữ điều kiện cốt lõi “${item.reason}” thì dự đoán “${item.outcome}”.`,
      challenge: `(1) Xác định căn cứ “${item.reason}”; (2) dự đoán “${item.outcome}”; (3) nêu điều kiện giới hạn; (4) đề xuất kiểm tra lại khi quy trình hoặc đối tượng thay đổi.`,
    },
    "experiment-safety": {
      basic: item.procedure,
      understanding: `${item.procedure} Bước này cần thiết vì ${item.reason}.`,
      application: `Trước hết xin phép và kiểm tra điều kiện; sau đó ${lowerFirst(item.procedure)}; dừng nếu xuất hiện bất thường.`,
      challenge: `(1) Xin phép và nhận diện nguy cơ; (2) thực hiện “${item.procedure}”; (3) ghi “${item.outcome}”; (4) dừng và báo người lớn nếu điều kiện thay đổi hoặc có bất thường.`,
    },
    "explain-apply": {
      basic: `${item.fact} Vì ${item.reason}.`,
      understanding: `Bằng chứng “${item.outcome}” phù hợp với giải thích: ${item.reason}.`,
      application: `Vận dụng bằng cách ${lowerFirst(item.procedure)}; kết quả dự kiến là ${lowerFirst(item.outcome)} vì ${item.reason}.`,
      challenge: `(1) Nêu khẳng định “${item.fact}”; (2) dùng bằng chứng “${item.outcome}”; (3) nối bằng cơ chế “${item.reason}”; (4) giới hạn kết luận trong bối cảnh “${item.context}”.`,
    },
  };
  return byCompetency[competencyId][level];
}

function buildRepresentation(template, competencyId, item, index, level, classification) {
  const id = `${template.id}-${index + 1}`;
  const common = {
    id,
    type: template.id,
    renderer_kind: template.renderer_kind,
    title_vi: template.title_vi,
    student_action_vi: template.action_vi,
    level,
    focus_vi: item.name,
    evidence_policy: "Chỉ dùng dữ kiện đã có trong thẻ kiến thức; không tự sinh số liệu hoặc kết quả.",
  };
  if (template.id === "annotated-scene") {
    return { ...common, type: "annotated-scene", title_vi: "Phiếu quan sát", elements: [{ label: "Bối cảnh", value: item.context }, { label: "Dấu hiệu cần kiểm tra", value: item.fact }, { label: "Giới hạn", value: "Chỉ kết luận từ điều quan sát được" }] };
  }
  if (template.id === "classification-grid") {
    return { ...common, type: "classification-grid", title_vi: "Lưới phân loại", criterion_vi: classification.criterion, target_group_vi: classification.group, rule_vi: classification.rule, cards: [item.context, item.fact, item.outcome], requirement_vi: level === "challenge" ? "Kiểm tra tiêu chí có loại trừ và lặp lại được" : "Chọn một tiêu chí nhất quán" };
  }
  if (template.id === "evidence-table") {
    return { ...common, type: "evidence-table", title_vi: "Bảng bằng chứng", columns: ["Lần", "Điều kiện", "Kết quả"], rows: [[1, item.context, item.outcome], [2, "Giữ đúng quy trình", item.outcome], [3, "Bỏ qua một điều kiện", "Kết quả không đủ tin cậy"]], analysis_prompt_vi: level === "basic" ? "Đọc đúng hàng dữ liệu" : "So sánh độ tin cậy giữa các hàng" };
  }
  if (template.id === "cause-effect-map") {
    return { ...common, type: "cause-effect-map", title_vi: "Sơ đồ dự đoán", nodes: [{ role: "căn cứ", text: item.reason }, { role: "thao tác", text: item.procedure }, { role: "kết quả", text: item.outcome }], missing_link_vi: level === "challenge" ? "Nêu điều kiện làm dự đoán không còn đúng" : "Nối căn cứ với kết quả" };
  }
  if (template.id === "procedure-cards") {
    return { ...common, type: "procedure-cards", title_vi: "Thẻ quy trình", cards: [{ order: 1, text: "Xin phép và kiểm tra điều kiện" }, { order: 2, text: item.procedure }, { order: 3, text: `Ghi nhận: ${item.outcome}` }, { order: 4, text: "Dừng và báo người lớn nếu bất thường" }], hazard_check_vi: "Không tự ý thay dụng cụ hoặc bỏ bước" };
  }
  if (template.id === "claim-evidence-reasoning") {
    return { ...common, claim_vi: item.fact, evidence_vi: item.outcome, reasoning_vi: item.reason, transfer_vi: item.context };
  }
  if (template.id === "diagram-labeling") {
    return { ...common, diagram_subject_vi: item.context, anchors: ["khái niệm", "dấu hiệu", "kết quả"], labels: [item.name, item.fact, item.outcome], label_rule_vi: "Mỗi nhãn chỉ được đặt theo dữ kiện đã cung cấp" };
  }
  if (template.id === "sequence-builder") {
    return { ...common, sequence: [{ role: "bối cảnh", text: item.context }, { role: "thao tác", text: item.procedure }, { role: "kết quả", text: item.outcome }, { role: "giải thích", text: item.reason }], ordering_rule_vi: "Không thêm bước hoặc kết quả ngoài thẻ kiến thức" };
  }
  if (template.id === "error-diagnosis") {
    return { ...common, case_vi: item.context, evidence_vi: item.fact, flawed_step_vi: "Bỏ qua căn cứ đã cung cấp và kết luận theo cảm giác", correction_basis_vi: item.reason, expected_revision_vi: item.outcome };
  }
  if (template.id === "before-after-comparison") {
    return { ...common, before_vi: item.context, action_vi: item.procedure, after_vi: item.outcome, explanation_vi: item.reason };
  }
  if (template.id === "diagram-gap-fill") {
    return { ...common, nodes: [{ id: "fact", text: item.fact }, { id: "reason", text: null }, { id: "outcome", text: item.outcome }], missing_node_id: "reason", answer_source_vi: item.reason };
  }
  if (template.id === "chart-reading") {
    return { ...common, chart_mode: "qualitative-only", categories: ["Điều kiện", "Bằng chứng", "Kết quả"], values: [item.context, item.reason, item.outcome], data_policy_vi: "Không hiển thị số đo khi thẻ kiến thức không cung cấp số liệu" };
  }
  if (template.id === "experiment-designer") {
    return { ...common, question_vi: item.context, known_fact_vi: item.fact, condition_basis_vi: item.reason, planned_action_vi: item.procedure, expected_record_vi: item.outcome, safety_rule_vi: "Chỉ mô phỏng hoặc thực hiện khi được cho phép và hướng dẫn" };
  }
  if (template.id === "tool-selector") {
    return { ...common, goal_vi: item.context, required_action_vi: item.procedure, selection_basis_vi: item.reason, expected_result_vi: item.outcome, restriction_vi: "Không suy ra tên dụng cụ nếu nguồn không nêu" };
  }
  if (template.id === "virtual-lab") {
    return { ...common, scene_vi: item.context, controls: [{ id: "condition", value: item.reason }, { id: "action", value: item.procedure }], predicted_output_vi: item.outcome, implementation_status: "specification-only", scored: false };
  }
  if (template.id === "decision-scenario") {
    return { ...common, situation_vi: item.context, verified_fact_vi: item.fact, decision_basis_vi: item.reason, recommended_action_vi: item.procedure, expected_result_vi: item.outcome };
  }
  if (template.id === "multi-layer-matching") {
    return { ...common, columns: ["Khái niệm", "Căn cứ", "Thao tác", "Kết quả"], correct_chain: [item.name, item.reason, item.procedure, item.outcome], match_policy_vi: "Chỉ ghép các mảnh lấy từ cùng thẻ kiến thức" };
  }
  return { ...common, nodes: [item.name, item.fact, item.reason, item.outcome], links: [{ from: item.name, to: item.fact, relation: "được mô tả bởi" }, { from: item.reason, to: item.outcome, relation: "giải thích" }], context_vi: item.context };
}

function buildPrompt(template, competencyId, item, level, classification) {
  const lead = {
    basic: "Nhận biết",
    understanding: "So sánh và giải thích",
    application: "Vận dụng vào tình huống mới",
    challenge: "Đánh giá kết luận và giới hạn",
  }[level];
  const competencyActions = {
    "observe-identify": "nhận biết đúng dấu hiệu và không suy diễn quá mức",
    "classify-model": "dùng một tiêu chí phân loại nhất quán",
    "measure-analyze": "ghi và phân tích bằng chứng đáng tin cậy",
    "predict-reason": "nối dự đoán với căn cứ và điều kiện",
    "experiment-safety": "giữ đủ trình tự và điểm dừng an toàn",
    "explain-apply": "nối đúng khẳng định, bằng chứng và cơ chế",
  };
  const actionRequirement = level === "challenge"
    ? " Phương án phải đủ: dữ kiện, căn cứ, giới hạn và cách kiểm chứng."
    : level === "application"
      ? " Phương án phải đủ: điều kiện mới, quy tắc và kiểm tra kết quả."
      : "";
  return `${lead}: dùng “${template.title_vi}” cho “${item.name}”. Chọn phương án ${template.action_vi} và ${competencyActions[competencyId]}.${actionRequirement}`;
}

function misconceptionOptions(competencyId, item, answer, classification, level) {
  const records = {
    "observe-identify": [
      { option: `Không cần ghi dấu hiệu về ${item.name.toLowerCase()}; có thể kết luận theo cảm giác ban đầu.`, error: "Bỏ qua quan sát", why: `Cảm giác không thay thế bằng chứng “${item.fact}”.` },
      { option: `Chỉ ghi “${item.outcome}” nhưng bỏ bối cảnh và điều kiện quan sát.`, error: "Bản ghi thiếu điều kiện", why: `Không có bối cảnh “${item.context}” thì không thể kiểm tra lại kết luận.` },
      { option: `Từ một chi tiết chưa kiểm tra, khẳng định chắc chắn mọi trường hợp đều giống nhau.`, error: "Khái quát quá mức", why: `Một dấu hiệu đơn lẻ không đủ để vượt qua giới hạn bằng chứng về ${item.name.toLowerCase()}.` },
    ],
    "classify-model": [
      { option: `Xếp theo cảm giác thích/không thích thay vì tiêu chí ${classification.criterion}.`, error: "Dùng tiêu chí chủ quan", why: `Tiêu chí chủ quan không lặp lại được và không tuân theo quy tắc “${classification.rule}”.` },
      { option: `Gộp mọi đối tượng vào một nhóm, không kiểm tra dấu hiệu “${item.fact}”.`, error: "Gộp nhóm quá rộng", why: `Cách này không phân biệt được đối tượng theo căn cứ ${item.reason}.` },
      { option: `Mỗi đối tượng dùng một tiêu chí khác nhau nên không thể so sánh kết quả.`, error: "Đổi tiêu chí giữa chừng", why: `Phân loại cần giữ tiêu chí ${classification.criterion} nhất quán.` },
    ],
    "measure-analyze": [
      { option: `Chỉ ghi “${item.outcome}” nhưng không ghi điều kiện, lần đo hoặc cách thực hiện.`, error: "Thiếu điều kiện dữ liệu", why: `Thiếu điều kiện làm kết quả không thể đối chiếu với ${item.reason}.` },
      { option: `Ước đoán kết quả trước rồi không cần quan sát hay đo lại.`, error: "Dùng phỏng đoán thay dữ liệu", why: `Phỏng đoán không phải bằng chứng cho tình huống “${item.context}”.` },
      { option: `Thay đổi nhiều điều kiện cùng lúc rồi quy toàn bộ khác biệt cho ${item.name.toLowerCase()}.`, error: "Lẫn biến", why: `Khi nhiều điều kiện đổi, không xác định được nguyên nhân của “${item.outcome}”.` },
    ],
    "predict-reason": [
      { option: `Dự đoán “${item.outcome}” chỉ vì mong muốn như vậy, không dùng căn cứ.`, error: "Dự đoán thiếu căn cứ", why: `Dự đoán khoa học phải nối với cơ chế “${item.reason}”.` },
      { option: `Cho rằng kết quả sẽ ngược với “${item.outcome}” dù vẫn giữ nguyên điều kiện.`, error: "Đảo chiều dự đoán", why: `Kết luận này mâu thuẫn với căn cứ ${item.reason}.` },
      { option: `Khẳng định “${item.outcome}” luôn đúng cho mọi đối tượng và mọi điều kiện.`, error: "Khái quát ngoài điều kiện", why: `Dự đoán chỉ có giá trị trong bối cảnh “${item.context}” và quy trình đã nêu.` },
    ],
    "experiment-safety": [
      { option: `Tự bắt đầu ngay, không xin phép và không kiểm tra điều kiện an toàn.`, error: "Thiếu cho phép/giám sát", why: `Học sinh không được tự ý thực hiện; cần người lớn kiểm tra trước.` },
      { option: `Bỏ qua bước “${item.procedure}” để hoàn thành nhanh hơn.`, error: "Bỏ bước cốt lõi", why: `Bỏ bước này làm mất căn cứ ${item.reason} hoặc tăng rủi ro.` },
      { option: `Tiếp tục thao tác dù kết quả bất thường hoặc dụng cụ có dấu hiệu không an toàn.`, error: "Không dừng khi có cảnh báo", why: `Khi bất thường phải dừng, giữ khoảng cách và báo người phụ trách.` },
    ],
    "explain-apply": [
      { option: `Khẳng định “${item.outcome}” chỉ vì trùng hợp, không cần bằng chứng hay cơ chế.`, error: "Kết luận không có bằng chứng", why: `Giải thích khoa học phải nối kết quả với ${item.reason}.` },
      { option: `Đảo quan hệ: cho rằng “${item.outcome}” là nguyên nhân tạo ra “${item.reason}”.`, error: "Đảo nguyên nhân-kết quả", why: `Trong bài này, ${item.reason} là căn cứ giải thích kết quả, không phải chiều ngược lại.` },
      { option: `Áp dụng quy tắc của ${item.name.toLowerCase()} cho mọi tình huống mà không kiểm tra điều kiện.`, error: "Vận dụng sai phạm vi", why: `Cần đối chiếu bối cảnh “${item.context}” trước khi chuyển quy tắc sang trường hợp mới.` },
    ],
  }[competencyId];
  return records.map((record, index) => ({
    ...record,
    option: level === "challenge"
      ? `(1) Đọc bối cảnh; (2) ${record.option} (3) bỏ qua giới hạn của kết luận; (4) không đề xuất kiểm chứng.`
      : record.option,
    fix: `Đối chiếu căn cứ “${item.reason}” rồi chọn: ${answer}`,
    tag: diagnosticTags[competencyId][index],
  }));
}

function foundationStages(spec) {
  const stageTitles = [
    ["Kết nối và quan sát", "Kích hoạt kinh nghiệm, nhận ra dấu hiệu quan trọng."],
    ["Khái niệm và mô hình", "Gọi tên, phân loại và biểu diễn hiện tượng."],
    ["Quy trình và dữ liệu", "Thực hiện từng bước, ghi nhận bằng chứng."],
    ["Lỗi thường gặp", "Nhận diện cách nghĩ hoặc thao tác dễ sai."],
    ["Vận dụng và tự kiểm tra", "Giải thích tình huống mới và kiểm tra kết luận."],
  ];
  return stageTitles.map(([title_vi, purpose_vi], stageIndex) => ({
    id: `stage-${stageIndex + 1}`,
    title_vi,
    purpose_vi,
    cards: spec.concepts.slice(stageIndex * 2, stageIndex * 2 + 2).map((item, cardIndex) => ({
      id: `card-${stageIndex * 2 + cardIndex + 1}`,
      title_vi: item.name,
      teaching_vi: item.fact,
      why_vi: item.reason,
      worked_example_vi: `${item.procedure} Kết quả mong đợi: ${item.outcome}.`,
      self_check_vi: `Em có thể giải thích vì sao “${item.context}” cần dùng kiến thức ${item.name.toLowerCase()} không?`,
    })),
  }));
}

function gameRounds(spec, competency, competencyIndex, template) {
  return spec.concepts.map((item, index) => {
    const level = levelSequence[index];
    // Chỉ dùng vật liệu đã được duyệt trong thẻ. Không đưa quy tắc phân loại
    // bên ngoài thẻ vào câu AI, kể cả khi có bản đồ biên soạn cũ.
    const [criterion, group, rule] = [`dấu hiệu của ${item.name}`, item.name, item.fact];
    const classification = { criterion, group, rule };
    const answer = correctAnswer(competency.id, item, level, classification);
    const distractorRecords = misconceptionOptions(competency.id, item, answer, classification, level);
    const options = uniqueOptions(answer, distractorRecords.map((entry) => entry.option), index + competencyIndex);
    const wrong_feedback = {};
    for (const record of distractorRecords) {
      const { option } = record;
      wrong_feedback[option] = {
        option_status: "intentionally-incorrect-distractor",
        error_type_vi: record.error,
        why_wrong_vi: record.why,
        fix_vi: record.fix,
        review_card_id: `card-${index + 1}`,
        diagnostic_tag: record.tag,
      };
    }
    return {
      id: `${lessonId(spec.lesson_number)}-${competency.id}-q${String(index + 1).padStart(2, "0")}`,
      order: index + 1,
      level,
      difficulty_evidence: cognitiveOperations[level],
      representation: buildRepresentation(template, competency.id, item, index, level, classification),
      context_vi: item.context,
      prompt_vi: buildPrompt(template, competency.id, item, level, classification),
      task_vi: `${taskLeads[level]} ${competency.capability_vi}`,
      options,
      answer,
      explanation_vi: `${item.fact} Căn cứ khoa học: ${item.reason}. Kết quả mong đợi: ${item.outcome}.`,
      hint_vi: `Tập trung vào “${item.name}” và đối chiếu thẻ card-${index + 1}.`,
      concept_card_id: `card-${index + 1}`,
      grounding: {
        policy: "reviewed-foundation-only-no-external-claim",
        foundation_card_id: `card-${index + 1}`,
        source_file: "tài liệu/SGK KHTN 6 KNTT.pdf",
        printed_pages: spec.printed_pages,
        supported_material: {
          concept_vi: item.name,
          context_vi: item.context,
          fact_vi: item.fact,
          reason_vi: item.reason,
          procedure_vi: item.procedure,
          outcome_vi: item.outcome,
        },
        unsupported_external_claims: [],
        derivation_status: "ai-generated-from-reviewed-material",
      },
      wrong_feedback,
      source_status: "ai-generated",
    };
  });
}

function buildLesson(spec) {
  const id = lessonId(spec.lesson_number);
  const lessonTemplates = templatesForLesson(spec.lesson_number);
  const competencies = competencyDefinitions.map((competency, competencyIndex) => {
    const template = lessonTemplates[competencyIndex];
    return {
      ...competency,
      presentation_template: template,
      game_id: `${id}-${competency.id}`,
      scored: true,
      max_points_per_question: 100,
      rounds: gameRounds(spec, competency, competencyIndex, template),
    };
  });
  return {
    schema_version: 1,
    pack_id: "science6-pilot",
    course_id: "science-6-pilot",
    lesson_id: id,
    branch_id: id,
    subject: "science",
    grade: 6,
    chapter_number: spec.chapter_number,
    lesson_number: spec.lesson_number,
    title_vi: spec.title_vi,
    usage_scope: "personal-family",
    source_status: "user-provided-reference",
    source_note_vi: `Đối chiếu SGK Khoa học tự nhiên 6 Kết nối tri thức, trang in ${spec.printed_pages}; bài giảng và câu luyện trong gói là nội dung diễn đạt mới, không nhúng ảnh sách.`,
    provenance: {
      source_file: "tài liệu/SGK KHTN 6 KNTT.pdf",
      printed_pages: spec.printed_pages,
      source_review_method: "visual-page-review",
      derivative_items_status: "ai-generated",
    },
    objectives: spec.objectives,
    foundations: foundationStages(spec),
    simulation: {
      ...spec.simulation,
      implementation_status: "specification-only",
      scored: false,
      assets_policy: "original-svg-css-or-canvas-only",
    },
    practical_application: spec.practical_application,
    scoring_policy: {
      scored_sections: ["competencies"],
      excluded_sections: ["foundations", "simulation", "practical_application"],
      best_score_per_question: true,
      practical_application_points: 0,
    },
    competencies,
  };
}

await mkdir(LESSON_DIR, { recursive: true });
const lessons = [...lessonSpecs]
  .sort((left, right) => left.lesson_number - right.lesson_number)
  .map(buildLesson);
for (const lesson of lessons) {
  await writeFile(path.join(LESSON_DIR, `${lesson.lesson_id}.json`), `${JSON.stringify(lesson, null, 2)}\n`, "utf8");
}

const manifest = {
  schema_version: 1,
  pack_id: "science6-pilot",
  course_id: "science-6-pilot",
  title_vi: lessons.length === 55 ? "Khoa học tự nhiên 6 - Gói nội dung đã tích hợp" : "Khoa học tự nhiên 6 - Gói dữ liệu đang phát triển",
  status: lessons.length === 55 ? "integrated" : "standalone-development",
  content_version: lessons.length === 55 ? "1.1.0" : "0.3.0",
  target_lesson_count: 55,
  completed_lesson_count: lessons.length,
  usage_scope: "personal-family",
  source_status: "user-provided-reference",
  source_file: "tài liệu/SGK KHTN 6 KNTT.pdf",
  integration: {
    catalog_registered: lessons.length === 55,
    renderer_registered: lessons.length === 55,
    activity_plan_registered: lessons.length === 55,
  },
  level_sequence: levelSequence,
  competency_ids: competencyDefinitions.map((item) => item.id),
  presentation_templates: presentationTemplates,
  presentation_policy: {
    templates_per_lesson: 6,
    registry_size: 18,
    rotation: "six-consecutive-templates-rotated-every-lesson",
    grounding: "reviewed-foundation-only-no-external-claim",
  },
  scoring: {
    games_scored: true,
    practical_application_scored: false,
    simulation_scored: false,
  },
  lessons: lessons.map((lesson) => ({
    lesson_id: lesson.lesson_id,
    lesson_number: lesson.lesson_number,
    chapter_number: lesson.chapter_number,
    title_vi: lesson.title_vi,
    file: `lessons/${lesson.lesson_id}.json`,
    competency_count: lesson.competencies.length,
    question_count: lesson.competencies.reduce((sum, item) => sum + item.rounds.length, 0),
  })),
};
await writeFile(path.join(PACK_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Đã tạo ${lessons.length} bài, ${lessons.reduce((sum, lesson) => sum + lesson.competencies.reduce((inner, game) => inner + game.rounds.length, 0), 0)} câu.`);
