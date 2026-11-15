import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'transformations',
  conceptId: 'transformations',
  title: 'Transformations',
  summary: 'Shift, stretch and flip a graph by changing its formula.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slide the parabola',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '(x - h)^2', label: 'y = (x − h)²' }, { expr: 'x^2', color: 'muted', dashed: true }],
          xRange: [-5, 5],
          yRange: [-1, 9],
          slider: { name: 'h', label: 'h', min: -3, max: 3, step: 0.1, start: 0 },
          autoplay: true,
        },
      },
      caption: 'Slide $h$. The graph of $y = (x - h)^2$ is $y = x^2$ moved sideways. Which way does it go when $h$ is positive?',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'shifts',
      title: 'Shifts',
      body: '$y = f(x - h) + k$ moves the graph of $f$ **right** $h$ and **up** $k$.\n\nInside the parentheses the sign feels backwards: $f(x - 2)$ moves **right** 2 and $f(x + 2)$ moves **left** 2.',
    },
    {
      type: 'explanation',
      id: 'stretches',
      title: 'Stretches and flips',
      body: '$y = a\\,f(x)$ stretches the graph vertically by $|a|$. A negative $a$ also flips it over the $x$-axis.\n\n$y = f(bx)$ squeezes it horizontally by a factor of $b$.',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'a * x^2', label: 'y = a·x²' }, { expr: 'x^2', color: 'muted', dashed: true }],
          xRange: [-4, 4],
          yRange: [-8, 8],
          slider: { name: 'a', label: 'a', min: -2, max: 2, step: 0.1, start: 1 },
        },
      },
    },
    {
      type: 'multiple-choice',
      id: 'describe-shift',
      prompt: 'The graph of $y = (x + 3)^2 - 1$ is the graph of $y = x^2$ moved…',
      choices: [
        { id: 'left-down', text: 'left 3 and down 1' },
        { id: 'right-down', text: 'right 3 and down 1' },
        { id: 'left-up', text: 'left 3 and up 1' },
        { id: 'right-up', text: 'right 3 and up 1' },
      ],
      answer: 'left-down',
      feedback: {
        correct: 'Yes: $x + 3 = x - (-3)$ moves it left 3, and $-1$ moves it down 1.',
        incorrect: '$x + 3 = x - (-3)$, so it moves **left** 3; the $-1$ outside moves it **down** 1.',
      },
    },
    {
      type: 'graph-tap',
      id: 'tap-vertex',
      prompt: 'Tap the vertex (the highest point) of $y = -(x - 1)^2 + 2$.',
      plot: { functions: [{ expr: '-(x - 1)^2 + 2' }], xRange: [-3, 4], yRange: [-4, 4] },
      target: { x: 1, y: 2 },
      tolerance: 0.4,
      feedback: {
        correct: 'Right: shifted right 1, flipped, then up 2 puts the vertex at $(1, 2)$.',
        incorrect: '$x - 1$ shifts right 1 and $+2$ shifts up 2, so the vertex is at $(1, 2)$.',
      },
    },
    {
      type: 'numeric',
      id: 'delayed-ball',
      prompt: 'A ball\'s height is $h(t) = -16t^2 + 64$ feet. A second ball is dropped 2 seconds later, so its height is $g(t) = h(t - 2)$. Find $g(3)$.',
      answer: 48,
      tolerance: 0.01,
      unit: 'ft',
      feedback: {
        correct: 'Yes: $g(3) = h(1) = -16 + 64 = 48$ feet.',
        incorrect: '$g(3) = h(3 - 2) = h(1) = -16(1)^2 + 64 = 48$ feet.',
      },
    },
  ],
});
