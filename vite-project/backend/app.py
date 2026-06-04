from flask import (
    Flask,
    jsonify,
    request,
)

from flask_cors import CORS

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
SECRET_KEY = "super_secret_key_123"

MONGO_URI = "mongodb://127.0.0.1:27017/"

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

# =========================================================
# MONGO
# =========================================================
client = MongoClient(MONGO_URI)

db = client["space_app"]

users = db["users"]

missions = db["missions"]

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

            "email":
                data["email"]
        })

        if existing_user:

            return jsonify({
                "error":
                    "Email already exists"
            }), 400

        role = (

            "captain"

            if data.get("inviteCode")
            == "CAPTAIN123"

            else "crew"
        )

        new_user = {

            "firstname":
                data["firstname"],

            "lastname":
                data["lastname"],

            "city":
                data["city"],

            "phone":
                data["phone"],

            "email":
                data["email"],

            "password":

                generate_password_hash(
                    data["password"]
                ),

            "role":
                role,

            "createdAt":
                datetime.now(UTC),
        }

        users.insert_one(new_user)

        return jsonify({
            "message":
                "User created"
        })

    except Exception as e:

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

        user = users.find_one({

            "email":
                data["email"]
        })

        if not user:

            return jsonify({
                "error":
                    "User not found"
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

                "firstname":
                    user["firstname"],

                "lastname":
                    user["lastname"],

                "role":
                    user["role"],
            }
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
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

            "_id":

                ObjectId(
                    request.user["userId"]
                )
        })

        return jsonify({

            "id":
                str(user["_id"]),

            "firstname":
                user["firstname"],

            "lastname":
                user["lastname"],

            "role":
                user["role"],
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

                "id":
                    str(user["_id"]),

                "firstname":
                    user["firstname"],

                "lastname":
                    user["lastname"],

                "role":
                    user["role"],
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

    try:

        rockets_response = requests.get(
            "https://api.spacexdata.com/v4/rockets"
        )

        dragons_response = requests.get(
            "https://api.spacexdata.com/v4/dragons"
        )

        ships_response = requests.get(
            "https://api.spacexdata.com/v4/ships"
        )

        launchpads_response = requests.get(
            "https://api.spacexdata.com/v4/launchpads"
        )

        landpads_response = requests.get(
            "https://api.spacexdata.com/v4/landpads"
        )

        rockets = rockets_response.json()

        dragons = dragons_response.json()

        ships = ships_response.json()

        launchpads = (
            launchpads_response.json()
        )

        landpads = (
            landpads_response.json()
        )

        formatted_rockets = [

            {
                "id": rocket["id"],
                "name": rocket["name"],
            }

            for rocket in rockets
        ]

        formatted_dragons = [

            {
                "id": dragon["id"],
                "name": dragon["name"],
            }

            for dragon in dragons
        ]

        formatted_ships = [

            {
                "id": ship["id"],
                "name": ship["name"],
            }

            for ship in ships
        ]

        formatted_launchpads = [

            {
                "id": pad["id"],
                "name": pad["name"],
            }

            for pad in launchpads
        ]

        formatted_landpads = [

            {
                "id": pad["id"],
                "name": pad["name"],
            }

            for pad in landpads
        ]

        return jsonify({

            "rockets":
                formatted_rockets +

                formatted_dragons,

            "ships":
                formatted_ships,

            "launchpads":
                formatted_launchpads,

            "landpads":
                formatted_landpads,
        })

    except Exception as e:

        print(
            "MISSION OPTIONS ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500

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
                data.get("captain"),

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
                str(result.inserted_id),
        })

    except Exception as e:

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

        print("\n====================")
        print("ACCEPT MISSION")
        print("====================")

        print("MISSION ID:", id)

        user = users.find_one(
            {
                "_id": ObjectId(
                    request.user["userId"]
                )
            }
        )

        print("USER:", user)

        firstname = user["firstname"]

        print(
            "FIRSTNAME:",
            firstname
        )

        mission = missions.find_one(
            {
                "_id": ObjectId(id)
            }
        )

        print(
            "MISSION BEFORE:"
        )

        print(mission)

        result = missions.update_one(
            {
                "_id": ObjectId(id),
                "crew.name": firstname
            },
            {
                "$set": {
                    "crew.$.accepted": True
                }
            }
        )

        print(
            "MATCHED:",
            result.matched_count
        )

        print(
            "MODIFIED:",
            result.modified_count
        )

        updated_mission = missions.find_one(
            {
                "_id": ObjectId(id)
            }
        )

        print(
            "MISSION AFTER:"
        )

        print(updated_mission)

        print("====================\n")

        return jsonify(
            {
                "message":
                    "Mission accepted"
            }
        )

    except Exception as e:

        print(
            "ACCEPT ERROR:",
            str(e)
        )

        return jsonify(
            {
                "error": str(e)
            }
        ), 500
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

        missions.delete_one({

            "_id":
                ObjectId(id)
        })

        return jsonify({
            "message":
                "Mission deleted"
        })

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