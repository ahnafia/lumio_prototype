# contract/: shared by both cofounders, FROZEN

This folder is the only thing the two halves share. Everything A builds reads from it, and everything B writes must pass it.

| File | What it defines |
|---|---|
| `schema.ts` | zod schema and types: Course → Unit → Concept → Lesson → Screen (animation, explanation, multiple-choice, numeric, graph-tap) |
| `animation.ts` | `defineAnimation`, `AnimationProps` (params, width, height, playing, reducedMotion, theme, onInteract, onComplete), `resolveParams` |
| `theme.ts` | `AnimationTheme` tokens and the neutral `defaultTheme` |
| `text.ts` | `tokenizeMath`, `paragraphs`: how rich text is read |
| `load.ts` | globs `content/` and `animations/`: `loadCourse()`, `getAnimation()`, `listAnimations()`, plus the example fallback |
| `validate.ts` | the rules zod can't express (lesson shape, references, params, mathjs, KaTeX) |
| `validate.test.ts` | `npm run validate`: runs the validator on real content and the example, and tests the validator itself |
| `example/` | one lesson using every screen type, a 4-node example course, and the `example-parabola-slope` animation |

## Rules
- **Frozen at `contract-v1`** (tagged after the Saturday 9am session).
- **Every change** is a PR labelled `contract`, approved by **both** cofounders. The `ownership` CI check enforces this. Log the change in `docs/DECISIONS.md`.
- **Prefer additive changes:** new optional fields, or a new screen type behind a default. Never rename or remove a field once either side uses it.
- **No app or brand code here.** Never import from `app/`. Reach `content/` and `animations/` only through `import.meta.glob` in `load.ts`.
- **Keep the runtime light.** The validator (KaTeX and mathjs) runs in CI, and `load.ts` only zod-parses at runtime.
- **The example lesson must keep using all 5 screen types**, so A always has a full test case.
