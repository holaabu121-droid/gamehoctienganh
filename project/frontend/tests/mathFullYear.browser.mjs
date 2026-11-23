import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";
import {chromium} from "playwright";
import {generateBank} from "../public/math6-year/bank.mjs";
const port=4191,url=n=>"http://127.0.0.1:"+port+"/math6-year/index.html?student=browser_student&lesson="+n;
const server=spawn("npx",["vite","--host","127.0.0.1","--port",String(port),"--strictPort"],{cwd:process.cwd(),stdio:"ignore"});
const tests=[3,23,43];let browser;
async function waitReady(){
 for(let i=0;i<80;i++){try{const r=await fetch(url(43));if(r.ok)return;}catch{}await sleep(500);}
 throw Error("Vite did not start");
}
async function readCard(page,n){
 await page.locator('[data-action="card-'+n+'"]').click();
 await page.locator("#reading").evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event("scroll",{bubbles:true}));});
 await page.locator('[data-action="read"]').click();
}
async function respond(page,q,correct){
 if(q.mode==="single"){
   const answer=correct?q.answer:q.options.find(x=>x!==q.answer);
   await page.locator(".option").and(page.getByRole("button",{name:String(answer),exact:true})).first().click();
 } else {
   const answer=correct?q.answer:q.mode==="fraction"?"1/999999":q.mode==="decimal"?"999999,99":"99999999";
   await page.locator("#response").fill(String(answer));
 }
}
async function run(){
 await waitReady();browser=await chromium.launch({headless:true});
 for(const width of [390,800]){
  const ctx=await browser.newContext({viewport:{width,height:900}});
  const page=await ctx.newPage();
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  for(const lesson of tests){
    const bank=new Map(generateBank(lesson).map(q=>[q.id,q]));
    await page.goto(url(lesson),{waitUntil:"networkidle"});
    assert.ok((await page.locator("h1").first().textContent()).length>4);
    assert.equal(await page.locator('[data-action="start"]').isDisabled(),true);
    await readCard(page,1);assert.equal(await page.locator('[data-action="start"]').isDisabled(),true);
    await readCard(page,2);assert.equal(await page.locator('[data-action="start"]').isDisabled(),false);
    await page.locator('[data-action="start"]').click();
    for(let i=0;i<10;i++){
      const id=(await page.locator(".meta .pill").first().textContent()).trim();
      const q=bank.get(id);assert.ok(q,"Unknown question "+id);
      if(i===0){
        await respond(page,q,false);
        await page.locator('[data-action="check"]').click();
        assert.equal(await page.locator(".feedback:not(.good)").count(),1);
        const c1=await page.locator("#clock").textContent();
        await sleep(580);
        const c2=await page.locator("#clock").textContent();
        assert.equal(c1,c2,"Timer must pause while hint is visible");
        await page.locator('[data-action="retry"]').click();
        await page.locator('[data-action="check"]').click();
        assert.match(await page.locator(".feedback").textContent(),/0 điểm/);
        await page.locator('[data-action="retry"]').click();
        await respond(page,q,true);
      }else await respond(page,q,true);
      await page.locator('[data-action="check"]').click();
      assert.equal(await page.locator(".feedback.good").count(),1,id+" must accept correct answer");
      if(i===0)assert.match(await page.locator(".feedback.good").textContent(),/0\/100/);
      await page.locator('[data-action="'+(i===9?"finish":"next")+'"]').click();
    }
    assert.equal(await page.locator("table tbody tr").count(),10);
    const old=await page.evaluate(lesson=>JSON.parse(localStorage.getItem("math6-math6-bai"+String(lesson).padStart(2,"0")+"-v01.student.browser_student")),lesson);
    assert.equal(old.history.length,1);
    assert.equal(old.history[0].scores[0],0);
    await page.locator('[data-action="home"]').click();
    await page.locator('[data-action="start"]').click();
    const before=(await page.locator(".meta .pill").first().textContent()).trim();
    await page.locator('[data-action="home"]').click();
    await page.locator('[data-action="resume"]').click();
    assert.equal((await page.locator(".meta .pill").first().textContent()).trim(),before);
    await page.reload({waitUntil:"networkidle"});
    assert.equal((await page.locator(".meta .pill").first().textContent()).trim(),before);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    assert.equal(overflow,false,"Horizontal overflow at "+width+" px");
  }
  assert.deepEqual(errors,[],"No browser page errors expected");
  await ctx.close();
 }
 console.log("PASS: browser lessons 3,23,43 at 390/800px; 60 questions, hint, second error, resume, isolated scores");
}
try{await run();}finally{if(browser)await browser.close();server.kill("SIGTERM");}
