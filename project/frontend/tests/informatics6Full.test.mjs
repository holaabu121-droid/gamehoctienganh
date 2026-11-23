import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { INFORMATICS_LESSONS, INFORMATICS_S1_BRANCHES, INFORMATICS_S2_BRANCHES, buildInformaticsLesson } from "../src/features/informatics6/informaticsCurriculum.ts";

const catalog=JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json",import.meta.url),"utf8"));
const gameIds=["recognize","process","reason","diagnose","connect","safe-apply"];
const levels=["Cơ bản","Cơ bản","Cơ bản","Thông hiểu","Thông hiểu","Thông hiểu","Thông hiểu","Vận dụng","Vận dụng","Thử thách"];

test("Tin học 6 covers all 17 textbook lessons in two semesters",()=>{
  assert.equal(INFORMATICS_LESSONS.length,17);assert.equal(INFORMATICS_S1_BRANCHES.length,9);assert.equal(INFORMATICS_S2_BRANCHES.length,8);
  assert.deepEqual(INFORMATICS_LESSONS.map(x=>x.number),Array.from({length:17},(_,i)=>i+1));
  assert.equal(new Set(INFORMATICS_LESSONS.map(x=>x.id)).size,17);
  assert.deepEqual(catalog.courses.find(x=>x.id==="informatics-6-semester-1").branch_ids,INFORMATICS_S1_BRANCHES.map(x=>x.id));
  assert.deepEqual(catalog.courses.find(x=>x.id==="informatics-6-semester-2").branch_ids,INFORMATICS_S2_BRANCHES.map(x=>x.id));
});

for(const spec of INFORMATICS_LESSONS)test(`${spec.id} has teaching depth, six competencies and diagnostic progression`,()=>{
  const lesson=buildInformaticsLesson(spec);assert.ok(spec.objectives.length>=4);assert.equal(spec.concepts.length,6);assert.equal(lesson.foundations.length,3);
  const cards=lesson.foundations.flatMap(x=>x.items);assert.equal(cards.length,12);assert.equal(new Set(cards.map(x=>`${x.text}|${x.translation}`)).size,12);
  assert.equal(lesson.partPlan.length,5);assert.deepEqual(lesson.partPlan.map(x=>x.part),["Khởi động","Hình thành kiến thức","Luyện quy trình","Chẩn đoán – sửa sai","Vận dụng – sản phẩm"]);assert.ok(lesson.partPlan.every(x=>x.idea.length>60&&x.evidence.length>40));
  assert.equal(lesson.rubric.criteria.length,4);assert.match(lesson.rubric.criteria.join(" "),/mục tiêu.*Giải thích.*tự kiểm tra.*quyền riêng tư/s);
  assert.deepEqual(lesson.meta.map(x=>x.id),gameIds);assert.equal(new Set(lesson.meta.map(x=>x.activityId)).size,6);
  for(const gameId of gameIds){const rounds=lesson.rounds[gameId];assert.equal(rounds.length,10);assert.equal(new Set(rounds.map(x=>x.id)).size,10);assert.deepEqual(rounds.map(x=>x.context.split(" · ")[0]),levels);
    for(const round of rounds){assert.equal(round.options.length,4);assert.equal(new Set(round.options).size,4);assert.ok(round.options.includes(round.answer));const wrong=round.options.filter(x=>x!==round.answer);assert.equal(Object.keys(round.wrong_feedback).length,3);for(const option of wrong)assert.match(round.wrong_feedback[option],/Lỗi:.*Vì sao sai:.*Cách sửa:.*Ôn lại thẻ/s);}
    assert.equal(lesson.help[gameId].steps.length,4);assert.match(lesson.help[gameId].steps.join(" "),/Tự kiểm tra/);
  }
});

test("online and practical lessons carry explicit adult-permission and privacy safeguards",()=>{
  const safeguarded=[7,8,9,11,14].map(number=>INFORMATICS_LESSONS.find(x=>x.number===number));
  for(const spec of safeguarded){assert.ok(spec?.practice);assert.match(spec.practice,/cho phép|người lớn|cha mẹ|giáo viên|quyền|an toàn/i);}
  assert.ok(INFORMATICS_LESSONS.every(x=>buildInformaticsLesson(x).meta.every(game=>game.activityId.startsWith(x.id))));
});
