import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { clsx } from 'clsx';

interface StopPickerMapProps {
  latitude: number;
  longitude: number;
  geofenceRadius?: number;
  onChangeLocation: (lat: number, lng: number) => void;
  className?: string;
}

// Tumakuru reference bounding box
const TUMAKURU_BOUNDS = {
  minLat: 13.2800,
  maxLat: 13.4300,
  minLng: 77.0200,
  maxLng: 77.1800,
};

const LANDMARK_PRESETS = [
  { name: 'KSRTC Bus Stand (Center)', lat: 13.3395, lng: 77.1005 },
  { name: 'Town Hall Circle', lat: 13.3325, lng: 77.1080 },
  { name: 'SIT Main Campus', lat: 13.3235, lng: 77.1215 },
  { name: 'Siddaganga Mutt Kshetra', lat: 13.3180, lng: 77.1680 },
  { name: 'Tumkur University', lat: 13.3440, lng: 77.0980 },
  { name: 'Melekote KIADB Area', lat: 13.3790, lng: 77.1140 },
  { name: 'Heggere Suburb', lat: 13.3050, lng: 77.0700 },
  { name: 'Bellavi Hub', lat: 13.4150, lng: 77.0250 },
];

export const StopPickerMap: React.FC<StopPickerMapProps> = ({
  latitude,
  longitude,
  geofenceRadius = 45,
  onChangeLocation,
  className,
}) => {
  const [mapZoom, setMapZoom] = useState(1);

  // Convert geographic coordinates to percentage on canvas
  const latToY = (lat: number) => {
    const clamped = Math.max(TUMAKURU_BOUNDS.minLat, Math.min(TUMAKURU_BOUNDS.maxLat, lat));
    return ((TUMAKURU_BOUNDS.maxLat - clamped) / (TUMAKURU_BOUNDS.maxLat - TUMAKURU_BOUNDS.minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    const clamped = Math.max(TUMAKURU_BOUNDS.minLng, Math.min(TUMAKURU_BOUNDS.maxLng, lng));
    return ((clamped - TUMAKURU_BOUNDS.minLng) / (TUMAKURU_BOUNDS.maxLng - TUMAKURU_BOUNDS.minLng)) * 100;
  };

  // Convert click coordinate back to geographic coordinates
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = clickX / rect.width;
    const percentY = clickY / rect.height;

    const newLng = TUMAKURU_BOUNDS.minLng + percentX * (TUMAKURU_BOUNDS.maxLng - TUMAKURU_BOUNDS.minLng);
    const newLat = TUMAKURU_BOUNDS.maxLat - percentY * (TUMAKURU_BOUNDS.maxLat - TUMAKURU_BOUNDS.minLat);

    onChangeLocation(Number(newLat.toFixed(5)), Number(newLng.toFixed(5)));
  };

  const pinX = lngToX(longitude);
  const pinY = latToY(latitude);

  return (
    <div className={clsx('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Navigation className="h-3.5 w-3.5 text-brand-600" />
          <span>Interactive Pin Drop (Tumakuru Geofence Grid)</span>
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
        </span>
      </div>

      {/* Interactive Map Canvas */}
      <div
        onClick={handleMapClick}
        className="relative h-60 w-full cursor-crosshair overflow-hidden rounded-2xl border border-slate-300 bg-slate-900 shadow-inner select-none dark:border-slate-700"
      >
        {/* Stylized Grid Overlay */}
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Road Lines Simulation */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          {/* NH48 Highway */}
          <path d="M 10 100 Q 150 120 300 150 T 600 200" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="6 4" />
          {/* Main Ring Road */}
          <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#34d399" strokeWidth="2" />
          <path d="M 50% 10% L 50% 90%" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 10% 50% L 90% 50%" fill="none" stroke="#64748b" strokeWidth="1.5" />
        </svg>

        {/* Pre-mapped Landmark Indicators */}
        {LANDMARK_PRESETS.map((lm) => {
          const x = lngToX(lm.lng);
          const y = latToY(lm.lat);
          return (
            <div
              key={lm.name}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="group pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 group-hover:scale-150" />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-medium text-slate-300 opacity-60 backdrop-blur-xs group-hover:opacity-100">
                {lm.name.split(' ')[0]}
              </span>
            </div>
          );
        })}

        {/* Dropped Active Pin with Pulse & Geofence Circle */}
        <div
          style={{ left: `${pinX}%`, top: `${pinY}%` }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transition-all duration-150"
        >
          {/* Geofence Ring */}
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border border-emerald-400 bg-emerald-500/20"
            style={{ width: `${geofenceRadius * 1.2}px`, height: `${geofenceRadius * 1.2}px` }}
          />

          {/* Pin Icon */}
          <div className="relative flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg ring-2 ring-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="h-2 w-0.5 bg-rose-600" />
          </div>
        </div>

        {/* Map Watermark Indicator */}
        <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-400 backdrop-blur-md">
          Tumakuru City Transit Grid • Click map to set pin
        </div>
      </div>

      {/* Quick Landmark Jump Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-400">Quick Landmark Snapping:</span>
        {LANDMARK_PRESETS.slice(0, 5).map((lm) => (
          <button
            key={lm.name}
            type="button"
            onClick={() => onChangeLocation(lm.lat, lm.lng)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-700 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {lm.name}
          </button>
        ))}
      </div>
    </div>
  );
};
