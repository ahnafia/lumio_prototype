import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'average-value',
  conceptId: 'average-value',
  title: 'Average value of a function',
  summary: 'The height of the rectangle with the same area.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Level it out',
      visual: { name: 'average-value', params: { expr: 'x^2', a: 0, b: 3, xRange: [-0.3, 3.4], yRange: [0, 9.5], hStart: 6 } },
      caption: 'Raise or lower the rectangle over $[0, 3]$ until its area matches the area under $y = x^2$. That height is the average value of $x^2$ on $[0, 3]$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'formula',
      title: 'Average value',
      body: '$$f_{\\text{avg}} = \\frac{1}{b - a}\\int_a^b f(x)\\,dx$$\n\nIt is the height of the rectangle on $[a, b]$ with the same area as the region under $f$.',
    },
    {
      type: 'explanation',
      id: 'mvt',
      title: 'Mean Value Theorem for integrals',
      body: 'If $f$ is continuous on $[a, b]$, then $f(c) = f_{\\text{avg}}$ for some $c$ in $[a, b]$: the function actually hits its average value somewhere.',
    },
    {
      type: 'numeric',
      id: 'square',
      prompt: 'Find the average value of $f(x) = x^2$ on $[0, 3]$.',
      answer: 3,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\frac{1}{3}\\int_0^3 x^2\\,dx = \\frac{1}{3} \\cdot 9 = 3$.',
        incorrect: '$\\frac{1}{3 - 0}\\int_0^3 x^2\\,dx = \\frac{1}{3} \\cdot \\frac{27}{3} = 3$.',
      },
    },
    {
      type: 'numeric',
      id: 'sine',
      prompt: 'Find the average value of $\\sin x$ on $[0, \\pi]$. Round to 3 decimal places.',
      answer: 0.637,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\frac{1}{\\pi}\\int_0^\\pi \\sin x\\,dx = \\frac{2}{\\pi} \\approx 0.637$.',
        incorrect: '$\\int_0^\\pi \\sin x\\,dx = 2$, and dividing by the length $\\pi$ gives $\\frac{2}{\\pi} \\approx 0.637$.',
      },
    },
    {
      type: 'numeric',
      id: 'velocity',
      prompt: 'An object has velocity $v(t) = 16t^2 + 5$ ft/s. Find its average velocity from $t = 1$ to $t = 3$. Round to 2 decimal places.',
      answer: 74.33,
      tolerance: 0.01,
      unit: 'ft/s',
      feedback: {
        correct: 'Yes: $\\frac{1}{2}\\int_1^3 (16t^2 + 5)\\,dt = \\frac{1}{2} \\cdot \\frac{446}{3} = \\frac{223}{3} \\approx 74.33$.',
        incorrect: '$\\int_1^3 (16t^2 + 5)\\,dt = \\frac{16}{3}(27 - 1) + 10 = \\frac{446}{3}$. Divide by $2$: $\\approx 74.33$ ft/s.',
      },
    },
  ],
});
