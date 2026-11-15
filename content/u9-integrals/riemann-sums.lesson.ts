import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'riemann-sums',
  conceptId: 'riemann-sums',
  title: 'Riemann sums',
  summary: 'Approximate area with rectangles: left, right and midpoint.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Rectangles under a curve',
      visual: {
        name: 'riemann-sum',
        params: { expr: 'x^2', a: 0, b: 2, n: 4, nMax: 100, method: 'left', allowMethod: true, showExact: true, xRange: [-0.2, 2.3], yRange: [-0.5, 4.5] },
      },
      caption: 'Approximate the area under $y = x^2$ on $[0, 2]$ with rectangles. Switch between left, right and midpoint heights, then slide $n$ up.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Riemann sums',
      body: 'Split $[a, b]$ into $n$ pieces of width $\\Delta x = \\frac{b - a}{n}$. Pick a point $c_i$ in each piece and add up the rectangles:\n\n$$\\sum_{i=1}^{n} f(c_i)\\,\\Delta x.$$\n\nLeft, right and midpoint sums use the left ends, right ends or middles.',
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'An example',
      body: '$f(x) = x^2$ on $[0, 2]$ with $n = 4$, so $\\Delta x = 0.5$.\n\nRight sum: $0.5(0.25 + 1 + 2.25 + 4) = 3.75$.\nLeft sum: $0.5(0 + 0.25 + 1 + 2.25) = 1.75$.\n\nThe true area is $\\frac{8}{3} \\approx 2.67$.',
    },
    {
      type: 'numeric',
      id: 'left-sum',
      prompt: 'Compute the left Riemann sum for $f(x) = x^2$ on $[0, 3]$ with $n = 3$.',
      answer: 5,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\Delta x = 1$, so $1 \\cdot (f(0) + f(1) + f(2)) = 0 + 1 + 4 = 5$.',
        incorrect: '$\\Delta x = 1$ and the left ends are $0, 1, 2$: $f(0) + f(1) + f(2) = 0 + 1 + 4 = 5$.',
      },
    },
    {
      type: 'numeric',
      id: 'midpoint-sum',
      prompt: 'Compute the midpoint sum for $f(x) = x^2$ on $[0, 2]$ with $n = 2$.',
      answer: 2.5,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: midpoints $0.5$ and $1.5$, so $1 \\cdot (0.25 + 2.25) = 2.5$.',
        incorrect: '$\\Delta x = 1$, midpoints $0.5$ and $1.5$: $f(0.5) + f(1.5) = 0.25 + 2.25 = 2.5$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'under-over',
      prompt: 'For an **increasing** function, how does the left Riemann sum compare with the true area?',
      choices: [
        { id: 'under', text: 'It underestimates' },
        { id: 'over', text: 'It overestimates' },
        { id: 'equal', text: 'It is exactly equal' },
        { id: 'unknown', text: "You can't tell" },
      ],
      answer: 'under',
      feedback: {
        correct: 'Yes: each rectangle uses the lowest height on its piece.',
        incorrect: 'On an increasing function the left end is the lowest point of each piece, so the rectangles fall short.',
      },
    },
  ],
});
