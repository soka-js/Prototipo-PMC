import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cop } from '@/lib/format';
import {
  DEFAULT_SESSION,
  dailyAvailable,
  safeAvailable,
  useAppStore,
  type SessionData,
  type SubscriptionConfig,
} from '@/store/useAppStore';

const INPUT =
  'h-11 w-full rounded-xl border border-soft bg-surface-card px-3 text-sm font-medium text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

const newId = () => `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Limpia el borrador antes de guardarlo: días válidos, nombre y filas vacías. */
function normalize(draft: SessionData): SessionData {
  return {
    ...draft,
    name: draft.name.trim() || DEFAULT_SESSION.name,
    payday: clamp(Math.round(draft.payday) || 1, 1, 31),
    daysLeft: clamp(Math.round(draft.daysLeft) || 1, 1, 31),
    subscriptions: draft.subscriptions
      .map((sub) => ({ ...sub, name: sub.name.trim(), detail: sub.detail.trim() }))
      .filter((sub) => sub.name !== ''),
  };
}

function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-snug text-ink-muted">{hint}</span>}
    </label>
  );
}

/** Pesos sin decimales; muestra los separadores de miles mientras se escribe. */
function MoneyInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">$</span>
      <input
        type="text"
        inputMode="numeric"
        value={value === 0 ? '' : cop(value).slice(1)}
        placeholder="0"
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '').slice(0, 10)) || 0)}
        className={`${INPUT} tabular pl-7`}
      />
    </span>
  );
}

function DayInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      max={31}
      value={value === 0 ? '' : value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`${INPUT} tabular`}
    />
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-surface-card p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function SetupScreen() {
  const session = useAppStore((s) => s.session);
  const saveSession = useAppStore((s) => s.saveSession);
  const [draft, setDraft] = useState<SessionData>(session);
  const [status, setStatus] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(session);
  const safe = safeAvailable(draft);
  const recurringTotal = draft.subscriptions.reduce((sum, s) => sum + s.monthly, 0);

  const update = <K extends keyof SessionData>(key: K, value: SessionData[K]) => {
    setStatus(null);
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const updateSub = (id: string, patch: Partial<SubscriptionConfig>) =>
    update(
      'subscriptions',
      draft.subscriptions.map((sub) => (sub.id === id ? { ...sub, ...patch } : sub)),
    );

  const handleSave = () => {
    const clean = normalize(draft);
    saveSession(clean);
    setDraft(clean);
    setStatus('Guardado. La app ya muestra estos datos.');
  };

  const handleRestore = () => {
    setDraft(DEFAULT_SESSION);
    setStatus('Valores de ejemplo cargados. Guarda para aplicarlos.');
  };

  return (
    <div className="w-full max-w-3xl px-4 pb-10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Datos de la sesión</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Carga aquí los datos de gasto del entrevistado antes de mostrarle la app.
          </p>
        </div>
        <Link
          to="/user/home"
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
        >
          <ArrowLeft size={16} /> Volver a la app
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        <Section title="Persona">
          <Field label="Nombre" hint="Se usa en el avatar del Inicio.">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              className={INPUT}
            />
          </Field>
        </Section>

        <Section title="Dinero del mes">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ingreso mensual" hint="El «Entró» del Inicio.">
              <MoneyInput value={draft.income} onChange={(v) => update('income', v)} />
            </Field>
            <Field
              label="Monto comprometido"
              hint={`Incluye los cobros que se repiten (${cop(recurringTotal)} en la lista de abajo).`}
            >
              <MoneyInput value={draft.committed} onChange={(v) => update('committed', v)} />
            </Field>
            <Field label="Gasto proyectado" hint="Lo que se espera que gaste hasta el corte.">
              <MoneyInput value={draft.projected} onChange={(v) => update('projected', v)} />
            </Field>
            <Field label="Colchón intocable" hint="No está en el documento: déjalo en 0 en las entrevistas. En 0 no se muestra.">
              <MoneyInput value={draft.cushion} onChange={(v) => update('cushion', v)} />
            </Field>
          </div>
        </Section>

        <Section title="Corte">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Día de corte" hint="Aparece como «hasta el 30», «antes del 30».">
              <DayInput value={draft.payday} onChange={(v) => update('payday', v)} />
            </Field>
            <Field label="Días restantes hasta el corte" hint="Divide el disponible en el «por día».">
              <DayInput value={draft.daysLeft} onChange={(v) => update('daysLeft', v)} />
            </Field>
          </div>
        </Section>

        <div className={`rounded-3xl p-5 ${safe < 0 ? 'bg-terracotta-light' : 'bg-primary-light'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Cifra del Inicio (disponible seguro)
          </p>
          <p className={`tabular mt-1 text-3xl font-extrabold tracking-tight ${safe < 0 ? 'text-terracotta' : 'text-primary-dark'}`}>
            {cop(safe)}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {cop(draft.income)} − {cop(draft.committed)} − {cop(draft.projected)} − {cop(draft.cushion)}
            {' · '}
            {cop(dailyAvailable(draft))} por día. El simulador dice «Sí, te alcanza» hasta este monto.
          </p>
          {safe < 0 && (
            <p className="mt-2 text-xs font-semibold text-terracotta">
              Queda negativo: cualquier gasto simulado dará «No te alcanza».
            </p>
          )}
        </div>

        <Section title="Cobros que se repiten">
          {draft.subscriptions.length === 0 && (
            <p className="text-sm text-ink-muted">Sin cobros. El Inicio ocultará esa fila.</p>
          )}
          <ul className="space-y-3">
            {draft.subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="grid items-end gap-3 rounded-2xl border border-soft p-3 sm:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]"
              >
                <Field label="Nombre">
                  <input
                    type="text"
                    value={sub.name}
                    placeholder="Netflix"
                    onChange={(e) => updateSub(sub.id, { name: e.target.value })}
                    className={INPUT}
                  />
                </Field>
                <Field label="Detalle (opcional)">
                  <input
                    type="text"
                    value={sub.detail}
                    placeholder="Plan básico"
                    onChange={(e) => updateSub(sub.id, { detail: e.target.value })}
                    className={INPUT}
                  />
                </Field>
                <Field label="Mensual">
                  <MoneyInput value={sub.monthly} onChange={(v) => updateSub(sub.id, { monthly: v })} />
                </Field>
                <Field label="Acumulado pagado">
                  <MoneyInput value={sub.paidToDate} onChange={(v) => updateSub(sub.id, { paidToDate: v })} />
                </Field>
                <button
                  type="button"
                  aria-label={`Eliminar ${sub.name || 'cobro'}`}
                  onClick={() =>
                    update(
                      'subscriptions',
                      draft.subscriptions.filter((s) => s.id !== sub.id),
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center justify-self-end rounded-xl text-ink-muted transition-colors hover:bg-terracotta-light hover:text-terracotta"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="md"
            className="mt-3"
            icon={<Plus size={16} />}
            onClick={() =>
              update('subscriptions', [
                ...draft.subscriptions,
                { id: newId(), name: '', detail: '', monthly: 0, paidToDate: 0 },
              ])
            }
          >
            Agregar cobro
          </Button>
        </Section>
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-soft bg-surface-bg/95 py-4 backdrop-blur">
        <Button size="md" icon={<Check size={16} />} onClick={handleSave} disabled={!dirty}>
          Guardar
        </Button>
        <Button size="md" variant="secondary" icon={<RotateCcw size={16} />} onClick={handleRestore}>
          Restaurar valores de ejemplo
        </Button>
        <span role="status" className="text-sm text-ink-muted">
          {status ?? (dirty ? 'Hay cambios sin guardar.' : '')}
        </span>
      </div>
    </div>
  );
}
