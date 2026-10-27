import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_TRIPS } from '../data/sampleTrips';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import {
  Compass,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Wallet,
  Users,
  CheckCircle2,
  Star,
  RefreshCw,
  Share2,
  FileDown,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, startPlanningForDestination, viewTripById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      startPlanningForDestination(searchQuery.trim());
    } else {
      setActiveTab('plan');
    }
  };

  const previewTrip = SAMPLE_TRIPS[selectedScenario];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080E1E] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-stone-200 dark:border-slate-800/80">
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Next-Gen Travel Intelligence with Google Gemini</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Personalized Travel Itineraries,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Crafted in Seconds.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Whether you are traveling solo, as a couple, or with a group, TripGenius AI builds balanced, geographically optimized day-by-day plans with real budgets and interactive maps.
            </p>

            {/* Destination Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 max-w-2xl mx-auto bg-white dark:bg-slate-800/90 p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2.5"
            >
              <div className="flex items-center gap-3 px-3.5 py-2.5 w-full flex-1">
                <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you want to explore? (e.g. Kyoto, Jaipur, Amalfi Coast)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
              >
                <span>Plan with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Destination Pill Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Trending:</span>
              {['Jaipur', 'Kyoto', 'Amalfi Coast', 'Barcelona', 'Interlaken'].map((city) => (
                <button
                  key={city}
                  onClick={() => startPlanningForDestination(city)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-white dark:bg-[#0B1329] border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400 mb-2">
              Engineered for Real Travelers
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything You Need to Plan Without the Headache
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#FAF8F5] dark:bg-slate-800/60 p-6 rounded-2xl border border-stone-200/80 dark:border-slate-700 space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Geographic Clustering</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                No crisscrossing the city. Attractions on each day are grouped by physical proximity to minimize transit time and avoid backtracking.
              </p>
            </div>

            <div className="bg-[#FAF8F5] dark:bg-slate-800/60 p-6 rounded-2xl border border-stone-200/80 dark:border-slate-700 space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Live Budget Recalculation</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Edit activity costs, adjust dining preferences, or switch accommodation tiers. Daily and total budgets recalculate instantly.
              </p>
            </div>

            <div className="bg-[#FAF8F5] dark:bg-slate-800/60 p-6 rounded-2xl border border-stone-200/80 dark:border-slate-700 space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Single-Day Regeneration</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Bad weather or closed museum on Tuesday? Regenerate Day 2 independently with specific instructions without rewriting your whole week.
              </p>
            </div>

            <div className="bg-[#FAF8F5] dark:bg-slate-800/60 p-6 rounded-2xl border border-stone-200/80 dark:border-slate-700 space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <FileDown className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">PDF Export & Public Share</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Export print-ready PDF itineraries or generate secure public sharing links to collaborate effortlessly with your travel crew.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Itinerary Showcase (Section 16: Scenarios A, B, C) */}
      <section className="py-20 bg-[#FAF8F5] dark:bg-[#080E1E] border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400">
              Verified Real Scenarios
            </span>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Explore Pre-Built Itineraries
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Click through authentic scenarios tested with exact dates, real budget distributions, and clustered venues.
            </p>

            {/* Scenario Switcher Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SAMPLE_TRIPS.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => setSelectedScenario(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    selectedScenario === idx
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {sample.scenario_tag || sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Card Showcase */}
          {previewTrip && (
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-xl overflow-hidden transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Photo & Quick Info */}
                <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[300px]">
                  <img
                    src={previewTrip.cover_image}
                    alt={previewTrip.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 flex flex-col justify-end text-white">
                    <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded bg-teal-500/90 text-white w-fit mb-2">
                      {previewTrip.scenario_tag}
                    </span>
                    <h4 className="text-2xl font-bold">{previewTrip.title}</h4>
                    <p className="text-xs text-stone-200 mt-1 line-clamp-2">
                      {previewTrip.itinerary_json.summary}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-stone-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {previewTrip.start_date} to {previewTrip.end_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {previewTrip.travelers} traveler ({previewTrip.trip_type})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Timeline Snapshot */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-700 pb-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Budget</span>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {previewTrip.currency} {previewTrip.itinerary_json.budget.total_budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Est. Total Cost</span>
                        <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
                          {previewTrip.currency} {previewTrip.itinerary_json.budget.estimated_total.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Duration</span>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {previewTrip.itinerary_json.days.length} Days
                        </p>
                      </div>
                    </div>

                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Day Highlights:</h5>
                    <div className="space-y-2.5">
                      {previewTrip.itinerary_json.days.slice(0, 3).map((day) => (
                        <div
                          key={day.day_number}
                          className="p-3 rounded-xl bg-stone-50 dark:bg-slate-700/50 border border-stone-200/60 dark:border-slate-600 flex items-start gap-3"
                        >
                          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            D{day.day_number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-slate-800 dark:text-white block truncate">
                              {day.theme}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                              {day.activities.map((a) => a.title).join(' • ')}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                            {previewTrip.currency} {day.estimated_daily_cost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Includes meals, admissions, and verified transit routes.
                    </span>
                    <button
                      onClick={() => viewTripById(previewTrip.id)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Open Full Interactive Itinerary</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-[#0B1329] border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400">
              Loved by Travelers Worldwide
            </span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Real Adventures, Less Planning Stress
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                "We used TripGenius for our 4-day trip to Jaipur. It clustered our morning forts together so we didn't spend hours stuck in traffic. The budget breakdown matched our actual expenses almost to the dollar!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Sarah Chen"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Sarah Chen</h6>
                  <span className="text-[11px] text-slate-500">Solo Traveler • Singapore</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                "The single-day regeneration was a lifesaver when rain hit our hiking day in Interlaken. With one click, it swapped the peak hike for underground glacier falls and thermal baths without messing up the rest of the week."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Marcus Weber"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Weber</h6>
                  <span className="text-[11px] text-slate-500">Group Organizer • Berlin</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                "Our Amalfi anniversary trip was pure magic. The pacing was relaxed, romantic dinner recommendations were spot on, and being able to print the clean PDF made packing so simple."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Elena & David"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Elena & David</h6>
                  <span className="text-[11px] text-slate-500">Couple Vacation • Toronto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-teal-900 via-slate-900 to-[#0B1329] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Plan Your Next Unforgettable Journey?
          </h2>
          <p className="text-base sm:text-lg text-teal-100 max-w-xl mx-auto">
            Design complete, intelligent travel itineraries personalized to your budget, style, and travel party in seconds.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('plan')}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <span>Build My Custom Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition"
            >
              Explore Destinations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
