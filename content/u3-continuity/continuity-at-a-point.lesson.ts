import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'continuity-at-a-point',
  conceptId: 'continuity-at-a-point',
  title: 'Continuity at a point',
  summary: 'Three checks: f(a) exists, the limit exists, and they agree.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A broken promise',
      visual: { name: 'limit-approach', params: { expr: '(x^2 - 4)/(x - 2)', a: 2, xRange: [0, 4], yRange: [-0.5, 6.5], valueAt: 1, digits: 4 } },
      caption: 'The points close in on height $4$, but this function was defined to have $f(2) = 1$. The graph has a break at $x = 2$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Continuous at a point',
      body: '$f$ is **continuous at $a$** if $\\lim_{x \\to a} f(x) = f(a)$. That is three checks:\n\n1. $f(a)$ is defined,\n2. $\\lim_{x \\to a} f(x)$ exists,\n3. the two are equal.',
    },
    {
      type: 'explanation',
      id: 'families',
      title: 'Continuous families',
      body: 'Polynomials, rational functions, roots, exponentials, logs and trig functions are continuous **on their domains**.\n\nSums, products, quotients (where defined) and compositions of continuous functions are continuous too.',
    },
    {
      type: 'multiple-choice',
      id: 'which-fails',
      prompt: 'For the function graphed here, which check fails at $x = 2$?',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x + 2' }],
          xRange: [0, 4],
          yRange: [-0.5, 6.5],
          points: [
            { x: 2, y: 4, style: 'open' },
            { x: 2, y: 1 },
          ],
        },
      },
      choices: [
        { id: 'equal', text: 'The limit equals $f(2)$' },
        { id: 'defined', text: '$f(2)$ is defined' },
        { id: 'exists', text: 'The limit exists' },
        { id: 'none', text: "None: it's continuous" },
      ],
      answer: 'equal',
      feedback: {
        correct: 'Right: $f(2) = 1$ and the limit is $4$. Both exist, but they differ.',
        incorrect: '$f(2) = 1$ exists and the limit $4$ exists. They just aren\'t equal, so check 3 fails.',
      },
    },
    {
      type: 'numeric',
      id: 'find-k',
      prompt: 'Find $k$ so that $f$ is continuous at $x = 1$:\n\n$$f(x) = \\begin{cases} x^2 + k & x < 1 \\\\ 3x + 1 & x \\ge 1 \\end{cases}$$',
      answer: 3,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: the left limit $1 + k$ must equal $f(1) = 4$, so $k = 3$.',
        incorrect: 'Match the pieces at $x = 1$: $1^2 + k = 3(1) + 1$, so $1 + k = 4$ and $k = 3$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'domain',
      prompt: 'Where is $f(x) = \\dfrac{x + 1}{x^2 - 9}$ continuous?',
      choices: [
        { id: 'right', text: 'All $x$ except $x = \\pm 3$' },
        { id: 'three', text: 'All $x$ except $x = 3$' },
        { id: 'minus-one', text: 'All $x$ except $x = -1$' },
        { id: 'all', text: 'All real numbers' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: a rational function is continuous except where $x^2 - 9 = 0$.',
        incorrect: 'It\'s continuous on its domain: everywhere except where $x^2 - 9 = 0$, i.e. $x = \\pm 3$.',
      },
    },
  ],
});
