import { useEffect, useState } from "react";
import axios from "axios";
import MissionDetailCard from "../components/MissionDetailCard";
import MissionForm from "../components/MissionForm";

// Gebruik overal 127.0.0.1
const API = "http://127.0.0.1:5000";

// Axios instance
const api = axios.create({
    baseURL: API,
    headers: {
        "Content-Type": "application/json"
    }
});

// Voeg automatisch token toe
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default function CaptainDashboard() {

    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // -----------------------------------
    // LOAD DATA
    // -----------------------------------

    useEffect(() => {

        async function loadData() {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                // MISSIONS
                const missionsRes = await api.get("/api/missions");

                console.log("MISSIONS:", missionsRes.data);

                setMissions(missionsRes.data);

                // USERS
                const usersRes = await api.get("/api/users");

                console.log("USERS:", usersRes.data);

                setUsers(usersRes.data);

                // OPTIONS
                const optionsRes = await api.get("/api/mission-options");

                console.log("OPTIONS:", optionsRes.data);

                setOptions(optionsRes.data);

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error.response?.data || error.message
                );

            }
        }

        loadData();

    }, []);

    // -----------------------------------
    // CREATE MISSION
    // -----------------------------------

    async function createMission(payload) {

        try {

            setLoading(true);

            console.log("Creating mission:", payload);

            await api.post("/api/missions", payload);

            // Refresh missions
            const response = await api.get("/api/missions");

            setMissions(response.data);

            setIsSuccess(true);

        } catch (error) {

            console.error(
                "Create mission error:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }
    }

    // -----------------------------------
    // DELETE MISSION
    // -----------------------------------

    function removeMission(id) {

        setMissions((prev) =>
            prev.filter((mission) => mission._id !== id)
        );
    }

    // -----------------------------------
    // UI
    // -----------------------------------

    return (

        <main className="dashboard">

            <h1 className="unbounded">
                Captain Dashboard
            </h1>

            {/* CREATE MISSION */}

            <MissionForm
                onSubmit={createMission}
                options={options}
                loading={loading}
                isSuccess={isSuccess}
            />

            {/* MISSIONS */}

            <section className="mission-list">

                {missions.length === 0 ? (

                    <p>No missions found</p>

                ) : (

                    missions.map((mission) => (

                        <MissionDetailCard
                            key={mission._id}
                            mission={mission}
                            users={users}
                            isCaptain={true}
                            onDelete={removeMission}
                        />

                    ))

                )}

            </section>

        </main>
    );
}