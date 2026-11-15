import type { PathEntry } from '../course';

/** What the path needs from progress. The real store lands in #12; this shape stays. */
export interface ProgressSnapshot {
  completed: ReadonlySet<string>;
  xp: number;
  streak: number;
}

export type NodeState = 'locked' | 'current' | 'done';

/**
 * Linear unlocking in course order: done lessons are done, the first not-done
 * lesson is current, and everything after it is locked.
 */
export function nodeStates(entries: PathEntry[], completed: ReadonlySet<string>): NodeState[] {
  let currentFound = false;
  return entries.map(({ lesson }) => {
    if (completed.has(lesson.id)) return 'done';
    if (!currentFound) {
      currentFound = true;
      return 'current';
    }
    return 'locked';
  });
}
