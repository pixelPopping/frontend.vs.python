from .spacex_service import build_maps

def enrich_mission(mission, users_collection):

    rockets_map, launchpads_map, landpads_map = build_maps()

    mission = dict(mission)
    mission["_id"] = str(mission["_id"])

    users_map = {
        str(u["_id"]): u
        for u in users_collection.find()
    }

    crew_ids = mission.get("crew", [])

    mission["crew"] = [
        f"{users_map.get(uid, {}).get('firstname', '')} {users_map.get(uid, {}).get('lastname', '')}".strip()
        for uid in crew_ids
    ]

    mission["rocket"] = rockets_map.get(mission.get("rocket"))
    mission["launchPad"] = launchpads_map.get(mission.get("launchPad"))
    mission["landingPad"] = landpads_map.get(mission.get("landingPad"))

    return mission