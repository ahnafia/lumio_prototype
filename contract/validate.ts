import katex from 'katex';
import { compile } from 'mathjs';
import type { z } from 'zod';
import { resolveParams, type AnyAnimationDefinition } from './animation';
import {
  CourseSchema,
  Id,
  LessonSchema,
  isQuestion,
  type AnimationRef,
  type Course,
  type Lesson,
} from './schema';
import { hasUnbalancedDollar, tokenizeMath } from './text';

/**
 * THE VALIDATOR. `npm run validate` runs it on everything in content/ and animations/,
 * and CI runs it on every PR. It checks the schema plus the rules zod can't express.
 */

export interface RawFile {
  file: string;
  data: unknown;
}

export interface RawContent {
  course: RawFile | null;
  lessons: RawFile[];
  animations: RawFile[];
}

export interface Problem {
  file: string;
  path: string;
  message: string;
}

export function formatProblems(problems: Problem[]): string {
  return problems.map((p) => `✗ ${p.file}${p.path ? ` › ${p.path}` : ''}: ${p.message}`).join('\n');
}

/** Keys whose string values are student-facing rich text (checked for math). */
const TEXT_KEYS = new Set(['title', 'caption', 'body', 'prompt', 'text', 'correct', 'incorrect', 'summary', 'label', 'description', 'unit']);

export function validateContent(raw: RawContent): Problem[] {
  const problems: Problem[] = [];
  const add = (file: string, path: string, message: string) => problems.push({ file, path, message });

  // ---- animations
  const registry = new Map<string, AnyAnimationDefinition>();
  for (const { file, data } of raw.animations) {
    const def = checkAnimation(file, data, add);
    if (!def) continue;
    if (registry.has(def.name)) add(file, 'name', `duplicate animation name "${def.name}"`);
    registry.set(def.name, def);
  }

  const checkRef = (file: string, path: string, ref: AnimationRef | undefined) => {
    if (!ref) return;
    const def = registry.get(ref.name);
    if (!def) {
      add(file, `${path}.name`, `unknown animation "${ref.name}". Known: ${[...registry.keys()].join(', ') || '(none)'}`);
      return;
    }
    const resolved = resolveParams(def, ref.params);
    if (!resolved.ok) add(file, `${path}.params`, `invalid params for "${ref.name}": ${resolved.error}`);
  };

  // ---- course
  let course: Course | null = null;
  if (raw.course) {
    const parsed = CourseSchema.safeParse(raw.course.data);
    if (parsed.success) course = parsed.data;
    else addZodIssues(raw.course.file, parsed.error, add);
  }

  // ---- lessons
  const lessons = new Map<string, { file: string; lesson: Lesson }>();
  for (const { file, data } of raw.lessons) {
    const parsed = LessonSchema.safeParse(data);
    if (!parsed.success) {
      addZodIssues(file, parsed.error, add);
      continue;
    }
    const lesson = parsed.data;
    if (lessons.has(lesson.id)) add(file, 'id', `duplicate lesson id "${lesson.id}" (also in ${lessons.get(lesson.id)?.file})`);
    lessons.set(lesson.id, { file, lesson });
    checkLesson(file, lesson, add, checkRef);
  }

  // ---- course ↔ lessons
  if (course) {
    const file = raw.course?.file ?? 'course';
    const seenUnits = new Set<string>();
    const conceptToLesson = new Map<string, string>();
    course.units.forEach((unit, u) => {
      if (seenUnits.has(unit.id)) add(file, `units.${u}.id`, `duplicate unit id "${unit.id}"`);
      seenUnits.add(unit.id);
      unit.concepts.forEach((concept, c) => {
        const at = `units.${u}.concepts.${c}`;
        if (conceptToLesson.has(concept.id)) add(file, `${at}.id`, `duplicate concept id "${concept.id}"`);
        if ([...conceptToLesson.values()].includes(concept.lessonId)) add(file, `${at}.lessonId`, `lesson "${concept.lessonId}" is used by two concepts`);
        conceptToLesson.set(concept.id, concept.lessonId);
        const entry = lessons.get(concept.lessonId);
        if (!entry) add(file, `${at}.lessonId`, `no lesson with id "${concept.lessonId}" (expected a *.lesson.ts file exporting it)`);
        else if (entry.lesson.conceptId !== concept.id)
          add(entry.file, 'conceptId', `is "${entry.lesson.conceptId}" but course.ts maps concept "${concept.id}" to this lesson`);
      });
    });
    for (const [id, { file: lessonFile, lesson }] of lessons) {
      if (conceptToLesson.get(lesson.conceptId) !== id)
        add(lessonFile, 'conceptId', `lesson "${id}" is not on the path: add concept "${lesson.conceptId}" with lessonId "${id}" to course.ts`);
    }
    collectText(course, '', (path, text) => checkMath(file, path, text, add));
  } else if (raw.lessons.length > 0 && !raw.course) {
    add('content/course.ts', '', 'lessons exist but there is no course.ts to put them on the path');
  }

  return problems;
}

// ------------------------------------------------------------------ helpers

type Add = (file: string, path: string, message: string) => void;

function addZodIssues(file: string, error: z.ZodError, add: Add) {
  for (const issue of error.issues) add(file, issue.path.join('.'), issue.message);
}

function checkAnimation(file: string, data: unknown, add: Add): AnyAnimationDefinition | null {
  if (typeof data !== 'object' || data === null) {
    add(file, '', 'default export must be defineAnimation({...})');
    return null;
  }
  const def = data as Partial<AnyAnimationDefinition>;
  let ok = true;
  const fail = (path: string, message: string) => {
    add(file, path, message);
    ok = false;
  };
  if (typeof def.name !== 'string' || !Id.safeParse(def.name).success) fail('name', 'must be a kebab-case string');
  const folder = file.match(/animations\/([^/]+)\/index\.tsx$/)?.[1];
  if (folder && def.name !== folder) fail('name', `must equal its folder name "${folder}"`);
  if (typeof def.title !== 'string' || !def.title) fail('title', 'required');
  if (typeof def.description !== 'string' || !def.description) fail('description', 'required');
  if (typeof def.interactive !== 'boolean') fail('interactive', 'must be true or false');
  if (typeof def.aspectRatio !== 'number' || !(def.aspectRatio > 0)) fail('aspectRatio', 'must be a positive number');
  if (typeof def.component !== 'function' && typeof def.component !== 'object') fail('component', 'must be a React component');
  if (!def.params || typeof (def.params as z.ZodType).safeParse !== 'function') {
    fail('params', 'must be a zod schema');
    return null;
  }
  if (!ok) return null;
  const full = def as AnyAnimationDefinition;
  const defaults = full.params.safeParse(full.defaults);
  if (!defaults.success) add(file, 'defaults', `defaults don't match params: ${defaults.error.issues.map((i: z.core.$ZodIssue) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  for (const [name, preset] of Object.entries(full.presets ?? {})) {
    const r = resolveParams(full, preset as Record<string, unknown>);
    if (!r.ok) add(file, `presets.${name}`, r.error);
  }
  return full;
}

function checkLesson(file: string, lesson: Lesson, add: Add, checkRef: (file: string, path: string, ref: AnimationRef | undefined) => void) {
  const { screens } = lesson;
  if (screens[0]?.type !== 'animation') add(file, 'screens.0', 'every lesson must open with an "animation" screen');
  const questions = screens.filter(isQuestion);
  if (questions.length < 2 || questions.length > 3) add(file, 'screens', `needs 2 or 3 question screens, found ${questions.length}`);
  const lastScreen = screens[screens.length - 1];
  if (lastScreen && !isQuestion(lastScreen)) add(file, `screens.${screens.length - 1}`, 'the last screen must be a question');

  const ids = new Set<string>();
  screens.forEach((screen, i) => {
    const at = `screens.${i}`;
    if (ids.has(screen.id)) add(file, `${at}.id`, `duplicate screen id "${screen.id}"`);
    ids.add(screen.id);

    switch (screen.type) {
      case 'animation':
        checkRef(file, `${at}.visual`, screen.visual);
        break;
      case 'explanation':
        checkRef(file, `${at}.visual`, screen.visual);
        break;
      case 'multiple-choice': {
        checkRef(file, `${at}.visual`, screen.visual);
        const choiceIds = screen.choices.map((c) => c.id);
        if (new Set(choiceIds).size !== choiceIds.length) add(file, `${at}.choices`, 'choice ids must be unique');
        if (!choiceIds.includes(screen.answer)) add(file, `${at}.answer`, `"${screen.answer}" is not one of the choice ids (${choiceIds.join(', ')})`);
        const texts = screen.choices.map((c) => c.text.trim());
        if (new Set(texts).size !== texts.length) add(file, `${at}.choices`, 'two choices have the same text');
        break;
      }
      case 'numeric':
        checkRef(file, `${at}.visual`, screen.visual);
        break;
      case 'graph-tap': {
        const { plot, target } = screen;
        plot.functions.forEach((f, j) => {
          const fpath = `${at}.plot.functions.${j}.expr`;
          try {
            const code = compile(f.expr);
            const [lo, hi] = f.domain ?? plot.xRange;
            const finiteSomewhere = Array.from({ length: 41 }, (_, k) => lo + ((hi - lo) * k) / 40).some((x) => {
              try {
                const y: unknown = code.evaluate({ x });
                return typeof y === 'number' && Number.isFinite(y);
              } catch {
                return false;
              }
            });
            if (!finiteSomewhere) add(file, fpath, `"${f.expr}" is not a real number anywhere in the plotted range`);
          } catch (e) {
            add(file, fpath, `can't parse "${f.expr}" as a mathjs expression in x: ${(e as Error).message}`);
          }
        });
        if (target.x < plot.xRange[0] || target.x > plot.xRange[1]) add(file, `${at}.target.x`, 'target is outside xRange');
        if (target.y !== undefined && (target.y < plot.yRange[0] || target.y > plot.yRange[1])) add(file, `${at}.target.y`, 'target is outside yRange');
        break;
      }
    }
  });

  collectText(lesson, '', (path, text) => checkMath(file, path, text, add));
}

/** Walk an object and call `fn` for every student-facing text field. */
function collectText(value: unknown, path: string, fn: (path: string, text: string) => void, key = '') {
  if (typeof value === 'string') {
    if (TEXT_KEYS.has(key)) fn(path, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectText(v, path ? `${path}.${i}` : String(i), fn, key));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'params') continue; // animation params aren't rich text
      collectText(v, path ? `${path}.${k}` : k, fn, k);
    }
  }
}

function checkMath(file: string, path: string, text: string, add: Add) {
  if (hasUnbalancedDollar(text)) {
    add(file, path, 'unbalanced $: every math span needs an opening and a closing $');
    return;
  }
  for (const token of tokenizeMath(text)) {
    if (token.type !== 'math') continue;
    try {
      katex.renderToString(token.tex, { throwOnError: true, displayMode: token.display, strict: 'ignore' });
    } catch (e) {
      add(file, path, `KaTeX can't render "${token.tex}": ${(e as Error).message.replace(/^KaTeX parse error: /, '')}`);
    }
  }
}
