import React, { useState } from 'react';
import { useScheduledTrips } from '@/hooks/useDispatch';
import { ScheduledTrip, ScheduledTripStatus } from '@/types/dispatch';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DispatchNavigationTabs } from '../components/DispatchNavigationTabs';
import { TableColumn } from '@/types';
import {
  Navigation,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Bus,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const ScheduledTrips: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { trips, isLoading, generateTrips, isGenerating, updateTripStatus } = useScheduledTrips(selectedDate);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [cancelTripConfirm, setCancelTripConfirm] = useState<ScheduledTrip | null>(null);
  const [generatedCountMsg, setGeneratedCountMsg] = useState<string | null>(null);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleGenerateTrips = async () => {
    const res = await generateTrips(selectedDate);
    setGeneratedCountMsg(`Successfully verified and generated ${res.generatedCount} scheduled trips for ${selectedDate}.`);
    setGenerateModalOpen(false);
  };

  const handleTransitionStatus = async (trip: ScheduledTrip, newStatus: ScheduledTripStatus) => {
    const nowTime = new Date().toTimeString().slice(0, 5);
    await updateTripStatus({
      tripId: trip.id,
      status: newStatus,
      actualTime: newStatus === 'active' ? nowTime : undefined,
    });
  };

  const filteredTrips = statusFilter === 'ALL'
    ? trips
    : trips.filter((t) => t.status === statusFilter.toLowerCase());

  // Metrics
  const totalTrips = trips.length;
  const activeTrips = trips.filter((t) => t.status === 'active').length;
  const completedTrips = trips.filter((t) => t.status === 'completed').length;
  const delayedTrips = trips.filter((t) => t.delayMinutes > 2 || t.status === 'delayed').length;

  const columns: TableColumn<ScheduledTrip>[] = [
    {
      key: 'tripCode',
      header: 'Trip Code',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-white">{row.tripCode}</span>
          <span className="text-[10px] text-slate-400">Duty: {row.dutyCode}</span>
        </div>
      ),
    },
    {
      key: 'routeCode',
      header: 'Route / Line',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-black text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            {row.routeCode}
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
            {row.originStopName.split(' ')[0]} → {row.destinationStopName.split(' ')[0]}
          </span>
        </div>
      ),
    },
    {
      key: 'scheduledDeparture',
      header: 'Departure Time',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs">
          <div className="flex items-center space-x-1.5 font-bold">
            <span className="text-slate-900 dark:text-white">{row.scheduledDeparture}</span>
            {row.actualDeparture && row.actualDeparture !== row.scheduledDeparture && (
              <span className="text-[10px] font-normal text-amber-600 dark:text-amber-400">
                (Act: {row.actualDeparture})
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">Target Arr: {row.scheduledArrival}</span>
        </div>
      ),
    },
    {
      key: 'plateNumber',
      header: 'Bus & Driver',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-brand-800 dark:text-brand-300">{row.plateNumber}</span>
          <span className="text-[10px] text-slate-500">{row.driverName}</span>
        </div>
      ),
    },
    {
      key: 'delayMinutes',
      header: 'Delay Status',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-1">
          {row.delayMinutes > 0 ? (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              +{row.delayMinutes}m Late
            </span>
          ) : (
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              On Schedule
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trip Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} pulse={row.status === 'active'} />,
    },
    {
      key: 'actions',
      header: 'Dispatch Action',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1">
          {row.status === 'scheduled' && (
            <button
              onClick={() => handleTransitionStatus(row, 'ready')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Mark Ready
            </button>
          )}
          {row.status === 'ready' && (
            <button
              onClick={() => handleTransitionStatus(row, 'active')}
              className="inline-flex items-center space-x-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
            >
              <Play className="h-3 w-3" />
              <span>Dispatch Now</span>
            </button>
          )}
          {row.status === 'active' && (
            <button
              onClick={() => handleTransitionStatus(row, 'completed')}
              className="inline-flex items-center space-x-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Complete Trip</span>
            </button>
          )}
          {row.status !== 'completed' && row.status !== 'cancelled' && (
            <button
              onClick={() => setCancelTripConfirm(row)}
              className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 transition"
              title="Cancel Trip"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <DispatchNavigationTabs />

      {/* Alert if newly generated */}
      {generatedCountMsg && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span>{generatedCountMsg}</span>
          <button onClick={() => setGeneratedCountMsg(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Header & Generate Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Scheduled Trips Generation
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            View, generate, and transition daily transit trips from active duty rosters and line timetables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker Bar */}
          <div className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <button
              onClick={handlePrevDay}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none bg-transparent px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none dark:text-white"
            />
            <button
              onClick={handleNextDay}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setGenerateModalOpen(true)}
            className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
          >
            <Sparkles className="h-4 w-4 text-brand-300" />
            <span>Generate Day's Trips</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Day's Trips</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalTrips}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">En-Route Active</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{activeTrips}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-blue-700 uppercase dark:text-blue-400">Completed Trips</span>
          <p className="mt-1 text-2xl font-black text-blue-800 dark:text-blue-300">{completedTrips}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase dark:text-amber-400">Delayed / Deviated</span>
          <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">{delayedTrips}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['ALL', 'ACTIVE', 'READY', 'SCHEDULED', 'COMPLETED', 'DELAYED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              statusFilter === filter
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-occ-darkCard dark:text-slate-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Trips DataTable */}
      <DataTable
        columns={columns}
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search trip code, route, bus plate, driver..."
      />

      {/* Generate Trips Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate Daily Transit Trips"
        description="This will compile all active driver & vehicle duties for the date and synthesize official scheduled trips based on route timetables."
        size="md"
        footer={
          <>
            <button
              onClick={() => setGenerateModalOpen(false)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateTrips}
              disabled={isGenerating}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-brand-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGenerating ? 'Generating...' : `Generate for ${selectedDate}`}</span>
            </button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Target Date: <span className="font-bold text-slate-900 dark:text-white">{selectedDate}</span>
          </p>
          <p>
            The system will scan Tumakuru routes R01–R08 and assign departure codes matching driver shifts.
          </p>
        </div>
      </Modal>

      {/* Cancel Trip Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancelTripConfirm)}
        title="Confirm Scheduled Trip Cancellation"
        message={
          cancelTripConfirm ? (
            <p>
              Are you sure you want to cancel trip{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{cancelTripConfirm.tripCode}</strong> on{' '}
              <strong className="text-slate-900 dark:text-white">Route {cancelTripConfirm.routeCode}</strong> ({cancelTripConfirm.scheduledDeparture})? Passengers will be alerted of the service interruption.
            </p>
          ) : ''
        }
        confirmLabel="Cancel Scheduled Trip"
        variant="danger"
        onConfirm={async () => {
          if (cancelTripConfirm) {
            await handleTransitionStatus(cancelTripConfirm, 'cancelled');
            setCancelTripConfirm(null);
          }
        }}
        onCancel={() => setCancelTripConfirm(null)}
      />
    </div>
  );
};
