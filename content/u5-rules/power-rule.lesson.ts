import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'power-rule',
  conceptId: 'power-rule',
  title: 'Power, sum and constant rules',
  summary: 'Differentiate any polynomial in one pass.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A pattern in the slopes',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x^3' }],
          xRange: [-2, 2],
          yRange: [-6, 6],
          trace: { fn: 0, start: -1.6, tangent: true },
          readouts: [{ label: '3x²', expr: '3x^2' }],
          autoplay: true,
        },
      },
      caption: 'Drag along $y = x^3$ and compare the tangent slope with $3x^2$. They always match.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'power',
      title: 'The power rule',
      body: '$$\\frac{d}{dx}x^n = nx^{n-1}$$ for any real number $n$.\n\nSo $\\frac{d}{dx}x^5 = 5x^4$, $\\frac{d}{dx}\\sqrt{x} = \\frac{1}{2}x^{-1/2}$, and $\\frac{d}{dx}\\frac{1}{x} = -x^{-2}$.',
    },
    {
      type: 'explanation',
      id: 'rules',
      title: 'Constants, multiples and sums',
      body: '$\\frac{d}{dx}c = 0$, $\\;\\frac{d}{dx}[c\\,f(x)] = c\\,f\'(x)$, $\\;\\frac{d}{dx}[f \\pm g] = f\' \\pm g\'$.\n\nSo polynomials go term by term: $\\frac{d}{dx}(4x^3 - 5x + 7) = 12x^2 - 5$.',
    },
    {
      type: 'multiple-choice',
      id: 'polynomial',
      prompt: 'Find $\\dfrac{d}{dx}\\left(6x^4 - 3x^2 + 8\\right)$.',
      choices: [
        { id: 'right', text: '$24x^3 - 6x$' },
        { id: 'constant', text: '$24x^3 - 6x + 8$' },
        { id: 'no-multiply', text: '$6x^3 - 3x$' },
        { id: 'no-lower', text: '$24x^4 - 6x^2$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $4 \\cdot 6x^3 - 2 \\cdot 3x + 0$.',
        incorrect: 'Bring each power down and lower it by one; the constant 8 becomes 0: $24x^3 - 6x$.',
      },
    },
    {
      type: 'numeric',
      id: 'roots-and-reciprocals',
      prompt: "If $f(x) = 2\\sqrt{x} + \\dfrac{4}{x}$, find $f'(4)$.",
      answer: 0.25,
      tolerance: 0.001,
      feedback: {
        correct: "Right: $f'(x) = x^{-1/2} - 4x^{-2}$, so $f'(4) = \\frac12 - \\frac14 = 0.25$.",
        incorrect: "Rewrite as $2x^{1/2} + 4x^{-1}$: $f'(x) = x^{-1/2} - 4x^{-2}$, and $f'(4) = 0.5 - 0.25 = 0.25$.",
      },
    },
    {
      type: 'numeric',
      id: 'tangent-slope',
      prompt: 'Find the slope of the tangent line to $y = x^3 - 2x$ at $x = 2$.',
      answer: 10,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $y' = 3x^2 - 2 = 12 - 2 = 10$.",
        incorrect: "$y' = 3x^2 - 2$. At $x = 2$: $3(4) - 2 = 10$.",
      },
    },
  ],
});
