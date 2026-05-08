import axios from "axios";

const API = "http://localhost:5000";

function CrewManager({ missionId, crew }) {
    const token = localStorage.getItem("token");

    const addCrew = async (userId) => {
        await axios.put(
            `${API}/api/missions/${missionId}/crew`,
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    };

    const removeCrew = async (userId) => {
        await axios.delete(
            `${API}/api/missions/${missionId}/crew`,
            {
                data: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    };

    return (
        <div className="crew-box">
            <h4>Crew</h4>

            {crew?.map((c) => (
                <div key={c}>
                    <p>👨‍🚀 {c}</p>
                    <button onClick={() => removeCrew(c)}>
                        Remove
                    </button>
                </div>
            ))}

            <button onClick={() => addCrew("USER_ID_HERE")}>
                + Add Crew
            </button>
        </div>
    );
}

export default CrewManager;