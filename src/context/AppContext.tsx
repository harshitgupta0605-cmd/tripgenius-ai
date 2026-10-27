import React, { createContext, useContext, useState, useEffect } from 'react';
import { TripRecord, Itinerary, SavedPlace, Destination } from '../types/trip';
import { SAMPLE_TRIPS } from '../data/sampleTrips';

export type NavTab = 'landing' | 'dashboard' | 'plan' | 'my-trips' | 'explore' | 'saved' | 'settings' | 'trip-detail';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  preferred_currency: string;
  default_travelers: number;
  pace_preference: 'relaxed' | 'balanced' | 'packed';
  dietary_restrictions: string[];
  isAuthenticated: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  trips: TripRecord[];
  activeTrip: TripRecord | null;
  setActiveTrip: (trip: TripRecord | null) => void;
  viewTripById: (tripId: string) => void;
  savedPlaces: SavedPlace[];
  toggleSavePlace: (place: Omit<SavedPlace, 'id' | 'created_at'>) => void;
  isPlaceSaved: (name: string) => boolean;
  user: UserProfile;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notification: Notification | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  saveNewTrip: (trip: TripRecord) => void;
  updateTrip: (updatedTrip: TripRecord) => void;
  deleteTrip: (tripId: string) => void;
  duplicateTrip: (tripId: string) => void;
  prefillDestination: string | null;
  startPlanningForDestination: (destinationName: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('tripgenius_dark') === 'true';
  });
  const [currency, setCurrency] = useState<string>('USD');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [prefillDestination, setPrefillDestination] = useState<string | null>(null);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tripgenius_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      id: 'demo-user-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      preferred_currency: 'USD',
      default_travelers: 1,
      pace_preference: 'balanced',
      dietary_restrictions: ['Local Specialties'],
      isAuthenticated: true
    };
  });

  // Saved Trips (Local storage + sample trips)
  const [trips, setTrips] = useState<TripRecord[]>(() => {
    const stored = localStorage.getItem('tripgenius_trips');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return SAMPLE_TRIPS;
  });

  const [activeTrip, setActiveTrip] = useState<TripRecord | null>(SAMPLE_TRIPS[0]);

  // Saved Places
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => {
    const stored = localStorage.getItem('tripgenius_saved_places');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return [
      {
        id: 'place-1',
        name: 'Amber Fort & Mirror Palace',
        destination: 'Jaipur, India',
        category: 'Historic Landmark',
        notes: 'Iconic hill fort with marble inlaid mirrors.',
        latitude: 26.9855,
        longitude: 75.8513,
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString()
      },
      {
        id: 'place-2',
        name: 'Terrazza dell’Infinito (Villa Cimbrone)',
        destination: 'Ravello, Amalfi Coast',
        category: 'Scenic Viewpoint',
        notes: 'Marble busts with 1,200ft sea views.',
        latitude: 40.6471,
        longitude: 14.6115,
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString()
      }
    ];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('tripgenius_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('tripgenius_saved_places', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    localStorage.setItem('tripgenius_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tripgenius_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotification({ id, type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const login = (email: string, name?: string) => {
    setUser({
      ...user,
      email,
      name: name || email.split('@')[0],
      isAuthenticated: true
    });
    showNotification('success', `Welcome back, ${name || email.split('@')[0]}!`);
  };

  const logout = () => {
    setUser({
      ...user,
      isAuthenticated: false
    });
    showNotification('info', 'You have been signed out.');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showNotification('success', 'Profile and preferences updated.');
  };

  const viewTripById = (tripId: string) => {
    const found = trips.find((t) => t.id === tripId);
    if (found) {
      setActiveTrip(found);
      setActiveTab('trip-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showNotification('error', 'Trip not found.');
    }
  };

  const saveNewTrip = (newTrip: TripRecord) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    setActiveTab('trip-detail');
    showNotification('success', `Created "${newTrip.title}" successfully!`);
  };

  const updateTrip = (updatedTrip: TripRecord) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    if (activeTrip?.id === updatedTrip.id) {
      setActiveTrip(updatedTrip);
    }
    showNotification('success', 'Trip updated and saved.');
  };

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTrip?.id === tripId) {
      setActiveTrip(null);
      setActiveTab('my-trips');
    }
    showNotification('info', 'Trip deleted.');
  };

  const duplicateTrip = (tripId: string) => {
    const source = trips.find((t) => t.id === tripId);
    if (!source) return;

    const cloned: TripRecord = {
      ...source,
      id: 'trip-' + Date.now(),
      title: `${source.title} (Copy)`,
      is_sample: false,
      scenario_tag: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTrips((prev) => [cloned, ...prev]);
    setActiveTrip(cloned);
    setActiveTab('trip-detail');
    showNotification('success', `Duplicated trip as "${cloned.title}"!`);
  };

  const toggleSavePlace = (placeData: Omit<SavedPlace, 'id' | 'created_at'>) => {
    const exists = savedPlaces.some((p) => p.name.toLowerCase() === placeData.name.toLowerCase());
    if (exists) {
      setSavedPlaces((prev) => prev.filter((p) => p.name.toLowerCase() !== placeData.name.toLowerCase()));
      showNotification('info', `Removed "${placeData.name}" from saved places.`);
    } else {
      const newPlace: SavedPlace = {
        ...placeData,
        id: 'place-' + Date.now(),
        created_at: new Date().toISOString()
      };
      setSavedPlaces((prev) => [newPlace, ...prev]);
      showNotification('success', `Saved "${placeData.name}" to your bookmarks.`);
    }
  };

  const isPlaceSaved = (name: string) => {
    return savedPlaces.some((p) => p.name.toLowerCase() === name.toLowerCase());
  };

  const startPlanningForDestination = (destinationName: string) => {
    setPrefillDestination(destinationName);
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        trips,
        activeTrip,
        setActiveTrip,
        viewTripById,
        savedPlaces,
        toggleSavePlace,
        isPlaceSaved,
        user,
        login,
        logout,
        updateUserProfile,
        currency,
        setCurrency,
        darkMode,
        toggleDarkMode,
        notification,
        showNotification,
        saveNewTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        prefillDestination,
        startPlanningForDestination,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
