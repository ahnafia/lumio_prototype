import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'optimization',
  conceptId: 'optimization',
  title: 'Optimization',
  summary: 'Turn a word problem into one function, then find its best value.',
  estMinutes: 5,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Build the biggest box',
      visual: { name: 'optimizer', params: { scenario: 'box', size: 12, xStart: 0.6, unit: 'in' } },
      caption: 'Cut equal squares from the corners of a 12 in sheet and fold up the sides. Slide the cut size $x$: too small makes a flat tray, too big a skinny tower. The best box is in between.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'guidelines',
      title: 'Guidelines',
      body: '1. Decide what to maximize or minimize, and the constraints.\n2. Draw and label a picture.\n3. Write the quantity as a function of **one** variable, using the constraint.\n4. Check its critical values and the endpoints.',
    },
    {
      type: 'explanation',
      id: 'box',
      title: 'The box',
      body: "$V(x) = x(12 - 2x)^2$ for $0 \\le x \\le 6$.\n\n$V'(x) = (12 - 2x)(12 - 6x) = 0$ at $x = 2$ or $x = 6$.\n\n$V(2) = 128$ in³ beats the endpoints $V(0) = V(6) = 0$.",
    },
    {
      type: 'numeric',
      id: 'box-18-x',
      prompt: 'Now the sheet is 18 in square. What cut size $x$ gives the biggest box?',
      answer: 3,
      tolerance: 0.001,
      unit: 'in',
      feedback: {
        correct: "Yes: $V'(x) = (18 - 2x)(18 - 6x) = 0$ at $x = 3$ (and $x = 9$ gives $V = 0$).",
        incorrect: "$V(x) = x(18 - 2x)^2$ and $V'(x) = (18 - 2x)(18 - 6x)$. The interior critical value is $x = 3$.",
      },
    },
    {
      type: 'numeric',
      id: 'box-18-v',
      prompt: 'What is that maximum volume?',
      answer: 432,
      tolerance: 0.5,
      unit: 'in³',
      feedback: {
        correct: 'Right: $V(3) = 3(12)^2 = 432$ in³.',
        incorrect: '$V(3) = 3 \\cdot (18 - 6)^2 = 3 \\cdot 144 = 432$ in³.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'endpoints',
      prompt: 'Why check the endpoints in a closed-interval optimization problem?',
      choices: [
        { id: 'right', text: 'The max or min can happen at an endpoint' },
        { id: 'critical', text: 'Endpoints are always critical values' },
        { id: 'defined', text: "To make sure $f'$ is defined" },
        { id: 'never', text: "You don't need to" },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: the absolute max or min may sit at an end, where $f\'$ need not be $0$.',
        incorrect: 'Absolute extrema can occur at endpoints, where the derivative need not be $0$. Always compare them.',
      },
    },
  ],
});
