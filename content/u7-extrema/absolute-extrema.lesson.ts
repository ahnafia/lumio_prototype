import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'absolute-extrema',
  conceptId: 'absolute-extrema',
  title: 'Absolute extrema',
  summary: 'The Extreme Value Theorem and the closed interval method.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Highest and lowest',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x^3 - 3x^2 + 1', domain: [-1, 4] }],
          xRange: [-1.5, 4.5],
          yRange: [-5, 19],
          points: [
            { x: -1, y: -3 },
            { x: 4, y: 17 },
          ],
          trace: { fn: 0, start: -0.8, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Drag along $f(x) = x^3 - 3x^2 + 1$ on $[-1, 4]$. Where is it highest? Lowest? Check the flat spots **and** the ends.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'evt',
      title: 'Extreme Value Theorem',
      body: 'If $f$ is **continuous** on a **closed** interval $[a, b]$, then $f$ has both an absolute maximum and an absolute minimum on $[a, b]$.',
    },
    {
      type: 'explanation',
      id: 'method',
      title: 'Closed interval method',
      body: '1. Find the critical values of $f$ in $(a, b)$.\n2. Evaluate $f$ at them and at the endpoints $a$ and $b$.\n3. The largest value is the absolute max; the smallest is the absolute min.',
    },
    {
      type: 'numeric',
      id: 'abs-max',
      prompt: 'Find the absolute maximum **value** of $f(x) = x^3 - 3x^2 + 1$ on $[-1, 4]$.',
      answer: 17,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: candidates $f(-1) = -3$, $f(0) = 1$, $f(2) = -3$, $f(4) = 17$. The max is at the endpoint.',
        incorrect: "$f'(x) = 3x(x - 2)$. Check $f(-1) = -3$, $f(0) = 1$, $f(2) = -3$, $f(4) = 17$: the max is $17$.",
      },
    },
    {
      type: 'numeric',
      id: 'abs-min',
      prompt: 'Find the absolute minimum value of $f(x) = x^2 - 4x + 1$ on $[0, 5]$.',
      answer: -3,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $f(2) = -3$ beats $f(0) = 1$ and $f(5) = 6$.',
        incorrect: "$f'(x) = 2x - 4 = 0$ at $x = 2$. Compare $f(0) = 1$, $f(2) = -3$, $f(5) = 6$: the min is $-3$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'evt-applies',
      prompt: 'For which function does the Extreme Value Theorem guarantee an absolute max and min?',
      choices: [
        { id: 'right', text: '$x^2$ on $[-1, 3]$' },
        { id: 'discontinuous', text: '$\\frac{1}{x}$ on $[-1, 1]$' },
        { id: 'open', text: '$x^2$ on $(-1, 3)$' },
        { id: 'unbounded', text: '$x^3$ on $(-\\infty, \\infty)$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: continuous on a closed, bounded interval.',
        incorrect: 'The EVT needs continuity **and** a closed interval $[a, b]$. Only $x^2$ on $[-1, 3]$ has both.',
      },
    },
  ],
});
