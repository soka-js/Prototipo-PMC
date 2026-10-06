import { createPortal } from 'react-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useOverlayRoot } from './Overlay';

export function Toast() {
  const toast = useAppStore((s) => s.toast);
  const root = useOverlayRoot();
  if (!toast) return null;

  return createPortal(
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className={`${root ? 'absolute' : 'fixed'} left-1/2 top-14 z-[60] flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 animate-fade-up items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl`}
    >
      <CheckCircle2 size={18} className="shrink-0 text-[#7FD1C4]" />
      {toast.message}
    </div>,
    root ?? document.body,
  );
}
