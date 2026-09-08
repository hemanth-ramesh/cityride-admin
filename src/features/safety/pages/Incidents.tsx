import React, { useState } from 'react';
import { useSafety } from '@/hooks/useSafety';
import { IncidentReport, IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/safety';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IncidentForm } from '../components/IncidentForm';
import { IncidentDetailModal } from '../components/IncidentDetailModal';
import { SafetyNavigationTabs } from '../components/SafetyNavigationTabs';
import { TableColumn } from '@/types';
import { KPICard } from '@/components/ui/KPICard';
import {
  AlertTriangle,
  Plus,
  Edit2,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Wrench,
  Car,
  Activity,
  Shield,
  Filter,
} from 'lucide-react';

export const Incidents: React.FC = () => {
  const { incidents, isLoadingIncidents, createIncident, updateIncident } = useSafety();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [viewDetailIncident, setViewDetailIncident] = useState<IncidentReport | null>(null);
  const [statusConfirmIncident, setStatusConfirmIncident] = useState<{ incident: IncidentReport; newStatus: IncidentStatus } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleOpenCreate = () => {
    setSelectedIncident(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (inc: IncidentReport) => {
    setSelectedIncident(inc);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedIncident) {
      await updateIncident({ id: selectedIncident.id, updates: formData });
    } else {
      await createIncident(formData);
    }
    setFormModalOpen(false);
  };

  const handleExecuteStatusChange = async () => {
    if (!statusConfirmIncident) return;
    const { incident, newStatus } = statusConfirmIncident;
    await updateIncident({
      id: incident.id,
      updates: {
        status: newStatus,
        resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : undefined,
      },
    });
    setStatusConfirmIncident(null);
  };

  const filteredIncidents = statusFilter === 'ALL'
    ? incidents
    : incidents.filter((i) => i.status === statusFilter);

  // Metrics
  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black text-white uppercase shadow-xs">Critical</span>;
      case 'HIGH':
        return <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-black text-white uppercase shadow-xs">High</span>;
      case 'MEDIUM':
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">Medium</span>;
      case 'LOW':
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">Low</span>;
    }
  };

  const columns: TableColumn<IncidentReport>[] = [
    {
      key: 'incidentCode',
      header: 'Incident Code',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewDetailIncident(row)}
          className="flex flex-col text-left group cursor-pointer"
          title="Click to view full incident details"
        >
          <span className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
            {row.incidentCode}
          </span>
          <span className="text-[10px] text-slate-400">
            {new Date(row.reportedAt).toLocaleDateString()}
          </span>
        </button>
      ),
    },
    {
      key: 'title',
      header: 'Incident Title & Category',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewDetailIncident(row)}
          className="flex items-center space-x-2 text-left group cursor-pointer"
          title="Click to view full incident details"
        >
          <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 transition">
            {row.title}
          </span>
          {getSeverityBadge(row.severity)}
        </button>
      ),
    },
    {
      key: 'locationLandmark',
      header: 'Location',
      render: (row) => (
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
          <span className="truncate max-w-[240px]">{row.locationLandmark}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Workflow Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={
            row.status === 'RESOLVED'
              ? 'active'
              : row.status === 'ACTION_TAKEN'
              ? 'maintenance'
              : row.status === 'INVESTIGATING'
              ? 'on_duty'
              : 'inactive'
          }
          label={row.status.replace(/_/g, ' ')}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Resolution Action',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1.5">
          {row.status === 'REPORTED' && (
            <button
              onClick={() => setStatusConfirmIncident({ incident: row, newStatus: 'INVESTIGATING' })}
              className="rounded-full bg-amber-600 hover:bg-amber-700 px-3.5 py-1 text-[11px] font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
            >
              Investigate
            </button>
          )}
          {row.status === 'INVESTIGATING' && (
            <button
              onClick={() => setStatusConfirmIncident({ incident: row, newStatus: 'ACTION_TAKEN' })}
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-3.5 py-1 text-[11px] font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
            >
              Take Action
            </button>
          )}
          {row.status === 'ACTION_TAKEN' && (
            <button
              onClick={() => setStatusConfirmIncident({ incident: row, newStatus: 'RESOLVED' })}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1 text-[11px] font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
            >
              Resolve
            </button>
          )}
          <button
            onClick={() => handleOpenEdit(row)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition active:scale-95 cursor-pointer"
            title="Edit Incident Report"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <SafetyNavigationTabs />

      {/* Header & File Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Incident Management Desk
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Log and resolve operational impediments: breakdowns, traffic gridlocks, accidents, and route blockages.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>File Incident Report</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TOTAL LOGGED INCIDENTS"
          value={totalIncidents}
          status="dark"
          icon={Shield}
        />
        <KPICard
          title="ACTIVE / IN PROGRESS"
          value={activeIncidents}
          status="orange"
          icon={Clock}
        />
        <KPICard
          title="HIGH / CRITICAL PRIORITY"
          value={criticalCount}
          status="danger"
          icon={Flame}
        />
        <KPICard
          title="RESOLVED TODAY"
          value={resolvedCount}
          status="teal"
          icon={CheckCircle2}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
        {['ALL', 'REPORTED', 'INVESTIGATING', 'ACTION_TAKEN', 'RESOLVED'].map((filter) => (
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

      {/* Incident DataTable */}
      <DataTable
        columns={columns}
        data={filteredIncidents}
        keyExtractor={(item) => item.id}
        isLoading={isLoadingIncidents}
        searchPlaceholder="Search incident code, title, route, landmark, plate..."
      />

      {/* Incident Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedIncident ? `Edit Incident: ${selectedIncident.incidentCode}` : 'File Operational Incident Report'}
        size="xl"
      >
        <IncidentForm
          initialData={selectedIncident}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={false}
        />
      </Modal>

      {/* Status Action Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(statusConfirmIncident)}
        title="Confirm Incident Status Change"
        message={
          statusConfirmIncident ? (
            <p>
              Are you sure you want to transition incident{' '}
              <strong className="text-slate-900 dark:text-white font-mono">{statusConfirmIncident.incident.incidentCode}</strong> (
              {statusConfirmIncident.incident.title}) to{' '}
              <strong className="text-brand-700 dark:text-brand-400 uppercase">{statusConfirmIncident.newStatus.replace(/_/g, ' ')}</strong>?
            </p>
          ) : ''
        }
        confirmLabel={`Set to ${statusConfirmIncident?.newStatus.replace(/_/g, ' ') || 'New Status'}`}
        variant={statusConfirmIncident?.newStatus === 'RESOLVED' ? 'success' : 'primary'}
        onConfirm={handleExecuteStatusChange}
        onCancel={() => setStatusConfirmIncident(null)}
      />

      {/* Incident Detail Popup Modal */}
      <IncidentDetailModal
        incident={viewDetailIncident}
        isOpen={Boolean(viewDetailIncident)}
        onClose={() => setViewDetailIncident(null)}
        onEdit={handleOpenEdit}
      />
    </div>
  );
};
