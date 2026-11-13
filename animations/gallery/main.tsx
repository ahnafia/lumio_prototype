import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { listAnimations } from '@contract/load';
import { resolveParams } from '@contract/animation';
import { defaultTheme } from '@contract/theme';

// PLACEHOLDER gallery: renders every animation with its defaults.
// Cofounder B replaces this in issue #3 (presets, param editor, play/pause, sizes, event log).
const WIDTH = 480;

function Gallery() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Lumio animation gallery</h1>
      {listAnimations().map((def) => {
        const resolved = resolveParams(def);
        const Component = def.component;
        return (
          <section key={def.name} style={{ marginBottom: 32 }}>
            <h2>
              {def.title} <code>{def.name}</code>
            </h2>
            <p>{def.description}</p>
            {resolved.ok ? (
              <Component
                params={resolved.params}
                width={WIDTH}
                height={Math.round(WIDTH / def.aspectRatio)}
                playing
                reducedMotion={false}
                theme={defaultTheme}
                onInteract={(e) => console.log(def.name, 'interact', e)}
                onComplete={() => console.log(def.name, 'complete')}
              />
            ) : (
              <p style={{ color: 'crimson' }}>Invalid defaults: {resolved.error}</p>
            )}
          </section>
        );
      })}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
