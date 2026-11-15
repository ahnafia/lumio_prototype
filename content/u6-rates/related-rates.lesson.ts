import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'related-rates',
  conceptId: 'related-rates',
  title: 'Related rates',
  summary: 'One rate drives another: differentiate the equation that links them.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Blowing up a balloon',
      visual: { name: 'related-rates', params: { scenario: 'balloon', rate: 100, start: 50, tMax: 10, lengthUnit: 'cm', timeUnit: 's' } },
      caption: 'Air goes in at a steady 100 cm³/s. Scrub time: the radius keeps growing, but $\\frac{dr}{dt}$ shrinks as the balloon gets bigger.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'steps',
      title: 'Five steps',
      body: '1. Name the variables (draw a picture).\n2. Write an equation relating them.\n3. Differentiate both sides with respect to $t$.\n4. Plug in the values at the instant in question.\n5. Solve for the unknown rate.',
    },
    {
      type: 'explanation',
      id: 'balloon',
      title: 'The balloon',
      body: '$V = \\frac{4}{3}\\pi r^3$, so $\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}$.\n\nWith $\\frac{dV}{dt} = 100$ and $r = 5$: $\\frac{dr}{dt} = \\frac{100}{4\\pi(25)} = \\frac{1}{\\pi} \\approx 0.318$ cm/s.',
    },
    {
      type: 'numeric',
      id: 'balloon-10',
      prompt: "A balloon's volume grows at 100 cm³/s. How fast is the radius growing when $r = 10$ cm? Round to 3 decimal places.",
      answer: 0.08,
      tolerance: 0.001,
      unit: 'cm/s',
      feedback: {
        correct: 'Yes: $\\frac{dr}{dt} = \\frac{100}{4\\pi(100)} = \\frac{1}{4\\pi} \\approx 0.080$ cm/s.',
        incorrect: '$100 = 4\\pi(10)^2\\frac{dr}{dt}$, so $\\frac{dr}{dt} = \\frac{1}{4\\pi} \\approx 0.080$ cm/s.',
      },
    },
    {
      type: 'numeric',
      id: 'cone',
      prompt: 'Water pours at 2 m³/min into a cone-shaped tank (point down) with top radius 2 m and height 4 m. How fast is the water level rising when it is 2 m deep? Round to 3 decimal places.',
      visual: { name: 'related-rates', params: { scenario: 'cone', a: 2, b: 4, rate: 2, start: 0.05, tMax: 7, lengthUnit: 'm', timeUnit: 'min' } },
      answer: 0.637,
      tolerance: 0.002,
      unit: 'm/min',
      feedback: {
        correct: 'Right: $r = \\frac{h}{2}$ gives $V = \\frac{\\pi h^3}{12}$, so $2 = \\frac{\\pi(4)}{4}\\frac{dh}{dt}$ and $\\frac{dh}{dt} = \\frac{2}{\\pi}$.',
        incorrect: '$r = \\frac{h}{2}$ gives $V = \\frac{\\pi h^3}{12}$, so $2 = \\frac{\\pi h^2}{4}\\frac{dh}{dt}$. At $h = 2$: $\\frac{2}{\\pi} \\approx 0.637$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'circle-setup',
      prompt: "A circle's radius grows at 3 cm/s. Which gives the rate its area changes?",
      choices: [
        { id: 'right', text: '$\\dfrac{dA}{dt} = 2\\pi r \\cdot 3$' },
        { id: 'no-chain', text: '$\\dfrac{dA}{dt} = 2\\pi r$' },
        { id: 'plug-first', text: '$\\dfrac{dA}{dt} = \\pi \\cdot 3^2$' },
        { id: 'area', text: '$\\dfrac{dA}{dt} = \\pi r^2 \\cdot 3$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $A = \\pi r^2$, so $\\frac{dA}{dt} = 2\\pi r \\frac{dr}{dt}$ with $\\frac{dr}{dt} = 3$.',
        incorrect: 'Differentiate $A = \\pi r^2$ in $t$: $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt} = 2\\pi r \\cdot 3$.',
      },
    },
  ],
});
