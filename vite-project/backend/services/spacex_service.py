import requests
from functools import lru_cache

BASE = "https://api.spacexdata.com/v4"

@lru_cache(maxsize=1)
def get_rockets():
    return requests.get(f"{BASE}/rockets").json()

@lru_cache(maxsize=1)
def get_launchpads():
    return requests.get(f"{BASE}/launchpads").json()

@lru_cache(maxsize=1)
def get_landpads():
    return requests.get(f"{BASE}/landpads").json()


def build_maps():
    rockets = {r["id"]: r for r in get_rockets()}
    launchpads = {l["id"]: l for l in get_launchpads()}
    landpads = {l["id"]: l for l in get_landpads()}

    return rockets, launchpads, landpads