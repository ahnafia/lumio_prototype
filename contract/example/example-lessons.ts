import { defineLesson, type LessonInput } from '../schema';

/**
 * EXAMPLE LESSONS: the reference for the content schema.
 *
 * `exampleEverything` uses every screen type once and is the lesson A builds the
 * player against. The three mini lessons exist so the example path has enough nodes
 * to show the locked, current and done states.
 *
 * Math check: for y = x², the tangent slope at x = a is 2a.
 */

export const exampleEverything = defineLesson({
  id: 'example-everything',
  conceptId: 'example-slope-of-a-parabola',
  title: 'Slope of a parabola',
  summary: 'Every screen type in one short lesson.',
  estMinutes: 3,
  xp: 10,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Feel the steepness',
      visual: { name: 'example-parabola-slope' },
      caption: 'Drag the point along $y = x^2$. Watch the tangent line tilt as you go.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'the-idea',
      title: 'Slope at a point',
      body: 'The **tangent line** touches the curve at one point and matches its steepness there.\n\nFor $y = x^2$, the tangent slope at $x = a$ is $2a$.',
      visual: { name: 'example-parabola-slope', params: { autoplay: false, x0: 1 } },
    },
    {
      type: 'multiple-choice',
      id: 'slope-at-3',
      prompt: 'What is the slope of the tangent line to $y = x^2$ at $x = 3$?',
      choices: [
        { id: 'three', text: '$3$' },
        { id: 'six', text: '$6$' },
        { id: 'nine', text: '$9$' },
        { id: 'one-third', text: '$\\frac{1}{3}$' },
      ],
      answer: 'six',
      feedback: {
        correct: 'Yes. The slope is $2a = 2 \\cdot 3 = 6$.',
        incorrect: 'The slope at $x = a$ is $2a$, so at $x = 3$ it is $6$. ($9$ is the height.)',
      },
    },
    {
      type: 'numeric',
      id: 'where-slope-is-minus-4',
      prompt: 'At what $x$ is the tangent slope of $y = x^2$ equal to $-4$?',
      answer: -2,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $2a = -4$ gives $a = -2$.',
        incorrect: 'Solve $2a = -4$. The answer is $x = -2$.',
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-the-flat-spot',
      prompt: 'Tap the point on $y = x^2$ where the tangent line is flat.',
      plot: {
        functions: [{ expr: 'x^2', label: '$y = x^2$' }],
        xRange: [-3, 3],
        yRange: [-1, 9],
      },
      target: { x: 0, y: 0 },
      tolerance: 0.35,
      feedback: {
        correct: 'Exactly. At $x = 0$ the slope is $2 \\cdot 0 = 0$.',
        incorrect: 'A flat tangent means slope $0$. Solve $2a = 0$: the bottom of the bowl, $(0, 0)$.',
      },
    },
  ],
});

/** A four-screen lesson: animation, explanation, multiple choice, numeric. */
function miniLesson(n: number, k: number): LessonInput {
  return defineLesson({
    id: `example-mini-${n}`,
    conceptId: `example-concept-${n}`,
    title: `Slope at x = ${k}`,
    summary: `A tiny lesson about the slope of y = x² at x = ${k}.`,
    estMinutes: 3,
    screens: [
      {
        type: 'animation',
        id: 'see-it',
        visual: { name: 'example-parabola-slope', params: { x0: 0, autoplay: false } },
        caption: 'Drag the point and watch the slope readout change.',
      },
      {
        type: 'explanation',
        id: 'rule',
        title: 'The rule',
        body: 'For $y = x^2$, the slope at $x = a$ is $2a$.',
      },
      {
        type: 'multiple-choice',
        id: 'pick',
        prompt: `What is the slope of $y = x^2$ at $x = ${k}$?`,
        choices: [
          { id: 'a', text: `$${k}$` },
          { id: 'b', text: `$${2 * k}$` },
          { id: 'c', text: `$${2 * k + 1}$` },
          { id: 'd', text: `$${-2 * k}$` },
        ],
        answer: 'b',
        feedback: { correct: `Yes: $2 \\cdot ${k} = ${2 * k}$.`, incorrect: `Double it: $2 \\cdot ${k} = ${2 * k}$.` },
      },
      {
        type: 'numeric',
        id: 'type',
        prompt: `What is the slope of $y = x^2$ at $x = -${k}$?`,
        answer: -2 * k,
        tolerance: 0.001,
        feedback: { correct: `Right: $2 \\cdot (-${k}) = ${-2 * k}$.`, incorrect: `It's $2 \\cdot (-${k}) = ${-2 * k}$.` },
      },
    ],
  });
}

export const exampleLessons: LessonInput[] = [exampleEverything, miniLesson(1, 1), miniLesson(2, 2), miniLesson(3, 4)];
