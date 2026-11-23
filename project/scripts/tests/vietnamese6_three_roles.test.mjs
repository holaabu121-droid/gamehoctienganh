import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const report=JSON.parse(await readFile(path.join(ROOT,"data","vietnamese6","reports","three-role-evaluation.json"),"utf8"));

test("report covers both semesters and exactly three roles",()=>{assert.equal(report.evidence.lessons,10);assert.equal(report.evidence.reviews,2);assert.deepEqual(report.evidence.semester_branches,[6,6]);assert.equal(report.evidence.games,72);assert.equal(report.evidence.questions,720);assert.deepEqual(Object.keys(report.role_reviews),["student","classroom_teacher","education_expert"]);});
test("each role uses a 100-point evidence-based rubric",()=>{for(const review of Object.values(report.role_reviews)){assert.equal(review.maximum,100);assert.equal(review.criteria.reduce((s,x)=>s+x.maximum,0),100);assert.equal(review.criteria.reduce((s,x)=>s+x.score,0),review.score);assert.ok(review.criteria.every(x=>x.evidence.length>40));}});
test("student simulation exercises wrong-feedback-correction flow",()=>{assert.deepEqual(report.evidence.student_simulation,{attempted:720,feedback_shown:720,corrected:720,invalid:0});assert.equal(report.evidence.diagnostic_feedback,2160);assert.equal(report.evidence.diagnostic_contract_complete,2160);});
test("difficulty and six competencies remain exact",()=>{assert.deepEqual(report.evidence.difficulty_distribution,{"Cơ bản":216,"Thông hiểu":288,"Thử thách":72,"Vận dụng":144});assert.deepEqual(report.evidence.game_distribution,{communicate:12,compose:12,infer:12,language:12,organize:12,trace:12});});
test("copyright, open work and integration gates are explicit",()=>{assert.equal(report.evidence.ai_generated_questions,720);assert.equal(report.evidence.source_safety.long_copied_passages,0);assert.equal(report.evidence.open_work.auto_scored_personal_feelings,0);assert.deepEqual(report.evidence.integration.catalog_courses,["available","available"]);assert.ok(report.evidence.integration.renderer_registered&&report.evidence.integration.activity_plan_registered&&report.evidence.integration.subject_score_label);});
test("report does not substitute simulation for human validation",()=>{assert.match(report.review_mode,/not-human-teacher-student-or-full-ui-validation/);assert.equal(report.evidence.limitations.human_students,0);assert.equal(report.evidence.limitations.human_teachers,0);assert.equal(report.release_decision.broad_student_release,"PILOT_REQUIRED");assert.ok(report.release_decision.blocking_reasons.length>=4);});
