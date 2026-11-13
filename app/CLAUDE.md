# app/: Cofounder A (@ahnafia)

You own `app/` and `index.html`. You build the whole student experience. **Never edit `content/`, `animations/` or `gallery.html`.** File a bug for B instead.

## Inputs (contract only)
```ts
import { loadCourse, getAnimation } from '@contract/load';   // course, lessons, animations
import { resolveParams } from '@contract/animation';          // lesson params → validated props
import { tokenizeMath, paragraphs } from '@contract/text';     // render $math$ the same way the validator reads it
import type { Lesson, Screen, Course } from '@contract/schema';
import type { AnimationTheme } from '@contract/theme';         // build the brand theme from your design tokens
```
- **Build against the example course.** `loadCourse()` returns it until B's `content/course.ts` has units. `loadCourse({ example: true })` always returns it, so wire that to `?example` for testing.
- **Never assume B's lesson ids or animation names.** Play whatever the contract describes.

## Rendering rules
- **Screens** — switch on `screen.type`:
  - `animation`
  - `explanation`
  - `multiple-choice`, which shuffles its choices
  - `numeric`, which accepts `-3`, `0.25` and `1/4`; correct if `|x − answer| ≤ tolerance`
  - `graph-tap`, which plots `plot.functions[].expr` with mathjs and draws `points` (open = a hole); correct within `tolerance` of `target`, on x and also on y if it's given
- **Animations:**
  - look up with `getAnimation(ref.name)` and resolve with `resolveParams(def, ref.params)`
  - give it a box matching `def.aspectRatio`
  - pass `playing` (false when not visible), `reducedMotion` from `matchMedia`, and the brand `theme`
  - remount with `key={screen.id}`
  - if `requireInteraction` is set, enable Continue after the first `onInteract` or `onComplete`
- **Text:** `tokenizeMath` gives text and math tokens. Render math with KaTeX and turn `**bold**` into `<strong>`. Import `katex/dist/katex.min.css` once. Also import `mafs/core.css` and `mafs/font.css` once, because B's animations may use Mafs.
- **Feedback sheet:**
  - shows `feedback.correct` or `feedback.incorrect`, each one line
  - Continue always advances: wrong answers don't block
- **Progress** lives in `localStorage` under one versioned key, e.g. `lumio.progress.v1`:
  - completed lesson ids, total XP, and the streak (count plus last active local date)
  - unlocking is linear in course order
  - Reset clears the key
  - always handle a missing or corrupt key

## Look and feel
Lumio's own brand: your palette, type and shape language, defined once as tokens (CSS variables) and mapped into `AnimationTheme`. Follow the Duolingo-meets-Brilliant rules in the root CLAUDE.md, but use no Duolingo or Brilliant logos, mascots, colors or copy. Laptop first, but test at 375 px wide.

## Suggested layout (yours to change)
```
app/main.tsx          entry
app/App.tsx           routes: #/ (path), #/lesson/:id, #/done/:id
app/design/           tokens.css, theme.ts (→ AnimationTheme), base components
app/path/             path home
app/player/           lesson player + one component per screen type
app/feedback/         Check button, bottom sheet
app/progress/         store, XP, streak, reset
app/celebrate/        celebration screen
```
