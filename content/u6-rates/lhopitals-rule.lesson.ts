import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'lhopitals-rule',
  conceptId: 'lhopitals-rule',
  title: "L'Hôpital's rule",
  summary: 'For 0/0 and ∞/∞, compare the rates of the top and bottom.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A race to zero',
      visual: { name: 'limit-approach', params: { expr: '(e^x - 1)/x', a: 0, xRange: [-2, 2], yRange: [-0.5, 3], digits: 4 } },
      caption: '$\\frac{e^x - 1}{x}$ is $\\frac{0}{0}$ at $x = 0$. Slide in: it heads to $1$, the ratio of the slopes of $e^x - 1$ and $x$ at $0$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'rule',
      title: "L'Hôpital's rule",
      body: "If $\\lim \\frac{f(x)}{g(x)}$ has the form $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$, then\n\n$$\\lim \\frac{f(x)}{g(x)} = \\lim \\frac{f'(x)}{g'(x)}$$\n\nwhen the right side exists (or is $\\pm\\infty$). Differentiate top and bottom **separately**: this is not the quotient rule.",
    },
    {
      type: 'explanation',
      id: 'other-forms',
      title: 'Other indeterminate forms',
      body: 'Rewrite $0 \\cdot \\infty$ as a fraction first: $x\\ln x = \\frac{\\ln x}{1/x}$.\n\nFor $1^\\infty$, $0^0$ or $\\infty^0$, take $\\ln$ of the expression, find that limit, then exponentiate.',
    },
    {
      type: 'numeric',
      id: 'sin2x',
      prompt: "Use L'Hôpital's rule to find $\\lim_{x \\to 0} \\dfrac{\\sin(2x)}{x}$.",
      answer: 2,
      tolerance: 0.001,
      feedback: {
        correct: 'Yes: $\\frac{2\\cos(2x)}{1} \\to 2$.',
        incorrect: 'It is $\\frac00$. Differentiate top and bottom: $\\frac{2\\cos 2x}{1} \\to 2$.',
      },
    },
    {
      type: 'numeric',
      id: 'growth',
      prompt: 'Find $\\lim_{x \\to \\infty} \\dfrac{x^2}{e^x}$.',
      answer: 0,
      tolerance: 0.0001,
      feedback: {
        correct: 'Right: twice gives $\\frac{2}{e^x} \\to 0$. Exponentials beat powers.',
        incorrect: '$\\frac{\\infty}{\\infty}$ twice: $\\frac{x^2}{e^x} \\to \\frac{2x}{e^x} \\to \\frac{2}{e^x} \\to 0$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'not-indeterminate',
      prompt: "Why can't you use L'Hôpital's rule on $\\lim_{x \\to 1} \\dfrac{x^2 + 1}{x - 1}$?",
      choices: [
        { id: 'right', text: 'It is not $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$' },
        { id: 'poly', text: "Polynomials aren't allowed" },
        { id: 'bottom', text: 'The bottom has derivative $1$' },
        { id: 'can', text: 'You can: the limit is $2$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: it is $\\frac{2}{0}$, so it blows up. Applying the rule anyway gives a wrong "2".',
        incorrect: 'At $x = 1$ it is $\\frac{2}{0}$, not indeterminate, so the rule does not apply. (It actually diverges.)',
      },
    },
  ],
});
