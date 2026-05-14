🚀 Novi-Naut Mission Control Dashboard
Full-Stack Space Mission Planner
React (Vite) • Flask • MongoDB • JWT Auth • SpaceX API
The Novi-Naut Mission Control Dashboard is a full-stack mission planning platform where captains and crew members can securely manage and participate in space missions.
The application integrates live SpaceX data through a custom Flask API gateway and stores mission data persistently in MongoDB Atlas.
The platform now includes:


JWT authentication


Role-based access control


Captain & Crew dashboards


Protected mission management


User profiles


MongoDB persistence


Secure API architecture



✨ Features
🔐 Authentication System


User registration & login


JWT authentication


Password hashing with Werkzeug


Protected routes


Persistent login via localStorage


Role-based authorization


Roles
RolePermissionsCaptainCreate, update & delete missionsCrewView assigned missions only

🛰️ Mission Planner


Interactive travel date selection


Crew assignment system


Rocket selection using live SpaceX data


Launchpad & landing pad selection


Mission manifest generation


Mission persistence in MongoDB



👨‍✈️ Captain Dashboard
Captains can:


Create missions


Edit missions


Delete missions


View owned missions


Assign crew members



👨‍🚀 Crew Dashboard
Crew members can:


View assigned missions


Access mission details


Track launch information



👤 Profile System
Authenticated users can:


View personal profile data


See assigned role


Access secure dashboard routes



📒 Mission Logbook


Secure mission overview


MongoDB persistence


Automatic UI refresh


Protected access control



🔌 Backend API Gateway
The Flask backend acts as a gateway between the frontend and the official SpaceX API.
Integrated SpaceX endpoints


Rockets


Crew


Launches


Launchpads


Landing pads



🧱 Tech Stack
Frontend


React (Vite)


React Router DOM


React Hook Form


Axios


Context API


React Calendar


JWT Decode



Backend


Flask


Flask-CORS


PyMongo


MongoDB Atlas


JWT Authentication


Werkzeug Security


Python-Dotenv


Requests



🔐 Authentication Architecture
LOGIN (JWT)    ↓AuthContext (role storage)    ↓ProtectedRoute    ↓Dashboard Access    ↓Flask JWT Middleware    ↓MongoDB Filtered Data

📂 Project Structure
/frontend  /src    /assets    /components    /context    /navigation    /pages    App.jsx/backend  app.py  .env

🛠️ Installation & Setup
1. Clone Repository
git clone <your-repository-url>

2. Frontend Setup
cd frontendnpm installnpm install react-router-domnpm install react-hook-formnpm install axiosnpm install react-calendarnpm install jwt-decode

3. Backend Setup
cd backendpip install flaskpip install flask-corspip install pymongopip install python-dotenvpip install pyjwtpip install werkzeugpip install requests

4. MongoDB Environment Variables
Create a .env file inside /backend
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/SECRET_KEY=your_super_secret_key

🚀 Running The Project
Start Backend
cd backendpython app.py
Backend runs on:
http://localhost:5000

Start Frontend
cd frontendnpm run dev
Frontend runs on:
http://localhost:5173

🔐 Security Features
JWT Authentication
Protected API routes use:
Authorization: Bearer TOKEN

Password Hashing
Passwords are securely hashed using:


Werkzeug Security



Role-Based Access Control
Backend validates:


Captain permissions


Mission ownership


Crew access rights



🧠 Backend Architecture
🔹 Flask API Gateway
The backend fetches live SpaceX data and serves it to the frontend in a controlled format.

🔹 MongoDB Persistence
Mission data is stored inside MongoDB Atlas.
Benefits:


Cloud database


ObjectId support


Flexible schemas


Persistent storage


Fast querying



🔹 REST API Endpoints
Authentication
Register
POST /api/register
Login
POST /api/login
Profile
GET /api/profile

Missions
Create Mission
POST /api/launch
Get Missions
GET /api/missions
Get Single Mission
GET /api/missions/:id
Update Mission
PUT /api/missions/:id
Delete Mission
DELETE /api/missions/:id

🧭 Frontend Routing
Public Routes


Home


Contact


Sign In


Sign Up



Protected Routes
Captain Only


Mission Planner


Captain Dashboard


Crew Only


Crew Dashboard


Authenticated Users


Profile


Saved Missions



🌱 Git Workflow
git checkout -b feature/auth-systemgit add .git commit -m "feat: implement JWT auth and mission dashboards"git push origin feature/auth-system

📸 Future Improvements


Real-time mission updates


Crew chat system


Mission analytics dashboard


Admin dashboard


Dark mode


Mission status tracking


Deployment with Docker



👨‍🚀 Developed By
PixelPopping Productions