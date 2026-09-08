import React from 'react';
import { BusStop } from '@/types/masterData';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  MapPin,
  Compass,
  Navigation,
  GitFork,
  Radio,
  Edit2,
} from 'lucide-react';

interface StopDetailModalProps {
  stop: BusStop | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (stop: BusStop) => void;
}

export const StopDetailModal: React.FC<StopDetailModalProps> = ({
  stop,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!stop) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bus Stop Details"
      size="lg"
    >
      <div className="space-y-5 text-xs">
        {/* Header Profile Strip */}
        <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-start space-x-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white shadow-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black text-brand-700 dark:text-brand-400">
                  {stop.stopCode}
                </span>
                <StatusBadge
                  status={stop.isActive ? 'active' : 'inactive'}
                  label={stop.isActive ? 'Active' : 'Closed'}
                />
              </div>
              <h3 className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
                {stop.name}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                {stop.kannadaName}
              </p>
            </div>
          </div>

          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(stop);
              }}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Stop</span>
            </button>
          )}
        </div>

        {/* Location & Landmark Information */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-occ-darkCard">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <Navigation className="h-4 w-4 text-brand-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Area / Neighborhood</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {stop.area || 'Tumakuru City'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-occ-darkCard">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <Compass className="h-4 w-4 text-brand-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Key Landmark</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {stop.landmark || 'No landmark specified'}
            </p>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-occ-darkCard">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              <Radio className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">GPS Coordinates</span>
            </div>
            <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Connected Routes Served */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-occ-darkCard space-y-2">
          <div className="flex items-center space-x-2 text-slate-400">
            <GitFork className="h-4 w-4 text-brand-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Connected Routes Served ({stop.routeIds?.length || 0})
            </span>
          </div>

          {stop.routeIds && stop.routeIds.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {stop.routeIds.map((rId) => (
                <span
                  key={rId}
                  className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-black text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                >
                  {rId}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No assigned corridors. Feeder / Standby stop.</p>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end space-x-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
