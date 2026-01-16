export type VoiceCommand = {
  keyword: string;
  action: () => void;
};
export class VoiceCodexEngine {
  private recognition: any = null;
  private commands: VoiceCommand[] = [];
  private active: boolean = false;
  constructor() {
    if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).WebkitSpeechRecognition || (window as any).speechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.warn(`[VOICE TRANSCRIPT]: ${transcript}`);
        this.processTranscript(transcript);
      };
      this.recognition.onstart = () => {
        this.active = true;
      };
      this.recognition.onend = () => {
        // Automatically restart if it was supposed to be active
        if (this.active) {
          this.safeStart();
        }
      };
      this.recognition.onerror = (event: any) => {
        console.error("[VOICE ERROR]", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.active = false;
        }
      };
    }
  }
  private safeStart() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch (e: any) {
      // Ignore "Already started" errors gracefully
      if (e.name !== 'InvalidStateError') {
        console.error("Voice Engine failed to start", e);
      }
    }
  }
  public registerCommand(keyword: string, action: () => void) {
    const lowerKeyword = keyword.toLowerCase();
    if (!this.commands.find(c => c.keyword === lowerKeyword)) {
      this.commands.push({ keyword: lowerKeyword, action });
    }
  }
  public unregisterCommand(keyword: string) {
    const lowerKeyword = keyword.toLowerCase();
    this.commands = this.commands.filter(c => c.keyword !== lowerKeyword);
  }
  private processTranscript(transcript: string) {
    for (const cmd of this.commands) {
      // Robust matching: Check for keyword inclusion with word boundary safety
      const regex = new RegExp(`\\b${cmd.keyword}\\b`, 'i');
      if (regex.test(transcript) || transcript.includes(cmd.keyword)) {
        cmd.action();
      }
    }
  }
  public start() {
    if (this.recognition && !this.active) {
      this.active = true;
      this.safeStart();
    }
  }
  public stop() {
    this.active = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error("Voice Engine failed to stop", e);
      }
    }
  }
  public isActive(): boolean {
    return this.active;
  }
}
export const globalVoiceEngine = new VoiceCodexEngine();