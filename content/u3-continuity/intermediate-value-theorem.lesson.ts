import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'intermediate-value-theorem',
  conceptId: 'intermediate-value-theorem',
  title: 'Intermediate Value Theorem',
  summary: 'A continuous function hits every height between its endpoint values.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'No jumping over',
      visual: { name: 'intermediate-value', params: { expr: 'x^3 - x - 1', a: 0, b: 2, xRange: [-0.5, 2.5], yRange: [-3, 6], nRange: [-1, 5], nStart: 0 } },
      caption: 'Slide the level $N$ anywhere between $f(0) = -1$ and $f(2) = 5$. The unbroken curve always crosses it somewhere in between.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'theorem',
      title: 'The Intermediate Value Theorem',
      body: 'If $f$ is **continuous** on $[a, b]$ and $N$ is between $f(a)$ and $f(b)$, then $f(c) = N$ for at least one $c$ in $(a, b)$.\n\nContinuity matters: a jump could skip right over $N$.',
      visual: { name: 'intermediate-value', params: { expr: 'x < 1 ? x : x + 2', a: 0, b: 2, xRange: [-0.5, 2.5], yRange: [-1, 5], nRange: [0, 4], nStart: 2 } },
    },
    {
      type: 'explanation',
      id: 'roots',
      title: 'Proving a root exists',
      body: 'If a continuous $f$ changes sign on $[a, b]$, then $0$ is between $f(a)$ and $f(b)$, so $f$ has a root in $(a, b)$.\n\nHalving the interval again and again traps the root.',
    },
    {
      type: 'multiple-choice',
      id: 'guarantee',
      prompt: '$f(x) = x^3 - x - 1$ has $f(1) = -1$ and $f(2) = 5$. What does the IVT guarantee?',
      choices: [
        { id: 'right', text: 'A root somewhere between $1$ and $2$' },
        { id: 'mid', text: 'A root at $x = 1.5$' },
        { id: 'unique', text: 'Exactly one root between $1$ and $2$' },
        { id: 'none', text: 'No root between $1$ and $2$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $0$ is between $-1$ and $5$, so some $c$ in $(1, 2)$ has $f(c) = 0$.',
        incorrect: 'The IVT says **some** $c$ in $(1, 2)$ has $f(c) = 0$. It doesn\'t say where, or how many.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'which-interval',
      prompt: 'On which interval does the IVT guarantee a root of $f(x) = x^2 - 5$?',
      choices: [
        { id: 'two-three', text: '$[2, 3]$' },
        { id: 'zero-two', text: '$[0, 2]$' },
        { id: 'three-four', text: '$[3, 4]$' },
        { id: 'sym', text: '$[-1, 1]$' },
      ],
      answer: 'two-three',
      feedback: {
        correct: 'Right: $f(2) = -1 < 0 < 4 = f(3)$.',
        incorrect: 'Look for a sign change: $f(2) = -1$ and $f(3) = 4$, so $[2, 3]$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'hypothesis',
      prompt: '$g(x) = \\frac{1}{x}$ has $g(-1) = -1$ and $g(1) = 1$, yet $g(c) = 0$ never happens. Why doesn\'t this break the IVT?',
      choices: [
        { id: 'continuity', text: '$g$ is not continuous on $[-1, 1]$' },
        { id: 'between', text: '$0$ is not between $-1$ and $1$' },
        { id: 'poly', text: 'The IVT only applies to polynomials' },
        { id: 'equal', text: 'The IVT needs $g(-1) = g(1)$' },
      ],
      answer: 'continuity',
      feedback: {
        correct: 'Exactly: $g$ is undefined at $0$, so the hypothesis fails.',
        incorrect: '$g$ isn\'t continuous on $[-1, 1]$ (it\'s undefined at $0$), so the IVT doesn\'t apply.',
      },
    },
  ],
});
