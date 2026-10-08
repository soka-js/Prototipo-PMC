import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, EyeOff, Loader2, Lock, ShieldCheck, Store, Unplug, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Logo } from '@/components/ui/Logo';
import { Monogram } from '@/components/ui/Monogram';
import { useOverlayRoot } from '@/components/ui/Overlay';
import { StatusBar } from '@/components/layout/StatusBar';
import { useAppStore } from '@/store/useAppStore';

const ACCOUNTS = [
  { id: 'nequi', name: 'Nequi', detail: 'Bancolombia S.A.', mono: 'N', bg: '#F3E8F7', fg: '#5B2A6E' },
  { id: 'bancolombia', name: 'Bancolombia', detail: 'Ahorros o Corriente', mono: 'B', bg: '#FFF6D9', fg: '#6B5310' },
  { id: 'davivienda', name: 'Davivienda / DaviPlata', detail: 'Cuenta o billetera digital', mono: 'D', bg: '#FCE9E6', fg: '#8A3426' },
];

const PRIVACY = [
  {
    Icon: Wallet,
    title: 'Solo leemos movimientos',
    body: 'Fecha, monto y nombre del comercio. Con eso calculamos lo que puedes gastar hoy.',
  },
  {
    Icon: Lock,
    title: 'Nunca movemos tu plata',
    body: 'El acceso es de solo lectura. No podemos pagar, transferir ni ver tu clave.',
  },
  {
    Icon: Store,
    title: 'Los comercios no te ven',
    body: 'Solo reciben datos agregados y anónimos de la zona, nunca tu nombre ni tus compras.',
  },
  {
    Icon: EyeOff,
    title: 'No vendemos tus datos',
    body: 'Ni a bancos, ni a anunciantes, ni a nadie.',
  },
  {
    Icon: Unplug,
    title: 'Desconecta cuando quieras',
    body: 'Un toque y borramos todo lo que leímos de esa cuenta.',
  },
];

/** Duración de cada línea del proceso; al final se muestra "Listo" un instante. */
const STEP_MS = [700, 1000, 1200];
const DONE_MS = 450;

const joinNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}` : names[0];

/**
 * Espera tras "Conectar": muestra que CIFRA lee y clasifica sola. Ocupa todo el
 * marco del teléfono y se salta con un toque.
 */
function ClassifyingOverlay({ banks, onDone }: { banks: string; onDone: () => void }) {
  const root = useOverlayRoot();
  const [step, setStep] = useState(0);
  const lines = [
    `Conectando con ${banks}`,
    'Leyendo tus movimientos de los últimos 3 meses',
    'Clasificando 147 transacciones',
  ];

  useEffect(() => {
    const t = setTimeout(
      () => (step < lines.length ? setStep(step + 1) : onDone()),
      step < lines.length ? STEP_MS[step] : DONE_MS,
    );
    return () => clearTimeout(t);
  }, [step, lines.length, onDone]);

  const content = (
    <div
      role="status"
      aria-live="polite"
      onClick={onDone}
      className="pointer-events-auto absolute inset-0 flex animate-fade-in cursor-pointer flex-col bg-[#F4F1EC]"
    >
      <StatusBar />
      <div className="flex flex-1 flex-col justify-center px-7">
        <ul className="space-y-5">
          {[...lines, 'Listo'].map((line, i) => {
            if (i > step) return null;
            const done = i < step || i === lines.length;
            return (
              <li key={line} className="flex animate-fade-up items-center gap-3">
                {done ? (
                  <CheckCircle2 size={22} className="shrink-0 text-primary" />
                ) : (
                  <Loader2 size={22} className="shrink-0 animate-spin text-primary" />
                )}
                <span
                  className={`text-[15px] leading-snug ${
                    i === lines.length ? 'font-extrabold text-primary' : done ? 'font-medium text-ink-muted' : 'font-semibold text-ink'
                  }`}
                >
                  {line}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="px-7 pb-10 text-center text-xs font-medium text-ink-muted">
        No tienes que anotar ni clasificar nada.
      </p>
    </div>
  );

  return root ? createPortal(content, root) : content;
}

export function ConnectScreen() {
  const navigate = useNavigate();
  const { selectedAccounts, toggleAccount, connect } = useAppStore();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => setLoading(true);

  // Un toque y el temporizador pueden coincidir: navegar una sola vez.
  const finished = useRef(false);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    connect();
    navigate('/user/home');
  }, [connect, navigate]);

  const banks = joinNames(ACCOUNTS.filter((a) => selectedAccounts.includes(a.id)).map((a) => a.name));

  return (
    <div className="flex flex-1 flex-col px-5 pb-6">
      <header className="flex h-14 items-center">
        <Logo />
      </header>

      {/* Banner cálido */}
      <div className="relative mt-2 h-40 overflow-hidden rounded-3xl bg-gradient-to-br from-[#F6E7D8] via-[#F9EFE4] to-primary-light">
        <div className="absolute -left-6 top-6 h-32 w-32 rounded-full bg-primary/15" />
        <div className="absolute left-14 top-10 h-32 w-32 rounded-full bg-[#E9B98F]/30" />
        <div className="absolute right-6 top-6 flex h-24 w-16 flex-col items-center justify-center gap-1 rounded-2xl bg-surface-card shadow-lg">
          <ShieldCheck className="text-primary" size={26} />
          <span className="h-1 w-8 rounded-full bg-soft" />
          <span className="h-1 w-6 rounded-full bg-soft" />
        </div>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-surface-card/95 px-3 py-1.5 text-xs font-semibold text-primary-dark shadow-sm">
          <Lock size={13} />
          Lectura segura cifrada de 256 bits
        </span>
      </div>

      <h1 className="mt-6 text-[26px] font-extrabold leading-tight tracking-tight">
        Conecta una cuenta para empezar
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        Solo leemos tus movimientos para calcular lo del día. Nunca podemos mover tu plata.
      </p>

      <fieldset className="mt-5 space-y-3">
        <legend className="sr-only">Cuentas para conectar</legend>
        {ACCOUNTS.map((acc) => {
          const checked = selectedAccounts.includes(acc.id);
          return (
            <label
              key={acc.id}
              className={[
                'flex cursor-pointer items-center gap-3 rounded-2xl border bg-surface-card p-3.5 transition-all duration-200 ease-out active:scale-[0.99]',
                checked ? 'border-primary ring-1 ring-primary' : 'border-soft hover:border-[#DCD7CE]',
              ].join(' ')}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggleAccount(acc.id)}
              />
              <Monogram text={acc.mono} bg={acc.bg} fg={acc.fg} size={40} />
              <span className="flex-1">
                <span className="block text-[15px] font-semibold">{acc.name}</span>
                <span className="block text-xs text-ink-muted">{acc.detail}</span>
              </span>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors duration-200 ${
                  checked ? 'border-primary bg-primary text-white' : 'border-[#D6D1C8]'
                }`}
              >
                {checked && <Check size={14} strokeWidth={3} />}
              </span>
            </label>
          );
        })}
      </fieldset>

      <button
        type="button"
        onClick={() => setPrivacyOpen(true)}
        className="mx-auto mt-4 rounded-lg px-2 py-1 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
      >
        ¿Qué datos usamos exactamente?
      </button>

      <div className="mt-auto pt-6">
        <Button
          block
          onClick={handleConnect}
          disabled={selectedAccounts.length === 0 || loading}
          icon={loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
        >
          {loading ? 'Conectando…' : 'Conectar con seguridad'}
        </Button>
      </div>

      {loading && <ClassifyingOverlay banks={banks} onDone={finish} />}

      <BottomSheet
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="¿Qué datos usamos exactamente?"
      >
        <ul className="space-y-4">
          {PRIVACY.map(({ Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-sm leading-relaxed text-ink-muted">{body}</span>
              </span>
            </li>
          ))}
        </ul>
        <Button block className="mt-6" onClick={() => setPrivacyOpen(false)}>
          Entendido
        </Button>
      </BottomSheet>
    </div>
  );
}
