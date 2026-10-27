import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Settings,
  ShieldCheck,
  Server,
  Database,
  Sparkles,
  Check,
  RefreshCw,
  LogOut,
  ExternalLink,
  Code2
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const {
    user,
    updateUserProfile,
    logout,
    currency,
    setCurrency,
    showNotification
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [defaultTravelers, setDefaultTravelers] = useState(user.default_travelers || 1);
  const [pace, setPace] = useState(user.pace_preference || 'balanced');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (e: any) {
      setHealthStatus({ status: 'error', message: e.message });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      default_travelers: defaultTravelers,
      pace_preference: pace as any,
      preferred_currency: currency
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-teal-600" />
          <span>Profile & Architecture Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your travel defaults, profile details, and inspect the backend & database configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: User Profile & Preferences */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 space-y-5 shadow-xs"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100 dark:border-slate-700">
              <img
                src={
                  user.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
                }
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-500"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{user.name}</h3>
                <span className="text-xs text-slate-500">{user.email}</span>
                <span className="inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Authenticated
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Preferred Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CHF">CHF (Fr)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Default Travel Party Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={defaultTravelers}
                  onChange={(e) => setDefaultTravelers(Number(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Default Daily Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['relaxed', 'balanced', 'packed'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPace(p as any)}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize border transition ${
                        pace === p
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                          : 'border-stone-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-stone-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between">
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Full-Stack Architecture & Backend Services Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Health Check Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                <span>Backend Services Status</span>
              </h3>
              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="text-xs text-teal-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${healthLoading ? 'animate-spin' : ''}`} />
                <span>Check</span>
              </button>
            </div>

            {healthStatus && (
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Live API Health:</span>
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">
                    ● {healthStatus.status || 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Gemini Engine:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {healthStatus.gemini_model || 'gemini-3.8-flash'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Active Storage:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {healthStatus.trips_stored ?? 3} Trips Indexed
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Architecture Deployment Guide */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Full-Stack Architecture</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/40">
                <h4 className="font-bold text-teal-900 dark:text-teal-200 mb-1">
                  1. Dual Backend Implementation
                </h4>
                <p className="text-[11px] text-teal-800 dark:text-teal-300">
                  • <strong>server.ts</strong>: Full-stack Express server with Vite middleware powering this live interactive preview.
                  <br />
                  • <strong>backend/</strong>: Production Python FastAPI service with Pydantic schemas, routes, and unit tests ready for deployment on Render, Fly.io, or Cloud Run.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                  2. Supabase PostgreSQL & RLS
                </h4>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                  SQL schema and Row-Level Security policies are located in <code>supabase/migrations/001_initial_schema.sql</code> for <code>profiles</code>, <code>trips</code>, and <code>saved_places</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                  3. Google Gemini Model
                </h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Configured with <code>gemini-3.8-flash</code> via the official <code>@google/genai</code> SDK using server-side keys without browser leakage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
