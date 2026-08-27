import React, { useState } from 'react';
import { LostAndFoundItem } from '@/types/service';
import { FormField } from '@/components/ui/FormField';
import { useAuthStore } from '@/stores/useAuthStore';
import { PackageSearch, User, Phone, FileCheck, CheckCircle2 } from 'lucide-react';

interface LostItemClaimModalProps {
  item: LostAndFoundItem;
  onClaimAndReturn: (id: string, name: string, phone: string, verifiedBy: string, notes: string) => Promise<void>;
  onClose: () => void;
}

export const LostItemClaimModal: React.FC<LostItemClaimModalProps> = ({
  item,
  onClaimAndReturn,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [claimantName, setClaimantName] = useState(item.claimantName || '');
  const [claimantPhone, setClaimantPhone] = useState(item.claimantPhone || '');
  const [claimantIdProof, setClaimantIdProof] = useState('Aadhaar / Voter ID verified');
  const [notes, setNotes] = useState('Claimant correctly identified lock screen wallpaper / contents.');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !claimantPhone.trim()) return;

    setIsProcessing(true);
    await onClaimAndReturn(
      item.id,
      claimantName,
      claimantPhone,
      user?.fullName || 'Support Admin',
      `${claimantIdProof}. ${notes}`
    );
    setIsProcessing(false);
    onClose();
  };

  return (
    <form onSubmit={handleReturn} className="space-y-4 text-xs">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1 dark:border-slate-800 dark:bg-slate-900/50">
        <span className="font-mono font-bold text-brand-700 dark:text-brand-400">{item.itemCode}</span>
        <h4 className="font-bold text-slate-900 dark:text-white">{item.itemName}</h4>
        <p className="text-slate-500">{item.description}</p>
        <span className="text-[10px] text-slate-400 block pt-1">
          Depot: {item.custodyDepot} • Found on {item.foundOnRouteCode} ({item.foundOnVehiclePlate})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          label="Claimant Full Name"
          required
          value={claimantName}
          onChange={(e) => setClaimantName(e.target.value)}
          placeholder="e.g. Suresh N."
          icon={User}
        />

        <FormField
          label="Claimant Phone Number"
          required
          type="tel"
          value={claimantPhone}
          onChange={(e) => setClaimantPhone(e.target.value)}
          placeholder="+91 98450 12345"
          icon={Phone}
        />
      </div>

      <FormField
        label="ID Proof Presented for Verification"
        required
        value={claimantIdProof}
        onChange={(e) => setClaimantIdProof(e.target.value)}
        placeholder="e.g. Aadhaar Card / College ID Card"
        icon={FileCheck}
      />

      <FormField
        label="Custody Hand-off & Verification Notes"
        as="textarea"
        rows={2}
        required
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Document verification details..."
      />

      <div className="flex items-center justify-end space-x-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || !claimantName.trim()}
          className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isProcessing ? 'Processing Hand-off...' : 'Verify & Hand-over Item'}</span>
        </button>
      </div>
    </form>
  );
};
