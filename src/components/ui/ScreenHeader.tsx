import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function ScreenHeader({
  title,
  back,
  right,
}: {
  title?: string;
  /** Ruta a la que regresa; si se omite usa el historial. */
  back?: string;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="flex h-14 items-center justify-between px-3">
      <button
        type="button"
        onClick={() => (back ? navigate(back) : navigate(-1))}
        aria-label="Volver"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-subtle active:scale-95"
      >
        <ChevronLeft size={22} />
      </button>
      {title && <span className="text-sm font-semibold text-ink">{title}</span>}
      <div className="flex h-10 min-w-10 items-center justify-end">{right}</div>
    </header>
  );
}
