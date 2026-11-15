import { defineLesson } from '@contract/schema';

export default defineLesson({
  id: 'derivative-function',
  conceptId: 'derivative-function',
  title: 'The derivative function',
  summary: "Read the graph of f' from the graph of f.",
  estMinutes: 4,
  screens: [
    {
      type: 'animation',
      id: 'see-it',
      title: 'Slope makes a graph',
      visual: { name: 'derivative-tracer', params: { expr: 'x^3 - 3x', xRange: [-2.2, 2.2], yRange: [-5, 5], dyRange: [-4, 13] } },
      caption: 'Drag along $f(x) = x^3 - 3x$. The tangent slope at each $x$ is plotted below. That new graph is $f\'$.',
      requireInteraction: true,
    },
    {
      type: 'explanation',
      id: 'reading',
      title: "Reading f' from f",
      body: 'Where $f$ rises, $f\' > 0$ (green). Where $f$ falls, $f\' < 0$ (red).\n\nAt a smooth peak or valley the tangent is flat, so $f\' = 0$: the graph of $f\'$ crosses the axis there.',
    },
    {
      type: 'graph-tap',
      id: 'tap-peak',
      prompt: 'On $f(x) = x^3 - 3x$, tap the point where $f\'(x) = 0$ and $f$ switches from rising to falling.',
      plot: { functions: [{ expr: 'x^3 - 3x' }], xRange: [-2.5, 2.5], yRange: [-4, 4] },
      target: { x: -1, y: 2 },
      tolerance: 0.35,
      feedback: {
        correct: 'Yes: the peak at $(-1, 2)$ has a flat tangent.',
        incorrect: 'Rising then falling is a peak: $(-1, 2)$, where the tangent is flat.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'line-derivative',
      prompt: 'On an interval where the graph of $f$ is a straight line with slope $-2$, the graph of $f\'$ is:',
      choices: [
        { id: 'right', text: 'a horizontal line at height $-2$' },
        { id: 'slope', text: 'a line with slope $-2$' },
        { id: 'zero', text: 'a horizontal line at height $0$' },
        { id: 'parabola', text: 'a parabola' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Right: the slope is $-2$ everywhere there, so $f\'(x) = -2$.',
        incorrect: '$f\'$ records the slope, which is constantly $-2$: a horizontal line at $-2$.',
      },
    },
    {
      type: 'multiple-choice',
      id: 'parabola-derivative',
      prompt: 'If $f(x) = x^2$, what is the graph of $f\'$?',
      choices: [
        { id: 'right', text: 'The line $y = 2x$' },
        { id: 'same', text: 'The parabola $y = x^2$' },
        { id: 'flat', text: 'The horizontal line $y = 2$' },
        { id: 'half', text: 'The line $y = x$' },
      ],
      answer: 'right',
      feedback: {
        correct: 'Yes: we found $f\'(x) = 2x$, a line through the origin with slope $2$.',
        incorrect: 'From the limit definition, $f\'(x) = 2x$: negative left of $0$, positive right of $0$.',
      },
    },
  ],
});
