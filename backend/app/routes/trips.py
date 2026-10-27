import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from backend.app.schemas.trip import (
    TripGenerateRequest,
    TripSaveRequest,
    RegenerateDayRequest,
    ItinerarySchema
)
from backend.app.services.gemini_service import GeminiService
from backend.app.services.itinerary_service import ItineraryService
from backend.app.database import get_supabase

router = APIRouter(prefix="/api/trips", tags=["trips"])
gemini_service = GeminiService()

# In-memory storage fallback for standalone FastAPI development/testing
in_memory_trips = {}

def get_current_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """
    Extracts and verifies Supabase JWT if present.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split("Bearer ")[1]
    supabase = get_supabase()
    if supabase:
        try:
            user = supabase.auth.get_user(token)
            if user and user.user:
                return user.user.id
        except Exception:
            return None
    return "demo-user-id"

@router.post("/generate")
async def generate_itinerary(req: TripGenerateRequest, auth_user: Optional[str] = Depends(get_current_user_id)):
    """
    Generate an AI itinerary using Gemini based on trip preferences.
    """
    try:
        itinerary_data = gemini_service.generate_itinerary(req)
        # Recalculate and guarantee consistency
        itinerary_data = ItineraryService.recalculate_budget(itinerary_data)

        # Save to database if authenticated and Supabase configured
        trip_id = str(uuid.uuid4())
        supabase = get_supabase()

        if supabase and auth_user and auth_user != "demo-user-id":
            try:
                res = supabase.table("trips").insert({
                    "id": trip_id,
                    "user_id": auth_user,
                    "title": itinerary_data.get("trip_title", f"Trip to {req.destination}"),
                    "destination": req.destination,
                    "origin": req.origin,
                    "start_date": req.start_date,
                    "end_date": req.end_date,
                    "travelers": req.travelers,
                    "trip_type": req.trip_type,
                    "budget": req.total_budget,
                    "currency": req.currency,
                    "preferences": req.model_dump(),
                    "itinerary_json": itinerary_data,
                    "status": "upcoming"
                }).execute()
            except Exception as db_err:
                print(f"[Supabase Save Warning] {db_err}")
                in_memory_trips[trip_id] = {
                    "id": trip_id,
                    "itinerary_json": itinerary_data,
                    "destination": req.destination,
                    "user_id": auth_user
                }
        else:
            in_memory_trips[trip_id] = {
                "id": trip_id,
                "itinerary_json": itinerary_data,
                "destination": req.destination,
                "user_id": auth_user or "guest"
            }

        return {
            "success": True,
            "trip_id": trip_id,
            "itinerary": itinerary_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{trip_id}/regenerate-day")
async def regenerate_trip_day(
    trip_id: str,
    req: RegenerateDayRequest,
    auth_user: Optional[str] = Depends(get_current_user_id)
):
    """
    Regenerates a single day while preserving the rest of the itinerary and recalculating the budget.
    """
    supabase = get_supabase()
    itinerary = None

    if supabase and auth_user and auth_user != "demo-user-id":
        try:
            res = supabase.table("trips").select("itinerary_json").eq("id", trip_id).execute()
            if res.data and len(res.data) > 0:
                itinerary = res.data[0]["itinerary_json"]
        except Exception:
            pass

    if not itinerary and trip_id in in_memory_trips:
        itinerary = in_memory_trips[trip_id].get("itinerary_json")

    if not itinerary:
        raise HTTPException(status_code=404, detail="Trip not found")

    try:
        new_day = gemini_service.regenerate_single_day(itinerary, req)
        updated_itinerary = ItineraryService.replace_day(itinerary, req.day_number, new_day)

        # Update in database/memory
        if supabase and auth_user and auth_user != "demo-user-id":
            try:
                supabase.table("trips").update({"itinerary_json": updated_itinerary}).eq("id", trip_id).execute()
            except Exception:
                pass
        
        if trip_id in in_memory_trips:
            in_memory_trips[trip_id]["itinerary_json"] = updated_itinerary

        return {
            "success": True,
            "day_number": req.day_number,
            "updated_day": new_day,
            "itinerary": updated_itinerary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def list_trips(auth_user: Optional[str] = Depends(get_current_user_id)):
    supabase = get_supabase()
    if supabase and auth_user and auth_user != "demo-user-id":
        res = supabase.table("trips").select("*").eq("user_id", auth_user).order("created_at", desc=True).execute()
        return {"trips": res.data or []}
    
    return {"trips": list(in_memory_trips.values())}

@router.get("/{trip_id}")
async def get_trip(trip_id: str, auth_user: Optional[str] = Depends(get_current_user_id)):
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("trips").select("*").eq("id", trip_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

    if trip_id in in_memory_trips:
        return in_memory_trips[trip_id]

    raise HTTPException(status_code=404, detail="Trip not found")

@router.put("/{trip_id}")
async def update_trip(trip_id: str, req: TripSaveRequest, auth_user: Optional[str] = Depends(get_current_user_id)):
    supabase = get_supabase()
    if supabase and auth_user and auth_user != "demo-user-id":
        try:
            res = supabase.table("trips").update(req.model_dump()).eq("id", trip_id).execute()
            return {"success": True, "trip": res.data}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    in_memory_trips[trip_id] = {
        "id": trip_id,
        **req.model_dump()
    }
    return {"success": True, "trip": in_memory_trips[trip_id]}

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, auth_user: Optional[str] = Depends(get_current_user_id)):
    supabase = get_supabase()
    if supabase and auth_user and auth_user != "demo-user-id":
        try:
            supabase.table("trips").delete().eq("id", trip_id).execute()
            return {"success": True}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    if trip_id in in_memory_trips:
        del in_memory_trips[trip_id]
        return {"success": True}

    raise HTTPException(status_code=404, detail="Trip not found")
