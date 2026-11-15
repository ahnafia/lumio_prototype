import { useState, type ReactNode } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce, useRaf } from '../_kit/controls';
import { fmt } from '../_kit/expr';
import { Readout } from '../_kit/plot';

/**
 * Four classic related-rates set-ups, each with a time slider and live values and rates:
 *   ladder  — a ladder of length `a` slides; bottom moves out at `rate`, starting `start` from the wall
 *   balloon — air pumped in at `rate` (volume/time), starting volume `start`
 *   cone    — water poured at `rate` into an inverted cone of top radius `a`, height `b`
 *   plane   — a plane at altitude `a` flies at speed `rate`, starting `start` past the observer
 */
const params = z.object({
  scenario: z.enum(['ladder', 'balloon', 'cone', 'plane']),
  a: z.number().positive(),
  b: z.number().positive(),
  rate: z.number().positive(),
  start: z.number().min(0),
  tMax: z.number().positive(),
  lengthUnit: z.string(),
  timeUnit: z.string(),
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

interface State {
  lines: string[];
  draw: (w: number, h: number) => ReactNode;
}

function RelatedRates({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [tRaw, setT] = useState(0);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const t = Math.min(p.tMax, Math.max(0, tRaw));
  const L = p.lengthUnit;
  const T = p.timeUnit;
  const c = theme.colors;
  const drawH = height - ROW_H;

  const move = (val: number) => {
    setT(val);
    setTouched(true);
    onInteract?.({ kind: 'slider', value: val, label: 't' });
    if (val >= p.tMax * 0.6) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched && t < p.tMax, (dt) => {
    setT((prev) => {
      const n = Math.min(p.tMax, prev + dt * (p.tMax / 6));
      if (n >= p.tMax * 0.6) complete();
      return n;
    });
  });

  let state: State;
  if (p.scenario === 'ladder') {
    const x = Math.min(p.a * 0.98, p.start + p.rate * t);
    const y = Math.sqrt(p.a * p.a - x * x);
    const dydt = (-x * p.rate) / y;
    state = {
      lines: [`x = ${fmt(x)} ${L}`, `y = ${fmt(y)} ${L}`, `dx/dt = ${fmt(p.rate)} ${L}/${T}`, `dy/dt = ${fmt(dydt)} ${L}/${T}`],
      draw: (w, h) => {
        const s = Math.min((w * 0.55) / p.a, (h - 30) / p.a);
        const ox = 40;
        const oy = h - 18;
        return (
          <g>
            <line x1={ox} y1={oy} x2={w - 10} y2={oy} stroke={c.ink} strokeWidth={2} />
            <line x1={ox} y1={oy} x2={ox} y2={10} stroke={c.ink} strokeWidth={4} />
            <line x1={ox + x * s} y1={oy} x2={ox} y2={oy - y * s} stroke={c.accent} strokeWidth={6} strokeLinecap="round" />
            <text x={ox + (x * s) / 2} y={oy + 15} fontSize={13} fill={c.primary} textAnchor="middle">x</text>
            <text x={ox - 14} y={oy - (y * s) / 2} fontSize={13} fill={c.secondary}>y</text>
            <text x={ox + (x * s) / 2 + 8} y={oy - (y * s) / 2 - 6} fontSize={13} fill={c.muted}>{fmt(p.a, 0)}</text>
          </g>
        );
      },
    };
  } else if (p.scenario === 'balloon') {
    const V = p.start + p.rate * t;
    const r = Math.cbrt((3 * V) / (4 * Math.PI));
    const drdt = p.rate / (4 * Math.PI * r * r);
    const rMax = Math.cbrt((3 * (p.start + p.rate * p.tMax)) / (4 * Math.PI));
    state = {
      lines: [`V = ${fmt(V, 1)} ${L}³`, `r = ${fmt(r)} ${L}`, `dV/dt = ${fmt(p.rate, 1)} ${L}³/${T}`, `dr/dt = ${fmt(drdt, 3)} ${L}/${T}`],
      draw: (w, h) => {
        const s = (Math.min(w * 0.5, h) * 0.42) / rMax;
        const cx = w * 0.3;
        const cy = h / 2;
        return (
          <g>
            <circle cx={cx} cy={cy} r={r * s} fill={c.secondary} opacity={0.35} stroke={c.secondary} strokeWidth={2.5} />
            <line x1={cx} y1={cy} x2={cx + r * s} y2={cy} stroke={c.ink} strokeWidth={2} />
            <text x={cx + (r * s) / 2} y={cy - 6} fontSize={13} fill={c.ink} textAnchor="middle">r</text>
          </g>
        );
      },
    };
  } else if (p.scenario === 'cone') {
    const full = (Math.PI / 3) * p.a * p.a * p.b;
    const V = Math.min(full * 0.98, p.start + p.rate * t);
    const hh = Math.cbrt((3 * V * p.b * p.b) / (Math.PI * p.a * p.a));
    const rr = (p.a * hh) / p.b;
    const dhdt = p.rate / (Math.PI * rr * rr);
    state = {
      lines: [`V = ${fmt(V)} ${L}³`, `h = ${fmt(hh)} ${L}`, `dV/dt = ${fmt(p.rate)} ${L}³/${T}`, `dh/dt = ${fmt(dhdt, 3)} ${L}/${T}`],
      draw: (w, h) => {
        const s = Math.min((w * 0.5) / (2 * p.a), (h - 24) / p.b);
        const cx = w * 0.3;
        const tipY = h - 12;
        const topY = tipY - p.b * s;
        return (
          <g>
            <path d={`M${cx - rr * s},${tipY - hh * s} L${cx},${tipY} L${cx + rr * s},${tipY - hh * s} Z`} fill={c.primary} opacity={0.4} />
            <path d={`M${cx - p.a * s},${topY} L${cx},${tipY} L${cx + p.a * s},${topY}`} fill="none" stroke={c.ink} strokeWidth={2.5} />
            <line x1={cx + rr * s + 8} x2={cx + rr * s + 8} y1={tipY} y2={tipY - hh * s} stroke={c.secondary} strokeWidth={2} />
            <text x={cx + rr * s + 14} y={tipY - (hh * s) / 2} fontSize={13} fill={c.secondary}>h</text>
            <text x={cx} y={topY - 4} fontSize={12} fill={c.muted} textAnchor="middle">radius {fmt(p.a, 0)}, height {fmt(p.b, 0)}</text>
          </g>
        );
      },
    };
  } else {
    const x = p.start + p.rate * t;
    const s = Math.sqrt(x * x + p.a * p.a);
    const dsdt = (x * p.rate) / s;
    const xMax = p.start + p.rate * p.tMax;
    state = {
      lines: [`x = ${fmt(x)} ${L}`, `s = ${fmt(s)} ${L}`, `dx/dt = ${fmt(p.rate, 0)} ${L}/${T}`, `ds/dt = ${fmt(dsdt, 1)} ${L}/${T}`],
      draw: (w, h) => {
        const k = Math.min((w * 0.55) / Math.max(xMax, 1), (h - 40) / p.a);
        const ox = 30;
        const oy = h - 16;
        const px = ox + x * k;
        const py = oy - p.a * k;
        return (
          <g>
            <line x1={10} y1={oy} x2={w - 10} y2={oy} stroke={c.ink} strokeWidth={2} />
            <circle cx={ox} cy={oy - 6} r={6} fill={c.ink} />
            <line x1={ox} y1={oy} x2={px} y2={oy} stroke={c.primary} strokeWidth={2} strokeDasharray="5 4" />
            <line x1={px} y1={oy} x2={px} y2={py} stroke={c.muted} strokeWidth={1.5} strokeDasharray="5 4" />
            <line x1={ox} y1={oy - 6} x2={px} y2={py} stroke={c.secondary} strokeWidth={2.5} />
            <path d={`M${px - 16},${py} L${px + 14},${py} L${px + 18},${py - 5} M${px - 4},${py} L${px - 10},${py - 9}`} stroke={c.accent} strokeWidth={4} fill="none" strokeLinecap="round" />
            <text x={(ox + px) / 2} y={oy + 13} fontSize={13} fill={c.primary} textAnchor="middle">x</text>
            <text x={(ox + px) / 2 - 8} y={(oy + py) / 2 - 6} fontSize={13} fill={c.secondary}>s</text>
            <text x={px + 6} y={(oy + py) / 2} fontSize={12} fill={c.muted}>{fmt(p.a, 0)}</text>
          </g>
        );
      },
    };
  }

  return (
    <Frame width={width} height={height} theme={theme} label={`Related rates: ${p.scenario}. ${state.lines.join(', ')}.`}>
      <svg width={width} height={drawH} viewBox={`0 0 ${width} ${drawH}`} style={{ display: 'block' }}>
        {state.draw(width, drawH)}
        <Readout x={width - 6} y={6} lines={[`t = ${fmt(t)} ${T}`, ...state.lines]} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="time" value={t} min={0} max={p.tMax} step={p.tMax / 200} onChange={move} display={`t = ${fmt(t)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'related-rates',
  title: 'Related rates',
  description: 'A ladder, a balloon, a cone and an airplane: scrub time and watch one rate drive another.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { scenario: 'ladder', a: 10, b: 1, rate: 1, start: 6, tMax: 3.5, lengthUnit: 'ft', timeUnit: 's', autoplay: true },
  presets: {
    Balloon: { scenario: 'balloon', rate: 100, start: 50, tMax: 10, lengthUnit: 'cm', timeUnit: 's' },
    'Cone tank': { scenario: 'cone', a: 2, b: 4, rate: 2, start: 0.05, tMax: 7, lengthUnit: 'm', timeUnit: 'min' },
    Airplane: { scenario: 'plane', a: 3, rate: 500, start: 0, tMax: 0.016, lengthUnit: 'mi', timeUnit: 'h' },
  },
  component: RelatedRates,
});
