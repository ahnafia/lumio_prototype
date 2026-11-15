import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'ftc-derivative',
  conceptId: 'ftc-derivative',
  title: 'FTC: the derivative of an integral',
  summary: 'Accumulate f, then take the rate: you get f back.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Area grows at rate f(x)',
      visual: { name: 'ftc-accumulator', params: { expr: '1 + 0.5 * sin(2x)', a: 0, xRange: [0, 6], yRange: [-0.5, 2], ayRange: [-0.5, 7], xStart: 0.5 } },
      caption: 'Drag $x$. The area function $A(x) = \\int_0^x f(t)\\,dt$ grows below, and its slope at every $x$ equals the height $f(x)$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'theorem',
      title: 'The Fundamental Theorem of Calculus',
      body: "If $f$ is continuous and\n\n$$G(x) = \\int_a^x f(t)\\,dt,$$\n\nthen $G'(x) = f(x)$. Accumulating $f$ and then taking the rate gives back $f$.",
    },
    {
      type: 'explanation',
      id: 'chain',
      title: 'With the chain rule',
      body: 'If the upper limit is a function $g(x)$:\n\n$$\\frac{d}{dx}\\int_a^{g(x)} f(t)\\,dt = f(g(x))\\,g\'(x).$$',
    },
    {
      type: 'multiple-choice',
      id: 'basic',
      prompt: 'Find $\\dfrac{d}{dx}\\displaystyle\\int_2^x \\sqrt{1 + t^3}\\,dt$.',
      choices: [
        { id: 'right', text: '$\\sqrt{1 + x^3}$' },
        { id: 'minus', text: '$\\sqrt{1 + x^3} - 3$' },
        { id: 'derivative', text: '$\\dfrac{3x^2}{2\\sqrt{1 + x^3}}$' },
        { id: 'integral', text: '$\\displaystyle\\int_2^x \\frac{3t^2}{2\\sqrt{1 + t^3}}\\,dt$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: just put $x$ in for $t$. The lower limit 2 does not matter.',
        incorrect: 'The FTC says the derivative is the integrand evaluated at $x$: $\\sqrt{1 + x^3}$.',
      },
    },
    {
      type: 'numeric',
      id: 'chain-value',
      prompt: "Let $G(x) = \\int_0^{x^2} \\cos t\\,dt$. Find $G'(\\sqrt{\\pi})$. Round to 2 decimal places.",
      answer: -3.54,
      tolerance: 0.01,
      feedback: {
        correct: "Right: $G'(x) = \\cos(x^2) \\cdot 2x$, so $\\cos\\pi \\cdot 2\\sqrt{\\pi} = -2\\sqrt{\\pi} \\approx -3.54$.",
        incorrect: "$G'(x) = \\cos(x^2) \\cdot 2x$ (don't forget $\\frac{d}{dx}x^2$). At $\\sqrt\\pi$: $-2\\sqrt{\\pi} \\approx -3.54$.",
      },
    },
    {
      type: 'numeric',
      id: 'area-rate',
      prompt: "If $A(x) = \\int_1^x (t^2 - 4)\\,dt$, find $A'(3)$.",
      answer: 5,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $A'(x) = x^2 - 4$, so $A'(3) = 5$.",
        incorrect: "By the FTC, $A'(x) = x^2 - 4$. At $x = 3$: $9 - 4 = 5$.",
      },
    },
  ],
});
