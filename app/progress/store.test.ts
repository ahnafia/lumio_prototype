import { describe, expect, it } from 'vitest';
import { bumpStreak, completeLesson, currentStreak, daysBetween, FRESH, localDay, parseProgress } from './store';

describe('streak', () => {
  const s = (count: number, lastDay: string | null) => ({ count, lastDay });

  it('starts at 1 the first time', () => {
    expect(bumpStreak(s(0, null), '2026-11-14')).toEqual(s(1, '2026-11-14'));
  });
  it('is unchanged on the same day', () => {
    expect(bumpStreak(s(3, '2026-11-14'), '2026-11-14')).toEqual(s(3, '2026-11-14'));
  });
  it('adds 1 on the next day', () => {
    expect(bumpStreak(s(3, '2026-11-14'), '2026-11-15')).toEqual(s(4, '2026-11-15'));
  });
  it('resets to 1 after a gap', () => {
    expect(bumpStreak(s(9, '2026-11-12'), '2026-11-14')).toEqual(s(1, '2026-11-14'));
  });
  it('crosses a month boundary', () => {
    expect(bumpStreak(s(2, '2026-01-31'), '2026-02-01')).toEqual(s(3, '2026-02-01'));
    expect(bumpStreak(s(2, '2026-02-28'), '2026-03-01')).toEqual(s(3, '2026-03-01'));
    expect(bumpStreak(s(2, '2028-02-28'), '2028-03-01')).toEqual(s(1, '2028-03-01')); // leap year: Feb 29 was skipped
  });
  it('crosses a year boundary', () => {
    expect(bumpStreak(s(5, '2026-12-31'), '2027-01-01')).toEqual(s(6, '2027-01-01'));
  });
  it('survives a DST change (US, 2026-11-01)', () => {
    expect(daysBetween('2026-10-31', '2026-11-01')).toBe(1);
    expect(daysBetween('2026-03-07', '2026-03-08')).toBe(1);
  });
  it('restarts if the clock went backwards', () => {
    expect(bumpStreak(s(4, '2026-11-14'), '2026-11-10')).toEqual(s(1, '2026-11-10'));
  });
  it('shows 0 once a day has been missed', () => {
    expect(currentStreak(s(4, '2026-11-14'), '2026-11-14')).toBe(4);
    expect(currentStreak(s(4, '2026-11-14'), '2026-11-15')).toBe(4);
    expect(currentStreak(s(4, '2026-11-14'), '2026-11-16')).toBe(0);
    expect(currentStreak(s(0, null), '2026-11-16')).toBe(0);
  });
});

describe('localDay', () => {
  it('uses the local calendar date', () => {
    expect(localDay(new Date(2026, 10, 14, 23, 59))).toBe('2026-11-14');
    expect(localDay(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });
});

describe('completeLesson', () => {
  it('awards XP once and marks the lesson done', () => {
    const first = completeLesson(FRESH, 'a', 10, '2026-11-14');
    expect(first.xpAwarded).toBe(10);
    expect(first.next).toEqual({ completed: ['a'], xp: 10, streak: { count: 1, lastDay: '2026-11-14' } });
    const replay = completeLesson(first.next, 'a', 10, '2026-11-15');
    expect(replay.xpAwarded).toBe(0);
    expect(replay.next.xp).toBe(10);
    expect(replay.next.completed).toEqual(['a']);
    expect(replay.next.streak).toEqual({ count: 2, lastDay: '2026-11-15' });
  });
});

describe('parseProgress', () => {
  it('treats missing or corrupt data as fresh', () => {
    expect(parseProgress(null)).toEqual(FRESH);
    expect(parseProgress('{not json')).toEqual(FRESH);
    expect(parseProgress('42')).toEqual(FRESH);
    expect(parseProgress('null')).toEqual(FRESH);
  });
  it('keeps the valid parts of a damaged value', () => {
    expect(parseProgress(JSON.stringify({ completed: ['a', 3, 'a', 'b'], xp: -5, streak: { count: 'x', lastDay: 'yesterday' } }))).toEqual({
      completed: ['a', 'b'],
      xp: 0,
      streak: { count: 0, lastDay: null },
    });
  });
  it('round-trips a valid value', () => {
    const p = { completed: ['a'], xp: 20, streak: { count: 2, lastDay: '2026-11-14' } };
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
  });
});
