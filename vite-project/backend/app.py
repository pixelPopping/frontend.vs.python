from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)
from functools import wraps, lru_cache
from dotenv import load_dotenv
from datetime import datetime, timedelta, UTC

import jwt
import os
import requests

# ---------------- ENV ----------------
load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017/"
)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "super_secret_key_123456789_secure"
)

# ---------------- APP ----------------
app = Flask(__name__)

# ---------------- CORS ----------------
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:5173"
        }
    },
    supports_credentials=True,
)

# ---------------- MONGO ----------------
client = MongoClient(MONGO_URI)

db = client["space_app"]

users = db["users"]
missions = db["missions"]

# ---------------- HELPERS ----------------
def is_valid(value):

    return (
        value is not None
        and str(value).strip() != ""
    )

# ---------------- SPACEX ----------------
BASE = "https://api.spacexdata.com/v4"

@lru_cache(maxsize=1)
def get_rockets():

    return requests.get(
        f"{BASE}/rockets"
    ).json()

@lru_cache(maxsize=1)
def get_launchpads():

    return requests.get(
        f"{BASE}/launchpads"
    ).json()

@lru_cache(maxsize=1)
def get_landpads():

    return requests.get(
        f"{BASE}/landpads"
    ).json()

def build_maps():

    rockets = {
        r["id"]: r
        for r in get_rockets()
    }

    launchpads = {
        l["id"]: l
        for l in get_launchpads()
    }

    landpads = {
        l["id"]: l
        for l in get_landpads()
    }

    return rockets, launchpads, landpads

# ---------------- ENRICH ----------------
def enrich_mission(
    mission,
    users_collection
):

    rockets_map, launchpads_map, landpads_map = (
        build_maps()
    )

    mission = dict(mission)

    mission["_id"] = str(
        mission["_id"]
    )

    users_map = {

        str(u["_id"]): u

        for u in users_collection.find()
    }

    # ---------------- CAPTAIN ----------------
    captain_id = str(
        mission.get("captain", "")
    )

    captain_user = users_map.get(
        captain_id
    )

    mission["captain"] = (

        f"{captain_user.get('firstname', '')} "
        f"{captain_user.get('lastname', '')}"

    ).strip() if captain_user else "Unknown"

    # ---------------- CREW ----------------
    crew_ids = [

        str(c)

        for c in mission.get(
            "crew",
            []
        )
    ]

    mission["crew"] = [

        f"{users_map.get(uid, {}).get('firstname', '')} "
        f"{users_map.get(uid, {}).get('lastname', '')}".strip()

        for uid in crew_ids

        if users_map.get(uid)
    ]

    # ---------------- SPACEX ----------------
    mission["rocket"] = rockets_map.get(
        mission.get("rocket")
    )

    mission["launchPad"] = launchpads_map.get(
        mission.get("launchPad")
    )

    mission["landingPad"] = landpads_map.get(
        mission.get("landingPad")
    )

    # ---------------- DEFAULTS ----------------
    mission["title"] = (
        mission.get("title")
        or "Untitled Mission"
    )

    mission["description"] = (
        mission.get("description")
        or "No description"
    )

    mission["status"] = (
        mission.get("status")
        or "pending"
    )

    mission["city"] = (
        mission.get("city")
        or "Unknown"
    )

    mission["returnDate"] = (
        mission.get("returnDate")
        or "Unknown"
    )

    return mission

# ---------------- AUTH ----------------
def token_required(f):

    @wraps(f)

    def wrapper(*args, **kwargs):

        auth = request.headers.get(
            "Authorization"
        )

        if not auth:

            return jsonify({
                "error": "Token missing"
            }), 401

        try:

            token = auth.split(" ")[1]

            decoded = jwt.decode(

                token,

                SECRET_KEY,

                algorithms=["HS256"]
            )

            request.user = decoded

        except Exception:

            return jsonify({
                "error": "Invalid token"
            }), 401

        return f(*args, **kwargs)

    return wrapper

# ---------------- TEST ----------------
@app.route("/test")
def test():

    return jsonify({
        "message": "Backend OK 🚀"
    })

# ---------------- REGISTER ----------------
@app.route(
    "/api/register",
    methods=["POST"]
)
def register():

    data = request.get_json() or {}

    user = {

        "firstname": data.get(
            "firstname"
        ),

        "lastname": data.get(
            "lastname"
        ),

        "city": data.get(
            "city"
        ),

        "phone": data.get(
            "phone"
        ),

        "email": data.get(
            "email"
        ),

        "password": generate_password_hash(
            data.get("password")
        ),

        "role":

            "captain"

            if data.get("inviteCode")
            == "CAPTAIN123"

            else "crew",

        "createdAt": datetime.now(UTC),
    }

    users.insert_one(user)

    return jsonify({
        "message": "User created"
    }), 201

# ---------------- LOGIN ----------------
@app.route(
    "/api/login",
    methods=["POST"]
)
def login():

    data = request.get_json() or {}

    user = users.find_one({

        "email": data.get("email")
    })

    if (

        not user

        or not check_password_hash(

            user["password"],
            data.get("password")
        )
    ):

        return jsonify({
            "error": "Invalid credentials"
        }), 401

    token = jwt.encode(

        {

            "userId": str(user["_id"]),

            "role": user["role"],

            "exp":

                datetime.now(UTC)

                + timedelta(hours=4),
        },

        SECRET_KEY,

        algorithm="HS256",
    )

    return jsonify({

        "token": token,

        "user": {

            "id": str(user["_id"]),

            "firstname": user["firstname"],

            "lastname": user["lastname"],

            "role": user["role"],
        }
    })

# ---------------- ME ----------------
@app.route(
    "/api/me",
    methods=["GET"]
)
@token_required
def me():

    user = users.find_one({

        "_id": ObjectId(
            request.user["userId"]
        )
    })

    if not user:

        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({

        "id": str(user["_id"]),

        "firstname": user["firstname"],

        "lastname": user["lastname"],

        "role": user["role"],
    })

# ---------------- USERS ----------------
@app.route(
    "/api/users",
    methods=["GET"]
)
@token_required
def get_users():

    role = request.args.get("role")

    query = (
        {"role": role}
        if role
        else {}
    )

    data = users.find(query)

    return jsonify([

        {

            "id": str(u["_id"]),

            "firstname": u["firstname"],

            "lastname": u["lastname"],

            "role": u["role"],
        }

        for u in data
    ])

# ---------------- OPTIONS ----------------
@app.route("/api/mission-options")
def mission_options():

    def clean(items):

        return [

            {

                "id": i.get("id"),

                "name":

                    i.get("name")

                    or i.get("full_name"),
            }

            for i in items

            if i.get("id")
        ]

    return jsonify({

        "rockets": clean(
            get_rockets()
        ),

        "launchpads": clean(
            get_launchpads()
        ),

        "landpads": clean(
            get_landpads()
        ),
    })

# ---------------- GET MISSIONS ----------------
@app.route(
    "/api/missions",
    methods=["GET"]
)
@token_required
def get_missions():

    user = request.user

    user_id = str(
        user["userId"]
    )

    # captain ziet alles
    if user["role"] == "captain":

        data = missions.find()

    # crew ziet alleen assigned
    else:

        data = missions.find({

            "crew": {
                "$in": [user_id]
            }
        })

    enriched = [

        enrich_mission(m, users)

        for m in data
    ]

    return jsonify(enriched)

# ---------------- CREATE MISSION ----------------
@app.route(
    "/api/missions",
    methods=["POST"]
)
@token_required
def create_mission():

    data = request.get_json() or {}

    required = [

        "title",
        "description",
        "city",
        "launchDate",
        "returnDate",
    ]

    missing = [

        field

        for field in required

        if not is_valid(
            data.get(field)
        )
    ]

    if missing:

        return jsonify({

            "error": "Missing fields",

            "fields": missing,
        }), 400

    mission = {

        # ---------------- BASIC ----------------
        "title": data.get(
            "title"
        ),

        "description": data.get(
            "description"
        ),

        # ---------------- STATUS ----------------
        "status": "pending",

        # ---------------- LOCATION ----------------
        "city": data.get(
            "city"
        ),

        # ---------------- PEOPLE ----------------
        "captain": request.user[
            "userId"
        ],

        "crew": data.get(
            "crew",
            []
        ),

        # ---------------- SPACEX ----------------
        "rocket": data.get(
            "rocket"
        ),

        "launchPad": data.get(
            "launchPad"
        ),

        "landingPad": data.get(
            "landingPad"
        ),

        # ---------------- DATES ----------------
        "launchDate": data.get(
            "launchDate"
        ),

        "returnDate": data.get(
            "returnDate"
        ),

        # ---------------- META ----------------
        "createdAt": datetime.now(UTC),
    }

    result = missions.insert_one(
        mission
    )

    created_mission = missions.find_one({

        "_id": result.inserted_id
    })

    enriched = enrich_mission(
        created_mission,
        users
    )

    return jsonify(enriched), 201

# ---------------- ACCEPT ----------------
@app.route(
    "/api/missions/<id>/accept",
    methods=["PUT"]
)
@token_required
def accept_mission(id):

    try:

        mission = missions.find_one({

            "_id": ObjectId(id)
        })

        if not mission:

            return jsonify({
                "error": "Mission not found"
            }), 404

        missions.update_one(

            {"_id": ObjectId(id)},

            {
                "$set": {

                    "status": "accepted",

                    "acceptedAt":
                        datetime.now(UTC),
                }
            }
        )

        updated = missions.find_one({

            "_id": ObjectId(id)
        })

        enriched = enrich_mission(
            updated,
            users
        )

        return jsonify(enriched)

    except InvalidId:

        return jsonify({
            "error": "Invalid mission id"
        }), 400

# ---------------- DELETE ----------------
@app.route(
    "/api/missions/<id>",
    methods=["DELETE"]
)
@token_required
def delete_mission(id):

    try:

        missions.delete_one({

            "_id": ObjectId(id)
        })

        return jsonify({
            "message": "Deleted"
        })

    except InvalidId:

        return jsonify({
            "error": "Invalid mission id"
        }), 400

# ---------------- START ----------------
if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )