import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { QUESTIONS } from "../public/math6-bai2/questions.mjs";
import { selectQuiz, checkAnswer, isComplete, scoreForTime, normalizeNumber, romanValue, toRoman } from "../public/math6-bai2/engine.mjs";
const read=p=>readFileSync(new URL(p,import.meta.url),"utf8");
const app=read("../public/math6-bai2/app.mjs");
const page=read("../public/math6-bai2/index.html");
const react=read("../src/features/math6/Math6Lesson1Experience.tsx");
const catalog=JSON.parse(read("../../data/curriculum/catalog.json"));

test("exactly 50 independently labeled math questions, correct bank distribution",()=>{
 assert.equal(QUESTIONS.length,50);
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,50);
 for(const subject of [1,2]){
   assert.equal(QUESTIONS.filter(q=>q.knowledge===subject&&q.level==="practice").length,15);
   assert.equal(QUESTIONS.filter(q=>q.knowledge===subject&&q.level==="application").length,10);
 }
 assert.deepEqual(QUESTIONS.map(q=>q.id).filter(id=>! /^(TP|LM)-(L|V)\d{2}$/.test(id)),[]);
});
test("all 50 canonical answers are accepted, incomplete answers are not marked wrong",()=>{
 for(const q of QUESTIONS){
   assert.ok(q.prompt&&q.hint&&q.explanation,q.id+" must have teaching content");
   assert.ok(checkAnswer(q,q.answer),q.id+" rejected its correct answer");
   assert.ok(isComplete(q,q.answer),q.id+" correct answer appears incomplete");
   assert.equal(isComplete(q,q.mode==="multi"||q.mode==="match"||q.mode==="order"?[]:""),false,q.id+" empty answer");
 }
});
test("every multiple choice question rejects a distractor and multi-selection rejects partial or extra",()=>{
 for(const q of QUESTIONS.filter(x=>x.mode==="single")){
   const wrong=q.options.find(x=>x!==q.answer);
   assert.ok(wrong,q.id+" needs a distractor");
   assert.equal(checkAnswer(q,wrong),false,q.id);
 }
 for(const q of QUESTIONS.filter(x=>x.mode==="multi")){
   assert.equal(checkAnswer(q,q.answer.slice(1)),false,q.id+" incorrectly accepts incomplete selection");
   const wrong=q.options.find(x=>!q.answer.includes(x));
   assert.ok(wrong,q.id+" needs wrong option");
   assert.equal(checkAnswer(q,[...q.answer,wrong]),false,q.id+" incorrectly accepts extra option");
   assert.equal(checkAnswer(q,q.answer.slice().reverse()),true,q.id+" wrongly assumes option ordering");
 }
});
test("match and order inputs must satisfy all slots; repeated identical tiles are allowed",()=>{
 for(const q of QUESTIONS.filter(x=>x.mode==="match")){
   assert.equal(checkAnswer(q,q.answer.slice(1)),false,q.id);
   assert.equal(checkAnswer(q,q.answer.map((v,i)=>q.answer[(i+1)%q.answer.length])),false,q.id);
   assert.equal(isComplete(q,q.answer.map((v,i)=>i===0?"":v)),false,q.id);
 }
 for(const q of QUESTIONS.filter(x=>x.mode==="order")){
   assert.equal(checkAnswer(q,q.answer.slice().reverse()),false,q.id+" should require the correct order");
   assert.equal(isComplete(q,q.answer.slice(0,-1)),false,q.id);
   assert.deepEqual(q.answer.slice().sort(),q.tiles.slice().sort(),q.id);
 }
 assert.equal(checkAnswer(QUESTIONS.find(x=>x.id==="LM-V08"),["X","X","I","I","I"]),true);
});
test("decimal parsing accepts equivalent valid thousands grouping, rejects trailing words or invalid groups",()=>{
 for(const ok of ["35029","35 029","35.029","7 205 018","7.205.018"]){
   assert.notEqual(normalizeNumber(ok),null,ok);
 }
 for(const bad of ["35.29","35 02 9","35,029","35029 đồng","000542","-7","1.2.3","12abc"]){
   assert.equal(normalizeNumber(bad),null,bad);
 }
 assert.equal(checkAnswer(QUESTIONS.find(q=>q.id==="TP-V03"),["3","5","0","2","9"]),true);
 assert.equal(checkAnswer(QUESTIONS.find(q=>q.id==="TP-L11"),"000542"),false);
 assert.equal(checkAnswer(QUESTIONS.find(q=>q.id==="TP-L12"),"5 723 841"),true);
 assert.equal(checkAnswer(QUESTIONS.find(q=>q.id==="TP-V02"),"43.507"),true);
});
test("Roman 1..30: canonical forms, lower-case input, invalid alternatives",()=>{
 for(let n=1;n<=30;n++)assert.equal(romanValue(toRoman(n)),n);
 assert.equal(toRoman(4),"IV");assert.equal(toRoman(9),"IX");
 assert.equal(toRoman(24),"XXIV");assert.equal(toRoman(29),"XXIX");
 for(const bad of ["IIII","VIIII","IIV","XIXI","IIX","0","XXXI",""]){
   assert.equal(romanValue(bad),null,bad);
 }
 assert.equal(checkAnswer(QUESTIONS.find(q=>q.id==="LM-L07")," iii "),true);
 assert.equal(checkAnswer(QUESTIONS.find(q=>q.id==="LM-L09"),"xii"),true);
});
test("question draw is 6 practice + 4 application, non-repeating for each knowledge",()=>{
 for(let k of [1,2])for(let i=0;i<120;i++){
   const quiz=selectQuiz(QUESTIONS,k);
   assert.equal(quiz.length,10);
   assert.equal(new Set(quiz.map(q=>q.id)).size,10);
   assert.equal(quiz.filter(q=>q.level==="practice").length,6);
   assert.equal(quiz.filter(q=>q.level==="application").length,4);
   assert.ok(quiz.every(q=>q.knowledge===k));
 }
});
test("grading: first 10 seconds free, then every elapsed 10-second interval; first/second errors",()=>{
 assert.equal(scoreForTime(0),100);assert.equal(scoreForTime(10),100);
 assert.equal(scoreForTime(19.99),100);assert.equal(scoreForTime(20),90);
 assert.equal(scoreForTime(29.99),90);assert.equal(scoreForTime(30),80);
 assert.equal(scoreForTime(110),0);assert.equal(scoreForTime(300),0);
 assert.equal(scoreForTime(0,1),50);assert.equal(scoreForTime(20,1),40);
 assert.equal(scoreForTime(20,2),0);assert.equal(scoreForTime(0,3),0);
 assert.ok(scoreForTime(120,1)>=0);
});
test("previous bugs: input focus, hints pause timer, retries, resume, separate student storage",()=>{
 assert.ok(app.includes('event.target.id!=="answer-entry"'));
 assert.ok(app.includes('event.target.matches("select[data-match]")'));
 assert.ok(app.includes('if(!isComplete(q,rec.value))'));
 assert.ok(app.includes('rec.wrongs++;rec.phase="hint"'));
 assert.ok(app.includes('rec.wrongs>=2'));
 assert.ok(app.includes('rec.phase!=="answering"||rec.wrongs>=2'));
 assert.ok(app.includes('if(action==="retry"'));
 assert.ok(app.includes('state.draft&&state.draft.index<10'));
 assert.ok(app.includes('"toan6.bai2.v01.progress.student."+student'));
 assert.ok(app.includes('sendCompletion(row.knowledge,draft.records)'));
 assert.ok(page.includes('name="viewport"'));
 assert.ok(page.includes('overflow-x:auto'));
});
test("Bài 1 preserved; Bài 2 has its own activities and same-origin completion bridge",()=>{
 const math=catalog.courses.find(c=>c.id==="math-6-semester-1");
 assert.deepEqual(math.branch_ids,["math6-bai1-v054","math6-bai2-v01"]);
 assert.ok(react.includes('key={lesson}'));
 assert.ok(react.includes('event.origin !== window.location.origin'));
 assert.ok(react.includes('event.source !== frame.current?.contentWindow'));
 assert.ok(react.includes('selected.unitId + (knowledge === 1 ? "-tp" : "-lm")'));
 assert.ok(react.includes('saveActivityProgress(selected.unitId, activityId, earned, 1000, true)'));
 assert.ok(!react.includes('earned, 1000, true, scores as number[]'));
 assert.equal(QUESTIONS.filter(q=>q.mode==="number"||q.mode==="roman").length,11);
});
