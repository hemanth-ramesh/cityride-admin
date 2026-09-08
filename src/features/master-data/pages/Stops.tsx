import React, { useState } from 'react';
import { useStops } from '@/hooks/useMasterData';
import { BusStop } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StopForm } from '../components/StopForm';
import { StopDetailModal } from '../components/StopDetailModal';
import { TableColumn } from '@/types';
import { KPICard } from '@/components/ui/KPICard';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Radio,
  Eye,
} from 'lucide-react';

export const Stops: React.FC = () => {
  const { stops, isLoading, createStop, updateStop, deleteStop, isCreating, isUpdating } = useStops();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [viewDetailStop, setViewDetailStop] = useState<BusStop | null>(null);
  const [deleteConfirmStop, setDeleteConfirmStop] = useState<BusStop | null>(null);

  const handleOpenCreate = () => {
    setSelectedStop(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (stop: BusStop) => {
    setSelectedStop(stop);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedStop) {
      await updateStop({ id: selectedStop.id, updates: formData });
    } else {
      await createStop(formData);
    }
    setFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmStop) {
      await deleteStop(deleteConfirmStop.id);
      setDeleteConfirmStop(null);
    }
  };

  // Metrics
  const totalStops = stops.length;
  const activeStops = stops.filter((s) => s.isActive).length;
  const servicedStopsCount = stops.filter((s) => s.routeIds && s.routeIds.length > 0).length;

  const columns: TableColumn<BusStop>[] = [
    {
      key: 'name',
      header: 'Stop Name & Code',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewDetailStop(row)}
          className="flex items-center space-x-3 text-left group transition-all cursor-pointer"
          title="Click to view full stop details"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 transition truncate">
                {row.name}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {row.stopCode}
              </span>
              <span>•</span>
              <span className="truncate">{row.area || 'Tumakuru'}</span>
            </div>
          </div>
        </button>
      ),
    },
    {
      key: 'latitude',
      header: 'GPS Coordinates',
      render: (row) => (
        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
          {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
        </span>
      ),
    },
    {
      key: 'routeNames',
      header: 'Routes Served',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          {row.routeIds && row.routeIds.length > 0 ? (
            row.routeIds.map((r) => (
              <span
                key={r}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {r}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-400 italic">Feeder / Standby</span>
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.isActive ? 'active' : 'inactive'} label={row.isActive ? 'Active' : 'Closed'} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => setViewDetailStop(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition-all active:scale-95 cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition-all active:scale-95 cursor-pointer"
            title="Edit Stop & Routes"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmStop(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all active:scale-95"
            title="Deactivate Stop"
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
              <MapPin className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Bus Stop Master Data (36 Tumakuru Stops)
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Authoritative registry of verified Tumakuru transit stations, GPS coordinates, and route connections.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Bus Stop</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="TOTAL BUS STOPS"
          value={totalStops}
          status="dark"
          icon={MapPin}
        />
        <KPICard
          title="ACTIVE OPERATIONAL"
          value={activeStops}
          status="teal"
          icon={CheckCircle}
        />
        <KPICard
          title="SERVICING ACTIVE ROUTES"
          value={servicedStopsCount}
          status="info"
          icon={Radio}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={stops}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search stop by English/Kannada name, code, area, landmark..."
      />

      {/* Stop Details Popup Modal */}
      <StopDetailModal
        stop={viewDetailStop}
        isOpen={Boolean(viewDetailStop)}
        onClose={() => setViewDetailStop(null)}
        onEdit={handleOpenEdit}
      />

      {/* Form Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedStop ? `Edit Bus Stop: ${selectedStop.name}` : 'Register New Tumakuru Bus Stop'}
        size="xl"
      >
        <StopForm
          initialData={selectedStop}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      {/* Deactivate / Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmStop)}
        title="Confirm Stop Deactivation"
        message={
          deleteConfirmStop ? (
            <p>
              Are you sure you want to deactivate bus stop{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{deleteConfirmStop.name}</strong> ({deleteConfirmStop.stopCode})? It will be marked inactive and removed from public waypoint routing.
            </p>
          ) : ''
        }
        confirmLabel="Deactivate Stop"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmStop(null)}
      />
    </div>
  );
};
