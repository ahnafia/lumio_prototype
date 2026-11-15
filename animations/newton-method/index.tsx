import { useState } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Buttons, Frame, ROW_H, useOnce } from '../_kit/controls';
import { deriv, useFns } from '../_kit/expr';
import { Axes, Readout, curvePath, makeView } from '../_kit/plot';

/** Newton's method step by step: follow each tangent line down to the x-axis. */
const range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max]');
const params = z.object({
  expr: z.string().min(1),
  x0: z.number(),
  xRange: range,
  yRange: range,
  maxSteps: z.number().int().min(1).max(6),
});
type Params = z.output<typeof params>;

function NewtonMethod({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [steps, setSteps] = useState(0);
  const complete = useOnce(onComplete);
  const fns = useFns([p.expr]);
  const f = (x: number) => fns?.[0]?.(x) ?? NaN;
  const plotH = height - ROW_H;
  const v = makeView(p.xRange, p.yRange, { left: 6, top: 6, width: width - 12, height: plotH - 12 });

  const xs = [p.x0];
  for (let i = 0; i < steps; i++) {
    const x = xs[i] ?? p.x0;
    xs.push(x - f(x) / deriv(f, x));
  }
  const step = () => {
    const n = Math.min(p.maxSteps, steps + 1);
    setSteps(n);
    onInteract?.({ kind: 'step', value: n, label: 'step' });
    if (n >= 3) complete();
  };
  const reset = () => {
    setSteps(0);
    onInteract?.({ kind: 'step', value: 0, label: 'reset' });
  };

  return (
    <Frame width={width} height={height} theme={theme} label={`Newton's method on y = ${p.expr} from x₀ = ${p.x0}. Iterates: ${xs.map((x) => x.toFixed(6)).join(', ')}.`}>
      <svg width={width} height={plotH} viewBox={`0 0 ${width} ${plotH}`} style={{ display: 'block' }}>
        <Axes v={v} theme={theme} />
        {fns && (
          <>
            <path d={curvePath(f, v)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
            {xs.slice(0, -1).map((x, i) => {
              const nx = xs[i + 1] ?? x;
              return (
                <g key={i} opacity={i === steps - 1 ? 1 : 0.45}>
                  <line x1={v.sx(x)} y1={v.sy(0)} x2={v.sx(x)} y2={v.sy(f(x))} stroke={theme.colors.muted} strokeDasharray="4 4" />
                  <line x1={v.sx(x)} y1={v.sy(f(x))} x2={v.sx(nx)} y2={v.sy(0)} stroke={theme.colors.secondary} strokeWidth={2.5} />
                  <circle cx={v.sx(x)} cy={v.sy(f(x))} r={5} fill={theme.colors.secondary} />
                </g>
              );
            })}
            {xs.map((x, i) => (
              <circle key={`x${i}`} cx={v.sx(x)} cy={v.sy(0)} r={i === xs.length - 1 ? 7 : 4} fill={theme.colors.accent} stroke={theme.colors.ink} />
            ))}
          </>
        )}
        <Readout x={v.left + 4} y={v.top + 2} lines={xs.slice(-4).map((x, i) => `x${xs.length - Math.min(4, xs.length) + i} = ${x.toFixed(6)}`)} theme={theme} />
      </svg>
      <Buttons
        theme={theme}
        items={[
          { label: 'Next step', onClick: step, disabled: steps >= p.maxSteps },
          { label: 'Reset', onClick: reset, disabled: steps === 0 },
        ]}
      />
    </Frame>
  );
}

export default defineAnimation({
  name: 'newton-method',
  title: "Newton's method",
  description: 'Press Next step: each tangent line lands closer to the root.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { expr: 'x^2 - 2', x0: 3, xRange: [0, 3.5], yRange: [-3, 9], maxSteps: 5 },
  presets: { 'cos(x) = x': { expr: 'cos(x) - x', x0: 0, xRange: [-0.5, 2], yRange: [-2, 1.5] } },
  component: NewtonMethod,
});
