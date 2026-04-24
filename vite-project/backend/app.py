from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import os

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

api = SpaceAPI()

def save_to_db(data):
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump([], f)
    with open(DB_FILE, 'r') as f:
        missions = json.load(f)
    missions.append(data)
    with open(DB_FILE, 'w') as f:
        json.dump(missions, f, indent=4)

@app.route('/api/mission-options', methods=['GET'])
def get_options():
    return jsonify({
        "astronauts": api.get_crew(),
        "rockets": api.get_rockets(),
        "launches": api.get_launches()[:20],
        "landpads": api.get_landpads()
    })

@app.route('/api/launch', methods=['POST'])
def launch():
    data = request.json
    save_to_db(data) # Slaat de missie op in missions.json
    return jsonify({
        "status": "success", 
        "message": f"Missie geregistreerd voor {data.get('captain')}!"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
