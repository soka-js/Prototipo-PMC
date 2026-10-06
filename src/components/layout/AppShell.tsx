import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutList, Settings } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAppStore } from '@/store/useAppStore';
import { MERCHANT_SCREENS, USER_SCREENS, roleFromPath } from '@/lib/screens';
import { RoleSwitcher } from './RoleSwitcher';

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setLastPath = useAppStore((s) => s.setLastPath);
  const role = roleFromPath(pathname);

  useEffect(() => {
    if (pathname.startsWith('/user/') || pathname.startsWith('/merchant/')) {
      setLastPath(role, pathname);
    }
  }, [pathname, role, setLastPath]);

  const screens = role === 'user' ? USER_SCREENS : MERCHANT_SCREENS;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-soft bg-surface-card/90 px-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />
          <span className="hidden rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted lg:inline">
            Demo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative hidden items-center sm:flex">
            <span className="sr-only">Ir a una pantalla</span>
            <LayoutList size={16} className="pointer-events-none absolute left-3 text-ink-muted" />
            <select
              value={screens.some((s) => s.path === pathname) ? pathname : ''}
              onChange={(e) => navigate(e.target.value)}
              className="h-9 max-w-[220px] cursor-pointer appearance-none rounded-xl border border-soft bg-surface-card pl-9 pr-3 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>
                Pantallas…
              </option>
              {screens.map((s, i) => (
                <option key={s.path} value={s.path}>
                  {i + 1}. {s.label}
                </option>
              ))}
            </select>
          </label>
          <RoleSwitcher role={role} />
          <Link
            to="/setup"
            aria-label="Datos de la sesión"
            title="Datos de la sesión"
            className={[
              'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
              pathname === '/setup'
                ? 'border-primary bg-primary-light text-primary'
                : 'border-soft bg-surface-card text-ink-muted hover:bg-surface-subtle hover:text-ink',
            ].join(' ')}
          >
            <Settings size={16} />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center sm:py-4">
        <Outlet />
      </main>
    </div>
  );
}
