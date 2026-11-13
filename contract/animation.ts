import type { ComponentType } from 'react';
import type { z } from 'zod';
import type { AnimationTheme } from './theme';

/**
 * THE ANIMATION INTERFACE (frozen: changes need a PR both cofounders approve).
 *
 * Every animation is a folder `animations/<name>/index.tsx` whose default export is
 * `defineAnimation({...})`. The app (A) and the gallery (B) render it the same way:
 *
 *   <def.component params={resolved} width={w} height={h} playing reducedMotion={false}
 *                  theme={theme} onInteract={...} onComplete={...} />
 *
 * A lesson refers to an animation by name, with optional params:
 *   { name: 'secant-to-tangent', params: { fn: 'x^2', a: 1 } }
 * Params are merged over `defaults`, then checked against the `params` zod schema
 * (by the validator in CI, and again at runtime by `resolveParams`).
 */

/** Something the student did inside an animation. */
export interface InteractionEvent {
  kind: 'drag' | 'tap' | 'slider' | 'toggle' | 'step' | 'custom';
  /** Current value, e.g. the slider position or the dragged x. */
  value?: number | string | boolean;
  /** Free-form tag, e.g. 'h' for the slider controlling h. */
  label?: string;
}

/** Props every animation component receives. */
export interface AnimationProps<P> {
  /** The lesson's params merged over the animation's defaults. Already validated. */
  params: P;
  /** Box in CSS px that the host gives the animation. Draw inside it; don't overflow. */
  width: number;
  height: number;
  /** False when the screen is off-screen or paused. Stop timers and rAF loops when false. */
  playing: boolean;
  /** The user prefers reduced motion: jump to end states, no looping motion. */
  reducedMotion: boolean;
  /** Colors and fonts. Never hard-code colors. */
  theme: AnimationTheme;
  /** Call on every meaningful student interaction (drag, slider, tap). */
  onInteract?: (event: InteractionEvent) => void;
  /**
   * Call once when the student has reached the "aha" state, such as the secant
   * reaching the tangent or the slider reaching n = 50. If a screen has
   * `requireInteraction: true`, the host enables Continue after the first
   * onInteract or onComplete.
   */
  onComplete?: () => void;
}

export interface AnimationDefinition<S extends z.ZodType = z.ZodType> {
  /** Kebab-case. Must equal the folder name under animations/. */
  name: string;
  /** Human title shown in the gallery. */
  title: string;
  /** One or two sentences: what the student sees and does. */
  description: string;
  /** True if the student can drag, tap or slide something. */
  interactive: boolean;
  /** width / height the animation looks best at (e.g. 16/10). The host keeps this ratio. */
  aspectRatio: number;
  /** zod schema for params. Use z.object({...}); every field should have a default in `defaults`. */
  params: S;
  /** Complete default params. Must pass `params`. */
  defaults: z.output<S>;
  /** Named param sets shown as buttons in the gallery, e.g. { 'sin(x)': { fn: 'sin(x)' } }. */
  presets?: Record<string, Partial<z.output<S>>>;
  /** The React component. */
  component: ComponentType<AnimationProps<z.output<S>>>;
}

/** Identity helper that gives full type inference for params. */
export function defineAnimation<S extends z.ZodType>(def: AnimationDefinition<S>): AnimationDefinition<S> {
  return def;
}

/**
 * Any animation, with its param type erased. The loader and hosts use this; their
 * params are checked at runtime by `resolveParams`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAnimationDefinition = AnimationDefinition<any>;

export type ResolvedParams =
  | { ok: true; params: Record<string, unknown> }
  | { ok: false; error: string };

/** Merge lesson params over defaults and validate. Used by the app, the gallery and the validator. */
export function resolveParams(def: AnyAnimationDefinition, params?: Record<string, unknown>): ResolvedParams {
  const merged = { ...(def.defaults as Record<string, unknown>), ...(params ?? {}) };
  const result = def.params.safeParse(merged);
  if (result.success) return { ok: true, params: result.data as Record<string, unknown> };
  const error = result.error.issues
    .map((i: z.core.$ZodIssue) => `${i.path.join('.') || '(params)'}: ${i.message}`)
    .join('; ');
  return { ok: false, error };
}
