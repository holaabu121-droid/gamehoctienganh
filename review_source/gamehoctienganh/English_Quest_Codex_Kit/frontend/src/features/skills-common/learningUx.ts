export type FoundationItem = string | { text: string; translation?: string; englishGuide?: string; pronunciationVi?: string; speechText?: string; detailLabel?: string };

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableShuffle<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  let state = hashSeed(seed) || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function firstUnfinishedQuestion(totalQuestions: number, priorQuestions: ReadonlyArray<{ question_index: number }>) {
  const saved = new Set(priorQuestions.map((question) => question.question_index));
  for (let index = 0; index < totalQuestions; index += 1) if (!saved.has(index)) return index;
  return 0;
}

const VIETNAMESE_HINT = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
const FOUNDATION_ENGLISH_GUIDES: Record<string, string> = {
  "Nhận biết âm khác bằng phần âm được gạch chân và nhóm từ theo /b/ hoặc /p/.": "Identify the different sound from the underlined part, and group words by the sounds /b/ and /p/.",
  "Ghép động từ play, do, have, study với từ phù hợp.": "Match the verbs play, do, have, and study with the correct nouns.",
  "Chọn giới từ vị trí và phân biệt hiện tại đơn với hiện tại tiếp diễn.": "Choose prepositions of place, and distinguish the present simple from the present continuous.",
  "Đọc email và bài giới thiệu trường để tìm từ khóa trước khi chọn đáp án.": "Read the email and the school introduction. Find the key words before choosing an answer.",
  "Phần nghe dùng script luyện tập mới vì ảnh không cung cấp Track 22.": "The listening activity uses a new practice script because Track twenty-two was not provided.",
  "Phần nói và viết dùng nhân vật hư cấu, không yêu cầu cung cấp thông tin thật của bạn học hoặc gia đình.": "The speaking and writing activities use fictional characters. Do not provide real information about classmates or family members.",
  "So sánh âm gạch chân trước khi chọn từ khác nhóm.": "Compare the underlined sounds before choosing the word that is different.",
  "Dùng cặp từ trái nghĩa của khu phố, thiên nhiên và lễ hội.": "Use pairs of opposites about neighbourhoods, nature, and festivals.",
  "Phân biệt some/any/many và dùng must, should, shouldn't theo ngữ cảnh.": "Distinguish some, any, and many. Use must, should, and shouldn't according to the context.",
  "Đọc Visit Singapore và tìm bằng chứng về Nature, Culture, Family.": "Read Visit Singapore and find evidence about nature, culture, and family activities.",
  "Track 45 không có trong ảnh nên game nghe dùng script luyện tập mới có nhãn AI.": "Track forty-five was not provided, so the listening game uses a new AI-labelled practice script.",
  "Viết về một khu phố hư cấu, không yêu cầu địa chỉ thật.": "Write about a fictional neighbourhood. Do not provide a real address.",
  "Ai? Bao nhiêu tuổi?": "Who is the person, and how old are they?",
  "Ở đâu? Khi nào?": "Where does it happen, and when does it happen?",
  "Hoạt động gì?": "What activity is taking place?",
  "Chi tiết nào là bằng chứng?": "Which detail is the evidence?",
  "Đọc câu hỏi trước.": "Read the question first.",
  "Khoanh từ khóa và tìm từ đồng nghĩa.": "Circle the key words and look for synonyms.",
  "Đọc cả câu chứa từ khóa.": "Read the complete sentence that contains the key word.",
  "Nếu câu sai, chỉ thay chi tiết sai.": "If the statement is false, change only the incorrect detail.",
  "Nhìn câu hỏi và dự đoán loại đáp án.": "Look at the question and predict the type of answer.",
  "Lượt đầu nghe ý chính.": "On the first listening, focus on the main idea.",
  "Lượt sau nghe chi tiết một từ hoặc một số.": "On the next listening, focus on a one-word answer or a number.",
  "Kiểm tra đáp án có đúng dạng được yêu cầu.": "Check that the answer is in the required form.",
  "Name · Tên": "Name.",
  "Looks · Ngoại hình": "Appearance.",
  "Personality · Tính cách": "Personality.",
  "Reason · Lý do quý mến": "The reason you like this person.",
  "Tìm từ chỉ tóc: long, short, curly, straight, black hoặc brown.": "Find words that describe hair: long, short, curly, straight, black, or brown.",
  "Tìm đặc điểm khuôn mặt: big eyes, small nose, round face hoặc glasses.": "Find facial features such as big eyes, a small nose, a round face, or glasses.",
  "Đối chiếu tất cả chi tiết với từng tên rồi mới chọn.": "Compare every detail with each name before choosing.",
  "He/She has + đặc điểm: She has long black hair.": "Use he or she has plus a feature. For example: She has long black hair.",
  "He/She is + tính từ: He is tall.": "Use he or she is plus an adjective. For example: He is tall.",
  "Câu hỏi đoán người: Who is he/she?": "Ask this question to identify a person: Who is he or she?",
  "Đọc hành động hoặc đặc điểm trước khi chọn từ.": "Read the action or feature before choosing a word.",
  "Phân biệt tính cách với ngoại hình.": "Distinguish personality from appearance.",
  "Dùng đúng mẫu Who has ...? và Does ... have ...?": "Use the patterns Who has ...? and Does ... have ...? correctly.",
  "Đang xảy ra: am/is/are + V-ing.": "For an action happening now, use am, is, or are plus a verb ending in I N G.",
  "Thói quen: hiện tại đơn với usually, every day.": "For a habit, use the present simple with markers such as usually and every day.",
  "Kiểm tra chủ ngữ, trợ động từ và dạng động từ.": "Check the subject, the auxiliary verb, and the verb form.",
  "Chọn ảnh hoặc tranh vẽ của một người bạn.": "Choose a photo or a drawing of a friend.",
  "Phỏng vấn để biết môn học, sách và hoạt động yêu thích.": "Interview the friend about favourite subjects, books, and activities.",
  "Viết đoạn ngắn về ngoại hình, tính cách và thông tin phỏng vấn.": "Write a short paragraph about appearance, personality, and information from the interview.",
  "Trang trí trang kỷ yếu, giới thiệu và nói về trang đó.": "Decorate the yearbook page, show it to the class, and talk about it.",
  "Ghép các trang lại thành một cuốn kỷ yếu lớp.": "Put the pages together to make a class yearbook.",
  "Hỏi: What is your favourite subject/book? What do you like doing?": "Ask: What is your favourite subject or book? What do you like doing?",
  "Mô tả: He/She has ...; He/She is ...; He/She likes ...": "Describe the person with these patterns: He or she has, he or she is, and he or she likes.",
  "Giới thiệu: This is ...; Let me tell you about my friend.": "Introduce the person with these patterns: This is ...; Let me tell you about my friend.",
  "Lượt 1: nghe địa điểm và đặc điểm chính.": "On the first listening, identify the place and its main feature.",
  "Lượt 2: nghe chi tiết likes/dislikes.": "On the second listening, identify details about likes and dislikes.",
  "Không chấm phát âm hoặc giọng nói.": "Pronunciation and the learner's voice are not graded.",
  "Nghe vị trí và đặc điểm Phu Quoc.": "Listen for the location and features of Phu Quoc.",
  "Nghe hoạt động và nơi tham quan.": "Listen for activities and places to visit."
};
const CORE_TRANSLATIONS: Record<string, string> = {
  "Hi, Vy.": "Chào Vy.", "Hi, Phong. Are you ready?": "Chào Phong. Bạn sẵn sàng chưa?", "Just a minute.": "Chờ một chút nhé.",
  "Oh, this is Duy, my new friend.": "Ồ, đây là Duy, người bạn mới của mình.", "Hi, Duy. Nice to meet you.": "Chào Duy. Rất vui được gặp bạn.",
  "Hi, Phong. I live near here, and we go to the same school.": "Chào Phong. Mình sống gần đây và chúng ta học cùng trường.",
  "Good. Hmm, your school bag looks heavy.": "Tốt quá. Ừm, cặp sách của bạn trông nặng nhỉ.",
  "Yes! I have new books, and we have new subjects to study.": "Đúng vậy! Mình có sách mới và chúng ta có các môn học mới.",
  "And a new uniform, Duy! You look smart!": "Và cả đồng phục mới nữa, Duy! Bạn trông thật bảnh!",
  "Thanks, Phong. We always look smart in our uniforms.": "Cảm ơn Phong. Chúng mình luôn trông gọn gàng trong bộ đồng phục.",
  "Let me put on my uniform. Then we can go.": "Để mình mặc đồng phục. Sau đó chúng ta có thể đi.",
  "Wow! Your room looks so big, Nick.": "Ôi! Phòng của bạn trông thật rộng, Nick.", "It's Elena's room. She's my sister.": "Đó là phòng của Elena. Cô ấy là chị/em gái mình.",
  "I see. Is there a TV behind you?": "Mình hiểu rồi. Có một chiếc TV phía sau bạn phải không?", "Yes, there is. Where do you live, Mi?": "Đúng vậy. Bạn sống ở đâu, Mi?",
  "I live in a town house. And you?": "Mình sống trong một ngôi nhà phố. Còn bạn?", "I live in a country house. Who do you live with?": "Mình sống trong một ngôi nhà ở nông thôn. Bạn sống cùng ai?",
  "My parents and younger brother. We're moving to a flat next month!": "Bố mẹ và em trai mình. Tháng tới gia đình mình sẽ chuyển đến một căn hộ!", "Are you?": "Thật vậy sao?",
  "Yes. My aunt lives near there, and I can play with my cousin.": "Đúng vậy. Dì mình sống gần đó và mình có thể chơi với anh/chị/em họ.",
  "Are there many rooms in your new flat?": "Căn hộ mới của bạn có nhiều phòng không?", "Yes, there are. There's a living room, three bedrooms, a kitchen and two bathrooms.": "Có. Có một phòng khách, ba phòng ngủ, một nhà bếp và hai phòng tắm.",
  "Wow! We're in Hoi An. I'm so excited.": "Ôi! Chúng ta đang ở Hội An. Mình rất hào hứng.", "Me too. It's so beautiful. Where shall we go first?": "Mình cũng vậy. Nơi đây thật đẹp. Chúng ta đi đâu trước nhỉ?",
  "Let's go to Chua Cau.": "Hãy đến Chùa Cầu.", "Well, but Tan Ky House is nearer. Shall we go there first?": "Nhưng nhà cổ Tấn Ký gần hơn. Chúng ta đến đó trước nhé?", "OK, sure.": "Được, chắc chắn rồi.",
  "First, cross the road, and then turn left.": "Trước tiên băng qua đường, sau đó rẽ trái.", "Fine, let's go.": "Được, đi thôi.", "Wait.": "Chờ đã.", "What's up, Phong?": "Có chuyện gì vậy, Phong?", "I think we're lost.": "Mình nghĩ chúng ta bị lạc rồi.",
  "Look, there's a girl. Let's ask her.": "Nhìn kìa, có một bạn gái. Hãy hỏi bạn ấy.", "Excuse me? Can you tell us the way to Tan Ky House?": "Xin lỗi, bạn có thể chỉ đường đến nhà cổ Tấn Ký không?",
  "Sure. Go straight. Take the second turning on the left, and then turn right.": "Được. Đi thẳng, rẽ trái ở ngã rẽ thứ hai rồi rẽ phải.", "Thank you.": "Cảm ơn bạn.",
  "Hello, welcome to our Geography Club.": "Xin chào, chào mừng đến với Câu lạc bộ Địa lý.", "Come in, Elena. We're just starting now. But remember you must always be on time.": "Vào đi, Elena. Chúng mình vừa bắt đầu. Nhưng hãy nhớ luôn đúng giờ.",
  "Sure. Sorry.": "Vâng. Mình xin lỗi.", "Today I'm going to talk about some natural wonders of Viet Nam.": "Hôm nay mình sẽ nói về một số kỳ quan thiên nhiên của Việt Nam.", "Great! What's that in the first picture?": "Tuyệt! Đó là gì trong bức tranh đầu tiên?",
  "It's Ganh Da Dia in Phu Yen.": "Đó là Ghềnh Đá Đĩa ở Phú Yên.", "Wow. It looks amazing!": "Ôi, trông thật tuyệt vời!", "Is picture 2 Ha Long Bay?": "Bức tranh số 2 là Vịnh Hạ Long phải không?", "Right. What do you know about it?": "Đúng rồi. Bạn biết gì về nơi đó?",
  "It has many islands.": "Nơi đó có nhiều hòn đảo.", "Yeah! The scenery is wonderful. This picture shows Tuan Chau, a large island.": "Đúng vậy! Phong cảnh rất tuyệt. Bức tranh này là Tuần Châu, một hòn đảo lớn.",
  "Phong, does Viet Nam celebrate New Years?": "Phong, Việt Nam có đón năm mới không?", "Yes, we do. We have Tet.": "Có. Chúng mình có Tết.", "When is Tet?": "Tết vào khi nào?", "At different times. This year, it's in January.": "Mỗi năm một thời điểm khác nhau. Năm nay Tết vào tháng Một.",
  "What do you do at Tet?": "Bạn làm gì vào dịp Tết?", "We clean our homes and decorate them with flowers.": "Chúng mình dọn nhà và trang trí bằng hoa.", "Is Tet a time for family gatherings?": "Tết có phải là thời gian sum họp gia đình không?",
  "Yes. It's a happy time for everybody.": "Đúng vậy. Đó là thời gian vui vẻ của mọi người.", "Great!": "Tuyệt!", "Yes, and another good thing about Tet is that children get lucky money.": "Đúng vậy, và một điều hay khác là trẻ em được nhận tiền lì xì.",
  "That sounds interesting. Is there anything special people should do?": "Nghe thú vị đấy. Mọi người có nên làm điều gì đặc biệt không?", "We should say Happy New Year when we meet people, and we shouldn't break anything.": "Khi gặp mọi người, chúng ta nên chúc mừng năm mới và không nên làm vỡ đồ.",
  "pencil sharpener": "gọt bút chì", compass: "com-pa", "school bag": "cặp sách", calculator: "máy tính", rubber: "cục tẩy", "pencil case": "hộp bút",
  "town house": "nhà phố", "country house": "nhà ở nông thôn", flat: "căn hộ", island: "hòn đảo", scenery: "phong cảnh", "natural wonder": "kỳ quan thiên nhiên",
  "lucky money": "tiền lì xì", "peach flowers": "hoa đào", "family gathering": "sum họp gia đình",
  "play football": "chơi bóng đá", "do homework": "làm bài tập về nhà", "do exercise": "tập thể dục hoặc làm bài tập",
  "have school lunch": "ăn trưa ở trường", "have lessons": "học các tiết học", "study English": "học môn Tiếng Anh",
  "study history": "học môn Lịch sử", "study science": "học môn Khoa học", "study music": "học môn Âm nhạc",
  hall: "sảnh", kitchen: "nhà bếp", bedroom: "phòng ngủ", bathroom: "phòng tắm", "living room": "phòng khách",
  lamp: "đèn", toilet: "bồn cầu", picture: "bức tranh", cupboard: "tủ đựng đồ", sink: "bồn rửa",
  sofa: "ghế sofa", dishwasher: "máy rửa bát", fridge: "tủ lạnh", shower: "vòi sen", "chest of drawers": "tủ ngăn kéo",
  square: "quảng trường", "art gallery": "phòng trưng bày nghệ thuật", cathedral: "nhà thờ lớn", temple: "đền hoặc chùa", "railway station": "ga tàu",
  noisy: "ồn ào", quiet: "yên tĩnh", busy: "nhộn nhịp", crowded: "đông đúc", modern: "hiện đại", boring: "nhàm chán", peaceful: "thanh bình", beautiful: "đẹp",
  plaster: "băng cá nhân", suncream: "kem chống nắng", "sleeping bag": "túi ngủ", scissors: "cái kéo", backpack: "ba lô",
  fireworks: "pháo hoa", "special food": "món ăn đặc biệt", fun: "niềm vui", wish: "lời chúc hoặc điều ước", furniture: "đồ nội thất",
  "have fun": "vui chơi", "visit relatives": "thăm họ hàng", "give lucky money": "mừng tuổi hoặc cho tiền lì xì",
  "make a wish": "ước một điều", "clean the furniture": "lau dọn đồ nội thất", "watch fireworks": "xem pháo hoa"
};

function englishGuideFor(text: string) {
  const direct = FOUNDATION_ENGLISH_GUIDES[text.trim()];
  if (direct) return direct;
  if (!VIETNAMESE_HINT.test(text)) return undefined;
  return "Review this learning point, then practise it in the activity.";
}

export function normalizeFoundationItem(item: FoundationItem) {
  if (typeof item !== "string") {
    const englishGuide = item.englishGuide ?? englishGuideFor(item.text);
    return englishGuide ? { ...item, englishGuide } : item;
  }
  const directEnglishGuide = FOUNDATION_ENGLISH_GUIDES[item.trim()];
  if (directEnglishGuide) return { text: item, englishGuide: directEnglishGuide };
  const separator = item.indexOf(":");
  if (separator > 0) {
    const left = item.slice(0, separator).trim();
    const right = item.slice(separator + 1).trim();
    const looksLikeSpeaker = left.length <= 14 && /^[A-ZÀ-Ỹ][\p{L}\s.'-]*$/u.test(left) && !VIETNAMESE_HINT.test(right);
    if (looksLikeSpeaker) {
      const translation = CORE_TRANSLATIONS[right];
      return translation ? { text: item, translation } : { text: item };
    }
    if (VIETNAMESE_HINT.test(right)) return { text: left, translation: right };
  }
  const translation = CORE_TRANSLATIONS[item.trim()];
  if (translation) return { text: item, translation };
  const englishGuide = englishGuideFor(item);
  return englishGuide ? { text: item, englishGuide } : { text: item };
}

export function foundationSpeechText(item: FoundationItem) {
  const normalized = normalizeFoundationItem(item);
  const speechText = normalized.speechText ?? normalized.englishGuide ?? normalized.text;
  return speechText
    .replace(/^\d+[.)]\s*/, "")
    .replaceAll("/", " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

export function bilingualFoundationItems(items: readonly string[], translations: readonly string[]): FoundationItem[] {
  if (items.length !== translations.length || translations.some((item) => !item.trim())) throw new Error("Foundation translations must match every source item");
  return items.map((text, index) => ({ text, translation: translations[index] }));
}

export function pronunciationSpeechText(symbol: string, examples: readonly string[], spokenSound?: string) {
  const sound = (spokenSound ?? symbol).replaceAll("/", "").trim();
  return [sound, ...examples].filter(Boolean).join(". ");
}
