import React from 'react';
import { useLocation } from 'react-router-dom';
import { LucideIcon, Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title?: string;
  phase?: number;
  description?: string;
  icon?: LucideIcon;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  phase = 2,
  description,
  icon: Icon = Construction,
}) => {
  const location = useLocation();
  const pageTitle =
    title ||
    location.pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Module';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400">
        <Icon className="h-8 w-8" />
      </div>

      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {pageTitle}
      </h2>

      <div className="mt-2 inline-flex items-center space-x-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
        <span>Scheduled for Phase {phase}</span>
      </div>

      <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {description ||
          `This operational module is part of the Phase ${phase} development plan. The Foundation, RBAC, and core layout components are fully initialized.`}
      </p>

      <div className="mt-6 flex items-center space-x-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
