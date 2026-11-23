import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { VIETNAMESE_LESSONS, VIETNAMESE_S1_BRANCHES, VIETNAMESE_S2_BRANCHES, buildVietnameseLesson } from "../src/features/vietnamese6/vietnameseCurriculum.ts";

const catalog=JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json",import.meta.url),"utf8"));
const gameIds=["trace","organize","infer","language","compose","communicate"];
const levels=["Cơ bản","Cơ bản","Cơ bản","Thông hiểu","Thông hiểu","Thông hiểu","Thông hiểu","Vận dụng","Vận dụng","Thử thách"];

test("Ngữ văn 6 covers ten lessons and two semester reviews",()=>{
  assert.equal(VIETNAMESE_LESSONS.length,12);assert.equal(VIETNAMESE_S1_BRANCHES.length,6);assert.equal(VIETNAMESE_S2_BRANCHES.length,6);
  assert.deepEqual(VIETNAMESE_LESSONS.filter(x=>x.number).map(x=>x.number),Array.from({length:10},(_,i)=>i+1));
  assert.equal(new Set(VIETNAMESE_LESSONS.map(x=>x.id)).size,12);
  assert.deepEqual(catalog.courses.find(x=>x.id==="vietnamese-6-semester-1").branch_ids,VIETNAMESE_S1_BRANCHES.map(x=>x.id));
  assert.deepEqual(catalog.courses.find(x=>x.id==="vietnamese-6-semester-2").branch_ids,VIETNAMESE_S2_BRANCHES.map(x=>x.id));
});

for(const spec of VIETNAMESE_LESSONS)test(`${spec.id} has all parts, six competencies and diagnostic progression`,()=>{
  const lesson=buildVietnameseLesson(spec);
  assert.ok(spec.objectives.length>=5);assert.equal(spec.concepts.length,6);assert.ok(spec.partIdeas.length>=5);assert.equal(lesson.foundations.length,2);assert.equal(lesson.foundations.flatMap(x=>x.items).length,12);
  assert.deepEqual(lesson.meta.map(x=>x.id),gameIds);assert.equal(new Set(lesson.meta.map(x=>x.activityId)).size,6);
  const all=[];
  for(const gameId of gameIds){const rounds=lesson.rounds[gameId];all.push(...rounds);assert.equal(rounds.length,10);assert.equal(new Set(rounds.map(x=>x.id)).size,10);assert.deepEqual(rounds.map(x=>x.context.split(" · ")[0]),levels);
    for(const round of rounds){assert.equal(round.source_status,"ai-generated");assert.equal(round.options.length,4);assert.equal(new Set(round.options).size,4);assert.ok(round.options.includes(round.answer));const wrong=round.options.filter(x=>x!==round.answer);assert.equal(Object.keys(round.wrong_feedback).length,3);for(const option of wrong)assert.match(round.wrong_feedback[option],/Lỗi .*Vì sao sai:.*Cách sửa:.*Ôn lại thẻ:/s);}
    assert.equal(lesson.help[gameId].steps.length,4);assert.match(lesson.help[gameId].steps.join(" "),/Tự kiểm tra/);
  }
  assert.equal(new Set(all.map(x=>`${x.context}|${x.prompt}`)).size,60);
});

test("open and sensitive work uses rubrics, privacy choices and no copied long text",()=>{
  for(const spec of VIETNAMESE_LESSONS){assert.match(spec.rubric,/rubric|tiêu chí|không chấm|tự đánh giá|tự sửa/i);assert.match(spec.privacyNote,/không|cho phép|quyền|có thể|hư cấu/i);assert.ok(spec.readings.every(title=>title.length<90));}
  const book=VIETNAMESE_LESSONS.find(x=>x.number===10);assert.equal(book.partIdeas.length,6);assert.match(book.rubric,/không chấm tự động/);
  const environment=VIETNAMESE_LESSONS.find(x=>x.number===9);assert.match(environment.privacyNote,/phụ huynh|giáo viên/);
});

test("all generated activity ids remain stable and course-scoped",()=>{
  const ids=VIETNAMESE_LESSONS.flatMap(spec=>buildVietnameseLesson(spec).meta.map(game=>game.activityId));
  assert.equal(ids.length,72);assert.equal(new Set(ids).size,72);assert.ok(ids.every(id=>/^vietnamese6-s[12]-(lesson\d+|review)-/.test(id)));
});
