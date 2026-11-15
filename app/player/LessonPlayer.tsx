import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isQuestion, type Lesson, type QuestionScreen, type Screen } from '@contract/schema';
import { LessonComplete } from '../celebrate/LessonComplete';
import { useCourse } from '../course';
import { Button, ProgressBar } from '../design/components';
import { Icon } from '../design/Icon';
import { FeedbackSheet } from '../feedback/FeedbackSheet';
import { Message } from '../shell/Message';
import { GraphTap } from './questions/GraphTap';
import { MultipleChoice } from './questions/MultipleChoice';
import { Numeric } from './questions/Numeric';
import { NO_ANSWER, type AnswerStatus } from './questions/types';
import { AnimationScreen } from './screens/AnimationScreen';
import { ExplanationScreen } from './screens/ExplanationScreen';
import './player.css';

/** #/lesson/:id. Finds the lesson, or shows a friendly not-found. */
export function LessonRoute() {
  const { id = '' } = useParams();
  const { lessons } = useCourse();
  const navigate = useNavigate();
  const lesson = lessons[id];
  if (!lesson) {
    return (
      <main className="column">
        <Message
          icon="target"
          title="Lesson not found"
          body="We couldn't find that lesson. It may have moved. Pick one from the path."
          action={{ label: 'Back to the path', onClick: () => navigate('/') }}
        />
      </main>
    );
  }
  // key: a new lesson id starts a fresh player.
  return <LessonPlayer key={lesson.id} lesson={lesson} />;
}

function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate();
  const screens = lesson.screens;
  const questionCount = screens.filter(isQuestion).length;

  const [index, setIndex] = useState(() => devStartScreen(screens.length));
  /** Screen ids whose animation the student has engaged with. */
  const [engaged, setEngaged] = useState<ReadonlySet<string>>(() => new Set());
  /** The current question's answer, as last reported by the screen. */
  const [answer, setAnswer] = useState<AnswerStatus>(NO_ANSWER);
  /** Set once Check is pressed on the current question: the sheet is open and inputs lock. */
  const [checked, setChecked] = useState<AnswerStatus | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const screen = screens[index];
  const isLast = index === screens.length - 1;
  const question = screen && isQuestion(screen) ? screen : null;

  const markEngaged = useCallback((id: string) => {
    setEngaged((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const canContinue = !!screen && !question && !(screen.type === 'animation' && screen.requireInteraction && !engaged.has(screen.id));
  const canCheck = !!question && !checked && answer.hasAnswer;

  const advance = useCallback(() => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(NO_ANSWER);
    setChecked(null);
  }, [isLast]);

  const check = useCallback(() => {
    if (!canCheck) return;
    setChecked(answer);
    if (answer.isCorrect) setCorrectCount((n) => n + 1);
  }, [answer, canCheck]);

  const exit = () => {
    if (index === 0 || window.confirm('Leave this lesson? Your progress in it will be lost.')) navigate('/');
  };

  // Enter: Check, then Continue. Real buttons (footer, sheet, exit) handle Enter natively.
  useEffect(() => {
    if (finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('a') || (target?.closest('button') && !target.closest('.choice'))) return;
      if (canCheck) {
        e.preventDefault();
        check();
      } else if (checked || canContinue) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finished, canCheck, canContinue, checked, check, advance]);

  // Each new screen starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index, finished]);

  if (finished) {
    return (
      <LessonComplete lesson={lesson} xpEarned={lesson.xp} correct={correctCount} questions={questionCount} onContinue={() => navigate('/')} />
    );
  }
  if (!screen) return null;

  const feedback = question && checked ? (checked.isCorrect ? question.feedback.correct : question.feedback.incorrect) : '';

  return (
    <div className={`player${checked ? ' is-checked' : ''}`}>
      <header className="player__top column">
        <button type="button" className="icon-btn" onClick={exit} aria-label="Exit lesson">
          <Icon name="close" size={26} />
        </button>
        <ProgressBar value={(index + (checked ? 1 : 0)) / screens.length} label={`Screen ${index + 1} of ${screens.length}`} />
      </header>

      <main className="player__body column">
        <div key={screen.id} className="player__screen">
          <ScreenView
            screen={screen}
            engaged={engaged.has(screen.id)}
            onEngaged={() => markEngaged(screen.id)}
            onAnswer={setAnswer}
            checked={!!checked}
          />
        </div>
      </main>

      <footer className="player__footer" inert={!!checked}>
        <div className="column">
          {question ? (
            <Button block disabled={!canCheck} onClick={check}>
              Check
            </Button>
          ) : (
            <Button block disabled={!canContinue} onClick={advance}>
              {isLast ? 'Finish' : 'Continue'}
            </Button>
          )}
        </div>
      </footer>

      {question && (
        <FeedbackSheet
          open={!!checked}
          correct={!!checked?.isCorrect}
          message={feedback}
          seed={index}
          continueLabel={isLast ? 'Finish' : 'Continue'}
          onContinue={advance}
        />
      )}
    </div>
  );
}

interface ScreenViewProps {
  screen: Screen;
  engaged: boolean;
  onEngaged: () => void;
  onAnswer: (status: AnswerStatus) => void;
  checked: boolean;
}

function ScreenView({ screen, engaged, onEngaged, onAnswer, checked }: ScreenViewProps) {
  switch (screen.type) {
    case 'animation':
      return <AnimationScreen screen={screen} engaged={engaged} onEngaged={onEngaged} />;
    case 'explanation':
      return <ExplanationScreen screen={screen} />;
    default:
      return <QuestionView screen={screen} onAnswer={onAnswer} checked={checked} />;
  }
}

function QuestionView({ screen, onAnswer, checked }: { screen: QuestionScreen; onAnswer: (s: AnswerStatus) => void; checked: boolean }) {
  const props = { locked: checked, revealed: checked, onChange: onAnswer };
  switch (screen.type) {
    case 'multiple-choice':
      return <MultipleChoice screen={screen} {...props} />;
    case 'numeric':
      return <Numeric screen={screen} {...props} />;
    case 'graph-tap':
      return <GraphTap screen={screen} {...props} />;
  }
}

/** Dev only: `#/lesson/<id>?s=4` opens a lesson at screen 4 (0-based) for quick testing. */
function devStartScreen(count: number): number {
  if (!import.meta.env.DEV) return 0;
  const s = Number(new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('s'));
  return Number.isInteger(s) && s > 0 && s < count ? s : 0;
}
