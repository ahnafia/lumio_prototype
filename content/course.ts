import { defineCourse } from '@contract/schema';

// Cofounder B fills this in (issue #5): units → concepts in path order, each with a lessonId.
// While `units` is empty the app shows the example course from contract/example.
export default defineCourse({
  id: 'math140',
  title: 'MATH 140 · Calculus I',
  units: [],
});
