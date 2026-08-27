import React from 'react';
import { clsx } from 'clsx';

export type StatusType =
  | 'on_time'
  | 'delayed'
  | 'severely_delayed'
  | 'early'
  | 'active'
  | 'inactive'
  | 'offline'
  | 'critical'
  | 'emergency'
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'scheduled'
  | 'maintenance'
  | 'under_review'
  | 'live'
  | 'updating'
  | 'stale';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dotColor: string }> = {
  on_time: {
    label: 'On Time',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  live: {
    label: 'LIVE',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  active: {
    label: 'Active',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  delayed: {
    label: 'Delayed',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  updating: {
    label: 'Updating',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  severely_delayed: {
    label: 'Major Delay',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    dotColor: 'bg-orange-500',
  },
  early: {
    label: 'Early',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
  },
  critical: {
    label: 'Critical',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500',
  },
  emergency: {
    label: 'SOS Active',
    bg: 'bg-red-100 dark:bg-red-950/60',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-300 dark:border-red-700',
    dotColor: 'bg-red-600',
  },
  offline: {
    label: 'Offline',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dotColor: 'bg-slate-400',
  },
  stale: {
    label: 'GPS Stale',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dotColor: 'bg-slate-400',
  },
  maintenance: {
    label: 'Maintenance',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
  },
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
    dotColor: 'bg-sky-500',
  },
  open: {
    label: 'Open',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    dotColor: 'bg-rose-500',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  closed: {
    label: 'Closed',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    dotColor: 'bg-slate-400',
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    dotColor: 'bg-purple-500',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  dot = true,
  pulse = false,
  className,
}) => {
  const normalizedKey = status.toLowerCase().replace(/[\s-]/g, '_');
  const config = STATUS_CONFIG[normalizedKey] || {
    label: label || status,
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dotColor: 'bg-slate-400',
  };

  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center space-x-1.5 rounded-md border font-medium transition-colors',
        sizeClasses[size],
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={clsx(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                config.dotColor
              )}
            />
          )}
          <span className={clsx('relative inline-flex h-2 w-2 rounded-full', config.dotColor)} />
        </span>
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
