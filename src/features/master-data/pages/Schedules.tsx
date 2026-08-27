import React, { useState } from 'react';
import { useSchedules, useRoutes } from '@/hooks/useMasterData';
import { RouteSchedule } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ScheduleForm } from '../components/ScheduleForm';
import { TableColumn } from '@/types';
import {
  Clock,
  Plus,
  Edit2,
  Calendar,
  Bus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GitFork,
} from 'lucide-react';

export const Schedules: React.FC = () => {
  const { schedules, isLoading, createSchedule, updateSchedule } = useSchedules();
  const { routes } = useRoutes();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<RouteSchedule | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string>(routes[0]?.id || 'route-001');

  const currentSchedule = schedules.find((s) => s.routeId === activeRouteId) || schedules[0];
  const activeRouteObj = routes.find((r) => r.id === activeRouteId) || routes[0];

  const handleOpenCreate = () => {
    setSelectedSchedule(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (schedule: RouteSchedule) => {
    setSelectedSchedule(schedule);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedSchedule) {
      await updateSchedule({ id: selectedSchedule.id, updates: formData });
    } else {
      await createSchedule(formData);
    }
    setFormModalOpen(false);
  };

  const timetableColumns: TableColumn<any>[] = [
    {
      key: 'sequence',
      header: 'Stop #',
      sortable: true,
      render: (row) => (
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {row.sequence}
        </span>
      ),
    },
    {
      key: 'stopName',
      header: 'Transit Station',
      render: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.stopName}</span>,
    },
    {
      key: 'scheduledArrival',
      header: 'Scheduled Arrival',
      align: 'center',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
          {row.scheduledArrival}
        </span>
      ),
    },
    {
      key: 'scheduledDeparture',
      header: 'Scheduled Departure',
      align: 'center',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {row.scheduledDeparture}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Schedules & Timetable Operations
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Define official departure slots and stop-by-stop arrival benchmarks used by the real-time delay engine.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span>New Route Timetable</span>
        </button>
      </div>

      {/* Route Tab Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {routes.map((r) => {
          const isSelected = r.id === activeRouteId;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRouteId(r.id)}
              className={`flex items-center space-x-2 rounded-xl border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm dark:bg-brand-950/40 dark:text-brand-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-occ-darkCard dark:text-slate-400'
              }`}
            >
              <span
                style={{ backgroundColor: r.colorHex || '#059669' }}
                className="h-2 w-2 rounded-full"
              />
              <span>{r.routeCode}</span>
              <span className="hidden sm:inline font-normal text-slate-400">
                ({r.originStopName.split(' ')[0]} ↔ {r.destinationStopName.split(' ')[0]})
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Route Timetable Details */}
      {currentSchedule && (
        <div className="space-y-6">
          {/* Active Schedule Banner */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-occ-darkCard">
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-black text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                  {currentSchedule.routeCode}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentSchedule.routeName}
                </h2>
                <StatusBadge status={currentSchedule.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Effective From: {currentSchedule.effectiveFrom} • Direction: {currentSchedule.direction}
              </p>
            </div>

            <button
              onClick={() => handleOpenEdit(currentSchedule)}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Timetable Slots</span>
            </button>
          </div>

          {/* Departure Slots Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Daily Departure Departures ({currentSchedule.slots?.length || 0} scheduled trips)
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
              {currentSchedule.slots?.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                      {slot.departureTime}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      → {slot.arrivalTime}
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] text-slate-400 block truncate">
                    {slot.assignedPlateNumber || slot.frequencyType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stop-by-Stop Arrival Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Stop-by-Stop Scheduled Progression (Standard 08:00 Trip Benchmark)
            </h3>
            <DataTable
              columns={timetableColumns}
              data={currentSchedule.stopArrivalTimetable || []}
              keyExtractor={(item) => item.stopId}
              searchable={false}
            />
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedSchedule ? `Edit Schedule: ${selectedSchedule.routeCode}` : 'Create Route Timetable'}
        description="Configure departure times and arrival benchmarks for public transit corridors."
        size="xl"
      >
        <ScheduleForm
          initialData={selectedSchedule}
          routes={routes}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={false}
        />
      </Modal>
    </div>
  );
};
