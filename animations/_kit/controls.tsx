import { useCallback, useEffect, useMemo, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import type { AnimationTheme } from '@contract/theme';

/** Height of one control row under the drawing (also the minimum touch target). */
export const ROW_H = 44;

/** Outer box: exactly width × height, drawing on top, control rows below. */
export function Frame({ width, height, theme, label, children }: { width: number; height: number; theme: AnimationTheme; label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: theme.colors.background,
        color: theme.colors.ink,
        fontFamily: theme.fontFamily,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}

interface SliderProps {
  theme: AnimationTheme;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  /** Text after the slider, e.g. "n = 12". */
  display: string;
}

/** A labelled native range input: keyboard, touch and screen readers for free. */
export function Slider({ theme, label, value, min, max, step, onChange, display }: SliderProps) {
  const row: CSSProperties = { height: ROW_H, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', flex: '0 0 auto' };
  return (
    <label style={row}>
      <span style={{ fontSize: 13, color: theme.colors.muted, whiteSpace: 'nowrap' }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        style={{ flex: 1, minWidth: 60, height: ROW_H, accentColor: theme.colors.primary, cursor: 'pointer', touchAction: 'none' }}
      />
      <span style={{ fontSize: 13, fontFamily: theme.monoFamily, minWidth: 74, textAlign: 'right', whiteSpace: 'nowrap' }}>{display}</span>
    </label>
  );
}

/** A row of buttons (each at least 44 px tall). `active` marks a toggle as pressed. */
export function Buttons({ theme, items }: { theme: AnimationTheme; items: { label: string; onClick: () => void; active?: boolean; disabled?: boolean }[] }) {
  return (
    <div style={{ height: ROW_H, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', flex: '0 0 auto' }}>
      {items.map((b) => (
        <button
          key={b.label}
          type="button"
          onClick={b.onClick}
          disabled={b.disabled}
          aria-pressed={b.active}
          style={{
            minHeight: 36,
            minWidth: 44,
            padding: '0 12px',
            borderRadius: theme.radius,
            border: `1.5px solid ${b.active ? theme.colors.primary : theme.colors.grid}`,
            background: b.active ? theme.colors.primary : theme.colors.surface,
            color: b.active ? theme.colors.background : theme.colors.ink,
            fontFamily: theme.fontFamily,
            fontSize: 13,
            cursor: b.disabled ? 'default' : 'pointer',
            opacity: b.disabled ? 0.5 : 1,
          }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

/** Run `tick(dtSeconds)` every animation frame while `active`. */
export function useRaf(active: boolean, tick: (dt: number) => void) {
  const tickRef = useRef(tick);
  useEffect(() => {
    tickRef.current = tick;
  });
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tickRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** Returns a stable function that calls onComplete at most once. */
export function useOnce(fn: (() => void) | undefined): () => void {
  const done = useRef(false);
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  return useCallback(() => {
    if (done.current) return;
    done.current = true;
    fnRef.current?.();
  }, []);
}

/** Pointer-drag handlers for an SVG: calls onMove with the pointer's x/y in SVG pixels. */
export function useDrag(onMove: (px: number, py: number, start: boolean) => void) {
  const dragging = useRef(false);
  const moveRef = useRef(onMove);
  useEffect(() => {
    moveRef.current = onMove;
  });
  return useMemo(() => {
    const point = (e: PointerEvent<SVGSVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const stop = () => {
      dragging.current = false;
    };
    return {
      onPointerDown: (e: PointerEvent<SVGSVGElement>) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        const [x, y] = point(e);
        moveRef.current(x, y, true);
      },
      onPointerMove: (e: PointerEvent<SVGSVGElement>) => {
        if (!dragging.current) return;
        const [x, y] = point(e);
        moveRef.current(x, y, false);
      },
      onPointerUp: stop,
      onPointerCancel: stop,
    };
  }, []);
}
