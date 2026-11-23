import { QUESTIONS } from "./questions.mjs";
import { selectQuiz, checkAnswer, isComplete, scoreForTime, newRecord, toRoman, bestHistory } from "./engine.mjs";

const root=document.getElementById("app");
const params=new URLSearchParams(location.search);
const account=params.get("student")||"";
const student=/^[a-zA-Z0-9_-]{3,64}$/.test(account)?account:"guest";
const STORE="toan6.bai2.v01.progress.student."+student;
const PAGE_SOURCE="math6-bai2-v01";
const TEXTS=[
  {
    title:"Hệ thập phân",
    subtitle:"Giá trị chữ số theo hàng và theo lớp",
    details:"10 chữ số 0–9 tạo nên mọi số tự nhiên. Giá trị của từng chữ số phụ thuộc vị trí: đơn vị, chục, trăm, nghìn, chục nghìn… Cứ 10 đơn vị của hàng này bằng 1 đơn vị của hàng đứng ngay trước.",
  },
  {
    title:"Số La Mã từ 1 đến 30",
    subtitle:"I, V, X, IV, IX và cách ghép đúng",
    details:"I là 1, V là 5, X là 10, IV là 4 và IX là 9. Các số 11–20 có X ở bên trái; các số 21–30 bắt đầu bằng XX, trừ 30 được viết XXX. Số 0 không có cách viết La Mã trong bảng học này.",
  }
];
let state;
try{const parsed=JSON.parse(localStorage.getItem(STORE)||"null");
  state=parsed&&Array.isArray(parsed.read)&&parsed.history&&typeof parsed.history==="object"?parsed:null;
}catch{state=null;}
if(!state)state={view:"home",card:1,read:[false,false],draft:null,history:{"1":[],"2":[]}};
if(state.draft&&state.draft.index<10&&!["results","home","card"].includes(state.view))state.view="quiz";
let cardScrolled=false;
let toast="";
let lastTick=performance.now(),lastSave=performance.now();
let previewRoman=null;
const byId=new Map(QUESTIONS.map(q=>[q.id,q]));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state));}catch{toast="Không lưu được tiến độ trên trình duyệt này.";}};
const sendHeight=()=>{
  if(window.parent===window)return;
  const height=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
  window.parent.postMessage({source:PAGE_SOURCE,kind:"resize",height},location.origin);
};
const escAttr=esc;
const btn=(label,action,cls="",disabled=false)=>'<button type="button" class="'+cls+'" data-action="'+action+'"'+(disabled?" disabled":"")+'>'+esc(label)+'</button>';
const header=(label)=>'<header class="top"><div class="logo">Toán 6 <span>• Bài 2</span></div><span class="edition">Cách ghi số tự nhiên · v0.1</span></header><div class="subheader">'+esc(label)+'</div>';
function readBoth(){return !!state.read[0]&&!!state.read[1];}
function draftRecord(){return state.draft?.records?.[state.draft.index];}
function currentQuestion(){return byId.get(state.draft?.questionIds?.[state.draft.index]);}
function valueFor(q,rec){
  if(rec.value!==undefined)return rec.value;
  return q.mode==="single"||q.mode==="number"||q.mode==="roman"?"":[];
}
function home(){
  const active=state.draft&&state.draft.index<10;
  const cards=TEXTS.map((item,i)=>{
    const n=i+1;
    const best=bestHistory(state.history,String(n));
    const badge=state.read[i]?"Đã đọc đủ":"Chưa đọc đủ";
    return '<article class="subject-card"><div class="tag">KIẾN THỨC '+n+'</div><h2>'+esc(item.title)+'</h2><p>'+esc(item.subtitle)+'</p><p class="muted">'+badge+' · 25 câu trong ngân hàng</p><div class="actions">'+btn("Xem thẻ kiến thức", "card-"+n,"secondary")+btn("Làm bài kiểm tra","test-"+n,"primary",!readBoth()||active)+'</div><p class="muted stats">Đề 10 câu: 6 luyện tập + 4 vận dụng'+(best?" · Điểm tốt nhất: "+best.score+"/1000":"")+'</p></article>';
  }).join("");
  return header("Học hai kiến thức nền trước khi mở bài kiểm tra")+
    '<section class="hero"><div class="eyebrow">LỚP 6 · KẾT NỐI TRI THỨC</div><h1>Cách ghi số tự nhiên</h1><p>Học cách đọc và viết số theo hệ thập phân, giá trị các hàng và số La Mã từ 1 đến 30.</p><div class="stats-row"><span>50 câu</span><span>30 luyện tập</span><span>20 vận dụng</span></div></section>'+
    (active?'<div class="notice">Có một đề đang làm dở. Hoàn thành hoặc tiếp tục đề này trước khi tạo đề mới. '+btn("Tiếp tục đề đang làm","resume","primary")+'</div>':"")+
    '<div class="cards">'+cards+'</div>'+
    '<p class="muted center">Điểm và đề đang làm lưu trên thiết bị theo tài khoản. Điểm tốt nhất của đề hoàn thành được gửi tới hồ sơ chung.</p>';
}
function renderRomanTable(){
  let html='<div class="roman-grid" aria-label="Bảng số La Mã 1 đến 30">';
  for(let n=1;n<=30;n++)html+='<button class="roman-cell" type="button" data-roman="'+n+'"><b>'+toRoman(n)+'</b><span>'+n+'</span></button>';
  return html+'</div><p class="muted">Chạm một ô trong bảng để xem số La Mã và giá trị thập phân tương ứng.</p>'+(previewRoman?'<p role="status"><strong>'+toRoman(previewRoman)+' = '+previewRoman+'</strong></p>':"");
}
function card(){
  const idx=(state.card||1)-1,t=TEXTS[idx];
  let body;
  if(idx===0){
    body='<p>'+esc(t.details)+'</p><div class="visual-number">43 507</div>'+
    '<table class="places"><thead><tr><th>Chục nghìn</th><th>Nghìn</th><th>Trăm</th><th>Chục</th><th>Đơn vị</th></tr></thead><tbody><tr><td>4</td><td>3</td><td>5</td><td>0</td><td>7</td></tr><tr><td>40 000</td><td>3 000</td><td>500</td><td>0</td><td>7</td></tr></tbody></table>'+
    '<p><strong>Phân tích:</strong> 43 507 = 40 000 + 3 000 + 500 + 7.</p>'+
    '<h3>Vì sao chữ số 0 rất quan trọng?</h3><p>Trong số 40 507, chữ số 0 giữ vị trí hàng nghìn và hàng chục. Không thể bỏ 0 ở giữa số rồi coi đó là số ban đầu.</p>'+
    '<h3>Các lớp số</h3><p>Tách từ phải qua trái từng nhóm ba chữ số: <strong>7 | 205 | 018</strong> lần lượt là lớp triệu, lớp nghìn và lớp đơn vị.</p>'+
    '<p>Cứ 10 đơn vị = 1 chục; 10 chục = 1 trăm; 10 trăm = 1 nghìn.</p>';
  }else{
    body='<p>'+esc(t.details)+'</p><div class="roman-examples"><span>I = 1</span><span>V = 5</span><span>X = 10</span><span>IV = 4</span><span>IX = 9</span></div>'+
    '<p><strong>Lưu ý:</strong> IV = 4, nhưng VI = 6. IX = 9, còn XI = 11. Không ghi 4 thành IIII theo bảng đang học.</p>'+
    renderRomanTable()+
    '<h3>Ghép số từ 11 đến 30</h3><p>XVI = 10 + 6 = 16. XXIV = 20 + 4 = 24. XXIX = 20 + 9 = 29.</p>'+
    '<p>Số 0 không có kí hiệu La Mã trong phạm vi bài này. Không hỏi các kí tự L, C, D, M.</p>';
  }
  return header("Thẻ kiến thức "+state.card+" trong 2")+
    '<section class="lesson-card"><div class="eyebrow">THẺ '+state.card+'</div><h1>'+esc(t.title)+'</h1><p>'+esc(t.subtitle)+'</p>'+
    '<div class="learning-scroll" id="learning-scroll" tabindex="0">'+body+'</div>'+
    '<div class="actions">'+btn("Về trang bài học","home","secondary")+
    btn(state.read[idx]?"Đã đánh dấu đã đọc":"Đánh dấu đã đọc đủ","mark-read","primary",!state.read[idx])+'</div>'+
    (!state.read[idx]?'<p class="muted" id="scroll-notice">Cuộn đến cuối thẻ để xác nhận đã xem đầy đủ nội dung.</p>':"")+'</section>';
}
function oneOption(value,selected,act,idx){
 const inputSelected=selected?" selected":"";
 return '<button type="button" class="answer-option'+inputSelected+'" data-action="'+act+'" data-index="'+idx+'" aria-pressed="'+(selected?"true":"false")+'">'+esc(value)+'</button>';
}
function renderQuestionAnswer(q,r){
 if(q.mode==="single"||q.mode==="multi"){
  const options=state.draft.orders?.[q.id]||q.options;
  const selected=r.value;
  return '<div class="input-title">'+(q.mode==="multi"?"Chọn tất cả đáp án đúng":"Chọn một đáp án")+'</div><div class="answer-options">'+options.map((opt,i)=>oneOption(opt,q.mode==="multi"?selected.includes(opt):selected===opt,q.mode==="multi"?"multi":"single",i)).join("")+'</div>';
 }
 if(q.mode==="number"||q.mode==="roman"){
  const description=q.mode==="roman"?"Nhập số La Mã (có thể dùng chữ thường)":"Nhập số tự nhiên";
  return '<label class="input-title" for="answer-entry">'+description+'</label><input id="answer-entry" class="short-answer" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="'+(q.mode==="number"?"numeric":"text")+'" placeholder="'+(q.mode==="number"?"Ví dụ: 35 029":"Ví dụ: XXIV")+'" value="'+escAttr(r.value)+'"><p class="muted">Không cần viết câu giải thích. Số có thể nhập liền hoặc dùng dấu cách tách nhóm nghìn đúng vị trí.</p>';
 }
 if(q.mode==="order"){
  const selected=r.value;
  const counts=new Map();selected.forEach(v=>counts.set(v,(counts.get(v)||0)+1));
  const used=new Map();
  const tiles=q.tiles.map((v,i)=>{
    const seen=(used.get(v)||0)+1;used.set(v,seen);
    return counts.get(v)>=seen?"":'<button type="button" data-action="tile" data-index="'+i+'" class="tile">'+esc(v)+'</button>';
  }).join("");
  return '<div class="input-title">Chạm các thẻ theo đúng thứ tự</div><div class="selected-tiles">'+(selected.length?selected.map(v=>'<span class="tile chosen">'+esc(v)+'</span>').join(""):'<span class="muted">Chưa chọn thẻ</span>')+'</div><div class="tiles">'+tiles+'</div><div class="actions">'+btn("Bỏ thẻ cuối","undo","secondary",!selected.length)+btn("Làm lại thứ tự","clear-order","secondary",!selected.length)+'</div>';
 }
 if(q.mode==="match"){
  const values=q.options;
  return '<p class="input-title">Ghép từng dòng với một đáp án</p><div class="match-rows">'+q.rows.map((row,i)=>{
    return '<label class="match-row"><span>'+esc(row)+'</span><select data-match="'+i+'" aria-label="Ghép cho '+escAttr(row)+'"><option value="">Chọn đáp án</option>'+
    values.map(v=>'<option value="'+escAttr(v)+'"'+(r.value[i]===v?' selected':'')+'>'+esc(v)+'</option>').join("")+'</select></label>';
  }).join("")+'</div>';
 }
 return '<p>Kiểu câu hỏi chưa được hỗ trợ.</p>';
}
function quiz(){
 const draft=state.draft;
 if(!draft)return home();
 const q=currentQuestion(),r=draftRecord();
 if(!q||!r)return home();
 const n=draft.index+1;
 const testName=draft.knowledge===1?"Hệ thập phân":"Số La Mã";
 const score=r.phase==="correct"?r.score:scoreForTime(r.seconds,r.wrongs);
 const feedback=r.phase==="hint"
 ?'<div class="feedback hint" role="status"><h3>'+esc(r.wrongs>=2?"Sai từ 2 lần – 0 điểm":"Gợi ý để thử lại")+'</h3><p>'+esc(q.hint)+'</p>'+(r.wrongs>=3?'<p>'+esc(q.explanation)+'</p>':"")+'<p>Đồng hồ tính điểm đang tạm dừng.</p>'+btn("Đã hiểu – thử lại","retry","primary")+'</div>'
 :r.phase==="correct"
 ?'<div class="feedback correct" role="status"><h3>Đã trả lời đúng · '+r.score+' điểm</h3><p>'+esc(q.explanation)+'</p>'+btn(n===10?"Xem kết quả đề":"Câu tiếp theo",n===10?"finish":"next","primary")+'</div>'
 :'';
 return header("Bài kiểm tra "+testName)+
 '<section class="quiz-card"><div class="quiz-meta"><span class="tag">'+esc(q.id)+'</span><span class="tag">'+(q.level==="practice"?"Luyện tập":"Vận dụng")+'</span><span class="tag">Câu '+n+'/10</span></div>'+
 '<div class="progress-track"><span style="width:'+(draft.index*10)+'%"></span></div>'+
 '<h2>'+esc(q.title)+'</h2><p class="prompt">'+esc(q.prompt)+'</p>'+
 renderQuestionAnswer(q,r)+
 '<div class="status-line"><span>Thời gian tính điểm: <strong id="active-seconds">'+Math.floor(r.seconds)+'s</strong></span><span>Điểm hiện tại: <strong id="current-points">'+score+'</strong>/100</span></div>'+
 (r.wrongs>0?'<p class="muted">Số lần sai: '+r.wrongs+' · Sai lần hai sẽ nhận 0 điểm, nhưng vẫn được làm đến khi đúng.</p>':"")+
 (toast?'<p class="alert" role="alert">'+esc(toast)+'</p>':"")+
 (r.phase==="answering"?'<div class="actions">'+btn("Kiểm tra đáp án","check","primary")+btn("Về bài học (lưu tiến độ)","home","secondary")+'</div>':"")+
 feedback+'</section>';
}
function sendCompletion(knowledge,results){
 if(student==="guest"||window.parent===window)return;
 const scores=results.map(r=>r.score);
 if(scores.length!==10 || scores.some(x=>!Number.isInteger(x)||x<0||x>100))return;
 window.parent.postMessage({
   source:PAGE_SOURCE,kind:"quiz-completed",student,knowledge,questionScores:scores,
   earnedScore:scores.reduce((sum,v)=>sum+v,0)
 },location.origin);
}
function results(){
 const draft=state.draft;
 const h=state.history?.[state.lastResult?.knowledge||1]||[];
 const latest=state.lastResult||h[h.length-1];
 if(!latest)return home();
 const best=bestHistory(state.history,String(latest.knowledge));
 const first=(state.history?.[latest.knowledge]||[])[0];
 return header("Kết quả kiểm tra Bài 2")+'<section class="quiz-card"><div class="eyebrow">ĐÃ HOÀN THÀNH</div><h1>'+esc(latest.knowledge===1?"Hệ thập phân":"Số La Mã")+'</h1><div class="final-score">'+latest.score+' <small>/ 1000 điểm</small></div><div class="result-stats"><span>Lần đầu: '+(first?.score??0)+'</span><span>Điểm tốt nhất: '+(best?.score??0)+'</span></div>'+
 '<h2>Chi tiết câu hỏi</h2><table class="results-table"><thead><tr><th>Mã câu</th><th>Điểm</th></tr></thead><tbody>'+
 latest.questionIds.map((id,i)=>'<tr><td>'+esc(id)+'</td><td>'+latest.questionScores[i]+'/100</td></tr>').join("")+
 '</tbody></table><div class="notice">Điểm đã được gửi đến hồ sơ chung. Nếu mạng lỗi, mở lại bài học để thử đồng bộ lại.</div>'+
 '<div class="actions">'+btn("Về trang bài học","home","secondary")+btn("Luyện đề mới","new-test","primary")+'</div></section>';
}
function render(){
 root.innerHTML=(state.view==="quiz"?quiz():state.view==="card"?card():state.view==="results"?results():home())+'<footer class="footer">Toán 6 · Bài 2 · Ngân hàng 50 câu</footer>';
 toast="";
 if(state.view==="card"){
   const pane=document.getElementById("learning-scroll");
   const btnRead=root.querySelector('[data-action="mark-read"]');
   if(btnRead&&!state.read[(state.card||1)-1]) {
      cardScrolled=pane.scrollHeight<=pane.clientHeight+10;
      btnRead.disabled=!cardScrolled;
   }
 }
 lastTick=performance.now();sendHeight();
}
function viewCard(n){state.view="card";state.card=n;cardScrolled=false;previewRoman=null;save();render();}
function openQuiz(n,forceNew=false){
 if(!readBoth())return;
 if(state.draft&&state.draft.index<10&&!forceNew){
  if(state.draft.knowledge!==n){toast="Hãy hoàn thành đề đang làm trước.";state.view="quiz";render();return;}
  state.view="quiz";save();render();return;
 }
 const selected=selectQuiz(QUESTIONS,n);
 const orders={};for(const q of selected){
   if(q.options){
     const arr=q.options.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}orders[q.id]=arr;
   }
 }
 state.draft={knowledge:n,questionIds:selected.map(q=>q.id),records:selected.map(newRecord),orders,index:0};
 state.view="quiz";save();render();
}
function completeTest(){
 const draft=state.draft;if(!draft || draft.records.some(r=>r.phase!=="correct"||!Number.isInteger(r.score)))return;
 const row={knowledge:draft.knowledge,questionIds:draft.questionIds.slice(),questionScores:draft.records.map(r=>r.score),score:draft.records.reduce((sum,r)=>sum+r.score,0),finishedAt:new Date().toISOString()};
 state.history[draft.knowledge]=[...(state.history[draft.knowledge]||[]),row].slice(-40);
 state.lastResult=row;state.draft=null;state.view="results";save();render();
 sendCompletion(row.knowledge,draft.records);
}
root.addEventListener("scroll",event=>{
 if(event.target.id!=="learning-scroll")return;
 const pane=event.target;
 if(pane.scrollTop+pane.clientHeight>=pane.scrollHeight-14){
   cardScrolled=true;const b=root.querySelector('[data-action="mark-read"]');if(b)b.disabled=false;
 }
},true);
root.addEventListener("input",event=>{
 if(event.target.id!=="answer-entry")return;
 const rec=draftRecord();if(rec&&rec.phase==="answering"){rec.value=event.target.value;save();}
});
root.addEventListener("change",event=>{
 if(!event.target.matches("select[data-match]"))return;
 const rec=draftRecord();if(!rec||rec.phase!=="answering")return;
 const idx=Number(event.target.dataset.match);
 const q=currentQuestion();
 const newValues=Array.isArray(rec.value)?rec.value.slice():[];
 while(newValues.length<q.rows.length)newValues.push("");
 newValues[idx]=event.target.value;rec.value=newValues;save();
});
root.addEventListener("click",event=>{
 const roman=event.target.closest("[data-roman]");
 if(roman){previewRoman=Number(roman.dataset.roman);render();return;}
 const b=event.target.closest("[data-action]");if(!b||b.disabled)return;
 const action=b.dataset.action; const q=currentQuestion(),rec=draftRecord();
 if(action==="home"){state.view="home";save();render();return;}
 if(action==="card-1"||action==="card-2"){viewCard(Number(action.slice(-1)));return;}
 if(action==="mark-read"){
    const idx=(state.card||1)-1;if(!cardScrolled && !state.read[idx])return;
    state.read[idx]=true;save();state.view="home";render();return;
 }
 if(action==="test-1"||action==="test-2"){openQuiz(Number(action.slice(-1)));return;}
 if(action==="resume"){if(state.draft){state.view="quiz";save();render();}return;}
 if(action==="new-test"){openQuiz(state.lastResult?.knowledge||1,true);return;}
 if(!rec||!q)return;
 if(action==="single"&&rec.phase==="answering"){
   rec.value=(state.draft.orders[q.id]||q.options)[Number(b.dataset.index)];save();render();return;
 }
 if(action==="multi"&&rec.phase==="answering"){
   const chosen=(state.draft.orders[q.id]||q.options)[Number(b.dataset.index)];
   rec.value=rec.value.includes(chosen)?rec.value.filter(v=>v!==chosen):[...rec.value,chosen];save();render();return;
 }
 if(action==="tile"&&rec.phase==="answering"){
   const v=q.tiles[Number(b.dataset.index)];
   const used=rec.value.filter(x=>x===v).length,available=q.tiles.filter(x=>x===v).length;
   if(used<available){rec.value.push(v);save();render();}return;
 }
 if(action==="undo"){rec.value.pop();save();render();return;}
 if(action==="clear-order"){rec.value=[];save();render();return;}
 if(action==="check"&&rec.phase==="answering"){
   if(!isComplete(q,rec.value)){toast="Hãy chọn hoặc nhập đầy đủ đáp án trước khi kiểm tra.";render();return;}
   if(checkAnswer(q,rec.value)){
      rec.score=scoreForTime(rec.seconds,rec.wrongs);rec.phase="correct";save();render();return;
   }
   rec.wrongs++;rec.phase="hint";if(rec.wrongs>=2)rec.score=0;save();render();return;
 }
 if(action==="retry"&&rec.phase==="hint"){rec.phase="answering";save();render();return;}
 if(action==="next"&&rec.phase==="correct"){
   if(state.draft.index<9){state.draft.index++;save();render();}return;
 }
 if(action==="finish"&&rec.phase==="correct")completeTest();
});
setInterval(()=>{
 if(state.view!=="quiz")return;
 const rec=draftRecord();
 const now=performance.now();const dt=Math.min(.5,Math.max(0,(now-lastTick)/1000));lastTick=now;
 if(!rec||rec.phase!=="answering"||rec.wrongs>=2)return;
 rec.seconds+=dt;
 const t=document.getElementById("active-seconds"),p=document.getElementById("current-points");
 if(t)t.textContent=Math.floor(rec.seconds)+"s";
 if(p)p.textContent=scoreForTime(rec.seconds,rec.wrongs);
 if(now-lastSave>1200){lastSave=now;save();}
},250);
window.addEventListener("pagehide",save);
if(window.ResizeObserver) new ResizeObserver(sendHeight).observe(root);
window.addEventListener("resize",sendHeight);
render();
// Completion replay is safe: the backend stores the greatest TOTAL per test.
if(student!=="guest"&&window.parent!==window){
 for(const knowledge of [1,2]){
   const best=bestHistory(state.history,String(knowledge));
   if(best?.questionScores?.length===10){
     window.parent.postMessage({source:PAGE_SOURCE,kind:"quiz-completed",student,knowledge,
       earnedScore:best.score,questionScores:best.questionScores},location.origin);
   }
 }
}
