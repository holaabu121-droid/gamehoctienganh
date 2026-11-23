import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateUnit3Structure } from "../src/unit3Structure.ts";

const raw = JSON.parse(readFileSync(new URL("../../data/lessons/unit3_structure.json", import.meta.url), "utf8"));

test("defines Unit 3 My Friends with nine designed major sections", () => {
  const snapshot = JSON.stringify(raw);
  const unit = validateUnit3Structure(raw);
  assert.equal(unit.unit_number, 3);
  assert.equal(unit.unit_title, "My Friends");
  assert.equal(unit.source_status, "designed");
  assert.deepEqual(unit.sections.map(({ id }) => id), ["getting-started", "closer-look-1", "closer-look-2", "communication", "skills-1", "skills-2", "looking-back", "project", "bonus"]);
  assert.equal(JSON.stringify(raw), snapshot);
});

test("gives each major section concise Vietnamese guidance and objectives without image fields", () => {
  const unit = validateUnit3Structure(raw);
  for (const section of unit.sections) {
    assert.ok(section.lead_vi.length > 40);
    assert.ok(section.objectives_vi.length >= 3 && section.objectives_vi.length <= 4);
    assert.equal(Object.hasOwn(section, "image"), false);
    assert.equal(Object.hasOwn(section, "audio"), false);
  }
});
