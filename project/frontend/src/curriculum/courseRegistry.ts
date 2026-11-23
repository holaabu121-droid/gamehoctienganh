import { courseCatalog, type CourseCatalog } from "./courseCatalog";
import { descriptorMatchesCourse } from "./courseRegistryCore";

export type English6Semester1Branch = "profile" | "unit1" | "unit2" | "unit3" | "review1" | "unit4" | "unit5" | "unit6" | "review2";
export type English6Semester2Branch = "profile" | "unit7" | "unit8" | "unit9" | "review3" | "unit10" | "unit11" | "unit12" | "review4";
export type CourseRendererKey = "english-6-semester-1" | "english-6-semester-2" | "math-6-semester-1";
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
    initialBranch: "math6-bai1-v054",
    branchIds: ["math6-bai1-v054", "math6-bai2-v01"],
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
