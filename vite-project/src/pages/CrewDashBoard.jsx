import { useEffect, useState } from "react";
import axios from "axios";
import Mission from "../components/Mission";

const API = "http://localhost:5000";

export default function CrewDashboard() {
    const [missions, setMissions] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get(`${API}/api/missions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMissions(res.data));
    }, []);

    return (
        <div>
            <h1>Your Missions</h1>

            <div className="mission-list">
                {missions.map(m => (
                    <Mission key={m.id} mission={m} isCaptain={false} />
                ))}
            </div>
        </div>
    );
}

