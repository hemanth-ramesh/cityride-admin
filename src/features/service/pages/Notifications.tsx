import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useServiceOperations';
import { NotificationComposer } from '../components/NotificationComposer';
import { ServiceNavigationTabs } from '../components/ServiceNavigationTabs';
import {
  Bell,
  CheckCheck,
  Clock,
  Users,
  Radio,
  Sparkles,
} from 'lucide-react';

export const Notifications: React.FC = () => {
  const { notifications, isLoading, sendNotification, isSending } = useNotifications();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSend = async (formData: any) => {
    await sendNotification(formData);
    setSuccessToast(`Push broadcast "${formData.title}" transmitted successfully.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <ServiceNavigationTabs />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Notification & Passenger Broadcast Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Publish real-time push advisories for service delays, line diversions, weather warnings, and emergency bulletins.
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {successToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCheck className="h-4 w-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Broadcast Composer */}
      <NotificationComposer
        onSendNotification={handleSend}
        isSending={isSending}
      />

      {/* Sent History Stream */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          Broadcast Dispatch Audit Trail ({notifications.length} notices transmitted)
        </h3>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-occ-darkCard">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-brand-100 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                    {n.category.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {n.title}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Target: {n.targetRouteCode ? `Route ${n.targetRouteCode}` : n.targetType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>{n.deliverySuccessCount} / {n.estimatedRecipients} delivered</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {n.message}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>By: {n.senderName} ({n.senderRole})</span>
                <span>{new Date(n.sentAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
