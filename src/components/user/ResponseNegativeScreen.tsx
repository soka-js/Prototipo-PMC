import { useNavigate } from 'react-router-dom';
import { CalendarClock, Lock, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { cop } from '@/lib/format';
import { computeSimulation, safeAvailable, useAppStore } from '@/store/useAppStore';

export function ResponseNegativeScreen() {
  const navigate = useNavigate();
  const last = useAppStore((s) => s.lastSimulation);
  const session = useAppStore((s) => s.session);
  // Si se llega desde el selector de pantallas, se muestra un gasto de ejemplo que no alcanza.
  const sim =
    last?.outcome === 'negative'
      ? last
      : computeSimulation(Math.max(250000, safeAvailable(session) + 80000), session);
  const protectedItems = [
    { label: 'Compromisos del mes', amount: session.committed, Icon: Wallet },
    { label: 'Gasto proyectado hasta el corte', amount: session.projected, Icon: CalendarClock },
    { label: 'Colchón intocable', amount: session.cushion, Icon: ShieldCheck },
  ].filter((p) => p.amount > 0);

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader back="/user/simulate" />

      <div className="px-6">
        <Pill tone="terracotta">SIMULACIÓN · Gasto planeado: {cop(sim.amount)}</Pill>
        <h1 className="mt-4 text-[36px] font-extrabold leading-[1.05] tracking-tight">
          No te alcanza
        </h1>
        <p className="mt-2 text-xl font-bold text-terracotta">
          Te faltarían {cop(sim.shortfall)} antes del {session.payday}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
          Si puedes aplazarlo al próximo corte
          {sim.suggested > 0 && <> o reducirlo a {cop(sim.suggested)}</>}, tus gastos básicos de la
          semana quedan protegidos.
        </p>
      </div>

      <div className="mx-5 mt-6 rounded-3xl bg-surface-card p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <Lock size={13} /> Lo que protegemos
        </p>
        <ul className="mt-2 divide-y divide-soft">
          {protectedItems.map(({ label, amount, Icon }) => (
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
