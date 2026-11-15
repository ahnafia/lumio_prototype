import type { ComponentPropsWithRef, HTMLAttributes, ReactNode } from 'react';

/** Small shared building blocks. Styles live in base.css. */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'good' | 'bad';

// React 19: ref is a plain prop, so it passes through ...rest.
interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  block?: boolean;
}

export function Button({ variant = 'primary', block, className, type = 'button', ...rest }: ButtonProps) {
  const cls = ['btn', variant !== 'primary' && `btn--${variant}`, block && 'btn--block', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} {...rest} />;
}

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['card', className].filter(Boolean).join(' ')} {...rest} />;
}

/** value in [0, 1]. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Bottom sheet container. It stays mounted so it can slide in and out. */
export function Sheet({
  open,
  tone = 'neutral',
  label,
  children,
}: {
  open: boolean;
  tone?: 'neutral' | 'good' | 'bad';
  label: string;
  children: ReactNode;
}) {
  const cls = ['sheet', tone !== 'neutral' && `sheet--${tone}`, open && 'is-open'].filter(Boolean).join(' ');
  return (
    <section className={cls} role="region" aria-label={label} aria-hidden={!open} inert={!open}>
      <div className="column">{children}</div>
    </section>
  );
}
