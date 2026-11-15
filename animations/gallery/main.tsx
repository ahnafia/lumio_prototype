import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { listAnimations } from '@contract/load';
import { resolveParams, type AnyAnimationDefinition, type InteractionEvent } from '@contract/animation';
import { defaultTheme } from '@contract/theme';

// Every animation with its presets, a phone/laptop size toggle, play/pause,
// reduced motion and the latest onInteract / onComplete event.
const SIZES = { phone: 340, laptop: 600 } as const;

function Card({ def, width, playing, reducedMotion }: { def: AnyAnimationDefinition; width: number; playing: boolean; reducedMotion: boolean }) {
  const presets: [string, Record<string, unknown> | undefined][] = [['Defaults', undefined], ...Object.entries(def.presets ?? {}).map(([k, v]) => [k, v as Record<string, unknown>] as [string, Record<string, unknown>])];
  const [preset, setPreset] = useState(0);
  const [log, setLog] = useState('—');
  const [run, setRun] = useState(0);
  const chosen = presets[preset] ?? presets[0];
  const resolved = resolveParams(def, chosen?.[1]);
  const Component = def.component;
  const fmtEvent = (e: InteractionEvent) => `${e.kind}${e.label ? ` ${e.label}` : ''}${e.value !== undefined ? ` = ${typeof e.value === 'number' ? e.value.toFixed(2) : String(e.value)}` : ''}`;
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ marginBottom: 4 }}>
        {def.title} <code style={{ fontSize: 14 }}>{def.name}</code>
      </h2>
      <p style={{ marginTop: 0, color: '#4b5563' }}>{def.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {presets.map(([name], i) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setPreset(i);
              setRun((r) => r + 1);
              setLog('—');
            }}
            style={{ fontWeight: i === preset ? 700 : 400 }}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid #e5e7eb', width, display: 'inline-block' }}>
        {resolved.ok ? (
          <Component
            key={run}
            params={resolved.params}
            width={width}
            height={Math.round(width / def.aspectRatio)}
            playing={playing}
            reducedMotion={reducedMotion}
            theme={defaultTheme}
            onInteract={(e: InteractionEvent) => setLog(fmtEvent(e))}
            onComplete={() => setLog((l) => `${l} · COMPLETE`)}
          />
        ) : (
          <p style={{ color: 'crimson', padding: 8 }}>Invalid params: {resolved.error}</p>
        )}
      </div>
      <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>event: {log}</p>
    </section>
  );
}

function Gallery() {
  const [size, setSize] = useState<keyof typeof SIZES>('laptop');
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [filter, setFilter] = useState('');
  const all = listAnimations().filter((d) => d.name.includes(filter.trim()));
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 720 }}>
      <h1>Lumio animation gallery</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        {(Object.keys(SIZES) as (keyof typeof SIZES)[]).map((k) => (
          <button key={k} type="button" onClick={() => setSize(k)} style={{ fontWeight: k === size ? 700 : 400 }}>
            {k} ({SIZES[k]} px)
          </button>
        ))}
        <label>
          <input type="checkbox" checked={playing} onChange={(e) => setPlaying(e.currentTarget.checked)} /> playing
        </label>
        <label>
          <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.currentTarget.checked)} /> reduced motion
        </label>
        <input placeholder="filter by name" value={filter} onChange={(e) => setFilter(e.currentTarget.value)} />
      </div>
      {all.map((def) => (
        <Card key={def.name} def={def} width={SIZES[size]} playing={playing} reducedMotion={reducedMotion} />
      ))}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
