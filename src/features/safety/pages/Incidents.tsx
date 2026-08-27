import React, { useState } from 'react';
import { useSafety } from '@/hooks/useSafety';
import { IncidentReport, IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/safety';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IncidentForm } from '../components/IncidentForm';
import { SafetyNavigationTabs } from '../components/SafetyNavigationTabs';
import { TableColumn } from '@/types';
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
        return <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white uppercase">Critical</span>;
      case 'HIGH':
        return <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white uppercase">High</span>;
      case 'MEDIUM':
        return <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">Medium</span>;
      case 'LOW':
        return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">Low</span>;
    }
  };

  const columns: TableColumn<IncidentReport>[] = [
    {
      key: 'incidentCode',
      header: 'Incident Code',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-white">{row.incidentCode}</span>
          <span className="text-[10px] text-slate-400">
            {new Date(row.reportedAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Incident Title & Category',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white">{row.title}</span>
            {getSeverityBadge(row.severity)}
          </div>
          <span className="text-[11px] text-slate-500 truncate max-w-sm">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'locationLandmark',
      header: 'Location & Corridor',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="flex items-center space-x-1 font-semibold text-slate-800 dark:text-slate-200">
            <MapPin className="h-3 w-3 text-rose-500 flex-shrink-0" />
            <span className="truncate max-w-[160px]">{row.locationLandmark}</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Route: {row.routeCode || 'City Network'} {row.plateNumber && `• ${row.plateNumber}`}
          </span>
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
              className="rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 transition"
            >
              Investigate
            </button>
          )}
          {row.status === 'INVESTIGATING' && (
            <button
              onClick={() => setStatusConfirmIncident({ incident: row, newStatus: 'ACTION_TAKEN' })}
              className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 transition"
            >
              Take Action
            </button>
          )}
          {row.status === 'ACTION_TAKEN' && (
            <button
              onClick={() => setStatusConfirmIncident({ incident: row, newStatus: 'RESOLVED' })}
              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
            >
              Resolve
            </button>
          )}
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
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
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-brand-700 dark:text-brand-400" />
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
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span>File Incident Report</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Logged Incidents</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalIncidents}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase dark:text-amber-400">Active / Under Action</span>
          <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">{activeIncidents}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm dark:border-rose-950 dark:bg-rose-950/20">
          <span className="text-[11px] font-semibold text-rose-700 uppercase dark:text-rose-400">High / Critical Priority</span>
          <p className="mt-1 text-2xl font-black text-rose-800 dark:text-rose-300">{criticalCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Resolved Today</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{resolvedCount}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['ALL', 'REPORTED', 'INVESTIGATING', 'ACTION_TAKEN', 'RESOLVED'].map((filter) => (
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
        description="Provide details, severity level, affected transit lines, and resolution instructions."
        size="lg"
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
    </div>
  );
};
