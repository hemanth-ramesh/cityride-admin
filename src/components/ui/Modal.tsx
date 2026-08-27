import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnOutsideClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOutsideClick = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-3xl',
    full: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* Modal Card with constrained max-height and internal scrolling */}
      <div
        className={clsx(
          'relative z-10 my-auto flex max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-occ-darkCard',
          sizeClasses[size]
        )}
      >
        {/* Fixed Header */}
        {(title || description) && (
          <div className="flex shrink-0 items-start justify-between border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800">
            <div className="pr-4">
              {title && (
                <h3 className="text-lg font-bold text-occ-text dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              title="Close modal (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-slate-100 p-4 sm:p-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
