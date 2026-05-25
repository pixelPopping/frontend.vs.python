import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CrewCard from "../components/CrewCard";
import { CrewContext } from "../context/CrewContext";

function CrewDashboard() {

     const { missions, loading, acceptMission} = useContext(CrewContext);

    // ---------------- UI ----------------
    return (

        <main className="crew-dashboard">

            <h1>
                Crew Dashboard
            </h1>

            {loading && (

                <p>
                    Loading missions...
                </p>

            )}

            {/* ---------------- EMPTY ---------------- */}

            {!loading &&
                missions.length === 0 && (

                <p>
                    No missions assigned yet 🚀
                </p>

            )}

            {/* ---------------- MISSIONS ---------------- */}

            {!loading &&
                missions.length > 0 && (

                missions.map((mission) => (

                    <CrewCard

                        key={mission._id}

                        mission={mission}

                        onAccept={acceptMission}
                    />

                ))
            )}

        </main>
    );
}

export default CrewDashboard;