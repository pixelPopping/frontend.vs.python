import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function CrewDashboard() {

    const [missions, setMissions] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // -----------------------------------
    // LOAD MISSIONS
    // -----------------------------------

    useEffect(() => {
        axios.get(`${API}/api/missions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setMissions(res.data));
    }, []);

    // -----------------------------------
    // ACCEPT MISSION
    // -----------------------------------

    const acceptMission = async (id) => {

        await axios.put(
            `${API}/api/missions/${id}/accept`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // 🚀 start rocket animation
        navigate(`/rocketlaunch/${id}`);
    };

    // -----------------------------------
    // UI
    // -----------------------------------

    return (
        <div className="dashboard">

            <h1>Your Missions</h1>

            {missions.map(m => (
                <div key={m._id} className="mission-card">

                    <h3>{m.title}</h3>
                    <p>{m.description}</p>

                    <p>Status: {m.status}</p>

                    {m.status !== "accepted" && (
                        <button onClick={() => acceptMission(m._id)}>
                            Accept Mission 🚀
                        </button>
                    )}

                    {m.status === "accepted" && (
                        <p>🚀 Mission in progress</p>
                    )}

                </div>
            ))}

        </div>
    );
}