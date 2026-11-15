import { useId, type ReactNode } from 'react';
import type { AnimationTheme } from '@contract/theme';
import { fmt } from './expr';

/** A rectangle of the SVG mapped to a window of the plane. */
export interface View {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  left: number;
  top: number;
  w: number;
  h: number;
  sx: (x: number) => number;
  sy: (y: number) => number;
  /** Screen x back to graph x. */
  gx: (px: number) => number;
  gy: (py: number) => number;
}

export function makeView(
  [x0, x1]: readonly [number, number],
  [y0, y1]: readonly [number, number],
  box: { left: number; top: number; width: number; height: number },
): View {
  const { left, top, width: w, height: h } = box;
  return {
    x0, x1, y0, y1, left, top, w, h,
    sx: (x) => left + ((x - x0) / (x1 - x0)) * w,
    sy: (y) => top + h - ((y - y0) / (y1 - y0)) * h,
    gx: (px) => x0 + ((px - left) / w) * (x1 - x0),
    gy: (py) => y0 + ((top + h - py) / h) * (y1 - y0),
  };
}

/** SVG path for y = f(x). Breaks at gaps, jumps and asymptotes instead of drawing vertical lines. */
export function curvePath(f: (x: number) => number, v: View, from = v.x0, to = v.x1, samples = 240): string {
  const lo = Math.max(from, v.x0);
  const hi = Math.min(to, v.x1);
  if (!(hi > lo)) return '';
  const pad = v.h * 2;
  let d = '';
  let pen = false;
  let prevPy = 0;
  for (let i = 0; i <= samples; i++) {
    const x = lo + ((hi - lo) * i) / samples;
    const y = f(x);
    if (!Number.isFinite(y)) {
      pen = false;
      continue;
    }
    const px = v.sx(x);
    const py = Math.max(v.top - pad, Math.min(v.top + v.h + pad, v.sy(y)));
    if (pen && Math.abs(py - prevPy) > v.h * 0.9) pen = false;
    d += `${pen ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`;
    pen = true;
    prevPy = py;
  }
  return d;
}

/** Closed path for the region between two curves on [a, b] (signed: follows the curves). */
export function regionPath(top: (x: number) => number, bottom: (x: number) => number, v: View, a: number, b: number, samples = 160): string {
  const lo = Math.max(Math.min(a, b), v.x0 - 1e9);
  const hi = Math.max(a, b);
  if (!(hi > lo)) return '';
  const clampY = (y: number) => (Number.isFinite(y) ? Math.max(v.y0 - (v.y1 - v.y0), Math.min(v.y1 + (v.y1 - v.y0), y)) : 0);
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const x = lo + ((hi - lo) * i) / samples;
    d += `${i === 0 ? 'M' : 'L'}${v.sx(x).toFixed(1)},${v.sy(clampY(top(x))).toFixed(1)}`;
  }
  for (let i = samples; i >= 0; i--) {
    const x = lo + ((hi - lo) * i) / samples;
    d += `L${v.sx(x).toFixed(1)},${v.sy(clampY(bottom(x))).toFixed(1)}`;
  }
  return `${d}Z`;
}

/** A "nice" tick step for a range: 1, 2 or 5 times a power of ten. */
export function niceStep(span: number, target = 6): number {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

function ticks(lo: number, hi: number, step: number): number[] {
  const out: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) out.push(Math.abs(t) < 1e-9 ? 0 : t);
  return out;
}

function piLabel(t: number): string {
  const k = Math.round(t / (Math.PI / 2));
  if (k === 0) return '0';
  const sign = k < 0 ? '−' : '';
  const a = Math.abs(k);
  if (a % 2 === 0) return `${sign}${a / 2 === 1 ? '' : a / 2}π`;
  return `${sign}${a === 1 ? '' : a}π/2`;
}

interface AxesProps {
  v: View;
  theme: AnimationTheme;
  /** Label x ticks in multiples of π/2. */
  piTicks?: boolean;
  xStep?: number;
  yStep?: number;
  labels?: boolean;
  xLabel?: string;
  yLabel?: string;
}

/** Grid, axes and tick labels for a View. */
export function Axes({ v, theme, piTicks, xStep, yStep, labels = true, xLabel, yLabel }: AxesProps) {
  const sxStep = piTicks ? Math.PI / 2 : (xStep ?? niceStep(v.x1 - v.x0, v.w < 360 ? 4 : 6));
  const syStep = yStep ?? niceStep(v.y1 - v.y0, v.h < 160 ? 3 : 5);
  const xs = ticks(v.x0, v.x1, sxStep);
  const ys = ticks(v.y0, v.y1, syStep);
  const axisY = Math.min(v.top + v.h, Math.max(v.top, v.sy(0)));
  const axisX = Math.min(v.left + v.w, Math.max(v.left, v.sx(0)));
  const fs = v.w < 360 ? 10 : 11;
  const label = (n: number) => (Math.abs(n) >= 1000 || (Math.abs(n) < 0.01 && n !== 0) ? n.toExponential(0) : String(Number(n.toFixed(4))).replace('-', '−'));
  return (
    <g aria-hidden="true">
      {xs.map((t) => (
        <line key={`gx${t}`} x1={v.sx(t)} x2={v.sx(t)} y1={v.top} y2={v.top + v.h} stroke={theme.colors.grid} strokeWidth={1} />
      ))}
      {ys.map((t) => (
        <line key={`gy${t}`} x1={v.left} x2={v.left + v.w} y1={v.sy(t)} y2={v.sy(t)} stroke={theme.colors.grid} strokeWidth={1} />
      ))}
      <line x1={v.left} x2={v.left + v.w} y1={axisY} y2={axisY} stroke={theme.colors.axis} strokeWidth={1.5} />
      <line x1={axisX} x2={axisX} y1={v.top} y2={v.top + v.h} stroke={theme.colors.axis} strokeWidth={1.5} />
      {labels &&
        xs
          .filter((t) => t !== 0)
          .map((t) => (
            <text key={`lx${t}`} x={v.sx(t)} y={Math.min(v.top + v.h - 3, axisY + fs + 3)} fontSize={fs} fill={theme.colors.muted} textAnchor="middle">
              {piTicks ? piLabel(t) : label(t)}
            </text>
          ))}
      {labels &&
        ys
          .filter((t) => t !== 0)
          .map((t) => (
            <text key={`ly${t}`} x={Math.max(v.left + 3, axisX - 4)} y={v.sy(t) + 4} fontSize={fs} fill={theme.colors.muted} textAnchor={axisX - 4 < v.left + 20 ? 'start' : 'end'}>
              {label(t)}
            </text>
          ))}
      {xLabel && (
        <text x={v.left + v.w - 4} y={axisY - 6} fontSize={fs + 1} fill={theme.colors.muted} textAnchor="end" fontStyle="italic">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={axisX + 6} y={v.top + fs + 2} fontSize={fs + 1} fill={theme.colors.muted} fontStyle="italic">
          {yLabel}
        </text>
      )}
    </g>
  );
}

/** A boxed block of readout lines, drawn in the top-left (or top-right) of the plot. */
export function Readout({ x, y, lines, theme, align = 'left' }: { x: number; y: number; lines: string[]; theme: AnimationTheme; align?: 'left' | 'right' }) {
  if (lines.length === 0) return null;
  const fs = 13;
  const lh = fs + 5;
  const wide = Math.max(...lines.map((l) => l.length)) * fs * 0.62 + 14;
  const left = align === 'right' ? x - wide : x;
  return (
    <g aria-hidden="true">
      <rect x={left} y={y} width={wide} height={lines.length * lh + 8} rx={theme.radius / 2} fill={theme.colors.surface} opacity={0.92} />
      {lines.map((l, i) => (
        <text key={i} x={left + 7} y={y + 4 + lh * (i + 1) - 5} fontSize={fs} fontFamily={theme.monoFamily} fill={theme.colors.ink}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** Theme color by name, for params like color: 'secondary'. */
export type ColorName = 'primary' | 'secondary' | 'accent' | 'good' | 'bad' | 'muted' | 'ink';
export const colorOf = (theme: AnimationTheme, name: ColorName) => theme.colors[name];

export { fmt };

/** Clip children to a View's rectangle (for stacked panels). */
export function Clip({ v, children }: { v: View; children: ReactNode }) {
  const id = useId();
  return (
    <g>
      <clipPath id={id}>
        <rect x={v.left} y={v.top} width={v.w} height={v.h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
}
