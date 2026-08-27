import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { KPICard } from '@/components/ui/KPICard';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TableColumn } from '@/types';
import { Link } from 'react-router-dom';
import {
  Bus,
  Radio,
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface FleetPreviewItem {
  vehicleId: string;
  plateNumber: string;
  routeCode: string;
  routeName: string;
  driverName: string;
  speedKmph: number;
  status: 'on_time' | 'delayed' | 'offline' | 'emergency';
  currentStop: string;
  nextStop: string;
  etaMinutes: number;
  lastPingAgo: string;
}

const MOCK_ACTIVE_FLEET: FleetPreviewItem[] = [
  {
    vehicleId: 'CR_TUM_8558',
    plateNumber: 'KA 06 F 8558',
    routeCode: 'R01',
    routeName: 'KSRTC Stand ↔ SIT Back Gate',
    driverName: 'Rajesh DRV-1042',
    speedKmph: 32,
    status: 'on_time',
    currentStop: 'Gandhi Nagar',
    nextStop: 'SS Puram Circle',
    etaMinutes: 2,
    lastPingAgo: '2s ago',
  },
  {
    vehicleId: 'CR_TUM_1234',
    plateNumber: 'KA 06 FA 1234',
    routeCode: 'R02',
    routeName: 'KSRTC Stand ↔ Siddaganga Mutt',
    driverName: 'Basavaraj DRV-1055',
    speedKmph: 24,
    status: 'delayed',
    currentStop: 'Mandi Pete Gate',
    nextStop: 'Batawadi Circle',
    etaMinutes: 6,
    lastPingAgo: '5s ago',
  },
  {
    vehicleId: 'CR_TUM_4321',
    plateNumber: 'KA 06 G 4321',
    routeCode: 'R03',
    routeName: 'Tumkur Univ ↔ Heggere',
    driverName: 'Manjunath DRV-1089',
    speedKmph: 38,
    status: 'on_time',
    currentStop: 'Gubbi Gate Circle',
    nextStop: 'Devarayapatna',
    etaMinutes: 3,
    lastPingAgo: '3s ago',
  },
  {
    vehicleId: 'CR_TUM_3920',
    plateNumber: 'KA 06 F 3920',
    routeCode: 'R04',
    routeName: 'KSRTC Stand ↔ Melekote Ind.',
    driverName: 'Siddaraju DRV-1021',
    speedKmph: 29,
    status: 'on_time',
    currentStop: 'Sira Gate Junction',
    nextStop: 'Banashankari',
    etaMinutes: 4,
    lastPingAgo: '4s ago',
  },
  {
    vehicleId: 'CR_TUM_9012',
    plateNumber: 'KA 06 E 9012',
    routeCode: 'R05',
    routeName: 'Belagumba ↔ Badrama Chowtry',
    driverName: 'Chandrashekar DRV-1102',
    speedKmph: 18,
    status: 'delayed',
    currentStop: 'SP Office',
    nextStop: 'Town Hall',
    etaMinutes: 7,
    lastPingAgo: '8s ago',
  },
  {
    vehicleId: 'CR_TUM_1100',
    plateNumber: 'KA 06 F 1100',
    routeCode: 'R01',
    routeName: 'Standby Fleet',
    driverName: 'Depot Reserve',
    speedKmph: 0,
    status: 'offline',
    currentStop: 'Central Depot 1',
    nextStop: '—',
    etaMinutes: 0,
    lastPingAgo: '12m ago',
  },
];

export const DashboardOverview: React.FC = () => {
  const columns: TableColumn<FleetPreviewItem>[] = [
    {
      key: 'plateNumber',
      header: 'Vehicle / Plate',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{row.plateNumber}</span>
          <span className="text-[10px] text-slate-500">{row.vehicleId}</span>
        </div>
      ),
    },
    {
      key: 'routeCode',
      header: 'Route',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            {row.routeCode}
          </span>
          <span className="hidden truncate text-xs text-slate-600 sm:inline dark:text-slate-400">
            {row.routeName}
          </span>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver Assigned',
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.driverName}</span>,
    },
    {
      key: 'status',
      header: 'Operational Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} pulse={row.status === 'on_time'} />,
    },
    {
      key: 'currentStop',
      header: 'Live Progress',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="text-slate-700 dark:text-slate-300">
            <span className="text-slate-400">At:</span> {row.currentStop}
          </span>
          <span className="text-[11px] text-brand-600 dark:text-brand-400">
            <span className="text-slate-400">Next:</span> {row.nextStop} ({row.etaMinutes}m)
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KPICard
          title="ACTIVE BUSES"
          value="5"
          subtext="5 of 9 in service"
          status="success"
          icon={Bus}
          change={12.5}
          changeType="increase"
        />

        <KPICard
          title="LIVE TRIPS"
          value="5"
          subtext="Scheduled on-duty"
          status="info"
          icon={Radio}
        />

        <KPICard
          title="ON-TIME"
          value="3"
          subtext="60% punctuality"
          status="success"
          icon={CheckCircle2}
        />

        <KPICard
          title="DELAYED"
          value="2"
          subtext="+3 to +7 mins"
          status="warning"
          icon={Clock}
        />

        <KPICard
          title="OFFLINE"
          value="1"
          subtext="Depot Standby"
          status="neutral"
          icon={Zap}
        />

        <KPICard
          title="ACTIVE SOS"
          value="0"
          subtext="No emergencies"
          status="neutral"
          icon={Flame}
        />
      </div>

      {/* Active Fleet Real-time Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-occ-text dark:text-white">
              Live Fleet Status
            </h2>
            <p className="text-xs text-occ-muted dark:text-slate-400">
              Real-time vehicle telemetry stream from Tumakuru driver devices (2.5s interval).
            </p>
          </div>

          <Link
            to="/fleet"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400"
          >
            View Complete Fleet →
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={MOCK_ACTIVE_FLEET}
          keyExtractor={(item) => item.vehicleId}
          searchPlaceholder="Search bus, route, driver, or stop..."
        />
      </div>
    </div>
  );
};
