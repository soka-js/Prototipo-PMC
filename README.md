# Prototipo-PMC

Prototipo interactivo de alta fidelidad de un ecosistema financiero hiperlocal para Bogotá, con dos lados:

- **Consumidor** (`/user/*`): una sola respuesta clara sobre cuánto puede gastar, sin tableros financieros.
- **Tendero** (`/merchant/*`): conversación por WhatsApp con acciones en un toque y un panel web secundario.

> "Prototipo" es un nombre provisional mientras se define la marca.

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build de producción en dist/
```

## Stack

Vite + React 18 + TypeScript, Tailwind CSS 3, React Router 6, Zustand y Lucide Icons. Tipografía Plus Jakarta Sans vía Google Fonts.

## Estructura

```
src/
  components/
    layout/    AppShell (barra demo + cambio de rol), PhoneFrame, BottomNav, layouts por rol
    ui/        Button, Pill, BottomSheet, Toast, Logo, ScreenHeader…
    user/      9 pantallas del consumidor
    merchant/  7 pantallas del tendero + whatsapp/ (chat, burbujas, nota de voz)
  store/useAppStore.ts   estado global y datos simulados
  lib/                   formato COP, lista de pantallas, datos de comercio
```

## Pantallas

| Consumidor | Tendero |
| --- | --- |
| `/user/connect` Conexión de cuentas | `/merchant/onboarding` Alta rápida por WhatsApp |
| `/user/home` Saldo disponible | `/merchant/weekly-report` Reporte semanal |
| `/user/simulate` Simular un gasto | `/merchant/create-offer-1` Crear oferta · producto |
| `/user/response-positive` Sí te alcanza | `/merchant/create-offer-2` Crear oferta · descuento |
| `/user/response-negative` Te quedarías corto | `/merchant/campaign-results` Resultados |
| `/user/subscriptions` Cobros que se repiten | `/merchant/chat-query` Consulta conversacional |
| `/user/alert` Alerta de ritmo | `/merchant/dashboard` Panel web de tendencias |
| `/user/offers` Oferta cerca | |
| `/user/savings-confirmation` Confirmación de ahorro | |

La barra superior permite cambiar de rol y saltar a cualquier pantalla. El simulador responde "Sí te alcanza" para montos de hasta $65.000 y "Te quedarías corto" por encima.
