import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TripPreferences, TripType, DailyPace, BudgetTier, TripRecord } from '../../types/trip';
import confetti from 'canvas-confetti';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Heart,
  Plane,
  Train,
  Car,
  Bus,
  Loader2,
  Check,
  ShieldCheck,
  Building,
  Utensils
} from 'lucide-react';

const INTEREST_OPTIONS = [
  'Nature and scenic views',
  'Adventure and outdoor activities',
  'Historical places',
  'Culture and museums',
  'Food and local cuisine',
  'Shopping',
  'Nightlife',
  'Beaches',
  'Photography',
  'Spiritual destinations',
  'Relaxation and wellness',
  'Hidden gems'
];

export const TripBuilder: React.FC = () => {
  const {
    currency: defaultCurrency,
    saveNewTrip,
    prefillDestination,
    showNotification
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [destination, setDestination] = useState<string>(prefillDestination || 'Jaipur, India');
  const [origin, setOrigin] = useState<string>('Delhi, India');
  const [startDate, setStartDate] = useState<string>('2026-11-12');
  const [endDate, setEndDate] = useState<string>('2026-11-15');
  const [travelers, setTravelers] = useState<number>(2);
  const [tripType, setTripType] = useState<TripType>('couple');
  const [travelMode, setTravelMode] = useState<string>('flight');

  // Budget
  const [currency, setCurrency] = useState<string>(defaultCurrency || 'USD');
  const [totalBudget, setTotalBudget] = useState<number>(1200);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('standard');
  const [budgetIncludes, setBudgetIncludes] = useState<string[]>([
    'accommodation',
    'food',
    'activities',
    'local_transport'
  ]);

  // Interests & Preferences
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Historical places',
    'Food and local cuisine',
    'Culture and museums',
    'Photography'
  ]);
  const [dailyPace, setDailyPace] = useState<DailyPace>('balanced');
  const [accommodationPreference, setAccommodationPreference] = useState<string>('Boutique heritage hotel or stylish Airbnb');
  const [foodPreferences, setFoodPreferences] = useState<string>('Authentic local dining & street food delicacies');
  const [wakeUpTime, setWakeUpTime] = useState<string>('08:30');
  const [accessibilityReqs, setAccessibilityReqs] = useState<string>('');
  const [mustVisitPlaces, setMustVisitPlaces] = useState<string>('Amber Fort, Hawa Mahal');
  const [placesToAvoid, setPlacesToAvoid] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('Please recommend scenic sunset photo spots.');

  useEffect(() => {
    if (prefillDestination) {
      setDestination(prefillDestination);
    }
  }, [prefillDestination]);

  // Toggle interest
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Toggle budget inclusion
  const toggleBudgetInclude = (item: string) => {
    if (budgetIncludes.includes(item)) {
      setBudgetIncludes(budgetIncludes.filter((i) => i !== item));
    } else {
      setBudgetIncludes([...budgetIncludes, item]);
    }
  };

  // Preset budget click
  const handleBudgetPreset = (tier: BudgetTier) => {
    setBudgetTier(tier);
    const multiplier = travelers;
    if (tier === 'budget-friendly') setTotalBudget(400 * multiplier);
    else if (tier === 'standard') setTotalBudget(800 * multiplier);
    else if (tier === 'premium') setTotalBudget(1500 * multiplier);
    else if (tier === 'luxury') setTotalBudget(2800 * multiplier);
  };

  // Validate current step
  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!destination.trim()) {
        setErrorMsg('Please specify your destination.');
        return;
      }
      if (!startDate || !endDate) {
        setErrorMsg('Please pick departure and return dates.');
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        setErrorMsg('Departure date must be before return date.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (totalBudget <= 0) {
        setErrorMsg('Please enter a valid total budget greater than 0.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
      startAIGeneration();
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (step > 1 && !isGenerating) {
      setStep(step - 1);
    }
  };

  // Start Generation Call
  const startAIGeneration = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    const stages = [
      'Reading and validating submitted trip constraints...',
      'Prompting Gemini 3.8 Flash model with geographic instructions...',
      'Clustering attractions by regional proximity to prevent backtracking...',
      'Synthesizing authentic local dining and rest breaks...',
      'Calculating exact budget allocations and per-person estimates...',
      'Finalizing your customized day-by-day travel itinerary...'
    ];

    let stageIdx = 0;
    setGenerationPhase(stages[0]);
    const timer = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setGenerationPhase(stages[stageIdx]);
      }
    }, 1200);

    const payload: TripPreferences = {
      destination: destination.trim(),
      origin: origin.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      travelers,
      trip_type: tripType,
      travel_mode: travelMode,
      currency,
      total_budget: totalBudget,
      budget_tier: budgetTier,
      budget_includes: budgetIncludes,
      interests: selectedInterests,
      daily_pace: dailyPace,
      accommodation_preference: accommodationPreference,
      food_preferences: foodPreferences,
      wake_up_time: wakeUpTime,
      accessibility_requirements: accessibilityReqs || undefined,
      must_visit_places: mustVisitPlaces || undefined,
      places_to_avoid: placesToAvoid || undefined,
      additional_notes: additionalNotes || undefined
    };

    try {
      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearInterval(timer);

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.itinerary) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      const newTripRecord: TripRecord = {
        id: data.trip_id || 'trip-' + Date.now(),
        title: data.itinerary.trip_title || `Trip to ${destination}`,
        destination: destination,
        origin: origin,
        start_date: startDate,
        end_date: endDate,
        travelers: travelers,
        trip_type: tripType,
        budget: totalBudget,
        currency: currency,
        preferences: payload,
        itinerary_json: data.itinerary,
        status: 'upcoming',
        cover_image: getDestinationCover(destination),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      saveNewTrip(newTripRecord);
    } catch (err: any) {
      clearInterval(timer);
      console.error('Generation error:', err);
      setIsGenerating(false);
      setErrorMsg(err.message || 'Generation failed. Please try again.');
      setStep(3);
    }
  };

  const getDestinationCover = (destName: string) => {
    const d = destName.toLowerCase();
    if (d.includes('jaipur')) return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80';
    if (d.includes('kyoto')) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';
    if (d.includes('amalfi') || d.includes('positano')) return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80';
    if (d.includes('barcelona')) return 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80';
    if (d.includes('bali')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80';
    if (d.includes('swiss') || d.includes('interlaken')) return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80';
    if (d.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
  };

  const perPersonCost = Math.round(totalBudget / Math.max(1, travelers));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
          <span className={step >= 1 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
            1. Destination & Dates
          </span>
          <span className={step >= 2 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
            2. Budget & Style
          </span>
          <span className={step >= 3 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
            3. Interests & Pace
          </span>
          <span className={step >= 4 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
            4. AI Generation
          </span>
        </div>

        <div className="h-2 w-full bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Destination and Dates */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Where & When Are You Traveling?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Provide basic travel parameters. We'll use this to optimize the day count and route geography.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> Destination City or Region *
              </label>
              <input
                type="text"
                placeholder="e.g. Kyoto, Japan or Jaipur, India"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Starting Location (Origin)
              </label>
              <input
                type="text"
                placeholder="e.g. Home city or airport"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> Departure Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> Return Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Travelers & Trip Type */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-slate-700/80">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-600" /> Travel Party Type & Size
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: 'solo', label: 'Solo (1)' },
                { type: 'couple', label: 'Couple (2)' },
                { type: 'family', label: 'Family (3+)' },
                { type: 'friends', label: 'Friends (Group)' },
                { type: 'business', label: 'Business' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => {
                    setTripType(item.type as TripType);
                    if (item.type === 'solo') setTravelers(1);
                    if (item.type === 'couple') setTravelers(2);
                    if (item.type === 'family') setTravelers(3);
                    if (item.type === 'friends') setTravelers(4);
                  }}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                    tripType === item.type
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500'
                      : 'border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Total Travelers:</span>
              <div className="flex items-center border border-stone-200 dark:border-slate-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white">
                  {travelers}
                </span>
                <button
                  type="button"
                  onClick={() => setTravelers(travelers + 1)}
                  className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Travel Mode */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-slate-700/80">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Primary Travel Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'flight', label: 'Flight', icon: <Plane className="w-4 h-4 mx-auto mb-1 text-teal-600" /> },
                { id: 'train', label: 'Train', icon: <Train className="w-4 h-4 mx-auto mb-1 text-teal-600" /> },
                { id: 'car', label: 'Car / Road', icon: <Car className="w-4 h-4 mx-auto mb-1 text-teal-600" /> },
                { id: 'bus', label: 'Bus', icon: <Bus className="w-4 h-4 mx-auto mb-1 text-teal-600" /> },
                { id: 'flexible', label: 'Flexible', icon: <Compass className="w-4 h-4 mx-auto mb-1 text-teal-600" /> }
              ].map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setTravelMode(mode.id)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition ${
                    travelMode === mode.id
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500'
                      : 'border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Budget */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Budget & Spending Preferences
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your currency and total budget. We'll calibrate activities, dining, and accommodations to match.
            </p>
          </div>

          {/* Budget Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Budget Category Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { tier: 'budget-friendly', label: 'Budget-Friendly', desc: 'Hostels, public transit, street food' },
                { tier: 'standard', label: 'Standard', desc: 'Mid-range hotels, local cafes, popular tours' },
                { tier: 'premium', label: 'Premium', desc: 'Boutique stays, fine dining, private transfers' },
                { tier: 'luxury', label: 'Luxury', desc: '5-star resorts, private guides, Michelin dining' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.tier}
                  onClick={() => handleBudgetPreset(item.tier as BudgetTier)}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    budgetTier === item.tier
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-1 ring-teal-500'
                      : 'border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-white block">{item.label}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Total Budget Input with Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CHF">CHF (Fr)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Total Budget ({currency}) *</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">
                  ~{currency} {perPersonCost.toLocaleString()} / person
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Budget Inclusions Checklist */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-slate-700/80">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              What should this budget cover? (Check all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'accommodation', label: 'Accommodation (Hotels / Stays)' },
                { id: 'food', label: 'Food & Dining (Meals, Cafes & Drinks)' },
                { id: 'activities', label: 'Activities & Sightseeing Entry' },
                { id: 'local_transport', label: 'Local Transit (Metros, Taxis)' },
                { id: 'transportation', label: 'Flights / Long-Distance Transit' }
              ].map((item) => {
                const isChecked = budgetIncludes.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleBudgetInclude(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition ${
                      isChecked
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200'
                        : 'border-stone-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-stone-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Interests & Pace */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Interests, Pacing & Specific Wishes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tell the AI what makes you tick so it can select attractions and restaurants you will love.
            </p>
          </div>

          {/* Interests Pills */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Select Traveler Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-600'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Pace */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-slate-700/80">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> Preferred Daily Pace
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { pace: 'relaxed', label: 'Relaxed', desc: '2-3 key stops, long meals, downtime' },
                { pace: 'balanced', label: 'Balanced', desc: '3-4 activities with reasonable transit' },
                { pace: 'packed', label: 'Packed', desc: '5+ sites, see as much as humanly possible' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.pace}
                  onClick={() => setDailyPace(item.pace as DailyPace)}
                  className={`p-3 rounded-xl border text-center text-xs transition ${
                    dailyPace === item.pace
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-1 ring-teal-500 font-bold text-teal-800 dark:text-teal-200'
                      : 'border-stone-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="block font-bold">{item.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Accommodation & Food Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-slate-700/80">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-600" /> Accommodation Preference
              </label>
              <input
                type="text"
                placeholder="e.g. Central boutique hotel, Airbnb with kitchen"
                value={accommodationPreference}
                onChange={(e) => setAccommodationPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-teal-600" /> Food Preferences / Dietary Restrictions
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, local seafood, avoid nuts"
                value={foodPreferences}
                onChange={(e) => setFoodPreferences(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Must-Visit Places
              </label>
              <input
                type="text"
                placeholder="e.g. Amber Fort, local spice market"
                value={mustVisitPlaces}
                onChange={(e) => setMustVisitPlaces(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Places to Avoid
              </label>
              <input
                type="text"
                placeholder="e.g. Overly crowded tourist traps, steep hill hikes"
                value={placesToAvoid}
                onChange={(e) => setPlacesToAvoid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Additional Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Any other specific wishes or details you want Gemini to take into consideration..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Live Generation Animation */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-stone-200 dark:border-slate-700 p-8 sm:p-12 text-center space-y-6 shadow-lg">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              TripGenius AI is Crafting Your Itinerary
            </h3>
            <p className="text-sm font-medium text-teal-600 dark:text-teal-400 animate-pulse">
              {generationPhase || 'Analyzing travel requirements and destination map...'}
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-stone-50 dark:bg-slate-700/50 border border-stone-200/80 dark:border-slate-600 text-left text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Destination: {destination} ({startDate} to {endDate})</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Target Budget: {currency} {totalBudget.toLocaleString()} ({budgetTier})</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Travelers: {travelers} ({tripType}) • Pace: {dailyPace}</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin shrink-0" />
              <span>Clustering points of interest to reduce transit time...</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav Buttons */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition hover:scale-105"
          >
            <span>{step === 3 ? 'Generate Itinerary' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
