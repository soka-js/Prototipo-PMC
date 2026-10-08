import type { MerchantProduct } from '@/store/useAppStore';

export const MERCHANT = {
  owner: 'don Hernando',
  business: 'Cigarrería La 53',
  zone: 'Chapinero Central',
};

export const PRODUCTS: Record<
  MerchantProduct,
  { label: string; hint: string; highlight?: string }
> = {
  combo: {
    label: 'Combo Café con Pan',
    highlight: '★ Más pedido en Chapinero 2:00 - 5:00 p.m.',
    hint: 'Margen sugerido: 25%',
  },
  pan: {
    label: 'Pan fresco de la mañana',
    hint: 'Ideal para remate antes de las 6 p.m.',
  },
  lacteos: {
    label: 'Lácteos y bebidas calientes',
    hint: 'Acompañamientos frecuentes',
  },
};

export const DISCOUNTS = [10, 15, 20] as const;

/** Comisión sobre cada venta atribuida a una oferta (modelo del pitch). */
export const COMMISSION_RATE = 0.05;

/** Ventas atribuidas a la campaña de ejemplo. */
export const ESTIMATED_SALES = 320000;

export const commissionLabel = `${Math.round(COMMISSION_RATE * 100)} %`;
