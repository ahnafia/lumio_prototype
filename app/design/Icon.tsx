import type { ReactElement, SVGProps } from 'react';

/** Lumio's inline SVG icon set. Strokes use currentColor, so color comes from CSS. */
const paths = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.5 2.6-5.3 3.6-8.3.3-.9 1.4-1.1 2-.4 1.6 1.8 1.4 3.8 1.4 3.8s1.1-.6 1.6-2.2c.2-.7 1.1-.9 1.6-.3 1.5 1.8 2.8 4 2.8 7.4C18.5 18.4 15.9 21 12 21z" />,
  play: <path d="M8 5.5v13l10-6.5z" />,
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5v.01" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 4v7h-7" />
    </>
  ),
  menu: (
    <>
      <circle cx="12" cy="5.5" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="12" cy="18.5" r="1.2" />
    </>
  ),
  sparkle: <path d="M12 3l1.8 5.4L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.6z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  soundOn: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  soundOff: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M16 9.5l5 5" />
      <path d="M21 9.5l-5 5" />
    </>
  ),
  present: (
    <>
      <rect x="3.5" y="4.5" width="17" height="11" rx="2" />
      <path d="M12 15.5v4" />
      <path d="M8.5 19.5h7" />
      <path d="M10.5 8l3.5 2-3.5 2z" />
    </>
  ),
  chevronLeft: <path d="M14.5 6l-6 6 6 6" />,
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
  skip: (
    <>
      <path d="M6 6l7 6-7 6z" />
      <path d="M17 6v12" />
    </>
  ),
} satisfies Record<string, ReactElement>;

export type IconName = keyof typeof paths;

/** Icons that read better filled than stroked. */
const filled = new Set<IconName>(['star', 'flame', 'play', 'sparkle']);

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /** Accessible label. Omit for decorative icons. */
  label?: string;
}

export function Icon({ name, size = 20, label, ...rest }: IconProps) {
  const isFilled = filled.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={isFilled ? 1 : 2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
