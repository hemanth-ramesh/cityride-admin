import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useMasterData';
import { Vehicle, VehicleStatus } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { VehicleForm } from '../components/VehicleForm';
import { TableColumn } from '@/types';
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  Wrench,
  Zap,
  Snowflake,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const Vehicles: React.FC = () => {
  const { vehicles, isLoading, createVehicle, updateVehicle, deleteVehicle, isCreating, isUpdating } = useVehicles();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmVehicle, setDeleteConfirmVehicle] = useState<Vehicle | null>(null);
  const [maintenanceConfirmVehicle, setMaintenanceConfirmVehicle] = useState<Vehicle | null>(null);

  const handleOpenCreate = () => {
    setSelectedVehicle(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedVehicle) {
      await updateVehicle({ id: selectedVehicle.id, updates: formData });
    } else {
      await createVehicle(formData);
    }
    setFormModalOpen(false);
  };

  const handleConfirmMaintenanceToggle = async () => {
    if (!maintenanceConfirmVehicle) return;
    const newStatus: VehicleStatus = maintenanceConfirmVehicle.status === 'maintenance' ? 'active' : 'maintenance';
    await updateVehicle({ id: maintenanceConfirmVehicle.id, updates: { status: newStatus } });
    setMaintenanceConfirmVehicle(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmVehicle) {
      await deleteVehicle(deleteConfirmVehicle.id);
      setDeleteConfirmVehicle(null);
    }
  };

  // Metrics
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length;
  const electricCount = vehicles.filter((v) => v.isElectric).length;

  const columns: TableColumn<Vehicle>[] = [
    {
      key: 'registrationNumber',
      header: 'Vehicle / Plate #',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Bus className="h-5 w-5 text-brand-700 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {row.registrationNumber}
              </span>
              {row.isElectric && (
                <span title="Electric Vehicle">
                  <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                </span>
              )}
              {row.hasAc && (
                <span title="Air Conditioned">
                  <Snowflake className="h-3.5 w-3.5 text-blue-500" />
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-400">
              Route: {row.currentRouteCode || 'R01'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'fleetType',
      header: 'Model / Class',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800 dark:text-slate-200">{row.fleetType}</span>
          <span className="text-[11px] text-slate-500">{row.depotName || 'Central Depot'}</span>
        </div>
      ),
    },
    {
      key: 'currentDriverName',
      header: 'Active Assignment',
      render: (row) => (
        <div className="flex flex-col text-xs">
          {row.currentDriverName ? (
            <>
              <span className="font-medium text-slate-800 dark:text-slate-200">{row.currentDriverName}</span>
              <span className="text-[11px] text-brand-600 dark:text-brand-400">
                Route {row.currentRouteCode || 'R01'}
              </span>
            </>
          ) : (
            <span className="text-slate-400 italic">Standby in Depot</span>
          )}
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
            onClick={() => setMaintenanceConfirmVehicle(row)}
            title={row.status === 'maintenance' ? 'Mark Operational (Active)' : 'Move to Maintenance'}
            className={`rounded-lg p-1.5 transition ${
              row.status === 'maintenance'
                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50'
            }`}
          >
            <Wrench className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            title="Edit Vehicle Specs"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmVehicle(row)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Decommission Vehicle"
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
            <Bus className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Fleet & Bus Registry
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Master database of all registered Tumakuru public transit vehicles, route assignments, and status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Bus</span>
        </button>
      </div>

      {/* Fleet Metric Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Fleet Size</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalVehicles}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Active in Service</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{activeVehicles}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase dark:text-amber-400">In Depot Maintenance</span>
          <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">{maintenanceCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-emerald-900/40 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Electric Fleet (EV)</span>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">{electricCount}</p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={vehicles}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search by plate number, route, model, depot..."
      />

      {/* Edit/Create Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedVehicle ? `Edit Bus Specs: ${selectedVehicle.registrationNumber}` : 'Register New Transit Vehicle'}
        description="Configure RTO plate number, route assignment, propulsion type, and depot assignment."
        size="lg"
      >
        <VehicleForm
          initialData={selectedVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      {/* Maintenance Confirmation Modal */}
      <Modal
        isOpen={Boolean(maintenanceConfirmVehicle)}
        onClose={() => setMaintenanceConfirmVehicle(null)}
        title="Confirm Maintenance Status Change"
        description="Please confirm before updating the vehicle's operational deployment status."
        size="sm"
        footer={
          <>
            <button
              onClick={() => setMaintenanceConfirmVehicle(null)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmMaintenanceToggle}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition ${
                maintenanceConfirmVehicle?.status === 'maintenance'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {maintenanceConfirmVehicle?.status === 'maintenance'
                ? 'Restore to Active'
                : 'Move to Maintenance'}
            </button>
          </>
        }
      >
        {maintenanceConfirmVehicle && (
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p>
              Are you sure you want to change status for bus{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {maintenanceConfirmVehicle.registrationNumber}
              </strong>
              ?
            </p>
            <p className="text-[11px] text-slate-500">
              {maintenanceConfirmVehicle.status === 'maintenance'
                ? 'The bus will be marked active and eligible for daily dispatch rosters.'
                : 'The bus will be taken off active duty and moved to depot repair queue.'}
            </p>
          </div>
        )}
      </Modal>

      {/* Delete / Decommission Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmVehicle)}
        onClose={() => setDeleteConfirmVehicle(null)}
        title="Confirm Decommission"
        description="Are you sure you want to remove this vehicle record from the active transit registry?"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteConfirmVehicle(null)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
            >
              Decommission
            </button>
          </>
        }
      >
        {deleteConfirmVehicle && (
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Bus <span className="font-bold">{deleteConfirmVehicle.registrationNumber}</span> will be decommissioned.
          </p>
        )}
      </Modal>
    </div>
  );
};
