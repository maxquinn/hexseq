function lerp(start: number, end: number, percent: number): number {
  return start + (end - start) * (percent / 100);
}

export { lerp };
