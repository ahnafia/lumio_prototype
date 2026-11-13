# Lumio: shared context for every Claude Code session

Lumio is **Duolingo for Penn State MATH 140 (Calculus I)**. A student walks a Duolingo-style path of short, Brilliant-style interactive lessons, one per concept, from limits to substitution. This repo is a **2-day prototype** (Sat Nov 14 and Sun Nov 15, 2026) built by two cofounders working in parallel.

**Before you write code:** find your issue on the board, read the CLAUDE.md in your folder, and stay inside your folders.

## Scope
**In:**
- the path home screen
- the lesson player
- 5 screen types
- animations and interactive visuals
- Check/Continue feedback
- XP, streak, celebration
- progress saved in `localStorage`
- a Reset progress button
- an animation gallery
- deploys

**Out:** AI, login, any backend or database, teacher features, analytics, payments, other courses. If an idea needs any of these, write it in `docs/DECISIONS.md` as "later" and move on.

## Who owns what (the most important rule)
| Folder | Owner | Notes |
|---|---|---|
| `app/`, `index.html` | **A: @ahnafia** | App shell, design system, path, player, screen types, feedback, XP/streak/celebration, progress, deployment |
| `content/`, `animations/`, `gallery.html` | **B: @macgrjd9** | Course outline, every lesson, every animation, the gallery page, math correctness |
| `contract/` | **Both, frozen** | Schema, animation interface, loader, validator, example. Changes need a PR **both** approve |
| root config, `.github/`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md` | Both | Rarely changed. Needs the other person's approval |
| `docs/` | Either | `DECISIONS.md` is append-only, no approval needed |

**Never edit the other person's folders, not even a one-line fix.** If something in their half is broken, file a bug issue with the `bug` label plus `app`, `content` or `animation`, assign it to them, and keep going. The `ownership` CI check fails any PR that crosses the line, and ESLint blocks imports that cross it.

## Architecture
```
content/course.ts ───────────┐
content/**/*.lesson.ts ──────┤  import.meta.glob   ┌──────────────────────┐
animations/*/index.tsx ──────┘ ──────────────────► │ contract/load.ts     │ ──► app/ (A)
contract/example/* (fallback) ───────────────────► │ loadCourse()         │ ──► animations/gallery/ (B)
                                                   │ getAnimation(name)   │
                                                   │ listAnimations()     │
                                                   └──────────────────────┘
contract/schema.ts     zod schema + types for course, unit, concept, lesson, screens
contract/animation.ts  defineAnimation(), AnimationProps, resolveParams()
contract/theme.ts      AnimationTheme tokens (A passes the brand theme; the gallery uses defaultTheme)
contract/text.ts       tokenizeMath(): how $math$ is split out of text (shared by the renderer and the validator)
contract/validate.ts   every rule zod can't express; run by `npm run validate` and in CI
```
- **Adding work:**
  - B adds a lesson file or an animation folder and it shows up in the app. There is no registry to edit.
  - A never imports from `content/` or `animations/`; only from `@contract/*`.
- **The fallback:** while `content/course.ts` has no units, `loadCourse()` returns the example course (2 units, 4 lessons), so A never waits for B.
- **Stack:** Vite 8, React 19, TypeScript 6, zod 4, KaTeX (math), Mafs (plots, optional for animations), motion (transitions), mathjs (graph-tap expressions), Vitest (validator). It's a static SPA with HashRouter, deployed on Vercel. Progress lives in `localStorage` only.

## Design rules: Duolingo meets Brilliant (patterns, not branding)
- **The path:** units are sections, and concepts are round nodes along a winding path. Each node is *locked*, *current* or *done*. Tap a node and a popover opens with Start.
- **One idea per screen.** An explanation is 40 words or fewer. Every lesson **opens with an animation or interactive visual**, then explains, then asks **2 or 3 questions**. It takes 3 to 5 minutes.
- **Feedback:**
  1. The student picks or types an answer, then presses **Check** (disabled until they've answered).
  2. A bottom sheet slides up: right (with a positive color) or not quite, plus a **one-line** explanation and **Continue**.
  3. Wrong answers don't block progress. The student sees the explanation and moves on.
- **Motivation:** XP per lesson, a day streak, and a short celebration screen at the end of every lesson. Keep it light: no leagues, hearts or gems.
- **Motion:** screen transitions run 150–300 ms. Respect `prefers-reduced-motion`: animations get `reducedMotion` and jump to their end states.
- **Laptop first; it must also work on a phone.** Content is at most about 640 px wide and centered. Touch targets are at least 44 px. Nothing scrolls horizontally.
- **Lumio's own look:** never use Duolingo's or Brilliant's logos, mascots, owl or green, Brilliant's palette, or their copy ("Great job!" is fine; their exact taglines are not). Lumio has no mascot. A sets the brand in issue #2.

## The contract is frozen
- After the 9am Saturday session, `contract/` is tagged `contract-v1` and frozen.
- To change it: open a PR labelled `contract`, explain why in the PR body, and get an approval from **both** cofounders. CI enforces this.
- Additive, backwards-compatible changes (a new optional field) are preferred over breaking ones.
- Log every contract change in `docs/DECISIONS.md`.
- If you think the contract is wrong, don't work around it in your own folder in a way that breaks the other half. Raise it.

## Commands
```bash
npm install          # Node 24 (see .nvmrc)
npm run dev          # app at http://localhost:5173 (example course until content lands)
npm run gallery      # animation gallery at http://localhost:5173/gallery.html
npm run validate     # check every content file and animation against the contract
npm run typecheck
npm run lint
npm run build
npm run check        # all of the above, exactly what CI runs: run it before every PR
```

## Conventions
- **TypeScript:**
  - strict mode with `noUncheckedIndexedAccess`
  - no `any` except the one in `contract/animation.ts`
  - `import type` for types
  - import the contract as `@contract/...`
- **Names:**
  - ids are kebab-case
  - React components are PascalCase `.tsx`
  - lesson files are `content/u<N>-<slug>/<concept-id>.lesson.ts`
  - animations are `animations/<name>/index.tsx`, with the folder name equal to the animation's `name`
- **Styling:** colors come from tokens: A's design tokens in `app/`, `theme` props in animations. No hard-coded hex in components.
- **Math:**
  - `$…$` inline and `$$…$$` display, rendered with KaTeX
  - double backslashes in TS strings: `'$\\frac{1}{2}$'`
- **Dependencies:** everything both halves need is already installed. Adding one means touching `package.json`, which needs the other person's approval, so avoid it.
- **Comments:** keep them short and explain why.

## Branches and PRs
- **Branches:**
  - A uses `a/<issue>-<slug>` (e.g. `a/4-path-home`); B uses `b/<issue>-<slug>` (e.g. `b/8-unit-1-lessons`)
  - `main` must always deploy: never push to it directly
- **One PR per issue:**
  - keep it small and write `Closes #N` in the body
  - add a screenshot or GIF for anything visual
  - run `npm run check` before you open it
- **Merging:**
  - squash merge only
  - your own-folder PRs don't need a review, so merge once CI is green
  - PRs that touch shared files need the other person's approval
- **The board:** move your issue to *In progress* when you start, *In review* when the PR is open, and *Done* when it merges.

## Schedule
- **Sat:** 9–10 together (freeze the contract). Apart from 10. **14:00 check-in** (15 min). End of day: A's player plays any valid lesson; B has finished Units 1–3.
- **Sun:**
  - 8–13 apart: A polishes, B finishes Units 4–5
  - **13:00 integration**
  - 14:30–16 cross-QA: file bugs, and fix only your own
  - 16–19 slack
  - 19:00 production deploy and a full click-through

Milestones on GitHub match these checkpoints. Log decisions in `docs/DECISIONS.md` with one dated line each.
