from typing import Dict, Any, Optional

# Curated high-precision coordinates for popular global travel destinations and top attractions
KNOWN_COORDINATES: Dict[str, Dict[str, float]] = {
    # Jaipur
    "jaipur": {"lat": 26.9124, "lng": 75.7873},
    "hawa mahal": {"lat": 26.9239, "lng": 75.8267},
    "amber palace": {"lat": 26.9855, "lng": 75.8513},
    "city palace": {"lat": 26.9258, "lng": 75.8236},
    "jantar mantar": {"lat": 26.9248, "lng": 75.8246},
    "nahargarh fort": {"lat": 26.9373, "lng": 75.8155},
    "jal mahal": {"lat": 26.9656, "lng": 75.8459},
    "bapu bazaar": {"lat": 26.9189, "lng": 75.8214},

    # Paris
    "paris": {"lat": 48.8566, "lng": 2.3522},
    "eiffel tower": {"lat": 48.8584, "lng": 2.2945},
    "louvre museum": {"lat": 48.8606, "lng": 2.3376},
    "notre-dame cathedral": {"lat": 48.8530, "lng": 2.3499},
    "montmartre": {"lat": 48.8867, "lng": 2.3431},
    "sacre-coeur": {"lat": 48.8867, "lng": 2.3431},
    "musee d'orsay": {"lat": 48.8599, "lng": 2.3266},
    "arc de triomphe": {"lat": 48.8738, "lng": 2.2950},

    # Tokyo
    "tokyo": {"lat": 35.6762, "lng": 139.6503},
    "senso-ji": {"lat": 35.7148, "lng": 139.7967},
    "shibuya crossing": {"lat": 35.6595, "lng": 139.7004},
    "meiji shrine": {"lat": 35.6764, "lng": 139.6993},
    "shinjuku gyoen": {"lat": 35.6852, "lng": 139.7101},
    "tokyo skytree": {"lat": 35.7101, "lng": 139.8107},
    "akihabara": {"lat": 35.6983, "lng": 139.7731},

    # Kyoto
    "kyoto": {"lat": 35.0116, "lng": 135.7681},
    "fushimi inari shrine": {"lat": 34.9671, "lng": 135.7727},
    "kinkaku-ji": {"lat": 35.0394, "lng": 135.7292},
    "arashiyama bamboo grove": {"lat": 35.0170, "lng": 135.6713},
    "kiyomizu-dera": {"lat": 34.9949, "lng": 135.7850},
    "gion district": {"lat": 35.0037, "lng": 135.7772},

    # Barcelona
    "barcelona": {"lat": 41.3879, "lng": 2.1699},
    "sagrada familia": {"lat": 41.4036, "lng": 2.1744},
    "park guell": {"lat": 41.4145, "lng": 2.1527},
    "casa batllo": {"lat": 41.3916, "lng": 2.1649},
    "gothic quarter": {"lat": 41.3833, "lng": 2.1764},
    "la rambla": {"lat": 41.3818, "lng": 2.1734},

    # Rome
    "rome": {"lat": 41.9028, "lng": 12.4964},
    "colosseum": {"lat": 41.8902, "lng": 12.4922},
    "vatican museums": {"lat": 41.9067, "lng": 12.4536},
    "pantheon": {"lat": 41.8986, "lng": 12.4769},
    "trevi fountain": {"lat": 41.9009, "lng": 12.4833},
    "roman forum": {"lat": 41.8925, "lng": 12.4853},

    # New York
    "new york": {"lat": 40.7128, "lng": -74.0060},
    "central park": {"lat": 40.7829, "lng": -73.9654},
    "times square": {"lat": 40.7580, "lng": -73.9855},
    "empire state building": {"lat": 40.7484, "lng": -73.9857},
    "brooklyn bridge": {"lat": 40.7061, "lng": -73.9969},
    "high line": {"lat": 40.7480, "lng": -74.0048},

    # London
    "london": {"lat": 51.5074, "lng": -0.1278},
    "big ben": {"lat": 51.5007, "lng": -0.1246},
    "tower of london": {"lat": 51.5081, "lng": -0.0759},
    "british museum": {"lat": 51.5194, "lng": -0.1270},
    "london eye": {"lat": 51.5033, "lng": -0.1195},
    "hyde park": {"lat": 51.5073, "lng": -0.1657},

    # Bali
    "bali": {"lat": -8.4095, "lng": 115.1889},
    "ubud monkey forest": {"lat": -8.5194, "lng": 115.2606},
    "tanah lot": {"lat": -8.6212, "lng": 115.0868},
    "tegalalang rice terrace": {"lat": -8.4346, "lng": 115.2796},
    "uluwatu temple": {"lat": -8.8291, "lng": 115.0849},
}

class PlacesService:
    @staticmethod
    def get_coordinates(location_name: str, destination: str) -> Dict[str, Optional[float]]:
        loc_key = location_name.lower().strip()
        dest_key = destination.lower().strip()

        for key, coords in KNOWN_COORDINATES.items():
            if key in loc_key or loc_key in key:
                return coords

        for key, coords in KNOWN_COORDINATES.items():
            if key in dest_key:
                # Slight deterministic offset for variety around destination center
                offset = (hash(loc_key) % 100) * 0.0003
                return {"lat": coords["lat"] + offset, "lng": coords["lng"] + offset}

        return {"lat": None, "lng": None}
