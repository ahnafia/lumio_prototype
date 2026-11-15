import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'curve-sketching',
  conceptId: 'curve-sketching',
  title: 'Putting a sketch together',
  summary: 'Domain, intercepts, symmetry, asymptotes, f′ and f″ in one picture.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Every feature has a reason',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: 'x^2/(x^2 - 4)', domain: [-6, -2.02] },
            { expr: 'x^2/(x^2 - 4)', domain: [-1.98, 1.98] },
            { expr: 'x^2/(x^2 - 4)', domain: [2.02, 6] },
          ],
          xRange: [-6, 6],
          yRange: [-6, 6],
          vlines: [{ x: -2 }, { x: 2 }],
          hlines: [{ y: 1, label: 'y = 1' }],
          trace: { fn: 1, start: -1.5, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Here is $f(x) = \\frac{x^2}{x^2 - 4}$ with its asymptotes dashed. Drag through the middle piece: the peak at $0$, the symmetry and the asymptotes all come from $f$, $f\'$ and $f\'\'$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'checklist',
      title: 'A checklist',
      body: '1. Domain\n2. Intercepts\n3. Symmetry\n4. Vertical and horizontal asymptotes\n5. Increasing/decreasing and local extrema ($f\'$)\n6. Concavity and inflection points ($f\'\'$)\n7. Sketch',
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'This example',
      body: "$f(x) = \\frac{x^2}{x^2 - 4}$ is even, with $f(0) = 0$. Asymptotes: $x = \\pm 2$ and $y = 1$.\n\n$f'(x) = \\frac{-8x}{(x^2 - 4)^2}$: rising for $x < 0$, falling for $x > 0$, so a local max at $(0, 0)$.",
    },
    {
      type: 'multiple-choice',
      id: 'horizontal',
      prompt: 'What is the horizontal asymptote of $y = \\dfrac{2x^2 - 1}{x^2 + 3}$?',
      choices: [
        { id: 'right', text: '$y = 2$' },
        { id: 'constants', text: '$y = -\\frac{1}{3}$' },
        { id: 'zero', text: '$y = 0$' },
        { id: 'none', text: 'There is none' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: equal degrees, so the ratio of leading coefficients, $\\frac{2}{1}$.',
        incorrect: 'Same degree on top and bottom: the asymptote is the ratio of leading coefficients, $y = 2$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'shape',
      prompt: "On some interval, $f' > 0$ and $f'' < 0$. The graph there is:",
      choices: [
        { id: 'right', text: 'Rising and bending down, like the left side of a hill' },
        { id: 'up-up', text: 'Rising and bending up' },
        { id: 'down-down', text: 'Falling and bending down' },
        { id: 'down-up', text: 'Falling and bending up' },
      ],
      answer: 'right',
      feedback: {
        correct: "Right: $f' > 0$ means rising; $f'' < 0$ means the slopes are shrinking.",
        incorrect: "$f' > 0$: rising. $f'' < 0$: concave down. Together: climbing but leveling off, like a hill's left side.",
      },
    },
    {
      type: 'numeric',
      id: 'count-va',
      prompt: 'How many vertical asymptotes does $y = \\dfrac{x + 1}{x^2 - x - 6}$ have?',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $x^2 - x - 6 = (x - 3)(x + 2)$, and the top is nonzero at both: $x = 3$ and $x = -2$.',
        incorrect: 'Factor: $(x - 3)(x + 2)$. The numerator $x + 1$ isn\'t $0$ at $3$ or $-2$, so there are 2.',
      },
    },
  ],
});
