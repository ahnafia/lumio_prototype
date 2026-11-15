import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'antiderivatives',
  conceptId: 'antiderivatives',
  title: 'Antiderivatives',
  summary: 'Run differentiation backward, and never forget + C.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A whole family',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: 'x^2 + c', label: 'y = x² + C' },
            { expr: 'x^2', color: 'muted', dashed: true },
          ],
          xRange: [-3, 3],
          yRange: [-4, 10],
          slider: { name: 'c', label: 'C', min: -3, max: 3, step: 0.1, start: 0 },
          trace: { fn: 0, start: 1, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Slide $C$. Every curve $y = x^2 + C$ has the same slope $2x$ at each $x$. That is why antiderivatives come with $+\\,C$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Antiderivatives',
      body: "$F$ is an **antiderivative** of $f$ if $F'(x) = f(x)$.\n\nThe **indefinite integral** $\\int f(x)\\,dx = F(x) + C$ names all of them at once: they differ only by a constant.",
    },
    {
      type: 'explanation',
      id: 'rules',
      title: 'Basic rules',
      body: '$\\int x^n\\,dx = \\frac{x^{n+1}}{n + 1} + C \\;(n \\ne -1)$\n\n$\\int \\frac{1}{x}\\,dx = \\ln|x| + C, \\quad \\int e^x\\,dx = e^x + C$\n\n$\\int \\cos x\\,dx = \\sin x + C, \\quad \\int \\sin x\\,dx = -\\cos x + C$',
    },
    {
      type: 'multiple-choice',
      id: 'polynomial',
      prompt: 'Find $\\int (6x^2 - 4x + 3)\\,dx$.',
      choices: [
        { id: 'right', text: '$2x^3 - 2x^2 + 3x + C$' },
        { id: 'derivative', text: '$12x - 4 + C$' },
        { id: 'dropped', text: '$2x^3 - 2x^2 + C$' },
        { id: 'no-divide', text: '$6x^3 - 4x^2 + 3x + C$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $\\frac{6x^3}{3} - \\frac{4x^2}{2} + 3x + C$. Check: its derivative is the integrand.',
        incorrect: 'Raise each power by one and divide by the new power: $2x^3 - 2x^2 + 3x + C$.',
      },
    },
    {
      type: 'numeric',
      id: 'ivp',
      prompt: "Find $f(2)$ if $f'(x) = 3x^2 + 1$ and $f(0) = 4$.",
      answer: 14,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $f(x) = x^3 + x + 4$, so $f(2) = 8 + 2 + 4 = 14$.',
        incorrect: '$f(x) = x^3 + x + C$ and $f(0) = 4$ gives $C = 4$. So $f(2) = 8 + 2 + 4 = 14$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'exp-log',
      prompt: 'Find $\\int \\left(e^x + \\dfrac{2}{x}\\right)dx$.',
      choices: [
        { id: 'right', text: '$e^x + 2\\ln|x| + C$' },
        { id: 'differentiated', text: '$e^x - \\dfrac{2}{x^2} + C$' },
        { id: 'power', text: '$\\dfrac{e^{x+1}}{x + 1} + 2\\ln|x| + C$' },
        { id: 'power-2', text: '$x e^{x - 1} + 2\\ln|x| + C$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $e^x$ is its own antiderivative, and $\\int \\frac{1}{x}dx = \\ln|x|$.',
        incorrect: '$\\int e^x dx = e^x$ (not a power rule), and $\\int \\frac{2}{x}dx = 2\\ln|x|$.',
      },
    },
  ],
});
