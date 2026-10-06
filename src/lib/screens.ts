export type Role = 'user' | 'merchant';

export interface ScreenEntry {
  path: string;
  label: string;
}

export const USER_SCREENS: ScreenEntry[] = [
  { path: '/user/connect', label: 'Conexión de cuentas' },
  { path: '/user/home', label: 'Inicio · Saldo disponible' },
  { path: '/user/simulate', label: 'Simular un gasto' },
  { path: '/user/response-positive', label: 'Respuesta: Sí, te alcanza' },
  { path: '/user/response-negative', label: 'Respuesta: No te alcanza' },
  { path: '/user/subscriptions', label: 'Cobros que se repiten' },
];

export const MERCHANT_SCREENS: ScreenEntry[] = [
  { path: '/merchant/onboarding', label: 'Alta rápida por WhatsApp' },
  { path: '/merchant/weekly-report', label: 'Reporte semanal' },
  { path: '/merchant/create-offer-1', label: 'Crear oferta · Producto' },
  { path: '/merchant/create-offer-2', label: 'Crear oferta · Descuento' },
  { path: '/merchant/campaign-results', label: 'Resultados de la campaña' },
  { path: '/merchant/chat-query', label: 'Consulta conversacional' },
  { path: '/merchant/dashboard', label: 'Panel web de tendencias' },
];

export const DEFAULT_PATH: Record<Role, string> = {
  user: '/user/connect',
  merchant: '/merchant/onboarding',
};

export const roleFromPath = (pathname: string): Role =>
  pathname.startsWith('/merchant') ? 'merchant' : 'user';
