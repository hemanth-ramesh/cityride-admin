import React, { useState } from 'react';
import { PushNotification, NotificationCategory, NotificationTargetType } from '@/types/service';
import { FormField } from '@/components/ui/FormField';
import { useRoutes } from '@/hooks/useMasterData';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  Bell,
  Send,
  Users,
  GitFork,
  Radio,
  Clock,
  Sparkles,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface NotificationComposerProps {
  onSendNotification: (data: any) => Promise<void>;
  isSending?: boolean;
}

const BROADCAST_TEMPLATES = [
  {
    title: 'Rain / Weather Delay',
    category: 'SERVICE_DELAY' as NotificationCategory,
    targetType: 'SPECIFIC_ROUTE' as NotificationTargetType,
    targetRouteCode: 'R04',
    notifTitle: 'Route R04 Delay Notice',
    message: 'Buses on Route R04 are experiencing 12-15 minute delays due to heavy water-logging near Melekote KIADB road.',
  },
  {
    title: 'Route Diversion',
    category: 'ROUTE_DIVERSION' as NotificationCategory,
    targetType: 'SPECIFIC_ROUTE' as NotificationTargetType,
    targetRouteCode: 'R01',
    notifTitle: 'Route R01 Procession Diversion',
    message: 'Due to Town Hall festival event, Route R01 will detour via Ashoka Road. Next 3 departures affected.',
  },
  {
    title: 'Peak Feeder Boost',
    category: 'GENERAL_ANNOUNCEMENT' as NotificationCategory,
    targetType: 'GLOBAL_ALL_PASSENGERS' as NotificationTargetType,
    notifTitle: 'Additional Evening Feeders Active',
    message: 'CITYRIDE OCC has activated 2 standby feeder units on student corridors R01 and R03 for peak evening commute.',
  },
];

export const NotificationComposer: React.FC<NotificationComposerProps> = ({
  onSendNotification,
  isSending = false,
}) => {
  const { routes } = useRoutes();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('SERVICE_DELAY');
  const [targetType, setTargetType] = useState<NotificationTargetType>('SPECIFIC_ROUTE');
  const [targetRouteCode, setTargetRouteCode] = useState('R01');

  const handleApplyTemplate = (tmpl: (typeof BROADCAST_TEMPLATES)[0]) => {
    setCategory(tmpl.category);
    setTargetType(tmpl.targetType);
    if (tmpl.targetRouteCode) setTargetRouteCode(tmpl.targetRouteCode);
    setTitle(tmpl.notifTitle);
    setMessage(tmpl.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await onSendNotification({
      senderName: user?.fullName || 'OCC Operations Desk',
      senderRole: user?.role || 'OPERATIONS_MANAGER',
      title,
      message,
      category,
      targetType,
      targetRouteCode: targetType === 'SPECIFIC_ROUTE' ? targetRouteCode : undefined,
    });

    setTitle('');
    setMessage('');
  };

  const estimatedRecipients =
    targetType === 'GLOBAL_ALL_PASSENGERS'
      ? 2450
      : targetType === 'ALL_ACTIVE_DRIVERS'
      ? 8
      : 420;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-brand-700 dark:text-brand-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Compose Public Push Broadcast
          </h2>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
          ~{estimatedRecipients.toLocaleString()} Estimated Devices Targeted
        </span>
      </div>
      <p className="text-xs text-slate-500">
        Deliver instant push notifications to citizen passenger apps and driver terminals for delays, diversions, or emergencies.
      </p>

      {/* Preset Chips */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400">Quick Advisory Templates:</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {BROADCAST_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.title}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-brand-500 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="Notice Category"
            as="select"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as NotificationCategory)}
            options={[
              { label: 'Service Delay Alert', value: 'SERVICE_DELAY' },
              { label: 'Route Diversion Notice', value: 'ROUTE_DIVERSION' },
              { label: 'Weather / Rain Advisory', value: 'WEATHER_ALERT' },
              { label: 'System Maintenance Notice', value: 'SYSTEM_MAINTENANCE' },
              { label: 'Emergency Safety Bulletin', value: 'EMERGENCY_BULLETIN' },
              { label: 'General Transit Announcement', value: 'GENERAL_ANNOUNCEMENT' },
            ]}
          />

          <FormField
            label="Target Audience Scope"
            as="select"
            required
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as NotificationTargetType)}
            options={[
              { label: 'Specific Corridor Riders', value: 'SPECIFIC_ROUTE' },
              { label: 'All Registered Passengers (Global)', value: 'GLOBAL_ALL_PASSENGERS' },
              { label: 'All Active Duty Drivers', value: 'ALL_ACTIVE_DRIVERS' },
            ]}
            icon={Users}
          />

          {targetType === 'SPECIFIC_ROUTE' && (
            <FormField
              label="Select Route Corridor"
              as="select"
              required
              value={targetRouteCode}
              onChange={(e) => setTargetRouteCode(e.target.value)}
              options={routes.map((r) => ({
                label: `${r.routeCode} — ${r.routeName.split('↔')[0].trim()}`,
                value: r.routeCode,
              }))}
              icon={GitFork}
            />
          )}
        </div>

        <FormField
          label="Push Notification Title / Headline"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Route R04 Delay: Melekote Corridor"
        />

        <FormField
          label="Broadcast Message Content"
          as="textarea"
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter passenger push notice text..."
        />

        <button
          type="submit"
          disabled={isSending || !title.trim() || !message.trim()}
          className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-brand-700 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>{isSending ? 'Transmitting Broadcast...' : 'Broadcast Push Notification'}</span>
        </button>
      </form>
    </div>
  );
};
