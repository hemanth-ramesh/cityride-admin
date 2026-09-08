import React, { useState } from 'react';
import { LostAndFoundItem } from '@/types/service';
import { FormField } from '@/components/ui/FormField';
import { useAuthStore } from '@/stores/useAuthStore';
import { PackageSearch, User, Phone, FileCheck, CheckCircle2, CreditCard } from 'lucide-react';

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
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !claimantPhone.trim() || !idNumber.trim()) return;

    setIsProcessing(true);
    const idProofDetail = `${idType}: ${idNumber.trim()}`;
    const verificationNotes = notes.trim()
      ? `ID Verified (${idProofDetail}). ${notes.trim()}`
      : `ID Verified (${idProofDetail})`;

    await onClaimAndReturn(
      item.id,
      claimantName.trim(),
      claimantPhone.trim(),
      user?.fullName || 'Support Admin',
      verificationNotes
    );
    setIsProcessing(false);
    onClose();
  };

  return (
    <form onSubmit={handleReturn} className="space-y-4 text-xs">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-1 dark:border-slate-800 dark:bg-slate-900/50">
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
          placeholder="Claimant full name"
          icon={User}
        />

        <FormField
          label="Claimant Phone Number"
          required
          type="tel"
          value={claimantPhone}
          onChange={(e) => setClaimantPhone(e.target.value)}
          placeholder="+91 ..."
          icon={Phone}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          label="Select Type of ID"
          as="select"
          required
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          options={[
            { label: 'Aadhaar Card', value: 'Aadhaar Card' },
            { label: 'Voter ID Card', value: 'Voter ID Card' },
            { label: 'Driving License (DL)', value: 'Driving License' },
            { label: 'PAN Card', value: 'PAN Card' },
            { label: 'Passport', value: 'Passport' },
            { label: 'Student / College ID', value: 'Student ID' },
            { label: 'Government / Employee ID', value: 'Employee ID' },
            { label: 'Other Official ID', value: 'Other ID' },
          ]}
          icon={FileCheck}
        />

        <FormField
          label="Enter ID Number"
          required
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Enter ID number"
          icon={CreditCard}
        />
      </div>

      <FormField
        label="Custody Hand-off & Verification Notes"
        as="textarea"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter verification notes..."
      />

      <div className="flex items-center justify-end space-x-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="rounded-full border border-slate-200 bg-white px-5 py-2 font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || !claimantName.trim() || !claimantPhone.trim() || !idNumber.trim()}
          className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-600 px-5 py-2 font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isProcessing ? 'Processing Hand-off...' : 'Verify & Hand-over Item'}</span>
        </button>
      </div>
    </form>
  );
};
