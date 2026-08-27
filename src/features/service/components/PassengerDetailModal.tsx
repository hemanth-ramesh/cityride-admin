import React from 'react';
import { PassengerProfile } from '@/types/service';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  User,
  Phone,
  Mail,
  Languages,
  ShieldAlert,
  MapPin,
  GitFork,
  Navigation,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface PassengerDetailModalProps {
  passenger: PassengerProfile;
  onToggleStatus: (id: string, newStatus: PassengerProfile['status']) => Promise<void>;
  onClose: () => void;
}

export const PassengerDetailModal: React.FC<PassengerDetailModalProps> = ({
  passenger,
  onToggleStatus,
  onClose,
}) => {
  const isSuspended = passenger.status === 'suspended';

  return (
    <div className="space-y-5 text-xs">
      {/* Header Profile Strip */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-700 font-bold text-white text-base shadow-sm">
            {passenger.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {passenger.fullName}
              </h3>
              <StatusBadge status={passenger.status} />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{passenger.passengerCode}</span>
          </div>
        </div>

        <button
          onClick={() => onToggleStatus(passenger.id, isSuspended ? 'active' : 'suspended')}
          className={`rounded-xl px-3.5 py-1.5 font-bold transition shadow-xs ${
            isSuspended
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'border border-rose-300 bg-white text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300'
          }`}
        >
          {isSuspended ? 'Reactivate Account' : 'Suspend Account'}
        </button>
      </div>

      {/* Profile & Emergency Contacts */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Contact & App Preferences</span>
          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{passenger.phone}</span>
            </div>
            {passenger.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{passenger.email}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Languages className="h-3.5 w-3.5 text-brand-600" />
              <span>App Interface: <strong>{passenger.preferredLanguage}</strong></span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact Info</span>
          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <User className="h-3.5 w-3.5 text-rose-500" />
              <span>{passenger.emergencyContactName || 'Not configured'}</span>
            </div>
            {passenger.emergencyContactPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-rose-500" />
                <span>{passenger.emergencyContactPhone}</span>
              </div>
            )}
            <span className="text-[10px] text-slate-400 block">Notified instantly during SOS trigger</span>
          </div>
        </div>
      </div>

      {/* Frequent Commute Stops & Corridors */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5 dark:border-slate-800 dark:bg-occ-darkCard">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Frequent Commute Anchors</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 block">Home Station Anchor</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {passenger.homeStopName || 'Unset'}
            </span>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 block">Work / College Anchor</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {passenger.workStopName || 'Unset'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 pt-1">
          <span className="text-[10px] text-slate-400">Favorite Saved Lines:</span>
          {passenger.favoriteRouteCodes.map((r) => (
            <span
              key={r}
              className="rounded bg-brand-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300"
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Recent Transit Boarding History ({passenger.totalTripsLogged} total trips logged)
        </span>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-occ-darkCard">
          {passenger.recentActivity.length === 0 ? (
            <div className="p-4 text-center text-slate-400 italic">No recent transit trips on record.</div>
          ) : (
            passenger.recentActivity.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {act.routeCode}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {act.fromStop} → {act.toStop}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{act.tripDate}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
