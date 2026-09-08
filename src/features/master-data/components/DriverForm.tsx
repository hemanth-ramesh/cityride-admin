import React, { useState, useEffect } from 'react';
import { Driver, DriverStatus } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { driverSchema } from '@/utils/validationSchemas';
import { User, Phone, CreditCard, Building2, Droplet, AlertCircle } from 'lucide-react';

interface DriverFormProps {
  initialData?: Driver | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [driverCode, setDriverCode] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [depotId, setDepotId] = useState('DEPOT_01_CENTRAL');
  const [status, setStatus] = useState<DriverStatus>('active');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setDriverCode(initialData.driverCode);
      setPhone(initialData.phone);
      setLicenseNumber(initialData.licenseNumber);
      setLicenseExpiry(initialData.licenseExpiry);
      setDepotId(initialData.depotId || 'DEPOT_01_CENTRAL');
      setStatus(initialData.status);
      setBloodGroup(initialData.bloodGroup || 'O+');
    } else {
      setFullName('');
      setDriverCode('');
      setPhone('');
      setLicenseNumber('');
      setLicenseExpiry('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = driverSchema.safeParse({
      fullName,
      phone,
      licenseNumber,
      licenseExpiry,
      depotId,
      depotName: depotId === 'DEPOT_01_CENTRAL' ? 'Tumakuru Central Depot 1' : 'Industrial Depot 2',
      status,
      bloodGroup,
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Validation error');
      return;
    }

    await onSubmit({
      ...result.data,
      driverCode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Ramesh Chandra"
          icon={User}
        />

        <FormField
          label="Driver Code / Employee ID"
          required
          value={driverCode}
          onChange={(e) => setDriverCode(e.target.value)}
          placeholder="TUM-DRV-1042"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Phone Number"
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98450 12345"
          icon={Phone}
        />

        <FormField
          label="Driving License Number"
          required
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          placeholder="KA06 20180001234"
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="License Expiry"
          type="date"
          required
          value={licenseExpiry}
          onChange={(e) => setLicenseExpiry(e.target.value)}
        />

        <FormField
          label="Assigned Depot"
          as="select"
          required
          value={depotId}
          onChange={(e) => setDepotId(e.target.value)}
          options={[
            { label: 'Central Depot 1 (Tumakuru Town)', value: 'DEPOT_01_CENTRAL' },
            { label: 'Depot 2 (Melekote Industrial)', value: 'DEPOT_02_INDUSTRIAL' },
          ]}
          icon={Building2}
        />

        <FormField
          label="Blood Group"
          as="select"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          options={[
            { label: 'O+', value: 'O+' },
            { label: 'O-', value: 'O-' },
            { label: 'A+', value: 'A+' },
            { label: 'A-', value: 'A-' },
            { label: 'B+', value: 'B+' },
            { label: 'B-', value: 'B-' },
            { label: 'AB+', value: 'AB+' },
            { label: 'AB-', value: 'AB-' },
          ]}
          icon={Droplet}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Employment Status"
          as="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as DriverStatus)}
          options={[
            { label: 'Active (Available for Duty)', value: 'active' },
            { label: 'On Duty (Assigned / En Route)', value: 'on_duty' },
            { label: 'Off Duty (Rest Shift)', value: 'off_duty' },
            { label: 'Suspended (Temporary Hold)', value: 'suspended' },
            { label: 'On Leave', value: 'on_leave' },
          ]}
        />
      </div>

      {validationError && (
        <div className="flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Driver' : 'Register Driver'}
        </button>
      </div>
    </form>
  );
};
