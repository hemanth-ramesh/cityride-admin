import { BusStop, TransitRoute, Vehicle, Driver, RouteSchedule, BusStopFacility } from '@/types/masterData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// ==========================================
// SEED DATA: 36 VERIFIED TUMAKURU BUS STOPS
// ==========================================
export const SEED_BUS_STOPS: BusStop[] = [
  {
    id: 'stop-001',
    stopCode: 'TUM_BS_001',
    name: 'KSRTC Bus Stand Tumakuru',
    kannadaName: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ ತುಮಕೂರು',
    latitude: 13.3395,
    longitude: 77.1005,
    area: 'City Center Terminal',
    landmark: 'Opposite Railway Overbridge',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'cctv_surveillance', 'wheelchair_accessible', 'drinking_water', 'digital_ticketing'],
    routeIds: ['R01', 'R02', 'R04', 'R06', 'R07'],
    routeNames: ['Route 1', 'Route 2', 'Route 4', 'Route 6', 'Route 7'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-002',
    stopCode: 'TUM_BS_002',
    name: 'Ashoka Road Circle',
    kannadaName: 'ಅಶೋಕ ರಸ್ತೆ ವೃತ್ತ',
    latitude: 13.3360,
    longitude: 77.1042,
    area: 'City Market',
    landmark: 'Near Gandhi Statue',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting', 'digital_ticketing'],
    routeIds: ['R01', 'R02', 'R07'],
    routeNames: ['Route 1', 'Route 2', 'Route 7'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-003',
    stopCode: 'TUM_BS_003',
    name: 'Town Hall Tumakuru',
    kannadaName: 'ಟೌನ್ ಹಾಲ್',
    latitude: 13.3325,
    longitude: 77.1080,
    area: 'Corporation Circle',
    landmark: 'Municipal Corporation Building',
    geofenceRadiusMeters: 45,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'cctv_surveillance', 'wheelchair_accessible'],
    routeIds: ['R01', 'R05'],
    routeNames: ['Route 1', 'Route 5'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-004',
    stopCode: 'TUM_BS_004',
    name: 'SS Puram Circle',
    kannadaName: 'ಎಸ್.ಎಸ್ ಪುರಂ ವೃತ್ತ',
    latitude: 13.3280,
    longitude: 77.1140,
    area: 'SS Puram Main',
    landmark: 'Near SS Puram Post Office',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting', 'digital_ticketing'],
    routeIds: ['R01', 'R07'],
    routeNames: ['Route 1', 'Route 7'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-005',
    stopCode: 'TUM_BS_005',
    name: 'SIT Main Gate',
    kannadaName: 'ಎಸ್.ಐ.ಟಿ ಮುಖ್ಯ ದ್ವಾರ',
    latitude: 13.3235,
    longitude: 77.1215,
    area: 'SIT Engineering Campus',
    landmark: 'Opposite Administrative Block',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'cctv_surveillance', 'wheelchair_accessible', 'digital_ticketing'],
    routeIds: ['R01'],
    routeNames: ['Route 1'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-006',
    stopCode: 'TUM_BS_006',
    name: 'SIT Back Gate',
    kannadaName: 'ಎಸ್.ಐ.ಟಿ ಹಿಂಭಾಗದ ದ್ವಾರ',
    latitude: 13.3200,
    longitude: 77.1265,
    area: 'SIT Hostel Zone',
    landmark: 'Behind Boys Hostel Block 4',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R01'],
    routeNames: ['Route 1'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-007',
    stopCode: 'TUM_BS_007',
    name: 'Mandi Pete Gate',
    kannadaName: 'ಮಂಡಿ ಪೇಟೆ ಗೇಟ್',
    latitude: 13.3370,
    longitude: 77.1120,
    area: 'Grain Market',
    landmark: 'APMC Market Entrance',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R02'],
    routeNames: ['Route 2'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-008',
    stopCode: 'TUM_BS_008',
    name: 'Batawadi Circle',
    kannadaName: 'ಬಟವಾಡಿ ವೃತ್ತ',
    latitude: 13.3330,
    longitude: 77.1280,
    area: 'Batawadi',
    landmark: 'NH 48 Bypass Junction',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'cctv_surveillance'],
    routeIds: ['R02'],
    routeNames: ['Route 2'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-009',
    stopCode: 'TUM_BS_009',
    name: 'Kyathsandra',
    kannadaName: 'ಕ್ಯಾತಸಂದ್ರ',
    latitude: 13.3275,
    longitude: 77.1480,
    area: 'Kyathsandra Town',
    landmark: 'Near Famous Thatte Idli Center',
    geofenceRadiusMeters: 45,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'digital_ticketing'],
    routeIds: ['R02'],
    routeNames: ['Route 2'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-010',
    stopCode: 'TUM_BS_010',
    name: 'Mandaragiri Cross',
    kannadaName: 'ಮಂದಾರಗಿರಿ ಕ್ರಾಸ್',
    latitude: 13.3230,
    longitude: 77.1580,
    area: 'Mandaragiri Heritage',
    landmark: 'Heritage Hill Arch',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R02'],
    routeNames: ['Route 2'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-011',
    stopCode: 'TUM_BS_011',
    name: 'Siddaganga Mutt',
    kannadaName: 'ಸಿದ್ಧಗಂಗಾ ಮಠ',
    latitude: 13.3180,
    longitude: 77.1680,
    area: 'Siddaganga Kshetra',
    landmark: 'Sri Shivakumara Swamiji Memorial',
    geofenceRadiusMeters: 60,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'cctv_surveillance', 'wheelchair_accessible', 'drinking_water', 'digital_ticketing'],
    routeIds: ['R02'],
    routeNames: ['Route 2'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-012',
    stopCode: 'TUM_BS_012',
    name: 'Tumkur University',
    kannadaName: 'ತುಮಕೂರು ವಿವಿ',
    latitude: 13.3440,
    longitude: 77.0980,
    area: 'University Enclave',
    landmark: 'Main Administrative Block',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'wheelchair_accessible', 'digital_ticketing'],
    routeIds: ['R03', 'R08'],
    routeNames: ['Route 3', 'Route 8'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-013',
    stopCode: 'TUM_BS_013',
    name: 'Gubbi Gate Circle',
    kannadaName: 'ಗುಬ್ಬಿ ಗೇಟ್ ವೃತ್ತ',
    latitude: 13.3380,
    longitude: 77.0920,
    area: 'Gubbi Gate',
    landmark: 'Old City Toll Gate',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R03', 'R08'],
    routeNames: ['Route 3', 'Route 8'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-014',
    stopCode: 'TUM_BS_014',
    name: 'Devarayapatna',
    kannadaName: 'ದೇವರಾಯಪಟ್ಟಣ',
    latitude: 13.3290,
    longitude: 77.0850,
    area: 'Devarayapatna',
    landmark: 'Near Govt Primary School',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R03'],
    routeNames: ['Route 3'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-015',
    stopCode: 'TUM_BS_015',
    name: 'Janasiri Campus',
    kannadaName: 'ಜನಸಿರಿ ಕ್ಯಾಂಪಸ್',
    latitude: 13.3180,
    longitude: 77.0780,
    area: 'Janasiri Layout',
    landmark: 'Janasiri Polytechnic Gate',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R03'],
    routeNames: ['Route 3'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-016',
    stopCode: 'TUM_BS_016',
    name: 'Heggere',
    kannadaName: 'ಹೆಗ್ಗೆರೆ',
    latitude: 13.3050,
    longitude: 77.0700,
    area: 'Heggere Suburb',
    landmark: 'Heggere Bus Terminal',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R03'],
    routeNames: ['Route 3'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-017',
    stopCode: 'TUM_BS_017',
    name: 'Sira Gate Junction',
    kannadaName: 'ಶಿರಾ ಗೇಟ್ ಜಂಕ್ಷನ್',
    latitude: 13.3510,
    longitude: 77.1020,
    area: 'Sira Gate',
    landmark: 'North Highway Cross',
    geofenceRadiusMeters: 45,
    facilities: ['bus_shelter', 'seating', 'lighting', 'cctv_surveillance'],
    routeIds: ['R04'],
    routeNames: ['Route 4'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-018',
    stopCode: 'TUM_BS_018',
    name: 'Bhansankri',
    kannadaName: 'ಬನಶಂಕರಿ',
    latitude: 13.3590,
    longitude: 77.1050,
    area: 'Banashankari Extension',
    landmark: 'Banashankari Temple',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R04'],
    routeNames: ['Route 4'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-019',
    stopCode: 'TUM_BS_019',
    name: 'Hanumanthapura',
    kannadaName: 'ಹನುಮಂತಪುರ',
    latitude: 13.3680,
    longitude: 77.1090,
    area: 'Hanumanthapura',
    landmark: 'Hanuman Temple Circle',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R04'],
    routeNames: ['Route 4'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-020',
    stopCode: 'TUM_BS_020',
    name: 'Melekote Ind. Area',
    kannadaName: 'ಮೇಕೋಟೆ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ',
    latitude: 13.3790,
    longitude: 77.1140,
    area: 'KIADB Industrial Zone',
    landmark: 'KIADB Administrative Complex',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting', 'passenger_info_display', 'cctv_surveillance', 'digital_ticketing'],
    routeIds: ['R04'],
    routeNames: ['Route 4'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-021',
    stopCode: 'TUM_BS_021',
    name: 'Belagumba',
    kannadaName: 'ಬೆಳಗುಂಬ',
    latitude: 13.3550,
    longitude: 77.0850,
    area: 'Belagumba',
    landmark: 'Belagumba Circle',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R05'],
    routeNames: ['Route 5'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-022',
    stopCode: 'TUM_BS_022',
    name: 'Upparahalli',
    kannadaName: 'ಉಪ್ಪಾರಹಳ್ಳಿ',
    latitude: 13.3480,
    longitude: 77.0910,
    area: 'Upparahalli',
    landmark: 'Water Tank Circle',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R05'],
    routeNames: ['Route 5'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-023',
    stopCode: 'TUM_BS_023',
    name: 'Jayanagara',
    kannadaName: 'ಜಯನಗರ',
    latitude: 13.3390,
    longitude: 77.0950,
    area: 'Jayanagar',
    landmark: 'Jayanagar Park',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R05'],
    routeNames: ['Route 5'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-024',
    stopCode: 'TUM_BS_024',
    name: 'SP Office',
    kannadaName: 'ಎಸ್.ಪಿ ಕಚೇರಿ',
    latitude: 13.3320,
    longitude: 77.1020,
    area: 'Police Headquarters',
    landmark: 'District Police Office',
    geofenceRadiusMeters: 45,
    facilities: ['bus_shelter', 'seating', 'lighting', 'cctv_surveillance'],
    routeIds: ['R05'],
    routeNames: ['Route 5'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-025',
    stopCode: 'TUM_BS_025',
    name: 'Badrama Chowtry',
    kannadaName: 'ಬದ್ರಮ್ಮ ಛೌಲ್ಟ್ರಿ',
    latitude: 13.3250,
    longitude: 77.1090,
    area: 'Badrama Circle',
    landmark: 'Kalyana Mantapa',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R05'],
    routeNames: ['Route 5'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-026',
    stopCode: 'TUM_BS_026',
    name: 'Oorukere',
    kannadaName: 'ಊರುಕೆರೆ',
    latitude: 13.3280,
    longitude: 77.0950,
    area: 'Oorukere',
    landmark: 'Oorukere Lake View',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R06'],
    routeNames: ['Route 6'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-027',
    stopCode: 'TUM_BS_027',
    name: 'Sathyamangala',
    kannadaName: 'ಸತ್ಯಮಂಗಲ',
    latitude: 13.3150,
    longitude: 77.0900,
    area: 'Sathyamangala',
    landmark: 'Community Center',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R06'],
    routeNames: ['Route 6'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-028',
    stopCode: 'TUM_BS_028',
    name: 'Gulur',
    kannadaName: 'ಗುಳೂರು',
    latitude: 13.3020,
    longitude: 77.0850,
    area: 'Gulur Town',
    landmark: 'Gulur Ganesha Temple',
    geofenceRadiusMeters: 45,
    facilities: ['bus_shelter', 'seating', 'lighting', 'digital_ticketing'],
    routeIds: ['R06'],
    routeNames: ['Route 6'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-029',
    stopCode: 'TUM_BS_029',
    name: 'Badihalli',
    kannadaName: 'ಬಾಡಿಹಳ್ಳಿ',
    latitude: 13.2910,
    longitude: 77.0800,
    area: 'Badihalli Village',
    landmark: 'Badihalli Circle',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R06'],
    routeNames: ['Route 6'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-030',
    stopCode: 'TUM_BS_030',
    name: 'Badudihalli',
    kannadaName: 'ಬಾಡುದಿಹಳ್ಳಿ',
    latitude: 13.3620,
    longitude: 77.0780,
    area: 'Badudihalli Road',
    landmark: 'Feeder Cross',
    geofenceRadiusMeters: 35,
    facilities: ['lighting'],
    routeIds: ['R08'],
    routeNames: ['Route 8'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-031',
    stopCode: 'TUM_BS_031',
    name: 'Bellavi',
    kannadaName: 'ಬೆಳ್ಳಾವಿ',
    latitude: 13.4150,
    longitude: 77.0250,
    area: 'Bellavi Rural Hub',
    landmark: 'Bellavi Market Square',
    geofenceRadiusMeters: 50,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R08'],
    routeNames: ['Route 8'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-032',
    stopCode: 'TUM_BS_032',
    name: 'Dibbur',
    kannadaName: 'ದಿಬ್ಬೂರು',
    latitude: 13.3710,
    longitude: 77.0920,
    area: 'Dibbur',
    landmark: 'Near Govt High School',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R04'],
    routeNames: ['Route 4'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-033',
    stopCode: 'TUM_BS_033',
    name: 'Gangasandra',
    kannadaName: 'ಗಂಗಾಸಂದ್ರ',
    latitude: 13.3120,
    longitude: 77.1150,
    area: 'Gangasandra',
    landmark: 'Gangasandra Lake Gate',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R07'],
    routeNames: ['Route 7'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-034',
    stopCode: 'TUM_BS_034',
    name: 'Haralur',
    kannadaName: 'ಹರಳೂರು',
    latitude: 13.3850,
    longitude: 77.0650,
    area: 'Haralur',
    landmark: 'Haralur Grama Panchayat',
    geofenceRadiusMeters: 35,
    facilities: ['lighting'],
    routeIds: ['R08'],
    routeNames: ['Route 8'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-035',
    stopCode: 'TUM_BS_035',
    name: 'HMT Colony',
    kannadaName: 'ಎಚ್.ಎಂ.ಟಿ ಕಾಲೋನಿ',
    latitude: 13.3620,
    longitude: 77.1250,
    area: 'HMT Enclave',
    landmark: 'HMT Watch Factory Quarters',
    geofenceRadiusMeters: 45,
    facilities: ['bus_shelter', 'seating', 'lighting'],
    routeIds: ['R04'],
    routeNames: ['Route 4'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'stop-036',
    stopCode: 'TUM_BS_036',
    name: 'Shettihalli',
    kannadaName: 'ಶೆಟ್ಟಿಹಳ್ಳಿ',
    latitude: 13.3250,
    longitude: 77.1350,
    area: 'Shettihalli',
    landmark: 'Shettihalli Railway Gate',
    geofenceRadiusMeters: 40,
    facilities: ['bus_shelter', 'lighting'],
    routeIds: ['R07'],
    routeNames: ['Route 7'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// ==========================================
// SEED DATA: 8 TUMAKURU TRANSIT ROUTES
// ==========================================
export const SEED_ROUTES: TransitRoute[] = [
  {
    id: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    originStopId: 'stop-001',
    originStopName: 'KSRTC Bus Stand Tumakuru',
    destinationStopId: 'stop-006',
    destinationStopName: 'SIT Back Gate',
    viaSummary: 'via Ashoka Road, Town Hall, SS Puram, SIT Main Gate',
    direction: 'UP',
    totalDistanceKm: 4.8,
    averageDurationMinutes: 18,
    colorHex: '#059669',
    activeBusesCount: 2,
    dailyFrequencyMinutes: 10,
    firstBusTime: '06:00',
    lastBusTime: '22:30',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-001', stopCode: 'TUM_BS_001', stopName: 'KSRTC Bus Stand Tumakuru', kannadaName: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3395, longitude: 77.1005 },
      { stopId: 'stop-002', stopCode: 'TUM_BS_002', stopName: 'Ashoka Road Circle', kannadaName: 'ಅಶೋಕ ರಸ್ತೆ ವೃತ್ತ', orderIndex: 2, distanceFromStartKm: 0.8, estimatedTravelMinutes: 3, dwellTimeSeconds: 30, latitude: 13.3360, longitude: 77.1042 },
      { stopId: 'stop-003', stopCode: 'TUM_BS_003', stopName: 'Town Hall Tumakuru', kannadaName: 'ಟೌನ್ ಹಾಲ್', orderIndex: 3, distanceFromStartKm: 1.6, estimatedTravelMinutes: 6, dwellTimeSeconds: 45, latitude: 13.3325, longitude: 77.1080 },
      { stopId: 'stop-004', stopCode: 'TUM_BS_004', stopName: 'SS Puram Circle', kannadaName: 'ಎಸ್.ಎಸ್ ಪುರಂ ವೃತ್ತ', orderIndex: 4, distanceFromStartKm: 2.8, estimatedTravelMinutes: 10, dwellTimeSeconds: 40, latitude: 13.3280, longitude: 77.1140 },
      { stopId: 'stop-005', stopCode: 'TUM_BS_005', stopName: 'SIT Main Gate', kannadaName: 'ಎಸ್.ಐ.ಟಿ ಮುಖ್ಯ ದ್ವಾರ', orderIndex: 5, distanceFromStartKm: 4.0, estimatedTravelMinutes: 15, dwellTimeSeconds: 60, latitude: 13.3235, longitude: 77.1215 },
      { stopId: 'stop-006', stopCode: 'TUM_BS_006', stopName: 'SIT Back Gate', kannadaName: 'ಎಸ್.ಐ.ಟಿ ಹಿಂಭಾಗದ ದ್ವಾರ', orderIndex: 6, distanceFromStartKm: 4.8, estimatedTravelMinutes: 18, dwellTimeSeconds: 60, latitude: 13.3200, longitude: 77.1265 },
    ],
  },
  {
    id: 'route-002',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    originStopId: 'stop-001',
    originStopName: 'KSRTC Bus Stand Tumakuru',
    destinationStopId: 'stop-011',
    destinationStopName: 'Siddaganga Mutt',
    viaSummary: 'via Mandi Pete, Batawadi, Kyathsandra, Mandaragiri',
    direction: 'UP',
    totalDistanceKm: 7.6,
    averageDurationMinutes: 26,
    colorHex: '#2563eb',
    activeBusesCount: 2,
    dailyFrequencyMinutes: 12,
    firstBusTime: '05:45',
    lastBusTime: '22:00',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-001', stopCode: 'TUM_BS_001', stopName: 'KSRTC Bus Stand Tumakuru', kannadaName: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3395, longitude: 77.1005 },
      { stopId: 'stop-007', stopCode: 'TUM_BS_007', stopName: 'Mandi Pete Gate', kannadaName: 'ಮಂಡಿ ಪೇಟೆ ಗೇಟ್', orderIndex: 2, distanceFromStartKm: 1.2, estimatedTravelMinutes: 5, dwellTimeSeconds: 30, latitude: 13.3370, longitude: 77.1120 },
      { stopId: 'stop-008', stopCode: 'TUM_BS_008', stopName: 'Batawadi Circle', kannadaName: 'ಬಟವಾಡಿ ವೃತ್ತ', orderIndex: 3, distanceFromStartKm: 2.8, estimatedTravelMinutes: 10, dwellTimeSeconds: 45, latitude: 13.3330, longitude: 77.1280 },
      { stopId: 'stop-009', stopCode: 'TUM_BS_009', stopName: 'Kyathsandra', kannadaName: 'ಕ್ಯಾತಸಂದ್ರ', orderIndex: 4, distanceFromStartKm: 5.0, estimatedTravelMinutes: 17, dwellTimeSeconds: 45, latitude: 13.3275, longitude: 77.1480 },
      { stopId: 'stop-010', stopCode: 'TUM_BS_010', stopName: 'Mandaragiri Cross', kannadaName: 'ಮಂದಾರಗಿರಿ ಕ್ರಾಸ್', orderIndex: 5, distanceFromStartKm: 6.4, estimatedTravelMinutes: 22, dwellTimeSeconds: 30, latitude: 13.3230, longitude: 77.1580 },
      { stopId: 'stop-011', stopCode: 'TUM_BS_011', stopName: 'Siddaganga Mutt', kannadaName: 'ಸಿದ್ಧಗಂಗಾ ಮಠ', orderIndex: 6, distanceFromStartKm: 7.6, estimatedTravelMinutes: 26, dwellTimeSeconds: 60, latitude: 13.3180, longitude: 77.1680 },
    ],
  },
  {
    id: 'route-003',
    routeCode: 'R03',
    routeName: 'Tumkur University ↔ Heggere',
    originStopId: 'stop-012',
    originStopName: 'Tumkur University',
    destinationStopId: 'stop-016',
    destinationStopName: 'Heggere',
    viaSummary: 'via Gubbi Gate, Devarayapatna, Janasiri Campus',
    direction: 'UP',
    totalDistanceKm: 6.2,
    averageDurationMinutes: 22,
    colorHex: '#7c3aed',
    activeBusesCount: 1,
    dailyFrequencyMinutes: 15,
    firstBusTime: '06:30',
    lastBusTime: '21:30',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-012', stopCode: 'TUM_BS_012', stopName: 'Tumkur University', kannadaName: 'ತುಮಕೂರು ವಿವಿ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3440, longitude: 77.0980 },
      { stopId: 'stop-013', stopCode: 'TUM_BS_013', stopName: 'Gubbi Gate Circle', kannadaName: 'ಗುಬ್ಬಿ ಗೇಟ್ ವೃತ್ತ', orderIndex: 2, distanceFromStartKm: 1.1, estimatedTravelMinutes: 4, dwellTimeSeconds: 30, latitude: 13.3380, longitude: 77.0920 },
      { stopId: 'stop-014', stopCode: 'TUM_BS_014', stopName: 'Devarayapatna', kannadaName: 'ದೇವರಾಯಪಟ್ಟಣ', orderIndex: 3, distanceFromStartKm: 2.5, estimatedTravelMinutes: 9, dwellTimeSeconds: 30, latitude: 13.3290, longitude: 77.0850 },
      { stopId: 'stop-015', stopCode: 'TUM_BS_015', stopName: 'Janasiri Campus', kannadaName: 'ಜನಸಿರಿ ಕ್ಯಾಂಪಸ್', orderIndex: 4, distanceFromStartKm: 4.2, estimatedTravelMinutes: 15, dwellTimeSeconds: 45, latitude: 13.3180, longitude: 77.0780 },
      { stopId: 'stop-016', stopCode: 'TUM_BS_016', stopName: 'Heggere', kannadaName: 'ಹೆಗ್ಗೆರೆ', orderIndex: 5, distanceFromStartKm: 6.2, estimatedTravelMinutes: 22, dwellTimeSeconds: 60, latitude: 13.3050, longitude: 77.0700 },
    ],
  },
  {
    id: 'route-004',
    routeCode: 'R04',
    routeName: 'KSRTC Stand ↔ Melekote Industrial',
    originStopId: 'stop-001',
    originStopName: 'KSRTC Bus Stand Tumakuru',
    destinationStopId: 'stop-020',
    destinationStopName: 'Melekote Ind. Area',
    viaSummary: 'via Sira Gate, Bhansankri, Hanumanthapura, HMT Colony, Dibbur',
    direction: 'UP',
    totalDistanceKm: 6.8,
    averageDurationMinutes: 24,
    colorHex: '#ea580c',
    activeBusesCount: 1,
    dailyFrequencyMinutes: 15,
    firstBusTime: '06:15',
    lastBusTime: '22:00',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-001', stopCode: 'TUM_BS_001', stopName: 'KSRTC Bus Stand Tumakuru', kannadaName: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3395, longitude: 77.1005 },
      { stopId: 'stop-017', stopCode: 'TUM_BS_017', stopName: 'Sira Gate Junction', kannadaName: 'ಶಿರಾ ಗೇಟ್ ಜಂಕ್ಷನ್', orderIndex: 2, distanceFromStartKm: 1.4, estimatedTravelMinutes: 5, dwellTimeSeconds: 30, latitude: 13.3510, longitude: 77.1020 },
      { stopId: 'stop-018', stopCode: 'TUM_BS_018', stopName: 'Bhansankri', kannadaName: 'ಬನಶಂಕರಿ', orderIndex: 3, distanceFromStartKm: 2.4, estimatedTravelMinutes: 9, dwellTimeSeconds: 30, latitude: 13.3590, longitude: 77.1050 },
      { stopId: 'stop-019', stopCode: 'TUM_BS_019', stopName: 'Hanumanthapura', kannadaName: 'ಹನುಮಂತಪುರ', orderIndex: 4, distanceFromStartKm: 3.6, estimatedTravelMinutes: 13, dwellTimeSeconds: 30, latitude: 13.3680, longitude: 77.1090 },
      { stopId: 'stop-035', stopCode: 'TUM_BS_035', stopName: 'HMT Colony', kannadaName: 'ಎಚ್.ಎಂ.ಟಿ ಕಾಲೋನಿ', orderIndex: 5, distanceFromStartKm: 4.4, estimatedTravelMinutes: 16, dwellTimeSeconds: 30, latitude: 13.3620, longitude: 77.1250 },
      { stopId: 'stop-032', stopCode: 'TUM_BS_032', stopName: 'Dibbur', kannadaName: 'ದಿಬ್ಬೂರು', orderIndex: 6, distanceFromStartKm: 5.2, estimatedTravelMinutes: 19, dwellTimeSeconds: 30, latitude: 13.3710, longitude: 77.0920 },
      { stopId: 'stop-020', stopCode: 'TUM_BS_020', stopName: 'Melekote Ind. Area', kannadaName: 'ಮೇಕೋಟೆ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ', orderIndex: 7, distanceFromStartKm: 6.8, estimatedTravelMinutes: 24, dwellTimeSeconds: 60, latitude: 13.3790, longitude: 77.1140 },
    ],
  },
  {
    id: 'route-005',
    routeCode: 'R05',
    routeName: 'Belagumba ↔ Badrama Chowtry',
    originStopId: 'stop-021',
    originStopName: 'Belagumba',
    destinationStopId: 'stop-025',
    destinationStopName: 'Badrama Chowtry',
    viaSummary: 'via Upparahalli, Jayanagara, SP Office, Town Hall',
    direction: 'UP',
    totalDistanceKm: 4.9,
    averageDurationMinutes: 17,
    colorHex: '#0891b2',
    activeBusesCount: 1,
    dailyFrequencyMinutes: 20,
    firstBusTime: '07:00',
    lastBusTime: '21:00',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-021', stopCode: 'TUM_BS_021', stopName: 'Belagumba', kannadaName: 'ಬೆಳಗುಂಬ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3550, longitude: 77.0850 },
      { stopId: 'stop-022', stopCode: 'TUM_BS_022', stopName: 'Upparahalli', kannadaName: 'ಉಪ್ಪಾರಹಳ್ಳಿ', orderIndex: 2, distanceFromStartKm: 1.0, estimatedTravelMinutes: 4, dwellTimeSeconds: 30, latitude: 13.3480, longitude: 77.0910 },
      { stopId: 'stop-023', stopCode: 'TUM_BS_023', stopName: 'Jayanagara', kannadaName: 'ಜಯನಗರ', orderIndex: 3, distanceFromStartKm: 2.0, estimatedTravelMinutes: 7, dwellTimeSeconds: 30, latitude: 13.3390, longitude: 77.0950 },
      { stopId: 'stop-024', stopCode: 'TUM_BS_024', stopName: 'SP Office', kannadaName: 'ಎಸ್.ಪಿ ಕಚೇರಿ', orderIndex: 4, distanceFromStartKm: 2.9, estimatedTravelMinutes: 10, dwellTimeSeconds: 30, latitude: 13.3320, longitude: 77.1020 },
      { stopId: 'stop-003', stopCode: 'TUM_BS_003', stopName: 'Town Hall Tumakuru', kannadaName: 'ಟೌನ್ ಹಾಲ್', orderIndex: 5, distanceFromStartKm: 3.7, estimatedTravelMinutes: 13, dwellTimeSeconds: 45, latitude: 13.3325, longitude: 77.1080 },
      { stopId: 'stop-025', stopCode: 'TUM_BS_025', stopName: 'Badrama Chowtry', kannadaName: 'ಬದ್ರಮ್ಮ ಛೌಲ್ಟ್ರಿ', orderIndex: 6, distanceFromStartKm: 4.9, estimatedTravelMinutes: 17, dwellTimeSeconds: 60, latitude: 13.3250, longitude: 77.1090 },
    ],
  },
  {
    id: 'route-006',
    routeCode: 'R06',
    routeName: 'KSRTC Stand ↔ Gulur / Badihalli',
    originStopId: 'stop-001',
    originStopName: 'KSRTC Bus Stand Tumakuru',
    destinationStopId: 'stop-029',
    destinationStopName: 'Badihalli',
    viaSummary: 'via Oorukere, Sathyamangala, Gulur',
    direction: 'UP',
    totalDistanceKm: 6.8,
    averageDurationMinutes: 24,
    colorHex: '#059669',
    activeBusesCount: 1,
    dailyFrequencyMinutes: 20,
    firstBusTime: '06:30',
    lastBusTime: '21:00',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-001', stopCode: 'TUM_BS_001', stopName: 'KSRTC Bus Stand Tumakuru', kannadaName: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3395, longitude: 77.1005 },
      { stopId: 'stop-026', stopCode: 'TUM_BS_026', stopName: 'Oorukere', kannadaName: 'ಊರುಕೆರೆ', orderIndex: 2, distanceFromStartKm: 1.6, estimatedTravelMinutes: 6, dwellTimeSeconds: 30, latitude: 13.3280, longitude: 77.0950 },
      { stopId: 'stop-027', stopCode: 'TUM_BS_027', stopName: 'Sathyamangala', kannadaName: 'ಸತ್ಯಮಂಗಲ', orderIndex: 3, distanceFromStartKm: 3.2, estimatedTravelMinutes: 11, dwellTimeSeconds: 30, latitude: 13.3150, longitude: 77.0900 },
      { stopId: 'stop-028', stopCode: 'TUM_BS_028', stopName: 'Gulur', kannadaName: 'ಗುಳೂರು', orderIndex: 4, distanceFromStartKm: 5.0, estimatedTravelMinutes: 18, dwellTimeSeconds: 45, latitude: 13.3020, longitude: 77.0850 },
      { stopId: 'stop-029', stopCode: 'TUM_BS_029', stopName: 'Badihalli', kannadaName: 'ಬಾಡಿಹಳ್ಳಿ', orderIndex: 5, distanceFromStartKm: 6.8, estimatedTravelMinutes: 24, dwellTimeSeconds: 60, latitude: 13.2910, longitude: 77.0800 },
    ],
  },
  {
    id: 'route-007',
    routeCode: 'R07',
    routeName: 'KSRTC Stand ↔ Gangasandra',
    originStopId: 'stop-001',
    originStopName: 'KSRTC Bus Stand Tumakuru',
    destinationStopId: 'stop-033',
    destinationStopName: 'Gangasandra',
    viaSummary: 'via Ashoka Road, SS Puram, Shettihalli',
    direction: 'UP',
    totalDistanceKm: 5.8,
    averageDurationMinutes: 20,
    colorHex: '#d97706',
    activeBusesCount: 1,
    dailyFrequencyMinutes: 20,
    firstBusTime: '06:45',
    lastBusTime: '21:15',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-001', stopCode: 'TUM_BS_001', stopName: 'KSRTC Bus Stand Tumakuru', kannadaName: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ನಿಲ್ದಾಣ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3395, longitude: 77.1005 },
      { stopId: 'stop-002', stopCode: 'TUM_BS_002', stopName: 'Ashoka Road Circle', kannadaName: 'ಅಶೋಕ ರಸ್ತೆ ವೃತ್ತ', orderIndex: 2, distanceFromStartKm: 0.8, estimatedTravelMinutes: 3, dwellTimeSeconds: 30, latitude: 13.3360, longitude: 77.1042 },
      { stopId: 'stop-004', stopCode: 'TUM_BS_004', stopName: 'SS Puram Circle', kannadaName: 'ಎಸ್.ಎಸ್ ಪುರಂ ವೃತ್ತ', orderIndex: 3, distanceFromStartKm: 2.6, estimatedTravelMinutes: 9, dwellTimeSeconds: 30, latitude: 13.3280, longitude: 77.1140 },
      { stopId: 'stop-036', stopCode: 'TUM_BS_036', stopName: 'Shettihalli', kannadaName: 'ಶೆಟ್ಟಿಹಳ್ಳಿ', orderIndex: 4, distanceFromStartKm: 4.2, estimatedTravelMinutes: 15, dwellTimeSeconds: 30, latitude: 13.3250, longitude: 77.1350 },
      { stopId: 'stop-033', stopCode: 'TUM_BS_033', stopName: 'Gangasandra', kannadaName: 'ಗಂಗಾಸಂದ್ರ', orderIndex: 5, distanceFromStartKm: 5.8, estimatedTravelMinutes: 20, dwellTimeSeconds: 60, latitude: 13.3120, longitude: 77.1150 },
    ],
  },
  {
    id: 'route-008',
    routeCode: 'R08',
    routeName: 'Tumkur University ↔ Bellavi',
    originStopId: 'stop-012',
    originStopName: 'Tumkur University',
    destinationStopId: 'stop-031',
    destinationStopName: 'Bellavi',
    viaSummary: 'via Gubbi Gate, Badudihalli, Haralur',
    direction: 'UP',
    totalDistanceKm: 9.5,
    averageDurationMinutes: 32,
    colorHex: '#dc2626',
    activeBusesCount: 1,
    dailyFrequencyMinutes: 30,
    firstBusTime: '07:00',
    lastBusTime: '20:30',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    stops: [
      { stopId: 'stop-012', stopCode: 'TUM_BS_012', stopName: 'Tumkur University', kannadaName: 'ತುಮಕೂರು ವಿವಿ', orderIndex: 1, distanceFromStartKm: 0.0, estimatedTravelMinutes: 0, dwellTimeSeconds: 60, latitude: 13.3440, longitude: 77.0980 },
      { stopId: 'stop-013', stopCode: 'TUM_BS_013', stopName: 'Gubbi Gate Circle', kannadaName: 'ಗುಬ್ಬಿ ಗೇಟ್ ವೃತ್ತ', orderIndex: 2, distanceFromStartKm: 1.2, estimatedTravelMinutes: 4, dwellTimeSeconds: 30, latitude: 13.3380, longitude: 77.0920 },
      { stopId: 'stop-030', stopCode: 'TUM_BS_030', stopName: 'Badudihalli', kannadaName: 'ಬಾಡುದಿಹಳ್ಳಿ', orderIndex: 3, distanceFromStartKm: 3.4, estimatedTravelMinutes: 12, dwellTimeSeconds: 30, latitude: 13.3620, longitude: 77.0780 },
      { stopId: 'stop-034', stopCode: 'TUM_BS_034', stopName: 'Haralur', kannadaName: 'ಹರಳೂರು', orderIndex: 4, distanceFromStartKm: 6.0, estimatedTravelMinutes: 20, dwellTimeSeconds: 30, latitude: 13.3850, longitude: 77.0650 },
      { stopId: 'stop-031', stopCode: 'TUM_BS_031', stopName: 'Bellavi', kannadaName: 'ಬೆಳ್ಳಾವಿ', orderIndex: 5, distanceFromStartKm: 9.5, estimatedTravelMinutes: 32, dwellTimeSeconds: 60, latitude: 13.4150, longitude: 77.0250 },
    ],
  },
];

// ==========================================
// SEED DATA: 9 FLEET VEHICLES (KA 06 SERIES)
// ==========================================
export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    registrationNumber: 'KA 06 F 8558',
    normalizedNumber: 'KA06F8558',
    fleetNumber: 'CR-TUM-01',
    fleetType: 'AC Volvo Electric',
    capacity: 45,
    seatingCapacity: 35,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: true,
    hasAc: true,
    manufactureYear: 2024,
    currentDriverId: 'drv-001',
    currentDriverName: 'Rajesh DRV-1042',
    currentRouteId: 'route-001',
    currentRouteCode: 'R01',
    lastOdometerKm: 28450,
    nextServiceDate: '2026-10-15',
  },
  {
    id: 'veh-002',
    registrationNumber: 'KA 06 FA 1234',
    normalizedNumber: 'KA06FA1234',
    fleetNumber: 'CR-TUM-02',
    fleetType: 'City Regular Eco',
    capacity: 42,
    seatingCapacity: 32,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: false,
    hasAc: false,
    manufactureYear: 2023,
    currentDriverId: 'drv-002',
    currentDriverName: 'Basavaraj DRV-1055',
    currentRouteId: 'route-002',
    currentRouteCode: 'R02',
    lastOdometerKm: 42100,
    nextServiceDate: '2026-09-20',
  },
  {
    id: 'veh-003',
    registrationNumber: 'KA 06 G 4321',
    normalizedNumber: 'KA06G4321',
    fleetNumber: 'CR-TUM-03',
    fleetType: 'Smart Feeder Electric',
    capacity: 35,
    seatingCapacity: 25,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: true,
    hasAc: true,
    manufactureYear: 2024,
    currentDriverId: 'drv-003',
    currentDriverName: 'Manjunath DRV-1089',
    currentRouteId: 'route-003',
    currentRouteCode: 'R03',
    lastOdometerKm: 19800,
    nextServiceDate: '2026-11-05',
  },
  {
    id: 'veh-004',
    registrationNumber: 'KA 06 F 3920',
    normalizedNumber: 'KA06F3920',
    fleetNumber: 'CR-TUM-04',
    fleetType: 'Industrial Express',
    capacity: 50,
    seatingCapacity: 40,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: false,
    hasAc: false,
    manufactureYear: 2022,
    currentDriverId: 'drv-004',
    currentDriverName: 'Siddaraju DRV-1021',
    currentRouteId: 'route-004',
    currentRouteCode: 'R04',
    lastOdometerKm: 56300,
    nextServiceDate: '2026-09-30',
  },
  {
    id: 'veh-005',
    registrationNumber: 'KA 06 E 9012',
    normalizedNumber: 'KA06E9012',
    fleetNumber: 'CR-TUM-05',
    fleetType: 'City Connector',
    capacity: 40,
    seatingCapacity: 30,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: false,
    hasAc: false,
    manufactureYear: 2023,
    currentDriverId: 'drv-005',
    currentDriverName: 'Chandrashekar DRV-1102',
    currentRouteId: 'route-005',
    currentRouteCode: 'R05',
    lastOdometerKm: 34120,
    nextServiceDate: '2026-10-01',
  },
  {
    id: 'veh-006',
    registrationNumber: 'KA 06 F 7711',
    normalizedNumber: 'KA06F7711',
    fleetNumber: 'CR-TUM-06',
    fleetType: 'Suburban Shuttle',
    capacity: 42,
    seatingCapacity: 32,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: false,
    hasAc: false,
    manufactureYear: 2023,
    currentDriverId: 'drv-006',
    currentDriverName: 'Lokesh DRV-1077',
    currentRouteId: 'route-006',
    currentRouteCode: 'R06',
    lastOdometerKm: 38900,
    nextServiceDate: '2026-10-18',
  },
  {
    id: 'veh-007',
    registrationNumber: 'KA 06 B 5432',
    normalizedNumber: 'KA06B5432',
    fleetNumber: 'CR-TUM-07',
    fleetType: 'City Regular Eco',
    capacity: 42,
    seatingCapacity: 32,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: false,
    hasAc: false,
    manufactureYear: 2022,
    currentDriverId: 'drv-007',
    currentDriverName: 'Anand DRV-1064',
    currentRouteId: 'route-007',
    currentRouteCode: 'R07',
    lastOdometerKm: 61400,
    nextServiceDate: '2026-09-15',
  },
  {
    id: 'veh-008',
    registrationNumber: 'KA 06 F 6620',
    normalizedNumber: 'KA06F6620',
    fleetNumber: 'CR-TUM-08',
    fleetType: 'Pilgrim Special',
    capacity: 45,
    seatingCapacity: 35,
    standingCapacity: 10,
    status: 'active',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: true,
    hasAc: true,
    manufactureYear: 2024,
    currentDriverId: 'drv-008',
    currentDriverName: 'Girish DRV-1090',
    currentRouteId: 'route-008',
    currentRouteCode: 'R08',
    lastOdometerKm: 17300,
    nextServiceDate: '2026-11-20',
  },
  {
    id: 'veh-009',
    registrationNumber: 'KA 06 F 1100',
    normalizedNumber: 'KA06F1100',
    fleetNumber: 'CR-TUM-09',
    fleetType: 'City Regular Eco',
    capacity: 42,
    seatingCapacity: 32,
    standingCapacity: 10,
    status: 'maintenance',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Tumakuru Central Depot 1',
    isElectric: false,
    hasAc: false,
    manufactureYear: 2021,
    lastOdometerKm: 78500,
    nextServiceDate: '2026-08-28',
  },
];

// ==========================================
// SEED DATA: 8 VERIFIED DRIVERS
// ==========================================
export const SEED_DRIVERS: Driver[] = [
  {
    id: 'drv-001',
    driverCode: 'TUM-DRV-1042',
    fullName: 'Rajesh Kumar',
    phone: '+91 98451 10420',
    licenseNumber: 'KA06 20140001842',
    licenseExpiry: '2029-05-12',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'on_duty',
    bloodGroup: 'O+',
    assignedBusId: 'veh-001',
    assignedPlateNumber: 'KA 06 F 8558',
    assignedRouteId: 'route-001',
    assignedRouteCode: 'R01',
    totalTripsCompleted: 1420,
    onTimeRating: 98.2,
    incidentCount: 0,
    joinedDate: '2021-03-15',
  },
  {
    id: 'drv-002',
    driverCode: 'TUM-DRV-1055',
    fullName: 'Basavaraj Hiremath',
    phone: '+91 98452 10550',
    licenseNumber: 'KA06 20150002155',
    licenseExpiry: '2028-11-20',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'on_duty',
    bloodGroup: 'B+',
    assignedBusId: 'veh-002',
    assignedPlateNumber: 'KA 06 FA 1234',
    assignedRouteId: 'route-002',
    assignedRouteCode: 'R02',
    totalTripsCompleted: 1180,
    onTimeRating: 94.6,
    incidentCount: 1,
    joinedDate: '2022-01-10',
  },
  {
    id: 'drv-003',
    driverCode: 'TUM-DRV-1089',
    fullName: 'Manjunath Swamy',
    phone: '+91 98453 10890',
    licenseNumber: 'KA06 20180003089',
    licenseExpiry: '2030-08-14',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'on_duty',
    bloodGroup: 'A+',
    assignedBusId: 'veh-003',
    assignedPlateNumber: 'KA 06 G 4321',
    assignedRouteId: 'route-003',
    assignedRouteCode: 'R03',
    totalTripsCompleted: 890,
    onTimeRating: 97.4,
    incidentCount: 0,
    joinedDate: '2023-04-01',
  },
  {
    id: 'drv-004',
    driverCode: 'TUM-DRV-1021',
    fullName: 'Siddaraju B. N.',
    phone: '+91 98454 10210',
    licenseNumber: 'KA06 20120001021',
    licenseExpiry: '2027-02-18',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'on_duty',
    bloodGroup: 'AB+',
    assignedBusId: 'veh-004',
    assignedPlateNumber: 'KA 06 F 3920',
    assignedRouteId: 'route-004',
    assignedRouteCode: 'R04',
    totalTripsCompleted: 2150,
    onTimeRating: 96.1,
    incidentCount: 2,
    joinedDate: '2019-08-15',
  },
  {
    id: 'drv-005',
    driverCode: 'TUM-DRV-1102',
    fullName: 'Chandrashekariah',
    phone: '+91 98455 11020',
    licenseNumber: 'KA06 20190004102',
    licenseExpiry: '2031-10-05',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'on_duty',
    bloodGroup: 'O-',
    assignedBusId: 'veh-005',
    assignedPlateNumber: 'KA 06 E 9012',
    assignedRouteId: 'route-005',
    assignedRouteCode: 'R05',
    totalTripsCompleted: 740,
    onTimeRating: 92.8,
    incidentCount: 1,
    joinedDate: '2023-11-12',
  },
  {
    id: 'drv-006',
    driverCode: 'TUM-DRV-1077',
    fullName: 'Lokesh Murthy',
    phone: '+91 98456 10770',
    licenseNumber: 'KA06 20170002877',
    licenseExpiry: '2029-01-25',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'active',
    bloodGroup: 'B+',
    assignedBusId: 'veh-006',
    assignedPlateNumber: 'KA 06 F 7711',
    assignedRouteId: 'route-006',
    assignedRouteCode: 'R06',
    totalTripsCompleted: 1040,
    onTimeRating: 95.7,
    incidentCount: 0,
    joinedDate: '2022-07-20',
  },
  {
    id: 'drv-007',
    driverCode: 'TUM-DRV-1064',
    fullName: 'Anandappa Gowda',
    phone: '+91 98457 10640',
    licenseNumber: 'KA06 20160002464',
    licenseExpiry: '2028-04-19',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'active',
    bloodGroup: 'O+',
    assignedBusId: 'veh-007',
    assignedPlateNumber: 'KA 06 B 5432',
    assignedRouteId: 'route-007',
    assignedRouteCode: 'R07',
    totalTripsCompleted: 1320,
    onTimeRating: 93.4,
    incidentCount: 1,
    joinedDate: '2021-11-05',
  },
  {
    id: 'drv-008',
    driverCode: 'TUM-DRV-1090',
    fullName: 'Girish Kumar S.',
    phone: '+91 98458 10900',
    licenseNumber: 'KA06 20190003790',
    licenseExpiry: '2030-12-08',
    depotId: 'DEPOT_01_CENTRAL',
    depotName: 'Central Depot 1',
    status: 'suspended',
    bloodGroup: 'A-',
    assignedBusId: 'veh-008',
    assignedPlateNumber: 'KA 06 F 6620',
    assignedRouteId: 'route-008',
    assignedRouteCode: 'R08',
    totalTripsCompleted: 610,
    onTimeRating: 88.5,
    incidentCount: 3,
    joinedDate: '2024-02-14',
  },
];

// ==========================================
// SEED DATA: ROUTE SCHEDULES & TIMETABLES
// ==========================================
export const SEED_SCHEDULES: RouteSchedule[] = [
  {
    id: 'sched-001',
    routeId: 'route-001',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    direction: 'FORWARD',
    effectiveFrom: '2026-01-01',
    status: 'active',
    slots: [
      { id: 'slot-101', tripCode: 'R01-0600', departureTime: '06:00', arrivalTime: '06:18', assignedVehicleId: 'veh-001', assignedPlateNumber: 'KA 06 F 8558', assignedDriverId: 'drv-001', assignedDriverName: 'Rajesh Kumar', frequencyType: 'ALL_DAYS', status: 'active' },
      { id: 'slot-102', tripCode: 'R01-0630', departureTime: '06:30', arrivalTime: '06:48', assignedVehicleId: 'veh-001', assignedPlateNumber: 'KA 06 F 8558', assignedDriverId: 'drv-001', assignedDriverName: 'Rajesh Kumar', frequencyType: 'ALL_DAYS', status: 'active' },
      { id: 'slot-103', tripCode: 'R01-0700', departureTime: '07:00', arrivalTime: '07:18', assignedVehicleId: 'veh-001', assignedPlateNumber: 'KA 06 F 8558', assignedDriverId: 'drv-001', assignedDriverName: 'Rajesh Kumar', frequencyType: 'WEEKDAY', status: 'active' },
      { id: 'slot-104', tripCode: 'R01-0730', departureTime: '07:30', arrivalTime: '07:48', assignedVehicleId: 'veh-001', assignedPlateNumber: 'KA 06 F 8558', assignedDriverId: 'drv-001', assignedDriverName: 'Rajesh Kumar', frequencyType: 'WEEKDAY', status: 'active' },
      { id: 'slot-105', tripCode: 'R01-0800', departureTime: '08:00', arrivalTime: '08:18', assignedVehicleId: 'veh-001', assignedPlateNumber: 'KA 06 F 8558', assignedDriverId: 'drv-001', assignedDriverName: 'Rajesh Kumar', frequencyType: 'ALL_DAYS', status: 'active' },
      { id: 'slot-106', tripCode: 'R01-0830', departureTime: '08:30', arrivalTime: '08:48', assignedVehicleId: 'veh-001', assignedPlateNumber: 'KA 06 F 8558', assignedDriverId: 'drv-001', assignedDriverName: 'Rajesh Kumar', frequencyType: 'ALL_DAYS', status: 'active' },
    ],
    stopArrivalTimetable: [
      { stopId: 'stop-001', stopName: 'KSRTC Bus Stand Tumakuru', sequence: 1, scheduledArrival: '08:00', scheduledDeparture: '08:01' },
      { stopId: 'stop-002', stopName: 'Ashoka Road Circle', sequence: 2, scheduledArrival: '08:04', scheduledDeparture: '08:05' },
      { stopId: 'stop-003', stopName: 'Town Hall Tumakuru', sequence: 3, scheduledArrival: '08:07', scheduledDeparture: '08:08' },
      { stopId: 'stop-004', stopName: 'SS Puram Circle', sequence: 4, scheduledArrival: '08:11', scheduledDeparture: '08:12' },
      { stopId: 'stop-005', stopName: 'SIT Main Gate', sequence: 5, scheduledArrival: '08:16', scheduledDeparture: '08:17' },
      { stopId: 'stop-006', stopName: 'SIT Back Gate', sequence: 6, scheduledArrival: '08:18', scheduledDeparture: '08:20' },
    ],
  },
  {
    id: 'sched-002',
    routeId: 'route-002',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    direction: 'FORWARD',
    effectiveFrom: '2026-01-01',
    status: 'active',
    slots: [
      { id: 'slot-201', tripCode: 'R02-0615', departureTime: '06:15', arrivalTime: '06:41', assignedVehicleId: 'veh-002', assignedPlateNumber: 'KA 06 FA 1234', assignedDriverId: 'drv-002', assignedDriverName: 'Basavaraj Hiremath', frequencyType: 'ALL_DAYS', status: 'active' },
      { id: 'slot-202', tripCode: 'R02-0700', departureTime: '07:00', arrivalTime: '07:26', assignedVehicleId: 'veh-002', assignedPlateNumber: 'KA 06 FA 1234', assignedDriverId: 'drv-002', assignedDriverName: 'Basavaraj Hiremath', frequencyType: 'ALL_DAYS', status: 'active' },
      { id: 'slot-203', tripCode: 'R02-0745', departureTime: '07:45', arrivalTime: '08:11', assignedVehicleId: 'veh-002', assignedPlateNumber: 'KA 06 FA 1234', assignedDriverId: 'drv-002', assignedDriverName: 'Basavaraj Hiremath', frequencyType: 'WEEKDAY', status: 'active' },
      { id: 'slot-204', tripCode: 'R02-0830', departureTime: '08:30', arrivalTime: '08:56', assignedVehicleId: 'veh-002', assignedPlateNumber: 'KA 06 FA 1234', assignedDriverId: 'drv-002', assignedDriverName: 'Basavaraj Hiremath', frequencyType: 'ALL_DAYS', status: 'active' },
    ],
    stopArrivalTimetable: [
      { stopId: 'stop-001', stopName: 'KSRTC Bus Stand Tumakuru', sequence: 1, scheduledArrival: '07:00', scheduledDeparture: '07:01' },
      { stopId: 'stop-007', stopName: 'Mandi Pete Gate', sequence: 2, scheduledArrival: '07:06', scheduledDeparture: '07:07' },
      { stopId: 'stop-008', stopName: 'Batawadi Circle', sequence: 3, scheduledArrival: '07:11', scheduledDeparture: '07:12' },
      { stopId: 'stop-009', stopName: 'Kyathsandra', sequence: 4, scheduledArrival: '07:18', scheduledDeparture: '07:19' },
      { stopId: 'stop-010', stopName: 'Mandaragiri Cross', sequence: 5, scheduledArrival: '07:23', scheduledDeparture: '07:24' },
      { stopId: 'stop-011', stopName: 'Siddaganga Mutt', sequence: 6, scheduledArrival: '07:26', scheduledDeparture: '07:30' },
    ],
  },
];

// Helper to get or initialize local storage cache
function getStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(`cityride_master_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading master data key ${key}:`, e);
  }
  localStorage.setItem(`cityride_master_${key}`, JSON.stringify(seed));
  return seed;
}

function setStorage<T>(key: string, data: T) {
  localStorage.setItem(`cityride_master_${key}`, JSON.stringify(data));
}

// ==========================================
// MASTER DATA SERVICE (Supabase + Local Fallback)
// ==========================================
export const MasterDataService = {
  // DRIVERS
  async getDrivers(): Promise<Driver[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Driver[];
      } catch (err) {
        console.warn('Supabase fetch drivers error, falling back:', err);
      }
    }
    return getStorage<Driver[]>('drivers', SEED_DRIVERS);
  },

  async createDriver(driverData: Omit<Driver, 'id' | 'totalTripsCompleted' | 'onTimeRating' | 'incidentCount' | 'joinedDate'>): Promise<Driver> {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      totalTripsCompleted: 0,
      onTimeRating: 100,
      incidentCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('drivers').insert(newDriver);
      } catch (err) {
        console.warn('Supabase insert driver error:', err);
      }
    }

    const current = getStorage<Driver[]>('drivers', SEED_DRIVERS);
    const updated = [newDriver, ...current];
    setStorage('drivers', updated);
    return newDriver;
  },

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('drivers').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update driver error:', err);
      }
    }

    const current = getStorage<Driver[]>('drivers', SEED_DRIVERS);
    const updated = current.map((d) => (d.id === id ? { ...d, ...updates } : d));
    setStorage('drivers', updated);
    const result = updated.find((d) => d.id === id);
    if (!result) throw new Error('Driver not found');
    return result;
  },

  async deleteDriver(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('drivers').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete driver error:', err);
      }
    }
    const current = getStorage<Driver[]>('drivers', SEED_DRIVERS);
    const updated = current.filter((d) => d.id !== id);
    setStorage('drivers', updated);
  },

  // VEHICLES (BUSES)
  async getVehicles(): Promise<Vehicle[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('buses').select('*');
        if (!error && data && data.length > 0) return data as Vehicle[];
      } catch (err) {
        console.warn('Supabase fetch vehicles error, falling back:', err);
      }
    }
    return getStorage<Vehicle[]>('vehicles', SEED_VEHICLES);
  },

  async createVehicle(vehData: Omit<Vehicle, 'id' | 'normalizedNumber' | 'lastOdometerKm'>): Promise<Vehicle> {
    const normalized = vehData.registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newVeh: Vehicle = {
      ...vehData,
      id: `veh-${Date.now()}`,
      normalizedNumber: normalized,
      lastOdometerKm: 0,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('buses').insert(newVeh);
      } catch (err) {
        console.warn('Supabase insert bus error:', err);
      }
    }

    const current = getStorage<Vehicle[]>('vehicles', SEED_VEHICLES);
    const updated = [newVeh, ...current];
    setStorage('vehicles', updated);
    return newVeh;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    if (updates.registrationNumber) {
      updates.normalizedNumber = updates.registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('buses').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update bus error:', err);
      }
    }

    const current = getStorage<Vehicle[]>('vehicles', SEED_VEHICLES);
    const updated = current.map((v) => (v.id === id ? { ...v, ...updates } : v));
    setStorage('vehicles', updated);
    const result = updated.find((v) => v.id === id);
    if (!result) throw new Error('Vehicle not found');
    return result;
  },

  async deleteVehicle(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('buses').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete bus error:', err);
      }
    }
    const current = getStorage<Vehicle[]>('vehicles', SEED_VEHICLES);
    const updated = current.filter((v) => v.id !== id);
    setStorage('vehicles', updated);
  },

  // BUS STOPS
  async getStops(): Promise<BusStop[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('stops').select('*').order('stop_code');
        if (!error && data && data.length > 0) return data as BusStop[];
      } catch (err) {
        console.warn('Supabase fetch stops error, falling back:', err);
      }
    }
    return getStorage<BusStop[]>('stops', SEED_BUS_STOPS);
  },

  async createStop(stopData: Omit<BusStop, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusStop> {
    const newStop: BusStop = {
      ...stopData,
      id: `stop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('stops').insert(newStop);
      } catch (err) {
        console.warn('Supabase insert stop error:', err);
      }
    }

    const current = getStorage<BusStop[]>('stops', SEED_BUS_STOPS);
    const updated = [newStop, ...current];
    setStorage('stops', updated);
    return newStop;
  },

  async updateStop(id: string, updates: Partial<BusStop>): Promise<BusStop> {
    const withTimestamp = { ...updates, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('stops').update(withTimestamp).eq('id', id);
      } catch (err) {
        console.warn('Supabase update stop error:', err);
      }
    }

    const current = getStorage<BusStop[]>('stops', SEED_BUS_STOPS);
    const updated = current.map((s) => (s.id === id ? { ...s, ...withTimestamp } : s));
    setStorage('stops', updated);
    const result = updated.find((s) => s.id === id);
    if (!result) throw new Error('Stop not found');
    return result;
  },

  async deleteStop(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('stops').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete stop error:', err);
      }
    }
    const current = getStorage<BusStop[]>('stops', SEED_BUS_STOPS);
    const updated = current.filter((s) => s.id !== id);
    setStorage('stops', updated);
  },

  // ROUTES
  async getRoutes(): Promise<TransitRoute[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('routes').select('*').order('route_code');
        if (!error && data && data.length > 0) return data as TransitRoute[];
      } catch (err) {
        console.warn('Supabase fetch routes error, falling back:', err);
      }
    }
    return getStorage<TransitRoute[]>('routes', SEED_ROUTES);
  },

  async createRoute(routeData: Omit<TransitRoute, 'id' | 'createdAt' | 'updatedAt' | 'activeBusesCount'>): Promise<TransitRoute> {
    const newRoute: TransitRoute = {
      ...routeData,
      id: `route-${Date.now()}`,
      activeBusesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('routes').insert(newRoute);
      } catch (err) {
        console.warn('Supabase insert route error:', err);
      }
    }

    const current = getStorage<TransitRoute[]>('routes', SEED_ROUTES);
    const updated = [newRoute, ...current];
    setStorage('routes', updated);
    return newRoute;
  },

  async updateRoute(id: string, updates: Partial<TransitRoute>): Promise<TransitRoute> {
    const withTimestamp = { ...updates, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('routes').update(withTimestamp).eq('id', id);
      } catch (err) {
        console.warn('Supabase update route error:', err);
      }
    }

    const current = getStorage<TransitRoute[]>('routes', SEED_ROUTES);
    const updated = current.map((r) => (r.id === id ? { ...r, ...withTimestamp } : r));
    setStorage('routes', updated);
    const result = updated.find((r) => r.id === id);
    if (!result) throw new Error('Route not found');
    return result;
  },

  async deleteRoute(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('routes').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete route error:', err);
      }
    }
    const current = getStorage<TransitRoute[]>('routes', SEED_ROUTES);
    const updated = current.filter((r) => r.id !== id);
    setStorage('routes', updated);
  },

  // SCHEDULES
  async getSchedules(): Promise<RouteSchedule[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('schedules').select('*');
        if (!error && data && data.length > 0) return data as RouteSchedule[];
      } catch (err) {
        console.warn('Supabase fetch schedules error, falling back:', err);
      }
    }
    return getStorage<RouteSchedule[]>('schedules', SEED_SCHEDULES);
  },

  async updateSchedule(id: string, updates: Partial<RouteSchedule>): Promise<RouteSchedule> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('schedules').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update schedule error:', err);
      }
    }
    const current = getStorage<RouteSchedule[]>('schedules', SEED_SCHEDULES);
    const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setStorage('schedules', updated);
    const result = updated.find((s) => s.id === id);
    if (!result) throw new Error('Schedule not found');
    return result;
  },

  async createSchedule(scheduleData: Omit<RouteSchedule, 'id'>): Promise<RouteSchedule> {
    const newSchedule: RouteSchedule = {
      ...scheduleData,
      id: `sched-${Date.now()}`,
    };
    if (isSupabaseConfigured) {
      try {
        await supabase.from('schedules').insert(newSchedule);
      } catch (err) {
        console.warn('Supabase insert schedule error:', err);
      }
    }
    const current = getStorage<RouteSchedule[]>('schedules', SEED_SCHEDULES);
    const updated = [newSchedule, ...current];
    setStorage('schedules', updated);
    return newSchedule;
  },
};
