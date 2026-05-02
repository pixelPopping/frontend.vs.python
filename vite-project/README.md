🚀 Novi‑Naut Mission Control Dashboard
Een Full‑Stack Mission Control applicatie gebouwd met React (Vite) en Python (Flask).
Met dit dashboard kunnen gebruikers ruimtemissies plannen, configureren en opslaan met live data uit de SpaceX API.

🛠️ Installatie & Setup
1. Project Initialisatie & Git
bash
git init
npm create vite@latest frontend -- --template react
cd frontend
# Verwijder App.css, index.css inhoud en standaard assets in /src
2. Dependencies Installeren
Frontend (React):

bash
npm install react-router-dom@6 react-hook-form@7 axios react-calendar
Backend (Python):

bash
pip install flask flask-cors requests
3. Project Structuur
Code
/frontend
  /src
    /assets
    /components
    /pages
/backend
  app.py
  missions.json
🚀 Project Starten
Backend starten
bash
cd backend
python app.py
Backend draait op: http://localhost:5000

Frontend starten
bash
cd frontend
npm run dev
Frontend draait op: http://localhost:5173

📖 Dashboard Functionaliteit
1. De Reisplanner (Frontend)
Datumbepaling via interactieve kalender

Crew & Rocket selectie op basis van live SpaceX API data

Mission Manifest wordt samengesteld uit alle ingevoerde gegevens

2. Het Logboek (DetailMission)
Toont alle opgeslagen missies uit de backend

Mogelijkheid om missies te verwijderen

Automatische refresh van de lijst

🛰️ Backend Architectuur (Flask)
De backend vormt de motor van de applicatie. Het is een lichte maar krachtige Flask‑API die drie hoofdtaken uitvoert:

1. API‑Gateway naar SpaceX
De backend haalt live data op uit de officiële SpaceX API en levert deze in een uniform formaat aan de frontend.
Dit zorgt ervoor dat de frontend nooit afhankelijk is van ruwe externe API‑responses.

Data die wordt opgehaald:

Rockets

Crews

Launchpads

Landpads

2. Persistent Opslaan van Missies (JSON Database)
Elke missie die via de frontend wordt aangemaakt, wordt opgeslagen in:

Code
backend/missions.json
De backend:

leest het JSON‑bestand bij elke request

voegt nieuwe missies toe met een automatisch ID

bewaart alle data permanent

verwijdert missies op basis van ID

Dit maakt de backend ideaal voor prototyping, onderwijs en kleine projecten.

3. REST‑API Endpoints
POST /api/launch
Slaat een nieuwe missie op.

Response:

json
{
  "status": "success",
  "id": 3
}
GET /api/missions
Retourneert alle opgeslagen missies.

DELETE /api/missions/<id>
Verwijdert een missie op basis van ID.

4. CORS & Veiligheid
Met flask-cors staat de backend veilige communicatie toe tussen:

Frontend: http://localhost:5173

Backend: http://localhost:5000

Alle endpoints zijn alleen binnen deze trusted omgeving toegankelijk.

5. Waarom deze Backend‑opzet werkt
Simpel & schaalbaar

Geen dataverlies

Frontend‑vriendelijke data

Veilig door CORS‑configuratie

Makkelijk uitbreidbaar naar echte databases

📂 Git Workflow
Nieuwe repo maken op GitHub

Koppelen:

bash
git remote add origin [URL]
Werken in feature branch:

bash
git checkout -b feature/mission-control
Pushen:

bash
git push origin feature/mission-control
Pull Request openen naar main

Ontwikkeld door: PixelPopping@Productions