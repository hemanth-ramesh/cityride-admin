import { Duty, ScheduledTrip, ShiftType, ScheduledTripStatus } from '@/types/dispatch';
import { SEED_ROUTES, SEED_DRIVERS, SEED_VEHICLES, SEED_SCHEDULES } from './masterDataService';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const TODAY_STR = new Date().toISOString().split('T')[0];

// ==========================================
// SEED DATA: TODAY'S DUTY ROSTER
// ==========================================
export const SEED_DUTIES: Duty[] = [
  {
    id: 'duty-001',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-01`,
    date: TODAY_STR,
    shift: 'MORNING',
    startTime: '05:30',
    endTime: '14:00',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    driverCode: 'TUM-DRV-1042',
    driverPhone: '+91 98451 10420',
    vehicleId: 'veh-001',
    plateNumber: 'KA 06 F 8558',
    fleetNumber: 'CR-TUM-01',
    routeId: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    status: 'in_progress',
    tripsCount: 6,
    tripsCompleted: 4,
    notes: 'Volvo AC Electric regular city rotation',
    createdAt: '2026-08-24T05:00:00Z',
  },
  {
    id: 'duty-002',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-02`,
    date: TODAY_STR,
    shift: 'MORNING',
    startTime: '05:45',
    endTime: '14:00',
    driverId: 'drv-002',
    driverName: 'Basavaraj Hiremath',
    driverCode: 'TUM-DRV-1055',
    driverPhone: '+91 98452 10550',
    vehicleId: 'veh-002',
    plateNumber: 'KA 06 FA 1234',
    fleetNumber: 'CR-TUM-02',
    routeId: 'route-002',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    status: 'in_progress',
    tripsCount: 5,
    tripsCompleted: 3,
    notes: 'Pilgrim corridor high frequency',
    createdAt: '2026-08-24T05:15:00Z',
  },
  {
    id: 'duty-003',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-03`,
    date: TODAY_STR,
    shift: 'MORNING',
    startTime: '06:00',
    endTime: '14:30',
    driverId: 'drv-003',
    driverName: 'Manjunath Swamy',
    driverCode: 'TUM-DRV-1089',
    driverPhone: '+91 98453 10890',
    vehicleId: 'veh-003',
    plateNumber: 'KA 06 G 4321',
    fleetNumber: 'CR-TUM-03',
    routeId: 'route-003',
    routeCode: 'R03',
    routeName: 'Tumkur Univ ↔ Heggere',
    status: 'in_progress',
    tripsCount: 6,
    tripsCompleted: 4,
    notes: 'Student feeder shift',
    createdAt: '2026-08-24T05:30:00Z',
  },
  {
    id: 'duty-004',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-04`,
    date: TODAY_STR,
    shift: 'MORNING',
    startTime: '06:00',
    endTime: '14:30',
    driverId: 'drv-004',
    driverName: 'Siddaraju B. N.',
    driverCode: 'TUM-DRV-1021',
    driverPhone: '+91 98454 10210',
    vehicleId: 'veh-004',
    plateNumber: 'KA 06 F 3920',
    fleetNumber: 'CR-TUM-04',
    routeId: 'route-004',
    routeCode: 'R04',
    routeName: 'KSRTC Stand ↔ Melekote Ind.',
    status: 'in_progress',
    tripsCount: 5,
    tripsCompleted: 3,
    notes: 'Industrial workers shift',
    createdAt: '2026-08-24T05:40:00Z',
  },
  {
    id: 'duty-005',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-05`,
    date: TODAY_STR,
    shift: 'EVENING',
    startTime: '13:45',
    endTime: '22:15',
    driverId: 'drv-005',
    driverName: 'Chandrashekariah',
    driverCode: 'TUM-DRV-1102',
    driverPhone: '+91 98455 11020',
    vehicleId: 'veh-005',
    plateNumber: 'KA 06 E 9012',
    fleetNumber: 'CR-TUM-05',
    routeId: 'route-005',
    routeCode: 'R05',
    routeName: 'Belagumba ↔ Badrama Chowtry',
    status: 'scheduled',
    tripsCount: 5,
    tripsCompleted: 0,
    notes: 'Afternoon city connector shift',
    createdAt: '2026-08-24T06:00:00Z',
  },
  {
    id: 'duty-006',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-06`,
    date: TODAY_STR,
    shift: 'EVENING',
    startTime: '14:00',
    endTime: '22:30',
    driverId: 'drv-006',
    driverName: 'Lokesh Murthy',
    driverCode: 'TUM-DRV-1077',
    driverPhone: '+91 98456 10770',
    vehicleId: 'veh-006',
    plateNumber: 'KA 06 F 7711',
    fleetNumber: 'CR-TUM-06',
    routeId: 'route-006',
    routeCode: 'R06',
    routeName: 'KSRTC Stand ↔ Gulur / Badihalli',
    status: 'scheduled',
    tripsCount: 4,
    tripsCompleted: 0,
    notes: 'Suburban evening connectivity',
    createdAt: '2026-08-24T06:10:00Z',
  },
];

// ==========================================
// SEED DATA: TODAY'S SCHEDULED TRIPS
// ==========================================
export const SEED_SCHEDULED_TRIPS: ScheduledTrip[] = [
  {
    id: 'trp-101',
    tripCode: 'TRP-R01-0600',
    dutyId: 'duty-001',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-01`,
    date: TODAY_STR,
    routeId: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'SIT Back Gate',
    direction: 'FORWARD',
    vehicleId: 'veh-001',
    plateNumber: 'KA 06 F 8558',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    scheduledDeparture: '06:00',
    scheduledArrival: '06:18',
    actualDeparture: '06:01',
    actualArrival: '06:19',
    delayMinutes: 1,
    status: 'completed',
    stopsCount: 6,
    currentStopIndex: 6,
    currentStopName: 'SIT Back Gate',
  },
  {
    id: 'trp-102',
    tripCode: 'TRP-R01-0700',
    dutyId: 'duty-001',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-01`,
    date: TODAY_STR,
    routeId: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'SIT Back Gate',
    direction: 'FORWARD',
    vehicleId: 'veh-001',
    plateNumber: 'KA 06 F 8558',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    scheduledDeparture: '07:00',
    scheduledArrival: '07:18',
    actualDeparture: '07:00',
    actualArrival: '07:17',
    delayMinutes: 0,
    status: 'completed',
    stopsCount: 6,
    currentStopIndex: 6,
    currentStopName: 'SIT Back Gate',
  },
  {
    id: 'trp-103',
    tripCode: 'TRP-R01-0830',
    dutyId: 'duty-001',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-01`,
    date: TODAY_STR,
    routeId: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'SIT Back Gate',
    direction: 'FORWARD',
    vehicleId: 'veh-001',
    plateNumber: 'KA 06 F 8558',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    scheduledDeparture: '08:30',
    scheduledArrival: '08:48',
    actualDeparture: '08:32',
    delayMinutes: 2,
    status: 'active',
    stopsCount: 6,
    currentStopIndex: 3,
    currentStopName: 'SS Puram Circle',
  },
  {
    id: 'trp-201',
    tripCode: 'TRP-R02-0700',
    dutyId: 'duty-002',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-02`,
    date: TODAY_STR,
    routeId: 'route-002',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'Siddaganga Mutt',
    direction: 'FORWARD',
    vehicleId: 'veh-002',
    plateNumber: 'KA 06 FA 1234',
    driverId: 'drv-002',
    driverName: 'Basavaraj Hiremath',
    scheduledDeparture: '07:00',
    scheduledArrival: '07:26',
    actualDeparture: '07:04',
    actualArrival: '07:31',
    delayMinutes: 5,
    status: 'completed',
    stopsCount: 6,
    currentStopIndex: 6,
    currentStopName: 'Siddaganga Mutt',
  },
  {
    id: 'trp-202',
    tripCode: 'TRP-R02-0830',
    dutyId: 'duty-002',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-02`,
    date: TODAY_STR,
    routeId: 'route-002',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'Siddaganga Mutt',
    direction: 'FORWARD',
    vehicleId: 'veh-002',
    plateNumber: 'KA 06 FA 1234',
    driverId: 'drv-002',
    driverName: 'Basavaraj Hiremath',
    scheduledDeparture: '08:30',
    scheduledArrival: '08:56',
    actualDeparture: '08:35',
    delayMinutes: 5,
    status: 'active',
    stopsCount: 6,
    currentStopIndex: 2,
    currentStopName: 'Mandi Pete Gate',
  },
  {
    id: 'trp-301',
    tripCode: 'TRP-R03-0845',
    dutyId: 'duty-003',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-03`,
    date: TODAY_STR,
    routeId: 'route-003',
    routeCode: 'R03',
    routeName: 'Tumkur Univ ↔ Heggere',
    originStopName: 'Tumkur University',
    destinationStopName: 'Heggere',
    direction: 'FORWARD',
    vehicleId: 'veh-003',
    plateNumber: 'KA 06 G 4321',
    driverId: 'drv-003',
    driverName: 'Manjunath Swamy',
    scheduledDeparture: '08:45',
    scheduledArrival: '09:07',
    actualDeparture: '08:45',
    delayMinutes: 0,
    status: 'active',
    stopsCount: 5,
    currentStopIndex: 2,
    currentStopName: 'Gubbi Gate Circle',
  },
  {
    id: 'trp-401',
    tripCode: 'TRP-R04-0900',
    dutyId: 'duty-004',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-04`,
    date: TODAY_STR,
    routeId: 'route-004',
    routeCode: 'R04',
    routeName: 'KSRTC Stand ↔ Melekote Ind.',
    originStopName: 'KSRTC Bus Stand',
    destinationStopName: 'Melekote Ind. Area',
    direction: 'FORWARD',
    vehicleId: 'veh-004',
    plateNumber: 'KA 06 F 3920',
    driverId: 'drv-004',
    driverName: 'Siddaraju B. N.',
    scheduledDeparture: '09:00',
    scheduledArrival: '09:24',
    delayMinutes: 0,
    status: 'ready',
    stopsCount: 7,
  },
  {
    id: 'trp-501',
    tripCode: 'TRP-R05-1400',
    dutyId: 'duty-005',
    dutyCode: `DUTY-${TODAY_STR.replace(/-/g, '')}-05`,
    date: TODAY_STR,
    routeId: 'route-005',
    routeCode: 'R05',
    routeName: 'Belagumba ↔ Badrama Chowtry',
    originStopName: 'Belagumba',
    destinationStopName: 'Badrama Chowtry',
    direction: 'FORWARD',
    vehicleId: 'veh-005',
    plateNumber: 'KA 06 E 9012',
    driverId: 'drv-005',
    driverName: 'Chandrashekariah',
    scheduledDeparture: '14:00',
    scheduledArrival: '14:17',
    delayMinutes: 0,
    status: 'scheduled',
    stopsCount: 6,
  },
];

function getStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(`cityride_dispatch_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading dispatch key ${key}:`, e);
  }
  localStorage.setItem(`cityride_dispatch_${key}`, JSON.stringify(seed));
  return seed;
}

function setStorage<T>(key: string, data: T) {
  localStorage.setItem(`cityride_dispatch_${key}`, JSON.stringify(data));
}

// ==========================================
// DISPATCH SERVICE
// ==========================================
export const DispatchService = {
  // DUTIES
  async getDuties(date?: string): Promise<Duty[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('duties').select('*');
        if (date) query = query.eq('date', date);
        const { data, error } = await query.order('start_time');
        if (!error && data && data.length > 0) return data as Duty[];
      } catch (err) {
        console.warn('Supabase fetch duties error, falling back:', err);
      }
    }
    const all = getStorage<Duty[]>('duties', SEED_DUTIES);
    if (date) return all.filter((d) => d.date === date);
    return all;
  },

  async createDuty(dutyData: Omit<Duty, 'id' | 'dutyCode' | 'tripsCount' | 'tripsCompleted' | 'createdAt'>): Promise<Duty> {
    const dateFormatted = dutyData.date.replace(/-/g, '');
    const randomIdx = Math.floor(10 + Math.random() * 90);
    const newDuty: Duty = {
      ...dutyData,
      id: `duty-${Date.now()}`,
      dutyCode: `DUTY-${dateFormatted}-${randomIdx}`,
      tripsCount: 5,
      tripsCompleted: 0,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('duties').insert(newDuty);
      } catch (err) {
        console.warn('Supabase insert duty error:', err);
      }
    }

    const current = getStorage<Duty[]>('duties', SEED_DUTIES);
    const updated = [newDuty, ...current];
    setStorage('duties', updated);
    return newDuty;
  },

  async updateDuty(id: string, updates: Partial<Duty>): Promise<Duty> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('duties').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update duty error:', err);
      }
    }
    const current = getStorage<Duty[]>('duties', SEED_DUTIES);
    const updated = current.map((d) => (d.id === id ? { ...d, ...updates } : d));
    setStorage('duties', updated);
    const res = updated.find((d) => d.id === id);
    if (!res) throw new Error('Duty not found');
    return res;
  },

  async deleteDuty(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('duties').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete duty error:', err);
      }
    }
    const current = getStorage<Duty[]>('duties', SEED_DUTIES);
    const updated = current.filter((d) => d.id !== id);
    setStorage('duties', updated);
  },

  // SCHEDULED TRIPS
  async getScheduledTrips(date?: string): Promise<ScheduledTrip[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('scheduled_trips').select('*');
        if (date) query = query.eq('date', date);
        const { data, error } = await query.order('scheduled_departure');
        if (!error && data && data.length > 0) return data as ScheduledTrip[];
      } catch (err) {
        console.warn('Supabase fetch trips error, falling back:', err);
      }
    }
    const all = getStorage<ScheduledTrip[]>('scheduled_trips', SEED_SCHEDULED_TRIPS);
    if (date) return all.filter((t) => t.date === date);
    return all;
  },

  // GENERATE DAY'S TRIPS FROM ACTIVE DUTIES & SCHEDULES
  async generateTripsForDate(targetDate: string): Promise<{ generatedCount: number }> {
    const duties = await this.getDuties(targetDate);
    const existingTrips = await this.getScheduledTrips(targetDate);

    const newTrips: ScheduledTrip[] = [];

    duties.forEach((duty) => {
      // Find matching route
      const route = SEED_ROUTES.find((r) => r.id === duty.routeId) || SEED_ROUTES[0];
      const departureTimes = ['06:00', '07:30', '09:00', '11:00', '13:00', '15:00'];

      departureTimes.forEach((dep) => {
        const depMinutes = parseInt(dep.split(':')[0]) * 60 + parseInt(dep.split(':')[1]);
        const arrMinutes = depMinutes + (route.averageDurationMinutes || 20);
        const arrHour = Math.floor(arrMinutes / 60);
        const arrMin = arrMinutes % 60;
        const arrivalTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

        const tripCode = `TRP-${duty.routeCode}-${dep.replace(':', '')}`;

        // Avoid duplicate trip generation
        if (!existingTrips.some((t) => t.tripCode === tripCode && t.date === targetDate)) {
          newTrips.push({
            id: `trp-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            tripCode,
            dutyId: duty.id,
            dutyCode: duty.dutyCode,
            date: targetDate,
            routeId: duty.routeId,
            routeCode: duty.routeCode,
            routeName: duty.routeName,
            originStopName: route.originStopName,
            destinationStopName: route.destinationStopName,
            direction: 'FORWARD',
            vehicleId: duty.vehicleId,
            plateNumber: duty.plateNumber,
            driverId: duty.driverId,
            driverName: duty.driverName,
            scheduledDeparture: dep,
            scheduledArrival: arrivalTime,
            delayMinutes: 0,
            status: 'scheduled',
            stopsCount: route.stops.length,
          });
        }
      });
    });

    const combined = [...newTrips, ...existingTrips].sort((a, b) =>
      a.scheduledDeparture.localeCompare(b.scheduledDeparture)
    );
    setStorage('scheduled_trips', combined);
    return { generatedCount: newTrips.length };
  },

  async updateTripStatus(
    tripId: string,
    status: ScheduledTripStatus,
    actualTime?: string,
    delayMinutes: number = 0
  ): Promise<ScheduledTrip> {
    const current = getStorage<ScheduledTrip[]>('scheduled_trips', SEED_SCHEDULED_TRIPS);
    const updated = current.map((t) => {
      if (t.id === tripId) {
        return {
          ...t,
          status,
          actualDeparture: actualTime || t.actualDeparture || t.scheduledDeparture,
          delayMinutes: delayMinutes ?? t.delayMinutes,
        };
      }
      return t;
    });
    setStorage('scheduled_trips', updated);
    const res = updated.find((t) => t.id === tripId);
    if (!res) throw new Error('Trip not found');
    return res;
  },
};
