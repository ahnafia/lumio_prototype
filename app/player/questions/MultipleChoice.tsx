import { useEffect, useState } from 'react';
import type { MultipleChoiceScreen } from '@contract/schema';
import { Icon } from '../../design/Icon';
import { RichText } from '../../design/RichText';
import { AnimationBox } from '../AnimationBox';
import type { QuestionProps } from './types';

function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

export function MultipleChoice({ screen, locked, revealed, onChange, demo }: QuestionProps<MultipleChoiceScreen>) {
  // Shuffled once per attempt: the screen remounts for each attempt.
  const [choices] = useState(() => shuffle(screen.choices));
  const [selected, setSelected] = useState<string | null>(() =>
    demo === 'right' ? screen.answer : demo === 'wrong' ? (screen.choices.find((c) => c.id !== screen.answer)?.id ?? null) : null,
  );

  const select = (id: string) => {
    if (locked) return;
    setSelected(id);
    onChange({ hasAnswer: true, isCorrect: id === screen.answer });
  };

  // Keys 1–4 pick a choice.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.tagName === 'INPUT') return;
      const n = Number(e.key);
      const choice = Number.isInteger(n) ? choices[n - 1] : undefined;
      if (choice) {
        e.preventDefault();
        setSelected(choice.id);
        onChange({ hasAnswer: true, isCorrect: choice.id === screen.answer });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choices, locked, onChange, screen.answer]);

  return (
    <div className="screen screen--question">
      <RichText className="screen__prompt" text={screen.prompt} />
      {screen.visual && <AnimationBox visual={screen.visual} playing />}
      <div className="choices" role="radiogroup" aria-label="Choices">
        {choices.map((choice, i) => {
          const isSelected = selected === choice.id;
          const isAnswer = choice.id === screen.answer;
          const state = revealed ? (isAnswer ? 'right' : isSelected ? 'wrong' : 'idle') : isSelected ? 'selected' : 'idle';
          return (
            <button
              key={choice.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`choice choice--${state}`}
              aria-disabled={locked || undefined}
              onClick={() => select(choice.id)}
            >
              <span className="choice__key" aria-hidden>
                {state === 'right' ? <Icon name="check" size={16} /> : state === 'wrong' ? <Icon name="close" size={16} /> : i + 1}
              </span>
              <RichText inline text={choice.text} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
