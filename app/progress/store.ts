/**
 * Progress, persisted to localStorage under one versioned key. Pure functions on
 * top (unit-tested), a tiny external store underneath for React.
 */

export const STORAGE_KEY = 'lumio.progress.v1';

export interface Progress {
  completed: string[];
  xp: number;
  streak: { count: number; lastDay: string | null };
}

export const FRESH: Progress = { completed: [], xp: 0, streak: { count: 0, lastDay: null } };

// ---------------------------------------------------------------- days

/** The local calendar day as YYYY-MM-DD (not UTC: a late-night lesson counts for today). */
export function localDay(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Whole days from a to b (YYYY-MM-DD). UTC math on the date parts, so DST shifts don't matter. */
export function daysBetween(a: string, b: string): number {
  const pa = DAY.exec(a);
  const pb = DAY.exec(b);
  if (!pa || !pb) return NaN;
  const ua = Date.UTC(Number(pa[1]), Number(pa[2]) - 1, Number(pa[3]));
  const ub = Date.UTC(Number(pb[1]), Number(pb[2]) - 1, Number(pb[3]));
  return Math.round((ub - ua) / 86_400_000);
}

// ---------------------------------------------------------------- streak

/** The streak after being active on `today`: same day unchanged, next day +1, a gap (or first time) 1. */
export function bumpStreak(streak: Progress['streak'], today: string): Progress['streak'] {
  if (!streak.lastDay) return { count: 1, lastDay: today };
  const gap = daysBetween(streak.lastDay, today);
  if (gap === 0) return { count: Math.max(1, streak.count), lastDay: today };
  if (gap === 1) return { count: streak.count + 1, lastDay: today };
  // A gap, or a clock that went backwards: start again.
  return { count: 1, lastDay: today };
}

/** The streak to show: it's still alive if the student was active today or yesterday. */
export function currentStreak(streak: Progress['streak'], today: string): number {
  if (!streak.lastDay) return 0;
  const gap = daysBetween(streak.lastDay, today);
  return gap === 0 || gap === 1 ? streak.count : 0;
}

// ---------------------------------------------------------------- completing a lesson

/**
 * Mark a lesson done. XP is awarded the first time only; a replay earns 0 XP but
 * still counts as activity for the streak.
 */
export function completeLesson(p: Progress, lessonId: string, xp: number, today: string): { next: Progress; xpAwarded: number } {
  const first = !p.completed.includes(lessonId);
  const xpAwarded = first ? xp : 0;
  return {
    next: {
      completed: first ? [...p.completed, lessonId] : p.completed,
      xp: p.xp + xpAwarded,
      streak: bumpStreak(p.streak, today),
    },
    xpAwarded,
  };
}

// ---------------------------------------------------------------- parsing

/** Anything that isn't a well-formed v1 progress object becomes fresh progress. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return FRESH;
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object') return FRESH;
    const o = v as Record<string, unknown>;
    const completed = Array.isArray(o.completed) ? o.completed.filter((x): x is string => typeof x === 'string') : [];
    const xp = typeof o.xp === 'number' && Number.isFinite(o.xp) && o.xp >= 0 ? Math.floor(o.xp) : 0;
    const s = (o.streak ?? {}) as Record<string, unknown>;
    const count = typeof s.count === 'number' && Number.isFinite(s.count) && s.count >= 0 ? Math.floor(s.count) : 0;
    const lastDay = typeof s.lastDay === 'string' && DAY.test(s.lastDay) ? s.lastDay : null;
    return { completed: [...new Set(completed)], xp, streak: { count: lastDay ? count : 0, lastDay } };
  } catch {
    return FRESH;
  }
}

// ---------------------------------------------------------------- storage-backed store

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: Progress = FRESH;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (private mode etc.): behave as fresh
  }
}

/** Current progress. Returns the same object until storage changes (needed by useSyncExternalStore). */
export function getProgress(): Progress {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parseProgress(raw);
  }
  return cachedValue;
}

function write(next: Progress | null) {
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage full or blocked: keep going in memory for this session.
    cachedRaw = next ? JSON.stringify(next) : null;
    cachedValue = next ?? FRESH;
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab changed progress.
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export interface CompletionResult {
  xpAwarded: number;
  /** The streak after this lesson. */
  streak: number;
  /** True when this lesson grew the streak (the first lesson of a new day). */
  streakExtended: boolean;
}

/** Record a finished lesson. */
export function recordLessonComplete(lessonId: string, xp: number): CompletionResult {
  const today = localDay();
  const before = getProgress();
  const { next, xpAwarded } = completeLesson(before, lessonId, xp, today);
  write(next);
  return { xpAwarded, streak: next.streak.count, streakExtended: before.streak.lastDay !== today };
}

/** Wipe all progress (Reset). */
export function resetProgress() {
  write(null);
}
