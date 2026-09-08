import React, { useState } from 'react';
import { useScheduledTrips } from '@/hooks/useDispatch';
import { ScheduledTrip, ScheduledTripStatus } from '@/types/dispatch';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DispatchNavigationTabs } from '../components/DispatchNavigationTabs';
import { TableColumn } from '@/types';
import { KPICard } from '@/components/ui/KPICard';
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
      header: 'Vehicle No & Driver',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{row.plateNumber}</span>
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
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              +{row.delayMinutes}m Late
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
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
      header: 'Operational Control',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          {row.status === 'scheduled' && (
            <button
              onClick={() => handleTransitionStatus(row, 'ready')}
              className="inline-flex items-center space-x-1 rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition active:scale-95"
            >
              <span>Ready</span>
            </button>
          )}
          {row.status === 'ready' && (
            <button
              onClick={() => handleTransitionStatus(row, 'active')}
              className="inline-flex items-center space-x-1 rounded-full bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition active:scale-95"
            >
              <Play className="h-3 w-3" />
              <span>Dispatch</span>
            </button>
          )}
          {row.status === 'active' && (
            <button
              onClick={() => handleTransitionStatus(row, 'completed')}
              className="inline-flex items-center space-x-1 rounded-full bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition active:scale-95"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Complete</span>
            </button>
          )}
          {row.status !== 'completed' && row.status !== 'cancelled' && (
            <button
              onClick={() => setCancelTripConfirm(row)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 transition-all active:scale-95"
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
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span>{generatedCountMsg}</span>
          <button onClick={() => setGeneratedCountMsg(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Header & Generate Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Navigation className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Scheduled Trips Generation
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            View, generate, and transition daily transit trips from active duty rosters and line timetables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Picker Bar */}
          <div className="flex items-center space-x-1 rounded-full border border-slate-200/80 bg-slate-100/90 p-1 shadow-xs dark:border-slate-700/80 dark:bg-slate-800/90 backdrop-blur-md">
            <button
              onClick={handlePrevDay}
              className="h-7 w-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-slate-700 transition"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none bg-transparent px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none dark:text-white"
            />
            <button
              onClick={handleNextDay}
              className="h-7 w-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-slate-700 transition"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setGenerateModalOpen(true)}
            className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-blue-200" />
            <span>Generate Day's Trips</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TOTAL DAY'S TRIPS"
          value={totalTrips}
          status="dark"
          icon={Bus}
        />
        <KPICard
          title="EN-ROUTE ACTIVE"
          value={activeTrips}
          status="teal"
          icon={Play}
        />
        <KPICard
          title="COMPLETED TRIPS"
          value={completedTrips}
          status="info"
          icon={CheckCircle2}
        />
        <KPICard
          title="DELAYED / DEVIATED"
          value={delayedTrips}
          status="warning"
          icon={AlertTriangle}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
        {['ALL', 'ACTIVE', 'READY', 'SCHEDULED', 'COMPLETED', 'DELAYED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              statusFilter === filter
                ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/5 dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
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
        size="md"
        footer={
          <>
            <button
              onClick={() => setGenerateModalOpen(false)}
              className="rounded-full bg-slate-100 hover:bg-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateTrips}
              disabled={isGenerating}
              className="inline-flex items-center space-x-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-50"
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
