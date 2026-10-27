import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import {
  Compass,
  Search,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

export const ExploreDestinations: React.FC = () => {
  const { startPlanningForDestination } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'cultural', label: 'Cultural & Heritage' },
    { id: 'adventure', label: 'Adventure & Mountains' },
    { id: 'romantic', label: 'Romantic Getaways' },
    { id: 'nature', label: 'Nature & Scenic' },
    { id: 'beaches', label: 'Beaches & Islands' }
  ];

  const filtered = POPULAR_DESTINATIONS.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-teal-600" />
          <span>Explore Global Destinations</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Discover handpicked destinations with verified seasons, attractions, and daily budgets. Click any destination to generate a custom itinerary.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by city, country, or vibe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 hover:border-teal-500/50 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Photo Banner */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                    {dest.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">
                      {dest.name}, {dest.country}
                    </h3>
                    <span className="text-[11px] text-teal-300 font-semibold block">
                      {dest.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{dest.popularity_score}%</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {dest.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-slate-700/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Best Time to Visit
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {dest.best_time_to_visit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Est. Daily Budget
                    </span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {dest.indicative_budget_range}
                    </span>
                  </div>
                </div>

                {/* Main Attractions */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Top Landmarks
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dest.main_attractions.slice(0, 3).map((attr, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-stone-50/70 dark:bg-slate-700/30 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Suggested: {dest.suggested_duration_days} Days
              </span>
              <button
                onClick={() => startPlanningForDestination(`${dest.name}, ${dest.country}`)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition hover:scale-105"
              >
                <span>Plan Trip Here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
