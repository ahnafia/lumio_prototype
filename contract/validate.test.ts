import { describe, expect, it } from 'vitest';
import exampleAnimation from './example/ExampleAnimation';
import { exampleEverything } from './example/example-lessons';
import { getExampleRawContent, getRawContent, listAnimations, loadCourse } from './load';
import type { LessonInput } from './schema';
import { formatProblems, validateContent, type RawContent } from './validate';

/** Fail with a readable list of every problem rather than an object diff. */
function expectValid(raw: RawContent) {
  const problems = validateContent(raw);
  if (problems.length > 0) throw new Error(`\n${problems.length} content problem(s):\n${formatProblems(problems)}\n`);
}

describe('content/ and animations/ (Cofounder B)', () => {
  it('every course file, lesson and animation passes the contract', () => {
    expectValid(getRawContent());
  });
});

describe('contract/example', () => {
  it('the example course is valid', () => {
    expectValid(getExampleRawContent());
  });

  it('the example lesson uses every screen type', () => {
    const types = new Set(exampleEverything.screens.map((s) => s.type));
    expect([...types].sort()).toEqual(['animation', 'explanation', 'graph-tap', 'multiple-choice', 'numeric']);
  });

  it('loadCourse falls back to the example while content/ is empty, and lists the example animation', () => {
    const { course, lessons } = loadCourse({ example: true });
    expect(course.units.length).toBeGreaterThan(0);
    expect(lessons['example-everything']?.xp).toBe(10);
    expect(listAnimations().map((a) => a.name)).toContain('example-parabola-slope');
  });
});

// ---------------------------------------------------------------- the validator itself

/** One-lesson content built around the example lesson, with `edit` applied. */
function withLesson(edit: (l: LessonInput) => LessonInput): RawContent {
  const lesson = edit(structuredClone(exampleEverything));
  return {
    course: {
      file: 'content/course.ts',
      data: {
        id: 't',
        title: 'T',
        units: [{ id: 'u', title: 'U', description: 'U', concepts: [{ id: lesson.conceptId, title: 'C', lessonId: lesson.id }] }],
      },
    },
    lessons: [{ file: 'content/u/l.lesson.ts', data: lesson }],
    animations: [{ file: 'contract/example/ExampleAnimation.tsx', data: exampleAnimation }],
  };
}

const messages = (raw: RawContent) => validateContent(raw).map((p) => `${p.path}: ${p.message}`);

describe('validator catches mistakes', () => {
  it('accepts the baseline', () => {
    expect(messages(withLesson((l) => l))).toEqual([]);
  });

  it('lesson must open with an animation', () => {
    const out = messages(withLesson((l) => ({ ...l, screens: [l.screens[1]!, l.screens[0]!, ...l.screens.slice(2)] })));
    expect(out.join('\n')).toMatch(/open with an "animation"/);
  });

  it('needs 2–3 questions and must end on one', () => {
    const out = messages(withLesson((l) => ({ ...l, screens: [l.screens[0]!, l.screens[1]!, l.screens[2]!, l.screens[1]!] })));
    expect(out.join('\n')).toMatch(/2 or 3 question screens/);
    expect(out.join('\n')).toMatch(/last screen must be a question/);
  });

  it('unknown animation names and bad params', () => {
    const out = messages(
      withLesson((l) => {
        const screens = structuredClone(l.screens);
        screens[0] = { ...screens[0]!, visual: { name: 'nope' } } as (typeof screens)[number];
        screens[1] = { ...screens[1]!, visual: { name: 'example-parabola-slope', params: { a: 99 } } } as (typeof screens)[number];
        return { ...l, screens };
      }),
    );
    expect(out.join('\n')).toMatch(/unknown animation "nope"/);
    expect(out.join('\n')).toMatch(/invalid params for "example-parabola-slope"/);
  });

  it('multiple-choice answer must be a choice id', () => {
    const out = messages(withLesson((l) => ({ ...l, screens: l.screens.map((s) => (s.type === 'multiple-choice' ? { ...s, answer: 'seven' } : s)) })));
    expect(out.join('\n')).toMatch(/"seven" is not one of the choice ids/);
  });

  it('broken math and unbalanced dollars', () => {
    const out = messages(
      withLesson((l) => ({
        ...l,
        screens: l.screens.map((s) => (s.type === 'numeric' ? { ...s, prompt: 'What is $\\frac{1}{2$?' } : s.type === 'graph-tap' ? { ...s, prompt: 'Cost: $5' } : s)),
      })),
    );
    expect(out.join('\n')).toMatch(/KaTeX can't render/);
    expect(out.join('\n')).toMatch(/unbalanced \$/);
  });

  it('graph-tap expressions must parse', () => {
    const out = messages(
      withLesson((l) => ({
        ...l,
        screens: l.screens.map((s) => (s.type === 'graph-tap' ? { ...s, plot: { ...s.plot, functions: [{ expr: 'x^^2' }] } } : s)),
      })),
    );
    expect(out.join('\n')).toMatch(/can't parse "x\^\^2"/);
  });

  it('feedback must fit on one line', () => {
    const long = 'x'.repeat(200);
    const out = messages(
      withLesson((l) => ({ ...l, screens: l.screens.map((s) => (s.type === 'numeric' ? { ...s, feedback: { correct: long, incorrect: 'no' } } : s)) })),
    );
    expect(out.join('\n')).toMatch(/one line/);
  });

  it('lessons must be on the path', () => {
    const raw = withLesson((l) => l);
    raw.lessons.push({ file: 'content/u/orphan.lesson.ts', data: { ...structuredClone(exampleEverything), id: 'orphan', conceptId: 'orphan-concept' } });
    expect(messages(raw).join('\n')).toMatch(/not on the path/);
  });
});
