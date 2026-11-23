export type MathRuleVisualKind =
  | "sets" | "place-value" | "number-ray" | "part-whole" | "equal-groups" | "exponent" | "expression-tree"
  | "divisibility" | "digit-rules" | "prime-sieve" | "gcd" | "lcm" | "integer-axis" | "integer-chips"
  | "bracket-gate" | "sign-parity" | "integer-division" | "regular-shapes" | "quadrilateral" | "perimeter-area"
  | "fold" | "rotate" | "fraction-equivalence" | "fraction-compare" | "fraction-add" | "fraction-product"
  | "fraction-tape" | "decimal-place" | "decimal-calc" | "rounding" | "percent" | "point-line" | "rays"
  | "segment" | "midpoint" | "angle" | "protractor" | "data-flow" | "pictograph" | "bar" | "double-bar"
  | "outcome-tree" | "experiment" | "review" | "design" | "geometry-tool" | "calculator" | "budget" | "survey";

export type MathRuleVisualSpec = {
  visualKey: string;
  kind: MathRuleVisualKind;
  model: string;
  focus: string;
  controls: [{ label: string; min: number; max: number; initial: number }, { label: string; min: number; max: number; initial: number }];
  check: string;
  commonError: string;
  reviewKinds?: MathRuleVisualKind[];
};

const v = (visualKey: string, kind: MathRuleVisualKind, model: string, focus: string, first: MathRuleVisualSpec["controls"][0], second: MathRuleVisualSpec["controls"][1], check: string, commonError: string): MathRuleVisualSpec => ({ visualKey, kind, model, focus, controls: [first, second], check, commonError });
const c = (label: string, min: number, max: number, initial: number) => ({ label, min, max, initial });

export const MATH_MAIN_RULE_VISUALS: Record<string, MathRuleVisualSpec> = {
  "math6-s1-lesson1": v("s1-l01-set-membership", "sets", "Vòng tập hợp và thẻ phần tử", "thuộc, không thuộc và hai cách mô tả", c("Số phần tử của A",2,8,5),c("Thẻ đang xét",0,9,4),"Thẻ ở trong vòng A thì viết thẻ ∈ A.","Không lặp lại một phần tử khi liệt kê tập hợp."),
  "math6-s1-lesson2": v("s1-l02-place-value", "place-value", "Bảng lớp và hàng", "mỗi lớp ba hàng; giá trị phụ thuộc vị trí", c("Chữ số cần xét",1,9,7),c("Vị trí từ phải sang",0,7,6),"Giá trị bằng chữ số nhân với giá trị của hàng.","Không đọc từng số 0 rời rạc trong một số có tách lớp."),
  "math6-s1-lesson3": v("s1-l03-natural-order", "number-ray", "Tia số và ba điểm so sánh", "liền trước, liền sau, dấu ≤ và ≥", c("Số n",1,18,8),c("Khoảng cách so sánh",1,6,3),"Số ở bên phải lớn hơn số ở bên trái.","Không dùng mô hình tập hợp để thay cho thứ tự trên tia số."),
  "math6-s1-lesson4": v("s1-l04-add-subtract", "part-whole", "Sơ đồ phần–phần–toàn thể", "cộng, trừ và phép tính ngược", c("Phần thứ nhất",1,12,7),c("Phần thứ hai",1,12,5),"Lấy toàn thể trừ một phần sẽ được phần còn lại.","Không coi phép trừ có tính giao hoán."),
  "math6-s1-lesson5": v("s1-l05-multiply-divide", "equal-groups", "Khay chia đều và phần dư", "a = b × q + r với 0 ≤ r < b", c("Số vật",4,30,17),c("Số nhóm",2,8,5),"Số dư luôn nhỏ hơn số chia.","Không để số dư lớn hơn hoặc bằng số chia."),
  "math6-s1-lesson6": v("s1-l06-exponent", "exponent", "Thẻ thừa số lặp", "cơ số, số mũ và quy tắc cùng cơ số", c("Cơ số",2,8,3),c("Số mũ",1,6,4),"Số mũ cho biết số thừa số bằng nhau.","Không nhân cơ số với số mũ."),
  "math6-s1-lesson7": v("s1-l07-operation-order", "expression-tree", "Cây biểu thức và đèn bước", "ngoặc → lũy thừa → nhân chia → cộng trừ", c("Số trong ngoặc",1,9,4),c("Thừa số ngoài",2,6,3),"Chỉ thực hiện nút đã đủ dữ kiện từ các nhánh con.","Không tính từ trái sang phải khi còn phép ưu tiên cao hơn."),
  "math6-s1-lesson8": v("s1-l08-divisibility", "divisibility", "Khay số dư của tổng và hiệu", "quan hệ chia hết và bảo toàn số dư", c("Số a",6,36,18),c("Số chia m",2,9,6),"a chia hết cho m khi số dư bằng 0.","Không kết luận tổng chia hết nếu các điều kiện chưa đủ."),
  "math6-s1-lesson9": v("s1-l09-divisibility-signs", "digit-rules", "Máy xét chữ số tận cùng và tổng chữ số", "dấu hiệu chia hết cho 2, 3, 5, 9", c("Hàng trăm",1,9,3),c("Chữ số tận cùng",0,9,6),"Nêu căn cứ: tận cùng hoặc tổng chữ số.","Không dùng chữ số tận cùng để xét chia hết cho 3 hoặc 9."),
  "math6-s1-lesson10": v("s1-l10-prime-sieve", "prime-sieve", "Sàng số nguyên tố và cây thừa số", "hai ước, hợp số và phân tích", c("Giới hạn sàng",20,60,30),c("Số cần phân tích",4,48,30),"Số nguyên tố lớn hơn 1 chỉ có hai ước.","Số 1 không phải số nguyên tố cũng không phải hợp số."),
  "math6-s1-lesson11": v("s1-l11-gcd", "gcd", "Venn thừa số và nhóm quà lớn nhất", "thừa số chung với số mũ nhỏ nhất", c("Số thứ nhất",6,36,18),c("Số thứ hai",6,36,24),"Nhân các thừa số nằm ở vùng giao.","Không lấy tất cả thừa số của cả hai số như khi tìm BCNN."),
  "math6-s1-lesson12": v("s1-l12-lcm", "lcm", "Hai đường thời gian gặp lại", "bội chung nhỏ nhất và chu kì", c("Chu kì A",2,12,4),c("Chu kì B",2,12,6),"Điểm sáng chung đầu tiên sau 0 là BCNN.","Không nhầm lần gặp đầu với UCLN."),
  "math6-s1-lesson13": v("s1-l13-integer-axis", "integer-axis", "Trục số và nhiệt kế", "số âm, số đối, giá trị tuyệt đối", c("Vị trí số nguyên",-9,9,-4),c("Mức thay đổi",-5,5,3),"Giá trị tuyệt đối là khoảng cách đến 0.","Không cho rằng số có giá trị tuyệt đối lớn hơn luôn lớn hơn."),
  "math6-s1-lesson14": v("s1-l14-integer-add", "integer-chips", "Bước đi và thẻ ± triệt tiêu", "cộng số nguyên và trừ thành cộng số đối", c("Số hạng thứ nhất",-8,8,-3),c("Số hạng thứ hai",-8,8,5),"Mỗi cặp +1 và −1 triệt tiêu thành 0.","Khi trừ phải đổi thành cộng số đối trước."),
  "math6-s1-lesson15": v("s1-l15-bracket-gate", "bracket-gate", "Cổng dấu ngoặc", "dấu cộng giữ dấu; dấu trừ đổi mọi dấu", c("Số hạng trong ngoặc",-9,9,5),c("Chọn cổng dấu",0,1,1),"Qua cổng trừ, từng số hạng đều đổi dấu.","Không chỉ đổi dấu số hạng đầu tiên."),
  "math6-s1-lesson16": v("s1-l16-sign-parity", "sign-parity", "Dải đếm thừa số âm", "dấu tích theo chẵn/lẻ", c("Số thừa số âm",0,6,3),c("Độ lớn mỗi thừa số",1,5,2),"Số thừa số âm chẵn cho tích dương; lẻ cho tích âm.","Không quyết định dấu bằng cách cộng các dấu."),
  "math6-s1-lesson17": v("s1-l17-integer-division", "integer-division", "Bảng dấu thương và cặp ước ±", "chia số nguyên, ước và bội nguyên", c("Số bị chia",-24,24,-18),c("Độ lớn số chia",2,8,3),"Nhân thương với số chia để kiểm tra.","Ước nguyên khác 0 xuất hiện theo cặp d và −d."),
  "math6-s1-lesson18": v("s1-l18-regular-shapes", "regular-shapes", "Ba hình đều và dấu bằng nhau", "cạnh, góc và đường chéo", c("Số cạnh hình đều",3,6,6),c("Bật đường chéo",0,1,1),"Hình đều có các cạnh và các góc bằng nhau.","Không kết luận hình đều chỉ từ việc các cạnh trông gần bằng nhau."),
  "math6-s1-lesson19": v("s1-l19-quadrilateral", "quadrilateral", "Bảng thuộc tính bốn tứ giác", "cạnh, góc, song song và đường chéo", c("Thuộc tính đang lọc",0,3,1),c("Mức biến dạng",0,4,1),"Đọc dấu song song và dấu bằng nhau thay vì đoán bằng mắt.","Không coi mọi hình bình hành đều là hình chữ nhật."),
  "math6-s1-lesson20": v("s1-l20-perimeter-area", "perimeter-area", "Đường biên và ô lát mặt", "phân biệt chu vi với diện tích", c("Chiều dài",2,10,7),c("Chiều rộng",2,8,4),"Chu vi dùng đơn vị độ dài; diện tích dùng đơn vị vuông.","Không dùng cùng một công thức cho đo biên và đo mặt."),
  "math6-s1-lesson21": v("s1-l21-axis-symmetry", "fold", "Bàn gấp qua trục", "hai nửa trùng nhau khi gấp", c("Vị trí trục gấp",1,9,5),c("Khoảng cách điểm",1,4,3),"Điểm và ảnh cách trục một khoảng bằng nhau.","Không chọn một đường chỉ chia hình thành hai phần có diện tích gần bằng nhau."),
  "math6-s1-lesson22": v("s1-l22-center-symmetry", "rotate", "Bàn quay 180° quanh tâm O", "O là trung điểm của cặp điểm–ảnh", c("Góc quay",0,180,180),c("Khoảng cách đến tâm",1,5,3),"Sau quay 180°, hình phải trùng chính nó.","Không nhầm tâm đối xứng với trục đối xứng."),
  "math6-s2-lesson23": v("s2-l23-fraction-equivalence", "fraction-equivalence", "Thanh phân số, trục số và lớp dấu", "mẫu khác 0; nhân/chia cả tử và mẫu", c("Tử số",-8,8,3),c("Mẫu số",1,12,4),"Hai phân số bằng nhau khi tích chéo bằng nhau.","Mẫu số không bao giờ được bằng 0."),
  "math6-s2-lesson24": v("s2-l24-fraction-compare", "fraction-compare", "Hai thanh phân số cùng độ dài", "quy đồng, so sánh và hỗn số", c("Tử số thứ nhất",1,8,3),c("Mẫu chung",2,12,8),"Chỉ so sánh tử trực tiếp sau khi hai mẫu bằng nhau.","Không so sánh hai tử khi mẫu còn khác nhau."),
  "math6-s2-lesson25": v("s2-l25-fraction-add", "fraction-add", "Ghép và lấy bớt các phần bằng nhau", "cộng trừ sau khi quy đồng", c("Số phần thứ nhất",1,6,2),c("Số phần thứ hai",1,6,3),"Quy đồng rồi cộng hoặc trừ tử, giữ mẫu chung.","Không cộng hai mẫu số với nhau."),
  "math6-s2-lesson26": v("s2-l26-fraction-product", "fraction-product", "Lưới diện tích và thẻ nghịch đảo", "nhân phân số; chia bằng nhân nghịch đảo", c("Tử số hàng",1,5,2),c("Tử số cột",1,5,3),"Phần giao nhau biểu diễn tích hai phân số.","Khi chia chỉ đảo phân số thứ hai."),
  "math6-s2-lesson27": v("s2-l27-fraction-problems", "fraction-tape", "Sơ đồ đoạn thẳng phần–toàn thể", "tìm phần của một số hoặc tìm toàn thể", c("Số phần bằng nhau",2,8,5),c("Số phần đã biết",1,7,2),"Xác định đại lượng chưa biết trước khi chọn phép nhân hay chia.","Không dùng cùng một phép tính cho hai dạng bài ngược nhau."),
  "math6-s2-lesson28": v("s2-l28-decimal-place", "decimal-place", "Bảng hàng qua dấu phẩy và lưới 100", "giá trị hàng, phân số thập phân và so sánh", c("Phần mười",0,9,4),c("Phần trăm",0,9,7),"So sánh từ hàng lớn nhất sang phải.","Không bỏ qua chữ số 0 giữ vị trí."),
  "math6-s2-lesson29": v("s2-l29-decimal-calc", "decimal-calc", "Bảng tính thẳng cột dấu phẩy", "bốn phép tính với số thập phân", c("Phần nguyên",1,20,12),c("Phần thập phân",0,99,35),"Khi cộng trừ, các dấu phẩy phải thẳng cột.","Không đặt thẳng chữ số cuối mà làm lệch hàng."),
  "math6-s2-lesson30": v("s2-l30-rounding", "rounding", "Trục số với mốc giữa", "chọn hàng làm tròn và số gần hơn", c("Số cần làm tròn",0,100,64),c("Bước làm tròn",1,10,10),"So sánh với mốc giữa hai bội liên tiếp.","Không nhìn chữ số bên trái hàng cần làm tròn."),
  "math6-s2-lesson31": v("s2-l31-percent", "percent", "Lưới 100 và sơ đồ giá gốc", "phần/toàn thể, đổi về 100, tăng giảm", c("Phần",1,90,35),c("Toàn thể",20,100,100),"Tỉ số phần trăm = phần : toàn thể × 100%.","Khi tăng giảm phải tính phần trăm trên đúng giá trị gốc."),
  "math6-s2-lesson32": v("s2-l32-point-line", "point-line", "Mặt phẳng điểm và hai đường thẳng", "thuộc, cắt, song song và trùng", c("Vị trí điểm A",0,10,5),c("Độ nghiêng đường d",0,10,3),"Dựa vào vị trí chính xác để viết A ∈ d hoặc A ∉ d.","Không kết luận hai đường song song chỉ từ một đoạn hình ngắn."),
  "math6-s2-lesson33": v("s2-l33-rays", "rays", "Ba điểm và các tia chung gốc", "điểm nằm giữa; tia đối và tia trùng", c("Vị trí điểm B",1,9,5),c("Hướng tia",0,1,1),"Tên tia bắt đầu bằng tên gốc.","Hai tia đối nhau phải chung gốc và ngược hướng trên một đường thẳng."),
  "math6-s2-lesson34": v("s2-l34-segment", "segment", "Thước đo và phép cộng đoạn", "đầu mút, vạch 0 và điểm nằm giữa", c("Độ dài AB",2,14,10),c("Vị trí điểm C",1,13,4),"Nếu C nằm giữa A và B thì AC + CB = AB.","Không đọc độ dài từ vị trí đầu thước nếu đầu đoạn không ở vạch 0."),
  "math6-s2-lesson35": v("s2-l35-midpoint", "midpoint", "Thanh cân bằng tại M", "nằm giữa và cách đều hai đầu mút", c("Độ dài AB",2,16,12),c("Vị trí M",1,15,6),"Trung điểm phải thỏa đồng thời hai điều kiện.","MA = MB chưa đủ nếu M không nằm giữa A và B."),
  "math6-s2-lesson36": v("s2-l36-angle", "angle", "Hai tia bản lề và miền trong", "đỉnh, cạnh, tên góc và góc bẹt", c("Độ mở góc",0,180,70),c("Vị trí điểm thử",0,10,5),"Chữ ở giữa tên góc là đỉnh.","Không gọi tên góc bằng ba chữ mà đặt đỉnh ở ngoài vị trí giữa."),
  "math6-s2-lesson37": v("s2-l37-protractor", "protractor", "Thước đo góc trong suốt", "đặt tâm, vạch 0 và đọc đúng thang", c("Số đo góc",0,180,65),c("Lệch tâm thước",0,5,0),"Tâm thước trùng đỉnh và vạch 0 trùng một cạnh.","Không đọc thang bắt đầu từ 180° thay vì 0° của cạnh đã đặt."),
  "math6-s2-lesson38": v("s2-l38-data-flow", "data-flow", "Luồng thu thập và kiểm tra dữ liệu", "câu hỏi → đối tượng → phương pháp → dữ liệu", c("Số quan sát",5,30,12),c("Số dữ liệu lỗi",0,6,2),"Dữ liệu phải đúng mục đích và đáng tin cậy.","Không thu nhiều dữ liệu không liên quan rồi coi đó là tốt hơn."),
  "math6-s2-lesson39": v("s2-l39-pictograph", "pictograph", "Dữ liệu thô → kiểm đếm → biểu đồ tranh", "tần số và chú giải mỗi hình", c("Mỗi hình đại diện",1,5,2),c("Số hình",1,8,5),"Số lượng = số hình × giá trị chú giải.","Không đếm hình mà bỏ qua chú giải."),
  "math6-s2-lesson40": v("s2-l40-bar-chart", "bar", "Phòng thí nghiệm biểu đồ cột", "trục, thang đo, đọc và vẽ cột", c("Cột A",1,12,4),c("Cột B",1,12,7),"Đọc chiều cao theo cùng một thang đo.","Không dùng các khoảng chia không đều trên cùng một trục."),
  "math6-s2-lesson41": v("s2-l41-double-bar", "double-bar", "Hai dãy cột theo từng nhóm", "chú giải và so sánh theo cặp", c("Dãy A",1,12,8),c("Dãy B",1,12,5),"Lấy hai cột cùng một nhóm khi so sánh.","Không so sánh hai cột thuộc hai nhóm khác nhau."),
  "math6-s2-lesson42": v("s2-l42-outcomes", "outcome-tree", "Cây kết quả và bộ lọc sự kiện", "không gian kết quả; chắc chắn, có thể, không thể", c("Số mặt của vật thử",2,8,6),c("Ngưỡng sự kiện",1,7,4),"Sự kiện là một tập con của không gian kết quả.","Không gọi một kết quả riêng lẻ là toàn bộ không gian kết quả."),
  "math6-s2-lesson43": v("s2-l43-experiment", "experiment", "Dải lịch sử và tỉ lệ đang chạy", "số lần xảy ra trên tổng số lần thử", c("Số lần thử",10,100,40),c("Số lần xảy ra",0,40,16),"Xác suất thực nghiệm = số lần xảy ra : tổng số lần thử.","Không coi kết quả từ mẫu nhỏ là xác suất chắc chắn."),
};

const review = (visualKey: string, model: string, kinds: MathRuleVisualKind[]): MathRuleVisualSpec => ({ visualKey, kind: "review", model, focus: "chọn đúng mô hình theo dạng câu", controls: [c("Mô hình đang xem",0,kinds.length-1,0),c("Giá trị minh họa",2,10,5)], check: "Đọc yêu cầu rồi chọn mạch kiến thức trước khi tính.", commonError: "Không dùng một mô hình duy nhất cho mọi câu tổng hợp.", reviewKinds: kinds });

export const MATH_COMPOSITE_RULE_VISUALS: Record<string, MathRuleVisualSpec> = {
  "math6-s1-chapter1-practice": review("s1-c1-practice-a", "Bộ mô hình số tự nhiên", ["sets","place-value","number-ray","part-whole","equal-groups"]),
  "math6-s1-chapter1-practice2": review("s1-c1-practice-b", "Bộ mô hình lũy thừa và biểu thức", ["exponent","expression-tree","equal-groups"]),
  "math6-s1-chapter1-review": review("s1-c1-review", "Bản đồ ôn tập Chương I", ["sets","place-value","number-ray","part-whole","equal-groups","exponent","expression-tree"]),
  "math6-s1-chapter2-practice1": review("s1-c2-practice-a", "Bộ mô hình chia hết", ["divisibility","digit-rules","prime-sieve"]),
  "math6-s1-chapter2-practice2": review("s1-c2-practice-b", "Bộ mô hình ước và bội", ["prime-sieve","gcd","lcm"]),
  "math6-s1-chapter2-review": review("s1-c2-review", "Bản đồ ôn tập Chương II", ["divisibility","digit-rules","prime-sieve","gcd","lcm"]),
  "math6-s1-chapter3-practice1": review("s1-c3-practice-a", "Bộ mô hình số nguyên", ["integer-axis","integer-chips","bracket-gate"]),
  "math6-s1-chapter3-practice2": review("s1-c3-practice-b", "Bộ mô hình dấu và ước", ["sign-parity","integer-division","integer-axis"]),
  "math6-s1-chapter3-review": review("s1-c3-review", "Bản đồ ôn tập Chương III", ["integer-axis","integer-chips","bracket-gate","sign-parity","integer-division"]),
  "math6-s1-chapter4-practice": review("s1-c4-practice", "Bộ nhận dạng hình phẳng", ["regular-shapes","quadrilateral","perimeter-area"]),
  "math6-s1-chapter4-review": review("s1-c4-review", "Bản đồ ôn tập Chương IV", ["regular-shapes","quadrilateral","perimeter-area"]),
  "math6-s1-chapter5-practice": review("s1-c5-practice", "Bộ thao tác đối xứng", ["fold","rotate"]),
  "math6-s1-chapter5-review": review("s1-c5-review", "Bản đồ ôn tập Chương V", ["fold","rotate","regular-shapes"]),
  "math6-s1-activity-card-room": review("s1-activity-design", "Lưới thiết kế thiệp và phòng", ["design","perimeter-area","fold"]),
  "math6-s1-activity-geogebra": review("s1-activity-geometry-tool", "Thanh công cụ dựng hình", ["geometry-tool","regular-shapes","rotate"]),
  "math6-s1-activity-calculator": review("s1-activity-calculator", "Chuỗi phím và màn hình kiểm tra", ["calculator","expression-tree","exponent"]),
  "math6-s2-chapter6-practice1": review("s2-c6-practice-a", "Bộ mô hình phân số", ["fraction-equivalence","fraction-compare","fraction-add"]),
  "math6-s2-chapter6-practice2": review("s2-c6-practice-b", "Bộ mô hình phép tính phân số", ["fraction-product","fraction-tape","fraction-add"]),
  "math6-s2-chapter6-review": review("s2-c6-review", "Bản đồ ôn tập Chương VI", ["fraction-equivalence","fraction-compare","fraction-add","fraction-product","fraction-tape"]),
  "math6-s2-chapter7-practice": review("s2-c7-practice", "Bộ mô hình thập phân và phần trăm", ["decimal-place","decimal-calc","rounding","percent"]),
  "math6-s2-chapter7-review": review("s2-c7-review", "Bản đồ ôn tập Chương VII", ["decimal-place","decimal-calc","rounding","percent"]),
  "math6-s2-chapter8-practice1": review("s2-c8-practice-a", "Bộ mô hình điểm, tia và đoạn", ["point-line","rays","segment","midpoint"]),
  "math6-s2-chapter8-practice2": review("s2-c8-practice-b", "Bộ mô hình góc", ["angle","protractor"]),
  "math6-s2-chapter8-review": review("s2-c8-review", "Bản đồ ôn tập Chương VIII", ["point-line","rays","segment","midpoint","angle","protractor"]),
  "math6-s2-chapter9-practice1": review("s2-c9-practice-a", "Bộ mô hình bảng và biểu đồ", ["data-flow","pictograph","bar","double-bar"]),
  "math6-s2-chapter9-practice2": review("s2-c9-practice-b", "Bộ mô hình sự kiện và xác suất", ["outcome-tree","experiment"]),
  "math6-s2-chapter9-review": review("s2-c9-review", "Bản đồ ôn tập Chương IX", ["data-flow","pictograph","bar","double-bar","outcome-tree","experiment"]),
  "math6-s2-activity-budget": review("s2-activity-budget", "Bảng thu–chi và thanh ngân sách", ["budget","percent"]),
  "math6-s2-activity-sports-survey": review("s2-activity-survey", "Khảo sát → bảng → biểu đồ", ["survey","data-flow","bar"]),
  "math6-s2-activity-geogebra": review("s2-activity-geometry-tool", "Thanh công cụ dựng hình", ["geometry-tool","point-line","segment","midpoint","angle"]),
  "math6-s2-final-review": review("s2-final-review", "Bản đồ quyết định cuối năm", ["fraction-add","decimal-calc","percent","protractor","double-bar","experiment"]),
};

export const MATH_RULE_VISUALS: Record<string, MathRuleVisualSpec> = { ...MATH_MAIN_RULE_VISUALS, ...MATH_COMPOSITE_RULE_VISUALS };

export function getMathRuleVisualSpec(lessonId: string): MathRuleVisualSpec {
  return MATH_RULE_VISUALS[lessonId] ?? review(`fallback-${lessonId}`, "Bộ mô hình tổng hợp", ["part-whole","number-ray","data-flow"]);
}
