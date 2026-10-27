import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from backend.app.config import settings
from backend.app.schemas.trip import TripGenerateRequest, ItinerarySchema, RegenerateDayRequest
from backend.app.services.places_service import PlacesService

logger = logging.getLogger("TripGenius.Gemini")

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(
                    api_key=self.api_key,
                    http_options={'headers': {'User-Agent': 'aistudio-build'}}
                )
            except Exception as e:
                logger.error(f"Failed to initialize Google GenAI client: {e}")

    def build_generation_prompt(self, req: TripGenerateRequest) -> str:
        # Calculate number of days
        try:
            d1 = datetime.strptime(req.start_date, "%Y-%m-%d")
            d2 = datetime.strptime(req.end_date, "%Y-%m-%d")
            num_days = max(1, (d2 - d1).days + 1)
        except Exception:
            num_days = 3

        prompt = f"""
You are an expert personalized travel itinerary planner for "TripGenius AI".
Generate a realistic, comprehensive, and logically ordered day-by-day travel itinerary in pure JSON format (matching the target schema exactly).

TRIP PARAMETERS:
- Destination: {req.destination}
- Origin: {req.origin or 'Not specified'}
- Start Date: {req.start_date}
- End Date: {req.end_date} (Duration: {num_days} full days)
- Travelers: {req.travelers} ({req.trip_type})
- Primary Travel Mode: {req.travel_mode}
- Total Budget: {req.currency} {req.total_budget} (Budget Tier: {req.budget_tier})
- Budget Covers: {', '.join(req.budget_includes)}
- Traveler Interests: {', '.join(req.interests) if req.interests else 'General cultural sightseeing, local food, viewpoints'}
- Daily Pace: {req.daily_pace} (relaxed = 2-3 activities/day; balanced = 3-4 activities/day; packed = 5+ activities/day)
- Preferred Wake-up Time: {req.wake_up_time or '08:30'}
- Accommodation Preference: {req.accommodation_preference or 'Mid-range boutique / central'}
- Food & Dietary Preferences: {req.food_preferences or 'Local traditional specialties'}
- Accessibility Requirements: {req.accessibility_requirements or 'None'}
- Must-Visit Places: {req.must_visit_places or 'Top iconic attractions'}
- Places to Avoid: {req.places_to_avoid or 'None'}
- Additional Instructions: {req.additional_notes or 'None'}

STRICT PLANNING & GEOGRAPHIC RULES:
1. Days MUST strictly match from day 1 to day {num_days}.
2. Group geographically proximate attractions on the same day to eliminate backtracking.
3. Include realistic travel times between sequential activities.
4. Distinguish estimated prices from verified ticket costs. Do not invent fake opening hours or fake ticket booking URLs.
5. Provide specific, real places and attraction names (never generic placeholders like "Visit a Museum").
6. Provide distinct meal recommendations (breakfast, lunch, dinner) with realistic local dish suggestions and pricing.
7. Include accommodation area suggestions with rationale and estimated rates.
8. Include practical packing checklist, transport tips, and budget assumptions.

SCHEMA REQUIREMENT:
Respond with ONLY a valid JSON object without markdown fences or additional chatter. Schema:
{{
  "trip_title": "string",
  "destination": "{req.destination}",
  "summary": "string overview",
  "travel_dates": {{ "start_date": "{req.start_date}", "end_date": "{req.end_date}" }},
  "travelers": {req.travelers},
  "currency": "{req.currency}",
  "budget": {{
    "total_budget": {req.total_budget},
    "estimated_total": float,
    "transportation": float,
    "accommodation": float,
    "food": float,
    "activities": float,
    "local_transport": float,
    "miscellaneous": float
  }},
  "days": [
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "theme": "string day theme",
      "activities": [
        {{
          "time": "HH:MM",
          "title": "string",
          "description": "string",
          "category": "sightseeing|food|adventure|culture|relaxation|shopping",
          "estimated_duration_minutes": int,
          "estimated_cost": float,
          "currency": "{req.currency}",
          "location_name": "string",
          "address": "string or null",
          "latitude": float or null,
          "longitude": float or null,
          "travel_time_from_previous_minutes": int or null,
          "booking_required": bool,
          "source_url": null
        }}
      ],
      "meals": [
        {{
          "meal_type": "breakfast|lunch|dinner",
          "restaurant_or_area": "string",
          "cuisine": "string",
          "estimated_cost": float,
          "currency": "{req.currency}",
          "dietary_friendly": ["string"]
        }}
      ],
      "estimated_daily_cost": float,
      "travel_tips": ["string tip 1", "string tip 2"]
    }}
  ],
  "accommodation_suggestions": [
    {{
      "area_name": "string",
      "why_recommended": "string",
      "suggested_property_types": ["string"],
      "estimated_nightly_rate": float,
      "currency": "{req.currency}"
    }}
  ],
  "transportation_tips": ["string"],
  "packing_checklist": ["string"],
  "important_notes": ["string"],
  "budget_assumptions": ["string"]
}}
"""
        return prompt.strip()

    def generate_itinerary(self, req: TripGenerateRequest) -> Dict[str, Any]:
        if not self.client:
            raise RuntimeError("Gemini client is not configured. Please ensure GEMINI_API_KEY is provided.")

        prompt = self.build_generation_prompt(req)

        try:
            response = self.client.models.generateContent(
                model=self.model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": 0.4
                }
            )

            raw_text = response.text or ""
            # Strip markdown fences if present
            cleaned = raw_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            data = json.loads(cleaned)

            # Enrich coordinates where possible
            for day in data.get("days", []):
                for act in day.get("activities", []):
                    if not act.get("latitude") or not act.get("longitude"):
                        coords = PlacesService.get_coordinates(act.get("location_name", ""), req.destination)
                        if coords["lat"] and coords["lng"]:
                            act["latitude"] = coords["lat"]
                            act["longitude"] = coords["lng"]

            # Validate against Pydantic schema
            validated = ItinerarySchema(**data)
            return validated.model_dump()
        except json.JSONDecodeError as je:
            logger.error(f"JSON parsing error: {je}")
            raise ValueError(f"Failed to parse Gemini response as JSON: {je}")
        except Exception as e:
            logger.error(f"Error during itinerary generation: {e}")
            raise

    def regenerate_single_day(self, original_itinerary: Dict[str, Any], req: RegenerateDayRequest) -> Dict[str, Any]:
        if not self.client:
            raise RuntimeError("Gemini client is not configured.")

        dest = original_itinerary.get("destination", "Destination")
        currency = original_itinerary.get("currency", "USD")
        day_num = req.day_number

        # Locate existing day
        target_day = next((d for d in original_itinerary.get("days", []) if d.get("day_number") == day_num), None)
        date_str = target_day.get("date") if target_day else "Day " + str(day_num)

        prompt = f"""
You are an expert itinerary editor for "TripGenius AI".
Regenerate ONLY Day {day_num} for a trip to {dest}.
Travel date for this day: {date_str}.
Currency: {currency}.

User guidance for this day:
"{req.focus_notes}"
Excluded locations: {req.exclude_places or 'None'}

Provide an engaging, fresh sequence of 3-4 activities with meals and tips for this specific day.
Respond with pure JSON of a single day object matching this schema:
{{
  "day_number": {day_num},
  "date": "{date_str}",
  "theme": "string updated theme",
  "activities": [
    {{
      "time": "HH:MM",
      "title": "string",
      "description": "string",
      "category": "sightseeing|food|adventure|culture|relaxation",
      "estimated_duration_minutes": 90,
      "estimated_cost": float,
      "currency": "{currency}",
      "location_name": "string",
      "address": null,
      "latitude": null,
      "longitude": null,
      "travel_time_from_previous_minutes": 15,
      "booking_required": false,
      "source_url": null
    }}
  ],
  "meals": [
    {{
      "meal_type": "lunch",
      "restaurant_or_area": "string",
      "cuisine": "string",
      "estimated_cost": float,
      "currency": "{currency}",
      "dietary_friendly": []
    }}
  ],
  "estimated_daily_cost": float,
  "travel_tips": ["string"]
}}
"""
        response = self.client.models.generateContent(
            model=self.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.5
            }
        )
        cleaned = response.text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        new_day = json.loads(cleaned.strip())

        # Enrich coordinates
        for act in new_day.get("activities", []):
            coords = PlacesService.get_coordinates(act.get("location_name", ""), dest)
            if coords["lat"] and coords["lng"]:
                act["latitude"] = coords["lat"]
                act["longitude"] = coords["lng"]

        return new_day
