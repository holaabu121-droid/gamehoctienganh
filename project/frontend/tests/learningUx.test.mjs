import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bilingualFoundationItems, firstUnfinishedQuestion, foundationSpeechText, normalizeFoundationItem, pronunciationSpeechText, stableShuffle } from "../src/features/skills-common/learningUx.ts";

const lesson = (name) => JSON.parse(readFileSync(new URL(`../../data/lessons/${name}`, import.meta.url), "utf8"));

test("stableShuffle is deterministic and preserves every option", () => {
  const options = ["correct", "b", "c", "d"];
  const first = stableShuffle(options, "question-8");
  assert.deepEqual(first, stableShuffle(options, "question-8"));
  assert.deepEqual([...first].sort(), [...options].sort());
  assert.notDeepEqual(first, options);
});

test("a partial game resumes at the first unsaved question and treats skipped questions as saved", () => {
  assert.equal(firstUnfinishedQuestion(10, [
    { question_index: 0 }, { question_index: 1 }, { question_index: 3 },
  ]), 2);
  assert.equal(firstUnfinishedQuestion(3, [
    { question_index: 0 }, { question_index: 1 }, { question_index: 2 },
  ]), 0);
});

test("choice games show audio and save busy states and checkpoint each question", () => {
  const source = readFileSync(new URL("../src/features/skills-common/SkillsSection.tsx", import.meta.url), "utf8");
  assert.match(source, /aria-busy=\{busy\|\|scored\.saving\}/);
  assert.match(source, /Đang đọc đáp án em chọn/);
  assert.match(source, /Đang lưu tiến độ câu này/);
  assert.match(source, /saveQuestionProgress\(unitId, activityId, index/);
  assert.match(source, /completeActivity\(unitId, activityId\)/);
  assert.match(source, /prior\.status===\"skipped\"/);
});

test("foundation parser exposes an existing Vietnamese translation", () => {
  assert.deepEqual(normalizeFoundationItem("scenery: phong cảnh"), { text: "scenery", translation: "phong cảnh" });
  assert.deepEqual(normalizeFoundationItem("Phong: Hi, Vy."), { text: "Phong: Hi, Vy.", translation: "Chào Vy." });
});

test("saving a question does not remount the active choice game before the learner can finish it", () => {
  const source = readFileSync(new URL("../src/features/skills-common/SkillsSection.tsx", import.meta.url), "utf8");
  assert.match(source, /<ChoiceGame key=\{meta\.activityId\}/);
  assert.doesNotMatch(source, /<ChoiceGame key=\{`\$\{meta\.activityId\}-\$\{initialIndex\}`\}/);
});

test("every semester 1 A Closer Look 1 vocabulary item has a concrete Vietnamese translation", () => {
  const unit1 = lesson("unit1_phase1.json").closer_look_1;
  const unit2 = lesson("unit2_phase1.json").closer_look_1;
  const unit3 = lesson("unit3_a_closer_look1.json").intro;
  const unit4 = lesson("unit4_phase1.json").closer_look_1;
  const unit5 = lesson("unit5_phase1.json").closer_look_1;
  const unit6 = lesson("unit6_phase1.json").closer_look_1;
  const sharedFoundationWords = [
    ...unit1.collocations,
    ...unit2.rooms, ...unit2.furniture,
    ...unit4.places, ...unit4.adjectives,
    ...unit5.travel_items,
    ...unit6.vocabulary, ...unit6.collocations,
  ];
  for (const word of sharedFoundationWords) {
    const normalized = normalizeFoundationItem(word);
    assert.ok(normalized.translation, `${word} must show “Bản dịch”, not “Ghi chú”`);
    assert.doesNotMatch(normalized.translation, /địa điểm trong khu phố|vật dụng cần cho chuyến đi/i, word);
  }
  for (const item of unit3.vocabulary) assert.ok(item.vi.trim(), `${item.word} needs a Vietnamese meaning`);
  assert.equal(normalizeFoundationItem("play football").translation, "chơi bóng đá");
  assert.equal(normalizeFoundationItem("plaster").translation, "băng cá nhân");
});

test("pronunciation foundations explain articulation but speech reads only the sound and examples without slashes", () => {
  const speech = pronunciationSpeechText("/s/", ["lamps", "sinks", "flats", "toilets"], "sss");
  assert.equal(speech, "sss. lamps. sinks. flats. toilets");
  assert.doesNotMatch(speech, /\//);
  const item = {
    text: "/s/: lamps, sinks, flats, toilets",
    pronunciationVi: "Đẩy hơi qua khe hẹp; cổ họng không rung.",
    speechText: speech,
  };
  assert.equal(normalizeFoundationItem(item).pronunciationVi, item.pronunciationVi);
  assert.equal(foundationSpeechText(item), speech);
  assert.doesNotMatch(foundationSpeechText(item), /\//);

  const files = [
    "../src/features/unit1/Unit1Sections.tsx",
    "../src/features/unit2/Unit2Sections.tsx",
    "../src/features/unit4/Unit4Sections.tsx",
    "../src/features/unit5/Unit5Sections.tsx",
    "../src/features/unit6/Unit6Sections.tsx",
  ];
  for (const path of files) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(source, /pronunciationVi:/, path);
    assert.match(source, /speechText:/, path);
  }
  const unit3 = readFileSync(new URL("../src/features/a-closer-look-1/ACloserLook1.tsx", import.meta.url), "utf8");
  assert.match(unit3, /pronunciationSpeechText/);
  assert.match(unit3, /Nghe âm và từ ví dụ/);
  const sharedUi = readFileSync(new URL("../src/features/skills-common/SkillsSection.tsx", import.meta.url), "utf8");
  assert.match(sharedUi, /Cách phát âm/);
  assert.match(sharedUi, /Nghe âm và xem cách đọc/);
});

test("Vietnamese foundation guidance is translated before English speech", () => {
  const source = "Nhận biết âm khác bằng phần âm được gạch chân và nhóm từ theo /b/ hoặc /p/.";
  const normalized = normalizeFoundationItem(source);
  assert.equal(normalized.text, source);
  assert.equal(normalized.englishGuide, "Identify the different sound from the underlined part, and group words by the sounds /b/ and /p/.");
  assert.equal(foundationSpeechText(source), "Identify the different sound from the underlined part, and group words by the sounds b and p.");
  assert.doesNotMatch(foundationSpeechText(source), /\//);
  assert.doesNotMatch(foundationSpeechText(source), /[ăâđêôơưàáạảã]/i);
});

test("bilingual foundations always expose a concrete translation and never read slash characters", () => {
  const items = bilingualFoundationItems(
    ["likes/dislikes", "He/She has long hair."],
    ["điều thích/không thích", "Bạn ấy có mái tóc dài."],
  );
  assert.deepEqual(normalizeFoundationItem(items[0]), {
    text: "likes/dislikes",
    translation: "điều thích/không thích",
  });
  assert.equal(foundationSpeechText(items[0]), "likes dislikes");
  assert.equal(foundationSpeechText(items[1]), "He She has long hair.");
  for (const item of items) {
    assert.ok(normalizeFoundationItem(item).translation);
    assert.doesNotMatch(foundationSpeechText(item), /\//);
  }
  assert.throws(
    () => bilingualFoundationItems(["one", "two"], ["một"]),
    /translations must match every source item/,
  );
});

test("semester 1 later sections use the bilingual foundation helper", () => {
  const files = [1, 2, 4, 5, 6].map((unit) => `../src/features/unit${unit}/Unit${unit}Phase2Sections.tsx`);
  for (const path of files) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(source, /bilingualFoundationItems as vi/, path);
    assert.match(source, /items:vi\(/, path);
  }
});

test("unknown Vietnamese guidance never reaches the English voice", () => {
  const speech = foundationSpeechText("Ôn một nội dung mới chưa có trong từ điển.");
  assert.match(speech, /^Review this learning point/);
  assert.doesNotMatch(speech, /[ăâđêôơưàáạảã]/i);
});

test("all Vietnamese foundation lists in Unit 3 and both reviews have specific English guides", () => {
  const review1 = lesson("review1.json").intro;
  const review2 = lesson("review2.json").intro;
  const skills1 = lesson("unit3_skills1.json").intro;
  const skills2 = lesson("unit3_skills2.json").intro;
  const detective = lesson("unit3_part5_designed.json").intro;
  const lookingBack = lesson("unit3_looking_back.json").intro;
  const project = lesson("unit3_project.json").intro;
  const items = [
    ...review1.language_foundations, ...review1.skills_foundations,
    ...review2.language_foundations, ...review2.skills_foundations,
    ...skills1.scan_targets, ...skills1.evidence_steps,
    ...skills2.listening_steps, ...skills2.writing_plan,
    ...detective.clue_steps, ...detective.language_steps,
    ...lookingBack.vocabulary_steps, ...lookingBack.grammar_steps,
    ...project.project_steps_vi, ...project.language_steps,
  ];
  for (const item of items) {
    const speech = foundationSpeechText(item);
    assert.notEqual(speech, "Review this learning point, then practise it in the activity.", item);
    assert.doesNotMatch(speech, /[ăâđêôơưàáạảãằắặẳẵ]/i, item);
  }
});
