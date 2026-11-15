import type { ProgressSnapshot } from './state';

const EMPTY: ProgressSnapshot = { completed: new Set(), xp: 0, streak: 0 };

/** STUB until #12: fresh progress. The path and top bar read progress only through this hook. */
export function useProgress(): ProgressSnapshot {
  return EMPTY;
}
