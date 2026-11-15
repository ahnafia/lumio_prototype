import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'optimization-practice',
  conceptId: 'optimization-practice',
  title: 'More optimization',
  summary: 'Fences, numbers and rectangles: the same four steps every time.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Fence a field',
      visual: { name: 'optimizer', params: { scenario: 'fence', size: 100, xStart: 6, unit: 'm' } },
      caption: 'You have 100 m of fence for three sides of a field; the river is the fourth side. Slide the width $x$ to find the biggest area.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'setup',
      title: 'Set it up',
      body: "Two widths $x$ and one length $100 - 2x$, so\n\n$$A(x) = x(100 - 2x), \\quad 0 \\le x \\le 50.$$\n\n$A'(x) = 100 - 4x = 0$ at $x = 25$: a $25 \\times 50$ field with area $1250$ m².",
    },
    {
      type: 'numeric',
      id: 'fence-240',
      prompt: 'With 240 m of fence for three sides along a river, what is the largest possible area?',
      answer: 7200,
      tolerance: 0.5,
      unit: 'm²',
      feedback: {
        correct: "Yes: $A = x(240 - 2x)$, $A' = 240 - 4x = 0$ at $x = 60$, so $60 \\times 120 = 7200$ m².",
        incorrect: "$A(x) = x(240 - 2x)$. $A'(x) = 240 - 4x = 0$ gives $x = 60$, and $A(60) = 60 \\cdot 120 = 7200$.",
      },
    },
    {
      type: 'numeric',
      id: 'min-sum',
      prompt: 'Find the positive number $x$ that minimizes $x + \\dfrac{16}{x}$.',
      answer: 4,
      tolerance: 0.001,
      feedback: {
        correct: "Right: $1 - \\frac{16}{x^2} = 0$ at $x = 4$, and $f''(4) > 0$.",
        incorrect: "$f'(x) = 1 - \\frac{16}{x^2} = 0$ gives $x^2 = 16$, so $x = 4$ (a min since $f'' = \\frac{32}{x^3} > 0$).",
      },
    },
    {
      type: 'numeric',
      id: 'perimeter',
      prompt: 'A rectangle has perimeter 40 cm. What is the largest area it can have?',
      answer: 100,
      tolerance: 0.01,
      unit: 'cm²',
      feedback: {
        correct: 'Yes: $A = x(20 - x)$ peaks at $x = 10$, a $10 \\times 10$ square.',
        incorrect: "Sides $x$ and $20 - x$: $A = x(20 - x)$, $A' = 20 - 2x = 0$ at $x = 10$. Area $100$ cm².",
      },
    },
  ],
});
