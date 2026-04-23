from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

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
    return jsonify({"status": "success", "message": f"Mission registered for {data.get('captain')}"})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
