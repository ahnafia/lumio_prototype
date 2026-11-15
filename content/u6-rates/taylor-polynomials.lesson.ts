import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'taylor-polynomials',
  conceptId: 'taylor-polynomials',
  title: 'Taylor polynomials',
  summary: 'Better than a tangent line: match more derivatives.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Hugging the curve',
      visual: { name: 'linear-approx', params: { mode: 'taylor', expr: 'e^x', a: 0, xRange: [-2, 2], yRange: [-1, 7.5], maxDegree: 4 } },
      caption: 'Raise the degree $n$. Each new term makes the dashed polynomial hug $y = e^x$ over a wider stretch around $0$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'definition',
      title: 'Taylor polynomials',
      body: 'The degree-$n$ **Taylor polynomial** of $f$ at $a$ matches $f$ and its first $n$ derivatives at $a$:\n\n$$T_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x - a)^k.$$\n\n$T_1$ is the linearization.',
    },
    {
      type: 'explanation',
      id: 'exp',
      title: 'For eˣ at 0',
      body: 'Every derivative of $e^x$ is $e^x$, which equals $1$ at $x = 0$. So\n\n$$T_n(x) = 1 + x + \\frac{x^2}{2!} + \\cdots + \\frac{x^n}{n!}.$$',
    },
    {
      type: 'numeric',
      id: 'exp-estimate',
      prompt: 'Use $T_2(x) = 1 + x + \\frac{x^2}{2}$ to estimate $e^{0.2}$. Round to 3 decimal places.',
      answer: 1.22,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $1 + 0.2 + 0.02 = 1.22$ (the true value is $1.2214\\ldots$).',
        incorrect: '$T_2(0.2) = 1 + 0.2 + \\frac{0.04}{2} = 1.22$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'cos-t2',
      prompt: 'What is $T_2(x)$ for $f(x) = \\cos x$ at $a = 0$?',
      choices: [
        { id: 'right', text: '$1 - \\dfrac{x^2}{2}$' },
        { id: 'sign', text: '$1 + \\dfrac{x^2}{2}$' },
        { id: 'linear', text: '$1 - x$' },
        { id: 'sin', text: '$x - \\dfrac{x^3}{6}$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Right: $f(0) = 1$, $f'(0) = 0$, $f''(0) = -1$, so $1 + 0x - \\frac{x^2}{2}$.",
        incorrect: "$\\cos 0 = 1$, $-\\sin 0 = 0$, $-\\cos 0 = -1$. So $T_2 = 1 + 0 \\cdot x + \\frac{-1}{2}x^2 = 1 - \\frac{x^2}{2}$.",
      },
    },
    {
      type: 'numeric',
      id: 'from-data',
      prompt: "Suppose $f(2) = 1$, $f'(2) = 3$ and $f''(2) = -4$. Use $T_2$ at $a = 2$ to estimate $f(2.5)$.",
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $1 + 3(0.5) + \\frac{-4}{2}(0.5)^2 = 1 + 1.5 - 0.5 = 2$.',
        incorrect: "$T_2(2.5) = f(2) + f'(2)(0.5) + \\frac{f''(2)}{2}(0.5)^2 = 1 + 1.5 - 0.5 = 2$.",
      },
    },
  ],
});
