import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { OverlayContext } from '@/components/ui/Overlay';
import { Toast } from '@/components/ui/Toast';
import { StatusBar } from './StatusBar';

/**
 * Marco tipo iPhone/Pixel (390 px) en pantallas medianas y grandes; en un
 * teléfono real ocupa todo el ancho sin bisel.
 */
export function PhoneFrame({
  children,
  bottom,
  darkStatus = false,
  background = 'bg-surface-bg',
  scroll = true,
}: {
  children: ReactNode;
  bottom?: ReactNode;
  darkStatus?: boolean;
  background?: string;
  /** false cuando el hijo maneja su propio scroll (chat de WhatsApp). */
  scroll?: boolean;
}) {
  const [overlay, setOverlay] = useState<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <OverlayContext.Provider value={overlay}>
      <div
        className={[
          'relative flex w-full flex-col overflow-hidden',
          'h-[calc(100dvh-56px)] sm:h-[min(844px,calc(100dvh_-_88px))] sm:min-h-[640px] sm:w-[390px]',
          'sm:rounded-[44px] sm:border-[10px] sm:border-ink sm:shadow-[0_30px_60px_-20px_rgba(26,26,24,0.35)]',
          background,
        ].join(' ')}
      >
        <StatusBar dark={darkStatus} />
        <div
          ref={scrollRef}
          className={`flex min-h-0 flex-1 flex-col ${scroll ? 'no-scrollbar overflow-y-auto' : 'overflow-hidden'}`}
        >
          {children}
        </div>
        {bottom}
        <div ref={setOverlay} className="pointer-events-none absolute inset-0 z-40" />
        <Toast />
      </div>
    </OverlayContext.Provider>
  );
}
