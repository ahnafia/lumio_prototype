import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'precise-definition',
  conceptId: 'precise-definition',
  title: 'The precise definition',
  summary: 'Epsilon and delta: what "as close as we like" really means.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Any band you like',
      visual: { name: 'epsilon-delta', params: { expr: '2x + 1', a: 2, L: 5, xRange: [0, 4], yRange: [0, 9], epsMax: 2, epsStart: 1.5 } },
      caption: 'Shrink $\\varepsilon$, the band around $L = 5$. There is always a band around $a = 2$ (width $\\delta$) that keeps the green part of the line inside.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'The precise definition',
      body: '$\\lim_{x \\to a} f(x) = L$ means: for **every** $\\varepsilon > 0$ there is a $\\delta > 0$ so that\n\n$$0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon.$$',
    },
    {
      type: 'explanation',
      id: 'find-delta',
      title: 'Finding δ for a line',
      body: 'For $f(x) = 2x + 1$ near $a = 2$:\n\n$$|f(x) - 5| = |2x - 4| = 2|x - 2|.$$\n\nThat is less than $\\varepsilon$ when $|x - 2| < \\frac{\\varepsilon}{2}$, so $\\delta = \\frac{\\varepsilon}{2}$ works.',
    },
    {
      type: 'numeric',
      id: 'delta-value',
      prompt: 'For $\\lim_{x \\to 2}(2x + 1) = 5$ with $\\varepsilon = 0.1$, what is the largest $\\delta$ that works?',
      answer: 0.05,
      tolerance: 0.0001,
      feedback: {
        correct: 'Yes: $\\delta = \\frac{\\varepsilon}{2} = 0.05$.',
        incorrect: '$|f(x) - 5| = 2|x - 2| < 0.1$ needs $|x - 2| < 0.05$, so $\\delta = 0.05$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'delta-rule',
      prompt: 'For $\\lim_{x \\to 1}(5x - 3) = 2$, which choice of $\\delta$ works for every $\\varepsilon > 0$?',
      choices: [
        { id: 'right', text: '$\\delta = \\varepsilon / 5$' },
        { id: 'times', text: '$\\delta = 5\\varepsilon$' },
        { id: 'minus', text: '$\\delta = \\varepsilon - 3$' },
        { id: 'half', text: '$\\delta = \\varepsilon / 2$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: $|5x - 3 - 2| = 5|x - 1| < \\varepsilon$ when $|x - 1| < \\varepsilon/5$.',
        incorrect: '$|(5x - 3) - 2| = 5|x - 1|$, which is below $\\varepsilon$ when $|x - 1| < \\varepsilon/5$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'what-delta-does',
      prompt: 'In the definition, what does $\\delta$ control?',
      choices: [
        { id: 'x', text: 'How close $x$ must be to $a$' },
        { id: 'fx', text: 'How close $f(x)$ must be to $L$' },
        { id: 'fa', text: 'The value of $f(a)$' },
        { id: 'slope', text: 'The slope of $f$ at $a$' },
      ],
      answer: 'x',
      feedback: {
        correct: 'Yes: $\\delta$ is the input tolerance; $\\varepsilon$ is the output tolerance.',
        incorrect: '$\\delta$ limits $|x - a|$ (the input). $\\varepsilon$ limits $|f(x) - L|$ (the output).',
      },
    },
  ],
});
