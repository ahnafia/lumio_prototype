import { Button } from '../design/components';
import { Icon, type IconName } from '../design/Icon';

interface MessageProps {
  icon: IconName;
  title: string;
  body: string;
  /** Technical detail, shown only in dev. */
  detail?: string;
  action?: { label: string; onClick: () => void };
}

/** A centered full-page message: 404, not found, errors. */
export function Message({ icon, title, body, detail, action }: MessageProps) {
  return (
    <div className="message" role="status">
      <span className="message__icon">
        <Icon name={icon} size={48} />
      </span>
      <h1>{title}</h1>
      <p>{body}</p>
      {detail && (
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', maxWidth: '100%' }}>{detail}</pre>
      )}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
