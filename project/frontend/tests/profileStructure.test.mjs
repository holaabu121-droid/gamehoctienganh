import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const registry = readFileSync(new URL("../src/curriculum/courseRegistry.ts", import.meta.url), "utf8");
const profile = readFileSync(new URL("../src/features/profile/ScoreProfile.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../src/auth/authApi.ts", import.meta.url), "utf8");

test("adds a top-level parent score profile", () => {
  assert.ok(registry.includes('"profile" | "unit1" | "unit2" | "unit3" | "review1" | "unit4" | "unit5" | "unit6" | "review2"'));
  assert.ok(app.includes("<ScoreProfile courseId={courseId} />"));
  assert.ok(app.includes("<Unit4 />"));
  assert.ok(app.includes("<Unit1 />"));
  assert.ok(app.includes("<Unit2 />"));
  assert.ok(app.includes("<Unit5 />"));
  assert.ok(app.includes("<Unit6 />"));
  assert.ok(app.includes("<Review2 />"));
  assert.ok(api.includes('`/courses/${encodeURIComponent(courseId)}/profile`'));
  assert.ok(api.includes('"/profile/scores"'));
});

test("profile separates course best, branch best and improvement-only history", () => {
  assert.ok(profile.includes("Khóa đang xem"));
  assert.ok(profile.includes("Điểm tốt nhất khóa đang xem"));
  assert.ok(profile.includes("Tổng điểm Tiếng Anh"));
  assert.ok(profile.includes("overview.subjects.map"));
  assert.ok(profile.includes("overview.courses.map"));
  assert.ok(profile.includes("overview.courses.find(course => course.course_id === profile.course_id)"));
  assert.ok(profile.includes("currentCourse?.title ?? profile.course_id"));
  assert.ok(!profile.includes("courseById"));
  assert.ok(api.includes('request<ScoreOverview>("/profile/overview"'));
  assert.ok(profile.includes("Thành tích tốt nhất từng bài và phần ôn tập"));
  assert.ok(profile.includes("Các mốc thành tích tốt nhất"));
  assert.ok(profile.includes("item.improvement"));
});

test("profile can export and restore a Drive-friendly student backup", () => {
  assert.ok(profile.includes("Tải tệp sao lưu"));
  assert.ok(profile.includes("Chọn tệp để khôi phục"));
  assert.ok(profile.includes("Google Drive"));
  assert.ok(profile.includes("JSON.parse(await file.text())"));
  assert.ok(api.includes('`${API_BASE_URL}/profile/backup`'));
  assert.ok(api.includes('request<BackupRestoreResult>("/profile/backup/restore"'));
});
