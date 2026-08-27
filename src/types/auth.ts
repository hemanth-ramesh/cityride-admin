export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'DISPATCHER'
  | 'FLEET_MANAGER'
  | 'SUPPORT_ADMIN'
  | 'ANALYST';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string;
  depotId?: string;
  phoneNumber?: string;
  lastLoginAt?: string;
  isActive: boolean;
  createdAt: string;
}

export type Permission = 
  | 'dashboard:view'
  | 'operations:live_view'
  | 'operations:control'
  | 'fleet:view'
  | 'fleet:manage'
  | 'drivers:view'
  | 'drivers:manage'
  | 'duties:view'
  | 'duties:manage'
  | 'routes:view'
  | 'routes:manage'
  | 'stops:view'
  | 'stops:manage'
  | 'schedules:view'
  | 'schedules:manage'
  | 'trips:view'
  | 'trips:manage'
  | 'incidents:view'
  | 'incidents:manage'
  | 'emergency:view'
  | 'emergency:manage'
  | 'passengers:view'
  | 'passengers:manage'
  | 'complaints:view'
  | 'complaints:manage'
  | 'lost_found:view'
  | 'lost_found:manage'
  | 'notifications:view'
  | 'notifications:send'
  | 'analytics:fleet'
  | 'analytics:routes'
  | 'analytics:drivers'
  | 'analytics:operations'
  | 'users:manage'
  | 'audit:view'
  | 'settings:manage';

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
