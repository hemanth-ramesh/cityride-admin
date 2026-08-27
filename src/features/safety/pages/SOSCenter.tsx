import React, { useState } from 'react';
import { useSafety } from '@/hooks/useSafety';
import { useAuthStore } from '@/stores/useAuthStore';
import { SosAlert, SosWorkflowStage } from '@/types/safety';
import { SafetyNavigationTabs } from '../components/SafetyNavigationTabs';
import { Modal } from '@/components/ui/Modal';
import {
  Flame,
  Phone,
  Radio,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Siren,
  Ambulance,
  Wrench,
  CheckCircle2,
  Sparkles,
  User,
  Bus,
} from 'lucide-react';

export const SOSCenter: React.FC = () => {
  const { sosAlerts, isLoadingSos, triggerSos, acknowledgeSos, dispatchHelp, resolveSos } = useSafety();
  const { user } = useAuthStore();

  const [selectedAlertForAction, setSelectedAlertForAction] = useState<SosAlert | null>(null);
  const [selectedServices, setSelectedServices] = useState<('POLICE' | 'AMBULANCE' | 'FIRE' | 'TOW_TRUCK' | 'DEPOT_CREW')[]>(['POLICE']);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const activeAlerts = sosAlerts.filter((a) => a.stage !== 'RESOLVED' && a.stage !== 'FALSE_ALARM');
  const resolvedAlerts = sosAlerts.filter((a) => a.stage === 'RESOLVED' || a.stage === 'FALSE_ALARM');

  // Trigger Demo Distress Action
  const handleTriggerDemoSos = async () => {
    await triggerSos({
      source: 'PASSENGER_APP',
      routeCode: 'R01',
      plateNumber: 'KA 06 F 8558',
      driverName: 'Rajesh Kumar',
      passengerName: 'Kavitha Rao (App Distress Button)',
      nearestStopName: 'Town Hall Circle',
      latitude: 13.3325,
      longitude: 77.1080,
    });
  };

  // Workflow Handlers
  const handleAcknowledge = async (alert: SosAlert) => {
    setIsProcessing(true);
    await acknowledgeSos({ id: alert.id, adminName: user?.fullName || 'Super Admin' });
    setIsProcessing(false);
    setSelectedAlertForAction(null);
  };

  const handleDispatchHelp = async (alert: SosAlert) => {
    setIsProcessing(true);
    await dispatchHelp({ id: alert.id, services: selectedServices });
    setIsProcessing(false);
    setSelectedAlertForAction(null);
  };

  const handleResolveAlert = async (sosItem: SosAlert) => {
    if (!resolutionNotes.trim()) {
      window.alert('Please enter resolution notes before closing the emergency case.');
      return;
    }
    setIsProcessing(true);
    await resolveSos({
      id: sosItem.id,
      adminName: user?.fullName || 'Super Admin',
      notes: resolutionNotes,
    });
    setResolutionNotes('');
    setIsProcessing(false);
    setSelectedAlertForAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <SafetyNavigationTabs />

      {/* Header & Demo Trigger */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-rose-600 animate-pulse" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Emergency SOS Operations Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            24/7 high-priority distress command console receiving hold-to-activate passenger and driver SOS broadcasts.
          </p>
        </div>

        <button
          onClick={handleTriggerDemoSos}
          className="inline-flex items-center space-x-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-rose-700 animate-bounce"
        >
          <Flame className="h-4 w-4" />
          <span>Simulate Live SOS Trigger</span>
        </button>
      </div>

      {/* Flashing Urgent Active SOS Alert Stack */}
      {activeAlerts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 animate-ping rounded-full bg-rose-600" />
            <h2 className="text-xs font-black tracking-widest text-rose-600 uppercase">
              Active Distress Alerts Requiring Immediate Action ({activeAlerts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {activeAlerts.map((alert) => {
              const isTriggered = alert.stage === 'TRIGGERED';
              const isAcknowledged = alert.stage === 'ACKNOWLEDGED';
              const isDispatched = alert.stage === 'HELP_DISPATCHED';

              return (
                <div
                  key={alert.id}
                  className="rounded-2xl border-2 border-rose-500 bg-rose-50/70 p-5 shadow-xl dark:border-rose-800 dark:bg-rose-950/30"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-lg bg-rose-600 px-2 py-0.5 font-mono text-xs font-black text-white">
                        {alert.alertCode}
                      </span>
                      <span className="rounded-lg bg-slate-900 px-2 py-0.5 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                        {alert.routeCode} • {alert.plateNumber}
                      </span>
                    </div>

                    <span className="rounded-full bg-rose-600 px-3 py-0.5 text-[10px] font-black text-white uppercase animate-pulse">
                      {alert.stage.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Incident Information */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                      <MapPin className="h-4 w-4 text-rose-600 flex-shrink-0" />
                      <span className="font-bold">
                        Near {alert.nearestStopName} ({alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                      <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>
                        Initiated by: <strong>{alert.passengerName || alert.driverName}</strong> ({alert.source.replace(/_/g, ' ')})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Triggered at: {new Date(alert.triggeredAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* Action Bar (Workflow Progression) */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-rose-200 pt-4 dark:border-rose-900/60">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${alert.driverPhone}`}
                        className="inline-flex items-center space-x-1.5 rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call Driver</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isTriggered && (
                        <button
                          onClick={() => handleAcknowledge(alert)}
                          className="rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
                        >
                          Acknowledge Alert
                        </button>
                      )}

                      {isAcknowledged && (
                        <button
                          onClick={() => setSelectedAlertForAction(alert)}
                          className="inline-flex items-center space-x-1.5 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                        >
                          <Siren className="h-3.5 w-3.5" />
                          <span>Dispatch Emergency Help</span>
                        </button>
                      )}

                      {isDispatched && (
                        <button
                          onClick={() => setSelectedAlertForAction(alert)}
                          className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Complete & Resolve</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-300">
                All Corridors Clear • No Active Distress Broadcasts
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Tumakuru smart transit network is operating safely across all 8 corridors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Historical Resolved SOS Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          Resolved Emergency Incidents Archive ({resolvedAlerts.length})
        </h3>
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-occ-darkCard">
          {resolvedAlerts.map((alert) => (
            <div key={alert.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-3">
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {alert.alertCode}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {alert.routeCode} ({alert.plateNumber})
                    </span>
                    <span className="text-xs text-slate-400">• {alert.nearestStopName}</span>
                  </div>
                  {alert.resolutionNotes && (
                    <p className="mt-0.5 text-xs text-slate-500 italic">"{alert.resolutionNotes}"</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span>Resolved by {alert.resolvedBy || 'Super Admin'}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  RESOLVED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Help / Resolve Modal */}
      <Modal
        isOpen={Boolean(selectedAlertForAction)}
        onClose={() => setSelectedAlertForAction(null)}
        title={
          selectedAlertForAction?.stage === 'ACKNOWLEDGED'
            ? `Dispatch Assistance: ${selectedAlertForAction.alertCode}`
            : `Close Emergency Case: ${selectedAlertForAction?.alertCode}`
        }
        description="Select municipal emergency units to dispatch or submit case resolution findings."
        size="md"
        footer={
          <>
            <button
              onClick={() => setSelectedAlertForAction(null)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            {selectedAlertForAction?.stage === 'ACKNOWLEDGED' ? (
              <button
                onClick={() => handleDispatchHelp(selectedAlertForAction)}
                disabled={isProcessing || selectedServices.length === 0}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isProcessing ? 'Dispatching...' : 'Transmit Dispatch Order'}
              </button>
            ) : (
              <button
                onClick={() => selectedAlertForAction && handleResolveAlert(selectedAlertForAction)}
                disabled={isProcessing || !resolutionNotes.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isProcessing ? 'Resolving...' : 'Confirm Case Resolution'}
              </button>
            )}
          </>
        }
      >
        {selectedAlertForAction?.stage === 'ACKNOWLEDGED' ? (
          <div className="space-y-4 text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              Select Responding Services:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'POLICE', label: 'Tumakuru City Police (112)', icon: Siren },
                { id: 'AMBULANCE', label: '108 Emergency Medical', icon: Ambulance },
                { id: 'DEPOT_CREW', label: 'OCC Depot Recovery Crew', icon: Wrench },
                { id: 'TOW_TRUCK', label: 'Heavy Duty Tow Truck', icon: Bus },
              ].map((serv) => {
                const isChecked = selectedServices.includes(serv.id as any);
                const Icon = serv.icon;
                return (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => {
                      if (isChecked) {
                        setSelectedServices(selectedServices.filter((s) => s !== serv.id));
                      } else {
                        setSelectedServices([...selectedServices, serv.id as any]);
                      }
                    }}
                    className={`flex items-center space-x-2 rounded-xl border p-2.5 text-left transition ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-rose-600 flex-shrink-0" />
                    <span className="font-semibold text-xs">{serv.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Official Resolution Report & Incident Notes:
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Passenger assistance rendered. Bus cleared to continue route schedule."
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
