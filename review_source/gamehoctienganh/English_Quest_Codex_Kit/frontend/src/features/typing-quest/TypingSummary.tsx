import type { TypingQuestion, TypingSummary as Summary } from "./typingQuestTypes";

type Props = { summary: Summary; questions: TypingQuestion[]; onReplay: () => void; onChangeConfig: () => void };
const ERROR_LABELS = { missing_character: "Thiếu chữ", extra_character: "Thừa chữ", transposition: "Đảo chữ", substitution: "Sai chữ", wrong_word: "Sai từ", hyphen_error: "Sai dấu gạch nối", none: "Không có" };

export function TypingSummary({ summary, questions, onReplay, onChangeConfig }: Props) {
  const answers = new Map(questions.map((question) => [question.vocabId, question.answer]));
  return <section className="lesson-card typing-summary" aria-labelledby="typing-summary-title">
    <span className="eyebrow">Typing Quest · Hoàn thành</span><h3 id="typing-summary-title">Kết quả lượt chơi</h3><p className="finish-mark" aria-hidden="true">★</p>
    <div className="typing-summary-grid"><div><strong>{summary.totalXp}</strong><span>XP</span></div><div><strong>{summary.correctCount}/{summary.totalQuestions}</strong><span>Từ hoàn thành</span></div><div><strong>{summary.firstTryCorrectCount}</strong><span>Đúng ngay lần đầu</span></div><div><strong>{summary.hintUses}</strong><span>Lượt gợi ý</span></div></div>
    <div className="typing-review-card"><h4>Từ cần ôn lại</h4>{summary.reviewVocabIds.length ? <ul>{summary.reviewVocabIds.map((id) => <li key={id}>{answers.get(id) ?? id}</li>)}</ul> : <p>Xuất sắc! Không có từ nào cần ôn lại.</p>}<p>Lỗi thường gặp: <strong>{summary.commonError ? ERROR_LABELS[summary.commonError] : "Không có"}</strong></p></div>
    <div className="typing-summary-actions"><button className="secondary-button" type="button" onClick={onChangeConfig}>Đổi cấu hình</button><button className="primary-button" type="button" onClick={onReplay}>Chơi lại</button></div>
  </section>;
}
