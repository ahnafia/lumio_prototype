# animations/: Cofounder B (@macgrjd9)

You own `animations/` and `gallery.html`. This is every animation and interactive visual, plus the gallery page that shows them on their own. **Never edit `app/` or `index.html`.**

## One folder per animation
```
animations/<name>/index.tsx    export default defineAnimation({...})   (folder name = name)
animations/<name>/*.tsx        helpers private to that animation
animations/_kit/               shared plotting helpers for your animations (optional)
animations/gallery/            the gallery page (gallery.html → gallery/main.tsx)
```
- **Pattern to copy:** `contract/example/ExampleAnimation.tsx`. The interface is in `contract/animation.ts`.
- **Registration is automatic.** A new folder appears in the gallery and the app.
- **Imports:** only `@contract/*` and `animations/`.

## The interface: what every animation gets
`params` (merged with your `defaults` and already validated), `width`, `height`, `playing`, `reducedMotion`, `theme`, `onInteract(event)` and `onComplete()`.
- **Size:** draw inside `width × height`. Never assume a fixed size: the app gives you anything from about 340 px (phone) to 640 px wide, at your `aspectRatio`.
- **`playing`:** when it's false, stop rAF loops and timers. When `reducedMotion` is true, skip looping motion and show the end state or let the student step through.
- **`theme`:** take colors and fonts from `theme.colors.*` and `theme.fontFamily`. No hard-coded colors.
- **Callbacks:**
  - call `onInteract` on every drag, slider move or tap
  - call `onComplete` once, when the student reaches the "aha" state
  - the app uses them to enable Continue on `requireInteraction` screens
- **Accessibility:**
  - give touch handlers `touch-action: none`
  - drag handles are at least 44 px
  - arrow keys work for sliders and handles
  - add an `aria-label` that describes what's shown
- **Params:**
  - a zod `z.object` with sensible bounds
  - add `presets` for the variants your lessons use, so the gallery shows them
  - one component with params is better than three near-copies

## Budget: simple concepts get simple visuals
- **Simple (S), about 15 min:** a static or stepped SVG with one control.
- **Medium (M), about 25 min:** one draggable thing or a slider, with a live readout.
- **Rich (R), about 45 min:** multi-part motion. Reserved for secant-to-tangent, derivative-tracer, ladder, box-optimizer, riemann-sum and ftc-accumulator.
- **Over budget?** Ship a working simpler version first, then upgrade it.

## Libraries already installed
Mafs (`mafs`) for coordinate planes, plots, movable points and vectors. Import `mafs/core.css` in the gallery entry; A imports it in the app. Also available: motion (`motion/react`), plain SVG, and mathjs if you need to evaluate expressions.

## The gallery (issue #3)
`npm run gallery` shows every animation on its own, with:
- preset buttons and a JSON params editor (validated with `resolveParams`)
- play/pause and reduced-motion toggles
- phone and laptop size buttons
- an event log of `onInteract` and `onComplete`

Check every animation there before opening a PR, and attach a GIF.
