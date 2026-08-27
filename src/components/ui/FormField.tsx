import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  as?: 'input' | 'select' | 'textarea';
  options?: Option[];
  rows?: number;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  containerClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  as = 'input',
  options = [],
  rows = 3,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  containerClassName,
  className,
  id,
  required,
  disabled,
  ...props
}) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/[\s-]/g, '_') : undefined);

  const baseControlClasses = clsx(
    'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-occ-text shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:focus:border-brand-400',
    Icon && 'pl-10',
    RightIcon && 'pr-10',
    disabled && 'cursor-not-allowed bg-slate-50 opacity-60 dark:bg-slate-800/50',
    className
  );

  return (
    <div className={clsx('flex flex-col space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={generatedId}
          className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}

        {as === 'input' && (
          <input
            id={generatedId}
            disabled={disabled}
            required={required}
            className={baseControlClasses}
            {...props}
          />
        )}

        {as === 'select' && (
          <select
            id={generatedId}
            disabled={disabled}
            required={required}
            className={clsx(baseControlClasses, 'appearance-none pr-8')}
            {...(props as any)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {as === 'textarea' && (
          <textarea
            id={generatedId}
            rows={rows}
            disabled={disabled}
            required={required}
            className={baseControlClasses}
            {...(props as any)}
          />
        )}

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={disabled || !onRightIconClick}
            className={clsx(
              'absolute right-3 flex items-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200',
              !onRightIconClick && 'pointer-events-none'
            )}
          >
            <RightIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
