import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'limit-laws',
  conceptId: 'limit-laws',
  title: 'Limit laws',
  summary: 'Limits of sums, products and quotients, and when you can just plug in.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'No surprises',
      visual: { name: 'limit-approach', params: { expr: 'x^2 + 3x', a: 2, xRange: [0, 3.5], yRange: [-1, 22], valueAt: 10, digits: 4 } },
      caption: 'For the polynomial $f(x) = x^2 + 3x$, the points close in on exactly $f(2) = 10$. The limit is just the value.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'laws',
      title: 'Limit laws',
      body: 'If $\\lim f(x) = L$ and $\\lim g(x) = M$ as $x \\to a$, then the limits of\n\n$f \\pm g$, $\\;kf$, $\\;fg$, $\\;\\frac{f}{g}$\n\nare $L \\pm M$, $kL$, $LM$ and $\\frac{L}{M}$ (when $M \\neq 0$).',
    },
    {
      type: 'explanation',
      id: 'substitution',
      title: 'Direct substitution',
      body: 'Polynomials, rational functions, roots, exponentials, logs and trig functions are continuous on their domains.\n\nSo if $a$ is in the domain, $\\lim_{x \\to a} f(x) = f(a)$: just plug in.',
    },
    {
      type: 'numeric',
      id: 'polynomial',
      prompt: 'Find $\\lim_{x \\to 2}(x^3 - 4x + 1)$.',
      answer: 1,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $8 - 8 + 1 = 1$.',
        incorrect: 'Plug in $x = 2$: $2^3 - 4(2) + 1 = 8 - 8 + 1 = 1$.',
      },
    },
    {
      type: 'numeric',
      id: 'combine-laws',
      prompt: 'If $\\lim_{x \\to 4} f(x) = 3$ and $\\lim_{x \\to 4} g(x) = -2$, find $\\lim_{x \\to 4} \\dfrac{f(x)^2 - g(x)}{f(x) + g(x)}$.',
      answer: 11,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\frac{9 - (-2)}{3 + (-2)} = \\frac{11}{1} = 11$.',
        incorrect: 'Use the laws: $\\frac{3^2 - (-2)}{3 + (-2)} = \\frac{11}{1} = 11$. Watch the sign of $-g$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'transcendental',
      prompt: 'Find $\\lim_{x \\to 0} \\dfrac{e^x + 1}{\\cos x}$.',
      choices: [
        { id: 'two', text: '$2$' },
        { id: 'one', text: '$1$' },
        { id: 'zero', text: '$0$' },
        { id: 'dne', text: 'It does not exist' },
      ],
      answer: 'two',
      feedback: {
        correct: 'Yes: $\\frac{e^0 + 1}{\\cos 0} = \\frac{2}{1} = 2$.',
        incorrect: 'Everything is continuous at $0$: $\\frac{e^0 + 1}{\\cos 0} = \\frac{1 + 1}{1} = 2$.',
      },
    },
  ],
});
