import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    full: 'max-w-6xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* Modal Card with constrained max-height and internal scrolling */}
      <div
        className={clsx(
          'relative z-10 my-auto flex max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] w-full flex-col rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all dark:border-slate-800 dark:bg-occ-darkCard',
          sizeClasses[size]
        )}
      >
        {/* Fixed Header */}
        {(title || description) && (
          <div className="flex shrink-0 items-start justify-between border-b border-slate-100/80 p-5 sm:p-6 dark:border-slate-800/80">
            <div className="pr-4">
              {title && (
                <h3 className="text-lg font-bold tracking-tight text-occ-text dark:text-white">
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
              className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-all active:scale-95"
              title="Close modal (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-slate-100/80 p-4 sm:p-5 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
