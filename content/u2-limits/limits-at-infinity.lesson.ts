import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'limits-at-infinity',
  conceptId: 'limits-at-infinity',
  title: 'Limits at infinity',
  summary: 'End behavior, horizontal asymptotes and which functions grow fastest.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Far, far away',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '(3x^2 + 1)/(x^2 + 2)' }],
          xRange: [-20, 20],
          yRange: [-0.5, 4],
          hlines: [{ y: 3, label: 'y = 3' }],
          trace: { fn: 0, start: 0, tangent: false },
          autoplay: true,
        },
      },
      caption: 'Drag the point far right or far left on $y = \\frac{3x^2 + 1}{x^2 + 2}$. Its height settles toward $3$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Limits at infinity',
      body: '$\\lim_{x \\to \\infty} f(x) = L$ means $f(x)$ approaches $L$ as $x$ grows without bound. Then $y = L$ is a **horizontal asymptote**.\n\nKey fact: $\\frac{1}{x^n} \\to 0$ as $x \\to \\pm\\infty$ for any $n > 0$.',
    },
    {
      type: 'explanation',
      id: 'rational',
      title: 'Rational functions',
      body: 'Divide top and bottom by the highest power of $x$ in the denominator.\n\n**Same degree:** ratio of leading coefficients. **Bigger bottom:** $0$. **Bigger top:** no horizontal asymptote.',
    },
    {
      type: 'numeric',
      id: 'same-degree',
      prompt: 'Find $\\lim_{x \\to \\infty} \\dfrac{6x^3 - x}{2x^3 + 5x^2}$.',
      answer: 3,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: same degree, so the limit is $\\frac{6}{2} = 3$.',
        incorrect: 'Divide by $x^3$: $\\frac{6 - 1/x^2}{2 + 5/x} \\to \\frac{6}{2} = 3$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'bigger-bottom',
      prompt: 'Find $\\lim_{x \\to \\infty} \\dfrac{x^2 + 1}{x^3 - 2}$.',
      choices: [
        { id: 'zero', text: '$0$' },
        { id: 'one', text: '$1$' },
        { id: 'inf', text: '$\\infty$' },
        { id: 'neg-half', text: '$-\\frac{1}{2}$' },
      ],
      answer: 'zero',
      feedback: {
        correct: 'Right: the denominator has the higher degree, so the fraction shrinks to $0$.',
        incorrect: 'Divide by $x^3$: $\\frac{1/x + 1/x^3}{1 - 2/x^3} \\to \\frac{0}{1} = 0$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'growth-rates',
      prompt: 'Which function grows fastest as $x \\to \\infty$?',
      choices: [
        { id: 'exp', text: '$e^x$' },
        { id: 'power', text: '$x^{10}$' },
        { id: 'log', text: '$\\ln x$' },
        { id: 'root', text: '$\\sqrt{x}$' },
      ],
      answer: 'exp',
      feedback: {
        correct: 'Yes: $\\frac{e^x}{x^{10}} \\to \\infty$. Exponentials beat every power.',
        incorrect: 'Exponentials beat powers, which beat logs: $\\frac{e^x}{x^{10}} \\to \\infty$, so $e^x$ wins.',
      },
    },
  ],
});
