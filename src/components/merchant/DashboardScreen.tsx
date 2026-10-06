import { useNavigate } from 'react-router-dom';
import { Clock, Coffee, MessageCircle, Moon, Sun, TrendingUp, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Pill } from '@/components/ui/Pill';
import { MERCHANT } from '@/lib/data';

const CATEGORIES = [
  { label: 'Panadería y café', share: 38 },
  { label: 'Bebidas y lácteos', share: 27 },
  { label: 'Abarrotes rápidos', share: 21 },
];

const PEAKS = [
  {
    label: 'Desayuno',
    range: '7:00 - 9:15 AM',
    Icon: Sun,
    counter: 'Pan caliente y tinto al frente del mostrador.',
    change: 'Ten billetes de $2.000 y monedas de $500 listos.',
  },
  {
    label: 'Almuerzo',
    range: '12:30 - 2:00 PM',
    Icon: Utensils,
    counter: 'Bebidas frías y paquetes cerca de la caja.',
    change: 'Cambio para billetes de $20.000.',
  },
  {
    label: 'Regreso a casa',
    range: '6:00 - 7:30 PM',
    Icon: Moon,
    counter: 'Huevos, leche y arepas a la vista.',
    change: 'Refuerza monedas: muchas compras pequeñas.',
  },
];

export function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Logo suffix="Negocios" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Tendencias de tu zona</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {MERCHANT.business} · {MERCHANT.zone} · Semana del 12 al 18
          </p>
        </div>
        <Pill tone="neutral" icon={<MessageCircle size={13} />}>
          Resumen web · tu canal principal sigue siendo WhatsApp
        </Pill>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {/* 1. Categorías */}
        <section className="rounded-3xl border border-soft bg-surface-card p-6">
          <h2 className="text-base font-bold">Categorías más consumidas en tu zona</h2>
          <p className="mt-1 text-xs text-ink-muted">Compras agregadas y anónimas de la manzana.</p>
          <ol className="mt-6 space-y-5">
            {CATEGORIES.map((c, i) => (
              <li key={c.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">
                    <span className="mr-2 text-ink-muted">{i + 1}.</span>
                    {c.label}
                  </span>
                  <span className="tabular text-xl font-extrabold text-primary-dark">{c.share}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-surface-subtle">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${c.share / 0.4}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 2. Horas pico */}
        <section className="rounded-3xl border border-soft bg-surface-card p-6">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Clock size={17} className="text-primary" /> Horas pico de movimiento barrial
          </h2>
          <ul className="mt-5 space-y-4">
            {PEAKS.map(({ label, range, Icon, counter, change }) => (
              <li key={label} className="rounded-2xl bg-surface-subtle p-4">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-primary" />
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="tabular ml-auto text-xs font-semibold text-ink-muted">{range}</span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed">
                  <span className="font-semibold">Mostrador:</span> {counter}
                </p>
                <p className="text-[13px] leading-relaxed text-ink-muted">
                  <span className="font-semibold text-ink">Caja:</span> {change}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Demanda no atendida */}
        <section className="flex flex-col rounded-3xl bg-primary p-6 text-white">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <TrendingUp size={17} /> Demanda no atendida en tu cuadra
          </h2>
          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Coffee size={26} />
          </div>
          <p className="mt-5 text-xl font-bold leading-snug">
            40 vecinos compraron café fuera del barrio esta semana.
          </p>
          <p className="mt-4 text-sm text-white/75">Oportunidad neta estimada</p>
          <p className="tabular text-3xl font-extrabold">+$180.000 COP</p>
          <p className="text-sm text-white/75">semanales</p>
          <div className="mt-auto pt-8">
            <Button
              block
              variant="secondary"
              className="border-transparent !text-wa-header"
              icon={<MessageCircle size={18} />}
              onClick={() => navigate('/merchant/create-offer-1')}
            >
              Activar campaña sugerida vía WhatsApp
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
