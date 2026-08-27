-- ==============================================================================
-- CITYRIDE ADMIN OPERATIONS CONTROL CENTER (OCC)
-- Supabase Row Level Security (RLS) Policies & RBAC Authorization Migration
-- Scope: Drivers, Vehicles, SOS Alerts, and Scheduled Duties
-- Strictly NO TICKETING or financial data.
-- ==============================================================================

-- 1. Helper Function: Get Current Authenticated Admin Role
CREATE OR REPLACE FUNCTION auth.get_admin_role()
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role',
      'ANALYST'
    )
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ==============================================================================
-- 2. DRIVERS TABLE RLS POLICIES
-- ==============================================================================
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated OCC admins to view driver registry
CREATE POLICY "OCC Admins can read drivers"
  ON public.drivers
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow Super Admin, Operations Manager, and Fleet Manager to modify driver records
CREATE POLICY "Fleet & Operations Managers can insert/update drivers"
  ON public.drivers
  FOR ALL
  TO authenticated
  USING (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER')
  )
  WITH CHECK (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER')
  );

-- Only Super Admin can delete driver master records
CREATE POLICY "Only Super Admin can delete drivers"
  ON public.drivers
  FOR DELETE
  TO authenticated
  USING (
    auth.get_admin_role() = 'SUPER_ADMIN'
  );

-- ==============================================================================
-- 3. VEHICLES TABLE RLS POLICIES
-- ==============================================================================
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated OCC admins to view fleet inventory
CREATE POLICY "OCC Admins can read fleet vehicles"
  ON public.vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow Super Admin, Operations Manager, and Fleet Manager to create & update bus specs
CREATE POLICY "Fleet Managers can manage vehicles"
  ON public.vehicles
  FOR ALL
  TO authenticated
  USING (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER')
  )
  WITH CHECK (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER')
  );

-- ==============================================================================
-- 4. SOS ALERTS TABLE RLS POLICIES
-- ==============================================================================
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- Public/Passenger/Driver apps can trigger emergency SOS
CREATE POLICY "Anyone can trigger emergency SOS"
  ON public.sos_alerts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- OCC Staff can view all active and historical distress broadcasts
CREATE POLICY "OCC Admins can read SOS alerts"
  ON public.sos_alerts
  FOR SELECT
  TO authenticated
  USING (true);

-- Super Admin, Operations Manager, Dispatcher, and Support Admin can acknowledge and resolve SOS
CREATE POLICY "OCC Emergency Officers can update and resolve SOS"
  ON public.sos_alerts
  FOR UPDATE
  TO authenticated
  USING (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'SUPPORT_ADMIN')
  )
  WITH CHECK (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'SUPPORT_ADMIN')
  );

-- ==============================================================================
-- 5. DUTIES & SCHEDULED TRIPS TABLE RLS POLICIES
-- ==============================================================================
ALTER TABLE public.duties ENABLE ROW LEVEL SECURITY;

-- All OCC roles can view duty rosters
CREATE POLICY "OCC Admins can read duties"
  ON public.duties
  FOR SELECT
  TO authenticated
  USING (true);

-- Super Admin, Operations Manager, and Dispatcher can create and assign duties
CREATE POLICY "Dispatchers can manage duty rosters"
  ON public.duties
  FOR ALL
  TO authenticated
  USING (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER')
  )
  WITH CHECK (
    auth.get_admin_role() IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER')
  );
