import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TripRecord, Activity, DayPlan, BudgetBreakdown } from '../../types/trip';
import { ItineraryMap } from './ItineraryMap';
import { BudgetPlanner } from './BudgetPlanner';
import { EditActivityModal } from './EditActivityModal';
import { RegenerateDayModal } from './RegenerateDayModal';
import { ShareModal } from './ShareModal';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  Plus,
  RefreshCw,
  Share2,
  Copy,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Bookmark,
  CheckCircle2,
  Layers,
  Building,
  CheckSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';

export const ItineraryView: React.FC = () => {
  const {
    activeTrip,
    updateTrip,
    setActiveTab,
    duplicateTrip,
    toggleSavePlace,
    isPlaceSaved,
    showNotification
  } = useApp();

  if (!activeTrip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">No active trip selected</h2>
        <button
          onClick={() => setActiveTab('my-trips')}
          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          Go to My Trips
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTabLocal] = useState<
    'itinerary' | 'map' | 'budget' | 'accommodations' | 'tips'
  >('itinerary');

  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [editingActivity, setEditingActivity] = useState<{
    activity: Activity;
    dayNumber: number;
    activityIndex: number;
  } | null>(null);

  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<string, boolean>>({});

  const itinerary = activeTrip.itinerary_json;

  const toggleDayAccordion = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const handleUpdateBudget = (newBudget: BudgetBreakdown) => {
    const updatedTrip: TripRecord = {
      ...activeTrip,
      itinerary_json: {
        ...itinerary,
        budget: newBudget
      },
      updated_at: new Date().toISOString()
    };
    updateTrip(updatedTrip);
  };

  // Reorder activity within day
  const handleMoveActivity = (dayNumber: number, activityIndex: number, direction: 'up' | 'down') => {
    const targetDay = itinerary.days.find((d) => d.day_number === dayNumber);
    if (!targetDay) return;

    const newIndex = direction === 'up' ? activityIndex - 1 : activityIndex + 1;
    if (newIndex < 0 || newIndex >= targetDay.activities.length) return;

    const newActivities = [...targetDay.activities];
    const temp = newActivities[activityIndex];
    newActivities[activityIndex] = newActivities[newIndex];
    newActivities[newIndex] = temp;

    const updatedDays = itinerary.days.map((d) =>
      d.day_number === dayNumber ? { ...d, activities: newActivities } : d
    );

    const updatedTrip: TripRecord = {
      ...activeTrip,
      itinerary_json: {
        ...itinerary,
        days: updatedDays
      },
      updated_at: new Date().toISOString()
    };
    updateTrip(updatedTrip);
  };

  // Delete activity
  const handleDeleteActivity = (dayNumber: number, activityIndex: number) => {
    const updatedDays = itinerary.days.map((d) => {
      if (d.day_number === dayNumber) {
        const remaining = d.activities.filter((_, idx) => idx !== activityIndex);
        const dayCost = remaining.reduce((acc, a) => acc + (Number(a.estimated_cost) || 0), 0);
        return { ...d, activities: remaining, estimated_daily_cost: dayCost };
      }
      return d;
    });

    const totalActCost = updatedDays.reduce(
      (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0),
      0
    );

    const updatedBudget = {
      ...itinerary.budget,
      activities: totalActCost,
      estimated_total: Math.round(
        (Number(itinerary.budget.transportation) || 0) +
        (Number(itinerary.budget.accommodation) || 0) +
        (Number(itinerary.budget.food) || 0) +
        (Number(itinerary.budget.local_transport) || 0) +
        (Number(itinerary.budget.miscellaneous) || 0) +
        totalActCost
      )
    };

    updateTrip({
      ...activeTrip,
      itinerary_json: {
        ...itinerary,
        days: updatedDays,
        budget: updatedBudget
      },
      updated_at: new Date().toISOString()
    });
    showNotification('info', 'Activity removed.');
  };

  // Save activity edit
  const handleSaveActivity = (updatedAct: Activity) => {
    if (!editingActivity) return;
    const { dayNumber, activityIndex } = editingActivity;

    const updatedDays = itinerary.days.map((d) => {
      if (d.day_number === dayNumber) {
        const acts = [...d.activities];
        acts[activityIndex] = updatedAct;
        const dayCost = acts.reduce((acc, a) => acc + (Number(a.estimated_cost) || 0), 0);
        return { ...d, activities: acts, estimated_daily_cost: dayCost };
      }
      return d;
    });

    const totalActCost = updatedDays.reduce(
      (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.estimated_cost) || 0), 0),
      0
    );

    const updatedBudget = {
      ...itinerary.budget,
      activities: totalActCost,
      estimated_total: Math.round(
        (Number(itinerary.budget.transportation) || 0) +
        (Number(itinerary.budget.accommodation) || 0) +
        (Number(itinerary.budget.food) || 0) +
        (Number(itinerary.budget.local_transport) || 0) +
        (Number(itinerary.budget.miscellaneous) || 0) +
        totalActCost
      )
    };

    updateTrip({
      ...activeTrip,
      itinerary_json: {
        ...itinerary,
        days: updatedDays,
        budget: updatedBudget
      },
      updated_at: new Date().toISOString()
    });
  };

  // Add new activity to day
  const handleAddActivity = (dayNumber: number) => {
    const newAct: Activity = {
      time: '14:00',
      title: 'New Activity / Scenic Walk',
      description: 'Explore neighborhood highlights or enjoy leisure time.',
      category: 'sightseeing',
      estimated_duration_minutes: 60,
      estimated_cost: 15,
      currency: activeTrip.currency,
      location_name: activeTrip.destination,
      travel_time_from_previous_minutes: 15
    };

    const targetDay = itinerary.days.find((d) => d.day_number === dayNumber);
    const newIndex = targetDay ? targetDay.activities.length : 0;

    const updatedDays = itinerary.days.map((d) => {
      if (d.day_number === dayNumber) {
        return { ...d, activities: [...d.activities, newAct] };
      }
      return d;
    });

    updateTrip({
      ...activeTrip,
      itinerary_json: {
        ...itinerary,
        days: updatedDays
      },
      updated_at: new Date().toISOString()
    });

    setEditingActivity({
      activity: newAct,
      dayNumber: dayNumber,
      activityIndex: newIndex
    });
  };

  const handleRegenerateSuccess = (updatedDay: any, fullItinerary: any) => {
    updateTrip({
      ...activeTrip,
      itinerary_json: fullItinerary,
      updated_at: new Date().toISOString()
    });
    showNotification('success', `Day ${updatedDay.day_number} successfully regenerated!`);
  };

  const toggleChecklistItem = (item: string) => {
    setCheckedChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setActiveTab('my-trips')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => duplicateTrip(activeTrip.id)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Export</span>
          </button>
        </div>
      </div>

      {/* Hero Cover Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 dark:border-slate-800 bg-slate-900 text-white min-h-[260px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={
            activeTrip.cover_image ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80'
          }
          alt={activeTrip.destination}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            {activeTrip.is_sample && (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/90 text-slate-950">
                {activeTrip.scenario_tag || 'Sample Template'}
              </span>
            )}
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/80 text-white capitalize">
              {activeTrip.trip_type} Trip • {activeTrip.travelers} Traveler{activeTrip.travelers > 1 ? 's' : ''}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
              {itinerary.days.length} Days Planned
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {itinerary.trip_title || activeTrip.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 leading-relaxed">
            {itinerary.summary}
          </p>

          <div className="flex items-center gap-6 pt-2 text-xs text-stone-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400" />
              {activeTrip.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-400" />
              {activeTrip.start_date} to {activeTrip.end_date}
            </span>
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Estimated Total: {activeTrip.currency} {itinerary.budget.estimated_total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 overflow-x-auto pb-1 no-print">
        {[
          { id: 'itinerary', label: 'Day-by-Day Timeline', count: itinerary.days.length },
          { id: 'map', label: 'Interactive Map' },
          { id: 'budget', label: 'Budget Planner' },
          { id: 'accommodations', label: 'Stay & Areas', count: itinerary.accommodation_suggestions?.length },
          { id: 'tips', label: 'Packing & Tips' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabLocal(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800 shadow-2xs'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Day-by-Day Timeline */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {itinerary.days.length} Complete Days Sequenced
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const allOpen = Object.keys(expandedDays).length === itinerary.days.length;
                  if (allOpen) setExpandedDays({});
                  else {
                    const all: Record<number, boolean> = {};
                    itinerary.days.forEach((d) => (all[d.day_number] = true));
                    setExpandedDays(all);
                  }
                }}
                className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                {Object.keys(expandedDays).length === itinerary.days.length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {itinerary.days.map((day) => {
              const isExpanded = Boolean(expandedDays[day.day_number]);
              return (
                <div
                  key={day.day_number}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-xs overflow-hidden transition"
                >
                  {/* Day Header Accordion Toggle */}
                  <div
                    onClick={() => toggleDayAccordion(day.day_number)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/60 dark:hover:bg-slate-700/30 transition select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        D{day.day_number}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {day.date}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                            {day.activities.length} stops
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {day.theme}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Day Cost
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                          {activeTrip.currency} {day.estimated_daily_cost || 0}
                        </span>
                      </div>

                      {/* Day Regeneration Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegeneratingDay(day.day_number);
                        }}
                        title={`Regenerate Day ${day.day_number} with AI`}
                        className="p-2 rounded-xl text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 transition flex items-center gap-1 text-xs font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Regenerate Day</span>
                      </button>

                      <div className="p-1 rounded-lg text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Day Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-stone-100 dark:border-slate-700/80 space-y-4">
                      {/* Activities Timeline */}
                      <div className="space-y-3">
                        {day.activities.map((act, actIdx) => (
                          <div
                            key={actIdx}
                            className="group p-4 rounded-xl bg-stone-50 dark:bg-slate-700/40 border border-stone-200/70 dark:border-slate-600 hover:border-teal-500/40 hover:bg-white dark:hover:bg-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-14 text-center shrink-0 pt-0.5">
                                <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 block">
                                  {act.time}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {act.estimated_duration_minutes}m
                                </span>
                              </div>

                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 capitalize">
                                    {act.category}
                                  </span>
                                  <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-teal-600" />
                                    {act.location_name}
                                  </span>
                                </div>

                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {act.title}
                                </h4>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {act.description}
                                </p>

                                {act.custom_notes && (
                                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 italic">
                                    Note: {act.custom_notes}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right side controls: Cost, bookmark, reorder, edit, delete */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-slate-600">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                                {act.currency || activeTrip.currency} {act.estimated_cost || 0}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    toggleSavePlace({
                                      name: act.location_name,
                                      destination: activeTrip.destination,
                                      category: act.category,
                                      latitude: act.latitude,
                                      longitude: act.longitude,
                                      notes: act.title
                                    })
                                  }
                                  title="Bookmark Place"
                                  className={`p-1 rounded-lg transition ${
                                    isPlaceSaved(act.location_name)
                                      ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/60'
                                      : 'text-slate-400 hover:text-teal-600'
                                  }`}
                                >
                                  <Bookmark className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleMoveActivity(day.day_number, actIdx, 'up')}
                                  disabled={actIdx === 0}
                                  title="Move Up"
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMoveActivity(day.day_number, actIdx, 'down')}
                                  disabled={actIdx === day.activities.length - 1}
                                  title="Move Down"
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() =>
                                    setEditingActivity({
                                      activity: act,
                                      dayNumber: day.day_number,
                                      activityIndex: actIdx
                                    })
                                  }
                                  title="Edit Activity"
                                  className="p-1 rounded-lg text-slate-400 hover:text-teal-600 transition"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteActivity(day.day_number, actIdx)}
                                  title="Delete Activity"
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Meals & Dining Suggestions for Day */}
                      {day.meals && day.meals.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                            Recommended Meals & Authentic Dining
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {day.meals.map((meal, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-100 dark:border-slate-700 text-xs"
                              >
                                <span className="font-bold text-slate-800 dark:text-white capitalize block">
                                  {meal.meal_type}: {meal.restaurant_or_area}
                                </span>
                                <span className="text-[11px] text-slate-500 block">{meal.cuisine}</span>
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-1">
                                  ~{activeTrip.currency} {meal.estimated_cost}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Day Travel Tips */}
                      {day.travel_tips && day.travel_tips.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Tips for this day:</span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {day.travel_tips.map((tip, tIdx) => (
                              <li key={tIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Add Activity Button */}
                      <button
                        onClick={() => handleAddActivity(day.day_number)}
                        className="w-full py-2 border-2 border-dashed border-stone-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 hover:border-teal-500/50 flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stop to Day {day.day_number}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Leaflet Map */}
      {activeTab === 'map' && (
        <ItineraryMap days={itinerary.days} destination={activeTrip.destination} />
      )}

      {/* TAB 3: Budget Planner */}
      {activeTab === 'budget' && (
        <BudgetPlanner
          budget={itinerary.budget}
          currency={activeTrip.currency}
          travelers={activeTrip.travelers}
          onUpdateBudget={handleUpdateBudget}
        />
      )}

      {/* TAB 4: Accommodations */}
      {activeTab === 'accommodations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itinerary.accommodation_suggestions?.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Recommended Stay Area
                </span>
                <span className="text-sm font-extrabold text-teal-600">
                  {activeTrip.currency} {item.estimated_nightly_rate} / night
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                <span>{item.area_name}</span>
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.why_recommended}
              </p>

              <div className="pt-2 border-t border-stone-100 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Suggested Property Types:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.suggested_property_types?.map((pt, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Packing & Travel Tips */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Packing Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-600" />
              <span>Interactive Packing Checklist</span>
            </h3>

            <div className="space-y-2">
              {itinerary.packing_checklist?.map((item, idx) => {
                const isChecked = Boolean(checkedChecklist[item]);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleChecklistItem(item)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border text-left text-xs transition ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 line-through'
                        : 'border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport & Important Notes */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Transit & Mobility Guidelines
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {itinerary.transportation_tips?.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Important Cultural & Budget Notes
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {itinerary.important_notes?.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Edit Activity Modal */}
      {editingActivity && (
        <EditActivityModal
          isOpen={true}
          activity={editingActivity.activity}
          dayNumber={editingActivity.dayNumber}
          currency={activeTrip.currency}
          onClose={() => setEditingActivity(null)}
          onSave={handleSaveActivity}
        />
      )}

      {/* Single Day Regeneration Modal */}
      {regeneratingDay !== null && (
        <RegenerateDayModal
          isOpen={true}
          tripId={activeTrip.id}
          dayNumber={regeneratingDay}
          destination={activeTrip.destination}
          onClose={() => setRegeneratingDay(null)}
          onSuccess={handleRegenerateSuccess}
        />
      )}

      {/* Share / Export Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={true}
          trip={activeTrip}
          onClose={() => setIsShareModalOpen(false)}
          onTogglePublic={(isPub) => {
            updateTrip({ ...activeTrip, is_public: isPub });
          }}
        />
      )}
    </div>
  );
};
