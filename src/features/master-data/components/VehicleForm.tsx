import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, BusFleetType } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { vehicleSchema } from '@/utils/validationSchemas';
import { Bus, Hash, Calendar, AlertCircle } from 'lucide-react';

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fleetNumber, setFleetNumber] = useState('');
  const [fleetType, setFleetType] = useState<BusFleetType>('City Regular Eco');
  const [status, setStatus] = useState<VehicleStatus>('active');
  const [depotId, setDepotId] = useState('DEPOT_01_CENTRAL');
  const [manufactureYear, setManufactureYear] = useState<number | ''>('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setRegistrationNumber(initialData.registrationNumber);
      setFleetNumber(initialData.fleetNumber);
      setFleetType(initialData.fleetType);
      setStatus(initialData.status);
      setDepotId(initialData.depotId || 'DEPOT_01_CENTRAL');
      setManufactureYear(initialData.manufactureYear);
      setNextServiceDate(initialData.nextServiceDate);
    } else {
      setRegistrationNumber('');
      setFleetNumber('');
      setManufactureYear('');
      setNextServiceDate('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const plateFormatted = registrationNumber.toUpperCase().trim();
    const result = vehicleSchema.safeParse({
      registrationNumber: plateFormatted,
      fleetNumber,
      fleetType,
      manufacturer: 'Tata Motors Transit',
      modelYear: Number(manufactureYear),
      fuelType: 'DIESEL',
      depotId,
      depotName: depotId === 'DEPOT_01_CENTRAL' ? 'Tumakuru Central Depot 1' : 'Industrial Depot 2',
      status,
      isAirConditioned: false,
      hasWheelchairRamp: true,
      hasCctv: true,
      hasPanicButtons: true,
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Validation error');
      return;
    }

    await onSubmit({
      registrationNumber: plateFormatted,
      fleetNumber,
      fleetType,
      capacity: initialData?.capacity || 42,
      seatingCapacity: initialData?.seatingCapacity || 32,
      standingCapacity: initialData?.standingCapacity || 10,
      status,
      depotId,
      depotName: depotId === 'DEPOT_01_CENTRAL' ? 'Tumakuru Central Depot 1' : 'Industrial Depot 2',
      isElectric: false,
      hasAc: false,
      manufactureYear: Number(manufactureYear),
      nextServiceDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Registration Plate Number (RTO)"
          required
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder="e.g. KA 06 F 8558"
          icon={Bus}
        />

        <FormField
          label="Bus Unit #"
          required
          value={fleetNumber}
          onChange={(e) => setFleetNumber(e.target.value)}
          placeholder="e.g. CR-TUM-01"
          icon={Hash}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Home Depot"
          as="select"
          required
          value={depotId}
          onChange={(e) => setDepotId(e.target.value)}
          options={[
            { label: 'Central Depot 1 (Tumakuru Town)', value: 'DEPOT_01_CENTRAL' },
            { label: 'Depot 2 (Melekote Industrial)', value: 'DEPOT_02_INDUSTRIAL' },
          ]}
        />

        <FormField
          label="Operational Status"
          as="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as VehicleStatus)}
          options={[
            { label: 'Active (In Operation / Available)', value: 'active' },
            { label: 'Maintenance (Depot Service)', value: 'maintenance' },
            { label: 'Inactive (Standby)', value: 'inactive' },
            { label: 'Decommissioned', value: 'decommissioned' },
          ]}
        />
      </div>



      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Year of Manufacture"
          type="number"
          value={manufactureYear}
          placeholder="e.g. 2024"
          onChange={(e) => setManufactureYear(e.target.value === '' ? '' : Number(e.target.value))}
          icon={Calendar}
        />

        <FormField
          label="Next Service Inspection"
          type="date"
          value={nextServiceDate}
          onChange={(e) => setNextServiceDate(e.target.value)}
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
          {isLoading ? 'Saving...' : initialData ? 'Update Vehicle' : 'Register Vehicle'}
        </button>
      </div>
    </form>
  );
};
