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
- 2026-11-14: Lumio's brand is "lamplight": warm paper background, deep indigo ink, iris primary (#5047cc), amber accent (#f4a622), teal for correct and warm coral for "not quite". Font is Lexend (Google Fonts) with a system fallback. Tokens live in `app/design/tokens.css`; `app/design/theme.ts` reads them at runtime into the `AnimationTheme`.
- 2026-11-14: `?example` forces the example course, before the hash (`/?example#/`) or inside it (`#/?example`). PR screenshots are committed under `docs/screenshots/`.
- 2026-11-14: App unit tests run with `npx vitest run --config app/vitest.config.ts`. The shared root config only includes `contract/**` tests, so `npx vitest run app` finds nothing, and changing the shared config would need both approvals.
- 2026-11-14: Replaying a finished lesson awards 0 XP (no farming), but it still counts as activity for the day streak. Progress is `lumio.progress.v1` in localStorage; a missing or corrupt value starts fresh.
- 2026-11-14: The streak uses the local calendar day. The top bar shows 0 once a full day has been missed, even before the next lesson resets the stored count to 1.
- 2026-11-14: Sounds are synthesized at runtime with WebAudio (no audio files, nothing borrowed). They never play before the first pointer or key gesture, and mute is saved as `lumio.muted.v1`.
- 2026-11-14: Contrast pass: the feedback teal and coral and the unit rose were darkened so white text clears 4.5:1, and amber text uses a new `--c-accent-ink`. Focus rings are iris (3:1 on paper). Right/wrong is also shown by icons, not color alone.
- 2026-11-14: The lesson player is lazy-loaded (React.lazy), so mathjs and motion stay out of the first load: about 200 KB gzipped of JS before the path paints. Path and screen titles render `$math$` through RichText, and aria-labels use a plain-text version.
- 2026-11-15: The course follows Guichard & Lyryx, *Calculus: Early Transcendentals* (2021A, CC BY-NC-SA), Chapters 3.1–7.1 and 8.1–8.4, and the 24 PSU MATH 140 learning objectives. This replaces the 25-concept Stewart outline: 11 units, 63 lessons. Areas between curves, volumes and average value (8.2–8.4) are now in scope. `sections` in `content/course.ts` are Guichard section numbers. Lesson text is original; only the topic order and section numbers follow the book.
- 2026-11-15: Learning objective 1 (modeling with functions) gets a short Unit 1 drawn from Guichard Ch. 1–2, before limits.
- 2026-11-15: Both halves of the FTC are named by what they do ("FTC: evaluating integrals", "FTC: the derivative of an integral"), because Guichard and Stewart number Part 1 and Part 2 in opposite orders.
- 2026-11-15: Animations import mathjs lazily (`animations/_kit/expr.ts`), because the loader imports every animation eagerly. The 63 lessons do load eagerly through `@contract/load`, which puts the first load at about 260 KB gzipped (the content chunk is about 160 KB).
- 2026-11-15: 18 reusable animations. Most lessons open with the generic `function-plot` (sliders, trace point, tangent, shading); the rich ones are secant-to-tangent, derivative-tracer, related-rates, optimizer, riemann-sum, ftc-accumulator and solid-revolution.
