import React from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import {
  Compass,
  CalendarPlus,
  Luggage,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Globe2
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    trips,
    setActiveTab,
    viewTripById,
    duplicateTrip,
    deleteTrip,
    startPlanningForDestination,
    savedPlaces
  } = useApp();

  // Statistics calculation
  const totalTrips = trips.length;
  const uniqueDestinations = new Set(trips.map((t) => t.destination.split(',')[0].trim())).size;
  const totalDaysPlanned = trips.reduce(
    (acc, t) => acc + (t.itinerary_json?.days?.length || 0),
    0
  );
  const totalBudgetManaged = trips.reduce(
    (acc, t) => acc + (t.itinerary_json?.budget?.estimated_total || t.budget || 0),
    0
  );

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const recentTrips = trips.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-teal-800/30">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary Engine Ready</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, {user.name.split(' ')[0]}! Ready for your next journey?
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            Your travel hub is synchronized. Create new personalized itineraries, fine-tune budgets, or explore trending global destinations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('plan')}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition hover:scale-105"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Plan a New Trip</span>
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/15 transition"
            >
              Explore Destinations
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-slate-400">
            <span className="text-xs font-medium">Trips Planned</span>
            <Luggage className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalTrips}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              Active
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-slate-500">Including sample & custom plans</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-slate-400">
            <span className="text-xs font-medium">Destinations Explored</span>
            <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {uniqueDestinations}
            </span>
            <span className="text-xs text-stone-400 font-normal">Cities</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-slate-500">Across 3 continents</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-slate-400">
            <span className="text-xs font-medium">Days Organized</span>
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalDaysPlanned}
            </span>
            <span className="text-xs text-indigo-600 font-semibold">Days</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-slate-500">Detailed day-by-day plans</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-slate-400">
            <span className="text-xs font-medium">Estimated Budget Managed</span>
            <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ${totalBudgetManaged.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-slate-500">Calculated with live totals</p>
        </div>
      </div>

      {/* Main Two-Column Layout: Upcoming/Recent Trips & Recommended Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Column: Upcoming & Recent Itineraries */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Luggage className="w-5 h-5 text-teal-600" />
              <span>Upcoming & Saved Trips</span>
            </h2>
            <button
              onClick={() => setActiveTab('my-trips')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({trips.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {trips.length === 0 ? (
            /* Empty State */
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <Luggage className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No travel itineraries planned yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Start your first smart itinerary in seconds. Select a destination, your dates, budget, and travel preferences.
              </p>
              <button
                onClick={() => setActiveTab('plan')}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-sm"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Create My First Trip</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 hover:border-teal-500/50 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={
                        trip.cover_image ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={trip.destination}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {trip.is_sample && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            {trip.scenario_tag || 'Sample'}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 capitalize">
                          {trip.trip_type} • {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
                        </span>
                      </div>

                      <h3
                        onClick={() => viewTripById(trip.id)}
                        className="font-bold text-base text-slate-900 dark:text-white truncate cursor-pointer hover:text-teal-600 transition"
                      >
                        {trip.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          {trip.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {trip.start_date} ({trip.itinerary_json?.days?.length || 3} Days)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-slate-700 gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500 block">
                        Estimated Total
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-teal-600 dark:text-teal-400">
                        {trip.currency} {trip.itinerary_json?.budget?.estimated_total?.toLocaleString() || trip.budget}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => duplicateTrip(trip.id)}
                        title="Duplicate Trip"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-stone-100 dark:hover:bg-slate-700 transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        title="Delete Trip"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => viewTripById(trip.id)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recommended Destinations & Bookmarks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommended Destinations */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-stone-200 dark:border-slate-700 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-600" />
                <span>Recommended for You</span>
              </h3>
              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs text-teal-600 hover:underline"
              >
                Explore More
              </button>
            </div>

            <div className="space-y-3">
              {POPULAR_DESTINATIONS.slice(0, 3).map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => startPlanningForDestination(dest.name)}
                  className="group relative h-24 rounded-xl overflow-hidden cursor-pointer border border-stone-200/80 dark:border-slate-700 hover:shadow-md transition"
                >
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-3 flex flex-col justify-end text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition">
                          {dest.name}, {dest.country}
                        </h4>
                        <span className="text-[10px] text-stone-200">{dest.indicative_budget_range}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-600/90 font-semibold">
                        Plan
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarked Places Quick Widget */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-stone-200 dark:border-slate-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Saved Places ({savedPlaces.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab('saved')}
                className="text-xs text-teal-600 hover:underline"
              >
                View
              </button>
            </div>

            {savedPlaces.length === 0 ? (
              <p className="text-xs text-stone-400 py-2">No places bookmarked yet.</p>
            ) : (
              <div className="space-y-2">
                {savedPlaces.slice(0, 2).map((place) => (
                  <div
                    key={place.id}
                    className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-700/40 border border-stone-200/60 dark:border-slate-600 flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-800 dark:text-white block truncate">
                        {place.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">{place.destination}</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-500 shrink-0">★ {place.rating || 4.8}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
