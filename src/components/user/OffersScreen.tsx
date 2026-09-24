import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, CreditCard, Croissant, Footprints, Map, MapPin, Navigation, Printer, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Pill } from '@/components/ui/Pill';
import { cop } from '@/lib/format';

const STOPS = [
  { name: 'Papelería Universitaria', deal: '10% en fotocopias y anillados', distance: 'A 450 m · Calle 45', Icon: Printer },
  { name: 'Tostadores de la 7ª', deal: 'Tinto gratis con el segundo café', distance: 'A 600 m · Carrera 7', Icon: Coffee },
  { name: 'Frutería La 57', deal: '12% en jugos y ensaladas', distance: 'A 750 m · Calle 57', Icon: Wheat },
];

function MockMap() {
  return (
    <div className="relative h-52 overflow-hidden rounded-2xl bg-[#EEF1EA]" aria-label="Mapa de la ruta a la panadería">
      <svg viewBox="0 0 340 208" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {[40, 100, 160].map((y) => (
          <rect key={y} x="0" y={y} width="340" height="14" fill="#FFFFFF" />
        ))}
        {[60, 170, 280].map((x) => (
          <rect key={x} x={x} y="0" width="14" height="208" fill="#FFFFFF" />
        ))}
        <rect x="190" y="118" width="80" height="36" rx="6" fill="#DCE8D5" />
        <path d="M67 190 L67 107 L177 107 L177 47 L230 47" fill="none" stroke="#0E6E63" strokeWidth="4" strokeDasharray="1 8" strokeLinecap="round" />
        <circle cx="67" cy="190" r="7" fill="#1A1A18" />
        <circle cx="67" cy="190" r="3" fill="#FFFFFF" />
      </svg>
      <span className="absolute left-[64%] top-[12%] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg">
        <Croissant size={18} />
      </span>
      <span className="absolute bottom-2 left-2 rounded-full bg-surface-card px-2.5 py-1 text-[11px] font-semibold">
        Estás aquí · U. Javeriana
      </span>
    </div>
  );
}

export function OffersScreen() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<'route' | 'map' | null>(null);

  return (
    <div className="flex flex-1 flex-col px-5 pb-6">
      <header className="pt-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-[26px] font-extrabold tracking-tight">Ahorros cerca</h1>
          <Pill tone="primary">{cop(62000)} este mes</Pill>
        </div>
        <p className="mt-1 text-sm text-ink-muted">En tu ruta de la U, sin cupones.</p>
      </header>

      <article className="mt-5 overflow-hidden rounded-3xl bg-surface-card">
        {/* "Foto" de la panadería */}
        <div className="relative h-44 bg-gradient-to-br from-[#E9C8A0] via-[#D9A774] to-[#A8683C]">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="absolute left-6 top-8 h-20 w-28 rounded-t-full bg-[#F6E3C8]/80" />
          <Croissant size={64} strokeWidth={1.4} className="absolute right-8 top-10 text-[#FFF4E2]" />
          <Wheat size={40} strokeWidth={1.4} className="absolute right-28 top-20 text-[#FFF4E2]/70" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1 text-xs font-semibold text-primary-dark">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Activa · A 220 m
          </span>
          <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">
            Panadería & Café · Chapinero
          </span>
        </div>

        <div className="p-5">
          <h2 className="text-[22px] font-extrabold leading-tight tracking-tight">
            15% en la panadería de la esquina
          </h2>
          <p className="mt-2 flex gap-2 text-sm leading-relaxed text-ink-muted">
            <CreditCard size={16} className="mt-0.5 shrink-0 text-primary" />
            Se aplica solo cuando pagues con tu tarjeta vinculada. Sin cupones.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="md" icon={<Navigation size={16} />} onClick={() => setSheet('route')}>
              Cómo llegar
            </Button>
            <Button size="md" variant="secondary" icon={<Map size={16} />} onClick={() => setSheet('map')}>
              Ver en Mapa
            </Button>
          </div>
        </div>
      </article>

      <button
        type="button"
        onClick={() => navigate('/user/savings-confirmation')}
        className="mt-3 rounded-2xl border border-dashed border-[#DCD7CE] px-4 py-3 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-subtle"
      >
        Demo: simular pago en caja con tarjeta vinculada →
      </button>

      <h2 className="mt-6 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Otras paradas en tu ruta universitaria
      </h2>
      <ul className="mt-2 divide-y divide-soft rounded-3xl bg-surface-card px-4">
        {STOPS.map(({ name, deal, distance, Icon }) => (
          <li key={name} className="flex items-center gap-3 py-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{name}</span>
              <span className="block text-xs text-ink">{deal}</span>
              <span className="block text-[11px] text-ink-muted">{distance}</span>
            </span>
          </li>
        ))}
      </ul>

      <BottomSheet
        open={sheet !== null}
        onClose={() => setSheet(null)}
        title={sheet === 'route' ? 'Cómo llegar' : 'Panadería & Café'}
      >
        <MockMap />
        {sheet === 'route' ? (
          <ol className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Footprints size={18} className="shrink-0 text-primary" /> 3 min caminando · 220 m
            </li>
            <li className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-primary" /> Sube por la Carrera 7 y gira en
              la Calle 63 hacia el occidente.
            </li>
          </ol>
        ) : (
          <p className="mt-4 flex gap-2 text-sm text-ink-muted">
            <MapPin size={18} className="shrink-0 text-primary" /> Calle 63, Chapinero · Abierto hasta
            las 8:00 p.m.
          </p>
        )}
        <Button block className="mt-5" onClick={() => setSheet(null)}>
          Listo
        </Button>
      </BottomSheet>
    </div>
  );
}
