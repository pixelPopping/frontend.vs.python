// src/pages/CaptainDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import MissionCard from "../components/MissionCard";
import "./CaptainDashboard.css";

const API = "http://localhost:5000";

function CaptainDashboard() {

    const [missions, setMissions] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    async function fetchMissions() {

        try {

            const res = await axios.get(
                `${API}/api/missions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMissions(res.data);

        } catch (err) {
            setError("Could not load missions");
        }
    }

    useEffect(() => {
        fetchMissions();
    }, []);

    async function deleteMission(id) {

        try {

            await axios.delete(
                `${API}/api/missions/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchMissions();

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="dashboard-page">

            <h1>Captain Dashboard</h1>

            {error && <p>{error}</p>}

            <section className="dashboard-grid">

                {missions.map((mission) => (

                    <MissionCard
                        key={mission._id}
                        id={mission._id}
                        label="Mission"
                        text={mission}
                        onClick={() => deleteMission(mission._id)}
                    />

                ))}

            </section>

        </main>
    );
}

export default CaptainDashboard;