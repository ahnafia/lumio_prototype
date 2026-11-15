import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { fmt, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Slide a level y = N between f(a) and f(b). Every c in (a, b) with f(c) = N is marked.
 * With a jump in the function, some levels have no c at all.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  b: z.number(),
  xRange: range,
  yRange: range,
  nRange: range,
  nStart: z.number(),
});
type Params = z.output<typeof params>;

function IntermediateValue({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [nRaw, setN] = useState(p.nStart);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const N = Math.min(p.nRange[1], Math.max(p.nRange[0], nRaw));
  const plotH = height - ROW_H;
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });

  // Crossings of f(x) = N on [a, b]: sign changes, refined by bisection. Jumps don't count.
  const cs: number[] = [];
  if (fns) {
    const K = 600;
    const g = (x: number) => f(x) - N;
    for (let i = 0; i < K; i++) {
      let lo = p.a + ((p.b - p.a) * i) / K;
      let hi = p.a + ((p.b - p.a) * (i + 1)) / K;
      const gl = g(lo);
      const gh = g(hi);
      if (!Number.isFinite(gl) || !Number.isFinite(gh)) continue;
      if (gl === 0) cs.push(lo);
      else if (gl * gh < 0) {
        for (let k = 0; k < 40; k++) {
          const mid = (lo + hi) / 2;
          if (g(lo) * g(mid) <= 0) hi = mid;
          else lo = mid;
        }
        const c = (lo + hi) / 2;
        if (Math.abs(g(c)) < 1e-3 * Math.max(1, Math.abs(N))) cs.push(c);
      }
    }
  }
  const unique = cs.filter((c, i) => i === 0 || Math.abs(c - (cs[i - 1] ?? 0)) > 1e-3).slice(0, 4);

  const move = (val: number) => {
    setN(val);
    onInteract?.({ kind: 'slider', value: val, label: 'N' });
    if (Math.abs(val - p.nStart) >= 0.4 * (p.nRange[1] - p.nRange[0])) complete();
  };

  return (
    <Frame width={width} height={height} theme={theme} label={`Graph of y = ${p.expr} on [${p.a}, ${p.b}] with the line y = ${fmt(N)}; ${unique.length} crossing(s).`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        <rect x={v.sx(p.a)} y={v.top} width={v.sx(p.b) - v.sx(p.a)} height={v.h} fill={theme.colors.surface} opacity={0.6} />
        {fns && (
          <>
            <path d={curvePath(f, v)} fill="none" stroke={theme.colors.muted} strokeWidth={2} opacity={0.5} />
            <path d={curvePath(f, v, p.a, p.b)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            <circle cx={v.sx(p.a)} cy={v.sy(f(p.a))} r={6} fill={theme.colors.primary} />
            <circle cx={v.sx(p.b)} cy={v.sy(f(p.b))} r={6} fill={theme.colors.primary} />
          </>
        )}
        <line x1={v.sx(p.a)} x2={v.sx(p.b)} y1={v.sy(N)} y2={v.sy(N)} stroke={theme.colors.accent} strokeWidth={2.5} strokeDasharray="8 5" />
        {unique.map((c) => (
          <g key={c}>
            <line x1={v.sx(c)} x2={v.sx(c)} y1={v.sy(N)} y2={v.sy(0)} stroke={theme.colors.good} strokeDasharray="4 4" strokeWidth={1.5} />
            <circle cx={v.sx(c)} cy={v.sy(N)} r={7} fill={theme.colors.good} stroke={theme.colors.ink} />
          </g>
        ))}
        <Readout
          x={v.left + v.w - 4}
          y={v.top + 2}
          lines={[`N = ${fmt(N)}`, unique.length ? `c ≈ ${unique.map((c) => fmt(c)).join(', ')}` : 'no c with f(c) = N']}
          theme={theme}
          align="right"
        />
      </svg>
      <Slider theme={theme} label="N" value={N} min={p.nRange[0]} max={p.nRange[1]} step={(p.nRange[1] - p.nRange[0]) / 200} onChange={move} display={`N = ${fmt(N)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'intermediate-value',
  title: 'Intermediate Value Theorem',
  description: 'Slide a level N between f(a) and f(b) and see where the graph must cross it.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: 'x^3 - x - 1', a: 0, b: 2, xRange: [-0.5, 2.5], yRange: [-3, 6], nRange: [-1, 5], nStart: 0 },
  presets: { 'With a jump': { expr: 'x < 1 ? x : x + 2', a: 0, b: 2, xRange: [-0.5, 2.5], yRange: [-1, 5], nRange: [0, 4], nStart: 0.5 } },
  component: IntermediateValue,
});
