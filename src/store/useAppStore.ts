import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { roundToHundreds } from '@/lib/format';
import { DEFAULT_PATH, type Role } from '@/lib/screens';

export type SubscriptionStatus = 'active' | 'cancelling' | 'cancelled';

/** Cobro recurrente tal como se configura en /setup. */
export interface SubscriptionConfig {
  id: string;
  name: string;
  detail: string;
  monthly: number;
  paidToDate: number;
}

export interface Subscription extends SubscriptionConfig {
  status: SubscriptionStatus;
}

/** Datos del entrevistado (YODA), editables en /setup y persistidos en localStorage. */
export interface SessionData {
  name: string;
  income: number;
  committed: number;
  projected: number;
  /** Fuera del documento del proyecto: 0 por defecto, y en 0 no se muestra. */
  cushion: number;
  /** Día del mes del próximo corte. */
  payday: number;
  daysLeft: number;
  subscriptions: SubscriptionConfig[];
}

export const DEFAULT_SESSION: SessionData = {
  name: 'Mariana',
  income: 900000,
  committed: 310000,
  projected: 170000,
  cushion: 0,
  payday: 30,
  daysLeft: 12,
  subscriptions: [
    { id: 'spotify', name: 'Spotify', detail: 'Premium Estudiantes', monthly: 18900, paidToDate: 480000 },
    { id: 'icloud', name: 'iCloud 200GB', detail: 'Almacenamiento Apple', monthly: 12900, paidToDate: 154800 },
    { id: 'smartfit', name: 'Smart Fit Bogotá', detail: 'Plan Black · Sede Chapinero', monthly: 79900, paidToDate: 958800 },
  ],
};

/** disponibleSeguro = ingreso - comprometido - proyectado - colchón */
export const safeAvailable = (s: SessionData) => s.income - s.committed - s.projected - s.cushion;

/** Disponible seguro repartido en los días que faltan para el corte. */
export const dailyAvailable = (s: SessionData) =>
  Math.max(0, roundToHundreds(safeAvailable(s) / Math.max(1, s.daysLeft)));

export interface Simulation {
  amount: number;
  label: string;
  outcome: 'positive' | 'negative';
  /** Lo que quedaría libre hasta el corte (positiva). */
  remaining: number;
  perDay: number;
  /** Lo que faltaría antes del corte (negativa). */
  shortfall: number;
  /** Monto alternativo sugerido (negativa); 0 si no hay margen. */
  suggested: number;
}

/** Compara el monto contra el disponible seguro, el mismo número que muestra el Home. */
export function computeSimulation(
  amount: number,
  session: SessionData,
  label = 'Salida con amigos',
): Simulation {
  const safe = safeAvailable(session);
  if (amount <= safe) {
    const remaining = safe - amount;
    return {
      amount,
      label,
      outcome: 'positive',
      remaining,
      perDay: roundToHundreds(remaining / Math.max(1, session.daysLeft)),
      shortfall: 0,
      suggested: amount,
    };
  }
  return {
    amount,
    label,
    outcome: 'negative',
    remaining: 0,
    perDay: 0,
    shortfall: amount - safe,
    suggested: Math.max(0, Math.floor(safe / 1000) * 1000),
  };
}

const toRuntime = (subs: SubscriptionConfig[]): Subscription[] =>
  subs.map((sub) => ({ ...sub, status: 'active' }));

export type MerchantProduct = 'combo' | 'pan' | 'lacteos';

export interface MerchantOffer {
  active: boolean;
  product: MerchantProduct | null;
  discount: number | null;
  customers: number;
  returning: number;
}

export type SimulationRoute = '/user/response-positive' | '/user/response-negative';

interface AppState {
  // Sesión de entrevista
  session: SessionData;
  saveSession: (session: SessionData) => void;

  // Consumidor
  connected: boolean;
  selectedAccounts: string[];
  lastSimulation: Simulation | null;
  subscriptions: Subscription[];
  toggleAccount: (id: string) => void;
  connect: () => void;
  simulateExpense: (amount: number, label?: string) => SimulationRoute;
  cancelSubscription: (id: string) => void;

  // Comercio
  offer: MerchantOffer;
  selectProduct: (product: MerchantProduct) => void;
  selectDiscount: (discount: number) => void;
  repeatCampaign: () => void;

  // Demo
  lastPath: Record<Role, string>;
  setLastPath: (role: Role, path: string) => void;
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: DEFAULT_SESSION,
      // Guardar reinicia lo que el entrevistado haya tocado (cancelaciones, última simulación).
      saveSession: (session) =>
        set({ session, subscriptions: toRuntime(session.subscriptions), lastSimulation: null }),

      connected: false,
      selectedAccounts: ['nequi'],
      lastSimulation: null,
      subscriptions: toRuntime(DEFAULT_SESSION.subscriptions),

      toggleAccount: (id) =>
        set((s) => ({
          selectedAccounts: s.selectedAccounts.includes(id)
            ? s.selectedAccounts.filter((a) => a !== id)
            : [...s.selectedAccounts, id],
        })),

      connect: () => set({ connected: true }),

      simulateExpense: (amount, label) => {
        const lastSimulation = computeSimulation(amount, get().session, label);
        set({ lastSimulation });
        return lastSimulation.outcome === 'positive'
          ? '/user/response-positive'
          : '/user/response-negative';
      },

      cancelSubscription: (id) => {
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: 'cancelling' } : sub,
          ),
        }));
        setTimeout(() => {
          set((s) => ({
            subscriptions: s.subscriptions.map((sub) =>
              sub.id === id ? { ...sub, status: 'cancelled' } : sub,
            ),
          }));
          const sub = get().subscriptions.find((x) => x.id === id);
          if (sub) get().showToast(`Listo, cancelamos ${sub.name} por ti.`);
        }, 2600);
      },

      offer: { active: false, product: null, discount: null, customers: 23, returning: 9 },

      selectProduct: (product) => set((s) => ({ offer: { ...s.offer, product } })),

      selectDiscount: (discount) =>
        set((s) => ({
          offer: { ...s.offer, discount, product: s.offer.product ?? 'combo', active: true },
        })),

      repeatCampaign: () => {
        set((s) => ({ offer: { ...s.offer, active: true } }));
        get().showToast('Campaña repetida por 7 días más.');
      },

      lastPath: { ...DEFAULT_PATH },
      setLastPath: (role, path) => set((s) => ({ lastPath: { ...s.lastPath, [role]: path } })),

      toast: null,
      showToast: (message) => {
        clearTimeout(toastTimer);
        set({ toast: { id: Date.now(), message } });
        toastTimer = setTimeout(() => set({ toast: null }), 2800);
      },
    }),
    {
      // Solo se persisten los datos del entrevistado; el estado de la demo arranca limpio.
      name: 'cifra-session',
      version: 2,
      // v1 traía colchón de 120.000 por defecto; en las entrevistas va en 0.
      migrate: (persisted, version) => {
        const state = persisted as { session?: Partial<SessionData> } | undefined;
        if (version < 2 && state?.session) state.session.cushion = 0;
        return state as { session: SessionData };
      },
      partialize: (s) => ({ session: s.session }),
      merge: (persisted, current) => {
        const stored = (persisted as { session?: Partial<SessionData> } | undefined)?.session;
        const session = { ...DEFAULT_SESSION, ...stored };
        return { ...current, session, subscriptions: toRuntime(session.subscriptions) };
      },
    },
  ),
);

/** Cobros recurrentes que siguen activos (no cancelados en la demo). */
export const activeSubscriptions = (subs: Subscription[]) =>
  subs.filter((s) => s.status !== 'cancelled');
