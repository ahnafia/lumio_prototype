import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce, useRaf } from '../_kit/controls';
import { fmt } from '../_kit/expr';
import { Readout } from '../_kit/plot';

/**
 * The chain rule as gears: x drives u at du/dx turns per turn, and u drives y at dy/du.
 * So y turns (dy/du)(du/dx) times as fast as x.
 */
const params = z.object({
  dudx: z.number().positive().max(6),
  dydu: z.number().positive().max(6),
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

function gearPath(cx: number, cy: number, r: number, teeth: number): string {
  const pts: string[] = [];
  const n = teeth * 4;
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    const rr = i % 4 < 2 ? r : r * 0.84;
    pts.push(`${i === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `${pts.join('')}Z`;
}

function ChainGears({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [turns, setTurns] = useState(0);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const drawH = height - ROW_H;
  const u = turns * p.dudx;
  const y = u * p.dydu;

  const move = (n: number) => {
    setTurns(n);
    setTouched(true);
    onInteract?.({ kind: 'slider', value: n, label: 'x turns' });
    if (n >= 1) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched, (dt) => setTurns((prev) => (prev + dt * 0.15) % 2));

  // Bigger gear = slower. Radii are inversely proportional to speed (relative to x).
  const speeds = [1, p.dudx, p.dudx * p.dydu];
  const base = Math.min(drawH * 0.34, width / 7.5);
  const radii = speeds.map((s) => Math.max(base * 0.45, Math.min(base * 1.25, base / Math.sqrt(s))));
  const names = ['x', 'u', 'y'];
  const angles = [turns, u, y];
  const cols = [theme.colors.primary, theme.colors.secondary, theme.colors.accent];
  const cy = drawH * 0.58;
  const gap = width / 3;

  return (
    <Frame width={width} height={height} theme={theme} label={`Gears: x turned ${fmt(turns)} times, u ${fmt(u)} times, y ${fmt(y)} times.`}>
      <svg width={width} height={drawH} viewBox={`0 0 ${width} ${drawH}`} style={{ display: 'block' }}>
        {radii.map((r, i) => {
          const cx = gap * (i + 0.5);
          const ang = (angles[i] ?? 0) * 360 * (i % 2 ? -1 : 1);
          const col = cols[i] ?? theme.colors.primary;
          return (
            <g key={i}>
              <g transform={`rotate(${ang.toFixed(1)} ${cx} ${cy})`}>
                <path d={gearPath(cx, cy, r, Math.max(8, Math.round(r / 5)))} fill={col} opacity={0.3} stroke={col} strokeWidth={2} />
                <line x1={cx} y1={cy} x2={cx + r * 0.75} y2={cy} stroke={theme.colors.ink} strokeWidth={3} strokeLinecap="round" />
              </g>
              <circle cx={cx} cy={cy} r={5} fill={theme.colors.ink} />
              <text x={cx} y={cy + r + 18} fontSize={14} fill={theme.colors.ink} textAnchor="middle" fontWeight={600}>
                {names[i]}: {fmt(angles[i] ?? 0)} turns
              </text>
            </g>
          );
        })}
        <Readout x={6} y={6} lines={[`du/dx = ${fmt(p.dudx, 1)}   dy/du = ${fmt(p.dydu, 1)}`, `dy/dx = ${fmt(p.dydu, 1)} × ${fmt(p.dudx, 1)} = ${fmt(p.dudx * p.dydu, 1)}`]} theme={theme} />
      </svg>
      <Slider theme={theme} label="turn x" value={turns} min={0} max={2} step={0.01} onChange={move} display={`${fmt(turns)} turns`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'chain-gears',
  title: 'Chain rule gears',
  description: 'Turn gear x: gear u turns du/dx times as fast, and gear y turns dy/du times as fast as u.',
  interactive: true,
  aspectRatio: 16 / 9,
  params,
  defaults: { dudx: 2, dydu: 3, autoplay: true },
  presets: { 'Slower middle': { dudx: 0.5, dydu: 4 } },
  component: ChainGears,
});
