import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Compass,
  LayoutDashboard,
  CalendarPlus,
  Luggage,
  MapPin,
  Bookmark,
  Sun,
  Moon,
  User,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    darkMode,
    toggleDarkMode,
    user,
    setIsAuthModalOpen,
    trips
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'plan', label: 'Plan a Trip', icon: <CalendarPlus className="w-4 h-4" /> },
    { id: 'my-trips', label: 'My Trips', icon: <Luggage className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore', icon: <MapPin className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Places', icon: <Bookmark className="w-4 h-4" /> },
  ];

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#0B1329]/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  TripGenius <span className="text-teal-600 dark:text-teal-400 font-bold text-xs px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider block font-semibold text-stone-500 dark:text-slate-400 -mt-0.5">
                  Travel Planner
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.id === 'my-trips' && trips.length > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {trips.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Plan Trip CTA, Currency, Dark Mode, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleNav('plan')}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-semibold bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-2xs"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CHF">CHF (Fr)</option>
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Profile Avatar & Settings trigger */}
            {user.isAuthenticated ? (
              <button
                onClick={() => handleNav('settings')}
                title="Account & Settings"
                className="flex items-center gap-2 p-1 pl-2 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 rounded-full border border-stone-200 dark:border-slate-700 transition"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden xl:inline">
                  {user.name.split(' ')[0]}
                </span>
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-slate-800 bg-[#FAF8F5] dark:bg-[#0B1329] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.id === 'my-trips' && trips.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                    {trips.length}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => handleNav('settings')}
              className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> Profile & Settings
            </button>
            <button
              onClick={() => handleNav('landing')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400"
            >
              Public Landing Page
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
