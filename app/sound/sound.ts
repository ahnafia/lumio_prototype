import { useSyncExternalStore } from 'react';

/**
 * Lumio's sounds, synthesized with WebAudio (original, no audio files).
 * Nothing plays before the student's first gesture, or while muted.
 */

const MUTE_KEY = 'lumio.muted.v1';

let ctx: AudioContext | null = null;
let gestured = false;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  const markGesture = () => {
    gestured = true;
    window.removeEventListener('pointerdown', markGesture, true);
    window.removeEventListener('keydown', markGesture, true);
  };
  window.addEventListener('pointerdown', markGesture, true);
  window.addEventListener('keydown', markGesture, true);
}

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

let muted = typeof window === 'undefined' ? false : readMuted();

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    if (next) window.localStorage.setItem(MUTE_KEY, '1');
    else window.localStorage.removeItem(MUTE_KEY);
  } catch {
    // Storage blocked: the setting lasts for this session only.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useMuted(): boolean {
  return useSyncExternalStore(subscribe, isMuted, () => false);
}

function audio(): AudioContext | null {
  if (!gestured || muted) return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface Note {
  freq: number;
  /** Start offset in seconds. */
  at: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  /** Glide to this frequency over the note. */
  to?: number;
}

function play(notes: Note[]) {
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + 0.01;
  const master = a.createGain();
  master.gain.value = 0.18; // keep it gentle
  master.connect(a.destination);
  for (const n of notes) {
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = n.type ?? 'sine';
    osc.frequency.setValueAtTime(n.freq, t0 + n.at);
    if (n.to) osc.frequency.exponentialRampToValueAtTime(n.to, t0 + n.at + n.dur);
    // Soft attack and an exponential tail: a chime, not a beep.
    g.gain.setValueAtTime(0.0001, t0 + n.at);
    g.gain.exponentialRampToValueAtTime(n.gain ?? 1, t0 + n.at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.at + n.dur);
    osc.connect(g).connect(master);
    osc.start(t0 + n.at);
    osc.stop(t0 + n.at + n.dur + 0.05);
  }
}

export const sounds = {
  /** Two bright rising notes. */
  correct: () =>
    play([
      { freq: 784, at: 0, dur: 0.16 },
      { freq: 1175, at: 0.08, dur: 0.32 },
      { freq: 2350, at: 0.08, dur: 0.2, gain: 0.15 },
    ]),
  /** A soft, low two-step down. Warm, not a buzzer. */
  wrong: () =>
    play([
      { freq: 330, at: 0, dur: 0.18, type: 'triangle', gain: 0.8 },
      { freq: 262, at: 0.12, dur: 0.3, type: 'triangle', gain: 0.7, to: 247 },
    ]),
  /** A rising major arpeggio with a shimmer on top. */
  complete: () =>
    play([
      { freq: 523, at: 0, dur: 0.25 },
      { freq: 659, at: 0.09, dur: 0.25 },
      { freq: 784, at: 0.18, dur: 0.3 },
      { freq: 1047, at: 0.27, dur: 0.6 },
      { freq: 2093, at: 0.27, dur: 0.45, gain: 0.12 },
    ]),
};
