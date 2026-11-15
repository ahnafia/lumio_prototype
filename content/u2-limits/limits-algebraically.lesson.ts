import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'limits-algebraically',
  conceptId: 'limits-algebraically',
  title: 'Factoring and rationalizing',
  summary: 'When plugging in gives 0/0, simplify first.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Zero over zero',
      visual: { name: 'limit-approach', params: { expr: '(sqrt(x) - 2)/(x - 4)', a: 4, xRange: [0, 8], yRange: [0, 0.6], digits: 4 } },
      caption: 'Plugging $x = 4$ into $\\frac{\\sqrt{x} - 2}{x - 4}$ gives $\\frac{0}{0}$. Slide in anyway: the values head to one height.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'factor',
      title: 'Factor and cancel',
      body: '$\\frac{0}{0}$ means "more work", not "no limit".\n\n$$\\frac{x^2 - 9}{x - 3} = \\frac{(x - 3)(x + 3)}{x - 3} = x + 3 \\quad (x \\neq 3),$$\n\nso $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = 6$.',
    },
    {
      type: 'explanation',
      id: 'rationalize',
      title: 'Rationalize',
      body: 'With a square root, multiply by the conjugate:\n\n$$\\frac{\\sqrt{x} - 2}{x - 4} \\cdot \\frac{\\sqrt{x} + 2}{\\sqrt{x} + 2} = \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}.$$\n\nNow plug in: the limit is $\\frac{1}{4}$.',
    },
    {
      type: 'numeric',
      id: 'factor-limit',
      prompt: 'Find $\\lim_{x \\to -2} \\dfrac{x^2 + 5x + 6}{x + 2}$.',
      answer: 1,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\frac{(x + 2)(x + 3)}{x + 2} = x + 3 \\to 1$.',
        incorrect: 'Factor: $x^2 + 5x + 6 = (x + 2)(x + 3)$. Cancel to get $x + 3$, which is $1$ at $x = -2$.',
      },
    },
    {
      type: 'numeric',
      id: 'expand-limit',
      prompt: 'Find $\\lim_{h \\to 0} \\dfrac{(3 + h)^2 - 9}{h}$.',
      answer: 6,
      tolerance: 0.001,
      feedback: {
        correct: 'Right: $\\frac{6h + h^2}{h} = 6 + h \\to 6$.',
        incorrect: 'Expand: $(3 + h)^2 - 9 = 6h + h^2$. Divide by $h$: $6 + h \\to 6$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'conjugate-limit',
      prompt: 'Find $\\lim_{x \\to 0} \\dfrac{\\sqrt{x + 9} - 3}{x}$.',
      choices: [
        { id: 'sixth', text: '$\\frac{1}{6}$' },
        { id: 'third', text: '$\\frac{1}{3}$' },
        { id: 'zero', text: '$0$' },
        { id: 'dne', text: 'It does not exist' },
      ],
      answer: 'sixth',
      feedback: {
        correct: 'Yes: it simplifies to $\\frac{1}{\\sqrt{x + 9} + 3} \\to \\frac{1}{6}$.',
        incorrect: 'Multiply by $\\frac{\\sqrt{x+9} + 3}{\\sqrt{x+9} + 3}$ to get $\\frac{1}{\\sqrt{x + 9} + 3} \\to \\frac{1}{3 + 3} = \\frac16$.',
      },
    },
  ],
});
