import { useState } from "react";
import rawVocabulary from "../../../../data/raw/unit3_game_data.json";
import { buildTypingQuestions, buildVocabularyItems, summarizeSession } from "./typingQuestEngine";
import { TypingRound } from "./TypingRound";
import { TypingSetup } from "./TypingSetup";
import { TypingSummary } from "./TypingSummary";
import type { RawVocabularyItem, TypingAttempt, TypingAudioSettings, TypingConfig, TypingQuestion, TypingSummary as Summary } from "./typingQuestTypes";

const vocabulary = buildVocabularyItems(rawVocabulary as RawVocabularyItem[]);
const DEFAULT_CONFIG: TypingConfig = { mode: "mixed", difficulty: "learning", count: 10, seed: 1 };
const DEFAULT_AUDIO: TypingAudioSettings = { speakWord: true, speakMeaning: false, speakSentence: true };

export function TypingQuest() {
  const [screen, setScreen] = useState<"setup" | "round" | "summary">("setup");
  const [config, setConfig] = useState<TypingConfig>(DEFAULT_CONFIG);
  const [audio, setAudio] = useState<TypingAudioSettings>(DEFAULT_AUDIO);
  const [questions, setQuestions] = useState<TypingQuestion[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  function start(seed = Date.now() >>> 0) { const sessionConfig = { ...config, seed }; setConfig(sessionConfig); setQuestions(buildTypingQuestions(vocabulary, sessionConfig)); setSummary(null); setScreen("round"); }
  function finish(attempts: TypingAttempt[]) { setSummary(summarizeSession(attempts)); setScreen("summary"); }
  if (screen === "round") return <TypingRound questions={questions} config={config} audio={audio} onComplete={finish} onExit={() => setScreen("setup")} />;
  if (screen === "summary" && summary) return <TypingSummary summary={summary} questions={questions} onReplay={() => start((config.seed ?? 0) + 1)} onChangeConfig={() => setScreen("setup")} />;
  return <TypingSetup config={config} audio={audio} onConfigChange={setConfig} onAudioChange={setAudio} onStart={() => start()} />;
}
