# Decisions

One dated line per decision, newest at the bottom. Append only. Either cofounder may add lines without review.

- 2026-11-13: Scope is the 5 units of MATH 140 up to substitution (25 concepts). §5.1–5.3 (areas between curves, volumes) go to the backlog.
- 2026-11-13: The course order follows the PSU MATH 140 syllabus, which uses Stewart *Calculus* 7e. Limits at infinity (§3.4) moves into Unit 1, and derivatives & the shape of a graph (§3.3) folds into curve sketching.
- 2026-11-13: Split by layer. A (@ahnafia) owns `app/` and `index.html`. B (@macgrjd9) owns `content/`, `animations/` and `gallery.html`. `contract/` is shared and frozen.
- 2026-11-13: Stack is Vite 8 + React 19 + TypeScript 6, a static SPA with HashRouter. Progress is in `localStorage`. There is no backend.
- 2026-11-13: TypeScript is pinned to ~6.0 because typescript-eslint doesn't support TS 7 yet.
- 2026-11-13: Content files are TypeScript (`defineLesson`), not JSON, for autocomplete. The validator still checks them with zod.
- 2026-11-13: The loader auto-discovers content and animations with `import.meta.glob`, so there is no registry file for both people to edit.
- 2026-11-13: Animations get color tokens through `theme` and never hard-code colors. A supplies the brand theme; the gallery uses `defaultTheme`.
- 2026-11-13: The validator (KaTeX + mathjs) runs only in CI and tests. At runtime the app only zod-parses, which keeps the bundle small.
- 2026-11-13: Hosting is Vercel: PR previews plus production on `main`.
- 2026-11-13: Wrong answers never block progress. The feedback sheet explains, then Continue moves on.
- 2026-11-13: No required reviews on own-folder PRs. Shared files need the other cofounder's approval, enforced by the `ownership` check.
