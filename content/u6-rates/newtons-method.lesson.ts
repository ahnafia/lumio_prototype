import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'newtons-method',
  conceptId: 'newtons-method',
  title: "Newton's method",
  summary: 'Ride tangent lines down to a root, one step at a time.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slide down the tangent',
      visual: { name: 'newton-method', params: { expr: 'x^2 - 2', x0: 3, xRange: [0, 3.5], yRange: [-3, 9], maxSteps: 5 } },
      caption: 'Press **Next step**. Each tangent line slides down to the $x$-axis, landing closer to the root $\\sqrt{2} \\approx 1.414214$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'formula',
      title: "Newton's method",
      body: "Start with a guess $x_0$. Follow the tangent line at $x_n$ down to the $x$-axis:\n\n$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}.$$\n\nRepeat until the digits stop changing.",
    },
    {
      type: 'explanation',
      id: 'caution',
      title: 'When it struggles',
      body: "If $f'(x_n)$ is near $0$, the tangent is nearly flat and the next guess can shoot far away. A starting guess close to the root helps.",
    },
    {
      type: 'numeric',
      id: 'first-step',
      prompt: 'For $f(x) = x^2 - 2$ with $x_0 = 1$, find $x_1$.',
      answer: 1.5,
      tolerance: 0.0001,
      feedback: {
        correct: 'Yes: $x_1 = 1 - \\frac{-1}{2} = 1.5$.',
        incorrect: "$f(1) = -1$, $f'(1) = 2$, so $x_1 = 1 - \\frac{-1}{2} = 1.5$.",
      },
    },
    {
      type: 'numeric',
      id: 'second-step',
      prompt: 'Keep going: find $x_2$ from $x_1 = 1.5$. Round to 4 decimal places.',
      answer: 1.4167,
      tolerance: 0.0001,
      feedback: {
        correct: 'Right: $1.5 - \\frac{0.25}{3} \\approx 1.4167$, already close to $\\sqrt2 \\approx 1.4142$.',
        incorrect: "$f(1.5) = 0.25$, $f'(1.5) = 3$, so $x_2 = 1.5 - \\frac{0.25}{3} \\approx 1.4167$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'failure',
      prompt: "Newton's method breaks down immediately if…",
      choices: [
        { id: 'right', text: "$f'(x_0) = 0$" },
        { id: 'root', text: '$f(x_0) = 0$' },
        { id: 'negative', text: '$x_0 < 0$' },
        { id: 'poly', text: '$f$ is a polynomial' },
      ],
      answer: 'right',
      feedback: {
        correct: "Yes: a flat tangent never meets the $x$-axis, and the formula divides by $f'(x_0) = 0$.",
        incorrect: "The formula divides by $f'(x_0)$. If it's $0$, the tangent is flat and never reaches the axis. ($f(x_0) = 0$ means you're done.)",
      },
    },
  ],
});
