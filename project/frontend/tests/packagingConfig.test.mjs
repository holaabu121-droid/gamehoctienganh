import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const authApi = readFileSync(new URL("../src/auth/authApi.ts", import.meta.url), "utf8");
const installer = readFileSync(new URL("../../packaging/installer.iss", import.meta.url), "utf8");
const version = readFileSync(new URL("../../VERSION", import.meta.url), "utf8").trim();
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const buildVersion = readFileSync(new URL("../../packaging/build_version.py", import.meta.url), "utf8");
const buildScript = readFileSync(new URL("../../scripts/build_windows_installer.ps1", import.meta.url), "utf8");

test("production frontend uses the packaged same-origin API while legacy preview keeps port 8000", () => {
  assert.ok(authApi.includes('window.location.port === "4173"'));
  assert.ok(authApi.includes("window.location.origin"));
  assert.ok(authApi.includes('"http://127.0.0.1:8000"'));
});

test("Windows installer is per-user and never installs a student database", () => {
  assert.ok(installer.includes("PrivilegesRequired=lowest"));
  assert.ok(installer.includes("{localappdata}\\Programs\\EnglishQuest"));
  assert.ok(!installer.includes("english_quest.db"));
  assert.ok(installer.includes("AppId={{73AE27B3-E65D-4897-8437-7BC68BA65D2C}"));
});

test("canonical version drives frontend, backend bundle and installer", () => {
  assert.match(version, /^\d+\.\d+\.\d+(?:[.-][A-Za-z0-9]+)*$/);
  assert.equal(packageJson.version, version);
  assert.ok(installer.includes(`#define AppVersion "${version}"`));
  assert.ok(buildVersion.includes(`APP_VERSION = "${version}"`));
  assert.ok(buildScript.includes('$versionSource = Join-Path $projectRoot "VERSION"'));
  assert.ok(buildScript.includes("does not match canonical VERSION"));
});
