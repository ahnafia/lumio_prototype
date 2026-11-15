import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'volume-disks-washers',
  conceptId: 'volume-disks-washers',
  title: 'Disks and washers',
  summary: 'Spin a region around an axis: every slice is a disk or a washer.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Disks',
      visual: { name: 'solid-revolution', params: { mode: 'disk', outer: 'sqrt(x)', inner: '0', a: 0, b: 4, yMax: 2.6 } },
      caption: 'Spin the region under $y = \\sqrt{x}$, $0 \\le x \\le 4$, around the $x$-axis. Slide the slice: each one is a disk of radius $\\sqrt{x}$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'disks',
      title: 'The disk method',
      body: 'Rotating the region under $y = R(x)$ about the $x$-axis, each slice is a disk of area $\\pi R(x)^2$:\n\n$$V = \\int_a^b \\pi R(x)^2\\,dx.$$\n\nHere $V = \\int_0^4 \\pi x\\,dx = 8\\pi \\approx 25.13$.',
    },
    {
      type: 'explanation',
      id: 'washers',
      title: 'The washer method',
      body: 'If the region has a hole (outer radius $R(x)$, inner radius $r(x)$), each slice is a washer:\n\n$$V = \\int_a^b \\pi\\left[R(x)^2 - r(x)^2\\right]dx.$$',
      visual: { name: 'solid-revolution', params: { mode: 'washer', outer: 'x', inner: 'x^2', a: 0, b: 1, yMax: 1.3 } },
    },
    {
      type: 'numeric',
      id: 'cone',
      prompt: 'Rotate the region under $y = x$, $0 \\le x \\le 3$, about the $x$-axis (it makes a cone). Find the volume. Round to 2 decimal places.',
      answer: 28.27,
      tolerance: 0.01,
      feedback: {
        correct: 'Yes: $\\int_0^3 \\pi x^2\\,dx = 9\\pi \\approx 28.27$.',
        incorrect: '$V = \\int_0^3 \\pi x^2\\,dx = \\pi\\frac{x^3}{3}\\Big|_0^3 = 9\\pi \\approx 28.27$.',
      },
    },
    {
      type: 'numeric',
      id: 'washer',
      prompt: 'Rotate the region between $y = x$ and $y = x^2$ ($0 \\le x \\le 1$) about the $x$-axis. Find the volume. Round to 3 decimal places.',
      answer: 0.419,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\pi\\int_0^1 (x^2 - x^4)\\,dx = \\pi\\left(\\frac13 - \\frac15\\right) = \\frac{2\\pi}{15} \\approx 0.419$.',
        incorrect: 'Outer $R = x$, inner $r = x^2$: $\\pi\\int_0^1 (x^2 - x^4)\\,dx = \\frac{2\\pi}{15} \\approx 0.419$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'washer-area',
      prompt: 'A washer has outer radius $R$ and inner radius $r$. What is its area?',
      choices: [
        { id: 'right', text: '$\\pi(R^2 - r^2)$' },
        { id: 'square-diff', text: '$\\pi(R - r)^2$' },
        { id: 'circumference', text: '$2\\pi(R - r)$' },
        { id: 'missing-pi', text: '$\\pi R^2 - r^2$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: big disk minus the hole, $\\pi R^2 - \\pi r^2$.',
        incorrect: 'Subtract the hole from the big disk: $\\pi R^2 - \\pi r^2 = \\pi(R^2 - r^2)$, not $\\pi(R - r)^2$.',
      },
    },
  ],
});
