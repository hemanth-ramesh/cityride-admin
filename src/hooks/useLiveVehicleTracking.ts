import { useEffect, useRef } from 'react';
import { useLiveFleetStore } from '@/stores/useLiveFleetStore';
import { LiveVehicleTelemetry } from '@/types/telemetry';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SEED_ROUTES } from '@/services/masterDataService';

// Initial baseline telemetry for Tumakuru fleet
const INITIAL_LIVE_VEHICLES: LiveVehicleTelemetry[] = [
  {
    vehicleId: 'veh-001',
    plateNumber: 'KA 06 F 8558',
    fleetNumber: 'CR-TUM-01',
    fleetType: 'AC Volvo Electric',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98451 10420',
    routeId: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    colorHex: '#059669',
    latitude: 13.3325,
    longitude: 77.1080,
    speedKmph: 34,
    headingDegrees: 125,
    status: 'on_time',
    gpsReliability: 'LIVE',
    currentStopIndex: 2,
    totalStops: 6,
    currentStopName: 'Town Hall Circle',
    nextStopName: 'SS Puram Circle',
    distanceToNextStopKm: 0.8,
    etaToNextStopMinutes: 2,
    delayMinutes: 0,
    routeProgressPercent: 40,
    isSosActive: false,
    passengerOccupancyPercent: 68,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-002',
    plateNumber: 'KA 06 FA 1234',
    fleetNumber: 'CR-TUM-02',
    fleetType: 'City Regular Eco',
    driverId: 'drv-002',
    driverName: 'Basavaraj Hiremath',
    driverPhone: '+91 98452 10550',
    routeId: 'route-002',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    colorHex: '#2563eb',
    latitude: 13.3250,
    longitude: 77.1420,
    speedKmph: 22,
    headingDegrees: 110,
    status: 'delayed',
    gpsReliability: 'LIVE',
    currentStopIndex: 4,
    totalStops: 6,
    currentStopName: 'Batawadi Junction',
    nextStopName: 'Kyathsandra',
    distanceToNextStopKm: 1.4,
    etaToNextStopMinutes: 4,
    delayMinutes: 5,
    routeProgressPercent: 65,
    isSosActive: false,
    passengerOccupancyPercent: 88,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-003',
    plateNumber: 'KA 06 G 4321',
    fleetNumber: 'CR-TUM-03',
    fleetType: 'Smart Feeder Electric',
    driverId: 'drv-003',
    driverName: 'Manjunath Swamy',
    driverPhone: '+91 98453 10890',
    routeId: 'route-003',
    routeCode: 'R03',
    routeName: 'Tumkur Univ ↔ Heggere',
    colorHex: '#7c3aed',
    latitude: 13.3290,
    longitude: 77.0860,
    speedKmph: 41,
    headingDegrees: 195,
    status: 'on_time',
    gpsReliability: 'LIVE',
    currentStopIndex: 3,
    totalStops: 5,
    currentStopName: 'Shettyhalli Cross',
    nextStopName: 'Dibbur Gate',
    distanceToNextStopKm: 1.1,
    etaToNextStopMinutes: 2,
    delayMinutes: 1,
    routeProgressPercent: 55,
    isSosActive: false,
    passengerOccupancyPercent: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-004',
    plateNumber: 'KA 06 F 3920',
    fleetNumber: 'CR-TUM-04',
    fleetType: 'Industrial Express',
    driverId: 'drv-004',
    driverName: 'Siddaraju B. N.',
    driverPhone: '+91 98454 10210',
    routeId: 'route-004',
    routeCode: 'R04',
    routeName: 'KSRTC Stand ↔ Melekote Ind.',
    colorHex: '#ea580c',
    latitude: 13.3620,
    longitude: 77.1080,
    speedKmph: 38,
    headingDegrees: 345,
    status: 'on_time',
    gpsReliability: 'LIVE',
    currentStopIndex: 4,
    totalStops: 7,
    currentStopName: 'Antharasanahalli Gate',
    nextStopName: 'Melekote Cross',
    distanceToNextStopKm: 1.6,
    etaToNextStopMinutes: 3,
    delayMinutes: 0,
    routeProgressPercent: 60,
    isSosActive: false,
    passengerOccupancyPercent: 92,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-005',
    plateNumber: 'KA 06 E 9012',
    fleetNumber: 'CR-TUM-05',
    fleetType: 'City Connector',
    driverId: 'drv-005',
    driverName: 'Chandrashekariah',
    driverPhone: '+91 98455 11020',
    routeId: 'route-005',
    routeCode: 'R05',
    routeName: 'Belagumba ↔ Badrama Chowtry',
    colorHex: '#db2777',
    latitude: 13.3410,
    longitude: 77.1120,
    speedKmph: 0,
    headingDegrees: 80,
    status: 'at_stop',
    gpsReliability: 'LIVE',
    currentStopIndex: 2,
    totalStops: 6,
    currentStopName: 'Town Hall Circle',
    nextStopName: 'MG Road Junction',
    distanceToNextStopKm: 0.9,
    etaToNextStopMinutes: 3,
    delayMinutes: 0,
    routeProgressPercent: 30,
    isSosActive: false,
    passengerOccupancyPercent: 54,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-006',
    plateNumber: 'KA 06 F 7711',
    fleetNumber: 'CR-TUM-06',
    fleetType: 'Suburban Shuttle',
    driverId: 'drv-006',
    driverName: 'Lokesh Murthy',
    driverPhone: '+91 98456 10770',
    routeId: 'route-006',
    routeCode: 'R06',
    routeName: 'KSRTC Stand ↔ Gulur / Badihalli',
    colorHex: '#0891b2',
    latitude: 13.3100,
    longitude: 77.1060,
    speedKmph: 45,
    headingDegrees: 175,
    status: 'on_time',
    gpsReliability: 'LIVE',
    currentStopIndex: 3,
    totalStops: 6,
    currentStopName: 'NH48 Underpass',
    nextStopName: 'Gulur Cross',
    distanceToNextStopKm: 2.1,
    etaToNextStopMinutes: 4,
    delayMinutes: 0,
    routeProgressPercent: 50,
    isSosActive: false,
    passengerOccupancyPercent: 62,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-007',
    plateNumber: 'KA 06 B 5432',
    fleetNumber: 'CR-TUM-07',
    fleetType: 'City Regular Eco',
    driverId: 'drv-007',
    driverName: 'Girish Gowda',
    driverPhone: '+91 98457 10330',
    routeId: 'route-007',
    routeCode: 'R07',
    routeName: 'KSRTC Stand ↔ Gangasandra',
    colorHex: '#4f46e5',
    latitude: 13.3360,
    longitude: 77.0680,
    speedKmph: 15,
    headingDegrees: 260,
    status: 'delayed',
    gpsReliability: 'LIVE',
    currentStopIndex: 4,
    totalStops: 6,
    currentStopName: 'Ring Road Cross',
    nextStopName: 'Gangasandra Village',
    distanceToNextStopKm: 1.5,
    etaToNextStopMinutes: 4,
    delayMinutes: 7,
    routeProgressPercent: 70,
    isSosActive: false,
    passengerOccupancyPercent: 78,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: 'veh-008',
    plateNumber: 'KA 06 F 6620',
    fleetNumber: 'CR-TUM-08',
    fleetType: 'Pilgrim Special',
    driverId: 'drv-008',
    driverName: 'Ananda Kumar',
    driverPhone: '+91 98458 10990',
    routeId: 'route-008',
    routeCode: 'R08',
    routeName: 'Tumkur Univ ↔ Bellavi Hub',
    colorHex: '#ca8a04',
    latitude: 13.3850,
    longitude: 77.0580,
    speedKmph: 48,
    headingDegrees: 330,
    status: 'on_time',
    gpsReliability: 'LIVE',
    currentStopIndex: 3,
    totalStops: 6,
    currentStopName: 'Belagumba Cross',
    nextStopName: 'Bellavi Handpost',
    distanceToNextStopKm: 2.8,
    etaToNextStopMinutes: 5,
    delayMinutes: 0,
    routeProgressPercent: 55,
    isSosActive: false,
    passengerOccupancyPercent: 82,
    lastUpdated: new Date().toISOString(),
  },
];

export function useLiveVehicleTracking() {
  const {
    vehicles,
    setVehicles,
    updateVehiclePosition,
    selectedVehicleId,
    selectedRouteCode,
    activeFilter,
    isLiveTrackingActive,
    health,
    setHealth,
    selectVehicle,
    selectRoute,
    setActiveFilter,
    toggleLiveTracking,
  } = useLiveFleetStore();

  const initializedRef = useRef(false);

  // Initialize fleet state
  useEffect(() => {
    if (!initializedRef.current || vehicles.length === 0) {
      setVehicles(INITIAL_LIVE_VEHICLES);
      initializedRef.current = true;
    }
  }, [setVehicles, vehicles.length]);

  // ==========================================
  // 1. SUPABASE REALTIME CHANNEL SUBSCRIPTION
  // ==========================================
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('realtime:vehicle_locations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_locations',
        },
        (payload: any) => {
          if (payload.new && payload.new.vehicle_id) {
            const row = payload.new;
            updateVehiclePosition(row.vehicle_id, {
              latitude: row.latitude,
              longitude: row.longitude,
              speedKmph: row.speed_kmph,
              headingDegrees: row.heading_degrees,
              delayMinutes: row.delay_minutes,
              status: row.status,
              isSosActive: Boolean(row.is_sos_active),
            });
            setHealth({
              supabaseRealtime: 'connected',
              databaseLatencyMs: Math.floor(25 + Math.random() * 20),
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setHealth({ supabaseRealtime: 'connected' });
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setHealth({ supabaseRealtime: 'reconnecting' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateVehiclePosition, setHealth]);

  // ==========================================
  // 2. REALISTIC LIVE TELEMETRY SIMULATOR
  // (Moves vehicles along route corridors every 3 seconds)
  // ==========================================
  useEffect(() => {
    if (!isLiveTrackingActive) return;

    const interval = setInterval(() => {
      const currentList = useLiveFleetStore.getState().vehicles;
      if (currentList.length === 0) return;

      currentList.forEach((v) => {
        // Find matching route stops to extrapolate direction
        const routeObj = SEED_ROUTES.find((r) => r.routeCode === v.routeCode);
        const stops = routeObj?.stops || [];
        const nextStop = stops[Math.min(stops.length - 1, v.currentStopIndex + 1)];

        let newLat = v.latitude;
        let newLng = v.longitude;
        let newSpeed = v.speedKmph;

        if (nextStop) {
          // Micro step towards next stop
          const latDiff = nextStop.latitude - v.latitude;
          const lngDiff = nextStop.longitude - v.longitude;
          const stepFactor = 0.05 + Math.random() * 0.03;

          newLat = Number((v.latitude + latDiff * stepFactor).toFixed(5));
          newLng = Number((v.longitude + lngDiff * stepFactor).toFixed(5));
          newSpeed = Math.max(18, Math.min(52, Math.round(v.speedKmph + (Math.random() * 6 - 3))));
        } else {
          // Loop back jitter
          newLat = Number((v.latitude + (Math.random() * 0.0004 - 0.0002)).toFixed(5));
          newLng = Number((v.longitude + (Math.random() * 0.0004 - 0.0002)).toFixed(5));
        }

        const newProgress = Math.min(100, (v.routeProgressPercent + 1.2) % 100);

        updateVehiclePosition(v.vehicleId, {
          latitude: newLat,
          longitude: newLng,
          speedKmph: newSpeed,
          routeProgressPercent: Number(newProgress.toFixed(1)),
        });
      });

      setHealth({
        gpsStream: 'healthy',
        databaseLatencyMs: Math.floor(28 + Math.random() * 15),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTrackingActive, updateVehiclePosition, setHealth]);

  // Filtered vehicles based on active filter and route filter
  const filteredVehicles = vehicles.filter((v) => {
    const matchesRoute = !selectedRouteCode || v.routeCode === selectedRouteCode;
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'ON_TIME'
        ? v.status === 'on_time' || v.status === 'at_stop'
        : activeFilter === 'DELAYED'
        ? v.status === 'delayed' || v.status === 'severely_delayed'
        : activeFilter === 'EMERGENCY'
        ? v.isSosActive || v.status === 'emergency'
        : activeFilter === 'OFFLINE'
        ? v.status === 'offline' || v.gpsReliability === 'OFFLINE'
        : true;

    return matchesRoute && matchesFilter;
  });

  const selectedVehicle = vehicles.find((v) => v.vehicleId === selectedVehicleId) || null;

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    selectedVehicle,
    selectedVehicleId,
    selectedRouteCode,
    activeFilter,
    isLiveTrackingActive,
    health,
    selectVehicle,
    selectRoute,
    setActiveFilter,
    toggleLiveTracking,
  };
}
