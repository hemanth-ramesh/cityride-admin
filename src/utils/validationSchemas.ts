import { z } from 'zod';

// ==============================================================================
// 1. DRIVER FORM VALIDATION SCHEMA
// ==============================================================================
export const driverSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, 'Please enter a valid Indian mobile number (+91 XXXXX XXXXX)'),
  licenseNumber: z
    .string()
    .min(5, 'Valid driving license number required')
    .max(30, 'License number is too long'),
  licenseExpiry: z.string().min(4, 'License expiration date is required'),
  depotId: z.string().min(1, 'Please select an assigned depot'),
  depotName: z.string().min(1, 'Depot name is required'),
  status: z.enum(['active', 'suspended', 'on_duty', 'off_duty', 'on_leave']),
  bloodGroup: z.string().optional(),
  assignedPlateNumber: z.string().optional(),
  assignedRouteCode: z.string().optional(),
});

export type DriverFormData = z.infer<typeof driverSchema>;

// ==============================================================================
// 2. VEHICLE FORM VALIDATION SCHEMA
// ==============================================================================
export const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(6, 'Valid registration plate number is required')
    .regex(/^KA\s?06\s?[A-Z]{1,2}\s?\d{4}$/i, 'Must follow Tumakuru RTO format: KA 06 XX 1234'),
  fleetNumber: z
    .string()
    .min(2, 'Fleet unit ID required (e.g. CR-TUM-01)'),
  fleetType: z.string().min(1, 'Please select fleet class'),
  seatingCapacity: z
    .number()
    .int('Must be a whole number')
    .min(15, 'Minimum capacity is 15 passengers')
    .max(80, 'Maximum capacity is 80 passengers'),
  standingCapacity: z
    .number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(50, 'Maximum standing capacity is 50'),
  manufacturer: z.string().min(2, 'Manufacturer name is required'),
  modelYear: z
    .number()
    .int()
    .min(2018, 'Vehicle year must be 2018 or newer')
    .max(new Date().getFullYear() + 1, 'Invalid model year'),
  fuelType: z.enum(['ELECTRIC', 'DIESEL', 'CNG']),
  depotId: z.string().min(1, 'Assigned depot is required'),
  depotName: z.string().min(1, 'Depot name is required'),
  status: z.enum(['active', 'maintenance', 'inactive', 'decommissioned']),
  isAirConditioned: z.boolean().default(false),
  hasWheelchairRamp: z.boolean().default(false),
  hasCctv: z.boolean().default(true),
  hasPanicButtons: z.boolean().default(true),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

// ==============================================================================
// 3. BUS STOP FORM VALIDATION SCHEMA
// ==============================================================================
export const busStopSchema = z.object({
  name: z.string().min(3, 'Stop name must be at least 3 characters'),
  kannadaName: z.string().min(2, 'Kannada name is required for signage'),
  latitude: z
    .number()
    .min(13.25, 'Latitude outside Tumakuru region (min: 13.25)')
    .max(13.50, 'Latitude outside Tumakuru region (max: 13.50)'),
  longitude: z
    .number()
    .min(77.00, 'Longitude outside Tumakuru region (min: 77.00)')
    .max(77.30, 'Longitude outside Tumakuru region (max: 77.30)'),
  area: z.string().min(2, 'Area / Neighborhood is required'),
  landmark: z.string().optional(),
  geofenceRadiusMeters: z
    .number()
    .int()
    .min(20, 'Minimum geofence radius is 20m')
    .max(200, 'Maximum geofence radius is 200m'),
  facilities: z.array(z.string()).default([]),
});

export type BusStopFormData = z.infer<typeof busStopSchema>;

// ==============================================================================
// 4. DUTY ROSTER VALIDATION SCHEMA
// ==============================================================================
export const dutySchema = z.object({
  dutyDate: z.string().min(8, 'Date is required'),
  shiftType: z.enum(['MORNING', 'EVENING', 'NIGHT', 'FULL_DAY']),
  driverId: z.string().min(1, 'Please select an authorized driver'),
  vehicleId: z.string().min(1, 'Please select an active bus vehicle'),
  routeId: z.string().min(1, 'Please select a transit route corridor'),
});

export type DutyFormData = z.infer<typeof dutySchema>;

// ==============================================================================
// 5. INCIDENT REPORT VALIDATION SCHEMA
// ==============================================================================
export const incidentSchema = z.object({
  headline: z.string().min(5, 'Incident headline must be at least 5 characters'),
  category: z.string().min(1, 'Please select incident category'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  routeCode: z.string().optional(),
  vehiclePlate: z.string().optional(),
  driverName: z.string().optional(),
  locationLandmark: z.string().min(3, 'Location landmark is required'),
  description: z.string().min(10, 'Detailed incident description is required (min 10 chars)'),
  actionTaken: z.string().optional(),
});

export type IncidentFormData = z.infer<typeof incidentSchema>;

// ==============================================================================
// 6. LOST & FOUND ITEM SCHEMA
// ==============================================================================
export const lostItemSchema = z.object({
  category: z.string().min(1, 'Please select an item category'),
  itemName: z.string().min(3, 'Item title is required'),
  description: z.string().min(5, 'Detailed item description is required'),
  color: z.string().optional(),
  brand: z.string().optional(),
  foundOnRouteCode: z.string().optional(),
  foundOnVehiclePlate: z.string().optional(),
  custodyDepot: z.string().min(3, 'Depot custody locker is required'),
  finderType: z.enum(['DRIVER', 'PASSENGER', 'DEPOT_CREW']),
  finderName: z.string().optional(),
  finderPhone: z.string().optional(),
});

export type LostItemFormData = z.infer<typeof lostItemSchema>;

// ==============================================================================
// 7. NOTIFICATION BROADCAST SCHEMA
// ==============================================================================
export const notificationSchema = z.object({
  title: z.string().min(4, 'Notification headline must be at least 4 characters'),
  message: z.string().min(10, 'Broadcast message content must be at least 10 characters'),
  category: z.string().min(1, 'Notice category required'),
  targetType: z.string().min(1, 'Target audience scope required'),
  targetRouteCode: z.string().optional(),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
