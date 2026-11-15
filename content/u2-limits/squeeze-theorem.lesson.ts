import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'squeeze-theorem',
  conceptId: 'squeeze-theorem',
  title: 'The Squeeze Theorem',
  summary: 'Trap a function between two others, and get the key limit sin x / x.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Trapped',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: 'x^2 * sin(1/x)', label: 'f' },
            { expr: 'x^2', color: 'secondary', dashed: true, label: 'x²' },
            { expr: '-x^2', color: 'secondary', dashed: true, label: '−x²' },
          ],
          xRange: [-0.5, 0.5],
          yRange: [-0.3, 0.3],
          trace: { fn: 0, start: -0.45, tangent: false },
          autoplay: true,
        },
      },
      caption: 'The wiggly $f(x) = x^2 \\sin(1/x)$ is trapped between $-x^2$ and $x^2$. Drag toward $x = 0$: both walls close in on $0$, so $f$ must too.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'theorem',
      title: 'The Squeeze Theorem',
      body: 'If $g(x) \\le f(x) \\le h(x)$ for $x$ near $a$, and\n\n$$\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L,$$\n\nthen $\\lim_{x \\to a} f(x) = L$ too.',
    },
    {
      type: 'explanation',
      id: 'sinx-over-x',
      title: 'A key trig limit',
      body: 'Squeezing proves $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ ($x$ in radians).\n\nRescale to use it: $\\lim_{x \\to 0} \\frac{\\sin 5x}{x} = 5 \\lim_{x \\to 0} \\frac{\\sin 5x}{5x} = 5$.',
    },
    {
      type: 'numeric',
      id: 'sin3x',
      prompt: 'Find $\\lim_{x \\to 0} \\dfrac{\\sin(3x)}{x}$.',
      answer: 3,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $3 \\cdot \\frac{\\sin 3x}{3x} \\to 3 \\cdot 1 = 3$.',
        incorrect: 'Write it as $3 \\cdot \\frac{\\sin 3x}{3x}$. The fraction goes to $1$, so the limit is $3$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'squeeze-use',
      prompt: 'Suppose $3 - x^2 \\le f(x) \\le 3 + x^2$ for all $x$. What is $\\lim_{x \\to 0} f(x)$?',
      choices: [
        { id: 'three', text: '$3$' },
        { id: 'zero', text: '$0$' },
        { id: 'six', text: '$6$' },
        { id: 'unknown', text: "Can't tell without a formula for $f$" },
      ],
      answer: 'three',
      feedback: {
        correct: 'Right: both bounds go to $3$, so $f$ is squeezed to $3$.',
        incorrect: '$3 - x^2 \\to 3$ and $3 + x^2 \\to 3$, so by the Squeeze Theorem the limit is $3$.',
      },
    },
    {
      type: 'numeric',
      id: 'ratio-of-sines',
      prompt: 'Find $\\lim_{x \\to 0} \\dfrac{\\sin(4x)}{\\sin(2x)}$.',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\frac{4x \\cdot \\frac{\\sin 4x}{4x}}{2x \\cdot \\frac{\\sin 2x}{2x}} \\to \\frac{4x}{2x} = 2$.',
        incorrect: 'Near $0$, $\\sin 4x \\approx 4x$ and $\\sin 2x \\approx 2x$, so the ratio goes to $\\frac{4}{2} = 2$.',
      },
    },
  ],
});
