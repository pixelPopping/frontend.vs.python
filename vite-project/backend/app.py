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

from services.mission_service import enrich_mission

# ---------------- ENV ----------------
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")
SECRET_KEY = os.getenv("SECRET_KEY", "test123")

# ---------------- APP ----------------
app = Flask(__name__)

CORS(
    app,
    origins=["http://localhost:5173"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# ---------------- DB ----------------
client = MongoClient(MONGO_URI)
db = client["space_app"]

users = db["users"]
missions = db["missions"]

# ---------------- HELPERS ----------------
def is_valid(value):
    return value is not None and str(value).strip() != ""


def serialize(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# ---------------- AUTH ----------------
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

        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return wrapper

# ---------------- TEST ----------------
@app.route("/test")
def test():
    return jsonify({"message": "Backend OK 🚀"})

# ---------------- REGISTER ----------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    user = {
        "firstname": data.get("firstname"),
        "lastname": data.get("lastname"),
        "city": data.get("city"),
        "phone": data.get("phone"),
        "email": data.get("email"),
        "password": generate_password_hash(data.get("password")),
        "role": "captain" if data.get("inviteCode") == "CAPTAIN123" else "crew",
        "createdAt": datetime.datetime.utcnow()
    }

    users.insert_one(user)

    return jsonify({"message": "User created"}), 201

# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    user = users.find_one({"email": data.get("email")})

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password_hash(user["password"], data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "userId": str(user["_id"]),
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=4)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "role": user["role"]
        }
    })

# ---------------- ME ----------------
@app.route("/api/me", methods=["GET"])
@token_required
def me():
    user = users.find_one({"_id": ObjectId(request.user["userId"])})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user["_id"]),
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "role": user["role"]
    })

# ---------------- USERS ----------------
@app.route("/api/users", methods=["GET"])
@token_required
def get_users():
    role = request.args.get("role")
    query = {}

    if role:
        query["role"] = role

    data = users.find(query)

    return jsonify([
        {
            "id": str(u["_id"]),
            "firstname": u["firstname"],
            "lastname": u["lastname"],
            "role": u["role"]
        }
        for u in data
    ])

# ---------------- SPACE OPTIONS ----------------
@app.route("/api/mission-options")
def mission_options():

    def clean(items):
        return [
            {
                "id": i.get("id"),
                "name": i.get("name") or i.get("full_name")
            }
            for i in items
            if i.get("id")
        ]

    return jsonify({
        "rockets": clean(
            __import__("requests").get("https://api.spacexdata.com/v4/rockets").json()
        ),
        "launchpads": clean(
            __import__("requests").get("https://api.spacexdata.com/v4/launchpads").json()
        ),
        "landpads": clean(
            __import__("requests").get("https://api.spacexdata.com/v4/landpads").json()
        )
    })

# ---------------- MISSIONS ----------------
@app.route("/api/missions", methods=["GET"])
@token_required
def get_missions():

    user = request.user

    if user["role"] == "captain":
        data = missions.find()
    else:
        data = missions.find({"crew": user["userId"]})

    return jsonify([
        enrich_mission(m, users)
        for m in data
    ])

# ---------------- CREATE MISSION ----------------
@app.route("/api/missions", methods=["POST"])
@token_required
def create_mission():

    data = request.get_json() or {}

    required = ["title", "launchDate"]

    missing = [f for f in required if not is_valid(data.get(f))]

    if missing:
        return jsonify({
            "error": "Missing fields",
            "fields": missing
        }), 400

    mission = {
        "title": data.get("title"),
        "description": data.get("description", ""),
        "launchDate": data.get("launchDate"),
        "returnDate": data.get("returnDate"),

        "captain": request.user["userId"],
        "createdBy": request.user["userId"],

        "crew": [
            data.get("crewMember1"),
            data.get("crewMember2")
        ],

        "rocket": data.get("rocket"),
        "launchPad": data.get("launchPad"),
        "landingPad": data.get("landingPad"),
        "city": data.get("city"),

        "status": "pending",
        "createdAt": datetime.datetime.utcnow()
    }

    result = missions.insert_one(mission)
    mission["_id"] = result.inserted_id

    return jsonify({
        "message": "Mission created",
        "id": str(result.inserted_id),
        "mission": serialize(mission)
    })

# ---------------- DELETE ----------------
@app.route("/api/missions/<id>", methods=["DELETE"])
@token_required
def delete_mission(id):

    try:
        missions.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted"})

    except InvalidId:
        return jsonify({"error": "Invalid mission id"}), 400

# ---------------- START ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)