import React, { useState, useEffect } from 'react';
import { RouteSchedule, TimetableSlot, TransitRoute } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import { Clock, Plus, Trash2, Bus, User, Calendar } from 'lucide-react';

interface ScheduleFormProps {
  initialData?: RouteSchedule | null;
  routes: TransitRoute[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialData,
  routes,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [routeId, setRouteId] = useState(initialData?.routeId || '');
  const [direction, setDirection] = useState<'FORWARD' | 'REVERSE'>(initialData?.direction || 'FORWARD');
  const [effectiveFrom, setEffectiveFrom] = useState(initialData?.effectiveFrom || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(initialData?.status || 'active');

  const [slots, setSlots] = useState<TimetableSlot[]>(initialData?.slots || []);

  const [newDepTime, setNewDepTime] = useState('');
  const [newArrTime, setNewArrTime] = useState('');
  const [newFreq, setNewFreq] = useState<'WEEKDAY' | 'WEEKEND' | 'ALL_DAYS'>('ALL_DAYS');

  useEffect(() => {
    if (initialData) {
      setRouteId(initialData.routeId);
      setDirection(initialData.direction);
      setEffectiveFrom(initialData.effectiveFrom);
      setStatus(initialData.status);
      setSlots(initialData.slots || []);
    } else {
      setRouteId('');
      setDirection('FORWARD');
      setEffectiveFrom(new Date().toISOString().split('T')[0]);
      setStatus('active');
      setSlots([]);
    }
  }, [initialData]);

  const selectedRouteObj = routes.find((r) => r.id === routeId);

  const handleAddSlot = () => {
    if (!newDepTime) return;
    const tripCode = `${selectedRouteObj?.routeCode || 'R01'}-${newDepTime.replace(':', '')}`;
    const newSlot: TimetableSlot = {
      id: `slot-${Date.now()}`,
      tripCode,
      departureTime: newDepTime,
      arrivalTime: newArrTime,
      frequencyType: newFreq,
      status: 'active',
    };
    const updated = [...slots, newSlot].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    setSlots(updated);
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots(slots.filter((s) => s.id !== slotId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteObj) return;

    // Generate stop arrival timetable from selected route
    const stopArrivalTimetable = (selectedRouteObj.stops || []).map((s, idx) => {
      const baseHour = 8;
      const arrivalMin = idx * 4;
      const depMin = arrivalMin + 1;
      return {
        stopId: s.stopId,
        stopName: s.stopName,
        sequence: idx + 1,
        scheduledArrival: `0${baseHour}:${String(arrivalMin).padStart(2, '0')}`,
        scheduledDeparture: `0${baseHour}:${String(depMin).padStart(2, '0')}`,
      };
    });

    await onSubmit({
      routeId,
      routeCode: selectedRouteObj.routeCode,
      routeName: selectedRouteObj.routeName,
      direction,
      effectiveFrom,
      status,
      slots,
      stopArrivalTimetable,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Transit Route"
          as="search-select"
          required
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          options={routes.map((r) => ({
            label: `${r.routeCode} — ${r.routeName}`,
            value: r.id,
          }))}
          placeholder="Search route (e.g. R01, Town Hall)..."
          icon={Bus}
        />

        <FormField
          label="Corridor Direction"
          as="select"
          value={direction}
          onChange={(e) => setDirection(e.target.value as any)}
          options={[
            { label: 'Forward (Origin → Destination)', value: 'FORWARD' },
            { label: 'Reverse (Destination → Origin)', value: 'REVERSE' },
          ]}
        />

        <FormField
          label="Effective Date"
          type="date"
          required
          value={effectiveFrom}
          onChange={(e) => setEffectiveFrom(e.target.value)}
          icon={Calendar}
        />
      </div>

      {/* Timetable Slot Editor */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <span className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
              <Clock className="h-4 w-4 text-brand-600" />
              <span>Daily Departure Slots ({slots.length} scheduled trips)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Timetable departure times dictate the delay calculation engine and passenger live arrivals.
            </span>
          </div>

          {/* Add Slot Controls */}
          <div className="flex items-center space-x-2">
            <input
              type="time"
              value={newDepTime}
              onChange={(e) => setNewDepTime(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="time"
              value={newArrTime}
              onChange={(e) => setNewArrTime(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="inline-flex items-center space-x-1 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Trip</span>
            </button>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-occ-darkCard"
            >
              <div>
                <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                  {slot.departureTime}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Arr: {slot.arrivalTime} ({slot.frequencyType})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSlot(slot.id)}
                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
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
          {isLoading ? 'Saving...' : initialData ? 'Update Schedule' : 'Publish Timetable'}
        </button>
      </div>
    </form>
  );
};
