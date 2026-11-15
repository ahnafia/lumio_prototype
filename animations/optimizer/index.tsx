import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { fmt } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Optimization you can feel. Left: the object. Right: the quantity being maximized as a
 * function of x, with the current choice marked.
 *   box   — cut squares of side x from a size × size sheet and fold: V = x(size − 2x)²
 *   fence — fence three sides of a field along a river with `size` of fencing: A = x(size − 2x)
 */
const params = z.object({
  scenario: z.enum(['box', 'fence']),
  size: z.number().positive(),
  xStart: z.number().positive(),
  unit: z.string(),
});
type Params = z.output<typeof params>;

function Optimizer({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const xMax = p.size / 2;
  const [xRaw, setX] = useState(p.xStart);
  const complete = useOnce(onComplete);
  const x = Math.min(xMax * 0.99, Math.max(xMax * 0.01, xRaw));
  const box = p.scenario === 'box';
  const Q = (t: number) => (box ? t * (p.size - 2 * t) ** 2 : t * (p.size - 2 * t));
  const best = box ? p.size / 6 : p.size / 4;
  const qMax = Q(best);
  const c = theme.colors;
  const drawH = height - ROW_H;
  const half = Math.floor(width / 2);
  const v = makeView([0, xMax], [0, qMax * 1.15], { left: half + 8, top: 10, width: width - half - 16, height: drawH - 24 });
  const atBest = Math.abs(x - best) <= xMax * 0.02;

  const move = (n: number) => {
    setX(n);
    onInteract?.({ kind: 'slider', value: n, label: 'x' });
    if (Math.abs(n - best) <= xMax * 0.03) complete();
  };

  let picture;
  const S = Math.min(half - 24, drawH - 30);
  const ox = (half - S) / 2;
  const oy = (drawH - S) / 2;
  if (box) {
    const k = S / p.size;
    const cut = x * k;
    picture = (
      <g>
        <rect x={ox} y={oy} width={S} height={S} fill={c.surface} stroke={c.ink} strokeWidth={2} />
        {[
          [ox, oy],
          [ox + S - cut, oy],
          [ox, oy + S - cut],
          [ox + S - cut, oy + S - cut],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx} y={cy} width={cut} height={cut} fill={c.bad} opacity={0.35} stroke={c.bad} />
        ))}
        <rect x={ox + cut} y={oy + cut} width={Math.max(0, S - 2 * cut)} height={Math.max(0, S - 2 * cut)} fill={c.primary} opacity={0.18} stroke={c.primary} strokeDasharray="5 4" />
        <text x={ox + cut / 2} y={oy + cut + 14} fontSize={12} fill={c.bad} textAnchor="middle">x</text>
        <text x={ox + S / 2} y={oy + S + 16} fontSize={12} fill={c.muted} textAnchor="middle">{fmt(p.size, 0)} {p.unit}</text>
      </g>
    );
  } else {
    const k = S / p.size;
    const w = x * k;
    const len = (p.size - 2 * x) * k;
    picture = (
      <g>
        <rect x={0} y={oy - 8} width={half} height={10} fill={c.primary} opacity={0.35} />
        <text x={half / 2} y={oy - 12} fontSize={12} fill={c.primary} textAnchor="middle">river</text>
        <rect x={(half - len) / 2} y={oy + 2} width={len} height={w} fill={c.good} opacity={0.18} stroke="none" />
        <path d={`M${(half - len) / 2},${oy + 2} v${w} h${len} v${-w}`} fill="none" stroke={c.ink} strokeWidth={3} />
        <text x={(half - len) / 2 - 5} y={oy + 2 + w / 2} fontSize={12} fill={c.ink} textAnchor="end">x</text>
        <text x={half / 2} y={oy + w + 18} fontSize={12} fill={c.ink} textAnchor="middle">{fmt(p.size - 2 * x, 1)}</text>
      </g>
    );
  }

  const name = box ? 'V' : 'A';
  return (
    <Frame width={width} height={height} theme={theme} label={`${box ? 'Open box' : 'Fenced field'} with x = ${fmt(x)}; ${name} = ${fmt(Q(x), 1)}.`}>
      <svg width={width} height={drawH} viewBox={`0 0 ${width} ${drawH}`} style={{ display: 'block' }}>
        {picture}
        <Axes v={v} theme={theme} labels={false} xLabel="x" yLabel={name} />
        <path d={curvePath(Q, v, 0, xMax)} fill="none" stroke={c.primary} strokeWidth={2.5} />
        <line x1={v.sx(x)} x2={v.sx(x)} y1={v.sy(0)} y2={v.sy(Q(x))} stroke={c.muted} strokeDasharray="4 4" />
        <circle cx={v.sx(x)} cy={v.sy(Q(x))} r={7} fill={atBest ? c.good : c.accent} stroke={c.ink} />
        <Readout x={width - 6} y={6} lines={[`x = ${fmt(x)} ${p.unit}`, `${name} = ${fmt(Q(x), 1)}${atBest ? '  max!' : ''}`]} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="x" value={x} min={xMax * 0.01} max={xMax * 0.99} step={xMax / 200} onChange={move} display={`x = ${fmt(x)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'optimizer',
  title: 'Optimizer',
  description: 'Fold a box from a square sheet, or fence a field along a river, and slide x to find the biggest result.',
  interactive: true,
  aspectRatio: 16 / 9,
  params,
  defaults: { scenario: 'box', size: 12, xStart: 0.6, unit: 'in' },
  presets: { Fence: { scenario: 'fence', size: 100, xStart: 6, unit: 'm' } },
  component: Optimizer,
});
