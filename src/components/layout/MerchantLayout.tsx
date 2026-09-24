import { Outlet, useLocation } from 'react-router-dom';
import { Toast } from '@/components/ui/Toast';
import { PhoneFrame } from './PhoneFrame';

export function MerchantLayout() {
  const { pathname } = useLocation();

  if (pathname === '/merchant/dashboard') {
    return (
      <div key={pathname} className="w-full animate-fade-up">
        <Outlet />
        <Toast />
      </div>
    );
  }

  const isApp = pathname === '/merchant/campaign-results';
  return (
    <PhoneFrame darkStatus={!isApp} scroll={isApp} background={isApp ? 'bg-surface-bg' : 'bg-wa-bg'}>
      <div key={pathname} className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </PhoneFrame>
  );
}
