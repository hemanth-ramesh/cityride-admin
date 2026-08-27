import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Navigation, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export const AnalyticsNavigationTabs: React.FC = () => {
  const tabs = [
    { title: 'Performance Analytics Dashboard', path: '/analytics', icon: BarChart3, exact: true },
    { title: 'Trip History & GPS Replay', path: '/trips', icon: Navigation },
  ];

  return (
    <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 dark:border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.exact}
            className={({ isActive }) =>
              clsx(
                'flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition',
                isActive
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-occ-darkCard dark:text-slate-300 dark:hover:bg-slate-800'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{tab.title}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
