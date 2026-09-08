import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TableColumn } from '@/types';
import { Link } from 'react-router-dom';
import {
  Bus,
  Radio,
  Clock,
  Flame,
  Zap,
  ArrowUpRight,
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
    routeName: 'Standby Buses',
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
      header: 'Vehicle No',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Bus className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-xs tracking-tight">
            {row.plateNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'routeCode',
      header: 'Route',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50">
            {row.routeCode}
          </span>
          <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300 max-w-[170px]">
            {row.routeName}
          </span>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver Assigned',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-slate-200 text-indigo-700 dark:from-slate-700 dark:to-slate-800 dark:text-indigo-300 border border-slate-200/60 dark:border-slate-700 text-[10px] font-bold">
            {row.driverName.charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            {row.driverName}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Operational Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} pulse={row.status === 'on_time'} />,
    },
    {
      key: 'vehicleId',
      header: 'Live Location',
      render: (row) => (
        <Link
          to={`/operations/live?plate=${encodeURIComponent(row.plateNumber)}&vehicleId=${encodeURIComponent(row.vehicleId)}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-200/80 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/70 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xs active:scale-95 group"
        >
          <MapPin className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          <span>Track Bus</span>
          <ArrowUpRight className="h-3 w-3 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards Grid - 3 on top, 3 on bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <KPICard
          title="ACTIVE BUSES"
          value="5"
          subtext="5 of 9 in active service"
          status="orange"
          icon={Bus}
          change={12.5}
          changeType="increase"
        />

        <KPICard
          title="LIVE TRIPS"
          value="5"
          subtext="Scheduled on-duty routes"
          status="info"
          icon={Radio}
          change={100}
          changeType="increase"
        />

        <KPICard
          title="ON-TIME"
          value="3"
          subtext="60% punctuality rate"
          status="teal"
          icon={CheckCircle2}
          change={60}
          changeType="increase"
        />

        <KPICard
          title="DELAYED"
          value="2"
          subtext="+3 to +7 mins average delay"
          status="warning"
          icon={Clock}
          change={25}
          changeType="decrease"
        />

        <KPICard
          title="OFFLINE"
          value="1"
          subtext="Central Depot Standby"
          status="dark"
          icon={Zap}
        />

        <KPICard
          title="ACTIVE SOS"
          value="0"
          subtext="All systems nominal"
          status="danger"
          icon={Flame}
        />
      </div>

      {/* Active Buses Real-time Table - iOS Grouped Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-occ-darkCard space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Live Buses Status
              </h2>
            </div>
          </div>

          <Link
            to="/fleet"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 self-start sm:self-auto"
          >
            <span>View All Buses</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
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
