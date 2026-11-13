# content/: Cofounder B (@macgrjd9)

You own `content/` (and `animations/`; see its CLAUDE.md). This is everything the student learns from. **Never edit `app/` or `index.html`.** File a bug for A instead.

## Files
```
content/course.ts                         the outline: units → concepts (path order) → lessonId
content/u1-limits/<concept-id>.lesson.ts  one lesson per concept
content/u2-derivative/…  u3-rules/…  u4-applications/…  u5-integrals/…
```
- **Shape of a file:**
  - each lesson file does `export default defineLesson({...})`, imported from `@contract/schema`
  - `lesson.conceptId` must equal the concept's `id`, and `concept.lessonId` must equal the lesson's `id`
- **Imports:** only `@contract/*` is allowed.
- **Model it on** `contract/example/example-lessons.ts`, which uses every screen type.

## Lesson recipe (the validator enforces most of it)
1. **Open with an `animation` screen.** Show the idea before naming it. If the student should play with it, set `requireInteraction: true`.
2. **Explain it in 1–2 `explanation` screens:** one idea each, 40 words or fewer, with a `visual` if it helps.
3. **Ask 2 or 3 questions** (`multiple-choice`, `numeric`, `graph-tap`), and end on a question.
4. **Feedback** is one line each for `correct` and `incorrect`. The incorrect line says *why* and gives the right answer.
5. **Total length:** 4–8 screens, `estMinutes` 3–5, default `xp` 10.
6. **Voice:** friendly and plain. Name the concept the way MATH 140 does (Stewart *Calculus* 7e) so students recognize it on exams.

## Math correctness (you own it)
- Work every answer by hand **and** check it a second way: plug in numbers, use a CAS or graph it.
- For multiple choice, the wrong answers should be *common mistakes*, such as forgetting the chain rule or dropping a sign.
- For numeric questions, pick a `tolerance` that accepts sensible rounding (e.g. `0.01` for 2-decimal answers) and say in the prompt how to round.
- For graph-tap, make sure the `target` is visibly on the drawn curve or at the drawn point.
- Every lesson PR checklist includes "every answer re-derived by hand".

## Writing math
`$…$` inline, `$$…$$` display, rendered with KaTeX. In TS strings, double the backslashes: `'$\\lim_{x \\to 2} f(x)$'`. `npm run validate` renders every math span and points at the exact file and field if one breaks.
