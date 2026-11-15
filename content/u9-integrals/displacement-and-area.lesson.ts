import { defineLesson } from '@contract/schema';

const velocity = {
  name: 'function-plot',
  params: {
    functions: [{ expr: '2x', label: 'v(t) = 2t' }],
    xRange: [0, 5],
    yRange: [0, 11],
    xLabel: 't (s)',
    yLabel: 'v (m/s)',
  },
};

export default defineLesson({
  id: 'displacement-and-area',
  conceptId: 'displacement-and-area',
  title: 'Displacement and area',
  summary: 'The area under a velocity graph is how far you went.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Area is distance',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '2x', label: 'v(t) = 2t' }],
          xRange: [0, 5],
          yRange: [0, 11],
          xLabel: 't (s)',
          yLabel: 'v (m/s)',
          shade: { upper: '2x', lower: '0', from: 0, to: 5, toTrace: true },
          trace: { fn: 0, start: 0.5, tangent: false },
          readouts: [{ label: 'area', expr: 'x^2' }],
          autoplay: true,
        },
      },
      caption: "A car's velocity is $v(t) = 2t$ m/s. Drag $t$: the shaded triangle's area, $t^2$, is how far the car has gone.",
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'area',
      title: 'Distance is area',
      body: 'At constant velocity, distance $=$ rate $\\times$ time: a rectangle under the velocity graph.\n\nWhen velocity changes, the **area under the velocity curve** still gives the displacement.',
    },
    {
      type: 'explanation',
      id: 'signed',
      title: 'Signed area',
      body: 'Where $v(t) < 0$ the object moves backward, so that area counts as **negative**.\n\nArea above the axis minus area below = **displacement**, the net change in position.',
    },
    {
      type: 'numeric',
      id: 'constant',
      prompt: 'A bike moves at a constant 6 m/s for 10 s. How far does it go?',
      answer: 60,
      tolerance: 0.001,
      unit: 'm',
      feedback: {
        correct: 'Yes: a $10 \\times 6$ rectangle, 60 m.',
        incorrect: 'The area under $v = 6$ from $0$ to $10$ is a rectangle: $6 \\times 10 = 60$ m.',
      },
    },
    {
      type: 'numeric',
      id: 'trapezoid',
      prompt: 'With $v(t) = 2t$ m/s, how far does the car travel from $t = 1$ to $t = 3$?',
      visual: velocity,
      answer: 8,
      tolerance: 0.001,
      unit: 'm',
      feedback: {
        correct: 'Right: a trapezoid with heights 2 and 6 and width 2, area $\\frac{2 + 6}{2} \\cdot 2 = 8$.',
        incorrect: 'The region from $t = 1$ to $3$ is a trapezoid: $\\frac{v(1) + v(3)}{2} \\cdot 2 = \\frac{2 + 6}{2} \\cdot 2 = 8$ m.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'net',
      prompt: 'A velocity graph is above the axis on $[0, 3]$ with area 10, and below the axis on $[3, 5]$ with area 4. What is the displacement on $[0, 5]$?',
      choices: [
        { id: 'right', text: '$6$' },
        { id: 'total', text: '$14$' },
        { id: 'first', text: '$10$' },
        { id: 'second', text: '$-4$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $10 - 4 = 6$. (Total distance would be 14.)',
        incorrect: 'Displacement is signed: $10 - 4 = 6$. Adding them, 14, gives total distance instead.',
      },
    },
  ],
});
