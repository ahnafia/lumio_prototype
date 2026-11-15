import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'differentiability',
  conceptId: 'differentiability',
  title: 'Differentiability',
  summary: 'Corners, cusps, vertical tangents and breaks: where derivatives fail.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Turn a corner',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'abs(x - 1)' }],
          xRange: [-2, 4],
          yRange: [-1, 3],
          trace: { fn: 0, start: -1, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Drag across the corner of $y = |x - 1|$. The slope jumps from $-1$ to $1$, so there\'s no single tangent line at $x = 1$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Differentiable',
      body: '$f$ is **differentiable at $a$** if $f\'(a)$ exists.\n\nIt fails at a **corner** (different slopes on each side), a **cusp**, a **vertical tangent**, or a **discontinuity**.',
    },
    {
      type: 'explanation',
      id: 'continuity',
      title: 'Differentiable implies continuous',
      body: 'If $f$ is differentiable at $a$, then $f$ is continuous at $a$.\n\nThe reverse is false: $|x|$ is continuous at $0$ but not differentiable there.',
    },
    {
      type: 'graph-tap',
      id: 'tap-corner',
      prompt: 'Tap the point where this function is continuous but **not** differentiable.',
      plot: { functions: [{ expr: 'x < 2 ? (x - 2)^2 + 1 : 2x - 3' }], xRange: [-1, 5], yRange: [-1, 8] },
      target: { x: 2, y: 1 },
      tolerance: 0.35,
      feedback: {
        correct: 'Right: at $(2, 1)$ the slope jumps from $0$ to $2$, a corner.',
        incorrect: 'At $(2, 1)$ the pieces meet (continuous) but the slopes $0$ and $2$ differ: a corner.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'true-statement',
      prompt: 'Which statement is true?',
      choices: [
        { id: 'right', text: 'Every differentiable function is continuous.' },
        { id: 'converse', text: 'Every continuous function is differentiable.' },
        { id: 'abs', text: '$|x|$ is differentiable at $0$.' },
        { id: 'jump', text: 'A function can be differentiable at a jump.' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes. The converse fails: $|x|$ is continuous but has a corner at $0$.',
        incorrect: 'Differentiable implies continuous, not the other way: $|x|$ is continuous at $0$ with a corner.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'cusp',
      prompt: 'What happens to $f(x) = x^{2/3}$ at $x = 0$?',
      visual: { name: 'function-plot', params: { functions: [{ expr: 'cbrt(x^2)' }], xRange: [-3, 3], yRange: [-0.5, 2.5] } },
      choices: [
        { id: 'cusp', text: 'Continuous but not differentiable: a cusp' },
        { id: 'flat', text: "Differentiable with $f'(0) = 0$" },
        { id: 'broken', text: 'Not continuous' },
        { id: 'two-thirds', text: "Differentiable with $f'(0) = \\frac{2}{3}$" },
      ],
      answer: 'cusp',
      feedback: {
        correct: 'Right: the graph is unbroken, but the slopes shoot to $\\pm\\infty$ at $0$.',
        incorrect: 'The difference quotient $\\frac{h^{2/3}}{h} = h^{-1/3}$ blows up as $h \\to 0$: a cusp, not a slope.',
      },
    },
  ],
});
