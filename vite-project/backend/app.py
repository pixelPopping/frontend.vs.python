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
# LOAD ENV
# -----------------------------------

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
SECRET_KEY = os.getenv("SECRET_KEY", "test123")

# -----------------------------------
# APP
# -----------------------------------

app = Flask(__name__)

# ✔ FIXED CORS — ondersteunt jouw frontend op http://localhost én http://localhost:5173
CORS(app,
     resources={r"/*": {"origins": ["http://localhost", "http://localhost:5173"]}},
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

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
    print("❌ MongoDB ERROR:")
    print(e)

# -----------------------------------
# HELPERS
# -----------------------------------

def is_valid(value):
    return value is not None and str(value).strip() != ""

def serialize(obj):
    obj["_id"] = str(obj["_id"])
    return obj

def require_mongo():
    if not mongo_ok:
        return jsonify({"error": "MongoDB is not connected"}), 500
    return None

# -----------------------------------
# AUTH
# -----------------------------------

def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):

        # ✔ Laat OPTIONS requests altijd door
        if request.method == "OPTIONS":
            return jsonify({"status": "ok"}), 200

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
# TEST ROUTE
# -----------------------------------

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend werkt perfect 🚀"})

# -----------------------------------
# REGISTER
# -----------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    mongo_error = require_mongo()
    if mongo_error:
        return mongo_error

    try:
        data = request.get_json() or {}

        required = ["firstname", "lastname", "city", "phone", "email", "password", "inviteCode"]
        missing = [field for field in required if not is_valid(data.get(field))]

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

        hashed_password = generate_password_hash(data["password"])

        user = {
            "firstname": data["firstname"],
            "lastname": data["lastname"],
            "city": data["city"],
            "phone": data["phone"],
            "email": data["email"],
            "password": hashed_password,
            "role": role,
            "createdAt": datetime.datetime.utcnow()
        }

        result = user_collection.insert_one(user)

        return jsonify({
            "message": "User created",
            "id": str(result.inserted_id),
            "role": role
        })

    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# LOGIN
# -----------------------------------

@app.route("/api/login", methods=["POST"])
def login():

    mongo_error = require_mongo()
    if mongo_error:
        return mongo_error

    try:
        data = request.get_json() or {}

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400

        user = user_collection.find_one({"email": data["email"]})

        if not user or not check_password_hash(user["password"], data["password"]):
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

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# PROFILE
# -----------------------------------

@app.route("/api/profile", methods=["GET"])
@token_required
def profile():

    mongo_error = require_mongo()
    if mongo_error:
        return mongo_error

    try:
        user_id = request.user["userId"]
        user = user_collection.find_one({"_id": ObjectId(user_id)})

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

    except InvalidId:
        return jsonify({"error": "Invalid user id"}), 400

    except Exception as e:
        print("PROFILE ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# /api/me (fix voor AuthContext)
# -----------------------------------

@app.route("/api/me", methods=["OPTIONS"])
def me_options():
    return jsonify({"status": "ok"}), 200

@app.route("/api/me", methods=["GET"])
@token_required
def me():
    try:
        user_id = request.user["userId"]
        user = user_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": str(user["_id"]),
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "email": user["email"],
            "role": user["role"]
        })

    except Exception as e:
        print("ME ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# MISSIONS (GET, POST, DELETE + OPTIONS)
# -----------------------------------

@app.route("/api/missions", methods=["OPTIONS"])
@app.route("/api/missions/<id>", methods=["OPTIONS"])
def missions_options(id=None):
    return jsonify({"status": "ok"}), 200


@app.route("/api/missions", methods=["GET"])
@token_required
def get_missions():

    mongo_error = require_mongo()
    if mongo_error:
        return mongo_error

    try:
        missions = list(missions_collection.find())
        missions = [serialize(m) for m in missions]
        return jsonify(missions)

    except Exception as e:
        print("MISSIONS GET ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/missions", methods=["POST"])
@token_required
def create_mission():

    mongo_error = require_mongo()
    if mongo_error:
        return mongo_error

    try:
        data = request.get_json() or {}

        required = ["title", "description", "launchDate"]
        missing = [f for f in required if not is_valid(data.get(f))]

        if missing:
            return jsonify({"error": "Missing fields", "fields": missing}), 400

        mission = {
            "title": data["title"],
            "description": data["description"],
            "launchDate": data["launchDate"],
            "createdBy": request.user["userId"],
            "createdAt": datetime.datetime.utcnow()
        }

        result = missions_collection.insert_one(mission)

        return jsonify({
            "message": "Mission created",
            "id": str(result.inserted_id)
        })

    except Exception as e:
        print("MISSIONS POST ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/missions/<id>", methods=["DELETE"])
@token_required
def delete_mission(id):

    mongo_error = require_mongo()
    if mongo_error:
        return mongo_error

    try:
        result = missions_collection.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Mission not found"}), 404

        return jsonify({"message": "Mission deleted"})

    except Exception as e:
        print("MISSIONS DELETE ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# SPACE API
# -----------------------------------

class SpaceAPI:
    def get(self, url):
        try:
            response = requests.get(url, timeout=5)
            return response.json()
        except Exception as e:
            print("SPACE API ERROR:", e)
            return []

api = SpaceAPI()

@app.route("/api/mission-options", methods=["GET"])
def mission_options():
    return jsonify({
        "astronauts": api.get("https://api.spacexdata.com/v4/crew"),
        "rockets": api.get("https://api.spacexdata.com/v4/rockets"),
        "launches": api.get("https://api.spacexdata.com/v4/launches")[:20]
    })

# -----------------------------------
# START SERVER
# -----------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)

