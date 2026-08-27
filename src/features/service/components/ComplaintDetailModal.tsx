import React, { useState } from 'react';
import { PassengerComplaint, ComplaintStatus } from '@/types/service';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FormField } from '@/components/ui/FormField';
import {
  MessageSquareWarning,
  User,
  Phone,
  Clock,
  GitFork,
  Bus,
  CheckCircle2,
  Send,
  Building2,
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: PassengerComplaint;
  onAssign: (id: string, officer: string, depot: string) => Promise<void>;
  onResolve: (id: string, response: string) => Promise<void>;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onAssign,
  onResolve,
  onClose,
}) => {
  const [assignedOfficer, setAssignedOfficer] = useState(complaint.assignedOfficer || 'Support Admin Priya');
  const [assignedDepot, setAssignedDepot] = useState(complaint.assignedDepot || 'Central Depot 1');
  const [officialResponse, setOfficialResponse] = useState(complaint.officialResponse || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAssign = async () => {
    setIsProcessing(true);
    await onAssign(complaint.id, assignedOfficer, assignedDepot);
    setIsProcessing(false);
  };

  const handleResolve = async () => {
    if (!officialResponse.trim()) {
      alert('Please enter an official response for the passenger before resolving.');
      return;
    }
    setIsProcessing(true);
    await onResolve(complaint.id, officialResponse);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Header Info */}
      <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-black text-brand-700 dark:text-brand-400">
              {complaint.ticketCode}
            </span>
            <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold dark:bg-slate-800">
              {complaint.category.replace(/_/g, ' ')}
            </span>
            <StatusBadge status={complaint.status === 'RESOLVED' ? 'active' : 'maintenance'} label={complaint.status} />
          </div>
          <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
            {complaint.subject}
          </h3>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          {new Date(complaint.reportedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1 dark:border-slate-800 dark:bg-occ-darkCard">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Passenger Grievance Statement</span>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {complaint.description}
        </p>

        {/* Transit context */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800">
          <span>Rider: <strong>{complaint.passengerName}</strong> ({complaint.passengerPhone})</span>
          {complaint.routeCode && <span>Route: <strong>{complaint.routeCode}</strong></span>}
          {complaint.vehiclePlate && <span>Bus: <strong>{complaint.vehiclePlate}</strong></span>}
        </div>
      </div>

      {/* Assignment & Response Form */}
      {complaint.status !== 'RESOLVED' ? (
        <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 space-y-4 dark:border-brand-900/60 dark:bg-brand-950/20">
          <span className="text-xs font-bold text-brand-950 dark:text-brand-300 block">
            Resolution Workflow Actions
          </span>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="Assign Grievance Officer"
              as="select"
              value={assignedOfficer}
              onChange={(e) => setAssignedOfficer(e.target.value)}
              options={[
                { label: 'Support Admin Priya', value: 'Support Admin Priya' },
                { label: 'Fleet Manager Sunder', value: 'Fleet Manager Sunder' },
                { label: 'Operations Manager', value: 'Operations Manager' },
                { label: 'Dispatcher Ramesh', value: 'Dispatcher Ramesh' },
              ]}
              icon={User}
            />

            <FormField
              label="Assigned Depot"
              as="select"
              value={assignedDepot}
              onChange={(e) => setAssignedDepot(e.target.value)}
              options={[
                { label: 'Central Depot 1 (Tumakuru Town)', value: 'Central Depot 1' },
                { label: 'Industrial Depot 2 (Melekote)', value: 'Industrial Depot 2' },
              ]}
              icon={Building2}
            />
          </div>

          <FormField
            label="Official Resolution Statement (Sent to Citizen App)"
            as="textarea"
            required
            rows={3}
            value={officialResponse}
            onChange={(e) => setOfficialResponse(e.target.value)}
            placeholder="e.g. Schedule deviation investigated. Depot supervisor notified to ensure timely departure..."
          />

          <div className="flex items-center justify-end space-x-2 pt-2">
            {complaint.status === 'OPEN' && (
              <button
                type="button"
                onClick={handleAssign}
                disabled={isProcessing}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {isProcessing ? 'Assigning...' : 'Assign to Officer'}
              </button>
            )}

            <button
              type="button"
              onClick={handleResolve}
              disabled={isProcessing || !officialResponse.trim()}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isProcessing ? 'Resolving...' : 'Submit Resolution & Close Ticket'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2 dark:border-emerald-950 dark:bg-emerald-950/20">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-emerald-900 dark:text-emerald-300">
              Resolved by {complaint.resolvedBy || 'Support Officer'} on {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleDateString() : 'Today'}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 italic">
            "{complaint.officialResponse}"
          </p>
        </div>
      )}
    </div>
  );
};
