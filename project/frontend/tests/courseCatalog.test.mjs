import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { descriptorMatchesCourse } from "../src/curriculum/courseRegistryCore.ts";

const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
const library = readFileSync(new URL("../src/features/courses/CourseLibrary.tsx", import.meta.url), "utf8");

test("English-only catalog retains both semesters and lesson order", () => {
  assert.equal(catalog.default_course_id,"english-6-semester-1");
  assert.deepEqual(catalog.courses.map(x=>x.id),["english-6-semester-1","english-6-semester-2"]);
  assert.ok(catalog.courses.every(x=>x.subject==="english" && x.status==="available"));
  assert.deepEqual(catalog.courses[0].branch_ids,["unit1","unit2","unit3","review1","unit4","unit5","unit6","review2"]);
  assert.deepEqual(catalog.courses[1].branch_ids,["unit7","unit8","unit9","review3","unit10","unit11","unit12","review4"]);
});
test("only English renderers are registered; other subjects are absent from the UI", () => {
  assert.match(app, /"english-6-semester-1": English6Semester1Experience/);
  assert.match(app, /"english-6-semester-2": English6Semester2Experience/);
  assert.ok(!/function (Math6|Science6|Vietnamese6|Informatics6)Experience/.test(app));
  assert.ok(!/"(?:math|science|informatics|vietnamese)-6-semester-1":/.test(registry));
  assert.ok(library.includes("Chọn học kỳ Tiếng Anh"));
  assert.ok(app.includes("<CourseLibrary catalog={catalog} onSelect={selectCourse} />"));
});
test("each English semester starts at its first registered unit",()=>{
  for(const course of catalog.courses) {
    assert.ok(descriptorMatchesCourse(course,{courseId:course.id,initialBranch:course.branch_ids[0],branchIds:course.branch_ids}));
    assert.ok(!descriptorMatchesCourse(course,{courseId:course.id,initialBranch:"unregistered",branchIds:course.branch_ids}));
  }
});
