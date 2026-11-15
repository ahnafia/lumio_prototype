import { useEffect, useRef } from 'react';
import type { Lesson } from '@contract/schema';
import { Button } from '../design/components';
import { Icon } from '../design/Icon';
import './celebrate.css';

interface LessonCompleteProps {
  lesson: Lesson;
  xpEarned: number;
  correct: number;
  questions: number;
  onContinue: () => void;
}

/** End-of-lesson screen. The full celebration comes in #17. */
export function LessonComplete({ lesson, xpEarned, correct, questions, onContinue }: LessonCompleteProps) {
  const continueRef = useRef<HTMLButtonElement>(null);
  useEffect(() => continueRef.current?.focus({ preventScroll: true }), []);

  return (
    <div className="complete">
      <main className="complete__body column">
        <span className="complete__badge" aria-hidden>
          <Icon name="sparkle" size={44} />
        </span>
        <h1>Lesson complete</h1>
        <p className="complete__title">{lesson.title}</p>
        <div className="complete__stats">
          <div className="stat-card stat-card--xp">
            <span className="stat-card__label">XP earned</span>
            <span className="stat-card__value">
              <Icon name="star" size={22} /> {xpEarned}
            </span>
          </div>
          <div className="stat-card stat-card--score">
            <span className="stat-card__label">Correct</span>
            <span className="stat-card__value">
              <Icon name="target" size={22} /> {correct}/{questions}
            </span>
          </div>
        </div>
      </main>
      <footer className="player__footer">
        <div className="column">
          <Button ref={continueRef} block onClick={onContinue}>
            Continue
          </Button>
        </div>
      </footer>
    </div>
  );
}
