import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'product-quotient-rules',
  conceptId: 'product-quotient-rules',
  title: 'Product and quotient rules',
  summary: 'The derivative of a product is not the product of derivatives.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Check the product rule',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: 'x^2 * (3 - x)' }],
          xRange: [-1, 3.5],
          yRange: [-2, 6],
          trace: { fn: 0, start: -0.5, tangent: true },
          readouts: [{ label: "f'g + fg'", expr: '2x * (3 - x) + x^2 * (-1)' }],
          autoplay: true,
        },
      },
      caption: "Drag along $y = x^2(3 - x)$. With $f = x^2$ and $g = 3 - x$, the readout computes $f'g + fg'$. It matches the slope every time.",
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'product',
      title: 'The product rule',
      body: "$$(fg)' = f'g + fg'$$\n\nIt is **not** $f'g'$. Example: $\\frac{d}{dx}[x^2(3 - x)] = 2x(3 - x) + x^2(-1) = 6x - 3x^2$.",
    },
    {
      type: 'explanation',
      id: 'quotient',
      title: 'The quotient rule',
      body: "$$\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$$\n\nThe order on top matters: derivative of the top times the bottom, **minus** the top times the derivative of the bottom.",
    },
    {
      type: 'multiple-choice',
      id: 'product-pick',
      prompt: 'Find $\\dfrac{d}{dx}\\left[(x^2 + 1)(x^3 - 2)\\right]$.',
      choices: [
        { id: 'right', text: '$2x(x^3 - 2) + 3x^2(x^2 + 1)$' },
        { id: 'naive', text: '$6x^3$' },
        { id: 'minus', text: '$2x(x^3 - 2) - 3x^2(x^2 + 1)$' },
        { id: 'sum', text: '$2x + 3x^2$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Yes: $f'g + fg'$ with $f = x^2 + 1$ and $g = x^3 - 2$.",
        incorrect: "Use $f'g + fg'$: $2x(x^3 - 2) + (x^2 + 1)3x^2$. Multiplying derivatives ($6x^3$) is the classic mistake.",
      },
    },
    {
      type: 'numeric',
      id: 'quotient-value',
      prompt: "Find $f'(2)$ for $f(x) = \\dfrac{x}{x^2 + 1}$.",
      answer: -0.12,
      tolerance: 0.001,
      feedback: {
        correct: "Right: $f'(x) = \\frac{1 - x^2}{(x^2 + 1)^2}$, so $f'(2) = \\frac{-3}{25} = -0.12$.",
        incorrect: "$f'(x) = \\frac{(x^2 + 1) - x(2x)}{(x^2 + 1)^2} = \\frac{1 - x^2}{(x^2+1)^2}$; at 2 that's $-\\frac{3}{25} = -0.12$.",
      },
    },
    {
      type: 'multiple-choice',
      id: 'quotient-pick',
      prompt: 'Find $\\dfrac{d}{dx}\\dfrac{3x - 1}{x + 2}$.',
      choices: [
        { id: 'right', text: '$\\dfrac{7}{(x + 2)^2}$' },
        { id: 'order', text: '$\\dfrac{-7}{(x + 2)^2}$' },
        { id: 'naive', text: '$3$' },
        { id: 'sign', text: '$\\dfrac{5}{(x + 2)^2}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $\\frac{3(x + 2) - (3x - 1)(1)}{(x + 2)^2} = \\frac{7}{(x + 2)^2}$.',
        incorrect: 'Top: $3(x + 2) - (3x - 1) = 3x + 6 - 3x + 1 = 7$. So $\\frac{7}{(x + 2)^2}$.',
      },
    },
  ],
});
