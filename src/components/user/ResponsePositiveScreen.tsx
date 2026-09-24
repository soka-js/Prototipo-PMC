import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronDown, ShieldCheck, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { COMMITMENTS } from '@/lib/data';
import { cop } from '@/lib/format';
import { DAYS_LEFT, useAppStore } from '@/store/useAppStore';

const FALLBACK = { amount: 65000, label: 'Salida con amigos', remaining: 220000, perDay: 18300 };

export function ResponsePositiveScreen() {
  const navigate = useNavigate();
  const last = useAppStore((s) => s.lastSimulation);
  const sim = last?.outcome === 'positive' ? last : FALLBACK;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader back="/user/simulate" />

      <div className="px-6">
        <Pill icon={<ShieldCheck size={13} />}>PLAN VERIFICADO</Pill>
        <p className="mt-4 text-sm font-medium text-ink-muted">
          {sim.label} · {cop(sim.amount)}
        </p>
        <h1 className="mt-1 text-[40px] font-extrabold leading-[1.05] tracking-tight text-primary-dark">
          Sí, te alcanza.
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink">
          Te quedarían <strong>{cop(sim.remaining)}</strong> para los {DAYS_LEFT} días que faltan,
          unos <strong>{cop(sim.perDay)}</strong> por día.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 px-5">
        <div className="rounded-3xl bg-surface-card p-4">
          <Sun size={18} className="text-primary" />
          <p className="mt-3 text-xs font-medium text-ink-muted">Ritmo diario libre</p>
          <p className="tabular text-2xl font-extrabold tracking-tight">{cop(sim.perDay)}</p>
          <p className="mt-1 text-xs text-ink-muted">Almuerzo y pasaje listos</p>
        </div>
        <div className="rounded-3xl bg-surface-card p-4">
          <CalendarDays size={18} className="text-primary" />
          <p className="mt-3 text-xs font-medium text-ink-muted">Próxima quincena</p>
          <p className="tabular text-2xl font-extrabold tracking-tight">{DAYS_LEFT} días</p>
          <p className="mt-1 text-xs text-ink-muted">Lunes 15 de abril</p>
        </div>
      </div>

      <div className="mx-5 mt-3 rounded-2xl bg-primary-light p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary-dark">
          <ShieldCheck size={16} />
          Margen seguro
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-card" aria-hidden="true">
          <div className="h-full w-full rounded-full bg-primary/80" />
        </div>
        <p className="mt-2 text-xs text-primary-dark/80">
          Tus compromisos fijos no se tocan con este gasto
        </p>
      </div>

      <div className="mx-5 mt-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-2xl px-2 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light/60"
        >
          Ver qué lo tiene comprometido
          <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <ul className="animate-fade-up divide-y divide-soft rounded-2xl bg-surface-card px-4">
            {COMMITMENTS.map((c) => (
              <li key={c.label} className="flex justify-between py-2.5 text-sm">
                <span className="text-ink-muted">{c.label}</span>
                <span className="tabular font-semibold">{cop(c.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto px-5 pb-6 pt-6">
        <Button block onClick={() => navigate('/user/home')}>
          Entendido
        </Button>
      </div>
    </div>
  );
}
