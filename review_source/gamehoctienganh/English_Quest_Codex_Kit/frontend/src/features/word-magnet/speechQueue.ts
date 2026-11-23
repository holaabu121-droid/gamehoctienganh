export type SpeechRequest = {
  text: string;
  lang?: string;
  rate?: number;
  voiceName?: string;
};

const GROUPED_INTEGER = /\b\d{1,3}(?:[ \u00a0\u202f]\d{3})+\b/g;

export function normalizeSpeechText(text: string, lang = "en-US"): string {
  if (!lang.toLowerCase().startsWith("vi")) return text;
  return text.replace(GROUPED_INTEGER, (number) => number.replace(/[ \u00a0\u202f]/g, ""));
}

export class SpeechQueue {
  private tail: Promise<void> = Promise.resolve();
  private muted = false;
  private finishCurrent: (() => void) | null = null;

  get available(): boolean {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.available) {
      window.speechSynthesis.cancel();
      this.finishCurrent?.();
    }
  }

  enqueue(request: string | SpeechRequest): Promise<void> {
    const normalized = typeof request === "string" ? { text: request } : request;
    const next = this.tail.then(() => this.speak(normalized));
    this.tail = next.catch(() => undefined);
    return next;
  }

  replace(request: string | SpeechRequest): Promise<void> {
    this.cancel();
    return this.enqueue(request);
  }

  pause(): void {
    if (this.available) window.speechSynthesis.pause();
  }

  resume(): void {
    if (this.available) window.speechSynthesis.resume();
  }

  cancel(): void {
    if (this.available) window.speechSynthesis.cancel();
    this.finishCurrent?.();
    this.tail = Promise.resolve();
  }

  dispose(): void {
    this.cancel();
  }

  private speak(request: SpeechRequest): Promise<void> {
    if (this.muted || !this.available) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const lang = request.lang ?? "en-US";
      const spokenText = normalizeSpeechText(request.text, lang);
      let finished = false;
      let watchdog: number | null = null;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (watchdog !== null) window.clearTimeout(watchdog);
        this.finishCurrent = null;
        resolve();
      };
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = lang;
      utterance.rate = request.rate ?? 0.9;
      const voices = window.speechSynthesis.getVoices();
      utterance.voice =
        voices.find((voice) => voice.name === request.voiceName) ??
        voices.find((voice) => voice.localService && voice.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase())) ??
        voices.find((voice) => voice.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase())) ??
        null;
      utterance.onend = finish;
      utterance.onerror = finish;
      this.finishCurrent = finish;
      watchdog = window.setTimeout(finish, Math.max(5000, spokenText.length * 240));
      window.speechSynthesis.speak(utterance);
    });
  }
}
