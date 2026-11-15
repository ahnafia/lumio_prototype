import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'concavity',
  conceptId: 'concavity',
  title: 'Concavity and inflection points',
  summary: "The sign of f'' tells you which way the graph bends.",
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Cup or cap',
      visual: { name: 'derivative-tracer', params: { expr: 'x^3 - 3x', xRange: [-2.2, 2.2], yRange: [-5, 5], dyRange: [-14, 14], order: 2 } },
      caption: "Trace $y = x^3 - 3x$. Below is $f''$: red where the curve bends down, green where it bends up. They swap at the inflection point $x = 0$.",
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'concavity',
      title: 'Concavity',
      body: "$f$ is **concave up** where $f'' > 0$: it bends like a cup, and its slopes increase.\n\n$f$ is **concave down** where $f'' < 0$: it bends like a cap.\n\nAn **inflection point** is where the concavity changes.",
    },
    {
      type: 'explanation',
      id: 'finding',
      title: 'Finding inflection points',
      body: "Solve $f''(x) = 0$ (or find where $f''$ is undefined), then check that $f''$ actually **changes sign** there.\n\n$f(x) = x^4$ has $f''(0) = 0$ but no inflection point: it's concave up on both sides.",
    },
    {
      type: 'numeric',
      id: 'inflection-x',
      prompt: 'Find the $x$-coordinate of the inflection point of $f(x) = x^3 - 6x^2 + 5$.',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $f''(x) = 6x - 12$ changes sign at $x = 2$.",
        incorrect: "$f'(x) = 3x^2 - 12x$ and $f''(x) = 6x - 12$, which is $0$ (and changes sign) at $x = 2$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'concave-down',
      prompt: 'Where is $f(x) = x^4 - 6x^2$ concave down?',
      choices: [
        { id: 'right', text: '$(-1, 1)$' },
        { id: 'up', text: '$(-\\infty, -1)$ and $(1, \\infty)$' },
        { id: 'sqrt3', text: '$(-\\sqrt{3}, \\sqrt{3})$' },
        { id: 'first', text: '$(-\\infty, -\\sqrt{3})$ and $(0, \\sqrt{3})$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Right: $f''(x) = 12x^2 - 12 < 0$ when $|x| < 1$.",
        incorrect: "Use $f''$, not $f'$: $f''(x) = 12x^2 - 12 = 12(x^2 - 1) < 0$ on $(-1, 1)$.",
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-inflection',
      prompt: 'Tap the inflection point of $y = x^3 - 3x^2 + 2$.',
      plot: { functions: [{ expr: 'x^3 - 3x^2 + 2' }], xRange: [-1.5, 3.5], yRange: [-3, 4] },
      target: { x: 1, y: 0 },
      tolerance: 0.35,
      feedback: {
        correct: "Yes: $y'' = 6x - 6$ switches sign at $x = 1$, the point $(1, 0)$.",
        incorrect: "$y'' = 6x - 6 = 0$ at $x = 1$ and changes sign there. The point is $(1, 1 - 3 + 2) = (1, 0)$.",
      },
    },
  ],
});
