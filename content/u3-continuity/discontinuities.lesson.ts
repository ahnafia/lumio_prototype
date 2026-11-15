import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'discontinuities',
  conceptId: 'discontinuities',
  title: 'Types of discontinuity',
  summary: 'Holes, jumps and asymptotes, plus continuity on an interval.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Three kinds of break',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: '0.5x + 2', domain: [-4, 1] },
            { expr: '1/(3 - x)', domain: [1, 2.99] },
            { expr: '-1/(x - 3)', domain: [3.01, 5] },
          ],
          xRange: [-4, 5],
          yRange: [-4, 6],
          points: [
            { x: -2, y: 1, style: 'open' },
            { x: -2, y: 3, label: 'hole' },
            { x: 1, y: 2.5, style: 'open', label: 'jump' },
            { x: 1, y: 0.5 },
          ],
          vlines: [{ x: 3, label: 'asymptote' }],
        },
      },
      caption: 'One graph, three breaks: a hole at $x = -2$, a jump at $x = 1$, and a vertical asymptote at $x = 3$.',
    },
    {
      type: 'explanation',
      id: 'types',
      title: 'Types of discontinuity',
      body: '**Removable:** the limit exists but isn\'t $f(a)$, or $f(a)$ is undefined. A hole.\n\n**Jump:** both one-sided limits exist but differ.\n\n**Infinite:** a one-sided limit is $\\pm\\infty$.',
    },
    {
      type: 'explanation',
      id: 'intervals',
      title: 'Continuity on an interval',
      body: '$f$ is continuous on $[a, b]$ if it\'s continuous at every point of $(a, b)$, **right-continuous** at $a$ ($\\lim_{x \\to a^+} f(x) = f(a)$), and **left-continuous** at $b$.',
    },
    {
      type: 'multiple-choice',
      id: 'classify',
      prompt: 'What kind of discontinuity does $f(x) = \\dfrac{x^2 - 1}{x - 1}$ have at $x = 1$?',
      choices: [
        { id: 'removable', text: 'Removable' },
        { id: 'jump', text: 'Jump' },
        { id: 'infinite', text: 'Infinite' },
        { id: 'none', text: "None: it's continuous" },
      ],
      answer: 'removable',
      feedback: {
        correct: 'Yes: it equals $x + 1$ except at $1$, so the limit is $2$ but $f(1)$ is undefined.',
        incorrect: 'It simplifies to $x + 1$ (for $x \\ne 1$): the limit $2$ exists, $f(1)$ doesn\'t. Removable.',
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-jump',
      prompt: 'Tap where this function has a **jump** discontinuity.',
      plot: {
        functions: [
          { expr: 'x + 2', domain: [-3, 1] },
          { expr: 'x - 1', domain: [1, 4] },
        ],
        xRange: [-3, 4],
        yRange: [-2, 5],
        points: [
          { x: -1, y: 1, style: 'open' },
          { x: -1, y: 3 },
          { x: 1, y: 3, style: 'open' },
          { x: 1, y: 0 },
        ],
      },
      target: { x: 1 },
      tolerance: 0.3,
      feedback: {
        correct: 'Right: at $x = 1$ the left limit is $3$ and the right limit is $0$.',
        incorrect: 'At $x = 1$ the graph jumps from height $3$ to $0$. At $x = -1$ there\'s only a hole (removable).',
      },
    },
    {
      type: 'multiple-choice',
      id: 'infinite',
      prompt: 'What kind of discontinuity does $g(x) = \\dfrac{1}{(x - 4)^2}$ have at $x = 4$?',
      choices: [
        { id: 'infinite', text: 'Infinite' },
        { id: 'removable', text: 'Removable' },
        { id: 'jump', text: 'Jump' },
        { id: 'none', text: "None: it's continuous" },
      ],
      answer: 'infinite',
      feedback: {
        correct: 'Yes: $g(x) \\to \\infty$ from both sides, a vertical asymptote.',
        incorrect: 'As $x \\to 4$, $(x - 4)^2 \\to 0^+$ so $g(x) \\to \\infty$: an infinite discontinuity.',
      },
    },
  ],
});
