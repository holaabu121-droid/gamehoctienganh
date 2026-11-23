import type { TypingAudioSettings, TypingConfig, TypingDifficulty, TypingMode } from "./typingQuestTypes";

type Props = { config: TypingConfig; audio: TypingAudioSettings; onConfigChange: (config: TypingConfig) => void; onAudioChange: (audio: TypingAudioSettings) => void; onStart: () => void };
const MODES: Array<{ value: TypingMode; title: string; description: string }> = [
  { value: "fill_gap", title: "Điền từ", description: "Đọc câu và gõ từ còn thiếu." },
  { value: "translation_typing", title: "Nhớ nghĩa", description: "Nhìn nghĩa Việt và gõ từ tiếng Anh." },
  { value: "mixed", title: "Trộn hai dạng", description: "Luân phiên câu và nghĩa Việt." },
];
const DIFFICULTIES: Array<{ value: TypingDifficulty; title: string; description: string }> = [
  { value: "learning", title: "Luyện tập", description: "Cho phép sửa ký tự bằng Backspace." },
  { value: "challenge", title: "Thử thách", description: "Gõ sai phải bắt đầu lại từ đầu." },
];

export function TypingSetup({ config, audio, onConfigChange, onAudioChange, onStart }: Props) {
  return <section className="lesson-card typing-setup" aria-labelledby="typing-quest-title">
    <header className="typing-hero"><div><span className="eyebrow">Unit 3 · Practice</span><h3 id="typing-quest-title">Typing Quest</h3><p className="lesson-lead">Gõ từ bằng bàn phím để luyện trí nhớ và chính tả.</p></div><span className="typing-hero-icon" aria-hidden="true">⌨</span></header>
    <fieldset className="typing-fieldset"><legend>Hình thức luyện tập</legend><div className="typing-choice-grid typing-choice-grid--three">
      {MODES.map((mode) => <button key={mode.value} type="button" className="typing-choice" aria-pressed={config.mode === mode.value} onClick={() => onConfigChange({ ...config, mode: mode.value })}><strong>{mode.title}</strong><span>{mode.description}</span></button>)}
    </div></fieldset>
    <fieldset className="typing-fieldset"><legend>Độ khó</legend><div className="typing-choice-grid">
      {DIFFICULTIES.map((item) => <button key={item.value} type="button" className="typing-choice" aria-pressed={config.difficulty === item.value} onClick={() => onConfigChange({ ...config, difficulty: item.value })}><strong>{item.title}</strong><span>{item.description}</span></button>)}
    </div></fieldset>
    <fieldset className="typing-fieldset"><legend>Số câu mỗi lượt</legend><p><strong>10 câu</strong> · Chuẩn cố định của Typing Quest trong Unit 3.</p></fieldset>
    <fieldset className="typing-fieldset typing-audio-settings"><legend>Âm thanh sau khi trả lời đúng</legend>
      <label><input type="checkbox" checked={audio.speakWord} onChange={(event) => onAudioChange({ ...audio, speakWord: event.target.checked })} /> Phát âm từ tiếng Anh</label>
      <label><input type="checkbox" checked={audio.speakMeaning} onChange={(event) => onAudioChange({ ...audio, speakMeaning: event.target.checked })} /> Đọc nghĩa tiếng Việt</label>
      <label><input type="checkbox" checked={audio.speakSentence} onChange={(event) => onAudioChange({ ...audio, speakSentence: event.target.checked })} /> Đọc câu hoàn chỉnh</label>
    </fieldset>
    <div className="typing-setup-footer"><p>Câu ví dụ được hiển thị song ngữ sau khi em trả lời đúng.</p><button className="primary-button typing-start" type="button" onClick={onStart}>Bắt đầu Typing Quest</button></div>
  </section>;
}
