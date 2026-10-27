import { TripRecord } from '../types/trip';

export const SAMPLE_TRIPS: TripRecord[] = [
  {
    id: 'sample-scenario-a',
    title: 'Solo Explorer Weekend in Jaipur',
    destination: 'Jaipur, India',
    origin: 'Delhi, India',
    start_date: '2026-11-06',
    end_date: '2026-11-08',
    travelers: 1,
    trip_type: 'solo',
    budget: 350,
    currency: 'USD',
    is_sample: true,
    scenario_tag: 'Scenario A: Solo Weekend Getaway',
    status: 'upcoming',
    cover_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-20T10:00:00Z',
    updated_at: '2026-10-20T10:00:00Z',
    preferences: {
      destination: 'Jaipur, India',
      origin: 'Delhi, India',
      start_date: '2026-11-06',
      end_date: '2026-11-08',
      travelers: 1,
      trip_type: 'solo',
      total_budget: 350,
      currency: 'USD',
      budget_tier: 'budget-friendly',
      daily_pace: 'balanced',
      interests: ['Historical places', 'Food and local cuisine', 'Culture and museums', 'Photography']
    },
    itinerary_json: {
      trip_title: 'Solo Heritage & Street Eats Weekend in Jaipur',
      destination: 'Jaipur, India',
      summary: 'A fast-paced yet rewarding solo getaway soaking up the royal fortifications of Amber, street kachoris in the Old Pink City, and sunset views from Nahargarh ridge.',
      travel_dates: { start_date: '2026-11-06', end_date: '2026-11-08' },
      travelers: 1,
      currency: 'USD',
      budget: {
        total_budget: 350,
        estimated_total: 298,
        transportation: 65,
        accommodation: 95,
        food: 58,
        activities: 50,
        local_transport: 22,
        miscellaneous: 8
      },
      days: [
        {
          day_number: 1,
          date: '2026-11-06',
          theme: 'Fortress Heights & Sunset Over the Pink Horizon',
          activities: [
            {
              time: '09:00',
              title: 'Amber Fort & Hall of Mirrors (Sheesh Mahal)',
              description: 'Climb through the grand Suraj Pol gate to explore the inlaid convex glass mirrors of Sheesh Mahal and the sprawling Mughal gardens overlooking Maota Lake.',
              category: 'sightseeing',
              estimated_duration_minutes: 150,
              estimated_cost: 15,
              currency: 'USD',
              location_name: 'Amber Fort',
              address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001',
              latitude: 26.9855,
              longitude: 75.8513,
              travel_time_from_previous_minutes: 0,
              booking_required: false
            },
            {
              time: '12:00',
              title: 'Panna Meena Ka Kund Stepwell Geometry',
              description: 'Take photographs of the 16th-century square stepwell famous for its crisscrossing interlocking staircases.',
              category: 'culture',
              estimated_duration_minutes: 40,
              estimated_cost: 0,
              currency: 'USD',
              location_name: 'Panna Meena Ka Kund',
              address: 'Near Amber Fort, Amer, Jaipur',
              latitude: 26.9872,
              longitude: 75.8540,
              travel_time_from_previous_minutes: 10,
              booking_required: false
            },
            {
              time: '14:30',
              title: 'Jal Mahal Lakefront Viewpoint',
              description: 'Admire the 5-story submerged pleasure palace standing quietly in Man Sagar Lake against the backdrop of the Aravalli hills.',
              category: 'sightseeing',
              estimated_duration_minutes: 35,
              estimated_cost: 0,
              currency: 'USD',
              location_name: 'Jal Mahal',
              address: 'Amer Road, Jaipur',
              latitude: 26.9656,
              longitude: 75.8459,
              travel_time_from_previous_minutes: 15,
              booking_required: false
            },
            {
              time: '16:45',
              title: 'Golden Hour at Nahargarh Fort Ramparts',
              description: 'Witness the iconic sunset vantage point perched on the edge of the hill where the entire Pink City lights up below.',
              category: 'adventure',
              estimated_duration_minutes: 120,
              estimated_cost: 7,
              currency: 'USD',
              location_name: 'Nahargarh Fort',
              address: 'Krishna Nagar, Brahampuri, Jaipur',
              latitude: 26.9373,
              longitude: 75.8155,
              travel_time_from_previous_minutes: 25,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'breakfast',
              restaurant_or_area: 'Rawat Mishthan Bhandar',
              cuisine: 'Pyaz Kachori & Masala Chai',
              estimated_cost: 5,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'lunch',
              restaurant_or_area: 'The Stag Rooftop Restro',
              cuisine: 'Rajasthani Gatta Curry & Roti overlooking Amber Fort',
              estimated_cost: 14,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Padao Open Air Cafe',
              cuisine: 'Cold drinks and snacks at Nahargarh Fort peak',
              estimated_cost: 10,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            }
          ],
          estimated_daily_cost: 51,
          travel_tips: [
            'Hire an authorized e-rickshaw or shared cab for the day to avoid walking steep inclines.',
            'Nahargarh gets windy at sunset; carry a light scarf or windbreaker.'
          ]
        },
        {
          day_number: 2,
          date: '2026-11-07',
          theme: 'Walled City: Honeycomb Palaces, Ancient Sundials & Spice Bazaars',
          activities: [
            {
              time: '08:45',
              title: 'Hawa Mahal (Palace of Winds) Early Access',
              description: 'Stand across the street at Wind View cafe or step inside to see the 953 lattice windows crafted for the royal purdah observation.',
              category: 'sightseeing',
              estimated_duration_minutes: 60,
              estimated_cost: 6,
              currency: 'USD',
              location_name: 'Hawa Mahal',
              address: 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur',
              latitude: 26.9239,
              longitude: 75.8267,
              travel_time_from_previous_minutes: 0,
              booking_required: false
            },
            {
              time: '10:15',
              title: 'City Palace Courtyards & Peacock Gate',
              description: 'Explore the Pritam Niwas Chowk four seasonal courtyard doorways, royal attire exhibits, and the massive silver water vessels.',
              category: 'culture',
              estimated_duration_minutes: 120,
              estimated_cost: 12,
              currency: 'USD',
              location_name: 'City Palace',
              address: 'Tulsi Marg, Gangori Bazaar, J.D.A. Market, Jaipur',
              latitude: 26.9258,
              longitude: 75.8236,
              travel_time_from_previous_minutes: 10,
              booking_required: false
            },
            {
              time: '13:00',
              title: 'Jantar Mantar UNESCO Astronomical Observatory',
              description: 'Discover the world’s largest stone sundial (Vrihat Samrat Yantra) calculating Jaipur local time to 2 seconds precision.',
              category: 'culture',
              estimated_duration_minutes: 75,
              estimated_cost: 6,
              currency: 'USD',
              location_name: 'Jantar Mantar',
              address: 'Gangori Bazaar, J.D.A. Market, Jaipur',
              latitude: 26.9248,
              longitude: 75.8246,
              travel_time_from_previous_minutes: 5,
              booking_required: false
            },
            {
              time: '15:30',
              title: 'Solo Exploration of Bapu Bazaar & Johari Bazaar',
              description: 'Bargain for handmade camel leather juttis, blue pottery coasters, block-printed scarves, and silver trinkets.',
              category: 'shopping',
              estimated_duration_minutes: 130,
              estimated_cost: 15,
              currency: 'USD',
              location_name: 'Bapu Bazaar',
              address: 'Bapu Bazaar, Biseswarji, Jaipur',
              latitude: 26.9189,
              longitude: 75.8214,
              travel_time_from_previous_minutes: 15,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'breakfast',
              restaurant_or_area: 'Tattoo Cafe opposite Hawa Mahal',
              cuisine: 'South Indian Dosa and Fresh Juice',
              estimated_cost: 6,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Laxmi Mishthan Bhandar (LMB)',
              cuisine: 'Royal Rajasthani Thali with Dal Baati Churma',
              estimated_cost: 16,
              currency: 'USD',
              dietary_friendly: ['Pure Vegetarian']
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Peacock Rooftop Restaurant at Hotel Pearl Palace',
              cuisine: 'Mughlai paneer tikka & tandoori rotis in a garden terrace',
              estimated_cost: 12,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            }
          ],
          estimated_daily_cost: 67,
          travel_tips: [
            'Composite ticket allows entry into Amber, Albert Hall, Hawa Mahal, and Jantar Mantar at a steep discount.',
            'Keep cash ready in small denominations (₹50, ₹100, ₹200) for street shopping.'
          ]
        },
        {
          day_number: 3,
          date: '2026-11-08',
          theme: 'Temple Monasteries, Artisan Workshops & Farewell Chai',
          activities: [
            {
              time: '08:30',
              title: 'Galta Ji (Sacred Monkey Gorge Temple)',
              description: 'Hike into the rugged mountain crevice to view natural springs and ancient pavilions frequented by holy sadhus and langurs.',
              category: 'culture',
              estimated_duration_minutes: 100,
              estimated_cost: 5,
              currency: 'USD',
              location_name: 'Galtaji Temple',
              address: 'Galta Ji, Khania-Balaji, Jaipur',
              latitude: 26.9168,
              longitude: 75.8617,
              travel_time_from_previous_minutes: 0,
              booking_required: false
            },
            {
              time: '11:30',
              title: 'Albert Hall Museum & Ram Niwas Gardens',
              description: 'Walk through the grand Victorian Indo-Saracenic gallery housing 16th-century Persian carpets and Egyptian antiquities.',
              category: 'sightseeing',
              estimated_duration_minutes: 90,
              estimated_cost: 6,
              currency: 'USD',
              location_name: 'Albert Hall Museum',
              address: 'Ram Niwas Garden, Kailash Puri, Adarsh Nagar, Jaipur',
              latitude: 26.9116,
              longitude: 75.8195,
              travel_time_from_previous_minutes: 20,
              booking_required: false
            },
            {
              time: '14:30',
              title: 'Artisan Woodblock Printing Studio Visit',
              description: 'Try your own hand at stamping natural indigo and turmeric dyes onto cotton canvas napkins to take home.',
              category: 'culture',
              estimated_duration_minutes: 75,
              estimated_cost: 10,
              currency: 'USD',
              location_name: 'Anokhi Workshop Studio',
              address: 'Near Amber Kheri Gate, Jaipur',
              latitude: 26.9932,
              longitude: 75.8517,
              travel_time_from_previous_minutes: 25,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'breakfast',
              restaurant_or_area: 'Samrat Restaurant',
              cuisine: 'Fresh Jalebi & Samosa',
              estimated_cost: 4,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Gulab Ji Chai Wale & Cafe Palladio',
              cuisine: 'Sandwiches, Mediterranean dips, and aromatic tea',
              estimated_cost: 11,
              currency: 'USD',
              dietary_friendly: ['Vegetarian']
            }
          ],
          estimated_daily_cost: 36,
          travel_tips: [
            'Do not carry loose food or open snacks near monkey troops at Galta Ji.',
            'Pack hand sanitizer and wet wipes for bazaar tasting sessions.'
          ]
        }
      ],
      accommodation_suggestions: [
        {
          area_name: 'Bani Park / C-Scheme',
          why_recommended: 'Safe, leafy neighborhood popular with solo travelers, with charming boutique heritage homestays near the railway and metro.',
          suggested_property_types: ['Boutique Heritage Haveli', 'Top-rated Solo Hostel'],
          estimated_nightly_rate: 45,
          currency: 'USD'
        }
      ],
      transportation_tips: [
        'Use the Jaipur Metro for fast north-south connections between Mansarovar and Badi Chaupar.',
        'Use Ola or Uber auto-rickshaws with upfront metered rates to prevent overcharging.'
      ],
      packing_checklist: [
        'Sun hat & polarized sunglasses',
        'Scarf for covering shoulders at temples',
        'Sturdy slip-on walking shoes for frequent temple entry',
        'Power bank for extensive photography'
      ],
      important_notes: [
        'City Palace museum entry ticket does not include the private Chandra Mahal suites (requires separate premium royal pass).',
        'Most bazaars shut on Sunday evenings.'
      ],
      budget_assumptions: [
        'Based on single occupancy boutique room and public auto-rickshaws.',
        'Entry ticket prices reflect standard international/domestic tourist rates.'
      ]
    }
  },
  {
    id: 'sample-scenario-b',
    title: 'Romantic Coastal Escape: Amalfi & Positano',
    destination: 'Amalfi Coast, Italy',
    origin: 'Rome, Italy',
    start_date: '2026-09-12',
    end_date: '2026-09-15',
    travelers: 2,
    trip_type: 'couple',
    budget: 1800,
    currency: 'EUR',
    is_sample: true,
    scenario_tag: 'Scenario B: Romantic Couple Vacation',
    status: 'upcoming',
    cover_image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-18T14:00:00Z',
    updated_at: '2026-10-18T14:00:00Z',
    preferences: {
      destination: 'Amalfi Coast, Italy',
      origin: 'Rome, Italy',
      start_date: '2026-09-12',
      end_date: '2026-09-15',
      travelers: 2,
      trip_type: 'couple',
      total_budget: 1800,
      currency: 'EUR',
      budget_tier: 'premium',
      daily_pace: 'relaxed',
      interests: ['Scenic views', 'Food and local cuisine', 'Beaches', 'Romantic dining', 'Photography']
    },
    itinerary_json: {
      trip_title: 'La Dolce Vita: Romantic Amalfi Coast & Positano Escapade',
      destination: 'Amalfi Coast, Italy',
      summary: 'A breathtaking 4-day romantic itinerary featuring cliffside sunset dinners, private wooden gozzo boat cruises, lemon grove tastings, and tranquil terrace views in Ravello.',
      travel_dates: { start_date: '2026-09-12', end_date: '2026-09-15' },
      travelers: 2,
      currency: 'EUR',
      budget: {
        total_budget: 1800,
        estimated_total: 1640,
        transportation: 260,
        accommodation: 720,
        food: 420,
        activities: 180,
        local_transport: 40,
        miscellaneous: 20
      },
      days: [
        {
          day_number: 1,
          date: '2026-09-12',
          theme: 'Arrival in Positano: Pastel Cascades & Welcome Spritz',
          activities: [
            {
              time: '14:00',
              title: 'Check-in & Terrace Toast overlooking Positano Bay',
              description: 'Settle into your cliffside sea-view room and toast with chilled prosecco overlooking the cascading pastel houses.',
              category: 'relaxation',
              estimated_duration_minutes: 60,
              estimated_cost: 0,
              currency: 'EUR',
              location_name: 'Positano Bay Vista',
              address: 'Via Cristoforo Colombo, 84017 Positano SA, Italy',
              latitude: 40.6281,
              longitude: 14.4850,
              travel_time_from_previous_minutes: 0,
              booking_required: false
            },
            {
              time: '16:00',
              title: 'Stroll Spiaggia Grande & Artisan Boutiques',
              description: 'Walk down bougainvillea-draped stone stairs, browsing bespoke linen dresses, handmade leather sandals, and ceramic artisans.',
              category: 'shopping',
              estimated_duration_minutes: 120,
              estimated_cost: 30,
              currency: 'EUR',
              location_name: 'Spiaggia Grande',
              address: 'Positano Beachfront, 84017 Positano SA',
              latitude: 40.6285,
              longitude: 14.4862,
              travel_time_from_previous_minutes: 15,
              booking_required: false
            },
            {
              time: '19:30',
              title: 'Sunset Aperitivo on Cliffside Balcony',
              description: 'Enjoy handcrafted limoncello spritzes and local olives as the sun sinks into the Tyrrhenian Sea.',
              category: 'relaxation',
              estimated_duration_minutes: 75,
              estimated_cost: 40,
              currency: 'EUR',
              location_name: 'Franco’s Bar Terrace',
              address: 'Via Cristoforo Colombo, 30, Positano SA',
              latitude: 40.6290,
              longitude: 14.4855,
              travel_time_from_previous_minutes: 10,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Ristorante La Cambusa or Chez Black',
              cuisine: 'Fresh Spaghetti alle Vongole and Grilled Sea Bass',
              estimated_cost: 110,
              currency: 'EUR',
              dietary_friendly: ['Seafood', 'Gluten-free available']
            }
          ],
          estimated_daily_cost: 180,
          travel_tips: ['Wear comfortable flat sandals; Positano consists almost entirely of stone stairs.']
        },
        {
          day_number: 2,
          date: '2026-09-13',
          theme: 'Private Wooden Gozzo Boat Tour to Capri & Hidden Sea Grottos',
          activities: [
            {
              time: '09:30',
              title: 'Half-Day Private Wooden Boat Cruise along Coast',
              description: 'Cruise along the dramatic coastal cliffs, passing the iconic Faraglioni rocks, White Grotto, and diving into emerald cove waters.',
              category: 'adventure',
              estimated_duration_minutes: 240,
              estimated_cost: 120,
              currency: 'EUR',
              location_name: 'Positano Pier Boat Launch',
              latitude: 40.6280,
              longitude: 14.4868,
              travel_time_from_previous_minutes: 0,
              booking_required: true
            },
            {
              time: '15:30',
              title: 'Fornillo Beach Lounging',
              description: 'Relax on quiet sun loungers at Positano’s more secluded beach accessible via the romantic cliffside Lovers’ Walk.',
              category: 'beaches',
              estimated_duration_minutes: 120,
              estimated_cost: 30,
              currency: 'EUR',
              location_name: 'Fornillo Beach',
              latitude: 40.6270,
              longitude: 14.4815,
              travel_time_from_previous_minutes: 15,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'breakfast',
              restaurant_or_area: 'Hotel Panoramic Terrace',
              cuisine: 'Espresso, freshly baked brioche & seasonal figs',
              estimated_cost: 20,
              currency: 'EUR',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Da Adolfo (boat shuttle cove)',
              cuisine: 'Mozzarella grilled on lemon leaves & pitcher of white wine with peaches',
              estimated_cost: 85,
              currency: 'EUR',
              dietary_friendly: ['Seafood']
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Ristorante Max',
              cuisine: 'Candlelit dining surrounded by antique art & handmade pasta',
              estimated_cost: 130,
              currency: 'EUR',
              dietary_friendly: []
            }
          ],
          estimated_daily_cost: 385,
          travel_tips: ['Reserve boat excursions at least 2 weeks ahead during peak summer/autumn months.']
        },
        {
          day_number: 3,
          date: '2026-09-14',
          theme: 'High Ravello Gardens & Historic Amalfi Maritime Republic',
          activities: [
            {
              time: '10:00',
              title: 'Villa Cimbrone Infinity Terrace (Terrazza dell’Infinito)',
              description: 'Stand at the world-renowned panoramic balcony lined with classical marble busts overlooking the azure horizon 1,200 feet above the sea.',
              category: 'sightseeing',
              estimated_duration_minutes: 90,
              estimated_cost: 20,
              currency: 'EUR',
              location_name: 'Villa Cimbrone Gardens',
              address: 'Via Santa Chiara, 26, 84010 Ravello SA',
              latitude: 40.6471,
              longitude: 14.6115,
              travel_time_from_previous_minutes: 30,
              booking_required: false
            },
            {
              time: '12:30',
              title: 'Villa Rufolo Moorish Cloisters & Floral Cascades',
              description: 'Explore the 13th-century palace that inspired composer Richard Wagner, with breathtaking cypress and flower gardens.',
              category: 'culture',
              estimated_duration_minutes: 75,
              estimated_cost: 16,
              currency: 'EUR',
              location_name: 'Villa Rufolo',
              address: 'Piazza Duomo, 84010 Ravello SA',
              latitude: 40.6504,
              longitude: 14.6127,
              travel_time_from_previous_minutes: 10,
              booking_required: false
            },
            {
              time: '15:30',
              title: 'Amalfi Duomo & Cloister of Paradise',
              description: 'Marvel at the Arab-Norman striped cathedral facade and 62-step staircase dominating Piazza del Duomo.',
              category: 'culture',
              estimated_duration_minutes: 60,
              estimated_cost: 10,
              currency: 'EUR',
              location_name: 'Duomo di Amalfi',
              address: 'Piazza Duomo, 1, 84011 Amalfi SA',
              latitude: 40.6343,
              longitude: 14.6027,
              travel_time_from_previous_minutes: 20,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Cumpa’ Cosimo in Ravello',
              cuisine: 'Mamma Netta’s 5-pasta sampler plate & house aglianico wine',
              estimated_cost: 65,
              currency: 'EUR',
              dietary_friendly: ['Vegetarian options']
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Lido Azzurro (Amalfi Port)',
              cuisine: 'Seaside candlelit dining with fresh catch of the day',
              estimated_cost: 120,
              currency: 'EUR',
              dietary_friendly: ['Seafood']
            }
          ],
          estimated_daily_cost: 231,
          travel_tips: ['Take the ferry between Amalfi and Positano rather than the crowded coastal bus for magnificent water views.']
        },
        {
          day_number: 4,
          date: '2026-09-15',
          theme: 'Lemon Terraces, Farewell Gelato & Departure',
          activities: [
            {
              time: '10:00',
              title: 'Scenic Lemon Orchard Walk & Limoncello Tasting',
              description: 'Wander shaded terraced groves of fragrant Sfusato Amalfitano lemons and learn generational liqueur-making secrets.',
              category: 'food',
              estimated_duration_minutes: 90,
              estimated_cost: 35,
              currency: 'EUR',
              location_name: 'Amalfi Lemon Farm',
              latitude: 40.6375,
              longitude: 14.6010,
              travel_time_from_previous_minutes: 0,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Pasticceria Pansa Amalfi (since 1830)',
              cuisine: 'Delizia al Limone pastries & double espresso',
              estimated_cost: 22,
              currency: 'EUR',
              dietary_friendly: ['Vegetarian']
            }
          ],
          estimated_daily_cost: 57,
          travel_tips: ['Pack lemon candies and sealed bottles of authentic limoncello in checked luggage.']
        }
      ],
      accommodation_suggestions: [
        {
          area_name: 'Positano Cliffside / Fornillo Area',
          why_recommended: 'Intimate, picturesque setting with sweeping balconies, away from loud port ferry crowds while maintaining walkability.',
          suggested_property_types: ['Boutique Sea-view Hotel', 'Historic Romantic Villa'],
          estimated_nightly_rate: 240,
          currency: 'EUR'
        }
      ],
      transportation_tips: [
        'Travel by high-speed train from Rome to Salerno, then board the 40-minute scenic public ferry directly to Positano.',
        'Avoid renting large cars due to extremely narrow, winding cliff roads and prohibitive parking fees.'
      ],
      packing_checklist: [
        'Linen resort wear & stylish evening attire',
        'Sturdy flat espadrilles or rubber-soled deck shoes',
        'Swimsuits & compact quick-dry beach towels',
        'Sunscreen SPF 50 & sun hat'
      ],
      important_notes: [
        'Positano porters are available at the pier to transport luggage up the steep stairs for ~€15/bag.',
        'Ravello is located 350 meters above sea level and is 2-3 degrees cooler than the beach.'
      ],
      budget_assumptions: [
        'Total budget calculated for two adults sharing one premium room.',
        'Dining estimates include wine pairings and service fees.'
      ]
    }
  },
  {
    id: 'sample-scenario-c',
    title: 'Alpine Thrills: Interlaken & Swiss Peaks',
    destination: 'Interlaken & Swiss Alps, Switzerland',
    origin: 'Zurich, Switzerland',
    start_date: '2026-08-05',
    end_date: '2026-08-08',
    travelers: 4,
    trip_type: 'friends',
    budget: 3200,
    currency: 'CHF',
    is_sample: true,
    scenario_tag: 'Scenario C: Group Adventure Trip',
    status: 'upcoming',
    cover_image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-15T09:00:00Z',
    updated_at: '2026-10-15T09:00:00Z',
    preferences: {
      destination: 'Interlaken & Swiss Alps, Switzerland',
      origin: 'Zurich, Switzerland',
      start_date: '2026-08-05',
      end_date: '2026-08-08',
      travelers: 4,
      trip_type: 'friends',
      total_budget: 3200,
      currency: 'CHF',
      budget_tier: 'standard',
      daily_pace: 'packed',
      interests: ['Adventure and outdoor activities', 'Nature and scenic views', 'Photography']
    },
    itinerary_json: {
      trip_title: 'Alpine Adrenaline: 4-Day Friends Adventure in Interlaken',
      destination: 'Interlaken & Swiss Alps, Switzerland',
      summary: 'An action-packed group trip across the Bernese Oberland featuring cliff walks, glacial valleys, canyoning or paragliding over turquoise lakes, and mountain cheese fondue.',
      travel_dates: { start_date: '2026-08-05', end_date: '2026-08-08' },
      travelers: 4,
      currency: 'CHF',
      budget: {
        total_budget: 3200,
        estimated_total: 2980,
        transportation: 680,
        accommodation: 980,
        food: 640,
        activities: 520,
        local_transport: 120,
        miscellaneous: 40
      },
      days: [
        {
          day_number: 1,
          date: '2026-08-05',
          theme: 'Glacier Lakes & Tandem Paragliding Arrival',
          activities: [
            {
              time: '10:00',
              title: 'Arrival & Scenic Lake Brienz Jet Boat or Kayaking',
              description: 'Paddle across glacial turquoise waters surrounded by plunging forested cliffs and Giessbach waterfall views.',
              category: 'adventure',
              estimated_duration_minutes: 120,
              estimated_cost: 60,
              currency: 'CHF',
              location_name: 'Lake Brienz Watersport Center',
              latitude: 46.7020,
              longitude: 7.9540,
              travel_time_from_previous_minutes: 0,
              booking_required: true
            },
            {
              time: '14:30',
              title: 'Tandem Paragliding over Interlaken',
              description: 'Launch from Beatenberg with certified tandem pilots, soaring over the twin lakes with the Eiger, Mönch, and Jungfrau peaks as your backdrop.',
              category: 'adventure',
              estimated_duration_minutes: 90,
              estimated_cost: 160,
              currency: 'CHF',
              location_name: 'Höhematte Landing Field',
              latitude: 46.6863,
              longitude: 7.8632,
              travel_time_from_previous_minutes: 20,
              booking_required: true
            },
            {
              time: '17:30',
              title: 'Harder Kulm Funicular & Two-Lakes Bridge',
              description: 'Ride the steep funicular to 1,322m altitude and stand on the glass-floored viewing platform protruding over the valley.',
              category: 'sightseeing',
              estimated_duration_minutes: 75,
              estimated_cost: 32,
              currency: 'CHF',
              location_name: 'Harder Kulm',
              latitude: 46.6983,
              longitude: 7.8650,
              travel_time_from_previous_minutes: 15,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Aarmühle Bistro Interlaken',
              cuisine: 'Gourmet burgers & Swiss potato rösti',
              estimated_cost: 26,
              currency: 'CHF',
              dietary_friendly: []
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Harder Kulm Panorama Restaurant',
              cuisine: 'Traditional alpine cheese fondue with crusty bread and cured meats',
              estimated_cost: 45,
              currency: 'CHF',
              dietary_friendly: ['Vegetarian available']
            }
          ],
          estimated_daily_cost: 323,
          travel_tips: ['Paragliding is weather dependent; book on your first afternoon to allow backup slots.']
        },
        {
          day_number: 2,
          date: '2026-08-06',
          theme: 'Lauterbrunnen Valley of 72 Waterfalls & Mürren Cliff Trail',
          activities: [
            {
              time: '09:00',
              title: 'Staubbach Falls & Trümmelbach Underground Glacial Falls',
              description: 'Walk through Lauterbrunnen valley and take the cave elevator into the mountain to witness up to 20,000 liters of melted glacial water roaring per second.',
              category: 'nature',
              estimated_duration_minutes: 150,
              estimated_cost: 14,
              currency: 'CHF',
              location_name: 'Trümmelbach Falls',
              latitude: 46.5935,
              longitude: 7.9090,
              travel_time_from_previous_minutes: 25,
              booking_required: false
            },
            {
              time: '13:00',
              title: 'Cableway to Car-Free Mürren & Allmendhubel Trail',
              description: 'Ascend to the idyllic cliffside village and hike the Flower Trail with 360-degree views of the Eiger North Face.',
              category: 'adventure',
              estimated_duration_minutes: 180,
              estimated_cost: 24,
              currency: 'CHF',
              location_name: 'Mürren Alpine Village',
              latitude: 46.5594,
              longitude: 7.8931,
              travel_time_from_previous_minutes: 20,
              booking_required: false
            }
          ],
          meals: [
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Hotel Edelweiss Mürren Balcony',
              cuisine: 'Alpine macaroni (Älplermagronen) with applesauce',
              estimated_cost: 28,
              currency: 'CHF',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Hüsi Bierhaus Interlaken',
              cuisine: 'Swiss craft beer flights, schnitzels, and roasted sausages',
              estimated_cost: 38,
              currency: 'CHF',
              dietary_friendly: []
            }
          ],
          estimated_daily_cost: 104,
          travel_tips: ['Wear waterproof gear for the Trümmelbach cave spray.']
        },
        {
          day_number: 3,
          date: '2026-08-07',
          theme: 'Grindelwald First: Cliff Walk, First Glider & Bachalpsee Alpine Hike',
          activities: [
            {
              time: '08:30',
              title: 'First Cliff Walk by Tissot',
              description: 'Walk the suspended single-rope metal footbridge wrapping around the sheer rock face with a 45-meter platform hanging over the abyss.',
              category: 'adventure',
              estimated_duration_minutes: 60,
              estimated_cost: 36,
              currency: 'CHF',
              location_name: 'Grindelwald First Cliff Walk',
              latitude: 46.6242,
              longitude: 8.0414,
              travel_time_from_previous_minutes: 35,
              booking_required: false
            },
            {
              time: '10:30',
              title: 'Hike to Pristine Bachalpsee Lake',
              description: 'Hike 50 minutes along gentle alpine pastures to the mirror-smooth glacial lake reflecting the Schreckhorn peak.',
              category: 'nature',
              estimated_duration_minutes: 120,
              estimated_cost: 0,
              currency: 'CHF',
              location_name: 'Bachalpsee Lake',
              latitude: 46.6692,
              longitude: 8.0210,
              travel_time_from_previous_minutes: 10,
              booking_required: false
            },
            {
              time: '14:00',
              title: 'First Flyer Zip-rider & Mountain Carts Downhill',
              description: 'Fly at 84 km/h strapped into a 4-person glider harness, then pilot mountain 3-wheel go-carts down the paved cow paths to Bort.',
              category: 'adventure',
              estimated_duration_minutes: 120,
              estimated_cost: 50,
              currency: 'CHF',
              location_name: 'Grindelwald Adventure Station',
              latitude: 46.6350,
              longitude: 8.0380,
              travel_time_from_previous_minutes: 15,
              booking_required: true
            }
          ],
          meals: [
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Berggasthaus First',
              cuisine: 'Hot goulash soup and local Emmental cheese platters',
              estimated_cost: 25,
              currency: 'CHF',
              dietary_friendly: ['Vegetarian']
            },
            {
              meal_type: 'dinner',
              restaurant_or_area: 'Barry’s Restaurant Grindelwald',
              cuisine: 'Mongolian raclette grill table & steaks',
              estimated_cost: 52,
              currency: 'CHF',
              dietary_friendly: []
            }
          ],
          estimated_daily_cost: 163,
          travel_tips: ['Mountain cart packages are cheaper when bundled with the First gondola pass.']
        },
        {
          day_number: 4,
          date: '2026-08-08',
          theme: 'Jungfraujoch - Top of Europe Summit Excursion',
          activities: [
            {
              time: '08:30',
              title: 'Eiger Express Tricable Gondola & High Alpine Ice Palace',
              description: 'Ascend to Europe’s highest railway station (3,454m), walk through sculpted blue ice tunnels, and step out onto the Sphinx Terrace overlooking the Great Aletsch Glacier.',
              category: 'sightseeing',
              estimated_duration_minutes: 240,
              estimated_cost: 140,
              currency: 'CHF',
              location_name: 'Jungfraujoch Top of Europe',
              latitude: 46.5475,
              longitude: 7.9854,
              travel_time_from_previous_minutes: 40,
              booking_required: true
            }
          ],
          meals: [
            {
              meal_type: 'lunch',
              restaurant_or_area: 'Restaurant Crystal at Jungfraujoch',
              cuisine: 'Alpine barley soup & Swiss chocolate desserts',
              estimated_cost: 35,
              currency: 'CHF',
              dietary_friendly: ['Vegetarian']
            }
          ],
          estimated_daily_cost: 175,
          travel_tips: ['Dress in full thermal layers for Jungfraujoch; temperatures remain sub-zero even in August.']
        }
      ],
      accommodation_suggestions: [
        {
          area_name: 'Interlaken West / Unterseen',
          why_recommended: 'Central hub with direct train connections to both valleys (Lauterbrunnen and Grindelwald), bustling pub scene, and grocery co-ops.',
          suggested_property_types: ['4-Bedroom Chalet Apartment', 'Adventure Lodge Private Quad'],
          estimated_nightly_rate: 245,
          currency: 'CHF'
        }
      ],
      transportation_tips: [
        'Purchase the Swiss Travel Pass or Berner Oberland Pass for free or 50% discounted travel on almost all trains, boats, and mountain lifts.',
        'Trains run like clockwork every 30 minutes between Interlaken Ost and both mountain valleys.'
      ],
      packing_checklist: [
        'Sturdy ankle-support hiking boots',
        'Windproof & waterproof Gore-Tex rain jacket',
        'Reusable water bladder / thermal bottle',
        'Trekking poles for rocky mountain descents',
        'High-UV mountain sunglasses'
      ],
      important_notes: [
        'Altitude at Jungfraujoch (3,454m) causes mild shortness of breath; walk at a deliberate pace and hydrate well.',
        'Activity bundle tickets save 20-30% compared to individual tickets.'
      ],
      budget_assumptions: [
        'Total budget calculated for a group of 4 sharing a full chalet.',
        'Transport budget accounts for Berner Oberland regional passes.'
      ]
    }
  }
];
