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

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
SECRET_KEY = os.getenv("SECRET_KEY", "test123")

# -----------------------------------
# APP
# -----------------------------------

app = Flask(__name__)

# CORS
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    supports_credentials=True
)

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

# -----------------------------------
# MONGO
# -----------------------------------

mongo_ok = False
user_collection = None
missions_collection = None

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
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
            return jsonify({"error": "Token missing"}), 401

        try:
            token = auth.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = decoded

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return wrapper

# -----------------------------------
# TEST
# -----------------------------------

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend werkt 🚀"})

# -----------------------------------
# REGISTER
# -----------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    required = ["firstname", "lastname", "city", "phone", "email", "password", "inviteCode"]

    missing = [f for f in required if not is_valid(data.get(f))]

    if missing:
        return jsonify({"error": "Missing fields", "fields": missing}), 400

    if user_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400

    if data["inviteCode"] == "CAPTAIN123":
        role = "captain"
    elif data["inviteCode"] == "CREW123":
        role = "crew"
    else:
        return jsonify({"error": "Invalid invite code"}), 400

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

@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():

    data = request.get_json() or {}

    user = user_collection.find_one({"email": data["email"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

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
            "id": str(u["_id"]),
            "firstname": u["firstname"],
            "lastname": u["lastname"],
            "role": u["role"]
        }
        for u in users
    ])

# -----------------------------------
# MISSION OPTIONS (SPACEX)
# -----------------------------------

class SpaceAPI:
    def get(self, url):
        try:
            return requests.get(url, timeout=5).json()
        except:
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
# MISSIONS
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

    return jsonify([serialize(m) for m in missions])


@app.route("/api/missions", methods=["POST"])
@token_required
def create_mission():

    data = request.get_json() or {}

    mission = {
        "title": data["title"],
        "description": data["description"],
        "launchDate": data["launchDate"],
        "crew": data.get("crew", []),
        "createdBy": request.user["userId"],
        "createdAt": datetime.datetime.utcnow()
    }

    result = missions_collection.insert_one(mission)

    return jsonify({
        "message": "Mission created",
        "id": str(result.inserted_id)
    })

# -----------------------------------
# ACCEPT MISSION  ✅ ADDED
# -----------------------------------

@app.route("/api/missions/<mission_id>/accept", methods=["PUT"])
@token_required
def accept_mission(mission_id):

    try:
        mission = missions_collection.find_one({"_id": ObjectId(mission_id)})

        if not mission:
            return jsonify({"error": "Mission not found"}), 404

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
        return jsonify({"error": "Invalid mission ID"}), 400

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

# -----------------------------------
# CREW ASSIGN
# -----------------------------------

@app.route("/api/missions/<mission_id>/crew", methods=["PUT"])
@token_required
def add_crew_member(mission_id):

    data = request.get_json() or {}
    user_id = data.get("userId")

    mission = missions_collection.find_one({"_id": ObjectId(mission_id)})

    crew = mission.get("crew", [])

    if user_id not in crew:
        crew.append(user_id)

    missions_collection.update_one(
        {"_id": ObjectId(mission_id)},
        {"$set": {"crew": crew}}
    )

    return jsonify({"crew": crew})

# -----------------------------------
# REMOVE CREW
# -----------------------------------

@app.route("/api/missions/<mission_id>/crew", methods=["DELETE"])
@token_required
def remove_crew_member(mission_id):

    data = request.get_json() or {}
    user_id = data.get("userId")

    mission = missions_collection.find_one({"_id": ObjectId(mission_id)})

    crew = [c for c in mission.get("crew", []) if c != user_id]

    missions_collection.update_one(
        {"_id": ObjectId(mission_id)},
        {"$set": {"crew": crew}}
    )

    return jsonify({"crew": crew})

# -----------------------------------
# START SERVER
# -----------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
