import React, { useState } from 'react';
import { usePassengers } from '@/hooks/useServiceOperations';
import { PassengerProfile } from '@/types/service';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { PassengerDetailModal } from '../components/PassengerDetailModal';
import { ServiceNavigationTabs } from '../components/ServiceNavigationTabs';
import { TableColumn } from '@/types';
import {
  UserCheck,
  Eye,
  Languages,
  Phone,
  MapPin,
  GitFork,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const Passengers: React.FC = () => {
  const { passengers, isLoading, updatePassengerStatus } = usePassengers();
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerProfile | null>(null);

  const handleToggleStatus = async (id: string, newStatus: PassengerProfile['status']) => {
    await updatePassengerStatus({ id, status: newStatus });
    if (selectedPassenger && selectedPassenger.id === id) {
      setSelectedPassenger({ ...selectedPassenger, status: newStatus });
    }
  };

  // Metrics
  const totalPassengers = passengers.length;
  const activePassengers = passengers.filter((p) => p.status === 'active').length;
  const kannadaUsers = passengers.filter((p) => p.preferredLanguage === 'KANNADA').length;
  const englishUsers = passengers.filter((p) => p.preferredLanguage === 'ENGLISH').length;

  const columns: TableColumn<PassengerProfile>[] = [
    {
      key: 'fullName',
      header: 'Passenger Name / Code',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {row.fullName.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{row.fullName}</span>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <span className="font-mono">{row.passengerCode}</span>
              <span>•</span>
              <span>Joined {row.joinedDate}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone & Preferred Lang',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200">{row.phone}</span>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
            {row.preferredLanguage === 'KANNADA' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
          </span>
        </div>
      ),
    },
    {
      key: 'homeStopName',
      header: 'Frequent Commute',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
            {row.homeStopName || 'Unset'} → {row.workStopName || 'Unset'}
          </span>
          <div className="flex items-center space-x-1 mt-0.5">
            {row.favoriteRouteCodes.map((r) => (
              <span key={r} className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-mono font-bold dark:bg-slate-800">
                {r}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'totalTripsLogged',
      header: 'Trips Logged',
      sortable: true,
      align: 'right',
      render: (row) => (
        <div className="flex flex-col items-end text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {row.totalTripsLogged} trips
          </span>
          <span className="text-[10px] text-slate-400">Active {row.lastActiveDate}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedPassenger(row)}
          className="inline-flex items-center space-x-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Profile</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <ServiceNavigationTabs />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Passenger Accounts & Directory
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Registered citizen passenger profiles, favorite transit corridors, and emergency contacts (zero payment data).
          </p>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Registered App Users</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalPassengers}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Active Riders</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{activePassengers}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-blue-700 uppercase dark:text-blue-400">ಕನ್ನಡ Interface Users</span>
          <p className="mt-1 text-2xl font-black text-blue-800 dark:text-blue-300">{kannadaUsers}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm dark:border-purple-950 dark:bg-purple-950/20">
          <span className="text-[11px] font-semibold text-purple-700 uppercase dark:text-purple-400">English Interface Users</span>
          <p className="mt-1 text-2xl font-black text-purple-800 dark:text-purple-300">{englishUsers}</p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={passengers}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search passenger name, code, phone, stop..."
      />

      {/* Detail Modal */}
      <Modal
        isOpen={Boolean(selectedPassenger)}
        onClose={() => setSelectedPassenger(null)}
        title="Passenger Account & Travel Activity"
        description="Review app usage, commute anchors, emergency contacts, and status controls."
        size="lg"
      >
        {selectedPassenger && (
          <PassengerDetailModal
            passenger={selectedPassenger}
            onToggleStatus={handleToggleStatus}
            onClose={() => setSelectedPassenger(null)}
          />
        )}
      </Modal>
    </div>
  );
};
