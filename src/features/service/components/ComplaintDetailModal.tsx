import React, { useState } from 'react';
import { PassengerComplaint, ComplaintStatus } from '@/types/service';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FormField } from '@/components/ui/FormField';
import {
  MessageSquareWarning,
  Phone,
  Clock,
  GitFork,
  Bus,
  CheckCircle2,
  Send,
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: PassengerComplaint;
  onAssign?: (id: string, officer: string, depot: string) => Promise<void>;
  onResolve: (id: string, response: string) => Promise<void>;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onResolve,
  onClose,
}) => {
  const [officialResponse, setOfficialResponse] = useState(complaint.officialResponse || '');
  const [isProcessing, setIsProcessing] = useState(false);

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

      {/* Response Form */}
      {complaint.status !== 'RESOLVED' ? (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/50">
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Resolution Workflow Actions
          </span>

          <FormField
            label="Official Resolution Statement (Sent to Citizen App)"
            as="textarea"
            required
            rows={3}
            value={officialResponse}
            onChange={(e) => setOfficialResponse(e.target.value)}
            placeholder="Enter official resolution response..."
          />

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleResolve}
              disabled={isProcessing || !officialResponse.trim()}
              className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all"
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
