import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'limit-definition',
  conceptId: 'limit-definition',
  title: 'The limit definition',
  summary: "Compute f'(x) straight from the limit of the difference quotient.",
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slope as a limit',
      visual: { name: 'secant-to-tangent', params: { expr: 'x^2', a: 1, hMax: 2, hStart: 1.8, xRange: [-1, 3.5], yRange: [-1, 9] } },
      caption: 'For $f(x) = x^2$, shrink $h$ and watch $\\frac{f(1 + h) - f(1)}{h}$. Try negative $h$ too. Both sides head to $2$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'The derivative',
      body: "The **derivative** of $f$ is\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$\n\nwherever this limit exists. Other notations: $\\frac{dy}{dx}$, $\\frac{d}{dx}f(x)$, $y'$.",
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'Working it out',
      body: "For $f(x) = x^2$:\n\n$$\\frac{(x + h)^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h \\to 2x.$$\n\nSo $f'(x) = 2x$, and at $x = 1$ the slope is $2$.",
    },
    {
      type: 'multiple-choice',
      id: 'quotient',
      prompt: 'For $f(x) = 3x^2$, the difference quotient $\\dfrac{f(x + h) - f(x)}{h}$ simplifies to:',
      choices: [
        { id: 'right', text: '$6x + 3h$' },
        { id: 'one-h', text: '$6x + h$' },
        { id: 'three-x', text: '$3x + h$' },
        { id: 'limit', text: '$6x$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $\\frac{3(x + h)^2 - 3x^2}{h} = \\frac{6xh + 3h^2}{h} = 6x + 3h$.',
        incorrect: '$3(x + h)^2 - 3x^2 = 6xh + 3h^2$; divide by $h$ to get $6x + 3h$ (the limit is $6x$).',
      },
    },
    {
      type: 'numeric',
      id: 'sqrt-slope',
      prompt: "Using the limit definition (rationalize!), find $f'(4)$ for $f(x) = \\sqrt{x}$.",
      answer: 0.25,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\frac{\\sqrt{4 + h} - 2}{h} = \\frac{1}{\\sqrt{4 + h} + 2} \\to \\frac{1}{4}$.',
        incorrect: 'Rationalize: $\\frac{\\sqrt{4 + h} - 2}{h} = \\frac{1}{\\sqrt{4 + h} + 2} \\to \\frac14 = 0.25$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'setup',
      prompt: "Which limit equals $f'(3)$ for $f(x) = x^3$?",
      choices: [
        { id: 'right', text: '$\\displaystyle\\lim_{h \\to 0} \\frac{(3 + h)^3 - 27}{h}$' },
        { id: 'divide-3', text: '$\\displaystyle\\lim_{h \\to 0} \\frac{(3 + h)^3 - 27}{3}$' },
        { id: 'inside', text: '$\\displaystyle\\lim_{h \\to 0} \\frac{3^3 + h - 27}{h}$' },
        { id: 'h-to-3', text: '$\\displaystyle\\lim_{h \\to 3} \\frac{h^3 - 27}{h}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $\\frac{f(3 + h) - f(3)}{h}$ with $f(3) = 27$.',
        incorrect: 'Use $\\frac{f(3 + h) - f(3)}{h}$ as $h \\to 0$: $\\frac{(3 + h)^3 - 27}{h}$.',
      },
    },
  ],
});
