from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ActivitySchema(BaseModel):
    time: str = Field(..., description="Start time in HH:MM format (24hr)")
    title: str = Field(..., description="Title of the activity")
    description: str = Field(..., description="Rich description with tips and highlights")
    category: str = Field("sightseeing", description="Category: sightseeing, food, adventure, culture, relaxation, shopping")
    estimated_duration_minutes: int = Field(90, description="Approximate duration in minutes")
    estimated_cost: float = Field(0.0, description="Estimated cost in trip currency")
    currency: str = Field("USD", description="Currency symbol/code")
    location_name: str = Field(..., description="Name of the place or venue")
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    travel_time_from_previous_minutes: Optional[int] = None
    booking_required: Optional[bool] = False
    source_url: Optional[str] = None

class MealSuggestion(BaseModel):
    meal_type: str = Field(..., description="breakfast, lunch, or dinner")
    restaurant_or_area: str = Field(..., description="Recommended spot or dining district")
    cuisine: str = Field(..., description="Cuisine type")
    estimated_cost: float = Field(..., description="Estimated cost")
    currency: str = Field("USD")
    dietary_friendly: List[str] = []

class DaySchema(BaseModel):
    day_number: int
    date: str
    theme: str
    activities: List[ActivitySchema] = []
    meals: List[MealSuggestion] = []
    estimated_daily_cost: float = 0.0
    travel_tips: List[str] = []

class BudgetBreakdown(BaseModel):
    total_budget: float
    estimated_total: float
    transportation: float = 0.0
    accommodation: float = 0.0
    food: float = 0.0
    activities: float = 0.0
    local_transport: float = 0.0
    miscellaneous: float = 0.0

class AccommodationSuggestion(BaseModel):
    area_name: str
    why_recommended: str
    suggested_property_types: List[str]
    estimated_nightly_rate: float
    currency: str

class ItinerarySchema(BaseModel):
    trip_title: str
    destination: str
    summary: str
    travel_dates: Dict[str, str]
    travelers: int = 1
    currency: str = "USD"
    budget: BudgetBreakdown
    days: List[DaySchema]
    accommodation_suggestions: List[AccommodationSuggestion] = []
    transportation_tips: List[str] = []
    packing_checklist: List[str] = []
    important_notes: List[str] = []
    budget_assumptions: List[str] = []

class TripGenerateRequest(BaseModel):
    destination: str
    origin: Optional[str] = "Flexible"
    start_date: str
    end_date: str
    travelers: int = 1
    trip_type: str = "solo" # solo, couple, family, friends, business
    travel_mode: Optional[str] = "flight"
    currency: str = "USD"
    total_budget: float = 1500.0
    budget_tier: Optional[str] = "standard" # budget-friendly, standard, premium, luxury
    budget_includes: List[str] = ["accommodation", "food", "activities", "local_transport"]
    interests: List[str] = []
    daily_pace: str = "balanced" # relaxed, balanced, packed
    accommodation_preference: Optional[str] = "Boutique hotel / Airbnb"
    food_preferences: Optional[str] = "Local specialties"
    wake_up_time: Optional[str] = "08:30"
    accessibility_requirements: Optional[str] = None
    must_visit_places: Optional[str] = None
    places_to_avoid: Optional[str] = None
    additional_notes: Optional[str] = None

class TripSaveRequest(BaseModel):
    title: str
    destination: str
    origin: Optional[str] = None
    start_date: str
    end_date: str
    travelers: int = 1
    trip_type: str = "solo"
    budget: float = 0.0
    currency: str = "USD"
    preferences: Dict[str, Any] = {}
    itinerary_json: ItinerarySchema
    status: Optional[str] = "upcoming"
    is_public: Optional[bool] = False

class RegenerateDayRequest(BaseModel):
    day_number: int
    focus_notes: Optional[str] = "Provide fresh alternative activities matching pace and budget"
    exclude_places: Optional[List[str]] = []
