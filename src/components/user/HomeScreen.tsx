import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Repeat, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cop } from '@/lib/format';
import { activeSubscriptions, safeAvailable, useAppStore } from '@/store/useAppStore';

export function HomeScreen() {
  const navigate = useNavigate();
  const session = useAppStore((s) => s.session);
  const subscriptions = activeSubscriptions(useAppStore((s) => s.subscriptions));
  const recurringTotal = subscriptions.reduce((sum, s) => sum + s.monthly, 0);
  const [cushionOpen, setCushionOpen] = useState(false);
  const available = safeAvailable(session);

  // La resta que produce la cifra, siempre visible: varios entrevistados la confundían con el saldo.
  const deductions = [
    { label: 'Comprometido este mes', value: session.committed },
    { label: 'Proyectado hasta el corte', value: session.projected },
    ...(session.cushion > 0 ? [{ label: 'Colchón', value: session.cushion }] : []),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center justify-between px-5">
        <Logo />
        <span
          aria-label={`Perfil de ${session.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E4D6] text-sm font-bold text-[#7A4B2A]"
        >
          {session.name.trim().charAt(0).toUpperCase()}
        </span>
      </header>

      {/* Mitad superior: la cifra manda */}
      <section className="flex flex-col items-center px-6 pb-6 pt-6 text-center">
        <span className="text-sm font-medium text-ink-muted">Puedes gastar hasta el {session.payday}</span>
        <p className="tabular mt-2 text-[56px] font-extrabold leading-none tracking-[-0.04em] text-ink">
          {cop(available)}
        </p>

        <dl className="tabular mt-5 w-full space-y-1.5 text-left text-[13px]">
          <div className="flex justify-between gap-3 text-ink-muted">
            <dt>Entró</dt>
            <dd>{cop(session.income)}</dd>
          </div>
          {deductions.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-3 text-ink-muted">
              <dt>− {label}</dt>
              <dd>{cop(value)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-soft pt-2 text-sm font-bold text-primary">
            <dt>= Puedes gastar</dt>
            <dd>{cop(available)}</dd>
          </div>
        </dl>
        <p className="mt-2.5 text-[12px] leading-snug text-ink-muted">
          Esto no es tu saldo. Es lo que queda después de lo que ya está comprometido.
        </p>

        <Button block className="mt-6" onClick={() => navigate('/user/simulate')}>
          ¿Puedo hacer un gasto?
        </Button>
      </section>

      {/* Mitad inferior: secundaria y discreta */}
      <section className="mt-auto space-y-3 px-5 pb-6">
        <div className="divide-y divide-soft rounded-2xl bg-surface-card/70">
          {subscriptions.length > 0 && (
            <Link
              to="/user/subscriptions"
              className="flex items-center gap-2.5 px-3.5 py-3.5 transition-colors hover:bg-surface-subtle/60"
            >
              <Repeat size={18} className="text-ink-muted" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  {subscriptions.length === 1
                    ? '1 cobro que se repite'
                    : `${subscriptions.length} cobros que se repiten`}
                </span>
                <span className="block text-xs text-ink-muted">
                  <span className="font-semibold text-ink">{cop(recurringTotal)}/mes</span>
                </span>
              </span>
              <ChevronRight size={16} className="text-ink-muted" />
            </Link>
          )}

          {session.cushion > 0 && (
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
                    <span className="font-semibold text-ink">{cop(session.cushion)}</span> · Reservado
                    para emergencias
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
          )}
        </div>
      </section>
    </div>
  );
}
