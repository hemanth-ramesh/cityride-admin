# CITYRIDE OCC Admin Portal — Backend & Engineering Documentation 📚

Welcome to the backend architecture and integration documentation for the **CITYRIDE Operations Control Center (OCC) Admin Portal** (Tumakuru Transit Network).

This documentation is designed to guide backend engineers, DevOps, and teammates in implementing, integrating, and deploying the backend services, Supabase database schemas, real-time WebSocket pipelines, and REST APIs.

---

## 📑 Documentation Index

1. **[Backend Integration & Architecture Guide](./BACKEND_INTEGRATION_GUIDE.md)**
   - Complete architectural overview, frontend-to-backend contracts, telemetry ingest formats, lifecycle state machines, and RBAC security policies.
2. **[Complete Database Schema (SQL)](./DATABASE_SCHEMA.sql)**
   - Full PostgreSQL DDL script with tables, enums, foreign keys, indexes, and constraints ready to execute on Supabase.
3. **[Security & Row Level Security (RLS) Policies](../supabase/migrations/20260824000001_production_rls_policies.sql)**
   - Production Row-Level Security policies enforcing role-based data isolation.

---

## 🚌 Network Scope & Ground Truths

- **City**: Tumakuru, Karnataka, India
- **Transit Agency**: CITYRIDE Public Bus Network (OCC)
- **Active Bus Stops**: 36 Geocoded Stops
- **Active Routes**: 8 Radial Corridors (R01 to R08)
- **Fleet Size**: 9 Vehicles (KA 06 series — Electric Vehicles & BS-VI Diesel)
- **Active Drivers**: 8 Certified Staff Drivers
- **OCC Roles**: 6 Role-Based Access Control tiers
- **Domain Constraint**: Strictly Public Transit Fleet Operations, Real-Time Dispatch, Safety/SOS, and Passenger Service Grievances. *(Strictly NO ticketing, payments, or fare collection)*.
