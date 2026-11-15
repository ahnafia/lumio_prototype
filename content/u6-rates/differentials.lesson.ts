import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'differentials',
  conceptId: 'differentials',
  title: 'Differentials',
  summary: 'dy along the tangent line versus Δy along the curve; estimating error.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'dy versus Δy',
      visual: { name: 'linear-approx', params: { mode: 'differential', expr: 'x^3', a: 1, xRange: [0, 2], yRange: [-0.5, 6], dxMax: 0.8 } },
      caption: 'Slide $dx$. The tangent line rises $dy$ while the curve $y = x^3$ rises $\\Delta y$. As $dx$ shrinks, the two nearly agree.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Differentials',
      body: "For $y = f(x)$, the **differential** is\n\n$$dy = f'(x)\\,dx.$$\n\nIt is the change along the tangent line, and $dy \\approx \\Delta y$ (the actual change) when $dx$ is small.",
    },
    {
      type: 'explanation',
      id: 'error',
      title: 'Estimating error',
      body: "A cube's side is measured as 10 cm, give or take 0.1 cm. With $V = s^3$:\n\n$$dV = 3s^2\\,ds = 3(100)(0.1) = 30 \\text{ cm}^3.$$\n\nSo the volume could be off by about 30 cm³.",
    },
    {
      type: 'numeric',
      id: 'dy',
      prompt: 'For $y = x^3$, find $dy$ when $x = 2$ and $dx = 0.1$.',
      answer: 1.2,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $dy = 3x^2\\,dx = 3(4)(0.1) = 1.2$.',
        incorrect: '$dy = f\'(x)\\,dx = 3x^2\\,dx = 3(2)^2(0.1) = 1.2$.',
      },
    },
    {
      type: 'numeric',
      id: 'delta-y',
      prompt: 'For the same function, find the actual change $\\Delta y$ as $x$ goes from $2$ to $2.1$. Round to 3 decimal places.',
      answer: 1.261,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $2.1^3 - 2^3 = 9.261 - 8 = 1.261$, close to $dy = 1.2$.',
        incorrect: '$\\Delta y = f(2.1) - f(2) = 9.261 - 8 = 1.261$.',
      },
    },
    {
      type: 'numeric',
      id: 'circle-error',
      prompt: "A circle's radius is measured as 5 cm with a possible error of 0.2 cm. Use differentials to estimate the possible error in its area. Round to 2 decimal places.",
      answer: 6.28,
      tolerance: 0.01,
      unit: 'cm²',
      feedback: {
        correct: 'Yes: $dA = 2\\pi r\\,dr = 2\\pi(5)(0.2) = 2\\pi \\approx 6.28$ cm².',
        incorrect: '$A = \\pi r^2$, so $dA = 2\\pi r\\,dr = 2\\pi(5)(0.2) = 2\\pi \\approx 6.28$ cm².',
      },
    },
  ],
});
