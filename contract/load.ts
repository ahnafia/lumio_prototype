import type { AnyAnimationDefinition } from './animation';
import exampleAnimation from './example/ExampleAnimation';
import exampleCourse from './example/example-course';
import { exampleLessons } from './example/example-lessons';
import { CourseSchema, LessonSchema, type Course, type Lesson } from './schema';
import type { RawContent } from './validate';

/**
 * THE LOADER: the only bridge between the two halves.
 *
 *   - B adds content/<unit>/<concept>.lesson.ts or animations/<name>/index.tsx and it
 *     shows up here automatically. There is no registry file to edit.
 *   - A calls loadCourse(), getAnimation() and listAnimations() and never imports
 *     content/ or animations/ directly. ESLint enforces this.
 *   - While content/course.ts has no units, loadCourse() returns the example course,
 *     so the app always has something to play.
 */

const courseModules = import.meta.glob<{ default: unknown }>('../content/course.ts', { eager: true });
const lessonModules = import.meta.glob<{ default: unknown }>('../content/**/*.lesson.ts', { eager: true });
const animationModules = import.meta.glob<{ default: unknown }>('../animations/*/index.tsx', { eager: true });

const rel = (path: string) => path.replace(/^\.\.\//, '');
const EXAMPLE_ANIMATION_FILE = 'contract/example/ExampleAnimation.tsx';

/** Everything in content/ and animations/, unparsed, for the validator. */
export function getRawContent(): RawContent {
  const [courseEntry] = Object.entries(courseModules);
  return {
    course: courseEntry ? { file: rel(courseEntry[0]), data: courseEntry[1].default } : null,
    lessons: Object.entries(lessonModules).map(([file, mod]) => ({ file: rel(file), data: mod.default })),
    animations: [
      { file: EXAMPLE_ANIMATION_FILE, data: exampleAnimation },
      ...Object.entries(animationModules).map(([file, mod]) => ({ file: rel(file), data: mod.default })),
    ],
  };
}

/** The example course from contract/example, for A to build against. */
export function getExampleRawContent(): RawContent {
  return {
    course: { file: 'contract/example/example-course.ts', data: exampleCourse },
    lessons: exampleLessons.map((data) => ({ file: 'contract/example/example-lessons.ts', data })),
    animations: [{ file: EXAMPLE_ANIMATION_FILE, data: exampleAnimation }],
  };
}

// ------------------------------------------------------------------ animations

let registry: Map<string, AnyAnimationDefinition> | null = null;

function getRegistry(): Map<string, AnyAnimationDefinition> {
  if (!registry) {
    registry = new Map();
    for (const { data } of getRawContent().animations) {
      const def = data as AnyAnimationDefinition;
      if (def && typeof def.name === 'string') registry.set(def.name, def);
    }
  }
  return registry;
}

/** Every animation, including the example one, sorted by name. */
export function listAnimations(): AnyAnimationDefinition[] {
  return [...getRegistry().values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Look up an animation by the name a lesson uses. */
export function getAnimation(name: string): AnyAnimationDefinition | undefined {
  return getRegistry().get(name);
}

// ------------------------------------------------------------------ course

export interface LoadedCourse {
  course: Course;
  /** Every lesson by id. Path order comes from course.units[].concepts[]. */
  lessons: Record<string, Lesson>;
  /** True when this is the example course, because content/ has no units yet or it was asked for. */
  isExample: boolean;
}

const cache = new Map<boolean, LoadedCourse>();

/**
 * Parse and return the course.
 * Throws a readable error if content doesn't parse, which CI should have caught (`npm run validate`).
 * Pass { example: true } to always get the example course (e.g. a ?example dev toggle).
 */
export function loadCourse(options: { example?: boolean } = {}): LoadedCourse {
  const real = getRawContent();
  const realCourse = CourseSchema.safeParse(real.course?.data);
  const useExample = options.example === true || !realCourse.success || realCourse.data.units.length === 0;

  const cached = cache.get(useExample);
  if (cached) return cached;

  // The full validator (KaTeX + mathjs) runs in CI, not here, to keep it out of the app bundle.
  // At runtime we only parse (applying defaults) and check that the path resolves.
  const raw = useExample ? getExampleRawContent() : real;
  const fail = (msg: string): never => {
    throw new Error(`Lumio content is invalid: ${msg}\nRun \`npm run validate\` for details.`);
  };
  const parsedCourse = CourseSchema.safeParse(raw.course?.data);
  if (!parsedCourse.success) fail(`course: ${parsedCourse.error.message}`);
  const course = parsedCourse.data as Course;
  const lessons: Record<string, Lesson> = {};
  for (const { file, data } of raw.lessons) {
    const parsed = LessonSchema.safeParse(data);
    if (!parsed.success) fail(`${file}: ${parsed.error.message}`);
    const lesson = parsed.data as Lesson;
    lessons[lesson.id] = lesson;
  }
  for (const concept of course.units.flatMap((u) => u.concepts)) {
    if (!lessons[concept.lessonId]) fail(`concept "${concept.id}" points at missing lesson "${concept.lessonId}"`);
  }
  const loaded: LoadedCourse = { course, lessons, isExample: useExample };
  cache.set(useExample, loaded);
  return loaded;
}
