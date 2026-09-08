import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

import { SearchableSelect } from './SearchableSelect';

interface Option {
  label: string;
  value: string | number;
  sublabel?: string;
  badge?: string;
  disabled?: boolean;
}

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  as?: 'input' | 'select' | 'textarea' | 'search-select';
  searchable?: boolean;
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
  searchable = false,
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

  if (as === 'search-select' || (as === 'select' && searchable)) {
    return (
      <SearchableSelect
        id={generatedId}
        label={label}
        required={required}
        disabled={disabled}
        error={error}
        helperText={helperText}
        value={props.value !== undefined ? String(props.value) : ''}
        placeholder={props.placeholder || (label ? `Search ${label.replace(/\s*\(optional\)/i, '')}...` : 'Type to search...')}
        options={options}
        icon={Icon}
        className={className}
        containerClassName={containerClassName}
        onChange={(val) => {
          if (props.onChange) {
            props.onChange({
              target: { value: val, name: props.name || generatedId },
            } as any);
          }
        }}
      />
    );
  }

  const baseControlClasses = clsx(
    'w-full rounded-2xl border bg-slate-50/60 px-4 py-2.5 text-sm text-occ-text shadow-xs transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500',
    error
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-800'
      : 'border-slate-200/80 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400',
    Icon && 'pl-10',
    RightIcon && 'pr-10',
    disabled && 'cursor-not-allowed bg-slate-100/60 opacity-60 dark:bg-slate-800/50',
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
