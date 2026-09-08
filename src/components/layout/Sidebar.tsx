import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/useAuthStore';
import { isAuthorizedRole } from '@/utils/rbac';
import { AdminRole } from '@/types/auth';
import { ChangePasswordModal } from './ChangePasswordModal';
import { EditProfileModal } from './EditProfileModal';
import {
  Menu,
  Home,
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
  Settings,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

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
    groupName: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: Home,
      },
      {
        title: 'Live Operations',
        path: '/operations/live',
        icon: Radio,
        badge: 'LIVE',
        badgeVariant: 'success',
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER'],
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
    groupName: 'Operations',
    items: [
      {
        title: 'Buses',
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
        title: 'Trips & History',
        path: '/trips',
        icon: Navigation,
      },
    ],
  },
  {
    groupName: 'Safety & Control',
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
    groupName: 'Passenger Service',
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
    ],
  },
  {
    groupName: 'Analytics',
    items: [
      {
        title: 'Buses & Routes',
        path: '/analytics',
        icon: BarChart3,
        allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'ANALYST'],
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Intentional mouse enter/leave with buffer so it doesn't flicker or close prematurely
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setProfileMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setProfileMenuOpen(false);
    }, 250); // 250ms comfortable buffer
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-full bg-white border-r border-slate-200/80 transition-all duration-300 dark:border-slate-800 dark:bg-occ-darkCard',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div
        className={clsx(
          'flex h-16 items-center px-4 border-b border-slate-200/80 dark:border-slate-800',
          collapsed ? 'justify-center px-2' : 'justify-start space-x-3'
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>

        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white select-none">
            CityRide
          </span>
        )}
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {NAVIGATION_CONFIG.map((group, groupIdx) => {
          const visibleItems = group.items.filter(
            (item) => !item.allowedRoles || isAuthorizedRole(user?.role, item.allowedRoles)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.groupName} className={clsx(groupIdx > 0 && 'pt-3')}>
              {!collapsed && (
                <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                      title={collapsed ? item.title : undefined}
                      className={({ isActive }) =>
                        clsx(
                          'group flex items-center rounded-2xl transition-all duration-200 font-medium',
                          collapsed ? 'justify-center p-3' : 'px-3 py-2 text-sm',
                          isActive
                            ? 'bg-blue-50 text-[#4070f4] font-semibold dark:bg-blue-950 dark:text-blue-300'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                        )
                      }
                    >
                      <Icon
                        className={clsx(
                          'h-4 w-4 flex-shrink-0 transition-colors',
                          collapsed ? '' : 'mr-3'
                        )}
                      />

                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge !== undefined && (
                            <span
                              className={clsx(
                                'ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold leading-none',
                                item.badgeVariant === 'danger' && 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
                                item.badgeVariant === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
                                (!item.badgeVariant || item.badgeVariant === 'info') &&
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              )}
                            >
                              {item.badge}
                            </span>
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

      {/* Bottom Section - Profile with Flyout Popover on the Right */}
      <div className="relative mt-auto border-t border-slate-100 p-2.5 dark:border-slate-800/80">
        <div
          ref={profileMenuRef}
          className="group relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Profile Trigger Card (Click or Hover) */}
          <div
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className={clsx(
              'flex items-center rounded-xl p-2 transition-all cursor-pointer select-none',
              'hover:bg-slate-100/80 dark:hover:bg-slate-800',
              profileMenuOpen && 'bg-slate-100 dark:bg-slate-800 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700',
              collapsed ? 'justify-center' : 'space-x-3'
            )}
            title={collapsed ? `${user?.fullName || 'Admin'} (Click to view profile)` : undefined}
          >
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-[#4070f4] ring-1 ring-blue-200/60 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800 shadow-2xs">
              {user?.fullName?.charAt(0) || 'A'}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-occ-darkCard" />
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user?.fullName || 'Shankar Gowda'}
                  </p>
                  <p className="truncate text-[10px] text-slate-400">
                    {user?.email || 'admin@cityride.tumakuru.gov.in'}
                  </p>
                </div>
                <ChevronDown
                  className={clsx(
                    'h-4 w-4 text-slate-400 transition-transform duration-200',
                    profileMenuOpen ? '-rotate-90 text-brand-600 dark:text-brand-400' : 'group-hover:text-slate-600'
                  )}
                />
              </>
            )}
          </div>

          {/* Invisible hover bridge connecting trigger to popover so mouse transition never breaks */}
          {profileMenuOpen && (
            <div className="absolute top-0 bottom-0 left-full w-4 z-40" />
          )}

          {/* Flyout Popover Menu to the RIGHT of the profile card */}
          <div
            className={clsx(
              'absolute bottom-0 left-full ml-1.5 z-50 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-150 origin-bottom-left',
              profileMenuOpen
                ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-x-2 pointer-events-none'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Header info card in popover */}
            <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800/80 mb-1">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-[#4070f4] ring-1 ring-blue-200/60 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {user?.fullName || 'Shankar Gowda'}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {user?.email || 'admin@cityride.tumakuru.gov.in'}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#4070f4] dark:bg-blue-950/60 dark:text-blue-300">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {user?.role?.replace('_', ' ') || 'SUPER ADMIN'}
                </span>
              </div>
            </div>

            {/* Interface Theme Switcher */}
            <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 px-0.5">
                <span>Theme</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/90">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={clsx(
                    'flex items-center justify-center space-x-1.5 rounded-lg py-1.5 text-xs font-semibold transition cursor-pointer',
                    theme === 'light'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  )}
                >
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={clsx(
                    'flex items-center justify-center space-x-1.5 rounded-lg py-1.5 text-xs font-semibold transition cursor-pointer',
                    theme === 'dark'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  )}
                >
                  <Moon className="h-3.5 w-3.5 text-blue-400" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(false);
                  setEditProfileOpen(true);
                }}
                className="group/item flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
              >
                <User className="mr-2.5 h-4 w-4 text-slate-500 transition-transform group-hover/item:scale-110 group-hover/item:text-brand-600 dark:text-slate-400 dark:group-hover/item:text-brand-400" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(false);
                  setChangePasswordOpen(true);
                }}
                className="group/item flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
              >
                <Settings className="mr-2.5 h-4 w-4 text-slate-500 transition-transform group-hover/item:scale-110 group-hover/item:text-slate-900 dark:text-slate-400 dark:group-hover/item:text-white" />
                <span>Account Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />

              <button
                type="button"
                onClick={() => logout()}
                className="group/item flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300 cursor-pointer"
              >
                <LogOut className="mr-2.5 h-4 w-4 text-red-500 transition-transform group-hover/item:scale-110 group-hover/item:text-red-600 dark:text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onChangePasswordClick={() => setChangePasswordOpen(true)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </aside>
  );
};
