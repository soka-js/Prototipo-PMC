import { Outlet, useLocation } from 'react-router-dom';
import { PhoneFrame } from './PhoneFrame';
import { BottomNav } from './BottomNav';

/** Pantallas con la barra inferior fija; el resto son flujos enfocados. */
const WITH_NAV = [
  '/user/home',
  '/user/subscriptions',
  '/user/offers',
  '/user/alert',
  '/user/savings-confirmation',
];

export function UserLayout() {
  const { pathname } = useLocation();
  return (
    <PhoneFrame bottom={WITH_NAV.includes(pathname) ? <BottomNav /> : undefined}>
      <div key={pathname} className="flex min-h-full flex-1 animate-fade-up flex-col">
        <Outlet />
      </div>
    </PhoneFrame>
  );
}
