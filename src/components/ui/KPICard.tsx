import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'teal' | 'orange' | 'dark';
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
  const statusStyles: Record<string, string> = {
    orange: 'bg-[#ff681d] text-white shadow-lg shadow-orange-500/20 border-transparent',
    success: 'bg-[#059669] text-white shadow-lg shadow-emerald-500/20 border-transparent',
    info: 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20 border-transparent',
    teal: 'bg-[#0d9488] text-white shadow-lg shadow-teal-500/20 border-transparent',
    warning: 'bg-[#d97706] text-white shadow-lg shadow-amber-500/20 border-transparent',
    danger: 'bg-[#e11d48] text-white shadow-lg shadow-rose-500/20 border-transparent',
    neutral: 'bg-[#1e1f24] text-white shadow-lg shadow-slate-900/20 border-transparent',
    dark: 'bg-[#1e1f24] text-white shadow-lg shadow-slate-900/20 border-transparent',
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-[#1e1f24] animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-white/15" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-white/20" />
          <div className="h-3.5 w-32 rounded bg-slate-200/80 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative flex flex-col justify-between rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        statusStyles[status] || statusStyles.neutral,
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      {/* Top Row: Circular White Badge on Left */}
      <div className="flex items-center justify-between">
        <div
          className={clsx(
            'flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-transform duration-300 group-hover:scale-110',
            iconBgColor && iconColor ? `${iconBgColor} ${iconColor}` : ''
          )}
        >
          <Icon className="h-5 w-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Bottom Row: Large Number & Label on Left, Percentage on Right */}
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
            {value}
          </div>
          <div className="mt-2 text-xs font-semibold text-white/90 tracking-wide uppercase">
            {title}
          </div>
          {subtext && (
            <div className="mt-1 text-[11px] text-white/70 font-medium">
              {subtext}
            </div>
          )}
        </div>

        {change !== undefined && (
          <div className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {change > 0 ? `+${change}%` : `${change}%`}
          </div>
        )}
      </div>
    </div>
  );
};
