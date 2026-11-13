# Lumio

**Duolingo for Penn State MATH 140 (Calculus I).** Lumio walks you through every concept in the course, from limits to substitution, as a path of short interactive lessons. Each lesson opens with an animation you can play with, explains one idea per screen, and checks you with 2–3 quick questions and instant feedback. You earn XP and keep a streak, and progress is saved in your browser.

The prototype has no AI, login, backend or teacher features.

## Run it
```bash
nvm use            # Node 24
npm install
npm run dev        # the app: http://localhost:5173
npm run gallery    # every animation on its own: http://localhost:5173/gallery.html
npm run validate   # check all content against the contract
npm run check      # typecheck + lint + validate + build (what CI runs)
```
Until the course content lands, the app plays the example course in `contract/example/`.

## Who owns what
| | Cofounder A: **@ahnafia** | Cofounder B: **@macgrjd9** |
|---|---|---|
| Builds | The app: shell, design system and brand, path home, lesson player, all screen types, Check/feedback sheet, XP, streaks, celebration, saving progress, deployment | The course: MATH 140 outline, every lesson, all explanations, questions and feedback, every animation, the animation gallery, math correctness |
| Folders | `app/`, `index.html` | `content/`, `animations/`, `gallery.html` |

`contract/` is shared and **frozen**. Changing it takes a PR that both cofounders approve. Neither person ever edits the other's folders; CI and ESLint enforce this. Details are in [CLAUDE.md](CLAUDE.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## The two days (Sat Nov 14 and Sun Nov 15, 2026)
| When | What |
|---|---|
| **Sat 9–10, together** | Review and freeze the contract (tag `contract-v1`), connect Vercel previews, confirm CI and branch protection |
| Sat 10 onward, apart | A: shell, path, player against the example lesson. B: gallery, outline, then animations and lessons unit by unit |
| **Sat 14:00 check-in (15 min)** | A shows the path and the player running the example. B shows the outline and finished Unit 1 |
| Sat end of day | A: the app plays any valid lesson end to end. B: Units 1–3 done |
| Sun 8–13, apart | A: celebration, transitions, sounds, phone layout, prod deploy prep. B: Units 4–5 |
| **Sun 13:00 integration** | All content live in the app. Fix anything that doesn't render (each person fixes only their own folders) |
| Sun 14:30–16 | Cross-QA: each person clicks through the other's half and files bugs |
| Sun 16–19 | Slack (3h) for bug fixes |
| **Sun 19:00** | Production deploy and a full click-through of every unit, on a laptop and a phone |

## Course (from the PSU MATH 140 syllabus, Stewart *Calculus* 7e)
1. **Functions and limits:** limits from graphs, one-sided limits, computing limits, limits at infinity, continuity
2. **The derivative:** rate of change, tangent lines, the limit definition
3. **Differentiation rules:** power, product, quotient, trig, chain, implicit
4. **Applications:** related rates, linear approximation, extrema, the Mean Value Theorem, curve sketching, optimization
5. **Integrals:** antiderivatives, Riemann sums and area, the definite integral, the Fundamental Theorem of Calculus, substitution

## Links
- Issues: https://github.com/ahnafia/lumio_prototype/issues
- Project board: see the repo's **Projects** tab ("Lumio prototype")
- Milestones: https://github.com/ahnafia/lumio_prototype/milestones
- Production: *added after Vercel is connected (issue #1)*
- Decisions log: [docs/DECISIONS.md](docs/DECISIONS.md)
