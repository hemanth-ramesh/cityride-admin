import React, { useState } from 'react';
import { useLostAndFound } from '@/hooks/useServiceOperations';
import { LostAndFoundItem, LostItemStatus } from '@/types/service';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { KPICard } from '@/components/ui/KPICard';
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

const CATEGORY_LABELS: Record<string, string> = {
  ELECTRONICS_AND_PHONES: 'Electronics & Mobile Phones',
  BAGS_AND_WALLETS: 'Bags, Backpacks & Wallets',
  DOCUMENTS_AND_CARDS: 'Official Documents & ID Cards',
  KEYS: 'Keys & Keychains',
  CLOTHING_AND_APPAREL: 'Clothing & Apparel',
  BOOKS_AND_STATIONERY: 'Books & Stationery',
  OTHER: 'Other Items',
};

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
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-xs text-slate-900 dark:text-white">
          {CATEGORY_LABELS[row.category] || row.category.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'custodyDepot',
      header: 'Locker Custody & Transit Line',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200">{row.custodyDepot}</span>
          <span className="text-[10px] text-slate-400">
            Found on {row.foundOnRouteCode || 'Route R01'} ({row.foundOnVehiclePlate || 'Transit Bus'})
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
              className="inline-flex items-center space-x-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
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
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-xs">
            <PackageSearch className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lost & Found Custody
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Administrative locker registry: secure vetting, passenger claimant verification, and release receipts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setFormModalOpen(true)}
          className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Log Found Item</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard
          title="TOTAL ITEMS REGISTERED"
          value={totalItems}
          status="info"
          icon={PackageSearch}
        />
        <KPICard
          title="IN DEPOT CUSTODY"
          value={inCustodyCount}
          status="warning"
          icon={Building2}
        />
        <KPICard
          title="RETURNED TO PASSENGERS"
          value={returnedCount}
          status="teal"
          icon={CheckCircle2}
        />
      </div>

      {/* Status Filter Tabs - iOS Segmented Control */}
      <div className="inline-flex max-w-full overflow-x-auto items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 backdrop-blur-md">
        {['ALL', 'FOUND_IN_CUSTODY', 'VERIFIED', 'RETURNED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
              statusFilter === filter
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200'
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
