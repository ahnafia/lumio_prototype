import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import type { Screen } from '@contract/schema';
import { pathEntries, useCourse } from '../course';
import { ConfirmDialog } from '../design/ConfirmDialog';
import { Icon } from '../design/Icon';
import { plainText } from '../design/RichText';
import { fillProgress, recordLessonComplete, resetProgress } from '../progress/store';
import { firstOfEachType, lessonLink, setPresenting, usePresenting } from './presenter';
import './present.css';

const TYPE_LABELS: [Screen['type'], string][] = [
  ['animation', 'Animation'],
  ['explanation', 'Explanation'],
  ['multiple-choice', 'Multiple choice'],
  ['numeric', 'Numeric answer'],
  ['graph-tap', 'Tap the graph'],
];

/** The top-bar button that opens the presenter panel. Renders nothing unless presenting. */
export function PresenterButton() {
  const presenting = usePresenting();
  const [open, setOpen] = useState(false);
  if (!presenting) return null;
  return (
    <>
      <button type="button" className="icon-btn present-btn" aria-label="Open presenter panel" aria-expanded={open} onClick={() => setOpen(true)}>
        <Icon name="present" size={22} />
      </button>
      {/* Portal: the top bar's backdrop-filter would otherwise trap this fixed panel inside it. */}
      {open && createPortal(<PresenterPanel onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function PresenterPanel({ onClose }: { onClose: () => void }) {
  const loaded = useCourse();
  const entries = useMemo(() => pathEntries(loaded), [loaded]);
  const examples = useMemo(() => firstOfEachType(entries), [entries]);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const firstLesson = entries[0];
  const firstUnit = loaded.course.units[0];
  const lastOfFirstUnit = firstUnit ? entries.filter((e) => e.unit.id === firstUnit.id).at(-1) : undefined;
  const mc = examples['multiple-choice'];

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const go = (to: string, state?: unknown) => {
    onClose();
    navigate(to, { state });
  };

  /** Finish a lesson now (records it, like playing it would) and show its end screen. */
  const showEnd = (lessonId: string, xp: number) => {
    const result = recordLessonComplete(lessonId, xp);
    // Show it like a fresh, perfect finish even if it was done before (display only).
    go(lessonLink(lessonId), { presentResult: { ...result, xpAwarded: result.xpAwarded || xp } });
  };

  const unitLessons = (count: number) =>
    entries.filter((e) => loaded.course.units.slice(0, count).some((u) => u.id === e.unit.id)).map((e) => ({ id: e.lesson.id, xp: e.lesson.xp }));

  return (
    <div className="present-scrim" onClick={onClose}>
      <aside
        ref={panelRef}
        className="present-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Presenter panel"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="present-panel__head">
          <div>
            <span className="present-panel__eyebrow">Presenter</span>
            <h2>Jump anywhere</h2>
          </div>
          <button type="button" className="icon-btn" aria-label="Close presenter panel" onClick={onClose}>
            <Icon name="close" size={22} />
          </button>
        </header>

        <section className="present-section">
          <h3>Tour</h3>
          <div className="present-grid">
            <PanelButton icon="star" label="Path home" onClick={() => go('/', { scrollTop: true })} />
            {firstLesson && <PanelButton icon="play" label="Start lesson 1" onClick={() => go(lessonLink(firstLesson.lesson.id))} />}
          </div>
        </section>

        <section className="present-section">
          <h3>Each screen type</h3>
          <div className="present-grid">
            {TYPE_LABELS.map(([type, label]) => {
              const ex = examples[type];
              return ex ? (
                <PanelButton
                  key={type}
                  icon={type === 'animation' ? 'sparkle' : type === 'explanation' ? 'menu' : type === 'graph-tap' ? 'target' : 'check'}
                  label={label}
                  hint={plainText(ex.entry.concept.title)}
                  onClick={() => go(lessonLink(ex.entry.lesson.id, ex.index))}
                />
              ) : null;
            })}
          </div>
        </section>

        <section className="present-section">
          <h3>Moments</h3>
          <div className="present-grid">
            {mc && (
              <>
                <PanelButton icon="check" tone="good" label="Correct answer" onClick={() => go(lessonLink(mc.entry.lesson.id, mc.index, 'right'))} />
                <PanelButton icon="refresh" tone="bad" label="Not quite" onClick={() => go(lessonLink(mc.entry.lesson.id, mc.index, 'wrong'))} />
              </>
            )}
            {firstLesson && (
              <PanelButton icon="sparkle" label="Celebration" onClick={() => showEnd(firstLesson.lesson.id, firstLesson.lesson.xp)} />
            )}
            {lastOfFirstUnit && (
              <PanelButton icon="star" label="Unit complete" onClick={() => showEnd(lastOfFirstUnit.lesson.id, lastOfFirstUnit.lesson.xp)} />
            )}
          </div>
        </section>

        <section className="present-section">
          <h3>Jump to a unit</h3>
          <ol className="present-units">
            {loaded.course.units.map((unit, i) => {
              const first = entries.find((e) => e.unit.id === unit.id);
              return (
                <li key={unit.id}>
                  <button type="button" className="present-unit" onClick={() => go('/', { scrollToUnit: unit.id })}>
                    <span className="present-unit__num">{i + 1}</span>
                    <span className="present-unit__title">{plainText(unit.title)}</span>
                  </button>
                  {first && (
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Start ${plainText(first.concept.title)}`}
                      onClick={() => go(lessonLink(first.lesson.id))}
                    >
                      <Icon name="play" size={18} />
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="present-section">
          <h3>Progress</h3>
          <div className="present-grid">
            <PanelButton icon="check" label="Finish units 1–2" hint="Shows done nodes, XP, streak" onClick={() => {
              fillProgress(unitLessons(2));
              go('/', { scrollTop: false });
            }} />
            <PanelButton icon="refresh" tone="bad" label="Reset progress" onClick={() => setConfirmReset(true)} />
          </div>
        </section>

        <footer className="present-panel__foot">
          <p>Every node is open while presenting. Inside a lesson, use the bar under the progress to skip or answer.</p>
          <button
            type="button"
            className="present-off"
            onClick={() => {
              setPresenting(false);
              onClose();
            }}
          >
            Turn off presenter mode
          </button>
        </footer>
      </aside>
      <ConfirmDialog
        open={confirmReset}
        title="Reset all progress?"
        body="Clears completed lessons, XP and streak on this device."
        confirmLabel="Reset"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetProgress();
          setConfirmReset(false);
          go('/', { scrollTop: true });
        }}
      />
    </div>
  );
}

function PanelButton({
  icon,
  label,
  hint,
  tone,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  hint?: string;
  tone?: 'good' | 'bad';
  onClick: () => void;
}) {
  return (
    <button type="button" className={`present-tile${tone ? ` present-tile--${tone}` : ''}`} onClick={onClick}>
      <Icon name={icon} size={18} />
      <span className="present-tile__label">{label}</span>
      {hint && <span className="present-tile__hint">{hint}</span>}
    </button>
  );
}
