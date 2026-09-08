import React, { useState, useEffect } from 'react';
import { BusStop } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { busStopSchema } from '@/utils/validationSchemas';
import { StopPickerMap } from './StopPickerMap';
import { useRoutes } from '@/hooks/useMasterData';
import { MapPin, AlertCircle, GitFork, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface StopFormProps {
  initialData?: BusStop | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const StopForm: React.FC<StopFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { routes } = useRoutes();
  const [name, setName] = useState('');
  const [kannadaName, setKannadaName] = useState('');
  const [stopCode, setStopCode] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(13.3382);
  const [longitude, setLongitude] = useState(77.1012);
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState(45);
  const [selectedRouteCodes, setSelectedRouteCodes] = useState<string[]>(initialData?.routeIds || []);
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
      setSelectedRouteCodes(initialData.routeIds || []);
      setIsActive(initialData.isActive ?? true);
    } else {
      setName('');
      setKannadaName('');
      setStopCode('');
      setArea('');
      setLandmark('');
      setSelectedRouteCodes([]);
      setIsActive(true);
    }
  }, [initialData]);

  const toggleRoute = (routeCode: string) => {
    if (selectedRouteCodes.includes(routeCode)) {
      setSelectedRouteCodes(selectedRouteCodes.filter((c) => c !== routeCode));
    } else {
      setSelectedRouteCodes([...selectedRouteCodes, routeCode]);
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
      facilities: initialData?.facilities || [],
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Validation error');
      return;
    }

    const matchedRouteNames = routes
      .filter((r) => selectedRouteCodes.includes(r.routeCode))
      .map((r) => r.routeName);

    await onSubmit({
      ...result.data,
      stopCode,
      routeIds: selectedRouteCodes,
      routeNames: matchedRouteNames,
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

      {/* Routes Served Multi-Selector */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitFork className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <label className="text-xs font-bold text-slate-900 dark:text-white">
              Transit Routes Serving this Stop ({selectedRouteCodes.length} assigned)
            </label>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedRouteCodes(routes.map((r) => r.routeCode))}
              className="font-semibold text-brand-600 hover:underline dark:text-brand-400 cursor-pointer"
            >
              Select All
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={() => setSelectedRouteCodes([])}
              className="text-slate-400 hover:text-slate-600 hover:underline dark:hover:text-slate-300 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Select which bus routes stop at this station. Click route badges to assign or unassign.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
          {routes.map((route) => {
            const isSelected = selectedRouteCodes.includes(route.routeCode);
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => toggleRoute(route.routeCode)}
                className={clsx(
                  'flex items-center space-x-2.5 rounded-xl border p-2 text-left transition-all active:scale-95 cursor-pointer',
                  isSelected
                    ? 'border-brand-500 bg-white shadow-xs dark:bg-slate-800 ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'
                )}
              >
                <span
                  style={{ backgroundColor: route.colorHex || '#059669' }}
                  className="flex h-6 min-w-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-black text-white"
                >
                  {route.routeCode}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                    {route.routeName.split('↔')[0].trim()}
                  </span>
                  <span className="block truncate text-[10px] text-slate-400">
                    {isSelected ? '✓ Serving' : 'Not Serving'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
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
