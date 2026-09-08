import React, { useState } from 'react';
import { usePassengers } from '@/hooks/useServiceOperations';
import { PassengerProfile } from '@/types/service';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { PassengerDetailModal } from '../components/PassengerDetailModal';
import { ServiceNavigationTabs } from '../components/ServiceNavigationTabs';
import { TableColumn } from '@/types';
import { KPICard } from '@/components/ui/KPICard';
import {
  UserCheck,
  Eye,
  Languages,
  Phone,
  MapPin,
  GitFork,
  CheckCircle2,
  ShieldAlert,
  Users,
  Globe,
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 font-bold text-blue-700 border border-blue-200/60 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300 dark:border-blue-800/60 shadow-xs">
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
          <span className="inline-block mt-0.5 rounded-full bg-blue-50 px-2 py-0.2 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 w-fit">
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
          <div className="flex items-center space-x-1 mt-1">
            {row.favoriteRouteCodes.map((r) => (
              <span key={r} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-mono font-bold dark:bg-slate-800">
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
          className="inline-flex items-center space-x-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          <Eye className="h-3.5 w-3.5 text-slate-500" />
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
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-xs">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Passenger Accounts & Directory
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Registered citizen passenger profiles, favorite transit corridors, and emergency contacts (zero payment data).
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="REGISTERED APP USERS"
          value={totalPassengers}
          status="dark"
          icon={Users}
        />
        <KPICard
          title="ACTIVE RIDERS"
          value={activePassengers}
          status="teal"
          icon={UserCheck}
        />
        <KPICard
          title="ಕನ್ನಡ INTERFACE USERS"
          value={kannadaUsers}
          status="info"
          icon={Languages}
        />
        <KPICard
          title="ENGLISH INTERFACE USERS"
          value={englishUsers}
          status="orange"
          icon={Globe}
        />
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
