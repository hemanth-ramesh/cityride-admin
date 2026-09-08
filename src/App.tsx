import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Radio } from 'lucide-react';

// ==========================================
// LAZY-LOADED FEATURE MODULES (CODE SPLITTING)
// ==========================================
const Login = lazy(() =>
  import('@/features/auth/pages/Login').then((m) => ({ default: m.Login }))
);
const DashboardOverview = lazy(() =>
  import('@/features/dashboard/pages/DashboardOverview').then((m) => ({ default: m.DashboardOverview }))
);
const LiveDashboard = lazy(() =>
  import('@/features/live/pages/LiveDashboard').then((m) => ({ default: m.LiveDashboard }))
);
const Drivers = lazy(() =>
  import('@/features/master-data/pages/Drivers').then((m) => ({ default: m.Drivers }))
);
const Vehicles = lazy(() =>
  import('@/features/master-data/pages/Vehicles').then((m) => ({ default: m.Vehicles }))
);
const Stops = lazy(() =>
  import('@/features/master-data/pages/Stops').then((m) => ({ default: m.Stops }))
);
const RoutesPage = lazy(() =>
  import('@/features/master-data/pages/Routes').then((m) => ({ default: m.Routes }))
);
const ScheduledTrips = lazy(() =>
  import('@/features/dispatch/pages/ScheduledTrips').then((m) => ({ default: m.ScheduledTrips }))
);
const DispatchBoard = lazy(() =>
  import('@/features/dispatch/pages/DispatchBoard').then((m) => ({ default: m.DispatchBoard }))
);
const SOSCenter = lazy(() =>
  import('@/features/safety/pages/SOSCenter').then((m) => ({ default: m.SOSCenter }))
);
const Incidents = lazy(() =>
  import('@/features/safety/pages/Incidents').then((m) => ({ default: m.Incidents }))
);
const DriverMessagingPage = lazy(() =>
  import('@/features/safety/pages/DriverMessagingPage').then((m) => ({ default: m.DriverMessagingPage }))
);
const Complaints = lazy(() =>
  import('@/features/service/pages/Complaints').then((m) => ({ default: m.Complaints }))
);
const LostAndFound = lazy(() =>
  import('@/features/service/pages/LostAndFound').then((m) => ({ default: m.LostAndFound }))
);
const Notifications = lazy(() =>
  import('@/features/service/pages/Notifications').then((m) => ({ default: m.Notifications }))
);
const AnalyticsDashboard = lazy(() =>
  import('@/features/analytics/pages/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard }))
);
const TripHistory = lazy(() =>
  import('@/features/analytics/pages/TripHistory').then((m) => ({ default: m.TripHistory }))
);

// OCC Page Loading Spinner Fallback
const OCCLoadingFallback: React.FC = () => (
  <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
      <Radio className="h-6 w-6 animate-pulse" />
    </div>
    <div className="space-y-1 text-center">
      <p className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-slate-200">
        Loading Operations Module...
      </p>
      <span className="text-[10px] text-slate-400">CITYRIDE Control Center</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Suspense fallback={<OCCLoadingFallback />}>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardOverview />} />

          {/* Phase 4: Live Operations Command Center */}
          <Route
            path="operations/live"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER']}>
                <LiveDashboard />
              </ProtectedRoute>
            }
          />

          {/* Phase 2: Master Data Management */}
          <Route
            path="fleet"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'FLEET_MANAGER']}>
                <Vehicles />
              </ProtectedRoute>
            }
          />

          <Route
            path="drivers"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'FLEET_MANAGER']}>
                <Drivers />
              </ProtectedRoute>
            }
          />

          {/* Phase 3: Duty & Dispatch Management */}
          <Route
            path="duties"
            element={<Navigate to="/duties/scheduled-trips" replace />}
          />

          <Route
            path="duties/scheduled-trips"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER']}>
                <ScheduledTrips />
              </ProtectedRoute>
            }
          />

          <Route
            path="duties/dispatch-board"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER']}>
                <DispatchBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="routes"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER']}>
                <RoutesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="stops"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER']}>
                <Stops />
              </ProtectedRoute>
            }
          />

          {/* Phase 7: Historical Trip Monitoring & Replay */}
          <Route
            path="trips"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'ANALYST']}>
                <TripHistory />
              </ProtectedRoute>
            }
          />

          {/* Phase 5: Safety & Emergency Operations */}
          <Route
            path="incidents"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER']}>
                <Incidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="emergency"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'SUPPORT_ADMIN']}>
                <SOSCenter />
              </ProtectedRoute>
            }
          />

          <Route
            path="safety/messaging"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER']}>
                <DriverMessagingPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6: Service & Support */}
          <Route
            path="passengers"
            element={<Navigate to="/complaints" replace />}
          />

          <Route
            path="complaints"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPPORT_ADMIN']}>
                <Complaints />
              </ProtectedRoute>
            }
          />

          <Route
            path="lost-found"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPPORT_ADMIN']}>
                <LostAndFound />
              </ProtectedRoute>
            }
          />

          <Route
            path="notifications"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'SUPPORT_ADMIN']}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Phase 7: Analytics & Reporting */}
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'ANALYST']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
