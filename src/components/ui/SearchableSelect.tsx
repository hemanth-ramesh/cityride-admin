import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Search, X, Check, ChevronDown, LucideIcon } from 'lucide-react';

export interface SearchOption {
  label: string;
  value: string | number;
  sublabel?: string;
  badge?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  options?: SearchOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  className?: string;
  containerClassName?: string;
  clearable?: boolean;
  emptyMessage?: string;
  id?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = 'Type to search...',
  value = '',
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
  helperText,
  icon: Icon,
  className,
  containerClassName,
  clearable = true,
  emptyMessage = 'No matching results found',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Find the selected option
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Filter options based on user search query
  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesLabel = opt.label.toLowerCase().includes(query);
    const matchesValue = String(opt.value).toLowerCase().includes(query);
    const matchesSublabel = opt.sublabel ? opt.sublabel.toLowerCase().includes(query) : false;
    return matchesLabel || matchesValue || matchesSublabel;
  });

  // Keep highlighted index within bounds
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery, isOpen]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string | number) => {
    if (disabled) return;
    onChange?.(String(val));
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredOptions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % Math.max(1, filteredOptions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const generatedId = id || (label ? label.toLowerCase().replace(/[\s-]/g, '_') : undefined);

  return (
    <div ref={containerRef} className={clsx('relative flex flex-col space-y-1.5', containerClassName)}>
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
        {/* Leading Search or Custom Icon */}
        <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
          {Icon ? <Icon className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </div>

        {/* The Searchable Input Bar */}
        <input
          ref={inputRef}
          id={generatedId}
          type="text"
          disabled={disabled}
          value={isOpen ? searchQuery : selectedOption ? selectedOption.label : ''}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
              setSearchQuery('');
            }
          }}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={clsx(
            'w-full rounded-2xl border bg-slate-50/60 pl-10 pr-16 py-2.5 text-sm text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-800'
              : 'border-slate-200/80 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:focus:border-brand-400',
            disabled && 'cursor-not-allowed bg-slate-100/60 opacity-60 dark:bg-slate-800/50',
            className
          )}
        />

        {/* Right side controls: Clear button and toggle chevron */}
        <div className="absolute right-2.5 flex items-center space-x-1">
          {clearable && selectedOption && value !== '' && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                if (!isOpen) inputRef.current?.focus();
              }
            }}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <ChevronDown
              className={clsx('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180 text-brand-600')}
            />
          </button>
        </div>
      </div>

      {/* Helper text or error */}
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}

      {/* Floating Filtered Results List */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-50 zoom-in-95 duration-100">
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto overflow-x-hidden space-y-0.5 text-xs focus:outline-none"
            tabIndex={-1}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const isSelected = String(option.value) === String(value);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={String(option.value) || idx}
                    onClick={() => {
                      if (!option.disabled) handleSelect(option.value);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={clsx(
                      'flex items-center justify-between rounded-xl px-3 py-2 transition-colors cursor-pointer select-none',
                      option.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : isHighlighted
                        ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/60 dark:text-brand-200'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                      isSelected && 'font-bold bg-brand-50/50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                    )}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="truncate">{option.label}</span>
                      {option.sublabel && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {option.sublabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      {option.badge && (
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && <Check className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-4 text-center text-slate-400 dark:text-slate-500">
                <Search className="mx-auto mb-1.5 h-4 w-4 opacity-40" />
                <span>{emptyMessage}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
