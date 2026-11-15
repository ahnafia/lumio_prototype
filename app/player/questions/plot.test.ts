import { describe, expect, it } from 'vitest';
import { compileFn, gridLines, isTapCorrect, niceStep, sampleSegments } from './plot';

describe('sampleSegments', () => {
  it('draws a continuous function as one segment', () => {
    const f = compileFn('x^2')!;
    expect(sampleSegments(f, [-3, 3], [-1, 9])).toHaveLength(1);
  });

  it('breaks at a vertical asymptote', () => {
    const f = compileFn('1/(x-2)')!;
    expect(sampleSegments(f, [-3, 6], [-5, 5])).toHaveLength(2);
  });

  it('breaks where the function is undefined', () => {
    const f = compileFn('sqrt(x)')!;
    const segs = sampleSegments(f, [-2, 4], [-1, 3]);
    expect(segs).toHaveLength(1);
    expect(segs[0]![0]!.x).toBeGreaterThanOrEqual(0);
  });

  it('clips to the domain', () => {
    const f = compileFn('x')!;
    const [seg] = sampleSegments(f, [-5, 5], [-5, 5], [0, 2]);
    expect(seg![0]!.x).toBe(0);
    expect(seg![seg!.length - 1]!.x).toBe(2);
  });

  it('returns nothing for a bad expression', () => {
    expect(compileFn('x +* 2')).toBeNull();
  });
});

describe('grid', () => {
  it('picks nice steps', () => {
    expect(niceStep(6)).toBe(0.5);
    expect(niceStep(10)).toBe(1);
    expect(niceStep(40)).toBe(5);
  });
  it('lists interior lines', () => {
    expect(gridLines([-3, 3], 1)).toEqual([-2, -1, 0, 1, 2]);
  });
});

describe('isTapCorrect', () => {
  it('checks x, and y when given', () => {
    expect(isTapCorrect({ x: 0.2, y: 0.3 }, { x: 0, y: 0 }, 0.35)).toBe(true);
    expect(isTapCorrect({ x: 0.2, y: 0.5 }, { x: 0, y: 0 }, 0.35)).toBe(false);
    expect(isTapCorrect({ x: 0.2, y: 99 }, { x: 0 }, 0.35)).toBe(true);
    expect(isTapCorrect({ x: 0.5, y: 0 }, { x: 0 }, 0.35)).toBe(false);
  });
});
