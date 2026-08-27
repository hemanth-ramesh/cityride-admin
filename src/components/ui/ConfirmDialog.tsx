import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, HelpCircle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirm Operational Action',
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <ShieldAlert className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      default:
        return <HelpCircle className="h-6 w-6 text-brand-600 dark:text-brand-400 shrink-0" />;
    }
  };

  const getConfirmBtnClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs focus:ring-amber-500';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus:ring-emerald-500';
      default:
        return 'bg-brand-700 hover:bg-brand-800 text-white shadow-xs focus:ring-brand-500';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={
        <div className="flex items-center space-x-2.5">
          {getIcon()}
          <span>{title}</span>
        </div>
      }
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${getConfirmBtnClasses()}`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="space-y-2 py-1 text-xs text-slate-600 dark:text-slate-300">
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
    </Modal>
  );
};
