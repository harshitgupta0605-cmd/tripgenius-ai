import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.routes import health, trips, destinations

app = FastAPI(
    title="TripGenius AI Backend",
    description="FastAPI service for personalized AI travel itinerary planning with Gemini & Supabase",
    version="1.0.0"
)

# CORS configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(health.router)
app.include_router(trips.router)
app.include_router(destinations.router)

@app.get("/")
async def root():
    return {
        "message": "TripGenius AI API is active",
        "docs_url": "/docs",
        "health_url": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
