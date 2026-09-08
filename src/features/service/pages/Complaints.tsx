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
import { KPICard } from '@/components/ui/KPICard';
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
      header: 'Subject',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-xs text-slate-900 dark:text-white">
          {row.subject}
        </span>
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
          className="inline-flex items-center space-x-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
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
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <MessageSquareWarning className="h-5 w-5" />
            </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TOTAL TICKETS"
          value={totalComplaints}
          status="dark"
          icon={MessageSquareWarning}
        />
        <KPICard
          title="OPEN / UNASSIGNED"
          value={openCount}
          status="orange"
          icon={Clock}
        />
        <KPICard
          title="IN INVESTIGATION"
          value={inProgressCount}
          status="info"
          icon={User}
        />
        <KPICard
          title="RESOLVED SUCCESSFULLY"
          value={resolvedCount}
          status="teal"
          icon={CheckCircle2}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
        {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              statusFilter === filter
                ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/5 dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
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
        description="Draft official citizen response and close complaint ticket."
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
