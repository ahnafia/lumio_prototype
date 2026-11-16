import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../design/ConfirmDialog';
import { Icon } from '../design/Icon';
import { setPresenting, usePresenting } from '../present/presenter';
import { resetProgress } from '../progress/store';

/** The ⋮ menu in the top bar: presenter mode and Reset progress. */
export function SettingsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const presenting = usePresenting();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div className="menu" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn"
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <Icon name="menu" size={22} />
      </button>
      {menuOpen && (
        <div className="menu__list" role="menu">
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={presenting}
            className="menu__item"
            autoFocus
            onClick={() => {
              setMenuOpen(false);
              setPresenting(!presenting);
            }}
          >
            <Icon name="present" size={18} /> Presenter mode
            <span className={`menu__switch${presenting ? ' is-on' : ''}`} aria-hidden />
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu__item menu__item--danger"
            onClick={() => {
              setMenuOpen(false);
              setConfirming(true);
            }}
          >
            <Icon name="refresh" size={18} /> Reset progress
          </button>
        </div>
      )}
      <ConfirmDialog
        open={confirming}
        title="Reset all progress?"
        body="This clears your completed lessons, XP and streak on this device. It can't be undone."
        confirmLabel="Reset"
        danger
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          resetProgress();
          setConfirming(false);
          navigate('/');
          window.scrollTo({ top: 0 });
        }}
      />
    </div>
  );
}
