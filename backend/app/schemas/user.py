from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

class ProfileSchema(BaseModel):
    id: str
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    preferred_currency: str = "USD"
    preferences: Dict[str, Any] = {}

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_currency: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class SavedPlaceSchema(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    trip_id: Optional[str] = None
    name: str
    destination: str
    category: str = "attraction"
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None
