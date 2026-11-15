import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { fmt, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * The precise definition, made visible: pick ε (a band around L) and the animation finds
 * the largest δ (a band around a) that keeps the curve inside the ε band.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  L: z.number(),
  xRange: range,
  yRange: range,
  epsMax: z.number().positive(),
  epsStart: z.number().positive(),
});
type Params = z.output<typeof params>;

function EpsilonDelta({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [epsRaw, setEps] = useState(p.epsStart);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const eps = Math.min(p.epsMax, Math.max(p.epsMax / 50, epsRaw));
  const plotH = height - ROW_H;
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });

  // Largest δ (to 3 significant steps) with |f(x) − L| < ε whenever 0 < |x − a| < δ.
  let delta = NaN;
  if (fns) {
    const maxD = Math.max(p.a - p.xRange[0], p.xRange[1] - p.a);
    const N = 2000;
    delta = maxD;
    for (let i = 1; i <= N; i++) {
      const dd = (maxD * i) / N;
      const bad = [p.a - dd, p.a + dd].some((x) => {
        const y = f(x);
        return !Number.isFinite(y) || Math.abs(y - p.L) >= eps;
      });
      if (bad) {
        delta = (maxD * (i - 1)) / N;
        break;
      }
    }
  }

  const move = (val: number) => {
    setEps(val);
    onInteract?.({ kind: 'slider', value: val, label: 'epsilon' });
    if (val <= p.epsMax / 4) complete();
  };

  return (
    <Frame width={width} height={height} theme={theme} label={`Epsilon band of ${fmt(eps)} around L = ${p.L}, giving delta ${fmt(delta, 3)} around a = ${p.a}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        <rect x={v.left} width={v.w} y={v.sy(p.L + eps)} height={Math.max(0, v.sy(p.L - eps) - v.sy(p.L + eps))} fill={theme.colors.accent} opacity={0.22} />
        {Number.isFinite(delta) && (
          <rect y={v.top} height={v.h} x={v.sx(p.a - delta)} width={Math.max(0, v.sx(p.a + delta) - v.sx(p.a - delta))} fill={theme.colors.primary} opacity={0.14} />
        )}
        <line x1={v.left} x2={v.left + v.w} y1={v.sy(p.L)} y2={v.sy(p.L)} stroke={theme.colors.accent} strokeDasharray="6 5" strokeWidth={1.5} />
        <line x1={v.sx(p.a)} x2={v.sx(p.a)} y1={v.top} y2={v.top + v.h} stroke={theme.colors.primary} strokeDasharray="6 5" strokeWidth={1.5} />
        {fns && <path d={curvePath(f, v)} fill="none" stroke={theme.colors.muted} strokeWidth={2.5} />}
        {fns && Number.isFinite(delta) && <path d={curvePath(f, v, p.a - delta, p.a + delta)} fill="none" stroke={theme.colors.good} strokeWidth={4} />}
        <circle cx={v.sx(p.a)} cy={v.sy(p.L)} r={5} fill={theme.colors.background} stroke={theme.colors.ink} strokeWidth={2} />
        <text x={v.left + 6} y={v.sy(p.L + eps) - 5} fontSize={12} fill={theme.colors.ink}>
          L + ε
        </text>
        <text x={v.left + 6} y={v.sy(p.L - eps) + 15} fontSize={12} fill={theme.colors.ink}>
          L − ε
        </text>
        <Readout x={v.left + v.w - 4} y={v.top + 2} lines={[`ε = ${fmt(eps, 3)}`, `δ = ${fmt(delta, 3)}`]} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="ε" value={eps} min={p.epsMax / 50} max={p.epsMax} step={p.epsMax / 200} onChange={move} display={`ε = ${fmt(eps, 3)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'epsilon-delta',
  title: 'Epsilon and delta',
  description: 'Shrink the ε band around L and watch the largest δ band around a that keeps the curve inside it.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: '2x + 1', a: 2, L: 5, xRange: [0, 4], yRange: [0, 9], epsMax: 2, epsStart: 1.5 },
  presets: { 'Curved: x²': { expr: 'x^2', a: 2, L: 4, xRange: [0, 3.5], yRange: [0, 10], epsMax: 3, epsStart: 2 } },
  component: EpsilonDelta,
});
