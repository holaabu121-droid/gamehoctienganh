export const PILOT_GAME_IDS = ["concept", "apply", "reason", "error", "mixed", "challenge"] as const;
export type PilotGameId = typeof PILOT_GAME_IDS[number];
export type PilotRoundLevel = "Cơ bản" | "Thông hiểu" | "Vận dụng" | "Thử thách";

export type PilotTask = {
  level: PilotRoundLevel;
  representation: string;
  context: string;
  prompt: string;
  taskVi: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  diagnoses: [string, string, string];
  fix: string;
  reviewCard: string;
};

export type PilotTaskBank = Record<PilotGameId, PilotTask[]>;

export const PILOT_LEVEL_SEQUENCE: PilotRoundLevel[] = [
  "Cơ bản", "Cơ bản", "Cơ bản",
  "Thông hiểu", "Thông hiểu", "Thông hiểu", "Thông hiểu",
  "Vận dụng", "Vận dụng",
  "Thử thách",
];

const REPRESENTATIONS = ["Kí hiệu", "Lời nói", "Phép tính", "Bảng", "Sơ đồ", "Dòng biến đổi", "Lời giải học sinh", "Tình huống", "Tìm ẩn", "Quyết định"];

const t = (
  index: number,
  context: string,
  prompt: string,
  answer: string,
  distractors: [string, string, string],
  explanation: string,
  diagnoses: [string, string, string],
  fix: string,
  reviewCard: string,
  taskVi = "Chọn đáp án rồi đối chiếu từng bước suy nghĩ.",
): PilotTask => ({ level: PILOT_LEVEL_SEQUENCE[index], representation: REPRESENTATIONS[index], context, prompt, taskVi, answer, distractors, explanation, diagnoses, fix, reviewCard });

const power = (base: number, exponent: number) => base ** exponent;
const repeated = (base: number, exponent: number) => Array.from({ length: exponent }, () => `${base}`).join(" · ");

function exponentBank(): PilotTaskBank {
  const conceptData = [[2, 4], [3, 3], [5, 2], [4, 3], [10, 5], [6, 2], [2, 6], [7, 2], [3, 4], [5, 3]] as const;
  const concept = conceptData.map(([base, exponent], index) => {
    const value = power(base, exponent);
    if (index % 3 === 0) return t(index, `Biểu thức ${base}^${exponent}.`, `Cơ số và số mũ lần lượt là gì?`, `${base} và ${exponent}`, [`${exponent} và ${base}`, `${base * exponent} và ${exponent}`, `${value} và ${base}`], `Trong a^n, a là cơ số và n là số mũ.`, ["Em đã đổi chỗ cơ số với số mũ.", "Em đã biến kí hiệu lũy thừa thành phép nhân.", "Em đã nhầm giá trị lũy thừa với thành phần của kí hiệu."], `Đọc từ số lớn ${base}, rồi đọc số nhỏ ${exponent}.`, "Cơ số và số mũ");
    if (index % 3 === 1) return t(index, `Tích ${repeated(base, exponent)}.`, `Viết tích dưới dạng lũy thừa.`, `${base}^${exponent}`, [base === exponent ? `${base}^${exponent + 1}` : `${exponent}^${base}`, `${base * exponent}`, `${base}^${exponent - 1}`], `Có ${exponent} thừa số đều bằng ${base}, nên viết ${base}^${exponent}.`, ["Em đã đổi hoặc tăng nhầm số lần lặp.", "Em đang cộng hoặc nhân cơ số với số lần lặp.", "Em đếm thiếu một thừa số."], `Khoanh cơ số ${base}, sau đó đếm đủ ${exponent} lần xuất hiện.`, "Phép nhân lặp");
    return t(index, `Thẻ giá trị ${base}^${exponent}.`, `Giá trị của lũy thừa là bao nhiêu?`, `${value}`, [`${base * exponent}`, `${power(base, Math.max(1, exponent - 1))}`, `${value + base}`], `${base}^${exponent} = ${repeated(base, exponent)} = ${value}.`, ["Em đã tính base × exponent thay vì nhân lặp.", "Em đang thiếu một thừa số bằng cơ số.", "Em đã cộng thêm cơ số sau khi tính đúng."], `Viết phép nhân lặp rồi tính từ trái sang phải.`, "Đọc và tính lũy thừa");
  });

  const apply = Array.from({ length: 10 }, (_, index) => {
    const base = [2, 3, 5, 4, 7, 2, 3, 6, 5, 2][index];
    const first = [2, 3, 4, 5, 3, 7, 6, 5, 8, 9][index];
    const second = [3, 2, 2, 3, 4, 4, 2, 3, 5, 6][index];
    const multiply = index < 5;
    const resultExponent = multiply ? first + second : first - second;
    const answer = resultExponent === 0 ? "1" : `${base}^${resultExponent}`;
    const symbol = multiply ? "·" : ":";
    return t(index, `Dòng biến đổi ${base}^${first} ${symbol} ${base}^${second}.`, `Kết quả viết gọn là gì?`, answer, [`${base}^${first * second}`, `${base * base}^${resultExponent}`, multiply ? `${base}^${Math.abs(first - second)}` : `${base}^${first + second}`], multiply ? `Cùng cơ số và đang nhân nên cộng số mũ: ${first}+${second}=${resultExponent}.` : `Cùng cơ số và đang chia nên trừ số mũ: ${first}−${second}=${resultExponent}.`, [multiply ? "Em đã nhân hai số mũ thay vì cộng." : "Em đã nhân hai số mũ thay vì trừ.", "Em đã thay đổi cơ số; quy tắc yêu cầu giữ nguyên cơ số.", multiply ? "Em đã dùng quy tắc chia cho một phép nhân." : "Em đã dùng quy tắc nhân cho một phép chia."], `Giữ cơ số ${base}; chỉ xử lí ${first} ${multiply ? "+" : "−"} ${second}.`, multiply ? "Nhân hai lũy thừa cùng cơ số" : "Chia hai lũy thừa cùng cơ số");
  });

  const reason = Array.from({ length: 10 }, (_, index) => {
    const base = [2, 3, 4, 5, 6, 7, 8, 9, 10, 2][index];
    const m = [3, 2, 4, 5, 3, 4, 2, 3, 6, 8][index];
    const n = [2, 4, 3, 2, 5, 2, 5, 4, 2, 3][index];
    const multiply = index % 2 === 0;
    const result = multiply ? m + n : Math.max(m, n) - Math.min(m, n);
    const expression = multiply ? `${base}^${m} · ${base}^${n}` : `${base}^${Math.max(m, n)} : ${base}^${Math.min(m, n)}`;
    const answer = multiply ? `Ghép hai tích lặp nên có ${m + n} thừa số ${base}.` : `Khử ${Math.min(m, n)} thừa số chung nên còn ${result} thừa số ${base}.`;
    return t(index, `Minh chứng cho ${expression}.`, `Lí do nào giải thích đúng quy tắc số mũ?`, answer, [`Vì luôn nhân hai số mũ ${m} và ${n}.`, `Vì phải đổi cơ số thành ${base * 2}.`, `Vì chỉ cần chọn số mũ lớn hơn.`], multiply ? `Khai triển hai lũy thừa tạo tổng cộng ${m + n} thừa số ${base}.` : `Phép chia khử các thừa số ${base} giống nhau ở tử và mẫu.`, ["Nhân số mũ không mô tả được số thừa số sau khi ghép tích.", "Cơ số biểu diễn thừa số lặp nên không được tự ý thay đổi.", "Chọn số lớn hơn không phải một phép biến đổi toán học."], `Khai triển một ví dụ nhỏ và đếm số thừa số còn lại.`, "Vì sao cộng hoặc trừ số mũ");
  });

  const error = Array.from({ length: 10 }, (_, index) => {
    const base = [2, 3, 4, 5, 6, 7, 2, 3, 5, 10][index];
    const exponent = [3, 4, 2, 3, 2, 2, 5, 3, 4, 3][index];
    const correct = power(base, exponent);
    const wrong = index % 2 === 0 ? base * exponent : power(base, exponent - 1);
    return t(index, `Bạn Minh viết ${base}^${exponent} = ${wrong}.`, `Cách sửa nào chỉ đúng bước sai đầu tiên?`, `Viết ${repeated(base, exponent)} = ${correct}`, [`Giữ ${wrong}`, `Đổi thành ${exponent}^${base}`, `Viết ${base} + ${exponent} = ${base + exponent}`], `${base}^${exponent} cần đúng ${exponent} thừa số ${base}.`, ["Giữ kết quả cũ nghĩa là chưa sửa lỗi hiểu số mũ.", "Đổi chỗ cơ số và số mũ tạo một lũy thừa khác.", "Phép cộng không thay thế được phép nhân lặp."], `Quay lại định nghĩa, viết đủ tích rồi mới tính.`, "Lỗi nhầm lũy thừa với phép tính khác");
  });

  const mixed = Array.from({ length: 10 }, (_, index) => {
    const base = [2, 3, 5, 4, 6, 2, 7, 3, 5, 2][index];
    const m = [2, 3, 2, 4, 3, 5, 2, 4, 3, 6][index];
    const n = [3, 2, 4, 2, 2, 3, 3, 2, 4, 2][index];
    const exponent = m + n;
    const value = power(base, Math.min(exponent, 5));
    const answer = exponent <= 5 ? `${base}^${exponent} = ${value}` : `${base}^${exponent}`;
    return t(index, `Phiếu hai bước: ${base}^${m} · ${base}^${n}.`, `Chọn dòng vừa rút gọn đúng vừa tính đúng khi số mũ không quá 5.`, answer, [`${base}^${m * n}`, `${base * base}^${exponent}`, `${base}^${Math.abs(m - n)}`], `Bước 1 giữ cơ số và cộng số mũ; bước 2 mới tính giá trị nếu thuận tiện.`, ["Em đã nhân số mũ ở bước rút gọn.", "Em đã đổi cơ số trước khi tính.", "Em đã dùng quy tắc của phép chia."], `Tách bài làm thành hai dòng: rút gọn rồi tính.`, "Quy trình hai bước");
  });

  const scenarios = ["mã khóa", "cây phân nhánh", "ô bàn cờ", "vi khuẩn nhân đôi", "hình vuông", "khối lập phương", "tệp dữ liệu", "mạng lựa chọn", "đèn nhấp nháy", "gói quà"];
  const challenge = Array.from({ length: 10 }, (_, index) => {
    const choices = [2, 3, 4, 2, 3, 2, 5, 4, 2, 3][index];
    const positions = [5, 4, 3, 6, 4, 7, 3, 4, 8, 5][index];
    const answer = `${choices}^${positions}`;
    return t(index, `Tình huống ${scenarios[index]}: có ${choices} lựa chọn độc lập ở mỗi bước và ${positions} bước.`, `Biểu thức nào đếm đúng số khả năng?`, answer, [`${choices * positions}`, choices === positions ? `${positions + 1}^${choices}` : `${positions}^${choices}`, `${choices}+${positions}`], `Quy tắc nhân tạo ${choices} · … · ${choices} gồm ${positions} thừa số, tức ${answer}.`, ["Em đã cộng số lựa chọn thay vì dùng quy tắc nhân.", "Em đã đổi hoặc thay đổi vai trò số lựa chọn và số bước.", "Phép cộng không mô tả các lựa chọn độc lập liên tiếp."], `Viết một thừa số ${choices} cho mỗi bước rồi viết gọn.`, "Mô hình hóa bằng lũy thừa");
  });
  return { concept, apply, reason, error, mixed, challenge };
}

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

function fractionBank(): PilotTaskBank {
  const pairs = [[2, 3], [-3, 5], [4, 7], [-5, 8], [6, 9], [7, 10], [-8, 12], [9, 15], [10, 14], [-12, 18]] as const;
  const concept = pairs.map(([numerator, denominator], index) => {
    if (index % 3 === 0) return t(index, `Phân số ${numerator}/${denominator}.`, `Tử số và mẫu số lần lượt là gì?`, `${numerator} và ${denominator}`, [`${denominator} và ${numerator}`, `${Math.abs(numerator)} và ${-denominator}`, `${numerator + denominator} và 1`], `Tử nằm trên dấu gạch, mẫu nằm dưới và mẫu phải khác 0.`, ["Em đã đổi chỗ tử và mẫu.", "Em đã tự ý chuyển dấu sang mẫu.", "Em đã tính tổng thay vì đọc cấu tạo phân số."], `Đọc thành phần trên trước, thành phần dưới sau.`, "Tử số, mẫu số và điều kiện mẫu");
    if (index % 3 === 1) return t(index, `Bốn cách viết: ${numerator}/${denominator}; ${numerator},5/${denominator}; ${numerator}/0; ${numerator * 2}/${denominator * 2}.`, `Cách nào chắc chắn là phân số hợp lệ và bằng phân số đầu?`, `${numerator * 2}/${denominator * 2}`, [`${numerator},5/${denominator}`, `${numerator}/0`, `${denominator}/${numerator}`], `Nhân cả tử và mẫu với 2 giữ nguyên giá trị và mẫu vẫn khác 0.`, ["Tử thập phân không phù hợp định nghĩa phân số đang học.", "Mẫu 0 làm phép chia không xác định.", "Đảo tử và mẫu tạo phân số nghịch đảo."], `Kiểm tra số nguyên, mẫu khác 0, rồi kiểm tra cùng hệ số.`, "Phân số hợp lệ và phân số bằng nhau");
    const divisor = gcd(numerator, denominator);
    return t(index, `Thẻ rút gọn ${numerator}/${denominator}.`, `Dạng tối giản là gì?`, `${numerator / divisor}/${denominator / divisor}`, [`${numerator}/${denominator + 1}`, `${-(numerator / divisor)}/${denominator / divisor}`, `${denominator / divisor}/${numerator / divisor}`], `Chia cả tử và mẫu cho UCLN ${divisor}.`, ["Em đã thay đổi riêng mẫu nên phân số không còn bằng số ban đầu.", "Em đã đổi dấu của phân số.", "Em đã đảo tử và mẫu."], `Tìm UCLN rồi chia đồng thời cả hai thành phần.`, "Rút gọn đến tối giản");
  });

  const apply = pairs.map(([numerator, denominator], index) => {
    const factor = [2, 3, 4, 2, 5, 3, 2, 4, 3, 5][index];
    const answer = `${numerator * factor}/${denominator * factor}`;
    return t(index, `Máy phóng đại phân số ${numerator}/${denominator} theo hệ số ${factor}.`, `Phân số bằng nó sau khi mở rộng là gì?`, answer, [`${numerator * factor}/${denominator}`, `${numerator}/${denominator * factor}`, `${numerator + factor}/${denominator + factor}`], `Nhân cả tử và mẫu với cùng ${factor}: ${answer}.`, ["Em mới nhân tử, nên giá trị đã thay đổi.", "Em mới nhân mẫu, nên giá trị đã thay đổi.", "Cộng cùng một số không phải quy tắc tạo phân số bằng nhau."], `Đặt hai phép nhân ×${factor} cạnh tử và mẫu trước khi tính.`, "Tạo phân số bằng nhau");
  });

  const reason = pairs.map(([numerator, denominator], index) => {
    const factor = [2, 3, 4, 5, 2, 3, 4, 2, 3, 5][index];
    const otherN = numerator * factor, otherD = denominator * factor;
    const answer = `${numerator}·${otherD} = ${denominator}·${otherN}`;
    return t(index, `So sánh ${numerator}/${denominator} và ${otherN}/${otherD}.`, `Dòng nào là căn cứ tích chéo đúng?`, answer, [`${numerator}+${otherD} = ${denominator}+${otherN}`, `${numerator}·${otherN} = ${denominator}·${otherD}`, `${numerator}/${otherN} = ${otherD}/${denominator}`], `Hai tích chéo cùng bằng ${numerator * otherD}, nên hai phân số bằng nhau.`, ["Cộng chéo không phải tiêu chuẩn bằng nhau.", "Em đang nhân theo hàng, không phải nhân chéo.", "Tỉ số mới không kiểm tra trực tiếp hai phân số đã cho."], `Nối tử trái với mẫu phải và mẫu trái với tử phải.`, "Kiểm tra bằng tích chéo");
  });

  const error = pairs.map(([numerator, denominator], index) => {
    const factor = [2, 3, 2, 4, 3, 2, 5, 3, 2, 4][index];
    const wrong = `${numerator * factor}/${denominator}`;
    const correct = `${numerator * factor}/${denominator * factor}`;
    return t(index, `Bạn Lan biến đổi ${numerator}/${denominator} thành ${wrong}.`, `Cách sửa nào giữ nguyên giá trị phân số?`, `Sửa mẫu thành ${denominator * factor}, được ${correct}`, [`Giữ nguyên ${wrong}`, `Đổi tử về ${numerator + factor}`, `Đảo thành ${denominator}/${numerator}`], `Tử đã nhân ${factor} thì mẫu cũng phải nhân ${factor}.`, ["Chỉ nhân tử làm phân số đổi giá trị.", "Cộng vào tử không khôi phục phép biến đổi tương đương.", "Đảo phân số tạo số nghịch đảo."], `Ghi cùng một phép toán ở cả tử và mẫu.`, "Lỗi biến đổi một phía");
  });

  const mixed = pairs.map(([numerator, denominator], index) => {
    const divisor = gcd(numerator, denominator);
    const simple = `${numerator / divisor}/${denominator / divisor}`;
    const factor = [2, 3, 4, 2, 3, 5, 2, 4, 3, 2][index];
    const expanded = `${(numerator / divisor) * factor}/${(denominator / divisor) * factor}`;
    return t(index, `Phiếu hai chiều với ${numerator}/${denominator}.`, `Chọn cặp “rút gọn → mở rộng” đúng.`, `${simple} → ${expanded}`, [`${numerator / divisor}/${denominator + divisor} → ${expanded}`, `${simple} → ${(numerator / divisor) * factor}/${denominator / divisor}`, `${denominator / divisor}/${numerator / divisor} → ${expanded}`], `Rút gọn bằng UCLN ${divisor}, rồi nhân cả tử và mẫu với ${factor}.`, ["Bước rút gọn đã thay đổi riêng mẫu.", "Bước mở rộng mới tác động lên tử.", "Bước đầu đã đảo tử và mẫu."], `Kiểm tra mỗi mũi tên có cùng phép toán trên tử và mẫu.`, "Chuỗi phân số bằng nhau");
  });

  const contexts = ["công thức nước ép", "quãng đường đi bộ", "dải ruy băng", "phần lớp trực nhật", "bình sơn", "mảnh vườn", "thời gian đọc sách", "thùng gạo", "bản đồ", "khẩu phần bánh"];
  const challenge = pairs.map(([numerator, denominator], index) => {
    const divisor = gcd(numerator, denominator);
    const simple = `${numerator / divisor}/${denominator / divisor}`;
    return t(index, `Trong ${contexts[index]}, số đo được ghi là ${numerator}/${denominator} đơn vị.`, `Cách ghi nào gọn nhất mà không đổi lượng?`, `${simple} đơn vị`, [`${-(numerator / divisor)}/${denominator / divisor} đơn vị`, `${denominator / divisor}/${numerator / divisor} đơn vị`, `${numerator}/${denominator + 1} đơn vị`], `Giữ nguyên dấu và đơn vị, chia tử mẫu cho UCLN ${divisor}.`, ["Em đã đổi dấu nên đổi hướng hoặc ý nghĩa đại lượng.", "Em đã lấy nghịch đảo nên đổi lượng.", "Em chỉ thay mẫu nên đổi giá trị."], `Tách đơn vị ra, rút gọn phân số, rồi gắn lại đơn vị.`, "Phân số trong tình huống thực tế");
  });
  return { concept, apply, reason, error, mixed, challenge };
}

function chartBank(): PilotTaskBank {
  const data = [[4, 7, 5], [6, 3, 8], [10, 12, 9], [5, 11, 7], [8, 6, 4], [3, 9, 12], [14, 10, 6], [7, 13, 9], [16, 12, 18], [9, 15, 12]] as const;
  const labels = ["Tháng", "Tổ", "Loại sách", "Ngày", "Câu lạc bộ", "Môn thể thao", "Khối lớp", "Sản phẩm", "Điểm khảo sát", "Khu vực"];
  const concept = data.map((values, index) => {
    const numericValues = [...values] as number[];
    const max = Math.max(...numericValues), maxIndex = numericValues.indexOf(max);
    const answer = `${["A", "B", "C"][maxIndex]}: ${max}`;
    const otherColumns = (["A", "B", "C"] as const).map((label, column) => `${label}: ${values[column]}`).filter(item => item !== answer);
    return t(index, `Bảng ${labels[index]} A–B–C có số liệu ${values.join(" – ")}.`, `Cột nào cao nhất và biểu diễn giá trị bao nhiêu?`, answer, [otherColumns[0], otherColumns[1], `Tổng: ${values.reduce((a, b) => a + b, 0)}`], `Chiều cao cột được đọc trên trục dọc; ${max} là giá trị lớn nhất.`, ["Em đã chọn một cột thấp hơn mà chưa so sánh đủ ba giá trị.", "Em đã ghép nhãn cột với một giá trị không lớn nhất.", "Em đang dùng tổng của các cột thay cho giá trị một cột."], `Đọc từng cột, ghi ba số rồi mới tìm số lớn nhất.`, "Cấu tạo và cách đọc biểu đồ");
  });

  const apply = data.map((values, index) => {
    const sum = values.reduce((a, b) => a + b, 0);
    return t(index, `Ba cột ${labels[index]} có giá trị ${values.join(", ")}.`, `Tổng dữ liệu của ba cột là bao nhiêu?`, `${sum}`, [`${Math.max(...values)}`, `${Math.max(...values) - Math.min(...values)}`, `${sum - values[1]}`], `Cộng đủ ba giá trị: ${values.join(" + ")} = ${sum}.`, ["Em mới lấy giá trị lớn nhất, chưa tính tổng.", "Em đang tính độ chênh lệch thay vì tổng.", "Em đã bỏ sót cột ở giữa."], `Đánh dấu mỗi cột sau khi cộng để không bỏ sót.`, "Tính toán từ biểu đồ");
  });

  const reason = data.map((values, index) => {
    const max = Math.max(...values), min = Math.min(...values);
    const answer = `Cột cao nhất hơn cột thấp nhất ${max - min} đơn vị`;
    return t(index, `Biểu đồ ${labels[index]} cho ba giá trị ${values.join(" – ")}.`, `Nhận xét nào có số liệu làm bằng chứng?`, answer, [`Cột cao nhất đẹp hơn vì có màu nổi.`, `Ba cột chắc chắn tăng đều.`, `Tổng bằng ${max - min}.`], `Độ chênh lệch là ${max} − ${min} = ${max - min}.`, ["Màu sắc không phải bằng chứng định lượng.", "Dãy số không tăng đều nên kết luận không đúng.", "Em đã gọi hiệu là tổng."], `Viết kết luận kèm phép tính hoặc số liệu kiểm chứng.`, "Nhận xét có bằng chứng");
  });

  const error = data.map((values, index) => {
    const scale = index % 2 === 0 ? 2 : 5;
    const value = values[index % 3];
    const wrong = value * scale;
    return t(index, `Trục dọc chia mỗi vạch ${scale} đơn vị; cột chạm vạch ghi ${value}. Bạn Nam đọc là ${wrong}.`, `Nam sai ở đâu?`, `Đã nhân thêm ${scale} dù nhãn vạch đã là giá trị thật`, [`Nam hoàn toàn đúng`, `Cần cộng ${scale} vào ${wrong}`, `Cần đổi màu cột`], `Nếu vạch đã được ghi ${value}, chiều cao cột chính là ${value}; chỉ nhân khi vạch ghi số thứ tự khoảng.`, ["Giữ đáp án cũ là bỏ qua ý nghĩa nhãn trục.", "Cộng thêm một khoảng tiếp tục làm sai giá trị.", "Màu cột không sửa được lỗi đọc thang đo."], `Phân biệt “mỗi khoảng bằng bao nhiêu” với “nhãn tại vạch là bao nhiêu”.`, "Đọc thang đo và phát hiện biểu đồ sai");
  });

  const mixed = data.map((values, index) => {
    const sum = values.reduce((a, b) => a + b, 0), diff = Math.max(...values) - Math.min(...values);
    return t(index, `Phiếu phân tích ${labels[index]}: ${values.join(" | ")}.`, `Chọn cặp “tổng – chênh lệch lớn nhất” đúng.`, `${sum} – ${diff}`, [`${sum} – ${Math.max(...values)}`, `${diff} – ${sum}`, `${sum - values[0]} – ${diff}`], `Tổng là ${sum}; chênh lệch là ${Math.max(...values)}−${Math.min(...values)}=${diff}.`, ["Vế hai đang dùng giá trị lớn nhất thay cho độ chênh lệch.", "Em đã đảo thứ tự hai yêu cầu.", "Vế một bỏ sót cột đầu."], `Tính riêng tổng và hiệu, ghi nhãn rồi mới ghép.`, "Phân tích hai đại lượng");
  });

  const decisions = ["chọn tháng trồng thêm cây", "chọn tổ cần hỗ trợ", "bổ sung loại sách ít nhất", "chọn ngày bán cao nhất", "mở rộng câu lạc bộ đông nhất", "bổ sung dụng cụ", "phân bổ phòng học", "đặt hàng sản phẩm", "điều chỉnh khảo sát", "ưu tiên khu vực"];
  const challenge = data.map((values, index) => {
    const numericValues = [...values] as number[];
    const min = Math.min(...numericValues), minIndex = numericValues.indexOf(min), label = ["A", "B", "C"][minIndex];
    const otherLabels = (["A", "B", "C"] as const).filter(item => item !== label);
    return t(index, `Nhà trường cần ${decisions[index]}. Dữ liệu A–B–C là ${values.join(" – ")}.`, `Nếu ưu tiên nhóm có giá trị thấp nhất, quyết định nào đúng?`, `Chọn ${label} vì có ${min}`, [`Chọn ${otherLabels[0]} vì đứng trước`, `Chọn ${otherLabels[1]} vì đứng sau`, `Chọn cả ba vì không cần đọc số liệu`], `${min} là giá trị nhỏ nhất nên nhóm ${label} phù hợp tiêu chí.`, ["Thứ tự hiển thị không quyết định mức ưu tiên.", "Vị trí trong bảng không thay thế việc so sánh số liệu.", "Chọn tất cả không đáp ứng yêu cầu ưu tiên một nhóm."], `Nêu tiêu chí, tìm giá trị phù hợp, rồi gắn lại đúng nhãn nhóm.`, "Ra quyết định từ dữ liệu");
  });
  return { concept, apply, reason, error, mixed, challenge };
}

export const MATH_PILOT_TASK_BANKS: Record<string, PilotTaskBank> = {
  "math6-s1-lesson6": exponentBank(),
  "math6-s2-lesson23": fractionBank(),
  "math6-s2-lesson40": chartBank(),
};
