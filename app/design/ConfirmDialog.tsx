import { useEffect, useRef } from 'react';
import { Button } from './components';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Style the confirm button as a warning. */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** A modal confirm built on <dialog>, so focus trapping and Escape come for free. */
export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel = 'Cancel', danger, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) cancels.
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="dialog__body">
        <h2 id="dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog__actions">
          <Button variant="secondary" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'bad' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
