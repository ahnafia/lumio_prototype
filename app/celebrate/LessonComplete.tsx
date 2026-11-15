import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Lesson, Unit } from '@contract/schema';
import { Button } from '../design/components';
import { Icon } from '../design/Icon';
import { RichText } from '../design/RichText';
import { useReducedMotion } from '../design/useReducedMotion';
import type { CompletionResult } from '../progress/store';
import './celebrate.css';

interface LessonCompleteProps {
  lesson: Lesson;
  result: CompletionResult;
  correct: number;
  questions: number;
  /** Set when this lesson was the last one in its unit. */
  unitDone?: Unit;
  onContinue: () => void;
  onReview: () => void;
}

/** The end-of-lesson celebration: XP counting up, score, streak, and a short burst. */
export function LessonComplete({ lesson, result, correct, questions, unitDone, onContinue, onReview }: LessonCompleteProps) {
  const continueRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const xp = useCountUp(result.xpAwarded, reducedMotion ? 0 : 900);
  useEffect(() => continueRef.current?.focus({ preventScroll: true }), []);

  const perfect = questions > 0 && correct === questions;
  const heading = unitDone ? 'Unit complete!' : perfect ? 'Flawless!' : 'Lesson complete';
  const sub = unitDone ? unitDone.title : lesson.title;

  return (
    <div className={`complete${unitDone ? ' complete--unit' : ''}`}>
      <main className="complete__body column">
        <div className="complete__hero">
          {!reducedMotion && <Burst />}
          <span className="complete__badge" aria-hidden>
            <Icon name={unitDone ? 'star' : 'sparkle'} size={48} />
          </span>
        </div>
        <h1>{heading}</h1>
        <p className="complete__title">
          <RichText inline text={sub} />
        </p>
        {unitDone && <p className="complete__unit-note">You finished every lesson in this unit.</p>}

        <div className="complete__stats">
          <div className="stat-card stat-card--xp">
            <span className="stat-card__label">XP earned</span>
            <span className="stat-card__value">
              <Icon name="star" size={22} /> <span aria-hidden>{xp}</span>
              <span className="visually-hidden">{result.xpAwarded}</span>
            </span>
            {result.xpAwarded === 0 && <span className="stat-card__note">Already earned</span>}
          </div>
          <div className="stat-card stat-card--score">
            <span className="stat-card__label">Correct</span>
            <span className="stat-card__value">
              <Icon name="target" size={22} /> {correct} of {questions}
            </span>
          </div>
          <div className={`stat-card stat-card--streak${result.streakExtended ? ' is-up' : ''}`}>
            <span className="stat-card__label">Day streak</span>
            <span className="stat-card__value">
              <Icon name="flame" size={22} /> {result.streak}
            </span>
            {result.streakExtended && <span className="stat-card__note">+1 today</span>}
          </div>
        </div>
      </main>
      <footer className="player__footer">
        <div className="column complete__actions">
          <Button variant="secondary" onClick={onReview} aria-label="Review lesson">
            Review
          </Button>
          <Button ref={continueRef} onClick={onContinue}>
            Continue
          </Button>
        </div>
      </footer>
    </div>
  );
}

/** 0 → target over `ms` with an ease-out. Instant when ms is 0. */
function useCountUp(target: number, ms: number) {
  const [value, setValue] = useState(ms > 0 ? 0 : target);
  useEffect(() => {
    if (ms <= 0) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setValue(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return ms > 0 ? value : target;
}

/** Sparks flying out from the badge. Pure CSS, about 1.1 s, decorative only. */
function Burst() {
  const sparks = Array.from({ length: 14 }, (_, i) => i);
  return (
    <span className="burst" aria-hidden>
      {sparks.map((i) => (
        <span key={i} className={`burst__spark burst__spark--${i % 3}`} style={{ '--a': `${(360 / sparks.length) * i}deg`, '--d': `${70 + (i % 4) * 14}px` } as CSSProperties} />
      ))}
    </span>
  );
}
