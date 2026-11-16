import { useSyncExternalStore } from 'react';
import type { Screen } from '@contract/schema';
import type { PathEntry } from '../course';

/**
 * Presenter mode: a demo aid, off by default. Turn it on from the ⋮ menu or with
 * `?present` in the URL (`?present=0` turns it off). Remembered on this device.
 * While on, every node is open, lessons get skip/answer controls, and the
 * presenter panel can jump straight to any part of the prototype.
 */

const KEY = 'lumio.present.v1';
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function urlParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
  return hash.get(name) ?? search.get(name);
}

function initial(): boolean {
  if (typeof window === 'undefined') return false;
  const param = urlParam('present');
  if (param !== null) {
    const on = param !== '0' && param !== 'false';
    persist(on);
    return on;
  }
  return readStored();
}

function persist(on: boolean) {
  try {
    if (on) window.localStorage.setItem(KEY, '1');
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: presenter mode lasts for this page only.
  }
}

let presenting = initial();

export function isPresenting() {
  return presenting;
}

export function setPresenting(on: boolean) {
  presenting = on;
  persist(on);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function usePresenting(): boolean {
  return useSyncExternalStore(subscribe, isPresenting, () => false);
}

// ---------------------------------------------------------------- deep links

export type DemoAnswer = 'right' | 'wrong';

/** Lesson URL query for presenter jumps: `?s=` start screen, `?a=` auto-answer it. */
export function lessonLink(lessonId: string, screen?: number, answer?: DemoAnswer): string {
  const q = new URLSearchParams();
  if (screen !== undefined && screen > 0) q.set('s', String(screen));
  if (answer) q.set('a', answer);
  const qs = q.toString();
  return `/lesson/${lessonId}${qs ? `?${qs}` : ''}`;
}

/** Read the presenter jump params from the current URL. Ignored unless presenting (or in dev for `s`). */
export function readLessonJump(screenCount: number): { start: number; answer: DemoAnswer | null } {
  const allow = presenting || import.meta.env.DEV;
  const s = Number(urlParam('s'));
  const a = urlParam('a');
  return {
    start: allow && Number.isInteger(s) && s > 0 && s < screenCount ? s : 0,
    answer: presenting && (a === 'right' || a === 'wrong') ? a : null,
  };
}

/** The first place in path order where each screen type appears: for "show me a …" buttons. */
export function firstOfEachType(entries: PathEntry[]): Partial<Record<Screen['type'], { entry: PathEntry; index: number }>> {
  const found: Partial<Record<Screen['type'], { entry: PathEntry; index: number }>> = {};
  for (const entry of entries) {
    entry.lesson.screens.forEach((screen, index) => {
      found[screen.type] ??= { entry, index };
    });
  }
  return found;
}
