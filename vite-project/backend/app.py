from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from dotenv import load_dotenv

import jwt
import datetime
import requests
import os

# -----------------------------------
# ENV
# -----------------------------------

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")
SECRET_KEY = os.getenv("SECRET_KEY", "test123")

# -----------------------------------
# APP
# -----------------------------------

app = Flask(__name__)

CORS(
    app,
    origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# -----------------------------------
# MONGO
# -----------------------------------

mongo_ok = False
user_collection = None
missions_collection = None

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    client.server_info()

    db = client["space_app"]

    user_collection = db["users"]
    missions_collection = db["missions"]

    mongo_ok = True

    print("✅ MongoDB connected")

except Exception as e:
    print("❌ MongoDB ERROR:", e)

# -----------------------------------
# HELPERS
# -----------------------------------

def is_valid(value):
    return value is not None and str(value).strip() != ""

def serialize(obj):
    obj["_id"] = str(obj["_id"])
    return obj

# -----------------------------------
# AUTH
# -----------------------------------

def token_required(f):

    @wraps(f)
    def wrapper(*args, **kwargs):

        auth = request.headers.get("Authorization")

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

        except jwt.ExpiredSignatureError:
            return jsonify({
                "error": "Token expired"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "error": "Invalid token"
            }), 401

        except Exception as e:
            return jsonify({
                "error": "Auth error",
                "details": str(e)
            }), 401

        return f(*args, **kwargs)

    return wrapper

# -----------------------------------
# TEST
# -----------------------------------

@app.route("/test", methods=["GET"])
def test():
    return jsonify({
        "message": "Backend werkt 🚀"
    })

# -----------------------------------
# REGISTER
# -----------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    required = [
        "firstname",
        "lastname",
        "city",
        "phone",
        "email",
        "password",
        "inviteCode"
    ]

    missing = [
        field for field in required
        if not is_valid(data.get(field))
    ]

    if missing:
        return jsonify({
            "error": "Missing fields",
            "fields": missing
        }), 400

    existing_user = user_collection.find_one({
        "email": data["email"]
    })

    if existing_user:
        return jsonify({
            "error": "User already exists"
        }), 400

    if data["inviteCode"] == "CAPTAIN123":
        role = "captain"

    elif data["inviteCode"] == "CREW123":
        role = "crew"

    else:
        return jsonify({
            "error": "Invalid invite code"
        }), 400

    user = {
        "firstname": data["firstname"],
        "lastname": data["lastname"],
        "city": data["city"],
        "phone": data["phone"],
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "role": role,
        "createdAt": datetime.datetime.utcnow()
    }

    result = user_collection.insert_one(user)

    return jsonify({
        "message": "User created",
        "id": str(result.inserted_id)
    })

# -----------------------------------
# LOGIN
# -----------------------------------

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password required"
        }), 400

    user = user_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    if not check_password_hash(user["password"], password):
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    token = jwt.encode({
        "userId": str(user["_id"]),
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=4)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "role": user["role"]
        }
    })

# -----------------------------------
# CURRENT USER
# -----------------------------------

@app.route("/api/me", methods=["GET"])
@token_required
def get_me():

    user_id = request.user["userId"]

    try:
        user = user_collection.find_one({
            "_id": ObjectId(user_id)
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid user ID"
        }), 400

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "id": str(user["_id"]),
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "email": user["email"],
        "role": user["role"]
    })

# -----------------------------------
# USERS
# -----------------------------------

@app.route("/api/users", methods=["GET"])
@token_required
def get_users():

    role = request.args.get("role")

    query = {}

    if role:
        query["role"] = role

    users = list(user_collection.find(query))

    return jsonify([
        {
            "id": str(user["_id"]),
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "role": user["role"]
        }
        for user in users
    ])

# -----------------------------------
# SPACEX DATA
# -----------------------------------

class SpaceAPI:

    def get(self, url):

        try:
            response = requests.get(url, timeout=5)
            return response.json()

        except Exception as e:
            print("API ERROR:", e)
            return []

api = SpaceAPI()

@app.route("/api/mission-options", methods=["GET"])
def mission_options():

    return jsonify({
        "astronauts": api.get("https://api.spacexdata.com/v4/crew"),
        "rockets": api.get("https://api.spacexdata.com/v4/rockets"),
        "launches": api.get("https://api.spacexdata.com/v4/launches")[:20],
        "launchpads": api.get("https://api.spacexdata.com/v4/launchpads"),
        "landpads": api.get("https://api.spacexdata.com/v4/landpads")
    })

# -----------------------------------
# GET MISSIONS
# -----------------------------------

@app.route("/api/missions", methods=["GET"])
@token_required
def get_missions():

    if request.user["role"] == "captain":
        missions = list(missions_collection.find())

    else:
        missions = list(missions_collection.find({
            "crew": request.user["userId"]
        }))

    return jsonify([
        serialize(mission)
        for mission in missions
    ])

# -----------------------------------
# CREATE MISSION
# -----------------------------------

@app.route("/api/missions", methods=["POST"])
@token_required
def create_mission():

    data = request.get_json() or {}

    mission = {
        "title": data.get("title"),
        "description": data.get("description"),
        "launchDate": data.get("launchDate"),
        "crew": data.get("crew", []),
        "status": "pending",
        "createdBy": request.user["userId"],
        "createdAt": datetime.datetime.utcnow()
    }

    result = missions_collection.insert_one(mission)

    return jsonify({
        "message": "Mission created",
        "id": str(result.inserted_id)
    })

# -----------------------------------
# DELETE MISSION
# -----------------------------------

@app.route("/api/missions/<mission_id>", methods=["DELETE"])
@token_required
def delete_mission(mission_id):

    try:
        missions_collection.delete_one({
            "_id": ObjectId(mission_id)
        })

        return jsonify({
            "message": "Mission deleted"
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid mission ID"
        }), 400

# -----------------------------------
# ACCEPT MISSION
# -----------------------------------

@app.route("/api/missions/<mission_id>/accept", methods=["PUT"])
@token_required
def accept_mission(mission_id):

    try:
        mission = missions_collection.find_one({
            "_id": ObjectId(mission_id)
        })

        if not mission:
            return jsonify({
                "error": "Mission not found"
            }), 404

        missions_collection.update_one(
            {"_id": ObjectId(mission_id)},
            {"$set": {"status": "accepted"}}
        )

        mission["status"] = "accepted"

        return jsonify({
            "message": "Mission accepted",
            "mission": serialize(mission)
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid mission ID"
        }), 400

# -----------------------------------
# ADD CREW MEMBER
# -----------------------------------

@app.route("/api/missions/<mission_id>/crew", methods=["PUT"])
@token_required
def add_crew_member(mission_id):

    try:
        data = request.get_json() or {}

        user_id = data.get("userId")

        mission = missions_collection.find_one({
            "_id": ObjectId(mission_id)
        })

        if not mission:
            return jsonify({
                "error": "Mission not found"
            }), 404

        crew = mission.get("crew", [])

        if user_id not in crew:
            crew.append(user_id)

        missions_collection.update_one(
            {"_id": ObjectId(mission_id)},
            {"$set": {"crew": crew}}
        )

        return jsonify({
            "crew": crew
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid mission ID"
        }), 400

# -----------------------------------
# REMOVE CREW MEMBER
# -----------------------------------

@app.route("/api/missions/<mission_id>/crew", methods=["DELETE"])
@token_required
def remove_crew_member(mission_id):

    try:
        data = request.get_json() or {}

        user_id = data.get("userId")

        mission = missions_collection.find_one({
            "_id": ObjectId(mission_id)
        })

        if not mission:
            return jsonify({
                "error": "Mission not found"
            }), 404

        crew = [
            member
            for member in mission.get("crew", [])
            if member != user_id
        ]

        missions_collection.update_one(
            {"_id": ObjectId(mission_id)},
            {"$set": {"crew": crew}}
        )

        return jsonify({
            "crew": crew
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid mission ID"
        }), 400

# -----------------------------------
# START SERVER
# -----------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )