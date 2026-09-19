export interface OutcomeRange {
  start: number;
  end: number;
}

export function toOutcomeRanges(indices: number[]): OutcomeRange[] {
  const sorted = [...new Set(indices)].sort((a, b) => a - b);
  const ranges: OutcomeRange[] = [];
  for (const n of sorted) {
    const last = ranges.at(-1);
    if (last && n === last.end + 1) {
      last.end = n;
    } else {
      ranges.push({ start: n, end: n });
    }
  }
  return ranges;
}
