import { AdminRole, Permission } from '@/types/auth';

export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Administrator',
  OPERATIONS_MANAGER: 'Operations Manager',
  DISPATCHER: 'Dispatcher',
  FLEET_MANAGER: 'Bus Depot Manager',
  SUPPORT_ADMIN: 'Support Admin',
  ANALYST: 'Transit Analyst',
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Unrestricted full access to all control center modules, audit logs, and user roles.',
  OPERATIONS_MANAGER: 'Manages live bus operations, driver duties, routes, schedules, and incidents.',
  DISPATCHER: 'Real-time operational dispatching, active trip tracking, SOS response, and driver messaging.',
  FLEET_MANAGER: 'Oversees bus telemetry, maintenance status, bus assignments, and depot assets.',
  SUPPORT_ADMIN: 'Manages citizen complaints, lost & found verification, and passenger communications.',
  ANALYST: 'Read-only access to operational KPIs, route punctuality, bus utilization, and reports.',
};

export const ROLE_BADGE_STYLES: Record<AdminRole, { bg: string; text: string; border: string }> = {
  SUPER_ADMIN: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  OPERATIONS_MANAGER: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  DISPATCHER: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  FLEET_MANAGER: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  SUPPORT_ADMIN: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
  },
  ANALYST: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
  },
};

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    'dashboard:view',
    'operations:live_view',
    'operations:control',
    'fleet:view',
    'fleet:manage',
    'drivers:view',
    'drivers:manage',
    'duties:view',
    'duties:manage',
    'routes:view',
    'routes:manage',
    'stops:view',
    'stops:manage',
    'schedules:view',
    'schedules:manage',
    'trips:view',
    'trips:manage',
    'incidents:view',
    'incidents:manage',
    'emergency:view',
    'emergency:manage',
    'passengers:view',
    'passengers:manage',
    'complaints:view',
    'complaints:manage',
    'lost_found:view',
    'lost_found:manage',
    'notifications:view',
    'notifications:send',
    'analytics:fleet',
    'analytics:routes',
    'analytics:drivers',
    'analytics:operations',
    'users:manage',
    'audit:view',
    'settings:manage',
  ],

  OPERATIONS_MANAGER: [
    'dashboard:view',
    'operations:live_view',
    'operations:control',
    'fleet:view',
    'fleet:manage',
    'drivers:view',
    'drivers:manage',
    'duties:view',
    'duties:manage',
    'routes:view',
    'routes:manage',
    'stops:view',
    'stops:manage',
    'schedules:view',
    'schedules:manage',
    'trips:view',
    'trips:manage',
    'incidents:view',
    'incidents:manage',
    'emergency:view',
    'emergency:manage',
    'notifications:view',
    'notifications:send',
    'analytics:fleet',
    'analytics:routes',
    'analytics:drivers',
    'analytics:operations',
    'audit:view',
  ],

  DISPATCHER: [
    'dashboard:view',
    'operations:live_view',
    'operations:control',
    'fleet:view',
    'drivers:view',
    'duties:view',
    'trips:view',
    'trips:manage',
    'incidents:view',
    'incidents:manage',
    'emergency:view',
    'emergency:manage',
    'notifications:view',
    'notifications:send',
  ],

  FLEET_MANAGER: [
    'dashboard:view',
    'fleet:view',
    'fleet:manage',
    'drivers:view',
    'trips:view',
    'analytics:fleet',
  ],

  SUPPORT_ADMIN: [
    'dashboard:view',
    'passengers:view',
    'passengers:manage',
    'complaints:view',
    'complaints:manage',
    'lost_found:view',
    'lost_found:manage',
    'notifications:view',
    'notifications:send',
    'emergency:view',
  ],

  ANALYST: [
    'dashboard:view',
    'trips:view',
    'analytics:fleet',
    'analytics:routes',
    'analytics:drivers',
    'analytics:operations',
  ],
};

export function hasPermission(role: AdminRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: AdminRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((perm) => hasPermission(role, perm));
}

export function hasAllPermissions(role: AdminRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.every((perm) => hasPermission(role, perm));
}

export function isAuthorizedRole(userRole: AdminRole | undefined, allowedRoles?: AdminRole[]): boolean {
  if (!userRole) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
}
