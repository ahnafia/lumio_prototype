import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'area-between-curves',
  conceptId: 'area-between-curves',
  title: 'Area between curves',
  summary: 'Integrate top minus bottom between the crossing points.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Top minus bottom',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: '4 - x^2', domain: [-2, 1], label: 'y = 4 − x²' },
            { expr: 'x + 2', domain: [-2, 1], color: 'secondary', label: 'y = x + 2' },
            { expr: '4 - x^2', color: 'muted', dashed: true },
            { expr: 'x + 2', color: 'muted', dashed: true },
          ],
          xRange: [-3, 2.5],
          yRange: [-2, 5],
          shade: { upper: '4 - x^2', lower: 'x + 2', from: -2, to: 1, toTrace: true },
          trace: { fn: 0, start: -1.8, tangent: false },
          readouts: [{ label: 'area so far', expr: '2x - x^2/2 - x^3/3 + 10/3' }],
          autoplay: true,
        },
      },
      caption: 'Drag across the region between $y = 4 - x^2$ (top) and $y = x + 2$ (bottom). Each thin strip has height top minus bottom; adding them up gives the area.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'formula',
      title: 'Area between curves',
      body: 'If $f(x) \\ge g(x)$ on $[a, b]$:\n\n$$A = \\int_a^b \\left[f(x) - g(x)\\right]dx \\quad\\text{(top minus bottom).}$$\n\nWhen the curves cross, find $a$ and $b$ by solving $f(x) = g(x)$.',
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'This region',
      body: '$4 - x^2 = x + 2$ when $x = -2$ or $x = 1$. So\n\n$$A = \\int_{-2}^{1} \\left(2 - x - x^2\\right)dx = 4.5.$$',
    },
    {
      type: 'numeric',
      id: 'x-and-square',
      prompt: 'Find the area between $y = x$ and $y = x^2$ for $0 \\le x \\le 1$. A fraction is fine.',
      answer: 0.16667,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\int_0^1 (x - x^2)\\,dx = \\frac12 - \\frac13 = \\frac16$.',
        incorrect: 'On $[0, 1]$, $x \\ge x^2$: $\\int_0^1 (x - x^2)\\,dx = \\frac12 - \\frac13 = \\frac16 \\approx 0.167$.',
      },
    },
    {
      type: 'numeric',
      id: 'root-and-square',
      prompt: 'Find the area of the region enclosed by $y = \\sqrt{x}$ and $y = x^2$. A fraction is fine.',
      answer: 0.33333,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: they meet at $0$ and $1$, and $\\int_0^1 (\\sqrt{x} - x^2)\\,dx = \\frac23 - \\frac13 = \\frac13$.',
        incorrect: 'They cross at $x = 0$ and $1$, with $\\sqrt{x}$ on top: $\\int_0^1 (\\sqrt x - x^2)\\,dx = \\frac{2}{3} - \\frac{1}{3} = \\frac13$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'sin-cos',
      prompt: 'Which integral gives the area between $y = \\sin x$ and $y = \\cos x$ from $0$ to $\\frac{\\pi}{4}$?',
      choices: [
        { id: 'right', text: '$\\displaystyle\\int_0^{\\pi/4} (\\cos x - \\sin x)\\,dx$' },
        { id: 'flipped', text: '$\\displaystyle\\int_0^{\\pi/4} (\\sin x - \\cos x)\\,dx$' },
        { id: 'product', text: '$\\displaystyle\\int_0^{\\pi/4} \\sin x \\cos x\\,dx$' },
        { id: 'sum', text: '$\\displaystyle\\int_0^{\\pi/4} (\\cos x + \\sin x)\\,dx$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: on $[0, \\frac{\\pi}{4}]$, $\\cos x \\ge \\sin x$, so cosine is on top.',
        incorrect: 'At $x = 0$, $\\cos x = 1 > 0 = \\sin x$, and they meet at $\\frac\\pi4$. Top minus bottom: $\\cos x - \\sin x$.',
      },
    },
  ],
});
