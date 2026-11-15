import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'composition-and-piecewise',
  conceptId: 'composition-and-piecewise',
  title: 'Compositions and piecewise functions',
  summary: 'Build new functions by chaining them or by splitting the domain.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A shipping price',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x <= 2 ? 5 : 5 + 1.5 * (x - 2)' }],
          xRange: [0, 8],
          yRange: [0, 16],
          xLabel: 'weight (lb)',
          yLabel: 'cost',
          trace: { fn: 0, start: 0.5, tangent: false },
          autoplay: true,
        },
      },
      caption: 'Drag along a shipping cost: a flat 5 dollars up to 2 lb, then 1.50 dollars for each extra pound. One function, two formulas.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'piecewise',
      title: 'Piecewise functions',
      body: 'A **piecewise** function uses different formulas on different intervals:\n\n$$C(w) = \\begin{cases} 5 & 0 < w \\le 2 \\\\ 5 + 1.5(w - 2) & w > 2 \\end{cases}$$\n\nFirst find which interval $w$ is in, then use that formula.',
    },
    {
      type: 'explanation',
      id: 'composition',
      title: 'Composition',
      body: '$(f \\circ g)(x) = f(g(x))$: apply $g$ first, then $f$.\n\nOrder matters. With $f(x) = x^2$ and $g(x) = x + 1$: $f(g(x)) = (x + 1)^2$, but $g(f(x)) = x^2 + 1$.',
    },
    {
      type: 'numeric',
      id: 'evaluate-composition',
      prompt: 'Let $f(x) = x^2$ and $g(x) = 3x - 1$. Find $f(g(2))$.',
      answer: 25,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $g(2) = 5$, then $f(5) = 25$.',
        incorrect: 'Inside first: $g(2) = 3(2) - 1 = 5$, then $f(5) = 5^2 = 25$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'which-composition',
      prompt: 'Let $f(x) = \\sqrt{x}$ and $g(x) = x^2 + 9$. For $x \\ge 0$, what is $g(f(x))$?',
      choices: [
        { id: 'right', text: '$x + 9$' },
        { id: 'swapped', text: '$\\sqrt{x^2 + 9}$' },
        { id: 'sqrt9', text: '$x^2 + 3$' },
        { id: 'add', text: '$\\sqrt{x} + 9$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: $g(\\sqrt{x}) = (\\sqrt{x})^2 + 9 = x + 9$.',
        incorrect: 'Put $f(x) = \\sqrt{x}$ into $g$: $(\\sqrt{x})^2 + 9 = x + 9$. ($\\sqrt{x^2 + 9}$ is $f(g(x))$.)',
      },
    },
    {
      type: 'numeric',
      id: 'evaluate-piecewise',
      prompt: 'Find $f(3)$ for\n\n$$f(x) = \\begin{cases} 2x + 1 & x < 3 \\\\ x^2 - 4 & x \\ge 3 \\end{cases}$$',
      answer: 5,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $3 \\ge 3$, so use $x^2 - 4 = 9 - 4 = 5$.',
        incorrect: '$x = 3$ belongs to the piece $x \\ge 3$, so $f(3) = 3^2 - 4 = 5$.',
      },
    },
  ],
});
