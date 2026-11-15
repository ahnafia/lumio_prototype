import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'course-review',
  conceptId: 'course-review',
  title: 'Putting it all together',
  summary: 'Rates, extrema and accumulation in one problem set.',
  estMinutes: 5,
  xp: 20,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'One picture, three units',
      visual: { name: 'ftc-accumulator', params: { expr: 'x - 2', a: 0, xRange: [0, 5], yRange: [-2.5, 3.5], ayRange: [-2.5, 2.5], xStart: 0.3 } },
      caption: 'Here $A(x) = \\int_0^x (t - 2)\\,dt$. Its slope is $x - 2$ (the FTC), so it bottoms out where $x - 2 = 0$ (extrema). Drag $x$ and watch it happen.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'big-picture',
      title: 'Connecting the ideas',
      body: 'Derivatives measure rates; integrals add them up. The Fundamental Theorem links them: differentiating $\\int_a^x f(t)\\,dt$ gives $f$, and integrating $F\'$ gives the net change in $F$.',
    },
    {
      type: 'numeric',
      id: 'min-of-area',
      prompt: 'Let $A(x) = \\int_0^x (t - 2)\\,dt$. At what $x > 0$ is $A$ smallest?',
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: "Yes: $A'(x) = x - 2$ goes from negative to positive at $x = 2$.",
        incorrect: "By the FTC, $A'(x) = x - 2$, which changes from $-$ to $+$ at $x = 2$: a minimum.",
      },
    },
    {
      type: 'numeric',
      id: 'rocket',
      prompt: "A rocket's velocity is $v(t) = 3t^2$ m/s. How far does it travel from $t = 0$ until its acceleration reaches 12 m/s²?",
      answer: 8,
      tolerance: 0.001,
      unit: 'm',
      feedback: {
        correct: 'Right: $a(t) = 6t = 12$ at $t = 2$, and $\\int_0^2 3t^2\\,dt = 8$ m.',
        incorrect: '$a(t) = v\'(t) = 6t = 12$ gives $t = 2$. Distance: $\\int_0^2 3t^2\\,dt = t^3\\Big|_0^2 = 8$ m.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'ftc-chain',
      prompt: 'Which equals $\\dfrac{d}{dx}\\displaystyle\\int_0^{\\sin x} e^{t^2}\\,dt$?',
      choices: [
        { id: 'right', text: '$e^{\\sin^2 x}\\cos x$' },
        { id: 'no-chain', text: '$e^{\\sin^2 x}$' },
        { id: 'wrong-in', text: '$e^{x^2}\\cos x$' },
        { id: 'power', text: '$2\\sin x\\, e^{\\sin^2 x}$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: FTC with the chain rule, $f(\\sin x) \\cdot \\cos x$.',
        incorrect: 'Plug the upper limit into the integrand, then multiply by its derivative: $e^{\\sin^2 x} \\cdot \\cos x$.',
      },
    },
  ],
});
