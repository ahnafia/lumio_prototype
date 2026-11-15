import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'linear-approximation',
  conceptId: 'linear-approximation',
  title: 'Linear approximation',
  summary: 'Near a point, a curve is nearly its tangent line: use it to estimate.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Zoom until it is straight',
      visual: { name: 'linear-approx', params: { mode: 'zoom', expr: 'sqrt(x)', a: 4, xRange: [0, 9], yRange: [0, 3.5] } },
      caption: 'Zoom in on $y = \\sqrt{x}$ at $(4, 2)$. Close up, the curve and its tangent line are almost the same, so the line gives a good estimate.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'linearization',
      title: 'Linearization',
      body: "The tangent line at $a$ is the **linearization**\n\n$$L(x) = f(a) + f'(a)(x - a).$$\n\nNear $a$, $f(x) \\approx L(x)$.",
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'An example',
      body: "For $f(x) = \\sqrt{x}$ at $a = 4$: $f(4) = 2$ and $f'(4) = \\frac{1}{4}$.\n\nSo $\\sqrt{4.1} \\approx 2 + \\frac{1}{4}(0.1) = 2.025$. The true value is $2.02485\\ldots$",
    },
    {
      type: 'numeric',
      id: 'sqrt-9-2',
      prompt: 'Use the linearization of $\\sqrt{x}$ at $a = 9$ to estimate $\\sqrt{9.2}$. Round to 4 decimal places.',
      answer: 3.0333,
      tolerance: 0.0002,
      feedback: {
        correct: 'Yes: $3 + \\frac{1}{6}(0.2) \\approx 3.0333$.',
        incorrect: "$f(9) = 3$, $f'(9) = \\frac{1}{2\\sqrt9} = \\frac16$. So $L(9.2) = 3 + \\frac{0.2}{6} \\approx 3.0333$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'sin-linear',
      prompt: 'What is the linearization of $f(x) = \\sin x$ at $a = 0$?',
      choices: [
        { id: 'right', text: '$L(x) = x$' },
        { id: 'one', text: '$L(x) = 1$' },
        { id: 'one-plus', text: '$L(x) = 1 + x$' },
        { id: 'cos', text: '$L(x) = \\cos x$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: $\\sin 0 + \\cos 0 \\,(x - 0) = x$. That is why $\\sin x \\approx x$ for small $x$.',
        incorrect: "$L(x) = f(0) + f'(0)x = \\sin 0 + (\\cos 0)x = 0 + x = x$.",
      },
    },
    {
      type: 'numeric',
      id: 'ln-estimate',
      prompt: 'Estimate $\\ln(1.05)$ with the linearization of $\\ln x$ at $a = 1$.',
      answer: 0.05,
      tolerance: 0.0001,
      feedback: {
        correct: 'Yes: $L(x) = 0 + 1(x - 1)$, so $\\ln 1.05 \\approx 0.05$.',
        incorrect: "$\\ln 1 = 0$ and $\\frac{d}{dx}\\ln x = \\frac1x = 1$ at $x = 1$. So $L(1.05) = 0.05$.",
      },
    },
  ],
});
