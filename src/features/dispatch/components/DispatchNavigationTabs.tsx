import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navigation, GanttChartSquare } from 'lucide-react';
import { clsx } from 'clsx';

export const DispatchNavigationTabs: React.FC = () => {
  const tabs = [
    { title: 'Scheduled Trips', path: '/duties/scheduled-trips', icon: Navigation },
    { title: 'Dispatch Timeline Board', path: '/duties/dispatch-board', icon: GanttChartSquare, badge: 'TODAY' },
  ];

  return (
    <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center space-x-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/5 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{tab.title}</span>
            {tab.badge && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {tab.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};
