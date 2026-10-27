import React, { useState } from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Compass,
  LayoutDashboard,
  CalendarPlus,
  Luggage,
  MapPin,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe2,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, trips, savedPlaces } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'plan', label: 'Plan a Trip', icon: <CalendarPlus className="w-4 h-4" /> },
    { id: 'my-trips', label: 'My Trips', icon: <Luggage className="w-4 h-4" />, badge: trips.length },
    { id: 'explore', label: 'Explore Destinations', icon: <Compass className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Places', icon: <Bookmark className="w-4 h-4" />, badge: savedPlaces.length },
    { id: 'settings', label: 'Profile & Architecture', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-stone-200 dark:border-slate-800 bg-[#FAF8F5] dark:bg-[#080E1E] transition-all duration-300 no-print shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200 dark:border-slate-800">
        {!isCollapsed ? (
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left group transition"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                TripGenius <span className="text-teal-600 text-[10px] font-bold px-1 rounded bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider block font-semibold text-stone-500 -mt-0.5">
                Smart Planner
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('landing')}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-md"
          >
            <Compass className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
        )}

        {links.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              title={isCollapsed ? link.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-teal-600 dark:text-teal-400'}>
                  {link.icon}
                </span>
                {!isCollapsed && <span>{link.label}</span>}
              </div>

              {!isCollapsed && link.badge !== undefined && link.badge > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info box */}
      {!isCollapsed && (
        <div className="p-4 border-t border-stone-200 dark:border-slate-800 space-y-2">
          <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/40 text-xs text-teal-900 dark:text-teal-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Gemini 3.8 Flash</span>
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-300">
              Personalized schedules with zero backtracking.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('landing')}
            className="w-full text-left text-[11px] font-semibold text-slate-500 hover:text-teal-600 flex items-center gap-1.5 px-1 py-1"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>View Public Landing Page</span>
          </button>
        </div>
      )}
    </aside>
  );
};
