from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId

app = Flask(__name__)

# -----------------------------
# CORS FIX (frontend Vite:5173)
# -----------------------------
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# -----------------------------
# MONGODB CONNECTIE (FIX DIT)
# -----------------------------
client = MongoClient("mongodb+srv://sydneycook_db_user:3UA1EBZF3FbGDxWL@cluster0.pqlcmtp.mongodb.net/")
db = client.space_app
missions_collection = db.missions


# -----------------------------
# SPACE API
# -----------------------------
class SpaceAPI:
    def get_crew(self):
        try:
            return requests.get("https://api.spacexdata.com/v4/crew").json()
        except:
            return []

    def get_rockets(self):
        try:
            return requests.get("https://api.spacexdata.com/v4/rockets").json()
        except:
            return []

    def get_launches(self):
        try:
            return requests.get("https://api.spacexdata.com/v4/launches").json()
        except:
            return []

    def get_landpads(self):
        try:
            return requests.get("https://api.spacexdata.com/v4/landpads").json()
        except:
            return []

    def get_launchpads(self):
        try:
            return requests.get("https://api.spacexdata.com/v4/launchpads").json()
        except:
            return []

api = SpaceAPI()


# -----------------------------
# OPTIONS
# -----------------------------
@app.route('/api/mission-options', methods=['GET'])
def get_options():
    return jsonify({
        "astronauts": api.get_crew(),
        "rockets": api.get_rockets(),
        "launches": api.get_launches()[:20],
        "landpads": api.get_landpads(),
        "launchpads": api.get_launchpads()
    })


# -----------------------------
# CREATE MISSION
# -----------------------------
@app.route('/api/launch', methods=['POST'])
def launch():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data received"}), 400

        result = missions_collection.insert_one(data)

        return jsonify({
            "status": "success",
            "id": str(result.inserted_id),
            "message": "Mission saved!"
        })

    except Exception as e:
        print("ERROR /launch:", e)
        return jsonify({"error": str(e)}), 500


# -----------------------------
# GET ALL MISSIONS
# -----------------------------
@app.route('/api/missions', methods=['GET'])
def get_missions():
    missions = list(missions_collection.find())

    for m in missions:
        m["_id"] = str(m["_id"])

    return jsonify(missions)


# -----------------------------
# GET SINGLE MISSION
# -----------------------------
@app.route('/api/missions/<id>', methods=['GET'])
def get_mission(id):
    try:
        mission = missions_collection.find_one({"_id": ObjectId(id)})

        if not mission:
            return jsonify({"error": "Mission not found"}), 404

        mission["_id"] = str(mission["_id"])
        return jsonify(mission)

    except InvalidId:
        return jsonify({"error": "Invalid ID"}), 400


# -----------------------------
# DELETE MISSION
# -----------------------------
@app.route('/api/missions/<id>', methods=['DELETE'])
def delete_mission(id):
    try:
        result = missions_collection.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Mission not found"}), 404

        return jsonify({"status": "deleted"})

    except InvalidId:
        return jsonify({"error": "Invalid ID"}), 400


# -----------------------------
# START SERVER
# -----------------------------
if __name__ == '__main__':
    app.run(port=5000, debug=True)
