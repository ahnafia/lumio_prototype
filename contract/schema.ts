import { z } from 'zod';

/**
 * THE CONTENT SCHEMA (frozen: changes need a PR both cofounders approve).
 *
 * Course → Unit → Concept → Lesson → Screen.
 * One concept = one node on the path = one lesson.
 *
 * TEXT FIELDS (title, caption, body, prompt, choice text, feedback, summary):
 *   - Inline math: $f'(x) = 2x$. Display math on its own paragraph: $$\int_0^1 x\,dx$$
 *     Rendered with KaTeX, and the validator renders every math span to catch typos.
 *   - **bold** for emphasis. In `body`, a blank line ("\n\n") starts a new paragraph.
 *   - No literal dollar signs and no HTML.
 * Math in TS strings needs doubled backslashes ('$\\frac{1}{2}$') unless you use String.raw.
 */

/** kebab-case id: 'limits-from-graphs'. */
export const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case, e.g. "limits-from-graphs"');
/** Rich text (supports $math$ and **bold**). */
const Text = z.string().trim().min(1);
/** One line: fits on the feedback sheet. */
export const ONE_LINE_MAX = 140;
const OneLine = z.string().trim().min(1).max(ONE_LINE_MAX, `keep it to one line (≤ ${ONE_LINE_MAX} characters)`);
const Range = z.tuple([z.number(), z.number()]).refine(([a, b]) => a < b, 'range must be [min, max] with min < max');

/** How a lesson points at an animation: by name, plus settings merged over its defaults. */
export const AnimationRefSchema = z
  .object({
    name: Id,
    params: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

/** Shown on the feedback sheet after Check. */
const FeedbackSchema = z
  .object({
    correct: OneLine,
    incorrect: OneLine,
  })
  .strict();

// ---------------------------------------------------------------- screens

/** Opens every lesson: a visual the student watches or plays with, plus one caption. */
export const AnimationScreenSchema = z
  .object({
    type: z.literal('animation'),
    id: Id,
    title: Text.optional(),
    visual: AnimationRefSchema,
    caption: Text,
    /** If true, Continue stays disabled until the animation calls onInteract or onComplete. */
    requireInteraction: z.boolean().optional(),
  })
  .strict();

/** One idea in words (aim for 40 words or fewer), optionally with a supporting visual. */
export const ExplanationScreenSchema = z
  .object({
    type: z.literal('explanation'),
    id: Id,
    title: Text,
    body: Text,
    visual: AnimationRefSchema.optional(),
  })
  .strict();

export const MultipleChoiceScreenSchema = z
  .object({
    type: z.literal('multiple-choice'),
    id: Id,
    prompt: Text,
    visual: AnimationRefSchema.optional(),
    choices: z
      .array(z.object({ id: Id, text: Text }).strict())
      .min(2)
      .max(4),
    /** id of the correct choice. The app shuffles choices, so don't rely on order. */
    answer: Id,
    feedback: FeedbackSchema,
  })
  .strict();

/**
 * The student types a number. The app accepts integers, decimals and simple
 * fractions ("-3", "0.25", "1/4"). It is correct if |input - answer| <= tolerance.
 */
export const NumericScreenSchema = z
  .object({
    type: z.literal('numeric'),
    id: Id,
    prompt: Text,
    visual: AnimationRefSchema.optional(),
    answer: z.number().finite(),
    tolerance: z.number().min(0),
    /** Shown after the input box, e.g. "ft/s". */
    unit: z.string().trim().min(1).optional(),
    feedback: FeedbackSchema,
  })
  .strict();

/** A function to draw. `expr` is a mathjs expression in x, e.g. "x^2 - 1", "sin(x)", "1/(x-2)". */
const PlotFunctionSchema = z
  .object({
    expr: z.string().trim().min(1),
    label: Text.optional(),
    /** Only draw for x in this interval. */
    domain: Range.optional(),
  })
  .strict();

const PlotPointSchema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    /** 'open' = hollow circle (a hole), 'filled' = solid dot. Default 'filled'. */
    style: z.enum(['filled', 'open']).optional(),
    label: Text.optional(),
  })
  .strict();

/**
 * The student taps a spot on a graph. Correct if |tap.x - target.x| <= tolerance
 * and, when target.y is given, |tap.y - target.y| <= tolerance too (graph units).
 */
export const GraphTapScreenSchema = z
  .object({
    type: z.literal('graph-tap'),
    id: Id,
    prompt: Text,
    plot: z
      .object({
        functions: z.array(PlotFunctionSchema).min(1).max(3),
        xRange: Range,
        yRange: Range,
        points: z.array(PlotPointSchema).optional(),
      })
      .strict(),
    target: z.object({ x: z.number().finite(), y: z.number().finite().optional() }).strict(),
    tolerance: z.number().positive(),
    feedback: FeedbackSchema,
  })
  .strict();

export const ScreenSchema = z.discriminatedUnion('type', [
  AnimationScreenSchema,
  ExplanationScreenSchema,
  MultipleChoiceScreenSchema,
  NumericScreenSchema,
  GraphTapScreenSchema,
]);

export const QUESTION_TYPES = ['multiple-choice', 'numeric', 'graph-tap'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];
export const isQuestion = (s: Screen): s is QuestionScreen => (QUESTION_TYPES as readonly string[]).includes(s.type);

// ---------------------------------------------------------------- lesson & course

/**
 * One lesson = one concept, 3 to 5 minutes, one idea per screen.
 * Shape (checked by the validator): starts with an `animation` screen, has 2 or 3
 * question screens, and ends with a question.
 */
export const LessonSchema = z
  .object({
    id: Id,
    /** The concept this lesson teaches. Must match a concept in course.ts. */
    conceptId: Id,
    title: Text,
    /** One line shown on the path node's popover. */
    summary: OneLine,
    estMinutes: z.number().int().min(3).max(5),
    /** XP awarded on completion. */
    xp: z.number().int().positive().default(10),
    screens: z.array(ScreenSchema).min(4).max(10),
  })
  .strict();

export const ConceptSchema = z
  .object({
    id: Id,
    title: Text,
    lessonId: Id,
    /** Stewart Calculus 7e sections, e.g. ["1.5"]. Used for the outline, not shown to students. */
    sections: z.array(z.string()).default([]),
  })
  .strict();

export const UnitSchema = z
  .object({
    id: Id,
    title: Text,
    description: OneLine,
    sections: z.array(z.string()).default([]),
    /** In path order. */
    concepts: z.array(ConceptSchema).min(1),
  })
  .strict();

export const CourseSchema = z
  .object({
    id: Id,
    title: Text,
    /** In path order. Empty until the outline lands; the loader then falls back to the example course. */
    units: z.array(UnitSchema),
  })
  .strict();

// ---------------------------------------------------------------- types

/** Parsed types (defaults applied). The app uses these. */
export type AnimationRef = z.output<typeof AnimationRefSchema>;
export type AnimationScreen = z.output<typeof AnimationScreenSchema>;
export type ExplanationScreen = z.output<typeof ExplanationScreenSchema>;
export type MultipleChoiceScreen = z.output<typeof MultipleChoiceScreenSchema>;
export type NumericScreen = z.output<typeof NumericScreenSchema>;
export type GraphTapScreen = z.output<typeof GraphTapScreenSchema>;
export type Screen = z.output<typeof ScreenSchema>;
export type QuestionScreen = MultipleChoiceScreen | NumericScreen | GraphTapScreen;
export type Lesson = z.output<typeof LessonSchema>;
export type Concept = z.output<typeof ConceptSchema>;
export type Unit = z.output<typeof UnitSchema>;
export type Course = z.output<typeof CourseSchema>;

/** Authoring types (defaults optional). Content files use these through the helpers below. */
export type LessonInput = z.input<typeof LessonSchema>;
export type CourseInput = z.input<typeof CourseSchema>;

/** Use in content files for autocomplete: `export default defineLesson({...})`. */
export const defineLesson = (lesson: LessonInput): LessonInput => lesson;
/** Use in content/course.ts: `export default defineCourse({...})`. */
export const defineCourse = (course: CourseInput): CourseInput => course;
