import { useState, type ReactNode } from "react";
import type { FoundationItem } from "../skills-common/learningUx";
import { MathLessonVisualLab } from "./MathLessonVisualLab";

type VisualCardProps = { id: string; kicker: string; title: string; explanation: string; children: ReactNode };

function VisualCard({ id, kicker, title, explanation, children }: VisualCardProps) {
  return <article className="math-visual-card" id={id}>
    <header><span>{kicker}</span><h3>{title}</h3></header>
    {children}
    <p>{explanation}</p>
  </article>;
}

function ExponentVisuals() {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(4);
  const factors = Array.from({ length: exponent }, () => base);
  return <section className="math-visual-gallery" aria-labelledby="exponent-visual-title">
    <header className="math-visual-gallery__heading"><span className="eyebrow">Học bằng hình</span><h2 id="exponent-visual-title">Nhìn để hiểu số mũ</h2><p>Quan sát cấu tạo, phép nhân lặp và quy tắc cùng cơ số trước khi làm bài.</p></header>
    <article className="math-interactive-lab" aria-labelledby="exponent-lab-title">
      <div><span className="eyebrow">Bàn thao tác</span><h3 id="exponent-lab-title">Tự tạo một lũy thừa</h3><p>Kéo hai thanh rồi quan sát số ô thừa số và giá trị thay đổi.</p></div>
      <div className="math-lab-controls">
        <label>Cơ số: <strong>{base}</strong><input aria-label="Chọn cơ số" type="range" min="2" max="6" value={base} onChange={event => setBase(Number(event.target.value))} /></label>
        <label>Số mũ: <strong>{exponent}</strong><input aria-label="Chọn số mũ" type="range" min="2" max="6" value={exponent} onChange={event => setExponent(Number(event.target.value))} /></label>
      </div>
      <div className="math-power-model" aria-live="polite"><strong>{base}^{exponent}</strong><span>=</span><div>{factors.map((factor, index) => <span key={`${factor}-${index}`}>{factor}{index < factors.length - 1 && <i>×</i>}</span>)}</div><span>=</span><strong>{base ** exponent}</strong></div>
      <p className="math-lab-check">Số ô màu = số mũ ({exponent}); số trong mỗi ô = cơ số ({base}).</p>
    </article>
    <div className="math-visual-grid">
      <VisualCard id="exponent-anatomy" kicker="Hình 1" title="Cơ số và số mũ" explanation="Cơ số 2 là thừa số được lặp lại; số mũ 4 cho biết có bốn thừa số 2.">
        <svg className="math-concept-svg" viewBox="0 0 480 220" role="img" aria-labelledby="exponent-anatomy-title exponent-anatomy-desc">
          <title id="exponent-anatomy-title">Cấu tạo của lũy thừa hai mũ bốn</title>
          <desc id="exponent-anatomy-desc">Số 2 lớn là cơ số, số 4 nhỏ phía trên là số mũ, với mũi tên giải thích từng thành phần.</desc>
          <rect x="16" y="16" width="448" height="188" rx="24" fill="#fff8df" />
          <text x="184" y="137" className="math-svg-formula">2</text><text x="270" y="75" className="math-svg-exponent">4</text>
          <path d="M172 145 C120 165 92 169 62 169" className="math-svg-arrow" /><path d="M285 66 C335 44 368 43 416 48" className="math-svg-arrow" />
          <text x="36" y="194" className="math-svg-label">cơ số</text><text x="348" y="34" className="math-svg-label">số mũ</text>
        </svg>
      </VisualCard>
      <VisualCard id="exponent-product" kicker="Hình 2" title="Số mũ là số lần lặp" explanation="Không lấy 2 nhân 4. Ta viết đủ bốn thừa số 2 rồi tính được 16.">
        <svg className="math-concept-svg" viewBox="0 0 480 220" role="img" aria-labelledby="exponent-product-title exponent-product-desc">
          <title id="exponent-product-title">Hai mũ bốn được khai triển thành phép nhân lặp</title>
          <desc id="exponent-product-desc">Bốn ô số 2 nối bằng ba dấu nhân, sau đó bằng 16.</desc>
          <rect x="16" y="16" width="448" height="188" rx="24" fill="#eaf8f5" />
          {[58, 142, 226, 310].map((x, index) => <g key={x}><rect x={x} y="72" width="58" height="58" rx="14" fill={index < 2 ? "#55c7b5" : "#70a5ff"} /><text x={x + 29} y="112" textAnchor="middle" className="math-svg-factor">2</text>{index < 3 && <text x={x + 71} y="111" className="math-svg-operator">×</text>}</g>)}
          <text x="385" y="111" className="math-svg-operator">=</text><text x="421" y="112" textAnchor="middle" className="math-svg-result">16</text>
          <text x="240" y="166" textAnchor="middle" className="math-svg-caption">4 thừa số bằng nhau</text>
        </svg>
      </VisualCard>
      <VisualCard id="exponent-rule" kicker="Hình 3" title="Nhân cùng cơ số" explanation="Hai nhóm đều có thừa số 2. Ghép lại ta có năm thừa số 2, nên cộng 3 và 2.">
        <svg className="math-concept-svg" viewBox="0 0 480 220" role="img" aria-labelledby="exponent-rule-title exponent-rule-desc">
          <title id="exponent-rule-title">Minh họa hai mũ ba nhân hai mũ hai bằng hai mũ năm</title>
          <desc id="exponent-rule-desc">Một nhóm ba ô số 2 và một nhóm hai ô số 2 được ghép thành năm ô số 2.</desc>
          <rect x="16" y="16" width="448" height="188" rx="24" fill="#f2edff" />
          <g transform="translate(36 58)">{[0, 1, 2].map(i => <g key={i}><rect x={i * 55} y="0" width="44" height="44" rx="10" fill="#805ad5" /><text x={i * 55 + 22} y="30" textAnchor="middle" className="math-svg-factor">2</text></g>)}</g>
          <text x="211" y="91" className="math-svg-operator">×</text>
          <g transform="translate(242 58)">{[0, 1].map(i => <g key={i}><rect x={i * 55} y="0" width="44" height="44" rx="10" fill="#e7784f" /><text x={i * 55 + 22} y="30" textAnchor="middle" className="math-svg-factor">2</text></g>)}</g>
          <path d="M92 120 C150 160 300 160 352 120" className="math-svg-arrow" />
          <text x="240" y="174" textAnchor="middle" className="math-svg-result">2³ × 2² = 2³⁺² = 2⁵</text>
        </svg>
      </VisualCard>
    </div>
  </section>;
}

function FractionVisuals() {
  const [denominator, setDenominator] = useState(4);
  const [numerator, setNumerator] = useState(3);
  const [factor, setFactor] = useState(2);
  const safeNumerator = Math.min(numerator, denominator - 1);
  return <section className="math-visual-gallery" aria-labelledby="fraction-visual-title">
    <header className="math-visual-gallery__heading"><span className="eyebrow">Học bằng hình</span><h2 id="fraction-visual-title">Nhìn để hiểu phân số</h2><p>Cùng một lượng có thể được chia thành số phần khác nhau nhưng vẫn giữ nguyên giá trị.</p></header>
    <article className="math-interactive-lab" aria-labelledby="fraction-lab-title">
      <div><span className="eyebrow">Bàn thao tác</span><h3 id="fraction-lab-title">Chia phần và mở rộng</h3><p>Đổi tử, mẫu và hệ số. Hai thanh luôn giữ cùng phần được tô.</p></div>
      <div className="math-lab-controls math-lab-controls--three">
        <label>Tử số: <strong>{safeNumerator}</strong><input aria-label="Chọn tử số" type="range" min="1" max={Math.max(1, denominator - 1)} value={safeNumerator} onChange={event => setNumerator(Number(event.target.value))} /></label>
        <label>Mẫu số: <strong>{denominator}</strong><input aria-label="Chọn mẫu số" type="range" min="2" max="10" value={denominator} onChange={event => setDenominator(Number(event.target.value))} /></label>
        <label>Hệ số mở rộng: <strong>{factor}</strong><input aria-label="Chọn hệ số mở rộng" type="range" min="2" max="4" value={factor} onChange={event => setFactor(Number(event.target.value))} /></label>
      </div>
      <div className="fraction-bars" aria-live="polite">
        <div className="fraction-bar" style={{ gridTemplateColumns: `repeat(${denominator}, 1fr)` }}>{Array.from({ length: denominator }, (_, index) => <span key={index} className={index < safeNumerator ? "is-filled" : ""} />)}</div>
        <strong>{safeNumerator}/{denominator}</strong><span>=</span>
        <div className="fraction-bar fraction-bar--small" style={{ gridTemplateColumns: `repeat(${denominator * factor}, 1fr)` }}>{Array.from({ length: denominator * factor }, (_, index) => <span key={index} className={index < safeNumerator * factor ? "is-filled" : ""} />)}</div>
        <strong>{safeNumerator * factor}/{denominator * factor}</strong>
      </div>
      <p className="math-lab-check">Tử và mẫu cùng nhân {factor}, nên phần được tô và giá trị phân số không đổi.</p>
    </article>
    <div className="math-visual-grid">
      <VisualCard id="fraction-equivalent" kicker="Hình 1" title="Hai phân số bằng nhau" explanation="Thanh dưới chia mỗi phần ba thành bốn phần nhỏ. Phần tô màu không đổi nên 2/3 = 8/12.">
        <svg className="math-concept-svg" viewBox="0 0 480 240" role="img" aria-labelledby="fraction-equivalent-title fraction-equivalent-desc">
          <title id="fraction-equivalent-title">Hai phần ba bằng tám phần mười hai</title>
          <desc id="fraction-equivalent-desc">Hai thanh có cùng độ dài. Thanh trên chia ba phần tô hai; thanh dưới chia mười hai phần tô tám.</desc>
          <rect x="16" y="16" width="448" height="208" rx="24" fill="#fff8df" />
          {[0, 1, 2].map(i => <rect key={i} x={52 + i * 100} y="52" width="96" height="48" rx="5" fill={i < 2 ? "#ffc857" : "#fff"} stroke="#243348" strokeWidth="3" />)}
          <text x="401" y="84" className="math-svg-result">2/3</text>
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={52 + i * 25} y="132" width="23" height="42" rx="3" fill={i < 8 ? "#55c7b5" : "#fff"} stroke="#243348" strokeWidth="2" />)}
          <text x="401" y="160" className="math-svg-result">8/12</text>
          <text x="240" y="205" textAnchor="middle" className="math-svg-caption">Phần được tô màu có cùng độ dài</text>
        </svg>
      </VisualCard>
      <VisualCard id="fraction-number-line" kicker="Hình 2" title="Phân số âm trên trục số" explanation="Từ 0 đi sang trái ba khoảng, mỗi khoảng bằng 1/4, ta đến vị trí −3/4.">
        <svg className="math-concept-svg" viewBox="0 0 480 240" role="img" aria-labelledby="fraction-number-line-title fraction-number-line-desc">
          <title id="fraction-number-line-title">Vị trí âm ba phần tư trên trục số</title>
          <desc id="fraction-number-line-desc">Trục số từ âm một đến một chia thành tám khoảng phần tư; điểm âm ba phần tư được đánh dấu.</desc>
          <rect x="16" y="16" width="448" height="208" rx="24" fill="#eaf8f5" />
          <path d="M50 130 H430" stroke="#243348" strokeWidth="4" /><path d="M430 130 l-12 -8 v16 z" fill="#243348" />
          {Array.from({ length: 9 }, (_, i) => { const x = 62 + i * 44; return <g key={i}><path d={`M${x} 116 V144`} stroke="#243348" strokeWidth="3" />{[0, 4, 8].includes(i) && <text x={x} y="169" textAnchor="middle" className="math-svg-label">{i === 0 ? "−1" : i === 4 ? "0" : "1"}</text>}</g>; })}
          <circle cx="106" cy="130" r="12" fill="#e7784f" /><path d="M106 110 V73" stroke="#e7784f" strokeWidth="3" /><text x="106" y="57" textAnchor="middle" className="math-svg-result">−3/4</text>
        </svg>
      </VisualCard>
      <VisualCard id="fraction-simplify" kicker="Hình 3" title="Rút gọn cùng một số" explanation="Chia cả tử và mẫu cho 6. Giá trị phân số không đổi và kết quả −3/4 đã tối giản.">
        <svg className="math-concept-svg" viewBox="0 0 480 240" role="img" aria-labelledby="fraction-simplify-title fraction-simplify-desc">
          <title id="fraction-simplify-title">Rút gọn âm mười tám phần hai mươi bốn thành âm ba phần tư</title>
          <desc id="fraction-simplify-desc">Tử âm mười tám và mẫu hai mươi bốn cùng được chia cho sáu, tạo thành âm ba và bốn.</desc>
          <rect x="16" y="16" width="448" height="208" rx="24" fill="#f2edff" />
          <g transform="translate(72 62)"><text x="40" y="36" textAnchor="middle" className="math-svg-result">−18</text><path d="M5 48 H75" stroke="#243348" strokeWidth="4" /><text x="40" y="88" textAnchor="middle" className="math-svg-result">24</text></g>
          <g transform="translate(180 72)"><rect width="106" height="64" rx="18" fill="#805ad5" /><text x="53" y="27" textAnchor="middle" className="math-svg-factor">chia 6</text><text x="53" y="50" textAnchor="middle" className="math-svg-factor">cả hai</text></g>
          <path d="M286 104 H332" className="math-svg-arrow" />
          <g transform="translate(340 62)"><text x="40" y="36" textAnchor="middle" className="math-svg-result">−3</text><path d="M5 48 H75" stroke="#243348" strokeWidth="4" /><text x="40" y="88" textAnchor="middle" className="math-svg-result">4</text></g>
          <text x="240" y="199" textAnchor="middle" className="math-svg-caption">−18 ÷ 6 = −3 và 24 ÷ 6 = 4</text>
        </svg>
      </VisualCard>
    </div>
  </section>;
}

function ChartVisuals() {
  const [values, setValues] = useState([4, 7, 5]);
  const update = (index: number, value: number) => setValues(current => current.map((item, itemIndex) => itemIndex === index ? value : item));
  const max = Math.max(...values), min = Math.min(...values), sum = values.reduce((total, value) => total + value, 0);
  return <section className="math-visual-gallery" aria-labelledby="chart-visual-title">
    <header className="math-visual-gallery__heading"><span className="eyebrow">Học bằng hình</span><h2 id="chart-visual-title">Nhìn để đọc biểu đồ cột</h2><p>Thay đổi dữ liệu, đọc chiều cao cột rồi kiểm tra tổng và độ chênh lệch.</p></header>
    <article className="math-interactive-lab" id="interactive-bar-chart" aria-labelledby="chart-lab-title">
      <div><span className="eyebrow">Bàn thao tác</span><h3 id="chart-lab-title">Phòng thí nghiệm dữ liệu</h3><p>Mỗi thanh kéo điều khiển đúng một cột A, B hoặc C.</p></div>
      <div className="math-lab-controls math-lab-controls--three">{values.map((value, index) => <label key={index}>Cột {String.fromCharCode(65 + index)}: <strong>{value}</strong><input aria-label={`Giá trị cột ${String.fromCharCode(65 + index)}`} type="range" min="1" max="12" value={value} onChange={event => update(index, Number(event.target.value))} /></label>)}</div>
      <svg className="interactive-chart" viewBox="0 0 520 280" role="img" aria-labelledby="interactive-chart-title interactive-chart-desc">
        <title id="interactive-chart-title">Biểu đồ cột tương tác A, B và C</title><desc id="interactive-chart-desc">Ba cột thay đổi theo các thanh điều khiển, có trục từ 0 đến 12.</desc>
        {[0, 3, 6, 9, 12].map(tick => <g key={tick}><line x1="70" x2="480" y1={230 - tick * 15} y2={230 - tick * 15} className="chart-grid-line" /><text x="52" y={235 - tick * 15} textAnchor="end" className="math-svg-label">{tick}</text></g>)}
        <line x1="70" x2="480" y1="230" y2="230" className="chart-axis" />
        {values.map((value, index) => <g key={index}><rect x={120 + index * 120} y={230 - value * 15} width="66" height={value * 15} rx="8" className={`chart-bar chart-bar--${index + 1}`} /><text x={153 + index * 120} y={218 - value * 15} textAnchor="middle" className="math-svg-result">{value}</text><text x={153 + index * 120} y="258" textAnchor="middle" className="math-svg-label">{String.fromCharCode(65 + index)}</text></g>)}
      </svg>
      <div className="chart-readout" aria-live="polite"><span>Tổng: <strong>{sum}</strong></span><span>Lớn nhất: <strong>{max}</strong></span><span>Chênh lệch: <strong>{max - min}</strong></span></div>
      <p className="math-lab-check">Hãy dự đoán ba kết quả trước, rồi mới nhìn bảng kiểm tra.</p>
    </article>
  </section>;
}

export const MATH_VISUAL_IDS = {
  "math6-s1-lesson6": ["exponent-anatomy", "exponent-product", "exponent-rule"],
  "math6-s2-lesson23": ["fraction-equivalent", "fraction-number-line", "fraction-simplify"],
  "math6-s2-lesson40": ["interactive-bar-chart"],
} as const;

export function MathConceptVisuals({ lessonId, title, chapter, lead, foundations }: { lessonId: string; title: string; chapter: string; lead: string; foundations: Array<{ title: string; items: FoundationItem[] }> }) {
  if (lessonId === "math6-s1-lesson6") return <ExponentVisuals />;
  if (lessonId === "math6-s2-lesson23") return <FractionVisuals />;
  if (lessonId === "math6-s2-lesson40") return <ChartVisuals />;
  return <MathLessonVisualLab lessonId={lessonId} title={title} chapter={chapter} lead={lead} foundations={foundations} />;
}

