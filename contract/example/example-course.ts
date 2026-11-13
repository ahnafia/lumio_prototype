import { defineCourse } from '../schema';

/**
 * EXAMPLE COURSE: two units and four nodes, enough to build the path's locked,
 * current and done states. The app shows this until content/course.ts has units,
 * or when asked for it with loadCourse({ example: true }).
 */
export default defineCourse({
  id: 'example',
  title: 'Example course',
  units: [
    {
      id: 'example-unit-1',
      title: 'Example unit: slopes',
      description: 'The full example lesson plus a mini lesson.',
      concepts: [
        { id: 'example-slope-of-a-parabola', title: 'Slope of a parabola', lessonId: 'example-everything' },
        { id: 'example-concept-1', title: 'Slope at x = 1', lessonId: 'example-mini-1' },
      ],
    },
    {
      id: 'example-unit-2',
      title: 'Example unit: more slopes',
      description: 'Two more mini lessons so the path has locked nodes.',
      concepts: [
        { id: 'example-concept-2', title: 'Slope at x = 2', lessonId: 'example-mini-2' },
        { id: 'example-concept-3', title: 'Slope at x = 4', lessonId: 'example-mini-3' },
      ],
    },
  ],
});
