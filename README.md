# TripGenius AI — Personalized Travel Itinerary Planner

TripGenius AI is a modern full-stack web application that helps solo travelers, couples, families, and groups generate personalized day-by-day travel itineraries using Google Gemini AI, interactive maps, live budget calculations, and single-day regeneration.

---

## 🌟 Key Features

1. **Smart Multi-Step Trip Wizard**:
   - Destination, origin, exact travel dates, group size, and travel mode.
   - Comprehensive budget allocator (Budget-friendly, Standard, Premium, Luxury) with per-person estimates.
   - Selection of 12 traveler interests (Culture, Nature, Adventure, Local Food, Beaches, Hidden Gems, etc.).
   - Specific pacing (Relaxed, Balanced, Packed) and food preferences.

2. **AI Itinerary Engine (Google Gemini 3.8 Flash)**:
   - Server-side generation using the modern `@google/genai` TypeScript SDK.
   - Geographically clustered attractions to eliminate backtracking and minimize transit times.
   - Day-by-day timelines, morning/afternoon/evening activity cards, and meal suggestions.

3. **Interactive Itinerary & Budget Manager**:
   - Leaflet interactive map with pins, popups, and route sequence polylines.
   - Live budget breakdown with recalculations whenever activities or accommodations change.
   - Over-budget warning alert.

4. **Single-Day AI Regeneration**:
   - Regenerate any specific day (e.g. Day 2 due to bad weather) with custom focus instructions without modifying the rest of the trip.

5. **Export & Sharing**:
   - Print-ready and PDF download layout.
   - One-click formatted summary copy.
   - Secure shareable public links with privacy toggle.

6. **Full-Stack Architecture**:
   - **Express Dev Server (`server.ts`)**: Integrated server providing REST endpoints (`/api/trips/generate`, `/api/trips/:id/regenerate-day`, `/api/destinations`, etc.) with Vite middleware.
   - **Production Python FastAPI Service (`backend/`)**: Complete Python FastAPI application with Pydantic schemas, routes, and services ready for deployment on Render, Fly.io, or Cloud Run.
   - **Supabase Database (`supabase/migrations/001_initial_schema.sql`)**: PostgreSQL schema with Row-Level Security (RLS) for `profiles`, `trips`, and `saved_places`.

---

## 🛠️ Project Structure

```
├── backend/                         # Production Python FastAPI backend
│   ├── app/
│   │   ├── main.py                  # FastAPI application entry point
│   │   ├── config.py                # Pydantic BaseSettings configuration
│   │   ├── database.py              # Supabase database client
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   │   ├── trip.py
│   │   │   └── user.py
│   │   ├── routes/                  # API endpoints
│   │   │   ├── health.py
│   │   │   ├── trips.py
│   │   │   └── destinations.py
│   │   └── services/                # Gemini AI & Places services
│   │       ├── gemini_service.py
│   │       ├── itinerary_service.py
│   │       └── places_service.py
│   ├── tests/                       # Unit tests
│   │   └── test_itinerary.py
│   ├── requirements.txt             # Python dependencies
│   └── .env.example
├── server.ts                        # Full-stack Node/Express server for live preview
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Supabase tables and RLS policies
├── src/                             # React SPA Frontend
│   ├── components/                  # UI Components
│   │   ├── Dashboard.tsx
│   │   ├── LandingPage.tsx
│   │   ├── MyTrips.tsx
│   │   ├── ExploreDestinations.tsx
│   │   ├── SavedPlaces.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── AuthModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TripBuilder/
│   │   │   └── TripBuilder.tsx
│   │   └── ItineraryView/
│   │       ├── ItineraryView.tsx
│   │       ├── ItineraryMap.tsx
│   │       ├── BudgetPlanner.tsx
│   │       ├── EditActivityModal.tsx
│   │       ├── RegenerateDayModal.tsx
│   │       └── ShareModal.tsx
│   ├── context/
│   │   └── AppContext.tsx           # Global state & persistence
│   ├── data/
│   │   ├── sampleTrips.ts           # Realistic Scenario A, B, and C templates
│   │   └── destinations.ts          # Featured destination catalog
│   ├── types/
│   │   └── trip.ts                  # TypeScript definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

---

## 🚀 Running the Application

### 1. Development (React + Express Server)

Run the full-stack server (handles both API routes and Vite dev middleware on port 3000):

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Standalone Python FastAPI Backend

To run the Python FastAPI backend separately for deployment:

```bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Run backend unit tests:

```bash
pytest backend/tests/test_itinerary.py
```

---

## 🗄️ Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `supabase/migrations/001_initial_schema.sql`.
4. Copy your **Project URL** and **Anon Key** into your `.env` file:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your-anon-key"
   ```

---

## 🔐 Environment Variables

Create `.env` based on `.env.example`:

```env
# Gemini API Key (accessed securely server-side)
GEMINI_API_KEY="your-gemini-api-key"

# Supabase (optional for persistent remote DB)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-key"
```

---

## 🧪 Testing and Verification

- **Budget Calculations**: Automatically verified via unit tests and recalculates on activity price edits.
- **Single-Day Regeneration**: Preserves remaining days and validates date ranges.
- **Ownership & Privacy**: Public share link toggle enforces privacy by default.
