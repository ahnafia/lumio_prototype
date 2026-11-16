import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { isQuestion, type Lesson, type QuestionScreen, type Screen } from '@contract/schema';
import { LessonComplete } from '../celebrate/LessonComplete';
import { useCourse } from '../course';
import { Button, ProgressBar } from '../design/components';
import { Icon } from '../design/Icon';
import { useReducedMotion } from '../design/useReducedMotion';
import { FeedbackSheet } from '../feedback/FeedbackSheet';
import { readLessonJump, usePresenting, type DemoAnswer } from '../present/presenter';
import { PresenterButton } from '../present/PresenterPanel';
import { recordLessonComplete, type CompletionResult } from '../progress/store';
import { Message } from '../shell/Message';
import { sounds } from '../sound/sound';
import { SoundToggle } from '../sound/SoundToggle';
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
  const location = useLocation();
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
  // key: a new lesson, or "Review lesson" (a new history entry), starts a fresh player.
  return <LessonPlayer key={`${lesson.id}:${location.key}`} lesson={lesson} />;
}

/** Presenter jumps can open a question already answered: `?a=right|wrong`. */
function initialDemo(screens: Screen[], start: number, answer: DemoAnswer | null) {
  const s = screens[start];
  return answer && s && isQuestion(s) ? { kind: answer, n: 0 } : null;
}

const demoStatus = (kind: DemoAnswer): AnswerStatus => ({ hasAnswer: true, isCorrect: kind === 'right' });

function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = useCourse();
  const reducedMotion = useReducedMotion();
  const presenting = usePresenting();
  const screens = lesson.screens;
  const questionCount = screens.filter(isQuestion).length;

  // Presenter deep links: start screen, pre-answered question, or straight to the end screen.
  const [jump] = useState(() => readLessonJump(screens.length));
  const [demo, setDemo] = useState<{ kind: DemoAnswer; n: number } | null>(() => initialDemo(screens, jump.start, jump.answer));
  const [index, setIndex] = useState(jump.start);
  /** Screen ids whose animation the student has engaged with. */
  const [engaged, setEngaged] = useState<ReadonlySet<string>>(() => new Set());
  /** The current question's answer, as last reported by the screen. */
  const [answer, setAnswer] = useState<AnswerStatus>(() => (demo ? demoStatus(demo.kind) : NO_ANSWER));
  /** Set once Check is pressed on the current question: the sheet is open and inputs lock. */
  const [checked, setChecked] = useState<AnswerStatus | null>(() => (demo ? demoStatus(demo.kind) : null));
  /** Set when the lesson is finished; null while playing. A presenter jump arrives already finished. */
  const [result, setResult] = useState<CompletionResult | null>(
    () => (presenting ? (location.state as { presentResult?: CompletionResult } | null)?.presentResult : null) ?? null,
  );
  // A presenter jump to the end screen shows a perfect run.
  const [correctCount, setCorrectCount] = useState(() => (result ? questionCount : demo?.kind === 'right' ? 1 : 0));
  const finished = result !== null;

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
      // In the event handler, not an effect, so StrictMode can't record it twice.
      setResult(recordLessonComplete(lesson.id, lesson.xp));
      sounds.complete();
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(NO_ANSWER);
    setChecked(null);
    setDemo(null);
  }, [isLast, lesson.id, lesson.xp]);

  // ---- presenter controls: move freely, fill in an answer, or end the lesson now
  const finishNow = () => {
    setResult(recordLessonComplete(lesson.id, lesson.xp));
    sounds.complete();
  };
  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(screens.length - 1, i)));
    setAnswer(NO_ANSWER);
    setChecked(null);
    setDemo(null);
  };
  const presenterAnswer = (kind: DemoAnswer) => {
    if (!question || checked) return;
    const status = demoStatus(kind);
    setDemo((d) => ({ kind, n: (d?.n ?? 0) + 1 }));
    setAnswer(status);
    setChecked(status);
    if (status.isCorrect) setCorrectCount((n) => n + 1);
    (status.isCorrect ? sounds.correct : sounds.wrong)();
  };

  const check = useCallback(() => {
    if (!canCheck) return;
    setChecked(answer);
    if (answer.isCorrect) setCorrectCount((n) => n + 1);
    (answer.isCorrect ? sounds.correct : sounds.wrong)();
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

  if (result) {
    const unit = course.units.find((u) => u.concepts.some((c) => c.lessonId === lesson.id));
    const unitDone = unit && unit.concepts[unit.concepts.length - 1]?.lessonId === lesson.id ? unit : undefined;
    return (
      <LessonComplete
        lesson={lesson}
        result={result}
        correct={correctCount}
        questions={questionCount}
        unitDone={unitDone}
        onContinue={() => navigate('/', { state: { justCompleted: lesson.id } })}
        onReview={() => navigate(`/lesson/${lesson.id}`)}
      />
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
        <PresenterButton />
        <SoundToggle />
      </header>

      {presenting && (
        <nav className="column present-bar" aria-label="Presenter controls">
          <button type="button" className="present-bar__btn" disabled={index === 0} onClick={() => goTo(index - 1)}>
            <Icon name="chevronLeft" size={16} /> Back
          </button>
          <button type="button" className="present-bar__btn" onClick={() => (isLast ? finishNow() : goTo(index + 1))}>
            {isLast ? 'Finish' : 'Next'} <Icon name="chevronRight" size={16} />
          </button>
          {question && !checked && (
            <>
              <button type="button" className="present-bar__btn present-bar__btn--good" onClick={() => presenterAnswer('right')}>
                <Icon name="check" size={16} /> Answer right
              </button>
              <button type="button" className="present-bar__btn present-bar__btn--bad" onClick={() => presenterAnswer('wrong')}>
                <Icon name="close" size={16} /> Answer wrong
              </button>
            </>
          )}
          <button type="button" className="present-bar__btn" onClick={finishNow}>
            <Icon name="skip" size={16} /> End lesson
          </button>
        </nav>
      )}

      <main className="player__body column">
        {/* Old screen slides out left, new one slides in from the right: 120 + 180 ms. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen.id}
            className={`player__screen${checked && !checked.isCorrect ? ' is-wrong' : ''}`}
            initial={reducedMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0, transition: { duration: reducedMotion ? 0 : 0.18, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -28, transition: { duration: 0.12, ease: 'easeIn' } }}
          >
            <ScreenView
              screen={screen}
              engaged={engaged.has(screen.id)}
              onEngaged={() => markEngaged(screen.id)}
              onAnswer={setAnswer}
              checked={!!checked}
              demo={demo}
            />
          </motion.div>
        </AnimatePresence>
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
  demo: { kind: DemoAnswer; n: number } | null;
}

function ScreenView({ screen, engaged, onEngaged, onAnswer, checked, demo }: ScreenViewProps) {
  switch (screen.type) {
    case 'animation':
      return <AnimationScreen screen={screen} engaged={engaged} onEngaged={onEngaged} />;
    case 'explanation':
      return <ExplanationScreen screen={screen} />;
    default:
      // A presenter answer remounts the question so it starts pre-filled.
      return <QuestionView key={`${screen.id}:${demo?.n ?? '-'}`} screen={screen} onAnswer={onAnswer} checked={checked} demo={demo?.kind} />;
  }
}

interface QuestionViewProps {
  screen: QuestionScreen;
  onAnswer: (s: AnswerStatus) => void;
  checked: boolean;
  demo?: DemoAnswer;
}

function QuestionView({ screen, onAnswer, checked, demo }: QuestionViewProps) {
  const props = { locked: checked, revealed: checked, onChange: onAnswer, demo };
  switch (screen.type) {
    case 'multiple-choice':
      return <MultipleChoice screen={screen} {...props} />;
    case 'numeric':
      return <Numeric screen={screen} {...props} />;
    case 'graph-tap':
      return <GraphTap screen={screen} {...props} />;
  }
}
