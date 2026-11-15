import { useState, type KeyboardEvent } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, useDrag, useOnce, useRaf } from '../_kit/controls';
import { clamp, fmt, integrate, useFns } from '../_kit/expr';
import { Axes, Clip, Readout, curvePath, makeView, regionPath } from '../_kit/plot';

/**
 * The Fundamental Theorem, live. Top: y = f(t) with the signed area from a to x shaded.
 * Bottom: the area function A(x) = ∫ₐˣ f(t) dt, whose slope at x is exactly f(x).
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  xRange: range,
  yRange: range,
  ayRange: range,
  xStart: z.number(),
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

function FtcAccumulator({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [x0, x1] = p.xRange;
  const [xRaw, setX] = useState(p.xStart);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (t: number) => fns?.[0]?.(t) ?? NaN;
  const x = clamp(xRaw, x0, x1);
  const gap = 8;
  const topH = Math.round((height - gap) * 0.5);
  const top = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: topH - 6 });
  const bot = makeView(p.xRange, p.ayRange, { left: 6, top: topH + gap, width: width - 12, height: height - topH - gap - 6 });

  const move = (nx: number, kind: 'drag' | 'step') => {
    const c = clamp(nx, x0, x1);
    setX(c);
    setTouched(true);
    onInteract?.({ kind, value: c, label: 'x' });
    if (Math.abs(c - p.xStart) >= 0.5 * (x1 - x0)) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched && x < x1, (dt) => {
    setX((prev) => Math.min(x1, prev + dt * ((x1 - x0) / 7)));
  });
  const drag = useDrag((px) => move(top.gx(px), 'drag'));
  const onKey = (e: KeyboardEvent<SVGCircleElement>) => {
    const step = (x1 - x0) / 100;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') move(x - step, 'step');
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') move(x + step, 'step');
  };

  // A(t) on a grid, accumulated piece by piece (cheap enough to redo each render).
  const N = 160;
  const grid: number[] = [];
  const A: number[] = [];
  if (fns) {
    const i0 = clamp(Math.round(((p.a - x0) / (x1 - x0)) * N), 0, N);
    for (let i = 0; i <= N; i++) grid.push(x0 + ((x1 - x0) * i) / N);
    A.length = N + 1;
    A[i0] = integrate(f, p.a, grid[i0] ?? p.a, 40);
    for (let i = i0 + 1; i <= N; i++) A[i] = (A[i - 1] ?? 0) + integrate(f, grid[i - 1] ?? 0, grid[i] ?? 0, 8);
    for (let i = i0 - 1; i >= 0; i--) A[i] = (A[i + 1] ?? 0) - integrate(f, grid[i] ?? 0, grid[i + 1] ?? 0, 8);
  }
  const Aat = (t: number) => {
    const u = ((t - x0) / (x1 - x0)) * N;
    const i = Math.max(0, Math.min(N - 1, Math.floor(u)));
    const w = u - i;
    return (A[i] ?? NaN) * (1 - w) + (A[i + 1] ?? NaN) * w;
  };
  const ax = fns ? integrate(f, p.a, x, 200) : NaN;
  const fx = f(x);
  const half = (x1 - x0) * 0.15;
  const zero = () => 0;

  return (
    <Frame width={width} height={height} theme={theme} label={`Area from ${p.a} to x = ${fmt(x)} under y = ${p.expr} is ${fmt(ax)}; its rate of change is f(x) = ${fmt(fx)}.`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', touchAction: 'none' }} {...drag}>
        <Axes v={top} theme={theme} xLabel="t" yLabel="f(t)" />
        <Axes v={bot} theme={theme} labels={false} xLabel="x" yLabel="A(x)" />
        {fns && (
          <>
            <Clip v={top}>
            <path d={regionPath((t) => Math.max(f(t), 0), zero, top, p.a, x)} fill={theme.colors.primary} opacity={0.3} />
            <path d={regionPath(zero, (t) => Math.min(f(t), 0), top, p.a, x)} fill={theme.colors.bad} opacity={0.3} />
            <path d={curvePath(f, top)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            </Clip>
            <line x1={top.sx(x)} x2={top.sx(x)} y1={top.top} y2={bot.top + bot.h} stroke={theme.colors.muted} strokeDasharray="3 4" />
            <Clip v={bot}>
            <path d={curvePath(Aat, bot)} fill="none" stroke={theme.colors.muted} strokeWidth={2} strokeDasharray="5 5" opacity={0.6} />
            <path d={curvePath(Aat, bot, Math.min(p.a, x), Math.max(p.a, x))} fill="none" stroke={theme.colors.secondary} strokeWidth={3} />
            {Number.isFinite(fx) && (
              <line x1={bot.sx(x - half)} y1={bot.sy(ax - fx * half)} x2={bot.sx(x + half)} y2={bot.sy(ax + fx * half)} stroke={theme.colors.accent} strokeWidth={2.5} />
            )}
            </Clip>
            <circle cx={bot.sx(x)} cy={bot.sy(ax)} r={6} fill={theme.colors.secondary} />
            {Number.isFinite(fx) && (
              <circle
                cx={top.sx(x)}
                cy={top.sy(fx)}
                r={9}
                fill={theme.colors.accent}
                stroke={theme.colors.ink}
                strokeWidth={1.5}
                tabIndex={0}
                role="slider"
                aria-label="Upper limit x"
                aria-valuemin={x0}
                aria-valuemax={x1}
                aria-valuenow={Number(x.toFixed(2))}
                onKeyDown={onKey}
                style={{ cursor: 'grab' }}
              />
            )}
          </>
        )}
        <Readout x={bot.left + bot.w - 4} y={bot.top + 2} lines={[`x = ${fmt(x)}`, `A(x) = ${fmt(ax)}`, `slope of A = f(x) = ${fmt(fx)}`]} theme={theme} align="right" />
      </svg>
    </Frame>
  );
}

export default defineAnimation({
  name: 'ftc-accumulator',
  title: 'FTC accumulator',
  description: 'Drag x: the shaded area A(x) grows below, and its slope always equals the height f(x).',
  interactive: true,
  aspectRatio: 1,
  params,
  defaults: { expr: '1 + 0.5 * sin(2x)', a: 0, xRange: [0, 6], yRange: [-0.5, 2], ayRange: [-0.5, 7], xStart: 0.5, autoplay: true },
  presets: { 'Goes negative': { expr: 'x - 2', a: 0, xRange: [0, 5], yRange: [-2.5, 3.5], ayRange: [-2.5, 2.5], xStart: 0.3 } },
  component: FtcAccumulator,
});
