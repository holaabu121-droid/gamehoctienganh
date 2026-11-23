import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isSkills1Answer, validateSkills1Data } from "../src/features/skills-1/skills1Engine.ts";
const raw=JSON.parse(readFileSync(new URL("../../data/lessons/unit3_skills1.json",import.meta.url),"utf8"));
test("Skills 1 has five scored games of ten rounds",()=>{const lesson=validateSkills1Data(raw);assert.deepEqual(Object.values(lesson.games).map(items=>items.length),[10,10,10,10,10]);assert.equal(Object.values(lesson.games).flat().length,50);});
test("Skills 1 preserves provenance and literal anchors",()=>{const lesson=validateSkills1Data(raw);const items=Object.values(lesson.games).flat();assert.ok(items.some(x=>x.source_status==="user-provided-reference"));assert.ok(items.some(x=>x.source_status==="ai-generated"));assert.deepEqual(lesson.source_material.email_friends,["Jimmy","Phong","Nhung"]);assert.equal(isSkills1Answer(lesson.games.scanner[0]," kids aged 10–15 "),true);});
test("Skills 1 rejects invalid counts, answers and embedded images",()=>{const count=structuredClone(raw);count.games.reason.pop();assert.throws(()=>validateSkills1Data(count),/exactly 10/);const answer=structuredClone(raw);answer.games.scanner[0].answer="missing";assert.throws(()=>validateSkills1Data(answer),/invalid/);const image=structuredClone(raw);image.games.file[0].image="page.jpg";assert.throws(()=>validateSkills1Data(image),/image fields/);});
test("Skills 1 help explains completion and feedback",()=>{const lesson=validateSkills1Data(raw);for(const help of Object.values(lesson.game_help)){assert.ok(help.steps.some(x=>x.includes("10")));assert.ok(help.steps.some(x=>/đúng|sai|phản hồi/i.test(x)));}});
