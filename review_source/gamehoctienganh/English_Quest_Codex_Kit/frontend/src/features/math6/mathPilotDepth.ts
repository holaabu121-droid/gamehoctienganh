import type { FoundationItem } from "../skills-common/learningUx";

export type MathPilotLevel = "Cơ bản" | "Thông hiểu" | "Vận dụng";

export type MathPilotConcept = {
  question: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  difficulty: MathPilotLevel;
  context: string;
  taskVi: string;
  wrongFeedback: [string, string, string];
};

export type MathPilotConfig = {
  objectives: string[];
  foundations: Array<{ title: string; items: FoundationItem[] }>;
  concepts: MathPilotConcept[];
  teaching: Record<"concept" | "apply" | "reason" | "error" | "mixed" | "challenge", { summary: string; steps: string[] }>;
};

const item = (text: string, translation: string): FoundationItem => ({ text, translation, speechText: `${text}. ${translation}` });
const concept = (
  question: string,
  answer: string,
  distractors: [string, string, string],
  explanation: string,
  difficulty: MathPilotLevel,
  context: string,
  taskVi: string,
  wrongFeedback: [string, string, string],
): MathPilotConcept => ({ question, answer, distractors, explanation, difficulty, context, taskVi, wrongFeedback });

const exponentTeaching = {
  concept: { summary: "Đọc kí hiệu lũy thừa bằng cách tách cơ số, số mũ và giá trị.", steps: ["Chỉ số lớn làm cơ số; số nhỏ phía trên làm số mũ.", "Đổi a^n thành n thừa số a để kiểm tra ý nghĩa.", "Phân biệt kí hiệu a^n với giá trị nhận được sau khi tính."] },
  apply: { summary: "Với lũy thừa cùng cơ số, chỉ xử lí số mũ sau khi xác định phép toán.", steps: ["Khoanh hai cơ số và kiểm tra chúng có giống nhau không.", "Nhân thì cộng số mũ; chia thì trừ số mũ theo đúng thứ tự.", "Khai triển một ví dụ nhỏ để kiểm tra kết quả rút gọn."] },
  reason: { summary: "Giải thích quy tắc số mũ bằng số thừa số được ghép hoặc khử.", steps: ["Viết mỗi lũy thừa thành một nhóm thừa số bằng nhau.", "Đếm thừa số sau khi ghép tích hoặc khử thương.", "Chọn lí do nói đúng số thừa số, không chỉ nhắc lại công thức."] },
  error: { summary: "Sửa lỗi số mũ từ bước hiểu phép nhân lặp.", steps: ["Kiểm tra bạn có lấy cơ số nhân số mũ hoặc đổi chỗ hai số không.", "Viết lại đủ tích lặp và đánh dấu bước sai đầu tiên.", "Tính lại, sau đó so sánh với ước lượng để phát hiện kết quả vô lí."] },
  mixed: { summary: "Tách rõ bước rút gọn lũy thừa và bước tính giá trị.", steps: ["Dòng 1: giữ cơ số, xử lí số mũ.", "Dòng 2: chỉ tính giá trị khi số mũ đủ nhỏ.", "Đối chiếu cả dạng lũy thừa lẫn giá trị cuối."] },
  challenge: { summary: "Nhận ra lũy thừa trong các quá trình có cùng số lựa chọn lặp lại.", steps: ["Xác định số lựa chọn ở mỗi bước làm cơ số.", "Xác định số bước độc lập làm số mũ.", "Viết phép nhân lặp trước khi kết luận biểu thức lũy thừa."] },
} satisfies MathPilotConfig["teaching"];

const fractionTeaching = {
  concept: { summary: "Đọc phân số bằng ba kiểm tra: tử nguyên, mẫu nguyên và mẫu khác 0.", steps: ["Xác định số nằm trên là tử, số nằm dưới là mẫu.", "Kiểm tra tử và mẫu đều là số nguyên.", "Loại ngay cách viết có mẫu bằng 0."] },
  apply: { summary: "Tạo phân số bằng nhau bằng cùng một phép nhân hoặc chia trên cả tử và mẫu.", steps: ["Viết hệ số cạnh tử số.", "Lặp đúng hệ số đó ở mẫu số.", "Dùng tích chéo để kiểm tra giá trị có được giữ nguyên không."] },
  reason: { summary: "Dùng tích chéo để biến nhận xét bằng nhau thành hai phép nhân có thể kiểm tra.", steps: ["Nối tử trái với mẫu phải và mẫu trái với tử phải.", "Tính riêng hai tích, giữ đúng dấu âm.", "Chỉ kết luận bằng nhau khi hai tích bằng nhau và hai mẫu khác 0."] },
  error: { summary: "Lỗi phổ biến nhất là chỉ biến đổi một phía của dấu gạch phân số.", steps: ["Ghi phép toán đã làm với tử.", "Kiểm tra mẫu đã nhận đúng phép toán đó chưa.", "Nếu chưa, sửa từ bước đầu tiên rồi kiểm tra lại bằng tích chéo."] },
  mixed: { summary: "Chuỗi phân số bằng nhau phải giữ giá trị ở từng mũi tên.", steps: ["Rút gọn bằng UCLN để có dạng tối giản.", "Mở rộng từ dạng tối giản bằng cùng một hệ số.", "Kiểm tra từng mũi tên, không chỉ nhìn kết quả cuối."] },
  challenge: { summary: "Trong bài toán thực tế, rút gọn phần số nhưng phải giữ dấu và đơn vị.", steps: ["Tách phần phân số khỏi đơn vị đo.", "Rút gọn tử và mẫu bằng cùng một ước chung.", "Gắn lại đơn vị và kiểm tra dấu còn đúng với ngữ cảnh."] },
} satisfies MathPilotConfig["teaching"];

const chartTeaching = {
  concept: { summary: "Đọc biểu đồ theo thứ tự tiêu đề → trục → đơn vị → từng cột.", steps: ["Nêu biểu đồ đang nói về dữ liệu gì.", "Đọc nhãn nhóm ở trục ngang và thang số ở trục dọc.", "Ghép đúng mỗi cột với nhãn trước khi so sánh độ cao."] },
  apply: { summary: "Chuyển độ cao cột thành số rồi mới cộng, trừ hoặc so sánh.", steps: ["Ghi giá trị của từng cột thành một hàng số.", "Đánh dấu cột đã dùng để tránh bỏ sót.", "Ghi phép tính và đơn vị bên cạnh kết quả."] },
  reason: { summary: "Mọi nhận xét từ biểu đồ phải đi kèm con số làm bằng chứng.", steps: ["Viết kết luận cần kiểm tra.", "Chọn đúng hai hoặc nhiều cột liên quan.", "Nêu phép tính hoặc số liệu chứng minh, không dựa vào màu sắc."] },
  error: { summary: "Kiểm tra thang đo trước khi kết luận một cột cao bao nhiêu.", steps: ["Đọc giá trị ghi tại hai vạch liên tiếp.", "Xác định mỗi khoảng tăng bao nhiêu đơn vị.", "Phân biệt nhãn vạch thật với số thứ tự của khoảng."] },
  mixed: { summary: "Trên biểu đồ cột, tổng, hiệu và giá trị lớn nhất là ba đại lượng khác nhau.", steps: ["Ghi rõ câu hỏi đang cần tổng hay độ chênh lệch.", "Tính từng đại lượng trên một dòng riêng.", "Ghép kết quả với đúng nhãn để không đảo hai yêu cầu."] },
  challenge: { summary: "Ra quyết định từ biểu đồ cần có tiêu chí và giới hạn kết luận.", steps: ["Chuyển yêu cầu thực tế thành tiêu chí lớn nhất, nhỏ nhất hoặc tổng.", "Tìm nhóm đáp ứng tiêu chí bằng số liệu.", "Nêu quyết định cùng bằng chứng, không suy rộng ngoài dữ liệu."] },
} satisfies MathPilotConfig["teaching"];

const lesson6: MathPilotConfig = {
  objectives: [
    "Đọc và viết được lũy thừa, xác định đúng cơ số và số mũ.",
    "Tính được giá trị lũy thừa nhỏ bằng phép nhân lặp.",
    "Nhân và chia hai lũy thừa cùng cơ số bằng quy tắc số mũ.",
    "Phân biệt lũy thừa với phép nhân cơ số và số mũ.",
    "Giải thích, phát hiện lỗi và vận dụng lũy thừa vào đếm, diện tích và hệ thập phân.",
  ],
  foundations: [
    { title: "Tiền đề · Phép nhân lặp", items: [
      item("2 · 2 · 2 · 2 là tích của bốn thừa số bằng nhau.", "Ta viết gọn là 2⁴; số 2 là cơ số và số 4 là số mũ."),
      item("aⁿ có n thừa số đều bằng a.", "Số mũ cho biết số lần cơ số xuất hiện trong tích, không phải số đem nhân với cơ số."),
    ] },
    { title: "Khám phá · Đọc và tính lũy thừa", items: [
      item("3⁴ đọc là ba mũ bốn hoặc lũy thừa bậc bốn của ba.", "3⁴ = 3 · 3 · 3 · 3 = 81."),
      item("10⁵ = 100 000.", "Lũy thừa của 10 có số chữ số 0 bằng số mũ."),
    ] },
    { title: "Quy tắc · Cùng cơ số", items: [
      item("aᵐ · aⁿ = aᵐ⁺ⁿ.", "Khi nhân hai lũy thừa cùng cơ số, giữ nguyên cơ số và cộng số mũ."),
      item("aᵐ : aⁿ = aᵐ⁻ⁿ với a khác 0 và m ≥ n.", "Khi chia, giữ nguyên cơ số và trừ số mũ; phải kiểm tra điều kiện."),
    ] },
    { title: "Ví dụ mẫu · Nghĩ thành lời", items: [
      item("2³ · 2⁴ = 2³⁺⁴ = 2⁷ = 128.", "Hai cơ số cùng là 2 nên cộng 3 và 4; không nhân hai số mũ."),
      item("5⁶ : 5² = 5⁶⁻² = 5⁴ = 625.", "Hai cơ số cùng là 5 nên trừ 2 khỏi 6."),
    ] },
    { title: "Lỗi thường gặp và tự kiểm tra", items: [
      item("2³ không bằng 2 · 3.", "2³ có ba thừa số 2 nên bằng 8, còn 2 · 3 chỉ bằng 6."),
      item("Kiểm tra nhanh bằng cách khai triển một ví dụ nhỏ.", "Nếu chưa chắc quy tắc số mũ, viết tích lặp để kiểm tra trước khi kết luận."),
    ] },
  ],
  concepts: [
    concept("2⁵ bằng bao nhiêu?","32",["10","16","25"],"2⁵ = 2·2·2·2·2 = 32.","Cơ bản","Tính một lũy thừa nhỏ bằng phép nhân lặp.","Viết đủ năm thừa số 2 rồi nhân.",["10 là kết quả của 2·5, không phải 2⁵.","16 mới là 2⁴; em đang thiếu một thừa số 2.","25 là 5²; em đã đổi chỗ cơ số và số mũ."]),
    concept("Trong 7³, cơ số là số nào?","7",["3","21","343"],"Trong aⁿ, a là cơ số; vì vậy cơ số của 7³ là 7.","Cơ bản","Biểu thức 7³.","Phân biệt cơ số với số mũ và giá trị lũy thừa.",["3 là số mũ, không phải cơ số.","21 là tích 7·3, không phải thành phần của kí hiệu lũy thừa.","343 là giá trị của 7³, không phải cơ số."]),
    concept("3·3·3·3 viết gọn là gì?","3⁴",["4³","3·4","12"],"Có bốn thừa số đều bằng 3 nên viết 3⁴.","Cơ bản","Một tích gồm các thừa số bằng nhau.","Đếm số thừa số để xác định số mũ.",["4³ đổi nhầm cơ số và số mũ.","3·4 không biểu diễn phép nhân lặp bốn thừa số 3.","12 là 3·4, không phải giá trị của 3⁴."]),
    concept("10⁶ viết dưới dạng số tự nhiên là gì?","1 000 000",["60","100 000","10 000 000"],"10⁶ là số 1 theo sau bởi sáu chữ số 0.","Cơ bản","Lũy thừa của 10 trong hệ thập phân.","Dùng quy luật số chữ số 0.",["60 là 10·6.","100 000 là 10⁵ nên thiếu một chữ số 0.","10 000 000 là 10⁷ nên thừa một chữ số 0."]),
    concept("3²·3⁴ viết gọn là gì?","3⁶",["3⁸","9⁶","3²"],"Cùng cơ số 3 nên cộng số mũ: 3²·3⁴ = 3²⁺⁴ = 3⁶.","Thông hiểu","Nhân hai lũy thừa cùng cơ số.","Giữ cơ số và cộng hai số mũ.",["3⁸ là do nhân nhầm 2·4 thay vì cộng 2+4.","9⁶ đã đổi cơ số; quy tắc yêu cầu giữ nguyên cơ số 3.","3² bỏ mất thừa số 3⁴."]),
    concept("5⁷:5³ bằng gì?","5⁴",["5¹⁰","5³","1"],"Cùng cơ số 5 nên trừ số mũ: 5⁷:5³ = 5⁷⁻³ = 5⁴.","Thông hiểu","Chia hai lũy thừa cùng cơ số.","Kiểm tra điều kiện rồi trừ số mũ.",["5¹⁰ là do cộng số mũ như phép nhân.","5³ là số chia chứ không phải thương.","Thương chỉ bằng 1 khi hai số mũ bằng nhau."]),
    concept("4⁶:4⁶ bằng bao nhiêu?","1",["4","0","4¹²"],"Mọi số khác 0 chia cho chính nó bằng 1; theo quy tắc ta có 4⁰ = 1.","Thông hiểu","Hai lũy thừa cùng cơ số và cùng số mũ.","Nhận ra hai số bị chia bằng nhau.",["4 không phải thương của hai số bằng nhau.","Số mũ trừ nhau bằng 0 nhưng giá trị không bằng 0.","4¹² là kết quả cộng số mũ, không dùng cho phép chia."]),
    concept("So sánh 2⁵ và 5².","2⁵ > 5²",["2⁵ < 5²","2⁵ = 5²","Không so sánh được"],"2⁵=32 và 5²=25 nên 2⁵ > 5².","Thông hiểu","Hai lũy thừa khác cơ số và khác số mũ.","Tính từng giá trị rồi so sánh; không so sánh riêng cơ số.",["32 không nhỏ hơn 25.","Hai biểu thức có giá trị 32 và 25 nên không bằng nhau.","Có thể tính giá trị rồi so sánh."]),
    concept("Tìm n biết 2ⁿ = 16.","n = 4",["n = 8","n = 2","n = 16"],"16 = 2·2·2·2 = 2⁴ nên n=4.","Vận dụng","Xác định số mũ từ giá trị lũy thừa.","Khai triển 16 thành tích các thừa số 2.",["2⁸=256, lớn hơn 16.","2²=4, chưa bằng 16.","Số mũ không bằng chính giá trị 16."]),
    concept("Một hình vuông có cạnh 2³ cm. Diện tích của nó là bao nhiêu?","64 cm²",["16 cm²","12 cm²","32 cm²"],"Cạnh 2³=8 cm nên diện tích là 8²=64 cm².","Vận dụng","Diện tích hình vuông với độ dài cạnh viết bằng lũy thừa.","Tính cạnh trước, sau đó bình phương độ dài cạnh.",["16 cm² là bình phương của 4, không phải của 8.","12 cm² là cộng hoặc nhân sai số đo cạnh.","32 cm² là 2⁵, chưa phải 8²."]),
    concept("Một mã có 10 lựa chọn cho mỗi vị trí và gồm 4 vị trí. Có bao nhiêu mã?","10⁴",["40","4¹⁰","10+4"],"Quy tắc nhân cho 10·10·10·10 = 10⁴ mã.","Vận dụng","Đếm số khả năng bằng phép nhân lặp.","Nhận ra bốn vị trí độc lập, mỗi vị trí có 10 lựa chọn.",["40 chỉ cộng số lựa chọn của bốn vị trí.","4¹⁰ đổi vai trò số lựa chọn và số vị trí.","10+4 không dùng quy tắc nhân."]),
    concept("Bạn viết 6³ = 6·3. Kết luận đúng là gì?","6³ = 216",["6³ = 18","6³ = 36","6³ = 63"],"6³ = 6·6·6 = 216; số mũ cho biết số thừa số.","Vận dụng","Phân tích một lỗi hiểu sai ý nghĩa số mũ.","Viết lại phép nhân lặp rồi tính.",["18 chính là kết quả sai của 6·3.","36 mới là 6², còn 6³ cần thêm một thừa số 6.","63 chỉ ghép hai chữ số, không phải phép toán."]),
  ],
  teaching: exponentTeaching,
};

const lesson23: MathPilotConfig = {
  objectives: [
    "Nhận biết phân số có tử và mẫu là số nguyên, mẫu khác 0.",
    "Biểu diễn được số nguyên dưới dạng phân số và đặt dấu âm đúng vị trí.",
    "Kiểm tra hai phân số bằng nhau bằng tích chéo.",
    "Rút gọn phân số bằng ước chung và đưa về dạng tối giản.",
    "Giải thích, sửa lỗi và vận dụng phân số bằng nhau để tìm thành phần chưa biết.",
  ],
  foundations: [
    { title: "Tiền đề · Phép chia và ước chung", items: [
      item("Phân số a/b cần a, b là số nguyên và b khác 0.", "a là tử số, b là mẫu số; phép chia cho 0 không xác định nên mẫu không thể bằng 0."),
      item("Rút gọn cần chia tử và mẫu cho cùng một ước chung khác 1.", "Dùng UCLN giúp đưa phân số về dạng tối giản trong một bước."),
    ] },
    { title: "Khám phá · Phân số bằng nhau", items: [
      item("2/3 và 8/12 cùng biểu diễn một giá trị.", "Nhân cả tử và mẫu của 2/3 với 4 được 8/12."),
      item("a/b = c/d khi a·d = b·c, với b và d khác 0.", "Tích chéo là cách kiểm tra nhanh hai phân số có bằng nhau hay không."),
    ] },
    { title: "Quy tắc · Dấu và dạng tối giản", items: [
      item("5/(−8) = −5/8 = −(5/8).", "Nên chuyển dấu âm của mẫu lên tử hoặc ra trước phân số để dễ đọc."),
      item("−18/24 = −3/4.", "UCLN của 18 và 24 là 6; chia cả tử và mẫu cho 6."),
    ] },
    { title: "Ví dụ mẫu · Tìm thành phần chưa biết", items: [
      item("x/12 = 3/4 nên 4x = 36 và x = 9.", "Dùng tích chéo, sau đó giải phép nhân có thành phần chưa biết."),
      item("−7 = −7/1.", "Mọi số nguyên n đều viết được thành n/1."),
    ] },
    { title: "Lỗi thường gặp và tự kiểm tra", items: [
      item("4/0 không phải là một phân số hợp lệ.", "Không được bỏ qua điều kiện mẫu khác 0."),
      item("Chỉ được nhân hoặc chia cả tử và mẫu cho cùng một số khác 0.", "Nếu chỉ thay đổi tử hoặc mẫu, giá trị phân số thường thay đổi."),
    ] },
  ],
  concepts: [
    concept("Cách viết nào là một phân số hợp lệ?","−3/5",["2,5/4","4/0","3,2/7"],"Tử và mẫu phải là số nguyên, mẫu khác 0.","Cơ bản","Kiểm tra điều kiện của một phân số.","Xét tử, mẫu và điều kiện mẫu khác 0.",["2,5 không phải số nguyên nên không phù hợp định nghĩa đang học.","Mẫu bằng 0 làm phép chia không xác định.","3,2 không phải số nguyên."]),
    concept("Trong phân số −7/9, mẫu số là gì?","9",["−7","7","−9"],"Dấu gạch phân số tách tử −7 và mẫu 9.","Cơ bản","Nhận diện tử số và mẫu số.","Đọc thành phần nằm dưới dấu gạch phân số.",["−7 là tử số.","7 là độ lớn của tử nhưng không phải mẫu.","Phân số đã được viết với mẫu dương 9."]),
    concept("Số nguyên −6 viết dưới dạng phân số nào đơn giản nhất?","−6/1",["6/1","−1/6","−6/0"],"Mọi số nguyên n đều bằng n/1.","Cơ bản","Biểu diễn số nguyên bằng phân số.","Giữ số nguyên ở tử và dùng mẫu 1.",["6/1 bằng 6, sai dấu.","−1/6 không bằng −6.","Mẫu 0 không hợp lệ."]),
    concept("2/3 bằng phân số nào?","8/12",["4/9","6/12","8/9"],"Nhân cả tử và mẫu của 2/3 với 4 được 8/12.","Cơ bản","Tạo phân số bằng nhau.","Tìm cùng một thừa số tác động lên cả tử và mẫu.",["Tử nhân 2 nhưng mẫu nhân 3 nên giá trị đổi.","6/12 rút gọn thành 1/2.","8/9 chỉ nhân tử với 4, mẫu với 3."]),
    concept("Cặp phân số nào bằng nhau?","3/5 và 12/20",["3/5 và 9/20","2/7 và 6/14","4/9 và 8/27"],"3·20 = 5·12 = 60 nên hai phân số bằng nhau.","Thông hiểu","Kiểm tra bằng tích chéo.","Tính hai tích chéo cho từng cặp.",["3·20 khác 5·9.","2·14 khác 7·6.","4·27 khác 9·8."]),
    concept("Rút gọn −18/24 được gì?","−3/4",["−9/12","3/4","−6/4"],"Chia cả tử và mẫu cho UCLN(18,24)=6.","Thông hiểu","Rút gọn đến dạng tối giản.","Tìm UCLN rồi chia cả tử và mẫu.",["−9/12 bằng phân số ban đầu nhưng chưa tối giản.","Phân số ban đầu âm nên kết quả không thể dương.","−6/4 vẫn còn ước chung 2 và cũng không bằng phép chia cùng một số từ 18/24."]),
    concept("Phân số 5/(−8) thường được viết thế nào?","−5/8",["5/8","−5/(−8)","8/5"],"Dấu âm của mẫu được chuyển lên tử hoặc ra trước phân số.","Thông hiểu","Chuẩn hóa vị trí dấu âm.","Giữ giá trị âm và đưa mẫu về số dương.",["5/8 đã làm mất dấu âm.","−5/(−8) là phân số dương vì âm chia âm.","8/5 vừa đảo tử mẫu vừa đổi giá trị."]),
    concept("Phân số 15/25 đã tối giản chưa?","Chưa, rút gọn được thành 3/5",["Rồi, vì 15 < 25","Chưa, thành 5/3","Rồi, vì cả hai đều dương"],"UCLN(15,25)=5 nên chia cả tử và mẫu cho 5 được 3/5.","Thông hiểu","Kiểm tra dạng tối giản.","Tìm xem tử và mẫu còn ước chung lớn hơn 1 không.",["Tử nhỏ hơn mẫu không có nghĩa là đã tối giản.","5/3 là phân số nghịch đảo, không phải kết quả rút gọn.","Dấu dương không quyết định dạng tối giản."]),
    concept("Tìm x biết x/12 = 3/4.","x = 9",["x = 4","x = 36","x = 16"],"Tích chéo: 4x=36 nên x=9.","Vận dụng","Tìm tử số chưa biết trong hai phân số bằng nhau.","Lập tích chéo rồi giải 4x=36.",["4 là mẫu của phân số bên phải, chưa phải x.","36 là tích 3·12; còn phải chia cho 4.","16 không thỏa mãn 4x=36."]),
    concept("Điền số: −2/5 = 6/□.","−15",["15","−10","3"],"Tích chéo: (−2)·□ = 30 nên □=−15.","Vận dụng","Mẫu chưa biết có thể là số nguyên âm.","Dùng tích chéo và chú ý dấu.",["15 tạo 6/15 dương, không bằng phân số âm.","−10 cho 6/(−10)=−3/5.","Mẫu 3 cho giá trị 2, không bằng −2/5."]),
    concept("Một công thức dùng 6/8 lít. Viết lượng này ở dạng tối giản.","3/4 lít",["6/4 lít","2/4 lít","8/6 lít"],"Chia tử và mẫu của 6/8 cho 2 được 3/4.","Vận dụng","Rút gọn số đo trong tình huống thực tế.","Giữ nguyên đơn vị và rút gọn phân số.",["6/4 không nhận được bằng cách chia cả tử và mẫu.","2/4=1/2, không bằng 6/8.","8/6 là phân số nghịch đảo."]),
    concept("Bạn nhân tử của 3/7 với 2 nhưng giữ nguyên mẫu và viết 6/7. Nhận xét đúng là gì?","Giá trị đã thay đổi",["Hai phân số vẫn bằng nhau","Chỉ cần nhân tử là đủ","6/7 là dạng rút gọn"],"Muốn tạo phân số bằng nhau phải nhân cả tử và mẫu với cùng một số khác 0.","Vận dụng","Phân tích lỗi khi tạo phân số bằng nhau.","Kiểm tra xem cả tử và mẫu có cùng được biến đổi không.",["Tích chéo 3·7 khác 7·6 nên không bằng nhau.","Chỉ nhân tử làm thay đổi giá trị phân số.","6/7 không phải rút gọn của 3/7."]),
  ],
  teaching: fractionTeaching,
};

const lesson40: MathPilotConfig = {
  objectives: [
    "Đọc đúng tiêu đề, trục, đơn vị và giá trị của từng cột.",
    "Lập bảng dữ liệu từ biểu đồ và vẽ biểu đồ cột từ bảng.",
    "So sánh, tính tổng, hiệu và nhận xét xu hướng từ số liệu.",
    "Phát hiện biểu đồ thiếu nhãn, sai tỉ lệ hoặc dễ gây hiểu nhầm.",
    "Vận dụng biểu đồ để đưa ra kết luận có giới hạn và căn cứ.",
  ],
  foundations: [
    { title: "Tiền đề · Từ bảng đến biểu đồ", items: [
      item("Bảng: Tháng 1 | 2 | 3; số cây: 4 | 7 | 5.", "Mỗi tháng là một nhóm; số cây là giá trị dùng để xác định chiều cao cột."),
      item("Biểu đồ cột dùng để so sánh các nhóm dữ liệu rời rạc.", "Nếu cần theo dõi số cây của từng tháng, mỗi tháng tương ứng một cột."),
    ] },
    { title: "Cấu tạo · Đọc đủ trước khi tính", items: [
      item("Tiêu đề cho biết biểu đồ nói về điều gì.", "Trục ngang thường ghi nhóm; trục dọc ghi giá trị và đơn vị."),
      item("Chiều cao cột phải được đọc theo vạch chia trên trục dọc.", "Không ước lượng bằng mắt khi biểu đồ đã cho thang đo."),
    ] },
    { title: "Quy trình · Vẽ biểu đồ cột", items: [
      item("Bước 1: đặt tên biểu đồ, tên trục và chọn thang đo.", "Thang đo phải bao quát giá trị lớn nhất và có khoảng chia đều."),
      item("Bước 2: vẽ các cột cùng chiều rộng, đúng độ cao và khoảng cách hợp lí.", "Ghi giá trị hoặc chú giải để người đọc kiểm tra được dữ liệu."),
    ] },
    { title: "Ví dụ mẫu · Phân tích số liệu", items: [
      item("Các cột 4, 7, 5 có tổng 16 và cột thứ hai cao nhất.", "Nhận xét phải nêu được con số làm bằng chứng."),
      item("Chênh lệch cột cao nhất và thấp nhất là 7 − 4 = 3.", "Không được lấy tổng khi câu hỏi yêu cầu độ chênh lệch."),
    ] },
    { title: "Lỗi thường gặp và tự kiểm tra", items: [
      item("Cắt trục dọc hoặc dùng khoảng chia không đều có thể làm biểu đồ gây hiểu nhầm.", "Cần đọc các mốc trên trục, không chỉ nhìn độ cao tương đối."),
      item("Một biểu đồ tốt phải trả lời được: dữ liệu gì, đơn vị gì và mỗi cột bằng bao nhiêu.", "Trước khi kết luận, kiểm tra tiêu đề, nhãn trục, thang đo và nguồn dữ liệu."),
    ] },
  ],
  concepts: [
    concept("Chiều cao của cột biểu diễn điều gì?","Giá trị hoặc tần số",["Tên biểu đồ","Màu nền","Thứ tự chữ cái"],"Chiều cao được đọc theo thang đo trên trục dọc.","Cơ bản","Nhận diện ý nghĩa hình học của cột.","Liên hệ độ cao với giá trị dữ liệu.",["Tên biểu đồ nằm ở tiêu đề, không do chiều cao cột biểu diễn.","Màu nền không quyết định giá trị.","Thứ tự chữ cái thường nằm ở nhãn nhóm, không phải chiều cao."]),
    concept("Trục ngang của biểu đồ cột thường ghi gì?","Tên các nhóm dữ liệu",["Chỉ đơn vị đo","Tổng mọi giá trị","Nguồn điện"],"Trục ngang thường chứa các nhóm hoặc loại cần so sánh.","Cơ bản","Xác định vai trò hai trục.","Tìm các nhãn phân loại nằm dưới cột.",["Đơn vị và thang số thường nằm ở trục dọc.","Tổng dữ liệu phải tính từ các cột.","Nguồn điện không phải thành phần của biểu đồ dữ liệu."]),
    concept("Các cột cao 4, 7, 5. Giá trị lớn nhất là gì?","7",["4","5","16"],"So sánh ba giá trị: 7 lớn nhất.","Cơ bản","Đọc và so sánh chiều cao cột.","Chọn giá trị của cột cao nhất.",["4 là giá trị nhỏ nhất.","5 nằm giữa 4 và 7.","16 là tổng ba cột, không phải giá trị lớn nhất."]),
    concept("Các cột có giá trị 6, 8, 10. Tổng là bao nhiêu?","24",["18","20","48"],"Cộng dữ liệu từ tất cả các cột: 6+8+10=24.","Cơ bản","Tính tổng từ biểu đồ.","Cộng đúng các giá trị được hỏi.",["18 bỏ sót hoặc cộng sai một cột.","20 chưa bao gồm đủ ba giá trị.","48 là kết quả nhân hoặc cộng lặp sai."]),
    concept("Bảng ghi A: 3, B: 6, C: 4. Cột B phải cao đến vạch nào?","6",["3","4","13"],"Chiều cao cột B đúng bằng giá trị 6 trong bảng.","Thông hiểu","Chuyển dữ liệu bảng sang biểu đồ.","Đối chiếu đúng tên nhóm trước khi vẽ cột.",["3 là giá trị của nhóm A.","4 là giá trị của nhóm C.","13 là tổng cả ba nhóm."]),
    concept("Biểu đồ có thang 0, 2, 4, 6, 8. Cột chạm giữa 6 và 8 biểu diễn giá trị nào?","7",["6","8","14"],"Điểm giữa hai vạch 6 và 8 là 7.","Thông hiểu","Đọc giá trị nằm giữa hai vạch chia.","Xác định độ lớn của một khoảng chia.",["6 là vạch phía dưới, cột còn cao hơn.","8 là vạch phía trên, cột chưa chạm tới.","14 là cộng hai mốc, không phải đọc thang đo."]),
    concept("Các cột 12 và 8 chênh lệch bao nhiêu?","4",["20","12","8"],"Độ chênh lệch là 12−8=4.","Thông hiểu","Phân biệt tổng với hiệu.","Lấy giá trị lớn trừ giá trị nhỏ.",["20 là tổng, không phải độ chênh lệch.","12 chỉ là cột lớn hơn.","8 chỉ là cột nhỏ hơn."]),
    concept("Khi vẽ biểu đồ cột, yêu cầu nào đúng?","Các cột cùng chiều rộng và dùng chung thang đo",["Mỗi cột dùng một thang đo","Không cần tên trục","Chiều rộng cột tùy ý"],"Cùng chiều rộng và chung thang đo giúp so sánh công bằng.","Thông hiểu","Đánh giá quy tắc trình bày biểu đồ.","Chọn yêu cầu giúp người đọc so sánh chính xác.",["Mỗi cột một thang đo sẽ làm so sánh sai lệch.","Thiếu tên trục khiến người đọc không biết dữ liệu và đơn vị.","Chiều rộng tùy ý có thể tạo ấn tượng sai."]),
    concept("Một biểu đồ không ghi đơn vị trên trục dọc. Vấn đề chính là gì?","Không biết các con số đo đại lượng gì",["Không thể biết màu cột","Không thể đếm số cột","Biểu đồ chắc chắn sai mọi giá trị"],"Đơn vị giúp diễn giải đúng ý nghĩa các giá trị.","Vận dụng","Phát hiện thông tin còn thiếu.","Tách lỗi trình bày khỏi dữ liệu số.",["Màu cột vẫn nhìn thấy dù thiếu đơn vị.","Vẫn có thể đếm số cột.","Dữ liệu có thể đúng nhưng biểu đồ chưa đủ thông tin."]),
    concept("Biểu đồ dùng các khoảng 0–10, 10–20, rồi 20–100 có độ dài bằng nhau. Nhận xét nào đúng?","Thang đo không đều và dễ gây hiểu nhầm",["Biểu đồ hoàn toàn chính xác","Chỉ cần đổi màu cột","Khoảng chia nào cũng có thể vẽ bằng nhau"],"Khoảng giá trị khác nhau không nên được biểu diễn bằng khoảng cách bằng nhau trên cùng trục tuyến tính.","Vận dụng","Đánh giá tính trung thực của biểu đồ.","So sánh độ lớn số học của các khoảng chia.",["Chênh lệch 10 và 80 không thể có cùng khoảng cách trên trục tuyến tính.","Đổi màu không sửa được sai lệch thang đo.","Khoảng cách trên trục phải phản ánh độ lớn giá trị."]),
    concept("Số sách đọc trong ba tháng là 5, 8, 7. Kết luận nào có căn cứ?","Tháng 2 đọc nhiều nhất, hơn tháng 1 là 3 cuốn",["Tháng 3 đọc nhiều nhất","Mỗi tháng đều tăng","Cả ba tháng đọc 15 cuốn"],"8 là lớn nhất và 8−5=3; tổng thực tế là 20.","Vận dụng","Viết nhận xét kèm số liệu.","Kiểm tra cả kết luận và bằng chứng số.",["Tháng 3 có 7, nhỏ hơn 8 của tháng 2.","Từ tháng 2 sang tháng 3 giảm từ 8 xuống 7.","5+8+7=20, không phải 15."]),
    concept("Muốn so sánh số học sinh chọn bốn câu lạc bộ, nên dùng biểu đồ nào?","Biểu đồ cột",["Tia số","Hình vẽ không có thang đo","Một phép tính"],"Bốn câu lạc bộ là các nhóm rời rạc nên biểu đồ cột phù hợp để so sánh.","Vận dụng","Chọn biểu diễn phù hợp với dữ liệu phân loại.","Xác định mục đích là so sánh các nhóm.",["Tia số biểu diễn vị trí số, không thuận tiện so sánh bốn nhóm.","Hình không có thang đo không cho biết chính xác số lượng.","Một phép tính không trình bày được cả bốn nhóm."]),
  ],
  teaching: chartTeaching,
};

export const MATH_PILOT_CONFIGS: Record<string, MathPilotConfig> = {
  "math6-s1-lesson6": lesson6,
  "math6-s2-lesson23": lesson23,
  "math6-s2-lesson40": lesson40,
};

