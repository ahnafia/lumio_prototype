import { useState, type ReactNode } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { deriv, fmt, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Three views of "a curve is nearly its tangent line near a":
 *   zoom         — zoom in on (a, f(a)) until the curve and tangent look the same
 *   differential — slide dx and compare dy (along the tangent) with Δy (along the curve)
 *   taylor       — raise the degree of the Taylor polynomial at a
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  xRange: range,
  yRange: range,
  mode: z.enum(['zoom', 'differential', 'taylor']),
  dxMax: z.number().positive(),
  maxDegree: z.number().int().min(1).max(4),
});
type Params = z.output<typeof params>;

const binom = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
/** k-th derivative by central differences. */
function nthDeriv(f: (x: number) => number, x: number, k: number): number {
  if (k === 0) return f(x);
  const h = 0.02;
  let s = 0;
  for (let j = 0; j <= k; j++) s += (j % 2 ? -1 : 1) * binom(k, j) * f(x + (k / 2 - j) * h);
  return s / h ** k;
}
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

function LinearApprox({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const init = p.mode === 'zoom' ? 0 : p.mode === 'differential' ? p.dxMax * 0.8 : 0;
  const [val, setVal] = useState(init);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const fa = f(p.a);
  const m = deriv(f, p.a);
  const Lin = (x: number) => fa + m * (x - p.a);
  const plotH = height - ROW_H;
  const box = { left: 6, top: 6, width: width - 12, height: plotH - 12 };

  let xr: [number, number] = [p.xRange[0], p.xRange[1]];
  let yr: [number, number] = [p.yRange[0], p.yRange[1]];
  let lines: string[];
  let extra = null;
  let slider: ReactNode;

  const report = (n: number, label: string, done: boolean) => {
    setVal(n);
    onInteract?.({ kind: 'slider', value: n, label });
    if (done) complete();
  };

  if (p.mode === 'zoom') {
    const z = Math.min(3, Math.max(0, val));
    const k = 10 ** -z;
    const hx = ((p.xRange[1] - p.xRange[0]) / 2) * k;
    const hy = ((p.yRange[1] - p.yRange[0]) / 2) * k;
    xr = [p.a - hx, p.a + hx];
    // Until mathjs loads, f(a) is NaN: center on the y-range instead.
    const cy = Number.isFinite(fa) ? fa : (p.yRange[0] + p.yRange[1]) / 2;
    yr = [cy - hy, cy + hy];
    const probe = p.a + hx * 0.6;
    lines = [`zoom ×${fmt(1 / k, 0)}`, `f(${fmt(probe, 3)}) = ${fmt(f(probe), 4)}`, `L(${fmt(probe, 3)}) = ${fmt(Lin(probe), 4)}`];
    slider = <Slider theme={theme} label="zoom" value={z} min={0} max={3} step={0.02} onChange={(n) => report(n, 'zoom', n >= 2)} display={`×${fmt(1 / k, 0)}`} />;
  } else if (p.mode === 'differential') {
    const dx = Math.max(-p.dxMax, Math.min(p.dxMax, val));
    const dy = m * dx;
    const Dy = f(p.a + dx) - fa;
    lines = [`dx = ${fmt(dx, 3)}`, `dy = f′(a)·dx = ${fmt(dy, 4)}`, `Δy = ${fmt(Dy, 4)}`, `error = ${fmt(Math.abs(Dy - dy), 4)}`];
    slider = <Slider theme={theme} label="dx" value={dx} min={-p.dxMax} max={p.dxMax} step={p.dxMax / 100} onChange={(n) => report(n, 'dx', Math.abs(n) <= p.dxMax * 0.15)} display={`dx = ${fmt(dx)}`} />;
  } else {
    const n = Math.round(Math.min(p.maxDegree, Math.max(0, val)));
    lines = [`degree n = ${n}`];
    slider = <Slider theme={theme} label="degree" value={n} min={0} max={p.maxDegree} step={1} onChange={(k) => report(k, 'degree', k >= p.maxDegree)} display={`n = ${n}`} />;
  }
  const v = makeView(xr, yr, box);

  if (fns && p.mode === 'differential') {
    const dx = Math.max(-p.dxMax, Math.min(p.dxMax, val));
    const x2 = p.a + dx;
    extra = (
      <g>
        <line x1={v.sx(p.a)} y1={v.sy(fa)} x2={v.sx(x2)} y2={v.sy(fa)} stroke={theme.colors.ink} strokeWidth={2} />
        <line x1={v.sx(x2)} y1={v.sy(fa)} x2={v.sx(x2)} y2={v.sy(f(x2))} stroke={theme.colors.primary} strokeWidth={4} opacity={0.7} />
        <line x1={v.sx(x2) + 6} y1={v.sy(fa)} x2={v.sx(x2) + 6} y2={v.sy(Lin(x2))} stroke={theme.colors.secondary} strokeWidth={4} opacity={0.8} />
        <circle cx={v.sx(x2)} cy={v.sy(f(x2))} r={5} fill={theme.colors.primary} />
        <circle cx={v.sx(x2) + 6} cy={v.sy(Lin(x2))} r={5} fill={theme.colors.secondary} />
        <text x={v.sx(x2) - 8} y={v.sy((fa + f(x2)) / 2)} fontSize={12} fill={theme.colors.primary} textAnchor="end">Δy</text>
        <text x={v.sx(x2) + 14} y={v.sy((fa + Lin(x2)) / 2)} fontSize={12} fill={theme.colors.secondary}>dy</text>
      </g>
    );
  }
  let taylor = null;
  if (fns && p.mode === 'taylor') {
    const n = Math.round(Math.min(p.maxDegree, Math.max(0, val)));
    const coef = Array.from({ length: n + 1 }, (_, k) => nthDeriv(f, p.a, k) / fact(k));
    const T = (x: number) => coef.reduce((s, ck, k) => s + ck * (x - p.a) ** k, 0);
    taylor = <path d={curvePath(T, v)} fill="none" stroke={theme.colors.secondary} strokeWidth={3} strokeDasharray="8 5" />;
    const probe = p.a + (p.xRange[1] - p.a) * 0.5;
    lines.push(`f(${fmt(probe)}) = ${fmt(f(probe), 4)}`, `T(${fmt(probe)}) = ${fmt(T(probe), 4)}`);
  }

  return (
    <Frame width={width} height={height} theme={theme} label={`Curve y = ${p.expr} and its approximation near x = ${p.a}. ${lines.join(', ')}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        {fns && (
          <>
            {p.mode !== 'taylor' && <path d={curvePath(Lin, v)} fill="none" stroke={theme.colors.secondary} strokeWidth={2.5} />}
            <path d={curvePath(f, v)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            {taylor}
            {extra}
            <circle cx={v.sx(p.a)} cy={v.sy(fa)} r={6} fill={theme.colors.accent} stroke={theme.colors.ink} />
          </>
        )}
        <Readout x={v.left + 4} y={v.top + 2} lines={lines} theme={theme} />
      </svg>
      {slider}
    </Frame>
  );
}

export default defineAnimation({
  name: 'linear-approx',
  title: 'Linear approximation',
  description: 'Zoom in until a curve looks like its tangent line, compare dy with Δy, or raise the degree of a Taylor polynomial.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: 'sqrt(x)', a: 4, xRange: [0, 9], yRange: [0, 3.5], mode: 'zoom', dxMax: 3, maxDegree: 4 },
  presets: {
    Differentials: { mode: 'differential', expr: 'x^3', a: 1, xRange: [0, 2], yRange: [-0.5, 6], dxMax: 0.8 },
    'Taylor e^x': { mode: 'taylor', expr: 'e^x', a: 0, xRange: [-2, 2], yRange: [-1, 7.5], maxDegree: 4 },
  },
  component: LinearApprox,
});
