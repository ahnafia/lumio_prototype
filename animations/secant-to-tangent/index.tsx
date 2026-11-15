import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, ROW_H, Slider, useOnce, useRaf } from '../_kit/controls';
import { deriv, fmt, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/**
 * The secant line through (a, f(a)) and (a + h, f(a + h)) turns into the tangent line as
 * h → 0. The rise/run triangle and the difference quotient update live.
 */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  a: z.number(),
  hMax: z.number().positive(),
  hStart: z.number(),
  xRange: range,
  yRange: range,
  autoplay: z.boolean(),
  /** Labels for the readout, e.g. "avg velocity". */
  slopeLabel: z.string(),
});
type Params = z.output<typeof params>;

function SecantToTangent({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [hRaw, setH] = useState(p.hStart);
  const [touched, setTouched] = useState(false);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const h = Math.max(-p.hMax, Math.min(p.hMax, hRaw));
  const plotH = height - ROW_H;
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });

  const move = (val: number) => {
    setH(val);
    setTouched(true);
    onInteract?.({ kind: 'slider', value: val, label: 'h' });
    if (Math.abs(val) <= 0.05) complete();
  };
  useRaf(playing && !reducedMotion && p.autoplay && !touched && Math.abs(h) > 0.02, (dt) => {
    setH((prev) => {
      const next = prev * Math.exp(-dt * 0.9);
      if (Math.abs(next) <= 0.05) complete();
      return Math.abs(next) < 0.02 ? Math.sign(prev) * 0.02 : next;
    });
  });

  const fa = f(p.a);
  const zero = Math.abs(h) < 1e-9;
  const fb = f(p.a + h);
  const m = zero ? deriv(f, p.a) : (fb - fa) / h;
  const mt = deriv(f, p.a);
  const lineAt = (slope: number) => {
    const [x0, x1] = p.xRange;
    return { x1: v.sx(x0), y1: v.sy(fa + slope * (x0 - p.a)), x2: v.sx(x1), y2: v.sy(fa + slope * (x1 - p.a)) };
  };
  const near = Math.abs(h) <= 0.05;

  return (
    <Frame width={width} height={height} theme={theme} label={`Secant line on y = ${p.expr} from x = ${p.a} with h = ${fmt(h)}; slope ${fmt(m)}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        {fns && (
          <>
            <path d={curvePath(f, v)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            {near && <line {...lineAt(mt)} stroke={theme.colors.good} strokeWidth={2} strokeDasharray="7 5" />}
            <line {...lineAt(m)} stroke={theme.colors.secondary} strokeWidth={2.5} />
            {!zero && (
              <>
                <line x1={v.sx(p.a)} y1={v.sy(fa)} x2={v.sx(p.a + h)} y2={v.sy(fa)} stroke={theme.colors.accent} strokeWidth={2} />
                <line x1={v.sx(p.a + h)} y1={v.sy(fa)} x2={v.sx(p.a + h)} y2={v.sy(fb)} stroke={theme.colors.accent} strokeWidth={2} />
                <circle cx={v.sx(p.a + h)} cy={v.sy(fb)} r={7} fill={theme.colors.accent} stroke={theme.colors.ink} />
              </>
            )}
            <circle cx={v.sx(p.a)} cy={v.sy(fa)} r={7} fill={theme.colors.secondary} stroke={theme.colors.ink} />
          </>
        )}
        <Readout
          x={v.left + 4}
          y={v.top + 2}
          lines={[`h = ${fmt(h, 3)}`, `${p.slopeLabel} = ${fmt(m, 3)}`, ...(near ? [`tangent slope ≈ ${fmt(mt, 3)}`] : [])]}
          theme={theme}
        />
      </svg>
      <Slider theme={theme} label="h" value={h} min={-p.hMax} max={p.hMax} step={0.01} onChange={move} display={`h = ${fmt(h)}`} />
    </Frame>
  );
}

export default defineAnimation({
  name: 'secant-to-tangent',
  title: 'Secant to tangent',
  description: 'Shrink h and watch the secant line through two points on the curve become the tangent line.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: 'x^2', a: 1, hMax: 2, hStart: 1.8, xRange: [-1, 3.5], yRange: [-1, 9], autoplay: true, slopeLabel: 'secant slope' },
  presets: {
    'sqrt(x) at 4': { expr: 'sqrt(x)', a: 4, hMax: 4, hStart: 4, xRange: [0, 9], yRange: [0, 3.5] },
    'Falling ball': { expr: '-16x^2 + 64', a: 1, hMax: 1, hStart: 1, xRange: [0, 2.2], yRange: [-5, 70], slopeLabel: 'avg velocity' },
  },
  component: SecantToTangent,
});
