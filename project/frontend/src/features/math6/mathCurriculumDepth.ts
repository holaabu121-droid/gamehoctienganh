import type { CommonRound, GameMeta } from "../skills-common/SkillsSection";
import type { FoundationItem } from "../skills-common/learningUx";

export const MATH_LEVEL_SEQUENCE = [
  "Cơ bản", "Cơ bản", "Cơ bản",
  "Thông hiểu", "Thông hiểu", "Thông hiểu", "Thông hiểu",
  "Vận dụng", "Vận dụng",
  "Thử thách",
] as const;

export const MATH_REPRESENTATIONS = [
  "Kí hiệu", "Lời nói", "Phép tính", "Bảng", "Sơ đồ",
  "Dòng biến đổi", "Lời giải học sinh", "Tình huống", "Tìm ẩn", "Quyết định",
] as const;

export const MATH_COMPETENCIES = [
  { key: "concept", title: "Nhận biết khái niệm", description: "Nhận ra đúng dữ kiện, kí hiệu và tính chất." },
  { key: "apply", title: "Thực hiện quy trình", description: "Thực hiện đúng từng bước và tự kiểm tra." },
  { key: "reason", title: "Lập luận – giải thích", description: "Nêu căn cứ nối dữ kiện với kết luận." },
  { key: "error", title: "Phân tích – sửa sai", description: "Tìm bước sai đầu tiên và sửa đúng nguyên nhân." },
  { key: "mixed", title: "Kết nối – tổng hợp", description: "Phối hợp hai ý kiến thức trong một nhiệm vụ." },
  { key: "challenge", title: "Vận dụng – thử thách", description: "Chuyển kiến thức sang quyết định hoặc tình huống mới." },
] as const;

export type MathVisualMode = "set" | "place-value" | "operation" | "factor" | "number-line" | "shape" | "symmetry" | "fraction" | "decimal" | "line-angle" | "data" | "probability" | "applied";

type TopicProfile = {
  mode: MathVisualMode;
  focus: string;
  model: string;
  procedure: string;
  check: string;
  commonError: string;
};

type LessonIdentity = { id: string; title: string; chapter: string; lead: string };

const includesAny = (value: string, words: string[]) => words.some((word) => value.includes(word));

export function getMathTopicProfile(identity: LessonIdentity): TopicProfile {
  const text = `${identity.title} ${identity.lead}`.toLocaleLowerCase("vi");
  if (includesAny(text, ["ôn tập cuối năm"])) return { mode: "applied", focus: "lựa chọn và kết nối mô hình từ nhiều mạch toán", model: "bản đồ quyết định theo dạng bài", procedure: "nhận diện mạch kiến thức, chọn mô hình phù hợp, giải rồi kiểm tra chéo", check: "đối chiếu kết quả với điều kiện của đúng mạch kiến thức", commonError: "dùng một công thức quen thuộc cho mọi dạng bài" };
  if (includesAny(text, ["xác suất", "sự kiện", "thí nghiệm", "đồng xu", "xúc xắc"])) return { mode: "probability", focus: "kết quả có thể, sự kiện và tần suất thực nghiệm", model: "không gian kết quả và bảng số lần xuất hiện", procedure: "liệt kê kết quả, đếm số lần thuận lợi rồi lập tỉ số", check: "xác suất phải từ 0 đến 1", commonError: "đổi lẫn số lần xảy ra với tổng số lần thử" };
  if (includesAny(text, ["số thập phân", "phần trăm", "tỉ số", "tỉ số phần trăm"])) return { mode: "decimal", focus: "mối liên hệ phân số – thập phân – phần trăm", model: "lưới một trăm ô và thanh tỉ lệ", procedure: "đưa về cùng dạng biểu diễn rồi mới tính hoặc so sánh", check: "ước lượng giá trị phải nằm trong khoảng hợp lí", commonError: "dịch dấu phẩy hoặc đổi phần trăm sai hai chữ số" };
  if (includesAny(text, ["tập hợp các số nguyên", "số nguyên", "số đối", "giá trị tuyệt đối", "cộng và phép trừ số nguyên", "nhân số nguyên", "dấu ngoặc"])) return { mode: "number-line", focus: "vị trí, khoảng cách và dấu của số nguyên", model: "trục số có điểm chuyển động", procedure: "xác định dấu, độ lớn rồi di chuyển hoặc tính theo quy tắc", check: "ước lượng vị trí và dấu trước khi chốt", commonError: "bỏ dấu âm hoặc nhầm hướng trên trục số" };
  if (includesAny(text, ["tập hợp", "phần tử"])) return { mode: "set", focus: "đối tượng và điều kiện thuộc tập hợp", model: "khoanh nhóm hoặc ngoặc nhọn", procedure: "xác định điều kiện, kiểm từng phần tử rồi viết kí hiệu", check: "kiểm tra không thiếu, không thừa và không lặp", commonError: "nhầm phần tử với tên tập hợp hoặc bỏ sót điều kiện" };
  if (includesAny(text, ["ghi số", "hệ thập phân", "số la mã", "số tự nhiên"])) return { mode: "place-value", focus: "giá trị theo hàng và cách biểu diễn số", model: "bảng hàng và thẻ chữ số", procedure: "tách số theo hàng, đọc từ hàng lớn đến hàng nhỏ rồi ghép lại", check: "đối chiếu từng chữ số với đúng hàng", commonError: "đọc đúng chữ số nhưng sai giá trị theo vị trí" };
  if (includesAny(text, ["chia hết", "nguyên tố", "ước chung", "bội chung", "ucln", "bcnn"])) return { mode: "factor", focus: "ước, bội và cấu tạo thừa số", model: "cây thừa số hoặc lưới nhóm bằng nhau", procedure: "phân tích dữ kiện, chọn ước/bội phù hợp rồi kiểm điều kiện", check: "nhân hoặc chia ngược để xác nhận", commonError: "đổi lẫn ước với bội hoặc chọn sai số mũ chung" };
  if (includesAny(text, ["tam giác", "hình vuông", "hình chữ nhật", "hình thoi", "hình bình hành", "hình thang", "hình phẳng", "chu vi", "diện tích", "đa giác"])) return { mode: "shape", focus: "cạnh, góc, đường chéo và đại lượng đo", model: "hình có nhãn kích thước", procedure: "nhận dạng hình, chọn đúng dữ kiện rồi dùng công thức tương ứng", check: "kiểm tra đơn vị dài hay đơn vị vuông", commonError: "dùng công thức chu vi cho diện tích hoặc ngược lại" };
  if (includesAny(text, ["đối xứng"])) return { mode: "symmetry", focus: "điểm và hình ảnh qua trục hoặc tâm đối xứng", model: "lưới gấp hình và cặp điểm đối xứng", procedure: "xác định trục/tâm, đo khoảng cách rồi đặt ảnh phía đối diện", check: "gấp hoặc quay hình để hai phần trùng nhau", commonError: "giữ đúng khoảng cách nhưng đặt sai phía" };
  if (includesAny(text, ["phân số", "hỗn số"])) return { mode: "fraction", focus: "phần bằng nhau, tử số, mẫu số và giá trị phân số", model: "thanh phân số và trục số", procedure: "xác định đơn vị, quy đồng hoặc biến đổi cả tử lẫn mẫu", check: "dùng tích chéo hoặc quy về cùng mẫu", commonError: "chỉ biến đổi tử hoặc mẫu" };
  if (includesAny(text, ["điểm và đường", "điểm nằm", "đường thẳng", "tia", "đoạn thẳng", "trung điểm", "góc"])) return { mode: "line-angle", focus: "quan hệ điểm–đường–tia–đoạn và số đo góc", model: "hình dựng có điểm, tia và cung đo", procedure: "đọc đúng tên hình, xác định thứ tự điểm rồi đo hoặc tính", check: "đối chiếu vị trí, độ dài và loại góc", commonError: "đảo thứ tự điểm hoặc đặt sai tâm/vạch 0 của thước" };
  if (includesAny(text, ["dữ liệu", "thống kê", "biểu đồ", "khảo sát"])) return { mode: "data", focus: "dữ liệu, tần số, thang đo và bằng chứng", model: "bảng dữ liệu nối với biểu đồ", procedure: "đọc chú giải và thang đo, lấy đúng giá trị rồi tính", check: "đối chiếu tổng tần số và đơn vị", commonError: "đọc chiều cao cột mà bỏ qua thang đo hoặc chú giải" };
  if (includesAny(text, ["chi tiêu", "geogebra", "thực hành", "trải nghiệm", "ôn tập cuối năm"])) return { mode: "applied", focus: "lựa chọn mô hình toán phù hợp tình huống", model: "bảng kế hoạch và sơ đồ quyết định", procedure: "xác định mục tiêu, chọn dữ kiện cần, tính rồi diễn giải", check: "đối chiếu kết quả với điều kiện thực tế", commonError: "tính đúng nhưng trả lời không đúng câu hỏi thực tế" };
  return { mode: "operation", focus: "phép tính, thứ tự và mối quan hệ giữa các đại lượng", model: "dòng biến đổi theo từng bước", procedure: "đọc biểu thức, chọn quy tắc ưu tiên rồi tính từng bước", check: "thử lại bằng phép tính ngược hoặc ước lượng", commonError: "nhảy bước hoặc dùng sai thứ tự thực hiện" };
}

const errorKinds = [
  "nhận diện sai dữ kiện quyết định", "dùng sai quy tắc", "bỏ qua điều kiện áp dụng",
  "đảo thứ tự thao tác", "nhầm kí hiệu với giá trị", "tính đúng một bước nhưng kết luận sai",
  "không kiểm tra đơn vị hoặc dạng kết quả", "suy luận từ một trường hợp riêng",
  "chưa đối chiếu lại bằng cách thứ hai", "chọn phương án gần đúng thay vì đúng",
];

export function buildDiagnosticFeedback(round: CommonRound, identity: LessonIdentity, gameIndex: number, roundIndex: number): Record<string, string> {
  const profile = getMathTopicProfile(identity);
  const wrong = round.options.filter((option) => option.trim() !== round.answer.trim());
  return Object.fromEntries(wrong.map((option, optionIndex) => [option,
    `Em chọn “${option}”. Lỗi: ${errorKinds[(gameIndex * 3 + roundIndex + optionIndex) % errorKinds.length]}; với bài này lỗi thường gặp là ${profile.commonError}. Vì sao sai: phương án không dẫn đến “${round.answer}”; ${round.explanation_vi} Cách sửa: ${profile.procedure}, sau đó ${profile.check}. Ôn lại thẻ “${identity.title} · ${profile.focus}”.`,
  ]));
}

const firstWrong = (round: CommonRound, offset = 0) => {
  const wrong = round.options.filter((option) => option.trim() !== round.answer.trim());
  return wrong[offset % wrong.length] ?? "phương án chưa đúng";
};

function transformCompetencyRound(
  item: CommonRound,
  companion: CommonRound,
  gameIndex: number,
  roundIndex: number,
): CommonRound {
  if (gameIndex < 2) return item;

  const wrongA = firstWrong(item, roundIndex);
  const wrongB = firstWrong(item, roundIndex + 1);
  const companionWrong = firstWrong(companion, roundIndex + 2);

  if (gameIndex === 2) {
    const answer = `Đúng, vì ${item.explanation_vi}`;
    return {
      ...item,
      source_status: "ai-generated",
      prompt: `Vì sao “${item.answer}” là đáp án đúng cho câu: ${item.prompt}`,
      prompt_vi: "Chọn lời giải thích dùng đúng dữ kiện và quy tắc, không chỉ chọn lại kết quả.",
      options: [
        answer,
        `Vì “${item.answer}” xuất hiện trước các phương án khác.`,
        `Vì có thể bỏ qua điều kiện của đề và vẫn chọn “${item.answer}”.`,
        `Vì ${wrongA} và ${item.answer} luôn có cùng giá trị.`,
      ],
      answer,
      explanation_vi: `Kết quả đúng phải đi cùng căn cứ: ${item.explanation_vi}`,
    };
  }

  if (gameIndex === 3) {
    const answer = `Sai; sửa thành “${item.answer}” vì ${item.explanation_vi}`;
    return {
      ...item,
      source_status: "ai-generated",
      context: `${item.context} · Bài làm của bạn: ${wrongA}`,
      prompt: `Một bạn chọn “${wrongA}” cho câu “${item.prompt}”. Cách sửa nào đúng?`,
      prompt_vi: "Tìm nguyên nhân sai đầu tiên, sau đó chọn cách sửa cả kết quả lẫn lập luận.",
      options: [
        answer,
        `Đúng; giữ nguyên “${wrongA}”.`,
        `Sai; sửa thành “${wrongB}” nhưng không cần giải thích.`,
        "Không thể kiểm tra bằng dữ kiện của đề.",
      ],
      answer,
      explanation_vi: `“${wrongA}” sai. ${item.explanation_vi}`,
    };
  }

  if (gameIndex === 4) {
    const answer = `Kết quả A: ${item.answer}; kết quả B: ${companion.answer}`;
    return {
      ...item,
      source_status: "ai-generated",
      context: `${item.context} · Kết nối với: ${companion.context}`,
      prompt: `Giải đồng thời hai yêu cầu. A) ${item.prompt} B) ${companion.prompt}`,
      prompt_vi: "Tách hai yêu cầu, giải từng phần rồi chọn cặp kết quả đúng theo đúng thứ tự A–B.",
      options: [
        answer,
        `Kết quả A: ${wrongA}; kết quả B: ${companion.answer}`,
        `Kết quả A: ${item.answer}; kết quả B: ${companionWrong}`,
        `Kết quả A: ${wrongB}; kết quả B: ${companionWrong}`,
      ],
      answer,
      explanation_vi: `Phần A: ${item.explanation_vi} Phần B: ${companion.explanation_vi}`,
    };
  }

  const answer = `Chọn “${item.answer}”, vì ${item.explanation_vi}`;
  return {
    ...item,
    source_status: "ai-generated",
    context: `Quyết định trong tình huống mới · ${item.context}`,
    prompt: `Em cần đưa ra quyết định có căn cứ cho câu “${item.prompt}”. Phương án nào đầy đủ nhất?`,
    prompt_vi: "Chọn đồng thời kết quả và căn cứ; kiểm tra xem kết luận có trả lời đúng tình huống hay không.",
    options: [
      answer,
      `Chọn “${wrongA}”, vì ${item.explanation_vi}`,
      `Chọn “${item.answer}”, vì không cần dùng dữ kiện của đề.`,
      `Chọn “${wrongB}”, vì kết quả gần đúng là đủ.`,
    ],
    answer,
    explanation_vi: `Quyết định đúng gồm cả kết quả và căn cứ: ${item.explanation_vi}`,
  };
}

export function deepenMathRounds<Id extends string>(
  rounds: Record<Id, CommonRound[]>,
  gameIds: Id[],
  identity: LessonIdentity,
  options: { transformCompetencies?: boolean } = {},
): Record<Id, CommonRound[]> {
  return Object.fromEntries(gameIds.map((gameId, gameIndex) => [gameId, rounds[gameId].map((item, roundIndex) => {
    const competency = MATH_COMPETENCIES[gameIndex];
    const level = MATH_LEVEL_SEQUENCE[roundIndex];
    const representation = MATH_REPRESENTATIONS[roundIndex];
    const companionId = gameIds[roundIndex % Math.min(2, gameIds.length)];
    const companionBank = rounds[companionId] ?? rounds[gameId];
    const companion = companionBank[roundIndex % companionBank.length] ?? item;
    const competencyItem = options.transformCompetencies
      ? transformCompetencyRound(item, companion, gameIndex, roundIndex)
      : item;
    const next = {
      ...competencyItem,
      context: `${level} · ${representation} · ${competencyItem.context}`,
      context_vi: `${competencyItem.context_vi ?? identity.lead} Mức ${level.toLocaleLowerCase("vi")}; biểu diễn bằng ${representation.toLocaleLowerCase("vi")}.`,
      prompt: `${competency.title} · ${representation}: ${competencyItem.prompt}`,
      prompt_vi: `${competency.description} ${competencyItem.prompt_vi ?? "Chọn đáp án đúng và đối chiếu cách làm."}`,
    };
    return { ...next, wrong_feedback: buildDiagnosticFeedback(next, identity, gameIndex, roundIndex) };
  })])) as Record<Id, CommonRound[]>;
}

export function deepenMathMeta<Id extends string>(meta: GameMeta<Id>[]): GameMeta<Id>[] {
  return meta.map((item, index) => ({ ...item, title: MATH_COMPETENCIES[index].title, description: `${MATH_COMPETENCIES[index].description} Chủ đề gốc: ${item.title}.` }));
}

export function buildMathDeepHelp<Id extends string>(gameIds: Id[], identity: LessonIdentity, sourceTitle: string): Record<Id, { source_title: string; teaching_vi: string; steps: string[] }> {
  const profile = getMathTopicProfile(identity);
  return Object.fromEntries(gameIds.map((gameId, index) => {
    const competency = MATH_COMPETENCIES[index];
    const competencyStep = [
      `Khoanh dữ kiện quyết định và gọi tên đúng ${profile.focus}.`,
      `Dùng ${profile.model}; thực hiện: ${profile.procedure}.`,
      `Nói thành câu “Dữ kiện … nên …”; căn cứ phải là quy tắc của ${identity.title}.`,
      `So sánh lời giải với ${profile.procedure}; dừng ở bước sai đầu tiên thay vì chỉ sửa đáp số.`,
      `Tách hai nhiệm vụ, giải riêng, rồi nối bằng dữ kiện hoặc quy tắc chung.`,
      `Mô hình hóa tình huống bằng ${profile.model}, tính và diễn giải kết quả theo ngữ cảnh.`,
    ][index];
    return [gameId, {
      source_title: sourceTitle,
      teaching_vi: `${competency.title}: trọng tâm là ${profile.focus}. ${identity.lead}`,
      steps: [competencyStep, `Lỗi cần tránh: ${profile.commonError}.`, `Tự kiểm tra: ${profile.check}; sau đó giải thích vì sao kết quả phù hợp.`],
    }];
  })) as Record<Id, { source_title: string; teaching_vi: string; steps: string[] }>;
}

const asFoundation = (text: string, translation: string): FoundationItem => ({ text, translation, speechText: `${text} ${translation}` });

export function expandMathFoundations(source: Array<{ title: string; items: FoundationItem[] }>, rounds: Record<string, CommonRound[]>, identity: LessonIdentity): Array<{ title: string; items: FoundationItem[] }> {
  const profile = getMathTopicProfile(identity);
  const firstRounds = Object.values(rounds).map((bank) => bank[0]).filter(Boolean);
  const original = source.flatMap((block) => block.items).slice(0, 6);
  const pick = (index: number) => firstRounds[index % firstRounds.length];
  const cards: FoundationItem[] = [
    original[0] ?? asFoundation(`Khái niệm: ${identity.title}`, identity.lead),
    original[1] ?? asFoundation(`Mô hình: ${profile.model}`, `Dùng mô hình để thấy ${profile.focus}.`),
    original[2] ?? asFoundation(`Quy tắc 1: ${profile.procedure}`, `Thực hiện chậm và giữ đúng điều kiện của ${identity.title}.`),
    original[3] ?? asFoundation(`Quy tắc 2: ${profile.check}`, "Luôn dành một bước để tự kiểm tra."),
    asFoundation(`Ví dụ mẫu A: ${pick(0)?.prompt ?? identity.title}`, pick(0)?.explanation_vi ?? identity.lead),
    asFoundation(`Ví dụ mẫu B: ${pick(1)?.prompt ?? profile.focus}`, pick(1)?.explanation_vi ?? profile.procedure),
    asFoundation(`Lỗi thường gặp A: ${profile.commonError}`, `Quay lại ${profile.model} và tìm bước sai đầu tiên.`),
    asFoundation(`Lỗi thường gặp B: đáp số không đúng dạng`, `Kiểm tra kí hiệu, điều kiện và đơn vị trước khi chốt.`),
    asFoundation(`Tự kiểm tra 1: ${pick(2)?.prompt ?? profile.check}`, `Che đáp án, làm lại rồi dùng cách kiểm tra: ${profile.check}.`),
    asFoundation(`Tự kiểm tra 2: giải thích kết quả`, `Nói rõ dữ kiện, quy tắc và kết luận của bài ${identity.title}.`),
  ];
  return [
    { title: "Nền tảng và mô hình", items: cards.slice(0, 2) },
    { title: "Quy tắc và quy trình", items: cards.slice(2, 4) },
    { title: "Ví dụ có hướng dẫn", items: cards.slice(4, 6) },
    { title: "Chẩn đoán lỗi", items: cards.slice(6, 8) },
    { title: "Tự kiểm tra", items: cards.slice(8, 10) },
  ];
}

