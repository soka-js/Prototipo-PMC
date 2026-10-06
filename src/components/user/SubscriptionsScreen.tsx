import { useState } from 'react';
import { Check, Cloud, Dumbbell, Handshake, Loader2, Music, Repeat, Tv } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { cop } from '@/lib/format';
import { useAppStore, type Subscription } from '@/store/useAppStore';

type SubIcon = { Icon: typeof Music; bg: string; fg: string };

/** Ícono según el nombre, porque los cobros se escriben a mano en /setup. */
const ICONS: { match: RegExp; icon: SubIcon }[] = [
  { match: /spotify|music|deezer|tidal/i, icon: { Icon: Music, bg: '#E6F6EC', fg: '#1A7F43' } },
  { match: /icloud|drive|dropbox|nube|cloud|google one/i, icon: { Icon: Cloud, bg: '#E8F0FB', fg: '#2E5E9E' } },
  { match: /fit|gym|gimnasio|bodytech/i, icon: { Icon: Dumbbell, bg: '#FFF4D6', fg: '#8A6410' } },
  { match: /netflix|disney|prime|max|hbo|youtube|star|paramount|crunchyroll/i, icon: { Icon: Tv, bg: '#FCE9E6', fg: '#8A3426' } },
];
const DEFAULT_ICON: SubIcon = { Icon: Repeat, bg: '#F6F3EF', fg: '#706E6B' };

const iconFor = (name: string) => ICONS.find((i) => i.match.test(name))?.icon ?? DEFAULT_ICON;

function SubscriptionCard({ sub, onCancel }: { sub: Subscription; onCancel: () => void }) {
  const { Icon, bg, fg } = iconFor(sub.name);
  const cancelled = sub.status === 'cancelled';
  const cancelling = sub.status === 'cancelling';

  return (
    <li
      className={`rounded-3xl bg-surface-card p-4 transition-all duration-300 ease-out ${
        cancelled ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: bg, color: fg }}>
          <Icon size={20} />
        </span>
        <div className="flex-1">
          <p className={`text-[15px] font-semibold ${cancelled ? 'line-through decoration-ink-muted/50' : ''}`}>
            {sub.name}
          </p>
          {sub.detail && <p className="text-xs text-ink-muted">{sub.detail}</p>}
        </div>
        <p className="tabular text-right text-sm font-bold">
          {cop(sub.monthly)}
          <span className="block text-[11px] font-medium text-ink-muted">/mes</span>
        </p>
      </div>

      {!cancelled && (
        <p className="mt-3 rounded-xl bg-surface-subtle px-3 py-2 text-xs text-ink-muted">
          Llevas <strong className="text-ink">{cop(sub.paidToDate)}</strong> pagados
        </p>
      )}

      <div className="mt-3">
        {sub.status === 'active' && (
          <Button variant="secondary" size="md" block onClick={onCancel}>
            Cancelar por mí
          </Button>
        )}
        {cancelling && (
          <div className="rounded-2xl bg-primary-light p-3" role="status">
            <p className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
              <Loader2 size={14} className="animate-spin" /> Gestionando la baja con {sub.name}…
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-card">
              <div className="h-full w-full origin-left animate-[grow_2.6s_ease-out_both] rounded-full bg-primary" />
            </div>
          </div>
        )}
        {cancelled && (
          <p className="flex items-center gap-2 rounded-2xl bg-primary-light px-3 py-2.5 text-xs font-semibold text-primary-dark">
            <Check size={15} strokeWidth={3} /> Cancelado · Te ahorras {cop(sub.monthly)}/mes
          </p>
        )}
      </div>
    </li>
  );
}

export function SubscriptionsScreen() {
  const subscriptions = useAppStore((s) => s.subscriptions);
  const cancelSubscription = useAppStore((s) => s.cancelSubscription);
  const [confirming, setConfirming] = useState<Subscription | null>(null);

  const total = subscriptions
    .filter((s) => s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.monthly, 0);

  return (
    <div className="flex flex-1 flex-col px-5 pb-6">
      <header className="pt-4">
        <h1 className="text-[26px] font-extrabold tracking-tight">Cobros que se repiten</h1>
        <p className="mt-1 text-sm text-ink-muted">Los encontramos solos en tus extractos.</p>
      </header>

      <div className="mt-5 rounded-3xl bg-primary px-5 py-4 text-white">
        <p className="text-xs font-medium text-white/75">Total recurrente</p>
        <p className="tabular mt-1 text-3xl font-extrabold tracking-tight">
          {cop(total)}
          <span className="text-base font-semibold text-white/75">/mes</span>
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {subscriptions.map((sub) => (
          <SubscriptionCard key={sub.id} sub={sub} onCancel={() => setConfirming(sub)} />
        ))}
      </ul>

      <div className="mt-4 flex gap-3 rounded-3xl border border-dashed border-[#DCD7CE] p-4">
        <Handshake size={20} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-ink-muted">
          <strong className="text-ink">Gestión delegada y transparente.</strong> CIFRA gestiona la
          baja sin que tengas que llamar ni llenar formularios.
        </p>
      </div>

      <BottomSheet
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        title={confirming ? `¿Cancelamos ${confirming.name} por ti?` : ''}
      >
        {confirming && (
          <>
            <p className="text-sm leading-relaxed text-ink-muted">
              Nosotros hablamos con {confirming.name}, confirmamos la baja y te avisamos cuando
              quede lista. Dejas de pagar {cop(confirming.monthly)} al mes desde el próximo corte.
            </p>
            <div className="mt-6 space-y-2">
              <Button
                block
                onClick={() => {
                  cancelSubscription(confirming.id);
                  setConfirming(null);
                }}
              >
                Sí, cancélalo por mí
              </Button>
              <Button block variant="secondary" onClick={() => setConfirming(null)}>
                Mejor no
              </Button>
            </div>
          </>
        )}
      </BottomSheet>
    </div>
  );
}
