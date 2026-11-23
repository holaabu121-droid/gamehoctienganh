import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";
import {chromium} from "playwright";
import {readFileSync} from "node:fs";
import {buildLesson,chapterFilenames} from "../public/science6/lessonEngine.mjs";
const getData=f=>JSON.parse(readFileSync(new URL("../public/science6/data/"+f,import.meta.url),"utf8"));
const metadata=getData("curriculum.json");
function expectedFor(n){const l=metadata.lessons.find(x=>x.number===n);const rows=chapterFilenames(l.chapter).flatMap(f=>getData(f).rows);return buildLesson(rows.find(x=>x.number===n),l);}
const port=4194,url="http://127.0.0.1:"+port+"/science6/index.html";
const server=spawn("npx",["vite","--host","127.0.0.1","--port",String(port),"--strictPort"],{cwd:process.cwd(),stdio:"ignore"});
let browser;
async function ready(){
 for(let i=0;i<80;i++){try{const r=await fetch(url);if(r.ok)return;}catch{}await sleep(500);}
 throw Error("Vite server failed");
}
async function readCard(page,index){
 await page.locator('[data-action="card'+index+'"]').click();
 await page.locator("#readbox").evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event("scroll",{bubbles:true}));});
 await page.locator('[data-action="read"]').click();
}
async function run(){
 await ready();browser=await chromium.launch({headless:true});
 for(const w of [390,800]){
  const ctx=await browser.newContext({viewport:{width:w,height:900}});
  const page=await ctx.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(url,{waitUntil:"networkidle"});
  assert.equal(await page.locator("[data-lesson]").count(),55);
  for(const lesson of [2,28,55]){
   const expected=expectedFor(lesson);
   await page.locator('[data-lesson="'+lesson+'"]').click();
   await page.locator(".lesson-header h1").waitFor();
   assert.match(await page.locator(".lesson-header h1").textContent(),new RegExp("Bài "+lesson+":"));
   assert.equal(await page.locator('[data-action="questions"]').first().isDisabled(),true);
   if(await page.locator('[data-action="read"]').isDisabled()){
     await page.locator("#readbox").evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event("scroll",{bubbles:true}));});
   }
   await page.locator('[data-action="read"]').click();
   await page.locator('[data-action="card1"]').first().click();
   if(await page.locator('[data-action="read"]').isDisabled()){
     await page.locator("#readbox").evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event("scroll",{bubbles:true}));});
   }
   await page.locator('[data-action="read"]').click();
   assert.equal(await page.locator('[data-action="questions"]').first().isDisabled(),false);
   await page.locator('[data-action="questions"]').first().click();
   assert.equal(await page.locator(".exer-meta span").last().textContent(),"Câu 1/4");
   const first=expected.questions[0];
   const options=page.locator(".option");
   const wrong=options.and(page.getByRole("button",{name:first.options.find(x=>x!==first.answer),exact:true}));
   const correct=options.and(page.getByRole("button",{name:first.answer,exact:true}));
   await wrong.click();await page.locator('[data-action="check"]').click();
   assert.equal(await page.locator(".feedback.hint").count(),1,"must provide hint without score penalty");
   await correct.click();await page.locator('[data-action="check"]').click();
   assert.equal(await page.locator(".feedback.correct").count(),1,"accept correct answer");
   await page.locator('[data-action="next"]').click();
   const rows=page.locator("select[data-match]");
   assert.equal(await rows.count(),3);
   const matched=expected.questions[1];
   await rows.nth(1).selectOption(matched.answer[1]);
   assert.equal(await rows.nth(0).inputValue(),"","second row must not replace first");
   await page.locator('[data-action="check"]').click();
   assert.equal(await page.locator(".error").count(),1,"incomplete matching not accepted as an attempt");
   await rows.nth(0).selectOption(matched.answer[0]);
   await rows.nth(2).selectOption(matched.answer[2]);
   await page.locator('[data-action="check"]').click();
   assert.equal(await page.locator(".feedback.correct").count(),1,"3 matching fields independent");
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflow,false,"horizontal overflow at "+w+"px");
   await page.locator('[data-action="overview"]').click();
  }
  assert.deepEqual(errors,[],w+" px JS errors");
  await ctx.close();
 }
 console.log("PASS science KHTN 6 preview: 55 lessons, lesson 2/28/55, two cards, hint, 3 matching fields, incomplete answer, 390px and 800px");
}
try{await run();}finally{if(browser)await browser.close();server.kill("SIGTERM");}
