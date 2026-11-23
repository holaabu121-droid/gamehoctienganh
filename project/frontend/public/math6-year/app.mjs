import { LESSONS } from "./curriculum.mjs";
import { generateBank,checkGeneratedAnswer,drawGeneratedQuiz,pointsAt } from "./bank.mjs";

const p=new URLSearchParams(location.search);
const number=Number(p.get("lesson"));
const lesson=LESSONS.find(l=>l.number===number&&number>=3);
const root=document.getElementById("math-app");
if(!lesson){root.textContent="Không tìm thấy bài học đã yêu cầu. Hãy quay lại danh sách bài.";throw Error("Lesson not found");}
const studentRaw=p.get("student")||"";
const student=/^[a-zA-Z0-9_-]{3,64}$/.test(studentRaw)?studentRaw:"guest";
const key="math6-"+lesson.unitId+".student."+student;
const bank=generateBank(number),byId=new Map(bank.map(q=>[q.id,q]));
const escapeHTML=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state;
try{state=JSON.parse(localStorage.getItem(key)||"null");}catch{state=null;}
if(!state||!Array.isArray(state.read)||!Array.isArray(state.history)){
 state={read:[false,false],view:"home",draft:null,history:[],last:null};
}
if(state.draft&&state.draft.index<10)state.view="quiz";
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
let notice="",tick=performance.now(),lastSave=performance.now();
const current=()=>state.draft?byId.get(state.draft.ids[state.draft.index]):null;
const record=()=>state.draft?.records?.[state.draft.index];
const qbtn=(label,act,kind="secondary",disabled=false)=>
 '<button type="button" class="'+kind+'" data-action="'+act+'"'+(disabled?" disabled":"")+'>'+escapeHTML(label)+'</button>';
const calcScore=(r)=>pointsAt(r.seconds,r.wrongs);
const canTest=()=>state.read.every(Boolean);
function postSize(){
 if(window.parent===window)return;
 const height=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
 window.parent.postMessage({source:lesson.unitId,kind:"resize",height},location.origin);
}
function header(sub){
 return '<header class="header"><span class="pill">Toán 6 · '+escapeHTML(lesson.semester===1?"Học kỳ 1":"Học kỳ 2")+'</span><span class="pill muted">Bài '+number+' / 43</span></header>'+
 '<h1>'+escapeHTML(lesson.title)+'</h1><p class="sub">'+escapeHTML(sub)+'</p>';
}
function home(){
 const last=state.history.length?state.history[state.history.length-1]:null;
 const best=state.history.reduce((a,b)=>!a||b.score>a.score?b:a,null);
 let cards='<div class="cards">';
 for(let i=0;i<2;i++){
  const text=i===0?"Nắm kiến thức và cách làm":"Xem ví dụ vận dụng";
  cards+='<article class="card"><span class="pill">Thẻ '+(i+1)+'</span><h2>'+text+'</h2><p class="muted">'+(state.read[i]?"Đã đọc đủ":"Chưa đọc đủ")+'</p>'+qbtn("Mở thẻ kiến thức "+(i+1),"card-"+(i+1),"secondary")+'</article>';
 }
 cards+='</div>';
 return header("Nội dung tự luyện theo chủ đề SGK; ngân hàng câu hỏi do chương trình sinh tự động, đang chờ rà soát chuyên môn.")+
 '<div class="details"><strong>Chương '+lesson.chapter+': '+escapeHTML(lesson.chapterTitle)+'</strong><p>SGK tập '+lesson.volume+', trang '+lesson.printedPage+'. Luyện tập với 50 biến thể bài tập: 30 luyện tập và 20 vận dụng.</p></div>'+
 (state.draft&&state.draft.index<10?'<div class="notice">Bạn có một đề đang làm dở. '+qbtn("Tiếp tục","resume","primary")+'</div>':"")+
 cards+'<section class="card"><h2>Kiểm tra kiến thức</h2><p>Đề ngẫu nhiên 10 câu: 6 luyện tập + 4 vận dụng. Tối đa 1.000 điểm.</p>'+
 '<p>Đọc đủ cả hai thẻ kiến thức để mở bài kiểm tra. Câu hỏi không lặp trong một đề.</p>'+
 qbtn("Mở bài kiểm tra","start","primary",!canTest()||!!state.draft)+
 (last?'<p class="muted">Lần gần nhất: '+last.score+'/1000 · Tốt nhất: '+best.score+'/1000</p>':"")+'</section>';
}
function teaching(){
 const index=Number(state.view.slice(-1))-1;
 const sample=bank[index===0?0:30];
 const note=index===0?"Đọc đề, xác định khái niệm và dữ kiện quan trọng, chọn phép tính hoặc lập luận phù hợp.":"Thử áp dụng vào tình huống thực tế: tính từng bước, kiểm tra đơn vị và so sánh lại với dữ kiện.";
 return header("Thẻ kiến thức "+(index+1)+" / 2")+'<section class="card teaching"><span class="pill">Bài '+number+' · Thẻ '+(index+1)+'</span><h2>'+(index===0?"Nhận biết và tính toán":"Vận dụng và kiểm tra")+'</h2>'+
 '<div class="reading" id="reading" tabindex="0"><p>'+escapeHTML(note)+'</p><p><strong>Chủ đề:</strong> '+escapeHTML(lesson.title)+'</p>'+
 '<h3>Ví dụ minh họa</h3><p>'+escapeHTML(sample.prompt)+'</p><p><strong>Gợi ý:</strong> '+escapeHTML(sample.hint)+'</p><p><strong>Lời giải:</strong> '+escapeHTML(sample.explanation)+'</p>'+
 '<h3>Cách tự kiểm tra</h3><p>Đọc kỹ điều kiện, kiểm tra đáp án có đúng kiểu cần trả lời hay không, thay kết quả ngược lại vào đề và kiểm tra tính hợp lý.</p>'+
 '<p><em>Các ví dụ ở đây được tạo để luyện tập, không phải bản chép nguyên văn bài tập SGK.</em></p></div>'+
 '<div class="actions">'+qbtn("Về danh sách","home")+qbtn(state.read[index]?"Đã đọc":"Đánh dấu đã đọc đủ","read","primary",state.read[index])+'</div>'+
 (!state.read[index]?'<p class="muted">Cuộn đến cuối nội dung thẻ để bật nút xác nhận.</p>':"")+'</section>';
}
function answerView(q,r){
 if(q.mode==="single")return '<p class="control-label">Chọn một phương án</p><div class="options">'+q.options.map((v,i)=>'<button type="button" data-action="option" data-option="'+i+'" aria-pressed="'+(r.value===v)+'" class="option'+(r.value===v?" chosen":"")+'">'+escapeHTML(v)+'</button>').join("")+'</div>';
 return '<label class="control-label" for="response">'+(q.mode==="fraction"?"Nhập phân số (ví dụ: 3/4)":q.mode==="decimal"?"Nhập số thập phân (dấu phẩy hoặc dấu chấm đều được)":"Nhập một số nguyên")+'</label>'+
 '<input type="text" id="response" inputmode="'+(q.mode==="fraction"?"text":"decimal")+'" autocomplete="off" spellcheck="false" value="'+escapeHTML(r.value)+'" placeholder="'+(q.mode==="fraction"?"Ví dụ: 2/3":q.mode==="decimal"?"Ví dụ: 3,5":"Ví dụ: 48")+'">';
}
function quiz(){
 const q=current(),r=record();if(!q||!r)return home();
 const idx=state.draft.index,score=r.phase==="correct"?r.score:calcScore(r);
 return header("Câu "+(idx+1)+"/10 · "+(q.level==="practice"?"Luyện tập":"Vận dụng"))+
 '<section class="card question"><div class="meta"><span class="pill">'+escapeHTML(q.id)+'</span><span class="pill">'+(q.level==="practice"?"Luyện tập":"Vận dụng")+'</span></div>'+
 '<div class="progress"><span style="width:'+idx*10+'%"></span></div><p class="problem">'+escapeHTML(q.prompt)+'</p>'+
 answerView(q,r)+
 '<div class="score-line"><span>Đồng hồ: <strong id="clock">'+Math.floor(r.seconds)+'s</strong></span><span>Điểm hiện tại: <strong id="score">'+score+'</strong>/100</span></div>'+
 (notice?'<p class="notice" role="alert">'+escapeHTML(notice)+'</p>':"")+
 (r.phase==="answering"?'<div class="actions">'+qbtn("Kiểm tra đáp án","check","primary")+qbtn("Về bài học (lưu đề)","home")+'</div>':"")+
 (r.phase==="hint"?'<div class="feedback"><h3>'+(r.wrongs>=2?"Sai 2 lần – 0 điểm":"Gợi ý sau lần sai đầu")+'</h3><p>'+escapeHTML(q.hint)+'</p>'+(r.wrongs>=3?'<p>'+escapeHTML(q.explanation)+'</p>':"")+'<p>Đồng hồ đã tạm dừng.</p>'+qbtn("Tôi đã hiểu – thử lại","retry","primary")+'</div>':"")+
 (r.phase==="correct"?'<div class="feedback good"><h3>Đúng · '+r.score+'/100 điểm</h3><p>'+escapeHTML(q.explanation)+'</p>'+qbtn(idx===9?"Xem kết quả":"Câu tiếp theo",idx===9?"finish":"next","primary")+'</div>':"")+
 '</section>';
}
function result(){
 const r=state.last;if(!r)return home();const best=state.history.reduce((a,b)=>!a||b.score>a.score?b:a,null);
 return header("Hoàn thành bài kiểm tra")+'<section class="card"><p class="super">Điểm đề vừa làm: '+r.score+'/1000</p><p>Điểm cao nhất của Bài '+number+': '+best.score+'/1000</p>'+
 '<table><thead><tr><th>Câu</th><th>Điểm</th></tr></thead><tbody>'+r.ids.map((id,i)=>'<tr><td>'+escapeHTML(id)+'</td><td>'+r.scores[i]+'</td></tr>').join("")+'</tbody></table>'+
 '<div class="actions">'+qbtn("Về bài học","home")+qbtn("Làm đề khác","start","primary")+'</div></section>';
}
function render(){
 root.innerHTML=(state.view==="quiz"?quiz():state.view==="card1"||state.view==="card2"?teaching():state.view==="result"?result():home())+
 '<footer>Toán 6 · Bài '+number+' · Bài tập tự tạo theo chủ đề. Cần kiểm duyệt chuyên môn trước khi dùng chính thức.</footer>';
 notice="";
 if(state.view==="card1"||state.view==="card2"){
  const pane=root.querySelector("#reading"),mark=root.querySelector('[data-action="read"]');
  if(pane&&mark&&!state.read[Number(state.view.slice(-1))-1]) mark.disabled=pane.scrollHeight>pane.clientHeight+8;
 }
 tick=performance.now();postSize();
}
function begin(){
 if(!canTest())return;
 if(state.draft){state.view="quiz";save();render();return;}
 const selected=drawGeneratedQuiz(bank);
 state.draft={ids:selected.map(q=>q.id),records:selected.map(q=>({value:"",wrongs:0,seconds:0,score:null,phase:"answering"})),index:0};
 state.view="quiz";save();render();
}
function messageScore(r){
 if(student==="guest"||window.parent===window)return;
 const scores=r.scores;
 if(scores.length!==10||scores.some(x=>!Number.isInteger(x)||x<0||x>100))return;
 window.parent.postMessage({source:lesson.unitId,kind:"quiz-completed",student,knowledge:1,
   earnedScore:scores.reduce((a,b)=>a+b,0),questionScores:scores},location.origin);
}
function end(){
 const draft=state.draft;if(!draft||draft.records.some(r=>r.phase!=="correct"))return;
 const r={ids:draft.ids.slice(),scores:draft.records.map(z=>z.score),score:draft.records.reduce((a,b)=>a+b.score,0),finishedAt:new Date().toISOString()};
 state.last=r;state.history=[...state.history,r].slice(-40);state.draft=null;state.view="result";save();render();messageScore(r);
}
root.addEventListener("scroll",event=>{
 if(event.target.id!=="reading")return;
 const e=event.target;if(e.scrollTop+e.clientHeight>=e.scrollHeight-14){const b=root.querySelector('[data-action="read"]');if(b)b.disabled=false;}
},true);
root.addEventListener("input",event=>{
 if(event.target.id!=="response")return;
 const r=record();if(r&&r.phase==="answering"){r.value=event.target.value;save();}
});
root.addEventListener("click",event=>{
 const b=event.target.closest("[data-action]");if(!b||b.disabled)return;const a=b.dataset.action;
 if(a==="home"){state.view="home";save();render();return;}
 if(a==="card-1"||a==="card-2"){state.view=a==="card-1"?"card1":"card2";save();render();return;}
 if(a==="read"){const i=Number(state.view.slice(-1))-1;state.read[i]=true;state.view="home";save();render();return;}
 if(a==="start"||a==="resume"){begin();return;}
 const r=record(),q=current();if(!r||!q)return;
 if(a==="option"&&r.phase==="answering"){r.value=q.options[Number(b.dataset.option)];save();render();return;}
 if(a==="check"&&r.phase==="answering"){
   if(!String(r.value).trim()){notice="Hãy nhập hoặc chọn đáp án trước khi kiểm tra.";render();return;}
   if(checkGeneratedAnswer(q,r.value)){r.score=calcScore(r);r.phase="correct";save();render();}
   else{r.wrongs++;r.phase="hint";if(r.wrongs>=2)r.score=0;save();render();}
   return;
 }
 if(a==="retry"&&r.phase==="hint"){r.phase="answering";save();render();return;}
 if(a==="next"&&r.phase==="correct"){state.draft.index++;save();render();return;}
 if(a==="finish"&&r.phase==="correct"){end();}
});
setInterval(()=>{
 const now=performance.now(),delta=Math.min(.5,Math.max(0,(now-tick)/1000));tick=now;
 if(state.view!=="quiz")return;
 const r=record();if(!r||r.phase!=="answering"||r.wrongs>=2)return;
 r.seconds+=delta;
 const clock=root.querySelector("#clock"),score=root.querySelector("#score");
 if(clock)clock.textContent=Math.floor(r.seconds)+"s";
 if(score)score.textContent=calcScore(r);
 if(now-lastSave>1100){lastSave=now;save();}
},250);
window.addEventListener("pagehide",save);
window.addEventListener("resize",postSize);
if(window.ResizeObserver)new ResizeObserver(postSize).observe(root);
render();
if(student!=="guest"&&window.parent!==window){
 const best=state.history.reduce((a,b)=>!a||b.score>a.score?b:a,null);
 if(best)messageScore(best);
}
