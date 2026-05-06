import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MissionCard from "../components/MissionCard";

const API = "http://localhost:5000";

function CrewDashboard() {
    const { user } = useContext(AuthContext);
    const [missions, setMissions] = useState([]);

    const token = localStorage.getItem("token");

    const fetchMissions = async () => {
        const res = await axios.get(`${API}/api/missions`, {
            headers: {
                Authorization: `Bearer ${token}`,
                userId: user.id,
                role: user.role,
            },
        });

        setMissions(res.data);
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    return (
        <div>
            <h1>👨‍🚀 Crew Dashboard</h1>

            {missions.map((m) => (
                <MissionCard
                    key={m._id}
                    id={m._id}
                    label="Mission"
                    text={m}
                    isCaptain={false}
                />
            ))}
        </div>
    );
}

export default CrewDashboard;