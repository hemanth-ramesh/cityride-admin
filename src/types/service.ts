export type PassengerStatus = 'active' | 'suspended' | 'pending_verification';

export interface PassengerProfile {
  id: string;
  passengerCode: string; // e.g. "TUM-PAX-8901"
  fullName: string;
  phone: string;
  email?: string;
  preferredLanguage: 'KANNADA' | 'ENGLISH';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  homeStopName?: string;
  workStopName?: string;
  favoriteRouteCodes: string[];
  totalTripsLogged: number;
  status: PassengerStatus;
  joinedDate: string;
  lastActiveDate: string;
  recentActivity: {
    tripDate: string;
    routeCode: string;
    fromStop: string;
    toStop: string;
  }[];
}

export type ComplaintCategory =
  | 'BUS_LATE_OR_SKIPPED'
  | 'RECKLESS_DRIVING'
  | 'BUS_CLEANLINESS'
  | 'DRIVER_BEHAVIOR'
  | 'BUS_CROWDING'
  | 'GPS_TRACKING_GLITCH'
  | 'ROUTE_INFORMATION'
  | 'STAFF_MISCONDUCT'
  | 'OTHER';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface PassengerComplaint {
  id: string;
  ticketCode: string; // e.g. "CMP-20260824-001"
  reportedAt: string;
  passengerId?: string;
  passengerName: string;
  passengerPhone: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  routeCode?: string;
  vehiclePlate?: string;
  driverName?: string;
  stopName?: string;
  subject: string;
  description: string;
  assignedOfficer?: string;
  assignedDepot?: string;
  officialResponse?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type LostItemCategory =
  | 'BAGS_AND_WALLETS'
  | 'ELECTRONICS_AND_PHONES'
  | 'DOCUMENTS_AND_CARDS'
  | 'KEYS'
  | 'CLOTHING_AND_APPAREL'
  | 'BOOKS_AND_STATIONERY'
  | 'OTHER';

export type LostItemStatus = 'REPORTED' | 'FOUND_IN_CUSTODY' | 'VERIFIED' | 'RETURNED' | 'UNCLAIMED';

export interface LostAndFoundItem {
  id: string;
  itemCode: string; // e.g. "LF-20260824-001"
  reportedAt: string;
  category: LostItemCategory;
  itemName: string;
  description: string;
  color?: string;
  brand?: string;
  foundOnRouteCode?: string;
  foundOnVehiclePlate?: string;
  foundAtStopName?: string;
  custodyDepot: string;
  status: LostItemStatus;
  finderType: 'DRIVER' | 'PASSENGER' | 'DEPOT_CREW';
  finderName?: string;
  finderPhone?: string;
  claimantName?: string;
  claimantPhone?: string;
  claimantIdProof?: string;
  verifiedByOfficer?: string;
  returnedAt?: string;
  returnNotes?: string;
}

export type NotificationTargetType =
  | 'GLOBAL_ALL_PASSENGERS'
  | 'SPECIFIC_ROUTE'
  | 'ALL_ACTIVE_DRIVERS'
  | 'SPECIFIC_STOP';

export type NotificationCategory =
  | 'SERVICE_DELAY'
  | 'ROUTE_DIVERSION'
  | 'WEATHER_ALERT'
  | 'SYSTEM_MAINTENANCE'
  | 'EMERGENCY_BULLETIN'
  | 'GENERAL_ANNOUNCEMENT';

export interface PushNotification {
  id: string;
  sentAt: string;
  senderName: string;
  senderRole: string;
  title: string;
  message: string;
  category: NotificationCategory;
  targetType: NotificationTargetType;
  targetRouteCode?: string;
  targetStopName?: string;
  estimatedRecipients: number;
  deliverySuccessCount: number;
}
