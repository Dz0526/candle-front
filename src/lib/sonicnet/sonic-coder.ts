interface SonicCoderParams {
  freqMin?: number;
  freqMax?: number;
  freqError?: number;
  alphabet?: string;
  startChar?: string;
  endChar?: string;
}

export class SonicCoder {
  public freqMin: number;
  public freqMax: number;
  public freqError: number;
  public alphabetString: string;
  public startChar: string;
  public endChar: string;
  public alphabet: string;

  constructor(params: SonicCoderParams = {}) {
    this.freqMin = params.freqMin || 18000;
    this.freqMax = params.freqMax || 19500;
    this.freqError = params.freqError || 50;
    this.alphabetString =
      params.alphabet || "\n abcdefghijklmnopqrstuvwxyz0123456789,.!?@*";
    this.startChar = params.startChar || "^";
    this.endChar = params.endChar || "$";
    this.alphabet = this.startChar + this.alphabetString + this.endChar;
  }

  charToFreq(char: string): number {
    let index = this.alphabet.indexOf(char);
    if (index === -1) {
      console.error(char, "is an invalid character.");
      index = this.alphabet.length - 1;
    }
    let freqRange = this.freqMax - this.freqMin;
    let percent = index / this.alphabet.length;
    let freqOffset = Math.round(freqRange * percent);
    return this.freqMin + freqOffset;
  }

  freqToChar(freq: number): string | null {
    if (!(this.freqMin < freq && freq < this.freqMax)) {
      if (this.freqMin - freq < this.freqError) {
        freq = this.freqMin;
      } else if (freq - this.freqMax < this.freqError) {
        freq = this.freqMax;
      } else {
        console.error(freq, "is out of range.");
        return null;
      }
    }
    let freqRange = this.freqMax - this.freqMin;
    let percent = (freq - this.freqMin) / freqRange;
    let index = Math.round(this.alphabet.length * percent);
    return this.alphabet[index];
  }
}
