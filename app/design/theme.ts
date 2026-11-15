import { defaultTheme, type AnimationTheme } from '@contract/theme';

/**
 * The brand AnimationTheme, read from the CSS variables in tokens.css so the
 * palette is defined once. Animations draw SVG/canvas, where var() doesn't work
 * in attributes, so they get resolved color strings.
 */
let cached: AnimationTheme | null = null;

export function getBrandTheme(): AnimationTheme {
  if (cached) return cached;
  if (typeof document === 'undefined') return defaultTheme;
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const d = defaultTheme.colors;
  const theme: AnimationTheme = {
    colors: {
      background: v('--c-surface', d.background),
      surface: v('--c-surface-2', d.surface),
      ink: v('--c-ink', d.ink),
      muted: v('--c-muted', d.muted),
      grid: v('--c-grid', d.grid),
      axis: v('--c-axis', d.axis),
      primary: v('--c-primary', d.primary),
      secondary: v('--c-secondary', d.secondary),
      accent: v('--c-accent', d.accent),
      good: v('--c-good', d.good),
      bad: v('--c-bad', d.bad),
      series: [v('--c-series-1', d.series[0]), v('--c-series-2', d.series[1]), v('--c-series-3', d.series[2])],
    },
    fontFamily: v('--font-ui', defaultTheme.fontFamily),
    monoFamily: v('--font-mono', defaultTheme.monoFamily),
    radius: parseFloat(v('--r-sm', String(defaultTheme.radius))) || defaultTheme.radius,
  };
  // Only cache once the stylesheet has loaded (otherwise we'd lock in the fallback).
  if (css.getPropertyValue('--c-primary').trim()) cached = theme;
  return theme;
}
