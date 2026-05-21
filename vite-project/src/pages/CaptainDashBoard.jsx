import { useEffect, useState } from "react";
import axios from "axios";
import MissionDetailCard from "../components/MissionDetailCard";
import MissionForm from "../components/MissionForm";

const API = "http://127.0.0.1:5000";

const api = axios.create({
    baseURL: API,
    headers: {
        "Content-Type": "application/json"
    }
});

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

    useEffect(() => {

        async function loadData() {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const missionsRes =
                    await api.get("/api/missions");

                setMissions(missionsRes.data);

                const usersRes =
                    await api.get("/api/users");

                setUsers(usersRes.data);

                const optionsRes =
                    await api.get("/api/mission-options");

                setOptions(optionsRes.data);

            } catch (error) {

                console.error(
                    error.response?.data ||
                    error.message
                );
            }
        }

        loadData();

    }, []);

    async function createMission(payload) {

        if (loading) return;

        setLoading(true);

        try {

            const missionData = {

                title: `${payload.city} Mission`,

                description:
                    "Generated mission from dashboard",

                launchDate: payload.departure,

                returnDate: payload.returnDate,

                rocket: payload.rocket,

                launchPad: payload.launchPad,

                landingPad: payload.landingPad,

                city: payload.city,

                crew: [
                    payload.crewMember1,
                    payload.crewMember2
                ]
            };

            const response = await api.post(
                "/api/missions",
                missionData
            );

            const refreshed =
                await api.get("/api/missions");

            setMissions(refreshed.data);

            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);

        } catch (error) {

            console.error(
                error.response?.data ||
                error.message
            );

        } finally {

            setLoading(false);
        }
    }

    async function removeMission(id) {

        try {

            await api.delete(
                `/api/missions/${id}`
            );

            setMissions((prev) =>
                prev.filter(
                    (m) => m._id !== id
                )
            );

        } catch (error) {

            console.error(
                error.response?.data ||
                error.message
            );
        }
    }

    return (
        <main className="dashboard">

            <h1 className="unbounded">
                Captain Dashboard
            </h1>

            <MissionForm
                onSubmit={createMission}
                users={users}
                options={options}
                loading={loading}
                isSuccess={isSuccess}
            />

            <section className="mission-list">

                {missions.length === 0 ? (

                    <p>No missions found</p>

                ) : (

                    missions.map(
                        (mission, index) => (

                            <MissionDetailCard
                                key={mission._id}
                                mission={mission}
                                index={index}
                                users={users}
                                isCaptain={true}
                                onDelete={removeMission}
                            />
                        )
                    )
                )}

            </section>

        </main>
    );
}