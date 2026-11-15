import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Buttons, Frame, ROW_H, Slider, useOnce } from '../_kit/controls';
import { fmt, integrate, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * Left, right and midpoint Riemann sums with n rectangles. Rectangles below the axis
 * count as negative. The readout compares the sum with the exact integral.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  b: z.number(),
  n: z.number().int().min(1),
  nMax: z.number().int().min(2).max(200),
  method: z.enum(['left', 'right', 'midpoint']),
  allowMethod: z.boolean(),
  showExact: z.boolean(),
  xRange: range,
  yRange: range,
  piTicks: z.boolean(),
});
type Params = z.output<typeof params>;

function RiemannSum({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [nRaw, setN] = useState(p.n);
  const [method, setMethod] = useState(p.method);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const n = Math.max(1, Math.min(p.nMax, Math.round(nRaw)));
  const plotH = height - ROW_H * (p.allowMethod ? 2 : 1);
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });
  const dx = (p.b - p.a) / n;
  const sample = (i: number) => p.a + dx * (method === 'left' ? i : method === 'right' ? i + 1 : i + 0.5);

  let sum = 0;
  const rects = [];
  if (fns) {
    for (let i = 0; i < n; i++) {
      const xi = sample(i);
      const h = f(xi);
      if (!Number.isFinite(h)) continue;
      sum += h * dx;
      const x0 = v.sx(p.a + i * dx);
      const x1 = v.sx(p.a + (i + 1) * dx);
      const y0 = v.sy(0);
      const y1 = v.sy(h);
      const col = h >= 0 ? theme.colors.primary : theme.colors.bad;
      rects.push(
        <g key={i}>
          <rect x={x0} width={Math.max(0.5, x1 - x0)} y={Math.min(y0, y1)} height={Math.abs(y1 - y0)} fill={col} opacity={0.25} stroke={col} strokeWidth={n > 60 ? 0.3 : 1} />
          {n <= 24 && <circle cx={v.sx(xi)} cy={y1} r={3} fill={theme.colors.accent} />}
        </g>,
      );
    }
  }
  const exact = fns ? integrate(f, p.a, p.b, 600) : NaN;

  const moveN = (val: number) => {
    setN(val);
    onInteract?.({ kind: 'slider', value: val, label: 'n' });
    if (val >= Math.min(p.nMax, 20)) complete();
  };
  const pick = (m: Params['method']) => {
    setMethod(m);
    onInteract?.({ kind: 'toggle', value: m, label: 'method' });
  };
  const lines = [`n = ${n}   Δx = ${fmt(dx, 3)}`, `${method} sum = ${fmt(sum, 4)}`];
  if (p.showExact) lines.push(`exact = ${fmt(exact, 4)}`);

  return (
    <Frame width={width} height={height} theme={theme} label={`${method} Riemann sum of y = ${p.expr} on [${p.a}, ${p.b}] with ${n} rectangles: ${fmt(sum, 4)}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} piTicks={p.piTicks} />
        {rects}
        {fns && <path d={curvePath(f, v)} fill="none" stroke={theme.colors.ink} strokeWidth={2.5} />}
        <Readout x={v.left + v.w - 4} y={v.top + 2} lines={lines} theme={theme} align="right" />
      </svg>
      <Slider theme={theme} label="n" value={n} min={1} max={p.nMax} step={1} onChange={moveN} display={`n = ${n}`} />
      {p.allowMethod && (
        <Buttons
          theme={theme}
          items={(['left', 'right', 'midpoint'] as const).map((m) => ({ label: m === 'midpoint' ? 'Midpoint' : m === 'left' ? 'Left' : 'Right', onClick: () => pick(m), active: m === method }))}
        />
      )}
    </Frame>
  );
}

export default defineAnimation({
  name: 'riemann-sum',
  title: 'Riemann sums',
  description: 'Approximate the area under a curve with n rectangles: left, right or midpoint. Slide n up and watch the sum approach the integral.',
  interactive: true,
  aspectRatio: 4 / 3,
  params,
  defaults: { expr: 'x^2', a: 0, b: 2, n: 4, nMax: 100, method: 'left', allowMethod: true, showExact: true, xRange: [-0.2, 2.3], yRange: [-0.5, 4.5], piTicks: false },
  presets: {
    'Signed area: sin x': { expr: 'sin(x)', a: 0, b: 6.2832, n: 8, method: 'midpoint', xRange: [-0.3, 6.6], yRange: [-1.3, 1.3], piTicks: true },
    'Right sum, no exact': { method: 'right', allowMethod: false, showExact: false, n: 4, nMax: 8 },
  },
  component: RiemannSum,
});
