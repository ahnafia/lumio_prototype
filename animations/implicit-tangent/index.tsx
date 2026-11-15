import { useRef, useState, type KeyboardEvent } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '@contract/animation';
import { Frame, useDrag, useOnce } from '../_kit/controls';
import { fmt } from '../_kit/expr';
import { Axes, Readout, makeView } from '../_kit/plot';

/**
 * Implicit differentiation on x²/a² + y²/b² = 1 (a circle when a = b). Drag the point all the
 * way around: the tangent slope is −b²x / (a²y), even where the curve isn't a function.
 */
const params = z.object({
  a: z.number().positive(),
  b: z.number().positive(),
  startDeg: z.number(),
});
type Params = z.output<typeof params>;

function ImplicitTangent({ params: p, width, height, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [th, setTh] = useState((p.startDeg * Math.PI) / 180);
  const swept = useRef({ lo: th, hi: th });
  const complete = useOnce(onComplete);
  const R = Math.max(p.a, p.b) * 1.35;
  const aspect = width / height;
  const v = makeView([-R * aspect, R * aspect], [-R, R], { left: 0, top: 0, width, height });
  const x = p.a * Math.cos(th);
  const y = p.b * Math.sin(th);
  const vertical = Math.abs(y) < 1e-3;
  const m = vertical ? NaN : -(p.b * p.b * x) / (p.a * p.a * y);

  const setAngle = (n: number, kind: 'drag' | 'step') => {
    setTh(n);
    onInteract?.({ kind, value: n, label: 'angle' });
    const s = swept.current;
    s.lo = Math.min(s.lo, n);
    s.hi = Math.max(s.hi, n);
    if (s.hi - s.lo >= Math.PI) complete();
  };
  const drag = useDrag((px, py) => {
    // Unwrap the angle so sweeping counts continuously.
    const raw = Math.atan2(v.gy(py) / p.b, v.gx(px) / p.a);
    const k = Math.round((th - raw) / (2 * Math.PI));
    setAngle(raw + 2 * Math.PI * k, 'drag');
  });
  const onKey = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setAngle(th + 0.05, 'step');
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setAngle(th - 0.05, 'step');
  };
  const L = R * 0.7;
  const dirx = vertical ? 0 : 1 / Math.sqrt(1 + m * m);
  const diry = vertical ? 1 : m / Math.sqrt(1 + m * m);
  const circle = p.a === p.b;

  return (
    <Frame width={width} height={height} theme={theme} label={`${circle ? 'Circle' : 'Ellipse'} with point (${fmt(x)}, ${fmt(y)}); tangent slope ${vertical ? 'undefined (vertical)' : fmt(m)}.`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', touchAction: 'none' }} {...drag}>
        <Axes v={v} theme={theme} />
        <ellipse cx={v.sx(0)} cy={v.sy(0)} rx={v.sx(p.a) - v.sx(0)} ry={v.sy(0) - v.sy(p.b)} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
        <line x1={v.sx(x - L * dirx)} y1={v.sy(y - L * diry)} x2={v.sx(x + L * dirx)} y2={v.sy(y + L * diry)} stroke={theme.colors.secondary} strokeWidth={2.5} />
        <circle
          cx={v.sx(x)}
          cy={v.sy(y)}
          r={10}
          fill={theme.colors.accent}
          stroke={theme.colors.ink}
          strokeWidth={1.5}
          tabIndex={0}
          role="slider"
          aria-label="Point on the curve"
          aria-valuenow={Number(((th * 180) / Math.PI).toFixed(0))}
          onKeyDown={onKey}
          style={{ cursor: 'grab' }}
        />
        <Readout
          x={6}
          y={6}
          lines={[`(x, y) = (${fmt(x)}, ${fmt(y)})`, circle ? `dy/dx = −x/y` : `dy/dx = −b²x/(a²y)`, `     = ${vertical ? 'undefined' : fmt(m)}`]}
          theme={theme}
        />
      </svg>
    </Frame>
  );
}

export default defineAnimation({
  name: 'implicit-tangent',
  title: 'Implicit tangent',
  description: 'Drag a point around a circle or ellipse; implicit differentiation gives the tangent slope everywhere.',
  interactive: true,
  aspectRatio: 3 / 2,
  params,
  defaults: { a: 5, b: 5, startDeg: 60 },
  presets: { Ellipse: { a: 4, b: 2, startDeg: 45 } },
  component: ImplicitTangent,
});
