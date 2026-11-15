import { compile } from 'mathjs';

/** Pure plotting math for graph-tap, kept apart from React so it's testable. */

export type Range = readonly [number, number];
export interface Pt {
  x: number;
  y: number;
}

/** Compile a mathjs expression in x once. Returns null if it doesn't compile. */
export function compileFn(expr: string): ((x: number) => number) | null {
  try {
    const code = compile(expr);
    return (x: number) => {
      try {
        const v: unknown = code.evaluate({ x });
        return typeof v === 'number' ? v : NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return null;
  }
}

/**
 * Sample f over [lo, hi] and split into drawable segments. A segment breaks where
 * f isn't finite or jumps by more than the y-span between neighbours, so vertical
 * asymptotes don't draw as vertical lines.
 */
export function sampleSegments(f: (x: number) => number, xRange: Range, yRange: Range, domain?: Range, samples = 200): Pt[][] {
  const lo = Math.max(xRange[0], domain?.[0] ?? -Infinity);
  const hi = Math.min(xRange[1], domain?.[1] ?? Infinity);
  if (!(hi > lo)) return [];
  const ySpan = yRange[1] - yRange[0];
  // Clamp far off-screen values so the SVG doesn't get huge coordinates; the clip path hides the rest.
  const yLo = yRange[0] - ySpan;
  const yHi = yRange[1] + ySpan;
  const segments: Pt[][] = [];
  let current: Pt[] = [];
  let prev: number | null = null;
  for (let i = 0; i <= samples; i++) {
    const x = lo + ((hi - lo) * i) / samples;
    const y = f(x);
    const jump = prev !== null && Number.isFinite(y) && Math.abs(y - prev) > ySpan;
    if (!Number.isFinite(y) || jump) {
      if (current.length > 1) segments.push(current);
      current = [];
    }
    if (Number.isFinite(y)) current.push({ x, y: Math.max(yLo, Math.min(yHi, y)) });
    prev = Number.isFinite(y) ? y : null;
  }
  if (current.length > 1) segments.push(current);
  return segments;
}

/** A "nice" grid step (1, 2 or 5 × 10^k) giving roughly `target` lines across the span. */
export function niceStep(span: number, target = 10): number {
  const raw = span / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const m = raw / pow;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * pow;
}

/** Grid line positions inside a range (excluding the ends). */
export function gridLines([lo, hi]: Range, step: number): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v < hi - 1e-9; v += step) {
    if (v > lo + 1e-9) out.push(Math.round(v / step) * step);
  }
  return out;
}

export function isTapCorrect(tap: Pt, target: { x: number; y?: number }, tolerance: number): boolean {
  if (Math.abs(tap.x - target.x) > tolerance + 1e-9) return false;
  return target.y === undefined || Math.abs(tap.y - target.y) <= tolerance + 1e-9;
}
