import { Icon } from '../design/Icon';
import { setMuted, useMuted } from './sound';

/** Mute / unmute, remembered in localStorage. */
export function SoundToggle() {
  const muted = useMuted();
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={muted ? 'Turn sound on' : 'Mute sound'}
      aria-pressed={muted}
      title={muted ? 'Sound off' : 'Sound on'}
      onClick={() => setMuted(!muted)}
    >
      <Icon name={muted ? 'soundOff' : 'soundOn'} size={22} />
    </button>
  );
}
