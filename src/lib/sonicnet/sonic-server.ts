import { RingBuffer } from './ring-buffer';
import { SonicCoder } from './sonic-coder';

interface SonicServerParams {
  coder?: SonicCoder;
  peakThreshold?: number;
  minRunLength?: number;
  timeout?: number;
}

enum State {
  IDLE,
  RECV,
}

export class SonicServer {
  peakThreshold: number;
  minRunLength: number;
  coder: SonicCoder;
  timeout: number;
  peakHistory: RingBuffer<string | null>;
  peakTimes: RingBuffer<Date>;
  callbacks: { [key: string]: (arg: any) => void };
  buffer: string;
  state: State;
  isRunning: boolean;
  track?: MediaStreamTrack;
  audioContext: AudioContext | null;
  freqs: Float32Array;
  analyser?: AnalyserNode;
  lastChar?: string;
  hasMicPermission: boolean;

  constructor(params: SonicServerParams = {}) {
    this.peakThreshold = params.peakThreshold || -65;
    this.minRunLength = params.minRunLength || 2;
    this.coder = params.coder || new SonicCoder({});
    this.timeout = params.timeout || 300;

    this.peakHistory = new RingBuffer(16);
    this.peakTimes = new RingBuffer(16);

    this.callbacks = {};

    this.buffer = '';
    this.state = State.IDLE;
    this.isRunning = false;
    this.audioContext = null;
    this.freqs = new Float32Array();
    this.hasMicPermission = false;
  }

  onMessage(callback: (message: string) => void) {
    this.callbacks['message'] = callback;
  }
  onChar(callback: (message: string) => void) {
    this.callbacks['char'] = callback;
  }

  async micSetup() {
    const constraints = {
      audio: { echoCancellation: false },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.track = stream.getTracks()[0];
      this.audioContext = new AudioContext();
      const input = this.audioContext.createMediaStreamSource(stream);
      const analyser = this.audioContext.createAnalyser();
      input.connect(analyser);
      this.freqs = new Float32Array(analyser.frequencyBinCount);
      this.analyser = analyser;
      this.hasMicPermission = true;
      this.isRunning = true;
    } catch (err) {
      console.error(err);
    }
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    if (!this.analyser || !this.isRunning) {
      return;
    }

    this.analyser.getFloatFrequencyData(this.freqs);
    const freq = this.getPeakFrequency();
    if (freq) {
      const char = this.coder.freqToChar(freq);
      this.peakHistory.add(char);
      this.peakTimes.add(new Date());
    } else {
      const lastPeakTime = this.peakTimes.last();
      if (
        lastPeakTime &&
        new Date().getMilliseconds() - lastPeakTime.getMilliseconds() >
          this.timeout
      ) {
        this.state = State.IDLE;
        this.peakTimes.clear();
      }
    }
    this.analysePeaks();
  }

  analysePeaks() {
    const char = this.getLastRun();
    if (!char) {
      return;
    }
    if (this.state == State.IDLE) {
      if (char == this.coder.startChar) {
        this.buffer = '';
        this.state = State.RECV;
      }
    } else if (this.state == State.RECV) {
      if (
        char != this.lastChar &&
        char != this.coder.startChar &&
        char != this.coder.endChar
      ) {
        this.buffer += char;
        this.lastChar = char;
        if (this.callbacks['char']) {
          this.callbacks['char'](char);
        }
      }
      if (char == this.coder.endChar) {
        this.state = State.IDLE;
        if (this.callbacks['message']) {
          this.callbacks['message'](this.buffer);
        }
        this.buffer = '';
        this.peakHistory.clear();
        this.peakTimes.clear();
        this.lastChar = undefined;
      }
    }
  }

  getLastRun() {
    const lastChar = this.peakHistory.last();
    let runLength = 0;
    let i: number;
    for (i = this.peakHistory.length() - 2; i >= 0; i--) {
      const char = this.peakHistory.get(i);
      if (char == lastChar) {
        runLength += 1;
      } else {
        break;
      }
    }
    if (runLength > this.minRunLength) {
      // Remove it from the buffer.
      this.peakHistory.remove(i + 1, runLength + 1);
      return lastChar;
    }
    return null;
  }

  getPeakFrequency() {
    const start = this.freqToIndex(this.coder.freqMin);
    let max = -Infinity;
    let index = -1;
    for (let i = start; i < this.freqs.length; i++) {
      if (this.freqs[i] > max) {
        max = this.freqs[i];
        index = i;
      }
    }
    // Only care about sufficiently tall peaks.
    if (max > this.peakThreshold) {
      return this.indexToFreq(index);
    }
    return null;
  }

  indexToFreq(index: number) {
    const nyquist = this.audioContext!.sampleRate / 2;
    return (nyquist / this.freqs.length) * index;
  }

  freqToIndex(frequency: number) {
    const nyquist = this.audioContext!.sampleRate / 2;
    return Math.round((frequency / nyquist) * this.freqs.length);
  }
}
