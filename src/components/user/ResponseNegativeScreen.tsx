import { useNavigate } from 'react-router-dom';
import { Bus, Lock, Smartphone, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { cop } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';

const FALLBACK = { amount: 250000, shortfall: 80000, suggested: 120000 };

const PROTECTED = [
  { label: 'Almuerzos U. (Lun - Jue)', amount: 56000, Icon: Utensils },
  { label: 'Recargas Transmilenio', amount: 24000, Icon: Bus },
  { label: 'Plan telefonía móvil', amount: 35000, Icon: Smartphone },
];

export function ResponseNegativeScreen() {
  const navigate = useNavigate();
  const last = useAppStore((s) => s.lastSimulation);
  const sim = last?.outcome === 'negative' ? last : FALLBACK;

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader back="/user/simulate" />

      <div className="px-6">
        <Pill tone="terracotta">SIMULACIÓN · Gasto planeado: {cop(sim.amount)}</Pill>
        <h1 className="mt-4 text-[36px] font-extrabold leading-[1.05] tracking-tight">
          Te quedarías corto
        </h1>
        <p className="mt-2 text-xl font-bold text-terracotta">
          Te faltarían {cop(sim.shortfall)} antes del 30
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
          Si puedes aplazarlo al próximo corte o reducirlo a {cop(sim.suggested)}, tus gastos básicos
          de la semana quedan protegidos.
        </p>
      </div>

      <div className="mx-5 mt-6 rounded-3xl bg-surface-card p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <Lock size={13} /> Lo que protegemos
        </p>
        <ul className="mt-2 divide-y divide-soft">
          {PROTECTED.map(({ label, amount, Icon }) => (
            <li key={label} className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-subtle text-ink-muted">
                <Icon size={17} />
              </span>
              <span className="flex-1 text-sm font-medium">{label}</span>
              <span className="tabular text-sm font-semibold">{cop(amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto space-y-2 px-5 pb-6 pt-6">
        <Button block onClick={() => navigate('/user/simulate')}>
          Simular con otro monto
        </Button>
        <Button block variant="secondary" onClick={() => navigate('/user/home')}>
          Entendido, volver a Inicio
        </Button>
      </div>
    </div>
  );
}
