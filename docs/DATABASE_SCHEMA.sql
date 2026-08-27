-- ==============================================================================
-- CITYRIDE OCC TUMAKURU — COMPLETE PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS & DOMAINS
-- ==============================================================================

CREATE TYPE admin_role_enum AS ENUM (
    'SUPER_ADMIN',
    'OPERATIONS_MANAGER',
    'DISPATCHER',
    'FLEET_MANAGER',
    'SUPPORT_ADMIN',
    'ANALYST'
);

CREATE TYPE vehicle_status_enum AS ENUM (
    'active',
    'maintenance',
    'standby',
    'retired'
);

CREATE TYPE propulsion_type_enum AS ENUM (
    'ELECTRIC',
    'DIESEL',
    'CNG'
);

CREATE TYPE driver_status_enum AS ENUM (
    'on_duty',
    'off_duty',
    'on_break',
    'suspended'
);

CREATE TYPE trip_status_enum AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'delayed'
);

CREATE TYPE sos_type_enum AS ENUM (
    'MEDICAL',
    'ACCIDENT',
    'SECURITY',
    'FIRE',
    'BREAKDOWN'
);

CREATE TYPE sos_priority_enum AS ENUM (
    'CRITICAL',
    'HIGH',
    'MEDIUM'
);

CREATE TYPE sos_status_enum AS ENUM (
    'TRIGGERED',
    'ACKNOWLEDGED',
    'HELP_DISPATCHED',
    'RESOLVED'
);

CREATE TYPE incident_type_enum AS ENUM (
    'ACCIDENT',
    'BREAKDOWN',
    'TRAFFIC_BLOCK',
    'PASSENGER_MISBEHAVIOR',
    'ROUTE_DEVIATION',
    'WEATHER_HAZARD'
);

CREATE TYPE incident_severity_enum AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE incident_status_enum AS ENUM (
    'REPORTED',
    'INVESTIGATING',
    'ACTION_TAKEN',
    'RESOLVED'
);

CREATE TYPE complaint_category_enum AS ENUM (
    'STAFF_BEHAVIOR',
    'BUS_DELAY',
    'STOP_SKIPPED',
    'RECKLESS_DRIVING',
    'VEHICLE_CLEANLINESS',
    'APP_ISSUE'
);

CREATE TYPE complaint_status_enum AS ENUM (
    'OPEN',
    'IN_REVIEW',
    'ACTION_TAKEN',
    'RESOLVED',
    'REJECTED'
);

CREATE TYPE lost_item_category_enum AS ENUM (
    'ELECTRONICS',
    'WALLET_BAG',
    'DOCUMENTS',
    'CLOTHING',
    'KEYS',
    'OTHER'
);

CREATE TYPE lost_item_status_enum AS ENUM (
    'REPORTED',
    'IN_CUSTODY',
    'CLAIM_VERIFICATION',
    'RETURNED',
    'DISPOSED'
);

-- ==============================================================================
-- 2. ADMIN USERS & RBAC TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role admin_role_enum NOT NULL DEFAULT 'DISPATCHER',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. TRANSIT MASTER DATA TABLES
-- ==============================================================================

-- 36 Geocoded Bus Stops in Tumakuru
CREATE TABLE IF NOT EXISTS bus_stops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_terminal BOOLEAN NOT NULL DEFAULT false,
    has_shelter BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8 Radial Corridors (R01–R08)
CREATE TABLE IF NOT EXISTS routes (
    id VARCHAR(50) PRIMARY KEY,
    route_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    origin_stop_id VARCHAR(50) REFERENCES bus_stops(id),
    destination_stop_id VARCHAR(50) REFERENCES bus_stops(id),
    total_distance_km NUMERIC(5, 2) NOT NULL,
    standard_travel_duration_minutes INT NOT NULL,
    color_hex VARCHAR(10) NOT NULL DEFAULT '#16a34a',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stop Sequence along Routes
CREATE TABLE IF NOT EXISTS route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id VARCHAR(50) NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_id VARCHAR(50) NOT NULL REFERENCES bus_stops(id) ON DELETE CASCADE,
    stop_sequence INT NOT NULL,
    distance_from_origin_km NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    travel_time_minutes INT NOT NULL DEFAULT 0,
    UNIQUE(route_id, stop_sequence)
);

-- Fleet Vehicles (KA 06 Series)
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(50) PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    propulsion_type propulsion_type_enum NOT NULL DEFAULT 'ELECTRIC',
    current_route_code VARCHAR(10) REFERENCES routes(route_code),
    assigned_driver_id VARCHAR(50),
    status vehicle_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff Drivers
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    badge_number VARCHAR(30) UNIQUE NOT NULL,
    duty_status driver_status_enum NOT NULL DEFAULT 'off_duty',
    assigned_vehicle_id VARCHAR(50) REFERENCES vehicles(id),
    assigned_route_code VARCHAR(10) REFERENCES routes(route_code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Foreign Key from vehicles to drivers
ALTER TABLE vehicles 
ADD CONSTRAINT fk_vehicles_driver 
FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

-- ==============================================================================
-- 4. DISPATCH & SCHEDULED TRIPS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS schedules (
    id VARCHAR(50) PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheduled_trips (
    id VARCHAR(50) PRIMARY KEY,
    trip_number VARCHAR(50) UNIQUE NOT NULL,
    route_code VARCHAR(10) NOT NULL REFERENCES routes(route_code),
    route_name VARCHAR(150) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    scheduled_departure VARCHAR(10) NOT NULL,
    scheduled_arrival VARCHAR(10) NOT NULL,
    status trip_status_enum NOT NULL DEFAULT 'scheduled',
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. LIVE TELEMETRY & GPS TRACKING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS vehicle_telemetry (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id VARCHAR(50) REFERENCES drivers(id),
    route_code VARCHAR(10) REFERENCES routes(route_code),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    bearing NUMERIC(5, 2) DEFAULT 0.0,
    current_stop VARCHAR(100),
    next_stop VARCHAR(100),
    eta_minutes INT DEFAULT 0,
    passenger_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'on_time',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time ON vehicle_telemetry(vehicle_id, recorded_at DESC);

-- ==============================================================================
-- 6. SAFETY, SOS & INCIDENT OPERATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS sos_alerts (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(id),
    vehicle_plate VARCHAR(20) NOT NULL,
    route_code VARCHAR(10) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    type sos_type_enum NOT NULL,
    priority sos_priority_enum NOT NULL DEFAULT 'CRITICAL',
    status sos_status_enum NOT NULL DEFAULT 'TRIGGERED',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    passengers_onboard INT NOT NULL DEFAULT 0,
    dispatched_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS incident_reports (
    id VARCHAR(50) PRIMARY KEY,
    type incident_type_enum NOT NULL,
    severity incident_severity_enum NOT NULL DEFAULT 'MEDIUM',
    status incident_status_enum NOT NULL DEFAULT 'REPORTED',
    vehicle_plate VARCHAR(20) NOT NULL,
    route_code VARCHAR(10) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS driver_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id VARCHAR(50) REFERENCES drivers(id),
    vehicle_id VARCHAR(50) REFERENCES vehicles(id),
    sender_user_id UUID REFERENCES admin_users(id),
    message TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. PASSENGER SERVICE & SUPPORT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS passenger_complaints (
    id VARCHAR(50) PRIMARY KEY,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    category complaint_category_enum NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    status complaint_status_enum NOT NULL DEFAULT 'OPEN',
    vehicle_plate VARCHAR(20),
    route_code VARCHAR(10),
    stop_name VARCHAR(100),
    description TEXT NOT NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lost_and_found_items (
    id VARCHAR(50) PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category lost_item_category_enum NOT NULL,
    vehicle_plate VARCHAR(20),
    route_code VARCHAR(10),
    found_date DATE NOT NULL DEFAULT CURRENT_DATE,
    custody_depot VARCHAR(100) NOT NULL DEFAULT 'KSRTC Central Bus Station Control Room',
    status lost_item_status_enum NOT NULL DEFAULT 'REPORTED',
    finder_driver_name VARCHAR(100),
    claimant_name VARCHAR(100),
    claimant_phone VARCHAR(20),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    target_audience VARCHAR(50) NOT NULL DEFAULT 'ALL_PASSENGERS',
    route_code VARCHAR(10),
    sent_by UUID REFERENCES admin_users(id),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
