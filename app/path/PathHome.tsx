import { useEffect, useMemo, useRef, useState, type CSSProperties, type Ref } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathEntries, useCourse, type PathEntry } from '../course';
import { Button } from '../design/components';
import { Icon } from '../design/Icon';
import { useReducedMotion } from '../design/useReducedMotion';
import { nodeStates, type NodeState, type ProgressSnapshot } from '../progress/state';
import './path.css';

/** Horizontal offsets in px for a gentle wind. One full sway every 8 nodes. */
const SWAY = [0, 44, 70, 44, 0, -44, -70, -44];

const STATE_LABEL: Record<NodeState, string> = { done: 'done', current: 'up next', locked: 'locked' };

export function PathHome({ progress }: { progress: ProgressSnapshot }) {
  const loaded = useCourse();
  const entries = useMemo(() => pathEntries(loaded), [loaded]);
  const states = useMemo(() => nodeStates(entries, progress.completed), [entries, progress.completed]);
  const [openId, setOpenId] = useState<string | null>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  // Bring the current node into view on load.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
    // Only on mount: don't yank the page when progress changes underneath.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes the popover.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId]);

  const units = loaded.course.units.map((unit) => ({
    unit,
    items: entries.filter((e) => e.unit.id === unit.id),
  }));

  return (
    <main className="column path" onClick={() => setOpenId(null)}>
      {loaded.isExample && <p className="path__note">Example course. B's real lessons appear here once they land.</p>}
      {units.map(({ unit, items }, u) => (
        <section key={unit.id} className="unit" aria-labelledby={`unit-${unit.id}`}>
          <header className={`unit__header unit__header--${u % 3}`}>
            <span className="unit__eyebrow">Unit {u + 1}</span>
            <h2 id={`unit-${unit.id}`}>{unit.title}</h2>
            <p>{unit.description}</p>
          </header>
          <ol className="unit__nodes">
            {items.map((entry) => {
              const state = states[entry.index] ?? 'locked';
              return (
                <PathNode
                  key={entry.concept.id}
                  entry={entry}
                  state={state}
                  offset={SWAY[entry.index % SWAY.length] ?? 0}
                  open={openId === entry.concept.id}
                  onToggle={() => setOpenId((id) => (id === entry.concept.id ? null : entry.concept.id))}
                  buttonRef={state === 'current' ? currentRef : undefined}
                />
              );
            })}
          </ol>
        </section>
      ))}
      {states.length > 0 && states.every((s) => s === 'done') && (
        <p className="path__finished">
          <Icon name="sparkle" /> You finished every lesson. Replay any of them to keep them fresh.
        </p>
      )}
    </main>
  );
}

interface PathNodeProps {
  entry: PathEntry;
  state: NodeState;
  offset: number;
  open: boolean;
  onToggle: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}

function PathNode({ entry, state, offset, open, onToggle, buttonRef }: PathNodeProps) {
  const navigate = useNavigate();
  const { concept, lesson } = entry;
  const popoverId = `pop-${concept.id}`;
  const locked = state === 'locked';

  return (
    <li className={`node-row${state === 'current' ? ' node-row--current' : ''}`} style={{ '--offset': `${offset}px` } as CSSProperties}>
      <div className="node-wrap">
        {state === 'current' && !open && (
          <span className="node__start" aria-hidden>
            Start
          </span>
        )}
        <button
          ref={buttonRef}
          type="button"
          className={`node node--${state}${open ? ' is-open' : ''}`}
          aria-label={`${concept.title}, ${STATE_LABEL[state]}`}
          aria-disabled={locked || undefined}
          aria-expanded={locked ? undefined : open}
          aria-controls={locked ? undefined : popoverId}
          onClick={(e) => {
            e.stopPropagation();
            if (!locked) onToggle();
          }}
        >
          <Icon name={state === 'done' ? 'check' : state === 'locked' ? 'lock' : 'star'} size={state === 'locked' ? 26 : 32} />
        </button>
      </div>
      {open && !locked && (
        <div id={popoverId} className={`popover popover--${state}`} role="dialog" aria-label={concept.title} onClick={(e) => e.stopPropagation()}>
          <h3>{concept.title}</h3>
          <p className="popover__summary">{lesson.summary}</p>
          <p className="popover__meta">
            <span>
              <Icon name="clock" size={16} /> {lesson.estMinutes} min
            </span>
            <span>
              <Icon name="star" size={16} /> {lesson.xp} XP
            </span>
          </p>
          <Button block variant={state === 'done' ? 'secondary' : 'primary'} autoFocus onClick={() => navigate(`/lesson/${lesson.id}`)}>
            {state === 'done' ? 'Replay' : 'Start'}
          </Button>
        </div>
      )}
    </li>
  );
}
