import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'substitution-definite',
  conceptId: 'substitution-definite',
  title: 'Substitution in definite integrals',
  summary: 'Change the limits along with the variable.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Area without drawing',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '2x cos(x^2)' }],
          xRange: [0, 2.2],
          yRange: [-4, 2],
          shade: { upper: '2x cos(x^2)', lower: '0', from: 0, to: 2.2, toTrace: true, signed: true },
          trace: { fn: 0, start: 0.2, tangent: false },
          readouts: [{ label: 'area = sin(x²)', expr: 'sin(x^2)' }],
          autoplay: true,
        },
      },
      caption: 'Drag the right end. The signed area under $2x\\cos(x^2)$ from $0$ to $x$ always equals $\\sin(x^2)$. Substitution finds that without any picture.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'limits',
      title: 'Change the limits',
      body: "For $\\int_a^b f(g(x))\\,g'(x)\\,dx$, substitute $u = g(x)$ **and** change the limits:\n\n$$\\int_{g(a)}^{g(b)} f(u)\\,du.$$\n\nThen there is no need to switch back to $x$.",
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'An example',
      body: '$\\int_0^{\\sqrt{\\pi/2}} 2x\\cos(x^2)\\,dx$: with $u = x^2$ the limits become $0$ and $\\frac{\\pi}{2}$.\n\n$$\\int_0^{\\pi/2} \\cos u\\,du = \\sin\\frac{\\pi}{2} - \\sin 0 = 1.$$',
    },
    {
      type: 'numeric',
      id: 'polynomial',
      prompt: 'Evaluate $\\int_0^1 2x(x^2 + 1)^3\\,dx$.',
      answer: 3.75,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $u = x^2 + 1$ runs from 1 to 2, and $\\int_1^2 u^3\\,du = \\frac{16 - 1}{4} = 3.75$.',
        incorrect: '$u = x^2 + 1$: limits $1$ to $2$. $\\int_1^2 u^3\\,du = \\frac{u^4}{4}\\Big|_1^2 = 4 - 0.25 = 3.75$.',
      },
    },
    {
      type: 'numeric',
      id: 'exp-sin',
      prompt: 'Evaluate $\\int_0^{\\pi/2} \\cos x\\, e^{\\sin x}\\,dx$. Round to 3 decimal places.',
      answer: 1.718,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $u = \\sin x$ from 0 to 1, so $\\int_0^1 e^u\\,du = e - 1 \\approx 1.718$.',
        incorrect: '$u = \\sin x$, $du = \\cos x\\,dx$, limits $0$ to $1$: $\\int_0^1 e^u\\,du = e - 1 \\approx 1.718$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'new-limits',
      prompt: 'In $\\int_1^2 \\dfrac{\\ln x}{x}\\,dx$ with $u = \\ln x$, the new limits are:',
      choices: [
        { id: 'right', text: '$0$ to $\\ln 2$' },
        { id: 'same', text: '$1$ to $2$' },
        { id: 'one', text: '$0$ to $1$' },
        { id: 'exp', text: '$e$ to $e^2$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $u = \\ln 1 = 0$ and $u = \\ln 2$.',
        incorrect: 'Plug the old limits into $u = \\ln x$: $\\ln 1 = 0$ and $\\ln 2$.',
      },
    },
  ],
});
