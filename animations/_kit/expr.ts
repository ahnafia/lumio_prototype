import { useEffect, useState } from 'react';
import type * as MathJs from 'mathjs';

/**
 * Math expressions for animations. mathjs is imported lazily so it stays out of the
 * first page load (the loader imports every animation eagerly).
 */
export type Fn = (x: number, scope?: Readonly<Record<string, number>>) => number;

type MathModule = typeof MathJs;
let mathPromise: Promise<MathModule> | null = null;
const loadMath = () => (mathPromise ??= import('mathjs'));

const SEP = '\u0000';
const nan: Fn = () => NaN;

/** Compile mathjs expressions in x (plus optional scope variables). Null until mathjs loads. */
export function useFns(exprs: readonly string[]): Fn[] | null {
  const key = exprs.join(SEP);
  const [state, setState] = useState<{ key: string; fns: Fn[] } | null>(null);
  useEffect(() => {
    let alive = true;
    loadMath()
      .then((m) => {
        if (!alive) return;
        const fns = key.split(SEP).map((e): Fn => {
          if (!e.trim()) return nan;
          try {
            const code = m.compile(e);
            return (x, scope) => {
              try {
                const y: unknown = code.evaluate({ ...scope, x });
                return typeof y === 'number' ? y : NaN;
              } catch {
                return NaN;
              }
            };
          } catch {
            return nan;
          }
        });
        setState({ key, fns });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [key]);
  return state && state.key === key ? state.fns : null;
}

/** Central-difference derivative. */
export function deriv(f: (x: number) => number, x: number, h = 1e-4): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** Second derivative by central differences. */
export function deriv2(f: (x: number) => number, x: number, h = 1e-3): number {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

/** Simpson's rule on [a, b] (b may be less than a). */
export function integrate(f: (x: number) => number, a: number, b: number, n = 400): number {
  if (a === b) return 0;
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i++) s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return (s * h) / 3;
}

/** Format a number for readouts: fixed decimals, no "-0.00". */
export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return n > 0 ? '∞' : n < 0 ? '−∞' : '—';
  const s = n.toFixed(digits);
  return /^-0\.?0*$/.test(s) ? s.slice(1) : s.replace('-', '−');
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
