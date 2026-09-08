import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useServiceOperations';
import { NotificationComposer } from '../components/NotificationComposer';
import { ServiceNavigationTabs } from '../components/ServiceNavigationTabs';
import { KPICard } from '@/components/ui/KPICard';
import { Modal } from '@/components/ui/Modal';
import {
  Bell,
  Plus,
  CheckCheck,
  Send,
  Users,
  Radio,
  Clock,
  Sparkles,
  Filter,
} from 'lucide-react';

export const Notifications: React.FC = () => {
  const { notifications, isLoading, sendNotification, isSending } = useNotifications();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSend = async (formData: any) => {
    await sendNotification(formData);
    setModalOpen(false);
    setSuccessToast(`Broadcast "${formData.title}" dispatched successfully.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Metrics
  const totalBroadcasts = notifications.length;
  const totalDelivered = notifications.reduce((acc, n) => acc + (n.deliverySuccessCount || 0), 0);
  const delayAlertsCount = notifications.filter((n) => n.category === 'SERVICE_DELAY').length;
  const generalAlertsCount = notifications.filter(
    (n) => n.category === 'GENERAL_ANNOUNCEMENT' || n.category === 'ROUTE_DIVERSION'
  ).length;

  const filteredNotifications = filterCategory === 'ALL'
    ? notifications
    : notifications.filter((n) => n.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <ServiceNavigationTabs />

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      {/* Toast Alert */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="h-6 w-6 rounded-full hover:bg-emerald-100 flex items-center justify-center text-xs font-bold transition">✕</button>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TOTAL BROADCASTS"
          value={totalBroadcasts}
          status="dark"
          icon={Radio}
        />
        <KPICard
          title="TOTAL RECIPIENTS DELIVERED"
          value={totalDelivered.toLocaleString()}
          status="teal"
          icon={CheckCheck}
        />
        <KPICard
          title="SERVICE DELAY ADVISORIES"
          value={delayAlertsCount}
          status="orange"
          icon={Clock}
        />
        <KPICard
          title="DIVERSIONS & GENERAL NOTICES"
          value={generalAlertsCount}
          status="info"
          icon={Bell}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
          {[
            { label: 'All Notices', value: 'ALL' },
            { label: 'Service Delays', value: 'SERVICE_DELAY' },
            { label: 'Route Diversions', value: 'ROUTE_DIVERSION' },
            { label: 'Weather Alerts', value: 'WEATHER_ALERT' },
            { label: 'Announcements', value: 'GENERAL_ANNOUNCEMENT' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterCategory(tab.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                filterCategory === tab.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium px-1">
          {filteredNotifications.length} notice{filteredNotifications.length !== 1 ? 's' : ''} shown
        </span>
      </div>

      {/* Broadcast History Stream */}
      <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:divide-slate-800/80 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No broadcast notices found for the selected filter.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div key={n.id} className="p-5 space-y-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60">
                    {n.category.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {n.title}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Target: {n.targetRouteCode ? `Route ${n.targetRouteCode}` : n.targetType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCheck className="h-4 w-4" />
                  <span>{n.deliverySuccessCount} / {n.estimatedRecipients} delivered</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {n.message}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <span>By: {n.senderName} ({n.senderRole})</span>
                <span>{new Date(n.sentAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose Broadcast Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Compose Public Push Broadcast"
        size="lg"
      >
        <NotificationComposer
          onSendNotification={handleSend}
          onCancel={() => setModalOpen(false)}
          isSending={isSending}
        />
      </Modal>
    </div>
  );
};
