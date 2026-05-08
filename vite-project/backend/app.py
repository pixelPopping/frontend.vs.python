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
import os
import requests

# -----------------------------------
# LOAD ENV
# -----------------------------------
load_dotenv()

app = Flask(__name__)

# -----------------------------------
# CORS (FIXED FOR FRONTEND + PREFLIGHT)
# -----------------------------------
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# -----------------------------------
# ENV VARIABLES
# -----------------------------------
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

# -----------------------------------
# HARD FAIL IF ENV MISSING (IMPORTANT)
# -----------------------------------
if not MONGO_URI or not SECRET_KEY:
    raise Exception(
        "❌ Missing MONGO_URI or SECRET_KEY in .env file"
    )

# -----------------------------------
# MONGO CONNECTION (SAFE)
# -----------------------------------
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

try:
    client.server_info()
    print("✅ MongoDB connected")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

db = client.space_app
users_collection = db.users
missions_collection = db.missions

# -----------------------------------
# HELPERS
# -----------------------------------
def serialize_mission(m):
    m["_id"] = str(m["_id"])
    return m

# -----------------------------------
# AUTH MIDDLEWARE
# -----------------------------------
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization")

        if not auth:
            return jsonify({"error": "Token missing"}), 401

        try:
            token = auth.split(" ")[1]

            decoded = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

            request.user = decoded

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return wrapper

# -----------------------------------
# REGISTER
# -----------------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    required = ["firstname", "lastname", "city", "phone", "email", "password", "inviteCode"]

    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} missing"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400

    invite = data["inviteCode"]

    if invite == "CAPTAIN123":
        role = "captain"
    elif invite == "CREW123":
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

    result = users_collection.insert_one(user)

    return jsonify({
        "message": "User created",
        "userId": str(result.inserted_id),
        "role": role
    })

# -----------------------------------
# LOGIN
# -----------------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "userId": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=4)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "email": user["email"],
            "role": user["role"]
        }
    })

# -----------------------------------
# PROFILE
# -----------------------------------
@app.route('/api/profile', methods=['GET'])
@token_required
def profile():
    user_id = request.user["userId"]

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user["_id"]),
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "city": user["city"],
        "phone": user["phone"],
        "email": user["email"],
        "role": user["role"]
    })

# -----------------------------------
# SPACE API
# -----------------------------------
class SpaceAPI:
    def get(self, url):
        try:
            return requests.get(url, timeout=5).json()
        except Exception as e:
            print("Space API error:", e)
            return []

api = SpaceAPI()

@app.route('/api/mission-options', methods=['GET'])
def mission_options():
    return jsonify({
        "astronauts": api.get("https://api.spacexdata.com/v4/crew"),
        "rockets": api.get("https://api.spacexdata.com/v4/rockets"),
        "launches": api.get("https://api.spacexdata.com/v4/launches")[:20]
    })

# -----------------------------------
# CREATE MISSION
# -----------------------------------
@app.route('/api/launch', methods=['POST'])
@token_required
def create_mission():
    data = request.json

    mission = {
        "captain": data.get("captain"),
        "crewMember1": data.get("crewMember1"),
        "crewMember2": data.get("crewMember2"),
        "rocket": data.get("rocket"),
        "launchPad": data.get("launchPad"),
        "landingPad": data.get("landingPad"),
        "city": data.get("city"),
        "departure": data.get("departure"),
        "returnDate": data.get("returnDate"),
        "ownerId": request.user["userId"],
        "crew": data.get("crew", []),
        "createdAt": datetime.datetime.utcnow()
    }

    result = missions_collection.insert_one(mission)

    return jsonify({
        "message": "Mission created",
        "id": str(result.inserted_id)
    })

# -----------------------------------
# GET MISSIONS
# -----------------------------------
@app.route('/api/missions', methods=['GET'])
@token_required
def get_missions():
    user_id = request.user["userId"]
    role = request.user["role"]

    if role == "captain":
        missions = missions_collection.find({"ownerId": user_id})
    else:
        missions = missions_collection.find({"crew": user_id})

    return jsonify([serialize_mission(m) for m in missions])

# -----------------------------------
# GET SINGLE MISSION
# -----------------------------------
@app.route('/api/missions/<id>', methods=['GET'])
@token_required
def get_mission(id):
    try:
        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Mission not found"}), 404

        return jsonify(serialize_mission(mission))

    except InvalidId:
        return jsonify({"error": "Invalid mission id"}), 400

# -----------------------------------
# UPDATE MISSION
# -----------------------------------
@app.route('/api/missions/<id>', methods=['PUT'])
@token_required
def update_mission(id):
    try:
        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Mission not found"}), 404

        if request.user["role"] != "captain":
            return jsonify({"error": "Only captain allowed"}), 403

        if mission["ownerId"] != request.user["userId"]:
            return jsonify({"error": "Not your mission"}), 403

        update_data = request.json
        update_data.pop("ownerId", None)

        missions_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )

        return jsonify({"message": "Mission updated"})

    except InvalidId:
        return jsonify({"error": "Invalid mission id"}), 400

# -----------------------------------
# DELETE MISSION
# -----------------------------------
@app.route('/api/missions/<id>', methods=['DELETE'])
@token_required
def delete_mission(id):
    try:
        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Mission not found"}), 404

        if request.user["role"] != "captain":
            return jsonify({"error": "Only captain allowed"}), 403

        if mission["ownerId"] != request.user["userId"]:
            return jsonify({"error": "Not your mission"}), 403

        missions_collection.delete_one({"_id": ObjectId(id)})

        return jsonify({"message": "Mission deleted"})

    except InvalidId:
        return jsonify({"error": "Invalid mission id"}), 400

# -----------------------------------
# START SERVER
# -----------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)