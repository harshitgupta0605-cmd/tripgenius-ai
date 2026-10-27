import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TripRecord } from '../types/trip';
import {
  Luggage,
  Search,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  Users,
  Copy,
  Trash2,
  CalendarPlus,
  ChevronRight,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export const MyTrips: React.FC = () => {
  const {
    trips,
    viewTripById,
    duplicateTrip,
    deleteTrip,
    setActiveTab
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past' | 'samples'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'date' | 'budget'>('updated');
  const [tripToDelete, setTripToDelete] = useState<TripRecord | null>(null);

  // Filter & Search
  let filtered = trips.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter === 'samples') return Boolean(t.is_sample);
    if (statusFilter === 'upcoming') return t.status === 'upcoming' && !t.is_sample;
    if (statusFilter === 'past') return t.status === 'completed';

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    if (sortBy === 'date') {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }
    if (sortBy === 'budget') {
      const bA = a.itinerary_json?.budget?.estimated_total || a.budget || 0;
      const bB = b.itinerary_json?.budget?.estimated_total || b.budget || 0;
      return bB - bA;
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Luggage className="w-7 h-7 text-teal-600" />
            <span>My Trips & Itineraries</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, manage, and duplicate your personal AI-generated travel plans.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('plan')}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition hover:scale-105"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Filter, Search & View Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-stone-200 dark:border-slate-700">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trip title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All Trips' },
              { id: 'upcoming', label: 'My Upcoming' },
              { id: 'samples', label: 'Sample Templates' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === f.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and View Mode */}
        <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="date">Departure Date</option>
              <option value="budget">Highest Budget</option>
            </select>
          </div>

          <div className="flex items-center border border-stone-200 dark:border-slate-700 rounded-xl overflow-hidden p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-stone-100 dark:hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-stone-100 dark:hover:bg-slate-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trips Display */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-3">
          <Luggage className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No trips match your criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or status filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip) => (
            <div
              key={trip.id}
              className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 hover:border-teal-500/50 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      trip.cover_image ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {trip.is_sample && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        {trip.scenario_tag || 'Sample'}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                      {trip.trip_type}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold flex items-center gap-1 text-teal-300">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.destination}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => viewTripById(trip.id)}
                    className="font-bold text-base text-slate-900 dark:text-white cursor-pointer hover:text-teal-600 transition line-clamp-1"
                  >
                    {trip.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {trip.start_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Estimated Cost
                      </span>
                      <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                        {trip.currency} {trip.itinerary_json?.budget?.estimated_total?.toLocaleString() || trip.budget}
                      </span>
                    </div>

                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {trip.itinerary_json?.days?.length || 3} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-stone-50/70 dark:bg-slate-700/30 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateTrip(trip.id)}
                    title="Duplicate Trip"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-stone-200 dark:hover:bg-slate-600 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTripToDelete(trip)}
                    title="Delete Trip"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => viewTripById(trip.id)}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <span>Open Itinerary</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 divide-y divide-stone-100 dark:divide-slate-700 overflow-hidden shadow-xs">
          {filtered.map((trip) => (
            <div
              key={trip.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-slate-700/30 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={
                    trip.cover_image ||
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={trip.destination}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {trip.is_sample && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Sample
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      {trip.trip_type} • {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3
                    onClick={() => viewTripById(trip.id)}
                    className="font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer hover:text-teal-600 truncate"
                  >
                    {trip.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      {trip.destination}
                    </span>
                    <span>•</span>
                    <span>{trip.start_date} ({trip.itinerary_json?.days?.length || 3} Days)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-slate-700">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Estimated Cost
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-teal-600">
                    {trip.currency} {trip.itinerary_json?.budget?.estimated_total?.toLocaleString() || trip.budget}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateTrip(trip.id)}
                    title="Duplicate"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTripToDelete(trip)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => viewTripById(trip.id)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
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

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Trip Itinerary?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">"{tripToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTripToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTrip(tripToDelete.id);
                  setTripToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
