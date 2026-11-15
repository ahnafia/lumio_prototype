import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'exponential-models',
  conceptId: 'exponential-models',
  title: 'Exponential models',
  summary: 'Growth and decay by a constant factor: doubling, half-life and e.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Grow or decay',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '100 * e^(k * x)', label: 'P(t) = 100e^(kt)' }],
          xRange: [0, 10],
          yRange: [0, 500],
          xLabel: 't',
          yLabel: 'P',
          slider: { name: 'k', label: 'k', min: -0.5, max: 0.5, step: 0.01, start: 0.1 },
          autoplay: true,
        },
      },
      caption: 'Slide $k$ in $P(t) = 100e^{kt}$. Positive $k$ means growth, negative $k$ means decay, and $P(0) = 100$ every time.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'model',
      title: 'Exponential models',
      body: '$P(t) = P_0\\, b^t$ multiplies by $b$ every time unit. $P_0$ is the starting value.\n\nWith base $e$, $P(t) = P_0 e^{kt}$: growth if $k > 0$, decay if $k < 0$.',
    },
    {
      type: 'explanation',
      id: 'doubling',
      title: 'Doubling and half-life',
      body: 'If a quantity doubles every $d$ years: $P(t) = P_0 \\cdot 2^{t/d}$.\n\nIf it halves every $h$ years: $P(t) = P_0 \\cdot \\left(\\tfrac{1}{2}\\right)^{t/h}$.',
    },
    {
      type: 'numeric',
      id: 'bacteria',
      prompt: 'A culture starts with 300 bacteria and doubles every 4 hours. How many bacteria are there after 12 hours?',
      answer: 2400,
      tolerance: 0.5,
      feedback: {
        correct: 'Yes: 12 hours is 3 doublings, so $300 \\cdot 2^3 = 2400$.',
        incorrect: '$300 \\cdot 2^{12/4} = 300 \\cdot 2^3 = 2400$ bacteria.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'depreciation',
      prompt: 'A car is worth 20,000 dollars and loses 15% of its value each year. Which formula gives its value after $t$ years?',
      choices: [
        { id: 'right', text: '$V = 20000(0.85)^t$' },
        { id: 'rate', text: '$V = 20000(0.15)^t$' },
        { id: 'growth', text: '$V = 20000(1.15)^t$' },
        { id: 'linear', text: '$V = 20000 - 0.15t$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: keeping 85% each year means multiplying by $0.85$.',
        incorrect: 'Losing 15% leaves 85%, so multiply by $0.85$ each year: $V = 20000(0.85)^t$.',
      },
    },
    {
      type: 'numeric',
      id: 'half-life',
      prompt: 'Carbon-14 has a half-life of about 5730 years. What fraction of the original amount remains after 11,460 years? Enter a decimal.',
      answer: 0.25,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: two half-lives leave $\\left(\\tfrac12\\right)^2 = 0.25$.',
        incorrect: '$11460 / 5730 = 2$ half-lives, so $\\left(\\tfrac12\\right)^2 = 0.25$ remains.',
      },
    },
  ],
});
