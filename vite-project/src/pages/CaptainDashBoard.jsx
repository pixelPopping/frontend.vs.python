import { useEffect, useState } from "react";
import axios from "axios";
import Mission from "../components/Mission";
import MissionForm from "../components/MissionForm";

const API = "http://localhost:5000";

export default function CaptainDashboard() {
    const [missions, setMissions] = useState([]);
    const [options, setOptions] = useState(null);
    const token = localStorage.getItem("token");

    const fetchMissions = () => {
        axios.get(`${API}/api/missions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMissions(res.data));
    };

    useEffect(() => {
        fetchMissions();

        axios.get(`${API}/api/mission-options`)
            .then(res => setOptions(res.data));
    }, []);

    const handleCreateMission = async (data) => {
        const res = await axios.post(`${API}/api/missions`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (data.assignedTo) {
            await axios.post(
                `${API}/api/missions/${res.data.id}/assign`,
                { crewId: data.assignedTo },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }

        fetchMissions();
    };

    return (
        <div>
            <MissionForm
                onSubmit={handleCreateMission}
                options={options}
            />

            <div className="mission-list">
                {missions.map(m => (
                    <Mission key={m.id} mission={m} isCaptain={true} />
                ))}
            </div>
        </div>
    );
}
