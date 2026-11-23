import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {chapterFilenames,validateChapter,buildLesson,checkPreviewAnswer,previewComplete,
  SCIENCE6_PUBLISHED,PRACTICE_TARGET,DIAGRAM_PRIORITIES,LAB_REQUIRES_TEACHER} from "../public/science6/lessonEngine.mjs";

const read=(path)=>JSON.parse(readFileSync(new URL("../public/science6/data/"+path,import.meta.url),"utf8"));
const meta=read("curriculum.json");
const lessons=[];
for(const chapter of meta.chapters){
  const parts=chapterFilenames(chapter.number).map(read);
  const ids=new Set();
  for(const part of parts){
    assert.equal(part.chapter,chapter.number);
    for(const id of validateChapter(part,meta))assert.equal(ids.has(id),false,"Duplicate lesson in chapter"),ids.add(id);
    for(const row of part.rows){
      const l=meta.lessons.find(x=>x.number===row.number);
      lessons.push(buildLesson(row,l));
    }
  }
  assert.deepEqual([...ids].sort((a,b)=>a-b),chapter.lessonIds.slice().sort((a,b)=>a-b));
}
test("matches the supplied science 6 textbook structure: 10 chapters and 55 lessons",()=>{
 assert.equal(meta.chapterCount,10);assert.equal(meta.lessonCount,55);
 assert.equal(meta.source.pdfPageCount,199);
 assert.deepEqual(meta.source.pdfTocPages,[5,6,7]);
 assert.equal(lessons.length,55);
 assert.deepEqual(lessons.map(x=>x.lesson.number).sort((a,b)=>a-b),Array.from({length:55},(_,i)=>i+1));
 assert.equal(meta.lessons[0].title,"Giới thiệu về Khoa học tự nhiên");
 assert.equal(meta.lessons.at(-1).title,"Ngân Hà");
 assert.equal(meta.source.note.includes("không phân chia học kỳ"),true);
 for(const item of lessons)assert.equal(item.lesson.pdfPageOneBased,item.lesson.printedPage+1);
});
test("every lesson includes two nonempty foundational learning cards",()=>{
 assert.equal(lessons.reduce((n,x)=>n+x.cards.length,0),110);
 for(const l of lessons){
   assert.equal(l.cards.length,2,l.lesson.title);
   assert.ok(l.cards.every(c=>c.points.length>=2&&c.points.every(x=>x.length>12)),l.lesson.title);
   assert.equal(l.reviewStatus,"pedagogical-review-required");
   assert.equal(l.readyForOfficialQuiz,false);
 }
});
test("220 independently selectable prototype questions: 2 recognition + 2 application for each lesson",()=>{
 let total=0;
 for(const l of lessons){
   const qs=l.questions;
   assert.equal(qs.length,4,l.lesson.title);
   assert.equal(qs.filter(x=>x.level==="practice").length,2);
   assert.equal(qs.filter(x=>x.level==="application").length,2);
   assert.equal(new Set(qs.map(x=>x.id)).size,4);
   for(const q of qs){
     assert.ok(q.prompt&&q.hint&&q.explanation,q.id);
     assert.ok(checkPreviewAnswer(q,q.answer),q.id+" correct answer rejected");
     assert.ok(previewComplete(q,q.answer),q.id+" marked complete answer as empty");
     const blank=q.mode==="match"?Array(q.rows.length).fill(""):"";
     assert.equal(previewComplete(q,blank),false,q.id+" empty accepted");
     if(q.mode==="single"){
       assert.equal(q.options.length,3,q.id);
       assert.equal(new Set(q.options).size,3,q.id);
       for(const x of q.options.filter(v=>v!==q.answer))assert.equal(checkPreviewAnswer(q,x),false,q.id);
     }else{
       assert.equal(q.mode,"match");
       assert.equal(q.rows.length,3);
       assert.equal(q.answer.length,3);
       assert.equal(checkPreviewAnswer(q,q.answer.slice(1)),false,q.id+" ignores rows");
       assert.equal(checkPreviewAnswer(q,[q.answer[1],q.answer[0],q.answer[2]]),false,q.id+" allows reversed rows");
     }
     total++;
   }
 }
 assert.equal(total,220);
});
test("target 50 questions per lesson remains a plan, NOT falsely published content",()=>{
 assert.deepEqual(PRACTICE_TARGET,{perLesson:50,practice:30,application:20,draw:{practice:6,application:4},maxScore:1000});
 assert.equal(SCIENCE6_PUBLISHED,false);
 assert.ok(LAB_REQUIRES_TEACHER.has(2));
 assert.ok(LAB_REQUIRES_TEACHER.has(28));
 assert.ok(DIAGRAM_PRIORITIES.has(41));
 assert.ok(DIAGRAM_PRIORITIES.has(54));
});
test("browser prototype doesn't register an unapproved graded KHTN course",()=>{
 const catalog=JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json",import.meta.url),"utf8"));
 assert.ok(catalog.courses.every(c=>c.subject!=="science"));
 const html=readFileSync(new URL("../public/science6/index.html",import.meta.url),"utf8");
 const js=readFileSync(new URL("../public/science6/preview.mjs",import.meta.url),"utf8");
 assert.ok(html.includes('name="viewport"'));
 assert.ok(html.includes("Bản mẫu"));
 assert.ok(js.includes("BẢN MẪU"));
 assert.ok(js.includes("previewComplete(q,v)"));
 assert.ok(js.includes("data-match"));
 assert.ok(js.includes("Đây là câu hỏi mẫu"));
 assert.equal(js.includes("saveActivityProgress"),false);
});
