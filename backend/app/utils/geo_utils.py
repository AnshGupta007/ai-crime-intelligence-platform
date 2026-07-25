import random


KARNATAKA_BOUNDS = {"min_lat": 11.5, "max_lat": 18.5, "min_lon": 74.0, "max_lon": 78.5}


def random_karnataka_location():
    return {
        "latitude": round(random.uniform(KARNATAKA_BOUNDS["min_lat"], KARNATAKA_BOUNDS["max_lat"]), 6),
        "longitude": round(random.uniform(KARNATAKA_BOUNDS["min_lon"], KARNATAKA_BOUNDS["max_lon"]), 6),
    }


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    from math import asin, cos, radians, sin, sqrt
    R = 6371000
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return R * 2 * asin(sqrt(a))
