import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'volume-cross-sections',
  conceptId: 'volume-cross-sections',
  title: 'Volume by slicing',
  summary: 'Add up the areas of thin slices: V = ∫ A(x) dx.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Square slices',
      visual: { name: 'solid-revolution', params: { mode: 'square', outer: '1 - x^2', inner: 'x^2 - 1', a: -1, b: 1, yMax: 1 } },
      caption: 'The base is the region between $y = 1 - x^2$ and $y = x^2 - 1$. Every slice perpendicular to the $x$-axis is a square standing on the base. Slide the slice along.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'formula',
      title: 'Volume by slicing',
      body: 'If the cross-section at $x$ has area $A(x)$, then\n\n$$V = \\int_a^b A(x)\\,dx.$$\n\nFind a formula for one slice, then integrate.',
    },
    {
      type: 'explanation',
      id: 'example',
      title: 'Squares here',
      body: 'The side is $s = (1 - x^2) - (x^2 - 1) = 2 - 2x^2$, so $A(x) = (2 - 2x^2)^2$ and\n\n$$V = \\int_{-1}^{1} (2 - 2x^2)^2\\,dx = \\frac{64}{15} \\approx 4.27.$$',
    },
    {
      type: 'numeric',
      id: 'given-area',
      prompt: "A solid's cross-section at $x$ has area $A(x) = 3x^2$ for $0 \\le x \\le 2$. Find its volume.",
      answer: 8,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\int_0^2 3x^2\\,dx = x^3\\Big|_0^2 = 8$.',
        incorrect: '$V = \\int_0^2 3x^2\\,dx = x^3\\Big|_0^2 = 8$.',
      },
    },
    {
      type: 'numeric',
      id: 'pyramid',
      prompt: 'A pyramid has a square base 6 m on a side and height 6 m. At height $y$ its cross-section is a square of side $6 - y$. Find its volume.',
      answer: 72,
      tolerance: 0.01,
      unit: 'm³',
      feedback: {
        correct: 'Right: $\\int_0^6 (6 - y)^2\\,dy = \\frac{216}{3} = 72$ m³, matching $\\frac13 \\cdot$ base $\\cdot$ height.',
        incorrect: '$V = \\int_0^6 (6 - y)^2\\,dy = \\left[-\\frac{(6 - y)^3}{3}\\right]_0^6 = \\frac{216}{3} = 72$ m³.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'disk-base',
      prompt: 'A solid has the disk $x^2 + y^2 \\le 4$ as its base, and its cross-sections perpendicular to the $x$-axis are squares. What is $A(x)$?',
      choices: [
        { id: 'right', text: '$4(4 - x^2)$' },
        { id: 'half-side', text: '$4 - x^2$' },
        { id: 'side', text: '$2\\sqrt{4 - x^2}$' },
        { id: 'circle', text: '$\\pi(4 - x^2)$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: the side runs from $-\\sqrt{4 - x^2}$ to $\\sqrt{4 - x^2}$, so $s = 2\\sqrt{4 - x^2}$ and $s^2 = 4(4 - x^2)$.',
        incorrect: 'The side spans the disk: $s = 2\\sqrt{4 - x^2}$. A square has area $s^2 = 4(4 - x^2)$.',
      },
    },
  ],
});
