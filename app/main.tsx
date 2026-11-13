import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { listAnimations, loadCourse } from '@contract/load';

// PLACEHOLDER: proves the wiring works. Cofounder A replaces this starting with issue #2.
// Remember to import 'katex/dist/katex.min.css' (and 'mafs/core.css' if B uses Mafs) here.
const { course, lessons, isExample } = loadCourse();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Lumio</h1>
      <p>
        {course.title}: {course.units.length} units, {Object.keys(lessons).length} lessons, {listAnimations().length} animations
        {isExample ? ' (example course, because content/course.ts has no units yet)' : ''}.
      </p>
      <p>
        The app gets built here, starting with issue #2. The animation gallery is at <a href="./gallery.html">gallery.html</a>.
      </p>
    </main>
  </StrictMode>,
);
