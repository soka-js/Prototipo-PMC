import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { USER_JOURNEY } from '@/lib/screens';
import { useAppStore } from '@/store/useAppStore';

/** "Paso 2 de 5 · Inicio" con flechas; vive en la barra de demo, nunca dentro del teléfono. */
export function JourneyStepper({ pathname }: { pathname: string }) {
  const navigate = useNavigate();
  const outcome = useAppStore((s) => s.lastSimulation?.outcome);
  const index = USER_JOURNEY.findIndex((step) => step.paths.includes(pathname));
  if (index === -1) return null;

  const total = USER_JOURNEY.length;
  const { label } = USER_JOURNEY[index];

  // El paso de respuesta sigue a la última simulación; sin simulación, la positiva.
  const pathOf = (i: number) => {
    const { paths } = USER_JOURNEY[i];
    return paths.length > 1 && outcome === 'negative' ? paths[1] : paths[0];
  };

  const arrow =
    'flex h-9 w-8 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30';

  return (
    <nav
      aria-label="Recorrido del consumidor"
      className="flex h-9 shrink-0 items-center rounded-xl border border-soft bg-surface-card"
    >
      <button
        type="button"
        aria-label="Paso anterior"
        disabled={index === 0}
        onClick={() => navigate(pathOf(index - 1))}
        className={arrow}
      >
        <ChevronLeft size={16} />
      </button>
      <span className="whitespace-nowrap text-xs font-semibold text-ink sm:text-sm" aria-live="polite">
        <span className="sm:hidden">
          {index + 1}/{total}
        </span>
        <span className="hidden sm:inline">
          Paso {index + 1} de {total}
          <span className="font-medium text-ink-muted"> · {label}</span>
        </span>
      </span>
      <button
        type="button"
        aria-label="Paso siguiente"
        disabled={index === total - 1}
        onClick={() => navigate(pathOf(index + 1))}
        className={arrow}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
