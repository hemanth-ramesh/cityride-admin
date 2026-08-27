import React, { useState } from 'react';
import { useDrivers } from '@/hooks/useMasterData';
import { Driver } from '@/types/masterData';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { DriverForm } from '../components/DriverForm';
import { TableColumn } from '@/types';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Phone,
  CreditCard,
  Building,
  CheckCircle,
  AlertOctagon,
} from 'lucide-react';

export const Drivers: React.FC = () => {
  const { drivers, isLoading, createDriver, updateDriver, deleteDriver, isCreating, isUpdating } = useDrivers();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteConfirmDriver, setDeleteConfirmDriver] = useState<Driver | null>(null);
  const [statusConfirmDriver, setStatusConfirmDriver] = useState<Driver | null>(null);

  const handleOpenCreate = () => {
    setSelectedDriver(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedDriver) {
      await updateDriver({ id: selectedDriver.id, updates: formData });
    } else {
      await createDriver(formData);
    }
    setFormModalOpen(false);
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusConfirmDriver) return;
    const newStatus = statusConfirmDriver.status === 'suspended' ? 'active' : 'suspended';
    await updateDriver({ id: statusConfirmDriver.id, updates: { status: newStatus } });
    setStatusConfirmDriver(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmDriver) {
      await deleteDriver(deleteConfirmDriver.id);
      setDeleteConfirmDriver(null);
    }
  };

  // Metrics
  const totalDrivers = drivers.length;
  const onDutyCount = drivers.filter((d) => d.status === 'on_duty').length;
  const activeCount = drivers.filter((d) => d.status === 'active').length;
  const suspendedCount = drivers.filter((d) => d.status === 'suspended').length;

  const columns: TableColumn<Driver>[] = [
    {
      key: 'fullName',
      header: 'Driver Name / Code',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            {row.fullName.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{row.fullName}</span>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
              <span>{row.driverCode}</span>
              <span>•</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">{row.bloodGroup || 'O+'}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact & License',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{row.phone}</span>
          </span>
          <span className="flex items-center space-x-1 text-[11px] text-slate-500">
            <CreditCard className="h-3 w-3 text-slate-400" />
            <span>{row.licenseNumber}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'assignedBusId',
      header: 'Assigned Duty',
      render: (row) => (
        <div className="flex flex-col text-xs">
          {row.assignedPlateNumber ? (
            <>
              <span className="font-semibold text-brand-700 dark:text-brand-400">
                {row.assignedPlateNumber}
              </span>
              <span className="text-[10px] text-slate-500">
                Route: {row.assignedRouteCode || 'R01'}
              </span>
            </>
          ) : (
            <span className="text-slate-400 italic">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Duty Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} pulse={row.status === 'on_duty'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => setStatusConfirmDriver(row)}
            title={row.status === 'suspended' ? 'Activate Driver' : 'Suspend Driver'}
            className={`rounded-lg p-1.5 transition ${
              row.status === 'suspended'
                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50'
            }`}
          >
            {row.status === 'suspended' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            title="Edit Driver Details"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmDriver(row)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Delete Driver"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Driver Operations Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Manage public transit drivers, licenses, duty rosters, performance records, and active status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Driver</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Drivers</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalDrivers}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">On Duty Active</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{onDutyCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Available Reserve</span>
          <p className="mt-1 text-2xl font-black text-slate-700 dark:text-slate-200">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase dark:text-amber-400">Suspended / Leave</span>
          <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">{suspendedCount}</p>
        </div>
      </div>

      {/* Driver DataTable */}
      <DataTable
        columns={columns}
        data={drivers}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search by name, driver code, license, phone..."
      />

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedDriver ? `Edit Driver: ${selectedDriver.fullName}` : 'Register New Driver'}
        description="Fill in certified driver credentials and depot assignment."
        size="lg"
      >
        <DriverForm
          initialData={selectedDriver}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmDriver)}
        onClose={() => setDeleteConfirmDriver(null)}
        title="Confirm Driver Removal"
        description="Are you sure you want to remove this driver record from the master database?"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteConfirmDriver(null)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
            >
              Delete Record
            </button>
          </>
        }
      >
        {deleteConfirmDriver && (
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Driver <span className="font-bold">{deleteConfirmDriver.fullName}</span> ({deleteConfirmDriver.driverCode}) will be permanently removed.
          </p>
        )}
      </Modal>

      {/* Status (Suspend/Reinstate) Confirmation Modal */}
      <Modal
        isOpen={Boolean(statusConfirmDriver)}
        onClose={() => setStatusConfirmDriver(null)}
        title="Confirm Driver Status Change"
        description="Please confirm before updating the operational duty eligibility for this driver."
        size="sm"
        footer={
          <>
            <button
              onClick={() => setStatusConfirmDriver(null)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStatusToggle}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition ${
                statusConfirmDriver?.status === 'suspended'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {statusConfirmDriver?.status === 'suspended' ? 'Activate Driver' : 'Suspend Driver'}
            </button>
          </>
        }
      >
        {statusConfirmDriver && (
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p>
              Are you sure you want to {statusConfirmDriver.status === 'suspended' ? 'reactivate' : 'suspend'}{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{statusConfirmDriver.fullName}</strong> ({statusConfirmDriver.driverCode})?
            </p>
            <p className="text-[11px] text-slate-500">
              {statusConfirmDriver.status === 'suspended'
                ? 'The driver will become available for scheduling on daily duty rosters.'
                : 'The driver will be barred from daily shift assignments until reinstated.'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
