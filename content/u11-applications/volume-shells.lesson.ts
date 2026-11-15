import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'volume-shells',
  conceptId: 'volume-shells',
  title: 'Cylindrical shells',
  summary: 'Spin a vertical strip around the y-axis: it sweeps out a thin shell.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Shells',
      visual: { name: 'solid-revolution', params: { mode: 'shell', outer: '2x - x^2', inner: '0', a: 0, b: 2, yMax: 1.3 } },
      caption: 'Spin the region under $y = 2x - x^2$ around the $y$-axis. Slide a thin vertical strip: it sweeps out a cylindrical shell of radius $x$ and height $f(x)$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'formula',
      title: 'Cylindrical shells',
      body: 'Rotating the region under $y = f(x)$, $a \\le x \\le b$ (with $a \\ge 0$), about the $y$-axis: each strip makes a shell of area (circumference $\\times$ height) $2\\pi x\\,f(x)$, so\n\n$$V = \\int_a^b 2\\pi x\\,f(x)\\,dx.$$',
    },
    {
      type: 'explanation',
      id: 'why',
      title: 'Why shells?',
      body: 'For rotation about the $y$-axis, shells let you keep $y = f(x)$ instead of solving for $x$ in terms of $y$.\n\nHere $V = 2\\pi\\int_0^2 (2x^2 - x^3)\\,dx = \\frac{8\\pi}{3} \\approx 8.38$.',
    },
    {
      type: 'numeric',
      id: 'parabola',
      prompt: 'Rotate the region under $y = x^2$, $0 \\le x \\le 2$, about the $y$-axis. Use shells and round to 2 decimal places.',
      answer: 25.13,
      tolerance: 0.01,
      feedback: {
        correct: 'Yes: $\\int_0^2 2\\pi x \\cdot x^2\\,dx = 2\\pi \\cdot \\frac{16}{4} = 8\\pi \\approx 25.13$.',
        incorrect: '$V = \\int_0^2 2\\pi x \\cdot x^2\\,dx = 2\\pi\\frac{x^4}{4}\\Big|_0^2 = 8\\pi \\approx 25.13$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'setup',
      prompt: 'The region under $y = \\sqrt{x}$, $0 \\le x \\le 4$, is rotated about the $y$-axis. Which integral gives the volume?',
      choices: [
        { id: 'right', text: '$\\displaystyle\\int_0^4 2\\pi x\\sqrt{x}\\,dx$' },
        { id: 'disk', text: '$\\displaystyle\\int_0^4 \\pi x\\,dx$' },
        { id: 'no-radius', text: '$\\displaystyle\\int_0^4 2\\pi\\sqrt{x}\\,dx$' },
        { id: 'y-disk', text: '$\\displaystyle\\int_0^2 \\pi y^4\\,dy$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: radius $x$, height $\\sqrt{x}$, so $2\\pi x\\sqrt{x}$.',
        incorrect: 'Shell area is $2\\pi(\\text{radius})(\\text{height}) = 2\\pi x\\sqrt{x}$. ($\\int \\pi x\\,dx$ spins about the $x$-axis.)',
      },
    },
    {
      type: 'numeric',
      id: 'evaluate',
      prompt: 'Evaluate $\\int_0^4 2\\pi x\\sqrt{x}\\,dx$. Round to 2 decimal places.',
      answer: 80.42,
      tolerance: 0.01,
      feedback: {
        correct: 'Yes: $2\\pi \\cdot \\frac{2}{5}x^{5/2}\\Big|_0^4 = 2\\pi \\cdot \\frac{64}{5} = 25.6\\pi \\approx 80.42$.',
        incorrect: '$\\int x^{3/2}dx = \\frac25 x^{5/2}$, and $4^{5/2} = 32$: $2\\pi \\cdot \\frac{2}{5} \\cdot 32 = 25.6\\pi \\approx 80.42$.',
      },
    },
  ],
});
