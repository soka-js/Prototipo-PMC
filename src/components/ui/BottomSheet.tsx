import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useOverlayRoot } from './Overlay';

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const root = useOverlayRoot();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={`${root ? 'absolute' : 'fixed'} pointer-events-auto inset-0 z-50 flex items-end`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 animate-fade-in bg-ink/40"
        onClick={onClose}
      />
      <div className="no-scrollbar relative max-h-[88%] w-full animate-sheet-up overflow-y-auto rounded-t-3xl bg-surface-card px-6 pb-8 pt-3">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-soft" />
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold leading-snug">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2 rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-subtle"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    root ?? document.body,
  );
}
