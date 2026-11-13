/**
 * How rich text is split into plain text and math. The app's renderer and the
 * validator both use this, so they always agree on what counts as math.
 *
 *   tokenizeMath('Slope is $2a$ here') →
 *     [{ type: 'text', value: 'Slope is ' }, { type: 'math', tex: '2a', display: false }, { type: 'text', value: ' here' }]
 *
 * `$$…$$` is display math and `$…$` is inline math (it can't span lines).
 * **bold** is left inside text tokens for the renderer to handle.
 */
export type RichToken =
  | { type: 'text'; value: string }
  | { type: 'math'; tex: string; display: boolean };

const MATH = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;

export function tokenizeMath(text: string): RichToken[] {
  const tokens: RichToken[] = [];
  let last = 0;
  for (const m of text.matchAll(MATH)) {
    const start = m.index;
    if (start > last) tokens.push({ type: 'text', value: text.slice(last, start) });
    const display = m[1] !== undefined;
    tokens.push({ type: 'math', tex: (display ? m[1] : m[2]) ?? '', display });
    last = start + m[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

/** True if a `$` is left over after removing all math spans, which means it's unbalanced. */
export function hasUnbalancedDollar(text: string): boolean {
  return tokenizeMath(text).some((t) => t.type === 'text' && t.value.includes('$'));
}

/** Split a body into paragraphs on blank lines. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
