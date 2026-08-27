import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { LiveVehicleTelemetry } from '@/types/telemetry';
import { SEED_ROUTES, SEED_BUS_STOPS } from '@/services/masterDataService';
import {
  Bus,
  Navigation,
  MapPin,
  Phone,
  Clock,
  Gauge,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  AlertTriangle,
  Flame,
  ShieldCheck,
  X,
  Radio,
} from 'lucide-react';
import { clsx } from 'clsx';

// Generic Vehicle interface that satisfies lat/lng/status/heading
export interface VehicleMapItem {
  id?: string;
  vehicleId?: string;
  plateNumber?: string;
  registrationNumber?: string;
  fleetNumber?: string;
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
  status?: string;
  heading?: number;
  headingDegrees?: number;
  speedKmph?: number;
  speed?: number;
  routeCode?: string;
  routeName?: string;
  driverName?: string;
  driverPhone?: string;
  currentStopName?: string;
  nextStopName?: string;
  delayMinutes?: number;
  isSosActive?: boolean;
}

export interface LiveFleetMapProps {
  vehicles: (LiveVehicleTelemetry | VehicleMapItem)[];
  selectedVehicle?: LiveVehicleTelemetry | VehicleMapItem | null;
  onSelectVehicle?: (vehicleId: string | null) => void;
  className?: string;
}

// Tumakuru reference bounding center & bounds
const TUMAKURU_CENTER = { lat: 13.3395, lng: 77.1005 };
const TUMAKURU_BOUNDS = {
  minLat: 13.2800,
  maxLat: 13.4300,
  minLng: 77.0200,
  maxLng: 77.1800,
};

const MAP_LIBRARIES: ('places' | 'geometry')[] = ['geometry'];

const MAP_CONTAINER_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

// Dark transit map styling for OCC Command Center
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#cbd5e1' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#064e3b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3b82f6' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1d4ed8' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#047857' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#10b981' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0284c7' }],
  },
];

// Helper: Normalize vehicle properties
function normalizeVehicle(v: LiveVehicleTelemetry | VehicleMapItem) {
  const anyV = v as any;
  const id = anyV.vehicleId || anyV.id || anyV.plateNumber || anyV.registrationNumber || '';
  const plate = anyV.plateNumber || anyV.registrationNumber || id;
  const lat = anyV.lat !== undefined ? anyV.lat : (anyV.latitude || 13.3395);
  const lng = anyV.lng !== undefined ? anyV.lng : (anyV.longitude || 77.1005);
  const heading = anyV.heading !== undefined ? anyV.heading : (anyV.headingDegrees || 0);
  const speed = anyV.speed !== undefined ? anyV.speed : (anyV.speedKmph || 0);
  const rawStatus = String(anyV.status || '').toLowerCase();
  const isSos = Boolean(anyV.isSosActive || rawStatus === 'emergency' || rawStatus === 'sos');
  const isOffline = rawStatus === 'offline';

  let color = '#059669'; // Green (Active)
  if (isSos) color = '#ef4444'; // Red (SOS)
  else if (isOffline) color = '#64748b'; // Gray (Offline)

  return {
    id,
    plate,
    lat: Number(lat),
    lng: Number(lng),
    heading: Number(heading),
    speed: Number(speed),
    color,
    isSos,
    isOffline,
    routeCode: anyV.routeCode || 'R01',
    routeName: anyV.routeName || 'Tumakuru Transit Line',
    driverName: anyV.driverName || 'Duty Driver',
    driverPhone: anyV.driverPhone || '+91 98450 10000',
    currentStop: anyV.currentStopName || 'En Route',
    nextStop: anyV.nextStopName || 'Next Station',
    delayMinutes: anyV.delayMinutes || 0,
    raw: v,
  };
}

// Generate an SVG Data URI marker icon that rotates with heading
function createVehicleSvgIcon(color: string, heading: number, isSos: boolean): google.maps.Icon {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
        </filter>
      </defs>
      ${isSos ? `<circle cx="22" cy="22" r="20" fill="${color}" fill-opacity="0.35"><animate attributeName="r" values="16;21;16" dur="1.2s" repeatCount="indefinite"/></circle>` : ''}
      <g transform="rotate(${heading} 22 22)" filter="url(#shadow)">
        <circle cx="22" cy="22" r="15" fill="${color}" stroke="#ffffff" stroke-width="2.5" />
        <!-- Directional Pointer Triangle -->
        <polygon points="22,9 27,24 22,20 17,24" fill="#ffffff" />
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
    scaledSize: new google.maps.Size(44, 44),
    anchor: new google.maps.Point(22, 22),
  };
}

// Memoized Single Vehicle Marker to avoid unnecessary re-renders
interface VehicleMarkerProps {
  vehicle: ReturnType<typeof normalizeVehicle>;
  onClick: (v: ReturnType<typeof normalizeVehicle>) => void;
}

const VehicleMarkerComponent: React.FC<VehicleMarkerProps> = ({ vehicle, onClick }) => {
  const icon = useMemo(
    () => createVehicleSvgIcon(vehicle.color, vehicle.heading, vehicle.isSos),
    [vehicle.color, vehicle.heading, vehicle.isSos]
  );

  return (
    <Marker
      position={{ lat: vehicle.lat, lng: vehicle.lng }}
      icon={icon}
      title={`${vehicle.plate} (${vehicle.routeCode})`}
      onClick={() => onClick(vehicle)}
      zIndex={vehicle.isSos ? 999 : 100}
    />
  );
};

const VehicleMarker = React.memo(VehicleMarkerComponent, (prev, next) => {
  return (
    prev.vehicle.id === next.vehicle.id &&
    prev.vehicle.lat === next.vehicle.lat &&
    prev.vehicle.lng === next.vehicle.lng &&
    prev.vehicle.heading === next.vehicle.heading &&
    prev.vehicle.color === next.vehicle.color &&
    prev.vehicle.isSos === next.vehicle.isSos
  );
});

// ==============================================================================
// MAIN COMPONENT: LiveFleetMap
// ==============================================================================
export const LiveFleetMapComponent: React.FC<LiveFleetMapProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  className,
}) => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'cityride-google-map-script',
    googleMapsApiKey,
    libraries: MAP_LIBRARIES,
  });

  // Map instance ref to prevent re-renders & preserve user pan/zoom state
  const mapRef = useRef<google.maps.Map | null>(null);

  // Active InfoWindow state
  const [activeInfoWindow, setActiveInfoWindow] = useState<ReturnType<typeof normalizeVehicle> | null>(null);

  // Normalized vehicles
  const normalizedList = useMemo(() => vehicles.map(normalizeVehicle), [vehicles]);

  // Handle map load: store ref without triggering re-render
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Handle marker click: pan to location and open InfoWindow
  const handleMarkerClick = useCallback(
    (v: ReturnType<typeof normalizeVehicle>) => {
      setActiveInfoWindow(v);
      if (onSelectVehicle) {
        onSelectVehicle(v.id);
      }
      if (mapRef.current) {
        mapRef.current.panTo({ lat: v.lat, lng: v.lng });
      }
    },
    [onSelectVehicle]
  );

  // Fallback map controls
  const handleRecenter = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.panTo(TUMAKURU_CENTER);
      mapRef.current.setZoom(13);
    }
  }, []);

  // Map options configuration
  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    styles: DARK_MAP_STYLES,
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    minZoom: 11,
    maxZoom: 18,
  }), []);

  // If Google Maps API is not loaded or key is absent, use interactive radar canvas fallback
  if (!googleMapsApiKey || loadError || !isLoaded) {
    return (
      <InteractiveRadarMapFallback
        vehicles={normalizedList}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={onSelectVehicle}
        className={className}
      />
    );
  }

  return (
    <div className={clsx('relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-md dark:border-slate-800', className)}>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={TUMAKURU_CENTER}
        zoom={13}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={mapOptions}
      >
        {/* Render Memoized Vehicle Markers */}
        {normalizedList.map((v) => (
          <VehicleMarker key={v.id} vehicle={v} onClick={handleMarkerClick} />
        ))}

        {/* Custom InfoWindow */}
        {activeInfoWindow && (
          <InfoWindow
            position={{ lat: activeInfoWindow.lat, lng: activeInfoWindow.lng }}
            onCloseClick={() => setActiveInfoWindow(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -22),
            }}
          >
            <div className="p-1 min-w-[210px] text-slate-900 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <span className="rounded bg-emerald-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    {activeInfoWindow.routeCode}
                  </span>
                  <strong className="text-xs font-bold font-mono text-slate-900">
                    {activeInfoWindow.plate}
                  </strong>
                </div>
                <span
                  style={{ backgroundColor: activeInfoWindow.color }}
                  className="h-2 w-2 rounded-full"
                />
              </div>

              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[130px]">{activeInfoWindow.routeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-semibold text-slate-800">{activeInfoWindow.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className={activeInfoWindow.delayMinutes > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {activeInfoWindow.delayMinutes > 0 ? `+${activeInfoWindow.delayMinutes}m Late` : 'On Time'}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5">
                <a
                  href={`tel:${activeInfoWindow.driverPhone}`}
                  className="inline-flex items-center space-x-1 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-700"
                >
                  <Phone className="h-2.5 w-2.5" />
                  <span>Call Driver</span>
                </a>
                <span className="text-[9px] text-slate-400 font-mono">
                  {activeInfoWindow.heading}° Heading
                </span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Floating Control Toolbar */}
      <div className="absolute right-4 top-4 flex flex-col space-y-2 z-10">
        <button
          onClick={handleRecenter}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 text-white shadow-lg backdrop-blur-xs hover:bg-slate-800 transition"
          title="Recenter Map on Tumakuru"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-3 rounded-xl bg-slate-950/85 px-3 py-1.5 text-[11px] font-semibold text-slate-300 backdrop-blur-md border border-slate-800 shadow-lg z-10">
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span>Offline</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>SOS / Emergency</span>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// RADAR CANVAS FALLBACK (For offline / keyless development mode)
// ==============================================================================
const InteractiveRadarMapFallback: React.FC<{
  vehicles: ReturnType<typeof normalizeVehicle>[];
  selectedVehicle?: any;
  onSelectVehicle?: (id: string | null) => void;
  className?: string;
}> = React.memo(({ vehicles, onSelectVehicle, className }) => {
  const [selectedPin, setSelectedPin] = useState<ReturnType<typeof normalizeVehicle> | null>(null);

  const latToY = (lat: number) => {
    const clamped = Math.max(TUMAKURU_BOUNDS.minLat, Math.min(TUMAKURU_BOUNDS.maxLat, lat));
    return ((TUMAKURU_BOUNDS.maxLat - clamped) / (TUMAKURU_BOUNDS.maxLat - TUMAKURU_BOUNDS.minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    const clamped = Math.max(TUMAKURU_BOUNDS.minLng, Math.min(TUMAKURU_BOUNDS.maxLng, lng));
    return ((clamped - TUMAKURU_BOUNDS.minLng) / (TUMAKURU_BOUNDS.maxLng - TUMAKURU_BOUNDS.minLng)) * 100;
  };

  return (
    <div className={clsx('relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-md dark:border-slate-800 select-none', className)}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Tumakuru Transit Radar Overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="50%" cy="50%" r="25%" fill="none" stroke="#38bdf8" strokeWidth="1" />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
      </svg>

      {/* Render Tumakuru 36 Stops */}
      {SEED_BUS_STOPS.map((stop) => {
        const x = lngToX(stop.longitude);
        const y = latToY(stop.latitude);
        return (
          <div
            key={stop.id}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-slate-600 ring-1 ring-slate-400/40" />
            <span className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900/90 px-1 py-0.2 text-[8px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition shadow">
              {stop.name.split(' ')[0]}
            </span>
          </div>
        );
      })}

      {/* Render Dynamic Rotating Vehicles */}
      {vehicles.map((v) => {
        const x = lngToX(v.lng);
        const y = latToY(v.lat);

        return (
          <div
            key={v.id}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => {
              setSelectedPin(v);
              if (onSelectVehicle) onSelectVehicle(v.id);
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 hover:scale-110"
          >
            {v.isSos && <div className="absolute -inset-2 animate-ping rounded-full bg-rose-500 opacity-50" />}
            <div
              style={{ backgroundColor: v.color }}
              className="relative flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-xl ring-2 ring-white/90"
            >
              <Bus className="h-4 w-4" />
              {/* Rotating Heading Indicator Arrow */}
              <div
                style={{ transform: `rotate(${v.heading}deg)` }}
                className="absolute -top-1.5 right-0 text-[10px] text-white font-bold"
              >
                ▲
              </div>
            </div>
          </div>
        );
      })}

      {/* InfoWindow in Fallback */}
      {selectedPin && (
        <div
          style={{
            left: `${lngToX(selectedPin.lng)}%`,
            top: `${latToY(selectedPin.lat)}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-[120%] z-40 rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs text-white shadow-2xl backdrop-blur-md min-w-[210px]"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-emerald-400 font-mono">{selectedPin.plate}</span>
            <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Route:</span>
              <span className="font-bold text-slate-200">{selectedPin.routeCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Driver:</span>
              <span>{selectedPin.driverName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-3 rounded-xl bg-slate-950/85 px-3 py-1.5 text-[11px] font-semibold text-slate-300 backdrop-blur-md border border-slate-800 shadow-lg z-10">
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span>Offline</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>SOS / Emergency</span>
        </div>
      </div>
    </div>
  );
});

export const LiveFleetMap = React.memo(LiveFleetMapComponent);
