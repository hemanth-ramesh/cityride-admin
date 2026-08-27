import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AdminRole, Permission } from '@/types/auth';
import { hasPermission, isAuthorizedRole } from '@/utils/rbac';

interface PermissionGuardProps {
  permission?: Permission;
  allowedRoles?: AdminRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  allowedRoles,
  fallback = null,
  children,
}) => {
  const { user } = useAuthStore();

  if (!user) return <>{fallback}</>;

  if (allowedRoles && !isAuthorizedRole(user.role, allowedRoles)) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
