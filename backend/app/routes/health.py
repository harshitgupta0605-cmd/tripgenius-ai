from fastapi import APIRouter
from backend.app.config import settings
from backend.app.database import get_supabase

router = APIRouter(prefix="/api/health", tags=["health"])

@router.get("")
async def health_check():
    supabase_connected = get_supabase() is not None
    gemini_configured = bool(settings.GEMINI_API_KEY)

    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "services": {
            "gemini": {
                "configured": gemini_configured,
                "model": settings.GEMINI_MODEL
            },
            "supabase": {
                "configured": supabase_connected
            }
        }
    }
