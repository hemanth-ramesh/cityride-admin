import React, { useState } from 'react';
import { useLostAndFound } from '@/hooks/useServiceOperations';
import { LostAndFoundItem, LostItemStatus } from '@/types/service';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { LostItemForm } from '../components/LostItemForm';
import { LostItemClaimModal } from '../components/LostItemClaimModal';
import { ServiceNavigationTabs } from '../components/ServiceNavigationTabs';
import { TableColumn } from '@/types';
import {
  PackageSearch,
  Plus,
  CheckCircle2,
  Building2,
  Phone,
  User,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export const LostAndFound: React.FC = () => {
  const { lostItems, isLoading, createLostItem, claimAndReturn } = useLostAndFound();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [claimingItem, setClaimingItem] = useState<LostAndFoundItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleCreateSubmit = async (formData: any) => {
    await createLostItem(formData);
    setFormModalOpen(false);
  };

  const handleClaimAndReturn = async (
    id: string,
    name: string,
    phone: string,
    verifiedBy: string,
    notes: string
  ) => {
    await claimAndReturn({ id, claimantName: name, claimantPhone: phone, verifiedBy, notes });
    setClaimingItem(null);
  };

  const filteredItems = statusFilter === 'ALL'
    ? lostItems
    : lostItems.filter((i) => i.status === statusFilter);

  // Metrics
  const totalItems = lostItems.length;
  const inCustodyCount = lostItems.filter((i) => i.status === 'FOUND_IN_CUSTODY' || i.status === 'VERIFIED').length;
  const returnedCount = lostItems.filter((i) => i.status === 'RETURNED').length;

  const columns: TableColumn<LostAndFoundItem>[] = [
    {
      key: 'itemCode',
      header: 'Item # / Date',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-white">{row.itemCode}</span>
          <span className="text-[10px] text-slate-400">
            {new Date(row.reportedAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'itemName',
      header: 'Item Description & Category',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white">{row.itemName}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {row.category.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 truncate max-w-sm">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'custodyDepot',
      header: 'Locker Custody & Transit Line',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200">{row.custodyDepot}</span>
          <span className="text-[10px] text-slate-400">
            Found on {row.foundOnRouteCode || 'Route R01'} ({row.foundOnVehiclePlate || 'Fleet Bus'})
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Custody Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status === 'RETURNED' ? 'active' : row.status === 'FOUND_IN_CUSTODY' ? 'maintenance' : 'on_duty'}
          label={row.status.replace(/_/g, ' ')}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Hand-off Action',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1.5">
          {row.status !== 'RETURNED' ? (
            <button
              onClick={() => setClaimingItem(row)}
              className="inline-flex items-center space-x-1 rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-brand-800"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verify & Return</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Handed to {row.claimantName}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <ServiceNavigationTabs />

      {/* Header & Log Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <PackageSearch className="h-6 w-6 text-brand-700 dark:text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
              Lost & Found Custody Operations
            </h1>
          </div>
          <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
            Administrative locker registry: secure vetting, passenger claimant verification, and signed release receipts.
          </p>
        </div>

        <button
          onClick={() => setFormModalOpen(true)}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          <span>Log Found Item</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-occ-darkCard">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Items Registered</span>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalItems}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase dark:text-amber-400">In Depot Custody</span>
          <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">{inCustodyCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">Returned to Passengers</span>
          <p className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{returnedCount}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['ALL', 'FOUND_IN_CUSTODY', 'VERIFIED', 'RETURNED'].map((filter) => (
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
        data={filteredItems}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search item title, category, code, depot, claimant..."
      />

      {/* Register Item Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Log Found Transit Item into Custody"
        description="Record item category, description, discovery bus, and depot safe location."
        size="lg"
      >
        <LostItemForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setFormModalOpen(false)}
          isLoading={false}
        />
      </Modal>

      {/* Claim & Return Modal */}
      <Modal
        isOpen={Boolean(claimingItem)}
        onClose={() => setClaimingItem(null)}
        title="Claimant Verification & Hand-off Receipt"
        description="Verify passenger identity proof and issue custody release voucher."
        size="md"
      >
        {claimingItem && (
          <LostItemClaimModal
            item={claimingItem}
            onClaimAndReturn={handleClaimAndReturn}
            onClose={() => setClaimingItem(null)}
          />
        )}
      </Modal>
    </div>
  );
};
