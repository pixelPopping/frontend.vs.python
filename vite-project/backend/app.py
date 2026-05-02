from flask import Flask, jsonify, request
from flask_cors import CORS
import requests, json, os

app = Flask(__name__)
CORS(app)

DB_FILE = 'missions.json'

class SpaceAPI:
    def get_crew(self):
        try: return requests.get("https://api.spacexdata.com/v4/crew").json()
        except: return []

    def get_rockets(self):
        try: return requests.get("https://api.spacexdata.com/v4/rockets").json()
        except: return []

    def get_launches(self):
        try: return requests.get("https://api.spacexdata.com/v4/launches").json()
        except: return []

    def get_landpads(self):
        try: return requests.get("https://api.spacexdata.com/v4/landpads").json()
        except: return []

    def get_launchpads(self):
        try: return requests.get("https://api.spacexdata.com/v4/launchpads").json()
        except: return []

api = SpaceAPI()


# -----------------------------
# Helper: laad database
# -----------------------------
def load_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump([], f)
        return []

    with open(DB_FILE, 'r') as f:
        try:
            return json.load(f)
        except:
            return []


# -----------------------------
# Helper: opslaan database
# -----------------------------
def save_db(missions):
    with open(DB_FILE, 'w') as f:
        json.dump(missions, f, indent=4)


# -----------------------------
# GET mission options
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
# POST: nieuwe missie opslaan
# -----------------------------
@app.route('/api/launch', methods=['POST'])
def launch():
    data = request.json

    missions = load_db()
    missions.append(data)
    save_db(missions)

    mission_id = len(missions) - 1  # index als ID

    return jsonify({
        "status": "success",
        "id": mission_id,
        "message": "Missie succesvol opgeslagen!"
    })


# -----------------------------
# GET: alle missies
# -----------------------------
@app.route('/api/missions', methods=['GET'])
def get_missions():
    return jsonify(load_db())


# -----------------------------
# GET: één missie op ID
# -----------------------------
@app.route('/api/missions/<int:mission_id>', methods=['GET'])
def get_mission(mission_id):
    missions = load_db()

    if 0 <= mission_id < len(missions):
        return jsonify(missions[mission_id])

    return jsonify({"error": "Mission not found"}), 404


# -----------------------------
# DELETE: missie verwijderen
# -----------------------------
@app.route('/api/missions/<int:mission_id>', methods=['DELETE'])
def delete_mission(mission_id):
    missions = load_db()

    if 0 <= mission_id < len(missions):
        missions.pop(mission_id)
        save_db(missions)
        return jsonify({"status": "success"})

    return jsonify({"status": "error"}), 404


# -----------------------------
# Start server
# -----------------------------
if __name__ == '__main__':
    app.run(port=5000, debug=True)

