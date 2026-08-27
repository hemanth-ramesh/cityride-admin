import React, { useState } from 'react';
import { useDuties } from '@/hooks/useDispatch';
import { useDrivers, useVehicles, useRoutes } from '@/hooks/useMasterData';
import { Duty, ShiftType } from '@/types/dispatch';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DutyForm } from '../components/DutyForm';
import { DispatchNavigationTabs } from '../components/DispatchNavigationTabs';
import { TableColumn } from '@/types';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bus,
  User,
  GitFork,
  CheckCircle2,
  Radio,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const DutyRoster: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { duties, isLoading, createDuty, updateDuty, deleteDuty, isCreating } = useDuties(selectedDate);
  const { drivers } = useDrivers();
  const { vehicles } = useVehicles();
  const { routes } = useRoutes();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);
  const [deleteConfirmDuty, setDeleteConfirmDuty] = useState<Duty | null>(null);

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

  const handleOpenCreate = () => {
    setSelectedDuty(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (duty: Duty) => {
    setSelectedDuty(duty);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedDuty) {
      await updateDuty({ id: selectedDuty.id, updates: formData });
    } else {
      await createDuty(formData);
    }
    setFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmDuty) {
      await deleteDuty(deleteConfirmDuty.id);
      setDeleteConfirmDuty(null);
    }
  };

  // Metrics for selected date
  const totalDuties = duties.length;
  const inProgressDuties = duties.filter((d) => d.status === 'in_progress').length;
  const morningDuties = duties.filter((d) => d.shift === 'MORNING').length;
  const eveningDuties = duties.filter((d) => d.shift === 'EVENING').length;

  const columns: TableColumn<Duty>[] = [
    {
      key: 'dutyCode',
      header: 'Duty ID / Code',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{row.dutyCode}</span>
          <span className="text-[10px] text-slate-400">Created {row.date}</span>
        </div>
      ),
    },
    {
      key: 'shift',
      header: 'Shift & Hours',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-brand-800 dark:text-brand-300">
            {row.shift} Shift
          </span>
          <span className="text-[10px] text-slate-500">
            {row.startTime} – {row.endTime}
          </span>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Assigned Driver',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {row.driverName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-white">{row.driverName}</span>
            <span className="text-[10px] text-slate-400">{row.driverCode}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'plateNumber',
      header: 'Bus Vehicle',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">{row.plateNumber}</span>
          <span className="text-[10px] text-slate-400">Unit: {row.fleetNumber}</span>
        </div>
      ),
    },
    {
      key: 'routeCode',
      header: 'Corridor Route',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            {row.routeCode}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
            {row.routeName.split('↔')[0]}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Duty Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} pulse={row.status === 'in_progress'} />,
    },
    {
      key: 'tripsCount',
      header: 'Trips Rotation',
      align: 'right',
      render: (row) => (
        <div className="flex flex-col items-end text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {row.tripsCompleted} / {row.tripsCount} trips
          </span>
          <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-brand-600"
              style={{ width: `${(row.tripsCompleted / Math.max(1, row.tripsCount)) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            title="Edit Duty"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmDuty(row)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Cancel Duty"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <DispatchNavigationTabs />

      {/* Header & Date Controller */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Daily Duty Roster
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Link transit staff (Driver) + fleet unit (Bus) + transit line (Route) + shift rotation.
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
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" />
            <span>Create Duty</span>
          </button>
        </div>
      </div>

      {/* Roster Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Duties Scheduled</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalDuties}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">In-Progress Now</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{inProgressDuties}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-blue-700 uppercase dark:text-blue-400">Morning Shift (Shift 1)</span>
          <p className="mt-1 text-2xl font-black text-blue-800 dark:text-blue-300">{morningDuties}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm dark:border-purple-950 dark:bg-purple-950/20">
          <span className="text-[11px] font-semibold text-purple-700 uppercase dark:text-purple-400">Evening Shift (Shift 2)</span>
          <p className="mt-1 text-2xl font-black text-purple-800 dark:text-purple-300">{eveningDuties}</p>
        </div>
      </div>

      {/* Duty Table */}
      <DataTable
        columns={columns}
        data={duties}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search duty code, driver name, bus plate, or route..."
      />

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedDuty ? `Edit Duty: ${selectedDuty.dutyCode}` : 'Create Daily Duty Assignment'}
        description="Select a driver, bus, route, and shift. Conflict checks run automatically."
        size="lg"
      >
        <DutyForm
          initialData={selectedDuty}
          existingDuties={duties}
          drivers={drivers}
          vehicles={vehicles}
          routes={routes}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Delete / Cancel Duty Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmDuty)}
        title="Confirm Duty Cancellation"
        message={
          deleteConfirmDuty ? (
            <p>
              Are you sure you want to cancel duty{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{deleteConfirmDuty.dutyCode}</strong> assigned to{' '}
              <strong className="text-slate-900 dark:text-white">{deleteConfirmDuty.driverName}</strong> ({deleteConfirmDuty.routeCode})? The slot will be removed from today's live roster.
            </p>
          ) : ''
        }
        confirmLabel="Cancel Duty"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmDuty(null)}
      />
    </div>
  );
};
