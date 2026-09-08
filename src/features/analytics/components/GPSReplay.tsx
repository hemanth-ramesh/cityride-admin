import React, { useState, useEffect, useRef } from 'react';
import { HistoricalTripDetail, GPSBreadcrumbPoint } from '@/types/analytics';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Bus,
  MapPin,
  Clock,
  Gauge,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { clsx } from 'clsx';

interface GPSReplayProps {
  trip: HistoricalTripDetail;
  className?: string;
}

// Tumakuru reference bounding box
const TUMAKURU_BOUNDS = {
  minLat: 13.2800,
  maxLat: 13.4300,
  minLng: 77.0200,
  maxLng: 77.1800,
};

export const GPSReplay: React.FC<GPSReplayProps> = ({ trip, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<any>(null);

  const points = trip.breadcrumbs || [];
  const currentPoint = points[currentIndex] || points[0];

  // Convert geographic coordinates to percentage on canvas
  const latToY = (lat: number) => {
    const clamped = Math.max(TUMAKURU_BOUNDS.minLat, Math.min(TUMAKURU_BOUNDS.maxLat, lat));
    return ((TUMAKURU_BOUNDS.maxLat - clamped) / (TUMAKURU_BOUNDS.maxLat - TUMAKURU_BOUNDS.minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    const clamped = Math.max(TUMAKURU_BOUNDS.minLng, Math.min(TUMAKURU_BOUNDS.maxLng, lng));
    return ((clamped - TUMAKURU_BOUNDS.minLng) / (TUMAKURU_BOUNDS.maxLng - TUMAKURU_BOUNDS.minLng)) * 100;
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(200, 1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= points.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, points.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const polylinePoints = points
    .map((p) => `${lngToX(p.longitude)}%,${latToY(p.latitude)}%`)
    .join(' ');

  const currentPinX = currentPoint ? lngToX(currentPoint.longitude) : 50;
  const currentPinY = currentPoint ? latToY(currentPoint.latitude) : 50;

  return (
    <div className={clsx('space-y-4 text-xs', className)}>
      {/* Trip Header Banner */}
      <div className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="rounded-full bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs">
              {trip.routeCode}
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {trip.routeName}
            </h3>
            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
              ({trip.tripCode})
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Date: {trip.date} • Vehicle No: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{trip.plateNumber}</strong> • Driver: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{trip.driverName}</strong>
          </p>
        </div>

        {/* Telemetry Stats Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-sans uppercase font-medium">Telemetry Timestamp</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {currentPoint?.timestamp || '--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas for GPS Replay */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner select-none dark:border-slate-800">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Arterials background */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#64748b" strokeWidth="2" />
          <path d="M 10% 50% L 90% 50%" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 50% 10% L 50% 90%" fill="none" stroke="#64748b" strokeWidth="1.5" />
        </svg>

        {/* Historical Route Breadcrumb Polyline */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#059669"
            strokeWidth="4"
            strokeDasharray="4 2"
            strokeOpacity={0.8}
            strokeLinecap="round"
          />
        </svg>

        {/* Historical Waypoints & Stops */}
        {points.map((p, idx) => {
          const x = lngToX(p.longitude);
          const y = latToY(p.latitude);
          const isPassed = idx <= currentIndex;

          return (
            <div
              key={idx}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <div
                className={`h-2.5 w-2.5 rounded-full border-2 border-slate-900 transition-all ${
                  p.isStopArrival
                    ? 'bg-amber-400 scale-125 ring-2 ring-amber-400/40'
                    : isPassed
                    ? 'bg-emerald-400'
                    : 'bg-slate-600'
                }`}
              />
              {p.stopName && (
                <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-200 shadow-sm backdrop-blur-xs">
                  {p.stopName.split(' ')[0]}
                </span>
              )}
            </div>
          );
        })}

        {/* Live Replay Bus Pin Marker */}
        {currentPoint && (
          <div
            style={{ left: `${currentPinX}%`, top: `${currentPinY}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-30"
          >
            <div className="absolute -inset-2 animate-ping rounded-full bg-emerald-400 opacity-40" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xl ring-2 ring-white">
              <Bus className="h-4 w-4" />
              <div
                style={{ transform: `rotate(${currentPoint.headingDegrees}deg)` }}
                className="absolute -top-1 right-0 text-[9px] text-white"
              >
                ▲
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-400 backdrop-blur-xs">
          Waypoint: {currentIndex + 1} / {points.length} • {trip.totalDistanceKm} km Corridor
        </div>
      </div>

      {/* Playback Controls & Progress Scrubber */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Scrubber Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{points[0]?.timestamp || '00:00'} ({trip.originStopName.split(' ')[0]})</span>
            <span className="font-bold text-slate-900 dark:text-white font-sans">
              {currentPoint?.stopName ? `At Station: ${currentPoint.stopName}` : `Progress ${Math.round(((currentIndex + 1) / points.length) * 100)}%`}
            </span>
            <span>{points[points.length - 1]?.timestamp || '00:00'} ({trip.destinationStopName.split(' ')[0]})</span>
          </div>

          <input
            type="range"
            min={0}
            max={points.length - 1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(Number(e.target.value));
            }}
            className="w-full cursor-pointer accent-blue-600 h-2 bg-slate-100 rounded-full"
          />
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center space-x-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Replay'}</span>
            </button>

            <button
              onClick={handleReset}
              className="h-9 w-9 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all"
              title="Reset to origin"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Playback Multiplier - iOS Segmented Control */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100/90 border border-slate-200/80 dark:bg-slate-800/90 dark:border-slate-700/80">
            <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase">Speed</span>
            {[1, 2, 5, 10].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded-full px-2.5 py-1 text-xs font-mono font-bold transition-all active:scale-95 ${
                  playbackSpeed === speed
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
