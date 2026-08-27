import React, { useState } from 'react';
import { useRoutes, useStops } from '@/hooks/useMasterData';
import { TransitRoute } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RouteEditor } from '../components/RouteEditor';
import { TableColumn } from '@/types';
import {
  GitFork,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Navigation,
  Layers,
  CheckCircle,
  Radio,
  ArrowRight,
} from 'lucide-react';

export const Routes: React.FC = () => {
  const { routes, isLoading, createRoute, updateRoute, deleteRoute, isCreating, isUpdating } = useRoutes();
  const { stops } = useStops();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);
  const [deleteConfirmRoute, setDeleteConfirmRoute] = useState<TransitRoute | null>(null);

  const handleOpenCreate = () => {
    setSelectedRoute(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (route: TransitRoute) => {
    setSelectedRoute(route);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedRoute) {
      await updateRoute({ id: selectedRoute.id, updates: formData });
    } else {
      await createRoute(formData);
    }
    setFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmRoute) {
      await deleteRoute(deleteConfirmRoute.id);
      setDeleteConfirmRoute(null);
    }
  };

  // Metrics
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter((r) => r.status === 'active').length;
  const totalNetworkKm = routes.reduce((acc, r) => acc + (r.totalDistanceKm || 0), 0);

  const columns: TableColumn<TransitRoute>[] = [
    {
      key: 'routeCode',
      header: 'Route #',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <span
            style={{ backgroundColor: row.colorHex || '#059669' }}
            className="flex h-8 w-10 items-center justify-center rounded-lg text-xs font-black text-white shadow-sm"
          >
            {row.routeCode}
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white">{row.routeName}</span>
            <span className="text-[11px] text-slate-400 truncate max-w-xs">{row.viaSummary}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stopsCount',
      header: 'Stops & Corridor',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {row.stops?.length || 0} transit stops
          </span>
          <span className="text-[10px] text-slate-400">
            {row.originStopName?.split(' ')[0]} → {row.destinationStopName?.split(' ')[0]}
          </span>
        </div>
      ),
    },
    {
      key: 'totalDistanceKm',
      header: 'Distance / Time',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {row.totalDistanceKm} km
          </span>
          <span className="text-[10px] text-slate-400">
            ~{row.averageDurationMinutes} mins travel
          </span>
        </div>
      ),
    },
    {
      key: 'dailyFrequencyMinutes',
      header: 'Frequency & Hours',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-brand-700 dark:text-brand-400">
            Every {row.dailyFrequencyMinutes} mins
          </span>
          <span className="text-[10px] text-slate-400">
            {row.firstBusTime} — {row.lastBusTime}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} pulse={row.status === 'active'} />,
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
            title="Edit Route Path & Stop Sequence"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmRoute(row)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Delete Route"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <GitFork className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Transit Route Network (8 Corridors)
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Authoritative Tumakuru route paths, ordered stop sequences, directional distances, and frequencies.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Route</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Corridors</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalRoutes} Routes</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Operational Lines</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{activeRoutes} Lines</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Network Span</span>
          <p className="mt-1 text-2xl font-black text-slate-800 dark:text-slate-200">{totalNetworkKm.toFixed(1)} km</p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={routes}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search routes by code (R01), origin, destination, or via stops..."
      />

      {/* Route Editor Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedRoute ? `Edit Route Sequence: ${selectedRoute.routeCode}` : 'Create New Transit Corridor'}
        description="Re-order bus stops, configure travel distances, and set operating timetables."
        size="2xl"
      >
        <RouteEditor
          initialData={selectedRoute}
          availableStops={stops}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmRoute)}
        title="Confirm Route Deletion"
        message={
          deleteConfirmRoute ? (
            <p>
              Are you sure you want to permanently remove route{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{deleteConfirmRoute.routeCode}</strong> ({deleteConfirmRoute.routeName})? All associated timetables will be decommissioned.
            </p>
          ) : ''
        }
        confirmLabel="Delete Route"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmRoute(null)}
      />
    </div>
  );
};
