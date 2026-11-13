# Contributing

Two people, two halves, one frozen contract. These rules keep us from ever touching each other's code.

## Branches
- **Names:**
  - Cofounder A (@ahnafia) uses `a/<issue>-<slug>`, e.g. `a/11-feedback-sheet`
  - Cofounder B (@macgrjd9) uses `b/<issue>-<slug>`, e.g. `b/7-unit-1-animations`
- **Base:** branch off the latest `main`.
- **`main` is always deployable.** Nobody pushes to it directly; branch protection requires a PR plus green `ci` and `ownership` checks.

## Pull requests
- **Scope:** one PR per issue, kept small, with `Closes #N` in the body.
- **Ownership:** a PR may only touch its author's folders.

  | Author | May touch |
  |---|---|
  | A | `app/`, `index.html`, `docs/` |
  | B | `content/`, `animations/`, `gallery.html`, `docs/` |
  | Either, **with the other's approval** | `contract/` (also needs the `contract` label), root config (`package.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`), `.github/`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md` |

  The `ownership` check fails if a PR crosses these lines, and re-runs when a review is submitted. If it stays red after an approval, re-run the job from the PR's Checks tab.
- **Before opening:** run `npm run check`. That's typecheck, lint, content validation and build, the same as CI.
- **Visual changes:** include a screenshot or GIF. Every PR gets a Vercel preview link.
- **Merging:** squash merge only. Branches auto-delete.
  - Own-folder PRs need no review: merge on green.
  - Shared-file PRs need the other person's approval first.

## The contract
- **Freezing:** `contract/` is frozen at the `contract-v1` tag after Saturday's 9am session.
- **Changing it:** open a PR labelled `contract` that explains the change and who it affects. Both cofounders must approve: the author by opening it, the other by approving.
- **Prefer additive changes** such as new optional fields. Log each change in `docs/DECISIONS.md`.

## Bugs in the other half
- **Never fix them yourself.** Open a **Bug** issue, label it `app`, `content` or `animation`, assign the owner, and attach a screenshot.
- **If it blocks you,** add `blocker` and say so at the next check-in, or message right away.

## Board
- Move cards as you go: **Todo → In progress** when you start, **In review** when the PR is open, **Done** when it merges.

## Commits
- Use the imperative, present tense ("Add path node states"). The squash merge uses the PR title, so make it read well.
