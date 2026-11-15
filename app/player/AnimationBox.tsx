import { Component, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { resolveParams, type InteractionEvent } from '@contract/animation';
import { getAnimation } from '@contract/load';
import type { AnimationRef } from '@contract/schema';
import { getBrandTheme } from '../design/theme';
import { Icon } from '../design/Icon';
import { useReducedMotion } from '../design/useReducedMotion';

interface AnimationBoxProps {
  visual: AnimationRef;
  /** False when the screen isn't shown. The tab being hidden also pauses it. */
  playing: boolean;
  onInteract?: (e: InteractionEvent) => void;
  onComplete?: () => void;
}

/**
 * Hosts any contract animation: looks it up, resolves params, gives it a box at
 * its aspect ratio (column width), and passes playing / reducedMotion / theme.
 * A missing animation, bad params or a crash shows a placeholder, never a dead lesson.
 */
export function AnimationBox({ visual, playing, onInteract, onComplete }: AnimationBoxProps) {
  const def = getAnimation(visual.name);
  const resolved = def ? resolveParams(def, visual.params) : null;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();

  // Stable callbacks, so animations that list them as effect deps don't restart.
  const interactRef = useRef(onInteract);
  const completeRef = useRef(onComplete);
  useEffect(() => {
    interactRef.current = onInteract;
    completeRef.current = onComplete;
  });
  const [handlers] = useState(() => ({
    onInteract: (e: InteractionEvent) => interactRef.current?.(e),
    onComplete: () => completeRef.current?.(),
  }));

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.floor(el.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!def) return <Placeholder title="Visual coming soon" detail={`No animation named "${visual.name}" yet.`} />;
  if (!resolved?.ok) return <Placeholder title="This visual couldn't load" detail={resolved?.error} />;

  // Keep very wide-or-tall ratios on screen: cap the height at 60% of the viewport.
  const maxH = typeof window === 'undefined' ? Infinity : window.innerHeight * 0.6;
  const w = Math.max(0, Math.min(width, Math.floor(maxH * def.aspectRatio)));
  const h = Math.floor(w / def.aspectRatio);
  const Anim = def.component;

  return (
    <div ref={ref} className="anim-box">
      {w > 0 && (
        <div className="anim-box__frame" style={{ width: w, height: h }}>
          <AnimationErrorBoundary name={visual.name}>
            <Anim
              params={resolved.params}
              width={w}
              height={h}
              playing={playing && pageVisible}
              reducedMotion={reducedMotion}
              theme={getBrandTheme()}
              onInteract={handlers.onInteract}
              onComplete={handlers.onComplete}
            />
          </AnimationErrorBoundary>
        </div>
      )}
    </div>
  );
}

function Placeholder({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="anim-placeholder" role="img" aria-label={title}>
      <Icon name="sparkle" size={28} />
      <strong>{title}</strong>
      {import.meta.env.DEV && detail && <small>{detail}</small>}
    </div>
  );
}

class AnimationErrorBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error(`Animation "${this.props.name}" crashed:`, error);
  }
  render() {
    return this.state.failed ? <Placeholder title="This visual hit a snag" detail={this.props.name} /> : this.props.children;
  }
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}
