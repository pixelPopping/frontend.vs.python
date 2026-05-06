import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MissionCard from "../components/MissionCard";
import CrewManager from "../components/CrewManager";

const API = "http://localhost:5000";

function CaptainDashboard() {
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

    const deleteMission = async (id) => {
        await axios.delete(`${API}/api/missions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchMissions();
    };

    return (
        <div>
            <h1>👨‍✈️ Captain Dashboard</h1>

            {missions.map((m) => (
                <div key={m._id}>

                    <MissionCard
                        id={m._id}
                        label="Mission"
                        text={m}
                        isCaptain={true}
                        onDelete={deleteMission}
                        onEdit={(id) => console.log(id)}
                    />

                    {/* 👇 CREW MANAGEMENT */}
                    <CrewManager
                        missionId={m._id}
                        crew={m.crew}
                    />

                </div>
            ))}
        </div>
    );
}

export default CaptainDashboard;