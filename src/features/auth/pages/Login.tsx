import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  Bus,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Radio,
  Eye,
  EyeOff,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
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
        </div>

        {/* Left Footer Spacer */}
        <div className="relative z-10" />
      </div>

      {/* Right: Clean Sign In Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Form Header */}
          <div>
            <div className="flex items-center space-x-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-slate-950">
                <Bus className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">CITYRIDE OCC</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
              Sign In
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Enter transit administrator credentials to access the operations control center.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center space-x-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-semibold text-slate-200"
              >
                Admin Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="admin@cityride.tumakuru.gov.in"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold text-slate-200"
              >
                Admin Password <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="Enter password..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
