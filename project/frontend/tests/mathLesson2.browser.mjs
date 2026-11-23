import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";
import { QUESTIONS } from "../public/math6-bai2/questions.mjs";
import { newRecord } from "../public/math6-bai2/engine.mjs";

const port=4188;
const base="http://127.0.0.1:"+port+"/math6-bai2/index.html?student=browser_student";
const server=spawn("npx",["vite","--host","127.0.0.1","--port",String(port),"--strictPort"],{cwd:process.cwd(),stdio:"ignore"});
let browser;
const byId=new Map(QUESTIONS.map(q=>[q.id,q]));
const optionFor=(page,value)=>page.locator(".answer-option").and(page.getByRole("button",{name:String(value),exact:true})).first();

async function choose(page,q,correct) {
  if(q.mode==="single") {
    const v=correct?q.answer:q.options.find(x=>x!==q.answer);
    await optionFor(page,v).click();
    return;
  }
  if(q.mode==="multi"){
    const wanted=correct?q.answer:[q.answer[0]];
    for(const value of q.options){
      const option=optionFor(page,value);
      const pressed=(await option.getAttribute("aria-pressed"))==="true";
      if(pressed!==wanted.includes(value))await option.click();
    }
    return;
  }
  if(q.mode==="order"){
    if(await page.locator('[data-action="clear-order"]').isEnabled())await page.locator('[data-action="clear-order"]').click();
    const order=correct?q.answer:q.answer.slice().reverse();
    for(const value of order){
      await page.locator('[data-action="tile"]').filter({hasText:value}).first().click();
    }
    return;
  }
  if(q.mode==="match"){
    const order=correct?q.answer:q.answer.map((_,i)=>q.answer[(i+1)%q.answer.length]);
    for(let i=0;i<order.length;i++)await page.locator('select[data-match="'+i+'"]').selectOption(order[i]);
    return;
  }
  const v=correct?q.answer:(q.mode==="number"?"999999":"IIII");
  await page.locator("#answer-entry").fill(v);
}
async function cardDone(page,n){
  await page.locator('[data-action="card-'+n+'"]').click();
  await page.locator("#learning-scroll").evaluate(el=>{
    el.scrollTop=el.scrollHeight;
    el.dispatchEvent(new Event("scroll",{bubbles:true}));
  });
  await page.locator('[data-action="mark-read"]').click();
}
async function waitReady(){
  for(let i=0;i<120;i++){
    try {const r=await fetch(base);if(r.ok)return;}catch{}
    await sleep(500);
  }
  throw Error("Vite server failed to start");
}
async function main(){
 await waitReady();
 browser=await chromium.launch({headless:true});
 for(const width of [390,800]){
   const context=await browser.newContext({viewport:{width,height:900}});
   const page=await context.newPage();const errors=[];
   page.on("pageerror",error=>errors.push(error.message));
   await page.goto(base,{waitUntil:"networkidle"});
   assert.equal(await page.getByText("Cách ghi số tự nhiên",{exact:true}).count()>0,true);
   assert.equal(await page.locator('[data-action="test-1"]').isDisabled(),true,"requires both knowledge cards");
   await cardDone(page,1);
   assert.equal(await page.locator('[data-action="test-1"]').isDisabled(),true,"requires second knowledge card");
   await cardDone(page,2);
   assert.equal(await page.locator('[data-action="test-1"]').isDisabled(),false);
   await page.locator('[data-action="test-1"]').click();
   for(let i=0;i<10;i++){
     const id=(await page.locator(".quiz-meta .tag").first().textContent()).trim();
     const q=byId.get(id);
     assert.ok(q,id+" must exist");
     if(i===0){
       // Two wrong answers: hint pauses time; score is zero but must continue to correctness.
       await choose(page,q,false);await page.locator('[data-action="check"]').click();
       assert.equal(await page.locator(".feedback.hint").count(),1);
       const t1=await page.locator("#active-seconds").textContent();
       await sleep(650);
       const t2=await page.locator("#active-seconds").textContent();
       assert.equal(t1,t2,"hint must freeze clock");
       await page.locator('[data-action="retry"]').click();
       await page.locator('[data-action="check"]').click();
       assert.match(await page.locator(".feedback.hint").textContent(),/0 điểm/);
       await page.locator('[data-action="retry"]').click();
       await choose(page,q,true);
     }else await choose(page,q,true);
     await page.locator('[data-action="check"]').click();
     assert.equal(await page.locator(".feedback.correct").count(),1,id+" must grade correctly");
     if(i===0)assert.match(await page.locator(".feedback.correct").textContent(),/0 điểm/);
     await page.locator('[data-action="'+(i===9?"finish":"next")+'"]').click();
   }
   assert.equal(await page.locator(".results-table tbody tr").count(),10);
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem("toan6.bai2.v01.progress.student.browser_student")));
   assert.equal(stored.history["1"].length,1);
   assert.equal(stored.history["1"][0].questionScores[0],0);
   // Retry/resume must not lose question selection; another knowledge test stays separate.
   await page.locator('[data-action="home"]').click();
   await page.locator('[data-action="test-2"]').click();
   const before=(await page.locator(".quiz-meta .tag").first().textContent()).trim();
   await page.locator('[data-action="home"]').click();
   await page.locator('[data-action="resume"]').click();
   const after=(await page.locator(".quiz-meta .tag").first().textContent()).trim();
   assert.equal(before,after,"unfinished test must resume at same question");
   await page.reload({waitUntil:"networkidle"});
   assert.equal((await page.locator(".quiz-meta .tag").first().textContent()).trim(),before,"reload must preserve question");
   const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2);
   assert.equal(noOverflow,true,"mobile layout must not overflow viewport");
   if(width===390){
     // Recreate a specific four-row matching question to check focus independence.
     // Seed after pagehide persistence but before the lesson bootstrap.
     await page.addInitScript(()=>{
       const key="toan6.bai2.v01.progress.student.browser_student";
       const st=JSON.parse(localStorage.getItem(key));
       st.view="quiz";
       st.draft={knowledge:1,index:0,questionIds:Array(10).fill("TP-V04"),
         orders:{},records:Array.from({length:10},()=>({
         questionId:"TP-V04",value:[],wrongs:0,seconds:0,phase:"answering",score:null}))};
       localStorage.setItem(key,JSON.stringify(st));
     });
     await page.reload({waitUntil:"networkidle"});
     await page.locator('select[data-match="1"]').selectOption("305");
     assert.equal(await page.locator('select[data-match="0"]').inputValue(),"");
     assert.equal(await page.locator('select[data-match="1"]').inputValue(),"305");
     await page.locator('select[data-match="0"]').selectOption("4");
     assert.equal(await page.locator('select[data-match="1"]').inputValue(),"305");
     await page.locator('select[data-match="2"]').selectOption("020");
     await page.locator('select[data-match="3"]').selectOption("007");
     await page.locator('[data-action="check"]').click();
     assert.equal(await page.locator(".feedback.correct").count(),1,"matching rows must not overwrite each other");
   }
   assert.deepEqual(errors,[],"no JavaScript runtime errors expected at "+width+"px");
   await context.close();
 }
 console.log("PASS Bài 2 Chromium 390/800: 50-question app, two-card gate, wrong twice, hint pause, all 10 answers, resume, per-field matching, no horizontal overflow");
}
try{await main();}finally{if(browser)await browser.close();server.kill("SIGTERM");}
