import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { clsx } from 'clsx';
import { User, Mail, ShieldCheck, CheckCircle2, AlertCircle, KeyRound, Sun, Moon } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePasswordClick?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onChangePasswordClick,
}) => {
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError('Admin Full Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    const result = await updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Profile & Account"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Role & Badge summary */}
        <div className="flex items-center space-x-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-sm">
            {fullName.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {fullName || 'Administrator'}
              </p>
              <span className="inline-flex items-center rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                <ShieldCheck className="mr-1 h-3 w-3" />
                {user?.role?.replace('_', ' ') || 'SUPER ADMIN'}
              </span>
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              CityRide Urban Transit Control Center
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Shankar Gowda"
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cityride.tumakuru.gov.in"
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition"
            />
          </div>
        </div>

        {/* Interface Theme Preference */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Interface Theme
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={clsx(
                'flex items-center justify-between rounded-xl border p-2.5 text-left transition cursor-pointer',
                theme === 'light'
                  ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20 dark:border-brand-500 dark:bg-brand-950/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100/70 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Light Mode</p>
                  <p className="text-[10px] text-slate-400">Standard clean</p>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="h-4 w-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={clsx(
                'flex items-center justify-between rounded-xl border p-2.5 text-left transition cursor-pointer',
                theme === 'dark'
                  ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20 dark:border-brand-500 dark:bg-brand-950/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100/70 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-[10px] text-slate-400">Low eye strain</p>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="h-4 w-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />}
            </button>
          </div>
        </div>

        {/* Change password button shortcut */}
        {onChangePasswordClick && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onChangePasswordClick();
              }}
              className="flex items-center space-x-2 text-xs font-medium text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 transition"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Change account password</span>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
