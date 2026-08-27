import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, MOCK_ADMIN_USERS } from '@/stores/useAuthStore';
import { AdminRole } from '@/types/auth';
import { ROLE_LABELS, ROLE_BADGE_STYLES } from '@/utils/rbac';
import { FormField } from '@/components/ui/FormField';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Bus,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Radio,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('operations@cityride.tumakuru.gov.in');
  const [password, setPassword] = useState('TransitAdmin@2026');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoRoleLogin = (role: AdminRole) => {
    demoLogin(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-950 text-slate-100">
      {/* Left: Operations Center Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-950 via-slate-900 to-occ-navy p-12 lg:flex">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/30">
            <Bus className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">CITYRIDE</h1>
            <p className="text-xs font-semibold tracking-widest text-brand-400 uppercase">
              Operations Control Center
            </p>
          </div>
        </div>

        {/* Center OCC Narrative */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            <Radio className="h-3.5 w-3.5 animate-pulse text-brand-400" />
            <span>Tumakuru Smart Public Transit Hub</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Real-Time Transit Command & Control.
          </h2>

          <p className="text-sm leading-relaxed text-slate-300">
            Centralized operations monitoring connecting passenger telemetry, driver duties, 
            36 verified smart stops, 8 active bus corridors, and instant emergency response.
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div>
              <p className="text-2xl font-black text-white">36</p>
              <p className="text-xs font-medium text-slate-400">Verified Bus Stops</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">8</p>
              <p className="text-xs font-medium text-slate-400">Transit Corridors</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">2.5s</p>
              <p className="text-xs font-medium text-slate-400">GPS Refresh Rate</p>
            </div>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="relative z-10 flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-brand-400" />
          <span>Restricted Government Transit Operations Access • Auth Protected</span>
        </div>
      </div>

      {/* Right: Login Form & Role Quick-Select */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Form Header */}
          <div>
            <div className="flex items-center space-x-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-slate-950">
                <Bus className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">CITYRIDE OCC</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sign In to OCC
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Enter your transit officer credentials to access the operations console.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center space-x-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@cityride.tumakuru.gov.in"
              icon={Mail}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500"
            />

            <FormField
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              icon={Lock}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* RBAC 1-Click Role Switcher Demo Cards */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                <span>Quick Role Demo (Test All 6 RBAC Roles)</span>
              </span>
              <span className="text-[10px] text-slate-500">1-Click Login</span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(MOCK_ADMIN_USERS) as AdminRole[]).map((r) => {
                const style = ROLE_BADGE_STYLES[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleDemoRoleLogin(r)}
                    className="flex flex-col items-start rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-left transition hover:border-brand-500/50 hover:bg-slate-800/80"
                  >
                    <span className="text-xs font-bold text-slate-200">
                      {ROLE_LABELS[r].split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate w-full">
                      {MOCK_ADMIN_USERS[r].fullName.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Backend Status Flag */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Supabase Connection:</span>
            <span className={isSupabaseConfigured ? 'font-semibold text-emerald-400' : 'text-slate-400'}>
              {isSupabaseConfigured ? '🟢 Connected' : '⚪ Demo / Mock Fallback'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
