import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore, MOCK_ADMIN_USERS } from '@/stores/useAuthStore';
import { AdminRole } from '@/types/auth';
import { ROLE_LABELS, ROLE_BADGE_STYLES } from '@/utils/rbac';
import { clsx } from 'clsx';
import {
  Bell,
  Search,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Radio,
  ExternalLink,
  ChevronRight,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { user, logout, switchRole } = useAuthStore();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate Breadcrumbs from location path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: formatted, url };
  });

  const roleStyle = user?.role ? ROLE_BADGE_STYLES[user.role] : ROLE_BADGE_STYLES.OPERATIONS_MANAGER;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-occ-darkCard/90 sm:px-6">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link
            to="/dashboard"
            className="transition hover:text-brand-700 dark:hover:text-brand-400"
          >
            OCC
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-bold text-slate-900 dark:text-white">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.url}
                  className="transition hover:text-brand-700 dark:hover:text-brand-400"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Live Telemetry Status, Role Switcher, Notifications & Profile */}
      <div className="flex items-center space-x-3">
        {/* Real-time Status Badge */}
        <div className="hidden items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 md:inline-flex dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Telemetry Stream Active</span>
        </div>

        {/* Live Role Switcher (Crucial for testing all 6 RBAC roles) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className={clsx(
              'flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-sm transition',
              roleStyle.bg,
              roleStyle.text,
              roleStyle.border
            )}
            title="Click to test different RBAC roles"
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Role:</span>
            <span>{user?.role ? ROLE_LABELS[user.role] : 'Guest'}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-occ-darkCard">
              <div className="border-b border-slate-100 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase dark:border-slate-800">
                Switch Role Simulation (RBAC Test)
              </div>
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setRoleSwitcherOpen(false);
                  }}
                  className={clsx(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800',
                    user?.role === r
                      ? 'font-bold text-brand-700 dark:text-brand-400'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  <span>{ROLE_LABELS[r]}</span>
                  {user?.role === r && (
                    <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Trigger */}
        <Link
          to="/notifications"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          title="Operational Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-occ-darkCard" />
        </Link>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 rounded-xl p-1 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden flex-col md:flex">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {user?.fullName || 'Transit Officer'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {user?.email || 'admin@cityride.in'}
              </span>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-occ-darkCard">
              <div className="border-b border-slate-100 p-2 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {user?.fullName}
                </p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Profile & Settings</span>
                </Link>
                <Link
                  to="/operations/live"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Radio className="h-4 w-4 text-emerald-500" />
                  <span>Live Operations</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
