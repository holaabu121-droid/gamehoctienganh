// Source: Toan6_Bai2_DacTa_Chung_50Cau_DuThao_v01.md (approved 23/11/2026).
// All questions preserve the supplied prompts, hints and explanations.
export const QUESTIONS = [
  {
    "id": "TP-L01",
    "title": "Chữ số hay số?",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Trong các thẻ 0, 3, 7, 10, 12, hãy chọn tất cả thẻ là một chữ số của hệ thập phân.",
    "hint": "Chữ số là kí hiệu dùng để viết số, trong hệ thập phân chỉ có mười chữ số từ 0 đến 9.",
    "explanation": "10 và 12 là các số được ghép từ nhiều chữ số, không phải mỗi thẻ là một chữ số.",
    "pitfall": "Chọn 10 vì thấy có chữ số 1 và 0.",
    "variant": "Đổi thẻ thành 5, 8, 11, 20, 9; đáp án 5, 8, 9.",
    "mode": "multi",
    "options": [
      "0",
      "3",
      "7",
      "10",
      "12"
    ],
    "answer": [
      "0",
      "3",
      "7"
    ]
  },
  {
    "id": "TP-L02",
    "title": "Xác định hàng",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Số 4 072 có chữ số 7 ở hàng nào?",
    "hint": "Đếm từ phải qua trái: đơn vị, chục, trăm, nghìn.",
    "explanation": "4 072 = 4 000 + 70 + 2.",
    "pitfall": "Nhầm hàng chục với hàng trăm.",
    "variant": "Đổi thành 6 083, hỏi chữ số 8.",
    "mode": "single",
    "options": [
      "Hàng nghìn",
      "Hàng trăm",
      "Hàng chục",
      "Hàng đơn vị"
    ],
    "answer": "Hàng chục"
  },
  {
    "id": "TP-L03",
    "title": "Giá trị chữ số 2",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Trong số 62 415, chữ số 2 có giá trị bằng bao nhiêu?",
    "hint": "Chữ số 2 đứng ở hàng nghìn.",
    "explanation": "2 nghìn = 2 × 1 000 = 2 000.",
    "pitfall": "Trả lời 2 thay vì 2 000.",
    "variant": "Đổi thành 73 518, hỏi chữ số 3.",
    "mode": "single",
    "options": [
      "2",
      "20",
      "200",
      "2 000"
    ],
    "answer": "2 000"
  },
  {
    "id": "TP-L04",
    "title": "Tìm hàng của chữ số 3",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Trong số 80 306, chữ số 3 nằm ở hàng nào?",
    "hint": "Tách 80 | 306 rồi xét ba chữ số cuối.",
    "explanation": "Trong 306: 3 trăm, 0 chục, 6 đơn vị.",
    "pitfall": "Nhầm 3 thành hàng nghìn.",
    "variant": "Đổi số 91 402, hỏi chữ số 4.",
    "mode": "single",
    "options": [
      "Hàng nghìn",
      "Hàng trăm",
      "Hàng chục",
      "Hàng đơn vị"
    ],
    "answer": "Hàng trăm"
  },
  {
    "id": "TP-L05",
    "title": "Giá trị của 9",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Trong số 49 082, chữ số 9 biểu diễn giá trị nào?",
    "hint": "9 nằm ngay sau chữ số hàng chục nghìn.",
    "explanation": "49 082 có 4 chục nghìn và 9 nghìn.",
    "pitfall": "Chọn 90 hoặc 900.",
    "variant": "Đổi 39 761, hỏi chữ số 9.",
    "mode": "single",
    "options": [
      "9",
      "90",
      "900",
      "9 000"
    ],
    "answer": "9 000"
  },
  {
    "id": "TP-L06",
    "title": "Lắp số có chữ số 0",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Hàng trăm có 3, hàng chục có 0, hàng đơn vị có 8. Hãy ghép thành số tự nhiên.",
    "hint": "Đặt 3–0–8 theo đúng thứ tự từ hàng trăm đến hàng đơn vị.",
    "explanation": "0 vẫn phải giữ ở giữa để biểu diễn hàng chục không có chục nào.",
    "pitfall": "Bỏ số 0, trả lời 38.",
    "variant": "Đổi thành trăm 6, chục 0, đơn vị 4 → 604.",
    "mode": "order",
    "tiles": [
      "0",
      "8",
      "3"
    ],
    "answer": [
      "3",
      "0",
      "8"
    ]
  },
  {
    "id": "TP-L07",
    "title": "Chọn biểu thức giá trị đúng",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Chọn biểu thức phân tích đúng cho số 5 206.",
    "hint": "Các chữ số lần lượt ở hàng nghìn, trăm, chục, đơn vị.",
    "explanation": "5 206 = 5 000 + 200 + 6.",
    "pitfall": "Viết 2 × 10 hoặc 6 × 10.",
    "variant": "Đổi số thành 7 304.",
    "mode": "single",
    "options": [
      "5 × 1 000 + 2 × 100 + 0 × 10 + 6",
      "5 × 1 000 + 2 × 10 + 6",
      "5 × 100 + 2 × 1 000 + 6",
      "5 × 1 000 + 2 × 100 + 6 × 10"
    ],
    "answer": "5 × 1 000 + 2 × 100 + 0 × 10 + 6"
  },
  {
    "id": "TP-L08",
    "title": "Ghép tổng giá trị",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Dùng các thẻ 40 000, 500, 70, 7 để chọn những thẻ tạo thành số 40 507.",
    "hint": "Chọn giá trị của những hàng có chữ số khác 0.",
    "explanation": "40 507 = 4 chục nghìn + 5 trăm + 7 đơn vị.",
    "pitfall": "Thêm 70 do đọc nhầm chữ số 0 ở hàng chục.",
    "variant": "Đổi thành 60 204, chọn 60 000 + 200 + 4.",
    "mode": "multi",
    "options": [
      "40 000",
      "500",
      "70",
      "7"
    ],
    "answer": [
      "40 000",
      "500",
      "7"
    ]
  },
  {
    "id": "TP-L09",
    "title": "Điền số hạng bị thiếu",
    "knowledge": 1,
    "level": "practice",
    "prompt": "12 304 = 10 000 + 2 000 + □ + 4. Điền số thích hợp vào ô trống.",
    "hint": "Chữ số 3 của số đã cho nằm ở hàng trăm.",
    "explanation": "12 304 có 3 trăm, tức 300.",
    "pitfall": "Nhập 30.",
    "variant": "Đổi số 54 607, thiếu 600.",
    "mode": "number",
    "answer": "300"
  },
  {
    "id": "TP-L10",
    "title": "Nhận biết lớp nghìn",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Trong số 7 205 018, ba chữ số của lớp nghìn là nhóm nào?",
    "hint": "Tách số thành từng nhóm ba chữ số từ phải sang trái.",
    "explanation": "7 | 205 | 018: các lớp triệu | nghìn | đơn vị.",
    "pitfall": "Chọn 018 vì nó là nhóm ba chữ số cuối.",
    "variant": "Đổi số 13 482 006, lớp nghìn 482.",
    "mode": "single",
    "options": [
      "7",
      "205",
      "018",
      "7 205"
    ],
    "answer": "205"
  },
  {
    "id": "TP-L11",
    "title": "Loại số 0 đầu không cần thiết",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Màn hình mã đang ghi 000542. Hãy viết lại dưới dạng thông thường của số tự nhiên.",
    "hint": "Với số khác 0, chữ số đầu tiên từ trái phải khác 0.",
    "explanation": "Các số 0 ở trước chữ số 5 không làm thay đổi giá trị nhưng không dùng khi ghi số tự nhiên thông thường.",
    "pitfall": "Giữ 000542.",
    "variant": "Đổi thành 003 109 → 3 109.",
    "mode": "number",
    "answer": "542",
    "noLeadingZero": true
  },
  {
    "id": "TP-L12",
    "title": "Tách lớp theo nhóm ba",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Hãy tách số 5723841 thành các lớp, dùng dấu cách giữa các nhóm.",
    "hint": "Bắt đầu ghép ba chữ số từ bên phải: 841 rồi 723.",
    "explanation": "Còn lại 5 ở lớp triệu; không chia nhóm từ bên trái trước.",
    "pitfall": "Viết 572 384 1.",
    "variant": "Đổi 18073025 → 18 073 025.",
    "mode": "number",
    "answer": "5723841",
    "grouping": true
  },
  {
    "id": "TP-L13",
    "title": "Đổi hàng thành giá trị",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Một chữ số 6 đứng ở hàng nghìn. Giá trị của chữ số đó là bao nhiêu?",
    "hint": "Mỗi đơn vị ở hàng nghìn tương ứng một nghìn.",
    "explanation": "6 × 1 000 = 6 000.",
    "pitfall": "Chọn 600.",
    "variant": "Hỏi chữ số 8 ở hàng chục nghìn → 80 000.",
    "mode": "single",
    "options": [
      "6",
      "60",
      "600",
      "6 000"
    ],
    "answer": "6 000"
  },
  {
    "id": "TP-L14",
    "title": "Viết số theo bảng hàng",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Bảng hàng: nghìn = 7, trăm = 1, chục = 0, đơn vị = 2. Hãy viết số.",
    "hint": "Đọc các chữ số từ trái sang phải, kể cả 0 ở hàng chục.",
    "explanation": "7 102 = 7 000 + 100 + 2.",
    "pitfall": "Viết 712.",
    "variant": "Đổi nghìn 4, trăm 0, chục 9, đơn vị 5 → 4 095.",
    "mode": "number",
    "answer": "7102"
  },
  {
    "id": "TP-L15",
    "title": "Quan hệ mười đơn vị",
    "knowledge": 1,
    "level": "practice",
    "prompt": "Chọn tất cả phép đổi đúng trong hệ thập phân.",
    "hint": "Cứ 10 đơn vị của một hàng thì đổi được 1 đơn vị ở hàng ngay trước.",
    "explanation": "10 × 1 = 10; 10 × 10 = 100; 10 × 100 = 1 000.",
    "pitfall": "Đổi 10 trăm thành 1 chục.",
    "variant": "Thay bằng 10 nghìn = 1 chục nghìn và các phát biểu nhiễu.",
    "mode": "multi",
    "options": [
      "10 đơn vị = 1 chục",
      "10 chục = 1 trăm",
      "10 trăm = 1 nghìn",
      "10 trăm = 1 chục"
    ],
    "answer": [
      "10 đơn vị = 1 chục",
      "10 chục = 1 trăm",
      "10 trăm = 1 nghìn"
    ]
  },
  {
    "id": "TP-V01",
    "title": "Các số lớn hơn 700 từ ba thẻ",
    "knowledge": 1,
    "level": "application",
    "prompt": "Có ba thẻ chữ số 0, 2, 7. Dùng mỗi thẻ đúng một lần để lập số có ba chữ số lớn hơn 700. Chọn tất cả số đúng.",
    "hint": "Số lớn hơn 700 phải có 7 ở hàng trăm.",
    "explanation": "Hai cách đặt 0 và 2 vào hàng chục, đơn vị là 702 và 720.",
    "pitfall": "Chọn 072 vì xem 0 đứng đầu như hàng trăm.",
    "variant": "Đổi ba thẻ 0, 4, 8 và điều kiện > 800.",
    "mode": "multi",
    "options": [
      "207",
      "270",
      "702",
      "720",
      "072"
    ],
    "answer": [
      "702",
      "720"
    ]
  },
  {
    "id": "TP-V02",
    "title": "Đếm thẻ giá trị",
    "knowledge": 1,
    "level": "application",
    "prompt": "Quầy đồ dùng có 4 thẻ 10 000, 3 thẻ 1 000, 5 thẻ 100 và 7 thẻ 1. Tất cả biểu diễn số nào?",
    "hint": "Cộng theo hàng: chục nghìn 4, nghìn 3, trăm 5, chục 0, đơn vị 7.",
    "explanation": "40 000 + 3 000 + 500 + 7 = 43 507.",
    "pitfall": "Ghi 43 570 vì bỏ trống hàng chục.",
    "variant": "Thay số thẻ thành 2×10000, 6×1000, 1×100, 9×1 → 26 109.",
    "mode": "number",
    "answer": "43507"
  },
  {
    "id": "TP-V03",
    "title": "Mã kho theo vị trí chữ số",
    "knowledge": 1,
    "level": "application",
    "prompt": "Mã hàng gồm 3 ở hàng chục nghìn, 5 ở hàng nghìn, 0 ở hàng trăm, 2 ở hàng chục và 9 ở hàng đơn vị. Mã hàng là số nào?",
    "hint": "Xếp theo thứ tự các hàng từ lớn đến bé.",
    "explanation": "3|5|0|2|9 tạo thành 35 029.",
    "pitfall": "Đổi vị trí hàng trăm và hàng chục.",
    "variant": "Biến thể: 6, 0, 4, 0, 1 → 60 401.",
    "mode": "order",
    "tiles": [
      "9",
      "0",
      "5",
      "3",
      "2"
    ],
    "answer": [
      "3",
      "5",
      "0",
      "2",
      "9"
    ]
  },
  {
    "id": "TP-V04",
    "title": "Giải mã các lớp của số lớn",
    "knowledge": 1,
    "level": "application",
    "prompt": "Mã thiết bị là 4 305 020 007. Hãy ghép đúng từng lớp với nhóm chữ số: tỉ, triệu, nghìn, đơn vị.",
    "hint": "Đọc số theo nhóm ba chữ số kể từ phải, rồi gắn tên lớp từ phải sang trái.",
    "explanation": "4 | 305 | 020 | 007 lần lượt thuộc lớp tỉ | triệu | nghìn | đơn vị.",
    "pitfall": "Đổi lớp nghìn và lớp đơn vị khi gặp nhiều chữ số 0.",
    "variant": "Đổi thành 12 008 604 090; tỉ = 12, triệu = 008, nghìn = 604, đơn vị = 090.",
    "mode": "match",
    "rows": [
      "Lớp tỉ",
      "Lớp triệu",
      "Lớp nghìn",
      "Lớp đơn vị"
    ],
    "options": [
      "4",
      "305",
      "020",
      "007"
    ],
    "answer": [
      "4",
      "305",
      "020",
      "007"
    ]
  },
  {
    "id": "TP-V05",
    "title": "Tính từ kiện, túi, viên",
    "knowledge": 1,
    "level": "application",
    "prompt": "Kho có 24 hộp, mỗi hộp 100 viên; 7 túi, mỗi túi 10 viên; và 5 viên rời. Tổng số viên là bao nhiêu?",
    "hint": "24 trăm = 2 nghìn 4 trăm; 7 chục = 70.",
    "explanation": "2 400 + 70 + 5 = 2 475.",
    "pitfall": "Ghép thành 24705 thay vì cộng theo giá trị.",
    "variant": "Đổi 31 hộp trăm, 2 túi chục, 8 viên → 3 128.",
    "mode": "number",
    "answer": "2475"
  },
  {
    "id": "TP-V06",
    "title": "Sửa lỗi phân tích số",
    "knowledge": 1,
    "level": "application",
    "prompt": "Một bạn viết: 70 504 = 7 000 + 500 + 4. Hãy chọn cách sửa đúng.",
    "hint": "Chữ số 7 nằm ở hàng chục nghìn.",
    "explanation": "7 × 10 000 = 70 000, không phải 7 000.",
    "pitfall": "Sửa thành 7 000 + 50 000 + 4.",
    "variant": "Đổi số 60 208 và lời giải sai 6 000 + 200 + 8.",
    "mode": "single",
    "options": [
      "70 504 = 70 000 + 500 + 4",
      "70 504 = 7 000 + 500 + 4",
      "70 504 = 70 000 + 50 + 4",
      "70 504 = 70 000 + 5 000 + 4"
    ],
    "answer": "70 504 = 70 000 + 500 + 4"
  },
  {
    "id": "TP-V07",
    "title": "Chọn số khớp với cách đọc",
    "knowledge": 1,
    "level": "application",
    "prompt": "Bảng thông báo ghi bằng chữ: “hai mươi ba nghìn bốn trăm linh sáu”. Hãy chọn cách ghi bằng chữ số.",
    "hint": "“Linh sáu” có hàng chục bằng 0 và hàng đơn vị bằng 6.",
    "explanation": "23 nghìn + 406 = 23 406.",
    "pitfall": "Chọn 23 460.",
    "variant": "Đổi “bốn mươi nghìn không trăm linh năm” → 40 005.",
    "mode": "single",
    "options": [
      "23 046",
      "23 406",
      "23 460",
      "23 416"
    ],
    "answer": "23 406"
  },
  {
    "id": "TP-V08",
    "title": "Kiểm chứng thông tin trên bảng số",
    "knowledge": 1,
    "level": "application",
    "prompt": "Cho số 206 019. Chọn tất cả các phát biểu đúng.",
    "hint": "Tách 206 019 = 200 000 + 6 000 + 10 + 9.",
    "explanation": "B sai vì 6 ở hàng nghìn; D sai vì 9 ở hàng đơn vị.",
    "pitfall": "Nhầm hàng nghìn với hàng trăm.",
    "variant": "Đổi số 305 072 với một bộ bốn nhận định mới.",
    "mode": "multi",
    "options": [
      "Chữ số 2 có giá trị 200 000",
      "Chữ số 6 có giá trị 600",
      "Chữ số 1 có giá trị 10",
      "Chữ số 9 có giá trị 90"
    ],
    "answer": [
      "Chữ số 2 có giá trị 200 000",
      "Chữ số 1 có giá trị 10"
    ]
  },
  {
    "id": "TP-V09",
    "title": "Đổi một chữ số trong mã",
    "knowledge": 1,
    "level": "application",
    "prompt": "Mã kho là 48 020. Thay duy nhất chữ số 8 ở hàng nghìn bằng chữ số 3. Mã mới là gì?",
    "hint": "Giữ nguyên mọi hàng trừ hàng nghìn.",
    "explanation": "48 020 → 43 020.",
    "pitfall": "Đổi luôn chữ số hàng trăm.",
    "variant": "Đổi thành 76 105, thay hàng nghìn 6 bằng 2 → 72 105.",
    "mode": "number",
    "answer": "43020"
  },
  {
    "id": "TP-V10",
    "title": "Lập số bốn chữ số nhỏ nhất",
    "knowledge": 1,
    "level": "application",
    "prompt": "Dùng bốn chữ số 0, 4, 6, 9, mỗi chữ số đúng một lần. Lập số tự nhiên có bốn chữ số nhỏ nhất.",
    "hint": "Chữ số đầu không được là 0; muốn nhỏ nhất, dùng chữ số khác 0 nhỏ nhất ở hàng nghìn.",
    "explanation": "Chọn 4 ở hàng nghìn, rồi 0, 6, 9 theo thứ tự tăng dần.",
    "pitfall": "Đưa 0 lên đầu hoặc chọn 4 690.",
    "variant": "Đổi bốn chữ số thành 0, 2, 5, 7 → 2 057.",
    "mode": "order",
    "tiles": [
      "6",
      "0",
      "9",
      "4"
    ],
    "answer": [
      "4",
      "0",
      "6",
      "9"
    ]
  },
  {
    "id": "LM-L01",
    "title": "Ba kí tự cơ bản",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Ghép mỗi kí tự La Mã với giá trị trong hệ thập phân: I, V, X.",
    "hint": "Nhìn bảng ba kí tự chính trong thẻ học.",
    "explanation": "Đây là những kí tự cơ bản dùng trong các số La Mã từ 1 đến 30.",
    "pitfall": "Nhớ X = 5.",
    "variant": "Xếp kí tự theo giá trị tăng dần.",
    "mode": "match",
    "rows": [
      "I",
      "V",
      "X"
    ],
    "options": [
      "1",
      "5",
      "10"
    ],
    "answer": [
      "1",
      "5",
      "10"
    ]
  },
  {
    "id": "LM-L02",
    "title": "Hai cụm cố định",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Ghép IV và IX với các giá trị tương ứng.",
    "hint": "Hai cụm IV, IX được học như những thành phần cố định.",
    "explanation": "IV ghi 4; IX ghi 9.",
    "pitfall": "Cộng máy móc I+V=6, I+X=11.",
    "variant": "Đổi yêu cầu sang chọn thẻ có giá trị 9.",
    "mode": "match",
    "rows": [
      "IV",
      "IX"
    ],
    "options": [
      "4",
      "9"
    ],
    "answer": [
      "4",
      "9"
    ]
  },
  {
    "id": "LM-L03",
    "title": "Đọc VII",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Số La Mã VII biểu diễn số tự nhiên nào?",
    "hint": "V có giá trị 5, mỗi I thêm 1.",
    "explanation": "VII = 5 + 1 + 1 = 7.",
    "pitfall": "Đọc nhầm thành 6.",
    "variant": "Đổi thành VIII → 8.",
    "mode": "single",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "7"
  },
  {
    "id": "LM-L04",
    "title": "Đọc XIV",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Số La Mã XIV biểu diễn số tự nhiên nào?",
    "hint": "X là 10 và IV là 4.",
    "explanation": "XIV = 10 + 4 = 14.",
    "pitfall": "Đọc thành 16.",
    "variant": "Đổi thành XXIV → 24.",
    "mode": "single",
    "options": [
      "12",
      "14",
      "16",
      "19"
    ],
    "answer": "14"
  },
  {
    "id": "LM-L05",
    "title": "Đọc XIX",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Chọn giá trị thập phân của XIX.",
    "hint": "Tách thành X và IX.",
    "explanation": "XIX = 10 + 9 = 19.",
    "pitfall": "Tách I sai thành XI + X.",
    "variant": "Đổi thành XXIX → 29.",
    "mode": "single",
    "options": [
      "9",
      "11",
      "19",
      "21"
    ],
    "answer": "19"
  },
  {
    "id": "LM-L06",
    "title": "Đọc XXVI",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Trong bảng 1–30, XXVI ứng với số nào?",
    "hint": "XX = 20; VI = 6.",
    "explanation": "10 + 10 + 5 + 1 = 26.",
    "pitfall": "Đọc thành 24.",
    "variant": "Đổi thành XXVII → 27.",
    "mode": "number",
    "answer": "26"
  },
  {
    "id": "LM-L07",
    "title": "Viết số 3",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Hãy viết số 3 bằng chữ số La Mã.",
    "hint": "Dùng ba kí tự I.",
    "explanation": "III = 1 + 1 + 1.",
    "pitfall": "Nhập IIII.",
    "variant": "Đổi thành số 2 → II.",
    "mode": "roman",
    "answer": "III"
  },
  {
    "id": "LM-L08",
    "title": "Viết số 8",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Chọn cách ghi La Mã của số 8 trong các thẻ: VIII, IV, VI, IX.",
    "hint": "Số 8 = 5 + 3.",
    "explanation": "V + III = VIII.",
    "pitfall": "Chọn IV vì tưởng IV = 6.",
    "variant": "Đổi thành số 7 → VII.",
    "mode": "single",
    "options": [
      "VIII",
      "IV",
      "VI",
      "IX"
    ],
    "answer": "VIII"
  },
  {
    "id": "LM-L09",
    "title": "Viết số 12",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Viết số 12 bằng số La Mã.",
    "hint": "12 gồm 10 và 2.",
    "explanation": "X + II → XII.",
    "pitfall": "Viết IIX.",
    "variant": "Đổi thành số 13 → XIII.",
    "mode": "roman",
    "answer": "XII"
  },
  {
    "id": "LM-L10",
    "title": "Viết số 24",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Sắp xếp các nhóm XX và IV thành cách ghi La Mã đúng của số 24.",
    "hint": "20 được ghi XX, 4 được ghi IV.",
    "explanation": "XX + IV = XXIV.",
    "pitfall": "Đổi thành IVXX.",
    "variant": "Đổi số thành 29: XX + IX → XXIX.",
    "mode": "order",
    "tiles": [
      "IV",
      "XX"
    ],
    "answer": [
      "XX",
      "IV"
    ]
  },
  {
    "id": "LM-L11",
    "title": "Viết số 29",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Chọn số La Mã đúng cho số 29: XXIX, XIX, XXVI, XXIV.",
    "hint": "29 gồm 20 và 9.",
    "explanation": "XX + IX = XXIX.",
    "pitfall": "Chọn XIX (19).",
    "variant": "Đổi thành 28 → XXVIII.",
    "mode": "single",
    "options": [
      "XXIX",
      "XIX",
      "XXVI",
      "XXIV"
    ],
    "answer": "XXIX"
  },
  {
    "id": "LM-L12",
    "title": "Quy tắc ghi số 4",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Theo bảng số La Mã 1–30 trong SGK, số 4 được ghi như thế nào?",
    "hint": "Bảng SGK dùng cụm IV cho 4.",
    "explanation": "Trong cách ghi được học, IV là thành phần ghi 4.",
    "pitfall": "Chọn IIII theo thói quen cộng bốn chữ I.",
    "variant": "Đổi yêu cầu sang số 9 → IX.",
    "mode": "single",
    "options": [
      "IV",
      "IIII",
      "VI",
      "XI"
    ],
    "answer": "IV"
  },
  {
    "id": "LM-L13",
    "title": "Có số La Mã cho 0 không?",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Trong phạm vi cách ghi số La Mã học ở bài này, nhận định “có kí hiệu La Mã biểu diễn số 0” đúng hay sai?",
    "hint": "Bảng La Mã của bài học bắt đầu từ 1.",
    "explanation": "SGK nêu không có số La Mã biểu diễn số 0.",
    "pitfall": "Nhầm chữ O với 0.",
    "variant": "Chọn các số có thể ghi bằng hệ La Mã 1–30 trong tập {0; 1; 20; 31}.",
    "mode": "single",
    "options": [
      "Đúng",
      "Sai"
    ],
    "answer": "Sai"
  },
  {
    "id": "LM-L14",
    "title": "Xếp thứ tự ba số La Mã",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Sắp xếp IX, XI, X theo thứ tự từ bé đến lớn.",
    "hint": "Đổi ra 9, 10, 11 trước.",
    "explanation": "9 < 10 < 11 nên IX < X < XI.",
    "pitfall": "Để X trước IX.",
    "variant": "Đổi thành XIV, XII, XIII → XII, XIII, XIV.",
    "mode": "order",
    "tiles": [
      "XI",
      "IX",
      "X"
    ],
    "answer": [
      "IX",
      "X",
      "XI"
    ]
  },
  {
    "id": "LM-L15",
    "title": "So sánh hai số La Mã",
    "knowledge": 2,
    "level": "practice",
    "prompt": "Điền dấu thích hợp vào XV □ XIV.",
    "hint": "XV = 15 còn XIV = 14.",
    "explanation": "15 > 14.",
    "pitfall": "Nhầm IV và VI khiến đáp án đảo chiều.",
    "variant": "Đổi thành XVI □ XIX → <.",
    "mode": "single",
    "options": [
      ">",
      "<",
      "="
    ],
    "answer": ">"
  },
  {
    "id": "LM-V01",
    "title": "Kim giờ trên đồng hồ cổ",
    "knowledge": 2,
    "level": "application",
    "prompt": "Đồng hồ La Mã chỉ đúng vị trí XII. Vị trí đó tương ứng số mấy trên mặt đồng hồ?",
    "hint": "Tách XII thành X + II.",
    "explanation": "XII = 10 + 2 = 12.",
    "pitfall": "Chọn 11 vì nhầm I.",
    "variant": "Đổi vị trí IX → 9.",
    "mode": "single",
    "options": [
      "2",
      "10",
      "12",
      "20"
    ],
    "answer": "12"
  },
  {
    "id": "LM-V02",
    "title": "Tên chương sách",
    "knowledge": 2,
    "level": "application",
    "prompt": "Một cuốn sách đánh số chương bằng La Mã. “Chương XXI” là chương số mấy?",
    "hint": "XX = 20, I = 1.",
    "explanation": "XXI biểu diễn 21.",
    "pitfall": "Chọn 12 do đảo thứ tự.",
    "variant": "Đổi XXIII → 23.",
    "mode": "single",
    "options": [
      "11",
      "19",
      "21",
      "29"
    ],
    "answer": "21"
  },
  {
    "id": "LM-V03",
    "title": "Vé xem biểu diễn",
    "knowledge": 2,
    "level": "application",
    "prompt": "Vé xem biểu diễn ghi “Dãy XVIII”. Hãy nhập số thứ tự dãy bằng hệ thập phân.",
    "hint": "X = 10, V = 5, III = 3.",
    "explanation": "XVIII = 10 + 5 + 3 = 18.",
    "pitfall": "Nhập 13.",
    "variant": "Đổi dãy XVII → 17.",
    "mode": "number",
    "answer": "18"
  },
  {
    "id": "LM-V04",
    "title": "Nhãn tủ bảo tàng",
    "knowledge": 2,
    "level": "application",
    "prompt": "Người quản lí cần dán nhãn tủ số 27 bằng số La Mã. Chọn nhãn đúng.",
    "hint": "27 = 20 + 7, trong đó 7 viết VII.",
    "explanation": "XX + VII = XXVII.",
    "pitfall": "Viết XVII (17).",
    "variant": "Đổi thành tủ 26 → XXVI.",
    "mode": "single",
    "options": [
      "XXVII",
      "XXIV",
      "XVII",
      "XXX"
    ],
    "answer": "XXVII"
  },
  {
    "id": "LM-V05",
    "title": "Vị trí số 9 trên mặt đồng hồ",
    "knowledge": 2,
    "level": "application",
    "prompt": "Một mặt đồng hồ cổ bị trống vị trí chỉ số 9. Kéo thẻ phù hợp vào vị trí đó.",
    "hint": "9 là một trong hai cụm đặc biệt được học.",
    "explanation": "IX = 9.",
    "pitfall": "Điền XI do đọc ngược.",
    "variant": "Đổi ô số 4 → IV.",
    "mode": "single",
    "options": [
      "XI",
      "IX",
      "IV",
      "VI"
    ],
    "answer": "IX"
  },
  {
    "id": "LM-V06",
    "title": "Sửa nhãn sai",
    "knowledge": 2,
    "level": "application",
    "prompt": "Trong danh sách số thứ tự, tủ số 19 bị dán nhãn “XXI”. Chọn nhãn La Mã đúng để thay.",
    "hint": "19 gồm 10 và 9.",
    "explanation": "XIX = 10 + 9, còn XXI = 21.",
    "pitfall": "Chọn XVII = 17.",
    "variant": "Đổi nhãn số 14 bị ghi XVI → XIV.",
    "mode": "single",
    "options": [
      "XIX",
      "XXI",
      "XXIX",
      "XVII"
    ],
    "answer": "XIX"
  },
  {
    "id": "LM-V07",
    "title": "Ghép vé và số hàng",
    "knowledge": 2,
    "level": "application",
    "prompt": "Ghép ba vé ghi XVI, XXIII, XXVIII với các hàng thập phân 16, 23, 28.",
    "hint": "Tách các số thành X/XX và phần còn lại.",
    "explanation": "16 = 10+6; 23 = 20+3; 28 = 20+8.",
    "pitfall": "Ghép XXIII thành 28.",
    "variant": "Đổi bộ thành XII, XXI, XXV.",
    "mode": "match",
    "rows": [
      "XVI",
      "XXIII",
      "XXVIII"
    ],
    "options": [
      "16",
      "23",
      "28"
    ],
    "answer": [
      "16",
      "23",
      "28"
    ]
  },
  {
    "id": "LM-V08",
    "title": "Xếp thẻ để ghi số 23",
    "knowledge": 2,
    "level": "application",
    "prompt": "Có hai thẻ X và ba thẻ I. Hãy xếp tất cả các thẻ để biểu diễn 23 bằng số La Mã.",
    "hint": "Hai X = 20 và ba I = 3.",
    "explanation": "XXIII biểu diễn 23.",
    "pitfall": "Xếp IXIXI, không theo mẫu SGK.",
    "variant": "Đổi bộ X,X,V,I → XXVI (26).",
    "mode": "order",
    "tiles": [
      "I",
      "X",
      "I",
      "X",
      "I"
    ],
    "answer": [
      "X",
      "X",
      "I",
      "I",
      "I"
    ]
  },
  {
    "id": "LM-V09",
    "title": "Ngày tiếp theo trong lịch",
    "knowledge": 2,
    "level": "application",
    "prompt": "Một lịch nhỏ đánh số ngày liên tiếp bằng La Mã. Sau ngày XIX là ngày nào?",
    "hint": "XIX = 19; ngày sau là 20.",
    "explanation": "20 được ghi XX.",
    "pitfall": "Chọn XXI vì nhảy hai ngày.",
    "variant": "Đổi “sau XXVIII” → XXIX.",
    "mode": "single",
    "options": [
      "XX",
      "XIXI",
      "XXI",
      "XVIII"
    ],
    "answer": "XX"
  },
  {
    "id": "LM-V10",
    "title": "Ba mốc trên đường tham quan",
    "knowledge": 2,
    "level": "application",
    "prompt": "Sơ đồ tham quan có các biển mốc IV, XIV, XXIV. Hãy chọn đúng tất cả số thứ tự thập phân của các mốc.",
    "hint": "Giữ lại cụm IV có giá trị 4 ở từng mốc.",
    "explanation": "IV = 4; XIV = 10+4 =14; XXIV =20+4=24.",
    "pitfall": "Chọn thêm 6,16,26 vì nghĩ IV =6.",
    "variant": "Đổi các mốc thành IX, XIX, XXIX → 9, 19, 29.",
    "mode": "multi",
    "options": [
      "4",
      "6",
      "14",
      "16",
      "24",
      "26"
    ],
    "answer": [
      "4",
      "14",
      "24"
    ]
  }
];
