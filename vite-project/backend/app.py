from flask import (
    Flask,
    jsonify,
    request,
)

from flask_cors import CORS
from dotenv import load_dotenv
import os

from pymongo import MongoClient

from bson import ObjectId

from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)

from functools import wraps

from datetime import (
    datetime,
    timedelta,
    UTC,
)

import jwt
import requests

# =========================================================
# APP
# =========================================================
app = Flask(__name__)

# =========================================================
# CONFIG
# =========================================================
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not configured")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not configured")

# =========================================================
# CORS
# =========================================================
FRONTEND_ORIGIN = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173"
)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": FRONTEND_ORIGIN
        }
    },
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# =========================================================
# MONGO
# =========================================================
client = MongoClient(MONGO_URI)

db = client["space_app"]

users = db["users"]

missions = db["missions"]
print("DATABASE:", db.name)
print("COLLECTION:", missions.name)

print("✅ MongoDB Connected")

# =========================================================
# TOKEN REQUIRED
# =========================================================
def token_required(f):

    @wraps(f)

    def wrapper(*args, **kwargs):

        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:

            return jsonify({
                "error": "Token missing"
            }), 401

        try:

            token = auth_header.split(
                " "
            )[1]

            decoded = jwt.decode(

                token,

                SECRET_KEY,

                algorithms=["HS256"]
            )

            request.user = decoded

        except Exception as e:

            return jsonify({
                "error": str(e)
            }), 401

        return f(*args, **kwargs)

    return wrapper

# =========================================================
# TEST
# =========================================================
@app.route("/test")
def test():

    return jsonify({
        "message": "Backend works 🚀"
    })

# =========================================================
# REGISTER
# =========================================================
@app.route(
    "/api/register",
    methods=["POST"]
)
def register():

    try:

        data = request.get_json()

        existing_user = users.find_one({
            "username":
                data["username"]
        })

        if existing_user:

            return jsonify({
                "error":
                    "Username already exists"
            }), 400

        role = (
            "captain"
            if data["inviteCode"]
            == "CAPTAIN123"
            else "crew"
        )

        new_user = {
            "username":
                data["username"],

            "password":
                generate_password_hash(
                    data["password"]
                ),

            "inviteCode":
                data["inviteCode"],

            "role":
                role,

            "createdAt":
                datetime.now(UTC),
        }

        users.insert_one(
            new_user
        )

        return jsonify({
            "message":
                "User created"
        })

    except Exception as e:

        return jsonify({
            "error":
                str(e)
        }), 500

# =========================================================
# LOGIN
# =========================================================
@app.route(
    "/api/login",
    methods=["POST"]
)
def login():

    try:

        data = request.get_json()

        user = users.find_one({
            "username":
                data["username"]
        })

        if not user:

            return jsonify({
                "error":
                    "User not found"
            }), 401

        if (
            user["inviteCode"]
            != data["inviteCode"]
        ):
            return jsonify({
                "error":
                    "Invalid invite code"
            }), 401

        password_correct = (
            check_password_hash(
                user["password"],
                data["password"]
            )
        )

        if not password_correct:

            return jsonify({
                "error":
                    "Wrong password"
            }), 401

        token = jwt.encode(
            {
                "userId":
                    str(user["_id"]),

                "role":
                    user["role"],

                "exp":
                    datetime.now(UTC)
                    + timedelta(hours=4),
            },

            SECRET_KEY,

            algorithm="HS256",
        )

        return jsonify({
            "token":
                token,

            "user": {
                "id":
                    str(user["_id"]),

                "username":
                    user["username"],

                "role":
                    user["role"],
            }
        })

    except Exception as e:

        return jsonify({
            "error":
                str(e)
        }), 500

# =========================================================
# CURRENT USER
# =========================================================
@app.route(
    "/api/me",
    methods=["GET"]
)
@token_required
def me():

    try:

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
            "username": user["username"],
            "role": user["role"],
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# GET USERS
# =========================================================
@app.route(
    "/api/users",
    methods=["GET"]
)
@token_required
def get_users():

    try:

        all_users = list(
            users.find()
        )

        formatted_users = [

            {
                "id": str(user["_id"]),
                "username":
                    user.get(
                        "username"
                    ),
                "role":
                    user.get(
                        "role"
                    ),
            }

            for user in all_users
        ]

        return jsonify(
            formatted_users
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# =========================================================
# SPACEX OPTIONS
# =========================================================
@app.route(
    "/api/mission-options",
    methods=["GET"]
)
def mission_options():

    fallback = {

        "rockets": [
            {
                "id": "falcon9",
                "name": "Falcon 9"
            },
            {
                "id": "falconheavy",
                "name": "Falcon Heavy"
            },
            {
                "id": "dragon",
                "name": "Dragon"
            }
        ],

        "ships": [
            {
                "id": "jrti",
                "name": "Just Read The Instructions"
            },
            {
                "id": "ocisly",
                "name": "Of Course I Still Love You"
            }
        ],

        "launchpads": [
            {
                "id": "lc39a",
                "name": "Launch Complex 39A"
            },
            {
                "id": "slc40",
                "name": "SLC-40"
            },
            {
                "id": "slc4e",
                "name": "SLC-4E"
            },
            {
                "id": "starbase",
                "name": "Starbase"
            }
        ],

        "landpads": [
            {
                "id": "lz1",
                "name": "Landing Zone 1"
            },
            {
                "id": "lz2",
                "name": "Landing Zone 2"
            },
            {
                "id": "lz4",
                "name": "Landing Zone 4"
            }
        ]
    }

    try:

        rockets = requests.get(
            "https://api.spacexdata.com/v4/rockets",
            timeout=15
        ).json()

        dragons = requests.get(
            "https://api.spacexdata.com/v4/dragons",
            timeout=15
        ).json()

        ships = requests.get(
            "https://api.spacexdata.com/v4/ships",
            timeout=15
        ).json()

        launchpads = requests.get(
            "https://api.spacexdata.com/v4/launchpads",
            timeout=15
        ).json()

        landpads = requests.get(
            "https://api.spacexdata.com/v4/landpads",
            timeout=15
        ).json()

        return jsonify({

            "rockets": [
                {
                    "id": x["id"],
                    "name": x["name"]
                }
                for x in rockets + dragons
            ],

            "ships": [
                {
                    "id": x["id"],
                    "name": x["name"]
                }
                for x in ships
            ],

            "launchpads": [
                {
                    "id": x["id"],
                    "name": x["name"]
                }
                for x in launchpads
            ],

            "landpads": [
                {
                    "id": x["id"],
                    "name": x["name"]
                }
                for x in landpads
            ]
        })

    except Exception as e:

        print(
            "SPACEX OFFLINE:",
            str(e)
        )

        return jsonify(fallback)
# =========================================================
# CREATE MISSION
# =========================================================
@app.route(
    "/api/missions",
    methods=["POST"]
)
@token_required
def create_mission():

    try:

        data = request.get_json()

        current_user = users.find_one(
            {
                "_id": ObjectId(
                    request.user["userId"]
                )
            }
        )

        if not current_user:

            return jsonify({
                "error":
                    "User not found"
            }), 404

        mission = {

            "title":
                data.get("title"),

            "city":
                data.get("city"),

            "launchDate":
                data.get("launchDate"),

            "returnDate":
                data.get("returnDate"),

            "rocket":
                data.get("rocket"),

            "ship":
                data.get("ship"),

            "launchPad":
                data.get("launchPad"),

            "landingPad":
                data.get("landingPad"),

            "captain":
                current_user["username"],

            "crew":
                data.get("crew", []),

            "status":
                "pending",

            "createdAt":
                datetime.now(UTC),
        }

        result = missions.insert_one(
            mission
        )

        return jsonify({

            "message":
                "Mission created",

            "id":
                str(
                    result.inserted_id
                ),
        })

    except Exception as e:

        return jsonify({
            "error":
                str(e)
        }), 500
# =========================================================
# GET MISSIONS
# =========================================================
@app.route(
    "/api/missions",
    methods=["GET"]
)
@token_required
def get_missions():

    try:

        all_missions = list(
            missions.find()
        )

        formatted_missions = [

            {

                "_id":
                    str(
                        mission["_id"]
                    ),

                "title":
                    mission.get(
                        "title"
                    ),

                "city":
                    mission.get(
                        "city"
                    ),

                "launchDate":
                    mission.get(
                        "launchDate"
                    ),

                "returnDate":
                    mission.get(
                        "returnDate"
                    ),

                "rocket":
                    mission.get(
                        "rocket"
                    ),

                "ship":
                    mission.get(
                        "ship"
                    ),

                "launchPad":
                    mission.get(
                        "launchPad"
                    ),

                "landingPad":
                    mission.get(
                        "landingPad"
                    ),

                "captain":
                    mission.get(
                        "captain"
                    ),

                "crew":
                    mission.get(
                        "crew",
                        []
                    ),

                "status":
                    mission.get(
                        "status"
                    ),
            }

            for mission in all_missions
        ]

        return jsonify(
            formatted_missions
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# =========================================================
# ACCEPT MISSION
# =========================================================
# =========================================================
# ACCEPT MISSION
# =========================================================
@app.route(
    "/api/missions/<id>/accept",
    methods=["PUT"]
)
@token_required
def accept_mission(id):

    try:

        print("\n================================")
        print("ACCEPT MISSION")
        print("================================")

        print("DATABASE:", db.name)
        print("COLLECTION:", missions.name)
        print("MISSION ID:", id)

        # =====================================
        # GET CURRENT USER
        # =====================================
        user = users.find_one(
            {
                "_id": ObjectId(
                    request.user["userId"]
                )
            }
        )

        if not user:
            return jsonify({
                "error": "User not found"
            }), 404

        username = user["username"]

        print(
            "\nUsername:",
            username
        )

        # =====================================
        # FIND MISSION
        # =====================================
        mission = missions.find_one(
            {
                "_id": ObjectId(id)
            }
        )

        if not mission:
            return jsonify({
                "error": "Mission not found"
            }), 404

        print(
            "\nMISSION BEFORE UPDATE:"
        )

        print(mission)

        # =====================================
        # ACCEPT CURRENT CREW MEMBER
        # =====================================
        result = missions.update_one(
            {
                "_id": ObjectId(id),
                "crew.name": username
            },
            {
                "$set": {
                    "crew.$.accepted": True
                }
            }
        )

        print(
            "\nMATCHED:",
            result.matched_count
        )

        print(
            "MODIFIED:",
            result.modified_count
        )

        # =====================================
        # GET UPDATED MISSION
        # =====================================
        updated_mission = missions.find_one(
            {
                "_id": ObjectId(id)
            }
        )

        # =====================================
        # CHECK ALL CREW ACCEPTED
        # =====================================
        all_accepted = all(
            member.get("accepted", False)
            for member in updated_mission["crew"]
        )

        print(
            "\nALL ACCEPTED:",
            all_accepted
        )

        if all_accepted:

            missions.update_one(
                {
                    "_id": ObjectId(id)
                },
                {
                    "$set": {
                        "status": "accepted"
                    }
                }
            )

            print(
                "MISSION STATUS UPDATED TO ACCEPTED"
            )

        updated_mission = missions.find_one(
            {
                "_id": ObjectId(id)
            }
        )

        print(
            "\nMISSION AFTER UPDATE:"
        )

        print(updated_mission)

        print(
            "\n================================"
        )

        return jsonify(
            {
                "message": "Mission accepted"
            }
        )

    except Exception as e:

        print(
            "\nACCEPT ERROR:",
            str(e)
        )

        return jsonify(
            {
                "error": str(e)
            }
        ), 500
# DELETE MISSION DEBUG
# =========================================================
# =========================================================
# DELETE MISSION
# =========================================================
@app.route(
    "/api/missions/<id>",
    methods=["DELETE"]
)
@token_required
def delete_mission(id):

    try:

        mission = missions.find_one(
            {
                "_id": ObjectId(id)
            }
        )

        if not mission:
            return jsonify({
                "error": "Mission not found"
            }), 404

        result = missions.delete_one(
            {
                "_id": ObjectId(id)
            }
        )

        if result.deleted_count == 0:
            return jsonify({
                "error": "Delete failed"
            }), 400

        return jsonify({
            "message": "Mission deleted"
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# =========================================================
# START SERVER
# =========================================================
if __name__ == "__main__":

    app.run(

        debug=True,

        host="127.0.0.1",

        port=5000,
    )