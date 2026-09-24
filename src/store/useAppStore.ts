import { create } from 'zustand';
import { roundToHundreds, roundToThousands } from '@/lib/format';
import { DEFAULT_PATH, type Role } from '@/lib/screens';

export type SubscriptionStatus = 'active' | 'cancelling' | 'cancelled';

export interface Subscription {
  id: string;
  name: string;
  detail: string;
  monthly: number;
  paidToDate: number;
  status: SubscriptionStatus;
}

export interface Simulation {
  amount: number;
  label: string;
  outcome: 'positive' | 'negative';
  /** Lo que quedaría libre para el resto del mes (positiva). */
  remaining: number;
  perDay: number;
  /** Lo que faltaría antes del 30 (negativa). */
  shortfall: number;
  /** Monto alternativo sugerido (negativa). */
  suggested: number;
}

export type MerchantProduct = 'combo' | 'pan' | 'lacteos';

export interface MerchantOffer {
  active: boolean;
  product: MerchantProduct | null;
  discount: number | null;
  customers: number;
  returning: number;
}

/** Monto máximo que el simulador considera seguro. */
export const SAFE_LIMIT = 65000;
/** Libre para el resto del mes después de compromisos y colchón. */
const FREE_UNTIL_PAYDAY = 285000;
/** Lo que se puede estirar antes de tocar compromisos. */
const STRETCH_MARGIN = 170000;
export const DAYS_LEFT = 12;

export type SimulationRoute = '/user/response-positive' | '/user/response-negative';

interface AppState {
  // Consumidor
  connected: boolean;
  selectedAccounts: string[];
  currentBalance: number;
  dailyAvailable: number;
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

export const useAppStore = create<AppState>((set, get) => ({
  connected: false,
  selectedAccounts: ['nequi'],
  currentBalance: 420000,
  dailyAvailable: 54000,
  lastSimulation: null,
  subscriptions: [
    { id: 'spotify', name: 'Spotify', detail: 'Premium Estudiantes', monthly: 18900, paidToDate: 480000, status: 'active' },
    { id: 'icloud', name: 'iCloud 200GB', detail: 'Almacenamiento Apple', monthly: 12900, paidToDate: 154800, status: 'active' },
    { id: 'smartfit', name: 'Smart Fit Bogotá', detail: 'Plan Black · Sede Chapinero', monthly: 79900, paidToDate: 958800, status: 'active' },
  ],

  toggleAccount: (id) =>
    set((s) => ({
      selectedAccounts: s.selectedAccounts.includes(id)
        ? s.selectedAccounts.filter((a) => a !== id)
        : [...s.selectedAccounts, id],
    })),

  connect: () => set({ connected: true }),

  simulateExpense: (amount, label = 'Salida con amigos') => {
    if (amount <= SAFE_LIMIT) {
      const remaining = FREE_UNTIL_PAYDAY - amount;
      set({
        lastSimulation: {
          amount,
          label,
          outcome: 'positive',
          remaining,
          perDay: roundToHundreds(remaining / DAYS_LEFT),
          shortfall: 0,
          suggested: amount,
        },
      });
      return '/user/response-positive';
    }
    const shortfall = Math.max(amount - STRETCH_MARGIN, roundToThousands(amount * 0.25));
    set({
      lastSimulation: {
        amount,
        label,
        outcome: 'negative',
        remaining: 0,
        perDay: 0,
        shortfall,
        suggested: amount > 120000 ? 120000 : SAFE_LIMIT,
      },
    });
    return '/user/response-negative';
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
}));
