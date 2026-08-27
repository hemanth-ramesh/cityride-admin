import React, { useState, useEffect } from 'react';
import { BusStop, BusStopFacility } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { busStopSchema } from '@/utils/validationSchemas';
import { StopPickerMap } from './StopPickerMap';
import { MapPin, CheckSquare, Square, AlertCircle } from 'lucide-react';

interface StopFormProps {
  initialData?: BusStop | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AVAILABLE_FACILITIES: { id: BusStopFacility; label: string; description: string }[] = [
  { id: 'bus_shelter', label: 'Bus Shelter', description: 'Covered canopy roof' },
  { id: 'seating', label: 'Seating Benches', description: 'Passenger sitting benches' },
  { id: 'lighting', label: 'Solar / Street Lighting', description: 'Night illumination' },
  { id: 'passenger_info_display', label: 'PID Electronic Display', description: 'Live digital ETA board' },
  { id: 'cctv_surveillance', label: 'CCTV Security Camera', description: '24/7 security monitoring' },
  { id: 'wheelchair_accessible', label: 'Wheelchair Ramp', description: 'Barrier-free ramp accessibility' },
  { id: 'drinking_water', label: 'Potable Drinking Water', description: 'Clean drinking water station' },
  { id: 'digital_ticketing', label: 'QR / Digital Smart Pass', description: 'Contactless ticketing support' },
];

export const StopForm: React.FC<StopFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [kannadaName, setKannadaName] = useState('');
  const [stopCode, setStopCode] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(13.3382);
  const [longitude, setLongitude] = useState(77.1012);
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState(45);
  const [facilities, setFacilities] = useState<BusStopFacility[]>(['bus_shelter', 'lighting']);
  const [isActive, setIsActive] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setKannadaName(initialData.kannadaName);
      setStopCode(initialData.stopCode);
      setArea(initialData.area);
      setLandmark(initialData.landmark || '');
      setLatitude(initialData.latitude);
      setLongitude(initialData.longitude);
      setGeofenceRadiusMeters(initialData.geofenceRadiusMeters || 45);
      setFacilities(initialData.facilities || []);
      setIsActive(initialData.isActive !== false);
    } else {
      setStopCode(`TUM_BS_${String(Math.floor(37 + Math.random() * 60)).padStart(3, '0')}`);
    }
  }, [initialData]);

  const toggleFacility = (facilityId: BusStopFacility) => {
    if (facilities.includes(facilityId)) {
      setFacilities(facilities.filter((f) => f !== facilityId));
    } else {
      setFacilities([...facilities, facilityId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = busStopSchema.safeParse({
      name,
      kannadaName,
      latitude: Number(latitude),
      longitude: Number(longitude),
      area,
      landmark,
      geofenceRadiusMeters: Number(geofenceRadiusMeters),
      facilities,
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Validation error');
      return;
    }

    await onSubmit({
      ...result.data,
      stopCode,
      routeIds: initialData?.routeIds || [],
      routeNames: initialData?.routeNames || [],
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Names */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Stop Name (English)"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Town Hall Tumakuru"
          icon={MapPin}
        />

        <FormField
          label="Stop Name (Kannada / ಕನ್ನಡ)"
          required
          value={kannadaName}
          onChange={(e) => setKannadaName(e.target.value)}
          placeholder="e.g. ಟೌನ್ ಹಾಲ್"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Stop Code ID"
          required
          value={stopCode}
          onChange={(e) => setStopCode(e.target.value)}
          placeholder="TUM_BS_001"
        />

        <FormField
          label="Area / Neighborhood"
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="e.g. City Market"
        />

        <FormField
          label="Landmark Reference"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g. Near Post Office"
        />
      </div>

      {/* Interactive Map Coordinate Picker */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <StopPickerMap
          latitude={latitude}
          longitude={longitude}
          geofenceRadius={geofenceRadiusMeters}
          onChangeLocation={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />

        <div className="mt-4 grid grid-cols-3 gap-3">
          <FormField
            label="Latitude"
            type="number"
            step="any"
            required
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
          />

          <FormField
            label="Longitude"
            type="number"
            step="any"
            required
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
          />

          <FormField
            label="Geofence Radius (Meters)"
            type="number"
            required
            value={geofenceRadiusMeters}
            onChange={(e) => setGeofenceRadiusMeters(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Facilities Checkbox Grid */}
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Civic Amenities & Facilities at Stop ({facilities.length} active)
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {AVAILABLE_FACILITIES.map((fac) => {
            const isChecked = facilities.includes(fac.id);
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => toggleFacility(fac.id)}
                className={`flex items-start space-x-2 rounded-xl border p-2.5 text-left transition ${
                  isChecked
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 dark:bg-brand-950/40 dark:text-brand-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                )}
                <div>
                  <span className="text-xs font-bold block">{fac.label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight block">{fac.description}</span>
                </div>
              </button>
            );
          })}
        </div>
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
          {isLoading ? 'Saving...' : initialData ? 'Update Stop' : 'Create Bus Stop'}
        </button>
      </div>
    </form>
  );
};
