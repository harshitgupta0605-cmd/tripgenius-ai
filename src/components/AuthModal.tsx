import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, fullName || email.split('@')[0]);
    setIsAuthModalOpen(false);
  };

  const handleDemoLogin = () => {
    login('alex.morgan@example.com', 'Alex Morgan');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'signin' ? 'Sign In to TripGenius' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500">
            Save and synchronize your personalized travel itineraries
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('signin')}
            className={`py-2 rounded-lg transition ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-2 rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-200 dark:border-slate-700" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400">or</span>
          <div className="flex-grow border-t border-stone-200 dark:border-slate-700" />
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full p-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>One-Click Demo Access (Alex Morgan)</span>
        </button>
      </div>
    </div>
  );
};
