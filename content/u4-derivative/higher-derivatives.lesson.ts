import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'higher-derivatives',
  conceptId: 'higher-derivatives',
  title: 'Second derivatives and motion',
  summary: 'Position, velocity, acceleration: derivatives of derivatives.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Back and forth',
      visual: { name: 'motion-line', params: { expr: 'x^3 - 6x^2 + 9x', tMax: 4, sRange: [-1, 5], vRange: [-4, 10] } },
      caption: 'A particle has position $s(t) = t^3 - 6t^2 + 9t$. Scrub time: when the velocity $v(t)$ is positive it moves right; when $v(t)$ is negative it moves left.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'second',
      title: 'The second derivative',
      body: 'The derivative of $f\'$ is the **second derivative** $f\'\'$, also written $\\frac{d^2y}{dx^2}$.\n\nFor motion: position $s(t)$, velocity $v(t) = s\'(t)$, acceleration $a(t) = v\'(t) = s\'\'(t)$.',
    },
    {
      type: 'multiple-choice',
      id: 'at-rest',
      prompt: 'This particle\'s velocity is $v(t) = 3(t - 1)(t - 3)$. When is it at rest?',
      choices: [
        { id: 'right', text: '$t = 1$ and $t = 3$' },
        { id: 'position', text: '$t = 0$ and $t = 3$' },
        { id: 'accel', text: '$t = 2$' },
        { id: 'never', text: 'Never' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: at rest means $v(t) = 0$, at $t = 1$ and $t = 3$.',
        incorrect: 'At rest means $v(t) = 0$: $3(t - 1)(t - 3) = 0$ at $t = 1$ and $t = 3$. ($s = 0$ is about position.)',
      },
    },
    {
      type: 'multiple-choice',
      id: 'direction',
      prompt: 'For $1 < t < 3$, $v(t) = 3(t - 1)(t - 3)$ is negative. What is the particle doing?',
      choices: [
        { id: 'left', text: 'Moving in the negative direction' },
        { id: 'right', text: 'Moving in the positive direction' },
        { id: 'rest', text: 'Standing still' },
        { id: 'below', text: 'Located at a negative position' },
      ],
      answer: 'left',
      feedback: {
        correct: 'Right: the sign of $v$ is the direction of motion.',
        incorrect: 'Negative velocity means moving in the negative direction (left). Position can still be positive.',
      },
    },
    {
      type: 'numeric',
      id: 'second-of-square',
      prompt: 'For $f(x) = x^2$ we found $f\'(x) = 2x$. What is $f\'\'(5)$?',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $f\'(x) = 2x$ is a line with slope $2$, so $f\'\'(x) = 2$ everywhere.',
        incorrect: '$f\'\'$ is the slope of $f\'(x) = 2x$, which is $2$ for every $x$, including $5$.',
      },
    },
  ],
});
