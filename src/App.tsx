import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { TripBuilder } from './components/TripBuilder/TripBuilder';
import { ItineraryView } from './components/ItineraryView/ItineraryView';
import { MyTrips } from './components/MyTrips';
import { ExploreDestinations } from './components/ExploreDestinations';
import { SavedPlaces } from './components/SavedPlaces';
import { ProfileSettings } from './components/ProfileSettings';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, notification } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#080E1E] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold animate-in slide-in-from-top-4 duration-200 backdrop-blur-md bg-white/95 dark:bg-slate-800/95 border-stone-200 dark:border-slate-700">
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
          {notification.type === 'info' && <Info className="w-4 h-4 text-teal-500" />}
          <span className="text-slate-800 dark:text-slate-200">{notification.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Body Content with Sidebar */}
      {activeTab === 'landing' ? (
        <LandingPage />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'plan' && <TripBuilder />}
            {activeTab === 'trip-detail' && <ItineraryView />}
            {activeTab === 'my-trips' && <MyTrips />}
            {activeTab === 'explore' && <ExploreDestinations />}
            {activeTab === 'saved' && <SavedPlaces />}
            {activeTab === 'settings' && <ProfileSettings />}
          </main>
        </div>
      )}

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
