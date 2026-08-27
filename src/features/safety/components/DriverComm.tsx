import React, { useState } from 'react';
import { useSafety } from '@/hooks/useSafety';
import { useDrivers } from '@/hooks/useMasterData';
import { useAuthStore } from '@/stores/useAuthStore';
import { DriverMessage, MessagePriority } from '@/types/safety';
import { FormField } from '@/components/ui/FormField';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCheck,
  Radio,
  AlertCircle,
  Flame,
  FileText,
  Sparkles,
} from 'lucide-react';

const MESSAGE_TEMPLATES = [
  {
    title: 'Traffic Diversion',
    priority: 'URGENT' as MessagePriority,
    subject: 'Route Diversion Advisory',
    content: 'Traffic congestion reported along main sector. Proceed via alternate ring road bypass.',
  },
  {
    title: 'Schedule Spacing',
    priority: 'NORMAL' as MessagePriority,
    subject: 'Headway Spacing Adjustment',
    content: 'Please adjust spacing to maintain 10-minute headway interval with preceding transit unit.',
  },
  {
    title: 'Depot Recall',
    priority: 'URGENT' as MessagePriority,
    subject: 'Depot Return for Inspection',
    content: 'Complete current run to terminal and report to Central Depot 1 for scheduled preventive check.',
  },
  {
    title: 'Emergency Alert',
    priority: 'EMERGENCY_BROADCAST' as MessagePriority,
    subject: 'Emergency Protocol Broadcast',
    content: 'OCC Alert: Maintain vigilance, monitor passenger safety, and hold position if instructed.',
  },
];

export const DriverComm: React.FC = () => {
  const { driverMessages, sendMessage } = useSafety();
  const { drivers } = useDrivers();
  const { user } = useAuthStore();

  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || 'drv-001');
  const [priority, setPriority] = useState<MessagePriority>('NORMAL');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  const handleApplyTemplate = (tmpl: (typeof MESSAGE_TEMPLATES)[0]) => {
    setPriority(tmpl.priority);
    setSubject(tmpl.subject);
    setContent(tmpl.content);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !subject.trim() || !selectedDriver) return;

    setIsSending(true);
    await sendMessage({
      senderName: user?.fullName || 'OCC Dispatcher',
      senderRole: user?.role || 'DISPATCHER',
      driverId: selectedDriver.id,
      driverName: selectedDriver.fullName,
      vehiclePlate: selectedDriver.assignedPlateNumber || 'KA 06 F 8558',
      routeCode: selectedDriver.assignedRouteCode || 'R01',
      priority,
      subject,
      content,
    });

    setSubject('');
    setContent('');
    setIsSending(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Compose Message Form (5 cols) */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard space-y-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-brand-700 dark:text-brand-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Dispatch Driver Message
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Send direct broadcast instructions to the mobile cockpit terminal of active drivers.
        </p>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400">Quick Advisory Templates:</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MESSAGE_TEMPLATES.map((tmpl) => (
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

        <form onSubmit={handleSendMessage} className="space-y-4">
          <FormField
            label="Recipient Driver"
            as="select"
            required
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            options={drivers.map((d) => ({
              label: `${d.fullName} (${d.driverCode}) — ${d.assignedPlateNumber || 'Active Bus'}`,
              value: d.id,
            }))}
            icon={User}
          />

          <FormField
            label="Message Urgency / Priority"
            as="select"
            required
            value={priority}
            onChange={(e) => setPriority(e.target.value as MessagePriority)}
            options={[
              { label: 'Normal (Standard Advisory)', value: 'NORMAL' },
              { label: 'Urgent (Action Required Immediately)', value: 'URGENT' },
              { label: 'Emergency Broadcast (Cockpit Alarm)', value: 'EMERGENCY_BROADCAST' },
            ]}
          />

          <FormField
            label="Advisory Subject / Title"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Traffic Diversion at Town Hall"
          />

          <FormField
            label="Message Body / Direct Instructions"
            as="textarea"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Enter instructions for driver terminal..."
          />

          <button
            type="submit"
            disabled={isSending || !content.trim()}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-brand-700 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isSending ? 'Transmitting to Terminal...' : 'Transmit Message to Cockpit'}</span>
          </button>
        </form>
      </div>

      {/* Right: Message Stream & Audit Trail (7 cols) */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-occ-darkCard flex flex-col h-[580px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase dark:text-white">
              Cockpit Communication Audit Trail ({driverMessages.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Encrypted Terminal Protocol</span>
        </div>

        {/* Stream List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-3 space-y-3 dark:divide-slate-800/60">
          {driverMessages.map((msg) => {
            const isEmergency = msg.priority === 'EMERGENCY_BROADCAST';
            const isUrgent = msg.priority === 'URGENT';

            return (
              <div
                key={msg.id}
                className={`rounded-xl border p-3.5 transition ${
                  isEmergency
                    ? 'border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
                    : isUrgent
                    ? 'border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50'
                }`}
              >
                {/* Top Row: Driver & Priority Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      To: {msg.driverName}
                    </span>
                    <span className="rounded bg-brand-100 px-1.5 py-0.2 text-[10px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                      {msg.routeCode} • {msg.vehiclePlate}
                    </span>
                  </div>

                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      isEmergency
                        ? 'bg-rose-600 text-white'
                        : isUrgent
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {msg.priority.replace('_', ' ')}
                  </span>
                </div>

                {/* Subject & Content */}
                <div className="mt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {msg.subject}
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {msg.content}
                  </p>
                </div>

                {/* Driver Reply if present */}
                {msg.driverReply && (
                  <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 block">
                      Driver Response:
                    </span>
                    <p className="italic">{msg.driverReply}</p>
                  </div>
                )}

                {/* Footer Timestamp & Delivery Status */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
                  <span>From: {msg.senderName} ({msg.senderRole}) • {new Date(msg.sentAt).toLocaleTimeString()}</span>
                  <div className="flex items-center space-x-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>{msg.deliveryStatus.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
