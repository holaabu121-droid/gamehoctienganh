import {chapterFilenames,validateChapter,buildLesson,checkPreviewAnswer,previewComplete,SCIENCE6_BLUEPRINT_VERSION} from "./lessonEngine.mjs";

const root=document.querySelector("#science-root");
const enc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const state={meta:null,lesson:null,chapterRows:new Map(),tab:"overview",read:[false,false],current:0,
  answers:{},tries:{},feedback:null,loading:false,error:""};
const title=()=>state.lesson?"Bài "+state.lesson.lesson.number+": "+state.lesson.lesson.title:"Thư viện Khoa học tự nhiên 6";
const action=(label,name,style="outline",disabled=false)=>'<button type="button" data-action="'+name+'" class="'+style+'"'+(disabled?" disabled":"")+'>'+enc(label)+'</button>';
const footer='<footer>Trích dữ liệu mục lục SGK do người dùng cung cấp. Nội dung học và bài tập là dự thảo cần thẩm định; không ghi vào hồ sơ học sinh.</footer>';

async function readJson(relative){
 const response=await fetch(relative,{cache:"no-store"});
 if(!response.ok)throw new Error("Không nạp được dữ liệu: "+relative);
 return response.json();
}
async function init(){
 try{state.meta=await readJson("./data/curriculum.json");render();}
 catch(e){root.textContent="Lỗi dữ liệu: "+String(e);}
}
async function openLesson(n){
 const meta=state.meta.lessons.find(l=>l.number===n);if(!meta)return;
 state.loading=true;render();
 try{
  if(!state.chapterRows.has(meta.chapter)){
   const list=await Promise.all(chapterFilenames(meta.chapter).map(f=>readJson("./data/"+f)));
   let rows=[];
   for(const ch of list){validateChapter(ch,state.meta);rows=rows.concat(ch.rows);}
   state.chapterRows.set(meta.chapter,rows);
  }
  const data=state.chapterRows.get(meta.chapter).find(x=>x.number===n);
  if(!data)throw new Error("Thiếu nội dung Bài "+n);
  state.lesson=buildLesson(data,meta);
  state.tab="card0";state.current=0;state.answers={};state.tries={};state.read=[false,false];state.feedback=null;state.error="";
 }catch(e){state.error=String(e);state.tab="overview";}
 finally{state.loading=false;render();}
}
function header(){
 return '<header><div><strong>KHOA HỌC TỰ NHIÊN 6</strong><span class="version">'+enc(SCIENCE6_BLUEPRINT_VERSION)+'</span></div>'+
 '<span class="draft">BẢN MẪU – CHƯA KIỂM DUYỆT</span></header>';
}
function overview(){
 return '<section class="intro"><p class="eyebrow">SGK KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</p><h1>Thiết kế học và luyện tập Khoa học tự nhiên 6</h1>'+
 '<p>10 chương · 55 bài. Mỗi bài có hai thẻ kiến thức và bốn câu mẫu để rà soát. Đây là bộ dữ liệu nền, không phải bộ đề chính thức.</p></section>'+
 state.meta.chapters.map(c=>'<section class="chapter"><h2>Chương '+c.number+': '+enc(c.title)+'</h2><div class="lessons">'+
 state.meta.lessons.filter(l=>l.chapter===c.number).map(l=>'<button type="button" class="lesson-link" data-lesson="'+l.number+'"><b>Bài '+l.number+': '+enc(l.title)+'</b><span>SGK trang '+l.printedPage+' · Xem hai thẻ & 4 câu mẫu</span></button>').join("")+
 '</div></section>').join("");
}
function lessonHeader(){
 const l=state.lesson.lesson;
 return '<div class="lesson-header">'+action("Danh sách bài","overview")+
 '<span class="label">Chương '+l.chapter+' · SGK trang '+l.printedPage+'</span>'+
 '<h1>'+enc(title())+'</h1><p>'+enc(l.chapterTitle)+'</p>'+
 '<nav class="tabs">'+action("Thẻ 1","card0",state.tab==="card0"?"active":"outline")+
 action("Thẻ 2","card1",state.tab==="card1"?"active":"outline")+
 action("Câu hỏi mẫu","questions",state.tab==="questions"?"active":"outline",!state.read.every(Boolean))+'</nav></div>';
}
function card(){
 const index=Number(state.tab.slice(-1));
 const c=state.lesson.cards[index];
 return '<section class="learning"><h2>'+enc(c.title)+'</h2><p>Đọc nội dung và ví dụ trước khi vào phần câu hỏi.</p>'+
 '<div class="readbox" id="readbox" tabindex="0"><ul>'+c.points.map(t=>'<li>'+enc(t)+'</li>').join("")+'</ul></div>'+
 '<p class="subdued">'+(state.read[index]?"Đã xác nhận đã đọc":"Cuộn đến cuối thẻ, sau đó xác nhận đã đọc.")+'</p>'+
 '<div class="actions">'+action("Đánh dấu đã đọc","read","primary",state.read[index])+
 (index===0?action("Thẻ tiếp theo","card1"):action("Xem câu hỏi mẫu","questions","primary",!state.read.every(Boolean)))+
 '</div></section>';
}
function questionView(){
 const row=state.lesson.questions[state.current];
 const value=state.answers[row.id]??(row.mode==="match"?Array(row.rows.length).fill(""):"");
 let form;
 if(row.mode==="single")form='<div class="choices">'+row.options.map((v,i)=>'<button type="button" class="option'+(value===v?" selected":"")+'" data-option="'+i+'" aria-pressed="'+(value===v)+'">'+enc(v)+'</button>').join("")+'</div>';
 else form='<div class="match">'+row.rows.map((name,i)=>'<label><span>'+enc(name)+'</span><select data-match="'+i+'" aria-label="Ghép '+enc(name)+'"><option value="">Chọn mô tả</option>'+
 row.options.map(v=>'<option value="'+enc(v)+'"'+(value[i]===v?" selected":"")+'>'+enc(v)+'</option>').join("")+'</select></label>').join("")+'</div>';
 const feedback=state.feedback&&state.feedback.id===row.id?'<div class="feedback '+(state.feedback.correct?"correct":"hint")+'" role="status">'+
 (state.feedback.correct?"<strong>Trả lời đúng.</strong><p>"+enc(row.explanation)+"</p>":"<strong>Chưa đúng.</strong><p>"+enc(row.hint)+"</p>")+"</div>":"";
 return '<section class="practice"><div class="exer-meta"><span>'+enc(row.id)+'</span><span>'+(row.level==="practice"?"Luyện tập":"Vận dụng")+'</span><span>Câu '+(state.current+1)+"/4</span></div>"+
 '<h2>'+enc(row.prompt)+'</h2>'+form+
 (state.error?'<p class="error" role="alert">'+enc(state.error)+'</p>':"")+
 feedback+'<div class="actions">'+action("Kiểm tra đáp án","check","primary")+
 action("Câu trước","prev","outline",state.current===0)+action("Câu tiếp","next","outline",state.current===3)+'</div>'+
 '<p class="subdued">Đây là câu hỏi mẫu để duyệt nội dung, chưa tính điểm hay lưu thành tích.</p></section>';
}
function render(){
 if(!state.meta){root.innerHTML="<p>Đang nạp danh mục…</p>";return;}
 root.innerHTML=header()+
 (state.loading?'<p>Đang nạp bài học…</p>':state.tab==="overview"||!state.lesson?overview():lessonHeader()+(state.tab==="questions"?questionView():card()))+
 (state.error&&state.tab==="overview"?'<p class="error">'+enc(state.error)+'</p>':"")+footer;
 const pane=root.querySelector("#readbox");
 if(pane&&pane.scrollHeight>pane.clientHeight+10&&!state.read[Number(state.tab.slice(-1))]){
   const mark=root.querySelector('[data-action="read"]');if(mark)mark.disabled=true;
 }
}
root.addEventListener("scroll",e=>{
 if(e.target.id!=="readbox")return;
 const p=e.target;if(p.scrollTop+p.clientHeight>=p.scrollHeight-12){
   const mark=root.querySelector('[data-action="read"]');if(mark)mark.disabled=false;
 }
},true);
root.addEventListener("change",e=>{
 const target=e.target;
 if(!target.matches("select[data-match]")||state.tab!=="questions")return;
 const q=state.lesson.questions[state.current],answer=[...(state.answers[q.id]||Array(q.rows.length).fill(""))];
 answer[Number(target.dataset.match)]=target.value;
 state.answers[q.id]=answer;state.feedback=null;state.error="";
});
root.addEventListener("click",async e=>{
 const lesson=e.target.closest("[data-lesson]");
 if(lesson){await openLesson(Number(lesson.dataset.lesson));return;}
 const choice=e.target.closest("[data-option]");
 if(choice&&state.tab==="questions"){
   const q=state.lesson.questions[state.current];
   state.answers[q.id]=q.options[Number(choice.dataset.option)];state.feedback=null;state.error="";render();return;
 }
 const btn=e.target.closest("[data-action]");if(!btn||btn.disabled)return;
 const act=btn.dataset.action;
 if(act==="overview"){state.tab="overview";state.error="";render();return;}
 if(act==="card0"||act==="card1"){state.tab=act;state.error="";render();return;}
 if(act==="read"){state.read[Number(state.tab.slice(-1))]=true;state.error="";render();return;}
 if(act==="questions"){if(state.read.every(Boolean)){state.tab=act;state.error="";render();}return;}
 if(act==="prev"||act==="next"){state.current+=(act==="prev"?-1:1);state.feedback=null;state.error="";render();return;}
 if(act==="check"){
   const q=state.lesson.questions[state.current],v=state.answers[q.id];
   if(!previewComplete(q,v)){state.error="Hãy hoàn thành tất cả ô trả lời trước khi kiểm tra.";render();return;}
   const correct=checkPreviewAnswer(q,v);
   state.feedback={id:q.id,correct};
   state.tries[q.id]=(state.tries[q.id]||0)+(correct?0:1);
   state.error="";render();
 }
});
void init();
