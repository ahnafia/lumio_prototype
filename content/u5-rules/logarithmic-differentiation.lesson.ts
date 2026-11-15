import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'logarithmic-differentiation',
  conceptId: 'logarithmic-differentiation',
  title: 'Logarithmic differentiation',
  summary: 'Take ln of both sides to handle variable exponents and messy products.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A variable in the exponent',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x^x', domain: [0.02, 2.5] }],
          xRange: [0, 2.5],
          yRange: [-0.5, 10],
          trace: { fn: 0, start: 0.2, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Drag along $y = x^x$. Neither the power rule nor the exponential rule fits: the variable is in the base **and** the exponent. Logs fix that.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'method',
      title: 'Take ln, then differentiate',
      body: "For $y = x^x$, take $\\ln$ of both sides: $\\ln y = x \\ln x$.\n\nDifferentiate implicitly: $\\frac{y'}{y} = \\ln x + 1$. So\n\n$$y' = x^x(\\ln x + 1).$$",
    },
    {
      type: 'explanation',
      id: 'when',
      title: 'When to use it',
      body: 'Use it when the variable is in both the base and the exponent, or to tame big products and quotients. Logs turn products into sums and powers into multiples.',
    },
    {
      type: 'numeric',
      id: 'xx-at-1',
      prompt: "For $y = x^x$, find $y'$ at $x = 1$.",
      answer: 1,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $1^1(\\ln 1 + 1) = 1 \\cdot 1 = 1$.",
        incorrect: "$y' = x^x(\\ln x + 1)$. At $x = 1$: $1 \\cdot (0 + 1) = 1$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'x-sinx',
      prompt: "For $y = x^{\\sin x}$ ($x > 0$), which is $y'$?",
      choices: [
        { id: 'right', text: '$x^{\\sin x}\\left(\\cos x \\ln x + \\dfrac{\\sin x}{x}\\right)$' },
        { id: 'power', text: '$\\sin x \\cdot x^{\\sin x - 1}$' },
        { id: 'exp', text: '$x^{\\sin x} \\ln x \\cos x$' },
        { id: 'cos', text: '$\\cos x \\cdot x^{\\cos x}$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Right: $\\ln y = \\sin x \\ln x$, so $\\frac{y'}{y} = \\cos x \\ln x + \\frac{\\sin x}{x}$.",
        incorrect: "$\\ln y = \\sin x \\ln x$. Product rule: $\\frac{y'}{y} = \\cos x \\ln x + \\frac{\\sin x}{x}$. Multiply by $y$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'first-step',
      prompt: 'Logarithmic differentiation of $y = \\dfrac{(x + 1)^3}{x^2}$ starts with:',
      choices: [
        { id: 'right', text: '$\\ln y = 3\\ln(x + 1) - 2\\ln x$' },
        { id: 'quotient', text: '$\\ln y = \\dfrac{3\\ln(x + 1)}{2\\ln x}$' },
        { id: 'product', text: '$\\ln y = 3\\ln(x + 1) \\cdot 2\\ln x$' },
        { id: 'split', text: '$\\ln y = 3\\ln x + 1 - 2\\ln x$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: the log of a quotient is a difference, and powers come down front.',
        incorrect: '$\\ln\\frac{A}{B} = \\ln A - \\ln B$ and $\\ln A^3 = 3\\ln A$: $\\ln y = 3\\ln(x + 1) - 2\\ln x$.',
      },
    },
  ],
});
