import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LESSONS } from "../public/math6-year/curriculum.mjs";
import {generateBank,checkGeneratedAnswer,drawGeneratedQuiz,pointsAt} from "../public/math6-year/bank.mjs";
const catalog=JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json",import.meta.url),"utf8"));
const src=readFileSync(new URL("../src/features/math6/Math6Lesson1Experience.tsx",import.meta.url),"utf8");
test("two semester sources cover exactly 43 consecutive textbook lessons",()=>{
  assert.equal(LESSONS.length,43);
  assert.deepEqual(LESSONS.map(l=>l.number),Array.from({length:43},(_,i)=>i+1));
  assert.equal(LESSONS.filter(l=>l.semester===1).length,22);
  assert.equal(LESSONS.filter(l=>l.semester===2).length,21);
  assert.equal(LESSONS[0].title,"Tập hợp");
  assert.equal(LESSONS[42].title,"Xác suất thực nghiệm");
  for(const l of LESSONS)assert.ok(l.title&&l.chapterTitle&&l.unitId&&l.printedPage);
});
test("41 generated lessons have exactly 50 non-identical prompts, 30 practice and 20 application",()=>{
 for(let lesson=3;lesson<=43;lesson++){
   const bank=generateBank(lesson);
   assert.equal(bank.length,50,"lesson "+lesson);
   assert.equal(new Set(bank.map(q=>q.id)).size,50);
   assert.equal(new Set(bank.map(q=>q.prompt)).size,50);
   assert.equal(bank.filter(q=>q.level==="practice").length,30);
   assert.equal(bank.filter(q=>q.level==="application").length,20);
   for(const q of bank){
     assert.ok(q.hint&&q.explanation&&q.prompt,q.id);
     assert.ok(checkGeneratedAnswer(q,q.answer),q.id+" rejected answer "+q.answer);
     if(q.mode==="single"){
       assert.ok(q.options.includes(q.answer),q.id);
       assert.equal(new Set(q.options).size,q.options.length,q.id);
       assert.ok(q.options.some(x=>!checkGeneratedAnswer(q,x)),q.id+" missing distractor");
     }
   }
 }
});
test("random quiz selection for every lesson always has 6 practice and 4 application, no repeats",()=>{
 for(let n=3;n<=43;n++){
  const bank=generateBank(n);
  for(let i=0;i<25;i++){
    const q=drawGeneratedQuiz(bank);
    assert.equal(q.length,10);assert.equal(new Set(q.map(x=>x.id)).size,10);
    assert.equal(q.filter(x=>x.level==="practice").length,6);
    assert.equal(q.filter(x=>x.level==="application").length,4);
  }
 }
});
test("equivalent fraction and decimal answers are accepted; extra words are refused",()=>{
 const f=generateBank(23)[0];
 assert.equal(f.mode,"fraction");
 const [n,d]=f.answer.split("/").map(Number);
 assert.equal(checkGeneratedAnswer(f,2*n+"/"+2*d),true);
 assert.equal(checkGeneratedAnswer(f,f.answer+" đồ vật"),false);
 const decimal=generateBank(29)[0];
 assert.equal(decimal.mode,"decimal");
 assert.ok(checkGeneratedAnswer(decimal,decimal.answer.replace(".",",")));
 assert.ok(!checkGeneratedAnswer(decimal,decimal.answer+" lít"));
 assert.equal(checkGeneratedAnswer(generateBank(14)[0],"1.0"),false);
});
test("score / time / two errors reproduce approved Math 6 rules",()=>{
 assert.equal(pointsAt(0,0),100);
 assert.equal(pointsAt(10,0),100);
 assert.equal(pointsAt(19.999,0),100);
 assert.equal(pointsAt(20,0),90);
 assert.equal(pointsAt(30,0),80);
 assert.equal(pointsAt(110,0),0);
 assert.equal(pointsAt(0,1),50);
 assert.equal(pointsAt(20,1),40);
 assert.equal(pointsAt(0,2),0);
});
test("new semesters share same profile bridge but never overwrite original Math 1/2 code",()=>{
 assert.ok(src.includes("event.source !== frame.current?.contentWindow"));
 assert.ok(src.includes("event.origin !== window.location.origin"));
 assert.ok(src.includes("saveActivityProgress"));
 assert.ok(src.includes("/math6-bai1/index.html"));
 assert.ok(src.includes("/math6-bai2/index.html"));
 const courses=catalog.courses.filter(c=>c.subject==="math");
 assert.equal(courses.length,2);
 assert.equal(courses[0].branch_ids.length,22);
 assert.equal(courses[1].branch_ids.length,21);
});
