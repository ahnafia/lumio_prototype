import { useState, type KeyboardEvent } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, useDrag, useOnce } from '../_kit/controls';
import { clamp, deriv, fmt, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Mean Value Theorem: drag c along (a, b) until the tangent at c is parallel to the chord
 * from (a, f(a)) to (b, f(b)). With f(a) = f(b) this is Rolle's Theorem.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  b: z.number(),
  xRange: range,
  yRange: range,
  cStart: z.number(),
});
type Params = z.output<typeof params>;

function MeanValue({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [cRaw, setC] = useState(p.cStart);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const lo = p.a + (p.b - p.a) * 0.01;
  const hi = p.b - (p.b - p.a) * 0.01;
  const c = clamp(cRaw, lo, hi);
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: height - 12 });
  const fa = f(p.a);
  const fb = f(p.b);
  const chord = (fb - fa) / (p.b - p.a);
  const m = deriv(f, c);
  const parallel = fns !== null && Math.abs(m - chord) <= 0.04 * Math.max(1, Math.abs(chord));

  const move = (x: number, kind: 'drag' | 'step') => {
    const nc = clamp(x, lo, hi);
    setC(nc);
    onInteract?.({ kind, value: nc, label: 'c' });
    if (Math.abs(deriv(f, nc) - chord) <= 0.04 * Math.max(1, Math.abs(chord))) complete();
  };
  const drag = useDrag((px) => move(v.gx(px), 'drag'));
  const onKey = (e: KeyboardEvent<SVGCircleElement>) => {
    const step = (p.b - p.a) / 100;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') move(c - step, 'step');
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') move(c + step, 'step');
  };
  const yc = f(c);
  const half = (p.xRange[1] - p.xRange[0]) * 0.25;

  return (
    <Frame width={width} height={height} theme={theme} label={`Graph of y = ${p.expr} on [${p.a}, ${p.b}]. Chord slope ${fmt(chord)}; tangent slope at c = ${fmt(c)} is ${fmt(m)}.`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', touchAction: 'none' }} {...drag}>
        <Axes v={v} theme={theme} />
        {fns && (
          <>
            <path d={curvePath(f, v)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            <line x1={v.sx(p.a)} y1={v.sy(fa)} x2={v.sx(p.b)} y2={v.sy(fb)} stroke={theme.colors.secondary} strokeWidth={2.5} strokeDasharray="8 5" />
            <circle cx={v.sx(p.a)} cy={v.sy(fa)} r={6} fill={theme.colors.secondary} />
            <circle cx={v.sx(p.b)} cy={v.sy(fb)} r={6} fill={theme.colors.secondary} />
            {Number.isFinite(yc) && (
              <>
                <line x1={v.sx(c - half)} y1={v.sy(yc - m * half)} x2={v.sx(c + half)} y2={v.sy(yc + m * half)} stroke={parallel ? theme.colors.good : theme.colors.accent} strokeWidth={3} />
                <circle
                  cx={v.sx(c)}
                  cy={v.sy(yc)}
                  r={9}
                  fill={parallel ? theme.colors.good : theme.colors.accent}
                  stroke={theme.colors.ink}
                  strokeWidth={1.5}
                  tabIndex={0}
                  role="slider"
                  aria-label="Point c"
                  aria-valuemin={p.a}
                  aria-valuemax={p.b}
                  aria-valuenow={Number(c.toFixed(2))}
                  onKeyDown={onKey}
                  style={{ cursor: 'grab' }}
                />
              </>
            )}
          </>
        )}
        <Readout
          x={v.left + 4}
          y={v.top + 2}
          lines={[`chord slope = ${fmt(chord)}`, `f′(c) = ${fmt(m)}`, `c = ${fmt(c)}${parallel ? '  parallel!' : ''}`]}
          theme={theme}
        />
      </svg>
    </Frame>
  );
}

export default defineAnimation({
  name: 'mean-value',
  title: 'Mean Value Theorem',
  description: 'Drag c until the tangent line is parallel to the chord from a to b.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: 'x^3 - 3x^2 + 2x + 1', a: 0, b: 3, xRange: [-0.5, 3.5], yRange: [-1, 8], cStart: 0.3 },
  presets: { "Rolle's (f(a) = f(b))": { expr: 'sin(x)', a: 0, b: 3.14159, xRange: [-0.3, 3.5], yRange: [-0.5, 1.5], cStart: 0.4 } },
  component: MeanValue,
});
