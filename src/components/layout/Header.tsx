import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, ChevronRight, Menu } from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const location = useLocation();

  const ROUTE_NAME_MAP: Record<string, string> = {
    fleet: 'Buses',
    vehicles: 'Buses',
  };

  // Generate Breadcrumbs from location path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const formatted =
      ROUTE_NAME_MAP[segment.toLowerCase()] ||
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: formatted, url };
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-occ-darkCard/95">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {breadcrumbs.length === 0 ? (
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</span>
          ) : (
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url}>
                {idx > 0 && (
                  <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                )}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.url}
                    className="transition hover:text-brand-700 dark:hover:text-brand-400"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))
          )}
        </nav>
      </div>

      {/* Right: Notifications */}
      <div className="flex items-center space-x-3">
        <Link
          to="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-xs"
          title="Operational Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-occ-darkCard" />
        </Link>
      </div>
    </header>
  );
};
