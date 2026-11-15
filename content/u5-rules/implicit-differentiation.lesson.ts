import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'implicit-differentiation',
  conceptId: 'implicit-differentiation',
  title: 'Implicit differentiation',
  summary: 'Find dy/dx when y is tangled up with x in an equation.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slopes on a circle',
      visual: { name: 'implicit-tangent', params: { a: 5, b: 5, startDeg: 60 } },
      caption: "Drag the point around $x^2 + y^2 = 25$. The circle isn't one function of $x$, but every point still has a tangent slope: $\\frac{dy}{dx} = -\\frac{x}{y}$.",
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'method',
      title: 'Implicit differentiation',
      body: 'Differentiate both sides with respect to $x$, treating $y$ as a function of $x$. By the chain rule, $\\frac{d}{dx}y^2 = 2y\\frac{dy}{dx}$.\n\nThen solve for $\\frac{dy}{dx}$.',
    },
    {
      type: 'explanation',
      id: 'circle',
      title: 'The circle',
      body: '$$x^2 + y^2 = 25 \\;\\Rightarrow\\; 2x + 2y\\frac{dy}{dx} = 0 \\;\\Rightarrow\\; \\frac{dy}{dx} = -\\frac{x}{y}.$$\n\nAt $(3, 4)$ the slope is $-\\frac{3}{4}$.',
    },
    {
      type: 'numeric',
      id: 'circle-slope',
      prompt: 'On $x^2 + y^2 = 25$, find $\\dfrac{dy}{dx}$ at $(-4, 3)$. A fraction like 2/3 is fine.',
      answer: 1.3333,
      tolerance: 0.01,
      feedback: {
        correct: 'Yes: $-\\frac{x}{y} = -\\frac{-4}{3} = \\frac{4}{3}$.',
        incorrect: '$\\frac{dy}{dx} = -\\frac{x}{y} = -\\frac{-4}{3} = \\frac43 \\approx 1.333$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'folium',
      prompt: 'For $x^3 + y^3 = 6xy$, which is $\\dfrac{dy}{dx}$?',
      choices: [
        { id: 'right', text: '$\\dfrac{2y - x^2}{y^2 - 2x}$' },
        { id: 'no-product', text: '$-\\dfrac{x^2}{y^2}$' },
        { id: 'sign', text: '$\\dfrac{2y - x^2}{2x - y^2}$' },
        { id: 'partial', text: '$\\dfrac{x^2 - 2y}{y^2}$' },
      ],
      answer: 'right',
      feedback: {
        correct: "Yes: $3x^2 + 3y^2y' = 6y + 6xy'$, so $y'(3y^2 - 6x) = 6y - 3x^2$.",
        incorrect: "Use the product rule on $6xy$: $3x^2 + 3y^2y' = 6y + 6xy'$, giving $y' = \\frac{2y - x^2}{y^2 - 2x}$.",
      },
    },
    {
      type: 'numeric',
      id: 'hyperbola',
      prompt: 'For $xy = 6$, find $\\dfrac{dy}{dx}$ at $(2, 3)$.',
      answer: -1.5,
      tolerance: 0.001,
      feedback: {
        correct: "Right: $y + xy' = 0$, so $y' = -\\frac{y}{x} = -\\frac32$.",
        incorrect: "Product rule: $1 \\cdot y + x y' = 0$, so $y' = -\\frac{y}{x} = -\\frac{3}{2} = -1.5$.",
      },
    },
  ],
});
