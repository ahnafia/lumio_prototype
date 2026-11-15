import { useRef, useState, type KeyboardEvent } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useDrag, useOnce, useRaf } from '../_kit/controls';
import { clamp, deriv, fmt, useFns } from '../_kit/expr';
import { Axes, Readout, colorOf, curvePath, makeView, regionPath } from '../_kit/plot';

/**
 * The workhorse plot. Up to five curves (mathjs expressions in x and an optional slider
 * variable), points (filled or open), dashed asymptote lines and shading. Optionally:
 * a slider that changes a parameter, and a trace point the student drags along a curve
 * (with its tangent line and live readouts). onComplete fires once the student has
 * explored half of the slider's (or the trace's) range.
 */
const color = z.enum(['primary', 'secondary', 'accent', 'good', 'bad', 'muted', 'ink']);
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');

const params = z.object({
  functions: z
    .array(
      z
        .object({
          expr: z.string().min(1),
          domain: range.optional(),
          color: color.optional(),
          dashed: z.boolean().optional(),
          label: z.string().optional(),
        })
        .strict(),
    )
    .min(1)
    .max(5),
  xRange: range,
  yRange: range,
  piTicks: z.boolean(),
  xLabel: z.string(),
  yLabel: z.string(),
  points: z
    .array(
      z
        .object({
          x: z.number(),
          y: z.number(),
          style: z.enum(['filled', 'open']).optional(),
          label: z.string().optional(),
          color: color.optional(),
        })
        .strict(),
    )
    .max(12),
  vlines: z.array(z.object({ x: z.number(), label: z.string().optional() }).strict()).max(4),
  hlines: z.array(z.object({ y: z.number(), label: z.string().optional() }).strict()).max(4),
  /** Shade between two expressions from `from` to `to` (or to the trace point). */
  shade: z
    .object({
      upper: z.string().min(1),
      lower: z.string().min(1),
      from: z.number(),
      to: z.number(),
      toTrace: z.boolean().optional(),
      /** Color parts below `lower` as negative. */
      signed: z.boolean().optional(),
    })
    .strict()
    .nullable(),
  /** A parameter the expressions can use, e.g. name 'a' in "a*sin(x)". */
  slider: z
    .object({
      name: z.string().regex(/^[a-wyz]$/, 'one lowercase letter other than x'),
      label: z.string(),
      min: z.number(),
      max: z.number(),
      step: z.number().positive(),
      start: z.number(),
    })
    .strict()
    .nullable(),
  /** A draggable point on functions[fn]. */
  trace: z
    .object({
      fn: z.number().int().min(0).max(4),
      start: z.number(),
      tangent: z.boolean(),
      /** Hide the y readout (e.g. when y is the thing being asked). */
      hideY: z.boolean().optional(),
    })
    .strict()
    .nullable(),
  /** Extra readouts, evaluated at the trace x (and slider value). */
  readouts: z.array(z.object({ label: z.string(), expr: z.string().min(1), digits: z.number().int().min(0).max(5).optional() }).strict()).max(4),
  /** Sweep the slider (or trace point) until the student takes over. */
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

function FunctionPlot({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const s = p.slider;
  const t = p.trace;
  const [aRaw, setA] = useState(s ? s.start : 0);
  const [txRaw, setTx] = useState(t ? t.start : 0);
  const [touched, setTouched] = useState(false);
  const explored = useRef({ lo: Infinity, hi: -Infinity });
  const dir = useRef(1);
  const complete = useOnce(onComplete);

  const nF = p.functions.length;
  const fns = useFns([...p.functions.map((f) => f.expr), p.shade?.upper ?? '', p.shade?.lower ?? '', ...p.readouts.map((r) => r.expr)]);
  const a = s ? clamp(aRaw, s.min, s.max) : 0;
  const scope = s ? { [s.name]: a } : undefined;
  const fn = (i: number) => (x: number) => fns?.[i]?.(x, scope) ?? NaN;

  const tf = t ? p.functions[t.fn] : undefined;
  const [tLo, tHi] = tf?.domain ?? p.xRange;
  const traceLo = Math.max(tLo, p.xRange[0]);
  const traceHi = Math.min(tHi, p.xRange[1]);
  const tx = t ? clamp(txRaw, traceLo, traceHi) : 0;

  const plotH = height - (s ? ROW_H : 0);
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });

  const note = (val: number, lo: number, hi: number) => {
    const e = explored.current;
    e.lo = Math.min(e.lo, val);
    e.hi = Math.max(e.hi, val);
    if (e.hi - e.lo >= 0.5 * (hi - lo)) complete();
  };
  const moveSlider = (val: number) => {
    if (!s) return;
    setA(val);
    setTouched(true);
    onInteract?.({ kind: 'slider', value: val, label: s.name });
    note(val, s.min, s.max);
  };
  const moveTrace = (x: number, kind: 'drag' | 'step') => {
    if (!t) return;
    const c = clamp(x, traceLo, traceHi);
    setTx(c);
    setTouched(true);
    onInteract?.({ kind, value: c, label: 'x' });
    note(c, traceLo, traceHi);
  };

  useRaf(playing && !reducedMotion && p.autoplay && !touched && (s !== null || t !== null), (dt) => {
    const sweep = (prev: number, lo: number, hi: number) => {
      let n = prev + dir.current * dt * ((hi - lo) / 4);
      if (n >= hi) [n, dir.current] = [hi, -1];
      if (n <= lo) [n, dir.current] = [lo, 1];
      return n;
    };
    if (s) setA((prev) => sweep(prev, s.min, s.max));
    else if (t) setTx((prev) => sweep(prev, traceLo, traceHi));
  });

  const drag = useDrag((px) => moveTrace(v.gx(px), 'drag'));
  const onKey = (e: KeyboardEvent<SVGCircleElement>) => {
    const step = (p.xRange[1] - p.xRange[0]) / 100;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') moveTrace(tx - step, 'step');
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') moveTrace(tx + step, 'step');
  };

  // Shading
  let shade = null;
  if (p.shade && fns) {
    const up = fn(nF);
    const lo = fn(nF + 1);
    const from = p.shade.from;
    const to = p.shade.toTrace && t ? tx : p.shade.to;
    if (p.shade.signed) {
      shade = (
        <g>
          <path d={regionPath((x) => Math.max(up(x), lo(x)), lo, v, from, to)} fill={theme.colors.primary} opacity={0.25} />
          <path d={regionPath(lo, (x) => Math.min(up(x), lo(x)), v, from, to)} fill={theme.colors.bad} opacity={0.25} />
        </g>
      );
    } else {
      shade = <path d={regionPath(up, lo, v, from, to)} fill={theme.colors.accent} opacity={0.3} />;
    }
  }

  // Trace point and readouts
  const lines: string[] = [];
  let traceEl = null;
  if (t && fns) {
    const f = fn(t.fn);
    const y = f(tx);
    const m = deriv(f, tx);
    lines.push(`x = ${fmt(tx)}`);
    if (!t.hideY) lines.push(`y = ${fmt(y)}`);
    if (t.tangent) lines.push(`slope = ${fmt(m)}`);
    const half = (p.xRange[1] - p.xRange[0]) * 0.2;
    traceEl = (
      <g>
        {t.tangent && Number.isFinite(m) && Number.isFinite(y) && (
          <line x1={v.sx(tx - half)} y1={v.sy(y - m * half)} x2={v.sx(tx + half)} y2={v.sy(y + m * half)} stroke={theme.colors.secondary} strokeWidth={2.5} />
        )}
        {Number.isFinite(y) && (
          <circle
            cx={v.sx(tx)}
            cy={v.sy(y)}
            r={9}
            fill={theme.colors.accent}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
            tabIndex={0}
            role="slider"
            aria-label="Point on the curve"
            aria-valuemin={traceLo}
            aria-valuemax={traceHi}
            aria-valuenow={Number(tx.toFixed(2))}
            onKeyDown={onKey}
            style={{ cursor: 'grab' }}
          />
        )}
      </g>
    );
  }
  if (fns) {
    p.readouts.forEach((r, i) => {
      const val = fns[nF + 2 + i]?.(tx, scope) ?? NaN;
      lines.push(`${r.label} = ${fmt(val, r.digits ?? 2)}`);
    });
  }

  const label =
    `Graph of ${p.functions.map((f) => `y = ${f.expr}`).join(', ')}` +
    (s ? `, with ${s.name} = ${fmt(a)}` : '') +
    (t ? `, point at x = ${fmt(tx)}` : '');

  return (
    <Frame width={width} height={height} theme={theme} label={label}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ touchAction: 'none', display: 'block' }} {...(t ? drag : {})}>
        <Axes v={v} theme={theme} piTicks={p.piTicks} xLabel={p.xLabel} yLabel={p.yLabel} />
        {shade}
        {p.vlines.map((l) => (
          <g key={`v${l.x}`}>
            <line x1={v.sx(l.x)} x2={v.sx(l.x)} y1={v.top} y2={v.top + v.h} stroke={theme.colors.muted} strokeDasharray="6 5" strokeWidth={1.5} />
            {l.label && (
              <text x={v.sx(l.x) + 5} y={v.top + 14} fontSize={12} fill={theme.colors.muted}>
                {l.label}
              </text>
            )}
          </g>
        ))}
        {p.hlines.map((l) => (
          <g key={`h${l.y}`}>
            <line x1={v.left} x2={v.left + v.w} y1={v.sy(l.y)} y2={v.sy(l.y)} stroke={theme.colors.muted} strokeDasharray="6 5" strokeWidth={1.5} />
            {l.label && (
              <text x={v.left + 6} y={v.sy(l.y) - 6} fontSize={12} fill={theme.colors.muted}>
                {l.label}
              </text>
            )}
          </g>
        ))}
        {fns &&
          p.functions.map((f, i) => {
            const c = colorOf(theme, f.color ?? (['primary', 'secondary', 'accent', 'good', 'muted'] as const)[i] ?? 'primary');
            const g = fn(i);
            let lx = NaN;
            let ly = NaN;
            if (f.label) {
              const hi = Math.min(f.domain?.[1] ?? p.xRange[1], p.xRange[1]);
              const lo = Math.max(f.domain?.[0] ?? p.xRange[0], p.xRange[0]);
              for (let k = 0; k <= 60; k++) {
                const x = hi - ((hi - lo) * k) / 60 - (hi - lo) * 0.02;
                const y = g(x);
                if (Number.isFinite(y) && y > p.yRange[0] && y < p.yRange[1]) {
                  [lx, ly] = [x, y];
                  break;
                }
              }
            }
            return (
              <g key={i}>
                <path d={curvePath(g, v, f.domain?.[0], f.domain?.[1])} fill="none" stroke={c} strokeWidth={3} strokeDasharray={f.dashed ? '8 6' : undefined} strokeLinecap="round" />
                {f.label && Number.isFinite(lx) && (
                  <text x={Math.min(v.sx(lx), v.left + v.w - 4)} y={v.sy(ly) - 10} fontSize={13} fill={c} textAnchor="end" fontStyle="italic" fontWeight={600}>
                    {f.label}
                  </text>
                )}
              </g>
            );
          })}
        {p.points.map((pt, i) => {
          const c = colorOf(theme, pt.color ?? 'primary');
          return (
            <g key={`p${i}`}>
              <circle cx={v.sx(pt.x)} cy={v.sy(pt.y)} r={5.5} fill={pt.style === 'open' ? theme.colors.background : c} stroke={c} strokeWidth={2.5} />
              {pt.label && (
                <text x={v.sx(pt.x) + 8} y={v.sy(pt.y) - 8} fontSize={12} fill={theme.colors.ink}>
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}
        {traceEl}
        <Readout x={v.left + v.w - 4} y={v.top + 2} lines={lines} theme={theme} align="right" />
      </svg>
      {s && <Slider theme={theme} label={s.label} value={a} min={s.min} max={s.max} step={s.step} onChange={moveSlider} display={`${s.name} = ${fmt(a)}`} />}
    </Frame>
  );
}

export default defineAnimation({
  name: 'function-plot',
  title: 'Function plot',
  description: 'Curves, points, asymptotes and shading, with an optional parameter slider and a draggable point that shows its tangent line.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: {
    functions: [{ expr: 'x^2' }],
    xRange: [-3, 3],
    yRange: [-1, 9],
    piTicks: false,
    xLabel: 'x',
    yLabel: 'y',
    points: [],
    vlines: [],
    hlines: [],
    shade: null,
    slider: null,
    trace: null,
    readouts: [],
    autoplay: false,
  },
  presets: {
    'Shift slider': {
      functions: [{ expr: '(x - h)^2', label: 'y = (x − h)²' }, { expr: 'x^2', color: 'muted', dashed: true }],
      xRange: [-5, 5],
      yRange: [-1, 9],
      slider: { name: 'h', label: 'shift', min: -3, max: 3, step: 0.1, start: 0 },
      autoplay: true,
    },
    'Trace with tangent': { functions: [{ expr: 'x^3 - 3x' }], yRange: [-4, 4], trace: { fn: 0, start: -1.5, tangent: true }, autoplay: true },
    'Hole and asymptote': {
      functions: [{ expr: '(x^2 - 1)/(x - 1)', domain: [-3, 0.999] }, { expr: '(x^2 - 1)/(x - 1)', domain: [1.001, 3] }],
      yRange: [-2, 5],
      points: [{ x: 1, y: 2, style: 'open' }],
      vlines: [{ x: -2, label: 'x = −2' }],
    },
    'Shaded area': { functions: [{ expr: 'sin(x)' }], xRange: [0, 6.3], yRange: [-1.2, 1.2], piTicks: true, shade: { upper: 'sin(x)', lower: '0', from: 0, to: 6.283, signed: true } },
  },
  component: FunctionPlot,
});
