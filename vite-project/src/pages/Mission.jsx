import { useEffect, useState } from "react";
import axios from "axios";
import MissionDetailCard from "../components/MissionDetailCard";
import './Mission.css';

const API = "http://localhost:5000";

export default function Mission() {
    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [isCaptain, setIsCaptain] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`${API}/api/missions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMissions(res.data));

        axios.get(`${API}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUsers(res.data));

        const role = localStorage.getItem("role");
        setIsCaptain(role === "captain");
    }, []);

    return (
        <main className="mission-page">
            <h1 className="unbounded">Missions</h1>

            <section className="mission-list">
                {missions.map(m => (
                    <MissionDetailCard
                        key={m._id}
                        mission={m}
                        users={users}
                        isCaptain={isCaptain}
                    />
                ))}
            </section>
        </main>
    );
}
