import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSpeechText, SpeechQueue } from "../src/features/word-magnet/speechQueue.ts";

test("Vietnamese speech collapses grouped integers so the voice reads their place value", () => {
  assert.equal(normalizeSpeechText("7 000", "vi-VN"), "7000");
  assert.equal(normalizeSpeechText("70 000; 700 000; 7 000 000", "vi-VN"), "70000; 700000; 7000000");
  assert.equal(normalizeSpeechText("Số 7 110 385 có chữ số 7 ở hàng triệu.", "vi-VN"), "Số 7110385 có chữ số 7 ở hàng triệu.");
});

test("number normalization preserves display text conventions for non-Vietnamese speech", () => {
  assert.equal(normalizeSpeechText("Choose 7 000 000.", "en-US"), "Choose 7 000 000.");
  assert.equal(normalizeSpeechText("Bài 2 có 10 câu.", "vi-VN"), "Bài 2 có 10 câu.");
});

test("replace cancels current speech and starts the newly selected text", async () => {
  const spoken = [];
  let cancellations = 0;
  class Utterance {
    constructor(text) { this.text = text; this.lang = ""; this.rate = 1; this.voice = null; this.onend = null; this.onerror = null; }
  }
  globalThis.SpeechSynthesisUtterance = Utterance;
  globalThis.window = {
    SpeechSynthesisUtterance: Utterance,
    clearTimeout,
    setTimeout,
    speechSynthesis: {
      cancel() { cancellations += 1; },
      getVoices() { return []; },
      pause() {},
      resume() {},
      speak(utterance) { spoken.push(utterance); },
    },
  };

  const queue = new SpeechQueue();
  const first = queue.enqueue({ text: "First guide" });
  await Promise.resolve();
  assert.equal(spoken.at(-1).text, "First guide");
  const second = queue.replace({ text: "Second guide" });
  await first;
  await Promise.resolve();
  assert.equal(cancellations, 1);
  assert.equal(spoken.at(-1).text, "Second guide");
  spoken.at(-1).onend();
  await second;

  const groupedNumber = queue.replace({ text: "7 000 000", lang: "vi-VN" });
  await Promise.resolve();
  assert.equal(spoken.at(-1).text, "7000000");
  assert.equal(spoken.at(-1).lang, "vi-VN");
  spoken.at(-1).onend();
  await groupedNumber;
  queue.dispose();

  delete globalThis.window;
  delete globalThis.SpeechSynthesisUtterance;
});
