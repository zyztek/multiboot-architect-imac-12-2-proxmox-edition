export type VoiceCommand = {
  keyword: string;
  action: () => void;
};
export class VoiceCodexEngine {
  private recognition: any = null;
  private commands: VoiceCommand[] = [];
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
    }
  }
  public registerCommand(keyword: string, action: () => void) {
    this.commands.push({ keyword: keyword.toLowerCase(), action });
  }
  private processTranscript(transcript: string) {
    for (const cmd of this.commands) {
      if (transcript.includes(cmd.keyword)) {
        cmd.action();
      }
    }
  }
  public start() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error("Voice Engine failed to start", e);
      }
    }
  }
  public stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
export const globalVoiceEngine = new VoiceCodexEngine();