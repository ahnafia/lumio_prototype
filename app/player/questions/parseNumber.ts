/**
 * Parses what a student typed into a number: integers ("-3"), decimals ("0.25",
 * ".5", "-1.") and simple fractions ("1/4", "-1/2", "3 / 4"). Surrounding spaces
 * are fine, and a typographic minus (−) counts as a minus. Anything else returns
 * null: "not an answer yet".
 */
const NUMBER = String.raw`\d+(?:\.\d*)?|\.\d+`;
const PATTERN = new RegExp(String.raw`^([-+]?)\s*(${NUMBER})(?:\s*/\s*(${NUMBER}))?$`);

export function parseNumber(input: string): number | null {
  const s = input.trim().replace(/−/g, '-');
  const m = PATTERN.exec(s);
  if (!m) return null;
  const sign = m[1] === '-' ? -1 : 1;
  const num = Number(m[2]);
  const den = m[3] === undefined ? 1 : Number(m[3]);
  if (den === 0) return null;
  const value = (sign * num) / den;
  return Number.isFinite(value) ? value : null;
}

export function isWithin(value: number, answer: number, tolerance: number): boolean {
  // A tiny epsilon so 1/3 vs 0.3333 with tolerance 0.0001 behaves as authors expect.
  return Math.abs(value - answer) <= tolerance + 1e-9;
}
