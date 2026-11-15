import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce, useRaf } from '../_kit/controls';
import { fmt, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Two points slide toward x = a, one from each side, while a readout shows x and f(x).
 * The slider sets the distance from a on a log scale (1 down to 0.001). Open circles mark
 * the one-sided limits; an optional filled dot shows the actual value f(a).
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  xRange: range,
  yRange: range,
  /** Plot a filled dot at (a, valueAt): the function's actual value there. */
  valueAt: z.number().nullable(),
  sides: z.enum(['both', 'left', 'right']),
  /** Readout decimals. */
  digits: z.number().int().min(1).max(6),
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

const S_MAX = 3; // distance = 10^-s

function LimitApproach({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [s, setS] = useState(reducedMotion && p.autoplay ? 2 : 0);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const d = 10 ** -s;

  const plotH = height - ROW_H;
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });

  const move = (val: number) => {
    setS(val);
    setTouched(true);
    onInteract?.({ kind: 'slider', value: 10 ** -val, label: 'distance' });
    if (val >= 2) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched && s < S_MAX, (dt) => {
    setS((prev) => {
      const n = Math.min(S_MAX, prev + dt * 0.7);
      if (n >= 2) complete();
      return n;
    });
  });

  const left = p.a - d;
  const right = p.a + d;
  const yl = f(left);
  const yr = f(right);
  const L = f(p.a - 1e-7);
  const R = f(p.a + 1e-7);
  const showL = p.sides !== 'right';
  const showR = p.sides !== 'left';
  const lines: string[] = [];
  if (showL) lines.push(`x = ${(p.a - d).toFixed(p.digits)}  f(x) = ${fmt(yl, p.digits)}`);
  if (showR) lines.push(`x = ${(p.a + d).toFixed(p.digits)}  f(x) = ${fmt(yr, p.digits)}`);

  const mover = (x: number, y: number, c: string) =>
    Number.isFinite(y) && (
      <g>
        <line x1={v.sx(x)} x2={v.sx(x)} y1={v.sy(0)} y2={v.sy(y)} stroke={c} strokeDasharray="4 4" strokeWidth={1.5} />
        <line x1={v.sx(x)} x2={v.left} y1={v.sy(y)} y2={v.sy(y)} stroke={c} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.6} />
        <circle cx={v.sx(x)} cy={v.sy(y)} r={7} fill={c} stroke={theme.colors.ink} strokeWidth={1} />
      </g>
    );
  const hole = (y: number, key: string) =>
    Number.isFinite(y) && Math.abs(y) < 1e6 && <circle key={key} cx={v.sx(p.a)} cy={v.sy(y)} r={6} fill={theme.colors.background} stroke={theme.colors.primary} strokeWidth={2.5} />;

  return (
    <Frame width={width} height={height} theme={theme} label={`Graph of y = ${p.expr} near x = ${p.a}. Points at distance ${d.toFixed(3)} from ${p.a}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        <line x1={v.sx(p.a)} x2={v.sx(p.a)} y1={v.top} y2={v.top + v.h} stroke={theme.colors.muted} strokeDasharray="2 5" />
        {fns && (
          <>
            <path d={curvePath(f, v, p.xRange[0], p.a - 1e-6)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            <path d={curvePath(f, v, p.a + 1e-6, p.xRange[1])} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            {hole(L, 'l')}
            {Math.abs(L - R) > 1e-4 && hole(R, 'r')}
            {p.valueAt !== null && <circle cx={v.sx(p.a)} cy={v.sy(p.valueAt)} r={6} fill={theme.colors.primary} />}
            {showL && mover(left, yl, theme.colors.secondary)}
            {showR && mover(right, yr, theme.colors.accent)}
          </>
        )}
        <Readout x={v.left + v.w - 4} y={v.top + 2} lines={lines} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="closer" value={s} min={0} max={S_MAX} step={0.05} onChange={move} display={`±${d < 0.01 ? d.toFixed(4) : d.toFixed(3)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'limit-approach',
  title: 'Approaching a limit',
  description: 'Points slide toward x = a from the left and the right while a table of x and f(x) updates.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: '(x^2 - 1)/(x - 1)', a: 1, xRange: [-1, 3], yRange: [-0.5, 4], valueAt: null, sides: 'both', digits: 4, autoplay: true },
  presets: {
    'Jump (one-sided)': { expr: 'x < 2 ? x + 1 : x - 2', a: 2, xRange: [0, 4], yRange: [-1, 4], valueAt: 3 },
    'sin(x)/x': { expr: 'sin(x)/x', a: 0, xRange: [-6, 6], yRange: [-0.5, 1.4] },
    'Blows up': { expr: '1/(x-1)^2', a: 1, xRange: [-1, 3], yRange: [-1, 20], digits: 2 },
  },
  component: LimitApproach,
});
