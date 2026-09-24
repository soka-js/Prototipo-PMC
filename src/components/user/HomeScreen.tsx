import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Gauge, Repeat, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cop } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';

export function HomeScreen() {
  const navigate = useNavigate();
  const currentBalance = useAppStore((s) => s.currentBalance);
  const [alertOpen, setAlertOpen] = useState(true);
  const [cushionOpen, setCushionOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center justify-between px-5">
        <Logo />
        <span
          aria-label="Perfil de Valentina"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E4D6] text-sm font-bold text-[#7A4B2A]"
        >
          V
        </span>
      </header>

      {/* Mitad superior: la cifra manda */}
      <section className="flex flex-col items-center px-6 pb-8 pt-8 text-center">
        <span className="text-sm font-medium text-ink-muted">Puedes gastar hasta el 30</span>
        <p className="tabular mt-2 text-[64px] font-extrabold leading-none tracking-[-0.04em] text-ink">
          {cop(currentBalance)}
        </p>
        <p className="mt-4 text-[12px] text-ink-muted">
          Entró $900.000 · Comprometido $310.000 · Proyectado $170.000
        </p>
        <Button block className="mt-8" onClick={() => navigate('/user/simulate')}>
          ¿Puedo hacer un gasto?
        </Button>
      </section>

      {/* Mitad inferior: secundaria y discreta */}
      <section className="mt-auto space-y-3 px-5 pb-6">
        {alertOpen ? (
          <div className="flex items-center gap-3 rounded-2xl bg-[#FDF3E1] p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-card text-[#A06A1B]">
              <Gauge size={18} />
            </span>
            <Link to="/user/alert" className="flex-1">
              <span className="block text-sm font-semibold text-[#5C3F10]">
                Vas más rápido que de costumbre
              </span>
              <span className="block text-xs text-[#8A6A38]">Mira cómo va tu semana</span>
            </Link>
            <button
              type="button"
              aria-label="Ocultar aviso"
              onClick={() => setAlertOpen(false)}
              className="rounded-full p-1.5 text-[#A0875E] transition-colors hover:bg-surface-card/70"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAlertOpen(true)}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-[#8A6A38] transition-colors hover:bg-[#FDF3E1]"
          >
            <Gauge size={14} /> 1 aviso sobre tu ritmo
          </button>
        )}

        <div className="divide-y divide-soft rounded-2xl bg-surface-card/70">
          <Link
            to="/user/subscriptions"
            className="flex items-center gap-2.5 px-3.5 py-3.5 transition-colors hover:bg-surface-subtle/60"
          >
            <Repeat size={18} className="text-ink-muted" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">3 cobros que se repiten</span>
              <span className="block text-xs text-ink-muted">
                <span className="font-semibold text-ink">$54.000/mes</span> · Próximo Spotify en 4 días
              </span>
            </span>
            <ChevronRight size={16} className="text-ink-muted" />
          </Link>

          <div>
            <button
              type="button"
              aria-expanded={cushionOpen}
              onClick={() => setCushionOpen((o) => !o)}
              className="flex w-full items-center gap-2.5 px-3.5 py-3.5 text-left transition-colors hover:bg-surface-subtle/60"
            >
              <ShieldCheck size={18} className="text-ink-muted" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Colchón intocable</span>
                <span className="block text-xs text-ink-muted">
                  <span className="font-semibold text-ink">{cop(120000)}</span> · Reservado para emergencias
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`text-ink-muted transition-transform duration-200 ${cushionOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {cushionOpen && (
              <p className="animate-fade-up px-4 pb-4 pl-[43px] text-xs leading-relaxed text-ink-muted">
                Lo apartamos apenas entra tu mesada y no cuenta en tu disponible. Solo se toca si
                pasa algo de verdad.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
