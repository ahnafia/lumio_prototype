import { loadCourse, type LoadedCourse } from '@contract/load';
import type { Concept, Lesson, Unit } from '@contract/schema';

/**
 * `?example` forces the example course. It works before the hash (`/?example#/`)
 * or inside it (`#/?example`), so it survives in-app navigation either way.
 */
export function wantsExample(): boolean {
  if (typeof window === 'undefined') return false;
  const inSearch = new URLSearchParams(window.location.search).has('example');
  const hashQuery = window.location.hash.split('?')[1] ?? '';
  return inSearch || new URLSearchParams(hashQuery).has('example');
}

/** The course the app plays. loadCourse caches, and throws a readable error for the error boundary. */
export function useCourse(): LoadedCourse {
  return loadCourse({ example: wantsExample() });
}

export interface PathEntry {
  unit: Unit;
  concept: Concept;
  lesson: Lesson;
  /** 0-based position along the whole path. */
  index: number;
}

/** Every concept in path order with its lesson. */
export function pathEntries({ course, lessons }: LoadedCourse): PathEntry[] {
  const out: PathEntry[] = [];
  for (const unit of course.units) {
    for (const concept of unit.concepts) {
      const lesson = lessons[concept.lessonId];
      if (lesson) out.push({ unit, concept, lesson, index: out.length });
    }
  }
  return out;
}
