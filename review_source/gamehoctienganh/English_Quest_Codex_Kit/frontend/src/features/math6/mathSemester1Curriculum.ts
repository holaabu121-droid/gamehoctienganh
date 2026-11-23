import type { StructuredMathLessonBuilt } from "./structuredMathLessonEngine";
import { MATH_PILOT_CONFIGS, type MathPilotConcept, type MathPilotConfig } from "./mathPilotDepth.ts";
import { MATH_PILOT_TASK_BANKS, PILOT_GAME_IDS } from "./mathPilotTaskBanks.ts";
import { buildMathDeepHelp, deepenMathRounds, expandMathFoundations } from "./mathCurriculumDepth.ts";

export type MathConcept = { question: string; answer: string; distractors: [string, string, string]; explanation: string };
export type MathSemesterBranchSpec = {
  id: string; sequence: number; label: string; badge: string; title: string; chapter: string; pages: string;
  lead: string; concepts: [MathConcept, MathConcept, MathConcept, MathConcept];
};

const c = (question: string, answer: string, distractors: [string, string, string], explanation: string): MathConcept => ({ question, answer, distractors, explanation });
const b = (id: string, sequence: number, label: string, badge: string, title: string, chapter: string, pages: string, lead: string, concepts: MathSemesterBranchSpec["concepts"]): MathSemesterBranchSpec => ({ id, sequence, label, badge, title, chapter, pages, lead, concepts });

export const MATH_SEMESTER_1_GENERATED_BRANCHES: MathSemesterBranchSpec[] = [
  b("math6-s1-lesson6",7,"Bài 6","6","Lũy thừa với số mũ tự nhiên","Chương I · Tập hợp các số tự nhiên","trang 22–24","Viết tích các thừa số bằng nhau dưới dạng lũy thừa và vận dụng quy tắc nhân, chia lũy thừa cùng cơ số.",[
    c("2⁵ bằng bao nhiêu?","32",["10","16","25"],"2⁵ = 2·2·2·2·2 = 32."), c("3²·3⁴ viết gọn là gì?","3⁶",["3⁸","9⁶","3²"],"Nhân hai lũy thừa cùng cơ số thì cộng số mũ."), c("5⁷:5³ bằng gì?","5⁴",["5¹⁰","5³","1"],"Chia hai lũy thừa cùng cơ số khác 0 thì trừ số mũ."), c("Số nào bằng 10⁴?","10 000",["1 000","40","100 000"],"10⁴ là 1 với bốn chữ số 0.")]),
  b("math6-s1-lesson7",8,"Bài 7","7","Thứ tự thực hiện các phép tính","Chương I · Tập hợp các số tự nhiên","trang 25–26","Thực hiện đúng ngoặc, lũy thừa, nhân chia rồi cộng trừ.",[
    c("18 + 2·5 bằng bao nhiêu?","28",["100","20","38"],"Nhân trước: 2·5 = 10, rồi cộng 18."), c("(18 + 2)·5 bằng bao nhiêu?","100",["28","90","25"],"Thực hiện trong ngoặc trước."), c("2³ + 4·3 bằng bao nhiêu?","20",["36","24","18"],"Lũy thừa trước, rồi nhân, cuối cùng cộng."), c("60:[3·(7−3)] bằng bao nhiêu?","5",["20","12","4"],"Ngoặc trong trước: 7−3=4, 3·4=12, 60:12=5.")]),
  b("math6-s1-chapter1-practice2",9,"Luyện tập chung","LT","Lũy thừa và thứ tự tính","Chương I · Tập hợp các số tự nhiên","trang 27","Củng cố lũy thừa và biểu thức có nhiều phép tính.",[
    c("4³ bằng bao nhiêu?","64",["12","16","81"],"4³ = 4·4·4 = 64."), c("2⁶:2² bằng gì?","2⁴",["2³","2⁸","1"],"Giữ cơ số và trừ số mũ."), c("5 + 3²·2 bằng bao nhiêu?","23",["64","28","16"],"Tính 3², rồi nhân 2, cuối cùng cộng 5."), c("48:{2·[3+1]} bằng bao nhiêu?","6",["8","12","24"],"Tính ngoặc vuông, nhân rồi chia.")]),
  b("math6-s1-lesson8",11,"Bài 8","8","Quan hệ chia hết và tính chất","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 29–33","Nhận biết quan hệ chia hết và dùng tính chất của tổng, hiệu.",[
    c("Kí hiệu đúng cho 24 chia hết cho 6 là gì?","6 | 24",["24 | 6","6 ∤ 24","24 ∤ 6"],"6 là ước của 24 nên viết 6 | 24."), c("Nếu a và b đều chia hết cho 5 thì a+b thế nào?","Chia hết cho 5",["Không chia hết cho 5","Luôn bằng 5","Luôn là số lẻ"],"Tổng các số cùng chia hết cho 5 cũng chia hết cho 5."), c("35 + 20 có chia hết cho 5 không?","Có",["Không","Chỉ khi trừ 5","Không xác định"],"Cả 35 và 20 đều chia hết cho 5."), c("42 − 18 có chia hết cho 6 không?","Có",["Không","Chỉ chia hết cho 3","Chỉ chia hết cho 2"],"42 và 18 cùng chia hết cho 6 nên hiệu cũng chia hết cho 6.")]),
  b("math6-s1-lesson9",12,"Bài 9","9","Dấu hiệu chia hết","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 34–37","Dùng chữ số tận cùng và tổng chữ số để xét chia hết cho 2, 3, 5, 9.",[
    c("Số nào chia hết cho 2?","246",["135","357","451"],"Số tận cùng là chữ số chẵn."), c("Số nào chia hết cho 5?","1 235",["1 232","1 237","1 239"],"Số tận cùng là 0 hoặc 5."), c("372 có chia hết cho 3 không?","Có",["Không","Chỉ chia hết cho 2","Chỉ chia hết cho 5"],"3+7+2=12 chia hết cho 3."), c("729 có chia hết cho 9 không?","Có",["Không","Chỉ chia hết cho 3","Chỉ chia hết cho 2"],"7+2+9=18 chia hết cho 9.")]),
  b("math6-s1-lesson10",13,"Bài 10","10","Số nguyên tố","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 38–42","Phân biệt số nguyên tố, hợp số và phân tích ra thừa số nguyên tố.",[
    c("Số nào là số nguyên tố?","13",["1","15","21"],"13 chỉ có hai ước là 1 và 13."), c("Số 1 thuộc loại nào?","Không là số nguyên tố cũng không là hợp số",["Số nguyên tố","Hợp số","Số chẵn nguyên tố"],"Số 1 chỉ có một ước."), c("Phân tích 60 ra thừa số nguyên tố là gì?","2²·3·5",["2·30","3·20","2³·5"],"60 = 2·2·3·5."), c("Số nguyên tố chẵn duy nhất là gì?","2",["0","4","6"],"Mọi số chẵn lớn hơn 2 đều có ít nhất ba ước.")]),
  b("math6-s1-chapter2-practice1",14,"Luyện tập chung","LT","Chia hết và số nguyên tố","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 43","Kết hợp dấu hiệu chia hết và phân tích thừa số nguyên tố.",[
    c("Số 4 590 chia hết đồng thời cho số nào?","2; 3; 5; 9",["Chỉ 2 và 5","Chỉ 3 và 9","Chỉ 5 và 9"],"Tận cùng 0 và tổng chữ số bằng 18."), c("84 phân tích ra thừa số nguyên tố là gì?","2²·3·7",["2·42","4·21","2³·3"],"84 = 2·2·3·7."), c("Số nào là hợp số?","49",["17","19","23"],"49 = 7² nên có nhiều hơn hai ước."), c("Nếu 12 | a và 12 | b thì 12 có chia hết a+b không?","Có",["Không","Chỉ khi a=b","Chỉ khi tổng lẻ"],"Tổng bảo toàn tính chia hết.")]),
  b("math6-s1-lesson11",15,"Bài 11","11","Ước chung. Ước chung lớn nhất","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 44–48","Tìm ước chung, UCLN và vận dụng chia nhóm lớn nhất.",[
    c("UCLN(18, 24) bằng bao nhiêu?","6",["2","3","12"],"Ước chung lớn nhất của 18 và 24 là 6."), c("Hai số 8 và 15 có quan hệ gì?","Nguyên tố cùng nhau",["Cùng là số nguyên tố","Có UCLN bằng 2","Có UCLN bằng 4"],"UCLN(8,15)=1."), c("UCLN(2³·3, 2²·3²) là gì?","2²·3",["2³·3²","2·3","2⁵·3³"],"Chọn thừa số chung với số mũ nhỏ nhất."), c("Chia 24 bút và 36 vở thành nhiều phần quà giống nhau nhất được bao nhiêu phần?","12",["6","18","24"],"Số phần lớn nhất là UCLN(24,36)=12.")]),
  b("math6-s1-lesson12",16,"Bài 12","12","Bội chung. Bội chung nhỏ nhất","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 49–53","Tìm bội chung, BCNN và vận dụng các chu kì lặp lại.",[
    c("BCNN(6, 8) bằng bao nhiêu?","24",["12","48","2"],"24 là bội chung dương nhỏ nhất."), c("BCNN(2³·3, 2·3²) là gì?","2³·3²",["2·3","2³·3","2⁴·3³"],"Chọn mọi thừa số với số mũ lớn nhất."), c("Hai đèn chớp mỗi 4 giây và 6 giây. Sau bao lâu cùng chớp lại?","12 giây",["10 giây","24 giây","2 giây"],"Tìm BCNN(4,6)=12."), c("Nếu a chia hết cho b thì BCNN(a,b) bằng gì?","a",["b","1","a+b"],"a đã là bội của cả a và b và là bội chung nhỏ nhất.")]),
  b("math6-s1-chapter2-practice2",17,"Luyện tập chung","LT","UCLN và BCNN","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 54–55","Chọn đúng UCLN hoặc BCNN trong bài toán thực tế.",[
    c("UCLN(36, 48) bằng bao nhiêu?","12",["6","24","144"],"Các ước chung lớn nhất là 12."), c("BCNN(15, 20) bằng bao nhiêu?","60",["5","30","300"],"60 là bội chung dương nhỏ nhất."), c("Chia đều 30 cam và 45 táo thành nhiều đĩa giống nhau nhất dùng phép gì?","UCLN",["BCNN","Phép cộng","Phép trừ"],"Số đĩa phải là ước chung lớn nhất."), c("Hai lịch lặp sau 8 và 12 ngày gặp lại dùng phép gì?","BCNN",["UCLN","Phép chia có dư","Phép trừ"],"Thời điểm chung là bội chung nhỏ nhất.")]),
  b("math6-s1-chapter2-review",18,"Bài tập cuối chương II","ÔN","Ôn tập tính chia hết","Chương II · Tính chia hết trong tập hợp các số tự nhiên","trang 56","Tổng hợp dấu hiệu chia hết, số nguyên tố, UCLN và BCNN.",[
    c("630 chia hết cho cả 2, 3, 5 và 9 không?","Có",["Không","Chỉ 2 và 5","Chỉ 3 và 9"],"Tận cùng 0, tổng chữ số 9."), c("Phân tích 180 ra thừa số nguyên tố là gì?","2²·3²·5",["2·90","2³·3·5","18·10"],"180 = 4·9·5."), c("UCLN(45, 60) bằng bao nhiêu?","15",["5","30","180"],"15 là ước chung lớn nhất."), c("BCNN(9, 12) bằng bao nhiêu?","36",["3","18","108"],"36 là bội chung dương nhỏ nhất.")]),

  b("math6-s1-lesson13",19,"Bài 13","13","Tập hợp các số nguyên","Chương III · Số nguyên","trang 57–61","Nhận biết số âm, số đối, trục số và so sánh số nguyên.",[
    c("Số đối của −7 là gì?","7",["−7","0","14"],"Hai số đối nhau có tổng bằng 0."), c("Số nào nhỏ hơn trên trục số?","−5",["−2","0","3"],"Trên trục số, số nằm bên trái nhỏ hơn."), c("Giá trị tuyệt đối của −9 là gì?","9",["−9","0","18"],"Khoảng cách từ −9 đến 0 là 9."), c("Nhiệt độ 5 độ dưới 0 viết thế nào?","−5 °C",["5 °C","0 °C","−10 °C"],"Dưới mốc 0 được biểu diễn bằng số âm.")]),
  b("math6-s1-lesson14",20,"Bài 14","14","Phép cộng và phép trừ số nguyên","Chương III · Số nguyên","trang 62–66","Cộng hai số nguyên cùng dấu, khác dấu và chuyển phép trừ thành cộng số đối.",[
    c("(−5)+(−3) bằng bao nhiêu?","−8",["8","−2","2"],"Cùng dấu âm: cộng giá trị tuyệt đối và giữ dấu âm."), c("(−7)+12 bằng bao nhiêu?","5",["−19","19","−5"],"Khác dấu: lấy 12−7 và giữ dấu của 12."), c("8−(−4) bằng bao nhiêu?","12",["4","−12","−4"],"Trừ số âm là cộng số đối dương."), c("−6−9 bằng bao nhiêu?","−15",["3","15","−3"],"−6−9 = −6+(−9).")]),
  b("math6-s1-lesson15",21,"Bài 15","15","Quy tắc dấu ngoặc","Chương III · Số nguyên","trang 67–68","Bỏ dấu ngoặc đúng quy tắc và nhóm số hạng hợp lí.",[
    c("Bỏ ngoặc: 8+(−3+5) được gì?","8−3+5",["8+3−5","8−3−5","8+3+5"],"Trước ngoặc là dấu cộng nên giữ dấu các số hạng."), c("Bỏ ngoặc: 10−(3−7) được gì?","10−3+7",["10+3−7","10−3−7","10+3+7"],"Trước ngoặc là dấu trừ nên đổi dấu mọi số hạng."), c("−12+7+12 bằng bao nhiêu?","7",["−7","31","−17"],"Nhóm −12 và 12 được 0."), c("15−(8+15) bằng bao nhiêu?","−8",["8","22","−22"],"15−8−15 = −8.")]),
  b("math6-s1-chapter3-practice1",22,"Luyện tập chung","LT","Cộng trừ và dấu ngoặc","Chương III · Số nguyên","trang 69","Củng cố số nguyên, cộng trừ và biến đổi biểu thức.",[
    c("−18+25 bằng bao nhiêu?","7",["−43","43","−7"],"Lấy 25−18 và giữ dấu dương."), c("−20−(−13) bằng bao nhiêu?","−7",["−33","7","33"],"−20+13 = −7."), c("5−(−3+8) bằng bao nhiêu?","0",["10","−6","16"],"Trong ngoặc bằng 5, nên 5−5=0."), c("Sắp xếp tăng dần −2, 4, −7, 0 là gì?","−7; −2; 0; 4",["4; 0; −2; −7","−2; −7; 0; 4","0; −2; −7; 4"],"Trên trục số đọc từ trái sang phải.")]),
  b("math6-s1-lesson16",23,"Bài 16","16","Phép nhân số nguyên","Chương III · Số nguyên","trang 70–72","Xác định dấu của tích và vận dụng tính chất phép nhân.",[
    c("(−4)·6 bằng bao nhiêu?","−24",["24","−10","10"],"Hai thừa số khác dấu cho tích âm."), c("(−5)·(−7) bằng bao nhiêu?","35",["−35","12","−12"],"Hai thừa số cùng dấu cho tích dương."), c("Tích của ba số âm có dấu gì?","Âm",["Dương","Bằng 0","Không xác định"],"Số lượng thừa số âm là lẻ nên tích âm."), c("(−25)·4·(−1) bằng bao nhiêu?","100",["−100","29","−29"],"(−25)·4=−100, nhân −1 được 100.")]),
  b("math6-s1-lesson17",24,"Bài 17","17","Phép chia hết. Ước và bội của số nguyên","Chương III · Số nguyên","trang 73–74","Thực hiện phép chia hết số nguyên và xác định ước, bội nguyên.",[
    c("(−36):6 bằng bao nhiêu?","−6",["6","−30","30"],"Hai số khác dấu cho thương âm."), c("(−42):(−7) bằng bao nhiêu?","6",["−6","35","−35"],"Hai số cùng dấu cho thương dương."), c("Các ước nguyên của 5 gồm gì?","−5; −1; 1; 5",["1; 5","−5; 5","−1; 1"],"Ước nguyên gồm cả ước dương và ước âm tương ứng."), c("0 có là bội của mọi số nguyên khác 0 không?","Có",["Không","Chỉ của 1","Chỉ của số dương"],"0 = a·0 với mọi a khác 0.")]),
  b("math6-s1-chapter3-practice2",25,"Luyện tập chung","LT","Phép tính với số nguyên","Chương III · Số nguyên","trang 75","Phối hợp cộng, trừ, nhân, chia số nguyên.",[
    c("(−3)·8 + 10 bằng bao nhiêu?","−14",["34","−34","14"],"Nhân trước: −24+10=−14."), c("48:(−6)−5 bằng bao nhiêu?","−13",["3","−3","13"],"48:(−6)=−8, rồi −8−5=−13."), c("(−2)³ bằng bao nhiêu?","−8",["8","−6","6"],"Ba thừa số −2 cho tích âm có độ lớn 8."), c("Ước nguyên dương lớn nhất của 18 là gì?","18",["9","6","1"],"Mọi số nguyên dương là ước của chính nó.")]),
  b("math6-s1-chapter3-review",26,"Bài tập cuối chương III","ÔN","Ôn tập số nguyên","Chương III · Số nguyên","trang 76","Tổng hợp trục số, số đối và các phép tính số nguyên.",[
    c("Số đối của 12 là gì?","−12",["12","0","24"],"12 và −12 có tổng 0."), c("−15+6−(−4) bằng bao nhiêu?","−5",["−13","5","−25"],"−15+6+4=−5."), c("(−6)·(−5):3 bằng bao nhiêu?","10",["−10","30","−30"],"Tích là 30, chia 3 được 10."), c("|−20|−|7| bằng bao nhiêu?","13",["−13","27","−27"],"20−7=13.")]),

  b("math6-s1-lesson18",27,"Bài 18","18","Hình tam giác đều. Hình vuông. Hình lục giác đều","Chương IV · Một số hình phẳng trong thực tiễn","trang 77–82","Nhận biết và mô tả các yếu tố của ba hình đều cơ bản.",[
    c("Tam giác đều có bao nhiêu cạnh bằng nhau?","3",["2","4","6"],"Cả ba cạnh của tam giác đều bằng nhau."), c("Hình vuông có bao nhiêu góc vuông?","4",["2","3","6"],"Bốn góc của hình vuông đều là góc vuông."), c("Lục giác đều có bao nhiêu cạnh?","6",["4","5","8"],"Tên lục giác cho biết hình có sáu cạnh."), c("Hai đường chéo của hình vuông có tính chất nào?","Bằng nhau và cắt nhau tại trung điểm",["Không bằng nhau","Song song","Không cắt nhau"],"Đường chéo hình vuông bằng nhau và phân giác nhau.")]),
  b("math6-s1-lesson19",28,"Bài 19","19","Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân","Chương IV · Một số hình phẳng trong thực tiễn","trang 83–89","Nhận biết cạnh, góc và đường chéo của các tứ giác đặc biệt.",[
    c("Hình chữ nhật có các cạnh đối thế nào?","Song song và bằng nhau",["Vuông góc và không bằng nhau","Chỉ song song","Chỉ bằng nhau"],"Hai cặp cạnh đối của hình chữ nhật song song và bằng nhau."), c("Hình thoi có đặc điểm nổi bật nào?","Bốn cạnh bằng nhau",["Bốn góc vuông","Hai cạnh bằng nhau","Không có đường chéo"],"Hình thoi có bốn cạnh bằng nhau."), c("Hình bình hành có các góc đối thế nào?","Bằng nhau",["Bù nhau từng cặp đối","Đều vuông","Không liên hệ"],"Các góc đối của hình bình hành bằng nhau."), c("Hình thang cân có hai đường chéo thế nào?","Bằng nhau",["Vuông góc","Song song","Một đường chéo"],"Hai đường chéo của hình thang cân bằng nhau.")]),
  b("math6-s1-lesson20",29,"Bài 20","20","Chu vi và diện tích của một số tứ giác đã học","Chương IV · Một số hình phẳng trong thực tiễn","trang 90–94","Tính chu vi, diện tích và giải bài toán đo đạc.",[
    c("Diện tích hình chữ nhật dài 8 cm, rộng 5 cm là gì?","40 cm²",["26 cm²","13 cm²","80 cm²"],"S = dài·rộng = 8·5."), c("Chu vi hình vuông cạnh 6 cm là gì?","24 cm",["36 cm²","12 cm","18 cm"],"P = 4·6 = 24 cm."), c("Diện tích hình bình hành đáy 9 cm, cao 4 cm là gì?","36 cm²",["26 cm²","18 cm²","72 cm²"],"S = đáy·chiều cao."), c("Diện tích hình thoi có hai đường chéo 6 cm và 8 cm là gì?","24 cm²",["48 cm²","14 cm²","28 cm²"],"S = (6·8):2 = 24 cm².")]),
  b("math6-s1-chapter4-practice",30,"Luyện tập chung","LT","Hình phẳng và đo đạc","Chương IV · Một số hình phẳng trong thực tiễn","trang 95–96","Củng cố nhận dạng, chu vi và diện tích.",[
    c("Hình nào luôn có bốn cạnh bằng nhau và bốn góc vuông?","Hình vuông",["Hình thoi bất kì","Hình chữ nhật bất kì","Hình thang cân"],"Hình vuông đồng thời có bốn cạnh bằng nhau và bốn góc vuông."), c("Hình chữ nhật 12 m × 7 m có chu vi bao nhiêu?","38 m",["84 m²","19 m","168 m"],"P = 2·(12+7)=38 m."), c("Hình bình hành đáy 15 m, cao 6 m có diện tích gì?","90 m²",["42 m²","45 m²","180 m²"],"S = 15·6=90 m²."), c("Đơn vị phù hợp để ghi diện tích sân là gì?","m²",["m","m³","cm"],"Diện tích dùng đơn vị vuông.")]),
  b("math6-s1-chapter4-review",31,"Bài tập cuối chương IV","ÔN","Ôn tập hình phẳng","Chương IV · Một số hình phẳng trong thực tiễn","trang 97","Tổng hợp đặc điểm hình và công thức đo.",[
    c("Hình nào có đúng một cặp cạnh đối song song trong mô hình cơ bản?","Hình thang",["Hình bình hành","Hình chữ nhật","Hình thoi"],"Hình thang có một cặp cạnh đối song song."), c("Diện tích hình vuông cạnh 9 cm là gì?","81 cm²",["36 cm","18 cm²","72 cm²"],"S = 9²=81 cm²."), c("Chu vi hình thoi cạnh 11 cm là gì?","44 cm",["121 cm²","22 cm","33 cm"],"P = 4·11=44 cm."), c("Đổi 2 m² ra dm² được bao nhiêu?","200 dm²",["20 dm²","2 000 dm²","0,2 dm²"],"1 m² = 100 dm².")]),

  b("math6-s1-lesson21",32,"Bài 21","21","Hình có trục đối xứng","Chương V · Tính đối xứng của hình phẳng trong tự nhiên","trang 98–102","Nhận biết trục đối xứng và hoàn thiện hình qua phép gấp.",[
    c("Hình vuông có bao nhiêu trục đối xứng?","4",["1","2","8"],"Hai đường chéo và hai đường qua trung điểm cạnh đối."), c("Hình chữ nhật không phải hình vuông có bao nhiêu trục đối xứng?","2",["1","4","0"],"Hai đường qua trung điểm các cặp cạnh đối."), c("Tam giác đều có bao nhiêu trục đối xứng?","3",["1","2","6"],"Mỗi trục đi qua một đỉnh và trung điểm cạnh đối diện."), c("Một đường là trục đối xứng khi nào?","Gấp theo đường đó hai phần trùng khít",["Chia hình thành hai phần bất kì","Đi qua một đỉnh","Song song với một cạnh"],"Định nghĩa dựa trên sự trùng khít khi gấp.")]),
  b("math6-s1-lesson22",33,"Bài 22","22","Hình có tâm đối xứng","Chương V · Tính đối xứng của hình phẳng trong tự nhiên","trang 103–107","Nhận biết tâm đối xứng qua phép quay nửa vòng.",[
    c("Hình bình hành có tâm đối xứng ở đâu?","Giao điểm hai đường chéo",["Một đỉnh","Trung điểm một cạnh","Bên ngoài hình"],"Quay nửa vòng quanh giao điểm đường chéo, hình trùng chính nó."), c("Hình chữ nhật có tâm đối xứng không?","Có",["Không","Chỉ hình vuông mới có","Chỉ khi các cạnh bằng nhau"],"Giao điểm hai đường chéo là tâm đối xứng."), c("Tam giác đều có tâm đối xứng không?","Không",["Có một tâm","Có ba tâm","Mọi điểm đều là tâm"],"Quay tam giác đều 180° không trùng lại chính nó."), c("Phép kiểm tra tâm đối xứng dùng góc quay bao nhiêu?","180°",["90°","60°","360°"],"Tâm đối xứng tương ứng phép quay nửa vòng.")]),
  b("math6-s1-chapter5-practice",34,"Luyện tập chung","LT","Trục và tâm đối xứng","Chương V · Tính đối xứng của hình phẳng trong tự nhiên","trang 108–109","Phân biệt hai loại đối xứng trong hình học và tự nhiên.",[
    c("Hình tròn có bao nhiêu trục đối xứng?","Vô số",["1","2","4"],"Mọi đường kính đều là một trục đối xứng."), c("Hình thoi không phải hình vuông có bao nhiêu trục đối xứng?","2",["0","1","4"],"Hai đường chéo là hai trục đối xứng."), c("Chữ in hoa nào thường có tâm đối xứng?","H",["A","T","L"],"Quay chữ H in hoa 180° vẫn trùng."), c("Hình nào vừa có trục vừa có tâm đối xứng?","Hình chữ nhật",["Tam giác đều","Tam giác cân bất kì","Hình diều bất kì"],"Hình chữ nhật có hai trục và một tâm đối xứng.")]),
  b("math6-s1-chapter5-review",35,"Bài tập cuối chương V","ÔN","Ôn tập tính đối xứng","Chương V · Tính đối xứng của hình phẳng trong tự nhiên","trang 110","Tổng hợp trục đối xứng, tâm đối xứng và ứng dụng.",[
    c("Lục giác đều có bao nhiêu trục đối xứng?","6",["3","4","12"],"Ba trục qua cặp đỉnh đối và ba trục qua trung điểm cạnh đối."), c("Lục giác đều có tâm đối xứng không?","Có",["Không","Chỉ có trục","Chỉ khi tô màu"],"Tâm hình là tâm quay 180°."), c("Muốn vẽ điểm đối xứng A' của A qua tâm O cần điều gì?","O là trung điểm AA'",["OA vuông góc OA'","A trùng A'","OA gấp đôi OA'"],"Hai điểm đối xứng qua tâm nằm hai phía và cách tâm bằng nhau."), c("Đối xứng thường được dùng trong thiết kế vì sao?","Tạo cân bằng và hài hòa",["Làm mất kích thước","Loại bỏ mọi màu sắc","Chỉ dùng cho hình tròn"],"Tính đối xứng tạo cảm giác cân đối.")]),

  b("math6-s1-activity-card-room",36,"Hoạt động trải nghiệm","HĐ1","Tấm thiệp và phòng học của em","Hoạt động thực hành trải nghiệm","trang 111–112","Dùng hình phẳng, đối xứng và đo đạc để thiết kế sản phẩm gần gũi.",[
    c("Đơn vị phù hợp để đo chiều dài phòng học là gì?","mét",["milimét","kilômét","mét vuông"],"Kích thước phòng thường đo bằng mét."), c("Tỉ lệ 1:100 nghĩa là 1 cm trên bản vẽ ứng với bao nhiêu ngoài thực tế?","100 cm",["10 cm","1 cm","1 000 cm"],"Mẫu số tỉ lệ cho biết độ dài thực tương ứng."), c("Gấp đôi tấm thiệp giúp tạo đặc điểm gì?","Trục đối xứng",["Tâm đối xứng bắt buộc","Thể tích","Số nguyên âm"],"Nếp gấp có thể dùng làm trục để trang trí cân đối."), c("Diện tích sàn phòng hình chữ nhật tính bằng gì?","Dài × rộng",["2 × (dài + rộng)","Dài + rộng","Dài × rộng × cao"],"Diện tích hình chữ nhật là tích hai kích thước.")]),
  b("math6-s1-activity-geogebra",37,"Hoạt động trải nghiệm","HĐ2","Vẽ hình đơn giản với GeoGebra","Hoạt động thực hành trải nghiệm","trang 113–118","Thực hành tạo điểm, đoạn thẳng, đa giác và phép đối xứng bằng phần mềm.",[
    c("Công cụ nào dùng để nối hai điểm bằng một đoạn?","Đoạn thẳng qua hai điểm",["Xóa","Văn bản","Thanh trượt"],"Chọn hai điểm đầu mút để tạo đoạn thẳng."), c("Muốn tạo hình nhiều cạnh khép kín dùng công cụ nào?","Đa giác",["Điểm","Góc","Phóng to"],"Công cụ Đa giác nối lần lượt các đỉnh và khép hình."), c("Đối xứng một điểm qua đường thẳng cần chọn gì?","Điểm rồi đường đối xứng",["Chỉ đường thẳng","Chỉ điểm","Hai màu"],"Đối tượng được chọn trước, trục đối xứng chọn sau."), c("Kéo một điểm tự do giúp kiểm tra điều gì?","Quan hệ hình học có được giữ không",["Màu màn hình","Tên tệp","Âm lượng"],"Hình dựng đúng sẽ duy trì quan hệ khi kéo điểm.")]),
  b("math6-s1-activity-calculator",38,"Hoạt động trải nghiệm","HĐ3","Sử dụng máy tính cầm tay","Hoạt động thực hành trải nghiệm","trang 119–121","Nhập biểu thức, kiểm tra kết quả và dùng máy tính có trách nhiệm.",[
    c("Phím nào thường xóa toàn bộ phép tính hiện tại?","AC",["=","+","M+"],"AC là All Clear."), c("Khi nhập 12+3×4, máy tính chuẩn cho kết quả gì?","24",["60","48","15"],"Máy tuân theo thứ tự nhân trước cộng."), c("Sau khi bấm phép tính nên làm gì?","Ước lượng để kiểm tra",["Chép ngay không kiểm tra","Đổi mọi dấu","Tắt máy trước kết quả"],"Ước lượng giúp phát hiện lỗi nhập phím."), c("Kết quả 999×101 có thể kiểm tra nhanh bằng biểu thức nào?","999×(100+1)",["999+101","999×100−1","1 000×101"],"Tính phân phối cho 99 900+999=100 899.")]),
];

const GAME_DEFINITIONS = [
  ["concept", "🧠", "Nhận biết khái niệm", "Năng lực 1 · Nhận diện dữ kiện, kí hiệu, định nghĩa và kết quả đúng."],
  ["apply", "🧮", "Thực hiện quy trình", "Năng lực 2 · Chọn và thực hiện đúng quy tắc theo từng bước."],
  ["reason", "🔎", "Lập luận và giải thích", "Năng lực 3 · Chọn lí do toán học làm căn cứ cho kết luận."],
  ["error", "🛠️", "Phân tích và sửa sai", "Năng lực 4 · Phát hiện lỗi thường gặp, rồi chọn cách sửa chính xác."],
  ["mixed", "🎯", "Kết nối và tổng hợp", "Năng lực 5 · Phối hợp hai kiến thức trong cùng một nhiệm vụ."],
  ["challenge", "🏁", "Vận dụng và thử thách", "Năng lực 6 · Chuyển kiến thức sang tình huống hoặc quyết định mới."],
] as const;

type GeneratedRound = StructuredMathLessonBuilt["rounds"][string][number];

const uniqueOptions = (answer: string, candidates: string[], seed: number): string[] => {
  const fallbacks = [
    "Không đủ dữ kiện để kết luận",
    "Áp dụng quy tắc theo chiều ngược lại",
    "Giữ nguyên kết quả ban đầu",
    "Kết luận trên không phù hợp",
    "Cần cộng thêm một đơn vị",
    "Cần đổi dấu của kết quả",
  ];
  const pool = [answer, ...candidates, ...fallbacks].map((item) => item.trim()).filter(Boolean);
  const distinct = [...new Set(pool)];
  const chosen = [answer, ...distinct.filter((item) => item !== answer).slice(0, 3)];
  const shift = seed % chosen.length;
  return [...chosen.slice(shift), ...chosen.slice(0, shift)];
};

const round = (
  id: string,
  context: string,
  contextVi: string,
  prompt: string,
  promptVi: string,
  answer: string,
  candidates: string[],
  explanationVi: string,
  seed: number,
  wrongFeedback?: Record<string, string>,
): GeneratedRound => {
  const options = uniqueOptions(answer, candidates, seed);
  const feedback = wrongFeedback ? Object.fromEntries(options.filter((option) => option !== answer).map((option) => [option, wrongFeedback[option] ?? `Em chọn “${option}”. Lỗi: phương án không thỏa yêu cầu đang xét. Vì sao sai: ${explanationVi} Cách sửa: làm lại theo quy tắc trong lời giải. Ôn lại thẻ kiến thức của dạng này.`])) : undefined;
  return { id, source_status: "ai-generated", context, context_vi: contextVi, prompt, prompt_vi: promptVi, options, answer, explanation_vi: explanationVi, wrong_feedback: feedback };
};

const conceptPrompts = [
  (q: string) => q,
  (q: string) => `Nhận diện kết quả đúng của yêu cầu: ${q}`,
  (q: string) => `Trong bốn lựa chọn, phương án nào trả lời chính xác câu hỏi “${q}”?`,
  (q: string) => `Kiểm tra kiến thức nền: ${q}`,
  (q: string) => `Chọn kết luận đúng mà em có thể dùng ngay cho bài toán: ${q}`,
  (q: string) => `Khi đọc dữ kiện này, em cần nhận ra điều gì? ${q}`,
  (q: string) => `Hoàn thành thẻ ghi nhớ bằng đáp án đúng: ${q}`,
  (q: string) => `Phân loại nhanh rồi trả lời: ${q}`,
  (q: string) => `Chọn giá trị hoặc phát biểu phù hợp nhất: ${q}`,
  (q: string) => `Trước khi tính tiếp, hãy xác định đáp án của bước nền tảng này: ${q}`,
];

export function expandMathConcepts(spec: MathSemesterBranchSpec): MathConcept[] {
  const explanations = spec.concepts.map((item) => item.explanation);
  return spec.concepts.flatMap((fact, factIndex) => {
    const otherExplanations = explanations.filter((_, index) => index !== factIndex);
    return [
      fact,
      c(
        `Hồ sơ nào ghép đúng yêu cầu và kết quả cho câu “${fact.question}”?`,
        `Kết quả: ${fact.answer}`,
        fact.distractors.map((item) => `Kết quả: ${item}`) as [string, string, string],
        `Đọc đúng yêu cầu trước khi ghi hồ sơ. ${fact.explanation}`,
      ),
      c(
        `Căn cứ nào bảo vệ kết quả “${fact.answer}” của câu “${fact.question}”?`,
        fact.explanation,
        [
          otherExplanations[0] ?? "Chỉ cần chọn đáp án có hình thức quen thuộc.",
          otherExplanations[1] ?? "Không cần kiểm tra điều kiện của bài.",
          otherExplanations[2] ?? "Mọi phương án đều cho cùng kết quả.",
        ],
        `Kết quả chỉ được chấp nhận khi đi cùng căn cứ đúng: ${fact.explanation}`,
      ),
    ];
  });
}

function buildCompetencyRounds(spec: MathSemesterBranchSpec, pilot?: MathPilotConfig): StructuredMathLessonBuilt["rounds"] {
  const pilotBank = MATH_PILOT_TASK_BANKS[spec.id];
  if (pilotBank) {
    const competencyLead = {
      concept: "Nhận diện kiến thức nền",
      apply: "Thực hiện quy trình tính",
      reason: "Lập luận và giải thích căn cứ",
      error: "Phân tích và sửa lỗi",
      mixed: "Nhiệm vụ 1 · Kết nối và tổng hợp",
      challenge: "Tình huống vận dụng · Chọn phương án hoàn chỉnh",
    } as const;
    return Object.fromEntries(PILOT_GAME_IDS.map((gameId, gameIndex) => [gameId, pilotBank[gameId].map((task, index) => {
      const feedback = Object.fromEntries(task.distractors.map((option, optionIndex) => [option, `Em chọn “${option}”. Lỗi: ${task.diagnoses[optionIndex]} Vì sao sai: ${task.explanation} Cách sửa: ${task.fix} Ôn lại thẻ “${task.reviewCard}”.`]));
      return round(
        `${gameId}-${index + 1}`,
        `${task.level} · ${task.representation} · ${task.context}`,
        task.context,
        `${competencyLead[gameId]} · ${task.representation} ${index + 1}: ${task.prompt}`,
        task.taskVi,
        task.answer,
        task.distractors,
        `${task.explanation} Cách tự kiểm tra: ${task.fix}`,
        gameIndex * 10 + index,
        feedback,
      );
    })])) as StructuredMathLessonBuilt["rounds"];
  }
  const facts: Array<MathConcept | MathPilotConcept> = pilot?.concepts ?? expandMathConcepts(spec);
  const answers = facts.map((item) => item.answer);
  const allDistractors = facts.flatMap((item) => item.distractors);
  const level = (fact: MathConcept | MathPilotConcept) => "difficulty" in fact ? fact.difficulty : "Luyện tập";
  const directFeedback = (fact: MathConcept | MathPilotConcept) => "wrongFeedback" in fact ? Object.fromEntries(fact.distractors.map((distractor, index) => [distractor, fact.wrongFeedback[index]])) : undefined;
  const pilotFeedback = (answer: string, candidates: string[], message: string) => pilot ? Object.fromEntries(candidates.filter((option) => option !== answer).map((option) => [option, message.replace("{option}", option)])) : undefined;

  const concept = Array.from({ length: 10 }, (_, index) => {
    const fact = facts[index % facts.length];
    return round(
      `concept-${index + 1}`,
      `${level(fact)} · ${spec.label} · Nhận biết · ${["kí hiệu", "định nghĩa", "tính chất", "kết quả", "mối quan hệ"][index % 5]}`,
      "context" in fact ? fact.context : `Tập trung vào một dấu hiệu cốt lõi của “${spec.title}”.`,
      conceptPrompts[index](fact.question),
      "taskVi" in fact ? fact.taskVi : "Không tính dài. Hãy nhận diện đúng khái niệm, kí hiệu hoặc kết quả nền tảng.",
      fact.answer,
      [...fact.distractors, ...answers.filter((answer) => answer !== fact.answer)],
      `${fact.explanation} Đây là kiến thức nền cần nhận ra trước khi giải bài nhiều bước.`,
      index,
      directFeedback(fact),
    );
  });

  const apply = Array.from({ length: 10 }, (_, index) => {
    const fact = facts[(index + 1) % facts.length];
    const action = [
      "Thực hiện trực tiếp và chọn kết quả cuối cùng",
      "Chọn quy tắc phù hợp rồi hoàn thành phép tính",
      "Tính theo đúng thứ tự các bước",
      "Dùng dữ kiện đã cho để tìm đáp án",
      "Hoàn thành bước còn thiếu trong quy trình",
      "Kiểm tra đơn vị hoặc kí hiệu trước khi chốt đáp án",
      "Rút gọn bài toán bằng quy tắc vừa học",
      "Tính nhẩm có kiểm soát và đối chiếu phương án",
      "Viết kết quả ở dạng phù hợp nhất",
      "Thực hiện lại quy trình để xác nhận kết quả",
    ][index];
    return round(
      `apply-${index + 1}`,
      `${level(fact)} · ${spec.label} · Quy trình ${index + 1}`,
      "context" in fact ? `${fact.context} ${action}.` : `${action}. Không bỏ qua bước kiểm tra kết quả.`,
      `${action}: ${fact.question}`,
      "Em cần áp dụng quy tắc, không chỉ đoán theo hình thức của đáp án.",
      fact.answer,
      [...fact.distractors.slice(index % 3), ...fact.distractors.slice(0, index % 3), ...allDistractors],
      `Quy trình đúng: ${fact.explanation}`,
      index + 1,
      directFeedback(fact),
    );
  });

  const reason = Array.from({ length: 10 }, (_, index) => {
    const fact = facts[(index + 2) % facts.length];
    const otherReasons = facts.filter((item) => item !== fact).map((item) => item.explanation);
    const promptLead = [
      "Vì sao đáp án này đúng",
      "Lập luận nào bảo vệ được kết quả",
      "Căn cứ toán học nào cần dùng",
      "Bạn An chọn đúng đáp án nhưng chưa giải thích. Em chọn lời giải thích nào",
      "Muốn thuyết phục bạn cùng bàn, em nên nêu lí do nào",
      "Phát biểu nào nối dữ kiện với kết luận một cách hợp lí",
      "Bước suy luận quyết định ở đây là gì",
      "Lời giải nào không dựa vào đoán mò",
      "Chọn lời giải thích có thể kiểm chứng được",
      "Kết luận chỉ được chấp nhận khi đi kèm căn cứ nào",
    ][index];
    return round(
      `reason-${index + 1}`,
      `${level(fact)} · ${spec.label} · Lập luận ${index + 1}`,
      `Kết quả cần giải thích là “${fact.answer}”.`,
      `${promptLead}? Bài toán gốc: ${fact.question}`,
      "Chọn lí do đúng với quy tắc toán học; không chọn lại chính kết quả.",
      fact.explanation,
      [...otherReasons, "Vì đáp án này xuất hiện đầu tiên trong danh sách.", "Vì mọi bài cùng chủ đề đều có cùng kết quả."],
      `Lập luận phù hợp là: ${fact.explanation}`,
      index + 2,
      pilotFeedback(fact.explanation, [...otherReasons, "Vì đáp án này xuất hiện đầu tiên trong danh sách.", "Vì mọi bài cùng chủ đề đều có cùng kết quả."], "Lí do “{option}” không giải thích đúng dữ kiện đang xét. Hãy chọn định nghĩa hoặc quy tắc gắn trực tiếp với kết luận."),
    );
  });

  const error = Array.from({ length: 10 }, (_, index) => {
    const fact = facts[(index + 3) % facts.length];
    const wrong = fact.distractors[index % fact.distractors.length];
    const correction = `Sửa thành: ${fact.answer}`;
    const errorDescriptions = [
      "đã chọn nhầm quy tắc",
      "bỏ qua một dữ kiện quan trọng",
      "tính đúng bước đầu nhưng kết luận sai",
      "nhầm kí hiệu với kết quả",
      "dùng quy tắc theo chiều ngược lại",
      "quên kiểm tra điều kiện áp dụng",
      "nhầm thứ tự thực hiện",
      "suy luận từ một ví dụ riêng lẻ",
      "không đối chiếu lại đáp án",
      "ghi kết quả chưa đúng dạng",
    ];
    return round(
      `error-${index + 1}`,
      `${level(fact)} · ${spec.label} · Hồ sơ lỗi ${index + 1}`,
      `Một học sinh ${errorDescriptions[index]} và trả lời “${wrong}”.`,
      `Phát hiện và sửa lỗi: với câu “${fact.question}”, bạn trả lời “${wrong}”. Cách sửa nào đúng?`,
      "So sánh đáp án sai với quy tắc, sau đó chọn phương án sửa đầy đủ.",
      correction,
      [`Giữ nguyên: ${wrong}`, `Đổi thành: ${fact.distractors[(index + 1) % 3]}`, `Bỏ qua câu hỏi này`, ...answers.map((answer) => `Sửa thành: ${answer}`)],
      `Đáp án “${wrong}” chưa đúng. ${fact.explanation} Vì vậy phải ${correction.toLowerCase()}.`,
      index + 3,
      pilotFeedback(correction, [`Giữ nguyên: ${wrong}`, `Đổi thành: ${fact.distractors[(index + 1) % 3]}`, "Bỏ qua câu hỏi này", ...answers.map((answer) => `Sửa thành: ${answer}`)], "Cách “{option}” chưa sửa đúng nguyên nhân của lỗi. Hãy quay lại quy tắc và sửa bước sai đầu tiên."),
    );
  });

  const mixed = Array.from({ length: 10 }, (_, index) => {
    const first = facts[index % facts.length];
    const second = facts[(index + 1 + Math.floor(index / facts.length)) % facts.length];
    const answer = `Kết quả 1: ${first.answer}; kết quả 2: ${second.answer}`;
    const candidates = [
      `Kết quả 1: ${first.distractors[0]}; kết quả 2: ${second.answer}`,
      `Kết quả 1: ${first.answer}; kết quả 2: ${second.distractors[1]}`,
      `Kết quả 1: ${second.answer}; kết quả 2: ${first.answer}`,
      `Kết quả 1: ${first.distractors[2]}; kết quả 2: ${second.distractors[0]}`,
    ];
    return round(
      `mixed-${index + 1}`,
      `${level(first)} · ${spec.label} · Phiếu tổng hợp ${index + 1}`,
      "Phiếu có hai nhiệm vụ liên tiếp; cả hai phần đều phải đúng.",
      `Nhiệm vụ 1 — ${first.question} Nhiệm vụ 2 — ${second.question}`,
      "Giải từng nhiệm vụ, rồi chọn cặp kết quả đúng theo đúng thứ tự.",
      answer,
      candidates,
      `Nhiệm vụ 1: ${first.explanation} Nhiệm vụ 2: ${second.explanation}`,
      index + 4,
      pilotFeedback(answer, candidates, "Cặp “{option}” có ít nhất một nhiệm vụ sai hoặc bị đảo thứ tự. Hãy kiểm tra riêng từng phần rồi mới ghép."),
    );
  });

  const challenge = Array.from({ length: 10 }, (_, index) => {
    const fact = facts[(index * (pilot ? 5 : 3) + 1) % facts.length];
    const partner = facts[(index * 2 + 2) % facts.length];
    const scenario = [
      "Em đang kiểm tra lời giải trước khi nộp bài",
      "Một nhóm cần chọn phương án chính xác để trình bày",
      "Bạn học muốn dùng kết quả này cho bước tiếp theo",
      "Em phải ra quyết định chỉ từ dữ kiện đã có",
      "Lớp đang bình chọn lời giải ngắn gọn nhưng đủ căn cứ",
      "Một tình huống mới yêu cầu chuyển quy tắc đã học",
      "Em cần kiểm tra chéo hai kết quả trước khi chốt",
      "Bài toán thực tế chỉ chấp nhận phương án có giải thích",
      "Nhóm học tập cần một đáp án vừa đúng vừa có thể bảo vệ",
      "Đây là lượt thử thách cuối, cần chọn phương án hoàn chỉnh",
    ][index];
    const answer = `${fact.answer} — vì ${fact.explanation}`;
    return round(
      `challenge-${index + 1}`,
      `${level(fact)} · ${spec.label} · Tình huống vận dụng ${index + 1}`,
      `${scenario}. Kiến thức liên quan để đối chiếu thêm: ${partner.question}`,
      `${scenario}. Với yêu cầu “${fact.question}”, phương án nào gồm cả kết quả và căn cứ phù hợp?`,
      "Chọn cặp kết quả–lí do nhất quán. Đây là bước chuyển từ biết quy tắc sang sử dụng quy tắc.",
      answer,
      [
        `${fact.distractors[0]} — vì ${fact.explanation}`,
        `${fact.answer} — vì ${partner.explanation}`,
        `${fact.distractors[1]} — vì không cần dùng quy tắc`,
        `${partner.answer} — vì ${fact.explanation}`,
      ],
      `Phương án hoàn chỉnh phải có kết quả “${fact.answer}” và căn cứ tương ứng: ${fact.explanation}`,
      index + 5,
      pilotFeedback(answer, [`${fact.distractors[0]} — vì ${fact.explanation}`, `${fact.answer} — vì ${partner.explanation}`, `${fact.distractors[1]} — vì không cần dùng quy tắc`, `${partner.answer} — vì ${fact.explanation}`], "Phương án “{option}” ghép kết quả với căn cứ không nhất quán. Cần kiểm tra cả hai vế."),
    );
  });

  return deepenMathRounds(
    { concept, apply, reason, error, mixed, challenge },
    GAME_DEFINITIONS.map(([id]) => id),
    { id: spec.id, title: spec.title, chapter: spec.chapter, lead: spec.lead },
  );
}

export function buildGeneratedMathBranch(
  spec: MathSemesterBranchSpec,
  options: { courseId?: StructuredMathLessonBuilt["course_id"]; sourceBook?: string } = {},
): StructuredMathLessonBuilt {
  const courseId = options.courseId ?? "math-6-semester-1";
  const sourceBook = options.sourceBook ?? "SGK Toán 6 Tập 1";
  const pilot = MATH_PILOT_CONFIGS[spec.id];
  const meta = GAME_DEFINITIONS.map(([id, icon, title, description]) => ({ id, icon, title, description, activityId: `${spec.id}-${id}` }));
  const rounds = buildCompetencyRounds(spec, pilot);
  const defaultHelp = Object.fromEntries(GAME_DEFINITIONS.map(([id, , title]) => {
    const teaching = pilot?.teaching[id];
    return [id, { source_title: `SGK Toán 6 · ${spec.label} · ${spec.pages}`, teaching_vi: teaching?.summary ?? `${title}: ${spec.lead}`, steps: teaching?.steps ?? ["Đọc dữ kiện và xác định chủ đề.", "Nhắc lại quy tắc trước khi tính.", "Chọn đáp án và đối chiếu lời giải."] }];
  })) as StructuredMathLessonBuilt["help"];
  const identity = { id: spec.id, title: spec.title, chapter: spec.chapter, lead: spec.lead };
  const help = pilot ? defaultHelp : buildMathDeepHelp(GAME_DEFINITIONS.map(([id]) => id), identity, `SGK Toán 6 · ${spec.label} · ${spec.pages}`);
  const foundationItem = (concept: MathConcept) => ({ text: concept.question, translation: concept.explanation, speechText: `${concept.question} ${concept.explanation}` });
  const basicFoundations = [
    { title: "Khái niệm cốt lõi", items: spec.concepts.slice(0, 2).map(foundationItem) },
    { title: "Quy tắc và cách làm", items: spec.concepts.slice(2, 4).map(foundationItem) },
    { title: "Tự kiểm tra", items: [foundationItem(spec.concepts[0]), foundationItem(spec.concepts[3])] },
  ];
  return {
    lesson_id: spec.id, source_status: "user-provided-reference", usage_scope: "personal-family", source_note: `Đối chiếu mục lục và nội dung ${sourceBook}, ${spec.pages}; câu luyện tập được biên soạn mới, không nhúng ảnh sách.`, course_id: courseId, branch_id: spec.id,
    lesson: { number: spec.sequence, title: spec.title, chapter: spec.chapter, lead: spec.lead, objectives: pilot?.objectives ?? ["Nhận biết đúng khái niệm và kí hiệu.", "Thực hiện quy tắc theo từng bước.", "Giải thích được lựa chọn của mình.", "Vận dụng vào tình huống học tập và thực tế."] },
    foundations: pilot?.foundations ?? expandMathFoundations(basicFoundations, rounds, identity),
    game_meta: meta.map(({ id, icon, title, description }) => ({ id, icon, title, description, teaching_vi: spec.lead })), games: {} as StructuredMathLessonBuilt["games"], gameIds: GAME_DEFINITIONS.map(([id]) => id), rounds, help, meta,
  };
}

export const MATH_SEMESTER_1_GENERATED_BY_ID = Object.fromEntries(MATH_SEMESTER_1_GENERATED_BRANCHES.map((item) => [item.id, item]));
