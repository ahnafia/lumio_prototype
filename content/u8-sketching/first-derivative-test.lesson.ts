import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'first-derivative-test',
  conceptId: 'first-derivative-test',
  title: 'Increasing, decreasing, first derivative test',
  summary: "The sign of f' tells you where f rises and falls.",
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Green up, red down',
      visual: { name: 'derivative-tracer', params: { expr: 'x^4 - 4x^2', xRange: [-1.9, 1.9], yRange: [-5, 2], dyRange: [-13, 13] } },
      caption: "Trace $f(x) = x^4 - 4x^2$. Below, $f'$ is green where $f$ rises and red where it falls. Each color switch marks a hill or a valley.",
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'inc-dec',
      title: 'Increasing and decreasing',
      body: "If $f'(x) > 0$ on an interval, $f$ is **increasing** there. If $f'(x) < 0$, $f$ is **decreasing**.\n\nFind where $f' = 0$ or is undefined, then test the sign of $f'$ between those points.",
    },
    {
      type: 'explanation',
      id: 'test',
      title: 'First derivative test',
      body: "At a critical value $c$:\n\n$f'$ goes $+$ to $-$: **local max**.\n$f'$ goes $-$ to $+$: **local min**.\nNo sign change: no local extremum.",
    },
    {
      type: 'multiple-choice',
      id: 'increasing',
      prompt: 'On which intervals is $f(x) = x^3 - 3x$ increasing?',
      choices: [
        { id: 'right', text: '$(-\\infty, -1)$ and $(1, \\infty)$' },
        { id: 'middle', text: '$(-1, 1)$' },
        { id: 'left', text: '$(-\\infty, 0)$' },
        { id: 'positive', text: '$(0, \\infty)$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Yes: $f'(x) = 3(x - 1)(x + 1) > 0$ when $|x| > 1$.",
        incorrect: "$f'(x) = 3x^2 - 3$ is positive when $x < -1$ or $x > 1$, so $f$ increases there.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'no-change',
      prompt: "Suppose $f'(x) = (x - 2)^2(x + 1)$. What does $f$ have at $x = 2$?",
      choices: [
        { id: 'neither', text: "Neither: $f'$ doesn't change sign" },
        { id: 'max', text: 'A local max' },
        { id: 'min', text: 'A local min' },
        { id: 'undefined', text: 'A vertical asymptote' },
      ],
      answer: 'neither',
      feedback: {
        correct: "Right: near $x = 2$, $(x - 2)^2 \\ge 0$ and $x + 1 > 0$, so $f' \\ge 0$ on both sides.",
        incorrect: "$(x - 2)^2$ never goes negative and $x + 1 > 0$ near 2, so $f'$ stays $\\ge 0$: no extremum at 2.",
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-from-derivative',
      prompt: "This is the graph of $f'$, **not** $f$. Tap the $x$-value where $f$ has a local minimum.",
      plot: { functions: [{ expr: 'x^2 - 1', label: "y = f'(x)" }], xRange: [-3, 3], yRange: [-2, 5] },
      target: { x: 1 },
      tolerance: 0.3,
      feedback: {
        correct: "Yes: $f'$ crosses from negative to positive at $x = 1$.",
        incorrect: "A local min of $f$ is where $f'$ goes from $-$ to $+$: at $x = 1$. (At $x = -1$ it goes $+$ to $-$: a max.)",
      },
    },
  ],
});
