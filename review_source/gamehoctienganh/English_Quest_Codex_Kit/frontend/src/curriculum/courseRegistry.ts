import { courseCatalog, type CourseCatalog } from "./courseCatalog";
import { descriptorMatchesCourse } from "./courseRegistryCore";

export type English6Semester1Branch = "profile" | "unit1" | "unit2" | "unit3" | "review1" | "unit4" | "unit5" | "unit6" | "review2";
export type English6Semester2Branch = "profile" | "unit7" | "unit8" | "unit9" | "review3" | "unit10" | "unit11" | "unit12" | "review4";
export const MATH6_SEMESTER1_BRANCH_IDS = [
  "math6-s1-lesson1", "math6-s1-lesson2", "math6-s1-lesson3", "math6-s1-lesson4", "math6-s1-lesson5",
  "math6-s1-chapter1-practice", "math6-s1-chapter1-review", "math6-s1-lesson6", "math6-s1-lesson7", "math6-s1-chapter1-practice2",
  "math6-s1-lesson8", "math6-s1-lesson9", "math6-s1-lesson10", "math6-s1-chapter2-practice1", "math6-s1-lesson11", "math6-s1-lesson12", "math6-s1-chapter2-practice2", "math6-s1-chapter2-review",
  "math6-s1-lesson13", "math6-s1-lesson14", "math6-s1-lesson15", "math6-s1-chapter3-practice1", "math6-s1-lesson16", "math6-s1-lesson17", "math6-s1-chapter3-practice2", "math6-s1-chapter3-review",
  "math6-s1-lesson18", "math6-s1-lesson19", "math6-s1-lesson20", "math6-s1-chapter4-practice", "math6-s1-chapter4-review",
  "math6-s1-lesson21", "math6-s1-lesson22", "math6-s1-chapter5-practice", "math6-s1-chapter5-review",
  "math6-s1-activity-card-room", "math6-s1-activity-geogebra", "math6-s1-activity-calculator",
] as const;
export const MATH6_SEMESTER2_BRANCH_IDS = [
  "math6-s2-lesson23", "math6-s2-lesson24", "math6-s2-chapter6-practice1", "math6-s2-lesson25", "math6-s2-lesson26", "math6-s2-lesson27", "math6-s2-chapter6-practice2", "math6-s2-chapter6-review",
  "math6-s2-lesson28", "math6-s2-lesson29", "math6-s2-lesson30", "math6-s2-lesson31", "math6-s2-chapter7-practice", "math6-s2-chapter7-review",
  "math6-s2-lesson32", "math6-s2-lesson33", "math6-s2-lesson34", "math6-s2-lesson35", "math6-s2-chapter8-practice1", "math6-s2-lesson36", "math6-s2-lesson37", "math6-s2-chapter8-practice2", "math6-s2-chapter8-review",
  "math6-s2-lesson38", "math6-s2-lesson39", "math6-s2-lesson40", "math6-s2-lesson41", "math6-s2-chapter9-practice1", "math6-s2-lesson42", "math6-s2-lesson43", "math6-s2-chapter9-practice2", "math6-s2-chapter9-review",
  "math6-s2-activity-budget", "math6-s2-activity-sports-survey", "math6-s2-activity-geogebra", "math6-s2-final-review",
] as const;
export type Math6Semester1Branch = "profile" | (typeof MATH6_SEMESTER1_BRANCH_IDS)[number];
export type Math6Semester2Branch = "profile" | (typeof MATH6_SEMESTER2_BRANCH_IDS)[number];
export const INFORMATICS6_SEMESTER1_BRANCH_IDS = ["informatics6-s1-lesson1","informatics6-s1-lesson2","informatics6-s1-lesson3","informatics6-s1-lesson4","informatics6-s1-lesson5","informatics6-s1-lesson6","informatics6-s1-lesson7","informatics6-s1-lesson8","informatics6-s1-lesson9"] as const;
export const INFORMATICS6_SEMESTER2_BRANCH_IDS = ["informatics6-s2-lesson10","informatics6-s2-lesson11","informatics6-s2-lesson12","informatics6-s2-lesson13","informatics6-s2-lesson14","informatics6-s2-lesson15","informatics6-s2-lesson16","informatics6-s2-lesson17"] as const;
export type Informatics6Semester1Branch = "profile" | (typeof INFORMATICS6_SEMESTER1_BRANCH_IDS)[number];
export type Informatics6Semester2Branch = "profile" | (typeof INFORMATICS6_SEMESTER2_BRANCH_IDS)[number];
export const VIETNAMESE6_SEMESTER1_BRANCH_IDS = ["vietnamese6-s1-lesson1","vietnamese6-s1-lesson2","vietnamese6-s1-lesson3","vietnamese6-s1-lesson4","vietnamese6-s1-lesson5","vietnamese6-s1-review"] as const;
export const VIETNAMESE6_SEMESTER2_BRANCH_IDS = ["vietnamese6-s2-lesson6","vietnamese6-s2-lesson7","vietnamese6-s2-lesson8","vietnamese6-s2-lesson9","vietnamese6-s2-lesson10","vietnamese6-s2-review"] as const;
export type Vietnamese6Semester1Branch = "profile" | (typeof VIETNAMESE6_SEMESTER1_BRANCH_IDS)[number];
export type Vietnamese6Semester2Branch = "profile" | (typeof VIETNAMESE6_SEMESTER2_BRANCH_IDS)[number];
export const SCIENCE6_SEMESTER1_BRANCH_IDS = Array.from({ length: 28 }, (_, index) => `science6-l${String(index + 1).padStart(2, "0")}`);
export const SCIENCE6_SEMESTER2_BRANCH_IDS = Array.from({ length: 27 }, (_, index) => `science6-l${String(index + 29).padStart(2, "0")}`);
export type CourseRendererKey = "english-6-semester-1" | "english-6-semester-2" | "math-6-semester-1" | "math-6-semester-2" | "informatics-6-semester-1" | "informatics-6-semester-2" | "vietnamese-6-semester-1" | "vietnamese-6-semester-2" | "science-6-semester-1" | "science-6-semester-2";
export type CourseExperienceDescriptor = {
  courseId: string;
  rendererKey: CourseRendererKey;
  initialBranch: string;
  branchIds: readonly string[];
};

export const COURSE_EXPERIENCE_REGISTRY: Readonly<Record<string, CourseExperienceDescriptor>> = {
  "english-6-semester-1": {
    courseId: "english-6-semester-1",
    rendererKey: "english-6-semester-1",
    initialBranch: "unit1",
    branchIds: ["unit1", "unit2", "unit3", "review1", "unit4", "unit5", "unit6", "review2"],
  },
  "english-6-semester-2": {
    courseId: "english-6-semester-2",
    rendererKey: "english-6-semester-2",
    initialBranch: "unit7",
    branchIds: ["unit7", "unit8", "unit9", "review3", "unit10", "unit11", "unit12", "review4"],
  },
  "math-6-semester-1": {
    courseId: "math-6-semester-1",
    rendererKey: "math-6-semester-1",
    initialBranch: "math6-s1-lesson1",
    branchIds: MATH6_SEMESTER1_BRANCH_IDS,
  },
  "math-6-semester-2": {
    courseId: "math-6-semester-2",
    rendererKey: "math-6-semester-2",
    initialBranch: "math6-s2-lesson23",
    branchIds: MATH6_SEMESTER2_BRANCH_IDS,
  },
  "informatics-6-semester-1": {
    courseId: "informatics-6-semester-1", rendererKey: "informatics-6-semester-1", initialBranch: "informatics6-s1-lesson1", branchIds: INFORMATICS6_SEMESTER1_BRANCH_IDS,
  },
  "informatics-6-semester-2": {
    courseId: "informatics-6-semester-2", rendererKey: "informatics-6-semester-2", initialBranch: "informatics6-s2-lesson10", branchIds: INFORMATICS6_SEMESTER2_BRANCH_IDS,
  },
  "vietnamese-6-semester-1": {
    courseId: "vietnamese-6-semester-1", rendererKey: "vietnamese-6-semester-1", initialBranch: "vietnamese6-s1-lesson1", branchIds: VIETNAMESE6_SEMESTER1_BRANCH_IDS,
  },
  "vietnamese-6-semester-2": {
    courseId: "vietnamese-6-semester-2", rendererKey: "vietnamese-6-semester-2", initialBranch: "vietnamese6-s2-lesson6", branchIds: VIETNAMESE6_SEMESTER2_BRANCH_IDS,
  },
  "science-6-semester-1": {
    courseId: "science-6-semester-1", rendererKey: "science-6-semester-1", initialBranch: "science6-l01", branchIds: SCIENCE6_SEMESTER1_BRANCH_IDS,
  },
  "science-6-semester-2": {
    courseId: "science-6-semester-2", rendererKey: "science-6-semester-2", initialBranch: "science6-l29", branchIds: SCIENCE6_SEMESTER2_BRANCH_IDS,
  },
};

export function courseExperienceFor(courseId: string, catalog: CourseCatalog = courseCatalog) {
  const course = catalog.courses.find((item) => item.id === courseId);
  const descriptor = COURSE_EXPERIENCE_REGISTRY[courseId];
  if (!descriptorMatchesCourse(course, descriptor)) return undefined;
  return descriptor;
}

export function isCourseOpenable(courseId: string, catalog: CourseCatalog = courseCatalog) {
  return Boolean(courseExperienceFor(courseId, catalog));
}
