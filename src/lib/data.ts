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

export const COMMISSION_PER_CUSTOMER = 2000;

/** Lo que tiene comprometido este mes (suma $310.000). */
export const COMMITMENTS = [
  { label: 'Almuerzos U. (Lun - Jue)', amount: 56000 },
  { label: 'Recargas Transmilenio', amount: 24000 },
  { label: 'Plan telefonía móvil', amount: 35000 },
  { label: 'Cobros que se repiten', amount: 111700 },
  { label: 'Fotocopias y materiales', amount: 83300 },
];
