export type TripType = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type DailyPace = 'relaxed' | 'balanced' | 'packed';
export type BudgetTier = 'budget-friendly' | 'standard' | 'premium' | 'luxury';
export type ActivityCategory = 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'nightlife' | 'nature' | 'beaches';

export interface Activity {
  id?: string;
  time: string;
  title: string;
  description: string;
  category: ActivityCategory;
  estimated_duration_minutes: number;
  estimated_cost: number;
  currency: string;
  location_name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  travel_time_from_previous_minutes?: number | null;
  booking_required?: boolean | null;
  source_url?: string | null;
  custom_notes?: string;
}

export interface MealSuggestion {
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  restaurant_or_area: string;
  cuisine: string;
  estimated_cost: number;
  currency: string;
  dietary_friendly?: string[];
}

export interface DayPlan {
  day_number: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: MealSuggestion[];
  estimated_daily_cost: number;
  travel_tips: string[];
}

export interface BudgetBreakdown {
  total_budget: number;
  estimated_total: number;
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  local_transport: number;
  miscellaneous: number;
}

export interface AccommodationSuggestion {
  area_name: string;
  why_recommended: string;
  suggested_property_types: string[];
  estimated_nightly_rate: number;
  currency: string;
}

export interface Itinerary {
  trip_title: string;
  destination: string;
  summary: string;
  travel_dates: {
    start_date: string;
    end_date: string;
  };
  travelers: number;
  currency: string;
  budget: BudgetBreakdown;
  days: DayPlan[];
  accommodation_suggestions: AccommodationSuggestion[];
  transportation_tips: string[];
  packing_checklist: string[];
  important_notes: string[];
  budget_assumptions: string[];
}

export interface TripPreferences {
  destination: string;
  origin?: string;
  start_date: string;
  end_date: string;
  travelers: number;
  trip_type: TripType;
  travel_mode?: string;
  currency: string;
  total_budget: number;
  budget_tier?: BudgetTier;
  budget_includes: string[];
  interests: string[];
  daily_pace: DailyPace;
  accommodation_preference?: string;
  food_preferences?: string;
  wake_up_time?: string;
  accessibility_requirements?: string;
  must_visit_places?: string;
  places_to_avoid?: string;
  additional_notes?: string;
}

export interface TripRecord {
  id: string;
  user_id?: string;
  title: string;
  destination: string;
  origin?: string;
  start_date: string;
  end_date: string;
  travelers: number;
  trip_type: TripType;
  budget: number;
  currency: string;
  preferences: Partial<TripPreferences>;
  itinerary_json: Itinerary;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed';
  is_public?: boolean;
  share_token?: string;
  cover_image?: string;
  is_sample?: boolean;
  scenario_tag?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedPlace {
  id: string;
  user_id?: string;
  trip_id?: string;
  name: string;
  destination: string;
  category: string;
  notes?: string;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number;
  image_url?: string;
  created_at: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  category: 'adventure' | 'romantic' | 'cultural' | 'nature' | 'beaches' | 'budget';
  tagline: string;
  description: string;
  image_url: string;
  main_attractions: string[];
  best_time_to_visit: string;
  indicative_budget_range: string;
  suggested_duration_days: number;
  popularity_score: number;
  currency: string;
}
