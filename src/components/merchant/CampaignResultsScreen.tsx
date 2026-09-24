import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, RefreshCw, SlidersHorizontal, UserRoundCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Pill } from '@/components/ui/Pill';
import { COMMISSION_PER_CUSTOMER, MERCHANT, PRODUCTS } from '@/lib/data';
import { cop } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';

const ESTIMATED_SALES = 320000;

export function CampaignResultsScreen() {
  const navigate = useNavigate();
  const offer = useAppStore((s) => s.offer);
  const repeatCampaign = useAppStore((s) => s.repeatCampaign);

  const commission = offer.customers * COMMISSION_PER_CUSTOMER;
  const net = ESTIMATED_SALES - commission;
  const product = PRODUCTS[offer.product ?? 'combo'].label;

  return (
    <div className="flex flex-1 flex-col px-5 pb-6">
      <header className="flex h-14 items-center justify-between">
        <Logo suffix="Negocios" />
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-card text-ink-muted" aria-hidden="true">
          <Bell size={17} />
        </span>
      </header>

      <p className="mt-1 text-sm text-ink-muted">
        {MERCHANT.business} · {MERCHANT.zone}
      </p>
      <Pill className="mt-2 self-start">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Activa · {product} · {offer.discount ?? 15}%
      </Pill>

      <section className="mt-6 rounded-3xl bg-surface-card p-5">
        <Users size={20} className="text-primary" />
        <p className="tabular mt-3 text-[44px] font-extrabold leading-none tracking-tight">
          {offer.customers} clientes nuevos
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Pagaste {cop(commission)} · {cop(COMMISSION_PER_CUSTOMER)} por cliente
        </p>
      </section>

      <section className="mt-3 flex gap-3 rounded-3xl bg-primary-light p-4">
        <UserRoundCheck size={20} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-primary-dark">
          <strong>{offer.returning} de ellos</strong> ya volvieron una segunda vez sin cobro de comisión.
        </p>
      </section>

      <section className="mt-3 rounded-3xl bg-surface-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Balance del ejercicio</h2>
        <dl className="mt-3 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Ventas estimadas</dt>
            <dd className="tabular font-semibold">{cop(ESTIMATED_SALES)} COP</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Comisión</dt>
            <dd className="tabular font-semibold">{cop(-commission)} COP</dd>
          </div>
        </dl>
        <div className="mt-3 border-t border-soft pt-3">
          <p className="text-xs font-medium text-ink-muted">Retorno neto positivo</p>
          <p className="tabular text-2xl font-extrabold text-primary-dark">
            {cop(net)} COP <span className="text-sm font-semibold text-primary">libres en caja</span>
          </p>
        </div>
      </section>

      <div className="mt-auto grid grid-cols-[1.25fr_1fr] gap-2 pt-6">
        <Button size="md" icon={<RefreshCw size={16} />} onClick={repeatCampaign}>
          Repetir campaña
        </Button>
        <Button
          size="md"
          variant="secondary"
          icon={<SlidersHorizontal size={16} />}
          onClick={() => navigate('/merchant/create-offer-1')}
        >
          Ajustar
        </Button>
      </div>
      <button
        type="button"
        onClick={() => navigate('/merchant/chat-query')}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-wa-header transition-colors hover:bg-surface-subtle"
      >
        <MessageCircle size={16} /> Preguntar algo por WhatsApp
      </button>
    </div>
  );
}
