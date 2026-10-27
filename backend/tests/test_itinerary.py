import pytest
from backend.app.schemas.trip import ItinerarySchema, TripGenerateRequest
from backend.app.services.itinerary_service import ItineraryService

def test_budget_recalculation():
    sample_itinerary = {
        "trip_title": "Weekend in Jaipur",
        "destination": "Jaipur, India",
        "summary": "Royal heritage tour",
        "travel_dates": {"start_date": "2026-11-01", "end_date": "2026-11-02"},
        "travelers": 1,
        "currency": "USD",
        "budget": {
            "total_budget": 500,
            "estimated_total": 0,
            "transportation": 100,
            "accommodation": 150,
            "food": 0,
            "activities": 0,
            "local_transport": 30,
            "miscellaneous": 20
        },
        "days": [
            {
                "day_number": 1,
                "date": "2026-11-01",
                "theme": "Palaces",
                "activities": [
                    {"time": "09:00", "title": "Amber Fort", "description": "Fort", "category": "sightseeing", "estimated_cost": 25.0, "location_name": "Amber Fort"}
                ],
                "meals": [
                    {"meal_type": "lunch", "restaurant_or_area": "LMB", "cuisine": "Rajasthani", "estimated_cost": 15.0, "currency": "USD", "dietary_friendly": []}
                ],
                "estimated_daily_cost": 0
            }
        ]
    }

    updated = ItineraryService.recalculate_budget(sample_itinerary)
    assert updated["days"][0]["estimated_daily_cost"] == 40.0
    assert updated["budget"]["activities"] == 25.0
    assert updated["budget"]["food"] == 15.0
    # 100 + 150 + 30 + 20 + 25 + 15 = 340
    assert updated["budget"]["estimated_total"] == 340.0

def test_replace_day():
    sample_itinerary = {
        "trip_title": "Test Trip",
        "destination": "Tokyo",
        "summary": "Summary",
        "travel_dates": {"start_date": "2026-11-01", "end_date": "2026-11-02"},
        "currency": "USD",
        "budget": {
            "total_budget": 1000,
            "estimated_total": 0,
            "transportation": 0,
            "accommodation": 0,
            "food": 0,
            "activities": 0,
            "local_transport": 0,
            "miscellaneous": 0
        },
        "days": [
            {
                "day_number": 1,
                "date": "2026-11-01",
                "theme": "Old Day 1",
                "activities": [{"time": "10:00", "title": "Old Act", "description": "", "category": "sightseeing", "estimated_cost": 50, "location_name": "Old Place"}],
                "meals": []
            }
        ]
    }

    new_day = {
        "day_number": 1,
        "date": "2026-11-01",
        "theme": "New Day 1",
        "activities": [{"time": "11:00", "title": "New Act", "description": "", "category": "sightseeing", "estimated_cost": 80, "location_name": "New Place"}],
        "meals": []
    }

    result = ItineraryService.replace_day(sample_itinerary, 1, new_day)
    assert result["days"][0]["theme"] == "New Day 1"
    assert result["budget"]["activities"] == 80.0
