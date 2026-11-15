import { describe, expect, it } from 'vitest';
import { isWithin, parseNumber } from './parseNumber';

describe('parseNumber', () => {
  it.each([
    ['-3', -3],
    ['0.25', 0.25],
    ['1/4', 0.25],
    ['-1/2', -0.5],
    [' 2 ', 2],
    ['.5', 0.5],
    ['3 / 4', 0.75],
    ['−2', -2],
    ['+7', 7],
  ])('parses %j as %d', (input, expected) => {
    expect(parseNumber(input)).toBeCloseTo(expected);
  });

  it.each(['abc', '', ' ', '-', '1/', '/2', '1/0', '1//2', '2x', '1e3', '--1', '1/2/3'])('rejects %j', (input) => {
    expect(parseNumber(input)).toBeNull();
  });
});

describe('isWithin', () => {
  it('accepts values inside the tolerance and rejects the rest', () => {
    expect(isWithin(-2, -2, 0.001)).toBe(true);
    expect(isWithin(0.3333, 1 / 3, 0.0001)).toBe(true);
    expect(isWithin(0.33, 1 / 3, 0.0001)).toBe(false);
    expect(isWithin(6, 6, 0)).toBe(true);
  });
});
