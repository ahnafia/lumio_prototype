import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'inverses-and-logarithms',
  conceptId: 'inverses-and-logarithms',
  title: 'Inverses and logarithms',
  summary: 'Undo a function, and meet the logarithm as the inverse of an exponential.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Mirror images',
      visual: {
        name: 'function-plot',
        params: {
          functions: [
            { expr: 'e^x', label: 'y = eˣ' },
            { expr: 'log(x)', label: 'y = ln x', color: 'secondary' },
            { expr: 'x', color: 'muted', dashed: true },
          ],
          xRange: [-3, 5],
          yRange: [-3, 5],
          points: [
            { x: 0, y: 1, label: '(0, 1)' },
            { x: 1, y: 0, label: '(1, 0)', color: 'secondary' },
          ],
          trace: { fn: 0, start: -1, tangent: false },
          readouts: [{ label: 'ln(y)', expr: 'log(e^x)' }],
          autoplay: true,
        },
      },
      caption: 'The graphs of $y = e^x$ and $y = \\ln x$ are reflections across $y = x$. Drag the point: taking $\\ln$ of its height gives back $x$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'inverse',
      title: 'Inverse functions',
      body: '$f^{-1}$ undoes $f$: if $f(a) = b$ then $f^{-1}(b) = a$. Its graph is the graph of $f$ reflected across $y = x$.\n\nOnly **one-to-one** functions (passing the horizontal line test) have inverses.',
    },
    {
      type: 'explanation',
      id: 'logs',
      title: 'Logarithms',
      body: '$\\log_b x = y$ means $b^y = x$. The natural log is $\\ln x = \\log_e x$.\n\nRules: $\\ln(ab) = \\ln a + \\ln b$, $\\ln(a^r) = r\\ln a$, and $\\ln e^x = x = e^{\\ln x}$.',
    },
    {
      type: 'numeric',
      id: 'solve-exp',
      prompt: 'Solve $e^{2x} = 9$. Round to 3 decimal places.',
      answer: 1.099,
      tolerance: 0.002,
      feedback: {
        correct: 'Yes: $2x = \\ln 9$, so $x = \\frac{\\ln 9}{2} \\approx 1.099$.',
        incorrect: 'Take $\\ln$ of both sides: $2x = \\ln 9$, so $x = \\frac{\\ln 9}{2} \\approx 1.099$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'find-inverse',
      prompt: 'If $f(x) = 2x + 6$, what is $f^{-1}(x)$?',
      choices: [
        { id: 'right', text: '$\\dfrac{x - 6}{2}$' },
        { id: 'order', text: '$\\dfrac{x}{2} - 6$' },
        { id: 'reciprocal', text: '$\\dfrac{1}{2x + 6}$' },
        { id: 'sign', text: '$2x - 6$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: solve $y = 2x + 6$ for $x$ to get $x = \\frac{y - 6}{2}$.',
        incorrect: 'Undo in reverse order: subtract 6, then divide by 2, so $f^{-1}(x) = \\frac{x - 6}{2}$.',
      },
    },
    {
      type: 'numeric',
      id: 'savings',
      prompt: 'An account grows as $A(t) = 1000e^{0.05t}$ dollars. After how many years does it reach 2000 dollars? Round to 2 decimal places.',
      answer: 13.86,
      tolerance: 0.01,
      unit: 'years',
      feedback: {
        correct: 'Yes: $e^{0.05t} = 2$ gives $t = \\frac{\\ln 2}{0.05} \\approx 13.86$ years.',
        incorrect: 'Divide by 1000: $e^{0.05t} = 2$, so $t = \\frac{\\ln 2}{0.05} \\approx 13.86$ years.',
      },
    },
  ],
});
