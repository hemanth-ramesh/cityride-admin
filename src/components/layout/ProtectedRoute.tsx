import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { AdminRole } from '@/types/auth';
import { isAuthorizedRole, ROLE_LABELS, ROLE_BADGE_STYLES } from '@/utils/rbac';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: AdminRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-occ-bg dark:bg-occ-darkBg">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-occ-muted">Loading CITYRIDE Control Center...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !isAuthorizedRole(user.role, allowedRoles)) {
    const roleStyle = ROLE_BADGE_STYLES[user.role];
    return (
      <div className="flex h-full min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-occ-text dark:text-white">Access Restricted</h2>
        <p className="mt-2 max-w-md text-sm text-occ-muted">
          Your current administrative role does not have permission to view or manage this operational module.
        </p>

        <div className="my-6 inline-flex items-center space-x-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}">
          <span>Active Role:</span>
          <span>{ROLE_LABELS[user.role]}</span>
        </div>

        <div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
