import React, { useState, useEffect } from 'react';
import { TransitRoute, RouteStopSequence, BusStop } from '@/types/masterData';
import { FormField } from '@/components/ui/FormField';
import {
  GitFork,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Clock,
  Navigation,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RouteEditorProps {
  initialData?: TransitRoute | null;
  availableStops: BusStop[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RouteEditor: React.FC<RouteEditorProps> = ({
  initialData,
  availableStops,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [routeCode, setRouteCode] = useState('R01');
  const [routeName, setRouteName] = useState('');
  const [viaSummary, setViaSummary] = useState('');
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'CIRCULAR'>('UP');
  const [colorHex, setColorHex] = useState('#059669');
  const [dailyFrequencyMinutes, setDailyFrequencyMinutes] = useState(10);
  const [firstBusTime, setFirstBusTime] = useState('06:00');
  const [lastBusTime, setLastBusTime] = useState('22:00');
  const [status, setStatus] = useState<'active' | 'suspended' | 'draft'>('active');

  const [selectedStops, setSelectedStops] = useState<RouteStopSequence[]>([]);
  const [stopToAdd, setStopToAdd] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setRouteCode(initialData.routeCode);
      setRouteName(initialData.routeName);
      setViaSummary(initialData.viaSummary);
      setDirection(initialData.direction);
      setColorHex(initialData.colorHex || '#059669');
      setDailyFrequencyMinutes(initialData.dailyFrequencyMinutes || 10);
      setFirstBusTime(initialData.firstBusTime || '06:00');
      setLastBusTime(initialData.lastBusTime || '22:00');
      setStatus(initialData.status);
      setSelectedStops(initialData.stops || []);
    } else {
      setRouteCode(`R0${Math.floor(9 + Math.random() * 90)}`);
      // Initial default with first 3 stops
      if (availableStops.length >= 3) {
        const defaultSeq: RouteStopSequence[] = availableStops.slice(0, 3).map((s, idx) => ({
          stopId: s.id,
          stopCode: s.stopCode,
          stopName: s.name,
          kannadaName: s.kannadaName,
          orderIndex: idx + 1,
          distanceFromStartKm: Number((idx * 1.5).toFixed(1)),
          estimatedTravelMinutes: idx * 5,
          dwellTimeSeconds: 45,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
        setSelectedStops(defaultSeq);
        setRouteName(`${defaultSeq[0].stopName} ↔ ${defaultSeq[defaultSeq.length - 1].stopName}`);
      }
    }
  }, [initialData, availableStops]);

  // Add stop to sequence
  const handleAddStop = () => {
    if (!stopToAdd) return;
    const stopObj = availableStops.find((s) => s.id === stopToAdd);
    if (!stopObj) return;

    if (selectedStops.some((s) => s.stopId === stopObj.id)) {
      alert('This bus stop is already part of the route sequence.');
      return;
    }

    const lastStop = selectedStops[selectedStops.length - 1];
    const prevDistance = lastStop ? lastStop.distanceFromStartKm : 0;
    const prevMinutes = lastStop ? lastStop.estimatedTravelMinutes : 0;

    const newSeqItem: RouteStopSequence = {
      stopId: stopObj.id,
      stopCode: stopObj.stopCode,
      stopName: stopObj.name,
      kannadaName: stopObj.kannadaName,
      orderIndex: selectedStops.length + 1,
      distanceFromStartKm: Number((prevDistance + 1.2).toFixed(1)),
      estimatedTravelMinutes: prevMinutes + 4,
      dwellTimeSeconds: 45,
      latitude: stopObj.latitude,
      longitude: stopObj.longitude,
    };

    const updated = [...selectedStops, newSeqItem];
    setSelectedStops(updated);
    setStopToAdd('');
    autoUpdateViaAndEndpoints(updated);
  };

  // Move stop up in sequence
  const moveStopUp = (index: number) => {
    if (index === 0) return;
    const copy = [...selectedStops];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    recalculateIndicesAndDistances(copy);
  };

  // Move stop down in sequence
  const moveStopDown = (index: number) => {
    if (index === selectedStops.length - 1) return;
    const copy = [...selectedStops];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    recalculateIndicesAndDistances(copy);
  };

  // Remove stop
  const removeStop = (index: number) => {
    if (selectedStops.length <= 2) {
      alert('A transit route requires a minimum of 2 stops (Origin & Destination).');
      return;
    }
    const copy = selectedStops.filter((_, i) => i !== index);
    recalculateIndicesAndDistances(copy);
  };

  // Recalculate order indices and distances
  const recalculateIndicesAndDistances = (stopsList: RouteStopSequence[]) => {
    let cumulativeDist = 0;
    let cumulativeMinutes = 0;

    const updated = stopsList.map((s, idx) => {
      if (idx > 0) {
        cumulativeDist += 1.2;
        cumulativeMinutes += 4;
      }
      return {
        ...s,
        orderIndex: idx + 1,
        distanceFromStartKm: Number(cumulativeDist.toFixed(1)),
        estimatedTravelMinutes: cumulativeMinutes,
      };
    });

    setSelectedStops(updated);
    autoUpdateViaAndEndpoints(updated);
  };

  const autoUpdateViaAndEndpoints = (stopsList: RouteStopSequence[]) => {
    if (stopsList.length >= 2) {
      const origin = stopsList[0].stopName;
      const dest = stopsList[stopsList.length - 1].stopName;
      setRouteName(`${origin} ↔ ${dest}`);

      const viaStops = stopsList.slice(1, -1).map((s) => s.stopName.split(' ')[0]);
      if (viaStops.length > 0) {
        setViaSummary(`via ${viaStops.join(', ')}`);
      }
    }
  };

  const totalDistance = selectedStops[selectedStops.length - 1]?.distanceFromStartKm || 0;
  const totalDuration = selectedStops[selectedStops.length - 1]?.estimatedTravelMinutes || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStops.length < 2) {
      alert('Please add at least 2 stops for the route.');
      return;
    }

    await onSubmit({
      routeCode: routeCode.toUpperCase().trim(),
      routeName,
      originStopId: selectedStops[0].stopId,
      originStopName: selectedStops[0].stopName,
      destinationStopId: selectedStops[selectedStops.length - 1].stopId,
      destinationStopName: selectedStops[selectedStops.length - 1].stopName,
      viaSummary,
      direction,
      totalDistanceKm: Number(totalDistance),
      averageDurationMinutes: Number(totalDuration),
      colorHex,
      dailyFrequencyMinutes: Number(dailyFrequencyMinutes),
      firstBusTime,
      lastBusTime,
      status,
      stops: selectedStops,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Route Metadata Header */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Route Code Number"
          required
          value={routeCode}
          onChange={(e) => setRouteCode(e.target.value)}
          placeholder="R01"
          icon={GitFork}
        />

        <FormField
          label="Route Name Title"
          required
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="KSRTC Stand ↔ SIT Back Gate"
          containerClassName="sm:col-span-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <FormField
          label="Via Summary Description"
          value={viaSummary}
          onChange={(e) => setViaSummary(e.target.value)}
          placeholder="via SS Puram, Town Hall"
          containerClassName="sm:col-span-2"
        />

        <FormField
          label="Corridor Color Hex"
          value={colorHex}
          onChange={(e) => setColorHex(e.target.value)}
          placeholder="#059669"
        />

        <FormField
          label="Frequency (Minutes)"
          type="number"
          value={dailyFrequencyMinutes}
          onChange={(e) => setDailyFrequencyMinutes(Number(e.target.value))}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="First Bus Departure"
          type="time"
          value={firstBusTime}
          onChange={(e) => setFirstBusTime(e.target.value)}
        />

        <FormField
          label="Last Bus Departure"
          type="time"
          value={lastBusTime}
          onChange={(e) => setLastBusTime(e.target.value)}
        />

        <FormField
          label="Operational Status"
          as="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          options={[
            { label: 'Active (In Service)', value: 'active' },
            { label: 'Suspended (Temporary Hold)', value: 'suspended' },
            { label: 'Draft', value: 'draft' },
          ]}
        />
      </div>

      {/* Stop Sequence Editor */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <span className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
              <Navigation className="h-4 w-4 text-brand-600" />
              <span>Route Stop Sequence Timeline ({selectedStops.length} stops)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Total Route Distance: <span className="font-bold text-slate-800 dark:text-slate-200">{totalDistance} km</span> • Approx Travel Duration: <span className="font-bold text-slate-800 dark:text-slate-200">{totalDuration} mins</span>
            </span>
          </div>

          {/* Add Stop Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              value={stopToAdd}
              onChange={(e) => setStopToAdd(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">Select bus stop to add...</option>
              {availableStops
                .filter((s) => !selectedStops.some((seq) => seq.stopId === s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.stopCode} — {s.name} ({s.area})
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={handleAddStop}
              disabled={!stopToAdd}
              className="inline-flex items-center space-x-1 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Timeline Sequence List */}
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
          {selectedStops.map((stop, index) => {
            const isOrigin = index === 0;
            const isDestination = index === selectedStops.length - 1;

            return (
              <div
                key={stop.stopId}
                className={`flex items-center justify-between rounded-xl border p-3 transition ${
                  isOrigin
                    ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                    : isDestination
                    ? 'border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-occ-darkCard'
                }`}
              >
                {/* Left: Sequence index & Badge */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${
                      isOrigin
                        ? 'bg-emerald-600 text-white'
                        : isDestination
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {stop.orderIndex}
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {stop.stopName}
                      </span>
                      <span className="text-[11px] text-slate-400">({stop.kannadaName})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span className="font-mono">{stop.stopCode}</span>
                      <span>•</span>
                      <span>{stop.distanceFromStartKm} km from origin</span>
                      <span>•</span>
                      <span>+{stop.estimatedTravelMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {/* Right: Sequence Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => moveStopUp(index)}
                    disabled={isOrigin}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 dark:hover:bg-slate-800"
                    title="Move stop earlier"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStopDown(index)}
                    disabled={isDestination}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 dark:hover:bg-slate-800"
                    title="Move stop later"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                    title="Remove from sequence"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
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
          {isLoading ? 'Saving...' : initialData ? 'Update Route Network' : 'Create Transit Route'}
        </button>
      </div>
    </form>
  );
};
