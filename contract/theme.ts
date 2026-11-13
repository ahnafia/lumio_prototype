/**
 * Visual tokens handed to every animation.
 *
 * Animations never hard-code colors or fonts. They read them from `theme`, so the
 * same component matches A's brand inside the app and the neutral default in B's
 * gallery. A builds the brand theme from the design system and passes it in.
 */
export interface AnimationTheme {
  colors: {
    /** Canvas behind the animation. */
    background: string;
    /** Cards, panels, slider tracks. */
    surface: string;
    /** Main text and labels. */
    ink: string;
    /** Secondary text, tick labels. */
    muted: string;
    /** Grid lines. */
    grid: string;
    /** x and y axes. */
    axis: string;
    /** The main thing to look at: the curve, the moving point. */
    primary: string;
    /** A second object: a tangent line, a second curve. */
    secondary: string;
    /** Highlights: the shaded area, the "aha" moment. */
    accent: string;
    /** Correct / positive. */
    good: string;
    /** Wrong / negative (also negative signed area). */
    bad: string;
    /** Extra series colors, used in order. */
    series: readonly [string, string, string];
  };
  fontFamily: string;
  monoFamily: string;
  /** Corner radius in px for panels and handles. */
  radius: number;
}

/** Neutral theme for the gallery and tests. It is deliberately not Lumio's brand. */
export const defaultTheme: AnimationTheme = {
  colors: {
    background: '#ffffff',
    surface: '#f3f4f6',
    ink: '#111827',
    muted: '#6b7280',
    grid: '#e5e7eb',
    axis: '#9ca3af',
    primary: '#2563eb',
    secondary: '#db2777',
    accent: '#f59e0b',
    good: '#16a34a',
    bad: '#dc2626',
    series: ['#2563eb', '#db2777', '#0d9488'],
  },
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  monoFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
  radius: 8,
};
