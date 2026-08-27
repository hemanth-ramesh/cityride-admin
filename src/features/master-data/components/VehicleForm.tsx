import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, BusFleetType } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { vehicleSchema } from '@/utils/validationSchemas';
import { Bus, Hash, Layers, Users, Zap, Snowflake, Calendar, AlertCircle } from 'lucide-react';

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const FLEET_TYPES: BusFleetType[] = [
  'AC Volvo Electric',
  'City Regular Eco',
  'Smart Feeder Electric',
  'Industrial Express',
  'City Connector',
  'Suburban Shuttle',
  'Pilgrim Special',
];

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fleetNumber, setFleetNumber] = useState('');
  const [fleetType, setFleetType] = useState<BusFleetType>('City Regular Eco');
  const [capacity, setCapacity] = useState(42);
  const [seatingCapacity, setSeatingCapacity] = useState(32);
  const [standingCapacity, setStandingCapacity] = useState(10);
  const [status, setStatus] = useState<VehicleStatus>('active');
  const [depotId, setDepotId] = useState('DEPOT_01_CENTRAL');
  const [isElectric, setIsElectric] = useState(false);
  const [hasAc, setHasAc] = useState(false);
  const [manufactureYear, setManufactureYear] = useState(2023);
  const [nextServiceDate, setNextServiceDate] = useState('2026-10-01');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setRegistrationNumber(initialData.registrationNumber);
      setFleetNumber(initialData.fleetNumber);
      setFleetType(initialData.fleetType);
      setCapacity(initialData.capacity);
      setSeatingCapacity(initialData.seatingCapacity);
      setStandingCapacity(initialData.standingCapacity);
      setStatus(initialData.status);
      setDepotId(initialData.depotId || 'DEPOT_01_CENTRAL');
      setIsElectric(initialData.isElectric);
      setHasAc(initialData.hasAc);
      setManufactureYear(initialData.manufactureYear);
      setNextServiceDate(initialData.nextServiceDate);
    } else {
      const randomId = Math.floor(10 + Math.random() * 90);
      setRegistrationNumber(`KA 06 F ${Math.floor(1000 + Math.random() * 9000)}`);
      setFleetNumber(`CR-TUM-${randomId}`);
    }
  }, [initialData]);

  // Sync Electric / AC defaults on fleet type change
  const handleFleetTypeChange = (type: BusFleetType) => {
    setFleetType(type);
    if (type.includes('Electric')) setIsElectric(true);
    if (type.includes('AC')) setHasAc(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const plateFormatted = registrationNumber.toUpperCase().trim();
    const result = vehicleSchema.safeParse({
      registrationNumber: plateFormatted,
      fleetNumber,
      fleetType,
      seatingCapacity: Number(seatingCapacity),
      standingCapacity: Number(standingCapacity),
      manufacturer: isElectric ? 'Olectra Greentech' : 'Tata Motors Transit',
      modelYear: Number(manufactureYear),
      fuelType: isElectric ? 'ELECTRIC' : 'DIESEL',
      depotId,
      depotName: depotId === 'DEPOT_01_CENTRAL' ? 'Tumakuru Central Depot 1' : 'Industrial Depot 2',
      status,
      isAirConditioned: hasAc,
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
      capacity: Number(seatingCapacity) + Number(standingCapacity),
      seatingCapacity: Number(seatingCapacity),
      standingCapacity: Number(standingCapacity),
      status,
      depotId,
      depotName: depotId === 'DEPOT_01_CENTRAL' ? 'Tumakuru Central Depot 1' : 'Industrial Depot 2',
      isElectric,
      hasAc,
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
          placeholder="KA 06 F 8558"
          icon={Bus}
          helperText="Standard Karnataka transport registration format"
        />

        <FormField
          label="Fleet Code / Bus Unit #"
          required
          value={fleetNumber}
          onChange={(e) => setFleetNumber(e.target.value)}
          placeholder="CR-TUM-01"
          icon={Hash}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Fleet Model / Class"
          as="select"
          required
          value={fleetType}
          onChange={(e) => handleFleetTypeChange(e.target.value as BusFleetType)}
          options={FLEET_TYPES.map((t) => ({ label: t, value: t }))}
          icon={Layers}
        />

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
      </div>

      {/* Capacities */}
      <div className="grid grid-cols-3 gap-3">
        <FormField
          label="Total Capacity"
          type="number"
          required
          value={capacity}
          onChange={(e) => {
            const cap = Number(e.target.value);
            setCapacity(cap);
            setSeatingCapacity(Math.round(cap * 0.75));
            setStandingCapacity(Math.round(cap * 0.25));
          }}
          icon={Users}
        />

        <FormField
          label="Seating"
          type="number"
          value={seatingCapacity}
          onChange={(e) => setSeatingCapacity(Number(e.target.value))}
        />

        <FormField
          label="Standing"
          type="number"
          value={standingCapacity}
          onChange={(e) => setStandingCapacity(Number(e.target.value))}
        />
      </div>

      {/* Features & Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

        <FormField
          label="Year of Manufacture"
          type="number"
          value={manufactureYear}
          onChange={(e) => setManufactureYear(Number(e.target.value))}
          icon={Calendar}
        />

        <FormField
          label="Next Service Inspection"
          type="date"
          value={nextServiceDate}
          onChange={(e) => setNextServiceDate(e.target.value)}
        />
      </div>

      {/* Electric & AC Checkboxes */}
      <div className="flex items-center space-x-6 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
        <label className="flex cursor-pointer items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={isElectric}
            onChange={(e) => setIsElectric(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <Zap className="h-4 w-4 text-emerald-500" />
          <span>Electric Propulsion (EV)</span>
        </label>

        <label className="flex cursor-pointer items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={hasAc}
            onChange={(e) => setHasAc(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <Snowflake className="h-4 w-4 text-blue-500" />
          <span>Air Conditioned (AC)</span>
        </label>
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
