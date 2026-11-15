import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'related-rates-triangles',
  conceptId: 'related-rates-triangles',
  title: 'Related rates with triangles',
  summary: 'Ladders, planes and cars: the Pythagorean theorem links the rates.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'A sliding ladder',
      visual: { name: 'related-rates', params: { scenario: 'ladder', a: 10, rate: 1, start: 6, tMax: 3.5, lengthUnit: 'ft', timeUnit: 's' } },
      caption: 'A 10 ft ladder slips as its foot slides out at 1 ft/s. Scrub time: the top falls slowly at first, then faster and faster.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'pythagoras',
      title: 'Pythagoras links them',
      body: 'Ladder: $x^2 + y^2 = 10^2$. Differentiate in $t$:\n\n$$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0.$$\n\nAt $x = 6$, $y = 8$: $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt} = -\\frac{6}{8}(1) = -0.75$ ft/s.',
    },
    {
      type: 'explanation',
      id: 'plug-last',
      title: 'Plug in last',
      body: 'Differentiate **before** you substitute numbers. If you set $x = 6$ first, $x$ becomes a constant and its rate $\\frac{dx}{dt}$ vanishes from the equation.',
    },
    {
      type: 'numeric',
      id: 'ladder-8',
      prompt: "Same ladder (10 ft, foot moving out at 1 ft/s). Find $\\frac{dy}{dt}$, the rate of the top, when the foot is 8 ft from the wall. A fraction like -2/3 is fine.",
      answer: -1.3333,
      tolerance: 0.01,
      unit: 'ft/s',
      feedback: {
        correct: 'Yes: $y = 6$, so $\\frac{dy}{dt} = -\\frac{8}{6}(1) = -\\frac{4}{3}$ ft/s.',
        incorrect: 'At $x = 8$, $y = \\sqrt{100 - 64} = 6$. Then $\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt} = -\\frac{4}{3}$ ft/s.',
      },
    },
    {
      type: 'numeric',
      id: 'plane',
      prompt: 'A plane flies directly away from you at 500 mph at an altitude of 3 miles. How fast is its distance from you increasing when it is over a point 4 miles away on the ground?',
      visual: { name: 'related-rates', params: { scenario: 'plane', a: 3, rate: 500, start: 0, tMax: 0.016, lengthUnit: 'mi', timeUnit: 'h' } },
      answer: 400,
      tolerance: 0.5,
      unit: 'mph',
      feedback: {
        correct: 'Right: $s = 5$, and $s\\frac{ds}{dt} = x\\frac{dx}{dt}$ gives $\\frac{ds}{dt} = \\frac{4(500)}{5} = 400$ mph.',
        incorrect: '$x^2 + 3^2 = s^2$, so $x\\frac{dx}{dt} = s\\frac{ds}{dt}$. With $x = 4$, $s = 5$: $\\frac{ds}{dt} = \\frac{4 \\cdot 500}{5} = 400$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'two-cars',
      prompt: 'Two cars leave an intersection at the same time: one drives north at 30 mph, the other east at 40 mph. After 1 hour, how fast is the distance between them growing?',
      choices: [
        { id: 'right', text: '50 mph' },
        { id: 'sum', text: '70 mph' },
        { id: 'difference', text: '10 mph' },
        { id: 'squared', text: '2500 mph' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: $z = 50$ and $z\\,z\' = x\\,x\' + y\\,y\' = 40(40) + 30(30)$, so $z\' = 50$ mph.',
        incorrect: "$x^2 + y^2 = z^2$ gives $z z' = x x' + y y'$. With $x = 40$, $y = 30$, $z = 50$: $z' = \\frac{1600 + 900}{50} = 50$.",
      },
    },
  ],
});
