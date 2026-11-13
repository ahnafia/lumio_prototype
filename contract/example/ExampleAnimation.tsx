import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { z } from 'zod';
import { defineAnimation, type AnimationProps } from '../animation';

/**
 * EXAMPLE ANIMATION: the reference implementation of the animation interface.
 * B's animations follow this pattern; A builds the player against it.
 *
 * A point rides along y = a·x² with its tangent line. The student drags it (or uses
 * the arrow keys) and the slope readout updates. While `playing` (and motion isn't
 * reduced) it sweeps on its own until the student grabs it. It calls onComplete once
 * the student has seen a negative, a zero and a positive slope.
 *
 * Plain SVG keeps it dependency-free. B's animations may use Mafs for plots.
 */

const params = z.object({
  /** y = a·x² */
  a: z.number().min(0.25).max(3),
  /** Where the point starts. */
  x0: z.number().min(-2).max(2),
  showTangent: z.boolean(),
  autoplay: z.boolean(),
});
type Params = z.output<typeof params>;

const X_MIN = -2.5;
const X_MAX = 2.5;
const PAD = 24;

function ParabolaSlope({ params: p, width, height, playing, reducedMotion, theme, onInteract, onComplete }: AnimationProps<Params>) {
  const [x, setX] = useState(p.x0);
  const [touched, setTouched] = useState(false);
  const dragging = useRef(false);
  const direction = useRef(1);
  const seen = useRef({ neg: false, zero: false, pos: false, done: false });
  const svgRef = useRef<SVGSVGElement>(null);

  const yMin = -0.15 * p.a * X_MAX ** 2;
  const yMax = p.a * X_MAX ** 2;
  const sx = (gx: number) => PAD + ((gx - X_MIN) / (X_MAX - X_MIN)) * (width - 2 * PAD);
  const sy = (gy: number) => height - PAD - ((gy - yMin) / (yMax - yMin)) * (height - 2 * PAD);
  const f = (gx: number) => p.a * gx * gx;
  const slope = 2 * p.a * x;

  // Autoplay: sweep until the student takes over. Stops when paused or reduced motion.
  useEffect(() => {
    if (!playing || reducedMotion || !p.autoplay || touched) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setX((prev) => {
        let next = prev + direction.current * dt * 1.2;
        if (next > 2) [next, direction.current] = [2, -1];
        if (next < -2) [next, direction.current] = [-2, 1];
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reducedMotion, p.autoplay, touched]);

  const moveTo = (gx: number, kind: 'drag' | 'step') => {
    const clamped = Math.max(-2, Math.min(2, gx));
    setX(clamped);
    setTouched(true);
    onInteract?.({ kind, value: clamped, label: 'x' });
    const m = 2 * p.a * clamped;
    const s = seen.current;
    if (m < -0.3) s.neg = true;
    else if (m > 0.3) s.pos = true;
    else s.zero = true;
    if (s.neg && s.zero && s.pos && !s.done) {
      s.done = true;
      onComplete?.();
    }
  };

  const toGraphX = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return x;
    return X_MIN + ((clientX - rect.left - PAD) / (rect.width - 2 * PAD)) * (X_MAX - X_MIN);
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(toGraphX(e.clientX), 'drag');
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging.current) moveTo(toGraphX(e.clientX), 'drag');
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === 'ArrowLeft') moveTo(x - 0.1, 'step');
    if (e.key === 'ArrowRight') moveTo(x + 0.1, 'step');
  };

  const curve = Array.from({ length: 81 }, (_, i) => {
    const gx = X_MIN + ((X_MAX - X_MIN) * i) / 80;
    return `${i === 0 ? 'M' : 'L'}${sx(gx).toFixed(1)},${sy(f(gx)).toFixed(1)}`;
  }).join(' ');
  const t0 = x - 1.2;
  const t1 = x + 1.2;
  const tangentY = (t: number) => f(x) + slope * (t - x);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Parabola y = ${p.a}x². Point at x = ${x.toFixed(1)}, tangent slope ${slope.toFixed(1)}.`}
      style={{ background: theme.colors.background, touchAction: 'none', fontFamily: theme.fontFamily, userSelect: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <line x1={sx(X_MIN)} y1={sy(0)} x2={sx(X_MAX)} y2={sy(0)} stroke={theme.colors.axis} />
      <line x1={sx(0)} y1={sy(yMin)} x2={sx(0)} y2={sy(yMax)} stroke={theme.colors.axis} />
      <path d={curve} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
      {p.showTangent && (
        <line x1={sx(t0)} y1={sy(tangentY(t0))} x2={sx(t1)} y2={sy(tangentY(t1))} stroke={theme.colors.secondary} strokeWidth={2.5} />
      )}
      <circle
        cx={sx(x)}
        cy={sy(f(x))}
        r={10}
        fill={theme.colors.accent}
        stroke={theme.colors.ink}
        strokeWidth={1.5}
        tabIndex={0}
        role="slider"
        aria-label="Point on the parabola"
        aria-valuemin={-2}
        aria-valuemax={2}
        aria-valuenow={Number(x.toFixed(2))}
        onKeyDown={onKeyDown}
        style={{ cursor: 'grab' }}
      />
      <text x={PAD} y={PAD} fill={theme.colors.ink} fontSize={16} fontFamily={theme.monoFamily}>
        slope = {slope.toFixed(2)}
      </text>
    </svg>
  );
}

export default defineAnimation({
  name: 'example-parabola-slope',
  title: 'Example: slope along a parabola',
  description: 'Drag a point along y = a·x² and watch the tangent line and its slope change.',
  interactive: true,
  aspectRatio: 16 / 10,
  params,
  defaults: { a: 1, x0: -1.5, showTangent: true, autoplay: true },
  presets: {
    'Steeper (a = 2)': { a: 2 },
    'No tangent': { showTangent: false },
    'Still (no autoplay)': { autoplay: false, x0: 1 },
  },
  component: ParabolaSlope,
});
