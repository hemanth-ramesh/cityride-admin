import React, { useState } from 'react';
import { useStops } from '@/hooks/useMasterData';
import { BusStop } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StopForm } from '../components/StopForm';
import { TableColumn } from '@/types';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Navigation,
  Shield,
  Layers,
  CheckCircle,
  Building,
  Radio,
} from 'lucide-react';

export const Stops: React.FC = () => {
  const { stops, isLoading, createStop, updateStop, deleteStop, isCreating, isUpdating } = useStops();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
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
  const pidStops = stops.filter((s) => s.facilities.includes('passenger_info_display')).length;
  const qrStops = stops.filter((s) => s.facilities.includes('digital_ticketing')).length;

  const columns: TableColumn<BusStop>[] = [
    {
      key: 'name',
      header: 'Stop Name & Code',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>
              <span className="text-xs text-slate-400">({row.kannadaName})</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="font-mono font-semibold text-brand-700 dark:text-brand-400">
                {row.stopCode}
              </span>
              <span>•</span>
              <span>{row.area}</span>
              {row.landmark && (
                <>
                  <span>•</span>
                  <span className="italic">{row.landmark}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'latitude',
      header: 'Coordinates / Geofence',
      render: (row) => (
        <div className="flex flex-col font-mono text-[11px] text-slate-600 dark:text-slate-300">
          <span>
            {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
          </span>
          <span className="text-[10px] text-slate-400">
            Radius: {row.geofenceRadiusMeters || 45}m
          </span>
        </div>
      ),
    },
    {
      key: 'routeNames',
      header: 'Routes Served',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.routeIds && row.routeIds.length > 0 ? (
            row.routeIds.map((r) => (
              <span
                key={r}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
      key: 'facilities',
      header: 'Facilities',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {row.facilities.length} amenities
          </span>
          {row.facilities.includes('passenger_info_display') && (
            <span className="text-[10px] text-blue-600 font-semibold" title="PID Display">
              [PID]
            </span>
          )}
          {row.facilities.includes('cctv_surveillance') && (
            <span className="text-[10px] text-purple-600 font-semibold" title="CCTV Monitored">
              [CCTV]
            </span>
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
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            title="Edit Stop & Coordinates"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmStop(row)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
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
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Bus Stop Master Data (36 Tumakuru Stops)
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Authoritative registry of verified Tumakuru transit stations, GPS pins, Kannada titles, and civic amenities.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Bus Stop</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Transit Stops</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalStops}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Active Operational</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{activeStops}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-blue-700 uppercase dark:text-blue-400">Smart PID Equipped</span>
          <p className="mt-1 text-2xl font-black text-blue-800 dark:text-blue-300">{pidStops}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm dark:border-purple-950 dark:bg-purple-950/20">
          <span className="text-[11px] font-semibold text-purple-700 uppercase dark:text-purple-400">QR / Digital Pass Ready</span>
          <p className="mt-1 text-2xl font-black text-purple-800 dark:text-purple-300">{qrStops}</p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={stops}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search stop by English/Kannada name, code, area, landmark..."
      />

      {/* Form Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedStop ? `Edit Bus Stop: ${selectedStop.name}` : 'Register New Tumakuru Bus Stop'}
        description="Specify geographic coordinates, bilingual signage, and station facilities."
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
