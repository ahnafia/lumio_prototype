import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'definite-integral',
  conceptId: 'definite-integral',
  title: 'The definite integral',
  summary: 'The limit of Riemann sums, and signed area.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Take the limit',
      visual: {
        name: 'riemann-sum',
        params: { expr: 'x^2 - 1', a: 0, b: 2, n: 4, nMax: 100, method: 'right', allowMethod: true, showExact: true, xRange: [-0.2, 2.3], yRange: [-1.5, 3.5] },
      },
      caption: 'Slide $n$ up for $y = x^2 - 1$ on $[0, 2]$. Rectangles below the axis count as negative. As $n$ grows, every kind of sum settles on one number: the definite integral.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'The definite integral',
      body: '$$\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(c_i)\\,\\Delta x$$\n\nFor continuous $f$, left, right and midpoint sums all approach this same limit.',
    },
    {
      type: 'explanation',
      id: 'signed',
      title: 'Signed area',
      body: 'The integral counts area above the $x$-axis as positive and below as negative:\n\n$$\\int_a^b f(x)\\,dx = (\\text{area above}) - (\\text{area below}).$$',
    },
    {
      type: 'numeric',
      id: 'triangles',
      prompt: 'Use geometry to find $\\int_0^4 (x - 2)\\,dx$.',
      answer: 0,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: a triangle of area 2 below the axis and one of area 2 above cancel.',
        incorrect: 'From 0 to 2 the triangle below has area 2; from 2 to 4 the one above has area 2. Net: $0$.',
      },
    },
    {
      type: 'numeric',
      id: 'semicircle',
      prompt: 'Use geometry to find $\\int_{-3}^{3} \\sqrt{9 - x^2}\\,dx$. Round to 2 decimal places.',
      answer: 14.14,
      tolerance: 0.01,
      feedback: {
        correct: 'Right: the upper half of a radius-3 circle, $\\frac{9\\pi}{2} \\approx 14.14$.',
        incorrect: '$y = \\sqrt{9 - x^2}$ is a semicircle of radius 3, with area $\\frac{1}{2}\\pi(3)^2 = \\frac{9\\pi}{2} \\approx 14.14$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'as-limit',
      prompt: 'Which limit of right Riemann sums equals $\\int_1^3 x^3\\,dx$?',
      choices: [
        { id: 'right', text: '$\\displaystyle\\lim_{n \\to \\infty} \\sum_{i=1}^{n} \\left(1 + \\frac{2i}{n}\\right)^3 \\frac{2}{n}$' },
        { id: 'width', text: '$\\displaystyle\\lim_{n \\to \\infty} \\sum_{i=1}^{n} \\left(1 + \\frac{i}{n}\\right)^3 \\frac{2}{n}$' },
        { id: 'start', text: '$\\displaystyle\\lim_{n \\to \\infty} \\sum_{i=1}^{n} \\left(\\frac{2i}{n}\\right)^3 \\frac{2}{n}$' },
        { id: 'dx', text: '$\\displaystyle\\lim_{n \\to \\infty} \\sum_{i=1}^{n} \\left(1 + \\frac{2i}{n}\\right)^3 \\frac{1}{n}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $\\Delta x = \\frac{2}{n}$ and the right ends are $x_i = 1 + \\frac{2i}{n}$.',
        incorrect: '$\\Delta x = \\frac{3 - 1}{n} = \\frac{2}{n}$, and the $i$th right end is $1 + i\\Delta x = 1 + \\frac{2i}{n}$.',
      },
    },
  ],
});
