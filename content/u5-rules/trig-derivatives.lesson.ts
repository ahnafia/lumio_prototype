import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'trig-derivatives',
  conceptId: 'trig-derivatives',
  title: 'Derivatives of trig functions',
  summary: 'The slope of sine is cosine, and the rest follow.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slopes of a wave',
      visual: {
        name: 'derivative-tracer',
        params: { expr: 'sin(x)', xRange: [0, 6.28], yRange: [-1.4, 1.4], dyRange: [-1.4, 1.4], piTicks: true, showSigns: false },
      },
      caption: 'Trace the slopes of $y = \\sin x$. The slope graph below is another familiar wave: $\\cos x$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'sin-cos',
      title: 'Sine and cosine',
      body: '$$\\frac{d}{dx}\\sin x = \\cos x, \\qquad \\frac{d}{dx}\\cos x = -\\sin x$$\n\n(with $x$ in radians). Both come from the limit definition and $\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1$.',
    },
    {
      type: 'explanation',
      id: 'others',
      title: 'The other four',
      body: 'The quotient rule on $\\tan x = \\frac{\\sin x}{\\cos x}$ gives $\\frac{d}{dx}\\tan x = \\sec^2 x$. Also:\n\n$\\frac{d}{dx}\\sec x = \\sec x \\tan x$, $\\;\\frac{d}{dx}\\cot x = -\\csc^2 x$, $\\;\\frac{d}{dx}\\csc x = -\\csc x \\cot x$.',
    },
    {
      type: 'multiple-choice',
      id: 'product-trig',
      prompt: 'Find $\\dfrac{d}{dx}\\left(x^2 \\cos x\\right)$.',
      choices: [
        { id: 'right', text: '$2x\\cos x - x^2 \\sin x$' },
        { id: 'naive', text: '$-2x\\sin x$' },
        { id: 'sign', text: '$2x\\cos x + x^2 \\sin x$' },
        { id: 'sum', text: '$2x - \\sin x$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: product rule, with $\\frac{d}{dx}\\cos x = -\\sin x$.',
        incorrect: "Product rule: $2x \\cdot \\cos x + x^2 \\cdot (-\\sin x)$. Don't drop the minus sign.",
      },
    },
    {
      type: 'numeric',
      id: 'tan-slope',
      prompt: 'Find the slope of $y = \\tan x$ at $x = \\dfrac{\\pi}{4}$.',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\sec^2\\frac{\\pi}{4} = \\left(\\sqrt{2}\\right)^2 = 2$.',
        incorrect: '$\\frac{d}{dx}\\tan x = \\sec^2 x$, and $\\sec\\frac{\\pi}{4} = \\sqrt{2}$, so the slope is $2$.',
      },
    },
    {
      type: 'numeric',
      id: 'spring',
      prompt: 'A mass on a spring has position $s(t) = 3\\sin t$ cm. Find its velocity at $t = \\pi$.',
      answer: -3,
      tolerance: 0.001,
      unit: 'cm/s',
      feedback: {
        correct: 'Yes: $v(t) = 3\\cos t$, and $3\\cos\\pi = -3$ cm/s.',
        incorrect: '$v(t) = s\'(t) = 3\\cos t$. At $t = \\pi$: $3(-1) = -3$ cm/s.',
      },
    },
  ],
});
