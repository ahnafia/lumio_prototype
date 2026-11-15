import { useMemo, useSyncExternalStore } from 'react';
import type { ProgressSnapshot } from './state';
import { currentStreak, FRESH, getProgress, localDay, subscribe } from './store';

/** Live progress for the path and top bar. Re-renders on any change, including from another tab. */
export function useProgress(): ProgressSnapshot {
  const p = useSyncExternalStore(subscribe, getProgress, () => FRESH);
  return useMemo(
    () => ({ completed: new Set(p.completed), xp: p.xp, streak: currentStreak(p.streak, localDay()) }),
    [p],
  );
}
