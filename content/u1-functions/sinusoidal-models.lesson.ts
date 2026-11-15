import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'sinusoidal-models',
  conceptId: 'sinusoidal-models',
  title: 'Sinusoidal models',
  summary: 'Amplitude, period and midline for anything that repeats.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Squeeze the wave',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'sin(b * x)', label: 'y = sin(bx)' }],
          xRange: [0, 12.6],
          yRange: [-1.6, 1.6],
          piTicks: true,
          slider: { name: 'b', label: 'b', min: 0.5, max: 3, step: 0.05, start: 1 },
          autoplay: true,
        },
      },
      caption: 'Slide $b$ in $y = \\sin(bx)$. A bigger $b$ fits more waves in: one full wave takes $\\frac{2\\pi}{b}$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'parts',
      title: 'Reading a sinusoid',
      body: 'For $y = A\\sin(B(t - C)) + D$:\n\n**amplitude** $|A|$, **period** $\\frac{2\\pi}{B}$, **shift** $C$, **midline** $y = D$.\n\nThe maximum is $D + |A|$ and the minimum is $D - |A|$. Cosine works the same way.',
    },
    {
      type: 'multiple-choice',
      id: 'period',
      prompt: 'What is the period of $y = 4\\cos(3t)$?',
      choices: [
        { id: 'right', text: '$\\dfrac{2\\pi}{3}$' },
        { id: 'b', text: '$3$' },
        { id: 'times', text: '$6\\pi$' },
        { id: 'half', text: '$\\dfrac{\\pi}{3}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: period $= \\frac{2\\pi}{B} = \\frac{2\\pi}{3}$. The 4 is the amplitude.',
        incorrect: 'Period is $\\frac{2\\pi}{B}$ with $B = 3$, so $\\frac{2\\pi}{3}$.',
      },
    },
    {
      type: 'numeric',
      id: 'tide-max',
      prompt: 'A tide is modeled by $h(t) = 2\\sin\\left(\\frac{\\pi}{6}t\\right) + 5$ meters, with $t$ in hours. What is the highest the tide gets?',
      answer: 7,
      tolerance: 0.001,
      unit: 'm',
      feedback: {
        correct: 'Yes: midline 5 plus amplitude 2 is 7 meters.',
        incorrect: 'Sine tops out at 1, so the max is $2(1) + 5 = 7$ meters.',
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-max',
      prompt: 'Tap the highest point of $y = 2\\sin x + 1$ between $0$ and $2\\pi$.',
      plot: { functions: [{ expr: '2 sin(x) + 1' }], xRange: [0, 6.3], yRange: [-1.5, 3.5] },
      target: { x: 1.5708, y: 3 },
      tolerance: 0.35,
      feedback: {
        correct: 'Yes: $\\sin x = 1$ at $x = \\frac{\\pi}{2}$, giving $y = 3$.',
        incorrect: 'The max is where $\\sin x = 1$: at $x = \\frac{\\pi}{2} \\approx 1.57$, $y = 3$.',
      },
    },
  ],
});
