import React, { useState, useEffect } from 'react';
import { IncidentReport, IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/safety';
import { FormField } from '@/components/ui/FormField';
import { incidentSchema } from '@/utils/validationSchemas';
import { useVehicles, useDrivers, useRoutes } from '@/hooks/useMasterData';
import { useAuthStore } from '@/stores/useAuthStore';
import { AlertTriangle, MapPin, Bus, User, GitFork, Shield, AlertCircle } from 'lucide-react';

interface IncidentFormProps {
  initialData?: IncidentReport | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  const { routes } = useRoutes();
  const { user } = useAuthStore();

  const [category, setCategory] = useState<IncidentCategory>('TRAFFIC_GRIDLOCK');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [status, setStatus] = useState<IncidentStatus>('REPORTED');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [vehicleId, setVehicleId] = useState(initialData?.vehicleId || '');
  const [driverId, setDriverId] = useState(initialData?.driverId || '');
  const [routeCode, setRouteCode] = useState(initialData?.routeCode || '');
  const [locationLandmark, setLocationLandmark] = useState(initialData?.locationLandmark || '');
  const [latitude, setLatitude] = useState(initialData?.latitude || 13.3382);
  const [longitude, setLongitude] = useState(initialData?.longitude || 77.1012);
  const [actionTaken, setActionTaken] = useState(initialData?.actionTaken || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setSeverity(initialData.severity);
      setStatus(initialData.status);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setVehicleId(initialData.vehicleId || '');
      setDriverId(initialData.driverId || '');
      setRouteCode(initialData.routeCode || '');
      setLocationLandmark(initialData.locationLandmark);
      setLatitude(initialData.latitude);
      setLongitude(initialData.longitude);
      setActionTaken(initialData.actionTaken || '');
    } else {
      setTitle('');
      setDescription('');
      setVehicleId('');
      setDriverId('');
      setRouteCode('');
      setLocationLandmark('');
      setActionTaken('');
    }
  }, [initialData]);

  const selectedVehicleObj = vehicles.find((v) => v.id === vehicleId);
  const selectedDriverObj = drivers.find((d) => d.id === driverId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = incidentSchema.safeParse({
      headline: title,
      category,
      severity,
      routeCode,
      vehiclePlate: selectedVehicleObj?.registrationNumber,
      driverName: selectedDriverObj?.fullName,
      locationLandmark,
      description,
      actionTaken,
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Validation error');
      return;
    }

    await onSubmit({
      category,
      severity,
      status,
      title,
      description,
      vehicleId: selectedVehicleObj?.id,
      plateNumber: selectedVehicleObj?.registrationNumber,
      driverId: selectedDriverObj?.id,
      driverName: selectedDriverObj?.fullName,
      routeCode,
      locationLandmark,
      latitude: Number(latitude),
      longitude: Number(longitude),
      actionTaken,
      reportedBy: user?.fullName || 'OCC Operations Desk',
      resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          {validationError}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Incident Category"
          as="select"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as IncidentCategory)}
          options={[
            { label: 'Traffic Gridlock / Congestion', value: 'TRAFFIC_GRIDLOCK' },
            { label: 'Vehicle Mechanical Breakdown', value: 'VEHICLE_BREAKDOWN' },
            { label: 'Road Accident / Collision', value: 'ROAD_ACCIDENT' },
            { label: 'Route Blockage / Road Closure', value: 'ROUTE_BLOCKAGE' },
            { label: 'Medical Emergency on Board', value: 'MEDICAL_EMERGENCY' },
            { label: 'Security / Passenger Dispute', value: 'SECURITY_VANDALISM' },
            { label: 'Severe Weather / Flooding', value: 'WEATHER_FLOODING' },
          ]}
          icon={AlertTriangle}
        />

        <FormField
          label="Severity Level"
          as="select"
          required
          value={severity}
          onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
          options={[
            { label: 'Low (Advisory Only)', value: 'LOW' },
            { label: 'Medium (Schedule Impact <15m)', value: 'MEDIUM' },
            { label: 'High (Corridor Interruption)', value: 'HIGH' },
            { label: 'Critical (Immediate Dispatch)', value: 'CRITICAL' },
          ]}
        />

        <FormField
          label="Workflow Status"
          as="select"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value as IncidentStatus)}
          options={[
            { label: 'Reported (Pending Review)', value: 'REPORTED' },
            { label: 'Investigating (Under Assessment)', value: 'INVESTIGATING' },
            { label: 'Action Taken (Remedy En Route)', value: 'ACTION_TAKEN' },
            { label: 'Resolved (Closed)', value: 'RESOLVED' },
          ]}
        />
      </div>

      <FormField
        label="Incident Headline / Summary"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter incident headline / summary"
      />

      <FormField
        label="Detailed Situation Description"
        as="textarea"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Enter situation details..."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Affected Transit Corridor"
          as="search-select"
          value={routeCode}
          onChange={(e) => setRouteCode(e.target.value)}
          options={[
            { label: 'None / Network Wide', value: '' },
            ...routes.map((r) => ({
              label: `${r.routeCode} — ${r.routeName.split('↔')[0].trim()}`,
              value: r.routeCode,
            })),
          ]}
          placeholder="Search corridor (e.g. R01)..."
          icon={GitFork}
        />

        <FormField
          label="Involved Bus (Optional)"
          as="search-select"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          options={[
            { label: 'None / Corridor Wide', value: '' },
            ...vehicles.map((v) => ({
              label: `${v.registrationNumber} (${v.fleetNumber})`,
              value: v.id,
            })),
          ]}
          placeholder="Search bus (e.g. KA 06, 8558)..."
          icon={Bus}
        />

        <FormField
          label="Reporting Driver (Optional)"
          as="search-select"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          options={[
            { label: 'None / Officer Reported', value: '' },
            ...drivers.map((d) => ({
              label: `${d.fullName} (${d.driverCode})`,
              value: d.id,
            })),
          ]}
          placeholder="Search driver name or code..."
          icon={User}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Location Landmark"
          required
          value={locationLandmark}
          onChange={(e) => setLocationLandmark(e.target.value)}
          placeholder="Enter landmark or location"
          icon={MapPin}
          containerClassName="sm:col-span-2"
        />

        <FormField
          label="Action Taken / Resolution Plan"
          value={actionTaken}
          onChange={(e) => setActionTaken(e.target.value)}
          placeholder="Enter action taken or resolution notes"
        />
      </div>

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
          {isLoading ? 'Saving...' : initialData ? 'Update Incident' : 'File Incident Report'}
        </button>
      </div>
    </form>
  );
};
