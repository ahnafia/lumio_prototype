import { useId, useState } from 'react';
import type { NumericScreen } from '@contract/schema';
import { Icon } from '../../design/Icon';
import { RichText } from '../../design/RichText';
import { AnimationBox } from '../AnimationBox';
import { isWithin, parseNumber } from './parseNumber';
import type { QuestionProps } from './types';

export function Numeric({ screen, locked, revealed, onChange, demo }: QuestionProps<NumericScreen>) {
  const [text, setText] = useState(() => (demo ? demoNumber(screen, demo) : ''));
  const id = useId();
  const value = parseNumber(text);
  const invalid = text.trim() !== '' && value === null;
  const correct = value !== null && isWithin(value, screen.answer, screen.tolerance);

  const update = (next: string) => {
    if (locked) return;
    setText(next);
    const v = parseNumber(next);
    onChange({ hasAnswer: v !== null, isCorrect: v !== null && isWithin(v, screen.answer, screen.tolerance) });
  };

  const state = revealed ? (correct ? 'right' : 'wrong') : 'idle';

  return (
    <div className="screen screen--question">
      <RichText className="screen__prompt" text={screen.prompt} />
      {screen.visual && <AnimationBox visual={screen.visual} playing />}
      <div className={`numeric numeric--${state}`}>
        <label htmlFor={id} className="visually-hidden">
          Your answer
        </label>
        <input
          id={id}
          className="numeric__input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type a number"
          value={text}
          readOnly={locked}
          aria-invalid={invalid || undefined}
          aria-describedby={`${id}-hint`}
          onChange={(e) => update(e.target.value)}
          // On phones, keep the input above the on-screen keyboard once it opens.
          onFocus={(e) => {
            const el = e.currentTarget;
            window.setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
          }}
          autoFocus
        />
        {screen.unit && <span className="numeric__unit">{screen.unit}</span>}
        {revealed && (
          <span className="numeric__verdict" role="img" aria-label={correct ? 'Correct' : 'Incorrect'}>
            <Icon name={correct ? 'check' : 'close'} size={18} />
          </span>
        )}
      </div>
      <p id={`${id}-hint`} className={`screen__hint${invalid ? ' is-warning' : ''}`}>
        {invalid ? 'Use a number like -3, 0.25 or 1/4.' : 'Whole numbers, decimals and fractions like 1/4 all work.'}
      </p>
    </div>
  );
}

/** A typed answer for presenter mode: the answer itself, or one clearly outside the tolerance. */
function demoNumber(screen: NumericScreen, demo: 'right' | 'wrong'): string {
  const value = demo === 'right' ? screen.answer : screen.answer + Math.max(1, Math.ceil(screen.tolerance * 2 + 1));
  return String(Number(value.toFixed(4)));
}
