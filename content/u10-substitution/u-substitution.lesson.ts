import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'u-substitution',
  conceptId: 'u-substitution',
  title: 'The substitution rule',
  summary: 'Spot an inside function and its derivative, then trade x for u.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'The chain rule, backward',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: 'sin(x^2)', label: 'F(x) = sin(x²)' },
            { expr: '2x cos(x^2)', color: 'muted', dashed: true, label: '2x cos(x²)' },
          ],
          xRange: [0, 2.5],
          yRange: [-5.5, 5.5],
          trace: { fn: 0, start: 0.2, tangent: true },
          readouts: [{ label: '2x·cos(x²)', expr: '2x * cos(x^2)' }],
          autoplay: true,
        },
      },
      caption: 'Drag along $F(x) = \\sin(x^2)$. Its slope always equals $2x\\cos(x^2)$, the dashed curve. So $\\int 2x\\cos(x^2)\\,dx = \\sin(x^2) + C$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'rule',
      title: 'The substitution rule',
      body: "If $u = g(x)$, then\n\n$$\\int f(g(x))\\,g'(x)\\,dx = \\int f(u)\\,du.$$\n\nLook for an inside function $g(x)$ whose derivative $g'(x)$ also appears as a factor.",
    },
    {
      type: 'explanation',
      id: 'mechanics',
      title: 'How it goes',
      body: 'For $\\int 2x\\cos(x^2)\\,dx$: let $u = x^2$, so $du = 2x\\,dx$. Then\n\n$$\\int \\cos u\\,du = \\sin u + C = \\sin(x^2) + C.$$\n\nAlways switch back to $x$ at the end.',
    },
    {
      type: 'multiple-choice',
      id: 'power',
      prompt: 'Find $\\int 3x^2(x^3 + 1)^4\\,dx$.',
      choices: [
        { id: 'right', text: '$\\dfrac{(x^3 + 1)^5}{5} + C$' },
        { id: 'no-divide', text: '$(x^3 + 1)^5 + C$' },
        { id: 'kept', text: '$\\dfrac{3x^2(x^3 + 1)^5}{5} + C$' },
        { id: 'integrated', text: '$\\dfrac{x^3(x^3 + 1)^5}{5} + C$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $u = x^3 + 1$, $du = 3x^2\\,dx$, and $\\int u^4\\,du = \\frac{u^5}{5} + C$.',
        incorrect: '$u = x^3 + 1$ makes $3x^2\\,dx = du$, leaving $\\int u^4\\,du = \\frac{u^5}{5} + C$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'trig',
      prompt: 'Find $\\int \\cos x\\,\\sin^5 x\\,dx$.',
      choices: [
        { id: 'right', text: '$\\dfrac{\\sin^6 x}{6} + C$' },
        { id: 'cos', text: '$\\dfrac{\\cos^6 x}{6} + C$' },
        { id: 'no-divide', text: '$\\sin^6 x + C$' },
        { id: 'sign', text: '$-\\dfrac{\\sin^6 x}{6} + C$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: $u = \\sin x$, $du = \\cos x\\,dx$, so $\\int u^5\\,du = \\frac{u^6}{6}$.',
        incorrect: 'Let $u = \\sin x$; then $du = \\cos x\\,dx$ and the integral is $\\int u^5\\,du = \\frac{\\sin^6 x}{6} + C$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'log',
      prompt: 'Find $\\int \\dfrac{x}{x^2 + 1}\\,dx$.',
      choices: [
        { id: 'right', text: '$\\frac{1}{2}\\ln(x^2 + 1) + C$' },
        { id: 'missing-half', text: '$\\ln(x^2 + 1) + C$' },
        { id: 'arctan', text: '$\\arctan x + C$' },
        { id: 'product', text: '$\\frac{x^2}{2}\\ln(x^2 + 1) + C$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $u = x^2 + 1$, $du = 2x\\,dx$, so $x\\,dx = \\frac{du}{2}$ and $\\frac12\\int\\frac{du}{u}$.',
        incorrect: '$u = x^2 + 1$ gives $x\\,dx = \\frac{1}{2}du$, so it is $\\frac{1}{2}\\int \\frac{du}{u} = \\frac{1}{2}\\ln(x^2 + 1) + C$.',
      },
    },
  ],
});
