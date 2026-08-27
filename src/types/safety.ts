export type SosTriggerSource = 'PASSENGER_APP' | 'DRIVER_APP' | 'OCC_DISPATCHER';

export type SosWorkflowStage = 
  | 'TRIGGERED' 
  | 'ACKNOWLEDGED' 
  | 'HELP_DISPATCHED' 
  | 'RESOLVED' 
  | 'FALSE_ALARM';

export interface SosAlert {
  id: string;
  alertCode: string; // e.g. "SOS-20260824-001"
  triggeredAt: string;
  source: SosTriggerSource;
  vehicleId: string;
  plateNumber: string;
  fleetNumber: string;
  routeCode: string;
  routeName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  passengerName?: string;
  passengerPhone?: string;
  latitude: number;
  longitude: number;
  nearestStopName: string;
  stage: SosWorkflowStage;
  dispatchedServices?: ('POLICE' | 'AMBULANCE' | 'FIRE' | 'TOW_TRUCK' | 'DEPOT_CREW')[];
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  dispatchedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export type IncidentCategory = 
  | 'VEHICLE_BREAKDOWN'
  | 'ROAD_ACCIDENT'
  | 'TRAFFIC_GRIDLOCK'
  | 'ROUTE_BLOCKAGE'
  | 'MEDICAL_EMERGENCY'
  | 'SECURITY_VANDALISM'
  | 'WEATHER_FLOODING';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'REPORTED' | 'INVESTIGATING' | 'ACTION_TAKEN' | 'RESOLVED';

export interface IncidentReport {
  id: string;
  incidentCode: string; // e.g. "INC-20260824-01"
  reportedAt: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  vehicleId?: string;
  plateNumber?: string;
  driverId?: string;
  driverName?: string;
  routeId?: string;
  routeCode?: string;
  locationLandmark: string;
  latitude: number;
  longitude: number;
  actionTaken?: string;
  reportedBy: string;
  resolvedAt?: string;
}

export type MessagePriority = 'NORMAL' | 'URGENT' | 'EMERGENCY_BROADCAST';

export interface DriverMessage {
  id: string;
  sentAt: string;
  senderName: string;
  senderRole: string;
  driverId: string;
  driverName: string;
  vehiclePlate: string;
  routeCode: string;
  priority: MessagePriority;
  subject: string;
  content: string;
  deliveryStatus: 'SENT' | 'DELIVERED' | 'ACKNOWLEDGED_BY_DRIVER';
  acknowledgedAt?: string;
  driverReply?: string;
}
