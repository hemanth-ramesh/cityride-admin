export * from './auth';

export type StatusVariant = 
  | 'on_time'
  | 'delayed'
  | 'severely_delayed'
  | 'early'
  | 'active'
  | 'inactive'
  | 'offline'
  | 'critical'
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'scheduled'
  | 'maintenance'
  | 'under_review';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  permission?: string;
  requiredRoles?: import('./auth').AdminRole[];
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface KPICardData {
  title: string;
  value: string | number;
  subtext?: string;
  change?: number; // e.g. +4.2% or -1.5%
  changeType?: 'increase' | 'decrease' | 'neutral';
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  icon: string;
}
