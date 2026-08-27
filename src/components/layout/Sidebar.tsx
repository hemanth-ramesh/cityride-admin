import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/useAuthStore';
import { isAuthorizedRole } from '@/utils/rbac';
import { AdminRole } from '@/types/auth';
import {
  LayoutDashboard,
  Radio,
  Bus,
  Users,
  GitFork,
  MapPin,
  Clock,
  Navigation,
  AlertTriangle,
  Flame,
  MessageSquareWarning,
  PackageSearch,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItemConfig {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'danger' | 'warning' | 'info' | 'success';
  allowedRoles?: AdminRole[];
}

interface NavGroupConfig {
  groupName: string;
  items: NavItemConfig[];
}

const NAVIGATION_CONFIG: NavGroupConfig[] = [
  {
    groupName: 'OVERVIEW',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Live Operations',
        path: '/operations/live',
        icon: Radio,
        badge: 'LIVE',
        badgeVariant: 'success',
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER'],
      },
    ],
  },
  {
    groupName: 'OPERATIONS',
    items: [
      {
        title: 'Fleet (Buses)',
        path: '/fleet',
        icon: Bus,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'FLEET_MANAGER'],
      },
      {
        title: 'Drivers',
        path: '/drivers',
        icon: Users,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'FLEET_MANAGER'],
      },
      {
        title: 'Routes',
        path: '/routes',
        icon: GitFork,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER'],
      },
      {
        title: 'Bus Stops',
        path: '/stops',
        icon: MapPin,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER'],
      },
      {
        title: 'Schedules',
        path: '/schedules',
        icon: Clock,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER'],
      },
      {
        title: 'Trips & History',
        path: '/trips',
        icon: Navigation,
      },
    ],
  },
  {
    groupName: 'SAFETY & CONTROL',
    items: [
      {
        title: 'Incidents',
        path: '/incidents',
        icon: AlertTriangle,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER'],
      },
      {
        title: 'Emergency SOS',
        path: '/emergency',
        icon: Flame,
        badge: '0',
        badgeVariant: 'danger',
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'SUPPORT_ADMIN'],
      },
    ],
  },
  {
    groupName: 'PASSENGER SERVICE',
    items: [
      {
        title: 'Complaints',
        path: '/complaints',
        icon: MessageSquareWarning,
        badge: '3',
        badgeVariant: 'warning',
        allowedRoles: ['SUPER_ADMIN', 'SUPPORT_ADMIN'],
      },
      {
        title: 'Lost & Found',
        path: '/lost-found',
        icon: PackageSearch,
        allowedRoles: ['SUPER_ADMIN', 'SUPPORT_ADMIN'],
      },
      {
        title: 'Notifications',
        path: '/notifications',
        icon: Bell,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'SUPPORT_ADMIN'],
      },
    ],
  },
  {
    groupName: 'ANALYTICS',
    items: [
      {
        title: 'Fleet & Routes',
        path: '/analytics',
        icon: BarChart3,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'ANALYST'],
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user } = useAuthStore();

  return (
    <aside
      className={clsx(
        'relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-occ-darkCard',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      {!collapsed ? (
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-md shadow-brand-700/20">
              <Bus className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-brand-900 dark:text-white">
                CITYRIDE
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                OCC • Tumakuru
              </span>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:block dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center border-b border-slate-200 px-2 dark:border-slate-800">
          <button
            onClick={onToggleCollapse}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition shadow-xs"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Navigation Group Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {NAVIGATION_CONFIG.map((group, groupIdx) => {
          // Filter items based on active user role
          const visibleItems = group.items.filter(
            (item) => !item.allowedRoles || isAuthorizedRole(user?.role, item.allowedRoles)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.groupName} className={clsx(groupIdx > 0 && 'mt-6')}>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  {group.groupName}
                </div>
              )}

              <nav className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all',
                          isActive
                            ? 'bg-brand-50 text-brand-800 shadow-sm dark:bg-brand-950/40 dark:text-brand-300'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white',
                          collapsed && 'justify-center px-0'
                        )
                      }
                      title={collapsed ? item.title : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={clsx(
                              'h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110',
                              isActive
                                ? 'text-brand-700 dark:text-brand-400'
                                : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
                              !collapsed && 'mr-3'
                            )}
                          />

                          {!collapsed && (
                            <span className="flex-1 truncate">{item.title}</span>
                          )}

                          {!collapsed && item.badge !== undefined && (
                            <span
                              className={clsx(
                                'ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide',
                                item.badgeVariant === 'danger' &&
                                  'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
                                item.badgeVariant === 'warning' &&
                                  'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
                                item.badgeVariant === 'success' &&
                                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
                                item.badgeVariant === 'info' &&
                                  'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}

                          {isActive && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-brand-600" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Transit Network Badge Footer */}
      {!collapsed && (
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center space-x-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
            <div className="flex h-2 w-2 flex-shrink-0 animate-ping rounded-full bg-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Tumakuru Transit Network
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                36 Stops • 8 Routes • 9 Fleet
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
