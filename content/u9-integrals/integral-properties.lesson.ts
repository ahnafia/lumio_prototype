import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'integral-properties',
  conceptId: 'integral-properties',
  title: 'Properties of definite integrals',
  summary: 'Split, scale, flip and combine integrals without computing them.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Areas add up',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x - 2' }],
          xRange: [0, 5],
          yRange: [-2.5, 3.5],
          shade: { upper: 'x - 2', lower: '0', from: 0, to: 5, toTrace: true, signed: true },
          trace: { fn: 0, start: 0.5, tangent: false },
          readouts: [{ label: 'integral 0 to x', expr: 'x^2/2 - 2x' }],
          autoplay: true,
        },
      },
      caption: 'Drag the right end along $y = x - 2$. Area below the axis subtracts and area above adds. At $x = 4$ they cancel exactly.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'algebra',
      title: 'Properties',
      body: '$\\int_a^b [f \\pm g]\\,dx = \\int_a^b f\\,dx \\pm \\int_a^b g\\,dx$\n\n$\\int_a^b c\\,f\\,dx = c\\int_a^b f\\,dx$\n\n$\\int_a^a f\\,dx = 0, \\quad \\int_b^a f\\,dx = -\\int_a^b f\\,dx$',
    },
    {
      type: 'explanation',
      id: 'split',
      title: 'Splitting and comparing',
      body: '$$\\int_a^c f\\,dx + \\int_c^b f\\,dx = \\int_a^b f\\,dx.$$\n\nIf $f(x) \\ge g(x)$ on $[a, b]$, then $\\int_a^b f\\,dx \\ge \\int_a^b g\\,dx$.',
    },
    {
      type: 'numeric',
      id: 'linear-combo',
      prompt: 'If $\\int_a^b f(x)\\,dx = 7$ and $\\int_a^b g(x)\\,dx = 3$, find $\\int_a^b [2f(x) - 3g(x)]\\,dx$.',
      answer: 5,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $2(7) - 3(3) = 5$.',
        incorrect: 'Split and pull out constants: $2 \\cdot 7 - 3 \\cdot 3 = 14 - 9 = 5$.',
      },
    },
    {
      type: 'numeric',
      id: 'flip',
      prompt: 'With $\\int_a^b g(x)\\,dx = 3$, find $\\int_b^a 2g(x)\\,dx$.',
      answer: -6,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: flipping the limits flips the sign, $-2(3) = -6$.',
        incorrect: '$\\int_b^a 2g\\,dx = -2\\int_a^b g\\,dx = -2(3) = -6$.',
      },
    },
    {
      type: 'numeric',
      id: 'split-number',
      prompt: 'If $\\int_0^5 f(x)\\,dx = 10$ and $\\int_0^2 f(x)\\,dx = 4$, find $\\int_2^5 f(x)\\,dx$.',
      answer: 6,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\int_0^2 + \\int_2^5 = \\int_0^5$, so $10 - 4 = 6$.',
        incorrect: '$\\int_0^5 f = \\int_0^2 f + \\int_2^5 f$, so $\\int_2^5 f = 10 - 4 = 6$.',
      },
    },
  ],
});
