import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const report=JSON.parse(await readFile(path.join(ROOT,"data","informatics6","reports","three-role-evaluation.json"),"utf8"));

test("báo cáo bao phủ đủ Tin học 6 và đúng ba vai trò",()=>{
  assert.equal(report.evidence.lessons,17);assert.equal(report.evidence.topics,6);assert.equal(report.evidence.games,102);assert.equal(report.evidence.questions,1020);
  assert.equal(report.evidence.concepts,102);assert.equal(report.evidence.foundation_cards,204);assert.equal(report.evidence.unique_foundation_cards,204);assert.equal(report.evidence.part_plans,85);assert.equal(report.evidence.rubric_lessons,17);
  assert.deepEqual(Object.keys(report.role_reviews),["student","classroom_teacher","education_expert"]);
});
test("mỗi vai trò có thang 100 và bằng chứng định lượng",()=>{for(const review of Object.values(report.role_reviews)){assert.equal(review.maximum,100);assert.equal(review.criteria.reduce((s,x)=>s+x.maximum,0),100);assert.equal(review.criteria.reduce((s,x)=>s+x.score,0),review.score);assert.ok(review.criteria.every(x=>x.evidence.length>30));}});
test("mô phỏng học sinh đi đủ luồng sai phản hồi sửa đúng",()=>{assert.deepEqual(report.evidence.student_simulation,{attempted:1020,feedback_shown:1020,corrected:1020,invalid:0});assert.equal(report.evidence.diagnostic_feedback,3060);assert.equal(report.evidence.diagnostic_contract_complete,3060);});
test("khó 3-4-2-1 và sáu năng lực được giữ cho mọi bài",()=>{assert.deepEqual(report.evidence.difficulty_distribution,{"Cơ bản":306,"Thông hiểu":408,"Thử thách":102,"Vận dụng":204});for(const count of Object.values(report.evidence.game_distribution))assert.equal(count,17);});
test("báo cáo kiểm tra đủ tích hợp điểm và renderer",()=>{assert.deepEqual(report.evidence.integration,{semester1_branches:9,semester2_branches:8,renderer_registered:true,activity_plan_registered:true,separate_subject_score:true});});
test("báo cáo không đánh tráo mô phỏng thành thử nghiệm người thật",()=>{assert.match(report.review_mode,/not-human-teacher-student-or-full-ui-validation/);assert.equal(report.evidence.limitations.human_students,0);assert.equal(report.evidence.limitations.human_teachers,0);assert.equal(report.release_decision.broad_student_release,"PILOT_REQUIRED");assert.ok(report.release_decision.blocking_reasons.length>=4);});
