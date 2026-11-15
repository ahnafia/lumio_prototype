import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'chain-rule',
  conceptId: 'chain-rule',
  title: 'The chain rule',
  summary: 'Rates multiply through a composition: outside times inside.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Gears in a chain',
      visual: { name: 'chain-gears', params: { dudx: 2, dydu: 3 } },
      caption: 'Turn gear $x$. Gear $u$ turns twice as fast as $x$, and gear $y$ turns 3 times as fast as $u$. So $y$ turns $3 \\times 2 = 6$ times as fast as $x$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'rule',
      title: 'The chain rule',
      body: "If $y = f(u)$ and $u = g(x)$, then\n\n$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}, \\quad\\text{i.e.}\\quad \\frac{d}{dx} f(g(x)) = f'(g(x))\\, g'(x).$$\n\nOutside derivative (inside left alone) times inside derivative.",
    },
    {
      type: 'explanation',
      id: 'examples',
      title: 'Two examples',
      body: '$\\frac{d}{dx}(x^2 + 1)^5 = 5(x^2 + 1)^4 \\cdot 2x = 10x(x^2 + 1)^4$\n\n$\\frac{d}{dx}\\sin(3x) = \\cos(3x) \\cdot 3 = 3\\cos(3x)$',
    },
    {
      type: 'multiple-choice',
      id: 'power-chain',
      prompt: 'Find $\\dfrac{d}{dx}(3x^2 - 1)^4$.',
      choices: [
        { id: 'right', text: '$24x(3x^2 - 1)^3$' },
        { id: 'no-inner', text: '$4(3x^2 - 1)^3$' },
        { id: 'inside', text: '$4(6x)^3$' },
        { id: 'power', text: '$24x(3x^2 - 1)^4$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $4(3x^2 - 1)^3 \\cdot 6x = 24x(3x^2 - 1)^3$.',
        incorrect: "Outside: $4(3x^2 - 1)^3$. Inside: $6x$. Multiply: $24x(3x^2 - 1)^3$.",
      },
    },
    {
      type: 'numeric',
      id: 'trig-chain',
      prompt: 'Find $\\dfrac{dy}{dx}$ at $x = 0$ for $y = \\cos\\!\\left(5x + \\dfrac{\\pi}{2}\\right)$.',
      answer: -5,
      tolerance: 0.001,
      feedback: {
        correct: "Right: $y' = -5\\sin(5x + \\frac{\\pi}{2})$, and $\\sin\\frac{\\pi}{2} = 1$.",
        incorrect: "$y' = -\\sin(5x + \\frac{\\pi}{2}) \\cdot 5$. At $x = 0$: $-5\\sin\\frac{\\pi}{2} = -5$.",
      },
    },
    {
      type: 'numeric',
      id: 'table-chain',
      prompt: "Suppose $f(2) = 3$, $f'(2) = 4$, $g(1) = 2$ and $g'(1) = -5$. Find $(f \\circ g)'(1)$.",
      answer: -20,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $f'(g(1))\\,g'(1) = f'(2)(-5) = 4(-5) = -20$.",
        incorrect: "$(f \\circ g)'(1) = f'(g(1)) \\cdot g'(1) = f'(2) \\cdot (-5) = 4 \\cdot (-5) = -20$.",
      },
    },
  ],
});
