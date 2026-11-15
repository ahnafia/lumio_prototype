import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'second-derivative-test',
  conceptId: 'second-derivative-test',
  title: 'The second derivative test',
  summary: "At a flat spot, f'' tells you hill or valley.",
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Hill or valley?',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '2x^3 - 3x^2 - 12x + 1' }],
          xRange: [-2.5, 3.5],
          yRange: [-22, 12],
          trace: { fn: 0, start: -2.2, tangent: true },
          readouts: [{ label: "f''", expr: '12x - 6' }],
          autoplay: true,
        },
      },
      caption: "Drag to the flat spots of $f(x) = 2x^3 - 3x^2 - 12x + 1$ and read $f''$. Negative (a cap) means a hill; positive (a cup) means a valley.",
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'test',
      title: 'The second derivative test',
      body: "Suppose $f'(c) = 0$.\n\nIf $f''(c) > 0$: **local min** at $c$.\nIf $f''(c) < 0$: **local max** at $c$.\nIf $f''(c) = 0$: the test is **inconclusive**; use the first derivative test.",
    },
    {
      type: 'multiple-choice',
      id: 'apply',
      prompt: 'For $f(x) = 2x^3 - 3x^2 - 12x + 1$, what does the second derivative test say at $x = 2$?',
      choices: [
        { id: 'min', text: 'Local minimum' },
        { id: 'max', text: 'Local maximum' },
        { id: 'inconclusive', text: 'Inconclusive' },
        { id: 'not-critical', text: '$x = 2$ is not a critical value' },
      ],
      answer: 'min',
      feedback: {
        correct: "Yes: $f'(2) = 0$ and $f''(2) = 24 - 6 = 18 > 0$.",
        incorrect: "$f'(x) = 6(x - 2)(x + 1)$, so $f'(2) = 0$; $f''(2) = 12(2) - 6 = 18 > 0$: a local min.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'inconclusive',
      prompt: "Suppose $f'(c) = 0$ and $f''(c) = 0$. What can you conclude?",
      choices: [
        { id: 'nothing', text: 'Nothing yet: the test is inconclusive' },
        { id: 'max', text: 'A local max at $c$' },
        { id: 'min', text: 'A local min at $c$' },
        { id: 'inflection', text: 'An inflection point at $c$' },
      ],
      answer: 'nothing',
      feedback: {
        correct: 'Right: $x^4$, $-x^4$ and $x^3$ all have this at $0$: a min, a max, and neither.',
        incorrect: 'It could be anything: $x^4$ (min), $-x^4$ (max) or $x^3$ (neither). Use the first derivative test.',
      },
    },
    {
      type: 'numeric',
      id: 'xe-x',
      prompt: 'Find the $x$ where $f(x) = xe^{-x}$ has a local maximum.',
      answer: 1,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $f'(x) = e^{-x}(1 - x) = 0$ at $x = 1$, and $f''(1) = -e^{-1} < 0$.",
        incorrect: "$f'(x) = e^{-x}(1 - x)$ is $0$ at $x = 1$; $f''(x) = e^{-x}(x - 2)$ is negative there, so it's a max.",
      },
    },
  ],
});
