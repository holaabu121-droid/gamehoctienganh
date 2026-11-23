import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { descriptorMatchesCourse } from "../src/curriculum/courseRegistryCore.ts";

const catalog = JSON.parse(readFileSync(new URL("../../data/curriculum/catalog.json", import.meta.url), "utf8"));
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const library = readFileSync(new URL("../src/features/courses/CourseLibrary.tsx", import.meta.url), "utf8");
const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const profile = readFileSync(new URL("../src/features/profile/ScoreProfile.tsx", import.meta.url), "utf8");

test("catalog preserves English and opens Math 6 semester 1 at lesson 1", () => {
  assert.equal(catalog.default_course_id, "english-6-semester-1");
  assert.deepEqual(catalog.courses.map(({ id }) => id), [
    "english-6-semester-1", "english-6-semester-2", "math-6-semester-1", "math-6-semester-2", "informatics-6-semester-1", "informatics-6-semester-2", "vietnamese-6-semester-1", "vietnamese-6-semester-2",
    "science-6-semester-1", "science-6-semester-2",
  ]);
  assert.deepEqual(catalog.courses[0].branch_ids, ["unit1", "unit2", "unit3", "review1", "unit4", "unit5", "unit6", "review2"]);
  assert.equal(catalog.courses[0].status, "available");
  assert.equal(catalog.courses[1].status, "available");
  assert.deepEqual(catalog.courses[1].branch_ids, ["unit7", "unit8", "unit9", "review3", "unit10", "unit11", "unit12", "review4"]);
  assert.equal(catalog.courses[2].status, "available");
  assert.equal(catalog.courses[2].branch_ids.length, 38);
  assert.deepEqual(catalog.courses[2].branch_ids.slice(0, 7), ["math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5", "math6-s1-chapter1-practice", "math6-s1-chapter1-review"]);
  assert.deepEqual(catalog.courses[2].branch_ids.slice(-3), ["math6-s1-activity-card-room", "math6-s1-activity-geogebra", "math6-s1-activity-calculator"]);
  assert.equal(catalog.courses[3].status, "available");
  assert.equal(catalog.courses[3].branch_ids.length, 36);
  assert.equal(catalog.courses[3].branch_ids[0], "math6-s2-lesson23");
  assert.equal(catalog.courses[3].branch_ids.at(-1), "math6-s2-final-review");
  assert.deepEqual(catalog.courses[4].branch_ids, Array.from({length:9},(_,i)=>`informatics6-s1-lesson${i+1}`));
  assert.deepEqual(catalog.courses[5].branch_ids, Array.from({length:8},(_,i)=>`informatics6-s2-lesson${i+10}`));
  assert.deepEqual(catalog.courses[6].branch_ids, [...Array.from({length:5},(_,i)=>`vietnamese6-s1-lesson${i+1}`),"vietnamese6-s1-review"]);
  assert.deepEqual(catalog.courses[7].branch_ids, [...Array.from({length:5},(_,i)=>`vietnamese6-s2-lesson${i+6}`),"vietnamese6-s2-review"]);
  assert.deepEqual(catalog.courses[8].branch_ids, Array.from({length:28},(_,i)=>`science6-l${String(i+1).padStart(2,"0")}`));
  assert.deepEqual(catalog.courses[9].branch_ids, Array.from({length:27},(_,i)=>`science6-l${String(i+29).padStart(2,"0")}`));
});

test("course library keeps the existing navigation behind the available course", () => {
  assert.ok(app.includes("<CourseLibrary catalog={catalog} onSelect={selectCourse} />"));
  assert.ok(app.includes("descriptor.initialBranch"));
  assert.ok(app.includes("COURSE_RENDERERS[descriptor.rendererKey]"));
  assert.ok(app.includes("authApi.getCourseCatalog()"));
  assert.ok(app.includes("Đổi môn · học kỳ"));
  assert.ok(library.includes("disabled={!available}"));
  assert.ok(library.includes("catalog.courses.map"));
});

test("semester navigation wraps every Unit and Review into a responsive grid", () => {
  const branchNav = app.match(/<nav className="course-branch-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.equal((branchNav.match(/<button /g) ?? []).length, 10, "library, profile, six units and two reviews stay reachable");
  assert.ok(branchNav.indexOf("Unit 5") < branchNav.indexOf("Unit 6"));
  assert.ok(branchNav.indexOf("Unit 6") < branchNav.indexOf("Review 2"));
  assert.match(styles, /\.course-branch-nav\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.course-branch-nav\s*\{\s*grid-template-columns:\s*repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media \(max-width: 620px\)[\s\S]*?\.course-branch-nav\s*\{\s*grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
});

test("authenticated startup opens the library and entering a course starts its first branch", () => {
  assert.ok(app.includes('if (status === "anonymous") return <AuthGate />;'));
  assert.ok(app.includes('return <LearningApp />;'));
  assert.ok(app.includes('useState<string | null>(null)'));
  assert.ok(!app.includes('localStorage.getItem("english-quest.course-id")'));
  assert.ok(!app.includes('localStorage.setItem("english-quest.course-id"'));
  assert.ok(registry.includes('initialBranch: "unit1"'));
  assert.ok(registry.includes('initialBranch: "unit7"'));
  assert.ok(registry.includes('initialBranch: "math6-s1-lesson1"'));
  assert.ok(registry.includes('initialBranch: "math6-s2-lesson23"'));
  assert.ok(app.includes('"english-6-semester-2": English6Semester2Experience'));
  assert.ok(app.includes('"math-6-semester-1": Math6Semester1Experience'));
  assert.ok(app.includes('"math-6-semester-2": Math6Semester2Experience'));
  assert.ok(app.includes('"informatics-6-semester-1": Informatics6Experience'));
  assert.ok(app.includes('"informatics-6-semester-2": Informatics6Experience'));
  assert.ok(app.includes('"science-6-semester-1": Science6Experience'));
  assert.ok(app.includes('"science-6-semester-2": Science6Experience'));
  assert.ok(registry.includes('initialBranch: "informatics6-s1-lesson1"'));
  assert.ok(registry.includes('initialBranch: "informatics6-s2-lesson10"'));
  assert.ok(registry.includes('initialBranch: "science6-l01"'));
  assert.ok(registry.includes('initialBranch: "science6-l29"'));
  assert.ok(indexHtml.includes("Thư viện học tập · Lớp 6"));

  const auth = readFileSync(new URL("../src/auth/AuthGate.tsx", import.meta.url), "utf8");
  assert.ok(auth.includes("Thư viện học tập lớp 6"));
  assert.ok(auth.includes("tiến độ riêng của từng môn"));
  assert.ok(!auth.includes("tiến độ Unit 3"));

  const course = catalog.courses[0];
  assert.equal(descriptorMatchesCourse(course, {
    courseId: course.id,
    initialBranch: course.branch_ids[0],
    branchIds: course.branch_ids,
  }), true);
  assert.equal(descriptorMatchesCourse(course, {
    courseId: course.id,
    initialBranch: course.branch_ids[1],
    branchIds: course.branch_ids,
  }), false, "an available course must open at its first registered branch");
});

test("an available course without a registered renderer stays closed", () => {
  const course = { id: "english-6-semester-3", status: "available", branch_ids: ["unit13"] };
  assert.equal(descriptorMatchesCourse(course, undefined), false);
  assert.equal(descriptorMatchesCourse(course, {
    courseId: course.id,
    initialBranch: "unit3",
    branchIds: course.branch_ids,
  }), false, "the initial branch must also belong to the registered course shell");
});

test("multi-subject profile presents branch ids as learning labels instead of technical ids", () => {
  assert.ok(profile.includes("Thành tích tốt nhất từng bài và phần ôn tập"));
  assert.ok(profile.includes("Bài tập cuối Chương"));
  assert.ok(profile.includes("Hoạt động thực hành trải nghiệm"));
  assert.ok(profile.includes("Ôn tập cuối năm"));
  assert.ok(profile.includes("Khoa học tự nhiên · Bài"));
});
