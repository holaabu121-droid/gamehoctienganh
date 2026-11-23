import catalogJson from "../../../data/curriculum/catalog.json";

export type CourseStatus = "available" | "planned";
export type Course = {
  id: string;
  subject: string;
  subject_label: string;
  grade: number;
  semester: 1 | 2;
  title: string;
  description: string;
  status: CourseStatus;
  content_version: string | null;
  branch_ids: string[];
};

export type CourseCatalog = {
  schema_version: 1;
  default_course_id: string;
  courses: Course[];
};

const COURSE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const BRANCH_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export function validateCourseCatalog(value: unknown): CourseCatalog {
  if (!value || typeof value !== "object") throw new Error("Course catalog must be an object.");
  const candidate = value as Partial<CourseCatalog>;
  if (candidate.schema_version !== 1 || !Array.isArray(candidate.courses) || candidate.courses.length === 0) {
    throw new Error("Unsupported or empty course catalog.");
  }
  const courseIds = new Set<string>();
  const branchIds = new Set<string>();
  for (const course of candidate.courses) {
    if (!COURSE_ID.test(course.id) || courseIds.has(course.id)) throw new Error(`Invalid or duplicate course id: ${course.id}`);
    if (!course.subject || !course.subject_label || !course.title || !course.description) throw new Error(`Incomplete course: ${course.id}`);
    if (course.grade < 1 || ![1, 2].includes(course.semester)) throw new Error(`Invalid grade or semester: ${course.id}`);
    if (!(["available", "planned"] as string[]).includes(course.status)) throw new Error(`Invalid course status: ${course.id}`);
    if (!Array.isArray(course.branch_ids) || (course.status === "available" && course.branch_ids.length === 0)) throw new Error(`Invalid branches: ${course.id}`);
    for (const branchId of course.branch_ids) {
      if (!BRANCH_ID.test(branchId) || branchIds.has(branchId)) throw new Error(`Invalid or duplicate branch id: ${branchId}`);
      branchIds.add(branchId);
    }
    courseIds.add(course.id);
  }
  if (!candidate.default_course_id || !courseIds.has(candidate.default_course_id)) throw new Error("Unknown default course.");
  const defaultCourse = candidate.courses.find((course) => course.id === candidate.default_course_id);
  if (defaultCourse?.status !== "available") throw new Error("Default course must be available.");
  return candidate as CourseCatalog;
}

export const courseCatalog = validateCourseCatalog(catalogJson);
export const DEFAULT_COURSE_ID = courseCatalog.default_course_id;

export function courseById(courseId: string) {
  return courseCatalog.courses.find((course) => course.id === courseId);
}
