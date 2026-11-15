import { defineLesson } from '@contract/schema';

const graph = {
  name: 'function-plot',
  params: {
    functions: [
      { expr: 'x + 1', domain: [-2, 1] },
      { expr: '4 - x', domain: [1, 4] },
    ],
    xRange: [-2, 4],
    yRange: [-1, 5],
    points: [
      { x: 1, y: 2, style: 'open' },
      { x: 1, y: 3 },
    ],
    yLabel: 'g',
  },
};

export default defineLesson({
  id: 'one-sided-limits',
  conceptId: 'one-sided-limits',
  title: 'One-sided limits from graphs',
  summary: 'Approach from the left, approach from the right, and compare.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Two sides, two answers',
      visual: { name: 'limit-approach', params: { expr: 'x <= 2 ? x + 1 : x - 2', a: 2, xRange: [0, 4], yRange: [-1, 4], valueAt: 3, digits: 4 } },
      caption: 'Slide toward $x = 2$. This time the left point and the right point settle at **different** heights.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'one-sided',
      title: 'One-sided limits',
      body: '$\\lim_{x \\to a^-} f(x)$ uses only $x < a$ (from the left). $\\lim_{x \\to a^+} f(x)$ uses only $x > a$.\n\nThe two-sided limit exists **only if** both one-sided limits exist and are equal.',
    },
    {
      type: 'multiple-choice',
      id: 'left-limit',
      prompt: 'Using the graph of $g$, what is $\\lim_{x \\to 1^-} g(x)$?',
      visual: graph,
      choices: [
        { id: 'two', text: '$2$' },
        { id: 'three', text: '$3$' },
        { id: 'one', text: '$1$' },
        { id: 'dne', text: 'It does not exist' },
      ],
      answer: 'two',
      feedback: {
        correct: 'Yes: from the left, the graph heads to the open circle at height $2$.',
        incorrect: 'From the left, follow $y = x + 1$ up to the open circle at height $2$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'two-sided',
      prompt: 'Using the same graph, what is $\\lim_{x \\to 1} g(x)$?',
      visual: graph,
      choices: [
        { id: 'dne', text: 'It does not exist' },
        { id: 'two', text: '$2$' },
        { id: 'three', text: '$3$' },
        { id: 'avg', text: '$2.5$' },
      ],
      answer: 'dne',
      feedback: {
        correct: 'Right: the left limit is $2$ and the right limit is $3$. They differ.',
        incorrect: 'From the left it\'s $2$, from the right $3$. They differ, so the limit does not exist.',
      },
    },
    {
      type: 'numeric',
      id: 'abs-over-x',
      prompt: 'Let $f(x) = \\frac{|x|}{x}$. Find $\\lim_{x \\to 0^-} f(x)$.',
      answer: -1,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: for $x < 0$, $|x| = -x$, so $f(x) = -1$.',
        incorrect: 'For $x < 0$, $|x| = -x$, so $\\frac{|x|}{x} = -1$ everywhere to the left. The limit is $-1$.',
      },
    },
  ],
});
