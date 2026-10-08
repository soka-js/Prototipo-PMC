import { useNavigate } from 'react-router-dom';
import { Smartphone, Store } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Role } from '@/lib/screens';

const OPTIONS: { role: Role; label: string; short: string; Icon: typeof Store }[] = [
  { role: 'user', label: 'Ver App Consumidor', short: 'Consumidor', Icon: Smartphone },
  { role: 'merchant', label: 'Ver Experiencia Tendero', short: 'Tendero', Icon: Store },
];

/** compact: en el celular solo los íconos, para dejar espacio al indicador del recorrido. */
export function RoleSwitcher({ role, compact = false }: { role: Role; compact?: boolean }) {
  const navigate = useNavigate();
  const lastPath = useAppStore((s) => s.lastPath);

  return (
    <div role="tablist" aria-label="Cambiar de rol" className="flex rounded-2xl bg-surface-subtle p-1">
      {OPTIONS.map(({ role: r, label, short, Icon }) => {
        const active = r === role;
        return (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={label}
            title={label}
            onClick={() => !active && navigate(lastPath[r])}
            className={[
              'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ease-out sm:text-sm',
              active ? 'bg-surface-card text-primary shadow-sm' : 'text-ink-muted hover:text-ink',
            ].join(' ')}
          >
            <Icon size={16} />
            <span className="hidden md:inline">{label}</span>
            <span className={compact ? 'hidden sm:inline md:hidden' : 'md:hidden'}>{short}</span>
          </button>
        );
      })}
    </div>
  );
}
