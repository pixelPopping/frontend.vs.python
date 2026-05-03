🚀 Novi‑Naut Mission Control Dashboard
Full‑Stack Space Mission Planner — React (Vite) • Flask • MongoDB • SpaceX API

Het Novi‑Naut Mission Control Dashboard is een interactieve full‑stack applicatie waarmee gebruikers ruimtemissies kunnen plannen, configureren en opslaan. De frontend haalt live SpaceX‑data op via een eigen Flask‑API‑gateway. Missies worden persistent opgeslagen in MongoDB.

✨ Features
🛰️ Mission Planner
Datumselectie via interactieve kalender

Crew‑selectie op basis van live SpaceX‑data

Rocket‑selectie met technische details

Launchpad & landpad keuze

Automatisch gegenereerd Mission Manifest

📒 Mission Logbook
Overzicht van alle opgeslagen missies

Missies verwijderen op basis van ID

Automatische refresh na wijzigingen

🔌 Backend API‑Gateway
Rockets

Crew

Launchpads

Landpads

Missies opslaan / ophalen / verwijderen

🧱 Tech Stack
Frontend
React (Vite)

React Router

React Hook Form

Axios

React Calendar

Backend
Python (Flask)

Flask‑CORS

Requests (SpaceX API)

MongoDB (Atlas)

PyMongo

python‑dotenv

📂 Projectstructuur
Code
/frontend
  /src
    /assets
    /components
    /pages

/backend
  app.py
  .env
🛠️ Installatie & Setup
1. Repo initialiseren
bash
git init
2. Frontend installeren
bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom react-hook-form axios react-calendar
3. Backend installeren
bash
cd backend
pip install flask flask-cors requests pymongo python-dotenv
4. MongoDB configureren
Maak een .env in /backend:

Code
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster-url>/?retryWrites=true&w=majority
DB_NAME=mission_control
🧠 Backend Architectuur (Flask + MongoDB)
🔹 SpaceX API‑Gateway
De backend haalt live data op uit de officiële SpaceX API en levert deze in een uniform formaat aan de frontend.

🔹 Persistent Opslaan van Missies
Missies worden opgeslagen in MongoDB:

Automatische ObjectId

Geen file‑locking

Makkelijk filteren & sorteren

Cloud‑based (Atlas)

🔹 REST‑API Endpoints
POST /api/launch
Slaat een nieuwe missie op.

Response:

json
{
  "status": "success",
  "id": "6650c1..."
}
GET /api/missions
Retourneert alle missies.

DELETE /api/missions/<id>
Verwijdert een missie op basis van MongoDB ObjectId.

🚀 Project starten
Backend
bash
cd backend
python app.py
Backend draait op: http://localhost:5000

Frontend
bash
cd frontend
npm run dev
Frontend draait op: http://localhost:5173

🔐 CORS & Veiligheid
De backend staat alleen requests toe vanaf:

http://localhost:5173

http://localhost:5000

🌱 Git Workflow
bash
git checkout -b feature/mission-control
git add .
git commit -m "Add mission control feature"
git push origin feature/mission-control
Open daarna een Pull Request naar main.

👨‍🚀 Ontwikkeld door
PixelPopping Productions