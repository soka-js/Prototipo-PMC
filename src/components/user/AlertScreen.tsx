import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beer, Coffee, Gauge, Sandwich } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { cop } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';

const RECENT = [
  { label: 'Café con estudio en la 19', when: 'Martes', amount: 28000, Icon: Coffee },
  { label: 'Hamburguesas tras parcial', when: 'Miércoles', amount: 62000, Icon: Sandwich },
  { label: 'Polas en el Chorro', when: 'Jueves', amount: 50000, Icon: Beer },
];

const ADJUSTMENTS = [
  { id: 'daily', title: 'Bajar el ritmo a $40.000 por día', body: 'Hasta el domingo. Te avisamos si te acercas.' },
  { id: 'weekend', title: 'Un plan de fin de semana de $60.000', body: 'Lo apartamos ya y no cuenta en tu disponible.' },
];

export function AlertScreen() {
  const navigate = useNavigate();
  const showToast = useAppStore((s) => s.showToast);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [choice, setChoice] = useState(ADJUSTMENTS[0].id);

  return (
    <div className="flex flex-1 flex-col px-5 pb-6">
      <ScreenHeader back="/user/home" />

      <div className="rounded-3xl bg-surface-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FDF3E1] text-[#A06A1B]">
            <Gauge size={20} />
          </span>
          <div>
            <h1 className="text-[17px] font-bold leading-tight">Vas más rápido que de costumbre</h1>
            <p className="text-xs text-ink-muted">Semana del 12 al 18</p>
          </div>
        </div>

        {/* Ritmo: solo dos barras simples */}
        <div className="mt-5 space-y-3" aria-label="Ritmo de salidas: promedio $70.000, esta semana $140.000">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-ink-muted">Promedio</span>
              <span className="font-semibold">$70k</span>
            </div>
            <div className="h-3 rounded-full bg-surface-subtle">
              <div className="h-full w-1/2 rounded-full bg-[#CFC8BC]" />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-ink-muted">Esta semana</span>
              <span className="font-semibold text-[#8A5A12]">$140k</span>
            </div>
            <div className="h-3 rounded-full bg-surface-subtle">
              <div className="h-full w-full origin-left animate-[grow_0.8s_ease-out_both] rounded-full bg-[#E7B46A]" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed">
          Esta semana llevas <strong>{cop(140000)}</strong> en salidas, el doble de tu promedio. Si
          sigue así, te faltarían <strong>{cop(60000)}</strong> antes del 30.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button size="md" onClick={() => setAdjustOpen(true)}>
            Ajustar
          </Button>
          <Button size="md" variant="secondary" onClick={() => navigate('/user/home')}>
            Está bien así
          </Button>
        </div>
      </div>

      <h2 className="mt-6 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Salidas recientes
      </h2>
      <ul className="mt-2 divide-y divide-soft rounded-3xl bg-surface-card px-4">
        {RECENT.map(({ label, when, amount, Icon }) => (
          <li key={label} className="flex items-center gap-3 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-subtle text-ink-muted">
              <Icon size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{label}</span>
              <span className="block text-xs text-ink-muted">{when}</span>
            </span>
            <span className="tabular text-sm font-semibold">{cop(amount)}</span>
          </li>
        ))}
      </ul>

      <BottomSheet open={adjustOpen} onClose={() => setAdjustOpen(false)} title="¿Cómo quieres ajustarlo?">
        <div className="space-y-2" role="radiogroup">
          {ADJUSTMENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={choice === a.id}
              onClick={() => setChoice(a.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                choice === a.id ? 'border-primary bg-primary-light/50 ring-1 ring-primary' : 'border-soft'
              }`}
            >
              <span className="block text-sm font-semibold">{a.title}</span>
              <span className="block text-xs text-ink-muted">{a.body}</span>
            </button>
          ))}
        </div>
        <Button
          block
          className="mt-5"
          onClick={() => {
            setAdjustOpen(false);
            showToast('Listo, ajustamos tu ritmo de la semana.');
            navigate('/user/home');
          }}
        >
          Guardar ajuste
        </Button>
      </BottomSheet>
    </div>
  );
}
