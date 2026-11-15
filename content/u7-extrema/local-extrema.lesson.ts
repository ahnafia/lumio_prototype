import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'local-extrema',
  conceptId: 'local-extrema',
  title: 'Local extrema and critical values',
  summary: "Hills and valleys happen where f' is 0 or undefined.",
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Flat at the top',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x^3 - 3x' }],
          xRange: [-2.5, 2.5],
          yRange: [-4, 4],
          trace: { fn: 0, start: -2.2, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Drag along $y = x^3 - 3x$. At the top of the hill and the bottom of the valley, the tangent line is flat.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'fermat',
      title: 'Local extrema',
      body: "$f$ has a **local maximum** at $c$ if $f(c) \\ge f(x)$ for all $x$ near $c$ (a **local minimum** if $\\le$).\n\n**Fermat's theorem:** if $f$ has a local extremum at $c$ and $f'(c)$ exists, then $f'(c) = 0$.",
    },
    {
      type: 'explanation',
      id: 'critical',
      title: 'Critical values',
      body: "A **critical value** is an $x$ in the domain where $f'(x) = 0$ or $f'(x)$ is undefined.\n\nLocal extrema only happen at critical values, but not every critical value is one: $x^3$ has $f'(0) = 0$ and no extremum.",
    },
    {
      type: 'multiple-choice',
      id: 'find-critical',
      prompt: 'Find the critical values of $f(x) = x^3 - 12x$.',
      choices: [
        { id: 'right', text: '$x = \\pm 2$' },
        { id: 'roots', text: '$x = 0$ and $x = \\pm 2\\sqrt{3}$' },
        { id: 'one', text: '$x = 2$ only' },
        { id: 'four', text: '$x = \\pm 4$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Yes: $f'(x) = 3x^2 - 12 = 0$ gives $x^2 = 4$.",
        incorrect: "Set $f'(x) = 3x^2 - 12 = 0$: $x = \\pm 2$. (The roots of $f$ itself don't matter here.)",
      },
    },
    {
      type: 'multiple-choice',
      id: 'undefined',
      prompt: 'Find the critical values of $f(x) = x^{2/3}$.',
      choices: [
        { id: 'zero', text: "$x = 0$, where $f'$ is undefined" },
        { id: 'none', text: "None: $f'$ is never $0$" },
        { id: 'two-thirds', text: '$x = \\frac{2}{3}$' },
        { id: 'all', text: 'Every $x$' },
      ],
      answer: 'zero',
      feedback: {
        correct: "Right: $f'(x) = \\frac{2}{3}x^{-1/3}$ is undefined at $0$ (and $0$ is in the domain).",
        incorrect: "$f'(x) = \\frac{2}{3x^{1/3}}$ is never $0$ but is undefined at $x = 0$, which is in the domain.",
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-min',
      prompt: 'Tap the local minimum of $y = x^3 - 6x^2 + 9x + 1$.',
      plot: { functions: [{ expr: 'x^3 - 6x^2 + 9x + 1' }], xRange: [-0.5, 4.5], yRange: [-2, 7] },
      target: { x: 3, y: 1 },
      tolerance: 0.35,
      feedback: {
        correct: "Yes: $y' = 3(x - 1)(x - 3)$, and the valley is at $(3, 1)$.",
        incorrect: "$y' = 3(x - 1)(x - 3)$: a hill at $x = 1$ and a valley at $x = 3$, the point $(3, 1)$.",
      },
    },
  ],
});
