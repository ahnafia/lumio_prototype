import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'average-vs-instantaneous',
  conceptId: 'average-vs-instantaneous',
  title: 'Average vs instantaneous rate',
  summary: 'Secant slopes over shrinking intervals become the tangent slope.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Speed at an instant',
      visual: { name: 'secant-to-tangent', params: { expr: '64 - 16x^2', a: 1, hMax: 1, hStart: 1, xRange: [0, 2.2], yRange: [-5, 70], slopeLabel: 'avg velocity' } },
      caption: 'A ball\'s height is $s(t) = 64 - 16t^2$ feet. Shrink the time step $h$ after $t = 1$: the average velocity settles on the velocity **at** $t = 1$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'average',
      title: 'Average rate of change',
      body: 'Over $[a, a + h]$, the **average rate of change** of $f$ is\n\n$$\\frac{f(a + h) - f(a)}{h},$$\n\nthe slope of the **secant line**. For a position function, it\'s the average velocity.',
    },
    {
      type: 'explanation',
      id: 'instantaneous',
      title: 'Instantaneous rate of change',
      body: 'Let $h \\to 0$. The limit of the secant slopes is the **instantaneous rate of change**, the slope of the **tangent line**:\n\n$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}.$$',
    },
    {
      type: 'numeric',
      id: 'avg-velocity',
      prompt: 'For $s(t) = 64 - 16t^2$ (feet), find the average velocity on $[1, 2]$.',
      answer: -48,
      tolerance: 0.001,
      unit: 'ft/s',
      feedback: {
        correct: 'Yes: $\\frac{s(2) - s(1)}{1} = \\frac{0 - 48}{1} = -48$ ft/s.',
        incorrect: '$s(2) = 0$ and $s(1) = 48$, so $\\frac{0 - 48}{2 - 1} = -48$ ft/s.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'estimate-instant',
      prompt: 'The average velocities on $[1, 1.1]$, $[1, 1.01]$ and $[1, 1.001]$ are $-33.6$, $-32.16$ and $-32.016$ ft/s. The velocity at $t = 1$ is closest to:',
      choices: [
        { id: 'right', text: '$-32$ ft/s' },
        { id: 'first', text: '$-33.6$ ft/s' },
        { id: 'avg', text: '$-48$ ft/s' },
        { id: 'zero', text: '$0$ ft/s' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: as the interval shrinks, the averages close in on $-32$.',
        incorrect: 'The averages approach $-32$ as $h \\to 0$. That limit is the instantaneous velocity.',
      },
    },
    {
      type: 'graph-tap',
      id: 'zero-rate',
      prompt: 'On $y = x^2 - 4x + 5$, tap the point where the instantaneous rate of change is $0$.',
      plot: { functions: [{ expr: 'x^2 - 4x + 5' }], xRange: [-1, 5], yRange: [-1, 10] },
      target: { x: 2, y: 1 },
      tolerance: 0.35,
      feedback: {
        correct: 'Yes: the tangent line is flat at the bottom, $(2, 1)$.',
        incorrect: 'A rate of $0$ means a flat tangent: the vertex at $(2, 1)$.',
      },
    },
  ],
});
