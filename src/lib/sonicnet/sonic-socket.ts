import { SonicCoder } from './sonic-coder';

interface SonicSocketParams {
  coder?: SonicCoder;
  charDuration?: number;
  rampDuration?: number;
}

export class SonicSocket {
  private coder: SonicCoder;
  private charDuration: number;
  private rampDuration: number;
  private audioContext: AudioContext | null;
  hasAudioAccess: boolean;

  constructor(params: SonicSocketParams = {}) {
    this.coder = params.coder || new SonicCoder({});
    this.charDuration = params.charDuration || 0.2;
    this.rampDuration = params.rampDuration || 0.001;
    this.audioContext = null;
    this.hasAudioAccess = false;
  }

  setup() {
    this.audioContext = new AudioContext();
    this.hasAudioAccess = true;
  }

  send(input: string) {
    input = this.coder.startChar + input + this.coder.endChar;
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const freq = this.coder.charToFreq(char);
      const time = this.audioContext!.currentTime + this.charDuration * i;
      this.scheduleToneAt(freq, time, this.charDuration);
    }
  }

  private scheduleToneAt(freq: number, startTime: number, duration: number) {
    const gainNode = this.audioContext!.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + this.rampDuration);
    gainNode.gain.setValueAtTime(1, startTime + duration - this.rampDuration);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    gainNode.connect(this.audioContext!.destination);

    const osc = this.audioContext!.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gainNode);

    osc.start(startTime);
  }
}
