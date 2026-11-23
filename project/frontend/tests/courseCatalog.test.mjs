import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { descriptorMatchesCourse } from "../src/curriculum/courseRegistryCore.ts";

const read=path=>readFileSync(new URL(path,import.meta.url),"utf8");
const catalog=JSON.parse(read("../../data/curriculum/catalog.json"));
const app=read("../src/App.tsx");
const registry=read("../src/curriculum/courseRegistry.ts");
const library=read("../src/features/courses/CourseLibrary.tsx");
const math=read("../src/features/math6/Math6Lesson1Experience.tsx");
const mathHtml=read("../public/math6-bai1/index.html");
test("multisubject catalog keeps 2 English semesters and adds only Math Lesson 1",()=>{
  assert.equal(catalog.default_course_id,"english-6-semester-1");
  assert.deepEqual(catalog.courses.map(x=>x.id),["english-6-semester-1","english-6-semester-2","math-6-semester-1"]);
  assert.deepEqual(catalog.courses.map(x=>x.subject),["english","english","math"]);
  assert.deepEqual(catalog.courses[0].branch_ids,["unit1","unit2","unit3","review1","unit4","unit5","unit6","review2"]);
  assert.deepEqual(catalog.courses[1].branch_ids,["unit7","unit8","unit9","review3","unit10","unit11","unit12","review4"]);
  assert.deepEqual(catalog.courses[2].branch_ids,["math6-bai1-v054"]);
});
test("each available course has a registered renderer and first branch",()=>{
  for(const c of catalog.courses){
    const initial=c.branch_ids[0];
    assert.ok(registry.includes('initialBranch: "'+initial+'"'));
    assert.ok(descriptorMatchesCourse(c,{courseId:c.id,initialBranch:initial,branchIds:c.branch_ids}));
  }
  assert.ok(app.includes('"math-6-semester-1": Math6Lesson1Experience'));
  assert.ok(library.includes("Chọn môn học và học kỳ"));
});
test("Math is embedded with 50 exact original questions and a per-student storage namespace",()=>{
  assert.equal((mathHtml.match(/"KN[12]-[LV]\d\d"/g)||[]).length,50);
  assert.ok(mathHtml.includes("const STORE='toan6.bai1.v05.progress' +"));
  assert.ok(mathHtml.includes("sendCompletion(quiz.knowledge,results)"));
  assert.ok(math.includes('math6-bai1-v054-kn'));
  assert.ok(math.includes("event.source !== frame.current?.contentWindow"));
});
