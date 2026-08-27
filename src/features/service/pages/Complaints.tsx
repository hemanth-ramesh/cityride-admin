import React, { useState } from 'react';
import { useComplaints } from '@/hooks/useServiceOperations';
import { useAuthStore } from '@/stores/useAuthStore';
import { PassengerComplaint } from '@/types/service';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ComplaintDetailModal } from '../components/ComplaintDetailModal';
import { ServiceNavigationTabs } from '../components/ServiceNavigationTabs';
import { TableColumn } from '@/types';
import {
  MessageSquareWarning,
  Eye,
  CheckCircle2,
  Clock,
  User,
  GitFork,
  Filter,
} from 'lucide-react';

export const Complaints: React.FC = () => {
  const { complaints, isLoading, assignComplaint, resolveComplaint } = useComplaints();
  const { user } = useAuthStore();
  const [selectedComplaint, setSelectedComplaint] = useState<PassengerComplaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleAssign = async (id: string, officer: string, depot: string) => {
    await assignComplaint({ id, assignedOfficer: officer, assignedDepot: depot });
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint({
        ...selectedComplaint,
        status: 'ASSIGNED',
        assignedOfficer: officer,
        assignedDepot: depot,
      });
    }
  };

  const handleResolve = async (id: string, response: string) => {
    const adminName = user?.fullName || 'Support Admin';
    await resolveComplaint({ id, officialResponse: response, resolvedBy: adminName });
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint({
        ...selectedComplaint,
        status: 'RESOLVED',
        officialResponse: response,
        resolvedBy: adminName,
        resolvedAt: new Date().toISOString(),
      });
    }
  };

  const filteredComplaints = statusFilter === 'ALL'
    ? complaints
    : complaints.filter((c) => c.status === statusFilter);

  // Metrics
  const totalComplaints = complaints.length;
  const openCount = complaints.filter((c) => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter((c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  const columns: TableColumn<PassengerComplaint>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket #',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-white">{row.ticketCode}</span>
          <span className="text-[10px] text-slate-400">
            {new Date(row.reportedAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Grievance Subject & Category',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white">{row.subject}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {row.category.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 truncate max-w-sm">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'passengerName',
      header: 'Passenger & Corridor',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200">{row.passengerName}</span>
          <span className="text-[10px] text-slate-400">
            {row.routeCode ? `Route ${row.routeCode}` : 'General Inquiry'} • {row.passengerPhone}
          </span>
        </div>
      ),
    },
    {
      key: 'assignedOfficer',
      header: 'Assigned Handler',
      render: (row) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {row.assignedOfficer || <span className="text-slate-400 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status === 'RESOLVED' ? 'active' : row.status === 'OPEN' ? 'inactive' : 'maintenance'}
          label={row.status.replace(/_/g, ' ')}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedComplaint(row)}
          className="inline-flex items-center space-x-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Resolve</span>
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
            <MessageSquareWarning className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Grievance & Complaints Desk
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Citizen grievance redressal workflow: investigation, officer assignment, and official app response delivery.
          </p>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Logged Tickets</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalComplaints}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase dark:text-amber-400">Open / Unassigned</span>
          <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">{openCount}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-blue-700 uppercase dark:text-blue-400">In Investigation</span>
          <p className="mt-1 text-2xl font-black text-blue-800 dark:text-blue-300">{inProgressCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Resolved Successfully</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{resolvedCount}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              statusFilter === filter
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-occ-darkCard dark:text-slate-300'
            }`}
          >
            {filter.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search ticket code, passenger name, route, subject..."
      />

      {/* Detail & Resolve Modal */}
      <Modal
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        title="Grievance Investigation & Redressal"
        description="Assign depot supervisor, draft official citizen response, and close complaint ticket."
        size="lg"
      >
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            onAssign={handleAssign}
            onResolve={handleResolve}
            onClose={() => setSelectedComplaint(null)}
          />
        )}
      </Modal>
    </div>
  );
};
