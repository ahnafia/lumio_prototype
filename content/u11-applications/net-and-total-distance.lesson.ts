import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'net-and-total-distance',
  conceptId: 'net-and-total-distance',
  title: 'Net and total distance',
  summary: 'Displacement counts backtracking as negative; distance counts every meter.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'There and back',
      visual: { name: 'motion-line', params: { expr: 'x^2 - 4x', tMax: 5, sRange: [-5, 6], vRange: [-5, 7] } },
      caption: 'Scrub time. The particle moves left until $t = 2$, then right. Displacement counts the backtrack as negative; distance traveled counts every meter.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'net-total',
      title: 'Net vs total',
      body: '**Displacement** $= \\int_a^b v(t)\\,dt$, the signed area.\n\n**Total distance** $= \\int_a^b |v(t)|\\,dt$: split at the times where $v$ changes sign and add the sizes of the pieces.',
    },
    {
      type: 'explanation',
      id: 'position',
      title: 'Position from velocity',
      body: 'If you know $s(t_0)$, then\n\n$$s(t) = s(t_0) + \\int_{t_0}^{t} v(u)\\,du,$$\n\nand likewise $v(t) = v(t_0) + \\int_{t_0}^{t} a(u)\\,du$.',
    },
    {
      type: 'numeric',
      id: 'displacement',
      prompt: 'A particle has velocity $v(t) = 2t - 4$ m/s. Find its displacement on $[0, 5]$.',
      answer: 5,
      tolerance: 0.001,
      unit: 'm',
      feedback: {
        correct: 'Yes: $(t^2 - 4t)\\Big|_0^5 = 25 - 20 = 5$ m.',
        incorrect: '$\\int_0^5 (2t - 4)\\,dt = (t^2 - 4t)\\Big|_0^5 = 5$ m.',
      },
    },
    {
      type: 'numeric',
      id: 'distance',
      prompt: 'For the same particle, find the total distance traveled on $[0, 5]$.',
      answer: 13,
      tolerance: 0.001,
      unit: 'm',
      feedback: {
        correct: 'Right: 4 m backward on $[0, 2]$ plus 9 m forward on $[2, 5]$.',
        incorrect: '$v < 0$ on $[0, 2]$: $\\left|\\int_0^2 v\\right| = 4$. $v > 0$ on $[2, 5]$: $\\int_2^5 v = 9$. Total $13$ m.',
      },
    },
    {
      type: 'numeric',
      id: 'velocity',
      prompt: 'An object has acceleration $a(t) = 6t$ m/s² and $v(0) = 2$ m/s. Find $v(3)$.',
      answer: 29,
      tolerance: 0.001,
      unit: 'm/s',
      feedback: {
        correct: 'Yes: $v(3) = 2 + \\int_0^3 6t\\,dt = 2 + 27 = 29$ m/s.',
        incorrect: '$v(3) = v(0) + \\int_0^3 6t\\,dt = 2 + 3t^2\\Big|_0^3 = 2 + 27 = 29$ m/s.',
      },
    },
  ],
});
