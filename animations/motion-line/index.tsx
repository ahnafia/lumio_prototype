import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce, useRaf } from '../_kit/controls';
import { deriv, fmt, integrate, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView, regionPath } from '../_kit/plot';

/**
 * A particle moving on a line with position s(t). Top: the line and the particle.
 * Bottom: velocity v(t) = s′(t) with the area up to t shaded (negative in a warning color).
 * Readouts compare displacement (net) with distance traveled (total).
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  tMax: z.number().positive(),
  sRange: range,
  vRange: range,
  unit: z.string(),
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

function MotionLine({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [tRaw, setT] = useState(reducedMotion ? p.tMax : 0);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const s = (t: number) => fns?.[0]?.(t) ?? NaN;
  const vel = (t: number) => deriv(s, t);
  const t = Math.min(p.tMax, Math.max(0, tRaw));
  const drawH = height - ROW_H;
  const lineH = Math.max(56, Math.round(drawH * 0.28));
  const line = makeView(p.sRange, [0, 1], { left: 16, top: 0, width: width - 32, height: lineH });
  const v = makeView([0, p.tMax], p.vRange, { left: 6, top: lineH + 4, width: width - 12, height: drawH - lineH - 10 });

  const move = (n: number) => {
    setT(n);
    setTouched(true);
    onInteract?.({ kind: 'slider', value: n, label: 't' });
    if (n >= p.tMax * 0.9) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched && t < p.tMax, (dt) => {
    setT((prev) => {
      const n = Math.min(p.tMax, prev + dt * (p.tMax / 7));
      if (n >= p.tMax * 0.9) complete();
      return n;
    });
  });

  const st = s(t);
  const s0 = s(0);
  const vt = vel(t);
  const dist = fns ? integrate((u) => Math.abs(vel(u)), 0, t, 300) : NaN;
  const ly = lineH * 0.55;
  const zero = () => 0;

  return (
    <Frame width={width} height={height} theme={theme} label={`Particle at s = ${fmt(st)} ${p.unit} at t = ${fmt(t)}; velocity ${fmt(vt)}; displacement ${fmt(st - s0)}; distance ${fmt(dist)}.`}>
      <svg width={width} height={drawH} viewBox={`0 0 ${width} ${drawH}`} style={{ display: 'block' }}>
        <line x1={line.left} x2={line.left + line.w} y1={ly} y2={ly} stroke={theme.colors.axis} strokeWidth={2} />
        {Array.from({ length: 11 }, (_, i) => p.sRange[0] + ((p.sRange[1] - p.sRange[0]) * i) / 10).map((m) => (
          <g key={m}>
            <line x1={line.sx(m)} x2={line.sx(m)} y1={ly - 5} y2={ly + 5} stroke={theme.colors.axis} />
            <text x={line.sx(m)} y={ly + 18} fontSize={10} fill={theme.colors.muted} textAnchor="middle">
              {fmt(m, Number.isInteger(m) ? 0 : 1)}
            </text>
          </g>
        ))}
        {fns && (
          <>
            <line x1={line.sx(s0)} x2={line.sx(s0)} y1={ly - 12} y2={ly + 4} stroke={theme.colors.muted} strokeWidth={2} />
            <line x1={line.sx(s0)} x2={line.sx(st)} y1={ly - 14} y2={ly - 14} stroke={theme.colors.secondary} strokeWidth={2} />
            <circle cx={line.sx(st)} cy={ly} r={9} fill={theme.colors.accent} stroke={theme.colors.ink} strokeWidth={1.5} />
          </>
        )}
        <Axes v={v} theme={theme} xLabel="t" yLabel="v(t)" />
        {fns && (
          <>
            <path d={regionPath((u) => Math.max(vel(u), 0), zero, v, 0, t)} fill={theme.colors.primary} opacity={0.3} />
            <path d={regionPath(zero, (u) => Math.min(vel(u), 0), v, 0, t)} fill={theme.colors.bad} opacity={0.3} />
            <path d={curvePath(vel, v)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            <circle cx={v.sx(t)} cy={v.sy(vt)} r={6} fill={theme.colors.accent} stroke={theme.colors.ink} />
          </>
        )}
        <Readout
          x={v.left + v.w - 4}
          y={v.top + 2}
          lines={[`t = ${fmt(t)}  v = ${fmt(vt)}`, `displacement = ${fmt(st - s0)}`, `distance = ${fmt(dist)}`]}
          theme={theme}
          align="right"
        />
      </svg>
      <Slider theme={theme} label="time" value={t} min={0} max={p.tMax} step={p.tMax / 200} onChange={move} display={`t = ${fmt(t)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'motion-line',
  title: 'Motion on a line',
  description: 'A particle moves along a line while its velocity graph fills in. Compare displacement with total distance traveled.',
  interactive: true,
  aspectRatio: 4 / 3,
  params,
  defaults: { expr: 'x^3 - 6x^2 + 9x', tMax: 4, sRange: [-1, 5], vRange: [-4, 10], unit: 'm', autoplay: true },
  presets: { 'Back and forth': { expr: '4 sin(x)', tMax: 6.28, sRange: [-5, 5], vRange: [-5, 5] } },
  component: MotionLine,
});
