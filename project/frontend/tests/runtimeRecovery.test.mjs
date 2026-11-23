import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const boundary = read("../src/components/AppRecoveryBoundary.tsx");
const main = read("../src/main.tsx");

test("stale dynamic imports trigger one guarded reload", () => {
  assert.match(boundary, /failed to fetch dynamically imported module/);
  assert.match(boundary, /CHUNK_RELOAD_WINDOW_MS = 60_000/);
  assert.match(boundary, /now - lastReload < CHUNK_RELOAD_WINDOW_MS/);
  assert.match(boundary, /window\.location\.reload\(\)/);
});

test("Vite preload failures and React rendering failures share recovery", () => {
  assert.match(main, /vite:preloadError/);
  assert.match(main, /recoverFromStaleChunk\(\)/);
  assert.match(main, /<AppRecoveryBoundary>[\s\S]*<App \/>[\s\S]*<\/AppRecoveryBoundary>/);
});

test("unrecoverable failures show a retry screen instead of a blank page", () => {
  assert.match(boundary, /Chưa thể mở nội dung này/);
  assert.match(boundary, /Điểm số và tiến độ đã lưu không bị thay đổi/);
  assert.match(boundary, /Tải lại ứng dụng/);
});
