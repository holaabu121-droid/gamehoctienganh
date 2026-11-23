export type RegistryCourse = { id: string; status: "available" | "planned"; branch_ids: string[] };
export type RegistryDescriptor = { courseId: string; initialBranch: string; branchIds: readonly string[] };

export function descriptorMatchesCourse(course: RegistryCourse | undefined, descriptor: RegistryDescriptor | undefined) {
  if (!course || course.status !== "available" || !descriptor) return false;
  if (descriptor.courseId !== course.id || descriptor.branchIds.join("|") !== course.branch_ids.join("|")) return false;
  return course.branch_ids.length > 0 && descriptor.initialBranch === course.branch_ids[0];
}
