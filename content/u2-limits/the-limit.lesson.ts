import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'the-limit',
  conceptId: 'the-limit',
  title: 'The limit',
  summary: 'What value does f(x) head toward as x closes in on a?',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Closing in',
      visual: { name: 'limit-approach', params: { expr: '(x^2 - 1)/(x - 1)', a: 1, xRange: [-1, 3], yRange: [-0.5, 4] } },
      caption: 'Slide the points toward $x = 1$ from both sides. The formula $\\frac{x^2 - 1}{x - 1}$ is undefined at $1$, yet $f(x)$ heads to one value.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'The limit',
      body: '$\\lim_{x \\to a} f(x) = L$ means $f(x)$ gets as close as we like to $L$ when $x$ is close enough to $a$, on either side, but **not equal** to $a$.\n\nWhat happens **at** $a$ doesn\'t matter.',
    },
    {
      type: 'explanation',
      id: 'tables',
      title: 'Estimating with a table',
      body: 'Plug in $x$ values closer and closer to $a$ from both sides, like $0.9, 0.99, 0.999$ and $1.1, 1.01, 1.001$.\n\nIf both sides settle on the same number, that number is the limit. Here it is $2$.',
    },
    {
      type: 'multiple-choice',
      id: 'read-table',
      prompt: 'Use the table to find $\\lim_{x \\to 3} f(x)$.\n\n$$\\begin{array}{c|ccc|ccc} x & 2.9 & 2.99 & 2.999 & 3.001 & 3.01 & 3.1 \\\\ \\hline f(x) & 5.8 & 5.98 & 5.998 & 6.002 & 6.02 & 6.2 \\end{array}$$',
      choices: [
        { id: 'six', text: '$6$' },
        { id: 'last', text: '$5.998$' },
        { id: 'three', text: '$3$' },
        { id: 'dne', text: 'It does not exist' },
      ],
      answer: 'six',
      feedback: {
        correct: 'Yes: both sides close in on $6$.',
        incorrect: 'From the left and the right, $f(x)$ settles toward $6$, so the limit is $6$.',
      },
    },
    {
      type: 'numeric',
      id: 'estimate-sinx',
      prompt: 'Estimate $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ by computing $\\frac{\\sin x}{x}$ at $x = 0.01$ (radians). Round to 2 decimal places.',
      answer: 1,
      tolerance: 0.006,
      feedback: {
        correct: 'Right: $\\frac{\\sin 0.01}{0.01} \\approx 0.99998$, so the limit looks like $1$.',
        incorrect: '$\\frac{\\sin(0.01)}{0.01} \\approx 0.99998 \\approx 1.00$. (Use radians.)',
      },
    },
    {
      type: 'multiple-choice',
      id: 'value-vs-limit',
      prompt: 'Suppose $f(2) = 7$, but $f(x)$ approaches $3$ as $x \\to 2$ from both sides. What is $\\lim_{x \\to 2} f(x)$?',
      choices: [
        { id: 'three', text: '$3$' },
        { id: 'seven', text: '$7$' },
        { id: 'avg', text: '$5$' },
        { id: 'dne', text: 'It does not exist' },
      ],
      answer: 'three',
      feedback: {
        correct: 'Yes: the limit only cares about nearby $x$, not $f(2)$ itself.',
        incorrect: 'The limit is where $f(x)$ heads, $3$. The value $f(2) = 7$ doesn\'t affect it.',
      },
    },
  ],
});
