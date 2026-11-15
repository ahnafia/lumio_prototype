import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../design/Icon';

interface TopBarProps {
  xp: number;
  streak: number;
  /** Extra controls on the right, e.g. the settings menu. */
  children?: ReactNode;
}

export function TopBar({ xp, streak, children }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="column topbar__inner">
        <Link to="/" className="wordmark" aria-label="Lumio home">
          <span className="wordmark__glow" aria-hidden />
          Lumio
        </Link>
        <span className={`stat stat--streak${streak > 0 ? '' : ' is-cold'}`} title={`${streak} day streak`}>
          <Icon name="flame" />
          {streak}
          <span className="visually-hidden">day streak</span>
        </span>
        <span className="stat stat--xp" title={`${xp} XP`}>
          <Icon name="star" />
          {xp}
          <span className="visually-hidden">XP</span>
        </span>
        {children}
      </div>
    </header>
  );
}
