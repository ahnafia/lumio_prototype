import { useState, type KeyboardEvent } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, useDrag, useOnce, useRaf } from '../_kit/controls';
import { clamp, deriv, deriv2, fmt, useFns } from '../_kit/expr';
import { Axes, Clip, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Top: y = f(x) with a moving tangent line. Bottom: the graph of f′ (or f″) being drawn
 * as the point moves, colored where it is positive or negative.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  xRange: range,
  yRange: range,
  dyRange: range,
  order: z.union([z.literal(1), z.literal(2)]),
  showSigns: z.boolean(),
  piTicks: z.boolean(),
  autoplay: z.boolean(),
  /** Name shown on the panels, e.g. "f" or "s". */
  fname: z.string(),
});
type Params = z.output<typeof params>;

function DerivativeTracer({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [x0, x1] = p.xRange;
  const [xRaw, setX] = useState(reducedMotion ? x1 : x0);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const d = (x: number) => (p.order === 1 ? deriv(f, x) : deriv2(f, x));
  const x = clamp(xRaw, x0, x1);

  const gap = 8;
  const topH = Math.round((height - gap) * 0.55);
  const top = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: topH - 6 });
  const bot = makeView(p.xRange, p.dyRange, { left: 6, top: topH + gap, width: width - 12, height: height - topH - gap - 6 });

  const move = (nx: number, kind: 'drag' | 'step') => {
    const c = clamp(nx, x0, x1);
    setX(c);
    setTouched(true);
    onInteract?.({ kind, value: c, label: 'x' });
    if (c >= x0 + 0.9 * (x1 - x0)) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched && x < x1, (dt) => {
    setX((prev) => {
      const n = Math.min(x1, prev + dt * ((x1 - x0) / 6));
      if (n >= x0 + 0.9 * (x1 - x0)) complete();
      return n;
    });
  });
  const drag = useDrag((px) => move(top.gx(px), 'drag'));
  const onKey = (e: KeyboardEvent<SVGCircleElement>) => {
    const step = (x1 - x0) / 100;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') move(x - step, 'step');
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') move(x + step, 'step');
  };

  const y = f(x);
  const m = deriv(f, x);
  const dv = d(x);
  const half = (x1 - x0) * 0.18;
  const prime = p.order === 1 ? '′' : '″';
  const pos = (t: number) => (d(t) >= 0 ? d(t) : NaN);
  const neg = (t: number) => (d(t) <= 0 ? d(t) : NaN);

  return (
    <Frame width={width} height={height} theme={theme} label={`Top: y = ${p.expr} with tangent at x = ${fmt(x)}. Bottom: graph of ${p.fname}${prime} traced up to x, value ${fmt(dv)}.`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', touchAction: 'none' }} {...drag}>
        <Axes v={top} theme={theme} piTicks={p.piTicks} yLabel={`${p.fname}(x)`} />
        <Axes v={bot} theme={theme} piTicks={p.piTicks} labels={false} yLabel={`${p.fname}${prime}(x)`} />
        {fns && (
          <>
            <Clip v={top}>
            <path d={curvePath(f, top)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            {Number.isFinite(m) && Number.isFinite(y) && (
              <line x1={top.sx(x - half)} y1={top.sy(y - m * half)} x2={top.sx(x + half)} y2={top.sy(y + m * half)} stroke={theme.colors.secondary} strokeWidth={2.5} />
            )}
            </Clip>
            <Clip v={bot}>
            {p.showSigns ? (
              <>
                <path d={curvePath(pos, bot, x0, x)} fill="none" stroke={theme.colors.good} strokeWidth={3} />
                <path d={curvePath(neg, bot, x0, x)} fill="none" stroke={theme.colors.bad} strokeWidth={3} />
              </>
            ) : (
              <path d={curvePath(d, bot, x0, x)} fill="none" stroke={theme.colors.secondary} strokeWidth={3} />
            )}
            </Clip>
            <line x1={top.sx(x)} x2={top.sx(x)} y1={top.top} y2={bot.top + bot.h} stroke={theme.colors.muted} strokeDasharray="3 4" />
            {Number.isFinite(dv) && <circle cx={bot.sx(x)} cy={bot.sy(clamp(dv, p.dyRange[0], p.dyRange[1]))} r={6} fill={theme.colors.secondary} />}
            {Number.isFinite(y) && (
              <circle
                cx={top.sx(x)}
                cy={top.sy(y)}
                r={9}
                fill={theme.colors.accent}
                stroke={theme.colors.ink}
                strokeWidth={1.5}
                tabIndex={0}
                role="slider"
                aria-label="Point on the curve"
                aria-valuemin={x0}
                aria-valuemax={x1}
                aria-valuenow={Number(x.toFixed(2))}
                onKeyDown={onKey}
                style={{ cursor: 'grab' }}
              />
            )}
          </>
        )}
        <Readout x={top.left + top.w - 4} y={top.top + 2} lines={[`x = ${fmt(x)}`, `${p.fname}${prime}(x) = ${fmt(dv)}`]} theme={theme} align="right" />
      </svg>
    </Frame>
  );
}

export default defineAnimation({
  name: 'derivative-tracer',
  title: 'Derivative tracer',
  description: 'Drag along y = f(x): the tangent slope at each x is plotted below, drawing the graph of the derivative.',
  interactive: true,
  aspectRatio: 1,
  params,
  defaults: { expr: 'x^3 - 3x', xRange: [-2.3, 2.3], yRange: [-4, 4], dyRange: [-4, 13], order: 1, showSigns: true, piTicks: false, autoplay: true, fname: 'f' },
  presets: {
    'sin(x)': { expr: 'sin(x)', xRange: [0, 6.28], yRange: [-1.4, 1.4], dyRange: [-1.4, 1.4], piTicks: true },
    'Second derivative': { expr: 'x^3 - 3x', order: 2, dyRange: [-14, 14] },
  },
  component: DerivativeTracer,
});
