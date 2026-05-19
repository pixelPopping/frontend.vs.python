import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import CrewCard from "../components/CrewCard";

const API = "http://127.0.0.1:5000";

 function CrewDashboard() {

    const [missions, setMissions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        async function loadMissions() {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await axios.get(
                    `${API}/api/missions`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setMissions(response.data);

            } catch (error) {

                console.error(
                    error.response?.data ||
                    error.message
                );
            }
        }

        loadMissions();

    }, []);

    async function acceptMission(id) {

        try {

            const token =
                localStorage.getItem("token");

            await axios.put(
                `${API}/api/missions/${id}/accept`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setMissions((prev) =>
                prev.map((mission) =>
                    mission._id === id
                        ? {
                            ...mission,
                            status: "accepted"
                        }
                        : mission
                )
            );

            navigate(`/rocketlaunch/${id}`);

        } catch (error) {

            console.error(
                error.response?.data ||
                error.message
            );
        }
    }

    return (

        <main>

            <h1>
                Crew Dashboard
            </h1>

            {missions.map((mission) => (

                <CrewCard
                    key={mission._id}
                    mission={mission}
                    onAccept={acceptMission}
                />

            ))}

        </main>
    );
}

export default CrewDashboard;