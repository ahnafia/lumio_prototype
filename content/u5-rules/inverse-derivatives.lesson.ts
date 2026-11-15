import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'inverse-derivatives',
  conceptId: 'inverse-derivatives',
  title: 'Derivatives of inverse functions',
  summary: 'Reflecting a graph flips slopes to their reciprocals; inverse trig derivatives.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Reciprocal slopes',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: 'e^x', color: 'muted' },
            { expr: 'log(x)', label: 'y = ln x', color: 'primary' },
            { expr: 'x', color: 'muted', dashed: true },
          ],
          xRange: [-2, 6],
          yRange: [-3, 5],
          trace: { fn: 1, start: 0.3, tangent: true },
          readouts: [{ label: '1/x', expr: '1/x' }],
          autoplay: true,
        },
      },
      caption: 'Drag along $y = \\ln x$, the inverse of $e^x$. Its slope at $x$ is $\\frac{1}{x}$: the reciprocal of the slope of $e^y$ at the mirror point.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'rule',
      title: 'Derivative of an inverse',
      body: "If $g = f^{-1}$, then\n\n$$g'(x) = \\frac{1}{f'(g(x))}.$$\n\nReflecting across $y = x$ swaps rise and run, so slopes become reciprocals.",
    },
    {
      type: 'explanation',
      id: 'inverse-trig',
      title: 'Inverse trig functions',
      body: '$$\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1 - x^2}}, \\quad \\frac{d}{dx}\\arccos x = \\frac{-1}{\\sqrt{1 - x^2}},$$\n\n$$\\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^2}.$$',
    },
    {
      type: 'numeric',
      id: 'inverse-at-point',
      prompt: "Let $f(x) = x^3 + x$ and $g = f^{-1}$. Since $f(1) = 2$, find $g'(2)$.",
      answer: 0.25,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $f'(1) = 3 + 1 = 4$, so $g'(2) = \\frac{1}{4}$.",
        incorrect: "$g'(2) = \\frac{1}{f'(g(2))} = \\frac{1}{f'(1)}$, and $f'(1) = 3(1)^2 + 1 = 4$. So $0.25$.",
      },
    },
    {
      type: 'numeric',
      id: 'arctan',
      prompt: 'Find the slope of $y = \\arctan x$ at $x = 1$.',
      answer: 0.5,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\frac{1}{1 + 1^2} = \\frac{1}{2}$.',
        incorrect: '$\\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^2}$. At $x = 1$: $\\frac{1}{2} = 0.5$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'arcsin-chain',
      prompt: 'Find $\\dfrac{d}{dx}\\arcsin(2x)$.',
      choices: [
        { id: 'right', text: '$\\dfrac{2}{\\sqrt{1 - 4x^2}}$' },
        { id: 'no-chain', text: '$\\dfrac{1}{\\sqrt{1 - 4x^2}}$' },
        { id: 'square', text: '$\\dfrac{2}{\\sqrt{1 - 2x^2}}$' },
        { id: 'arctan', text: '$\\dfrac{2}{1 + 4x^2}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $\\frac{1}{\\sqrt{1 - (2x)^2}} \\cdot 2$.',
        incorrect: 'Chain rule: $\\frac{1}{\\sqrt{1 - (2x)^2}} \\cdot 2 = \\frac{2}{\\sqrt{1 - 4x^2}}$.',
      },
    },
  ],
});
