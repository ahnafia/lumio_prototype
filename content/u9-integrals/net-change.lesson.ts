import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'net-change',
  conceptId: 'net-change',
  title: 'The Net Change Theorem',
  summary: 'Integrate a rate of change to get the total change.',
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Filling and draining',
      visual: {
        name: 'function-plot',
        params: {
          functions: [{ expr: '20 - 4x', label: 'r(t)' }],
          xRange: [0, 8],
          yRange: [-14, 22],
          xLabel: 't (min)',
          yLabel: 'L/min',
          shade: { upper: '20 - 4x', lower: '0', from: 0, to: 8, toTrace: true, signed: true },
          trace: { fn: 0, start: 0.5, tangent: false },
          readouts: [{ label: 'net change (L)', expr: '20x - 2x^2' }],
          autoplay: true,
        },
      },
      caption: 'Water flows into a tank at $r(t) = 20 - 4t$ L/min (negative means draining). Drag $t$: the signed area so far is the net change in volume.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'theorem',
      title: 'The Net Change Theorem',
      body: "The integral of a rate of change is the net change:\n\n$$\\int_a^b F'(x)\\,dx = F(b) - F(a).$$",
    },
    {
      type: 'explanation',
      id: 'examples',
      title: 'Examples and units',
      body: 'Velocity gives displacement: $\\int_a^b v(t)\\,dt = s(b) - s(a)$. Flow rate gives change in volume; marginal cost gives change in cost.\n\nUnits: (units of the rate) $\\times$ (units of $x$).',
    },
    {
      type: 'numeric',
      id: 'tank',
      prompt: 'Water flows into a tank at $r(t) = 20 - 4t$ L/min. The tank holds 100 L at $t = 0$. How much does it hold at $t = 6$?',
      answer: 148,
      tolerance: 0.01,
      unit: 'L',
      feedback: {
        correct: 'Yes: $\\int_0^6 (20 - 4t)\\,dt = 120 - 72 = 48$, so $100 + 48 = 148$ L.',
        incorrect: 'Net change $= \\int_0^6 (20 - 4t)\\,dt = (20t - 2t^2)\\Big|_0^6 = 48$. Add it to 100: 148 L.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'marginal-cost',
      prompt: "$C'(q)$ is the marginal cost in dollars per item. What does $\\int_{100}^{200} C'(q)\\,dq$ represent?",
      choices: [
        { id: 'right', text: 'The extra cost of raising production from 100 to 200 items' },
        { id: 'total', text: 'The total cost of making 200 items' },
        { id: 'rate', text: 'The cost per item at 200 items' },
        { id: 'average', text: 'The average cost per item' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: it is $C(200) - C(100)$, a change in cost, in dollars.',
        incorrect: 'By net change, it is $C(200) - C(100)$: the added cost of going from 100 to 200 items.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'units',
      prompt: "A population grows at $P'(t)$ people per year. What are the units of $\\int_0^{10} P'(t)\\,dt$?",
      choices: [
        { id: 'people', text: 'people' },
        { id: 'rate', text: 'people per year' },
        { id: 'product', text: 'people × years' },
        { id: 'years', text: 'years' },
      ],
      answer: 'people',
      feedback: {
        correct: 'Yes: (people per year) × (years) = people. It is the change in population.',
        incorrect: '(people/year) × (years) = people: the integral is the net change in population over 10 years.',
      },
    },
  ],
});
