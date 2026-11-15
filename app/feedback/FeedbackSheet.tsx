import { useEffect, useRef } from 'react';
import { Button, Sheet } from '../design/components';
import { Icon } from '../design/Icon';
import { RichText } from '../design/RichText';
import './feedback.css';

const RIGHT_HEADINGS = ['Nice!', 'Exactly right', 'You got it', 'Spot on'];

interface FeedbackSheetProps {
  open: boolean;
  correct: boolean;
  /** The one-line feedback from the lesson. */
  message: string;
  /** Varies the heading between questions. */
  seed: number;
  continueLabel: string;
  onContinue: () => void;
}

/** Slides up after Check: right or not quite, the one-line explanation, and Continue. */
export function FeedbackSheet({ open, correct, message, seed, continueLabel, onContinue }: FeedbackSheetProps) {
  const continueRef = useRef<HTMLButtonElement>(null);

  // Move focus to Continue so Enter (and screen readers) land on it.
  useEffect(() => {
    if (open) continueRef.current?.focus({ preventScroll: true });
  }, [open]);

  const heading = correct ? RIGHT_HEADINGS[seed % RIGHT_HEADINGS.length] : 'Not quite';
  return (
    <Sheet open={open} tone={correct ? 'good' : 'bad'} label="Answer feedback">
      <div className="feedback">
        <div className="feedback__text" aria-live="assertive">
          {open && (
            <>
              <h2 className="feedback__heading">
                <span className="feedback__icon" aria-hidden>
                  <Icon name={correct ? 'check' : 'refresh'} size={20} />
                </span>
                {heading}
              </h2>
              <RichText className="feedback__message" text={message} />
            </>
          )}
        </div>
        <Button ref={continueRef} block variant={correct ? 'good' : 'bad'} onClick={onContinue} className="feedback__continue">
          {continueLabel}
        </Button>
      </div>
    </Sheet>
  );
}
