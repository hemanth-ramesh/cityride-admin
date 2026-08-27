import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, AlertTriangle, MessageSquare, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

export const SafetyNavigationTabs: React.FC = () => {
  const tabs = [
    { title: 'Emergency SOS Center', path: '/emergency', icon: Flame, badge: '24/7 SOS' },
    { title: 'Incident Management Desk', path: '/incidents', icon: AlertTriangle },
    { title: 'Driver Terminal Communicator', path: '/safety/messaging', icon: MessageSquare },
  ];

  return (
    <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 dark:border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition',
                isActive
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-occ-darkCard dark:text-slate-300 dark:hover:bg-slate-800'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{tab.title}</span>
            {tab.badge && (
              <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[9px] font-black text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                {tab.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};
