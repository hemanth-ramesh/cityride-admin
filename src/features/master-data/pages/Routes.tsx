import React, { useState } from 'react';
import { useRoutes, useStops } from '@/hooks/useMasterData';
import { TransitRoute } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RouteEditor } from '../components/RouteEditor';
import { TableColumn } from '@/types';
import { KPICard } from '@/components/ui/KPICard';
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
        <div className="flex items-center space-x-2.5">
          <span
            style={{ backgroundColor: row.colorHex || '#2563eb' }}
            className="flex h-7 w-12 items-center justify-center rounded-full text-xs font-black text-white shadow-xs"
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
          <span className="font-semibold text-blue-600 dark:text-blue-400">
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
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleOpenEdit(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all active:scale-95"
            title="Edit Route Path & Stop Sequence"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmRoute(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all active:scale-95"
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
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <GitFork className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Transit Route Network ({totalRoutes} Corridors)
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Authoritative Tumakuru route paths, ordered stop sequences, directional distances, and frequencies.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Route</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          title="OPERATIONAL LINES"
          value={`${activeRoutes} Lines`}
          status="teal"
          icon={CheckCircle}
        />
        <KPICard
          title="TOTAL NETWORK SPAN"
          value={`${totalNetworkKm.toFixed(1)} km`}
          status="info"
          icon={Navigation}
        />
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
