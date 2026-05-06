from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import jwt, datetime, os
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# -----------------------------
# CONFIG
# -----------------------------
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

client = MongoClient(MONGO_URI)
db = client.space_app

users_collection = db.users
missions_collection = db.missions

# -----------------------------
# AUTH MIDDLEWARE
# -----------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")

        if not auth:
            return jsonify({"error": "Token missing"}), 401

        try:
            token = auth.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = decoded
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

# -----------------------------
# REGISTER
# -----------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User exists"}), 400

    role = data.get("role", "crew")

    user = {
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "role": role
    }

    users_collection.insert_one(user)

    return jsonify({"message": "User created"})

# -----------------------------
# LOGIN
# -----------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "userId": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"]
        }
    })

# -----------------------------
# SPACEX API (PUBLIC DATA)
# -----------------------------
class SpaceAPI:
    def get(self, url):
        try:
            return requests.get(url).json()
        except:
            return []

api = SpaceAPI()

@app.route('/api/mission-options', methods=['GET'])
def get_options():
    return jsonify({
        "astronauts": api.get("https://api.spacexdata.com/v4/crew"),
        "rockets": api.get("https://api.spacexdata.com/v4/rockets"),
        "launches": api.get("https://api.spacexdata.com/v4/launches")[:20]
    })

# -----------------------------
# CREATE MISSION
# -----------------------------
@app.route('/api/launch', methods=['POST'])
@token_required
def create_mission():
    data = request.json

    data["ownerId"] = request.user["userId"]
    data["crew"] = data.get("crew", [])

    missions_collection.insert_one(data)

    return jsonify({"message": "Mission created"})

# -----------------------------
# GET MISSIONS (ROLE BASED)
# -----------------------------
@app.route('/api/missions', methods=['GET'])
@token_required
def get_missions():
    user_id = request.user["userId"]
    role = request.user["role"]

    if role == "captain":
        missions = list(missions_collection.find({"ownerId": user_id}))
    else:
        missions = list(missions_collection.find({"crew": user_id}))

    for m in missions:
        m["_id"] = str(m["_id"])

    return jsonify(missions)

# -----------------------------
# GET SINGLE MISSION
# -----------------------------
@app.route('/api/missions/<id>', methods=['GET'])
@token_required
def get_mission(id):
    try:
        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Not found"}), 404

        mission["_id"] = str(mission["_id"])
        return jsonify(mission)

    except InvalidId:
        return jsonify({"error": "Invalid ID"}), 400

# -----------------------------
# UPDATE MISSION (CAPTAIN ONLY)
# -----------------------------
@app.route('/api/missions/<id>', methods=['PUT'])
@token_required
def update_mission(id):
    try:
        user_id = request.user["userId"]
        role = request.user["role"]

        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Not found"}), 404

        if role != "captain":
            return jsonify({"error": "Not allowed"}), 403

        if mission["ownerId"] != user_id:
            return jsonify({"error": "Not your mission"}), 403

        update_data = request.json
        update_data.pop("ownerId", None)

        missions_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )

        return jsonify({"message": "Updated"})

    except InvalidId:
        return jsonify({"error": "Invalid ID"}), 400

# -----------------------------
# DELETE MISSION (CAPTAIN ONLY)
# -----------------------------
@app.route('/api/missions/<id>', methods=['DELETE'])
@token_required
def delete_mission(id):
    try:
        user_id = request.user["userId"]
        role = request.user["role"]

        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Not found"}), 404

        if role != "captain":
            return jsonify({"error": "Not allowed"}), 403

        if mission["ownerId"] != user_id:
            return jsonify({"error": "Not your mission"}), 403

        missions_collection.delete_one({"_id": ObjectId(id)})

        return jsonify({"message": "Deleted"})

    except InvalidId:
        return jsonify({"error": "Invalid ID"}), 400

# -----------------------------
# START SERVER
# -----------------------------
if __name__ == '__main__':
    app.run(port=5000, debug=True)