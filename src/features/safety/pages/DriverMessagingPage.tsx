import React from 'react';
import { DriverComm } from '../components/DriverComm';
import { SafetyNavigationTabs } from '../components/SafetyNavigationTabs';
import { MessageSquare, Radio, Shield } from 'lucide-react';

export const DriverMessagingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <SafetyNavigationTabs />

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-brand-700 dark:text-brand-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-occ-text dark:text-white">
            Driver Terminal Communicator & Broadcast
          </h1>
        </div>
        <p className="mt-1 text-xs text-occ-muted dark:text-slate-400">
          Transmit official dispatch advisories, route diversions, and emergency safety notices directly to drivers' mobile cockpit terminals.
        </p>
      </div>

      {/* Driver Communicator Component */}
      <DriverComm />
    </div>
  );
};
