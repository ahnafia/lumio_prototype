import { defineCourse } from '@contract/schema';

/**
 * MATH 140 outline, following Guichard & Lyryx, *Calculus: Early Transcendentals* (2021A),
 * Chapters 3.1–7.1 and 8.1–8.4, plus a short functions unit for learning objective 1.
 * `sections` are that textbook's section numbers. Concept id = lesson id = file name.
 */
const c = (id: string, title: string, sections: string[]) => ({ id, title, lessonId: id, sections });

export default defineCourse({
  id: 'math140',
  title: 'MATH 140 · Calculus I',
  units: [
    {
      id: 'u1-functions',
      title: 'Functions as models',
      description: 'Shift, stretch, combine and invert the functions calculus works with.',
      sections: ['1.3', '2.1', '2.2', '2.3', '2.4', '2.5'],
      concepts: [
        c('transformations', 'Transformations', ['2.2']),
        c('composition-and-piecewise', 'Compositions and piecewise functions', ['2.1', '2.2']),
        c('exponential-models', 'Exponential models', ['2.3']),
        c('inverses-and-logarithms', 'Inverses and logarithms', ['2.4', '2.5']),
        c('sinusoidal-models', 'Sinusoidal models', ['1.3']),
      ],
    },
    {
      id: 'u2-limits',
      title: 'Limits',
      description: 'What a function approaches, from tables, graphs and formulas.',
      sections: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6'],
      concepts: [
        c('the-limit', 'The limit', ['3.1']),
        c('one-sided-limits', 'One-sided limits from graphs', ['3.1', '3.3']),
        c('precise-definition', 'The precise definition', ['3.2']),
        c('limit-laws', 'Limit laws', ['3.4']),
        c('limits-algebraically', 'Factoring and rationalizing', ['3.4']),
        c('infinite-limits', 'Infinite limits', ['3.5']),
        c('limits-at-infinity', 'Limits at infinity', ['3.5']),
        c('squeeze-theorem', 'The Squeeze Theorem', ['3.6']),
      ],
    },
    {
      id: 'u3-continuity',
      title: 'Continuity',
      description: 'When a graph has no breaks, and what that guarantees.',
      sections: ['3.7'],
      concepts: [
        c('continuity-at-a-point', 'Continuity at a point', ['3.7']),
        c('discontinuities', 'Types of discontinuity', ['3.7']),
        c('intermediate-value-theorem', 'Intermediate Value Theorem', ['3.7']),
      ],
    },
    {
      id: 'u4-derivative',
      title: 'The derivative',
      description: 'From average rate of change to the slope of a tangent line.',
      sections: ['4.1', '4.2'],
      concepts: [
        c('average-vs-instantaneous', 'Average vs instantaneous rate', ['4.1']),
        c('limit-definition', 'The limit definition', ['4.1', '4.2']),
        c('derivative-function', 'The derivative function', ['4.2']),
        c('differentiability', 'Differentiability', ['4.2']),
        c('higher-derivatives', 'Second derivatives and motion', ['4.2']),
        c('derivative-units', 'Units and meaning', ['4.1', '4.2']),
      ],
    },
    {
      id: 'u5-rules',
      title: 'Differentiation rules',
      description: 'Shortcuts for polynomials, products, quotients, trig, exponentials and more.',
      sections: ['4.3', '4.4', '4.5', '4.6', '4.7', '4.8'],
      concepts: [
        c('power-rule', 'Power, sum and constant rules', ['4.3']),
        c('product-quotient-rules', 'Product and quotient rules', ['4.3']),
        c('trig-derivatives', 'Derivatives of trig functions', ['4.4']),
        c('chain-rule', 'The chain rule', ['4.5']),
        c('exp-log-derivatives', 'Exponentials and logarithms', ['4.6']),
        c('implicit-differentiation', 'Implicit differentiation', ['4.7']),
        c('logarithmic-differentiation', 'Logarithmic differentiation', ['4.7']),
        c('inverse-derivatives', 'Derivatives of inverse functions', ['4.8']),
      ],
    },
    {
      id: 'u6-rates',
      title: 'Related rates and approximations',
      description: 'Linked rates, tangent-line estimates and indeterminate limits.',
      sections: ['5.1', '5.4', '5.5'],
      concepts: [
        c('related-rates', 'Related rates', ['5.1']),
        c('related-rates-triangles', 'Related rates with triangles', ['5.1']),
        c('linear-approximation', 'Linear approximation', ['5.4']),
        c('differentials', 'Differentials', ['5.4']),
        c('taylor-polynomials', 'Taylor polynomials', ['5.4']),
        c('newtons-method', "Newton's method", ['5.4']),
        c('lhopitals-rule', "L'Hôpital's rule", ['5.5']),
      ],
    },
    {
      id: 'u7-extrema',
      title: 'Extrema and the Mean Value Theorem',
      description: 'Where functions peak and bottom out, and what slopes must happen.',
      sections: ['5.2', '5.3'],
      concepts: [
        c('local-extrema', 'Local extrema and critical values', ['5.2']),
        c('absolute-extrema', 'Absolute extrema', ['5.2']),
        c('mean-value-theorem', "Rolle's and the Mean Value Theorem", ['5.3']),
      ],
    },
    {
      id: 'u8-sketching',
      title: 'Curve sketching and optimization',
      description: 'Read the shape of a graph from its derivatives, then find the best value.',
      sections: ['5.6', '5.7'],
      concepts: [
        c('first-derivative-test', 'Increasing, decreasing, first derivative test', ['5.6']),
        c('concavity', 'Concavity and inflection points', ['5.6']),
        c('second-derivative-test', 'The second derivative test', ['5.6']),
        c('curve-sketching', 'Putting a sketch together', ['5.6']),
        c('optimization', 'Optimization', ['5.7']),
        c('optimization-practice', 'More optimization', ['5.7']),
      ],
    },
    {
      id: 'u9-integrals',
      title: 'Integrals',
      description: 'Area, Riemann sums, antiderivatives and the Fundamental Theorem of Calculus.',
      sections: ['6.1', '6.2', '6.3'],
      concepts: [
        c('displacement-and-area', 'Displacement and area', ['6.1']),
        c('riemann-sums', 'Riemann sums', ['6.1']),
        c('definite-integral', 'The definite integral', ['6.1']),
        c('integral-properties', 'Properties of definite integrals', ['6.2']),
        c('antiderivatives', 'Antiderivatives', ['6.3']),
        c('ftc-evaluate', 'FTC: evaluating integrals', ['6.2']),
        c('ftc-derivative', 'FTC: the derivative of an integral', ['6.2']),
        c('net-change', 'The Net Change Theorem', ['6.2', '8.1']),
      ],
    },
    {
      id: 'u10-substitution',
      title: 'Substitution',
      description: 'Undo the chain rule to integrate composite functions.',
      sections: ['7.1'],
      concepts: [
        c('u-substitution', 'The substitution rule', ['7.1']),
        c('substitution-definite', 'Substitution in definite integrals', ['7.1']),
      ],
    },
    {
      id: 'u11-applications',
      title: 'Applications of integration',
      description: 'Distance, areas between curves, volumes and average value.',
      sections: ['8.1', '8.2', '8.3', '8.4'],
      concepts: [
        c('net-and-total-distance', 'Net and total distance', ['8.1']),
        c('area-between-curves', 'Area between curves', ['8.2']),
        c('volume-cross-sections', 'Volume by slicing', ['8.3']),
        c('volume-disks-washers', 'Disks and washers', ['8.3']),
        c('volume-shells', 'Cylindrical shells', ['8.3']),
        c('average-value', 'Average value of a function', ['8.4']),
        c('course-review', 'Putting it all together', ['4.5', '5.7', '6.2', '8.2']),
      ],
    },
  ],
});
