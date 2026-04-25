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
        try: return requests.get("https://spacexdata.com").json()
        except: return []

api = SpaceAPI()

def save_to_db(data):
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f: json.dump([], f)
    with open(DB_FILE, 'r') as f:
        try: missions = json.load(f)
        except: missions = []
    missions.append(data)
    with open(DB_FILE, 'w') as f: json.dump(missions, f, indent=4)

@app.route('/api/mission-options', methods=['GET'])
def get_options():
    return jsonify({
        "astronauts": api.get_crew(),
        "rockets": api.get_rockets(),
        "launches": api.get_launches()[:20],
        "landpads": api.get_landpads(),
        "launchpads": api.get_launchpads()
    })

@app.route('/api/launch', methods=['POST'])
def launch():
    data = request.json
    save_to_db(data)
    return jsonify({"status": "success", "message": "Missie succesvol opgeslagen!"})

@app.route('/api/missions', methods=['GET'])
def get_missions():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f: return jsonify(json.load(f))
    return jsonify([])

@app.route('/api/missions/<int:index>', methods=['DELETE'])
def delete_mission(index):
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f: missions = json.load(f)
        if 0 <= index < len(missions):
            missions.pop(index)
            with open(DB_FILE, 'w') as f: json.dump(missions, f, indent=4)
            return jsonify({"status": "success"})
    return jsonify({"status": "error"}), 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)
