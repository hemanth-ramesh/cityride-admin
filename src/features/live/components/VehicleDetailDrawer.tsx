import React, { useState } from 'react';
import { LiveVehicleTelemetry } from '@/types/telemetry';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  X,
  Bus,
  User,
  Phone,
  Gauge,
  Compass,
  Users,
  Clock,
  MapPin,
  Send,
  Radio,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface VehicleDetailDrawerProps {
  vehicle: LiveVehicleTelemetry | null;
  onClose: () => void;
  onFocusMap?: (vehicle: LiveVehicleTelemetry) => void;
}

export const VehicleDetailDrawer: React.FC<VehicleDetailDrawerProps> = ({
  vehicle,
  onClose,
  onFocusMap,
}) => {
  const [dispatchMessage, setDispatchMessage] = useState('');
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  if (!vehicle) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchMessage.trim()) return;
    setMessageSentSuccess(true);
    setTimeout(() => {
      setDispatchMessage('');
      setMessageSentSuccess(false);
    }, 3000);
  };

  const getHeadingDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return `${deg}° ${directions[index]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-in Drawer Container */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform dark:bg-occ-darkCard sm:border-l sm:border-slate-200 sm:dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <span
              style={{ backgroundColor: vehicle.colorHex }}
              className="flex h-9 w-12 items-center justify-center rounded-xl font-mono text-sm font-black text-white shadow-md"
            >
              {vehicle.routeCode}
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {vehicle.plateNumber}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {vehicle.fleetNumber} • {vehicle.fleetType}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {vehicle.isSosActive ? (
              <span className="flex items-center space-x-1 rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-black text-white animate-pulse">
                <Flame className="h-3.5 w-3.5" />
                <span>SOS</span>
              </span>
            ) : (
              <StatusBadge status={vehicle.status} pulse={vehicle.status === 'on_time'} />
            )}

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Close inspection"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          
          {/* Route Corridor Banner */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>ACTIVE CORRIDOR</span>
              <span className="font-mono text-brand-700 dark:text-brand-400">
                {vehicle.currentStopIndex} of {vehicle.totalStops} Stops
              </span>
            </div>
            <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
              {vehicle.routeName}
            </p>

            {/* Visual Route Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Trip Progress</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {vehicle.routeProgressPercent}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${vehicle.routeProgressPercent}%`,
                    backgroundColor: vehicle.colorHex,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Heading */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <Compass className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Heading</span>
              </div>
              <div className="mt-1 font-mono text-xs font-black text-slate-900 dark:text-white">
                {getHeadingDirection(vehicle.headingDegrees)}
              </div>
            </div>

            {/* Passenger Occupancy */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <Users className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Occupancy</span>
              </div>
              <div className="mt-1 font-mono text-sm font-black text-slate-900 dark:text-white">
                {vehicle.passengerOccupancyPercent}%
              </div>
              <span className="text-[9px] text-slate-400">
                ~{Math.round((vehicle.passengerOccupancyPercent / 100) * 42)}/42 Seats
              </span>
            </div>

            {/* Schedule Deviation */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Schedule</span>
              </div>
              <div className="mt-1 font-mono text-xs font-black">
                {vehicle.delayMinutes > 0 ? (
                  <span className="text-amber-600 dark:text-amber-400">+{vehicle.delayMinutes}m Late</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">On Time</span>
                )}
              </div>
              <span className="text-[9px] text-slate-400">Punctuality</span>
            </div>
          </div>

          {/* Stop Progression Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Transit Waypoint Status
            </h3>

            <div className="mt-3 space-y-4">
              {/* Current Stop */}
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Departed Station</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {vehicle.currentStopName}
                  </p>
                </div>
              </div>

              {/* Next Stop */}
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 animate-pulse">
                  <Navigation className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">
                      Next Stop Approaching
                    </span>
                    <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-400">
                      ETA {vehicle.etaToNextStopMinutes}m
                    </span>
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    {vehicle.nextStopName}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Distance remaining: {vehicle.distanceToNextStopKm} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Driver & Direct Operations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assigned Driver Crew
            </h3>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {vehicle.driverName}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    ID: {vehicle.driverId || 'DRV-1042'}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${vehicle.driverPhone || '+919845012345'}`}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call</span>
              </a>
            </div>

            {/* Dispatch Terminal Quick Message */}
            <form onSubmit={handleSendMessage} className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Send Dispatch Message to Driver Terminal
              </label>
              <div className="mt-1.5 flex space-x-2">
                <input
                  type="text"
                  value={dispatchMessage}
                  onChange={(e) => setDispatchMessage(e.target.value)}
                  placeholder="e.g. Traffic clear at Town Hall. Proceed."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!dispatchMessage.trim()}
                  className="inline-flex items-center space-x-1 rounded-xl bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-40 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </div>

              {messageSentSuccess && (
                <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Message transmitted to vehicle terminal</span>
                </div>
              )}
            </form>
          </div>

          {/* GPS Hardware Telemetry Diagnostics */}
          <div className="rounded-xl bg-slate-50 p-3 text-[10px] font-mono text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
            <div className="flex justify-between">
              <span>GPS Coordinates:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {vehicle.latitude.toFixed(4)}° N, {vehicle.longitude.toFixed(4)}° E
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Telemetry Ping:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Live (2.5s interval)
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Last Packet Received:</span>
              <span>{new Date(vehicle.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
};
