import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isQuestion, type Lesson, type Screen } from '@contract/schema';
import { useCourse } from '../course';
import { Button, ProgressBar } from '../design/components';
import { Icon } from '../design/Icon';
import { Message } from '../shell/Message';
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
  const [index, setIndex] = useState(0);
  /** Screen ids whose animation the student has engaged with. */
  const [engaged, setEngaged] = useState<ReadonlySet<string>>(() => new Set());
  /** The current question's answer status (reset per screen). */
  const [answer, setAnswer] = useState<AnswerStatus>(NO_ANSWER);
  const screens = lesson.screens;
  const screen = screens[index];
  const isLast = index === screens.length - 1;

  const markEngaged = useCallback((id: string) => {
    setEngaged((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const canContinue =
    !!screen &&
    !(screen.type === 'animation' && screen.requireInteraction && !engaged.has(screen.id)) &&
    (!isQuestion(screen) || answer.hasAnswer);

  const advance = useCallback(() => {
    if (isLast) navigate('/');
    else {
      setIndex((i) => i + 1);
      setAnswer(NO_ANSWER);
    }
  }, [isLast, navigate]);

  const exit = () => {
    if (index === 0 || window.confirm('Leave this lesson? Your progress in it will be lost.')) navigate('/');
  };

  // Enter continues (unless focus is on a control that handles Enter itself).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || !canContinue) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'A') return;
      e.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canContinue, advance]);

  // Each new screen starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  if (!screen) return null;

  return (
    <div className="player">
      <header className="player__top column">
        <button type="button" className="icon-btn" onClick={exit} aria-label="Exit lesson">
          <Icon name="close" size={26} />
        </button>
        <ProgressBar value={index / screens.length} label={`Screen ${index + 1} of ${screens.length}`} />
      </header>

      <main className="player__body column">
        <div key={screen.id} className="player__screen">
          <ScreenView
            screen={screen}
            engaged={engaged.has(screen.id)}
            onEngaged={() => markEngaged(screen.id)}
            onAnswer={setAnswer}
          />
        </div>
      </main>

      <footer className="player__footer">
        <div className="column">
          <Button block disabled={!canContinue} onClick={advance}>
            {isLast ? 'Finish' : 'Continue'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

interface ScreenViewProps {
  screen: Screen;
  engaged: boolean;
  onEngaged: () => void;
  onAnswer: (status: AnswerStatus) => void;
}

function ScreenView({ screen, engaged, onEngaged, onAnswer }: ScreenViewProps) {
  switch (screen.type) {
    case 'animation':
      return <AnimationScreen screen={screen} engaged={engaged} onEngaged={onEngaged} />;
    case 'explanation':
      return <ExplanationScreen screen={screen} />;
    case 'multiple-choice':
      return <MultipleChoice screen={screen} locked={false} revealed={false} onChange={onAnswer} />;
    case 'numeric':
      return <Numeric screen={screen} locked={false} revealed={false} onChange={onAnswer} />;
    default:
      // Temporary until #10.
      return (
        <div className="screen">
          <h1 className="screen__title">Question goes here</h1>
          <p className="screen__hint">A {screen.type} question. It arrives in #10.</p>
        </div>
      );
  }
}
