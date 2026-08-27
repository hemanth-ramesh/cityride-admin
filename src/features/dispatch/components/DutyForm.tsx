import React, { useState, useEffect } from 'react';
import { Duty, ShiftType, SHIFT_CONFIGS } from '@/types/dispatch';
import { Driver, Vehicle, TransitRoute } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { dutySchema } from '@/utils/validationSchemas';
import { CalendarDays, Clock, User, Bus, GitFork, AlertCircle } from 'lucide-react';

interface DutyFormProps {
  initialData?: Duty | null;
  existingDuties: Duty[];
  drivers: Driver[];
  vehicles: Vehicle[];
  routes: TransitRoute[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DutyForm: React.FC<DutyFormProps> = ({
  initialData,
  existingDuties,
  drivers,
  vehicles,
  routes,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<ShiftType>('MORNING');
  const [driverId, setDriverId] = useState(drivers[0]?.id || '');
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [routeId, setRouteId] = useState(routes[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Duty['status']>('scheduled');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setShift(initialData.shift);
      setDriverId(initialData.driverId);
      setVehicleId(initialData.vehicleId);
      setRouteId(initialData.routeId);
      setNotes(initialData.notes || '');
      setStatus(initialData.status);
    }
  }, [initialData]);

  const shiftConfig = SHIFT_CONFIGS[shift];
  const selectedDriver = drivers.find((d) => d.id === driverId);
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
  const selectedRoute = routes.find((r) => r.id === routeId);

  // Conflict Checking: Is driver or vehicle already double-assigned for same date & shift?
  const driverConflict = existingDuties.find(
    (d) =>
      d.id !== initialData?.id &&
      d.date === date &&
      d.shift === shift &&
      d.driverId === driverId &&
      d.status !== 'cancelled'
  );

  const vehicleConflict = existingDuties.find(
    (d) =>
      d.id !== initialData?.id &&
      d.date === date &&
      d.shift === shift &&
      d.vehicleId === vehicleId &&
      d.status !== 'cancelled'
  );

  const hasConflict = Boolean(driverConflict || vehicleConflict);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = dutySchema.safeParse({
      dutyDate: date,
      shiftType: shift,
      driverId,
      vehicleId,
      routeId,
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Validation error');
      return;
    }

    if (!selectedDriver || !selectedVehicle || !selectedRoute) {
      setValidationError('Please ensure driver, vehicle, and route are all selected.');
      return;
    }

    await onSubmit({
      date,
      shift,
      startTime: shiftConfig.startTime,
      endTime: shiftConfig.endTime,
      driverId: selectedDriver.id,
      driverName: selectedDriver.fullName,
      driverCode: selectedDriver.driverCode,
      driverPhone: selectedDriver.phone,
      vehicleId: selectedVehicle.id,
      plateNumber: selectedVehicle.registrationNumber,
      fleetNumber: selectedVehicle.fleetNumber,
      routeId: selectedRoute.id,
      routeCode: selectedRoute.routeCode,
      routeName: selectedRoute.routeName,
      status,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date & Shift */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Duty Roster Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={CalendarDays}
        />

        <FormField
          label="Operational Shift"
          as="select"
          required
          value={shift}
          onChange={(e) => setShift(e.target.value as ShiftType)}
          options={[
            { label: 'Morning Shift (05:30 – 14:00)', value: 'MORNING' },
            { label: 'Evening Shift (13:45 – 22:15)', value: 'EVENING' },
            { label: 'Full Day Shift (06:00 – 20:30)', value: 'FULL_DAY' },
            { label: 'Night Feeder Shift (21:30 – 06:00)', value: 'NIGHT_FEEDER' },
          ]}
          icon={Clock}
        />
      </div>

      {/* Driver, Vehicle, Route Selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Assigned Driver"
          as="select"
          required
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          options={drivers.map((d) => ({
            label: `${d.fullName} (${d.driverCode})`,
            value: d.id,
          }))}
          icon={User}
        />

        <FormField
          label="Assigned Bus Vehicle"
          as="select"
          required
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          options={vehicles.map((v) => ({
            label: `${v.registrationNumber} (${v.fleetNumber})`,
            value: v.id,
          }))}
          icon={Bus}
        />

        <FormField
          label="Assigned Transit Route"
          as="select"
          required
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          options={routes.map((r) => ({
            label: `${r.routeCode} — ${r.routeName.split('↔')[0].trim()}`,
            value: r.id,
          }))}
          icon={GitFork}
        />
      </div>

      {/* Conflicts Warnings */}
      {driverConflict && (
        <div className="flex items-center space-x-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span>
            Conflict: Driver <strong>{selectedDriver?.fullName}</strong> is already assigned to {driverConflict.routeCode} on {shift} shift!
          </span>
        </div>
      )}

      {vehicleConflict && (
        <div className="flex items-center space-x-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
          <span>
            Conflict: Vehicle <strong>{selectedVehicle?.registrationNumber}</strong> is already allocated to duty on {shift} shift!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Duty Status"
          as="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          options={[
            { label: 'Scheduled (Planned)', value: 'scheduled' },
            { label: 'In Progress (Active Now)', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ]}
        />

        <FormField
          label="Special Operational Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Electric bus full charge verified at 05:00"
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
          disabled={isLoading || hasConflict}
          className="rounded-xl bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Duty' : 'Create Duty Assignment'}
        </button>
      </div>
    </form>
  );
};
