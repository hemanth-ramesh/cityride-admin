import { SosAlert, IncidentReport, DriverMessage } from '@/types/safety';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const TODAY_STR = new Date().toISOString().split('T')[0];

// ==========================================
// SEED SOS ALERTS
// ==========================================
export const SEED_SOS_ALERTS: SosAlert[] = [
  {
    id: 'sos-001',
    alertCode: `SOS-${TODAY_STR.replace(/-/g, '')}-01`,
    triggeredAt: new Date(Date.now() - 8 * 60000).toISOString(),
    source: 'PASSENGER_APP',
    vehicleId: 'veh-002',
    plateNumber: 'KA 06 FA 1234',
    fleetNumber: 'CR-TUM-02',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    driverId: 'drv-002',
    driverName: 'Basavaraj Hiremath',
    driverPhone: '+91 98452 10550',
    passengerName: 'Ananya Sharma',
    passengerPhone: '+91 98450 99887',
    latitude: 13.3250,
    longitude: 77.1420,
    nearestStopName: 'Batawadi Junction',
    stage: 'ACKNOWLEDGED',
    acknowledgedBy: 'Super Admin (OCC Station 1)',
    acknowledgedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'sos-002',
    alertCode: `SOS-${TODAY_STR.replace(/-/g, '')}-02`,
    triggeredAt: new Date(Date.now() - 120 * 60000).toISOString(),
    source: 'DRIVER_APP',
    vehicleId: 'veh-001',
    plateNumber: 'KA 06 F 8558',
    fleetNumber: 'CR-TUM-01',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98451 10420',
    latitude: 13.3325,
    longitude: 77.1080,
    nearestStopName: 'Town Hall Circle',
    stage: 'RESOLVED',
    dispatchedServices: ['DEPOT_CREW'],
    acknowledgedBy: 'Operations Manager',
    acknowledgedAt: new Date(Date.now() - 118 * 60000).toISOString(),
    dispatchedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    resolvedBy: 'Operations Manager',
    resolvedAt: new Date(Date.now() - 65 * 60000).toISOString(),
    resolutionNotes: 'Minor door sensor glitch resolved by mobile depot unit. Vehicle resumed normal passenger service.',
  },
];

// ==========================================
// SEED INCIDENTS
// ==========================================
export const SEED_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-001',
    incidentCode: `INC-${TODAY_STR.replace(/-/g, '')}-01`,
    reportedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    category: 'TRAFFIC_GRIDLOCK',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    title: 'Heavy Traffic Jam at Town Hall Junction',
    description: 'Religious festival procession causing 15-minute vehicular backlog affecting Route R01 & R05.',
    routeCode: 'R01',
    locationLandmark: 'Town Hall Circle, BH Road',
    latitude: 13.3325,
    longitude: 77.1080,
    actionTaken: 'Traffic police notified; route diversion recommended via Ashoka Road.',
    reportedBy: 'Driver Rajesh Kumar',
  },
  {
    id: 'inc-002',
    incidentCode: `INC-${TODAY_STR.replace(/-/g, '')}-02`,
    reportedAt: new Date(Date.now() - 95 * 60000).toISOString(),
    category: 'VEHICLE_BREAKDOWN',
    severity: 'HIGH',
    status: 'ACTION_TAKEN',
    title: 'EV Compressor Overheating Warning on Bus #CR-TUM-04',
    description: 'Electric auxiliary air compressor high temperature fault triggered near Melekote KIADB.',
    vehicleId: 'veh-004',
    plateNumber: 'KA 06 F 3920',
    driverName: 'Siddaraju B. N.',
    routeCode: 'R04',
    locationLandmark: 'Melekote Industrial Gate 2',
    latitude: 13.3620,
    longitude: 77.1080,
    actionTaken: 'Backup Feeder Bus CR-TUM-07 dispatched to transfer 32 factory passengers.',
    reportedBy: 'OCC Telemetry Auto-Alert',
  },
  {
    id: 'inc-003',
    incidentCode: `INC-${TODAY_STR.replace(/-/g, '')}-03`,
    reportedAt: new Date(Date.now() - 240 * 60000).toISOString(),
    category: 'ROUTE_BLOCKAGE',
    severity: 'LOW',
    status: 'RESOLVED',
    title: 'Fallen Tree Branch along Belagumba Main Road',
    description: 'Storm debris cleared by municipal corporation road crew within 20 minutes.',
    routeCode: 'R05',
    locationLandmark: 'Belagumba Cross',
    latitude: 13.3410,
    longitude: 77.1120,
    actionTaken: 'Corridor cleared and inspected safe for double-axle transit vehicles.',
    reportedBy: 'Driver Chandrashekariah',
    resolvedAt: new Date(Date.now() - 210 * 60000).toISOString(),
  },
];

// ==========================================
// SEED DRIVER MESSAGES
// ==========================================
export const SEED_DRIVER_MESSAGES: DriverMessage[] = [
  {
    id: 'msg-001',
    sentAt: new Date(Date.now() - 25 * 60000).toISOString(),
    senderName: 'OCC Dispatcher Ramesh',
    senderRole: 'DISPATCHER',
    driverId: 'drv-001',
    driverName: 'Rajesh Kumar',
    vehiclePlate: 'KA 06 F 8558',
    routeCode: 'R01',
    priority: 'URGENT',
    subject: 'Traffic Diversion via Ashoka Road',
    content: 'Please bypass Town Hall circle due to procession gridlock. Use Ashoka Road bypass.',
    deliveryStatus: 'ACKNOWLEDGED_BY_DRIVER',
    acknowledgedAt: new Date(Date.now() - 23 * 60000).toISOString(),
    driverReply: 'Acknowledged OCC. Diverting via Ashoka Road now.',
  },
  {
    id: 'msg-002',
    sentAt: new Date(Date.now() - 15 * 60000).toISOString(),
    senderName: 'Fleet Manager Sunder',
    senderRole: 'FLEET_MANAGER',
    driverId: 'drv-004',
    driverName: 'Siddaraju B. N.',
    vehiclePlate: 'KA 06 F 3920',
    routeCode: 'R04',
    priority: 'EMERGENCY_BROADCAST',
    subject: 'Compressor Warning - Pull over safely',
    content: 'Telemetry indicates compressor temp 88°C. Pull over at next safe bay for depot inspection.',
    deliveryStatus: 'DELIVERED',
  },
];

function getStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(`cityride_safety_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading safety key ${key}:`, e);
  }
  localStorage.setItem(`cityride_safety_${key}`, JSON.stringify(seed));
  return seed;
}

function setStorage<T>(key: string, data: T) {
  localStorage.setItem(`cityride_safety_${key}`, JSON.stringify(data));
}

// ==========================================
// SAFETY SERVICE
// ==========================================
export const SafetyService = {
  // SOS ALERTS
  async getSosAlerts(): Promise<SosAlert[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('sos_alerts')
          .select('*')
          .order('triggered_at', { ascending: false });
        if (!error && data && data.length > 0) return data as SosAlert[];
      } catch (err) {
        console.warn('Supabase fetch SOS alerts error, falling back:', err);
      }
    }
    return getStorage<SosAlert[]>('sos_alerts', SEED_SOS_ALERTS);
  },

  async triggerEmergencyDemo(alertData: Partial<SosAlert>): Promise<SosAlert> {
    const randomIdx = Math.floor(10 + Math.random() * 90);
    const newAlert: SosAlert = {
      id: `sos-${Date.now()}`,
      alertCode: `SOS-${TODAY_STR.replace(/-/g, '')}-${randomIdx}`,
      triggeredAt: new Date().toISOString(),
      source: alertData.source || 'PASSENGER_APP',
      vehicleId: alertData.vehicleId || 'veh-002',
      plateNumber: alertData.plateNumber || 'KA 06 FA 1234',
      fleetNumber: alertData.fleetNumber || 'CR-TUM-02',
      routeCode: alertData.routeCode || 'R02',
      routeName: alertData.routeName || 'KSRTC Stand ↔ Siddaganga Mutt',
      driverId: alertData.driverId || 'drv-002',
      driverName: alertData.driverName || 'Basavaraj Hiremath',
      driverPhone: alertData.driverPhone || '+91 98452 10550',
      passengerName: alertData.passengerName || 'Passenger (App Distress Trigger)',
      latitude: alertData.latitude || 13.3250,
      longitude: alertData.longitude || 77.1420,
      nearestStopName: alertData.nearestStopName || 'Batawadi Junction',
      stage: 'TRIGGERED',
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('sos_alerts').insert(newAlert);
      } catch (err) {
        console.warn('Supabase insert SOS error:', err);
      }
    }

    const current = getStorage<SosAlert[]>('sos_alerts', SEED_SOS_ALERTS);
    const updated = [newAlert, ...current];
    setStorage('sos_alerts', updated);
    return newAlert;
  },

  async acknowledgeSos(id: string, adminName: string): Promise<SosAlert> {
    const current = getStorage<SosAlert[]>('sos_alerts', SEED_SOS_ALERTS);
    const updated = current.map((a) =>
      a.id === id
        ? {
            ...a,
            stage: 'ACKNOWLEDGED' as const,
            acknowledgedBy: adminName,
            acknowledgedAt: new Date().toISOString(),
          }
        : a
    );
    setStorage('sos_alerts', updated);
    const res = updated.find((a) => a.id === id);
    if (!res) throw new Error('Alert not found');
    return res;
  },

  async dispatchHelp(
    id: string,
    services: ('POLICE' | 'AMBULANCE' | 'FIRE' | 'TOW_TRUCK' | 'DEPOT_CREW')[]
  ): Promise<SosAlert> {
    const current = getStorage<SosAlert[]>('sos_alerts', SEED_SOS_ALERTS);
    const updated = current.map((a) =>
      a.id === id
        ? {
            ...a,
            stage: 'HELP_DISPATCHED' as const,
            dispatchedServices: services,
            dispatchedAt: new Date().toISOString(),
          }
        : a
    );
    setStorage('sos_alerts', updated);
    const res = updated.find((a) => a.id === id);
    if (!res) throw new Error('Alert not found');
    return res;
  },

  async resolveSos(id: string, adminName: string, notes: string): Promise<SosAlert> {
    const current = getStorage<SosAlert[]>('sos_alerts', SEED_SOS_ALERTS);
    const updated = current.map((a) =>
      a.id === id
        ? {
            ...a,
            stage: 'RESOLVED' as const,
            resolvedBy: adminName,
            resolvedAt: new Date().toISOString(),
            resolutionNotes: notes,
          }
        : a
    );
    setStorage('sos_alerts', updated);
    const res = updated.find((a) => a.id === id);
    if (!res) throw new Error('Alert not found');
    return res;
  },

  // INCIDENTS
  async getIncidents(): Promise<IncidentReport[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('reported_at', { ascending: false });
        if (!error && data && data.length > 0) return data as IncidentReport[];
      } catch (err) {
        console.warn('Supabase fetch incidents error, falling back:', err);
      }
    }
    return getStorage<IncidentReport[]>('incidents', SEED_INCIDENTS);
  },

  async createIncident(incidentData: Omit<IncidentReport, 'id' | 'incidentCode' | 'reportedAt'>): Promise<IncidentReport> {
    const randomIdx = Math.floor(10 + Math.random() * 90);
    const newInc: IncidentReport = {
      ...incidentData,
      id: `inc-${Date.now()}`,
      incidentCode: `INC-${TODAY_STR.replace(/-/g, '')}-${randomIdx}`,
      reportedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('incidents').insert(newInc);
      } catch (err) {
        console.warn('Supabase insert incident error:', err);
      }
    }

    const current = getStorage<IncidentReport[]>('incidents', SEED_INCIDENTS);
    const updated = [newInc, ...current];
    setStorage('incidents', updated);
    return newInc;
  },

  async updateIncident(id: string, updates: Partial<IncidentReport>): Promise<IncidentReport> {
    const current = getStorage<IncidentReport[]>('incidents', SEED_INCIDENTS);
    const updated = current.map((i) => (i.id === id ? { ...i, ...updates } : i));
    setStorage('incidents', updated);
    const res = updated.find((i) => i.id === id);
    if (!res) throw new Error('Incident not found');
    return res;
  },

  // DRIVER MESSAGING
  async getDriverMessages(): Promise<DriverMessage[]> {
    return getStorage<DriverMessage[]>('driver_messages', SEED_DRIVER_MESSAGES);
  },

  async sendDriverMessage(messageData: Omit<DriverMessage, 'id' | 'sentAt' | 'deliveryStatus'>): Promise<DriverMessage> {
    const newMsg: DriverMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'SENT',
    };

    const current = getStorage<DriverMessage[]>('driver_messages', SEED_DRIVER_MESSAGES);
    const updated = [newMsg, ...current];
    setStorage('driver_messages', updated);
    return newMsg;
  },
};
