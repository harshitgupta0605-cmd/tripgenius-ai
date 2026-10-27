import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Known coordinates for top travel destinations and attractions
const KNOWN_COORDS: Record<string, { lat: number; lng: number }> = {
  // Cities
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'hawa mahal': { lat: 26.9239, lng: 75.8267 },
  'amber palace': { lat: 26.9855, lng: 75.8513 },
  'amber fort': { lat: 26.9855, lng: 75.8513 },
  'city palace': { lat: 26.9258, lng: 75.8236 },
  'jantar mantar': { lat: 26.9248, lng: 75.8246 },
  'nahargarh fort': { lat: 26.9373, lng: 75.8155 },
  'jal mahal': { lat: 26.9656, lng: 75.8459 },
  'bapu bazaar': { lat: 26.9189, lng: 75.8214 },

  'kyoto': { lat: 35.0116, lng: 135.7681 },
  'fushimi inari': { lat: 34.9671, lng: 135.7727 },
  'kinkaku-ji': { lat: 35.0394, lng: 135.7292 },
  'arashiyama': { lat: 35.0170, lng: 135.6713 },
  'kiyomizu-dera': { lat: 34.9949, lng: 135.7850 },
  'gion': { lat: 35.0037, lng: 135.7772 },

  'barcelona': { lat: 41.3879, lng: 2.1699 },
  'sagrada familia': { lat: 41.4036, lng: 2.1744 },
  'park guell': { lat: 41.4145, lng: 2.1527 },
  'casa batllo': { lat: 41.3916, lng: 2.1649 },
  'gothic quarter': { lat: 41.3833, lng: 2.1764 },
  'barceloneta': { lat: 41.3818, lng: 2.1734 },

  'paris': { lat: 48.8566, lng: 2.3522 },
  'eiffel tower': { lat: 48.8584, lng: 2.2945 },
  'louvre': { lat: 48.8606, lng: 2.3376 },
  'montmartre': { lat: 48.8867, lng: 2.3431 },
  'sacre-coeur': { lat: 48.8867, lng: 2.3431 },
  'arc de triomphe': { lat: 48.8738, lng: 2.2950 },

  'rome': { lat: 41.9028, lng: 12.4964 },
  'colosseum': { lat: 41.8902, lng: 12.4922 },
  'vatican': { lat: 41.9067, lng: 12.4536 },
  'trevi fountain': { lat: 41.9009, lng: 12.4833 },
  'pantheon': { lat: 41.8986, lng: 12.4769 },

  'bali': { lat: -8.4095, lng: 115.1889 },
  'ubud': { lat: -8.5069, lng: 115.2625 },
  'tanah lot': { lat: -8.6212, lng: 115.0868 },
  'uluwatu': { lat: -8.8291, lng: 115.0849 },
  'tegalalang': { lat: -8.4346, lng: 115.2796 },

  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'shibuya': { lat: 35.6595, lng: 139.7004 },
  'senso-ji': { lat: 35.7148, lng: 139.7967 },
  'meiji shrine': { lat: 35.6764, lng: 139.6993 },
  'shinjuku': { lat: 35.6852, lng: 139.7101 },

  'interlaken': { lat: 46.6863, lng: 7.8632 },
  'jungfrau': { lat: 46.5475, lng: 7.9854 },
  'lauterbrunnen': { lat: 46.5935, lng: 7.9090 },
  'grindelwald': { lat: 46.6242, lng: 8.0414 },

  'new york': { lat: 40.7128, lng: -74.0060 },
  'central park': { lat: 40.7829, lng: -73.9654 },
  'times square': { lat: 40.7580, lng: -73.9855 },
  'brooklyn bridge': { lat: 40.7061, lng: -73.9969 }
};

function getCoordsForPlace(placeName: string, destination: string): { lat: number | null; lng: number | null } {
  const p = placeName.toLowerCase();
  const d = destination.toLowerCase();

  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (p.includes(key) || key.includes(p)) {
      return coords;
    }
  }

  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (d.includes(key)) {
      const hash = Math.abs(placeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
      const latOffset = ((hash % 100) - 50) * 0.0004;
      const lngOffset = (((hash * 13) % 100) - 50) * 0.0004;
      return { lat: coords.lat + latOffset, lng: coords.lng + lngOffset };
    }
  }

  return { lat: null, lng: null };
}

// In-memory persistent trips store for preview session
const memoryTrips = new Map<string, any>();
const savedPlaces = new Map<string, any>();

// Initialize Gemini SDK with telemetry header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Health Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    backend: 'express-fullstack',
    gemini_configured: Boolean(ai),
    gemini_model: 'gemini-3.8-flash',
    trips_stored: memoryTrips.size,
    timestamp: new Date().toISOString()
  });
});

// Destination Catalog
const DESTINATIONS = [
  {
    id: "dest-jaipur",
    name: "Jaipur",
    country: "India",
    region: "Rajasthan",
    category: "cultural",
    tagline: "The Pink City of Maharajas, Forts & Vibrant Bazaars",
    description: "Known as the Pink City, Jaipur is steeped in royal history with iconic terracotta-pink architecture, UNESCO world heritage astronomical observatories, and magnificent hill forts overlooking ancient lakes.",
    image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort Sunset"],
    best_time_to_visit: "October to March (Pleasant dry winter)",
    indicative_budget_range: "$30 - $90 / day",
    suggested_duration_days: 3,
    popularity_score: 96,
    currency: "INR"
  },
  {
    id: "dest-kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Kansai",
    category: "cultural",
    tagline: "Ancient Temples, Serene Zen Gardens & Traditional Teahouses",
    description: "The cultural heart of Japan, featuring thousands of Buddhist temples, Shinto shrines with vermilion torii gates, preserved wooden machiya houses, and tranquil bamboo groves.",
    image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Fushimi Inari-taisha", "Kinkaku-ji (Golden Pavilion)", "Arashiyama Bamboo Grove", "Gion Geisha District", "Kiyomizu-dera"],
    best_time_to_visit: "March-May (Cherry Blossoms) or October-November (Autumn foliage)",
    indicative_budget_range: "$90 - $220 / day",
    suggested_duration_days: 4,
    popularity_score: 98,
    currency: "JPY"
  },
  {
    id: "dest-barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Catalonia",
    category: "cultural",
    tagline: "Gaudí Masterpieces, Mediterranean Tapas & Coastal Energy",
    description: "A seaside metropolis celebrating artistic genius with Antoni Gaudí's whimsical architecture, lively tapas bars in the Gothic Quarter, and sun-soaked Mediterranean beaches.",
    image_url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Sagrada Família", "Park Güell", "Gothic Quarter", "Casa Batlló", "Barceloneta Beach"],
    best_time_to_visit: "May to June, September to October",
    indicative_budget_range: "$80 - $200 / day",
    suggested_duration_days: 4,
    popularity_score: 95,
    currency: "EUR"
  },
  {
    id: "dest-amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    region: "Campania",
    category: "romantic",
    tagline: "Cliffside Pastel Towns, Lemon Groves & Azure Waters",
    description: "Dramatic cliffs plunging into the Tyrrhenian Sea, pastel-painted fishing villages, fragrant lemon terraced groves, and world-class seaside dining.",
    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Positano Cliffside", "Ravello Gardens & Villa Rufolo", "Amalfi Cathedral", "Path of the Gods Hike"],
    best_time_to_visit: "April to June or September to October",
    indicative_budget_range: "$140 - $350 / day",
    suggested_duration_days: 4,
    popularity_score: 94,
    currency: "EUR"
  },
  {
    id: "dest-bali",
    name: "Bali",
    country: "Indonesia",
    region: "Lesser Sunda Islands",
    category: "nature",
    tagline: "Emerald Rice Terraces, Volcanic Peaks & Spiritual Wellness",
    description: "The Island of the Gods offers lush rainforest canopies, sacred water temples, world-class surf breaks, and tranquil holistic wellness retreats.",
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Tegalalang Rice Terraces", "Ubud Sacred Monkey Forest", "Uluwatu Sunset Temple", "Mount Batur Sunrise Trek"],
    best_time_to_visit: "April to October (Dry season)",
    indicative_budget_range: "$35 - $110 / day",
    suggested_duration_days: 5,
    popularity_score: 97,
    currency: "USD"
  },
  {
    id: "dest-swiss-alps",
    name: "Interlaken & Swiss Alps",
    country: "Switzerland",
    region: "Bernese Oberland",
    category: "adventure",
    tagline: "Glacial Peaks, Alpine Meadows & High-Altitude Thrills",
    description: "Surrounded by snow-capped giants Jungfrau, Eiger, and Mönch, this alpine paradise is the ultimate destination for hiking, cogwheel rail journeys, and scenic serenity.",
    image_url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Jungfraujoch Top of Europe", "Lauterbrunnen Valley of 72 Waterfalls", "Grindelwald First Cliff Walk", "Lake Brienz Cruise"],
    best_time_to_visit: "June to September (Hiking) or December to March (Skiing)",
    indicative_budget_range: "$150 - $380 / day",
    suggested_duration_days: 4,
    popularity_score: 93,
    currency: "CHF"
  },
  {
    id: "dest-paris",
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    category: "romantic",
    tagline: "The City of Light, Haute Cuisine & World-Renowned Art",
    description: "Iconic boulevards, world-class museums, candlelit bistros, and iconic monuments along the River Seine.",
    image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Eiffel Tower", "Louvre Museum", "Montmartre & Sacré-Cœur", "Musée d'Orsay", "Seine Sunset Cruise"],
    best_time_to_visit: "April to May or September to October",
    indicative_budget_range: "$120 - $280 / day",
    suggested_duration_days: 4,
    popularity_score: 99,
    currency: "EUR"
  },
  {
    id: "dest-costa-rica",
    name: "Costa Rica",
    country: "Costa Rica",
    region: "Central America",
    category: "adventure",
    tagline: "Pura Vida: Cloud Forests, Volcanic Hot Springs & Wildlife Safaris",
    description: "A biodiversity hotspot with misty Monteverde cloud forests, Arenal volcano adventures, zip-lining, and white-sand beaches.",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    main_attractions: ["Arenal Volcano & Hot Springs", "Monteverde Cloud Forest Reserve", "Manuel Antonio National Park"],
    best_time_to_visit: "December to April (Dry season)",
    indicative_budget_range: "$70 - $180 / day",
    suggested_duration_days: 6,
    popularity_score: 92,
    currency: "USD"
  }
];

app.get('/api/destinations/featured', (req: Request, res: Response) => {
  res.json({ destinations: DESTINATIONS });
});

app.get('/api/destinations/search', (req: Request, res: Response) => {
  const query = (req.query.query as string || '').toLowerCase().trim();
  const category = (req.query.category as string || '').toLowerCase().trim();

  let results = DESTINATIONS;
  if (category && category !== 'all') {
    results = results.filter(d => d.category.toLowerCase() === category);
  }
  if (query) {
    results = results.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.country.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.tagline.toLowerCase().includes(query)
    );
  }
  res.json({ destinations: results, total: results.length });
});

// Helper to recalculate budget
function recalculateBudget(itinerary: any) {
  let totalActivities = 0;
  let totalFood = 0;

  for (const day of itinerary.days || []) {
    let dayCost = 0;
    for (const act of day.activities || []) {
      const cost = Number(act.estimated_cost) || 0;
      totalActivities += cost;
      dayCost += cost;
    }
    for (const meal of day.meals || []) {
      const cost = Number(meal.estimated_cost) || 0;
      totalFood += cost;
      dayCost += cost;
    }
    day.estimated_daily_cost = Math.round(dayCost * 100) / 100;
  }

  const budget = itinerary.budget || {};
  budget.activities = Math.round(totalActivities * 100) / 100;
  budget.food = Math.round(totalFood * 100) / 100;

  const transport = Number(budget.transportation) || 0;
  const accomm = Number(budget.accommodation) || 0;
  const localTransport = Number(budget.local_transport) || 0;
  const misc = Number(budget.miscellaneous) || 0;

  budget.estimated_total = Math.round((transport + accomm + localTransport + misc + totalActivities + totalFood) * 100) / 100;
  itinerary.budget = budget;
  return itinerary;
}

// AI Generation Endpoint
app.post('/api/trips/generate', async (req: Request, res: Response) => {
  const tripDetails = req.body;
  const destination = tripDetails.destination || 'Jaipur, India';
  const travelers = Number(tripDetails.travelers) || 1;
  const currency = tripDetails.currency || 'USD';
  const totalBudget = Number(tripDetails.total_budget) || 1200;
  const tripType = tripDetails.trip_type || 'solo';
  const pace = tripDetails.daily_pace || 'balanced';
  const startDate = tripDetails.start_date || '2026-11-10';
  const endDate = tripDetails.end_date || '2026-11-13';

  // Calculate day difference
  let numDays = 3;
  try {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    numDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  } catch {
    numDays = 3;
  }
  if (numDays > 14) numDays = 14;

  let itinerary: any = null;

  if (ai) {
    try {
      const prompt = `
You are TripGenius AI, a master travel itinerary designer.
Create a personalized, geographically logical, day-by-day travel plan.

PARAMETERS:
- Destination: ${destination}
- Origin: ${tripDetails.origin || 'Flexible'}
- Start Date: ${startDate}
- End Date: ${endDate} (${numDays} full days)
- Travelers: ${travelers} (${tripType})
- Total Budget: ${currency} ${totalBudget} (${tripDetails.budget_tier || 'standard'})
- Budget Includes: ${(tripDetails.budget_includes || []).join(', ')}
- Interests: ${(tripDetails.interests || []).join(', ') || 'Sightseeing, culture, local dining'}
- Daily Pace: ${pace} (relaxed = 2-3 activities/day; balanced = 3-4 activities/day; packed = 5+ activities/day)
- Preferred Wake-up Time: ${tripDetails.wake_up_time || '08:30'}
- Accommodation Style: ${tripDetails.accommodation_preference || 'Boutique hotel / Airbnb'}
- Food Preferences: ${tripDetails.food_preferences || 'Local authentic dishes'}
- Must-Visit Places: ${tripDetails.must_visit_places || 'Top iconic attractions'}
- Places to Avoid: ${tripDetails.places_to_avoid || 'None'}
- Notes: ${tripDetails.additional_notes || 'None'}

STRICT RULES:
1. Provide exactly ${numDays} days (day 1 through day ${numDays}).
2. Activities must be geographically clustered to minimize travel time.
3. Realistic activity durations, travel times from previous activity, and estimated costs in ${currency}.
4. Provide genuine landmark/restaurant names (not vague placeholders).
5. Output ONLY valid JSON, with NO Markdown backticks.

Target JSON Structure:
{
  "trip_title": "string",
  "destination": "${destination}",
  "summary": "string overview",
  "travel_dates": { "start_date": "${startDate}", "end_date": "${endDate}" },
  "travelers": ${travelers},
  "currency": "${currency}",
  "budget": {
    "total_budget": ${totalBudget},
    "estimated_total": 0,
    "transportation": ${Math.round(totalBudget * 0.2)},
    "accommodation": ${Math.round(totalBudget * 0.35)},
    "food": ${Math.round(totalBudget * 0.2)},
    "activities": ${Math.round(totalBudget * 0.15)},
    "local_transport": ${Math.round(totalBudget * 0.08)},
    "miscellaneous": ${Math.round(totalBudget * 0.02)}
  },
  "days": [
    {
      "day_number": 1,
      "date": "${startDate}",
      "theme": "string theme",
      "activities": [
        {
          "time": "09:00",
          "title": "string",
          "description": "string",
          "category": "sightseeing",
          "estimated_duration_minutes": 90,
          "estimated_cost": 25,
          "currency": "${currency}",
          "location_name": "string",
          "address": "string",
          "latitude": null,
          "longitude": null,
          "travel_time_from_previous_minutes": 15,
          "booking_required": false,
          "source_url": null
        }
      ],
      "meals": [
        {
          "meal_type": "lunch",
          "restaurant_or_area": "string",
          "cuisine": "string",
          "estimated_cost": 20,
          "currency": "${currency}",
          "dietary_friendly": ["vegetarian"]
        }
      ],
      "estimated_daily_cost": 0,
      "travel_tips": ["string tip 1", "string tip 2"]
    }
  ],
  "accommodation_suggestions": [
    {
      "area_name": "string",
      "why_recommended": "string",
      "suggested_property_types": ["Boutique Hotel"],
      "estimated_nightly_rate": 120,
      "currency": "${currency}"
    }
  ],
  "transportation_tips": ["string tip"],
  "packing_checklist": ["Passport", "Comfortable walking shoes", "Universal adapter"],
  "important_notes": ["Check visa requirements in advance"],
  "budget_assumptions": ["Accommodation calculated based on double occupancy"]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      let raw = response.text || '{}';
      raw = raw.trim();
      if (raw.startsWith('```json')) raw = raw.slice(7);
      if (raw.startsWith('```')) raw = raw.slice(3);
      if (raw.endsWith('```')) raw = raw.slice(0, -3);

      itinerary = JSON.parse(raw.trim());
    } catch (err: any) {
      console.warn('[Gemini Gen Error, using smart personalized generator]', err?.message);
    }
  }

  // Fallback / offline generator ensuring seamless user experience
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    itinerary = generateSmartFallbackItinerary(tripDetails, numDays);
  }

  // Enrich coordinates for interactive Leaflet Map
  for (const day of itinerary.days || []) {
    for (const act of day.activities || []) {
      if (!act.latitude || !act.longitude) {
        const coords = getCoordsForPlace(act.location_name, destination);
        if (coords.lat && coords.lng) {
          act.latitude = coords.lat;
          act.longitude = coords.lng;
        }
      }
    }
  }

  // Calculate exact budget numbers
  itinerary = recalculateBudget(itinerary);

  const tripId = 'trip-' + Date.now();
  const tripRecord = {
    id: tripId,
    title: itinerary.trip_title || `${tripDetails.trip_type ? tripDetails.trip_type.toUpperCase() + ' Trip to ' : ''}${destination}`,
    destination: destination,
    origin: tripDetails.origin || 'Flexible',
    start_date: startDate,
    end_date: endDate,
    travelers: travelers,
    trip_type: tripType,
    budget: totalBudget,
    currency: currency,
    preferences: tripDetails,
    itinerary_json: itinerary,
    status: 'upcoming',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryTrips.set(tripId, tripRecord);

  res.json({
    success: true,
    trip_id: tripId,
    itinerary: itinerary
  });
});

// Regenerate single day endpoint
app.post('/api/trips/:tripId/regenerate-day', async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const { day_number, focus_notes, exclude_places } = req.body;

  const trip = memoryTrips.get(tripId);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const originalItinerary = trip.itinerary_json;
  const targetDay = (originalItinerary.days || []).find((d: any) => d.day_number === day_number);
  const dateStr = targetDay?.date || 'Day ' + day_number;
  const dest = originalItinerary.destination;
  const currency = originalItinerary.currency;

  let newDay: any = null;

  if (ai) {
    try {
      const prompt = `
Regenerate ONLY Day ${day_number} of a trip to ${dest}.
Date: ${dateStr}.
Currency: ${currency}.
User Instructions: "${focus_notes || 'Provide fresh, high-interest alternative activities'}"
Exclude these places: ${(exclude_places || []).join(', ') || 'None'}

Return ONLY a single Day JSON object with theme, 3-4 activities, meals, and travel tips:
{
  "day_number": ${day_number},
  "date": "${dateStr}",
  "theme": "string updated theme",
  "activities": [
    {
      "time": "09:30",
      "title": "string",
      "description": "string",
      "category": "sightseeing",
      "estimated_duration_minutes": 90,
      "estimated_cost": 25,
      "currency": "${currency}",
      "location_name": "string",
      "address": null,
      "latitude": null,
      "longitude": null,
      "travel_time_from_previous_minutes": 15,
      "booking_required": false,
      "source_url": null
    }
  ],
  "meals": [
    {
      "meal_type": "lunch",
      "restaurant_or_area": "string",
      "cuisine": "string",
      "estimated_cost": 22,
      "currency": "${currency}",
      "dietary_friendly": []
    }
  ],
  "estimated_daily_cost": 0,
  "travel_tips": ["string tip"]
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });
      let raw = response.text || '{}';
      raw = raw.trim();
      if (raw.startsWith('```json')) raw = raw.slice(7);
      if (raw.startsWith('```')) raw = raw.slice(3);
      if (raw.endsWith('```')) raw = raw.slice(0, -3);
      newDay = JSON.parse(raw.trim());
    } catch (e: any) {
      console.warn('[Gemini Day Regen Fallback]', e?.message);
    }
  }

  if (!newDay) {
    // Smart fallback replacement day
    newDay = {
      day_number: day_number,
      date: dateStr,
      theme: `Alternative Explorer: Hidden Gems & Cultural Vistas`,
      activities: [
        {
          time: "09:30",
          title: `Artisanal District Walk & Local Markets`,
          description: `Stroll through morning artisan markets and vibrant neighborhood alleyways away from mainstream tourist crowds.`,
          category: "culture",
          estimated_duration_minutes: 120,
          estimated_cost: 15,
          currency: currency,
          location_name: `${dest} Old Market Square`,
          address: `Downtown ${dest}`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 10,
          booking_required: false
        },
        {
          time: "13:30",
          title: `Panoramic Viewpoint & Historic Citadel`,
          description: `Enjoy scenic panoramic photo spots and discover regional heritage and architecture.`,
          category: "sightseeing",
          estimated_duration_minutes: 90,
          estimated_cost: 20,
          currency: currency,
          location_name: `${dest} Scenic Lookout`,
          address: `Hilltop Vista, ${dest}`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 20,
          booking_required: false
        },
        {
          time: "16:30",
          title: `Tea & Sweet Tasting at Historic Café`,
          description: `Relax and sample traditional treats and refreshing beverages at a beloved local establishment.`,
          category: "food",
          estimated_duration_minutes: 60,
          estimated_cost: 12,
          currency: currency,
          location_name: `Heritage Tea Lounge`,
          address: `Central Quarter, ${dest}`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 15,
          booking_required: false
        }
      ],
      meals: [
        {
          meal_type: "lunch",
          restaurant_or_area: `Traditional Garden Courtyard`,
          cuisine: "Authentic Regional",
          estimated_cost: 22,
          currency: currency,
          dietary_friendly: ["Vegetarian Options"]
        },
        {
          meal_type: "dinner",
          restaurant_or_area: `Rooftop Terrace Dining`,
          cuisine: "Contemporary Fusion",
          estimated_cost: 35,
          currency: currency,
          dietary_friendly: []
        }
      ],
      estimated_daily_cost: 104,
      travel_tips: ["Wear comfortable shoes for walking on stone paths", "Keep local currency for cash-only street vendors"]
    };
  }

  // Enrich coordinates
  for (const act of newDay.activities || []) {
    const coords = getCoordsForPlace(act.location_name, dest);
    if (coords.lat && coords.lng) {
      act.latitude = coords.lat;
      act.longitude = coords.lng;
    }
  }

  // Replace day in itinerary
  const updatedDays = (originalItinerary.days || []).map((d: any) =>
    d.day_number === day_number ? newDay : d
  );
  originalItinerary.days = updatedDays;

  // Recalculate
  recalculateBudget(originalItinerary);
  trip.updated_at = new Date().toISOString();
  memoryTrips.set(tripId, trip);

  res.json({
    success: true,
    day_number,
    updated_day: newDay,
    itinerary: originalItinerary
  });
});

// Trip CRUD Endpoints
app.get('/api/trips', (req: Request, res: Response) => {
  const trips = Array.from(memoryTrips.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  res.json({ trips });
});

app.get('/api/trips/:tripId', (req: Request, res: Response) => {
  const trip = memoryTrips.get(req.params.tripId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip);
});

app.put('/api/trips/:tripId', (req: Request, res: Response) => {
  const { tripId } = req.params;
  const existing = memoryTrips.get(tripId);
  if (!existing) return res.status(404).json({ error: 'Trip not found' });

  const updated = {
    ...existing,
    ...req.body,
    updated_at: new Date().toISOString()
  };
  if (updated.itinerary_json) {
    updated.itinerary_json = recalculateBudget(updated.itinerary_json);
  }
  memoryTrips.set(tripId, updated);
  res.json({ success: true, trip: updated });
});

app.delete('/api/trips/:tripId', (req: Request, res: Response) => {
  const { tripId } = req.params;
  if (!memoryTrips.has(tripId)) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  memoryTrips.delete(tripId);
  res.json({ success: true });
});

// Saved Places
app.get('/api/saved-places', (req: Request, res: Response) => {
  res.json({ places: Array.from(savedPlaces.values()) });
});

app.post('/api/saved-places', (req: Request, res: Response) => {
  const place = { id: 'place-' + Date.now(), ...req.body, created_at: new Date().toISOString() };
  savedPlaces.set(place.id, place);
  res.json({ success: true, place });
});

app.delete('/api/saved-places/:id', (req: Request, res: Response) => {
  savedPlaces.delete(req.params.id);
  res.json({ success: true });
});

// Helper for Smart Fallback Itinerary
function generateSmartFallbackItinerary(tripDetails: any, numDays: number) {
  const destination = tripDetails.destination || 'Jaipur, India';
  const currency = tripDetails.currency || 'USD';
  const totalBudget = Number(tripDetails.total_budget) || 1200;
  const travelers = Number(tripDetails.travelers) || 1;
  const startDate = tripDetails.start_date || '2026-11-10';
  const endDate = tripDetails.end_date || '2026-11-13';

  // Find if destination has curated data
  const isJaipur = destination.toLowerCase().includes('jaipur');
  const isKyoto = destination.toLowerCase().includes('kyoto');
  const isBarcelona = destination.toLowerCase().includes('barcelona');

  const days: any[] = [];
  const start = new Date(startDate);

  for (let i = 1; i <= numDays; i++) {
    const curDate = new Date(start);
    curDate.setDate(start.getDate() + (i - 1));
    const dateFormatted = curDate.toISOString().split('T')[0];

    let theme = `Discovering ${destination}: Highlights & Culture`;
    let activities: any[] = [];
    let meals: any[] = [];

    if (isJaipur) {
      if (i === 1) {
        theme = "Royal Forts & Panoramic Ridge Vistas";
        activities = [
          {
            time: "08:30",
            title: "Ascend Amber Fort & Mirror Palace",
            description: "Marvel at the majestic 16th-century sandstone fortress, Sheesh Mahal (Hall of Mirrors), and sweeping Maota Lake views.",
            category: "sightseeing",
            estimated_duration_minutes: 150,
            estimated_cost: 15,
            currency: currency,
            location_name: "Amber Fort",
            latitude: 26.9855,
            longitude: 75.8513,
            travel_time_from_previous_minutes: 0,
            booking_required: false
          },
          {
            time: "12:00",
            title: "Panna Meena Ka Kund Stepwell",
            description: "Admire the mesmerizing symmetrical geometric stairs of this ancient stepwell, a masterpiece of Rajasthani water architecture.",
            category: "culture",
            estimated_duration_minutes: 45,
            estimated_cost: 0,
            currency: currency,
            location_name: "Panna Meena Ka Kund",
            latitude: 26.9872,
            longitude: 75.8540,
            travel_time_from_previous_minutes: 10,
            booking_required: false
          },
          {
            time: "14:30",
            title: "Photo Stop at Jal Mahal (Water Palace)",
            description: "View the serene palace appearing to float gracefully in the center of Man Sagar Lake.",
            category: "sightseeing",
            estimated_duration_minutes: 30,
            estimated_cost: 0,
            currency: currency,
            location_name: "Jal Mahal",
            latitude: 26.9656,
            longitude: 75.8459,
            travel_time_from_previous_minutes: 15,
            booking_required: false
          },
          {
            time: "17:00",
            title: "Sunset at Nahargarh Fort",
            description: "Watch the golden hour wash over the entire Pink City skyline from the ancient ramparts.",
            category: "adventure",
            estimated_duration_minutes: 120,
            estimated_cost: 8,
            currency: currency,
            location_name: "Nahargarh Fort",
            latitude: 26.9373,
            longitude: 75.8155,
            travel_time_from_previous_minutes: 25,
            booking_required: false
          }
        ];
        meals = [
          { meal_type: "breakfast", restaurant_or_area: "Café Palladio or Hotel Verandah", cuisine: "Artisanal breakfast & spiced chai", estimated_cost: 10, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "lunch", restaurant_or_area: "1135 AD Amber", cuisine: "Royal Rajputana Feast", estimated_cost: 25, currency, dietary_friendly: ["Vegetarian", "Non-veg"] },
          { meal_type: "dinner", restaurant_or_area: "Padao Open-air Bistro at Nahargarh", cuisine: "Rajasthani finger foods & beverages", estimated_cost: 18, currency, dietary_friendly: ["Vegetarian"] }
        ];
      } else if (i === 2) {
        theme = "The Walled City: Palaces, Astronomy & Bazaars";
        activities = [
          {
            time: "09:00",
            title: "Morning Light at Hawa Mahal",
            description: "Photograph the iconic honeycomb façade with 953 jharokhas built for royal women to observe street festivals.",
            category: "sightseeing",
            estimated_duration_minutes: 60,
            estimated_cost: 6,
            currency: currency,
            location_name: "Hawa Mahal",
            latitude: 26.9239,
            longitude: 75.8267,
            travel_time_from_previous_minutes: 0,
            booking_required: false
          },
          {
            time: "10:30",
            title: "City Palace & Chandra Mahal Museum",
            description: "Explore the fusion of Rajput, Mughal, and European architecture still home to the titular royal family.",
            category: "culture",
            estimated_duration_minutes: 120,
            estimated_cost: 14,
            currency: currency,
            location_name: "City Palace",
            latitude: 26.9258,
            longitude: 75.8236,
            travel_time_from_previous_minutes: 10,
            booking_required: false
          },
          {
            time: "13:30",
            title: "Jantar Mantar UNESCO Astronomical Wonders",
            description: "Witness the world's largest stone sundial and astronomical instruments built by Maharaja Sawai Jai Singh II.",
            category: "culture",
            estimated_duration_minutes: 75,
            estimated_cost: 6,
            currency: currency,
            location_name: "Jantar Mantar",
            latitude: 26.9248,
            longitude: 75.8246,
            travel_time_from_previous_minutes: 5,
            booking_required: false
          },
          {
            time: "16:00",
            title: "Walking Bapu Bazaar & Johari Bazaar",
            description: "Immerse in aromatic spices, hand-block printed textiles, silver jewelry, and traditional leather mojari juttis.",
            category: "shopping",
            estimated_duration_minutes: 120,
            estimated_cost: 20,
            currency: currency,
            location_name: "Bapu Bazaar",
            latitude: 26.9189,
            longitude: 75.8214,
            travel_time_from_previous_minutes: 15,
            booking_required: false
          }
        ];
        meals = [
          { meal_type: "breakfast", restaurant_or_area: "Wind View Cafe opposite Hawa Mahal", cuisine: "Espresso & Poha", estimated_cost: 6, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "lunch", restaurant_or_area: "Laxmi Mishthan Bhandar (LMB)", cuisine: "Authentic Dal Baati Churma & Ghewar", estimated_cost: 16, currency, dietary_friendly: ["Pure Vegetarian"] },
          { meal_type: "dinner", restaurant_or_area: "Baradari at City Palace", cuisine: "Contemporary Indian dining", estimated_cost: 32, currency, dietary_friendly: ["Gluten-free available"] }
        ];
      } else {
        theme = "Spiritual Shrines, Art & Culinary Delights";
        activities = [
          {
            time: "09:30",
            title: "Galta Ji (Monkey Temple & Natural Springs)",
            description: "Visit the sacred gorge nestled between Aravalli hills, home to friendly rhesus macaques and natural holy water kunds.",
            category: "culture",
            estimated_duration_minutes: 90,
            estimated_cost: 5,
            currency: currency,
            location_name: "Galtaji Temple",
            latitude: 26.9168,
            longitude: 75.8617,
            travel_time_from_previous_minutes: 20,
            booking_required: false
          },
          {
            time: "12:00",
            title: "Anokhi Museum of Hand Printing",
            description: "Celebrate Jaipur's age-old woodblock textile tradition in a lovingly restored historic haveli.",
            category: "culture",
            estimated_duration_minutes: 75,
            estimated_cost: 4,
            currency: currency,
            location_name: "Anokhi Museum",
            latitude: 26.9932,
            longitude: 75.8517,
            travel_time_from_previous_minutes: 25,
            booking_required: false
          },
          {
            time: "15:30",
            title: "Albert Hall Museum & Ram Niwas Garden",
            description: "Discover Indo-Saracenic architectural splendor showcasing royal weaponry, miniature paintings, and ivory artifacts.",
            category: "sightseeing",
            estimated_duration_minutes: 90,
            estimated_cost: 7,
            currency: currency,
            location_name: "Albert Hall Museum",
            latitude: 26.9116,
            longitude: 75.8195,
            travel_time_from_previous_minutes: 20,
            booking_required: false
          }
        ];
        meals = [
          { meal_type: "breakfast", restaurant_or_area: "Samrat Restaurant", cuisine: "Crispy Pyaz Kachori & Jalebi", estimated_cost: 5, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "lunch", restaurant_or_area: "Peacock Rooftop Restaurant", cuisine: "North Indian & Thali", estimated_cost: 14, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "dinner", restaurant_or_area: "Handi Restaurant on MI Road", cuisine: "Laal Maas & Stuffed Parathas", estimated_cost: 26, currency, dietary_friendly: ["Non-veg & Veg"] }
        ];
      }
    } else if (isKyoto) {
      if (i === 1) {
        theme = "Torii Gates & Traditional Tea Ceremonies";
        activities = [
          {
            time: "08:00",
            title: "Fushimi Inari-taisha Morning Pilgrimage",
            description: "Hike beneath thousands of vibrant vermilion torii gates winding up the sacred Mount Inari.",
            category: "culture",
            estimated_duration_minutes: 150,
            estimated_cost: 0,
            currency: currency,
            location_name: "Fushimi Inari-taisha",
            latitude: 34.9671,
            longitude: 135.7727,
            travel_time_from_previous_minutes: 0,
            booking_required: false
          },
          {
            time: "12:00",
            title: "Kiyomizu-dera & Wooden Stage",
            description: "Take in breathtaking views of Kyoto and the cherry/maple treetops from the historic wooden terrace built without nails.",
            category: "sightseeing",
            estimated_duration_minutes: 90,
            estimated_cost: 8,
            currency: currency,
            location_name: "Kiyomizu-dera",
            latitude: 34.9949,
            longitude: 135.7850,
            travel_time_from_previous_minutes: 25,
            booking_required: false
          },
          {
            time: "15:00",
            title: "Stroll Sannenzaka & Ninenzaka Preserved Streets",
            description: "Walk down cobblestone pathways lined with traditional wooden teahouses, ceramics shops, and incense vendors.",
            category: "culture",
            estimated_duration_minutes: 90,
            estimated_cost: 12,
            currency: currency,
            location_name: "Ninenzaka",
            latitude: 34.9984,
            longitude: 135.7816,
            travel_time_from_previous_minutes: 5,
            booking_required: false
          },
          {
            time: "18:00",
            title: "Evening Lantern Walk in Gion",
            description: "Experience the timeless atmosphere of the geisha quarter along Shirakawa Canal.",
            category: "sightseeing",
            estimated_duration_minutes: 90,
            estimated_cost: 0,
            currency: currency,
            location_name: "Gion District",
            latitude: 35.0037,
            longitude: 135.7772,
            travel_time_from_previous_minutes: 15,
            booking_required: false
          }
        ];
        meals = [
          { meal_type: "breakfast", restaurant_or_area: "Inari Tea House", cuisine: "Matcha latte & Warabi Mochi", estimated_cost: 8, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "lunch", restaurant_or_area: "Okutan Kiyomizu", cuisine: "Traditional Yudofu (simmered tofu) course", estimated_cost: 28, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "dinner", restaurant_or_area: "Gion Karyo", cuisine: "Seasonal Kaiseki Banquet", estimated_cost: 65, currency, dietary_friendly: [] }
        ];
      } else {
        theme = "Bamboo Forests & Zen Golden Pavilions";
        activities = [
          {
            time: "08:30",
            title: "Arashiyama Bamboo Grove & Tenryu-ji",
            description: "Walk through towering emerald bamboo groves and the World Heritage Zen landscape garden.",
            category: "nature",
            estimated_duration_minutes: 120,
            estimated_cost: 10,
            currency: currency,
            location_name: "Arashiyama Bamboo Grove",
            latitude: 35.0170,
            longitude: 135.6713,
            travel_time_from_previous_minutes: 0,
            booking_required: false
          },
          {
            time: "11:30",
            title: "Togetsukyo Bridge & River Crossing",
            description: "Admire the wooden moon-crossing bridge framed by lush hillside peaks.",
            category: "sightseeing",
            estimated_duration_minutes: 45,
            estimated_cost: 0,
            currency: currency,
            location_name: "Togetsukyo Bridge",
            latitude: 35.0128,
            longitude: 135.6777,
            travel_time_from_previous_minutes: 10,
            booking_required: false
          },
          {
            time: "14:00",
            title: "Kinkaku-ji (The Golden Pavilion)",
            description: "Marvel at the top two floors gilded entirely in brilliant gold leaf, mirrored gracefully on the surrounding Kyoko-chi pond.",
            category: "sightseeing",
            estimated_duration_minutes: 75,
            estimated_cost: 8,
            currency: currency,
            location_name: "Kinkaku-ji",
            latitude: 35.0394,
            longitude: 135.7292,
            travel_time_from_previous_minutes: 30,
            booking_required: false
          },
          {
            time: "16:30",
            title: "Ryoan-ji Dry Landscape Rock Garden",
            description: "Contemplate the enigmatic composition of 15 moss-ringed boulders in raked white gravel.",
            category: "culture",
            estimated_duration_minutes: 60,
            estimated_cost: 6,
            currency: currency,
            location_name: "Ryoan-ji",
            latitude: 35.0345,
            longitude: 135.7182,
            travel_time_from_previous_minutes: 15,
            booking_required: false
          }
        ];
        meals = [
          { meal_type: "breakfast", restaurant_or_area: "% Arabica Kyoto Arashiyama", cuisine: "Artisan Coffee & Croissants", estimated_cost: 9, currency, dietary_friendly: ["Vegetarian"] },
          { meal_type: "lunch", restaurant_or_area: "Shigetsu inside Tenryu-ji", cuisine: "Shojin Ryori (Buddhist vegetarian dining)", estimated_cost: 32, currency, dietary_friendly: ["Vegan"] },
          { meal_type: "dinner", restaurant_or_area: "Pontocho Alley Izakaya", cuisine: "Yakitori, Wagyu beef skewers & local sake", estimated_cost: 45, currency, dietary_friendly: [] }
        ];
      }
    } else {
      // General world destination generator
      activities = [
        {
          time: "09:00",
          title: `Explore Historic Old Town & Landmarks in ${destination}`,
          description: `Begin your day discovering iconic architecture, historical monuments, and cobblestone squares.`,
          category: "sightseeing",
          estimated_duration_minutes: 120,
          estimated_cost: 20,
          currency: currency,
          location_name: `Historic Center of ${destination}`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 0,
          booking_required: false
        },
        {
          time: "12:30",
          title: `Local Food Market & Tasting Tour`,
          description: `Sample regional specialties, cheeses, street delicacies, and fresh seasonal harvests.`,
          category: "food",
          estimated_duration_minutes: 90,
          estimated_cost: 25,
          currency: currency,
          location_name: `${destination} Central Market`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 15,
          booking_required: false
        },
        {
          time: "15:00",
          title: `Fine Art Gallery or Heritage Museum`,
          description: `Immerse in national art, historical collections, and interactive cultural exhibitions.`,
          category: "culture",
          estimated_duration_minutes: 105,
          estimated_cost: 18,
          currency: currency,
          location_name: `${destination} National Museum`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 20,
          booking_required: false
        },
        {
          time: "18:00",
          title: `Scenic Sunset Vista & Promenade Walk`,
          description: `Unwind with stunning views of the surrounding cityscape and horizon.`,
          category: "relaxation",
          estimated_duration_minutes: 75,
          estimated_cost: 0,
          currency: currency,
          location_name: `${destination} Sunset Point`,
          latitude: null,
          longitude: null,
          travel_time_from_previous_minutes: 15,
          booking_required: false
        }
      ];
      meals = [
        { meal_type: "breakfast", restaurant_or_area: "Neighborhood Artisan Bakery", cuisine: "Pastries, coffee, and fresh fruits", estimated_cost: 12, currency, dietary_friendly: ["Vegetarian"] },
        { meal_type: "lunch", restaurant_or_area: "Bistro by the Market", cuisine: "Regional Lunch Special", estimated_cost: 24, currency, dietary_friendly: [] },
        { meal_type: "dinner", restaurant_or_area: "Courtyard Dining", cuisine: "Locally Sourced Seasonal Dinner", estimated_cost: 40, currency, dietary_friendly: [] }
      ];
    }

    days.push({
      day_number: i,
      date: dateFormatted,
      theme: theme,
      activities: activities,
      meals: meals,
      estimated_daily_cost: 0,
      travel_tips: [
        "Download offline transit maps before setting out",
        "Keep a light jacket handy for changing afternoon temperatures",
        "Reserve popular dinner spots at least one day in advance"
      ]
    });
  }

  return {
    trip_title: `${travelers > 1 ? `${travelers}-Person ` : ''}${tripDetails.trip_type ? tripDetails.trip_type.toUpperCase() + ' ' : ''}Journey in ${destination}`,
    destination: destination,
    summary: `A carefully curated ${numDays}-day personalized itinerary balancing cultural landmarks, delicious regional cuisine, and scenic vistas customized for ${travelers} traveler(s).`,
    travel_dates: { start_date: startDate, end_date: endDate },
    travelers: travelers,
    currency: currency,
    budget: {
      total_budget: totalBudget,
      estimated_total: 0,
      transportation: Math.round(totalBudget * 0.22),
      accommodation: Math.round(totalBudget * 0.38),
      food: Math.round(totalBudget * 0.20),
      activities: Math.round(totalBudget * 0.12),
      local_transport: Math.round(totalBudget * 0.06),
      miscellaneous: Math.round(totalBudget * 0.02)
    },
    days: days,
    accommodation_suggestions: [
      {
        area_name: `Historic Old Town / Central District`,
        why_recommended: `Within walking distance to primary attractions, atmospheric cafes, and reliable transit options.`,
        suggested_property_types: ["Boutique Heritage Hotel", "Serviced City Apartment"],
        estimated_nightly_rate: Math.round((totalBudget * 0.38) / Math.max(1, numDays - 1)),
        currency: currency
      }
    ],
    transportation_tips: [
      "Use local metros, trams, or verified rideshare apps for fastest cross-town journeys.",
      "Consider buying a multi-day unlimited transit pass at the central station."
    ],
    packing_checklist: [
      "Comfortable broken-in walking shoes",
      "Universal power plug adapter & power bank",
      "Breathable daytime clothing & evening layers",
      "Refillable insulated water bottle",
      "Lightweight rain jacket or compact umbrella"
    ],
    important_notes: [
      "Always check museum closing days (often Mondays or Tuesdays).",
      "Carry modest clothing covering shoulders and knees when visiting religious shrines."
    ],
    budget_assumptions: [
      "Accommodation rate based on standard mid-tier double room.",
      "Sightseeing admission based on adult general tickets.",
      "Transport calculated using public transit and occasional rideshares."
    ]
  };
}

// Dev server / Vite middleware setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 TripGenius AI Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
