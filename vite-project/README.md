# 🚀 Novi-Naut Mission Control Dashboard

Een Full-Stack Mission Control applicatie gebouwd met **React (Vite)** en **Python (Flask)**. Dit dashboard stelt gebruikers in staat om ruimtereizen te plannen met behulp van live data van de SpaceX API en deze missies persistent op te slaan.

## 🛠️ Installatie & Setup

### 1. Project Initialisatie & Git
Initialiseer je lokale repository en installeer de frontend:
```bash
git init
npm create vite@latest frontend -- --template react
cd frontend
# Verwijder App.css, index.css inhoud en standaard assets in /src
```

### 2. Dependencies Installeren
**Frontend (React):**
```bash
npm install react-router-dom@6 react-hook-form@7 axios react-calendar
```

**Backend (Python):**
```bash
pip install flask flask-cors requests
```

### 3. Project Structuur
Richt je `src` map als volgt in:
- `/assets`: Afbeeldingen en media.
- `/components`: Herbruikbare componenten zoals `Navigation.jsx` en `MissionForm.jsx`.
- `/pages`: Pagina's zoals `Home.jsx`, `Mission.jsx` en `DetailMission.jsx`.

De Python backend staat in een aparte map `/backend` naast de frontend.

## 🚀 Uitvoeren van het Project

1.  **Start de Backend**:
    ```bash
    cd backend
    python app.py
    ```
    *De server draait op http://localhost:5000*

2.  **Start de Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    *De app draait op http://localhost:5173*

## 📖 Dashboard Functionaliteit

### 1. De Reisplanner (Frontend)
*   **Datumbepaling**: Selecteer een reisperiode via de interactieve kalender op de Home-pagina. Deze data wordt via de `Router State` veilig doorgegeven naar de planner.
*   **Configuratie**: Stel je crew samen en kies je raket. De opties worden live opgehaald uit de SpaceX API (Crews, Rockets, Launch- & Landpads).
*   **Lancering**: Bij verzending worden de reisdatums en formuliergegevens samengevoegd tot één compleet Mission Manifest.

### 2. De Motor (Backend)
*   **Data-brug**: Flask fungeert als tussenstation tussen de SpaceX API en de frontend.
*   **JSON Database**: Missies worden persistent opgeslagen in `missions.json`. Gegevens blijven bewaard, ook na het herstarten van de server.
*   **Beheer**: De backend verwerkt nieuwe aanvragen en voert `DELETE` operaties uit op specifieke missies in het JSON-bestand.

### 3. Het Logboek (DetailMission)
*   **Historisch Overzicht**: Een compleet archief dat alle opgeslagen missies uit de database inlaadt.
*   **Interactie**: Bevat functionaliteit om de lijst te verversen of missies definitief te verwijderen uit de database.

### 4. Technische Optimalisatie
*   **Data-integriteit**: Bundeling van datums en missiegegevens voorkomt "verweesde" data in de database.
*   **Memory Management**: Gebruik van Axios `CancelTokens` zorgt ervoor dat verzoeken worden afgebroken bij het verlaten van een pagina (unmount), wat geheugenlekken voorkomt.

## 📂 Git Workflow
1.  Maak een nieuwe repo op GitHub.
2.  Koppel lokaal: `git remote add origin [URL]`
3.  Werk in een feature branch: `git checkout -b feature/mission-control`
4.  Push wijzigingen: `git push origin feature/mission-control`
5.  Open een Pull Request op GitHub naar de `main` branch.

---
**Ontwikkeld door:** PixelPopping@Productions

