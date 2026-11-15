import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { fmt, integrate, useFns } from '../_kit/expr';
import { Readout, curvePath, makeView, regionPath } from '../_kit/plot';

/**
 * Volumes by slicing, drawn in simple perspective. Slide the highlighted slice along the solid.
 *   disk   — region under `outer` on [a, b] spun about the x-axis: slices are disks, area πR²
 *   washer — region between `outer` and `inner` spun about the x-axis: area π(R² − r²)
 *   shell  — region under `outer` on [a, b] (a ≥ 0) spun about the y-axis: shell area 2πx·h
 *   square — base between `outer` and `inner`; cross-sections ⟂ x-axis are squares: area s²
 */
const params = z.object({
  mode: z.enum(['disk', 'washer', 'shell', 'square']),
  outer: z.string().min(1),
  inner: z.string().min(1),
  a: z.number(),
  b: z.number(),
  yMax: z.number().positive(),
});
type Params = z.output<typeof params>;

function SolidRevolution({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [sRaw, setS] = useState(p.a + (p.b - p.a) * 0.3);
  const complete = useOnce(onComplete);
  const fns = useFns([p.outer, p.inner]);
  const R = (x: number) => fns?.[0]?.(x) ?? NaN;
  const r = (x: number) => fns?.[1]?.(x) ?? NaN;
  const xs = Math.min(p.b, Math.max(p.a, sRaw));
  const c = theme.colors;
  const drawH = height - ROW_H;
  const k = 0.28; // ellipse squash for perspective
  const pad = 14;

  const move = (n: number) => {
    setS(n);
    onInteract?.({ kind: 'slider', value: n, label: 'x' });
    if (Math.abs(n - (p.a + (p.b - p.a) * 0.3)) >= 0.4 * (p.b - p.a)) complete();
  };

  let body = null;
  let lines: string[] = [];
  if (fns && (p.mode === 'disk' || p.mode === 'washer')) {
    const span = p.b - p.a;
    const v = makeView([p.a - span * 0.15, p.b + span * 0.15], [-p.yMax, p.yMax], { left: pad, top: pad, width: width - 2 * pad, height: drawH - 2 * pad });
    const ryPx = (y: number) => Math.abs(v.sy(y) - v.sy(0));
    const neg = (fn: (x: number) => number) => (x: number) => -fn(x);
    const ticks = Array.from({ length: 9 }, (_, i) => p.a + (span * i) / 8);
    const washer = p.mode === 'washer';
    const Rs = R(xs);
    const rs = washer ? r(xs) : 0;
    const dxPx = Math.max(6, v.w / 40);
    const area = Math.PI * (Rs * Rs - rs * rs);
    const vol = integrate((t) => Math.PI * (R(t) ** 2 - (washer ? r(t) ** 2 : 0)), p.a, p.b, 400);
    lines = [`x = ${fmt(xs)}`, washer ? `R = ${fmt(Rs)}, r = ${fmt(rs)}` : `R = ${fmt(Rs)}`, `slice area = ${fmt(area)}`, `volume = ${fmt(vol)}`];
    body = (
      <g>
        <line x1={v.left} x2={v.left + v.w} y1={v.sy(0)} y2={v.sy(0)} stroke={c.axis} strokeWidth={1.5} strokeDasharray="6 4" />
        <path d={regionPath(R, washer ? r : () => 0, v, p.a, p.b)} fill={c.primary} opacity={0.12} />
        <path d={regionPath(washer ? neg(r) : () => 0, neg(R), v, p.a, p.b)} fill={c.primary} opacity={0.12} />
        {ticks.map((t) => (
          <g key={t}>
            <ellipse cx={v.sx(t)} cy={v.sy(0)} rx={ryPx(R(t)) * k} ry={ryPx(R(t))} fill="none" stroke={c.primary} strokeWidth={1} opacity={0.5} />
            {washer && <ellipse cx={v.sx(t)} cy={v.sy(0)} rx={ryPx(r(t)) * k} ry={ryPx(r(t))} fill="none" stroke={c.secondary} strokeWidth={1} opacity={0.5} />}
          </g>
        ))}
        <path d={curvePath(R, v, p.a, p.b)} fill="none" stroke={c.primary} strokeWidth={3} />
        <path d={curvePath(neg(R), v, p.a, p.b)} fill="none" stroke={c.primary} strokeWidth={2} opacity={0.6} />
        {washer && <path d={curvePath(r, v, p.a, p.b)} fill="none" stroke={c.secondary} strokeWidth={3} />}
        {washer && <path d={curvePath(neg(r), v, p.a, p.b)} fill="none" stroke={c.secondary} strokeWidth={2} opacity={0.6} />}
        <ellipse cx={v.sx(xs) + dxPx} cy={v.sy(0)} rx={ryPx(Rs) * k} ry={ryPx(Rs)} fill={c.accent} opacity={0.5} stroke={c.ink} />
        <rect x={v.sx(xs)} width={dxPx} y={v.sy(Rs)} height={2 * ryPx(Rs)} fill={c.accent} opacity={0.5} />
        <ellipse cx={v.sx(xs)} cy={v.sy(0)} rx={ryPx(Rs) * k} ry={ryPx(Rs)} fill={c.accent} stroke={c.ink} strokeWidth={1.5} />
        {washer && <ellipse cx={v.sx(xs)} cy={v.sy(0)} rx={ryPx(rs) * k} ry={ryPx(rs)} fill={c.background} stroke={c.ink} strokeWidth={1.5} />}
      </g>
    );
  } else if (fns && p.mode === 'shell') {
    const v = makeView([-p.b * 1.15, p.b * 1.15], [-p.yMax * 0.15, p.yMax], { left: pad, top: pad + 8, width: width - 2 * pad, height: drawH - 2 * pad - 16 });
    const h = R(xs);
    const rx = Math.abs(v.sx(xs) - v.sx(0));
    const ry = rx * k;
    const mirror = (x: number) => R(-x);
    const vol = integrate((t) => 2 * Math.PI * t * R(t), p.a, p.b, 400);
    lines = [`radius x = ${fmt(xs)}`, `height = ${fmt(h)}`, `2πx·h = ${fmt(2 * Math.PI * xs * h)}`, `volume = ${fmt(vol)}`];
    body = (
      <g>
        <line x1={v.sx(0)} x2={v.sx(0)} y1={v.top} y2={v.top + v.h} stroke={c.axis} strokeWidth={1.5} strokeDasharray="6 4" />
        <line x1={v.left} x2={v.left + v.w} y1={v.sy(0)} y2={v.sy(0)} stroke={c.axis} strokeWidth={1.5} />
        <path d={regionPath(R, () => 0, v, p.a, p.b)} fill={c.primary} opacity={0.18} />
        <path d={regionPath(mirror, () => 0, v, -p.b, -p.a)} fill={c.primary} opacity={0.08} />
        <path d={curvePath(R, v, p.a, p.b)} fill="none" stroke={c.primary} strokeWidth={3} />
        <path d={curvePath(mirror, v, -p.b, -p.a)} fill="none" stroke={c.primary} strokeWidth={2} opacity={0.5} />
        <ellipse cx={v.sx(0)} cy={v.sy(0)} rx={rx} ry={ry} fill="none" stroke={c.accent} strokeWidth={2} />
        <rect x={v.sx(-xs)} y={v.sy(h)} width={2 * rx} height={Math.max(0, v.sy(0) - v.sy(h))} fill={c.accent} opacity={0.25} />
        <line x1={v.sx(-xs)} x2={v.sx(-xs)} y1={v.sy(0)} y2={v.sy(h)} stroke={c.accent} strokeWidth={2.5} />
        <line x1={v.sx(xs)} x2={v.sx(xs)} y1={v.sy(0)} y2={v.sy(h)} stroke={c.accent} strokeWidth={2.5} />
        <ellipse cx={v.sx(0)} cy={v.sy(h)} rx={rx} ry={ry} fill={c.accent} opacity={0.45} stroke={c.ink} strokeWidth={1.5} />
        <line x1={v.sx(0)} x2={v.sx(xs)} y1={v.sy(0)} y2={v.sy(0)} stroke={c.ink} strokeWidth={2} />
        <text x={v.sx(xs / 2)} y={v.sy(0) + 15} fontSize={12} fill={c.ink} textAnchor="middle">x</text>
      </g>
    );
  } else if (fns) {
    // square cross-sections: base drawn flat, one square standing on the slice line
    const span = p.b - p.a;
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i <= 40; i++) {
      const t = p.a + (span * i) / 40;
      lo = Math.min(lo, r(t));
      hi = Math.max(hi, R(t));
    }
    const v = makeView([p.a - span * 0.1, p.b + span * 0.6], [lo - (hi - lo) * 0.1, hi + (hi - lo) * 0.9], { left: pad, top: pad, width: width - 2 * pad, height: drawH - 2 * pad });
    const side = R(xs) - r(xs);
    const sidePx = Math.abs(v.sy(R(xs)) - v.sy(r(xs)));
    const ox = sidePx * 0.55;
    const oy = -sidePx * 0.75;
    const x0 = v.sx(xs);
    const yb = v.sy(r(xs));
    const yt = v.sy(R(xs));
    const vol = integrate((t) => (R(t) - r(t)) ** 2, p.a, p.b, 400);
    lines = [`x = ${fmt(xs)}`, `side s = ${fmt(side)}`, `slice area s² = ${fmt(side * side)}`, `volume = ${fmt(vol)}`];
    body = (
      <g>
        <path d={regionPath(R, r, v, p.a, p.b)} fill={c.primary} opacity={0.2} stroke={c.primary} strokeWidth={2} />
        <path d={`M${x0},${yb} L${x0},${yt} L${x0 + ox},${yt + oy} L${x0 + ox},${yb + oy} Z`} fill={c.accent} opacity={0.55} stroke={c.ink} strokeWidth={1.5} />
        <line x1={x0} x2={x0} y1={yb} y2={yt} stroke={c.ink} strokeWidth={3} />
      </g>
    );
  }

  return (
    <Frame width={width} height={height} theme={theme} label={`Solid by ${p.mode} slices; slice at x = ${fmt(xs)}. ${lines.join(', ')}.`}>
      <svg width={width} height={drawH} viewBox={`0 0 ${width} ${drawH}`} style={{ display: 'block' }}>
        {body}
        <Readout x={width - 6} y={6} lines={lines} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="slice" value={xs} min={p.a} max={p.b} step={(p.b - p.a) / 200} onChange={move} display={`x = ${fmt(xs)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'solid-revolution',
  title: 'Volumes by slicing',
  description: 'Slide one slice through a solid: disks, washers, cylindrical shells or square cross-sections, with the slice area and total volume.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { mode: 'disk', outer: 'sqrt(x)', inner: '0', a: 0, b: 4, yMax: 2.6 },
  presets: {
    Washer: { mode: 'washer', outer: 'x', inner: 'x^2', a: 0, b: 1, yMax: 1.3 },
    Shell: { mode: 'shell', outer: '2x - x^2', a: 0, b: 2, yMax: 1.3 },
    'Square slices': { mode: 'square', outer: '1 - x^2', inner: 'x^2 - 1', a: -1, b: 1, yMax: 1 },
  },
  component: SolidRevolution,
});
