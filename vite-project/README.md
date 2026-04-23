1. Project Initialisatie & Git
Open je terminal in de gewenste hoofdmap.
Git init: git init
Vite installatie: npm create vite@latest . -- --template react (gebruik de punt om het in de huidige map te installeren).
Schoonmaak: Verwijder App.css, index.css (inhoud) en de assets in de src map.
Eerste Commit:
bash
git add .
git commit -m "Initial commit: Vite React setup"
Wees voorzichtig met code.
2. GitHub Koppeling & Feature Branch
Maak een nieuwe repo op GitHub (zonder README).
Koppel je lokale project (vervang de URL):
bash
git remote add origin https://github.com
git branch -M main
git push -u origin main
Wees voorzichtig met code.
Feature branch maken:
bash
git checkout -b feature/mission-control
Wees voorzichtig met code.
3. Dependencies Installeren
Voer dit uit in je frontend map:
bash
npm install react-router-dom@6 react-hook-form@7 axios
Wees voorzichtig met code.
En voor je Python backend:
bash
pip install flask flask-cors requests
Wees voorzichtig met code.
4. Project Structuur (Stap 1 t/m 4)
Maak de volgende mappen aan in src:
/assets
/components (Formulier.jsx, Navigation.jsx)
/pages (Home.jsx, SignUpForm.jsx)
/context (optioneel)
Main.jsx (Stap 4):
jsx
import { BrowserRouter as Router } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
Wees voorzichtig met code.
5. Backend Koppeling (Stap 3 & 5)
Maak een map backend aan naast je src map. Zet daar je app.py in.
In je App.jsx (Stap 2):
jsx
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import SignUpForm from './pages/SignUpForm';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </>
  );
}
Wees voorzichtig met code.
6. Code opsplitsen & Styling (Stap 6 & 7)
Plaats de formulier-logica in Formulier.jsx.
Zet je CSS in Formulier.css en importeer deze in je componenten.
7. Pushen naar GitHub
Zodra je functionaliteit werkt in je feature branch:
bash
git add .
git commit -m "Add mission control form and calendar"
git push origin feature/mission-control
Wees voorzichtig met code.

