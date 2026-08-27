import {
  PassengerProfile,
  PassengerComplaint,
  LostAndFoundItem,
  PushNotification,
} from '@/types/service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const TODAY_STR = new Date().toISOString().split('T')[0];

// ==========================================
// SEED PASSENGERS
// ==========================================
export const SEED_PASSENGERS: PassengerProfile[] = [
  {
    id: 'pax-001',
    passengerCode: 'TUM-PAX-8901',
    fullName: 'Ananya Sharma',
    phone: '+91 98450 99887',
    email: 'ananya.sharma@gmail.com',
    preferredLanguage: 'ENGLISH',
    emergencyContactName: 'Kishore Sharma (Father)',
    emergencyContactPhone: '+91 98450 11223',
    homeStopName: 'SIT Main Campus',
    workStopName: 'Town Hall Tumakuru',
    favoriteRouteCodes: ['R01', 'R02'],
    totalTripsLogged: 48,
    status: 'active',
    joinedDate: '2026-01-15',
    lastActiveDate: TODAY_STR,
    recentActivity: [
      { tripDate: TODAY_STR, routeCode: 'R01', fromStop: 'SIT Main Campus', toStop: 'Town Hall' },
      { tripDate: '2026-08-23', routeCode: 'R01', fromStop: 'Town Hall', toStop: 'SIT Main Campus' },
      { tripDate: '2026-08-22', routeCode: 'R02', fromStop: 'KSRTC Stand', toStop: 'Siddaganga Mutt' },
    ],
  },
  {
    id: 'pax-002',
    passengerCode: 'TUM-PAX-8902',
    fullName: 'Prasad Bhat',
    phone: '+91 98450 88776',
    email: 'prasad.bhat@tumkuruniv.ac.in',
    preferredLanguage: 'KANNADA',
    emergencyContactName: 'Geetha Bhat (Spouse)',
    emergencyContactPhone: '+91 98450 33445',
    homeStopName: 'Heggere Suburb',
    workStopName: 'Tumkur University',
    favoriteRouteCodes: ['R03'],
    totalTripsLogged: 82,
    status: 'active',
    joinedDate: '2026-01-10',
    lastActiveDate: TODAY_STR,
    recentActivity: [
      { tripDate: TODAY_STR, routeCode: 'R03', fromStop: 'Heggere', toStop: 'Tumkur University' },
    ],
  },
  {
    id: 'pax-003',
    passengerCode: 'TUM-PAX-8903',
    fullName: 'Kavitha Rao',
    phone: '+91 98450 77665',
    email: 'kavitha.rao@tcs.com',
    preferredLanguage: 'KANNADA',
    emergencyContactName: 'Naveen Rao (Brother)',
    emergencyContactPhone: '+91 98450 55667',
    homeStopName: 'Belagumba',
    workStopName: 'Melekote KIADB',
    favoriteRouteCodes: ['R04', 'R05'],
    totalTripsLogged: 34,
    status: 'active',
    joinedDate: '2026-02-01',
    lastActiveDate: TODAY_STR,
    recentActivity: [
      { tripDate: TODAY_STR, routeCode: 'R05', fromStop: 'Belagumba', toStop: 'Town Hall' },
    ],
  },
  {
    id: 'pax-004',
    passengerCode: 'TUM-PAX-8904',
    fullName: 'Ranganath Gowda',
    phone: '+91 98450 66554',
    preferredLanguage: 'KANNADA',
    emergencyContactName: 'Suma Gowda',
    emergencyContactPhone: '+91 98450 99001',
    homeStopName: 'Gulur Cross',
    workStopName: 'City Market',
    favoriteRouteCodes: ['R06'],
    totalTripsLogged: 19,
    status: 'suspended',
    joinedDate: '2026-02-14',
    lastActiveDate: '2026-08-20',
    recentActivity: [],
  },
];

// ==========================================
// SEED COMPLAINTS
// ==========================================
export const SEED_COMPLAINTS: PassengerComplaint[] = [
  {
    id: 'cmp-001',
    ticketCode: `CMP-${TODAY_STR.replace(/-/g, '')}-01`,
    reportedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    passengerName: 'Ananya Sharma',
    passengerPhone: '+91 98450 99887',
    category: 'BUS_LATE_OR_SKIPPED',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    routeCode: 'R02',
    vehiclePlate: 'KA 06 FA 1234',
    driverName: 'Basavaraj Hiremath',
    stopName: 'Batawadi Junction',
    subject: 'Bus arrived 12 minutes past scheduled timetable',
    description: 'The 08:30 scheduled departure arrived at 08:42 at Batawadi Junction with severe passenger crowding.',
    assignedOfficer: 'Support Admin Priya',
    assignedDepot: 'Central Depot 1',
    officialResponse: 'Investigating traffic hold-up near Town Hall. Additional feeder scheduled for evening peak.',
  },
  {
    id: 'cmp-002',
    ticketCode: `CMP-${TODAY_STR.replace(/-/g, '')}-02`,
    reportedAt: new Date(Date.now() - 150 * 60000).toISOString(),
    passengerName: 'Prasad Bhat',
    passengerPhone: '+91 98450 88776',
    category: 'AC_OR_CROWDING',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    routeCode: 'R01',
    vehiclePlate: 'KA 06 F 8558',
    subject: 'AC cooling inadequate during noon shift',
    description: 'Volvo AC Electric bus cabin temperature was hot between 12:00 and 13:00.',
    assignedOfficer: 'Fleet Manager Sunder',
    assignedDepot: 'Central Depot 1',
  },
  {
    id: 'cmp-003',
    ticketCode: `CMP-${TODAY_STR.replace(/-/g, '')}-03`,
    reportedAt: new Date(Date.now() - 360 * 60000).toISOString(),
    passengerName: 'Vinay Kumar',
    passengerPhone: '+91 98450 44332',
    category: 'GPS_TRACKING_GLITCH',
    priority: 'LOW',
    status: 'RESOLVED',
    routeCode: 'R03',
    subject: 'Live bus marker was jittering on passenger map',
    description: 'Vehicle KA 06 G 4321 was showing on previous stop for 2 minutes before jumping.',
    assignedOfficer: 'Support Admin Priya',
    officialResponse: 'Cellular telemetry deadzone identified near underpass. GPS buffer caching optimized in App v2.4.',
    resolvedAt: new Date(Date.now() - 180 * 60000).toISOString(),
    resolvedBy: 'Support Admin Priya',
  },
];

// ==========================================
// SEED LOST & FOUND
// ==========================================
export const SEED_LOST_ITEMS: LostAndFoundItem[] = [
  {
    id: 'lf-001',
    itemCode: `LF-${TODAY_STR.replace(/-/g, '')}-01`,
    reportedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    category: 'ELECTRONICS_AND_PHONES',
    itemName: 'Samsung Galaxy A54 (Navy Blue)',
    description: 'Found on rear seat row 6 with black silicone case and college ID sticker.',
    color: 'Navy Blue',
    brand: 'Samsung',
    foundOnRouteCode: 'R01',
    foundOnVehiclePlate: 'KA 06 F 8558',
    custodyDepot: 'Central Depot 1 Security Locker',
    status: 'FOUND_IN_CUSTODY',
    finderType: 'DRIVER',
    finderName: 'Rajesh Kumar',
    finderPhone: '+91 98451 10420',
  },
  {
    id: 'lf-002',
    itemCode: `LF-${TODAY_STR.replace(/-/g, '')}-02`,
    reportedAt: new Date(Date.now() - 180 * 60000).toISOString(),
    category: 'BAGS_AND_WALLETS',
    itemName: 'Brown Leather Wallet with Aadhaar Card',
    description: 'Contains Tumakuru University ID card in the name of Suresh N.',
    color: 'Brown',
    foundOnRouteCode: 'R03',
    foundOnVehiclePlate: 'KA 06 G 4321',
    custodyDepot: 'Central Depot 1 Lost & Found Desk',
    status: 'VERIFIED',
    finderType: 'PASSENGER',
    finderName: 'Prasad Bhat',
    claimantName: 'Suresh N.',
    claimantPhone: '+91 98450 12121',
    verifiedByOfficer: 'Support Admin Priya',
  },
  {
    id: 'lf-003',
    itemCode: `LF-${TODAY_STR.replace(/-/g, '')}-03`,
    reportedAt: new Date(Date.now() - 1440 * 60000).toISOString(),
    category: 'DOCUMENTS_AND_CARDS',
    itemName: 'Blue Document Folder (Engineering Blueprints)',
    description: 'SIT Mechanical department lab project documents folder.',
    foundOnRouteCode: 'R01',
    custodyDepot: 'Central Depot 1 Security Locker',
    status: 'RETURNED',
    finderType: 'DEPOT_CREW',
    claimantName: 'Rohan Deshmukh',
    claimantPhone: '+91 98450 33221',
    verifiedByOfficer: 'Super Admin',
    returnedAt: new Date(Date.now() - 720 * 60000).toISOString(),
    returnNotes: 'Claimant presented matching college ID proof and signed custody release register.',
  },
];

// ==========================================
// SEED NOTIFICATIONS
// ==========================================
export const SEED_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-001',
    sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
    senderName: 'Operations Manager',
    senderRole: 'OPERATIONS_MANAGER',
    title: 'Route R01 Diversion Advisory',
    message: 'Buses on Route R01 are temporarily diverted via Ashoka Road due to festival procession at Town Hall Circle.',
    category: 'ROUTE_DIVERSION',
    targetType: 'SPECIFIC_ROUTE',
    targetRouteCode: 'R01',
    estimatedRecipients: 420,
    deliverySuccessCount: 418,
  },
  {
    id: 'notif-002',
    sentAt: new Date(Date.now() - 180 * 60000).toISOString(),
    senderName: 'Super Admin',
    senderRole: 'SUPER_ADMIN',
    title: 'Monsoon Service Advisory: Extra Evening Feeders',
    message: 'Evening peak frequency increased to 8-minute intervals across all major corridors.',
    category: 'SERVICE_DELAY',
    targetType: 'GLOBAL_ALL_PASSENGERS',
    estimatedRecipients: 2150,
    deliverySuccessCount: 2142,
  },
];

function getStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(`cityride_service_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading service key ${key}:`, e);
  }
  localStorage.setItem(`cityride_service_${key}`, JSON.stringify(seed));
  return seed;
}

function setStorage<T>(key: string, data: T) {
  localStorage.setItem(`cityride_service_${key}`, JSON.stringify(data));
}

// ==========================================
// SERVICE OPERATIONS API
// ==========================================
export const ServiceOperationsService = {
  // PASSENGERS
  async getPassengers(): Promise<PassengerProfile[]> {
    return getStorage<PassengerProfile[]>('passengers', SEED_PASSENGERS);
  },

  async updatePassengerStatus(id: string, status: PassengerProfile['status']): Promise<PassengerProfile> {
    const current = getStorage<PassengerProfile[]>('passengers', SEED_PASSENGERS);
    const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
    setStorage('passengers', updated);
    const res = updated.find((p) => p.id === id);
    if (!res) throw new Error('Passenger not found');
    return res;
  },

  // COMPLAINTS
  async getComplaints(): Promise<PassengerComplaint[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .order('reported_at', { ascending: false });
        if (!error && data && data.length > 0) return data as PassengerComplaint[];
      } catch (err) {
        console.warn('Supabase fetch complaints error:', err);
      }
    }
    return getStorage<PassengerComplaint[]>('complaints', SEED_COMPLAINTS);
  },

  async createComplaint(data: Omit<PassengerComplaint, 'id' | 'ticketCode' | 'reportedAt'>): Promise<PassengerComplaint> {
    const randomIdx = Math.floor(10 + Math.random() * 90);
    const newCmp: PassengerComplaint = {
      ...data,
      id: `cmp-${Date.now()}`,
      ticketCode: `CMP-${TODAY_STR.replace(/-/g, '')}-${randomIdx}`,
      reportedAt: new Date().toISOString(),
    };
    const current = getStorage<PassengerComplaint[]>('complaints', SEED_COMPLAINTS);
    const updated = [newCmp, ...current];
    setStorage('complaints', updated);
    return newCmp;
  },

  async assignComplaint(id: string, assignedOfficer: string, assignedDepot?: string): Promise<PassengerComplaint> {
    const current = getStorage<PassengerComplaint[]>('complaints', SEED_COMPLAINTS);
    const updated = current.map((c) =>
      c.id === id
        ? {
            ...c,
            status: 'ASSIGNED' as const,
            assignedOfficer,
            assignedDepot: assignedDepot || 'Central Depot 1',
          }
        : c
    );
    setStorage('complaints', updated);
    const res = updated.find((c) => c.id === id);
    if (!res) throw new Error('Complaint not found');
    return res;
  },

  async resolveComplaint(id: string, officialResponse: string, resolvedBy: string): Promise<PassengerComplaint> {
    const current = getStorage<PassengerComplaint[]>('complaints', SEED_COMPLAINTS);
    const updated = current.map((c) =>
      c.id === id
        ? {
            ...c,
            status: 'RESOLVED' as const,
            officialResponse,
            resolvedBy,
            resolvedAt: new Date().toISOString(),
          }
        : c
    );
    setStorage('complaints', updated);
    const res = updated.find((c) => c.id === id);
    if (!res) throw new Error('Complaint not found');
    return res;
  },

  // LOST & FOUND
  async getLostItems(): Promise<LostAndFoundItem[]> {
    return getStorage<LostAndFoundItem[]>('lost_items', SEED_LOST_ITEMS);
  },

  async createLostItem(data: Omit<LostAndFoundItem, 'id' | 'itemCode' | 'reportedAt'>): Promise<LostAndFoundItem> {
    const randomIdx = Math.floor(10 + Math.random() * 90);
    const newItem: LostAndFoundItem = {
      ...data,
      id: `lf-${Date.now()}`,
      itemCode: `LF-${TODAY_STR.replace(/-/g, '')}-${randomIdx}`,
      reportedAt: new Date().toISOString(),
    };
    const current = getStorage<LostAndFoundItem[]>('lost_items', SEED_LOST_ITEMS);
    const updated = [newItem, ...current];
    setStorage('lost_items', updated);
    return newItem;
  },

  async updateItemStatus(id: string, status: LostAndFoundItem['status']): Promise<LostAndFoundItem> {
    const current = getStorage<LostAndFoundItem[]>('lost_items', SEED_LOST_ITEMS);
    const updated = current.map((i) => (i.id === id ? { ...i, status } : i));
    setStorage('lost_items', updated);
    const res = updated.find((i) => i.id === id);
    if (!res) throw new Error('Item not found');
    return res;
  },

  async claimAndReturnItem(
    id: string,
    claimantName: string,
    claimantPhone: string,
    verifiedBy: string,
    notes: string
  ): Promise<LostAndFoundItem> {
    const current = getStorage<LostAndFoundItem[]>('lost_items', SEED_LOST_ITEMS);
    const updated = current.map((i) =>
      i.id === id
        ? {
            ...i,
            status: 'RETURNED' as const,
            claimantName,
            claimantPhone,
            verifiedByOfficer: verifiedBy,
            returnedAt: new Date().toISOString(),
            returnNotes: notes,
          }
        : i
    );
    setStorage('lost_items', updated);
    const res = updated.find((i) => i.id === id);
    if (!res) throw new Error('Item not found');
    return res;
  },

  // NOTIFICATIONS
  async getNotifications(): Promise<PushNotification[]> {
    return getStorage<PushNotification[]>('notifications', SEED_NOTIFICATIONS);
  },

  async sendNotification(
    data: Omit<PushNotification, 'id' | 'sentAt' | 'estimatedRecipients' | 'deliverySuccessCount'>
  ): Promise<PushNotification> {
    const estRecipients = data.targetType === 'GLOBAL_ALL_PASSENGERS' ? 2450 : data.targetType === 'ALL_ACTIVE_DRIVERS' ? 8 : 450;
    const newNotif: PushNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
      estimatedRecipients: estRecipients,
      deliverySuccessCount: Math.round(estRecipients * 0.99),
    };
    const current = getStorage<PushNotification[]>('notifications', SEED_NOTIFICATIONS);
    const updated = [newNotif, ...current];
    setStorage('notifications', updated);
    return newNotif;
  },
};
