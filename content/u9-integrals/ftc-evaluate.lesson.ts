import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'ftc-evaluate',
  conceptId: 'ftc-evaluate',
  title: 'FTC: evaluating integrals',
  summary: 'An antiderivative turns a limit of sums into F(b) − F(a).',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'The shortcut',
      visual: {
        name: 'riemann-sum',
        params: { expr: 'x^2', a: 1, b: 3, n: 4, nMax: 100, method: 'midpoint', allowMethod: false, showExact: true, xRange: [0, 3.3], yRange: [-0.5, 10] },
      },
      caption: 'Push $n$ up for $y = x^2$ on $[1, 3]$. The sums close in on $8.667$, which is exactly $F(3) - F(1)$ for $F(x) = \\frac{x^3}{3}$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'theorem',
      title: 'The Fundamental Theorem of Calculus',
      body: 'If $f$ is continuous on $[a, b]$ and $F$ is **any** antiderivative of $f$, then\n\n$$\\int_a^b f(x)\\,dx = F(b) - F(a) = F(x)\\Big|_a^b.$$',
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'An example',
      body: '$$\\int_1^3 x^2\\,dx = \\frac{x^3}{3}\\Big|_1^3 = 9 - \\frac{1}{3} = \\frac{26}{3} \\approx 8.667.$$\n\nNo $+\\,C$ needed: it cancels when you subtract.',
    },
    {
      type: 'numeric',
      id: 'polynomial',
      prompt: 'Evaluate $\\int_0^2 (3x^2 + 2x)\\,dx$.',
      answer: 12,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $(x^3 + x^2)\\Big|_0^2 = 8 + 4 = 12$.',
        incorrect: 'An antiderivative is $x^3 + x^2$. Then $(8 + 4) - 0 = 12$.',
      },
    },
    {
      type: 'numeric',
      id: 'sine',
      prompt: 'Evaluate $\\int_0^{\\pi} \\sin x\\,dx$.',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $-\\cos x\\Big|_0^\\pi = -(-1) - (-1) = 2$.',
        incorrect: '$\\int \\sin x\\,dx = -\\cos x$. So $-\\cos\\pi - (-\\cos 0) = 1 + 1 = 2$.',
      },
    },
    {
      type: 'numeric',
      id: 'reciprocal',
      prompt: 'Evaluate $\\int_1^e \\dfrac{1}{x}\\,dx$.',
      answer: 1,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\ln e - \\ln 1 = 1 - 0 = 1$.',
        incorrect: 'An antiderivative of $\\frac{1}{x}$ is $\\ln x$: $\\ln e - \\ln 1 = 1$.',
      },
    },
  ],
});
