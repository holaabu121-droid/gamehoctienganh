// Draft KHTN 6 learning-blueprint compiler.
// Questions are original teaching examples, not copied from the SGK.
// No scoring, publication, or student-record synchronization here.
export const SCIENCE6_BLUEPRINT_VERSION = "0.1-draft";
export const SCIENCE6_PUBLISHED = false;
export const PRACTICE_TARGET = Object.freeze({perLesson:50,practice:30,application:20,draw:{"practice":6,"application":4},maxScore:1000});

export const LAB_REQUIRES_TEACHER = new Set([2,4,8,11,12,13,14,16,17,21,28,31,33]);
export const DIAGRAM_PRIORITIES = new Set([3,4,5,6,8,10,11,17,18,19,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,52,53,54,55]);

export function chapterFilenames(number){
  if(!Number.isInteger(number)||number<1||number>10)throw new RangeError("Chapter 1–10");
  if(number===7)return ["ch07a.json","ch07b.json"];
  return ["ch"+String(number).padStart(2,"0")+".json"];
}

export function validateChapter(data,metadata) {
  if(!data || !Number.isInteger(data.chapter)||!Array.isArray(data.rows))throw Error("Missing chapter");
  const lessons=metadata.lessons.filter(l=>l.chapter===data.chapter);
  const seen=new Set();
  for(const row of data.rows){
    if(!Number.isInteger(row.number)||!lessons.some(l=>l.number===row.number)||seen.has(row.number))throw Error("Unknown/repeated lesson "+row.number);
    seen.add(row.number);
    if(row.terms?.length!==3||row.cases?.length!==2)throw Error("Incorrect science draft template for lesson "+row.number);
    const names=new Set(),meanings=new Set();
    for(const term of row.terms){
      if(!term.name?.trim()||!term.meaning?.trim())throw Error("Empty science term "+row.number);
      names.add(term.name);meanings.add(term.meaning);
    }
    if(names.size!==3 ||meanings.size!==3)throw Error("Repeated science terms "+row.number);
    for(const scenario of row.cases){
      const answers=[scenario.answer,...(scenario.incorrect||[])];
      if(!scenario.prompt?.trim()||!scenario.hint?.trim()||answers.length!==3||answers.some(x=>!x?.trim())||new Set(answers).size!==3){
        throw Error("Invalid application scenario "+row.number);
      }
    }
  }
  return seen;
}

export function buildLesson(row,meta){
  const rotate=(xs,n)=>{const i=n%xs.length;return xs.slice(i).concat(xs.slice(0,i));};
  if(row.number!==meta.number)throw Error("Lesson metadata mismatch");
  const terms=row.terms,case1=row.cases[0],case2=row.cases[1];
  const id="KHTN6-B"+String(meta.number).padStart(2,"0");
  const cards=[
    {title:"Thẻ 1 · Khám phá kiến thức",points:terms.map(t=>t.name+": "+t.meaning),readAll:true},
    {title:"Thẻ 2 · Vận dụng và an toàn",points:[
      "Tình huống A: "+case1.prompt+" Gợi ý: "+case1.hint,
      "Tình huống B: "+case2.prompt+" Gợi ý: "+case2.hint,
      ...(LAB_REQUIRES_TEACHER.has(meta.number)?["Thực hành chỉ tiến hành khi được giáo viên hướng dẫn; không tự xử lý mẫu/chất/dụng cụ lạ."]:[])
    ],readAll:true}
  ];
  const questions=[
    {id:id+"-L01",level:"practice",mode:"single",prompt:"Khái niệm “"+terms[0].name+"” được hiểu đúng là gì?",
      options:rotate(terms.map(t=>t.meaning),meta.number%3),answer:terms[0].meaning,hint:"Đối chiếu từ khóa ở thẻ kiến thức 1.",explanation:terms[0].name+": "+terms[0].meaning},
    {id:id+"-L02",level:"practice",mode:"match",prompt:"Ghép mỗi khái niệm với mô tả đúng.",
      rows:terms.map(t=>t.name),options:rotate(terms.map(t=>t.meaning),(meta.number+1)%3),answer:terms.map(t=>t.meaning),
      hint:"Ghép lần lượt ba khái niệm theo đúng nội dung thẻ 1.",explanation:terms.map(t=>t.name+" → "+t.meaning).join("; ")},
    ...[case1,case2].map((s,i)=>({id:id+"-V0"+(i+1),level:"application",mode:"single",prompt:s.prompt,
      options:rotate([s.answer,...s.incorrect],(meta.number+i+1)%3),answer:s.answer,hint:s.hint,explanation:"Đáp án phù hợp: "+s.answer+". "+s.hint}))
  ];
  return {lesson:meta,cards,questions,reviewStatus:"pedagogical-review-required",readyForOfficialQuiz:false,
    needsDiagram:DIAGRAM_PRIORITIES.has(meta.number)};
}

export function checkPreviewAnswer(question,response){
 if(question.mode==="single")return typeof response==="string"&&response===question.answer;
 if(question.mode==="match")return Array.isArray(response)&&response.length===question.rows.length&&response.every((x,i)=>x===question.answer[i]);
 return false;
}

export function previewComplete(question,response) {
 if(question.mode==="single")return typeof response==="string"&&response.length>0;
 if(question.mode==="match")return Array.isArray(response)&&response.length===question.rows.length&&response.every(x=>typeof x==="string"&&x.length>0);
 return false;
}
