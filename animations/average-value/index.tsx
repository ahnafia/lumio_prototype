import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { fmt, integrate, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView, regionPath } from '../_kit/plot';

/**
 * Average value: raise or lower a rectangle over [a, b] until its area equals the area
 * under the curve. That height is the average value of f.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  b: z.number(),
  xRange: range,
  yRange: range,
  hStart: z.number(),
});
type Params = z.output<typeof params>;

function AverageValue({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [hRaw, setH] = useState(p.hStart);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const h = Math.min(p.yRange[1], Math.max(p.yRange[0], hRaw));
  const plotH = height - ROW_H;
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });
  const area = fns ? integrate(f, p.a, p.b, 400) : NaN;
  const avg = area / (p.b - p.a);
  const rect = h * (p.b - p.a);
  const tol = (p.yRange[1] - p.yRange[0]) * 0.012;
  const match = fns !== null && Math.abs(h - avg) <= tol;

  const move = (n: number) => {
    setH(n);
    onInteract?.({ kind: 'slider', value: n, label: 'height' });
    if (Math.abs(n - avg) <= tol) complete();
  };

  return (
    <Frame width={width} height={height} theme={theme} label={`Rectangle of height ${fmt(h)} over [${p.a}, ${p.b}] has area ${fmt(rect)}; area under y = ${p.expr} is ${fmt(area)}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        {fns && (
          <>
            <path d={regionPath(f, () => 0, v, p.a, p.b)} fill={theme.colors.accent} opacity={0.3} />
            <rect x={v.sx(p.a)} width={v.sx(p.b) - v.sx(p.a)} y={Math.min(v.sy(h), v.sy(0))} height={Math.abs(v.sy(0) - v.sy(h))} fill={match ? theme.colors.good : theme.colors.secondary} opacity={0.15} stroke={match ? theme.colors.good : theme.colors.secondary} strokeWidth={2.5} />
            <path d={curvePath(f, v)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
          </>
        )}
        <Readout x={v.left + v.w - 4} y={v.top + 2} lines={[`area under f = ${fmt(area)}`, `rectangle = ${fmt(rect)}`, match ? `equal! height = ${fmt(h)}` : `height = ${fmt(h)}`]} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="height" value={h} min={p.yRange[0]} max={p.yRange[1]} step={(p.yRange[1] - p.yRange[0]) / 400} onChange={move} display={fmt(h)} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'average-value',
  title: 'Average value',
  description: 'Level a rectangle over [a, b] until its area matches the area under the curve; its height is the average value.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: 'x^2', a: 0, b: 3, xRange: [-0.3, 3.4], yRange: [0, 9.5], hStart: 6 },
  presets: { 'sin x on [0, π]': { expr: 'sin(x)', a: 0, b: 3.14159, xRange: [-0.2, 3.4], yRange: [0, 1.3], hStart: 1 } },
  component: AverageValue,
});
