export type ShiftType = 'MORNING' | 'EVENING' | 'FULL_DAY' | 'NIGHT_FEEDER';

export interface ShiftDefinition {
  id: ShiftType;
  name: string;
  startTime: string; // e.g. "05:30"
  endTime: string;   // e.g. "14:00"
  color: string;
}

export const SHIFT_CONFIGS: Record<ShiftType, ShiftDefinition> = {
  MORNING: {
    id: 'MORNING',
    name: 'Morning Shift (Shift 1)',
    startTime: '05:30',
    endTime: '14:00',
    color: 'emerald',
  },
  EVENING: {
    id: 'EVENING',
    name: 'Evening Shift (Shift 2)',
    startTime: '13:45',
    endTime: '22:15',
    color: 'blue',
  },
  FULL_DAY: {
    id: 'FULL_DAY',
    name: 'Full Day Shift',
    startTime: '06:00',
    endTime: '20:30',
    color: 'purple',
  },
  NIGHT_FEEDER: {
    id: 'NIGHT_FEEDER',
    name: 'Night Feeder Shift',
    startTime: '21:30',
    endTime: '06:00',
    color: 'slate',
  },
};

export type DutyStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'absent';

export interface Duty {
  id: string;
  dutyCode: string; // e.g. "DUTY-20260824-001"
  date: string;     // "YYYY-MM-DD"
  shift: ShiftType;
  startTime: string;
  endTime: string;
  driverId: string;
  driverName: string;
  driverCode: string;
  driverPhone?: string;
  vehicleId: string;
  plateNumber: string;
  fleetNumber: string;
  routeId: string;
  routeCode: string;
  routeName: string;
  status: DutyStatus;
  notes?: string;
  tripsCount: number;
  tripsCompleted: number;
  createdAt: string;
}

export type ScheduledTripStatus = 
  | 'scheduled'
  | 'ready'
  | 'starting'
  | 'active'
  | 'delayed'
  | 'completed'
  | 'cancelled'
  | 'aborted';

export interface ScheduledTrip {
  id: string;
  tripCode: string;      // e.g. "TRP-R01-0630"
  dutyId: string;
  dutyCode: string;
  date: string;
  routeId: string;
  routeCode: string;
  routeName: string;
  originStopName: string;
  destinationStopName: string;
  direction: 'FORWARD' | 'REVERSE';
  vehicleId: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  scheduledDeparture: string; // "06:30"
  scheduledArrival: string;   // "06:48"
  actualDeparture?: string;   // "06:33"
  actualArrival?: string;
  delayMinutes: number;       // +3 mins
  status: ScheduledTripStatus;
  stopsCount: number;
  currentStopIndex?: number;
  currentStopName?: string;
  cancellationReason?: string;
}

export interface DispatchTimelineEvent {
  tripId: string;
  tripCode: string;
  routeCode: string;
  routeName: string;
  plateNumber: string;
  driverName: string;
  shift: ShiftType;
  plannedTime: string;
  actualTime?: string;
  delayMinutes: number;
  status: ScheduledTripStatus;
  progressPercent: number; // 0 to 100
}
