import React from 'react';
import { IncidentReport, IncidentSeverity, IncidentStatus } from '@/types/safety';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  AlertTriangle,
  Clock,
  MapPin,
  GitFork,
  Bus,
  User,
  CheckCircle2,
  Edit2,
  FileText,
  ShieldAlert,
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: IncidentReport | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (incident: IncidentReport) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!incident) return null;

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="rounded-full bg-rose-600 px-3 py-0.5 text-xs font-black text-white uppercase shadow-xs">Critical</span>;
      case 'HIGH':
        return <span className="rounded-full bg-orange-500 px-3 py-0.5 text-xs font-black text-white uppercase shadow-xs">High</span>;
      case 'MEDIUM':
        return <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">Medium</span>;
      case 'LOW':
        return <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">Low</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Incident Details: ${incident.incidentCode}`}
      size="xl"
    >
      <div className="space-y-5 text-xs">
        {/* Header Profile Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60 shadow-xs">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                {incident.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {incident.category.replace(/_/g, ' ')}
                </span>
                {getSeverityBadge(incident.severity)}
                <StatusBadge
                  status={
                    incident.status === 'RESOLVED'
                      ? 'active'
                      : incident.status === 'ACTION_TAKEN'
                      ? 'maintenance'
                      : incident.status === 'INVESTIGATING'
                      ? 'on_duty'
                      : 'inactive'
                  }
                  label={incident.status.replace(/_/g, ' ')}
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center space-x-2 rounded-xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-xs dark:bg-slate-800 dark:border-slate-700 sm:self-center">
            <Clock className="h-4 w-4 text-slate-400" />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Reported</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {new Date(incident.reportedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Situation Description */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
            <FileText className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Detailed Situation Description
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
            {incident.description}
          </p>
        </div>

        {/* Grid Context: Corridor, Vehicle, Driver, Location */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <GitFork className="h-3.5 w-3.5 text-brand-600" />
              <span className="text-[10px] font-bold uppercase">Corridor Route</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
              {incident.routeCode || 'Network-Wide'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <Bus className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-bold uppercase">Involved Bus</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block truncate">
              {incident.plateNumber || 'None / Not Bus Specific'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <User className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase">Reporting Driver</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
              {incident.driverName || 'Officer Logged'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <MapPin className="h-3.5 w-3.5 text-rose-600" />
              <span className="text-[10px] font-bold uppercase">Location Landmark</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
              {incident.locationLandmark}
            </span>
          </div>
        </div>

        {/* Action Taken / Resolution Plan */}
        {incident.actionTaken && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Action Taken / Resolution Plan
              </span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {incident.actionTaken}
            </p>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
            <span>Incident ID:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {incident.incidentCode}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(incident);
                }}
                className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition active:scale-95 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-brand-600" />
                <span>Edit Incident</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
