from typing import Dict, Any, List
from backend.app.schemas.trip import ItinerarySchema

class ItineraryService:
    @staticmethod
    def recalculate_budget(itinerary: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recalculates all day totals and updates the main budget object.
        Activity costs + meal costs are summed up.
        """
        total_activities = 0.0
        total_food = 0.0

        for day in itinerary.get("days", []):
            day_cost = 0.0
            for act in day.get("activities", []):
                cost = float(act.get("estimated_cost", 0.0) or 0.0)
                total_activities += cost
                day_cost += cost

            for meal in day.get("meals", []):
                cost = float(meal.get("estimated_cost", 0.0) or 0.0)
                total_food += cost
                day_cost += cost

            day["estimated_daily_cost"] = round(day_cost, 2)

        budget = itinerary.get("budget", {})
        budget["activities"] = round(total_activities, 2)
        budget["food"] = round(total_food, 2)

        transportation = float(budget.get("transportation", 0.0) or 0.0)
        accommodation = float(budget.get("accommodation", 0.0) or 0.0)
        local_transport = float(budget.get("local_transport", 0.0) or 0.0)
        misc = float(budget.get("miscellaneous", 0.0) or 0.0)

        budget["estimated_total"] = round(
            transportation + accommodation + local_transport + misc + total_activities + total_food,
            2
        )
        itinerary["budget"] = budget
        return itinerary

    @staticmethod
    def replace_day(itinerary: Dict[str, Any], day_number: int, new_day: Dict[str, Any]) -> Dict[str, Any]:
        """
        Replaces the day with day_number with new_day and recalculates budget.
        """
        days = itinerary.get("days", [])
        updated_days = []
        replaced = False

        for d in days:
            if d.get("day_number") == day_number:
                new_day["day_number"] = day_number
                updated_days.append(new_day)
                replaced = True
            else:
                updated_days.append(d)

        if not replaced:
            updated_days.append(new_day)

        # Sort days by day_number
        updated_days.sort(key=lambda x: x.get("day_number", 0))
        itinerary["days"] = updated_days

        return ItineraryService.recalculate_budget(itinerary)
