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

interface NotificationComposerProps {
  onSendNotification: (data: any) => Promise<void>;
  onCancel?: () => void;
  isSending?: boolean;
}

export const NotificationComposer: React.FC<NotificationComposerProps> = ({
  onSendNotification,
  onCancel,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Preset Chips */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Quick Templates
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {BROADCAST_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.title}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="rounded-full bg-slate-100/90 border border-slate-200/60 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>

      {targetType === 'SPECIFIC_ROUTE' && (
        <FormField
          label="Select Route Corridor"
          as="search-select"
          required
          value={targetRouteCode}
          onChange={(e) => setTargetRouteCode(e.target.value)}
          options={routes.map((r) => ({
            label: `${r.routeCode} — ${r.routeName.split('↔')[0].trim()}`,
            value: r.routeCode,
          }))}
          placeholder="Search route corridor..."
          icon={GitFork}
        />
      )}

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

      <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSending}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition active:scale-95"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSending || !title.trim() || !message.trim()}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isSending ? 'Transmitting...' : 'Send Broadcast'}</span>
        </button>
      </div>
    </form>
  );
};
