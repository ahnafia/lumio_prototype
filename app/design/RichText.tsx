import katex from 'katex';
import { Fragment, memo, type ReactNode } from 'react';
import { paragraphs, tokenizeMath } from '@contract/text';

/**
 * Renders lesson text: $inline$ and $$display$$ math (KaTeX), **bold**, and
 * blank-line paragraphs. Splitting uses the contract's tokenizer so the app and
 * the validator always agree on what counts as math.
 */

function MathSpan({ tex, display }: { tex: string; display: boolean }) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'htmlAndMathml' });
  // Always a span (styled as a block for display math) so it nests anywhere.
  return <span className={display ? 'rich__display' : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** One paragraph's worth of inline content. Bold can span math, so its state carries across tokens. */
function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let bold = false;
  let key = 0;
  const push = (node: ReactNode) => out.push(bold ? <strong key={key++}>{node}</strong> : <Fragment key={key++}>{node}</Fragment>);
  for (const token of tokenizeMath(text)) {
    if (token.type === 'math') {
      push(<MathSpan tex={token.tex} display={token.display} />);
      continue;
    }
    const parts = token.value.split('**');
    parts.forEach((part, i) => {
      if (i > 0) bold = !bold;
      if (part) push(part);
    });
  }
  return out;
}

/** A paragraph that is only display math renders as a block, not inside a <p>. */
function isDisplayOnly(p: string) {
  const tokens = tokenizeMath(p);
  return tokens.length === 1 && tokens[0]?.type === 'math' && tokens[0].display;
}

interface RichTextProps {
  text: string;
  /** Inline mode renders a <span> with no paragraphs (for choices, captions in a line). */
  inline?: boolean;
  className?: string;
}

export const RichText = memo(function RichText({ text, inline, className }: RichTextProps) {
  if (inline) return <span className={['rich', className].filter(Boolean).join(' ')}>{renderInline(text)}</span>;
  return (
    <div className={['rich', className].filter(Boolean).join(' ')}>
      {/* div, not p: a paragraph may contain display math, which is a block. */}
      {paragraphs(text).map((p, i) =>
        isDisplayOnly(p) ? <Fragment key={i}>{renderInline(p)}</Fragment> : <div key={i} className="rich__p">{renderInline(p)}</div>,
      )}
    </div>
  );
});

/** Plain text for labels (aria-label, title): math as its TeX source without backslashes, no ** markers. */
export function plainText(text: string): string {
  return tokenizeMath(text)
    .map((t) => (t.type === 'math' ? t.tex.replace(/\\([a-zA-Z]+)/g, '$1').replace(/[{}\\]/g, '') : t.value.replaceAll('**', '')))
    .join('')
    .trim();
}
