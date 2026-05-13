// Mission.jsx

import axios from "axios";

const API = "http://localhost:5000";

export default function Mission({ mission, isCaptain }) {

    const deleteMission = async () => {

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `${API}/api/missions/${mission._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            window.location.reload();

        } catch (err) {

            console.error(err);

        }
    };

    return (

        <div className="mission-card">

            <h3>{mission.title}</h3>

            <p>{mission.description}</p>

            <p>
                <strong>Launch:</strong> {mission.launchDate}
            </p>

            <p>
                <strong>Rocket:</strong> {mission.rocket}
            </p>

            <p>
                <strong>Launch Pad:</strong> {mission.launchpad}
            </p>

            <p>
                <strong>Landing Pad:</strong> {mission.landpad}
            </p>

            {/* CREW */}

            <div>

                <strong>Assigned Crew:</strong>

                {mission.crew?.length > 0 ? (

                    <ul>

                        {mission.crew.map((memberId) => (

                            <li key={memberId}>
                                👨‍🚀 {memberId}
                            </li>

                        ))}

                    </ul>

                ) : (

                    <p>
                        No crew assigned
                    </p>

                )}

            </div>

            {/* DELETE BUTTON */}

            {isCaptain && (

                <button
                    className="delete-btn"
                    onClick={deleteMission}
                >
                    ❌ Delete Mission
                </button>

            )}

        </div>
    );
}