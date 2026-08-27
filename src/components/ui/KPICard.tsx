import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  change,
  changeType = 'neutral',
  status = 'neutral',
  icon: Icon,
  iconBgColor,
  iconColor,
  isLoading = false,
  onClick,
  className,
}) => {
  const statusStyles = {
    success: 'border-emerald-200/80 bg-white hover:border-emerald-300 dark:border-emerald-900/50 dark:bg-occ-darkCard',
    warning: 'border-amber-200/80 bg-white hover:border-amber-300 dark:border-amber-900/50 dark:bg-occ-darkCard',
    danger: 'border-red-200/80 bg-white hover:border-red-300 dark:border-red-900/50 dark:bg-occ-darkCard',
    info: 'border-blue-200/80 bg-white hover:border-blue-300 dark:border-blue-900/50 dark:bg-occ-darkCard',
    neutral: 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-occ-darkCard',
  };

  const defaultIconTheme = {
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-4 h-8 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-200',
        statusStyles[status],
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-occ-muted uppercase dark:text-slate-400">
          {title}
        </span>
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
            iconBgColor && iconColor ? `${iconBgColor} ${iconColor}` : defaultIconTheme[status]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-occ-text dark:text-white">
          {value}
        </div>
        {change !== undefined && (
          <div
            className={clsx(
              'flex items-center space-x-1 text-xs font-semibold',
              changeType === 'increase' && 'text-emerald-600 dark:text-emerald-400',
              changeType === 'decrease' && 'text-red-600 dark:text-red-400',
              changeType === 'neutral' && 'text-slate-500'
            )}
          >
            {changeType === 'increase' && <TrendingUp className="h-3.5 w-3.5" />}
            {changeType === 'decrease' && <TrendingDown className="h-3.5 w-3.5" />}
            {changeType === 'neutral' && <Minus className="h-3.5 w-3.5" />}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  );
};
