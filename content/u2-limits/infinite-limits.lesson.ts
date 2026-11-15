import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'infinite-limits',
  conceptId: 'infinite-limits',
  title: 'Infinite limits',
  summary: 'When f(x) blows up near a: vertical asymptotes.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'No ceiling',
      visual: { name: 'limit-approach', params: { expr: '1/(x - 1)^2', a: 1, xRange: [-1, 3], yRange: [-1, 20], digits: 2 } },
      caption: 'Slide toward $x = 1$. The values of $\\frac{1}{(x - 1)^2}$ never settle: they grow without bound.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Infinite limits',
      body: '$\\lim_{x \\to a} f(x) = \\infty$ means $f(x)$ grows without bound as $x \\to a$. Then $x = a$ is a **vertical asymptote**.\n\nThe limit still isn\'t a number; $\\infty$ describes how it fails.',
    },
    {
      type: 'explanation',
      id: 'finding',
      title: 'Finding vertical asymptotes',
      body: 'Look where a denominator is $0$ but the numerator isn\'t. Then check the sign on each side:\n\n$\\frac{1}{x - 2} \\to -\\infty$ as $x \\to 2^-$, and $\\to +\\infty$ as $x \\to 2^+$.',
    },
    {
      type: 'multiple-choice',
      id: 'sign-left',
      prompt: 'Find $\\lim_{x \\to 3^-} \\dfrac{2}{x - 3}$.',
      choices: [
        { id: 'neg', text: '$-\\infty$' },
        { id: 'pos', text: '$\\infty$' },
        { id: 'zero', text: '$0$' },
        { id: 'two-thirds', text: '$\\frac{2}{3}$' },
      ],
      answer: 'neg',
      feedback: {
        correct: 'Yes: for $x$ just below 3, $x - 3$ is a tiny negative number.',
        incorrect: 'Left of 3, $x - 3$ is tiny and **negative**, so $\\frac{2}{x - 3} \\to -\\infty$.',
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-asymptote',
      prompt: 'Tap the graph of $y = \\dfrac{x + 1}{(x - 2)^2}$ at its vertical asymptote.',
      plot: { functions: [{ expr: '(x + 1)/(x - 2)^2' }], xRange: [-2, 6], yRange: [-3, 15] },
      target: { x: 2 },
      tolerance: 0.35,
      feedback: {
        correct: 'Right: the denominator is $0$ at $x = 2$ and the numerator is $3$.',
        incorrect: 'The denominator $(x - 2)^2$ is $0$ at $x = 2$ (numerator $3 \\neq 0$): asymptote $x = 2$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'hole-vs-asymptote',
      prompt: 'Which function has a vertical asymptote at $x = 1$?',
      choices: [
        { id: 'right', text: '$\\dfrac{x + 2}{x - 1}$' },
        { id: 'hole', text: '$\\dfrac{x^2 - 1}{x - 1}$' },
        { id: 'flip', text: '$\\dfrac{x - 1}{x + 2}$' },
        { id: 'never', text: '$\\dfrac{1}{x^2 + 1}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: the bottom is $0$ at $x = 1$ and the top is $3$.',
        incorrect: '$\\frac{x + 2}{x - 1}$: the top is $3 \\ne 0$ at $x = 1$. ($\\frac{x^2 - 1}{x - 1}$ cancels to a hole.)',
      },
    },
  ],
});
