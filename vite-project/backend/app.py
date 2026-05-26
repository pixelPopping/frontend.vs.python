from flask import Flask, jsonify, request

from flask_cors import CORS

from pymongo import MongoClient

from bson import ObjectId

from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)

from functools import wraps

from dotenv import load_dotenv

from datetime import (
    datetime,
    timedelta,
    UTC,
)

import jwt

# =========================================================
# ENV
# =========================================================
load_dotenv()

MONGO_URI = "mongodb://127.0.0.1:27017/"

SECRET_KEY = "super_secret_key_123"

# =========================================================
# APP
# =========================================================
app = Flask(__name__)

# =========================================================
# CORS
# =========================================================
# =========================================================
# CORS
# =========================================================
CORS(

    app,

    resources={

        r"/api/*": {

            "origins": [
                "http://localhost:5173"
            ]
        }
    },

    supports_credentials=True
)

@app.after_request
def after_request(response):

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "http://localhost:5173"

    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Content-Type,Authorization"

    response.headers[
        "Access-Control-Allow-Methods"
    ] = "GET,POST,PUT,DELETE,OPTIONS"

    return response

@app.after_request
def after_request(response):

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "http://127.0.0.1:5173"

    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Content-Type,Authorization"

    response.headers[
        "Access-Control-Allow-Methods"
    ] = "GET,POST,PUT,DELETE,OPTIONS"

    return response

# =========================================================
# MONGO
# =========================================================
try:

    client = MongoClient(MONGO_URI)

    client.admin.command("ping")

    print("✅ MongoDB Connected")

except Exception as e:

    print("❌ Mongo ERROR:", e)

# =========================================================
# DATABASE
# =========================================================
db = client["space_app"]

users = db["users"]

missions = db["missions"]

# =========================================================
# AUTH
# =========================================================
def token_required(f):

    @wraps(f)

    def wrapper(*args, **kwargs):

        auth = request.headers.get(
            "Authorization"
        )

        print("AUTH HEADER:", auth)

        if not auth:

            return jsonify({
                "error": "Token missing"
            }), 401

        if not auth.startswith("Bearer "):

            return jsonify({
                "error": "Invalid auth format"
            }), 401

        try:

            token = auth.split(" ")[1]

            decoded = jwt.decode(

                token,

                SECRET_KEY,

                algorithms=["HS256"]
            )

            print("DECODED:", decoded)

            request.user = decoded

        except Exception as e:

            print("JWT ERROR:", e)

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
        "message": "Backend OK 🚀"
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

        print("REGISTER DATA:", data)

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

        result = users.insert_one(user)

        print(
            "✅ USER CREATED:",
            result.inserted_id
        )

        return jsonify({
            "message": "User created"
        })

    except Exception as e:

        print("❌ REGISTER ERROR:", e)

        return jsonify({
            "error": str(e)
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

        print("LOGIN DATA:", data)

        user = users.find_one({

            "email": data.get("email")
        })

        if not user:

            return jsonify({
                "error": "User not found"
            }), 401

        if not check_password_hash(

            user["password"],
            data.get("password")
        ):

            return jsonify({
                "error": "Wrong password"
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

        print("✅ TOKEN CREATED")

        return jsonify({

            "token": token,

            "user": {

                "id": str(user["_id"]),

                "firstname": user["firstname"],

                "lastname": user["lastname"],

                "role": user["role"],
            }
        })

    except Exception as e:

        print("❌ LOGIN ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# ME
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

        return jsonify({

            "id": str(user["_id"]),

            "firstname": user["firstname"],

            "lastname": user["lastname"],

            "role": user["role"],
        })

    except Exception as e:

        print("❌ ME ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# USERS
# =========================================================
@app.route(
    "/api/users",
    methods=["GET"]
)
@token_required
def get_users():

    try:

        data = list(users.find())

        print("USERS FROM DB:", data)

        return jsonify([

            {

                "id": str(u["_id"]),

                "firstname": u["firstname"],

                "lastname": u["lastname"],

                "role": u["role"],
            }

            for u in data
        ])

    except Exception as e:

        print("❌ USERS ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# OPTIONS
# =========================================================
@app.route(
    "/api/mission-options",
    methods=["GET"]
)
def mission_options():

    return jsonify({

        "rockets": [

            {
                "id": "falcon9",
                "name": "Falcon 9"
            },

            {
                "id": "starship",
                "name": "Starship"
            }
        ],

        "launchpads": [

            {
                "id": "kennedy",
                "name": "Kennedy Space Center"
            }
        ],

        "landpads": [

            {
                "id": "pacific",
                "name": "Pacific Ocean Platform"
            }
        ]
    })

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

        print("MISSION PAYLOAD:", data)

        mission = {

            "title": data.get("title"),

            "description": data.get("description"),

            "city": data.get("city"),

            "launchDate": data.get("launchDate"),

            "returnDate": data.get("returnDate"),

            "rocket": data.get("rocket"),

            "launchPad": data.get("launchPad"),

            "landingPad": data.get("landingPad"),

            "crew": data.get("crew", []),

            "captain": request.user["userId"],

            "status": "pending",

            "createdAt": datetime.now(UTC),
        }

        result = missions.insert_one(
            mission
        )

        print(
            "✅ MISSION CREATED:",
            result.inserted_id
        )

        return jsonify({
            "message": "Mission created"
        })

    except Exception as e:

        print("❌ CREATE MISSION ERROR:", e)

        return jsonify({
            "error": str(e)
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

        data = list(missions.find())

        print("MISSIONS FROM DB:", data)

        return jsonify([

            {

                "_id": str(m["_id"]),

                "title": m.get("title"),

                "description": m.get("description"),

                "city": m.get("city"),

                "status": m.get("status"),
            }

            for m in data
        ])

    except Exception as e:

        print("❌ GET MISSIONS ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

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

        missions.update_one(

            {"_id": ObjectId(id)},

            {
                "$set": {
                    "status": "accepted"
                }
            }
        )

        return jsonify({
            "message": "Mission accepted"
        })

    except Exception as e:

        print("❌ ACCEPT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# DELETE
# =========================================================
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
            "message": "Mission deleted"
        })

    except Exception as e:

        print("❌ DELETE ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# START
# =========================================================
if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )