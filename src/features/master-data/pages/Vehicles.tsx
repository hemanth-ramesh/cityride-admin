import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useMasterData';
import { Vehicle, VehicleStatus } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { KPICard } from '@/components/ui/KPICard';
import { Modal } from '@/components/ui/Modal';
import { VehicleForm } from '../components/VehicleForm';
import { TableColumn } from '@/types';
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  Wrench,
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

  const columns: TableColumn<Vehicle>[] = [
    {
      key: 'registrationNumber',
      header: 'Vehicle No',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {row.registrationNumber}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px]">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Route: {row.currentRouteCode || 'R01'}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">
                {row.depotName || 'Central Depot'}
              </span>
            </div>
          </div>
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
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
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
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => setMaintenanceConfirmVehicle(row)}
            title={row.status === 'maintenance' ? 'Mark Operational (Active)' : 'Move to Maintenance'}
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              row.status === 'maintenance'
                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50'
            }`}
          >
            <Wrench className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all active:scale-95"
            title="Edit Bus Specs"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmVehicle(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all active:scale-95"
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
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Bus className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Buses Registry
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Master database of all registered Tumakuru public transit buses, route assignments, and operational status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Bus</span>
        </button>
      </div>

      {/* Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="TOTAL BUSES"
          value={totalVehicles}
          status="dark"
          icon={Bus}
        />
        <KPICard
          title="ACTIVE IN SERVICE"
          value={activeVehicles}
          status="teal"
          icon={CheckCircle2}
        />
        <KPICard
          title="IN MAINTENANCE"
          value={maintenanceCount}
          status="warning"
          icon={Wrench}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={vehicles}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search by plate number, route, depot..."
      />

      {/* Edit/Create Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedVehicle ? `Edit Bus Specs: ${selectedVehicle.registrationNumber}` : 'Register New Bus'}
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
              className="rounded-full bg-slate-100 hover:bg-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmMaintenanceToggle}
              className={`rounded-full px-5 py-2 text-xs font-bold text-white shadow-md transition active:scale-95 ${
                maintenanceConfirmVehicle?.status === 'maintenance'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'
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
              className="rounded-full bg-slate-100 hover:bg-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="rounded-full bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/25 transition active:scale-95"
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
