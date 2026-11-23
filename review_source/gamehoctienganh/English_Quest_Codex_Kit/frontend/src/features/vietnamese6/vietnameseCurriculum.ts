import type { CommonRound, GameMeta } from "../skills-common/SkillsSection";

export type VietnameseGameId = "trace" | "organize" | "infer" | "language" | "compose" | "communicate";
export type VietnameseCourseId = "vietnamese-6-semester-1" | "vietnamese-6-semester-2";
export type VietnameseVisual = "story" | "poem" | "journey" | "legend" | "argument" | "information" | "book" | "review";
export type VietnameseConcept = {
  part: string;
  cue: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  errorCode: string;
};
export type VietnamesePartIdea = { part: string; title: string; idea: string; assessment: string };
export type VietnameseLessonSpec = {
  id: string;
  courseId: VietnameseCourseId;
  semester: 1 | 2;
  label: string;
  number?: number;
  title: string;
  pages: string;
  genre: string;
  readings: string[];
  lead: string;
  visual: VietnameseVisual;
  objectives: string[];
  concepts: VietnameseConcept[];
  partIdeas: VietnamesePartIdea[];
  gameTitles: [string, string, string, string, string, string];
  rubric: string;
  privacyNote: string;
};

const c = (part: string, cue: string, answer: string, distractors: [string, string, string], explanation: string, errorCode: string): VietnameseConcept => ({ part, cue, answer, distractors, explanation, errorCode });
const parts = (reading: string, language: string, writing: string, speaking: string, extension: string): VietnamesePartIdea[] => [
  { part: "Đọc", title: "Đọc theo dấu vết", idea: reading, assessment: "Tìm chi tiết, nêu bằng chứng và giải thích; không chép dài văn bản nguồn." },
  { part: "Tiếng Việt", title: "Phòng thí nghiệm ngôn ngữ", idea: language, assessment: "Nhận biết, sửa lỗi và vận dụng trong câu nguyên bản." },
  { part: "Viết", title: "Xưởng viết", idea: writing, assessment: "Lập ý, viết nháp và tự sửa bằng rubric; không dùng một văn mẫu duy nhất." },
  { part: "Nói và nghe", title: "Phòng trình bày", idea: speaking, assessment: "Checklist chuẩn bị–trình bày–lắng nghe; ghi âm là tùy chọn và lưu cục bộ." },
  { part: "Củng cố", title: "Hồ sơ năng lực", idea: extension, assessment: "Ôn theo lỗi, câu bỏ qua và năng lực còn yếu." },
];

export const VIETNAMESE_LESSONS: VietnameseLessonSpec[] = [
  {
    id: "vietnamese6-s1-lesson1", courseId: "vietnamese-6-semester-1", semester: 1, label: "Bài 1", number: 1,
    title: "Tôi và các bạn", pages: "trang 10–37", genre: "Truyện và truyện đồng thoại", visual: "story",
    readings: ["Bài học đường đời đầu tiên", "Nếu cậu muốn có một người bạn…", "Bắt nạt", "Những người bạn"],
    lead: "Theo dấu cốt truyện, người kể và nhân vật để hiểu tình bạn, sự tôn trọng và bài học ứng xử.",
    objectives: ["Nhận biết cốt truyện, nhân vật và người kể chuyện.", "Phân tích nhân vật bằng chi tiết.", "Phân biệt lời kể với lời thoại.", "Vận dụng từ đơn, từ phức, so sánh và điệp ngữ.", "Lập dàn ý kể trải nghiệm an toàn."],
    concepts: [
      c("Đọc", "Muốn xác định biến cố của truyện, em cần tìm điều gì?", "Sự việc làm tình huống hoặc nhân vật thay đổi", ["Chi tiết trang trí không liên quan", "Tên nhà xuất bản", "Mọi câu miêu tả"], "Biến cố là sự việc quan trọng làm mạch truyện chuyển hướng hoặc buộc nhân vật phản ứng.", "ORDER_CAUSE"),
      c("Đọc", "Nhận xét tính cách nhân vật cần dựa chủ yếu vào đâu?", "Hành động, lời nói, ý nghĩ và cách ứng xử", ["Tên nhân vật", "Độ dài văn bản", "Cảm giác không có dẫn chứng"], "Nét tính cách phải gắn với chi tiết quan sát được trong văn bản.", "TRAIT_ACTION"),
      c("Đọc", "Dấu hiệu nào giúp phân biệt lời nhân vật với lời người kể?", "Dấu lời thoại, đại từ xưng hô và ngữ cảnh người nói", ["Câu nào dài hơn", "Câu đứng đầu trang", "Mọi câu có tính từ"], "Cần xem ai đang nói, dấu câu và vị trí của lời dẫn.", "NARRATOR_CHARACTER"),
      c("Tiếng Việt", "Từ láy được nhận biết bằng đặc điểm nào?", "Có sự lặp lại âm đầu hoặc vần giữa các tiếng", ["Chỉ gồm một tiếng", "Hai tiếng đều chỉ người", "Luôn có nghĩa trái ngược"], "Từ láy tạo liên kết âm thanh giữa các tiếng; cần phân biệt với từ ghép theo quan hệ nghĩa.", "WORD_FORM"),
      c("Tiếng Việt", "Khi nêu tác dụng của so sánh hoặc điệp ngữ, cần nói gì?", "Đối tượng được làm nổi bật và hiệu quả cảm xúc cụ thể", ["Chỉ gọi tên biện pháp", "Nói chung là làm câu hay", "Chép lại toàn bộ câu"], "Tác dụng phải gắn với từ ngữ, hình ảnh và ý nghĩa ngay trong ngữ cảnh.", "DEVICE_EFFECT"),
      c("Viết–nói", "Một bài kể trải nghiệm rõ ràng cần tổ chức thế nào?", "Hoàn cảnh, diễn biến, điểm đáng nhớ và điều rút ra", ["Chỉ liệt kê cảm xúc", "Kể các việc không theo mạch", "Cung cấp thông tin riêng tư bắt buộc"], "Dàn ý giúp trải nghiệm có trình tự và làm rõ ý nghĩa; có thể dùng tình huống hư cấu tương đương.", "TOPIC_DRIFT"),
    ],
    partIdeas: parts("Xếp đường dây sự kiện, hồ sơ nhân vật và ống kính người kể.", "Tách từ đơn–ghép–láy; giải thích so sánh, điệp ngữ trong câu mới.", "Ghép dàn ý trải nghiệm theo hoàn cảnh–diễn biến–bài học.", "Kể 60–90 giây bằng trải nghiệm thật hoặc hư cấu tương đương.", "Đối chiếu bằng chứng và thông điệp về tình bạn, không chấm phẩm chất cá nhân."),
    gameTitles: ["Đường dây cốt truyện", "Hồ sơ nhân vật", "Ống kính người kể", "Xưởng từ và tu từ", "Dàn ý trải nghiệm", "Kể và lắng nghe"],
    rubric: "Sản phẩm kể được tự đánh giá theo đúng yêu cầu, trình tự, chi tiết, diễn đạt và tự sửa; cảm xúc hoặc trải nghiệm cá nhân không có đáp án duy nhất.",
    privacyNote: "Có thể chọn trải nghiệm hư cấu tương đương; không phải kể chuyện riêng tư, bắt nạt hoặc tổn thương thật.",
  },
  {
    id: "vietnamese6-s1-lesson2", courseId: "vietnamese-6-semester-1", semester: 1, label: "Bài 2", number: 2,
    title: "Gõ cửa trái tim", pages: "trang 38–58", genre: "Thơ có yếu tố tự sự và miêu tả", visual: "poem",
    readings: ["Chuyện cổ tích về loài người", "Mây và sóng", "Bức tranh của em gái tôi", "Những cánh buồm"],
    lead: "Đọc hình ảnh, nhịp cảm xúc và cách kể trong thơ để nhận ra tình cảm gia đình và vẻ đẹp của ngôn từ.",
    objectives: ["Nhận biết hình ảnh và cảm xúc trong thơ.", "Phân biệt tự sự, miêu tả và trữ tình.", "Giải thích ẩn dụ, điệp ngữ trong ngữ cảnh.", "Viết đoạn ghi lại cảm xúc có bằng chứng.", "Trình bày ý kiến tôn trọng về gia đình."],
    concepts: [
      c("Đọc", "Muốn xác định cảm xúc trong thơ, em nên lần theo đâu?", "Từ ngữ, hình ảnh và sự thay đổi giọng điệu", ["Chỉ tên tác giả", "Số trang của bài", "Một từ tách khỏi ngữ cảnh"], "Cảm xúc được biểu hiện qua lựa chọn ngôn ngữ và mạch hình ảnh của bài thơ.", "EVIDENCE_MISSING"),
      c("Đọc", "Yếu tố tự sự trong thơ làm nhiệm vụ gì?", "Kể một sự việc hoặc diễn biến làm nền cho cảm xúc", ["Chỉ tả màu sắc", "Chỉ nêu định nghĩa", "Xóa mọi cảm xúc"], "Tự sự trả lời điều gì xảy ra; miêu tả làm hiện lên đặc điểm; trữ tình bộc lộ cảm xúc.", "MODE_CONFUSION"),
      c("Đọc", "Một nhận xét về hình ảnh thơ thuyết phục cần có gì?", "Nhận xét kèm từ ngữ hoặc hình ảnh làm bằng chứng", ["Cảm giác chung không dẫn chứng", "Một chi tiết ngoài văn bản", "Chỉ kể lại nội dung"], "Bằng chứng ngắn và đúng trọng tâm giúp người đọc kiểm tra suy luận.", "EVIDENCE_MISSING"),
      c("Tiếng Việt", "Ẩn dụ khác cách hiểu nghĩa đen ở điểm nào?", "Gọi sự vật qua quan hệ tương đồng để gợi ý nghĩa", ["Luôn có từ như", "Chỉ lặp một từ", "Dùng dấu chấm phẩy"], "Cần xác định hai trường nghĩa được liên hệ và hiệu quả gợi hình, gợi cảm.", "LITERAL_FIGURATIVE"),
      c("Tiếng Việt", "Dấu câu trong lời dẫn trực tiếp giúp người đọc làm gì?", "Nhận ra ranh giới giữa lời dẫn và lời được dẫn", ["Đổi hoàn toàn người kể", "Biến mọi câu thành thơ", "Thay thế bằng chứng"], "Dấu câu tổ chức lời dẫn và lời nói; chọn dấu theo công dụng, không theo hình dạng.", "PUNCTUATION_USE"),
      c("Viết–nói", "Đoạn văn ghi cảm xúc về thơ cần phối hợp điều gì?", "Cảm xúc, hình ảnh thơ làm căn cứ và lời giải thích", ["Chỉ tóm tắt bài thơ", "Chỉ khen hay", "Sao chép nhiều câu thơ"], "Đoạn viết nêu cảm xúc cụ thể, dẫn chứng ngắn và giải thích vì sao chi tiết ấy gợi cảm xúc.", "TOPIC_DRIFT"),
    ],
    partIdeas: parts("Bản đồ hình ảnh–cảm xúc; phân loại tự sự, miêu tả và trữ tình.", "Kính hiển vi ẩn dụ, điệp ngữ, đại từ và dấu câu lời dẫn.", "Nâng cấp đoạn cảm xúc từ nhận xét chung thành nhận xét có bằng chứng.", "Trình bày ý kiến về một tình huống gia đình hư cấu, tách ý kiến và căn cứ.", "So sánh hai cách biểu đạt cảm xúc mà không áp đặt một cách cảm thụ."),
    gameTitles: ["Bản đồ hình ảnh thơ", "Ba lớp biểu đạt", "Bằng chứng cảm xúc", "Kính hiển vi tu từ", "Xưởng đoạn văn", "Ý kiến có căn cứ"],
    rubric: "Đoạn cảm xúc được xem theo đúng nhiệm vụ, bằng chứng, giải thích, liên kết và tự sửa; không chấm cảm xúc nào là đúng hơn.",
    privacyNote: "Tình huống nói–viết có thể dùng gia đình hư cấu; không yêu cầu chia sẻ mâu thuẫn hay thông tin riêng của gia đình.",
  },
  {
    id: "vietnamese6-s1-lesson3", courseId: "vietnamese-6-semester-1", semester: 1, label: "Bài 3", number: 3,
    title: "Yêu thương và chia sẻ", pages: "trang 59–87", genre: "Truyện kể ngôi thứ ba", visual: "story",
    readings: ["Cô bé bán diêm", "Gió lạnh đầu mùa", "Con chào mào", "Lắc-ki thực sự may mắn"],
    lead: "Dùng điểm nhìn, hành động và động cơ để hiểu nhân vật, đồng cảm và lựa chọn cách ứng xử có trách nhiệm.",
    objectives: ["Nhận biết người kể ngôi thứ ba.", "So sánh nhân vật bằng bằng chứng.", "Suy luận từ hành động tới động cơ và bài học.", "Xây cụm danh từ, động từ, tính từ.", "Mở rộng câu đúng mục đích."],
    concepts: [
      c("Đọc", "Người kể ngôi thứ ba thường gọi nhân vật bằng cách nào?", "Tên nhân vật hoặc các đại từ ngôi thứ ba", ["Luôn xưng tôi", "Luôn đối thoại với người đọc", "Không nhắc nhân vật"], "Ngôi kể được nhận biết qua cách xưng gọi và phạm vi thông tin người kể cung cấp.", "NARRATOR_CHARACTER"),
      c("Đọc", "So sánh hai nhân vật cần dùng bảng nào?", "Hành động–động cơ–thay đổi–bằng chứng", ["Tên–số chữ–số trang", "Cảm giác–phỏng đoán", "Chỉ một nét giống nhau"], "Cùng tiêu chí và bằng chứng giúp so sánh công bằng, rõ ràng.", "TRAIT_ACTION"),
      c("Đọc", "Từ một hành động đến bài học cần đi qua bước nào?", "Giải thích động cơ và hậu quả của hành động", ["Bỏ qua bối cảnh", "Gắn nhãn nhân vật ngay", "Chọn bài học quen thuộc bất kì"], "Suy luận tốt đi từ chi tiết, quan sát, nguyên nhân/hậu quả rồi mới khái quát.", "ORDER_CAUSE"),
      c("Tiếng Việt", "Trong cụm danh từ, thành phần trung tâm là gì?", "Danh từ nêu sự vật chính", ["Mọi từ đứng trước", "Mọi tính từ", "Dấu câu cuối cụm"], "Bỏ thử phần phụ để tìm danh từ hạt nhân còn giữ nghĩa chính của cụm.", "PHRASE_HEAD"),
      c("Tiếng Việt", "Mở rộng thành phần câu có mục đích giúp gì?", "Bổ sung thông tin và làm hình ảnh hoặc quan hệ rõ hơn", ["Làm câu dài bằng mọi giá", "Xóa nòng cốt câu", "Thay mọi động từ"], "Trước khi mở rộng cần tìm nòng cốt, rồi thêm phần phụ phục vụ ý định biểu đạt.", "PHRASE_HEAD"),
      c("Viết–nói", "Khi xử lí tình huống cần đồng cảm, lựa chọn tốt gồm gì?", "Hành động an toàn, tôn trọng và lí do phù hợp", ["Phán xét hoàn cảnh", "Biến khó khăn thành trò đùa", "Ép kể chuyện riêng"], "Không chấm phẩm chất con người; chỉ xem lựa chọn có an toàn, tôn trọng và có căn cứ không.", "SENSITIVE_CONTEXT"),
    ],
    partIdeas: parts("Ống kính ngôi kể; bảng so sánh hành động–động cơ–thay đổi.", "Xây cụm danh/động/tính từ và mở rộng câu có mục đích.", "Dàn ý trải nghiệm tập trung vào lựa chọn và điều học được.", "Kể tình huống hư cấu về giúp đỡ và phản hồi bằng ngôn ngữ tôn trọng.", "Bậc thang chi tiết–suy luận–bài học, tránh phán xét hoàn cảnh."),
    gameTitles: ["Ống kính ngôi kể", "Cân hai nhân vật", "Bậc thang suy luận", "Xưởng cụm từ", "Nới câu có mục đích", "Lựa chọn đồng cảm"],
    rubric: "Bài kể được hỗ trợ bằng tiêu chí trình tự, chi tiết, điểm thay đổi, diễn đạt và tự sửa; không chấm mức độ đau buồn hay lòng tốt của học sinh.",
    privacyNote: "Có quyền bỏ qua chủ đề nhạy cảm và dùng nhân vật hư cấu; không yêu cầu kể mất mát hoặc khó khăn thật.",
  },
  {
    id: "vietnamese6-s1-lesson4", courseId: "vietnamese-6-semester-1", semester: 1, label: "Bài 4", number: 4,
    title: "Quê hương yêu dấu", pages: "trang 88–107", genre: "Thơ lục bát", visual: "poem",
    readings: ["Ca dao về quê hương đất nước", "Chuyện cổ nước mình", "Cây tre Việt Nam", "Hành trình của bầy ong"],
    lead: "Kết hợp quy tắc tiếng–vần–nhịp với hình ảnh và cảm xúc để đọc và thử sáng tác lục bát.",
    objectives: ["Nhận biết dòng sáu–tám và biến thể.", "Xác định vần, thanh, nhịp cơ bản.", "Phân tích hình ảnh và cảm xúc.", "Phân biệt đồng âm, đa nghĩa và hoán dụ.", "Thử tạo cặp lục bát đúng ràng buộc."],
    concepts: [
      c("Đọc", "Một cặp lục bát cơ bản gồm những dòng nào?", "Một dòng sáu tiếng và một dòng tám tiếng", ["Hai dòng năm tiếng", "Một dòng tám và một dòng sáu không theo thứ tự", "Bốn dòng bảy tiếng"], "Đếm tiếng là bước đầu; sau đó phải kiểm tra vần, thanh và nhịp.", "FORM_MEANING"),
      c("Đọc", "Kiểm tra vần lục bát cần chú ý quan hệ nào?", "Tiếng gieo vần ở dòng sáu liên kết với dòng tám", ["Mọi tiếng cuối đều khác nhau", "Chỉ đếm dấu câu", "Chỉ nhìn số dòng"], "Vần tạo liên kết âm thanh; cần đọc cả cặp câu thay vì xét một tiếng riêng.", "FORM_MEANING"),
      c("Đọc", "Phân tích hình ảnh quê hương trong thơ cần kết hợp gì?", "Từ ngữ, hình ảnh, biện pháp và cảm xúc được gợi ra", ["Chỉ đếm tiếng", "Chỉ nêu quê hương đẹp", "Chỉ kể tên địa danh"], "Hình thức và ý nghĩa phải được xem đồng thời để tránh nhận xét chung chung.", "EVIDENCE_MISSING"),
      c("Tiếng Việt", "Từ đa nghĩa khác từ đồng âm thế nào?", "Các nghĩa của từ đa nghĩa có liên hệ; từ đồng âm có nghĩa không liên hệ", ["Từ đa nghĩa luôn viết khác", "Từ đồng âm luôn cùng nghĩa", "Hai loại không cần ngữ cảnh"], "Đặt từ vào câu và kiểm tra mối liên hệ nghĩa để phân biệt.", "WORD_MEANING"),
      c("Tiếng Việt", "Hoán dụ dựa trên quan hệ nào?", "Quan hệ gần gũi, tương cận giữa các sự vật", ["Quan hệ giống nhau hoàn toàn", "Quan hệ vần điệu", "Quan hệ trái nghĩa"], "Hoán dụ khác ẩn dụ ở chỗ dựa trên tương cận, không phải tương đồng.", "LITERAL_FIGURATIVE"),
      c("Viết–nói", "Khi thử hoàn thiện một cặp lục bát, cần kiểm tra gì?", "Số tiếng, vần, nhịp và ý nghĩa thống nhất", ["Chỉ chọn từ có vần", "Chỉ cần đủ chữ", "Bắt buộc hệ thống chấm giá trị nghệ thuật"], "Ứng dụng chỉ hỗ trợ ràng buộc hình thức và độ rõ ý, không tuyên bố chấm hay–dở nghệ thuật.", "FORM_MEANING"),
    ],
    partIdeas: parts("Xưởng đếm tiếng, nối vần, đánh nhịp và phát hiện biến thể.", "Phân biệt đồng âm–đa nghĩa; giải mã hoán dụ và quan hệ tương cận.", "Ghép cặp lục bát nguyên bản theo ràng buộc; tự sửa bằng checklist.", "Đọc thơ tùy chọn, tự đánh dấu nhịp; không chấm giọng đọc.", "Bản đồ hình ảnh–cảm xúc về một quê hương hư cấu hoặc quen thuộc."),
    gameTitles: ["Xưởng sáu–tám", "Cầu vần và nhịp", "Bản đồ hình ảnh", "Mê cung nghĩa từ", "Giải mã hoán dụ", "Hoàn thiện lục bát"],
    rubric: "Thơ được hỗ trợ theo số tiếng, vần, nhịp, độ rõ của hình ảnh và tự sửa; giá trị nghệ thuật và tình cảm không chấm tự động.",
    privacyNote: "Có thể viết về địa điểm hư cấu; không yêu cầu địa chỉ, vị trí hoặc thông tin quê quán cụ thể.",
  },
  {
    id: "vietnamese6-s1-lesson5", courseId: "vietnamese-6-semester-1", semester: 1, label: "Bài 5", number: 5,
    title: "Những nẻo đường xứ sở", pages: "trang 108–130", genre: "Kí và du kí", visual: "journey",
    readings: ["Cô Tô", "Hang Én", "Cửu Long Giang ta ơi", "Nghìn năm tháp Khương Mỹ"],
    lead: "Theo hành trình, quan sát và cảm xúc để phân biệt sự thực, miêu tả và dấu ấn người viết trong kí.",
    objectives: ["Nhận biết đặc điểm kí và du kí.", "Tổ chức bản đồ hành trình.", "Phân loại sự thực, miêu tả và cảm xúc.", "Dùng dấu câu đúng công dụng.", "Lập dàn ý tả cảnh sinh hoạt."],
    concepts: [
      c("Đọc", "Dấu hiệu quan trọng của kí và du kí là gì?", "Ghi chép sự việc, nơi chốn và trải nghiệm có căn cứ thực tế", ["Mọi chi tiết đều kì ảo", "Không có người quan sát", "Chỉ gồm đối thoại"], "Kí có thể kể, tả, cung cấp thông tin và bộc lộ cảm xúc nhưng dựa trên trải nghiệm/sự thực.", "GENRE_CONFUSION"),
      c("Đọc", "Bản đồ hành trình nên sắp thông tin theo trục nào?", "Địa điểm–thời gian–quan sát–cảm xúc", ["Màu chữ–số trang", "Tên nhân vật ngẫu nhiên", "Chỉ cảm xúc"], "Trục hành trình giúp thấy trình tự và mối liên hệ giữa quan sát với cảm xúc.", "ORDER_CAUSE"),
      c("Đọc", "Một chi tiết miêu tả khác sự thực thông tin ở điểm nào?", "Tập trung làm hiện lên đặc điểm bằng cảm nhận và từ ngữ gợi tả", ["Luôn là số liệu", "Luôn là hư cấu", "Không có từ ngữ"], "Cần phân biệt điều có thể kiểm chứng, cách miêu tả và cảm xúc của người viết.", "FACT_FEELING"),
      c("Tiếng Việt", "Chọn dấu ngoặc kép, phẩy hoặc gạch ngang dựa vào đâu?", "Công dụng của dấu trong cấu trúc và ngữ cảnh", ["Hình dạng đẹp", "Dấu xuất hiện nhiều", "Độ dài câu"], "Xác định lời dẫn, nghĩa đặc biệt, chú thích hoặc ranh giới thành phần trước khi chọn dấu.", "PUNCTUATION_USE"),
      c("Tiếng Việt", "Nhân hóa làm nổi bật đối tượng bằng cách nào?", "Gán đặc điểm hoặc hoạt động của con người cho sự vật", ["Chỉ lặp âm", "Đổi mọi danh từ thành số", "Liệt kê không liên quan"], "Nêu tác dụng phải chỉ ra đặc điểm được làm sống động và cảm xúc cụ thể.", "DEVICE_EFFECT"),
      c("Viết–nói", "Tả cảnh sinh hoạt cần tổ chức chi tiết thế nào?", "Theo không gian hoặc diễn biến, có điểm quan sát và hoạt động tiêu biểu", ["Liệt kê đồ vật rời rạc", "Chỉ nêu cảm xúc", "Cung cấp vị trí riêng tư"], "Một trật tự nhất quán giúp người đọc hình dung cảnh và hoạt động nổi bật.", "TOPIC_DRIFT"),
    ],
    partIdeas: parts("Bản đồ hành trình; phân loại sự thực–miêu tả–cảm xúc.", "Bác sĩ dấu câu; so sánh, nhân hóa và nghĩa đặc biệt trong câu mới.", "Chọn điểm quan sát, trật tự không gian và chi tiết cho cảnh sinh hoạt.", "Chia sẻ một hành trình hư cấu hoặc quen thuộc mà không nêu địa chỉ thật.", "Hồ sơ kí: nơi chốn–quan sát–thông tin–cảm xúc–điều suy ngẫm."),
    gameTitles: ["Nhận diện kí", "Bản đồ hành trình", "Ba lớp ghi chép", "Bác sĩ dấu câu", "Ống kính tu từ", "Xưởng tả cảnh"],
    rubric: "Bài tả cảnh được xem theo điểm quan sát, trật tự, chi tiết tiêu biểu, diễn đạt và tự sửa; không chấm nơi nào đẹp hơn.",
    privacyNote: "Địa điểm có thể hư cấu; không nhập địa chỉ, lịch trình hoặc vị trí chính xác của học sinh.",
  },
  {
    id: "vietnamese6-s1-review", courseId: "vietnamese-6-semester-1", semester: 1, label: "Ôn tập I",
    title: "Ôn tập học kỳ I", pages: "trang 131", genre: "Tổng hợp học kỳ", visual: "review", readings: ["Bài 1–5"],
    lead: "Kết nối thể loại, bằng chứng đọc, kiến thức tiếng Việt, kiểu viết và nói–nghe của năm bài.",
    objectives: ["Hệ thống năm thể loại/chủ điểm.", "Ghép nhận định với bằng chứng.", "Ôn kiến thức tiếng Việt theo lỗi.", "Chọn quy trình viết phù hợp.", "Tự nhận ra năng lực cần ôn."],
    concepts: [
      c("Đọc", "Muốn phân biệt truyện, thơ và kí, cần dựa vào đâu?", "Dấu hiệu thể loại, mục đích và cách tổ chức văn bản", ["Chỉ độ dài", "Chỉ tên tác giả", "Chỉ số trang"], "Thể loại được nhận diện bằng nhiều dấu hiệu kết hợp, không bằng một đặc điểm bề ngoài.", "GENRE_CONFUSION"),
      c("Đọc", "Một nhận định tổng hợp có giá trị khi nào?", "Có chi tiết hoặc đặc điểm văn bản làm bằng chứng", ["Nghe quen tai", "Được đặt ở cuối", "Không cần giải thích"], "Bằng chứng đúng và liên quan giúp kiểm tra nhận định.", "EVIDENCE_MISSING"),
      c("Đọc", "So sánh hai bài cần thống nhất điều gì trước?", "Tiêu chí so sánh", ["Số chữ giống nhau", "Một cảm giác ngẫu nhiên", "Tên bài dài hơn"], "Tiêu chí chung giúp chỉ ra điểm giống–khác có ý nghĩa.", "COMPARE_CRITERIA"),
      c("Tiếng Việt", "Ôn lỗi ngôn ngữ hiệu quả nên bắt đầu từ đâu?", "Nhóm lỗi đã mắc và ví dụ ngữ cảnh", ["Học lại mọi thứ như nhau", "Chỉ nhớ tên thuật ngữ", "Bỏ qua câu sai"], "Hồ sơ lỗi giúp chọn đúng thẻ từ, cụm từ, tu từ hoặc dấu câu cần ôn.", "ERROR_REVIEW"),
      c("Viết", "Chọn quy trình viết cần dựa vào gì?", "Mục đích, người đọc và kiểu bài", ["Số trang sách", "Một dàn ý dùng cho mọi bài", "Cảm xúc của người chấm"], "Kiểu kể, cảm xúc, lục bát và tả cảnh có yêu cầu tổ chức khác nhau.", "TOPIC_DRIFT"),
      c("Nói–nghe", "Tự đánh giá sau trình bày nên dựa vào đâu?", "Mục tiêu, ý chính, bằng chứng, cách diễn đạt và lắng nghe", ["Chỉ nói thật dài", "Chỉ giọng to", "So sánh phẩm chất với bạn"], "Checklist tập trung vào sản phẩm và quá trình, không xếp hạng con người.", "RUBRIC_USE"),
    ],
    partIdeas: parts("Ma trận Bài 1–5 theo thể loại, người kể, hình ảnh và bằng chứng.", "Trạm lỗi cá nhân: từ, cụm từ, tu từ, nghĩa và dấu câu.", "Ghép bốn kiểu bài với mục đích, dàn ý và tiêu chí tự sửa.", "So sánh nhiệm vụ kể–trình bày ý kiến–chia sẻ trải nghiệm.", "Bài tổng hợp ưu tiên câu bỏ qua và năng lực có kết quả thấp."),
    gameTitles: ["Bản đồ thể loại", "Ma trận văn bản", "Bằng chứng tổng hợp", "Trạm tiếng Việt", "Ghép quy trình viết", "Tự đánh giá học kỳ"],
    rubric: "Ôn tập dùng điểm khách quan cho kiến thức xác định và rubric cho sản phẩm mở; không cộng điểm cho việc chia sẻ thông tin cá nhân.",
    privacyNote: "Nhiệm vụ tổng hợp dùng văn bản/tình huống nguyên bản, không yêu cầu kể trải nghiệm thật.",
  },
  {
    id: "vietnamese6-s2-lesson6", courseId: "vietnamese-6-semester-2", semester: 2, label: "Bài 6", number: 6,
    title: "Chuyện kể về những người anh hùng", pages: "trang 4–23", genre: "Truyền thuyết và văn bản thuật sự kiện", visual: "legend",
    readings: ["Thánh Gióng", "Sơn Tinh, Thủy Tinh", "Ai ơi mồng 9 tháng 4", "Bánh chưng, bánh giầy"],
    lead: "Phân biệt dấu vết lịch sử với tưởng tượng dân gian, rồi giải thích chức năng của chi tiết kì ảo và hình tượng anh hùng.",
    objectives: ["Nhận biết đặc điểm truyền thuyết.", "Sắp trình tự và quan hệ nhân quả.", "Giải thích chi tiết kì ảo.", "Dùng nghĩa từ, điệp ngữ và dấu chấm phẩy.", "Tổ chức văn bản thuật sự kiện."],
    concepts: [
      c("Đọc", "Đọc truyền thuyết cần tách hai lớp nào?", "Dấu vết lịch sử và yếu tố tưởng tượng dân gian", ["Sự thật và lời nói dối", "Thơ và kịch", "Số liệu và công thức"], "Truyền thuyết không phải biên niên sử; yếu tố kì ảo thể hiện cách cộng đồng ghi nhớ và tôn vinh.", "LEGEND_HISTORY_MAGIC"),
      c("Đọc", "Dòng thời gian khác chuỗi nguyên nhân–kết quả thế nào?", "Một bên cho trước–sau, một bên giải thích vì sao sự việc dẫn tới kết quả", ["Hai loại hoàn toàn giống", "Dòng thời gian chỉ có cảm xúc", "Nhân quả chỉ dựa số trang"], "Đánh dấu riêng từ chỉ thời gian và từ nối nguyên nhân–kết quả.", "EVENT_ORDER_CAUSE"),
      c("Đọc", "Phân tích chi tiết kì ảo cần nêu thêm điều gì ngoài việc gọi tên?", "Chức năng đối với nhân vật, chủ đề hoặc ước mơ cộng đồng", ["Số chữ của chi tiết", "Màu trang sách", "Chi tiết có thật tuyệt đối"], "Chi tiết kì ảo có thể tôn vinh, tạo thử thách hoặc giải thích theo tưởng tượng dân gian.", "MAGIC_FUNCTION"),
      c("Tiếng Việt", "Dấu chấm phẩy phù hợp nhất trong trường hợp nào?", "Ngăn các bộ phận lớn của một phép liệt kê phức tạp", ["Kết thúc mọi câu hỏi", "Thay mọi dấu phẩy", "Đánh dấu tên riêng"], "Dấu chấm phẩy tạo ranh giới rõ hơn dấu phẩy giữa các nhóm đã có thành phần bên trong.", "PUNCTUATION_USE"),
      c("Viết", "Văn bản thuật lại một sự kiện cần trường thông tin nào?", "Thời gian, địa điểm, diễn biến, người tham gia và ý nghĩa", ["Chỉ cảm nghĩ", "Chỉ danh sách nhân vật", "Chi tiết kì ảo bắt buộc"], "Các trường thông tin giúp bài thuật sự kiện đầy đủ và theo trình tự.", "EVENT_REPORT"),
      c("Nói–nghe", "Kể lại truyền thuyết theo vai cần giữ điều gì?", "Mạch sự kiện chính và giới hạn điều nhân vật có thể biết", ["Thêm mọi sự kiện tùy ý", "Khẳng định là lịch sử đã chứng minh", "Bỏ quan hệ nhân quả"], "Sáng tạo giọng kể được phép nhưng không làm sai mạch chính hoặc điểm nhìn.", "VIEWPOINT_KNOWLEDGE"),
    ],
    partIdeas: parts("Dòng thời gian, dấu vết lịch sử–tưởng tượng và hồ sơ người anh hùng.", "Suy nghĩa từ, điệp ngữ và dấu chấm phẩy trong câu nguyên bản.", "Bản tin sự kiện theo thời gian–địa điểm–diễn biến–ý nghĩa.", "Kể truyền thuyết theo vai với bảng biết trực tiếp/nghe kể/không thể biết.", "Chủ đề có bằng chứng; không biến chi tiết truyền thuyết thành dữ kiện lịch sử."),
    gameTitles: ["Dòng thời gian", "Lịch sử hay tưởng tượng", "Giải mã kì ảo", "Dấu chấm phẩy", "Bản tin sự kiện", "Kể theo vai"],
    rubric: "Bài thuật/kể được xem theo trình tự, độ đầy đủ, giới hạn điểm nhìn, diễn đạt và tự sửa; không chấm giọng kể hay hơn theo cảm tính.",
    privacyNote: "Không khẳng định truyền thuyết là sự kiện lịch sử đã được chứng minh; mọi bài kể dùng dữ liệu học tập, không dùng thông tin riêng.",
  },
  {
    id: "vietnamese6-s2-lesson7", courseId: "vietnamese-6-semester-2", semester: 2, label: "Bài 7", number: 7,
    title: "Thế giới cổ tích", pages: "trang 24–51", genre: "Truyện cổ tích", visual: "story",
    readings: ["Thạch Sanh", "Cây khế", "Vua chích chòe", "Sọ Dừa"],
    lead: "Theo xung đột, chuỗi nhân quả và điểm nhìn để hiểu kiểu nhân vật, chi tiết kì ảo và ước mơ công bằng trong cổ tích.",
    objectives: ["Nhận biết kiểu nhân vật và xung đột.", "Sắp chuỗi nhân quả.", "Giải thích chức năng chi tiết kì ảo.", "Suy nghĩa từ theo thành tố/ngữ cảnh.", "Kể lại theo điểm nhìn nhất quán."],
    concepts: [
      c("Đọc", "Bản đồ xung đột của truyện cần những ô nào?", "Nhân vật–mong muốn–trở ngại–hành động–kết quả", ["Tên–số trang–độ dài", "Chỉ phần thưởng", "Chỉ nhân vật chính"], "Xung đột được hiểu qua điều nhân vật muốn, trở ngại và lựa chọn dẫn tới kết quả.", "CONFLICT_CHAIN"),
      c("Đọc", "Chuỗi nhân quả khác liệt kê sự kiện ở điểm nào?", "Mỗi bước nêu vì sao sự việc sau xảy ra", ["Chỉ sắp trước–sau", "Không cần từ nối", "Chỉ dựa cảm xúc"], "Đọc chuỗi bằng cấu trúc vì… nên… để kiểm tra mắt xích.", "EVENT_ORDER_CAUSE"),
      c("Đọc", "Đồ vật hoặc sự việc kì ảo cần được phân tích theo gì?", "Chức năng giúp đỡ, thử thách hoặc thể hiện ước mơ", ["Màu sắc duy nhất", "Là sự thật lịch sử", "Số lần xuất hiện mà không xét nghĩa"], "Gọi tên chi tiết chưa đủ; phải nêu tác động tới cốt truyện và thông điệp.", "MAGIC_FUNCTION"),
      c("Tiếng Việt", "Khi gặp từ chưa biết, bước suy nghĩa nào hợp lí?", "Tách yếu tố cấu tạo, đọc ngữ cảnh rồi thử nghĩa trong câu", ["Đoán theo chữ đầu", "Chọn nghĩa dài nhất", "Bỏ toàn bộ câu"], "Kết hợp cấu tạo và ngữ cảnh giúp kiểm tra dự đoán nghĩa.", "WORD_MEANING"),
      c("Đọc–viết", "Kết thúc có thưởng/phạt thường giúp làm rõ điều gì?", "Ước mơ công bằng và quan niệm ứng xử của dân gian", ["Mọi sự kiện là lịch sử", "Mọi nhân vật không thay đổi", "Chỉ làm truyện dài hơn"], "Cần đối chiếu hành động, kết quả và thông điệp; tránh đồng nhất phần thưởng với phẩm chất duy nhất.", "ENDING_MESSAGE"),
      c("Nói–nghe", "Kể ngôi thứ nhất theo một nhân vật phải giới hạn thông tin thế nào?", "Chỉ kể điều nhân vật biết, thấy, nghe hoặc được kể lại", ["Biết mọi suy nghĩ của mọi người", "Biết tương lai không căn cứ", "Đổi vai kể giữa câu"], "Bảng điểm nhìn giúp tránh để nhân vật kể biết điều mình không thể biết.", "VIEWPOINT_KNOWLEDGE"),
    ],
    partIdeas: parts("Bản đồ xung đột, chuỗi nhân quả, đồ vật kì ảo và hai tuyến nhân vật.", "Suy nghĩa từ bằng thành tố–ngữ cảnh; chọn từ theo sắc thái.", "Đóng vai kể, giữ xung đột và nhân quả nhưng được sáng tạo cách diễn đạt.", "Kể theo một điểm nhìn; người nghe kiểm tra điều nhân vật có thể biết.", "Kết thúc–phần thưởng/hình phạt–ước mơ công bằng có bằng chứng."),
    gameTitles: ["Bản đồ xung đột", "Chuỗi nhân quả", "Kho đồ vật kì ảo", "Thám tử nghĩa từ", "Kết thúc và thông điệp", "Đổi điểm nhìn"],
    rubric: "Bài kể theo vai được xem theo điểm nhìn, mạch nhân quả, chi tiết, diễn đạt và tự sửa; sáng tạo không bị ép về một bản kể duy nhất.",
    privacyNote: "Tình huống hoàn toàn hư cấu; không dùng hình phạt hay hoàn cảnh nhân vật để đánh giá phẩm chất học sinh.",
  },
  {
    id: "vietnamese6-s2-lesson8", courseId: "vietnamese-6-semester-2", semester: 2, label: "Bài 8", number: 8,
    title: "Khác biệt và gần gũi", pages: "trang 52–75", genre: "Văn bản nghị luận", visual: "argument",
    readings: ["Xem người ta kìa!", "Hai loại khác biệt", "Bài tập làm văn", "Tiếng cười không muốn nghe"],
    lead: "Xây xương sống ý kiến–lí lẽ–bằng chứng và phản hồi khác biệt bằng thái độ tôn trọng.",
    objectives: ["Phân biệt ý kiến, lí lẽ và bằng chứng.", "Kiểm tra mức liên quan của bằng chứng.", "Tóm tắt ý chính.", "Xác định trạng ngữ và tác dụng.", "Phản hồi quan điểm tôn trọng."],
    concepts: [
      c("Đọc", "Xương sống một lập luận gồm những thành phần nào?", "Ý kiến–lí lẽ–bằng chứng", ["Nhan đề–tác giả–số trang", "Nhân vật–vần–nhịp", "Cảm xúc–phỏng đoán–kết luận"], "Ý kiến nêu điều muốn khẳng định, lí lẽ trả lời vì sao, bằng chứng giúp kiểm chứng.", "CLAIM_REASON_EVIDENCE"),
      c("Đọc", "Bằng chứng có sức thuyết phục cần đặc điểm nào?", "Liên quan, cụ thể và đáng tin cậy", ["Dài nhất", "Gây bất ngờ nhưng không liên quan", "Chỉ lặp lại ý kiến"], "Đối chiếu từ khóa của ý kiến với thông tin bằng chứng để kiểm tra mức liên quan.", "WEAK_EVIDENCE"),
      c("Đọc", "Tóm tắt một đoạn nghị luận nên giữ gì?", "Ý chính và mắt xích lí lẽ quan trọng", ["Mọi ví dụ nhỏ", "Chỉ câu đầu", "Nhận xét cá nhân của người tóm tắt"], "Tóm tắt rút gọn nhưng không làm sai quan hệ giữa ý kiến và lí lẽ.", "SUMMARY_DETAIL"),
      c("Tiếng Việt", "Muốn xác định trạng ngữ, bước đầu tiên là gì?", "Tìm nòng cốt chủ ngữ–vị ngữ", ["Tìm từ dài nhất", "Xóa dấu câu", "Chọn mọi cụm đầu câu"], "Sau khi tìm nòng cốt, hỏi khi nào, ở đâu, vì sao, để làm gì hoặc bằng cách nào.", "ADVERBIAL_ROLE"),
      c("Tiếng Việt", "Chọn từ hoặc cấu trúc câu phù hợp cần xét gì?", "Nội dung, sắc thái, đối tượng và tình huống giao tiếp", ["Chỉ độ dài", "Chỉ từ trang trọng nhất", "Mọi từ gần nghĩa thay nhau được"], "Từ gần nghĩa có thể khác sắc thái; cấu trúc câu thay đổi trọng tâm và giọng điệu.", "WORD_CHOICE_REGISTER"),
      c("Nói–viết", "Phản hồi một ý kiến khác mình nên làm thế nào?", "Nêu điểm đồng ý/khác, lí do và bằng chứng mà không công kích người nói", ["Gắn nhãn người nói", "Bác bỏ không lí do", "Đồng ý cho xong"], "Đánh giá lập luận, không đánh giá con người; quan điểm có căn cứ có thể khác nhau.", "RESPECTFUL_RESPONSE"),
    ],
    partIdeas: parts("Phân loại ý kiến–lí lẽ–bằng chứng; tìm mắt xích yếu và tóm tắt đoạn.", "Trạng ngữ đa chức năng; so sánh tác dụng của lựa chọn từ/cấu trúc.", "Lập dàn ý nêu ý kiến với luận điểm, lí do, bằng chứng và phản hồi.", "Trình bày và tóm tắt ý kiến bạn bằng ngôn ngữ tôn trọng.", "Thẻ phản hồi: đồng ý/khác biệt–vì sao–bằng chứng–câu hỏi mở."),
    gameTitles: ["Xương sống lập luận", "Bằng chứng có đủ sức", "Tóm tắt từng đoạn", "Trạng ngữ đa chức năng", "Chọn từ chọn câu", "Phản hồi tôn trọng"],
    rubric: "Bài nghị luận được xem theo ý kiến rõ, lí lẽ, bằng chứng, tổ chức và giao tiếp tôn trọng; không chấm quan điểm cá nhân là đúng/sai nếu có căn cứ phù hợp.",
    privacyNote: "Có thể chọn vấn đề hư cấu hoặc trung tính; không yêu cầu bộc lộ quan điểm riêng về chủ đề nhạy cảm.",
  },
  {
    id: "vietnamese6-s2-lesson9", courseId: "vietnamese-6-semester-2", semester: 2, label: "Bài 9", number: 9,
    title: "Trái Đất – ngôi nhà chung", pages: "trang 76–97", genre: "Văn bản thông tin và đa phương thức", visual: "information",
    readings: ["Trái Đất – cái nôi của sự sống", "Các loài chung sống với nhau như thế nào?", "Trái Đất", "Sinh vật trên Trái Đất được hình thành như thế nào?"],
    lead: "Đọc cấu trúc trang thông tin, chuỗi nguyên nhân–kết quả và vai trò của hình, số liệu, sơ đồ mà không bịa dữ kiện ngoài nguồn.",
    objectives: ["Nhận diện thành phần văn bản thông tin.", "Xác định thông tin chính–phụ.", "Đọc chuỗi nguyên nhân–kết quả.", "Ghép phương tiện phi ngôn ngữ với thông tin.", "Dùng từ mượn phù hợp và tóm tắt bằng sơ đồ."],
    concepts: [
      c("Đọc", "Nhan đề, sa-pô và đề mục giúp người đọc làm gì?", "Dự đoán chủ đề và định hướng cấu trúc thông tin", ["Thay thế toàn bộ nội dung", "Chỉ trang trí", "Xác nhận mọi dữ kiện đúng"], "Các thành phần này tạo phân cấp và báo trước nội dung, nhưng vẫn phải đọc và kiểm chứng.", "INFO_STRUCTURE"),
      c("Đọc", "Khi tóm tắt văn bản thông tin, nên ưu tiên gì?", "Chủ đề, ý chính từng phần và quan hệ giữa chúng", ["Mọi chi tiết nhỏ", "Ý kiến riêng", "Chỉ hình minh họa"], "Thông tin chính trả lời trực tiếp chủ đề; chi tiết phụ làm rõ hoặc minh họa.", "SUMMARY_DETAIL"),
      c("Đọc", "Kiểm tra chuỗi nguyên nhân–kết quả bằng cách nào?", "Vẽ mũi tên và đọc từng mắt xích bằng vì… nên…", ["Đảo mọi mũi tên", "Chỉ sắp theo độ dài", "Bỏ kết quả trung gian"], "Mỗi mũi tên phải có quan hệ hợp lí; không nhầm trước–sau với nguyên nhân.", "CAUSE_EFFECT_CHAIN"),
      c("Đọc", "Hình ảnh, bảng hoặc sơ đồ có giá trị khi nào?", "Làm rõ thông tin cụ thể và có chú thích/đơn vị phù hợp", ["Đẹp mắt dù không liên quan", "Thay thế mọi nguồn", "Không cần đọc nhãn"], "Đọc nhãn, chú thích, đơn vị và đoạn văn liên quan trước khi kết luận.", "MULTIMODAL_MISMATCH"),
      c("Tiếng Việt", "Dùng từ mượn phù hợp cần theo nguyên tắc nào?", "Dùng khi cần, đúng dạng và hợp ngữ cảnh; ưu tiên cách nói rõ nghĩa", ["Càng nhiều càng hiện đại", "Tự đổi chính tả", "Dùng để che nghĩa"], "Không phủ nhận mọi từ mượn; cần tránh lạm dụng và kiểm tra cách viết.", "LOANWORD_OVERUSE"),
      c("Viết–nói", "Biên bản thảo luận cần tách rõ điều gì?", "Diễn biến, ý kiến từng người, quyết định và việc cần làm", ["Cảm nghĩ người viết như kết luận chung", "Mọi lời nói nguyên văn", "Thông tin cá nhân không cần thiết"], "Biên bản ghi khách quan điều đã diễn ra và kết quả thống nhất.", "MINUTES_OPINION"),
    ],
    partIdeas: parts("Giải phẫu trang thông tin; chuỗi nhân quả; ghép hình/số liệu/sơ đồ với ý.", "Hộ chiếu từ mượn; bác sĩ đoạn văn và phương tiện phi ngôn ngữ.", "Mẫu biên bản và sơ đồ tóm tắt với trường thông tin rõ ràng.", "Thảo luận giải pháp môi trường an toàn bằng tiêu chí, không áp một đáp án.", "Kiểm tra dữ kiện–ý kiến–suy đoán; không đưa số liệu ngoài nguồn chưa xác minh."),
    gameTitles: ["Giải phẫu trang tin", "Thông tin chính–phụ", "Chuỗi nhân quả", "Hình và số liệu", "Hộ chiếu từ mượn", "Biên bản và sơ đồ"],
    rubric: "Biên bản/sơ đồ được xem theo đủ trường, khách quan, quan hệ rõ, diễn đạt và tự sửa; giải pháp môi trường hợp lí có thể có nhiều đáp án.",
    privacyNote: "Hoạt động môi trường thật chỉ làm khi có hướng dẫn và cho phép của phụ huynh/giáo viên; ứng dụng không chấm hành động ngoài đời.",
  },
  {
    id: "vietnamese6-s2-lesson10", courseId: "vietnamese-6-semester-2", semester: 2, label: "Bài 10", number: 10,
    title: "Cuốn sách tôi yêu", pages: "trang 98–107", genre: "Dự án đọc sách và nghị luận văn học", visual: "book",
    readings: ["Sách do học sinh chọn với sự đồng ý phù hợp"],
    lead: "Xây hồ sơ đọc sách sáu chặng, phân biệt thông tin thư mục, tóm tắt, ý kiến và bằng chứng mà không chấm sở thích đọc.",
    objectives: ["Chọn sách phù hợp và an toàn.", "Ghi nhật kí đọc.", "Lập hồ sơ thư mục và tóm tắt.", "Chọn bằng chứng ngắn có mục đích.", "Tạo sản phẩm và trình bày bằng rubric."],
    concepts: [
      c("Hồ sơ đọc", "Chọn sách an toàn nên xét gì?", "Độ tuổi, chủ đề, độ dài và sự hướng dẫn/đồng ý khi cần", ["Chỉ bìa đẹp", "Chỉ sách dài nhất", "Tải bản sao không rõ nguồn"], "Việc chọn sách tôn trọng độ tuổi, quyền sử dụng và hướng dẫn của người lớn.", "BOOK_SELECTION"),
      c("Nhật kí đọc", "Một mục nhật kí đọc hữu ích gồm gì?", "Mốc đọc, ý chính/nhân vật, điều chưa hiểu và dự đoán", ["Chép toàn bộ trang", "Chỉ ghi số trang", "Đánh giá bạn đọc"], "Nhật kí lưu tiến trình suy nghĩ, không thay bằng sao chép văn bản.", "READING_LOG"),
      c("Hồ sơ sách", "Tóm tắt khác sao chép thế nào?", "Dùng lời của người viết để giữ ý chính và mạch quan trọng", ["Chép nhiều đoạn", "Thêm sự kiện không có", "Chỉ nêu thích hay không"], "Tóm tắt chọn lọc và diễn đạt lại; thông tin thư mục phải chính xác.", "SUMMARY_DETAIL"),
      c("Bằng chứng", "Dấu trang bằng chứng cần tuân thủ gì?", "Trích rất ngắn, ghi vị trí/nguồn và giải thích lí do chọn", ["Sao chép cả chương", "Xóa tên tác giả", "Chọn câu không liên quan"], "Bằng chứng ngắn phục vụ nhận xét và tôn trọng bản quyền.", "EVIDENCE_MISSING"),
      c("Sáng tạo", "Sản phẩm sáng tạo từ sách được đánh giá phù hợp bằng gì?", "Rubric về liên hệ với sách, ý tưởng, tổ chức và tự sửa", ["Một đáp án mẫu duy nhất", "Sở thích của máy", "Số màu sử dụng"], "Ứng dụng không tự chấm giá trị nghệ thuật; rubric hỗ trợ phản hồi mô tả.", "RUBRIC_USE"),
      c("Trình bày", "Giới thiệu sách thuyết phục cần phối hợp gì?", "Thông tin chính xác, tóm tắt ngắn, điều tâm đắc và bằng chứng", ["Tiết lộ dữ liệu cá nhân", "Chỉ đọc lại bìa", "Khẳng định mọi người phải thích"], "Người nói trình bày lựa chọn cá nhân có căn cứ và tôn trọng lựa chọn khác.", "RESPECTFUL_RESPONSE"),
    ],
    partIdeas: [
      { part: "Chặng 1", title: "Chọn sách an toàn", idea: "Ghi chủ đề, độ dài, lí do chọn và trạng thái được người lớn duyệt khi cần.", assessment: "Checklist, không chấm sở thích." },
      { part: "Chặng 2", title: "Nhật kí đọc", idea: "Mốc đọc, ý chính, điều chưa hiểu và dự đoán.", assessment: "Chấm độ đầy đủ trường, không chấm cảm xúc." },
      { part: "Chặng 3", title: "Hồ sơ cuốn sách", idea: "Thông tin thư mục, tóm tắt bằng lời học sinh và từ khóa.", assessment: "Kiểm tra cấu trúc và nguồn." },
      { part: "Chặng 4", title: "Dấu trang bằng chứng", idea: "Trích rất ngắn kèm vị trí và lí do lựa chọn.", assessment: "Kiểm tra mức liên quan và bản quyền." },
      { part: "Chặng 5", title: "Sáng tạo cùng sách", idea: "Tranh, sơ đồ, thư nhân vật, kết thúc khác hoặc truyện tranh ngắn.", assessment: "Rubric mô tả, không chấm nghệ thuật tự động." },
      { part: "Chặng 6", title: "Ngày hội với sách", idea: "Giới thiệu sản phẩm và một vấn đề đời sống gợi ra từ sách.", assessment: "Checklist trình bày–lắng nghe–phản hồi." },
    ],
    gameTitles: ["Chọn sách an toàn", "Nhật kí đọc", "Hồ sơ cuốn sách", "Dấu trang bằng chứng", "Rubric sáng tạo", "Ngày hội với sách"],
    rubric: "Bài 10 là hồ sơ dự án: chỉ cấu trúc, nguồn, trình tự và độ đầy đủ được kiểm tra khách quan; sở thích, cảm xúc và giá trị nghệ thuật không chấm tự động.",
    privacyNote: "Không tải nội dung sách, ảnh cá nhân hoặc ghi âm lên mạng; chia sẻ sản phẩm chỉ khi phụ huynh/giáo viên cho phép.",
  },
  {
    id: "vietnamese6-s2-review", courseId: "vietnamese-6-semester-2", semester: 2, label: "Ôn tập II",
    title: "Ôn tập học kỳ II", pages: "trang 108", genre: "Tổng hợp học kỳ", visual: "review", readings: ["Bài 6–10"],
    lead: "Kết nối truyền thuyết, cổ tích, nghị luận, thông tin đa phương thức và hồ sơ đọc sách.",
    objectives: ["Hệ thống loại văn bản học kỳ II.", "Ghép đặc điểm với bằng chứng.", "Ôn kiến thức tiếng Việt theo lỗi.", "Chọn quy trình viết và nói phù hợp.", "Tự xây kế hoạch ôn cá nhân."],
    concepts: [
      c("Đọc", "Phân biệt truyền thuyết, cổ tích, nghị luận và thông tin dựa vào đâu?", "Mục đích, cấu trúc, dấu hiệu thể loại và cách dùng bằng chứng", ["Chỉ độ dài", "Chỉ tên văn bản", "Chỉ có hay không có hình"], "Mỗi loại có hệ dấu hiệu; cần kết hợp thay vì dựa một đặc điểm.", "GENRE_CONFUSION"),
      c("Đọc", "Ghép văn bản–đặc điểm–thông điệp cần thêm gì?", "Chi tiết hoặc cấu trúc làm bằng chứng", ["Cảm giác chung", "Tên tác giả bất kì", "Số trang"], "Bằng chứng giúp tránh ghép theo trí nhớ mơ hồ.", "EVIDENCE_MISSING"),
      c("Đọc", "Khi so sánh hai loại văn bản, cần làm gì trước?", "Chọn cùng một tiêu chí", ["Chọn văn bản dài hơn", "Đếm dấu câu", "Chỉ nêu khác nhau"], "Có thể so mục đích, cấu trúc, người kể, bằng chứng hoặc phương tiện biểu đạt.", "COMPARE_CRITERIA"),
      c("Tiếng Việt", "Trạm ôn cá nhân nên ưu tiên điều gì?", "Loại lỗi và câu đã bỏ qua hoặc có điểm thấp", ["Mọi kiến thức như nhau", "Chỉ câu đã đúng", "Chỉ thuật ngữ dễ nhớ"], "Ôn theo bằng chứng tiến độ giúp tập trung vào trạng ngữ, từ mượn, nghĩa từ hoặc dấu câu đang yếu.", "ERROR_REVIEW"),
      c("Viết", "Quy trình viết thay đổi theo yếu tố nào?", "Mục đích, kiểu văn bản, người đọc và bằng chứng cần dùng", ["Màu bìa", "Một mẫu cho mọi bài", "Số lần bấm trợ giúp"], "Thuật sự kiện, kể theo vai, nghị luận, biên bản và hồ sơ sách có cấu trúc khác nhau.", "TOPIC_DRIFT"),
      c("Nói–nghe", "So sánh nhiệm vụ nói–nghe nên xét gì?", "Mục đích, vai người nói/nghe, loại căn cứ và cách phản hồi", ["Chỉ thời lượng", "Chỉ âm lượng", "Sở thích của người chấm"], "Kể, trình bày ý kiến, thảo luận và giới thiệu sách cần chiến lược giao tiếp khác nhau.", "RUBRIC_USE"),
    ],
    partIdeas: parts("Ma trận truyền thuyết–cổ tích–nghị luận–thông tin–nghị luận văn học.", "Trạm nghĩa từ, dấu chấm phẩy, trạng ngữ, lựa chọn từ/câu và từ mượn.", "Ghép năm kiểu sản phẩm với mục đích, quy trình và rubric.", "So sánh kể theo vai, trình bày ý kiến, thảo luận và giới thiệu sách.", "Bài tổng hợp thích ứng từ 5 câu bỏ qua và 5 năng lực yếu."),
    gameTitles: ["Ma trận loại văn bản", "Văn bản và bằng chứng", "So sánh có tiêu chí", "Trạm tiếng Việt", "Ghép kiểu viết", "Kế hoạch ôn cá nhân"],
    rubric: "Ôn tập chỉ chấm phần có đáp án xác định; quan điểm, sở thích đọc và sản phẩm sáng tạo dùng rubric mô tả.",
    privacyNote: "Bài tổng hợp dùng tình huống nguyên bản, không thu dữ liệu cá nhân hoặc nội dung sách học sinh đang đọc.",
  },
];

export const VIETNAMESE_S1_BRANCHES = VIETNAMESE_LESSONS.filter(item => item.courseId === "vietnamese-6-semester-1");
export const VIETNAMESE_S2_BRANCHES = VIETNAMESE_LESSONS.filter(item => item.courseId === "vietnamese-6-semester-2");
export const VIETNAMESE_BY_ID = Object.fromEntries(VIETNAMESE_LESSONS.map(item => [item.id, item]));

const GAME_IDS: VietnameseGameId[] = ["trace", "organize", "infer", "language", "compose", "communicate"];
const GAME_ICONS = ["🔎", "🧭", "🔗", "🧪", "✍️", "🎙️"];
const GAME_DESCRIPTIONS = ["Tìm dấu hiệu và chi tiết đúng.", "Tổ chức trình tự, cấu trúc hoặc tiêu chí.", "Đi từ bằng chứng tới kết luận.", "Phân tích và sửa cách dùng tiếng Việt.", "Lập ý, chọn cách diễn đạt và tự sửa.", "Trình bày, lắng nghe và phản hồi có căn cứ."];
const LEVELS = ["Cơ bản", "Cơ bản", "Cơ bản", "Thông hiểu", "Thông hiểu", "Thông hiểu", "Thông hiểu", "Vận dụng", "Vận dụng", "Thử thách"];
const SETTINGS = ["thẻ dấu hiệu", "đoạn nguyên bản ngắn", "sơ đồ", "bảng đối chiếu", "phiếu biên tập", "tình huống lớp học", "hồ sơ đọc", "bản nháp", "nhiệm vụ mới", "nhiệm vụ tổng hợp"];
const PROMPT_FRAMES = [
  "Chọn phương án hoàn thành đúng nhiệm vụ", "Tìm đáp án có dấu hiệu rõ nhất", "Chọn kết luận không vượt quá dữ kiện", "Đối chiếu khái niệm rồi chọn", "Tìm phương án có thể giải thích bằng bằng chứng", "Loại phương án chỉ dựa vào cảm giác", "Chọn cách làm đúng quy trình", "Vận dụng quy tắc vào tình huống", "Chọn cách sửa có lí do", "Chọn phương án đồng thời đúng nội dung và cách làm",
];

function choose4(answer: string, candidates: string[], seed: number) {
  const unique = [answer, ...candidates].filter((value, index, array) => value && array.indexOf(value) === index);
  let fallback = 0;
  while (unique.length < 4) unique.push(`Phương án chưa đủ căn cứ ${++fallback}`);
  const options = unique.slice(0, 4);
  const offset = seed % 4;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

function wrongFeedback(fact: VietnameseConcept, correct: string, wrong: string) {
  return `Lỗi ${fact.errorCode}: “${wrong}” không đáp ứng đúng nhiệm vụ. Vì sao sai: ${fact.explanation} Cách sửa: gạch từ khóa trong câu hỏi, tìm bằng chứng hoặc quy tắc rồi chọn “${correct}”. Ôn lại thẻ: ${fact.part} – ${fact.answer}.`;
}

function makeRound(spec: VietnameseLessonSpec, gameId: VietnameseGameId, index: number): CommonRound {
  const gameIndex = GAME_IDS.indexOf(gameId);
  const fact = spec.concepts[(index + gameIndex) % spec.concepts.length];
  const next = spec.concepts[(index + gameIndex + 1) % spec.concepts.length];
  let answer = fact.answer;
  let candidates = [...fact.distractors];
  let prompt = `${PROMPT_FRAMES[index]}: ${fact.cue}`;
  let explanation = fact.explanation;
  if (gameId === "organize") prompt = `${PROMPT_FRAMES[index]}. Khi tổ chức ${fact.part.toLowerCase()}: ${fact.cue}`;
  if (gameId === "infer") {
    prompt = `Từ yêu cầu “${fact.cue}”, lí do nào làm căn cứ phù hợp nhất?`;
    answer = fact.explanation;
    candidates = spec.concepts.filter(item => item !== fact).slice(0, 3).map(item => item.explanation) as [string, string, string];
    explanation = `Căn cứ phù hợp phải trả lời trực tiếp yêu cầu. ${fact.explanation}`;
  }
  if (gameId === "language") prompt = `${PROMPT_FRAMES[index]}. Trong phòng thí nghiệm ngôn ngữ: ${fact.cue}`;
  if (gameId === "compose") {
    prompt = `Trong ${SETTINGS[index]}, lựa chọn nào vừa đúng ý vừa đúng cách làm: ${fact.cue}`;
    answer = `${fact.answer} — ${fact.explanation}`;
    candidates = [`${fact.distractors[0]} — không cần căn cứ`, `${fact.answer} — chỉ cần chép mẫu`, `${next.answer} — ${fact.explanation}`];
  }
  if (gameId === "communicate") {
    prompt = `Khi trình bày hoặc phản hồi nhiệm vụ “${fact.cue}”, cách nào rõ ràng và tôn trọng nhất?`;
    answer = `${fact.answer}; nêu căn cứ ngắn và lắng nghe phản hồi`;
    candidates = [`${fact.distractors[0]}; khẳng định không cần lí do`, `${fact.answer}; công kích người có ý khác`, `${next.answer}; bỏ qua yêu cầu chính`];
  }
  const options = choose4(answer, candidates, index + gameIndex * 3);
  return {
    id: `${gameId}-${index + 1}`,
    source_status: "ai-generated",
    context: `${LEVELS[index]} · ${SETTINGS[index]} · ${spec.label} · ${fact.part}`,
    context_vi: `Mức ${LEVELS[index].toLowerCase()}. Nội dung luyện tập mới bám mục tiêu ${fact.part.toLowerCase()} của “${spec.title}”, không phải câu chép từ tác phẩm.`,
    prompt,
    prompt_vi: "Xác định động từ yêu cầu, tìm dấu hiệu hoặc bằng chứng, rồi chọn một phương án. Nếu sai, đọc đủ nguyên nhân và cách sửa.",
    options,
    answer,
    explanation_vi: explanation,
    wrong_feedback: Object.fromEntries(options.filter(option => option !== answer).map(option => [option, wrongFeedback(fact, answer, option)])),
  };
}

export type BuiltVietnameseLesson = {
  spec: VietnameseLessonSpec;
  foundations: Array<{ title: string; items: Array<{ text: string; translation: string; speechText: string }> }>;
  rounds: Record<VietnameseGameId, CommonRound[]>;
  help: Record<VietnameseGameId, { source_title: string; teaching_vi: string; steps: string[] }>;
  meta: GameMeta<VietnameseGameId>[];
};

export function buildVietnameseLesson(spec: VietnameseLessonSpec): BuiltVietnameseLesson {
  const rounds = Object.fromEntries(GAME_IDS.map(id => [id, Array.from({ length: 10 }, (_, index) => makeRound(spec, id, index))])) as Record<VietnameseGameId, CommonRound[]>;
  const foundations = [
    { title: "Dấu hiệu và kiến thức cốt lõi", items: spec.concepts.map(item => ({ text: `${item.part}: ${item.cue}`, translation: `${item.answer}. ${item.explanation}`, speechText: `${item.part}. ${item.cue} ${item.answer}. ${item.explanation}` })) },
    { title: "Cách suy nghĩ và tự kiểm tra", items: spec.concepts.map((item, index) => ({ text: `Bước ${index + 1}: ${item.answer}`, translation: `Tự hỏi: phương án của em có đúng yêu cầu, có căn cứ và không vượt quá văn bản không? ${item.explanation}`, speechText: `Bước ${index + 1}. ${item.answer}. ${item.explanation}` })) },
  ];
  const help = Object.fromEntries(GAME_IDS.map((id, index) => [id, {
    source_title: `SGK Ngữ văn 6 Kết nối tri thức · ${spec.label} · ${spec.pages}; câu luyện tập mới, không sao chép tác phẩm`,
    teaching_vi: `${spec.gameTitles[index]}: ${spec.lead}`,
    steps: [
      "Gạch động từ yêu cầu và xác định phần Đọc, Tiếng Việt, Viết hay Nói–nghe.",
      id === "infer" ? "Đi theo bậc: chi tiết hoặc quy tắc → điều quan sát được → suy luận; không đoán cảm tính." : id === "communicate" ? "Tách ý kiến khỏi người nói; nêu lí do, bằng chứng và phản hồi tôn trọng." : "Tìm dấu hiệu, từ khóa hoặc bằng chứng trực tiếp trước khi chọn.",
      id === "compose" ? "Đối chiếu rubric: đúng yêu cầu, tổ chức, căn cứ/chi tiết, diễn đạt và tự sửa." : "Loại phương án quá rộng, lạc đề hoặc không có căn cứ.",
      "Tự kiểm tra: câu trả lời có đúng nhiệm vụ, đúng ngữ cảnh và không biến cảm xúc/quan điểm thành một đáp án bắt buộc không?",
    ],
  }])) as BuiltVietnameseLesson["help"];
  const meta = GAME_IDS.map((id, index) => ({ id, icon: GAME_ICONS[index], title: spec.gameTitles[index], description: GAME_DESCRIPTIONS[index], activityId: `${spec.id}-${id}` }));
  return { spec, foundations, rounds, help, meta };
}
