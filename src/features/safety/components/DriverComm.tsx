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

  const [activeTab, setActiveTab] = useState<'compose' | 'audit'>('compose');
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
    setActiveTab('audit');
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Tabs Switcher */}
      <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('compose')}
          className={`flex items-center space-x-2 rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'compose'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/5 dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Dispatch Driver Message</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/5 dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Radio className="h-4 w-4 text-emerald-500" />
          <span>Cockpit Communication Audit Trail</span>
          <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-600 dark:text-slate-200">
            {driverMessages.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Compose & Dispatch Form */}
      {activeTab === 'compose' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-occ-darkCard space-y-6 max-w-4xl">
          <div className="flex items-start justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Dispatch Driver Message
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Transmit official dispatch instructions directly to the mobile cockpit terminal of active drivers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Advisory Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="rounded-full border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/70 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition active:scale-95 cursor-pointer shadow-2xs"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Recipient Driver"
                as="search-select"
                required
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                options={drivers.map((d) => ({
                  label: `${d.fullName} (${d.driverCode}) — ${d.assignedPlateNumber || 'Active Bus'}`,
                  value: d.id,
                }))}
                placeholder="Search driver by name, code, or bus..."
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
            </div>

            <FormField
              label="Advisory Subject / Title"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Traffic Diversion at Town Hall Junction"
            />

            <FormField
              label="Message Body / Direct Instructions"
              as="textarea"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Enter specific instructions or situational guidelines for the driver terminal..."
            />

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubject('');
                  setContent('');
                }}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSending || !content.trim() || !subject.trim()}
                className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{isSending ? 'Transmitting to Terminal...' : 'Transmit Message to Cockpit'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Message Stream & Audit Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-occ-darkCard flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100/80 p-5 sm:p-6 dark:border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Cockpit Communication Audit Trail ({driverMessages.length} Messages)
                </h3>
                <p className="text-xs text-slate-400">
                  Full historical telemetry of sent broadcasts, acknowledgments, and driver responses.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                ● Encrypted Radio Channel
              </span>
            </div>
          </div>

          {/* Stream List */}
          <div className="p-5 sm:p-6 space-y-4">
            {driverMessages.length > 0 ? (
              driverMessages.map((msg) => {
                const isEmergency = msg.priority === 'EMERGENCY_BROADCAST';
                const isUrgent = msg.priority === 'URGENT';

                const isNormal = !isEmergency && !isUrgent;

                // Distinct styling based on priority
                const cardConfig = isEmergency
                  ? {
                      container: 'border-l-4 border-l-rose-500 border-rose-200/90 bg-gradient-to-r from-rose-50/70 to-white dark:border-rose-900/60 dark:from-rose-950/25 dark:to-slate-900/40 shadow-xs hover:shadow-md hover:border-rose-300',
                      avatarBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 ring-1 ring-rose-200/80 dark:ring-rose-800/60',
                      badge: 'bg-rose-600 text-white shadow-xs',
                      busBadge: 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100',
                      titleColor: 'text-slate-900 dark:text-white',
                      accentIcon: <Flame className="h-3.5 w-3.5 mr-1 text-white animate-pulse" />,
                      replyBg: 'border-rose-200/80 bg-white/80 dark:border-rose-900/40 dark:bg-slate-900/60',
                      replyLabel: 'text-rose-700 dark:text-rose-400',
                    }
                  : isUrgent
                  ? {
                      container: 'border-l-4 border-l-[#ff681d] border-orange-200/90 bg-gradient-to-r from-orange-50/60 to-white dark:border-orange-900/60 dark:from-orange-950/25 dark:to-slate-900/40 shadow-xs hover:shadow-md hover:border-orange-300',
                      avatarBg: 'bg-orange-100 text-[#ff681d] dark:bg-orange-950 dark:text-orange-300 ring-1 ring-orange-200/80 dark:ring-orange-800/60',
                      badge: 'bg-[#ff681d] text-white shadow-xs',
                      busBadge: 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100',
                      titleColor: 'text-slate-900 dark:text-white',
                      accentIcon: <AlertCircle className="h-3.5 w-3.5 mr-1 text-white" />,
                      replyBg: 'border-orange-200/80 bg-white/80 dark:border-orange-900/40 dark:bg-slate-900/60',
                      replyLabel: 'text-orange-700 dark:text-orange-400',
                    }
                  : {
                      container: 'border-l-4 border-l-[#2563eb] border-blue-200/90 bg-gradient-to-r from-blue-50/50 to-white dark:border-blue-900/60 dark:from-blue-950/20 dark:to-slate-900/40 shadow-xs hover:shadow-md hover:border-blue-300',
                      avatarBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-1 ring-blue-200/80 dark:ring-blue-800/60',
                      badge: 'bg-[#2563eb] text-white shadow-xs',
                      busBadge: 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100',
                      titleColor: 'text-slate-900 dark:text-white',
                      accentIcon: <Radio className="h-3.5 w-3.5 mr-1 text-white" />,
                      replyBg: 'border-blue-200/80 bg-white/80 dark:border-blue-900/40 dark:bg-slate-900/60',
                      replyLabel: 'text-blue-700 dark:text-blue-400',
                    };

                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${cardConfig.container}`}
                  >
                    {/* Top Row: Driver Avatar & Info + Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-2xs ${cardConfig.avatarBg}`}>
                          {msg.driverName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                              To: {msg.driverName}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-2xs ${cardConfig.busBadge}`}>
                              {msg.routeCode} • {msg.vehiclePlate}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            Cockpit Terminal #{msg.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${cardConfig.badge}`}
                        >
                          {cardConfig.accentIcon}
                          {msg.priority.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Message Subject & Content */}
                    <div className="mt-4 pt-1">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {msg.subject}
                      </h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {msg.content}
                      </p>
                    </div>

                    {/* Driver Response Pill / Block */}
                    {msg.driverReply && (
                      <div className={`mt-3.5 rounded-xl border p-3 text-xs ${cardConfig.replyBg}`}>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${cardConfig.replyLabel}`}>
                            Driver Cockpit Response:
                          </span>
                        </div>
                        <p className="italic font-medium text-slate-800 dark:text-slate-200">
                          "{msg.driverReply}"
                        </p>
                      </div>
                    )}

                    {/* Footer Row: Sender Info & Delivery Status */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/60 pt-3 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
                      <span>
                        Sent by <strong className="font-semibold text-slate-700 dark:text-slate-300">{msg.senderName}</strong> ({msg.senderRole}) •{' '}
                        {new Date(msg.sentAt).toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCheck className="h-4 w-4 stroke-[2.2]" />
                        <span className="text-[11px] uppercase tracking-wide">
                          {msg.deliveryStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400">
                <MessageSquare className="mx-auto h-8 w-8 opacity-30 mb-2" />
                <p className="text-xs">No dispatch messages sent yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('compose')}
                  className="mt-3 inline-flex items-center space-x-1 text-xs text-blue-600 hover:underline font-semibold"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Transmit first driver message</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
