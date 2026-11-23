import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {buildStructuredBonus,validateStructuredUnit} from "../src/features/semester2/structuredUnitEngine.ts";
import {validateBonusLesson} from "../src/features/bonus/bonusEngine.ts";

const raw=JSON.parse(readFileSync(new URL("../../data/lessons/unit10_source.json",import.meta.url),"utf8"));
test("Unit 10 builds 42 games with ten rounds",()=>{const lesson=validateStructuredUnit(raw);assert.equal(Object.keys(lesson.games).length,42);assert.ok(Object.values(lesson.games).every(rounds=>rounds.length===10&&rounds.every(item=>item.options.includes(item.answer))));});
test("Unit 10 preserves book anchors and replacement audio",()=>{const lesson=validateStructuredUnit(raw);assert.equal(lesson.banks.vocabulary[0].answer,"fridge");assert.equal(lesson.banks.reading[0].answer,"an island");assert.equal(lesson.banks.project[0].answer,"choose an appliance");assert.ok(lesson.banks.listening.every(item=>item.source_status==="ai-generated"));assert.ok(lesson.source_note.includes("trang sách 38–47"));});
test("Unit 10 word-stress practice is slash-free and Bonus has 3x10 rounds",()=>{const lesson=validateStructuredUnit(raw);for(const game of ["acl1-sound","acl1-sound-sentence"])assert.ok(lesson.games[game].every(item=>!item.audio_text.includes("/")));const bonus=validateBonusLesson(buildStructuredBonus(raw));assert.deepEqual(bonus.selected_variants.map(id=>bonus.stages[id].rounds.length),[10,10,10]);});
test("Unit 10 Project drives games",()=>{const lesson=validateStructuredUnit(raw);assert.equal(lesson.games["project-presentation"][0].context,lesson.banks.project_checklist[0].context);const app=readFileSync(new URL("../src/App.tsx",import.meta.url),"utf8");assert.ok(app.includes("<Unit10 />"));});
