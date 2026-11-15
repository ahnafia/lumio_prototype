import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'exp-log-derivatives',
  conceptId: 'exp-log-derivatives',
  title: 'Exponentials and logarithms',
  summary: 'e^x is its own derivative, and ln x has slope 1/x.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slope equals height',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'e^x' }],
          xRange: [-3, 2.2],
          yRange: [-1, 9],
          trace: { fn: 0, start: -2.5, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Drag along $y = e^x$ and compare $y$ with the slope. They are equal at every point. That is what makes $e$ special.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'exp',
      title: 'Exponentials',
      body: '$$\\frac{d}{dx}e^x = e^x, \\qquad \\frac{d}{dx}a^x = a^x \\ln a.$$\n\nWith the chain rule: $\\frac{d}{dx}e^{g(x)} = e^{g(x)}\\,g\'(x)$.',
    },
    {
      type: 'explanation',
      id: 'log',
      title: 'Logarithms',
      body: "$$\\frac{d}{dx}\\ln x = \\frac{1}{x} \\quad (x > 0), \\qquad \\frac{d}{dx}\\log_a x = \\frac{1}{x \\ln a}.$$\n\nWith the chain rule: $\\frac{d}{dx}\\ln g(x) = \\frac{g'(x)}{g(x)}$.",
    },
    {
      type: 'multiple-choice',
      id: 'exp-chain',
      prompt: 'Find $\\dfrac{d}{dx}e^{x^2}$.',
      choices: [
        { id: 'right', text: '$2x\\,e^{x^2}$' },
        { id: 'same', text: '$e^{x^2}$' },
        { id: 'power', text: '$x^2 e^{x^2 - 1}$' },
        { id: 'wrong-inside', text: '$2x\\,e^{2x}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $e^{x^2}$ times the inside derivative $2x$.',
        incorrect: '$e^{u}$ stays $e^{u}$, then multiply by $u\' = 2x$: $2x\\,e^{x^2}$. The power rule doesn\'t apply.',
      },
    },
    {
      type: 'numeric',
      id: 'log-chain',
      prompt: "Find $f'(1)$ for $f(x) = \\ln(x^2 + 3)$.",
      answer: 0.5,
      tolerance: 0.001,
      feedback: {
        correct: "Right: $f'(x) = \\frac{2x}{x^2 + 3}$, so $f'(1) = \\frac{2}{4} = 0.5$.",
        incorrect: "$f'(x) = \\frac{2x}{x^2 + 3}$ (inside derivative over inside). At $x = 1$: $\\frac{2}{4} = 0.5$.",
      },
    },
    {
      type: 'numeric',
      id: 'other-base',
      prompt: 'Find the slope of $y = 2^x$ at $x = 0$. Round to 3 decimal places.',
      answer: 0.693,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $2^0 \\ln 2 = \\ln 2 \\approx 0.693$.',
        incorrect: '$\\frac{d}{dx}2^x = 2^x \\ln 2$. At $x = 0$ that is $\\ln 2 \\approx 0.693$.',
      },
    },
  ],
});
