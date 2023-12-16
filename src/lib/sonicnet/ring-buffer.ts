export class RingBuffer<T> {
  private array: T[];
  private maxLength: number;

  constructor(maxLength: number) {
    this.array = [];
    this.maxLength = maxLength;
  }

  get(index: number): T | null {
    if (index >= this.array.length) {
      return null;
    }
    return this.array[index];
  }

  last(): T | null {
    if (this.array.length === 0) {
      return null;
    }
    return this.array[this.array.length - 1];
  }

  add(value: T): void {
    this.array.push(value);
    if (this.array.length > this.maxLength) {
      this.array.shift();
    }
  }

  length(): number {
    return this.array.length;
  }

  clear(): void {
    this.array = [];
  }

  copy(): RingBuffer<T> {
    const out = new RingBuffer<T>(this.maxLength);
    out.array = this.array.slice();
    return out;
  }

  remove(index: number, length: number): void {
    this.array.splice(index, length);
  }
}

export default RingBuffer;
