import { NavLink, useLocation } from 'react-router-dom';
import { Home, PiggyBank, Repeat } from 'lucide-react';

const TABS = [
  { to: '/user/home', label: 'Inicio', Icon: Home, match: ['/user/home', '/user/alert'] },
  { to: '/user/subscriptions', label: 'Cobros', Icon: Repeat, match: ['/user/subscriptions'] },
  { to: '/user/offers', label: 'Ahorros', Icon: PiggyBank, match: ['/user/offers', '/user/savings-confirmation'] },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navegación principal"
      className="grid shrink-0 grid-cols-3 border-t border-soft bg-surface-card/95 px-2 pb-5 pt-2 backdrop-blur sm:pb-6"
    >
      {TABS.map(({ to, label, Icon, match }) => {
        const active = match.includes(pathname);
        return (
          <NavLink
            key={to}
            to={to}
            aria-current={active ? 'page' : undefined}
            className={[
              'flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition-all duration-200 ease-out active:scale-95',
              active ? 'text-primary' : 'text-ink-muted hover:text-ink',
            ].join(' ')}
          >
            <span
              className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                active ? 'bg-primary-light' : ''
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            </span>
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}
