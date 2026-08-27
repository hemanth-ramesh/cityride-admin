export type DriverStatus = 'active' | 'suspended' | 'on_duty' | 'off_duty' | 'on_leave';

export interface Driver {
  id: string;
  driverCode: string; // e.g. "TUM-DRV-1042"
  fullName: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  depotId: string;
  depotName: string;
  status: DriverStatus;
  bloodGroup?: string;
  assignedBusId?: string;
  assignedPlateNumber?: string;
  assignedRouteId?: string;
  assignedRouteCode?: string;
  totalTripsCompleted: number;
  onTimeRating: number; // e.g. 96.5%
  incidentCount: number;
  joinedDate: string;
}

export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'decommissioned';

export type BusFleetType = 
  | 'AC Volvo Electric'
  | 'City Regular Eco'
  | 'Smart Feeder Electric'
  | 'Industrial Express'
  | 'City Connector'
  | 'Suburban Shuttle'
  | 'Pilgrim Special';

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. "KA 06 F 8558"
  normalizedNumber: string;   // "KA06F8558"
  fleetNumber: string;         // "CR-TUM-01"
  fleetType: BusFleetType;
  capacity: number;
  seatingCapacity: number;
  standingCapacity: number;
  status: VehicleStatus;
  depotId: string;
  depotName: string;
  isElectric: boolean;
  hasAc: boolean;
  manufactureYear: number;
  chassisNumber?: string;
  currentDriverId?: string;
  currentDriverName?: string;
  currentRouteId?: string;
  currentRouteCode?: string;
  lastOdometerKm: number;
  nextServiceDate: string;
  lastSeenLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export type BusStopFacility = 
  | 'bus_shelter'
  | 'seating'
  | 'lighting'
  | 'passenger_info_display'
  | 'cctv_surveillance'
  | 'wheelchair_accessible'
  | 'drinking_water'
  | 'digital_ticketing';

export interface BusStop {
  id: string;
  stopCode: string; // e.g. "TUM_BS_001"
  name: string; // "KSRTC Bus Stand Tumakuru"
  kannadaName: string; // "ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ ತುಮಕೂರು"
  latitude: number;
  longitude: number;
  area: string;
  landmark?: string;
  geofenceRadiusMeters: number;
  facilities: BusStopFacility[];
  routeIds: string[];
  routeNames: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteStopSequence {
  stopId: string;
  stopCode: string;
  stopName: string;
  kannadaName: string;
  orderIndex: number;
  distanceFromStartKm: number;
  estimatedTravelMinutes: number;
  dwellTimeSeconds: number;
  latitude: number;
  longitude: number;
}

export interface TransitRoute {
  id: string;
  routeCode: string; // e.g. "R01"
  routeName: string; // "KSRTC Bus Stand ↔ SIT Back Gate"
  originStopId: string;
  originStopName: string;
  destinationStopId: string;
  destinationStopName: string;
  viaSummary: string;
  direction: 'UP' | 'DOWN' | 'CIRCULAR';
  totalDistanceKm: number;
  averageDurationMinutes: number;
  colorHex: string;
  stops: RouteStopSequence[];
  activeBusesCount: number;
  dailyFrequencyMinutes: number;
  firstBusTime: string; // "06:00"
  lastBusTime: string;  // "22:30"
  status: 'active' | 'suspended' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface TimetableSlot {
  id: string;
  tripCode: string; // "R01-0630"
  departureTime: string; // "06:30"
  arrivalTime: string;   // "07:15"
  assignedVehicleId?: string;
  assignedPlateNumber?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  frequencyType: 'WEEKDAY' | 'WEEKEND' | 'ALL_DAYS';
  status: 'active' | 'suspended';
}

export interface RouteSchedule {
  id: string;
  routeId: string;
  routeCode: string;
  routeName: string;
  direction: 'FORWARD' | 'REVERSE';
  effectiveFrom: string;
  effectiveTo?: string;
  slots: TimetableSlot[];
  status: 'active' | 'draft' | 'archived';
  stopArrivalTimetable: {
    stopId: string;
    stopName: string;
    sequence: number;
    scheduledArrival: string;
    scheduledDeparture: string;
  }[];
}
