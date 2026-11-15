import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'mean-value-theorem',
  conceptId: 'mean-value-theorem',
  title: "Rolle's and the Mean Value Theorem",
  summary: 'Somewhere, the instantaneous rate equals the average rate.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Find the parallel tangent',
      visual: { name: 'mean-value', params: { expr: 'x^3 - 3x^2 + 2x + 1', a: 0, b: 3, xRange: [-0.5, 3.5], yRange: [-1, 8], cStart: 0.3 } },
      caption: 'Drag $c$ until the tangent line is parallel to the dashed chord from $x = 0$ to $x = 3$. The Mean Value Theorem promises such a $c$ exists.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'rolle',
      title: "Rolle's Theorem",
      body: "If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $f(a) = f(b)$, then $f'(c) = 0$ for some $c$ in $(a, b)$.",
      visual: { name: 'mean-value', params: { expr: 'sin(x)', a: 0, b: 3.14159, xRange: [-0.3, 3.5], yRange: [-0.5, 1.5], cStart: 0.4 } },
    },
    {
      type: 'explanation',
      id: 'mvt',
      title: 'Mean Value Theorem',
      body: "If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then for some $c$ in $(a, b)$:\n\n$$f'(c) = \\frac{f(b) - f(a)}{b - a}.$$\n\nThe instantaneous rate equals the average rate somewhere.",
    },
    {
      type: 'numeric',
      id: 'find-c',
      prompt: 'Find the value $c$ guaranteed by the Mean Value Theorem for $f(x) = x^2$ on $[1, 5]$.',
      answer: 3,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: the chord slope is $\\frac{25 - 1}{4} = 6$, and $f'(c) = 2c = 6$.",
        incorrect: "Average slope: $\\frac{f(5) - f(1)}{5 - 1} = \\frac{24}{4} = 6$. Solve $f'(c) = 2c = 6$: $c = 3$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'speeding',
      prompt: 'A car travels 120 miles in 2 hours. What does the Mean Value Theorem tell you?',
      choices: [
        { id: 'right', text: 'At some moment its speed was exactly 60 mph' },
        { id: 'constant', text: 'It drove 60 mph the whole time' },
        { id: 'max', text: 'Its top speed was 120 mph' },
        { id: 'never', text: 'It never went faster than 60 mph' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: the average speed is 60 mph, so the speedometer read 60 at some instant.',
        incorrect: 'The average rate is $\\frac{120}{2} = 60$ mph, so at some instant the speed was exactly 60 mph.',
      },
    },
    {
      type: 'numeric',
      id: 'rolle-sin',
      prompt: "Find the $c$ in $(0, \\pi)$ that Rolle's Theorem guarantees for $f(x) = \\sin x$. Round to 3 decimal places.",
      answer: 1.571,
      tolerance: 0.002,
      feedback: {
        correct: "Yes: $f'(c) = \\cos c = 0$ at $c = \\frac{\\pi}{2} \\approx 1.571$.",
        incorrect: "$\\sin 0 = \\sin\\pi = 0$, so solve $\\cos c = 0$ in $(0, \\pi)$: $c = \\frac{\\pi}{2} \\approx 1.571$.",
      },
    },
  ],
});
