import { useNavigate } from 'react-router-dom';
import { Check, Croissant } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cop } from '@/lib/format';

export function SavingsConfirmationScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col px-5 pb-6 pt-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <span className="flex h-11 w-11 animate-fade-up items-center justify-center rounded-full bg-primary text-white">
            <Check size={24} strokeWidth={3} />
          </span>
        </span>
        <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight">
          Ahorraste {cop(4500)} en tu última compra
        </h1>
        <p className="mt-2 text-[15px] font-medium text-primary">Llevas {cop(62000)} ahorrados este mes</p>
      </div>

      {/* Tiquete */}
      <div className="relative mt-8 rounded-3xl bg-surface-card p-5 shadow-[0_12px_30px_-18px_rgba(26,26,24,0.25)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6E7D8] text-[#8A5A2B]">
            <Croissant size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold">Panadería & Café</p>
            <p className="text-xs text-ink-muted">Calle 63, Chapinero · Hoy, 8:12 a.m.</p>
          </div>
        </div>

        <div className="relative my-5 border-t-2 border-dashed border-soft">
          <span className="absolute -left-8 -top-3 h-6 w-6 rounded-full bg-surface-bg" />
          <span className="absolute -right-8 -top-3 h-6 w-6 rounded-full bg-surface-bg" />
        </div>

        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Compra</dt>
            <dd className="tabular font-medium">{cop(30000)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Oferta aplicada</dt>
            <dd className="font-medium">15% con tarjeta vinculada</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Total pagado</dt>
            <dd className="tabular font-semibold">{cop(25500)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-light px-4 py-3">
          <span className="text-sm font-semibold text-primary-dark">Reembolso directo</span>
          <span className="tabular text-lg font-extrabold text-primary-dark">+{cop(4500)}</span>
        </div>
        <p className="mt-2 text-center text-xs text-ink-muted">Acreditado al saldo disponible</p>
      </div>

      <div className="mt-auto pt-8">
        <Button block onClick={() => navigate('/user/home')}>
          Ver mi saldo disponible
        </Button>
      </div>
    </div>
  );
}
