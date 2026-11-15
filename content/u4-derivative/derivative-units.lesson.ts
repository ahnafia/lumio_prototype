import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'derivative-units',
  conceptId: 'derivative-units',
  title: 'Units and meaning',
  summary: "What f'(a) means in context, and its units.",
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'How fast is it cooling?',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '20 + 70 e^(-0.05x)' }],
          xRange: [0, 60],
          yRange: [0, 100],
          xLabel: 't (min)',
          yLabel: 'T (°C)',
          trace: { fn: 0, start: 5, tangent: true },
          autoplay: true,
        },
      },
      caption: 'Coffee cools as $T(t) = 20 + 70e^{-0.05t}$ (°C after $t$ minutes). Drag along: the slope is the cooling rate in °C per minute.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'units',
      title: 'Units of the derivative',
      body: 'If $y = f(x)$, then $f\'(x)$ has units of $\\frac{\\text{units of } y}{\\text{units of } x}$.\n\nIf $C(q)$ is the cost in dollars of making $q$ items, $C\'(q)$ is in dollars per item.',
    },
    {
      type: 'explanation',
      id: 'meaning',
      title: "Interpreting f'(a)",
      body: '$f\'(a)$ is about how much $f$ changes when $x$ goes up by one unit from $a$.\n\n$T\'(10) \\approx -2.1$ means: at 10 minutes, the coffee is cooling by about 2.1 °C per minute.',
    },
    {
      type: 'multiple-choice',
      id: 'population',
      prompt: '$P(t)$ is a town\'s population $t$ years after 2020, and $P\'(3) = 450$. What does this mean?',
      choices: [
        { id: 'right', text: 'In 2023 the population was growing by about 450 people per year' },
        { id: 'value', text: 'The population in 2023 was 450' },
        { id: 'total', text: 'The population grew by 450 from 2020 to 2023' },
        { id: 'time', text: 'It took 3 years to add 450 people' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $P\'(3)$ is a rate at the moment $t = 3$, in people per year.',
        incorrect: '$P\'(3)$ is the growth **rate** at $t = 3$ (2023): about 450 people per year.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'balloon-units',
      prompt: '$V(r)$ is a balloon\'s volume in cm³ when its radius is $r$ cm. What are the units of $V\'(r)$?',
      choices: [
        { id: 'right', text: 'cm³ per cm' },
        { id: 'volume', text: 'cm³' },
        { id: 'flipped', text: 'cm per cm³' },
        { id: 'time', text: 'cm³ per second' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: output units over input units, cm³ per cm.',
        incorrect: 'Output units over input units: cm³ per cm. Time isn\'t involved here.',
      },
    },
    {
      type: 'numeric',
      id: 'estimate-change',
      prompt: 'A car\'s position is $s(t)$ miles after $t$ hours, and $s\'(2) = 55$. Estimate how far it travels between $t = 2$ and $t = 2.1$ hours.',
      answer: 5.5,
      tolerance: 0.01,
      unit: 'miles',
      feedback: {
        correct: 'Yes: about $55 \\times 0.1 = 5.5$ miles.',
        incorrect: 'Rate times time: $55$ mph $\\times 0.1$ h $= 5.5$ miles.',
      },
    },
  ],
});
